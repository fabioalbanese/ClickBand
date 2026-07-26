/*
 * ClickBand Junior — AppController.js
 * Owns the sequential application pipeline, immutable UI snapshots and publication of final results.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";
(function (global) {
  var state = {
    busy: false,
    canonical: null,
    arranged: null,
    originalMidi: null,
    midi: null,
    aiResult: null
  };

  function bridge() {
    if (!global.ClickBandLegacyBridge) throw new Error("ClickBand UI bridge is not available.");
    return global.ClickBandLegacyBridge;
  }
  function el(id) { return document.getElementById(id); }
  function value(id, fallback) { var x=el(id); return x ? x.value : fallback; }
  function checked(id, fallback) { var x=el(id); return x ? !!x.checked : fallback; }
  function number(id, fallback) { var n=Number(value(id, fallback)); return Number.isFinite(n) ? n : fallback; }
  function styleMap(v) {
    if (v === "rock") return "ROCK";
    if (v === "disco") return "DANCE";
    if (v === "folk") return "FOLK";
    return "POP";
  }
  function modeMap(v) { return v === "minor" ? "minor" : "major"; }
  function status(text) { var x=el("statusText"); if (x) { x.textContent=text; x.style.display="block"; } }
  function nextPaint() { return new Promise(function(resolve){ requestAnimationFrame(function(){ requestAnimationFrame(resolve); }); }); }

  function sectionCounts() {
    var info=bridge().getSectionsInfo(), out={};
    Object.keys(info).forEach(function(k){ out[k]=Math.max(1,Math.ceil(info[k].bars/4)); });
    return out;
  }
  function programs() {
    function p(id,d){var x=el(id),n=x?parseInt(x.value,10):d;return Number.isInteger(n)?n:d;}
    return Object.freeze({melody:p("instrumentMelody",0),arp:p("instrumentArpeggio",4),guitar:p("instrumentGuitar",25),bass:p("instrumentBass",33),chromatic:p("instrumentChromatic",10),pad:p("instrumentPad",88),counter:p("instrumentCounter",73),ostinato:p("instrumentOstinato",12),fx:p("instrumentFX",9),choir:p("instrumentChoir",52),brass:p("instrumentBrass",61),strings:p("instrumentStrings",48),guitarLead:29});
  }
  function volumes() {
    function v(id,d){return Math.max(0,Math.min(127,Math.round(number(id,d)/200*127)));}
    return Object.freeze({melody:v("volumeMelody",125),arp:v("volumeArpeggio",85),guitar:v("volumeGuitar",80),bass:v("volumeBass",105),chromatic:v("volumeChromatic",75),pad:v("volumePad",65),counter:v("volumeCounter",75),ostinato:v("volumeOstinato",65),fx:v("volumeFX",75),drums:v("volumeDrums",95),choir:v("volumeChoir",85),brass:v("volumeBrass",85),strings:v("volumeStrings",65),guitarLead:90});
  }
  function activeTracks() {
    return Object.freeze({
      melody:true,
      arp:checked("trackArpeggio",true), guitar:checked("trackGuitar",true), bass:checked("trackBass",true),
      chromatic:checked("trackChromatic",false), drums:checked("trackDrums",true), pad:checked("trackPad",false),
      counter:checked("trackCounter",false), ostinato:checked("trackOstinato",true), fx:checked("trackFX",false),
      choir:checked("trackChoir",false), brass:checked("trackBrass",false), strings:checked("trackStrings",false),
      guitarLead:false
    });
  }
  function songSnapshot() {
    var b=bridge();
    return Object.freeze({
      tonic:value("tonicSelect","C4"), mode:modeMap(value("scaleModeSelect","major")),
      style:styleMap(value("styleSelect","pop")), sectionPhraseCounts:Object.freeze(sectionCounts()),
      structure:Object.freeze(b.getStructure().slice()), useTonal:true
    });
  }
  function midiSnapshot() {
    return Object.freeze({bpm:number("bpmInput",120),programs:programs(),volumes:volumes(),activeTracks:activeTracks()});
  }
  function aiSnapshot() {
    return Object.freeze({
      enabled: checked("enableAIImprovement", true),
      temperature: number("cbMelTemp", 0.15)
    });
  }
  function lockUI() {
    var saved=[];
    document.querySelectorAll("button,input,select,textarea").forEach(function(x){ saved.push([x,!!x.disabled]); x.disabled=true; });
    return function(){ saved.forEach(function(pair){ pair[0].disabled=pair[1]; }); restoreUIFromState(); };
  }
  function restoreUIFromState() {
    var hasSong=!!state.arranged, hasMidi=!!state.midi;
    var regen=el("regenerateMidiButton"); if(regen) regen.disabled=!hasSong||state.busy;
    var step=el("downloadStep"); if(step) step.classList.toggle("disabled",!hasMidi);
    var mp3=el("cbGenerateMp3Button"); if(mp3) mp3.disabled=!hasMidi||state.busy;
    var gen=el("generateSongButton"); if(gen) gen.disabled=state.busy;
  }
  function clearMidiResult() {
    state.originalMidi=null;
    state.midi=null;
    state.aiResult=null;
    var legacy=bridge().getSongState()||{}; legacy.midiBytes=null; bridge().setSongState(legacy);
    var step=el("downloadStep"); if(step) step.classList.add("disabled");
    if (typeof global.cbStopAll === "function") global.cbStopAll();
    if (typeof global.cbResetMp3 === "function") global.cbResetMp3();
  }
  function publishMidi(midi) {
    state.midi=midi;
    var legacy=bridge().getSongState()||{};
    legacy.canonical=state.canonical; legacy.arranged=state.arranged;
    legacy.bars=new global.ArrangementGenerator().flatten(state.arranged);
    legacy.midiBytes=midi; bridge().setSongState(legacy);
    if(typeof global.prepareMidiPlayerFromBytes==="function") global.prepareMidiPlayerFromBytes(midi,"ClickBand OOP");
    if(typeof global.printSong==="function") global.printSong();
    if(typeof global.cbResetMp3==="function") global.cbResetMp3();
    var step=el("downloadStep"); if(step) step.classList.remove("disabled");
  }

  function improveMidiIfRequested(originalMidi, aiConfig) {
    if (!aiConfig.enabled) {
      return Promise.resolve({
        midiBytes: originalMidi,
        engine: "disabled",
        changed: false,
        warning: null
      });
    }

    status("Applying AI improvement…");
    return nextPaint().then(function () {
      var improver = new global.AIImprover(aiConfig);
      return improver.improve(originalMidi, function (phase, index, total) {
        var label = phase === "drums" ? "drums" : "melody";
        status("AI improvement: " + label + " " + index + "/" + total + "…");
      });
    });
  }

  function AppController() {}
  AppController.prototype.generateSong = async function () {
    if (state.busy) return null;
    var songConfig=songSnapshot();
    var midiConfig=midiSnapshot();
    var aiConfig=aiSnapshot();
    state.busy=true;
    var unlock=lockUI();
    clearMidiResult();
    try {
      status("Generating the theoretical song…"); await nextPaint();
      state.canonical=new global.SongGenerator(songConfig).generate();

      status("Generating all theoretical voices…"); await nextPaint();
      state.arranged=new global.ArrangementGenerator().arrange(state.canonical);

      status("Rendering MIDI…"); await nextPaint();
      state.originalMidi=new global.MidiGenerator(midiConfig).generate(state.arranged);

      state.aiResult=await improveMidiIfRequested(state.originalMidi, aiConfig);
      publishMidi(state.aiResult.midiBytes);

      if (state.aiResult.warning) {
        status(state.aiResult.warning);
      } else if (state.aiResult.changed) {
        status("Generation completed. The theoretical song and AI-improved MIDI are ready.");
      } else {
        status("Generation completed. The theoretical song and original MIDI are ready.");
      }
      return state.aiResult.midiBytes;
    } catch(err) {
      console.error(err); clearMidiResult(); status("Generation error: "+err.message); alert("Generation error: "+err.message); throw err;
    } finally {
      state.busy=false; unlock();
    }
  };

  AppController.prototype.regenerateMidi = async function () {
    if (state.busy || !state.arranged) return null;
    var midiConfig=midiSnapshot();
    var aiConfig=aiSnapshot();
    state.busy=true;
    var unlock=lockUI();
    clearMidiResult();
    try {
      status("Regenerating MIDI from the theoretical song in memory…"); await nextPaint();
      state.originalMidi=new global.MidiGenerator(midiConfig).generate(state.arranged);

      state.aiResult=await improveMidiIfRequested(state.originalMidi, aiConfig);
      publishMidi(state.aiResult.midiBytes);

      if (state.aiResult.warning) {
        status(state.aiResult.warning);
      } else if (state.aiResult.changed) {
        status("MIDI regenerated and improved with AI. The theoretical song was not modified.");
      } else {
        status("Original MIDI regenerated. The theoretical song was not modified.");
      }
      return state.aiResult.midiBytes;
    } catch(err) {
      console.error(err); clearMidiResult(); status("MIDI regeneration error: "+err.message); alert("MIDI regeneration error: "+err.message); throw err;
    } finally {
      state.busy=false; unlock();
    }
  };

  var controller=new AppController();
  global.generateSong=function(){ return controller.generateSong(); };
  global.regenerateMidi=function(){ return controller.regenerateMidi(); };
  global.ClickBandEngine={
    getCanonicalSong:function(){return state.canonical;},
    getArrangedSong:function(){return state.arranged;},
    getOriginalMidi:function(){return state.originalMidi;},
    getMidi:function(){return state.midi;},
    getAIResult:function(){return state.aiResult;},
    isBusy:function(){return state.busy;}
  };
  global.AppController=AppController;
  document.addEventListener("DOMContentLoaded",restoreUIFromState);
})(window);
