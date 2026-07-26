# Architettura

Ogni classe ha una sola responsabilità. Le classi musicali ricevono e restituiscono dati semplici e non accedono al DOM.

## Pipeline

1. `AppController` fotografa i valori della UI e blocca l’interfaccia.
2. `SongGenerator` crea il brano teorico canonico.
3. `ArrangementGenerator` genera tutte le voci teoriche accessorie.
4. `MidiGenerator` traduce il brano in MIDI e filtra soltanto le tracce abilitate per l’esecuzione.
5. `MidiImprover`, quando richiesto, applica localmente l’humanizzazione deterministica e conserva l’originale in caso di errore.
6. Il controller pubblica un unico risultato finale per player, download e MP3.

La composizione, l’arrangiamento e la serializzazione MIDI sono sincroni. Sono asincroni soltanto gli aggiornamenti grafici e l’humanizzazione MIDI opzionale (un algoritmo locale deterministico, non AI).

## Modulazione finale

Quando la forma contiene almeno due chorus, `SongGenerator` applica nel 40% delle generazioni un innalzamento di un semitono. Il primo chorus non viene mai trasposto; il cambio parte dal secondo oppure, quando presente, dal terzo chorus e continua nelle sezioni successive, escluso l’outro. L’outro forza il ritorno a `shiftSemitones: 0`. La modulazione appartiene al brano teorico, non all’esecuzione MIDI.

## Confine con l'interfaccia

`AppController.js` non tocca mai il DOM, `window.alert` o qualunque altra API
di presentazione. Ogni pagina HTML — quella completa, quella kids, o una
futura — deve impostare `window.ClickBandUIAdapter` prima che la pipeline
generativa venga eseguita. È l'unico canale, obbligatorio, tra markup/CSS e il
motore generativo: non esiste alcun ripiego sul DOM se manca o è incompleto.

Metodi obbligatori (`AppController` lancia un errore chiaro se ne manca uno):

- `setStatus(text)` — mostra un messaggio di stato (testo inglese canonico;
  è l'adapter a decidere se e come tradurlo).
- `setBusy(isBusy)` — abilita/disabilita l'interazione durante una generazione.
- `getBridge()` → `{ getSectionsInfo(), getStructure(), getSongState(), setSongState() }`.
- `getSongConfig()` → `{ tonic, mode, style, sectionPhraseCounts, structure, useTonal }`.
  `mode`/`style` devono già essere risolti negli identificatori di dominio
  attesi dal motore (es. `"FOLK"`, `"minor"`) — tradurre i valori dei propri
  controlli (es. `"folk"`) in quegli identificatori è compito dell'adapter,
  non di `AppController`.
- `getMidiConfig()` → `{ bpm, programs, volumes, activeTracks }`.
- `getImprovementConfig()` → `{ enabled, intensity }`.

Hook opzionali (chiamati solo se presenti):

- `onStateChange({ hasSong, hasMidi, busy })` — la pagina abilita/disabilita i
  propri controlli dopo ogni cambio di stato.
- `onMidiPublished(midiBytes)` — è disponibile un nuovo risultato MIDI
  (costruire un player, sbloccare i download, aggiornare un debug, ...).
- `onMidiCleared()` — il risultato MIDI precedente è appena stato invalidato.
- `onError(message)` — segnala un errore oltre al testo di stato (es. un alert).

`UIRuntime.js` implementa questo contratto per la pagina completa, riusando i
propri helper DOM `getProgram()`/`isTrackActive()` e possedendo la mappatura
`style`/`mode`. `index.kids.html` implementa lo stesso contratto inline, in
modo indipendente da `UIRuntime.js`, a dimostrazione che il contratto è
genuinamente indifferente al markup: qualunque pagina che lo soddisfi può
guidare la stessa pipeline generativa, a prescindere dai propri controlli o id.

