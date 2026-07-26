# ClickBand Theoretical Data Model

This document is the contract between composition, arrangement and rendering. Project extensions should preserve these boundaries.

## Coordinate system

- Time signature: `4/4`.
- One bar: `16` abstract spots.
- One quarter note: `4` spots.
- One eighth note: `2` spots.
- One half note: `8` spots.
- One whole note: `16` spots.
- One phrase: `4` bars or `64` spots.

Spots are theoretical units. They are converted to MIDI ticks only by `MidiGenerator` using `ppq / 4` ticks per spot.

## Base song root

Returned by `new SongGenerator(config).generate()`:

```js
{
  version: 2,
  metadata: { /* SongMetadata */ },
  theme: { /* Theme */ },
  structure: ["intro", "verse", "chorus", "outro"],
  structurePlan: [ /* StructurePlanEntry[] */ ],
  sections: {
    intro: { /* BaseSection */ },
    verse: { /* BaseSection */ },
    chorus: { /* BaseSection */ },
    outro: { /* BaseSection */ }
  }
}
```

### SongMetadata

```js
{
  tonic: "C4",                 // tonic name and octave used by renderers
  key: "C",                    // tonic pitch class
  tonicOctave: 4,
  mode: "major",               // "major" or "minor"
  style: "POP",
  timeSignature: [4, 4],
  spotsPerBar: 16,
  barsPerPhrase: 4,
  theoryEngine: "diatonic-degrees",
  scaleDegrees: [1, 2, 3, 4, 5, 6, 7],
  modulation: { /* ModulationMetadata */ }
}
```

`metadata.tonic` is global song context, not an event pitch. Events remain scale-relative.

### Theme

```js
{
  firstDegree: 1,
  shape: "generated-5",
  contour: [1, -1, 0, 2],
  A: [1, 2, 1, 1, 3],
  B: [1, 2, 1, 4, 1],
  signature: "1-2-1-1-3|1-2-1-4-1"
}
```

Themes use scale degrees only. `A` and `B` describe related thematic variants.

## Formal structure

### `structure`

An ordered list of reusable section identifiers:

```js
["intro", "verse", "chorus", "verse", "bridge", "chorus", "outro"]
```

The same section definition may appear more than once.

### StructurePlanEntry

`structurePlan` stores occurrence-specific information that cannot safely be stored on a reusable section definition:

```js
{
  sectionId: "chorus",
  occurrence: 2,
  keyContext: {
    shiftSemitones: 1,
    mode: "major"
  }
}
```

`shiftSemitones` is relative to `metadata.tonic`. It allows the final-chorus modulation while preserving reusable section material. The outro can explicitly return to `0`.

### ModulationMetadata

```js
{
  applied: true,
  probability: 0.40,
  triggerStructureIndex: 5,
  triggerChorusOccurrence: 2,
  shiftSemitones: 1,
  returnAtOutro: true
}
```

This describes the compositional decision. A renderer must not independently decide whether modulation occurs.

## BaseSection

```js
{
  name: "verse",
  phraseCount: 2,
  sequence: ["A", "B"],
  phrases: {
    A: { /* BasePhrase */ },
    B: { /* BasePhrase */ }
  }
}
```

`sequence` is the playback order of phrase definitions inside the section.

## BasePhrase

A phrase is four bars long. Its main fields are:

```js
{
  id: "verse_A",
  section: "verse",
  variant: "A",
  progression: [ /* Chord[] */ ],
  lines: {
    c: "...64 characters...",  // kick line
    r: "...64 characters...",  // snare line
    h: "...64 characters...",  // hi-hat line
    k: "...64 characters...",  // crash line
    m: "...64 characters..."   // melodic display line
  },
  melodicRhythm: [ /* MelodicRhythmEvent[] */ ],
  notes: [ /* BaseMelodyNote[] */ ]
}
```

The drum lines use `x` for an onset and `.` for an empty spot. The melodic display line is a compact diagnostic representation and should not be treated as the canonical note model.

## Chord

```js
{
  symbol: "V",
  rootDegree: 5,
  degrees: [5, 7, 2],
  quality: "major",
  inversion: 0,
  tones: [
    { degree: 5, octaveOffset: 0, accidental: 0 },
    { degree: 7, octaveOffset: 0, accidental: 0 },
    { degree: 2, octaveOffset: 1, accidental: 0 }
  ]
}
```

Chord tones are scale-relative. `octaveOffset` keeps voicing order without storing absolute pitch.

## MelodicRhythmEvent

