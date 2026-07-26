## Chorus lift rule update

- Optional +1-semitone lift now occurs in 40% of generations.
- The first chorus is never transposed.
- The lift begins on chorus 2 or, when present, chorus 3.
- Major and minor modes preserve their mode during transposition.

## 1.2.1
- Rimossa completamente ogni generazione o inserimento di note melodiche.
- L’humanizer della melodia modifica soltanto il timing degli attacchi di ±1/64, preservando numero, altezza e durata delle note.

## 1.1.2 — MP3 completion UI fix

- Simplified the final rendering message to `MP3 ready.` / `MP3 pronto.`
- Centralized MP3 button-state synchronization in `AudioController`.
- Fixed an intermittent race where the MP3 blob was ready but the download button remained disabled.
- Re-applies the ready state after browser painting and at the end of the rendering task.


## UI semplificata

- Rimossi testi descrittivi non necessari dall’interfaccia italiana e inglese.
- Ridotti i messaggi di stato a indicazioni operative brevi.
- Mantenuti invariati motore musicale, humanizer offline e formati di esportazione.
# ClickBand changelog

## Offline deterministic humanization build

- Removed Magenta, its remote checkpoints and the bundled Magenta runtime.
- Added browser-local deterministic MIDI humanization for timing, velocity and duration.
- Added Light, Natural and Expressive intensity profiles.
- Preserved the original MIDI as a safe fallback if post-processing fails.
- Added track-aware profiles and protection for strong kick, snare and crash accents.
- Updated Italian and English UI, documentation and third-party notices.
- Confirmed that the application source contains no model or CDN requests.

## Blues and Celtic styles

- Added complete BLUES and CELTIC pipelines, presets, 48 rhythmic patterns each, melodic behavior, arrangements and regression tests.
- Updated Folk/Country defaults: Fiddle main melody, Violin arpeggio, Banjo chord guitar; added rhythmic fiddle sawstroke arrangement.

## Jazz / Swing
- Added end-to-end JAZZ style with UI presets, 48 unique swing patterns, jazz melodic rhythm, ii–V–I harmony, walking bass, piano/guitar comping, vibraphone responses and regression tests.

## Latin / Salsa
- Added end-to-end LATIN style, UI presets, 48 unique rhythm patterns, melodic rhythm, harmony, arrangement and regression tests.


## Folk/Country default preset update

- Main melody: Harmonica (GM 22).
- Chord guitar: Banjo (GM 105).
- Bass: Acoustic Bass (GM 32).
- Pad: String Ensemble 1 (GM 48), enabled by default.
- Countermelody: Harmonica (GM 22).
- Ostinato: Banjo (GM 105).
- Folk BPM base raised to 135, producing a randomized default range of 130–140 BPM.
- UI and MIDI regression tests updated accordingly.

## Folk / American Country

- Added the selectable `folk` style and the `FOLK` application mapping.
- Added 48 curated Folk/Country drum patterns covering initial, continuation and fill roles.
- Added Folk-specific melodic rhythm, harmonic progressions and melodic preferences.
- Added theoretical root-fifth bass, boom-chick guitar, banjo roll, harmonica and fiddle responses.
- Extended core smoke tests to cover Folk generation, arrangement and MIDI rendering.
## 1.0.1 — Complete Italian/English localization

- Completed all static interface translations, including buttons, labels, help text and player controls.
- Replaced mixed-language General MIDI labels with canonical English names.
- Added complete Italian names for all 128 General MIDI programs.
- Localized dynamically generated instrument options through `Locale.js`.
- Removed remaining mixed Italian/English runtime messages.
- Added static language-parity and source-language audit checks.

# Changelog

## Production Clean 1.0.1

- Replaced the previous CC0 dedication with CC BY-NC 4.0.
- Added copyright and attribution to Fabio Albanese.
- Updated source headers, README and third-party notices.

## Production Clean 1.0.0

- Removed legacy song generator and legacy MIDI assembler from the runtime.
- Removed unused legacy adapters and historical test files.
- Renamed the retained UI/player runtime modules for clearer responsibilities.
- Isolated the Magenta engine from the DOM.
- Preserved the current theoretical OOP pipeline and musical behavior.
- Added GitHub-oriented architecture, data-model and development documentation.
- Added initial licensing and third-party notices (superseded by 1.0.1).

## 1.1.0 — International production release

- Added equivalent English and Italian application entry points.
- Added runtime localization for dynamic UI messages.
- Converted project-owned identifiers, canonical data keys, comments, errors and tests to English.
- Added complete English and Italian documentation sets.
- Preserved CC BY-NC 4.0 attribution to Fabio Albanese.
- Revalidated syntax, core music invariants, HTML references, handlers and bilingual structural parity.

## 1.0.2 — Reuse and integration documentation

- Added complete English and Italian library reuse guides.
- Added class-by-class API references.
- Expanded the theoretical and arranged data-model contracts.
- Added copyable examples for composition, arrangement, MIDI rendering, serialization, custom voices and alternative renderers.
- Linked all developer documentation from both README files.

### Correzione preset Folk/Country
- Completata l’assegnazione degli strumenti nel preset dell’interfaccia.
- Chitarra Folk impostata su Steel-string Acoustic Guitar.
- Sincronizzata anche la voce FX e resa esplicita l’assegnazione dello strumento cromatico.

### Fixed — Folk/Country instrument preset application
- Fixed the real UI execution path: `applyStylePreset()` called an undefined `rndInt()` after instrument menus were populated, so execution stopped before any preset assignment and every menu remained on General MIDI program 0 (Acoustic Grand Piano).
- Added regression tests comparing the working Rock path with Folk in the actual `UIRuntime.js` functions.
- Added MIDI Program Change verification for Fiddle, steel-string guitar, acoustic bass, harmonica and banjo.

## Humanizer batteria su griglia 64
- Ogni battuta 4/4 viene trattata come 64 posizioni temporanee (4 sotto-slot per ciascuno dei 16 step originali).
- Al massimo il 5% degli eventi di batteria viene anticipato o ritardato di un solo sotto-slot.
- Sono protetti primo colpo della battuta, kick strutturali, backbeat di snare, crash principali e chiusure dei fill di tom.
- La selezione resta deterministica a parità di MIDI e seed.

## Offline humanizer 1.2.0
- Microtiming della melodia principale su griglia temporanea da 64 slot.
- Massimo 5% delle note melodiche idonee spostato di un solo slot temporaneo.
- Inserimento deterministico e raro di micro-timing melodico diatoniche (massimo 2%).
- La nota di destinazione e la durata complessiva del brano restano invariate.
