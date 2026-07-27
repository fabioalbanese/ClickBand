# ClickBand Junior — International Production Release

ClickBand Junior is a browser-only generative music application written in classic JavaScript. It creates a complete theoretical song, expands it into an arrangement, renders Standard MIDI, optionally applies deterministic local MIDI humanization, and can export MP3 audio locally.

**Author:** Fabio Albanese  
**License:** CC BY-NC 4.0 — attribution required, non-commercial use only.

## Live demo

Try ClickBand online:

[Open the live demo](https://www.scuolaclick.it/clickband_demo)

## Languages

- `index.html`: English application.
- `index.it.html`: Italian application.
- English is the canonical language of source code, APIs, identifiers, comments and tests.
- Italian presentation strings are isolated in `js/Locale.js` and the Italian HTML entry point.
- Documentation is supplied in English and Italian.

## Run locally

1. Extract the complete archive.
2. Open `index.html` for English or `index.it.html` for Italian.
3. Choose style, tonic, mode, BPM, form and active tracks.
4. Select **Generate song**.
5. Use **Regenerate MIDI** to change execution settings without recomposing the theoretical song.

No server, package manager, bundler, framework or network connection is required for the normal local workflow.

## Generation pipeline

```text
Immutable UI snapshot
        ↓
SongGenerator
  form + harmony + rhythm + melody + optional final modulation
        ↓
ArrangementGenerator
  complete theoretical accessory voices
        ↓
MidiGenerator
  local key contexts + selected tracks + instruments + levels + BPM
        ↓
MidiImprover and MidiHumanizer (optional, fully local)
        ↓
Player / MIDI download / MP3 renderer
```

MIDI regeneration starts from the arranged theoretical song already held in memory. It never calls `SongGenerator` or `ArrangementGenerator` again.


## Reusing the libraries

ClickBand can be embedded without its UI. Start with:

- [`docs/REUSE_GUIDE.md`](docs/REUSE_GUIDE.md) — integration examples and extension recipes;
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) — public constructors, methods and configuration;
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — complete theoretical and arranged data contracts;
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — ownership and pipeline boundaries;
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — contribution and release rules.

## Repository structure

```text
index.html              English UI
index.it.html           Italian UI
js/                     project-owned runtime modules
js/vendor/              third-party browser libraries
docs/                   bilingual architecture and development documentation
tests/core-smoke.js     deterministic core smoke test
LICENSE                 project license
THIRD_PARTY_NOTICES.md  dependency notices
```

## Test

With Node.js installed:

```bash
node tests/core-smoke.js
```

The test validates theoretical-data purity, melodic rhythm constraints, bar boundaries, arrangement generation, MIDI creation and track filtering.

## License boundary

Project-owned code is licensed under CC BY-NC 4.0. Third-party libraries and the soundfont retain their own licenses. Read `LICENSE` and `THIRD_PARTY_NOTICES.md` before redistribution.


- Latin / Salsa: syncopated percussion, piano montuno, tumbao bass, brass hits and call-and-response phrasing.
- Jazz / Swing: ride-driven swing, walking acoustic bass, piano and guitar comping, tenor sax melody and muted-brass responses.


### New styles
Blues and Celtic / Irish Folk are available as complete compositional styles. Folk/Country now uses Fiddle, Violin and Banjo as requested.

---

# Project presentation

## Two interfaces, one composition engine

ClickBand exposes the same musical engine through two different user experiences.

### Kids interface

The Kids interface is deliberately restricted, visual and immediate. It allows children to create music without confronting them with the full technical parameter set.

Users can choose a musical style, mood, speed, song sections and band configuration through a guided interface. Those simple decisions are translated into a complete configuration for the shared composition engine.

Entry points:

- `index.kids.html` — English Kids interface;
- `index.kids.it.html` — Italian Kids interface.

### Full parametric interface

