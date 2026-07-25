# Guida allo sviluppo

## Vincoli

- JavaScript classico tramite `<script src>`.
- Nessun modulo ES, bundler, framework o server obbligatorio.
- Funzionamento locale tramite `file://`.
- Nessun accesso al DOM nelle classi musicali.
- Inglese obbligatorio per identificatori, commenti, errori tecnici, test e chiavi dati canoniche.
- I testi destinati all’utente appartengono alle pagine HTML o a `Locale.js`.

## Nuova voce teorica

1. Generarla in `ArrangementGenerator` con gradi relativi.
2. Aggiungerne la traduzione in `MidiGenerator`.
3. Aggiungere i controlli in entrambe le pagine HTML.
4. Aggiungere testo inglese e traduzione italiana.
5. Estendere il test `tests/core-smoke.js`.

Le decisioni compositive appartengono a `SongGenerator`. Strumenti, volumi, BPM, tracce abilitate e serializzazione appartengono a `MidiGenerator`.
