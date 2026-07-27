# ClickBand

**Un sistema locale, spiegabile e non commerciale di composizione musicale procedurale.**

ClickBand trasforma un insieme di scelte musicali in un brano originale completo. Costruisce forma, armonia, ritmo melodico, melodia e arrangiamento, quindi traduce la composizione teorica in un file MIDI standard, riproducibile, modificabile ed esportabile localmente.

ClickBand non utilizza un modello di intelligenza artificiale per comporre. La musica nasce da regole musicali esplicite, scelte vincolate, sistemi di valutazione, casualità controllata e trasformazioni riproducibili. Il codice sorgente completo è incluso, così che il processo possa essere osservato, studiato e modificato.

Il progetto è distribuito gratuitamente per usi personali, educativi e comunque non commerciali. Funziona interamente nel browser: si scarica il file ZIP, lo si estrae e si apre l’interfaccia desiderata. Non richiede account, server, package manager, compilazione o connessione permanente a Internet.

**Autore:** Fabio Albanese  
**Licenza:** CC BY-NC 4.0 — attribuzione obbligatoria; l’uso commerciale richiede un’autorizzazione scritta separata.

## Prova online

[Apri la demo di ClickBand](https://www.scuolaclick.it/clickband_demo)

Il pacchetto scaricabile rimane completamente utilizzabile offline e non dipende dalla disponibilità della demo pubblica.

---

## Due interfacce, un unico motore compositivo

ClickBand presenta lo stesso motore musicale attraverso due esperienze differenti.

### Interfaccia Kids

L’interfaccia Kids è volutamente ristretta, visuale e immediata. Permette ai bambini di creare musica senza esporli all’intero insieme dei parametri tecnici.

L’utente sceglie stile, atmosfera, velocità, sezioni del brano e configurazione della band attraverso un percorso guidato. Queste decisioni semplici vengono tradotte in una configurazione completa per il motore condiviso.

Punti di ingresso:

- `index.kids.html` — interfaccia Kids in inglese;
- `index.kids.it.html` — interfaccia Kids in italiano.

### Interfaccia parametrica completa

L’interfaccia completa espone un controllo più dettagliato sulla composizione e sulla realizzazione sonora. È pensata per docenti, musicisti, sviluppatori e utenti curiosi di osservare come ogni parametro influenzi il risultato.

Può esporre controlli relativi a:

- stile;
- tonica e modo;
- tempo;
- forma e numero delle sezioni;
- tracce attive;
- strumenti General MIDI;
- livelli delle singole parti;
- umanizzazione MIDI e intensità;
- riproduzione, trasposizione ed esportazione;
- rigenerazione del MIDI senza ricomporre il brano teorico.

Punti di ingresso:

- `index.html` — interfaccia completa in inglese;
- `index.it.html` — interfaccia completa in italiano.

Entrambe implementano lo stesso contratto `ClickBandUIAdapter` e pilotano il medesimo `AppController`. L’interfaccia può quindi cambiare senza modificare il nucleo musicale.

```text
UI Kids ───────┐
               ├── ClickBandUIAdapter
UI completa ───┘          ↓
                    AppController
                          ↓
                 motore musicale comune
```

---

## Che cosa genera ClickBand

Un brano ClickBand non viene assemblato usando loop preregistrati. Il sistema crea una composizione teorica che comprende:

- forma del brano;
- occorrenze delle sezioni e varianti di frase;
- identità tematica;
- progressioni armoniche;
- ritmo melodico;
- melodia principale;
- pattern di batteria;
- voci accessorie arrangiate;
- contesti tonali locali ed eventuale modulazione strutturale;
- informazioni necessarie alla realizzazione MIDI.

Il MIDI finale può contenere tracce separate per melodia, basso, batteria, arpeggio, chitarra, pad, controcanto, ostinato, cromatismi, effetti, coro, ottoni, archi e chitarra solista. La scelta delle tracce da rendere appartiene alla fase esecutiva: il modello può conservare molte voci mentre l’utente decide quali ascoltare.

---

## Come nasce un brano

ClickBand funziona come una catena di moduli specializzati. Ogni modulo riceve dati strutturati dal precedente e possiede una responsabilità limitata e dichiarata.

```text
Scelte dell’utente
       ↓
Struttura e piano tonale
       ↓
Tema e progressioni armoniche
       ↓
Ritmo melodico
       ↓
Melodia principale
       ↓
Arrangiamento delle voci accessorie
       ↓
Generazione del MIDI standard
       ↓
Umanizzazione deterministica facoltativa
       ↓
Riproduzione / download MIDI / rendering MP3 locale
```

### 1. Scelte musicali iniziali

Il processo parte da una configurazione che può contenere tonica, modo, stile, tempo e forma. L’interfaccia completa espone molti parametri direttamente; quella Kids li ricava da un insieme più ridotto di scelte visuali.

Questi valori definiscono il contesto musicale, ma non producono direttamente le note.

### 2. Forma e piano delle sezioni

Il brano è organizzato in sezioni come introduzione, strofa, ritornello, ponte e finale. La stessa sezione può ricomparire, permettendo il ritorno di un’identità musicale con variazioni controllate.

Il piano strutturale conserva anche il contesto tonale di ogni occorrenza. Ciò permette, per esempio, di descrivere un innalzamento finale di semitono senza riscrivere l’intero modello teorico come note MIDI fisse.

### 3. Generazione del tema

Il materiale tematico viene rappresentato attraverso i gradi della scala, non mediante altezze assolute. Per esempio:

```text
1 – 3 – 5 – 4
```

corrisponde a note diverse in tonalità diverse, pur mantenendo la stessa relazione melodica.

Il tema fornisce materiale riconoscibile alla melodia. Le varianti trasformano il materiale precedente invece di generare ogni frase come contenuto indipendente. Il sistema ricorda inoltre le firme recenti per ridurre le ripetizioni immediate.

### 4. Armonia

Anche le progressioni sono rappresentate in modo relativo, attraverso funzioni e gradi. Una sequenza come:

```text
I – V – vi – IV
```

può quindi essere riutilizzata in tonalità differenti.

La selezione dipende da modo, stile e funzione della sezione. L’armonia costituisce un vincolo strutturale per melodia e arrangiamento, non un elenco fisso di note MIDI.

### 5. Ritmo melodico

Prima di scegliere l’altezza delle note, ClickBand decide **quando** iniziano e **quanto** durano.

Il generatore lavora su una griglia di sedici posizioni per battuta e utilizza famiglie ritmiche controllate, come `sparse`, `regular`, `syncopated` e `flowing`. Verifica distanze minime, confini della battuta e chiusura della frase.

Nelle battute centrali molto dense può essere inserita anche una pausa intenzionale e protetta. Non si tratta semplicemente di cancellare una nota: il silenzio diventa una cesura fraseologica e la nota precedente non può prolungarsi al suo interno. La pausa può quindi comportarsi come una virgola musicale fra un motivo e la sua risposta.

### 6. Costruzione della melodia

La melodia principale nasce dall’interazione fra:

- obiettivi tematici;
- attacchi ritmici;
- accordo corrente;
- accordo successivo;
- nota melodica precedente;
- forza metrica;
- funzione della sezione;
- preferenze stilistiche;
- regole cadenzali e limiti di registro.

Per ogni attacco vengono valutati i possibili gradi della scala. Le posizioni forti tendono a privilegiare la stabilità armonica, mentre quelle deboli possono sostenere movimenti di passaggio. Il sistema controlla inoltre ripetizioni, ampiezza degli intervalli, direzione e collocazione d’ottava.

La melodia segue quindi vincoli musicali senza diventare una copia rigida del tema iniziale.

### 7. Arrangiamento

`ArrangementGenerator` espande il brano canonico in un arrangiamento teorico completo. Ogni voce segue regole coerenti con il proprio ruolo.

Per esempio:

- il basso deriva il movimento da fondamentali e quinte;
- gli arpeggi percorrono le note dell’accordo;
- i pad sostengono il campo armonico;
- la chitarra usa pattern differenti secondo lo stile;
- il controcanto entra dove la melodia lascia spazio;
- i cromatismi preparano l’accordo successivo;
- archi, ottoni e coro rafforzano determinate sezioni;
- la batteria dipende da stile, densità e posizione formale.

L’arrangiamento rimane teorico: le note sono ancora descritte tramite gradi, ottave relative e alterazioni.

### 8. Generazione MIDI

`MidiGenerator` traduce la rappresentazione teorica in un file MIDI standard.

Per ogni nota combina:

```text
nota MIDI della tonica
+ intervallo del grado
+ spostamento d’ottava
+ alterazione
+ trasposizione del contesto locale
```

Crea inoltre:

- tracce e canali MIDI separati;
- programmi General MIDI;
- volumi delle tracce;
- eventi Note On e Note Off;
- metadati di tempo e indicazione metrica;
- eventi di tonalità quando cambia il contesto strutturale.

Il generatore può lavorare sia sul brano canonico sia sul brano arrangiato completo.

### 9. Umanizzazione deterministica facoltativa

Un MIDI perfettamente quantizzato può risultare meccanico. ClickBand può quindi applicare piccole variazioni locali a timing, velocity e durata.

Le tracce vengono trattate in modo differente:

- i colpi strutturali della batteria sono protetti;
- gli attacchi melodici importanti sono protetti;
- le note dello stesso accordo rimangono unite;
- le parti sostenute ricevono variazioni più leggere;
- gli interventi restano abbastanza piccoli da non modificare la composizione.

L’umanizzazione è deterministica: la stessa sorgente e lo stesso seed producono lo stesso risultato. Se la fase non è disponibile o fallisce, `MidiImprover` conserva il MIDI originale.

---

## Composizione e realizzazione sono separate

Una delle idee architetturali centrali è la distinzione fra il brano e le impostazioni con cui viene eseguito.

```text
Parametri compositivi
→ forma, armonia, tema, ritmo e melodia

Parametri di arrangiamento
→ voci musicali accessorie

Parametri MIDI
→ strumenti, tracce attive, livelli e realizzazione del tempo

Parametri di umanizzazione
→ piccole variazioni esecutive
```

L’interfaccia completa può rigenerare il MIDI a partire dal brano teorico arrangiato già presente in memoria. Cambiare strumento, volume o traccia attiva non richiede una nuova composizione.

---

## Casualità controllata e riproducibilità

ClickBand utilizza casualità, ma non sceglie liberamente fra note arbitrarie.

Ogni decisione avviene all’interno di uno spazio definito da armonia, modo, stile, funzione formale, ritmo, registro e continuità melodica. Quando viene utilizzato un seed, la stessa configurazione può riprodurre lo stesso risultato.

La variazione rimane quindi osservabile e non diventa una scatola nera.

---

## Perché ClickBand non è un generatore musicale AI

ClickBand non usa una rete neurale addestrata su un catalogo di brani. Non invia prompt a un servizio remoto e non chiede a un modello di prevedere l’evento musicale successivo.

Le decisioni derivano da:

- regole esplicite;
- strutture musicali dichiarate;
- librerie di pattern;
- funzioni di valutazione;
- trasformazioni deterministiche;
- selezione casuale vincolata;
- contratti dati verificati.

È quindi più corretto descriverlo come **sistema di composizione musicale procedurale** o **generatore musicale algoritmico**.

Il termine *generativo* non implica necessariamente l’uso dell’intelligenza artificiale. ClickBand è generativo perché crea nuovi brani a partire da regole e parametri, mantenendo però tali regole visibili e analizzabili.

---

## Valore didattico

ClickBand è stato progettato da un insegnante ed ex analista programmatore. La sua architettura riflette entrambe le prospettive: rendere accessibile la creazione musicale e mantenere spiegabile ciò che avviene.

In un contesto educativo può aiutare a osservare relazioni come:

```text
modo maggiore / minore → diversa struttura degli intervalli
tempo più lento        → diversa percezione di densità e durata
ritornello              → profilo formale e strumentale più forte
modulazione             → tutte le parti passano a un nuovo contesto tonale
pausa                   → il silenzio diventa parte della frase
```

Gli studenti possono confrontare versioni dello stesso brano e comprendere il ruolo di forma, armonia, ritmo, melodia, arrangiamento e timbro.

Poiché tutto funziona localmente, una scuola può usare ClickBand senza creare account per gli studenti e senza inviare scelte musicali o dati del progetto a una piattaforma esterna.

---

## Storytelling sonoro

ClickBand può sostenere anche attività di storytelling sonoro. Una sequenza narrativa può essere tradotta in una successione musicale controllata:

```text
partenza → esplorazione → pericolo → incontro → ritorno
```

Ogni scena può influenzare modo, densità, registro, strumentazione, dinamica e trasformazione tematica. Questo approccio non richiede necessariamente l’interpretazione di testo tramite AI: uno storyboard visuale o un sistema di regole può collegare direttamente le scelte narrative ai parametri musicali.

Lo stesso tema può ritornare con un registro, un ritmo, un modo o una strumentazione differente, dando a personaggi ed eventi un’identità musicale riconoscibile.

---

## Uso locale e autonomo

L’uso normale di ClickBand avviene interamente nel browser e in locale.

1. Scaricare il pacchetto ZIP completo.
2. Estrarre tutti i file conservando la struttura delle cartelle.
3. Aprire uno dei quattro punti di ingresso HTML.
4. Generare, ascoltare ed esportare il brano.

Node.js non è necessario per usare l’applicazione. Serve soltanto per eseguire la suite di test automatici.

Il pacchetto include i moduli originali e le dipendenze browser necessarie. I componenti di terze parti conservano le rispettive licenze; consultare `THIRD_PARTY_NOTICES.md`.

---

## Riutilizzare il motore senza le interfacce incluse

Il nucleo di ClickBand può essere integrato in un’altra interfaccia browser. Qualsiasi front end può pilotare `AppController` implementando il contratto documentato `window.ClickBandUIAdapter`.

Documenti principali:

- [`docs/REUSE_GUIDE.it.md`](docs/REUSE_GUIDE.it.md) — esempi di integrazione ed estensione;
- [`docs/API_REFERENCE.it.md`](docs/API_REFERENCE.it.md) — costruttori, metodi e configurazioni pubbliche;
- [`docs/DATA_MODEL.it.md`](docs/DATA_MODEL.it.md) — contratti dei dati canonici e arrangiati;
- [`docs/ARCHITECTURE.it.md`](docs/ARCHITECTURE.it.md) — responsabilità e confini della pipeline;
- [`docs/DEVELOPMENT.it.md`](docs/DEVELOPMENT.it.md) — regole di sviluppo e rilascio.

---

## Struttura del repository

```text
index.html                  UI completa inglese
index.it.html               UI completa italiana
index.kids.html             UI Kids inglese
index.kids.it.html          UI Kids italiana

js/                         moduli originali del progetto
js/vendor/                  librerie browser di terze parti incluse
css/                        stile delle interfacce
docs/                       documentazione tecnica bilingue
tests/                      test automatici della pipeline e dei contratti
licenses/                   testi delle licenze di terze parti
MIDIs/                      esempi di file MIDI generati

README.md                   presentazione del progetto in inglese
README.it.md                presentazione del progetto in italiano
LICENSE                     licenza del progetto
THIRD_PARTY_NOTICES.md      note sulle dipendenze
CHANGELOG.md                cronologia delle versioni
```

---

## Test

Con Node.js installato è possibile eseguire il test principale:

```bash
node tests/core-smoke.js
```

Gli altri test coprono, fra l’altro:

- programmi MIDI per tutti gli stili;
- contratto dell’adapter UI;
- contratto dell’interfaccia Kids;
- modulazione finale del ritornello;
- vincoli del ritmo melodico;
- umanizzazione MIDI;
- protezione temporale di batteria e melodia;
- filtro delle tracce e generazione MIDI.

---

## Gratuito per scelta, non commerciale per licenza

ClickBand è condiviso gratuitamente perché il suo autore desidera che venga usato, studiato, adattato e migliorato, soprattutto per finalità educative e creative personali.

È possibile condividere e adattare il codice originale di ClickBand per usi non commerciali, a condizione di:

1. attribuire correttamente il lavoro a Fabio Albanese;
2. fare riferimento alla licenza CC BY-NC 4.0;
3. indicare le eventuali modifiche;
4. non suggerire un’approvazione dell’autore.

L’uso commerciale non è consentito senza un’autorizzazione scritta separata.

ClickBand non può quindi essere semplicemente reimpacchettato, venduto, incluso in un prodotto a pagamento o utilizzato come base di un servizio commerciale soltanto perché il suo codice sorgente è disponibile.

L’intenzione è semplice:

> ClickBand viene regalato alla comunità affinché le persone possano creare e imparare, non perché qualcun altro monetizzi il lavoro condiviso gratuitamente.

Per i termini completi consultare [`LICENSE`](LICENSE). Le librerie e le risorse di terze parti rimangono soggette alle proprie licenze, elencate in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

---

## Identità del progetto

ClickBand unisce due obiettivi:

- rendere la creazione musicale accessibile a bambini e non specialisti;
- offrire a docenti, musicisti e sviluppatori una struttura sufficientemente visibile e controllabile da poter essere compresa ed estesa.

Non nasconde la composizione dietro una scatola nera remota. Mette a disposizione sia la musica generata sia i meccanismi che l’hanno prodotta.
