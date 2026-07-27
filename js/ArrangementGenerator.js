/*
 * ClickBand Junior — ArrangementGenerator.js
 * Expands the theoretical song into all accessory voices while preserving relative musical data.
 * Output contract remains compatible with ArrangementGenerator version 3.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";

(function (global) {
  var VOICE_NAMES = [
    "arp", "guitar", "bass", "chromatic", "pad", "counter",
    "ostinato", "fx", "choir", "brass", "strings", "guitarLead"
  ];

  var SECTION_PROFILES = {
    intro:  { energy:0.72, accompaniment:0.84, lead:0.78 },
    verse:  { energy:0.90, accompaniment:0.94, lead:0.90 },
    chorus: { energy:1.08, accompaniment:1.05, lead:1.05 },
    bridge: { energy:0.96, accompaniment:0.98, lead:0.96 },
    outro:  { energy:0.80, accompaniment:0.86, lead:0.82 },
    solo:   { energy:1.06, accompaniment:0.94, lead:1.12 },
    only:   { energy:1.00, accompaniment:1.00, lead:1.00 }
  };

  var STYLE_ARP_PATTERNS = {
    POP:    [0,1,2,0,1,2,1,2],
    FOLK:   [0,1,2,1,0,1,2,1],
    LATIN:  [0,1,2,1,2,1,0,1],
    JAZZ:   [0,2,1,2,0,1,2,1],
    BLUES:  [0,1,2,1,0,2,1,2],
    CELTIC: [0,1,2,1,2,1,0,1]
  };

  var STYLE_OSTINATO_PATTERNS = {
    POP:    [0,0,2,2,0,0,2,2],
    FOLK:   [0,1,2,1,2,1,0,2],
    LATIN:  [0,2,1,2,0,2,1,2],
    JAZZ:   [0,1,2,1,0,2,1,2],
    BLUES:  [0,2,1,2,0,1,2,1],
    CELTIC: [0,1,2,1,0,1,2,1]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function sectionProfile(sectionName) {
    return SECTION_PROFILES[String(sectionName || "verse").toLowerCase()] || SECTION_PROFILES.verse;
  }

  function note(degree, octaveOffset, startSpot, durationSpots, dynamic, extra) {
    return Object.assign({
      degree: degree,
      octaveOffset: octaveOffset || 0,
      accidental: 0,
      startSpot: startSpot,
      durationSpots: durationSpots,
      dynamic: clamp(dynamic, 0, 1),
      articulation: "normal"
    }, extra || {});
  }

  function chordTone(chord, index) {
    if (!chord || !Array.isArray(chord.tones) || !chord.tones.length) {
      throw new ArrangementGeneratorError("Accordo privo di toni validi.");
    }
    return chord.tones[Math.max(0, Math.min(chord.tones.length - 1, index))];
  }

  function chordNotes(chord, shift) {
    return chord.tones.map(function (tone) {
      return {
        degree: tone.degree,
        octaveOffset: tone.octaveOffset + (shift || 0),
        accidental: tone.accidental || 0
      };
    });
  }

  function chordEvent(chord, start, duration, dynamic, shift, extra) {
    return Object.assign({
      startSpot: start,
      durationSpots: duration,
      dynamic: clamp(dynamic, 0, 1),
      articulation: "normal",
      notes: chordNotes(chord, shift)
    }, extra || {});
  }

  function ArrangementGeneratorError(message) {
    this.name = "ArrangementGeneratorError";
    this.message = message;
    if (Error.captureStackTrace) Error.captureStackTrace(this, ArrangementGeneratorError);
  }
  ArrangementGeneratorError.prototype = Object.create(Error.prototype);
  ArrangementGeneratorError.prototype.constructor = ArrangementGeneratorError;

  function ArrangementGenerator(config) {
    this.config = config || {};

    /*
     * Tutte le voci restano sempre previste dal contratto.
     * La selezione effettiva avviene nei moduli successivi.
     */
    this.voices = {
      arp:true, guitar:true, bass:true, chromatic:true, pad:true,
      counter:true, ostinato:true, fx:true, choir:true, brass:true,
      strings:true, guitarLead:true
    };
  }

  ArrangementGenerator.prototype.arrange = function (baseSong) {
    this.validateBase(baseSong);
    this.style = String(baseSong.metadata.style || "POP").toUpperCase();

    var snapshot = JSON.stringify(baseSong);
    var fallbackPlan = baseSong.structure.map(function (name) {
      return {
        sectionId:name,
        keyContext:{shiftSemitones:0, mode:baseSong.metadata.mode}
      };
    });

    var out = {
      version:3,
      baseSong:baseSong,
      metadata:clone(baseSong.metadata),
      theme:clone(baseSong.theme),
      structure:baseSong.structure.slice(),
      structurePlan:clone(baseSong.structurePlan || fallbackPlan),
      sections:{},
      arrangement:{voices:clone(this.voices)}
    };

    var self = this;
    Object.keys(baseSong.sections).forEach(function (name) {
      out.sections[name] = self.arrangeSection(baseSong.sections[name]);
    });

    if (JSON.stringify(baseSong) !== snapshot) {
      throw new ArrangementGeneratorError("Il brano sorgente è stato modificato durante l'arrangiamento.");
    }

    return out;
  };

  ArrangementGenerator.prototype.validateBase = function (song) {
    if (!song || song.version !== 2 || !song.sections || !song.metadata) {
      throw new ArrangementGeneratorError("Brano base non valido o versione non supportata.");
    }
    if (!Array.isArray(song.structure) || !song.structure.length) {
      throw new ArrangementGeneratorError("La struttura del brano base non è valida.");
    }

    Object.keys(song.sections).forEach(function (sectionName) {
      var section = song.sections[sectionName];
      if (!section || !Array.isArray(section.sequence) || !section.phrases) {
        throw new ArrangementGeneratorError("Sezione non valida: " + sectionName + ".");
      }
      Object.keys(section.phrases).forEach(function (variant) {
        var phrase = section.phrases[variant];
        if (!phrase || !Array.isArray(phrase.progression) || phrase.progression.length !== 4) {
          throw new ArrangementGeneratorError("Progressione non valida in " + sectionName + "_" + variant + ".");
        }
        if (!Array.isArray(phrase.notes) || !phrase.lines) {
          throw new ArrangementGeneratorError("Frase teorica non valida in " + sectionName + "_" + variant + ".");
        }
        phrase.progression.forEach(function (chord) {
          if (!chord || !Array.isArray(chord.tones) || chord.tones.length < 3) {
            throw new ArrangementGeneratorError("Accordo non valido in " + sectionName + "_" + variant + ".");
          }
        });
      });
    });

    function scan(value) {
      if (!value || typeof value !== "object") return;
      if (Object.prototype.hasOwnProperty.call(value, "midi")) {
        throw new ArrangementGeneratorError("Il brano sorgente contiene dati MIDI assoluti.");
      }
      Object.keys(value).forEach(function (key) { scan(value[key]); });
    }
    scan(song);
  };

  ArrangementGenerator.prototype.arrangeSection = function (section) {
    var out = {name:section.name, sequence:section.sequence.slice(), phrases:{}};
    for (var key in section.phrases) {
      if (Object.prototype.hasOwnProperty.call(section.phrases, key)) {
        out.phrases[key] = this.arrangePhrase(section.name, section.phrases[key]);
      }
    }
    return out;
  };

  ArrangementGenerator.prototype.arrangePhrase = function (sectionName, phrase) {
    var bars = [];
    var state = {previousBass:null, previousCounter:null};

    for (var bar = 0; bar < 4; bar++) {
      bars.push(this.arrangeBar(sectionName, phrase, bar, state));
    }
    return bars;
  };

  ArrangementGenerator.prototype.createContext = function (sectionName, phrase, bar, state) {
    var chord = phrase.progression[bar];
    var previousChord = bar > 0 ? phrase.progression[bar - 1] : null;
    var nextChord = bar < 3 ? phrase.progression[bar + 1] : null;
    var profile = sectionProfile(sectionName);

    var melody = phrase.notes.filter(function (item) {
      return item.bar === bar;
    }).map(function (item) {
      return note(
        item.degree,
        item.octaveOffset,
        item.spot,
        item.duration,
        item.dynamic,
        {
          accidental:item.accidental,
          articulation:item.articulation,
          role:item.role,
          chord:item.chord
        }
      );
    });

    return {
      sectionName:sectionName,
      phrase:phrase,
      bar:bar,
      chord:chord,
      previousChord:previousChord,
      nextChord:nextChord,
      melody:melody,
      profile:profile,
      state:state,
      root:chordTone(chord, 0),
      third:chordTone(chord, 1),
      fifth:chordTone(chord, 2),
      isFolk:this.style === "FOLK",
      isLatin:this.style === "LATIN",
      isJazz:this.style === "JAZZ",
      isBlues:this.style === "BLUES",
      isCeltic:this.style === "CELTIC"
    };
  };

  ArrangementGenerator.prototype.arrangeBar = function (sectionName, phrase, bar, state) {
    var context = this.createContext(sectionName, phrase, bar, state || {});
    var voices = {};

    voices.arp = this.generateArp(context);
    voices.bass = this.generateBass(context);
    voices.guitar = this.generateGuitar(context);

    if (!context.isFolk && (sectionName === "chorus" || sectionName === "bridge")) {
      voices.chromatic = this.generateChromatic(context);
    }

    if (!context.isFolk && !context.isLatin && !context.isJazz && !context.isCeltic) {
      voices.pad = this.generatePad(context);
    }

    voices.ostinato = this.generateOstinato(context);

    if (sectionName === "chorus" || sectionName === "bridge") {
      voices.counter = this.generateCounter(context);
    }

    if (!context.isFolk && bar === 0) {
      voices.fx = this.generateFx(context);
    }

    if (!context.isFolk && (sectionName === "chorus" || sectionName === "bridge" || sectionName === "outro")) {
      voices.choir = this.generateChoir(context);
    }

    if (!context.isFolk && sectionName === "chorus") {
      voices.brass = this.generateBrass(context);
    }

    if (sectionName === "chorus") {
      voices.strings = this.generateStrings(context);
    }

    if (sectionName === "solo") {
      voices.guitarLead = this.generateGuitarLead(context);
    }

    return {
      section:sectionName,
      variant:phrase.variant,
      barIndex:bar,
      chord:clone(context.chord),
      melody:context.melody,
      drums:this.drumEvents(phrase, bar),
      voices:voices,
      rhythmPattern:(phrase.rhythmPatterns.ids || [])[bar] || "generated"
    };
  };

  ArrangementGenerator.prototype.generateArp = function (ctx) {
    var pattern = STYLE_ARP_PATTERNS[this.style] || STYLE_ARP_PATTERNS.POP;
    var role = ctx.isFolk ? "acoustic-picking" :
      ctx.isLatin ? "piano-montuno" :
      ctx.isJazz ? "jazz-piano-voicing" :
      ctx.isBlues ? "blues-organ-riff" :
      ctx.isCeltic ? "fiddle-reel-bowing" : "pop-arpeggio";
    var articulation = ctx.isJazz ? "legato" : "short";
    var base = ctx.isFolk ? 0.40 : ctx.isLatin ? 0.48 : ctx.isJazz ? 0.40 : ctx.isBlues ? 0.38 : ctx.isCeltic ? 0.46 : 0.46;
    var dynamic = base * ctx.profile.accompaniment;
    var out = [];

    for (var i = 0; i < 8; i++) {
      var tone = chordTone(ctx.chord, pattern[i]);
      out.push(note(tone.degree, tone.octaveOffset + 1, i * 2, 2, dynamic, {
        articulation:articulation,
        role:role
      }));
    }
    return out;
  };

  ArrangementGenerator.prototype.generateBass = function (ctx) {
    var out = [];
    var pattern;

    if (ctx.isJazz) {
      pattern = [0,1,2,1];
    } else if (ctx.isLatin) {
      pattern = [0,2,2,0];
    } else {
      pattern = [0,2,0,2];
    }

    for (var i = 0; i < 4; i++) {
      var tone = chordTone(ctx.chord, pattern[i]);

      /* Avvicinamento diatonico all'accordo successivo sull'ultimo quarto. */
      if (i === 3 && ctx.nextChord && (ctx.isJazz || ctx.isLatin)) {
        var nextRoot = chordTone(ctx.nextChord, 0);
        var candidates = [ctx.root, ctx.third, ctx.fifth];
        candidates.sort(function (a, b) {
          return Math.abs(a.degree - nextRoot.degree) - Math.abs(b.degree - nextRoot.degree);
        });
        tone = candidates[0];
      }

      var role = ctx.isFolk ? "root-fifth" :
        ctx.isLatin ? "tumbao-bass" :
        ctx.isJazz ? "walking-bass" :
        ctx.isBlues ? "blues-shuffle-bass" :
        ctx.isCeltic ? "celtic-root-fifth" : "pop-bass";

      out.push(note(
        tone.degree,
        tone.octaveOffset - 2,
        i * 4,
        4,
        (ctx.sectionName === "chorus" ? 0.64 : 0.58) * ctx.profile.energy,
        {articulation:"short", role:role}
      ));
    }

    ctx.state.previousBass = out[out.length - 1];
    return out;
  };

  ArrangementGenerator.prototype.generateGuitar = function (ctx) {
    var out = [];
    var dynamic = (ctx.sectionName === "chorus" ? 0.48 : 0.42) * ctx.profile.accompaniment;

    if (ctx.isFolk) {
      out.push(note(ctx.root.degree, ctx.root.octaveOffset - 1, 0, 3, 0.42 * ctx.profile.energy, {articulation:"short", role:"boom"}));
      out.push(chordEvent(ctx.chord, 4, 2, 0.40 * ctx.profile.energy, -1));
      out.push(note(ctx.fifth.degree, ctx.fifth.octaveOffset - 1, 8, 3, 0.42 * ctx.profile.energy, {articulation:"short", role:"boom"}));
      out.push(chordEvent(ctx.chord, 12, 2, dynamic, -1));
    } else {
      var starts = ctx.isLatin ? [2,6,10,14] :
        ctx.isJazz ? [0,6,10] :
        ctx.isBlues ? [0,3,6,8,11,14] :
        ctx.isCeltic ? [0,4,8,12] : [0,4,8,12];
      var duration = ctx.isCeltic ? 3 : (ctx.isJazz || ctx.isLatin || ctx.isBlues ? 2 : 3);
      var role = ctx.isLatin ? "salsa-comping" :
        ctx.isJazz ? "freddie-green-comping" :
        ctx.isBlues ? "blues-shuffle-guitar" :
        ctx.isCeltic ? "celtic-strum" : "pop-comping";

      starts.forEach(function (start) {
        out.push(chordEvent(ctx.chord, start, duration, dynamic, -1, {
          role:role,
          articulation:"short"
        }));
      });
    }
    return out;
  };

  ArrangementGenerator.prototype.generateChromatic = function (ctx) {
    var target = ctx.nextChord ? chordTone(ctx.nextChord, 0) : ctx.root;
    return [
      note(target.degree, target.octaveOffset + 1, 12, 2, 0.34 * ctx.profile.energy, {
        accidental:-1,
        articulation:"short",
        role:"chromatic-approach"
      }),
      note(target.degree, target.octaveOffset + 1, 14, 2, 0.38 * ctx.profile.energy, {
        accidental:target.accidental || 0,
        articulation:"normal",
        role:"resolution"
      })
    ];
  };

  ArrangementGenerator.prototype.generatePad = function (ctx) {
    return [chordEvent(ctx.chord, 0, 16, 0.32 * ctx.profile.accompaniment, 0, {role:"sustained-pad"})];
  };

  ArrangementGenerator.prototype.generateOstinato = function (ctx) {
    var pattern = STYLE_OSTINATO_PATTERNS[this.style] || STYLE_OSTINATO_PATTERNS.POP;
    var role = ctx.isFolk ? "banjo-roll" :
      ctx.isLatin ? "marimba-cascara" :
      ctx.isJazz ? "vibraphone-comping" :
      ctx.isBlues ? "blues-piano-riff" :
      ctx.isCeltic ? "celtic-harp-ostinato" : "pop-ostinato";
    var articulation = ctx.isJazz ? "legato" : "short";
    var base = ctx.isFolk ? 0.42 : ctx.isLatin ? 0.44 : ctx.isJazz ? 0.30 : ctx.isBlues ? 0.32 : ctx.isCeltic ? 0.40 : 0.36;
    var out = [];

    for (var i = 0; i < 8; i++) {
      var tone = chordTone(ctx.chord, pattern[i]);
      out.push(note(tone.degree, tone.octaveOffset + 1, i * 2, 2, base * ctx.profile.accompaniment, {
        articulation:articulation,
        role:role
      }));
    }
    return out;
  };

  ArrangementGenerator.prototype.melodyActiveAt = function (melody, spot) {
    return melody.some(function (item) {
      return spot >= item.startSpot && spot < item.startSpot + item.durationSpots;
    });
  };

  ArrangementGenerator.prototype.generateCounter = function (ctx) {
    var templates = ctx.isFolk ? [[8,2,1],[12,3,2]] :
      ctx.isLatin ? [[6,2,1],[14,2,2]] :
      ctx.isJazz ? [[7,3,1],[13,3,2]] :
      ctx.isBlues ? [[6,3,1],[12,3,2]] :
      ctx.isCeltic ? [[4,2,1],[12,2,2]] : [[10,3,1]];
    var role = ctx.isFolk ? "harmonica-answer" :
      ctx.isLatin ? "flute-response" :
      ctx.isJazz ? "vibes-response" :
      ctx.isBlues ? "blues-call-response" :
      ctx.isCeltic ? "tin-whistle-response" : "counter-answer";
    var out = [];
    var self = this;

    templates.forEach(function (template) {
      var start = template[0];
      if (self.melodyActiveAt(ctx.melody, start)) start = Math.min(14, start + 2);
      var tone = chordTone(ctx.chord, template[2]);
      out.push(note(tone.degree, tone.octaveOffset + 1, start, template[1], 0.40 * ctx.profile.lead, {
        articulation:ctx.isJazz ? "legato" : (ctx.isBlues ? "bend" : "short"),
        role:role
      }));
    });

    ctx.state.previousCounter = out[out.length - 1] || null;
    return out;
  };

  ArrangementGenerator.prototype.generateFx = function (ctx) {
    return [note(ctx.root.degree, ctx.root.octaveOffset + 2, 0, 2, 0.36 * ctx.profile.energy, {role:"section-fx"})];
  };

  ArrangementGenerator.prototype.generateChoir = function (ctx) {
    var dynamic = (ctx.sectionName === "chorus" ? 0.42 : 0.35) * ctx.profile.lead;
    return ctx.melody.map(function (item) {
      return note(item.degree, item.octaveOffset + 1, item.startSpot, item.durationSpots, dynamic, {
        accidental:item.accidental,
        articulation:"legato",
        source:"melody-double"
      });
    });
  };

  ArrangementGenerator.prototype.generateBrass = function (ctx) {
    var starts = ctx.isLatin ? [0,6,12] : ctx.isJazz ? [4,12] : [0];
    var dynamics = ctx.isLatin ? [0.50,0.46,0.52] : ctx.isJazz ? [0.34,0.38] : [0.42];
    var role = ctx.isLatin ? "mambo-brass" : ctx.isJazz ? "muted-brass-answer" : "brass-accent";
    return starts.map(function (start, index) {
      return chordEvent(ctx.chord, start, 2, dynamics[index] * ctx.profile.energy, 0, {
        role:role,
        articulation:"short"
      });
    });
  };

  ArrangementGenerator.prototype.generateStrings = function (ctx) {
    var out = [];
    if (ctx.isFolk || ctx.isCeltic) {
      [0,2,4,6,8,10,12,14].forEach(function (start) {
        var tone = start % 4 === 0 ? ctx.root : ctx.fifth;
        out.push(note(tone.degree, tone.octaveOffset + 1, start, 2, (ctx.isCeltic ? 0.42 : 0.38) * ctx.profile.energy, {
          articulation:"short",
          role:ctx.isCeltic ? "fiddle-reel" : "fiddle-sawstroke"
        }));
      });
    } else {
      [2,6,10,14].forEach(function (start) {
        out.push(chordEvent(ctx.chord, start, 2, 0.33 * ctx.profile.accompaniment, 0, {role:"string-pulse"}));
      });
    }
    return out;
  };

  ArrangementGenerator.prototype.generateGuitarLead = function (ctx) {
    return ctx.melody.map(function (item) {
      return note(item.degree, item.octaveOffset + 1, item.startSpot, item.durationSpots, 0.72 * ctx.profile.lead, {
        accidental:item.accidental,
        articulation:item.articulation,
        role:"guitar-lead"
      });
    });
  };

  ArrangementGenerator.prototype.drumEvents = function (phrase, bar) {
    var map = [
      ["c", "kick", 0.72],
      ["r", "snare", 0.66],
      ["h", "closedHat", 0.45],
      ["k", "crash", 0.70]
    ];
    var out = [];
    var offset = bar * 16;

    map.forEach(function (definition) {
      var line = phrase.lines[definition[0]].slice(offset, offset + 16);
      for (var i = 0; i < 16; i++) {
        if (line.charAt(i) === "x") {
          out.push({
            instrument:definition[1],
            startSpot:i,
            durationSpots:1,
            dynamic:definition[2]
          });
        }
      }
    });
    return out;
  };

  ArrangementGenerator.prototype.flatten = function (arranged) {
    var bars = [];
    var plan = arranged.structurePlan || arranged.structure.map(function (name) {
      return {sectionId:name, keyContext:{shiftSemitones:0, mode:arranged.metadata.mode}};
    });

    plan.forEach(function (entry) {
      var section = arranged.sections[entry.sectionId];
      section.sequence.forEach(function (variant) {
        section.phrases[variant].forEach(function (bar) {
          var theoreticalBar = clone(bar);
          theoreticalBar.keyContext = clone(entry.keyContext);
          bars.push({
            section:bar.section,
            phraseRole:bar.variant,
            chord:bar.chord.symbol,
            rhythmName:bar.rhythmPattern,
            melody:bar.melody.map(function (item) {
              return {type:"note", note:item.degree, duration:item.durationSpots / 4};
            }),
            keyContext:clone(entry.keyContext),
            theoreticalBar:theoreticalBar
          });
        });
      });
    });
    return bars;
  };

  global.ArrangementGenerator = ArrangementGenerator;
})(window);
