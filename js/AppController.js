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
    improvementResult: null
  };

  function adapter() { return global.ClickBandUIAdapter || null; }
  function bridge() {
    var a=adapter();
    if (a && a.getBridge) return a.getBridge();
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
    if (v === "latin") return "LATIN";
    if (v === "jazz") return "JAZZ";
    if (v === "blues") return "BLUES";
    if (v === "celtic") return "CELTIC";
    return "POP";
  }
  function modeMap(v) { return v === "minor" ? "minor" : "major"; }
  function status(text) {
    var a=adapter();
    if (a && a.setStatus) { a.setStatus(text); return; }
    var x=el("statusText"); if (x) { x.textContent=text; x.style.display="block"; }
  }
  function nextPaint() { return new Promise(function(resolve){ requestAnimationFrame(function(){ requestAnimationFrame(resolve); }); }); }
  function uiText(it, en) { return document.documentElement.lang === "it" ? it : en; }

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
    var a=adapter();
    if (a && a.getSongConfig) return Object.freeze(a.getSongConfig());
    var b=bridge();
    return Object.freeze({
      tonic:value("tonicSelect","C4"), mode:modeMap(value("scaleModeSelect","major")),
      style:styleMap(value("styleSelect","pop")), sectionPhraseCounts:Object.freeze(sectionCounts()),
      structure:Object.freeze(b.getStructure().slice()), useTonal:true
    });
  }
  function midiSnapshot() {
    var a=adapter();
    if (a && a.getMidiConfig) return Object.freeze(a.getMidiConfig());
    return Object.freeze({bpm:number("bpmInput",120),programs:programs(),volumes:volumes(),activeTracks:activeTracks()});
  }
  function improvementSnapshot() {
    var a=adapter();
    if (a && a.getImprovementConfig) return Object.freeze(a.getImprovementConfig());
    return Object.freeze({
      enabled: checked("enableMidiHumanization", true),
      intensity: number("humanizationIntensity", 0.55)
    });
  }
  function lockUI() {
    var a=adapter();
    if (a && a.setBusy) { a.setBusy(true); return function(){ a.setBusy(false); restoreUIFromState(); }; }
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
    if (typeof global.cbSyncMp3Controls === "function" && !state.busy) global.cbSyncMp3Controls();
  }
  function clearMidiResult() {
    state.originalMidi=null;
    state.midi=null;
    state.improvementResult=null;
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

  function improveMidiIfRequested(originalMidi, improvementConfig) {
    if (!improvementConfig.enabled) {
      return Promise.resolve({
        midiBytes: originalMidi,
        engine: "disabled",
        changed: false,
        warning: null
      });
    }

    status(uiText("Sto migliorando il brano…", "Improving the song…"));
    return nextPaint().then(function () {
      var improver = new global.MidiImprover(improvementConfig);
      return improver.improve(originalMidi, function (phase, index, total) {
        status(uiText("Sto migliorando il brano…", "Improving the song…"));
      });
    });
  }

  function AppController() {}
  AppController.prototype.generateSong = async function () {
    if (state.busy) return null;
    var songConfig=songSnapshot();
    var midiConfig=midiSnapshot();
    var improvementConfig=improvementSnapshot();
    state.busy=true;
    var unlock=lockUI();
    clearMidiResult();
    try {
      status(uiText("Sto generando il brano…", "Generating the song…")); await nextPaint();
      state.canonical=new global.SongGenerator(songConfig).generate();

      status(uiText("Sto preparando gli strumenti…", "Preparing the instruments…")); await nextPaint();
      state.arranged=new global.ArrangementGenerator().arrange(state.canonical);

      status(uiText("Sto creando il MIDI…", "Creating MIDI…")); await nextPaint();
      state.originalMidi=new global.MidiGenerator(midiConfig).generate(state.arranged);

      state.improvementResult=await improveMidiIfRequested(state.originalMidi, improvementConfig);
      publishMidi(state.improvementResult.midiBytes);

      if (state.improvementResult.warning) {
        status(state.improvementResult.warning);
      } else if (state.improvementResult.changed) {
        status(uiText("Brano pronto.", "Song ready."));
      } else {
        status(uiText("Brano pronto.", "Song ready."));
      }
      return state.improvementResult.midiBytes;
    } catch(err) {
      console.error(err); clearMidiResult(); status(uiText("Errore nella generazione.", "Generation error.")); alert(uiText("Errore nella generazione: ", "Generation error: ")+err.message); throw err;
    } finally {
      state.busy=false; unlock();
    }
  };

  AppController.prototype.regenerateMidi = async function () {
    if (state.busy || !state.arranged) return null;
    var midiConfig=midiSnapshot();
    var improvementConfig=improvementSnapshot();
    state.busy=true;
    var unlock=lockUI();
    clearMidiResult();
    try {
      status(uiText("Sto rigenerando il MIDI…", "Regenerating MIDI…")); await nextPaint();
      state.originalMidi=new global.MidiGenerator(midiConfig).generate(state.arranged);

      state.improvementResult=await improveMidiIfRequested(state.originalMidi, improvementConfig);
      publishMidi(state.improvementResult.midiBytes);

      if (state.improvementResult.warning) {
        status(state.improvementResult.warning);
      } else if (state.improvementResult.changed) {
        status(uiText("MIDI pronto.", "MIDI ready."));
      } else {
        status(uiText("MIDI pronto.", "MIDI ready."));
      }
      return state.improvementResult.midiBytes;
    } catch(err) {
      console.error(err); clearMidiResult(); status(uiText("Errore nella rigenerazione.", "Regeneration error.")); alert(uiText("Errore nella rigenerazione: ", "Regeneration error: ")+err.message); throw err;
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
    getImprovementResult:function(){return state.improvementResult;},
    getAIResult:function(){return state.improvementResult;},
    isBusy:function(){return state.busy;}
  };
  global.AppController=AppController;
  document.addEventListener("DOMContentLoaded",restoreUIFromState);
})(window);
