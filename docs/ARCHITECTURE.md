# Architecture

## Design goal

Every class has one responsibility. Music-domain classes receive plain data and return plain data. They do not read the DOM, manipulate buttons or control playback.

## Runtime pipeline

1. `AppController` takes immutable snapshots of all relevant UI values.
2. The full interface is locked for the duration of the task.
3. `SongGenerator` creates the complete canonical theoretical song.
4. `ArrangementGenerator` creates every theoretical accessory voice.
5. `MidiGenerator` translates the arranged song into MIDI and filters only the tracks selected for execution.
6. `MidiImprover` optionally applies deterministic local humanization to MIDI bytes. Failure falls back safely to the original MIDI.
7. The controller publishes one final MIDI result to the player, download and MP3 renderer.

The only asynchronous work is UI yielding and optional MIDI humanization (a deterministic local algorithm, not AI). Core composition, arrangement and MIDI serialization remain synchronous.

## Modules

- `RhythmPatternLibrary`: style-specific abstract rhythmic patterns.
- `MelodicRhythmGenerator`: legal melodic onsets and durations inside 16-spot bars.
- `SongGenerator`: form, theme, harmony, drums, melody and local-key decisions.
- `ArrangementGenerator`: bass, arpeggio, guitar, pad, counterline, ostinato, choir, brass, strings and effects.
- `MidiGenerator`: pitch resolution, channels, programs, CC data, timing and SMF serialization.
- `MidiHumanizer`: deterministic timing, velocity and duration micro-variations, executed locally.
- `MidiImprover`: stable optional post-processing boundary and fallback policy.
- `UIRuntime`: structure builder, controls, report and MIDI preview player.
- `AudioController`: MP3 rendering and audio state machine.
- `Locale`: presentation-only localization.
- `AppController`: application lifecycle and sequential orchestration.

## Final modulation

When the form contains at least two choruses, `SongGenerator` applies a +1-semitone lift in 40% of generations. The first chorus is never lifted; the change starts on chorus 2 or, when present, chorus 3, and continues through following non-outro sections. The outro explicitly returns to `shiftSemitones: 0`. This is compositional data, not a MIDI effect.

## UI boundary contract

`AppController.js` never touches the DOM, `window.alert`, or any other
presentation API. Every HTML front end — the full UI, the kids UI, or any
future one — must set `window.ClickBandUIAdapter` before the generative
pipeline runs. This is the single, mandatory channel between markup/CSS and
the generative engine; there is no DOM fallback if it is missing or
incomplete.

Required methods (`AppController` throws a clear error if any is missing):

- `setStatus(text)` — display a status message (canonical English text; the
  adapter decides whether/how to localize it).
- `setBusy(isBusy)` — enable/disable interaction while a generation is running.
- `getBridge()` → `{ getSectionsInfo(), getStructure(), getSongState(), setSongState() }`.
- `getSongConfig()` → `{ tonic, mode, style, sectionPhraseCounts, structure, useTonal }`.
  `mode`/`style` must already be resolved to the domain identifiers the engine
  expects (e.g. `"FOLK"`, `"minor"`) — mapping a page's own control values
  (e.g. `"folk"`) into those identifiers is the adapter's job, not
  `AppController`'s.
- `getMidiConfig()` → `{ bpm, programs, volumes, activeTracks }`.
- `getImprovementConfig()` → `{ enabled, intensity }`.

Optional hooks (called only if present):

- `onStateChange({ hasSong, hasMidi, busy })` — let the page enable/disable its
  own controls after any state transition.
- `onMidiPublished(midiBytes)` — a new MIDI result is available (build a
  player, unlock downloads, refresh a debug printout, ...).
- `onMidiCleared()` — the previous MIDI result was just invalidated.
- `onError(message)` — surface an error beyond the status text (e.g. an alert).

`UIRuntime.js` implements this contract for the full UI, reusing its own
`getProgram()`/`isTrackActive()` DOM helpers and owning the `style`/`mode`
mapping. `index.kids.html` implements the same contract inline, independently
of `UIRuntime.js`, proving the contract is genuinely markup-agnostic: any page
that satisfies it can drive the same generative pipeline, regardless of its
own control layout or ids.



A small classic-script API is intentionally exposed for HTML event handlers and debugging. Music classes themselves remain independent of `window` state except for their class export.
