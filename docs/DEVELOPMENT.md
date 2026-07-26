# Development Guide

## Technical constraints

- Classic JavaScript loaded with `<script src>`.
- No ES modules, imports, exports, bundler, framework or mandatory server.
- The extracted project must continue to work from `file://`.
- Music-domain classes must not access the DOM.
- English is mandatory for code identifiers, comments, errors, tests and canonical data keys.
- User-facing language belongs in HTML pages or `Locale.js`.

## Adding a theoretical voice

1. Generate it in `ArrangementGenerator` using relative scale degrees.
2. Add its MIDI translation in `MidiGenerator`.
3. Add execution controls in both HTML entry points.
4. Add English source labels and Italian translations.
5. Extend `tests/core-smoke.js` when the invariant is testable.

## Changing composition

Compositional decisions belong in `SongGenerator`. Do not implement modulation, harmony correction or note selection in `MidiGenerator`.

## Changing execution

Instrument programs, volume, BPM, pan, enabled tracks and serialization belong in `MidiGenerator` configuration. MIDI regeneration must reuse the arranged theoretical structure already in memory.

## Localization

- Keep `index.html` and `index.it.html` structurally equivalent.
- English is the canonical source UI.
- Dynamic English messages are translated by `Locale.js` when the document language is Italian.
- Never place Italian identifiers or comments in project-owned JavaScript.

## Release checklist

1. Run `node --check` on every project-owned JavaScript file.
2. Run `node tests/core-smoke.js`.
3. Verify that every local script and stylesheet referenced by both HTML files exists.
4. Search project-owned JavaScript for unintended Italian identifiers or comments.
5. Test generation, MIDI regeneration, MIDI humanization on/off, player, MIDI download and MP3 rendering in a browser.
6. Update `CHANGELOG.md` and `RELEASE-MANIFEST.txt`.
