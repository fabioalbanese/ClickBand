/*
 * ClickBand Junior — SongGenerator.js
 * Creates the complete theoretical song: form, harmony, rhythmic lines, melody and optional final semitone modulation.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";

(function (global) {
  function choice(list) { return list[Math.floor(Math.random() * list.length)]; }
  function wrapDegree(value) { return ((Math.round(value) - 1) % 7 + 7) % 7 + 1; }
  function circularDistance(a, b) { var d = Math.abs(a - b); return Math.min(d, 7 - d); }

  var MODE_INTERVALS = { major:[0,2,4,5,7,9,11], minor:[0,2,3,5,7,8,10] };
  var ROMANS = {
    major: { I:[1,3,5,"major"], ii:[2,4,6,"minor"], iii:[3,5,7,"minor"], IV:[4,6,1,"major"], V:[5,7,2,"major"], vi:[6,1,3,"minor"] },
    minor: { i:[1,3,5,"minor"], III:[3,5,7,"major"], iv:[4,6,1,"minor"], v:[5,7,2,"minor"], VI:[6,1,3,"major"], VII:[7,2,4,"major"] }
  };
  var PROGRESSIONS = {
    major: [ ["I","V","vi","IV"], ["I","vi","IV","V"], ["I","IV","V","I"], ["I","iii","IV","V"], ["I","ii","V","I"], ["I","IV","vi","V"] ],
    minor: [ ["i","VI","III","VII"], ["i","iv","VI","v"], ["i","VII","VI","VII"], ["i","III","VII","VI"], ["i","iv","v","i"], ["i","VI","iv","v"] ]
  };

  function parseTonic(value) {
    var match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(String(value || ""));
    if (!match) throw new Error("Tonico not valido: usare un formato as C4, A3 or F#4.");
    return { name:match[1].toUpperCase()+match[2], octave:parseInt(match[3],10) };
  }


  function SongGenerator(config) {
    var defaults = {
      tonic:"C4", mode:"major", style:"POP", useTonal:true,
      timeSignature:[4,4], spotsPerBar:16, barsPerPhrase:4,
      rhythmSource:"library", melodicRhythmSource:"library",
      sectionPhraseCounts:{ intro:1, verse:2, chorus:2, bridge:1, outro:1 },
      structure:["intro","verse","chorus","verse","bridge","outro"]
    };
    config = config || {};
    this.config = {
      tonic:config.tonic || defaults.tonic,
      mode:String(config.mode || defaults.mode).toLowerCase(),
      style:String(config.style || config.rhythmStyle || defaults.style).toUpperCase(),
      useTonal:config.useTonal !== false,
      timeSignature:(config.timeSignature || defaults.timeSignature).slice(),
      spotsPerBar:config.spotsPerBar || defaults.spotsPerBar,
      barsPerPhrase:config.barsPerPhrase || defaults.barsPerPhrase,
      rhythmSource:config.rhythmSource || defaults.rhythmSource,
      melodicRhythmSource:config.melodicRhythmSource || defaults.melodicRhythmSource,
      sectionPhraseCounts:Object.assign({}, defaults.sectionPhraseCounts, config.sectionPhraseCounts || {}),
      structure:(config.structure || defaults.structure).slice()
    };
    this.tonic = parseTonic(this.config.tonic);
    this.tonalAvailable = !!(this.config.useTonal && global.Tonal && global.Tonal.Scale && global.Tonal.Note);
    this.scalePitchClasses = this.buildScalePitchClasses();
    this.CHORDS = this.buildChordDictionary();
    this.validateConfig();
  }

  SongGenerator.prototype.buildScalePitchClasses = function () {
    if (this.tonalAvailable) {
      var scale = global.Tonal.Scale.get(this.tonic.name + " " + this.config.mode);
      if (scale && scale.notes && scale.notes.length === 7) return scale.notes.slice();
    }
    return ["1","2","3","4","5","6","7"];
  };

  SongGenerator.prototype.buildChordDictionary = function () {
    var source = ROMANS[this.config.mode];
    var dictionary = {};
    for (var symbol in source) {
      var item = source[symbol], rootDegree=item[0], tones=[];
      for (var i=0;i<3;i++) {
        var degree=item[i];
        tones.push({
          degree:degree,
          octaveOffset:degree < rootDegree ? 1 : 0,
          accidental:0
        });
      }
      dictionary[symbol]={
        symbol:symbol, rootDegree:rootDegree, degrees:item.slice(0,3),
        quality:item[3], inversion:0, tones:tones
      };
    }
    return dictionary;
  };

  SongGenerator.prototype.validateConfig = function () {
    var cfg=this.config;
    if (cfg.spotsPerBar!==16 || cfg.barsPerPhrase!==4) throw new Error("The generator requires 16 spots per bar and 4 bars per phrase.");
    if (!cfg.structure.length) throw new Error("The song structure cannot be empty.");
    if (typeof RhythmPatternLibrary === "function") {
      var styles=(new RhythmPatternLibrary()).getStyles();
      if (cfg.rhythmSource === "library" && styles.indexOf(cfg.style)===-1) throw new Error("Style is not available: " + cfg.style + ".");
    }
    for (var i=0;i<cfg.structure.length;i++) {
      var name=cfg.structure[i], count=cfg.sectionPhraseCounts[name];
      if (!Number.isInteger(count) || count<=0) throw new Error("Invalid phrase count for section: " + name);
    }
  };

  SongGenerator.prototype.generate = function () {
    var theme=this.generateTheme(), sections={}, unique=[];
    for (var i=0;i<this.config.structure.length;i++) if (unique.indexOf(this.config.structure[i])===-1) unique.push(this.config.structure[i]);
    for (var j=0;j<unique.length;j++) sections[unique[j]]=this.generateSection(unique[j],this.config.sectionPhraseCounts[unique[j]],theme);
    var structurePlan=this.createStructurePlan();
    return {
      version:2,
      metadata:{
        tonic:this.config.tonic, key:this.tonic.name, tonicOctave:this.tonic.octave,
        mode:this.config.mode, style:this.config.style,
        timeSignature:this.config.timeSignature.slice(), spotsPerBar:this.config.spotsPerBar, barsPerPhrase:this.config.barsPerPhrase,
        theoryEngine:"diatonic-degrees", scaleDegrees:[1,2,3,4,5,6,7],
        modulation:structurePlan.modulation
      },
      theme:theme, structure:this.config.structure.slice(), structurePlan:structurePlan.entries, sections:sections
    };
  };

  SongGenerator.prototype.createStructurePlan = function () {
    var structure=this.config.structure.slice(), chorusIndexes=[], occurrences={}, entries=[];
    for(var i=0;i<structure.length;i++) if(structure[i]==="chorus") chorusIndexes.push(i);

    




    var applied=chorusIndexes.length>=2 && Math.random()<0.25;
    var triggerIndex=applied?chorusIndexes[chorusIndexes.length-1]:-1;

    for(i=0;i<structure.length;i++){
      var sectionId=structure[i];
      occurrences[sectionId]=(occurrences[sectionId]||0)+1;
      var shift=applied && i>=triggerIndex && sectionId!=="outro" ? 1 : 0;
      entries.push({
        sectionId:sectionId,
        occurrence:occurrences[sectionId],
        keyContext:{shiftSemitones:shift,mode:this.config.mode}
      });
    }

    return {
      entries:entries,
      modulation:{
        applied:applied,
        probability:0.25,
        triggerStructureIndex:triggerIndex,
        shiftSemitones:applied?1:0,
        returnAtOutro:applied && structure.indexOf("outro",triggerIndex)!==-1
      }
    };
  };

  SongGenerator.prototype.getThemeHistory = function () {
    try {
      var raw=global.localStorage&&global.localStorage.getItem("clickband.themeHistory.v2");
      var parsed=raw?JSON.parse(raw):[];
      return Array.isArray(parsed)?parsed:[];
    } catch(error) {
      if(!SongGenerator.themeMemory) SongGenerator.themeMemory=[];
      return SongGenerator.themeMemory;
    }
  };

  SongGenerator.prototype.saveThemeHistory = function (history) {
    history=history.slice(-16);
    try {
      if(global.localStorage) global.localStorage.setItem("clickband.themeHistory.v2",JSON.stringify(history));
    } catch(error) { SongGenerator.themeMemory=history; }
  };

  SongGenerator.prototype.generateTheme = function () {
    




    var history=this.getThemeHistory(), attempts=0, theme=null;
    while(attempts++<40){
      var first=choice([1,3,5]);
      var length=choice([4,4,5,5,6]);
      var A=[first], previousStep=0, directionRun=0;
      for(var i=1;i<length;i++){
        var options=[-2,-1,-1,0,1,1,2];
        if(directionRun>=2) options=previousStep>0?[-2,-1,-1,0,1]:[-1,0,1,1,2];
        var step=choice(options);
        if(step!==0&&previousStep!==0&&((step>0)===(previousStep>0))) directionRun++; else directionRun=step===0?0:1;
        A.push(wrapDegree(A[A.length-1]+step));
        previousStep=step;
      }

      var B=A.slice();
      var operation=choice(["cadence","invertTail","sequence","contrast"]);
      if(operation==="cadence"){
        B[B.length-1]=choice([1,3,5]);
      }else if(operation==="invertTail"&&B.length>=4){
        B[B.length-2]=wrapDegree(B[B.length-3]-(B[B.length-2]-B[B.length-3]));
        B[B.length-1]=wrapDegree(B[B.length-2]+choice([-1,1]));
      }else if(operation==="sequence"){
        var shift=choice([-2,-1,1,2]);
        for(var j=Math.floor(B.length/2);j<B.length;j++) B[j]=wrapDegree(B[j]+shift);
      }else{
        B[Math.max(1,B.length-2)]=wrapDegree(B[Math.max(1,B.length-2)]+choice([-2,2]));
        B[B.length-1]=choice([1,3,5]);
      }

      var signature=A.join("-")+"|"+B.join("-");
      if(history.indexOf(signature)===-1){
        var contour=[];for(var c=1;c<A.length;c++)contour.push(A[c]-A[c-1]);
        theme={firstDegree:first,shape:"generated-"+length,contour:contour,A:A,B:B,signature:signature};
        history.push(signature);this.saveThemeHistory(history);break;
      }
    }
    return theme||{firstDegree:1,shape:"fallback",contour:[1,1,-1],A:[1,2,3,2],B:[1,2,4,1],signature:"1-2-3-2|1-2-4-1"};
  };

  SongGenerator.prototype.generateSection = function (name,count,theme) {
    var phrases={ A:this.generatePhrase(name+"_A",name,"A",theme) };
    if (count>1) phrases.B=this.generatePhrase(name+"_B",name,"B",theme);
    var sequence=[]; for(var i=0;i<count;i++) sequence.push(i%2===0?"A":"B");
    return { name:name, phraseCount:count, sequence:sequence, phrases:phrases };
  };

  SongGenerator.prototype.generatePhrase = function (id,sectionName,variant,theme) {
    var progression=this.generateProgression(sectionName);
    var lines=this.generateRhythmicLines(sectionName,variant);
    var melodicRhythm=this.generateMelodicRhythm(sectionName,variant);
    var notes=this.generateMelody(theme,progression,melodicRhythm,sectionName);
    lines.m=this.notesToMelodicLine(notes);
    var phrase={
      id:id, variant:variant, progression:progression,
      melodicRhythmMeta:this.lastMelodicRhythmMeta || null,
      rhythmPatterns:{ ids:lines.patternIds||[], sourceLines:lines.sourceLines||[], roles:lines.patternRoles||[], densities:lines.patternDensities||[], energies:lines.patternEnergies||[], style:this.config.style, source:lines.patternIds?"library":"legacy" },
      lines:{c:lines.c,r:lines.r,h:lines.h,k:lines.k,m:lines.m}, notes:notes
    };
    this.validatePhrase(phrase); return phrase;
  };

  SongGenerator.prototype.generateProgression = function (sectionName) {
    var available=PROGRESSIONS[this.config.mode];
    if (this.config.style === "FOLK") {
      if (this.config.mode === "major") {
        if (sectionName === "bridge") available=[["vi","IV","I","V"],["IV","I","ii","V"]];
        else if (sectionName === "outro") available=[["I","IV","V","I"],["I","V","I","I"]];
        else if (sectionName === "chorus" || sectionName === "only") available=[["I","IV","V","I"],["IV","I","V","I"],["I","V","IV","I"]];
        else available=[["I","IV","I","V"],["I","V","IV","I"],["I","IV","V","I"]];
      } else {
        if (sectionName === "bridge") available=[["VI","III","VII","i"],["iv","i","VII","i"]];
        else if (sectionName === "outro") available=[["i","iv","v","i"],["i","VII","i","i"]];
        else available=[["i","iv","i","v"],["i","VII","VI","i"],["i","iv","v","i"]];
      }
    } else if (sectionName==="outro") available=this.config.mode==="major"?[["I","IV","V","I"],["I","ii","V","I"]]:[["i","iv","v","i"],["i","VI","VII","i"]];
    else if (sectionName==="bridge") available=this.config.mode==="major"?[["vi","IV","I","V"],["ii","V","iii","vi"]]:[["VI","III","VII","i"],["iv","VII","III","VI"]];
    var selected=choice(available), result=[];
    for(var i=0;i<selected.length;i++){var chord=this.CHORDS[selected[i]]; result.push({symbol:chord.symbol,rootDegree:chord.rootDegree,degrees:chord.degrees.slice(),quality:chord.quality,inversion:chord.inversion,tones:chord.tones.map(function(t){return {degree:t.degree,octaveOffset:t.octaveOffset,accidental:t.accidental};})});}
    return result;
  };

  SongGenerator.prototype.generateRhythmicLines = function (sectionName,variant) {
    if (this.config.rhythmSource==="library" && typeof RhythmPatternLibrary==="function") {
      if(!this.rhythmLibrary) this.rhythmLibrary=new RhythmPatternLibrary();
      var g=this.rhythmLibrary.buildPhrase({style:this.config.style,sectionName:sectionName,variant:variant,roles:["i","c","c","f"]});
      return {c:g.c,r:g.r,h:g.h,k:g.k,patternIds:g.patternIds,sourceLines:g.sourceLines,patternRoles:g.roles,patternDensities:g.densities,patternEnergies:g.energies};
    }
    return this.generateRhythmicLinesLegacy(sectionName,variant);
  };

  SongGenerator.prototype.generateRhythmicLinesLegacy = function (sectionName,variant) {
    var c=[],r=[],h=[],k=[], banks={A:[[0,8,11],[0,8,10],[0,6,8,11],[0,8,10,14]],B:[[0,6,8],[0,7,10],[0,8,11],[0,6,10,14]]};
    for(var bar=0;bar<4;bar++){var off=bar*16,use16=sectionName==="chorus"&&bar>=2&&Math.random()<0.45;for(var s=0;s<16;s+=use16?1:2)h.push(off+s);r.push(off+4,off+12);var kicks=banks[variant][bar];for(var j=0;j<kicks.length;j++)c.push(off+kicks[j]);}
    k.push(0);if(sectionName==="chorus"||(variant==="B"&&Math.random()<0.5))k.push(32);
    return {c:this.buildRhythmicLine(c),r:this.buildRhythmicLine(r),h:this.buildRhythmicLine(h),k:this.buildRhythmicLine(k)};
  };

  SongGenerator.prototype.generateMelodicRhythm = function (sectionName,variant) {
    if (this.config.melodicRhythmSource === "library" && typeof MelodicRhythmGenerator === "function") {
      if (!this.melodicRhythmGenerator) {
        this.melodicRhythmGenerator = new MelodicRhythmGenerator({ style:this.config.style, memorySize:10 });
      }
      var generated = this.melodicRhythmGenerator.generate(sectionName,variant);
      this.lastMelodicRhythmMeta = { source:"library", family:generated.family, signatures:generated.signatures.slice(), phraseSignature:generated.phraseSignature };
      return generated.bars;
    }

    
    var banks={A:[[0,4,8,12],[0,2,4,8,12],[0,4,6,8,12]],B:[[0,2,6,8,12],[0,4,8,10,14],[0,2,4,8,10,12]]};
    var result=[],source=banks[variant];for(var i=0;i<source.length;i++)result.push(this.startsToEvents(source[i],false));
    var close=sectionName==="outro"?16:choice([8,16]);var starts=close===16?[0]:choice([[0,4,8],[0,2,8],[0,4,6,8]]);result.push(this.startsToEvents(starts,true));
    this.lastMelodicRhythmMeta={source:"legacy"};
    return result;
  };
  SongGenerator.prototype.startsToEvents=function(starts,finalBar){var e=[];for(var i=0;i<starts.length;i++)e.push({start:starts[i],duration:(starts[i+1]!==undefined?starts[i+1]:16)-starts[i],isClosingNote:finalBar&&i===starts.length-1});return e;};

  SongGenerator.prototype.generateMelody = function (theme,progression,rhythm,sectionName) {
    var notes=[],prevDegree=null,prevRelativePitch=null;
    for(var pair=0;pair<2;pair++){
      var guide=pair===0?theme.A:theme.B, attacks=[],bars=[pair*2,pair*2+1];
      for(var b=0;b<bars.length;b++){var bar=bars[b];for(var e=0;e<rhythm[bar].length;e++){var ev=rhythm[bar][e];attacks.push({bar:bar,start:ev.start,duration:ev.duration,isClosingNote:ev.isClosingNote});}}
      var targets=this.interpolateTheme(guide,attacks.length);
      for(var i=0;i<attacks.length;i++){
        var a=attacks[i],chord=progression[a.bar],next=progression[a.bar+1]||null;
        var degree=this.chooseDegree(targets[i],chord,next,prevDegree,a.start%4===0,a.isClosingNote,sectionName);
        var placement=this.placeDegreeRelative(degree,prevRelativePitch);
        notes.push({
          bar:a.bar, spot:a.start, duration:a.duration, degree:degree,
          octaveOffset:placement.octaveOffset, accidental:0,
          dynamic:sectionName==="chorus"?0.78:0.70, articulation:"normal",
          role:chord.degrees.indexOf(degree)!==-1?"chord-tone":(a.start%4===0?"accented-not-chord-tone":"passing-tone"),
          chord:chord.symbol
        });
        prevDegree=degree;prevRelativePitch=placement.relativePitch;
      }
    }
    return notes;
  };

  





  SongGenerator.prototype.placeDegreeRelative = function(degree,previousRelativePitch){
    var interval=MODE_INTERVALS[this.config.mode][degree-1];
    var base=interval;
    var candidates=[
      {octaveOffset:-1,relativePitch:base-12},
      {octaveOffset:0, relativePitch:base},
      {octaveOffset:1, relativePitch:base+12}
    ];
    if(previousRelativePitch===null)return candidates[1];
    candidates.sort(function(a,b){
      return Math.abs(a.relativePitch-previousRelativePitch)-Math.abs(b.relativePitch-previousRelativePitch);
    });
    return candidates[0];
  };

  SongGenerator.prototype.chooseDegree = function (target,chord,nextChord,previousDegree,strong,closing,sectionName) {
    var candidates=[];
    for(var degree=1;degree<=7;degree++){
      var score=circularDistance(degree,target)*1.3;
      score+=strong?(chord.degrees.indexOf(degree)!==-1?-2.8:2.5):(chord.degrees.indexOf(degree)!==-1?-0.8:0.2);
      if(previousDegree!==null){var movement=circularDistance(degree,previousDegree);score+=movement*0.55;if(movement>=3)score+=1.5;}
      if(nextChord){var min=99;for(var i=0;i<nextChord.degrees.length;i++)min=Math.min(min,circularDistance(degree,nextChord.degrees[i]));score+=min*0.25;}
      if(closing){var preferred=sectionName==="bridge"?[5,2]:[1,3,5];score+=preferred.indexOf(degree)!==-1?-3.5:1.2;}
      if(this.config.style === "FOLK") {
        if ([1,2,3,5,6].indexOf(degree) !== -1) score -= 0.35;
        if (strong && chord.degrees.indexOf(degree) !== -1) score -= 0.55;
        if (previousDegree !== null && circularDistance(degree,previousDegree) <= 1) score -= 0.30;
        if (degree === 7) score += 0.45;
      }
      score+=Math.random()*0.7;candidates.push({degree:degree,score:score});
    }
    candidates.sort(function(a,b){return a.score-b.score;});return candidates[0].degree;
  };


  SongGenerator.prototype.interpolateTheme=function(theme,count){if(count<=1)return[theme[0]];var v=[];for(var i=0;i<count;i++){var pos=i*(theme.length-1)/(count-1),l=Math.floor(pos),r=Math.min(theme.length-1,l+1),a=pos-l;v.push(theme[l]*(1-a)+theme[r]*a);}return v;};
  SongGenerator.prototype.notesToMelodicLine=function(notes){var bars=[],i;for(var b=0;b<4;b++){var bar=[];for(i=0;i<16;i++)bar.push(null);bars.push(bar);}for(var n=0;n<notes.length;n++){var note=notes[n];bars[note.bar][note.spot]=String(note.degree);for(i=1;i<note.duration;i++)bars[note.bar][note.spot+i]="-";}var line="";for(var b2=0;b2<4;b2++)for(i=0;i<16;i++)line+=bars[b2][i]===null?"p":bars[b2][i];return line;};
  SongGenerator.prototype.buildRhythmicLine=function(onsets){var line=[];for(var i=0;i<64;i++)line.push(".");for(var j=0;j<onsets.length;j++)line[onsets[j]]="x";return line.join("");};
  SongGenerator.prototype.validatePhrase=function(phrase){
    var names=["c","r","h","k","m"];
    for(var i=0;i<names.length;i++)if(phrase.lines[names[i]].length!==64)throw new Error(phrase.id+": linea "+names[i]+" not valida.");
    for(var bar=0;bar<4;bar++)if(!/[1-7]/.test(phrase.lines.m.charAt(bar*16)))throw new Error(phrase.id+": bar "+(bar+1)+" does not start with a note.");
    var final=[];for(var n=0;n<phrase.notes.length;n++)if(phrase.notes[n].bar===3)final.push(phrase.notes[n]);
    var last=final[final.length-1];if(!last||(last.duration!==8&&last.duration!==16))throw new Error(phrase.id+": the phrase does not end with a half note or whole note.");
    for(var q=0;q<phrase.notes.length;q++){var nn=phrase.notes[q];if(nn.degree<1||nn.degree>7||!Number.isInteger(nn.octaveOffset)||!Number.isInteger(nn.accidental))throw new Error(phrase.id+": event theoretical not valido.");}
  };

  global.SongGenerator=SongGenerator;
})(window);
