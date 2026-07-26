/*
 * ClickBand Junior — MelodicRhythmGenerator.js
 * Creates bar-safe melodic rhythms using only eighth, quarter, half and whole-note durations.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";

(function (global) {
  function choice(list) { return list[Math.floor(Math.random() * list.length)]; }
  function clone(list) { return list.slice(); }
  function signature(starts) { return starts.join("-"); }
  function phraseSignature(bars) { return bars.map(signature).join("|"); }

  function enforceMinimumSpacing(starts, requiredFinalStart) {
    var sorted = clone(starts).sort(function (a, b) { return a - b; });
    var out = [];
    for (var i = 0; i < sorted.length; i++) {
      var value = sorted[i];
      if (value < 0 || value > 15 || value % 2 !== 0) continue;
      if (!out.length || value - out[out.length - 1] >= 2) out.push(value);
    }

    if (out[0] !== 0) out.unshift(0);

    if (requiredFinalStart !== undefined && out.indexOf(requiredFinalStart) === -1) {
      while (out.length && requiredFinalStart - out[out.length - 1] < 2) out.pop();
      out.push(requiredFinalStart);
    }

    return out;
  }

  function onsetDistance(a, b) {
    var setA = {}, setB = {}, i, common = 0;
    for (i = 0; i < a.length; i++) setA[a[i]] = true;
    for (i = 0; i < b.length; i++) setB[b[i]] = true;
    for (i = 0; i < a.length; i++) if (setB[a[i]]) common++;
    return (a.length - common) + (b.length - common);
  }

  function MelodicRhythmGenerator(config) {
    config = config || {};
    this.style = String(config.style || "POP").toUpperCase();
    this.memorySize = config.memorySize || 18;
    this.storageKey = "clickband.melodicRhythmHistory.v2";

    







    this.allowedDurations = [2, 4, 8, 16];
    this.patterns = {
      sparse: [
        [0, 8], [0, 6, 12], [0, 4, 12], [0, 10], [0, 6, 10],
        [0, 4, 10], [0, 8, 12], [0, 4, 8], [0, 6, 10, 14]
      ],
      regular: [
        [0, 4, 8, 12], [0, 2, 8, 12], [0, 4, 8, 14], [0, 6, 8, 14],
        [0, 2, 6, 10, 14], [0, 4, 6, 10, 14], [0, 2, 6, 10, 12],
        [0, 4, 8, 12, 14], [0, 6, 8, 12, 14], [0, 4, 10, 12]
      ],
      syncopated: [
        [0, 2, 6, 10, 14], [0, 2, 8, 10, 14], [0, 6, 8, 12, 14],
        [0, 4, 8, 12, 14], [0, 2, 8, 12, 14], [0, 4, 8, 10, 14],
        [0, 2, 6, 10, 14], [0, 6, 10, 12, 14], [0, 4, 8, 12]
      ],
      flowing: [
        [0, 2, 6, 10, 14], [0, 4, 8, 10, 14], [0, 2, 8, 12, 14],
        [0, 4, 8, 12, 14], [0, 2, 6, 10, 14], [0, 4, 8, 12, 14]
      ]
    };
  }

  MelodicRhythmGenerator.prototype.getHistory = function () {
    try {
      var raw = global.localStorage && global.localStorage.getItem(this.storageKey);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      if (!MelodicRhythmGenerator.memory) MelodicRhythmGenerator.memory = [];
      return MelodicRhythmGenerator.memory;
    }
  };

  MelodicRhythmGenerator.prototype.saveHistory = function (history) {
    history = history.slice(-this.memorySize);
    try {
      if (global.localStorage) global.localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      MelodicRhythmGenerator.memory = history;
    }
  };

  MelodicRhythmGenerator.prototype.familiesFor = function (sectionName) {
    var section = String(sectionName || "verse").toLowerCase();
    if (section === "intro" || section === "outro") return ["sparse", "regular"];
    if (section === "chorus" || section === "only") {
      if (this.style === "DANCE") return ["flowing", "syncopated", "regular"];
      if (this.style === "FOLK") return ["regular", "flowing", "sparse"];
      return ["regular", "flowing", "syncopated"];
    }
    if (section === "bridge") return this.style === "FOLK" ? ["sparse", "regular", "syncopated"] : ["syncopated", "sparse", "regular"];
    if (this.style === "ROCK") return ["regular", "syncopated", "sparse"];
    if (this.style === "DANCE") return ["syncopated", "flowing", "regular"];
    if (this.style === "FOLK") return ["regular", "sparse", "flowing"];
    return ["regular", "sparse", "syncopated"];
  };

  MelodicRhythmGenerator.prototype.pickPattern = function (families, excluded, recentBars, isFirstBar) {
    var candidates = [], f, p, item, r, tooClose;
    for (f = 0; f < families.length; f++) {
      for (p = 0; p < this.patterns[families[f]].length; p++) {
        item = this.patterns[families[f]][p];
        if (excluded.indexOf(signature(item)) !== -1) continue;
        if (isFirstBar) {
          tooClose = false;
          for (r = 0; r < recentBars.length; r++) {
            if (onsetDistance(item, recentBars[r]) <= 2) { tooClose = true; break; }
          }
          if (tooClose) continue;
        }
        candidates.push(item);
      }
    }
    if (!candidates.length) {
      for (f = 0; f < families.length; f++) candidates = candidates.concat(this.patterns[families[f]]);
    }
    var selected = enforceMinimumSpacing(clone(choice(candidates)).filter(function (start) {
      return start <= 14;
    }));
    return selected.length ? selected : [0, 4, 8, 12];
  };

  MelodicRhythmGenerator.prototype.makeBVariation = function (starts) {
    var out = clone(starts);
    var operations = ["shift", "remove", "insert", "elongate"];
    var op = choice(operations), index, value, choices;

    if (op === "shift" && out.length > 2) {
      index = 1 + Math.floor(Math.random() * (out.length - 1));
      value = Math.max(2, Math.min(14, out[index] + choice([-2, 2])));
      if (out.indexOf(value) === -1 && Math.abs(value - out[index - 1]) >= 2 && (index === out.length - 1 || Math.abs(out[index + 1] - value) >= 2)) out[index] = value;
    } else if ((op === "remove" || op === "elongate") && out.length > 3) {
      out.splice(1 + Math.floor(Math.random() * (out.length - 1)), 1);
    } else {
      choices = [2, 4, 6, 8, 10, 12, 14].filter(function (candidate) {
        for (var i = 0; i < out.length; i++) if (Math.abs(out[i] - candidate) < 2) return false;
        return true;
      });
      if (choices.length) out.push(choice(choices));
    }

    return enforceMinimumSpacing(out);
  };

  MelodicRhythmGenerator.prototype.chooseDuration = function (start, nextStart, finalBar, closing) {
    var gap = (nextStart === undefined ? 16 : nextStart) - start;
    var allowed = this.allowedDurations.filter(function (duration) {
      return duration <= gap;
    });

    if (!allowed.length) {
      throw new Error("Spazio rhythmic not valido: " + gap + " spot.");
    }

    




    if (closing && finalBar && allowed.indexOf(gap) !== -1) return gap;

    var weighted = [];
    for (var i = 0; i < allowed.length; i++) {
      var duration = allowed[i];
      var repetitions = duration === 2 ? 4 : duration === 4 ? 4 : duration === 8 ? 2 : 1;
      for (var r = 0; r < repetitions; r++) weighted.push(duration);
    }
    return choice(weighted);
  };

  MelodicRhythmGenerator.prototype.toEvents = function (starts, finalBar) {
    var events = [];
    for (var i = 0; i < starts.length; i++) {
      var closing = !!(finalBar && i === starts.length - 1);
      events.push({
        start: starts[i],
        duration: this.chooseDuration(starts[i], starts[i + 1], finalBar, closing),
        isClosingNote: closing
      });
    }
    return events;
  };

  MelodicRhythmGenerator.prototype.generate = function (sectionName, variant) {
    var families = this.familiesFor(sectionName);
    var history = this.getHistory();
    var recentFirstBars = [], recentPhrases = [], h;
    for (h = 0; h < history.length; h++) {
      if (history[h] && Array.isArray(history[h].firstBar)) recentFirstBars.push(history[h].firstBar);
      if (history[h] && typeof history[h].phrase === "string") recentPhrases.push(history[h].phrase);
    }

    var attempt, startsByBar, used, bar, starts, closeLong, finalStarts, fullSignature;
    for (attempt = 0; attempt < 24; attempt++) {
      startsByBar = []; used = [];
      for (bar = 0; bar < 3; bar++) {
        starts = this.pickPattern(families, used, recentFirstBars, bar === 0);
        if (variant === "B") starts = this.makeBVariation(starts);
        startsByBar.push(starts);
        used.push(signature(starts));
      }

      closeLong = sectionName === "outro" || Math.random() < 0.42;
      finalStarts = closeLong ? [0] : choice([[0, 4, 8], [0, 2, 8], [0, 6, 8]]);
      if (variant === "B" && !closeLong && Math.random() < 0.5) {
        finalStarts = this.makeBVariation(finalStarts).filter(function (x) { return x <= 8; });
      }
      finalStarts = closeLong ? [0] : enforceMinimumSpacing(finalStarts, 8);
      startsByBar.push(finalStarts);

      fullSignature = phraseSignature(startsByBar);
      if (recentPhrases.indexOf(fullSignature) === -1) break;
    }

    history.push({ firstBar:startsByBar[0], phrase:fullSignature });
    this.saveHistory(history);

    return {
      family: families[0],
      signatures: startsByBar.map(signature),
      phraseSignature: fullSignature,
      bars: startsByBar.map(function (barStarts, index) {
        return this.toEvents(barStarts, index === 3);
      }, this)
    };
  };

  global.MelodicRhythmGenerator = MelodicRhythmGenerator;
})(window);
