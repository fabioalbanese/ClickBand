/*
 * ClickBand Junior — AudioController.js
 * Owns MP3 rendering, audio-player state and mutual exclusion between playback engines.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
(function(){
"use strict";

const CB_SF_COMPANION = "js/vendor/clickband_soundfont.js";

let cbState = "empty";
let cbSfBuffer = null;
let cbBank = null;
let cbMp3Blob = null, cbMp3Url = null;
let cbAudio = null;
let cbRenderToken = 0;

function cbStatus(msg){
    if (window.ClickBandUIAdapter && typeof window.ClickBandUIAdapter.setStatus === "function") { window.ClickBandUIAdapter.setStatus(msg); return; }
    if (typeof bjStatus === "function") bjStatus(msg);
}
function cbEl(id){ return document.getElementById(id); }



function cbB64ToBuf(b64){
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) u8[i] = bin.charCodeAt(i);
    return u8.buffer;
}

function cbLoadCompanionScript(src){
    return new Promise(resolve => {
        let fatto = false;
        const finish = v => { if (!fatto) { fatto = true; resolve(v); } };
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => finish(true);
        s.onerror = () => finish(false);
        document.head.appendChild(s);
        setTimeout(() => finish(false), 20000); 
    });
}

async function cbTrovaSoundfont(){
    if (cbSfBuffer) return cbSfBuffer;
    cbStatus("Carico i sounds (soundfont)\u2026");

    if (typeof window.CLICKBAND_SF_B64 === "string") {
        try {
            cbSfBuffer = cbB64ToBuf(window.CLICKBAND_SF_B64);
            window.CLICKBAND_SF_B64 = null;
            return cbSfBuffer;
        } catch(e) {  }
    }
    const ok = await cbLoadCompanionScript(CB_SF_COMPANION);
    if (ok && typeof window.CLICKBAND_SF_B64 === "string") {
        try {
            cbSfBuffer = cbB64ToBuf(window.CLICKBAND_SF_B64);
            window.CLICKBAND_SF_B64 = null;
            return cbSfBuffer;
        } catch(e) {  }
    }
    return null;
}

function cbOttieniBank(){
    if (!cbBank) cbBank = SpessaSynthCore.SoundBankLoader.fromArrayBuffer(cbSfBuffer);
    return cbBank;
}

window.cbSetSoundfont = function(buf){ cbSfBuffer = buf; cbBank = null; };



async function cbRenderPCM(midiBytes, token, onProgress){
    const S = SpessaSynthCore;
    const ab = midiBytes.buffer.slice(midiBytes.byteOffset, midiBytes.byteOffset + midiBytes.byteLength);
    const midi = S.BasicMIDI.fromArrayBuffer(ab);
    const sr = 44100;
    const synth = new S.SpessaSynthProcessor(sr, { eventsEnabled: false });
    synth.soundBankManager.addSoundBank(cbOttieniBank(), "main");
    await synth.processorInitialized;
    synth.setSystemParameter("autoAllocateVoices", true);
    const seq = new S.SpessaSynthSequencer(synth);
    seq.loadNewSongList([midi]);
    seq.play();

    const total = Math.ceil(sr * (midi.duration + 1.2));
    const L = new Float32Array(total), R = new Float32Array(total);
    let riempiti = 0;
    const BUF = 128;
    const PASSO = sr;
    while (riempiti < total) {
        if (token !== cbRenderToken) return null;
        const target = Math.min(riempiti + PASSO, total);
        while (riempiti < target) {
            seq.processTick();
            const n = Math.min(BUF, total - riempiti);
            synth.process(L, R, riempiti, n);
            riempiti += n;
        }
        if (onProgress) onProgress(riempiti / total);
        await new Promise(r => setTimeout(r, 0));
    }
    return { L, R, sr };
}

function cbGuadagnoNormalizzazione(L, R){
    let picco = 0;
    for (let i=0;i<L.length;i++){ const a = Math.abs(L[i]); if (a > picco) picco = a; }
    for (let i=0;i<R.length;i++){ const a = Math.abs(R[i]); if (a > picco) picco = a; }
    return picco > 0.0001 ? Math.min(3, 0.89 / picco) : 1;
}

function cbEncodeMp3(pcm){
    const { L, R, sr } = pcm;
    const g = cbGuadagnoNormalizzazione(L, R);
    const toI16 = f => {
        const or = new Int16Array(f.length);
        for (let i=0;i<f.length;i++){
            const s = Math.max(-1, Math.min(1, f[i]*g));
            or[i] = s < 0 ? s*32768 : s*32767;
        }
        return or;
    };
    const l16 = toI16(L), r16 = toI16(R);
    const enc = new lamejs.Mp3Encoder(2, sr, 192);
    const chunks = [];
    const BLK = 1152;
    for (let i=0;i<l16.length;i+=BLK) {
        const b = enc.encodeBuffer(l16.subarray(i, i+BLK), r16.subarray(i, i+BLK));
        if (b.length) chunks.push(new Uint8Array(b));
    }
    const tail = enc.flush();
    if (tail.length) chunks.push(new Uint8Array(tail));
    return new Blob(chunks, { type: "audio/mpeg" });
}




function cbStopAll(){
    if (cbAudio) { try { cbAudio.pause(); cbAudio.currentTime = 0; } catch(e){} }
    try { if (typeof Tone !== "undefined" && Tone.Transport) Tone.Transport.stop(); } catch(e){}
    try { bjPlaying = false; bjPausedAt = 0; } catch(e){}
    const bar = cbEl("bjBar"); if (bar) bar.style.width = "0%";
    const now = cbEl("bjNow"); if (now) now.textContent = "0:00";
    try { bjDraw(0); } catch(e){}
}

function cbSetEnabled(id, on){
    const el = cbEl(id);
    if (el) el.disabled = !on;
}

function cbSyncMp3Controls(){
    const audioOk = cbState === "mp3Ready" || cbState === "fallback";
    const midiOk = cbState === "midiReady" || cbState === "mp3Ready" || cbState === "fallback";
    const downloadOk = cbState === "mp3Ready" && cbMp3Blob instanceof Blob && cbMp3Blob.size > 0;

    cbSetEnabled("cbGenerateMp3Button", midiOk);
    cbSetEnabled("cbBtnPlay", audioOk);
    cbSetEnabled("cbBtnPause", audioOk);
    cbSetEnabled("cbBtnStop", audioOk);
    cbSetEnabled("cbMp3Button", downloadOk);
}

function cbSetState(nextState){
    cbState = nextState;
    cbSyncMp3Controls();
    try { window.dispatchEvent(new CustomEvent("clickband:audio-state", { detail: { state: cbState, downloadReady: cbMp3Blob instanceof Blob && cbMp3Blob.size > 0 } })); } catch(e) {}
}




function cbResetMp3(){
    cbRenderToken++; 
    cbStopAll();
    cbMp3Blob = null;
    if (cbMp3Url) { try { URL.revokeObjectURL(cbMp3Url); } catch(e){} cbMp3Url = null; }
    const midiReady = !!(window.ClickBandEngine && window.ClickBandEngine.getMidi && window.ClickBandEngine.getMidi());
    cbSetState(midiReady ? "midiReady" : "empty");
}

async function cbStartMp3Render(){
    const engineMidi = window.ClickBandEngine && window.ClickBandEngine.getMidi ? window.ClickBandEngine.getMidi() : null;
    const legacyMidi = (typeof song !== "undefined" && song) ? song.midiBytes : null;
    const sourceMidi = engineMidi || legacyMidi;
    if (!sourceMidi) return;
    const token = ++cbRenderToken;

    cbStopAll();
    cbMp3Blob = null;
    if (cbMp3Url) { try { URL.revokeObjectURL(cbMp3Url); } catch(e){} cbMp3Url = null; }
    cbSetState("rendering");

    const genBtn = cbEl("cbGenerateMp3Button");
    const genBtnTestoOriginale = genBtn ? genBtn.textContent : "";
    if (genBtn) genBtn.textContent = "\u23f3 Genero MP3\u2026";

    const sf = await cbTrovaSoundfont();
    if (token !== cbRenderToken) return;
    if (!sf || typeof SpessaSynthCore === "undefined" || typeof lamejs === "undefined") {
        cbSetState("fallback");
        if (genBtn) genBtn.textContent = genBtnTestoOriginale || "\ud83c\udfb5 Generate MP3";
        cbStatus("Suoni di qualit\u00e0 not trovati (file \u201cclickband_soundfont.js\u201d mancante or corrotto in js/vendor/). The player user\u00e0 i sounds base.");
        return;
    }

    try {
        cbStatus("Creo l\u2019MP3\u2026 0%");
        const pcm = await cbRenderPCM(new Uint8Array(sourceMidi), token,
            p => cbStatus("Creo l\u2019MP3\u2026 " + Math.round(p*100) + "%"));
        if (!pcm || token !== cbRenderToken) return;
        cbStatus("Comprimo in MP3\u2026");
        await new Promise(r => setTimeout(r, 10));
        const blob = cbEncodeMp3(pcm);
        if (token !== cbRenderToken) return;

        cbMp3Blob = blob;
        try { cbMp3Url = URL.createObjectURL(blob); } catch(e) { cbMp3Url = null; }
        if (cbMp3Url) {
            if (!cbAudio) {
                cbAudio = new Audio();
                cbAudio.addEventListener("timeupdate", cbAggiornaPosizione);
                cbAudio.addEventListener("ended", () => { cbStopAll(); cbStatus("End of the song. Premi \u25b6 Play per riascoltarlo."); });
            }
            cbAudio.src = cbMp3Url;
            const vol = cbEl("bjVolume");
            cbAudio.volume = vol ? vol.value/100 : 0.8;
            cbAudio.playbackRate = 1;
        }
        cbSetState("mp3Ready");
        // Other UI updates may run in the same event loop. Re-apply the MP3 state
        // after painting so the download button cannot remain disabled.
        requestAnimationFrame(() => {
            cbSyncMp3Controls();
            requestAnimationFrame(cbSyncMp3Controls);
        });
        cbStatus(document.documentElement.lang === "it" ? "MP3 pronto." : "MP3 ready.");
    } catch (e) {
        console.error("Render MP3:", e);
        cbSetState("fallback");
        cbStatus("MP3 was not created (" + e.message + "). The player user\u00e0 i sounds base.");
    } finally {
        if (genBtn) genBtn.textContent = genBtnTestoOriginale || "\ud83c\udfb5 Generate MP3";
        cbSyncMp3Controls();
    }
}

function cbAggiornaPosizione(){
    if (!cbAudio) return;
    const pos = cbAudio.currentTime;
    const dur = cbAudio.duration || 0;
    const now = cbEl("bjNow"); if (now) now.textContent = bjFmt(pos);
    const dEl = cbEl("bjDur"); if (dEl && dur) dEl.textContent = bjFmt(dur);
    const bar = cbEl("bjBar"); if (bar && dur) bar.style.width = Math.min(100, pos/dur*100) + "%";
    try { bjDraw(pos); } catch(e){}
}



const _play = window.bjPlayerPlay, _pause = window.bjPlayerPause;

window.bjPlayerPlay = async function(){
    if (cbState === "empty" || cbState === "midiReady") { cbStatus("Generate first l\u2019MP3 with \u201cGenera MP3\u201d."); return; }
    if (cbState === "rendering") { cbStatus("A attimo: sto ancora preparing l\u2019audio\u2026"); return; }

    if (cbState === "mp3Ready" && cbAudio && cbMp3Blob) {
        
        try { if (typeof Tone !== "undefined" && Tone.Transport) Tone.Transport.stop(); } catch(e){}
        try { bjPlaying = false; } catch(e){}
        try { await cbAudio.play(); cbStatus("\u25b6 In riproduzione."); }
        catch(e){ cbStatus("Riproduzione not avviata: " + e.message); }
        return;
    }
    
    if (cbAudio) { try { cbAudio.pause(); } catch(e){} }
    return _play();
};

window.bjPlayerPause = function(){
    if (cbAudio && !cbAudio.paused) { cbAudio.pause(); cbStatus("Rest."); return; }
    return _pause();
};


window.bjPlayerStop = function(){
    cbStopAll();
    cbStatus(cbState === "mp3Ready" || cbState === "fallback" ? "Ready." : "Stopped.");
};



(function agganciaControlli(){
    const vol = cbEl("bjVolume");
    if (vol) vol.addEventListener("input", () => { if (cbAudio) cbAudio.volume = vol.value/100; });
    const time = cbEl("bjTempo");
    if (time) time.addEventListener("input", () => {
        if (cbAudio) { cbAudio.playbackRate = time.value/100; try { cbAudio.preservesPitch = true; } catch(e){} }
    });
    const prog = cbEl("bjProgress");
    if (prog) prog.addEventListener("click", ev => {
        if (cbState !== "mp3Ready" || !cbAudio || !cbAudio.duration) return;
        const r = prog.getBoundingClientRect();
        cbAudio.currentTime = Math.max(0, Math.min(1, (ev.clientX - r.left)/r.width)) * cbAudio.duration;
        cbAggiornaPosizione();
    });
})();



window.cbDownloadMp3 = function(){
    if (!cbMp3Blob) { cbStatus("MP3 is not ready yet."); return; }
    const a = document.createElement("a");
    a.href = cbMp3Url || URL.createObjectURL(cbMp3Blob);
    const safe = typeof bjSafeFileName === "function" ? bjSafeFileName : function(v){ return String(v).replace(/[^a-z0-9_-]+/gi,"_"); };
    const styleName = (typeof currentStyle !== "undefined" && currentStyle && currentStyle.name) ? currentStyle.name : "song";
    a.download = safe("ClickBandJunior_3_0_" + styleName) + ".mp3";
    document.body.appendChild(a); a.click(); a.remove();
    cbStatus("MP3 scaricato: load it nei sounds di Scratch.");
};



window.cbResetMp3 = cbResetMp3;
window.cbStopAll = cbStopAll;

window.cbStartMp3Render = cbStartMp3Render; 
window.cbPlayerState = () => cbState;
window.cbSyncMp3Controls = cbSyncMp3Controls;

cbSetState("empty");

})();