The full interface exposes detailed control over composition and execution. It is intended for teachers, musicians, developers and curious users who want to explore how changing one parameter affects the generated song.

Depending on the current release, it can expose controls such as:

- style;
- tonic and mode;
- tempo;
- song form and section counts;
- active tracks;
- General MIDI instruments;
- individual track levels;
- MIDI humanization and intensity;
- playback, transposition and export options;
- MIDI regeneration without recomposing the theoretical song.

Entry points:

- `index.html` — English full interface;
- `index.it.html` — Italian full interface.

Both interfaces implement the same `ClickBandUIAdapter` contract and drive the same `AppController` and generation pipeline. The interface can therefore change without changing the musical core.

```text
Kids UI ───────┐
               ├── ClickBandUIAdapter
Full UI ───────┘          ↓
                    AppController
                          ↓
                 shared music engine
```

---

## What ClickBand generates

A ClickBand song is not assembled from prerecorded loops. The system creates a theoretical composition containing:

- a song form;
- section occurrences and phrase variants;
- a thematic identity;
- harmonic progressions;
- melodic rhythm;
- a main melody;
- drum patterns;
- arranged accessory voices;
- local key contexts and optional structural modulation;
- MIDI performance information.

The final MIDI can contain separate tracks for melody, bass, drums, arpeggio, guitar, pad, countermelody, ostinato, chromatic material, effects, choir, brass, strings and lead guitar. Track selection belongs to the realization stage: the arrangement model can retain a broad set of voices while the user decides which ones are rendered.

---

## How a song is created

ClickBand works as a chain of specialized modules. Each module receives structured data from the previous stage and has a limited, explicit responsibility.

```text
User choices
     ↓
Song structure and local key plan
     ↓
Theme and harmonic progressions
     ↓
Melodic rhythm
     ↓
Main melody
     ↓
Arrangement of accessory voices
     ↓
Standard MIDI generation
     ↓
Optional deterministic humanization
     ↓
Playback / MIDI download / local MP3 rendering
```

### 1. Initial musical choices

The process starts from a configuration containing values such as tonic, mode, style, tempo and form. The full interface exposes many of these parameters directly; the Kids interface derives them from a smaller set of visual choices.

These settings define the musical context. They do not directly produce notes.

### 2. Form and section plan

The song is organized into sections such as intro, verse, chorus, bridge and outro. Section names may occur more than once, allowing the same musical identity to return with controlled variation.

A structure plan also carries the local key context of each occurrence. This allows ClickBand to describe transformations such as a final semitone lift without rewriting the whole theoretical model as fixed MIDI notes.

### 3. Theme generation

The thematic material is represented through scale degrees rather than absolute pitches. For example:

```text
1 – 3 – 5 – 4
```

means different notes in different keys while preserving the same melodic relationship.

The theme provides recognizable material for the melody. Variants can transform parts of the theme instead of generating every phrase as unrelated content. Recent signatures are remembered to reduce immediate repetition.

### 4. Harmony

Chord progressions are also represented relatively, using scale degrees and Roman-numeral functions. A progression such as:

```text
I – V – vi – IV
```

can therefore be reused in any compatible key.

Progression selection depends on mode, style and section role. Harmony acts as a structural constraint for melody and arrangement rather than as a fixed list of MIDI pitches.

### 5. Melodic rhythm

Before choosing pitch, ClickBand decides **when** notes begin and **how long** they last.

The melodic-rhythm module works on a sixteen-position bar grid and uses controlled rhythmic families such as sparse, regular, syncopated and flowing. It validates spacing, bar boundaries and phrase closure.

Dense central bars may also contain a deliberately protected rest. This is not merely a deleted note: the silence is treated as a phrase boundary, and the previous note is prevented from extending through it. The result can behave like a musical comma between a motive and its response.

### 6. Melody construction

The main melody emerges from the interaction of:

