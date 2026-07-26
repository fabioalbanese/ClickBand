# ClickBand Junior — Release internazionale per produzione

ClickBand Junior è un’applicazione musicale generativa, eseguita interamente nel browser e scritta in JavaScript classico. Genera un brano teorico completo, crea l’arrangiamento, produce un file MIDI standard, applica facoltativamente l’humanizzazione MIDI deterministica e locale ed esporta audio MP3 in locale.

**Autore:** Fabio Albanese  
**Licenza:** CC BY-NC 4.0 — attribuzione obbligatoria, uso esclusivamente non commerciale.

## Lingue

- `index.html`: applicazione in inglese.
- `index.it.html`: applicazione in italiano.
- Codice sorgente, API, identificatori, commenti e test usano l’inglese come lingua canonica.
- I testi italiani sono isolati nella pagina italiana e in `js/Locale.js`.
- La documentazione è disponibile in entrambe le lingue.

## Avvio

1. Estrarre completamente l’archivio.
2. Aprire `index.it.html` per l’italiano oppure `index.html` per l’inglese.
3. Scegliere stile, tonica, modalità, BPM, struttura e tracce.
4. Premere **Genera brano**.
5. Usare **Rigenera MIDI** per cambiare impostazioni esecutive senza ricomporre il brano teorico.

## Pipeline

```text
Snapshot immutabile della UI
        ↓
SongGenerator
        ↓
ArrangementGenerator
        ↓
MidiGenerator
        ↓
MidiImprover e MidiHumanizer facoltativi, completamente locali
        ↓
Player / download MIDI / renderer MP3
```

Per architettura, modello dati, sviluppo e licenze consultare la cartella `docs/` e `THIRD_PARTY_NOTICES.md`.

## Riutilizzare le librerie

ClickBand può essere incorporato senza la sua interfaccia. I documenti principali sono:

- [`docs/REUSE_GUIDE.it.md`](docs/REUSE_GUIDE.it.md) — esempi di integrazione e ricette di estensione;
- [`docs/API_REFERENCE.it.md`](docs/API_REFERENCE.it.md) — costruttori, metodi e configurazioni pubbliche;
- [`docs/DATA_MODEL.it.md`](docs/DATA_MODEL.it.md) — contratti completi dei dati teorici e arrangiati;
- [`docs/ARCHITECTURE.it.md`](docs/ARCHITECTURE.it.md) — responsabilità e confini delle pipeline;
- [`docs/DEVELOPMENT.it.md`](docs/DEVELOPMENT.it.md) — regole di sviluppo e rilascio.


- Latin / Salsa: syncopated percussion, piano montuno, tumbao bass, brass hits and call-and-response phrasing.
- Jazz / Swing: ride-driven swing, walking acoustic bass, piano and guitar comping, tenor sax melody and muted-brass responses.


### New styles
Blues and Celtic / Irish Folk are available as complete compositional styles. Folk/Country now uses Fiddle, Violin and Banjo as requested.
