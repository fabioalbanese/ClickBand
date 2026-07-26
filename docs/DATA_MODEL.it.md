# Modello dati teorico di ClickBand

Questo documento definisce il contratto tra composizione, arrangiamento e rendering. Le estensioni del progetto devono preservare questi confini.

## Sistema di coordinate

- Metro: `4/4`.
- Una battuta: `16` spot astratti.
- Una semiminima: `4` spot.
- Una croma: `2` spot.
- Una minima: `8` spot.
- Una semibreve: `16` spot.
- Una frase: `4` battute, cioè `64` spot.

Gli spot sono unità teoriche. Soltanto `MidiGenerator` li converte in tick MIDI usando `ppq / 4` tick per spot.

## Radice del brano base

Restituita da `new SongGenerator(config).generate()`:

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
  tonic: "C4",                 // tonica e ottava usate dai renderer
  key: "C",                    // classe di altezza della tonica
  tonicOctave: 4,
  mode: "major",               // "major" oppure "minor"
  style: "POP",
  timeSignature: [4, 4],
  spotsPerBar: 16,
  barsPerPhrase: 4,
  theoryEngine: "diatonic-degrees",
  scaleDegrees: [1, 2, 3, 4, 5, 6, 7],
  modulation: { /* ModulationMetadata */ }
}
```

`metadata.tonic` è il contesto globale del brano, non l’altezza di un singolo evento. Gli eventi restano relativi alla scala.

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

I temi usano soltanto gradi di scala. `A` e `B` descrivono varianti tematiche correlate.

## Struttura formale

### `structure`

Lista ordinata di identificatori di sezioni riutilizzabili:

```js
["intro", "verse", "chorus", "verse", "bridge", "chorus", "outro"]
```

La stessa definizione di sezione può apparire più volte.

### StructurePlanEntry

`structurePlan` contiene informazioni specifiche dell’occorrenza che non possono essere archiviate in sicurezza sulla definizione riutilizzabile della sezione:

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

`shiftSemitones` è relativo a `metadata.tonic`. Permette la modulazione dal secondo o dal terzo chorus mantenendo riutilizzabile il materiale della sezione. L’outro può tornare esplicitamente a `0`.

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

Descrive una decisione compositiva. Un renderer non deve decidere autonomamente se applicare la modulazione.

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

`sequence` è l’ordine di esecuzione delle definizioni di frase nella sezione.

## BasePhrase

Una frase dura quattro battute. I campi principali sono:

```js
{
  id: "verse_A",
  section: "verse",
  variant: "A",
  progression: [ /* Chord[] */ ],
  lines: {
    c: "...64 caratteri...",  // cassa
    r: "...64 caratteri...",  // rullante
    h: "...64 caratteri...",  // hi-hat
    k: "...64 caratteri...",  // crash
    m: "...64 caratteri..."   // linea melodica diagnostica
  },
  melodicRhythm: [ /* MelodicRhythmEvent[] */ ],
  notes: [ /* BaseMelodyNote[] */ ]
}
```

Le linee di batteria usano `x` per un attacco e `.` per uno spot vuoto. La linea melodica compatta è diagnostica e non va considerata il modello canonico delle note.

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

Le note dell’accordo sono relative alla scala. `octaveOffset` conserva l’ordine del voicing senza memorizzare altezze assolute.

## MelodicRhythmEvent

```js
{
  bar: 0,
  spot: 0,
  duration: 4,
  isClosingNote: false
}
```

La legge ritmica melodica è rigida:

- ogni battuta inizia con un evento allo spot `0`;
- le sole durate ammesse sono `2`, `4`, `8` e `16` spot;
- gli attacchi sono compatibili con la griglia di crome;
- gli eventi non si sovrappongono;
- nessun evento termina oltre lo spot `16`;
- nessun evento si trascina nella battuta successiva.

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

È la rappresentazione melodica del brano base. `ArrangementGenerator` la normalizza in eventi teorici locali alla battuta.

## Radice del brano arrangiato

Restituita da `new ArrangementGenerator(config).arrange(baseSong)`:

```js
{
  version: 2,
  metadata: { /* metadati clonati */ },
  theme: { /* tema clonato */ },
  structure: [ /* struttura clonata */ ],
  structurePlan: [ /* piano clonato */ ],
  baseSong: { /* brano teorico originale */ },
  sections: {
    verse: { /* ArrangedSection */ }
  }
}
```

Il brano originale viene conservato in `baseSong`. La rappresentazione arrangiata non lo sostituisce né lo modifica.

## ArrangedSection

```js
{
  name: "verse",
  sequence: ["A", "B"],
  phrases: {
    A: [ /* quattro ArrangedBar */ ],
    B: [ /* quattro ArrangedBar */ ]
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

Gli array possono essere vuoti quando le regole musicali non prevedono una voce nella sezione corrente. Non devono essere svuotati perché un checkbox UI è disattivato.

## TheoreticalNoteEvent

Nota singola:

```js
{
  degree: 1,          // intero 1..7
  octaveOffset: 0,   // spostamento relativo d’ottava
  accidental: 0,     // alterazione cromatica in semitoni
  startSpot: 0,      // offset locale alla battuta, normalmente 0..15
  durationSpots: 4,
  dynamic: 0.72,     // valore espressivo normalizzato
  articulation: "normal",
  role: "bass"
}
```

Evento accordale:

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

Un renderer deve supportare `degree` oppure `notes`.

## DrumEvent

```js
{
  instrument: "snare",
  startSpot: 4,
  durationSpots: 1,
  dynamic: 0.66
}
```

Identificatori canonici correnti:

```text
kick, snare, closedHat, openHat, crash, ride
```

Sono ruoli astratti. I numeri di nota MIDI appartengono esclusivamente a `MidiGenerator`.

## Configurazione MIDI

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

- `programs`: numeri General MIDI, `0..127`.
- `volumes`: valori MIDI CC7, `0..127`.
- `activeTracks`: filtro esecutivo; non modifica il brano teorico.
- `bpm` e `ppq`: impostazioni di serializzazione.

## Regole di purezza

I modelli teorici base e arrangiato non devono contenere:

- numeri di nota MIDI;
- canali MIDI;
- programmi General MIDI;
- valori di controller;
- timestamp assoluti in tick o millisecondi;
- nodi DOM;
- oggetti audio;
- blob o URL di download.

Questi dati appartengono ai renderer o ai controller applicativi.

## Compatibilità futura

I consumer dovrebbero:

- controllare `version`;
- ignorare proprietà opzionali sconosciute;
- conservare proprietà sconosciute durante le trasformazioni;
- usare i campi evento canonici e non le stringhe diagnostiche;
- evitare di modificare gli oggetti in ingresso salvo documentazione esplicita.
