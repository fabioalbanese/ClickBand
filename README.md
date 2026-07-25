# ClickBand Junior — International Production Release

ClickBand Junior is a browser-only generative music application written in classic JavaScript. It creates a complete theoretical song, expands it into an arrangement, renders Standard MIDI, optionally applies Magenta-based AI improvement, and can export MP3 audio locally.

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

No server, package manager, bundler, framework or network connection is required for the normal non-AI workflow.

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
AIImprover (optional)
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
