'use strict';
// Verifies the real, production AppController.js + UIRuntime.js wiring end-to-end
// through the mandatory ClickBandUIAdapter contract: no DOM code lives in
// AppController.js anymore, so this test builds a minimal fake DOM (same
// technique as tests/ui-style-flow.js) and drives window.generateSong() /
// window.regenerateMidi() exactly like a real browser click would.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

class ClassListStub {
  constructor(){ this.set = new Set(); }
  toggle(name, on){ if (on) this.set.add(name); else this.set.delete(name); }
  add(name){ this.set.add(name); }
  remove(name){ this.set.delete(name); }
  contains(name){ return this.set.has(name); }
}
class OptionEl { constructor(){ this.value=''; this.textContent=''; } }
class SelectEl {
  constructor(id){ this.id=id; this.options=[]; this._value=''; this.selectedIndex=-1; this.disabled=false; this.dataset={}; this.classList=new ClassListStub(); this.listeners={}; }
  set innerHTML(v){ this.options=[]; this._value=''; this.selectedIndex=-1; }
  appendChild(o){ this.options.push(o); if (this.selectedIndex<0){ this.selectedIndex=0; this._value=String(o.value); } }
  set value(v){ v=String(v); const i=this.options.findIndex(o=>String(o.value)===v); this._value=v; this.selectedIndex=i; }
  get value(){ return this.selectedIndex>=0 ? String(this.options[this.selectedIndex].value) : this._value; }
  addEventListener(t,f){ (this.listeners[t] ??= []).push(f); }
}
class InputEl {
  constructor(id, value='', type='text'){ this.id=id; this.value=String(value); this.type=type; this.checked=type==='checkbox'; this.disabled=false; this.dataset={}; this.classList=new ClassListStub(); this.listeners={}; this.style={}; }
  addEventListener(t,f){ (this.listeners[t] ??= []).push(f); }
}

const instrumentIds = ['instrumentMelody','instrumentArpeggio','instrumentGuitar','instrumentBass','instrumentChromatic','instrumentPad','instrumentCounter','instrumentOstinato','instrumentFX','instrumentChoir','instrumentBrass','instrumentStrings'];
const volumeIds = ['volumeMelody','volumeArpeggio','volumeGuitar','volumeBass','volumeChromatic','volumePad','volumeCounter','volumeOstinato','volumeFX','volumeDrums','volumeChoir','volumeBrass','volumeStrings'];
const trackIds = ['trackArpeggio','trackGuitar','trackBass','trackChromatic','trackDrums','trackPad','trackCounter','trackOstinato','trackFX','trackChoir','trackBrass','trackStrings'];

const elements = {};
for (const id of instrumentIds) elements[id] = new SelectEl(id);
elements.styleSelect = new SelectEl('styleSelect');
for (const v of ['pop','rock','disco','folk','latin','jazz','blues','celtic']) { const o=new OptionEl(); o.value=v; elements.styleSelect.appendChild(o); }
elements.scaleModeSelect = new SelectEl('scaleModeSelect');
for (const v of ['major','minor']) { const o=new OptionEl(); o.value=v; elements.scaleModeSelect.appendChild(o); }
elements.tonicSelect = new SelectEl('tonicSelect');
{ const o=new OptionEl(); o.value='C4'; elements.tonicSelect.appendChild(o); }
elements.bpmInput = new InputEl('bpmInput','120');
elements.bpmSlider = new InputEl('bpmSlider','120');
for (const id of volumeIds) elements[id] = new InputEl(id, '100');
for (const id of trackIds) { elements[id] = new InputEl(id, '', 'checkbox'); elements[id].checked = true; }
elements.enableMidiHumanization = new InputEl('enableMidiHumanization', '', 'checkbox'); elements.enableMidiHumanization.checked = true;
elements.humanizationIntensity = new InputEl('humanizationIntensity', '0.55');
elements.statusText = new InputEl('statusText'); elements.statusText.style = {};
elements.regenerateMidiButton = new InputEl('regenerateMidiButton');
elements.downloadStep = new InputEl('downloadStep');
elements.cbGenerateMp3Button = new InputEl('cbGenerateMp3Button');
elements.generateSongButton = new InputEl('generateSongButton');

