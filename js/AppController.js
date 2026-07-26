/*
 * ClickBand Junior — AppController.js
 * Owns the sequential application pipeline, immutable snapshots and publication of final results.
 *
 * Architectural rule: this module never touches the DOM, `window.alert`, or any
 * other browser/presentation API directly. Every piece of information that
 * depends on a specific HTML page (control values, status display, button
 * enablement, post-generation UI hooks) crosses a single, mandatory boundary:
 * `window.ClickBandUIAdapter`. Any HTML/CSS front end — the full UI, the kids
 * UI, or a future one — must implement that contract; this file only calls it.
 *
 * Required adapter methods (throws a clear error if missing):
 *   setStatus(text)                 — display a status message (canonical English text)
 *   setBusy(isBusy)                 — enable/disable interaction while generating
 *   getBridge()                     -> { getSectionsInfo(), getStructure(), getSongState(), setSongState() }
 *   getSongConfig()                 -> { tonic, mode, style, sectionPhraseCounts, structure, useTonal }
 *                                      (mode/style already resolved to domain identifiers, e.g. "FOLK"/"minor")
 *   getMidiConfig()                 -> { bpm, programs, volumes, activeTracks }
 *   getImprovementConfig()          -> { enabled, intensity }
 *
 * Optional adapter hooks (called only if present, otherwise silently skipped):
 *   onStateChange({hasSong, hasMidi, busy}) — let the UI enable/disable its own controls
 *   onMidiPublished(midiBytes)               — a new MIDI result is available (build a player, unlock downloads, ...)
 *   onMidiCleared()                          — the previous MIDI result was just invalidated
 *   onError(message)                         — surface an error beyond the status text (e.g. an alert)
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

  function adapter() {
    var a = global.ClickBandUIAdapter;
    if (!a) throw new Error("ClickBand UI adapter is not available. Every front end must set window.ClickBandUIAdapter before AppController runs.");
    return a;
  }
  function requireMethod(name) {
    var fn = adapter()[name];
    if (typeof fn !== "function") throw new Error("ClickBand UI adapter does not implement " + name + "().");
    return fn;
  }
  function callOptional(name, arg) {
    var a = adapter();
    if (typeof a[name] === "function") a[name](arg);
  }

  function bridge() { return requireMethod("getBridge").call(adapter()); }
  function status(text) { requireMethod("setStatus").call(adapter(), text); }
  function nextPaint() { return new Promise(function(resolve){ requestAnimationFrame(function(){ requestAnimationFrame(resolve); }); }); }

  function songSnapshot() { return Object.freeze(requireMethod("getSongConfig").call(adapter())); }
  function midiSnapshot() { return Object.freeze(requireMethod("getMidiConfig").call(adapter())); }
  function improvementSnapshot() { return Object.freeze(requireMethod("getImprovementConfig").call(adapter())); }

  function lockUI() {
    requireMethod("setBusy").call(adapter(), true);
    return function () {
      adapter().setBusy(false);
      notifyState();
    };
  }
  function notifyState() {
    callOptional("onStateChange", {
      hasSong: !!state.arranged,
      hasMidi: !!state.midi,
      busy: state.busy
    });
  }
  function clearMidiResult() {
    state.originalMidi = null;
    state.midi = null;
    state.improvementResult = null;
    var legacy = bridge().getSongState() || {};
    legacy.midiBytes = null;
    bridge().setSongState(legacy);
    callOptional("onMidiCleared");
  }
  function publishMidi(midi) {
    state.midi = midi;
    var legacy = bridge().getSongState() || {};
    legacy.canonical = state.canonical;
    legacy.arranged = state.arranged;
    legacy.bars = new global.ArrangementGenerator().flatten(state.arranged);
    legacy.midiBytes = midi;
    bridge().setSongState(legacy);
    callOptional("onMidiPublished", midi);
    notifyState();
  }
  function reportError(message) {
    status(message);
    callOptional("onError", message);
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

    status("Improving the song…");
    return nextPaint().then(function () {
      var improver = new global.MidiImprover(improvementConfig);
      return improver.improve(originalMidi, function (phase, index, total) {
        status("Improving the song…");
      });
    });
  }

  function AppController() {}
  AppController.prototype.generateSong = async function () {
    if (state.busy) return null;
    var songConfig = songSnapshot();
    var midiConfig = midiSnapshot();
    var improvementConfig = improvementSnapshot();
    state.busy = true;
    var unlock = lockUI();
    clearMidiResult();
    try {
      status("Generating the song…"); await nextPaint();
      state.canonical = new global.SongGenerator(songConfig).generate();

      status("Preparing the instruments…"); await nextPaint();
      state.arranged = new global.ArrangementGenerator().arrange(state.canonical);

      status("Creating MIDI…"); await nextPaint();
      state.originalMidi = new global.MidiGenerator(midiConfig).generate(state.arranged);

      state.improvementResult = await improveMidiIfRequested(state.originalMidi, improvementConfig);
      publishMidi(state.improvementResult.midiBytes);

      status(state.improvementResult.warning || "Song ready.");
      return state.improvementResult.midiBytes;
    } catch (err) {
      console.error(err);
      clearMidiResult();
      reportError("Generation error: " + err.message);
      throw err;
    } finally {
      state.busy = false; unlock();
    }
  };

  AppController.prototype.regenerateMidi = async function () {
    if (state.busy || !state.arranged) return null;
    var midiConfig = midiSnapshot();
    var improvementConfig = improvementSnapshot();
    state.busy = true;
    var unlock = lockUI();
    clearMidiResult();
    try {
      status("Regenerating MIDI…"); await nextPaint();
      state.originalMidi = new global.MidiGenerator(midiConfig).generate(state.arranged);

      state.improvementResult = await improveMidiIfRequested(state.originalMidi, improvementConfig);
      publishMidi(state.improvementResult.midiBytes);

      status(state.improvementResult.warning || "MIDI ready.");
      return state.improvementResult.midiBytes;
    } catch (err) {
      console.error(err);
      clearMidiResult();
      reportError("Regeneration error: " + err.message);
      throw err;
    } finally {
      state.busy = false; unlock();
    }
  };

  var controller = new AppController();
  global.generateSong = function () { return controller.generateSong(); };
  global.regenerateMidi = function () { return controller.regenerateMidi(); };
  global.ClickBandEngine = {
    getCanonicalSong: function () { return state.canonical; },
    getArrangedSong: function () { return state.arranged; },
    getOriginalMidi: function () { return state.originalMidi; },
    getMidi: function () { return state.midi; },
    getImprovementResult: function () { return state.improvementResult; },
    getAIResult: function () { return state.improvementResult; },
    isBusy: function () { return state.busy; }
  };
  global.AppController = AppController;
  global.ClickBandNotifyState = notifyState;
})(window);
