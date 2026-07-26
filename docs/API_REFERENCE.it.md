# Reference API delle librerie

Le classi ClickBand sono costruttori JavaScript classici esposti su `window`. Per composizione e rendering sono necessarie soltanto le classi indicate come API core.

## API core

## `RhythmPatternLibrary`

Fornisce pattern ritmici riutilizzabili per ruoli percussivi e sezioni del brano.

```js
var library = new RhythmPatternLibrary(optionalPatterns);
```

### Metodi

- `getStyles()` → restituisce gli identificatori degli stili disponibili.
- `getByRole(role, style)` → restituisce i pattern compatibili con ruolo e stile.
- `targetDensity(sectionName, barIndex)` → restituisce la densità desiderata per il contesto.
- `buildPhrase(options)` → costruisce una linea ritmica di quattro battute.
- `validate()` → convalida la collezione e genera un errore in caso di dati non validi.

Le linee di frase restituite sono stringhe di 64 caratteri corrispondenti agli spot.

## `MelodicRhythmGenerator`

Crea esclusivamente lo scheletro temporale di una frase melodica di quattro battute.

```js
var generator = new MelodicRhythmGenerator(optionalConfig);
var events = generator.generate("chorus", "A");
```

### `generate(sectionName, variant)`

Restituisce il ritmo della frase secondo il contratto dell’implementazione. Gli eventi descrivono battuta, spot e durata, ma non scelgono i gradi di scala.

Vincoli garantiti:

- quattro battute;
- primo evento allo spot `0` di ogni battuta;
- sole durate `2`, `4`, `8` o `16`;
- nessun evento oltre la battuta corrente.

## `SongGenerator`

Crea forma, sezioni riutilizzabili, armonia, linee ritmiche, melodia e contesti tonali specifici delle occorrenze.

```js
var generator = new SongGenerator(config);
var song = generator.generate();
```

### Configurazione

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

### Metodo pubblico

- `generate()` → restituisce il brano teorico base documentato in `DATA_MODEL.it.md`.

Gli altri metodi del prototipo sono punti di estensione interni e non ingressi pubblici di alto livello.

### Dipendenze

- `RhythmPatternLibrary` quando `rhythmSource` vale `"library"`.
- `MelodicRhythmGenerator` quando `melodicRhythmSource` vale `"library"`.
- Tonal è opzionale; il comportamento basato sui gradi può funzionare senza la libreria.

## `ArrangementGenerator`

Aggiunge al brano base tutte le voci teoriche di accompagnamento.

```js
var arranger = new ArrangementGenerator(optionalConfig);
var arrangedSong = arranger.arrange(baseSong);
```

### Metodi pubblici

- `arrange(baseSong)` → convalida e restituisce un brano teorico arrangiato.
- `flatten(arrangedSong)` → restituisce una lista lineare di battute utile per analisi e renderer personalizzati.

### Comportamento importante

- Non legge i checkbox della UI.
- Non assegna canali o programmi MIDI.
- Conserva il brano teorico base.
- Genera le voci secondo le regole musicali anche se un renderer successivo le disattiverà.

### Errore

Un ingresso non valido può generare `ArrangementGeneratorError`.

## `MidiGenerator`

Traduce un brano teorico base o arrangiato in Standard MIDI File.

```js
var renderer = new MidiGenerator(config);
var bytes = renderer.generate(song);
```

### Configurazione

```js
{
  bpm: 120,
  ppq: 480,
  programs: { melody: 0, bass: 33 },
  volumes: { melody: 100, bass: 95 },
  activeTracks: { melody: true, bass: true, drums: true }
}
```

Le impostazioni mancanti vengono unite ai valori predefiniti interni.

### Metodi pubblici

- `generate(song)` → restituisce i byte MIDI come `Uint8Array`.
- `download(song, filename)` → funzione browser che genera e scarica il file MIDI.
- `pitch(event, context, shift)` → risolve un evento teorico in altezza MIDI assoluta; utile soprattutto per renderer personalizzati e test.

### Chiavi delle voci supportate

```text
melody, arp, bass, guitar, chromatic, pad, counter,
ostinato, fx, drums, choir, brass, strings, guitarLead
```

### Comportamento esecutivo

- Risolve grado, offset d’ottava, alterazione e trasposizione locale.
- Applica BPM, PPQ, programmi e volume CC7.
- Filtra le voci teoriche esistenti tramite `activeTracks`.
- Scrive meta-eventi di metro e armatura.
- Non compone, corregge o sostituisce note musicali.

## API AI opzionale

## `MidiImprover`

Wrapper asincrono opzionale per la post-elaborazione.

```js
var improver = new MidiImprover(config);
var improvedBytes = await improver.improve(midiBytes, function (progress) {
  console.log(progress);
});
```

### `improve(midiBytes, onProgress)`

- Ingresso: byte MIDI.
- Uscita: `Promise` risolta con byte MIDI.
- Richiede il motore AI configurato e le relative dipendenze.
- Va trattato come post-elaborazione e non sostituisce il modello teorico.

L’applicazione ospite dovrebbe conservare il MIDI originale come fallback.

## Classi della sola applicazione

Le seguenti classi supportano l’applicazione inclusa ma non sono necessarie per incorporare le librerie core:

- `AppController`: fotografa la UI, coordina i task e pubblica i risultati.
- `UIRuntime`: builder, controlli, console e utilità browser.
- `AudioController`: riproduzione e funzioni MP3.
- `Locale`: testi di presentazione inglesi e italiani.

Queste classi possono accedere al DOM e non devono diventare dipendenze del dominio musicale.

## Ordine di caricamento

Ordine core consigliato:

```html
<script src="js/vendor/tonal.min.js"></script>
<script src="js/RhythmPatternLibrary.js"></script>
<script src="js/MelodicRhythmGenerator.js"></script>
<script src="js/SongGenerator.js"></script>
<script src="js/ArrangementGenerator.js"></script>
<script src="js/MidiGenerator.js"></script>
```

Gli strati AI e applicativi opzionali vanno caricati successivamente.

## Politica di stabilità

Per le integrazioni, considerare stabili questi ingressi:

```text
new SongGenerator(config).generate()
new ArrangementGenerator(config).arrange(song)
new MidiGenerator(config).generate(song)
new MidiImprover(config).improve(bytes, onProgress)
```

I metodi interni possono cambiare tra release. Le modifiche al modello dati devono incrementare il campo radice `version` ed essere documentate nel changelog.