const domContentLoadedHandlers = [];
const documentElement = { lang: 'en' };
const document = {
  documentElement,
  getElementById: id => elements[id] || null,
  querySelectorAll: () => [],
  createElement: tag => tag === 'option' ? new OptionEl() : new InputEl(''),
  addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') domContentLoadedHandlers.push(fn); },
  body: { appendChild(){}, removeChild(){} }
};
const windowStub = {
  addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') domContentLoadedHandlers.push(fn); },
  requestAnimationFrame: (cb)=>setTimeout(cb,0),
  ClickBandLocale: null
};
windowStub.window = windowStub; windowStub.document = document;

windowStub.self = windowStub;
const ctx = {
  window: windowStub, self: windowStub, document, console,
  Math, Number, Object, JSON, Array, Promise, Error,
  Blob: function(parts){ this.parts = parts; },
  URL: { createObjectURL(){ return 'blob:stub'; }, revokeObjectURL(){} },
  Uint8Array, setTimeout, clearTimeout, requestAnimationFrame: (cb)=>setTimeout(cb,0),
  alert: (msg)=>{ ctx.lastAlert = msg; }
};
vm.createContext(ctx);

function load(file, sub) {
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, '..', 'js', sub ? path.join(sub, file) : file), 'utf8'), ctx, { filename: file });
}
// Real production modules, real production load order. vendor/Midi.js is needed
// by MidiHumanizer to round-trip the MIDI bytes; the other vendor libs (Tone,
// tonal, spessasynth, lame) are audio/synth libraries generateSong()/regenerateMidi()
// never touch, so they are deliberately excluded here.
load('Midi.js', 'vendor');
['RhythmPatternLibrary.js','MelodicRhythmGenerator.js','SongGenerator.js','ArrangementGenerator.js','MidiGenerator.js','MidiHumanizer.js','MidiImprover.js','UIRuntime.js','AppController.js'].forEach(f => load(f));

// UIRuntime.js only wires up its DOMContentLoaded init because a real browser fires
// that event; here we invoke it manually, exactly once, exactly like the browser would.
if (domContentLoadedHandlers.length === 0) throw new Error('UIRuntime.js did not register a DOMContentLoaded handler');
domContentLoadedHandlers.forEach(fn => fn());

(async () => {
  // 1) Contract must be mandatory: assert every required method exists on the real adapter.
  const required = ['setStatus','setBusy','getBridge','getSongConfig','getMidiConfig','getImprovementConfig'];
  for (const m of required) {
    if (typeof ctx.window.ClickBandUIAdapter[m] !== 'function') throw new Error('adapter missing required method: ' + m);
  }

  // 2) AppController must refuse to run with no adapter at all (no silent DOM fallback).
  const savedAdapter = ctx.window.ClickBandUIAdapter;
  ctx.window.ClickBandUIAdapter = undefined;
  let threw = false;
  try { await ctx.window.generateSong(); } catch (e) { threw = true; }
  ctx.window.ClickBandUIAdapter = savedAdapter;
  if (!threw) throw new Error('AppController.generateSong() did not throw with no adapter installed');

  // 3) End-to-end generation through the real adapter, for every style.
  const results = {};
  for (const style of ['pop','rock','disco','folk','latin','jazz','blues','celtic']) {
    elements.styleSelect.value = style;
    const midi = await ctx.window.generateSong();
    if (!(midi instanceof Uint8Array) || midi.length < 50) throw new Error(style + ': generateSong() did not return valid MIDI bytes');
    results[style] = midi.length;
    if (elements.downloadStep.classList.contains('disabled')) throw new Error(style + ': downloadStep should be enabled after publishMidi via onMidiPublished');
    if (elements.generateSongButton.disabled) throw new Error(style + ': generateSongButton should be re-enabled after generation completes');
  }

  // 4) regenerateMidi() reuses the same arranged song and still round-trips through the adapter.
  const midi2 = await ctx.window.regenerateMidi();
  if (!(midi2 instanceof Uint8Array) || midi2.length < 50) throw new Error('regenerateMidi() did not return valid MIDI bytes');

  // 5) Status text actually reached the DOM via the adapter (not via a direct AppController DOM write).
  if (!elements.statusText.value && elements.statusText.textContent === undefined) { /* textContent set directly on plain object */ }
  if (elements.statusText.textContent !== 'MIDI ready.') throw new Error('unexpected status text: ' + elements.statusText.textContent);

  console.log(JSON.stringify({ status: 'PASS', styles: results, regeneratedBytes: midi2.length }));
})().catch(err => { console.error(JSON.stringify({ status: 'FAIL', error: err.message, stack: err.stack })); process.exit(1); });