- thematic targets;
- rhythmic attacks;
- the current chord;
- the following chord;
- the previous melodic note;
- metrical strength;
- section function;
- stylistic preferences;
- cadence rules and register limits.

For each attack, candidate scale degrees are evaluated. Strong positions generally prefer harmonic stability, while weaker positions can support passing movement. The system also controls repetition, interval size, direction and octave placement.

The resulting melody follows musical constraints without becoming a rigid copy of the initial theme.

### 7. Arrangement

`ArrangementGenerator` expands the canonical song into a complete theoretical arrangement. Each voice follows rules appropriate to its musical role.

Examples include:

- bass movement derived from chord roots and fifths;
- arpeggios built from chord tones;
- pads sustaining the harmonic field;
- guitar patterns varying by style;
- countermelodies entering where the main melody leaves space;
- chromatic approaches preparing a following chord;
- strings, brass and choir supporting selected sections;
- drums shaped by style, density and formal position.

The arrangement remains theoretical: notes are still represented by degrees, octave offsets and accidentals rather than final MIDI numbers.

### 8. MIDI generation

`MidiGenerator` translates the theoretical representation into a Standard MIDI File.

For each note it combines:

```text
MIDI tonic
+ scale-degree interval
+ octave displacement
+ accidental
+ local-key shift
```

It also creates:

- separate MIDI tracks and channels;
- General MIDI program changes;
- track volumes;
- Note On and Note Off events;
- tempo and time-signature metadata;
- key-signature events when the structural context changes.

The generator can work from either the canonical song or the full arranged song.

### 9. Optional deterministic humanization

A perfectly quantized MIDI performance can sound mechanical. ClickBand can therefore apply a small local humanization pass to timing, velocity and duration.

The humanizer treats tracks differently:

- structural drum hits are protected;
- important melodic attacks are protected;
- accompaniment chords remain grouped;
- sustained parts receive subtler timing variation;
- changes remain small enough to preserve the composition.

Humanization is deterministic: the same source and seed produce the same result. If the optional stage is unavailable or fails, `MidiImprover` preserves the original MIDI instead of interrupting the pipeline.

---

## Composition and realization are separate

One of ClickBand's central architectural ideas is the distinction between the song and its performance settings.

```text
Composition parameters
→ form, harmony, theme, rhythm and melody

Arrangement parameters
→ accessory musical voices

MIDI parameters
→ instruments, active tracks, levels and tempo realization

Humanization parameters
→ small performance variations
```

The full interface can regenerate MIDI from the arranged theoretical song already held in memory. Changing an instrument, volume or active track does not require ClickBand to compose a new song.

This separation makes experimentation easier and keeps the musical model independent from a particular sound assignment.

---

## Controlled randomness and reproducibility

ClickBand uses randomness, but never as an unrestricted choice among arbitrary notes.

Every decision occurs inside a constrained space defined by harmony, mode, style, formal role, rhythm, register and melodic continuity. Where a seed is used, the same configuration can reproduce the same result.

This provides variation without turning the system into a black box.

---

## Why ClickBand is not an AI music generator

ClickBand does not use a neural model trained on a catalogue of songs. It does not send a prompt to a remote service and does not ask a model to predict the next musical event.

Its decisions come from:

- explicit rules;
- declared musical structures;
- pattern libraries;
- scoring functions;
- deterministic transformations;
- constrained random selection;
- validated data contracts.

It is therefore best described as a **procedural music composition system** or an **algorithmic music generator**.

The word *generative* does not necessarily mean *artificial intelligence*. ClickBand is generative because it can create new songs from rules and parameters, while keeping those rules visible and inspectable.

---

## Educational value

ClickBand was designed by a teacher and former software analyst-programmer. Its architecture reflects both perspectives: it aims to make music creation accessible while keeping the underlying process explainable.

In an educational setting, ClickBand can help explore relationships such as:

