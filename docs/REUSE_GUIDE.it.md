# Riutilizzare ClickBand in altri progetti

Questa guida spiega come usare ClickBand come insieme di librerie indipendenti, senza dover incorporare l’intera applicazione.

## Principio di progettazione

ClickBand separa **composizione**, **arrangiamento** ed **esecuzione**:

```text
SongGenerator
  crea un brano teorico astratto
        ↓
ArrangementGenerator
  aggiunge le voci di accompagnamento astratte
        ↓
MidiGenerator
  converte il modello teorico in byte MIDI
        ↓
AIImprover (opzionale)
  trasforma il MIDI generato
```

Le prime due fasi non contengono numeri di nota MIDI, canali, programmi, controller o altezze assolute. Il modello teorico può quindi essere riutilizzato in software di notazione, giochi, strumenti educativi, DAW web, renderer server o motori audio alternativi.

## Caricamento delle librerie

ClickBand usa JavaScript classico ed espone i costruttori su `window`. Le dipendenze devono essere caricate prima delle classi che le utilizzano:

```html
<script src="js/vendor/tonal.min.js"></script>
<script src="js/RhythmPatternLibrary.js"></script>
<script src="js/MelodicRhythmGenerator.js"></script>
<script src="js/SongGenerator.js"></script>
<script src="js/ArrangementGenerator.js"></script>
<script src="js/MidiGenerator.js"></script>
```

Non sono necessari loader, bundler o server.

## Esempio minimo di composizione

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

Il risultato è un brano teorico completo, ispezionabile, serializzabile in JSON o utilizzabile da un renderer diverso.

## Esempio minimo di arrangiamento

```js
var arranger = new ArrangementGenerator();
var arrangedSong = arranger.arrange(theoreticalSong);

console.log(arrangedSong.sections.verse.phrases.A[0].voices);
```

`ArrangementGenerator` genera sempre tutte le voci teoriche previste dalle regole musicali. I checkbox delle tracce appartengono alla fase esecutiva e non devono eliminare dati in questa fase.

## Esempio minimo MIDI

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

`generate()` restituisce un `Uint8Array` contenente uno Standard MIDI File completo.

## Pipeline completa riutilizzabile

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

## Rigenerare l’esecuzione senza ricomporre

Conservare `arrangedSong`. Quando cambiano BPM, strumenti, volumi o tracce attive, creare un nuovo `MidiGenerator` e renderizzare nuovamente lo stesso oggetto teorico:

```js
var newRenderer = new MidiGenerator({
  bpm: 132,
  programs: { melody: 81, bass: 38 },
  activeTracks: { melody: true, bass: true, drums: true, pad: false }
});

var newMidiBytes = newRenderer.generate(result.arrangedSong);
```

Per modifiche puramente esecutive non vanno richiamati `SongGenerator` o `ArrangementGenerator`.

## Usare singole librerie

### Solo generazione ritmica

```js
var rhythmGenerator = new MelodicRhythmGenerator();
var phraseRhythm = rhythmGenerator.generate("chorus", "A");
```

La frase restituita contiene quattro battute di eventi ritmici melodici. Ogni battuta inizia allo spot `0`, usa soltanto durate `2`, `4`, `8` o `16` e termina entro lo spot `16`.

### Solo libreria dei pattern

```js
var library = new RhythmPatternLibrary();
var styles = library.getStyles();
var pattern = library.buildPhrase({
  style: "POP",
  role: "kick",
  sectionName: "chorus"
});
```

### Solo renderer MIDI

È possibile costruire autonomamente un oggetto teorico compatibile e passarlo direttamente a `MidiGenerator`. I contratti obbligatori sono descritti in `DATA_MODEL.it.md`.

## Estendere il motore compositivo

### Aggiungere un tipo di sezione

1. Aggiungere il nome della sezione a `structure`.
2. Aggiungere un numero positivo in `sectionPhraseCounts`.
3. Aggiungere eventuali regole specifiche in `SongGenerator`.
4. Aggiungere regole orchestrali in `ArrangementGenerator` soltanto quando necessarie.

```js
var generator = new SongGenerator({
  structure: ["intro", "verse", "preChorus", "chorus", "outro"],
  sectionPhraseCounts: {
    preChorus: 1
  }
});
```

I nomi di sezione sconosciuti usano le regole generali purché abbiano un numero di frasi valido.

### Aggiungere una nuova voce teorica

1. Generare l’array della nuova voce in `ArrangementGenerator`.
2. Usare esclusivamente eventi teorici di nota o accordo.
3. Aggiungere la voce a `MidiGenerator.empty()`.
4. Assegnare un canale in `channelFor()`.
5. Aggiungere programma, volume e stato predefinito.
6. Estendere i test.

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

### Sostituire il MIDI con un altro renderer

Un renderer deve soltanto attraversare il modello arrangiato e risolvere:

```text
grado di scala + offset d’ottava + alterazione + contesto tonale locale
```

Possibili destinazioni:

- oscillatori Web Audio;
- strumenti campionati;
- esportazione MusicXML;
- impaginazione di partiture;
- timeline per motori di gioco;
- messaggi OSC;
- rendering audio server-side.

I dati specifici del renderer non devono essere aggiunti al brano teorico.

## Serializzazione e salvataggio

Il brano base e quello arrangiato sono normali oggetti e possono essere serializzati:

```js
var saved = JSON.stringify(arrangedSong);
var restored = JSON.parse(saved);
var midi = new MidiGenerator({ bpm: 120 }).generate(restored);
```

Il modello teorico non contiene funzioni, nodi DOM, blob o array di byte MIDI.

## Test deterministici

I generatori usano attualmente `Math.random()`. Un progetto ospite può sostituirlo temporaneamente con un generatore seeded durante i test:

```js
var originalRandom = Math.random;
Math.random = seededRandom;
try {
  var song = new SongGenerator(config).generate();
} finally {
  Math.random = originalRandom;
}
```

La sostituzione non va eseguita durante attività UI asincrone.

## Confini di integrazione

- `SongGenerator`: decisioni compositive.
- `ArrangementGenerator`: decisioni orchestrali.
- `MidiGenerator`: risoluzione delle altezze, canali, programmi, controller, tempo e serializzazione.
- `AIImprover`: post-elaborazione opzionale dei byte MIDI.
- `AppController`, `UIRuntime`, `AudioController`: applicazione visuale; non necessari per incorporare le librerie.

## Distribuzione e licenza

Il codice originale del progetto è distribuito con licenza CC BY-NC 4.0. Il riuso richiede l’attribuzione a Fabio Albanese ed è limitato a finalità non commerciali, salvo autorizzazione separata. Le dipendenze di terze parti mantengono le proprie licenze.
