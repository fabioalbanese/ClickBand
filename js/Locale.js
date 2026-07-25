/*
 * ClickBand Junior — Locale.js
 * Provides runtime localization without coupling music-domain classes to the DOM.
 * English is the canonical source language; Italian is a presentation translation.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";
(function (global) {
  var locale = document.documentElement.lang === "it" ? "it" : "en";
  var dictionary = {
    "Generation completed. The theoretical song and AI-improved MIDI are ready.": "Generazione completata. Il brano teorico e il MIDI migliorato con AI sono pronti.",
    "Generation completed. The theoretical song and original MIDI are ready.": "Generazione completata. Il brano teorico e il MIDI originale sono pronti.",
    "MIDI regenerated and improved with AI. The theoretical song was not modified.": "MIDI rigenerato e migliorato con AI. Il brano teorico non è stato modificato.",
    "Original MIDI regenerated. The theoretical song was not modified.": "MIDI originale rigenerato. Il brano teorico non è stato modificato.",
    "Generating the theoretical song…": "Generazione del brano teorico…",
    "Generating all theoretical voices…": "Generazione di tutte le voci teoriche…",
    "Rendering MIDI…": "Creazione del MIDI…",
    "Applying AI improvement…": "Applicazione del miglioramento AI…",
    "Regenerating MIDI from the theoretical song in memory…": "Rigenerazione del MIDI dal brano teorico in memoria…",
    "Generate a song first.": "Genera prima un brano.",
    "Generate a song to prepare the MIDI player.": "Genera un brano per preparare il player MIDI.",
    "Ready.": "Pronto.",
    "Stopped.": "Fermato.",
    "MP3 is not ready yet.": "L’MP3 non è ancora pronto.",
    "Generate the MP3 first.": "Genera prima l’MP3.",
    "Audio rendering is still in progress…": "La preparazione dell’audio è ancora in corso…",
    "AI engine is unavailable. The original MIDI was preserved.": "Il motore AI non è disponibile. È stato conservato il MIDI originale.",
    "No blocks yet: add Intro, Verse or Chorus.": "Nessun blocco: aggiungi Intro, Verse o Chorus.",
    "Remove": "Rimuovi",
    "Add one phrase (2 bars)": "Aggiungi una frase (2 battute)",
    "Remove one phrase (2 bars)": "Rimuovi una frase (2 battute)",
    "Track": "Traccia",
    "Track volume": "Volume traccia",
    "All five sections (intro, verse, chorus, bridge and outro) are generated in memory.": "Tutte le cinque sezioni (intro, verse, chorus, bridge e outro) vengono generate in memoria.",
    "Only sections selected in the structure are appended to the MIDI.": "Solo le sezioni selezionate nella struttura vengono aggiunte al MIDI.",
    "🧱 EMPTY STRUCTURE\nAdd one or more blocks to generate a new song.": "🧱 STRUTTURA VUOTA\nAggiungi uno o più blocchi per generare un nuovo brano.",
    "Pause": "Pausa",
    "Instrument": "Strumento",
    "Tracks will appear after generation.": "Le tracce appariranno dopo la generazione."
  };

  var italianInstrumentNames = ["Pianoforte a coda", "Pianoforte acustico brillante", "Pianoforte a coda elettrico", "Pianoforte honky-tonk", "Pianoforte elettrico 1", "Pianoforte elettrico 2", "Clavicembalo", "Clavicordo", "Celesta", "Glockenspiel", "Carillon", "Vibrafono", "Marimba", "Xilofono", "Campane tubolari", "Dulcimer", "Organo drawbar", "Organo percussivo", "Organo rock", "Organo da chiesa", "Organo ad ance", "Fisarmonica", "Armonica", "Fisarmonica tango", "Chitarra acustica (nylon)", "Chitarra acustica (acciaio)", "Chitarra elettrica (jazz)", "Chitarra elettrica (pulita)", "Chitarra elettrica (muted)", "Chitarra overdrive", "Chitarra distorta", "Armonici di chitarra", "Basso acustico", "Basso elettrico (dita)", "Basso elettrico (plettro)", "Basso fretless", "Basso slap 1", "Basso slap 2", "Basso synth 1", "Basso synth 2", "Violino", "Viola", "Violoncello", "Contrabbasso", "Archi tremolo", "Archi pizzicato", "Arpa orchestrale", "Timpani", "Ensemble d’archi 1", "Ensemble d’archi 2", "Archi synth 1", "Archi synth 2", "Coro Aah", "Voci Ooh", "Voce synth", "Colpo orchestrale", "Tromba", "Trombone", "Tuba", "Tromba con sordina", "Corno francese", "Sezione ottoni", "Ottoni synth 1", "Ottoni synth 2", "Sax soprano", "Sax contralto", "Sax tenore", "Sax baritono", "Oboe", "Corno inglese", "Fagotto", "Clarinetto", "Ottavino", "Flauto", "Flauto dolce", "Flauto di Pan", "Bottiglia soffiata", "Shakuhachi", "Fischietto", "Ocarina", "Lead 1 (onda quadra)", "Lead 2 (dente di sega)", "Lead 3 (calliope)", "Lead 4 (chiff)", "Lead 5 (charang)", "Lead 6 (voce)", "Lead 7 (quinte)", "Lead 8 (basso + lead)", "Pad 1 (new age)", "Pad 2 (caldo)", "Pad 3 (polysynth)", "Pad 4 (coro)", "Pad 5 (arco)", "Pad 6 (metallico)", "Pad 7 (halo)", "Pad 8 (sweep)", "FX 1 (pioggia)", "FX 2 (colonna sonora)", "FX 3 (cristallo)", "FX 4 (atmosfera)", "FX 5 (luminosità)", "FX 6 (goblin)", "FX 7 (echi)", "FX 8 (fantascienza)", "Sitar", "Banjo", "Shamisen", "Koto", "Kalimba", "Cornamusa", "Fiddle", "Shanai", "Campanello", "Agogo", "Steel drum", "Woodblock", "Tamburo taiko", "Tom melodico", "Tamburo synth", "Piatto rovesciato", "Rumore tasti chitarra", "Rumore di respiro", "Risacca", "Cinguettio", "Squillo telefonico", "Elicottero", "Applauso", "Sparo"];

  function instrumentName(program, englishLabel) {
    if (locale !== "it") return englishLabel;
    var prefix = /^\s*([^A-Za-zÀ-ÿ0-9]*)/.exec(englishLabel);
    return (prefix ? prefix[1] : "") + (italianInstrumentNames[program] || englishLabel);
  }

  function translate(text) {
    if (locale !== "it" || typeof text !== "string") return text;
    if (dictionary[text]) return dictionary[text];
    return text
      .replace(/^Track (\d+)$/, "Traccia $1")
      .replace(/^AI improvement: drums /, "Miglioramento AI: batteria ")
      .replace(/^AI improvement: melody /, "Miglioramento AI: melodia ")
      .replace(/^Generation error: /, "Errore di generazione: ")
      .replace(/^MIDI regeneration error: /, "Errore nella rigenerazione MIDI: ")
      .replace(/^MP3 ready /, "MP3 pronto ")
      .replace(/^MP3 was not created /, "MP3 non creato ");
  }

  function localizeNode(root) {
    if (locale !== "it" || !root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var raw = node.nodeValue;
      var trimmed = raw.trim();
      if (!trimmed) continue;
      var translated = translate(trimmed);
      if (translated !== trimmed) node.nodeValue = raw.replace(trimmed, translated);
    }
    if (root.querySelectorAll) {
      root.querySelectorAll("[title],[placeholder]").forEach(function (element) {
        ["title", "placeholder"].forEach(function (attribute) {
          if (element.hasAttribute(attribute)) element.setAttribute(attribute, translate(element.getAttribute(attribute)));
        });
      });
    }
  }

  global.ClickBandLocale = Object.freeze({ locale: locale, translate: translate, localizeNode: localizeNode, instrumentName: instrumentName });
  document.addEventListener("DOMContentLoaded", function () {
    localizeNode(document.body);
    if (locale === "it" && global.MutationObserver) {
      new MutationObserver(function (records) {
        records.forEach(function (record) {
          record.addedNodes.forEach(function (node) {
            localizeNode(node.nodeType === 1 ? node : node.parentNode);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  });
})(window);