```js
{
  bar: 0,
  spot: 0,
  duration: 4,
  isClosingNote: false
}
```

The melodic rhythm law is strict:

- every bar begins with an event at spot `0`;
- allowed durations are `2`, `4`, `8` and `16` spots only;
- starts are compatible with the eighth-note grid;
- events never overlap;
- no event ends after spot `16`;
- no event carries into the following bar.

## BaseMelodyNote

```js
{
  bar: 0,
  spot: 0,
  duration: 4,
  degree: 3,
  octaveOffset: 0,
  accidental: 0,
  dynamic: 0.72,
  articulation: "normal",
  role: "melody"
}
```

This is the melody representation used in the base song. `ArrangementGenerator` normalizes it into bar-local theoretical events.

## Arranged song root

Returned by `new ArrangementGenerator(config).arrange(baseSong)`:

```js
{
  version: 2,
  metadata: { /* cloned metadata */ },
  theme: { /* cloned theme */ },
  structure: [ /* cloned structure */ ],
  structurePlan: [ /* cloned plan */ ],
  baseSong: { /* original theoretical song */ },
  sections: {
    verse: { /* ArrangedSection */ }
  }
}
```

The original song is retained as `baseSong`. The arranged representation does not replace or mutate it.

## ArrangedSection

```js
{
  name: "verse",
  sequence: ["A", "B"],
  phrases: {
    A: [ /* four ArrangedBar objects */ ],
    B: [ /* four ArrangedBar objects */ ]
  }
}
```

## ArrangedBar

```js
{
  section: "verse",
  phraseVariant: "A",
  barIndex: 0,
  chord: { /* Chord */ },
  melody: [ /* TheoreticalNoteEvent[] */ ],
  drums: [ /* DrumEvent[] */ ],
  voices: {
    arp: [],
    bass: [],
    guitar: [],
    chromatic: [],
    pad: [],
    counter: [],
    ostinato: [],
    fx: [],
    choir: [],
    brass: [],
    strings: [],
    guitarLead: []
  }
}
```

Voice arrays may be empty when musical rules do not call for that voice in the current section. They must not be emptied because a UI checkbox is disabled.

## TheoreticalNoteEvent

Single note:

```js
{
  degree: 1,          // integer 1..7
  octaveOffset: 0,   // relative octave displacement
  accidental: 0,     // chromatic alteration in semitones
  startSpot: 0,      // bar-local offset, normally 0..15
  durationSpots: 4,
  dynamic: 0.72,     // normalized expressive value
  articulation: "normal",
  role: "bass"
}
```

Chord event:

```js
{
  notes: [
    { degree: 1, octaveOffset: 0, accidental: 0 },
    { degree: 3, octaveOffset: 0, accidental: 0 },
    { degree: 5, octaveOffset: 0, accidental: 0 }
  ],
  startSpot: 0,
  durationSpots: 8,
  dynamic: 0.60,
  articulation: "sustain",
  role: "pad"
}
```

A renderer should support either `degree` or `notes`.

## DrumEvent

```js
{
  instrument: "snare",
  startSpot: 4,
  durationSpots: 1,
  dynamic: 0.66
}
```

Current canonical drum identifiers:

```text
kick, snare, closedHat, openHat, crash, ride
```

Drums are abstract instrument roles. MIDI note numbers belong only in `MidiGenerator`.

## MIDI configuration

```js
{
  bpm: 120,
  ppq: 480,
  programs: {
    melody: 0,
    bass: 33,
    guitar: 25
  },
  volumes: {
    melody: 100,
    bass: 95,
    guitar: 85
  },
  activeTracks: {
    melody: true,
    bass: true,
    guitar: false,
    drums: true
  }
}
```

- `programs`: General MIDI program numbers, `0..127`.
- `volumes`: MIDI CC7 values, `0..127`.
- `activeTracks`: execution filter; it does not modify the theoretical song.
- `bpm` and `ppq`: serialization settings.

## Purity rules

The base and arranged theoretical models must not contain:

- MIDI note numbers;
- MIDI channels;
- General MIDI programs;
- controller values;
- absolute event timestamps in ticks or milliseconds;
- DOM nodes;
- audio objects;
- blobs or download URLs.

These values belong to renderers or application controllers.

## Forward compatibility

Consumers should:

- inspect `version`;
- ignore unknown optional properties;
- preserve unknown properties when transforming data;
- rely on canonical event fields rather than diagnostic strings;
- avoid mutating input objects unless explicitly documented.
