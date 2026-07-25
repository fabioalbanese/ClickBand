/*
 * ClickBand Junior — AIEngine.js
 * Loads Magenta lazily and applies drum humanization and melody reworking without touching the UI.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
(function(){
"use strict";

const CB_GROOVAE_CKPT = "https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/groovae_2bar_humanize";
const CB_MELVAE_CKPT = "https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small";
const CB_MAGENTA_SRC = "js/vendor/magentamusic.js";
const CB_STEPS_PER_QUARTER = 4;   
const CB_CHUNK_STEPS = 32;        




const CB_MEL_INSTRUMENT = 0;

let cbModelloGroove = null, cbGrooveLoading = null;
let cbModelloMel = null, cbMelodyLoading = null;



function cbLoadMagentaScript(){
    return new Promise((resolve, reject) => {
        if (typeof mm !== "undefined") { resolve(); return; }
        const esistente = document.querySelector('script[src="' + CB_MAGENTA_SRC + '"]');
        if (esistente) { esistente.addEventListener("load", () => resolve()); esistente.addEventListener("error", () => reject(new Error("Caricamento Magenta fallito"))); return; }
        const s = document.createElement("script");
        s.src = CB_MAGENTA_SRC;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Impossibile caricare " + CB_MAGENTA_SRC));
        document.head.appendChild(s);
    });
}

async function cbLoadGrooveModel(){
    if (cbModelloGroove) return cbModelloGroove;
    if (cbGrooveLoading) return cbGrooveLoading;
    cbGrooveLoading = (async () => {
        await cbLoadMagentaScript();
        if (typeof mm === "undefined") throw new Error("Magenta is not available after loading.");
        const mvae = new mm.MusicVAE(CB_GROOVAE_CKPT);
        await mvae.initialize();
        cbModelloGroove = mvae;
        return mvae;
    })();
    return cbGrooveLoading;
}

async function cbLoadMelodyModel(){
    if (cbModelloMel) return cbModelloMel;
    if (cbMelodyLoading) return cbMelodyLoading;
    cbMelodyLoading = (async () => {
        await cbLoadMagentaScript();
        if (typeof mm === "undefined") throw new Error("Magenta is not available after loading.");
        const mvae = new mm.MusicVAE(CB_MELVAE_CKPT);
        await mvae.initialize();
        cbModelloMel = mvae;
        return mvae;
    })();
    return cbMelodyLoading;
}

function cbQpmDi(ns){
    return (ns.tempos && ns.tempos.length && ns.tempos[0].qpm)
        ? ns.tempos[0].qpm
        : (typeof BPM !== "undefined" ? BPM : 120);
}








function cbSplitIntoFixedWindows(qns, chunkSteps){
    const total = qns.totalQuantizedSteps || 0;
    const numBlocchi = Math.max(1, Math.ceil(total / chunkSteps));
    const blocks = [];
    for (let b = 0; b < numBlocchi; b++) {
        const inizio = b * chunkSteps;
        const finish = inizio + chunkSteps;
        const blocco = mm.sequences.clone(qns);
        blocco.notes = qns.notes
            .filter(n => n.quantizedStartStep >= inizio && n.quantizedStartStep < finish)
            .map(n => {
                const copia = mm.NoteSequence.Note.create(n);
                copia.quantizedStartStep = n.quantizedStartStep - inizio;
                copia.quantizedEndStep = Math.max(copia.quantizedStartStep + 1, Math.min(n.quantizedEndStep, finish) - inizio);
                return copia;
            });
        blocco.totalQuantizedSteps = chunkSteps;
        blocks.push(blocco);
    }
    return blocks;
}




async function cbCodificaDecodifica(mvae, chunk, qpm, temperature){
    const z = await mvae.encode([chunk]);
    
    
    
    const decoded = await mvae.decode(z, temperature || undefined, undefined, undefined, qpm);
    z.dispose();
    return decoded[0];
}




async function cbHumanizeDrums(nsCompleta, onProgress){
    const mvae = await cbLoadGrooveModel();

    const drumNotes = nsCompleta.notes.filter(n => n.isDrum);
    if (!drumNotes.length) return nsCompleta; 

    const drumInstrument = drumNotes[0].instrument;
    const drumsNs = mm.sequences.clone(nsCompleta);
    drumsNs.notes = drumNotes.map(n => mm.NoteSequence.Note.create(n));

    const nsQuantizzata = mm.sequences.quantizeNoteSequence(drumsNs, CB_STEPS_PER_QUARTER);
    const chunks = cbSplitIntoFixedWindows(nsQuantizzata, CB_CHUNK_STEPS);
    if (!chunks.length) return nsCompleta; 

    const qpm = cbQpmDi(nsCompleta);
    const humanizedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
        if (onProgress) onProgress(i + 1, chunks.length);
        humanizedChunks.push(await cbCodificaDecodifica(mvae, chunks[i], qpm));
    }

    const concatenata = mm.sequences.concatenate(humanizedChunks);
    concatenata.notes.forEach(n => { n.instrument = drumInstrument; n.isDrum = true; });
    
    
    const nsUmanizzata = mm.sequences.isQuantizedSequence(concatenata)
        ? mm.sequences.unquantizeSequence(concatenata, qpm)
        : concatenata;

    return mm.sequences.replaceInstruments(nsCompleta, nsUmanizzata);
}


async function cbReworkMelody(nsCompleta, onProgress, temperature){
    const mvae = await cbLoadMelodyModel();

    const melNotes = nsCompleta.notes.filter(n => !n.isDrum && n.instrument === CB_MEL_INSTRUMENT);
    if (!melNotes.length) return nsCompleta; 

    const melodyInstrument = melNotes[0].instrument;
    const melodyProgram = melNotes[0].program; 
                                                    
                                                    
    
    
    
    const velocityMedia = Math.round(melNotes.reduce((s, n) => s + (n.velocity || 0), 0) / melNotes.length) || 80;

    const melNs = mm.sequences.clone(nsCompleta);
    melNs.notes = melNotes.map(n => mm.NoteSequence.Note.create(n));

    const nsQuantizzata = mm.sequences.quantizeNoteSequence(melNs, CB_STEPS_PER_QUARTER);
    const chunks = cbSplitIntoFixedWindows(nsQuantizzata, CB_CHUNK_STEPS);
    if (!chunks.length) return nsCompleta; 

    const qpm = cbQpmDi(nsCompleta);
    const variedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
        if (onProgress) onProgress(i + 1, chunks.length);
        variedChunks.push(await cbCodificaDecodifica(mvae, chunks[i], qpm, temperature));
    }

    const concatenata = mm.sequences.concatenate(variedChunks);
    concatenata.notes.forEach(n => {
        n.instrument = melodyInstrument;
        n.program = melodyProgram;
        n.isDrum = false;
        if (!n.velocity) n.velocity = velocityMedia;
    });
    if (!concatenata.notes.length) {
        throw new Error("the model returned no melody notes");
    }

    const nsVariata = mm.sequences.isQuantizedSequence(concatenata)
        ? mm.sequences.unquantizeSequence(concatenata, qpm)
        : concatenata;

    const nsFinale = mm.sequences.replaceInstruments(nsCompleta, nsVariata);
    const noteFinali = nsFinale.notes.filter(n => !n.isDrum && n.instrument === melodyInstrument);
    if (!noteFinali.length) {
        throw new Error("the melody is missing from the final reassembled file");
    }
    if (!noteFinali.some(n => n.velocity > 0)) {
        throw new Error("the melody is present but every note has velocity zero");
    }
    return nsFinale;
}





window.cbRunAIImprovement = async function(midiBytes, temperature, onProgress){
    await cbLoadMagentaScript();
    if (typeof mm === "undefined") throw new Error("Magenta is not available after loading.");

    const nsOriginale = mm.midiToSequenceProto(new Uint8Array(midiBytes));

    const sequenceWithDrums = await cbHumanizeDrums(nsOriginale, (i, tot) => {
        if (onProgress) onProgress("drums", i, tot);
    });

    const nsFinale = await cbReworkMelody(sequenceWithDrums, (i, tot) => {
        if (onProgress) onProgress("melody", i, tot);
    }, temperature);

    
    
    
    const actualEnd = ns => ns.notes.reduce((mx, n) => Math.max(mx, n.endTime || 0), 0);
    const originalDuration = actualEnd(nsOriginale);
    const finalDuration = actualEnd(nsFinale);
    if (originalDuration > 0 && (originalDuration - finalDuration) > 1) {
        throw new Error("the improved song is shorter than the original (" + Math.round(finalDuration) + "s instead of " + Math.round(originalDuration) + "s)");
    }

    return mm.sequenceProtoToMidi(nsFinale);
};



})();
