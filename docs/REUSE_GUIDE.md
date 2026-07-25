# Reusing ClickBand in Other Projects

This guide explains how to use ClickBand as a set of independent browser libraries rather than as a complete application.

## Design principle

ClickBand separates **composition**, **arrangement**, and **execution**:

```text
SongGenerator
  creates an abstract theoretical song
        ↓
ArrangementGenerator
  adds abstract accompaniment voices
        ↓
MidiGenerator
  converts the theoretical model to MIDI bytes
        ↓
AIImprover (optional)
  transforms the generated MIDI
```

The first two stages contain no MIDI note numbers, channels, programs, controllers or absolute pitches. This makes the theoretical model reusable in notation software, games, educational tools, browser DAWs, server-side renderers or alternative audio engines.

## Loading the libraries

ClickBand uses classic JavaScript and exposes constructors on `window`. Load dependencies before the classes that use them:

```html
<script src="js/vendor/tonal.min.js"></script>
<script src="js/RhythmPatternLibrary.js"></script>
<script src="js/MelodicRhythmGenerator.js"></script>
<script src="js/SongGenerator.js"></script>
<script src="js/ArrangementGenerator.js"></script>
<script src="js/MidiGenerator.js"></script>
```

No module loader, bundler or server is required.

## Minimal composition example

```html
<script>
  var composer = new SongGenerator({
    tonic: "C4",
    mode: "major",
    style: "POP",
    structure: ["intro", "verse", "chorus", "verse", "bridge", "chorus", "outro"]
  });

  var theoreticalSong = composer.generate();
  console.log(theoreticalSong);
</script>
```

The result is a complete theoretical song. It can be inspected, stored as JSON or passed to another renderer.

## Minimal arrangement example

```js
var arranger = new ArrangementGenerator();
var arrangedSong = arranger.arrange(theoreticalSong);

console.log(arrangedSong.sections.verse.phrases.A[0].voices);
```

`ArrangementGenerator` always creates all theoretical voices where its musical rules require them. Track switches belong to the execution stage and must not be used to remove data here.

## Minimal MIDI example

```js
var midiRenderer = new MidiGenerator({
  bpm: 118,
  ppq: 480,
  programs: {
    melody: 0,
    bass: 33,
    guitar: 25,
    pad: 88
  },
  volumes: {
    melody: 100,
    bass: 94,
    guitar: 82,
    pad: 70
  },
  activeTracks: {
    melody: true,
    bass: true,
    guitar: true,
    pad: true,
    drums: true,
    choir: false,
    brass: false
  }
});

var midiBytes = midiRenderer.generate(arrangedSong);
var blob = new Blob([midiBytes], { type: "audio/midi" });
var url = URL.createObjectURL(blob);
```

`generate()` returns a `Uint8Array` containing a complete Standard MIDI File.

## Complete reusable pipeline

```js
function createSong(options) {
  var baseSong = new SongGenerator(options.composition).generate();
  var arrangedSong = new ArrangementGenerator(options.arrangement).arrange(baseSong);
  var midiBytes = new MidiGenerator(options.midi).generate(arrangedSong);

  return {
    baseSong: baseSong,
    arrangedSong: arrangedSong,
    midiBytes: midiBytes
  };
}

var result = createSong({
  composition: {
    tonic: "A3",
    mode: "minor",
    style: "ROCK",
    structure: ["intro", "verse", "chorus", "verse", "bridge", "chorus", "outro"]
  },
  arrangement: {},
  midi: {
    bpm: 126,
    activeTracks: { melody: true, bass: true, guitar: true, drums: true }
  }
});
```

## Regenerating execution without recomposing

Store `arrangedSong`. When the user changes BPM, instruments, volumes or enabled tracks, create a new `MidiGenerator` and render the same theoretical object again:

