# Architettura

Ogni classe ha una sola responsabilità. Le classi musicali ricevono e restituiscono dati semplici e non accedono al DOM.

## Pipeline

1. `AppController` fotografa i valori della UI e blocca l’interfaccia.
2. `SongGenerator` crea il brano teorico canonico.
3. `ArrangementGenerator` genera tutte le voci teoriche accessorie.
4. `MidiGenerator` traduce il brano in MIDI e filtra soltanto le tracce abilitate per l’esecuzione.
5. `AIImprover`, quando richiesto, elabora i byte MIDI e conserva l’originale in caso di errore.
6. Il controller pubblica un unico risultato finale per player, download e MP3.

La composizione, l’arrangiamento e la serializzazione MIDI sono sincroni. Sono asincroni soltanto gli aggiornamenti grafici e l’elaborazione AI.

## Modulazione finale

Quando la forma contiene almeno due chorus, `SongGenerator` può applicare casualmente `shiftSemitones: 1` all’ultimo chorus e alle sezioni successive, escluso l’outro. L’outro forza il ritorno a `shiftSemitones: 0`. La modulazione appartiene al brano teorico, non all’esecuzione MIDI.