```text
major / minor mode → different interval structures
slower tempo       → a different perception of density and duration
chorus             → a stronger formal and instrumental profile
modulation         → all generated parts move into a new key context
rest               → silence becomes part of musical phrasing
```

Students can compare versions of the same song and observe the roles of form, harmony, rhythm, melody, arrangement and timbre.

Because the complete workflow runs locally, schools can use it without creating student accounts or sending musical choices and project data to an external platform.

---

## Sound storytelling

ClickBand can also support sound storytelling. A narrative sequence can be translated into a controlled musical sequence:

```text
departure → exploration → danger → encounter → return
```

Each scene can influence mode, density, register, instrumentation, dynamics and thematic transformation. This approach does not require AI text interpretation: a visual or rule-based storyboard can map narrative choices directly to musical parameters.

The same thematic material may return in a different register, mode, rhythm or instrumentation, giving characters and events a recognizable musical identity.

---

## Local and self-contained use

Normal ClickBand use is browser-only and local.

1. Download the complete ZIP archive.
2. Extract all files while preserving the folder structure.
3. Open one of the four HTML entry points.
4. Generate, play and export the song.

No Node.js installation is required for normal use. Node.js is only useful for running the automated test suite.

The bundled package includes the project-owned modules and the required browser dependencies. Third-party components retain their own licenses; see `THIRD_PARTY_NOTICES.md`.

---

## Reusing the engine without the supplied UI

ClickBand's core can be embedded in another browser interface. Any front end can drive `AppController` by implementing the documented `window.ClickBandUIAdapter` contract.

Start with:

- [`docs/REUSE_GUIDE.md`](docs/REUSE_GUIDE.md) — integration examples and extension recipes;
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) — public constructors, methods and configuration;
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — canonical and arranged data contracts;
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — ownership and pipeline boundaries;
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — contribution and release rules.

---

## Repository structure

```text
index.html                  full English UI
index.it.html               full Italian UI
index.kids.html             Kids English UI
index.kids.it.html          Kids Italian UI

js/                         project-owned runtime modules
js/vendor/                  bundled third-party browser libraries
css/                        interface styling
docs/                       bilingual technical documentation
tests/                      automated contract and pipeline tests
licenses/                   third-party license texts
MIDIs/                      example generated MIDI files

README.md                   project presentation in English
README.it.md                project presentation in Italian
LICENSE                     ClickBand project license
THIRD_PARTY_NOTICES.md      dependency notices
CHANGELOG.md                release history
```

---

## Tests

With Node.js installed, run the core test:

```bash
node tests/core-smoke.js
```

Additional tests cover areas such as:

- all-style MIDI programs;
- UI-adapter contracts;
- Kids-interface contracts;
- chorus-lift behavior;
- melodic-rhythm constraints;
- MIDI humanization;
- drum and melody timing protection;
- track filtering and MIDI generation.

---

## Free by choice, non-commercial by license

ClickBand is shared free of charge because its author wants it to be used, studied, adapted and improved—especially for educational and personal creativity.

You may share and adapt the original ClickBand code for non-commercial purposes provided that you:

1. give appropriate credit to Fabio Albanese;
2. reference the CC BY-NC 4.0 license;
3. indicate whether changes were made;
4. do not imply endorsement by the author.

Commercial use is not permitted without separate written authorization.

This means that ClickBand may not be repackaged, sold, included in a paid product or used as the basis of a commercial service merely because its source code is available.

The intention is simple:

> ClickBand is given to the community so that people can create and learn with it—not so that someone else can monetize the work that was shared freely.

For the complete legal terms, read [`LICENSE`](LICENSE). Third-party libraries and assets remain under their respective licenses as listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

---

## Project identity

ClickBand combines two goals:

- making music creation accessible to children and non-specialists;
- exposing enough structure and control for teachers, musicians and developers to understand and extend the system.

It does not hide composition behind a remote black box. It provides both the generated music and the mechanisms that created it.