```js
var newRenderer = new MidiGenerator({
  bpm: 132,
  programs: { melody: 81, bass: 38 },
  activeTracks: { melody: true, bass: true, drums: true, pad: false }
});

var newMidiBytes = newRenderer.generate(result.arrangedSong);
```

Do not call `SongGenerator` or `ArrangementGenerator` for execution-only changes.

## Using only selected libraries

### Rhythm generation only

```js
var rhythmGenerator = new MelodicRhythmGenerator();
var phraseRhythm = rhythmGenerator.generate("chorus", "A");
```

The returned phrase contains four bars of melodic timing events. Every melody bar begins at spot `0`, uses only durations `2`, `4`, `8` or `16`, and ends within spot `16`.

### Pattern library only

```js
var library = new RhythmPatternLibrary();
var styles = library.getStyles();
var pattern = library.buildPhrase({
  style: "POP",
  role: "kick",
  sectionName: "chorus"
});
```

### MIDI renderer only

You may construct a compatible theoretical object yourself and pass it directly to `MidiGenerator`. The required contracts are documented in `DATA_MODEL.md`.

## Extending the composition engine

### Add a new section type

1. Add the section name to `structure`.
2. Add a positive phrase count in `sectionPhraseCounts`.
3. Add any section-specific harmony, rhythm or melody rules to `SongGenerator`.
4. Add section-specific orchestration rules to `ArrangementGenerator` only when needed.

```js
var generator = new SongGenerator({
  structure: ["intro", "verse", "preChorus", "chorus", "outro"],
  sectionPhraseCounts: {
    preChorus: 1
  }
});
```

Unknown section names currently use the general-purpose generation rules as long as they have a phrase count.

### Add a new theoretical voice

1. Generate a new voice array in `ArrangementGenerator`.
2. Use theoretical note or chord events only.
3. Add the voice key to `MidiGenerator.empty()`.
4. Assign a MIDI channel in `channelFor()`.
5. Add its program, volume and active-track defaults.
6. Extend the test suite.

Example event:

```js
{
  degree: 5,
  octaveOffset: 1,
  accidental: 0,
  startSpot: 8,
  durationSpots: 4,
  dynamic: 0.68,
  articulation: "normal",
  role: "newVoice"
}
```

### Replace MIDI with another renderer

A renderer only needs to traverse the arranged model and resolve:

```text
scale degree + octave offset + accidental + local key context
```

Possible replacements include:

- Web Audio oscillators;
- sampled instruments;
- MusicXML export;
- notation engraving;
- game-engine event timelines;
- OSC messages;
- server-side audio rendering.

Do not add renderer-specific values to the theoretical song.

## Serialization and storage

Both the base and arranged songs are plain objects and can be serialized:

```js
var saved = JSON.stringify(arrangedSong);
var restored = JSON.parse(saved);
var midi = new MidiGenerator({ bpm: 120 }).generate(restored);
```

Functions, DOM nodes, blobs and MIDI byte arrays are not stored inside the theoretical model.

## Deterministic testing

The generators currently use `Math.random()`. A host project can temporarily replace it with a seeded generator during tests:

```js
var originalRandom = Math.random;
Math.random = seededRandom;
try {
  var song = new SongGenerator(config).generate();
} finally {
  Math.random = originalRandom;
}
```

Avoid replacing randomness during asynchronous UI activity.

## Integration boundaries

- `SongGenerator`: musical composition decisions.
- `ArrangementGenerator`: musical orchestration decisions.
- `MidiGenerator`: pitch resolution, MIDI channels, programs, controllers, tempo and serialization.
- `AIImprover`: optional post-processing of MIDI bytes.
- `AppController`, `UIRuntime`, `AudioController`: application UI; not required when embedding the libraries.

## Distribution and license

Project-owned source code is licensed under CC BY-NC 4.0. Reuse requires attribution to Fabio Albanese and is limited to non-commercial purposes unless separate permission is obtained. Third-party dependencies retain their own licenses.
