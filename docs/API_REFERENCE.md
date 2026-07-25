# Library API Reference

ClickBand classes are classic JavaScript constructors exposed on `window`. Only the classes in the **Core library API** section are required for composition and rendering.

## Core library API

## `RhythmPatternLibrary`

Provides reusable rhythmic patterns for percussion roles and song sections.

```js
var library = new RhythmPatternLibrary(optionalPatterns);
```

### Methods

- `getStyles()` → returns the available style identifiers.
- `getByRole(role, style)` → returns patterns matching an instrument role and style.
- `targetDensity(sectionName, barIndex)` → returns the desired density for a section/bar context.
- `buildPhrase(options)` → builds a four-bar rhythmic line.
- `validate()` → validates the pattern collection and throws on invalid data.

Typical roles are kick, snare, hi-hat and crash-related lines. Returned phrase lines use 64-character spot strings.

## `MelodicRhythmGenerator`

Creates only the timing skeleton of a four-bar melody phrase.

```js
var generator = new MelodicRhythmGenerator(optionalConfig);
var events = generator.generate("chorus", "A");
```

### `generate(sectionName, variant)`

Returns a phrase rhythm organized according to the implementation’s phrase contract. Events describe bar, spot and duration but do not choose scale degrees.

Guaranteed melodic constraints:

- four bars;
- first event at spot `0` in every bar;
- durations `2`, `4`, `8` or `16` only;
- no event beyond the current bar.

## `SongGenerator`

Creates form, reusable sections, harmony, rhythmic lines, melody and occurrence-specific key contexts.

```js
var generator = new SongGenerator(config);
var song = generator.generate();
```

### Configuration

```js
{
  tonic: "C4",
  mode: "major",
  style: "POP",
  useTonal: true,
  timeSignature: [4, 4],
  spotsPerBar: 16,
  barsPerPhrase: 4,
  rhythmSource: "library",
  melodicRhythmSource: "library",
  sectionPhraseCounts: {
    intro: 1,
    verse: 2,
    chorus: 2,
    bridge: 1,
    outro: 1
  },
  structure: ["intro", "verse", "chorus", "verse", "bridge", "chorus", "outro"]
}
```

### Public method

- `generate()` → returns the base theoretical song documented in `DATA_MODEL.md`.

Other prototype methods are implementation extension points rather than stable high-level entry points.

### Dependencies

- `RhythmPatternLibrary` when `rhythmSource` is `"library"`.
- `MelodicRhythmGenerator` when `melodicRhythmSource` is `"library"`.
- Tonal is optional. The generator can preserve degree-based behavior without it.

## `ArrangementGenerator`

Adds complete theoretical accompaniment voices to a base song.

```js
var arranger = new ArrangementGenerator(optionalConfig);
var arrangedSong = arranger.arrange(baseSong);
```

### Public methods

- `arrange(baseSong)` → validates and returns an arranged theoretical song.
- `flatten(arrangedSong)` → returns a linear bar list useful for inspection, custom renderers and analysis.

### Important behavior

- Does not inspect UI checkboxes.
- Does not assign MIDI channels or programs.
- Preserves the base theoretical song.
- Generates voices according to musical rules, even when a later renderer will disable them.

### Error

Invalid input can throw `ArrangementGeneratorError`.

## `MidiGenerator`

Translates a base or arranged theoretical song into a Standard MIDI File.

```js
var renderer = new MidiGenerator(config);
var bytes = renderer.generate(song);
```

### Configuration

```js
{
  bpm: 120,
  ppq: 480,
  programs: { melody: 0, bass: 33 },
  volumes: { melody: 100, bass: 95 },
  activeTracks: { melody: true, bass: true, drums: true }
}
```

Missing settings are merged with internal defaults.

### Public methods

- `generate(song)` → returns MIDI bytes as `Uint8Array`.
- `download(song, filename)` → browser convenience method that generates and downloads a MIDI file.
- `pitch(event, context, shift)` → resolves one theoretical event to an absolute MIDI pitch; primarily useful for custom renderer development and tests.

### Supported voice keys

```text
melody, arp, bass, guitar, chromatic, pad, counter,
ostinato, fx, drums, choir, brass, strings, guitarLead
```

### Execution behavior

- Resolves scale degree, octave offset, accidental and local semitone shift.
- Applies BPM, PPQ, programs and CC7 volume.
- Filters existing theoretical voices through `activeTracks`.
- Writes time-signature and key-signature meta events.
- Does not compose, correct or replace musical notes.

## Optional AI API

## `AIImprover`

Optional asynchronous post-processing wrapper.

```js
var improver = new AIImprover(config);
var improvedBytes = await improver.improve(midiBytes, function (progress) {
  console.log(progress);
});
```

### `improve(midiBytes, onProgress)`

- Input: MIDI bytes.
- Output: a `Promise` resolving to MIDI bytes.
- Requires the configured AI engine and its third-party dependencies.
- Must be treated as post-processing; it does not replace the theoretical model.

A host application should retain the original MIDI and use it as a fallback when AI processing fails.

## Application-only classes

The following classes support the included browser application but are not required when embedding the core library:

- `AppController`: snapshots the UI, coordinates generation tasks and publishes results.
- `UIRuntime`: builder, controls, console and browser-facing utility functions.
- `AudioController`: playback and MP3-related application behavior.
- `Locale`: English/Italian presentation strings.

These classes may access the DOM and should not be used as composition-domain dependencies.

## Script loading order

Recommended core order:

```html
<script src="js/vendor/tonal.min.js"></script>
<script src="js/RhythmPatternLibrary.js"></script>
<script src="js/MelodicRhythmGenerator.js"></script>
<script src="js/SongGenerator.js"></script>
<script src="js/ArrangementGenerator.js"></script>
<script src="js/MidiGenerator.js"></script>
```

Optional AI and application layers should be loaded afterward.

## Stability policy

For integrations, treat these as stable entry points:

```text
new SongGenerator(config).generate()
new ArrangementGenerator(config).arrange(song)
new MidiGenerator(config).generate(song)
new AIImprover(config).improve(bytes, onProgress)
```

Internal prototype methods may change between releases. Data-model changes should increment the root `version` field and be documented in the changelog.
