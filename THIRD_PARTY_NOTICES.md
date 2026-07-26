# Third-party notices

The files under `js/vendor/` are third-party components and are not relicensed under CC BY-NC 4.0 by this project.

Included components:

- Tone.js — MIT License.
- @tonejs/midi / Midi.js — MIT License.
- Tonal — MIT License.
- SpessaSynth — third-party license distributed by its upstream project.
- lamejs — LGPL / upstream terms.
- ClickBand soundfont bundle — verify the license of the underlying soundfont before public redistribution.

Before publishing a public GitHub release, replace this summary with the exact upstream LICENSE files and provenance for every vendored file, especially the soundfont. The original ClickBand code is licensed by Fabio Albanese under CC BY-NC 4.0; vendored assets remain under their upstream licenses.

## midi-humanizer-deterministic

The local MIDI humanization design is adapted from midi-humanizer-deterministic 0.1.0.
Copyright (c) 2026 Manus AI. Licensed under the MIT License.
The MIT license text is included in `licenses/midi-humanizer-deterministic-LICENSE.txt`.

The bundled `js/vendor/Midi.js` parser/writer is used locally to decode and serialize Standard MIDI Files.
