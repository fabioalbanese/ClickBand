/*
 * ClickBand Junior — UIRuntime.js
 * Owns the structure builder, visual controls, theoretical-song report, MIDI player and browser bridges.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";

function toggleSongData() {
    const panel = document.getElementById("songDataPanel");
    const btn = document.getElementById("toggleSongDataPanel");
    if (!panel || !btn) return;
    const open = panel.classList.toggle("open");
    btn.textContent = open ? "📁 Nascondi dati" : "📂 Mostra dati";
}








let BPM = 120;
const PPQ = 480;

const CH_MELODY = 0;
const CH_ARP = 1;
const CH_BASS = 2;
const CH_GUITAR = 3;
const CH_CHROMA = 4;
const CH_PAD = 5;
const CH_COUNTER = 6;
const CH_OSTINATO = 7;
const CH_FX = 8;
const CH_DRUMS = 9;
const CH_CHOIR = 10;
const CH_BRASS = 11;
const CH_STRINGS = 12;
const CH_GUITAR_LEAD = 13; 

let song = null;
let generationProfile = null;

const scalaMidi = {
    1: 60,
    2: 62,
    3: 64,
    4: 65,
    5: 67,
    6: 69,
    7: 71,
    8: 72, 
    9: 74  
};


const minorMidiScale = {
    1: 60,
    2: 62,
    3: 63,
    4: 65,
    5: 67,
    6: 68,
    7: 70,
    8: 72,
    9: 74
};


let scaleMode = "major";


const GM_COMPLETE = {
    
    acousticGrandPiano: 0,
    brightAcousticPiano: 1,
    electricGrandPiano: 2,
    honkyTonkPiano: 3,
    electricPiano1: 4,
    electricPiano2: 5,
    harpsichord: 6,
    clavinet: 7,
    
    
    celesta: 8,
    glockenspiel: 9,
    musicBox: 10,
    vibraphone: 11,
    marimba: 12,
    xylophone: 13,
    tubularBells: 14,
    dulcimer: 15,
    
    
    drawbarOrgan: 16,
    percussiveOrgan: 17,
    rockOrgan: 18,
    churchOrgan: 19,
    reedOrgan: 20,
    accordion: 21,
    harmonica: 22,
    toggleAccordion: 23,
    
    
    acousticGuitar: 24,
    steelStringGuitar: 25,
    jazzGuitar: 26,
    cleanGuitar: 27,
    mutedGuitar: 28,
    overdrivenGuitar: 29,
    distortedGuitar: 30,
    guitarHarmonics: 31,
    
    
    acousticBass: 32,
    fingerBass: 33,
    pickedBass: 34,
    fretlessBass: 35,
    slapBass1: 36,
    slapBass2: 37,
    synthBass1: 38,
    synthBass2: 39,
    
    
    violin: 40,
    viola: 41,
    cello: 42,
    contrabass: 43,
    tremolo: 44,
    pizzicato: 45,
    orchestralHarp: 46,
    timpani: 47,
    
    
    stringEnsemble1: 48,
    stringEnsemble2: 49,
    synthStrings1: 50,
    synthStrings2: 51,
    choirAahs: 52,
    voiceOohs: 53,
    synthChoir: 54,
    orchestraHit: 55,
    
    
    trumpet: 56,
    trombone: 57,
    tuba: 58,
    mutedTrumpet: 59,
    frenchHorn: 60,
    brassSectionOrBrass: 61,
    synthBrass1: 62,
    synthBrass2: 63,
    
    
    sopranoSaxophone: 64,
    altoSaxophone: 65,
    tenorSaxophone: 66,
    baritone: 67,
    oboe: 68,
    englishHorn: 69,
    bassoon: 70,
    clarinet: 71,
    
    
    piccolo: 72,
    flute: 73,
    recorder: 74,
    panFlute: 75,
    blownBottle: 76,
    skakuhachi: 77,
    whistle: 78,
    ocarina: 79,
    
    
    leadSquare: 80,
    leadSawtooth: 81,
    leadCalliope: 82,
    leadChiff: 83,
    leadCharang: 84,
    leadVoice: 85,
    leadFifths: 86,
    leadBass: 87,
    
    
    padNewAge: 88,
    padWarm: 89,
    padPolysynth: 90,
    padChoir: 91,
    padBowed: 92,
    padMetallic: 93,
    padHalo: 94,
    padSweep: 95,
    
    
    fxRain: 96,
    fxSoundtrack: 97,
    fxCrystal: 98,
    fxAtmosphere: 99,
    fxBrightness: 100,
    fxGoblins: 101,
    fxEchoes: 102,
    fxSciFi: 103,
    
    
    sitar: 104,
    banjo: 105,
    shamisen: 106,
    koto: 107,
    kalimba: 108,
    bagpipe: 109,
    fiddle: 110,
    shanai: 111,
    
    
    tinWhistle: 112,
    carillon: 113,
    agogo: 114,
    steelDrums: 115,
    woodblock: 116,
    taiko: 117,
    melodicTom: 118,
    synthDrum: 119,
    
    
    reverseSymbal: 120,
    guitarFretNoise: 121,
    breathNoise: 122,
    seashore: 123,
    birdTweet: 124,
    telephoneRing: 125,
    helicopter: 126,
    applause: 127
};


const INSTRUMENTS = [
    ["🎹 Acoustic Grand Piano", 0],
    ["🎹 Bright Acoustic Piano", 1],
    ["🎹 Electric Grand Piano", 2],
    ["🎹 Honky-tonk Piano", 3],
    ["🎹 Electric Piano 1", 4],
    ["🎹 Electric Piano 2", 5],
    ["🎹 Harpsichord", 6],
    ["🎹 Clavinet", 7],
    ["🎹 Celesta", 8],
    ["🎹 Glockenspiel", 9],
    ["🎹 Music Box", 10],
    ["🎹 Vibraphone", 11],
    ["🎹 Marimba", 12],
    ["🎹 Xylophone", 13],
    ["🎹 Tubular Bells", 14],
    ["🎹 Dulcimer", 15],
    ["🎹 Drawbar Organ", 16],
    ["🎹 Percussive Organ", 17],
    ["🎹 Rock Organ", 18],
    ["🎹 Church Organ", 19],
    ["🎹 Reed Organ", 20],
    ["🎹 Accordion", 21],
    ["🎹 Harmonica", 22],
    ["🎹 Tango Accordion", 23],
    ["🎸 Acoustic Guitar (nylon)", 24],
    ["🎸 Acoustic Guitar (steel)", 25],
    ["🎸 Electric Guitar (jazz)", 26],
    ["🎸 Electric Guitar (clean)", 27],
    ["🎸 Electric Guitar (muted)", 28],
    ["🎸 Overdriven Guitar", 29],
    ["🎸 Distortion Guitar", 30],
    ["🎸 Guitar Harmonics", 31],
    ["🎸 Acoustic Bass", 32],
    ["🎸 Electric Bass (finger)", 33],
    ["🎸 Electric Bass (pick)", 34],
    ["🎸 Fretless Bass", 35],
    ["🎸 Slap Bass 1", 36],
    ["🎸 Slap Bass 2", 37],
    ["🎸 Synth Bass 1", 38],
    ["🎸 Synth Bass 2", 39],
    ["🎻 Violin", 40],
    ["🎻 Viola", 41],
    ["🎻 Cello", 42],
    ["🎻 Contrabass", 43],
    ["🎻 Tremolo Strings", 44],
    ["🎻 Pizzicato Strings", 45],
    ["🎻 Orchestral Harp", 46],
    ["🎻 Timpani", 47],
    ["🎻 String Ensemble 1", 48],
    ["🎻 String Ensemble 2", 49],
    ["🎻 Synth Strings 1", 50],
    ["🎻 Synth Strings 2", 51],
    ["🎻 Choir Aahs", 52],
    ["🎻 Voice Oohs", 53],
    ["🎻 Synth Voice", 54],
    ["🎻 Orchestra Hit", 55],
    ["🎺 Trumpet", 56],
    ["🎺 Trombone", 57],
    ["🎺 Tuba", 58],
    ["🎺 Muted Trumpet", 59],
    ["🎺 French Horn", 60],
    ["🎺 Brass Section", 61],
    ["🎺 Synth Brass 1", 62],
    ["🎺 Synth Brass 2", 63],
    ["🎺 Soprano Sax", 64],
    ["🎺 Alto Sax", 65],
    ["🎺 Tenor Sax", 66],
    ["🎺 Baritone Sax", 67],
    ["🎺 Oboe", 68],
    ["🎺 English Horn", 69],
    ["🎺 Bassoon", 70],
    ["🎺 Clarinet", 71],
    ["🪈 Piccolo", 72],
    ["🪈 Flute", 73],
    ["🪈 Recorder", 74],
    ["🪈 Pan Flute", 75],
    ["🪈 Blown Bottle", 76],
    ["🪈 Shakuhachi", 77],
    ["🪈 Whistle", 78],
    ["🪈 Ocarina", 79],
    ["🌊 Lead 1 (square)", 80],
    ["🌊 Lead 2 (sawtooth)", 81],
    ["🌊 Lead 3 (calliope)", 82],
    ["🌊 Lead 4 (chiff)", 83],
    ["🌊 Lead 5 (charang)", 84],
    ["🌊 Lead 6 (voice)", 85],
    ["🌊 Lead 7 (fifths)", 86],
    ["🌊 Lead 8 (bass + lead)", 87],
    ["🌊 Pad 1 (new age)", 88],
    ["🌊 Pad 2 (warm)", 89],
    ["🌊 Pad 3 (polysynth)", 90],
    ["🌊 Pad 4 (choir)", 91],
    ["🌊 Pad 5 (bowed)", 92],
    ["🌊 Pad 6 (metallic)", 93],
    ["🌊 Pad 7 (halo)", 94],
    ["🌊 Pad 8 (sweep)", 95],
    ["✨ FX 1 (rain)", 96],
    ["✨ FX 2 (soundtrack)", 97],
    ["✨ FX 3 (crystal)", 98],
    ["✨ FX 4 (atmosphere)", 99],
    ["✨ FX 5 (brightness)", 100],
    ["✨ FX 6 (goblins)", 101],
    ["✨ FX 7 (echoes)", 102],
    ["✨ FX 8 (sci-fi)", 103],
    ["🌍 Sitar", 104],
    ["🌍 Banjo", 105],
    ["🌍 Shamisen", 106],
    ["🌍 Koto", 107],
    ["🌍 Kalimba", 108],
    ["🌍 Bag Pipe", 109],
    ["🌍 Fiddle", 110],
    ["🌍 Shanai", 111],
    ["🥁 Tinkle Bell", 112],
    ["🥁 Agogo", 113],
    ["🥁 Steel Drums", 114],
    ["🥁 Woodblock", 115],
    ["🥁 Taiko Drum", 116],
    ["🥁 Melodic Tom", 117],
    ["🥁 Synth Drum", 118],
    ["🥁 Reverse Cymbal", 119],
    ["💥 Guitar Fret Noise", 120],
    ["💥 Breath Noise", 121],
    ["💥 Seashore", 122],
    ["💥 Bird Tweet", 123],
    ["💥 Telephone Ring", 124],
    ["💥 Helicopter", 125],
    ["💥 Applause", 126],
    ["💥 Gunshot", 127]
];

const STYLES = {
    pop:{name:"🎵 Pop", bpm:120, melody:GM_COMPLETE.brightAcousticPiano, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.fingerBass, guitar:GM_COMPLETE.steelStringGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.electricPiano1, ostinato:GM_COMPLETE.electricPiano1, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.choirAahs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.55, bassMode:"pop", guitarMode:"strum4", arpMode:"eighths", drumMode:"pop", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    folk:{name:"🪕 Folk / American Country", bpm:135, melody:GM_COMPLETE.fiddle, arp:GM_COMPLETE.violin, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.banjo, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.harmonica, ostinato:GM_COMPLETE.banjo, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.harmonica, strings:GM_COMPLETE.fiddle, chromaticInstrument:GM_COMPLETE.acousticGrandPiano, chromatic:0.18, bassMode:"root5", guitarMode:"folk8", arpMode:"simple", drumMode:"folk", voices:{arp:true,guitar:true,bass:true,chromatic:false,drums:true,pad:true,counter:true,ostinato:true,fx:false,choir:false,brass:false,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    rock:{name:"🎸 Light Rock", bpm:132, melody:GM_COMPLETE.overdrivenGuitar, arp:GM_COMPLETE.cleanGuitar, bass:GM_COMPLETE.pickedBass, guitar:GM_COMPLETE.distortedGuitar, pad:GM_COMPLETE.rockOrgan, counter:GM_COMPLETE.cleanGuitar, ostinato:GM_COMPLETE.mutedGuitar, fx:GM_COMPLETE.guitarFretNoise, choir:GM_COMPLETE.choirAahs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.synthStrings1, chromatic:0.40, bassMode:"rock", guitarMode:"power", arpMode:"eighths", drumMode:"rock", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:false,choir:false,brass:false,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    ballad:{name:"Ballad", bpm:82, melody:GM_COMPLETE.acousticGrandPiano, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.steelStringGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.violin, ostinato:GM_COMPLETE.musicBox, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.frenchHorn, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.22, bassMode:"slow", guitarMode:"slow", arpMode:"wide", drumMode:"soft", voices:{arp:true,guitar:true,bass:true,chromatic:false,drums:true,pad:true,counter:true,ostinato:false,fx:true,choir:true,brass:false,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:6, outro:8, solo:8}},

    latin:{name:"💃 Latin / Salsa", bpm:112, melody:GM_COMPLETE.trumpet, arp:GM_COMPLETE.acousticGrandPiano, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.flute, ostinato:GM_COMPLETE.marimba, fx:GM_COMPLETE.agogo, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.36, bassMode:"tumbao", guitarMode:"montuno", arpMode:"montuno", drumMode:"salsa", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:false,counter:true,ostinato:true,fx:true,choir:false,brass:true,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    children:{name:"🎈 Children Music", bpm:100, melody:GM_COMPLETE.musicBox, arp:GM_COMPLETE.glockenspiel, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.recorder, ostinato:GM_COMPLETE.xylophone, fx:GM_COMPLETE.birdTweet, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.trumpet, strings:GM_COMPLETE.pizzicato, chromatic:0.12, bassMode:"slow", guitarMode:"slow", arpMode:"wide", drumMode:"soft", voices:{arp:true,guitar:true,bass:true,chromatic:false,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:false,strings:true}, bars:{intro:4, verse:4, chorus:4, bridge:2, outro:4, solo:4}},

    lullaby:{name:"🌙 Lullaby", bpm:60, melody:GM_COMPLETE.musicBox, arp:GM_COMPLETE.acousticGrandPiano, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.padWarm, counter:GM_COMPLETE.celesta, ostinato:GM_COMPLETE.musicBox, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.frenchHorn, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.08, bassMode:"slow", guitarMode:"slow", arpMode:"wide", drumMode:"soft", voices:{arp:true,guitar:false,bass:false,chromatic:false,drums:false,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:false,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    kpop:{name:"🎤 K-pop", bpm:128, melody:GM_COMPLETE.leadChiff, arp:GM_COMPLETE.padPolysynth, bass:GM_COMPLETE.synthBass2, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.padChoir, counter:GM_COMPLETE.leadVoice, ostinato:GM_COMPLETE.electricPiano1, fx:GM_COMPLETE.fxCrystal, choir:GM_COMPLETE.choirAahs, brass:GM_COMPLETE.synthBrass1, strings:GM_COMPLETE.synthStrings1, chromatic:0.55, bassMode:"kpop", guitarMode:"kpop", arpMode:"eighths", drumMode:"kpop", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    jpop:{name:"🎵 J-pop", bpm:124, melody:GM_COMPLETE.leadChiff, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.synthBass1, guitar:GM_COMPLETE.steelStringGuitar, pad:GM_COMPLETE.padBowed, counter:GM_COMPLETE.violin, ostinato:GM_COMPLETE.electricPiano1, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.choirAahs, brass:GM_COMPLETE.trumpet, strings:GM_COMPLETE.synthStrings1, chromatic:0.48, bassMode:"pop", guitarMode:"strum4", arpMode:"eighths", drumMode:"pop", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:false,strings:true}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    reggaeton:{name:"🔊 Reggaeton", bpm:92, melody:GM_COMPLETE.leadChiff, arp:GM_COMPLETE.padPolysynth, bass:GM_COMPLETE.synthBass2, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.synthStrings1, counter:GM_COMPLETE.leadVoice, ostinato:GM_COMPLETE.marimba, fx:GM_COMPLETE.fxCrystal, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.synthBrass1, strings:GM_COMPLETE.synthStrings1, chromatic:0.55, bassMode:"reggaeton", guitarMode:"reggaeton", arpMode:"sync", drumMode:"reggaeton", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:false,brass:false,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    cumbia:{name:"💃 Cumbia", bpm:104, melody:GM_COMPLETE.accordion, arp:GM_COMPLETE.acousticGrandPiano, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.clarinet, ostinato:GM_COMPLETE.marimba, fx:GM_COMPLETE.agogo, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.trumpet, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.42, bassMode:"latin", guitarMode:"folk8", arpMode:"sync", drumMode:"latin", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:false,counter:true,ostinato:true,fx:true,choir:false,brass:true,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    trap:{name:"🎛️ Trap", bpm:140, melody:GM_COMPLETE.leadSawtooth, arp:GM_COMPLETE.padPolysynth, bass:GM_COMPLETE.synthBass2, guitar:GM_COMPLETE.mutedGuitar, pad:GM_COMPLETE.padChoir, counter:GM_COMPLETE.leadVoice, ostinato:GM_COMPLETE.leadSquare, fx:GM_COMPLETE.fxCrystal, choir:GM_COMPLETE.synthChoir, brass:GM_COMPLETE.synthBrass2, strings:GM_COMPLETE.synthStrings1, chromatic:0.65, bassMode:"trap", guitarMode:"trap", arpMode:"eighths", drumMode:"trap", voices:{arp:true,guitar:false,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:false,strings:false}, bars:{intro:8, verse:16, chorus:8, bridge:4, outro:4, solo:8}},

    hiphop:{name:"🎙️ Hip-hop", bpm:98, melody:GM_COMPLETE.electricPiano1, arp:GM_COMPLETE.electricPiano2, bass:GM_COMPLETE.fingerBass, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.padWarm, counter:GM_COMPLETE.leadSquare, ostinato:GM_COMPLETE.clavinet, fx:GM_COMPLETE.fxEchoes, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.50, bassMode:"hiphop", guitarMode:"hiphop", arpMode:"eighths", drumMode:"hiphop", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:false,brass:false,strings:false}, bars:{intro:8, verse:16, chorus:8, bridge:8, outro:8, solo:8}},

    house:{name:"🎧 House", bpm:128, melody:GM_COMPLETE.leadSawtooth, arp:GM_COMPLETE.padPolysynth, bass:GM_COMPLETE.synthBass1, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.padSweep, counter:GM_COMPLETE.leadSquare, ostinato:GM_COMPLETE.electricPiano1, fx:GM_COMPLETE.fxBrightness, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.synthBrass1, strings:GM_COMPLETE.synthStrings1, chromatic:0.58, bassMode:"house", guitarMode:"house", arpMode:"eighths", drumMode:"house", voices:{arp:true,guitar:false,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:false,brass:false,strings:false}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    techno:{name:"⚙️ Techno", bpm:130, melody:GM_COMPLETE.leadSawtooth, arp:GM_COMPLETE.padPolysynth, bass:GM_COMPLETE.synthBass2, guitar:GM_COMPLETE.distortedGuitar, pad:GM_COMPLETE.padMetallic, counter:GM_COMPLETE.leadSquare, ostinato:GM_COMPLETE.leadFifths, fx:GM_COMPLETE.fxSciFi, choir:GM_COMPLETE.synthChoir, brass:GM_COMPLETE.synthBrass2, strings:GM_COMPLETE.synthStrings2, chromatic:0.55, bassMode:"techno", guitarMode:"techno", arpMode:"eighths", drumMode:"techno", voices:{arp:true,guitar:false,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:false,brass:false,strings:false}, bars:{intro:8, verse:16, chorus:8, bridge:4, outro:4, solo:8}},

    disco:{name:"✨ Disco Dance", bpm:120, melody:GM_COMPLETE.leadSquare, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.synthBass1, guitar:GM_COMPLETE.cleanGuitar, guitarLead:GM_COMPLETE.leadSawtooth, pad:GM_COMPLETE.stringEnsemble2, counter:GM_COMPLETE.clavinet, ostinato:GM_COMPLETE.clavinet, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.choirAahs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.stringEnsemble2, chromatic:0.58, bassMode:"disco", guitarMode:"funk8", arpMode:"eighths", drumMode:"disco", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true}, bars:{intro:4, verse:8, chorus:8, bridge:6, outro:6, solo:8}},

    jazz:{name:"🎷 Jazz / Swing", bpm:124, melody:GM_COMPLETE.tenorSaxophone, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.jazzGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.vibraphone, ostinato:GM_COMPLETE.electricPiano1, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.mutedTrumpet, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.58, bassMode:"walking", guitarMode:"jazz", arpMode:"swing", drumMode:"swing", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:false,counter:true,ostinato:true,fx:false,choir:false,brass:true,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:8, outro:4, solo:12}},

    celtic:{name:"☘️ Celtic / Irish Folk", bpm:126, melody:GM_COMPLETE.fiddle, arp:GM_COMPLETE.violin, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.tinWhistle, ostinato:GM_COMPLETE.orchestralHarp, fx:GM_COMPLETE.tinkleBell, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.frenchHorn, strings:GM_COMPLETE.fiddle, chromatic:0.24, bassMode:"root5", guitarMode:"folk8", arpMode:"reel", drumMode:"celtic", voices:{arp:true,guitar:true,bass:true,chromatic:false,drums:true,pad:false,counter:true,ostinato:true,fx:false,choir:false,brass:false,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    blues:{name:"🎸 Blues", bpm:92, melody:GM_COMPLETE.harmonica, arp:GM_COMPLETE.drawbarOrgan, bass:GM_COMPLETE.fingerBass, guitar:GM_COMPLETE.overdrivenGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.altoSaxophone, ostinato:GM_COMPLETE.electricPiano2, fx:GM_COMPLETE.guitarFretNoise, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.trumpet, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.62, bassMode:"blues", guitarMode:"blues", arpMode:"simple", drumMode:"blues", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:false,fx:false,choir:false,brass:false,strings:false}, bars:{intro:8, verse:12, chorus:12, bridge:8, outro:8, solo:12}},

    reggae:{name:"🎶 Reggae", bpm:78, melody:GM_COMPLETE.drawbarOrgan, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.fingerBass, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.padWarm, counter:GM_COMPLETE.trumpet, ostinato:GM_COMPLETE.clavinet, fx:GM_COMPLETE.agogo, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.42, bassMode:"reggae", guitarMode:"reggae", arpMode:"sync", drumMode:"reggae", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:false,choir:false,brass:true,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    afrobeat:{name:"🥁 Afrobeat", bpm:108, melody:GM_COMPLETE.trumpet, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.fingerBass, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.tenorSaxophone, ostinato:GM_COMPLETE.marimba, fx:GM_COMPLETE.agogo, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.brassSectionOrBrass, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.50, bassMode:"afrobeat", guitarMode:"afrobeat", arpMode:"sync", drumMode:"afrobeat", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:false,counter:true,ostinato:true,fx:true,choir:false,brass:true,strings:false}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    indie:{name:"🎸 Indie", bpm:110, melody:GM_COMPLETE.cleanGuitar, arp:GM_COMPLETE.electricPiano1, bass:GM_COMPLETE.pickedBass, guitar:GM_COMPLETE.jazzGuitar, pad:GM_COMPLETE.padWarm, counter:GM_COMPLETE.leadVoice, ostinato:GM_COMPLETE.mutedGuitar, fx:GM_COMPLETE.glockenspiel, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.trumpet, strings:GM_COMPLETE.synthStrings1, chromatic:0.48, bassMode:"indie", guitarMode:"indie", arpMode:"eighths", drumMode:"indie", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:false,strings:true}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}},

    ambient:{name:"🌌 Ambient", bpm:70, melody:GM_COMPLETE.flute, arp:GM_COMPLETE.padWarm, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.cleanGuitar, pad:GM_COMPLETE.padSweep, counter:GM_COMPLETE.celesta, ostinato:GM_COMPLETE.musicBox, fx:GM_COMPLETE.fxAtmosphere, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.frenchHorn, strings:GM_COMPLETE.synthStrings1, chromatic:0.25, bassMode:"ambient", guitarMode:"ambient", arpMode:"wide", drumMode:"ambient", voices:{arp:true,guitar:false,bass:false,chromatic:false,drums:false,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:false,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    classicalCross:{name:"🎻 Classical Crossover", bpm:100, melody:GM_COMPLETE.violin, arp:GM_COMPLETE.orchestralHarp, bass:GM_COMPLETE.contrabass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.flute, ostinato:GM_COMPLETE.pizzicato, fx:GM_COMPLETE.tubularBells, choir:GM_COMPLETE.choirAahs, brass:GM_COMPLETE.frenchHorn, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.35, bassMode:"classical", guitarMode:"classical", arpMode:"wide", drumMode:"classical", voices:{arp:true,guitar:false,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true}, bars:{intro:8, verse:8, chorus:8, bridge:8, outro:8, solo:8}},

    tango:{name:"💃 Tango", bpm:96, melody:GM_COMPLETE.toggleAccordion, arp:GM_COMPLETE.acousticGrandPiano, bass:GM_COMPLETE.acousticBass, guitar:GM_COMPLETE.acousticGuitar, pad:GM_COMPLETE.stringEnsemble1, counter:GM_COMPLETE.violin, ostinato:GM_COMPLETE.pizzicato, fx:GM_COMPLETE.agogo, choir:GM_COMPLETE.voiceOohs, brass:GM_COMPLETE.trombone, strings:GM_COMPLETE.stringEnsemble1, chromatic:0.45, bassMode:"tango", guitarMode:"tango", arpMode:"simple", drumMode:"tango", voices:{arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:false,choir:false,brass:false,strings:true}, bars:{intro:4, verse:8, chorus:8, bridge:4, outro:4, solo:8}}
};

let currentStyle = STYLES.pop;
const SECTION_INFO = {
    intro:  {label:"Intro",  bars:4, cls:"intro"},
    verse:  {label:"Verse",  bars:8, cls:"verse"},
    chorus: {label:"Chorus", bars:8, cls:"chorus"},
    bridge: {label:"Bridge", bars:4, cls:"bridge"},
    outro:  {label:"Outro",  bars:4, cls:"outro"},
    solo:   {label:"🎸 Solo", bars:8, cls:"solo"}
};

let songStructure = ["intro","verse","chorus","verse","chorus","bridge","chorus","outro"];
let structureDragIndex = null;

function renderStructure() {
    const box = document.getElementById("songBlocks");
    if (!box) return;

    box.innerHTML = "";

    if (songStructure.length === 0) {
        const empty = document.createElement("div");
        empty.className = "emptyStructure";
        empty.textContent = "No blocks yet: add Intro, Verse or Chorus.";
        box.appendChild(empty);
        return;
    }

    songStructure.forEach((type, idx) => {
        const info = SECTION_INFO[type];
        const div = document.createElement("div");
        div.className = "songBlock " + info.cls;
        div.draggable = true;
        div.dataset.index = String(idx);
        div.title = "Trascina per riordinare";

        div.addEventListener("dragstart", function(e) {
            structureDragIndex = idx;
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(idx));
            div.classList.add("dragging");
        });

        div.addEventListener("dragend", function() {
            structureDragIndex = null;
            div.classList.remove("dragging");
            pulisciIndicatoriDrop();
        });

        div.addEventListener("dragover", function(e) {
            e.preventDefault();
            const fromIndex = structureDragIndex;
            if (fromIndex === null || fromIndex === idx) return;

            pulisciIndicatoriDrop();
            const rect = div.getBoundingClientRect();
            const after = e.clientX > rect.left + rect.width / 2;
            div.classList.add(after ? "dropAfter" : "dropBefore");
            e.dataTransfer.dropEffect = "move";
        });

        div.addEventListener("dragleave", function() {
            div.classList.remove("dropBefore", "dropAfter");
        });

        div.addEventListener("drop", function(e) {
            e.preventDefault();
            const fromIndex = structureDragIndex;
            if (fromIndex === null) return;

            const rect = div.getBoundingClientRect();
            const after = e.clientX > rect.left + rect.width / 2;
            reorderSection(fromIndex, idx, after);
        });

        const name = document.createElement("span");
        name.textContent = info.label;

        const countBox = document.createElement("span");
        countBox.className = "countBox";

        if (type === "solo") {
            
            const count = document.createElement("span");
            count.className = "count";
            count.title = "The Solo always follows the Verse length";
            count.textContent = "= Verse";
            countBox.appendChild(count);
        } else {
            const minus = document.createElement("button");
            minus.type = "button";
            minus.className = "stepBtn";
            minus.textContent = "−";
            minus.title = "Remove one phrase (2 bars)";
            minus.disabled = info.bars <= 2;
            minus.onclick = function(e) {
                e.stopPropagation();
                changeSectionPhrases(type, -1);
            };

            const count = document.createElement("span");
            count.className = "count";
            const phrases = info.bars / 2;
            count.title = info.bars + " bars";
            count.textContent = phrases + (phrases === 1 ? " phrase" : " phrases") + " (" + info.bars + " bars.)";

            const plus = document.createElement("button");
            plus.type = "button";
            plus.className = "stepBtn";
            plus.textContent = "+";
            plus.title = "Add one phrase (2 bars)";
            plus.onclick = function(e) {
                e.stopPropagation();
                changeSectionPhrases(type, 1);
            };

            countBox.appendChild(minus);
            countBox.appendChild(count);
            countBox.appendChild(plus);
        }

        const removeButton = document.createElement("button");
        removeButton.textContent = "✕";
        removeButton.title = "Remove";
        removeButton.onclick = function(e) {
            e.stopPropagation();
            removeSection(idx);
        };

        div.appendChild(name);
        div.appendChild(countBox);
        div.appendChild(removeButton);

        box.appendChild(div);
    });
}

function changeSectionPhrases(type, deltaFrasi) {
    
    if (type === "solo") return;
    const info = SECTION_INFO[type];
    if (!info) return;

    const newBars = info.bars + deltaFrasi * 2;
    info.bars = Math.max(2, newBars); 

    renderStructure();
}

function pulisciIndicatoriDrop() {
    document.querySelectorAll(".songBlock.dropBefore, .songBlock.dropAfter").forEach(el => {
        el.classList.remove("dropBefore", "dropAfter");
    });
}

function reorderSection(fromIndex, toIndex, inserisciDopo) {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= songStructure.length) return;
    if (toIndex < 0 || toIndex >= songStructure.length) return;

    const [spostata] = songStructure.splice(fromIndex, 1);
    let nuovaPosizione = toIndex;

    if (fromIndex < toIndex) nuovaPosizione--;
    if (inserisciDopo) nuovaPosizione++;

    nuovaPosizione = Math.max(0, Math.min(songStructure.length, nuovaPosizione));
    songStructure.splice(nuovaPosizione, 0, spostata);

    renderStructure();
}

function addSection(type) {
    
    const outroIndex = songStructure.lastIndexOf("outro");
    if (outroIndex >= 0 && type !== "outro") songStructure.splice(outroIndex, 0, type);
    else songStructure.push(type);

    renderStructure();
    printSong();
}

function removeSection(index) {
    if (index < 0 || index >= songStructure.length) return;
    songStructure.splice(index, 1);
    renderStructure();
    if (!songStructure.length) showEmptyStructure();
}

function resetStructure() {
    songStructure = ["intro","verse","chorus","verse","chorus","bridge","chorus","outro"];
    renderStructure();
}

function clearStructure() {
    songStructure = [];
    renderStructure();
    showEmptyStructure();
}

function showEmptyStructure() {
    song = {bars: [], generatedSections: {}};
    const out = document.getElementById("output");
    if (out) out.value = (window.ClickBandLocale ? window.ClickBandLocale.translate("🧱 EMPTY STRUCTURE\nAdd one or more blocks to generate a new song.") : "🧱 EMPTY STRUCTURE\nAdd one or more blocks to generate a new song.");
    const download = document.getElementById("downloadStep");
    if (download) download.classList.add("disabled");
}















function bindTrackVolumeSliders() {
    document.querySelectorAll("[data-channel]").forEach(sliders => {
        const ch = +sliders.dataset.channel;
        const label = document.getElementById(sliders.id + "Val");
        
        const pct = Math.round(bjMixMult(ch) * 100);
        sliders.value = pct;
        if (label) label.textContent = pct + "%";
        sliders.addEventListener("input", () => {
            const v = +sliders.value;
            bjMixLevel[ch] = v / 100;
            if (label) label.textContent = v + "%";
        });
    });
}

function populateInstruments() {
    document.querySelectorAll("select.instrument").forEach(sel => {
        sel.innerHTML = "";

        INSTRUMENTS.forEach(item => {
            const opt = document.createElement("option");
            opt.value = String(item[1]);
            opt.textContent = window.ClickBandLocale ? window.ClickBandLocale.instrumentName(item[1], item[0]) : item[0];
            sel.appendChild(opt);
        });
    });
}

function setSelectValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = String(value);
    if (el.selectedIndex < 0 && el.options.length > 0) el.selectedIndex = 0;
}

function setCheckboxValue(id, value) {
    const el = document.getElementById(id);
    if (!el || el.disabled) return;
    el.checked = !!value;
}

function applyStyleVoices(style) {
    const v = style.voices || {};
    setCheckboxValue("trackArpeggio", v.arp !== false);
    setCheckboxValue("trackGuitar", v.guitar !== false);
    setCheckboxValue("trackBass", v.bass !== false);
    
    setCheckboxValue("trackChromatic", v.chromatic !== false);
    setCheckboxValue("trackPad", v.pad !== false);
    setCheckboxValue("trackCounter", v.counter !== false);
    setCheckboxValue("trackChoir", v.choir !== false);
    setCheckboxValue("trackBrass", v.brass !== false);
    setCheckboxValue("trackStrings", v.strings !== false);
    setCheckboxValue("trackDrums", v.drums !== false);
    setCheckboxValue("trackOstinato", v.ostinato !== false);
    setCheckboxValue("trackFX", v.fx !== false);
    
    
}

function getProgram(id, fallback) {
    const el = document.getElementById(id);
    if (!el || el.value === "") return fallback;
    const v = parseInt(el.value, 10);
    return isNaN(v) ? fallback : v;
}

function applyStylePreset() {
    const styleKey = document.getElementById("styleSelect").value;
    const st = STYLES[styleKey] || STYLES.pop;

    
    
    
    
    const bpmRandom = Math.max(40, Math.min(240, st.bpm + Math.floor(Math.random() * 11) - 5));
    document.getElementById("bpmInput").value = bpmRandom;
    document.getElementById("bpmSlider").value = bpmRandom;

    setSelectValue("instrumentMelody", st.melody);
    setSelectValue("instrumentArpeggio", st.arp);
    setSelectValue("instrumentBass", st.bass);
    setSelectValue("instrumentGuitar", st.guitar);
    setSelectValue("instrumentPad", st.pad);
    setSelectValue("instrumentCounter", st.counter);
    setSelectValue("instrumentOstinato", st.ostinato);
    setSelectValue("instrumentFX", st.fx);
    setSelectValue("instrumentChoir", st.choir);
    setSelectValue("instrumentChromatic", st.chromaticInstrument !== undefined ? st.chromaticInstrument : GM_COMPLETE.acousticGrandPiano);
    setSelectValue("instrumentBrass", st.brass);
    setSelectValue("instrumentStrings", st.strings);
    applyStyleVoices(st);
}

function updateCurrentStyle() {
    const styleKey = document.getElementById("styleSelect").value;
    currentStyle = STYLES[styleKey] || STYLES.pop;

    const bpmEl = document.getElementById("bpmInput");
    const bpmSliderEl = document.getElementById("bpmSlider");
    let v = parseInt(bpmEl.value, 10);
    if (isNaN(v)) v = currentStyle.bpm;
    BPM = Math.max(40, Math.min(240, v));
    bpmEl.value = BPM;
    if (bpmSliderEl) bpmSliderEl.value = BPM;
    
    
}

function synchronizeInstrumentsWithStyle(style) {
    
    
    
    if (document.getElementById("instrumentMelody")) setSelectValue("instrumentMelody", style.melody);
    if (document.getElementById("instrumentArpeggio")) setSelectValue("instrumentArpeggio", style.arp);
    if (document.getElementById("instrumentBass")) setSelectValue("instrumentBass", style.bass);
    if (document.getElementById("instrumentGuitar")) setSelectValue("instrumentGuitar", style.guitar);
    if (document.getElementById("instrumentPad")) setSelectValue("instrumentPad", style.pad);
    if (document.getElementById("instrumentCounter")) setSelectValue("instrumentCounter", style.counter);
    if (document.getElementById("instrumentOstinato")) setSelectValue("instrumentOstinato", style.ostinato);
    if (document.getElementById("instrumentFX")) setSelectValue("instrumentFX", style.fx);
    if (document.getElementById("instrumentChoir")) setSelectValue("instrumentChoir", style.choir);
    if (document.getElementById("instrumentBrass")) setSelectValue("instrumentBrass", style.brass);
    if (document.getElementById("instrumentChromatic")) setSelectValue("instrumentChromatic", style.chromaticInstrument !== undefined ? style.chromaticInstrument : style.melody); 
    if (document.getElementById("instrumentStrings")) setSelectValue("instrumentStrings", style.strings);
    applyStyleVoices(style);
    
    
    synchronizeBars(style);
}

function synchronizeBars(style) {
    
    if (style.bars) {
        if (style.bars.intro !== undefined) SECTION_INFO.intro.bars = style.bars.intro;
        if (style.bars.verse !== undefined) SECTION_INFO.verse.bars = style.bars.verse;
        if (style.bars.chorus !== undefined) SECTION_INFO.chorus.bars = style.bars.chorus;
        if (style.bars.bridge !== undefined) SECTION_INFO.bridge.bars = style.bars.bridge;
        if (style.bars.outro !== undefined) SECTION_INFO.outro.bars = style.bars.outro;
        if (style.bars.solo !== undefined) SECTION_INFO.solo.bars = style.bars.solo;
    }
}

function isTrackActive(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}


function printSong() {
    if (!song) return;

    let out = "🎭 STYLE: " + currentStyle.name + " | ⏱️ BPM: " + BPM + "\n";
    out += "\ud83c\udfbc TONALIT\u00c0: " + (scaleMode === "minor" ? "Do minor" : "Do major") + "\n";
    
    const contaStampa = {};
    const circledNumbers = ["","①","②","③","④","⑤","⑥","⑦","⑧","⑨"];
    const totaliStampa = {};
    songStructure.forEach(s => { totaliStampa[s] = (totaliStampa[s] || 0) + 1; });
    out += "🧱 STRUCTURE: " + songStructure.map(s => {
        contaStampa[s] = (contaStampa[s] || 0) + 1;
        const suffisso = totaliStampa[s] > 1 ? " " + (circledNumbers[contaStampa[s]] || contaStampa[s]) : "";
        return SECTION_INFO[s].label + suffisso;
    }).join(" → ") + "\n";
    out += "🎛️ ACTIVE TRACKS: Melody";
    if (isTrackActive("trackArpeggio")) out += ", Arpeggio";
    if (isTrackActive("trackGuitar")) out += ", Guitar";
    if (isTrackActive("trackBass")) out += ", Bass";
    if (isTrackActive("trackChromatic")) out += ", Chromatic";
    if (isTrackActive("trackDrums")) out += ", Drums";
    if (isTrackActive("trackPad")) out += ", Pad";
    if (isTrackActive("trackCounter")) out += ", Countermelody";
    if (isTrackActive("trackOstinato")) out += ", Ostinato";
    if (isTrackActive("trackFX")) out += ", FX";
    if (isTrackActive("trackChoir")) out += ", Choir";
    if (isTrackActive("trackBrass")) out += ", Brass";
    if (isTrackActive("trackStrings")) out += ", Strings rhythmic";
    out += "\n";

    let sez = "";

    song.bars.forEach((b,idx) => {
        if (b.section !== sez) {
            sez = b.section;
            out += "\n=== " + sez.toUpperCase() + " ===\n";
        }

        const mel = b.melody.map(e => e.type === "rest" ? "r/" + e.duration : e.note + "/" + e.duration).join(" ");
        out += String(idx+1).padStart(2,"0") + " | ";
        out += b.melodyOnly ? "[SOLO MELODY] " : "";
        out += b.phraseRole ? "[" + b.phraseRole + "] " : "";
        out += "Chord " + b.chord.padEnd(2," ") + " | " + b.rhythmName + " | " + mel + "\n";
    });

    
    out += "\n📝 NOTE: All five sections (intro, verse, chorus, bridge and outro) are generated in memory.\n";
    out += "Only sections selected in the structure are appended to the MIDI.\n";
    
    document.getElementById("output").value = out.trim();
}







function showSectionsDebug() {
    if (!song || !song.generatedSections) {
        console.log("Error: nessun song generated or sections not disponibili");
        return;
    }
    
    console.log("=== DEBUG SECTIONS GENERATE ===");
    console.log("Struttura current (appended al MIDI):", songStructure);
    
    ["intro", "verse", "chorus", "bridge", "outro"].forEach(type => {
        if (song.generatedSections[type]) {
            console.log(`\n🎵 ${type.toUpperCase()} (${song.generatedSections[type].length} bars):`);
            console.log(song.generatedSections[type]);
        }
    });
    
    console.log("\n=== BARS ACCODATE AL MIDI ===");
    console.log(`Total: ${song.bars.length} bars`);
    console.log(song.bars);
}







const BJ_GM = ['Piano','Bright Piano','Electric Grand','Honky-tonk','E Piano 1','E Piano 2','Harpsichord','Clavinet','Celesta','Glockenspiel','Music Box','Vibraphone','Marimba','Xylophone','Tubular Bells','Dulcimer','Organ','Percussive Organ','Rock Organ','Church Organ','Reed Organ','Accordion','Harmonica','Tango Accordion','Guitar nylon','Guitar steel','Jazz Guitar','Clean Guitar','Muted Guitar','Overdrive Guitar','Distortion Guitar','Harmonics','Bass acoustic','Bass finger','Bass pick','Fretless Bass','Slap Bass 1','Slap Bass 2','Synth Bass 1','Synth Bass 2','Violin','Viola','Cello','Contrabass','Tremolo Strings','Pizzicato Strings','Harp','Timpani','Strings','Slow Strings','Synth Strings 1','Synth Strings 2','Choir Aahs','Voice Oohs','Synth Voice','Orchestra Hit','Trumpet','Trombone','Tuba','Muted Trumpet','French Horn','Brass Section','Synth Brass 1','Synth Brass 2','Soprano Sax','Alto Sax','Tenor Sax','Baritone Sax','Oboe','English Horn','Bassoon','Clarinet','Piccolo','Flute','Recorder','Pan Flute','Bottle','Shakuhachi','Whistle','Ocarina','Square','Saw','Calliope','Chiff','Charang','Voice Lead','Fifths','Bass+Lead','New Age','Warm','Polysynth','Choir','Bowed','Metallic','Halo','Sweep','Rain','Soundtrack','Crystal','Atmosphere','Brightness','Goblins','Echoes','Sci-fi','Sitar','Banjo','Shamisen','Koto','Kalimba','Bagpipe','Fiddle','Shanai','Tinkle Bell','Agogo','Steel Drums','Woodblock','Taiko','Melodic Tom','Synth Drum','Reverse Cymbal','Guitar Fret','Breath','Seashore','Bird','Telephone','Helicopter','Applause','Gunshot'];
const BJ_COLORS = ['#7c3aed','#06b6d4','#22c55e','#f59e0b','#ef4444','#ec4899','#84cc16','#14b8a6','#f97316','#a78bfa','#38bdf8','#fb7185'];




const BJ_DEFAULT_MIX = {
    0: 1.25,  
    1: 0.85,  
    2: 1.05,  
    3: 0.80,  
    4: 0.75,  
    5: 0.65,  
    6: 0.75,  
    7: 0.65,  
    8: 0.75,  
    9: 0.95,  
    10: 0.85, 
    11: 0.85, 
    12: 0.65, 
    13: 1.10  
};




let bjMixLevel = {};

function bjMixMult(channel) {
    if (bjMixLevel[channel] === undefined) bjMixLevel[channel] = BJ_DEFAULT_MIX[channel] ?? 1;
    return bjMixLevel[channel];
}

function bjMultToDb(mult, baseDb) {
    const m = Math.max(0.05, Math.min(2.5, mult));
    return baseDb + 20 * Math.log10(m);
}
let bjMidi = null, bjParts = [], bjSynths = [], bjDuration = 0, bjMuted = [], bjAllNotes = [], bjPlaying = false, bjPausedAt = 0;

function bjFmt(s){ return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`; }
function bjEl(id){ return document.getElementById(id); }
function bjStatus(msg){ const el=bjEl('bjPlayerStatus'); if(el) el.textContent=msg; }

function bjClearPlayer(){
    if (typeof Tone !== 'undefined') {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }
    bjParts.forEach(p => { try{ p.dispose(); }catch(e){} });
    bjSynths.forEach(s => {
        if (s && s._isDrumKit) {
            ['kick','tom','snare','hihat','cymbal'].forEach(voice => { try{ s[voice].dispose(); }catch(e){} });
        } else {
            try{ s.dispose(); }catch(e){}
        }
    });
    bjParts=[]; bjSynths=[]; bjPlaying=false; bjPausedAt=0;
}




const CANALI_SOSTENUTI = new Set([CH_PAD, CH_COUNTER, CH_CHOIR, CH_BRASS, CH_STRINGS, CH_GUITAR_LEAD]);

function bjMakeSynth(program=0, channel=0){
    const mult = bjMixMult(channel);
    if (channel === 9) {
        
        
        
        
        const baseVol = bjMultToDb(mult, -8);
        const offsets = {kick:0, tom:-2, snare:-1, hihat:-4, cymbal:-3};
        const hihatFilter = new Tone.Filter(7000, 'highpass').toDestination();
        const cymbalFilter = new Tone.Filter(6000, 'highpass').toDestination();
        const kit = {
            kick: new Tone.MembraneSynth({pitchDecay:0.04, octaves:6, envelope:{attack:0.001, decay:0.35, sustain:0.001, release:0.3}, volume: baseVol + offsets.kick}).toDestination(),
            tom: new Tone.MembraneSynth({pitchDecay:0.03, octaves:4, envelope:{attack:0.001, decay:0.28, sustain:0.001, release:0.2}, volume: baseVol + offsets.tom}).toDestination(),
            snare: new Tone.NoiseSynth({noise:{type:'white'}, envelope:{attack:0.001, decay:0.16, sustain:0}, volume: baseVol + offsets.snare}).toDestination(),
            hihat: new Tone.NoiseSynth({noise:{type:'white'}, envelope:{attack:0.001, decay:0.05, sustain:0}, volume: baseVol + offsets.hihat}).connect(hihatFilter),
            cymbal: new Tone.NoiseSynth({noise:{type:'white'}, envelope:{attack:0.001, decay:0.7, sustain:0}, volume: baseVol + offsets.cymbal}).connect(cymbalFilter),
            _isDrumKit: true,
            _offsets: offsets
        };
        return kit;
    }
    const baseType = program<8?'triangle':program<32?'sawtooth':program<56?'sine':program<80?'square':'fatsawtooth';

    if (CANALI_SOSTENUTI.has(channel)) {
        
        
        
        const oscType = baseType.startsWith('fat') ? baseType : 'fat' + baseType;
        return new Tone.PolySynth(Tone.Synth,{
            maxPolyphony:48,
            volume: bjMultToDb(mult, -11),
            oscillator:{type:oscType, count:3, spread:18},
            envelope:{attack:.05, decay:.35, sustain:.78, release:1.4}
        }).toDestination();
    }

    return new Tone.PolySynth(Tone.Synth,{maxPolyphony:48, volume: bjMultToDb(mult, -10), oscillator:{type:baseType}, envelope:{attack:.005,decay:.18,sustain:.35,release:.8}}).toDestination();
}

function prepareMidiPlayerFromBytes(bytes, name){
    if (!bytes || !bytes.length) return;
    if (typeof Tone === 'undefined' || typeof Midi === 'undefined') {
        bjStatus('Player unavailable: Tone.js and @tonejs/midi are required. MIDI download remains available.');
        return;
    }
    bjClearPlayer();
    const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const buffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);
    bjMidi = new Midi(buffer);
    bjDuration = bjMidi.duration || 0;
    bjMuted = bjMidi.tracks.map(()=>false);
    bjAllNotes = [];
    bjMidi.tracks.forEach((t,ti)=>t.notes.forEach(n=>bjAllNotes.push({...n,ti,color:BJ_COLORS[ti%BJ_COLORS.length]})));
    bjAllNotes.sort((a,b)=>a.time-b.time);
    bjBuildAudio();
    bjBuildUI(name || 'MIDI generated');
    bjDraw(0);
    bjStatus('Ready.');
}



function bjTriggerDrum(kit, midi, time, velocity) {
    if (!kit || !kit._isDrumKit) return;
    const vel = Math.max(0.05, Math.min(1, velocity));
    if (midi === 35 || midi === 36) { kit.kick.triggerAttackRelease('C1', 0.3, time, vel); return; }
    if (midi === 41 || midi === 43 || midi === 45 || midi === 47 || midi === 48 || midi === 50) {
        const note = {41:'F1',43:'G1',45:'A1',47:'B1',48:'C2',50:'D2'}[midi] || 'A1';
        kit.tom.triggerAttackRelease(note, 0.25, time, vel); return;
    }
    if (midi === 38 || midi === 40 || midi === 37) { kit.snare.triggerAttackRelease(0.16, time, vel); return; }
    if (midi === 42 || midi === 44) { kit.hihat.triggerAttackRelease(0.05, time, vel * 0.8); return; }
    if (midi === 46) { kit.hihat.triggerAttackRelease(0.18, time, vel * 0.8); return; }
    
    kit.cymbal.triggerAttackRelease(0.5, time, vel * 0.7);
}

function bjBuildAudio(){
    if (!bjMidi) return;
    Tone.Destination.volume.value = -6;
    Tone.Transport.bpm.value = bjMidi.header.tempos[0]?.bpm || BPM || 120;
    Tone.Transport.playbackRate = +(bjEl('bjTempo')?.value || 100) / 100;
    bjMidi.tracks.forEach((track,ti)=>{
        const synth = bjMakeSynth(track.instrument?.number || 0, track.channel);
        bjSynths[ti]=synth;
        const isDrum = track.channel === 9;
        const part = new Tone.Part((time,n)=>{
            if (bjMuted[ti]) return;
            if (isDrum) { bjTriggerDrum(synth, n.midi, time, n.velocity); return; }
            const tr = +(bjEl('bjTranspose')?.value || 0);
            const note = Tone.Frequency(n.midi + tr,'midi').toNote();
            synth.triggerAttackRelease(note, Math.max(.03,n.duration), time, n.velocity);
        }, track.notes.map(n=>[n.time,n]));
        part.start(0);
        bjParts[ti]=part;
    });
}

function bjBuildUI(name){
    if (!bjMidi) return;
    if (bjEl('bjDur')) bjEl('bjDur').textContent = bjFmt(bjDuration);
    if (bjEl('bjTracksN')) bjEl('bjTracksN').textContent = bjMidi.tracks.length;
    if (bjEl('bjNotesN')) bjEl('bjNotesN').textContent = bjAllNotes.length;
    if (bjEl('bjBpmN')) bjEl('bjBpmN').textContent = Math.round(bjMidi.header.tempos[0]?.bpm || BPM || 120);
    const ts = bjMidi.header.timeSignatures[0]?.timeSignature;
    if (bjEl('bjSigN')) bjEl('bjSigN').textContent = ts ? ts.join('/') : '4/4';
    const list = bjEl('bjTrackList');
    if (list) {
        list.innerHTML = bjMidi.tracks.map((t,i)=>{
            const pct = Math.round(bjMixMult(t.channel) * 100);
            return `<div class="bjTrack"><input type="checkbox" checked data-bj-track="${i}"><div><b style="color:${BJ_COLORS[i%BJ_COLORS.length]}">${t.name || 'Track '+(i+1)}</b><br><small>Ch ${t.channel+1} · ${BJ_GM[t.instrument?.number] || t.instrument?.name || 'Instrument'} · ${t.notes.length} note</small></div><div class="bjVol"><input type="range" min="0" max="200" step="5" value="${pct}" data-bj-vol="${i}" data-bj-channel="${t.channel}" title="Track volume"><span data-bj-vollabel="${i}">${pct}%</span></div><span class="bjBadge">${Math.round(t.endOfTrackTicks||0)} ticks</span></div>`;
        }).join('');
        document.querySelectorAll('[data-bj-track]').forEach(cb=>cb.onchange=e=>{ bjMuted[+e.target.dataset.bjTrack] = !e.target.checked; bjDraw(Tone.Transport.seconds||0); });
        document.querySelectorAll('[data-bj-vol]').forEach(sl=>sl.oninput=e=>{
            const ti = +e.target.dataset.bjVol;
            const channel = +e.target.dataset.bjChannel;
            const pct = +e.target.value;
            bjMixLevel[channel] = pct / 100;
            const label = document.querySelector(`[data-bj-vollabel="${ti}"]`);
            if (label) label.textContent = pct + '%';
            const synth = bjSynths[ti];
            if (synth) {
                const baseDb = channel === 9 ? -8 : -10;
                const newVolume = bjMultToDb(bjMixLevel[channel], baseDb);
                if (synth._isDrumKit) {
                    Object.keys(synth._offsets).forEach(voice => {
                        if (synth[voice]) synth[voice].volume.value = newVolume + synth._offsets[voice];
                    });
                } else {
                    synth.volume.value = newVolume;
                }
            }
        });
    }
}

async function bjPlayerPlay(){
    if (!bjMidi) {
        if (!song) generateSong();
        if (song && song.midiBytes) prepareMidiPlayerFromBytes(song.midiBytes, 'ClickBand Junior 3.0 - ' + currentStyle.name);
    }
    if (!bjMidi) { bjStatus('Generate a song first.'); return; }
    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.seconds = bjPausedAt;
    Tone.Transport.start('+0.05');
    bjPlaying = true;
    bjTick();
}

function bjPlayerPause(){
    if (!bjPlaying || typeof Tone === 'undefined') return;
    bjPausedAt = Tone.Transport.seconds;
    Tone.Transport.pause();
    bjPlaying = false;
    bjStatus('Rest.');
}

function bjPlayerStop(){
    if (typeof Tone !== 'undefined') Tone.Transport.stop();
    bjPausedAt = 0;
    bjPlaying = false;
    if (bjEl('bjBar')) bjEl('bjBar').style.width='0%';
    if (bjEl('bjNow')) bjEl('bjNow').textContent='0:00';
    bjDraw(0);
    bjStatus(bjMidi ? 'Ready.' : 'Generate un song per preparare il player MIDI.');
}

function bjTick(){
    if (!bjPlaying || !bjMidi) return;
    const pos = Tone.Transport.seconds;
    if (bjEl('bjNow')) bjEl('bjNow').textContent = bjFmt(pos);
    if (bjEl('bjBar')) bjEl('bjBar').style.width = Math.min(100, pos / Math.max(bjDuration, .01) * 100) + '%';
    bjDraw(pos);
    if (pos >= bjDuration) { bjPlayerStop(); return; }
    requestAnimationFrame(bjTick);
}

function bjDraw(pos=0){
    const c = bjEl('bjRoll');
    if (!c) return;
    const x = c.getContext('2d'), W=c.width, H=c.height;
    x.clearRect(0,0,W,H); x.fillStyle='#020617'; x.fillRect(0,0,W,H);
    if (!bjAllNotes.length) return;
    const min=24,max=96,span=max-min,scaleX=W/Math.max(bjDuration,1);
    x.strokeStyle='rgba(148,163,184,.15)'; x.lineWidth=1;
    for(let m=min;m<=max;m+=12){ let y=H-(m-min)/span*H; x.beginPath(); x.moveTo(0,y); x.lineTo(W,y); x.stroke(); }
    bjAllNotes.forEach(n=>{ if(n.midi<min||n.midi>max)return; const x0=n.time*scaleX,w=Math.max(2,n.duration*scaleX),y=H-(n.midi-min)/span*H-5; x.fillStyle=bjMuted[n.ti]?'rgba(100,116,139,.25)':n.color; x.globalAlpha=(n.time<=pos&&n.time+n.duration>=pos)?1:.72; x.fillRect(x0,y,w,9); });
    x.globalAlpha=1; x.strokeStyle='#fff'; x.lineWidth=3; x.beginPath(); x.moveTo(pos*scaleX,0); x.lineTo(pos*scaleX,H); x.stroke();
}


function bjSafeFileName(name){
    return String(name || 'ClickBandJunior_3_0_audio')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_\-]+/gi, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 80) || 'ClickBandJunior_3_0_audio';
}

function bjInitPlayerControls(){
    const time=bjEl('bjTempo'), volume=bjEl('bjVolume'), transpose=bjEl('bjTranspose'), progress=bjEl('bjProgress');
    if (time) time.oninput=e=>{ const v=+e.target.value; bjEl('bjTempoVal').textContent=v+'%'; if(typeof Tone!=='undefined') Tone.Transport.playbackRate=v/100; };
    if (volume) volume.oninput=e=>{ const v=+e.target.value; bjEl('bjVolVal').textContent=v+'%'; if(typeof Tone!=='undefined') Tone.Destination.volume.value=v===0?-Infinity:(v/100)*24-24; };
    if (transpose) transpose.oninput=e=>{ bjEl('bjTransposeVal').textContent=e.target.value; };
    if (progress) progress.onclick=e=>{ if(!bjMidi || typeof Tone==='undefined') return; const r=e.currentTarget.getBoundingClientRect(); bjPausedAt=((e.clientX-r.left)/r.width)*bjDuration; Tone.Transport.seconds=bjPausedAt; bjEl('bjNow').textContent=bjFmt(bjPausedAt); bjEl('bjBar').style.width=(bjPausedAt/Math.max(bjDuration,.01)*100)+'%'; bjDraw(bjPausedAt); };
}







function downloadMidi() {
    if (!song || !song.midiBytes) { generateSong(); return; }

    
    
    
    
    
    const bytes = song.midiBytes;
    const blob = new Blob([new Uint8Array(bytes)],{type:"audio/midi"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "clickband_junior.mid";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


window.addEventListener("DOMContentLoaded", function() {
    populateInstruments();
    applyStylePreset();
    renderStructure();
    bindTrackVolumeSliders();

    
    
    
    ["styleSelect", "scaleModeSelect"].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener("wheel", function(ev) { ev.preventDefault(); }, { passive: false });
    });

    
    
    
    
    document.getElementById("styleSelect").addEventListener("change", function() {
        applyStylePreset();
        renderStructure();
    });

    
    
    const bpmInputEl = document.getElementById("bpmInput");
    const bpmSliderEl = document.getElementById("bpmSlider");
    if (bpmInputEl && bpmSliderEl) {
        bpmInputEl.addEventListener("input", function() {
            if (bpmInputEl.value !== "") bpmSliderEl.value = bpmInputEl.value;
        });
        bpmSliderEl.addEventListener("input", function() {
            bpmInputEl.value = bpmSliderEl.value;
        });
    }

    const modoScalaEl = document.getElementById("scaleModeSelect");
    if (modoScalaEl) {
        modoScalaEl.addEventListener("change", function() {
            scaleMode = modoScalaEl.value;
        });
    }

    bjInitPlayerControls();

    
    showEmptyStructure(); 
});







window.ClickBandLegacyBridge = {
    getSectionsInfo: function () {
        return SECTION_INFO;
    },
    getStructure: function () {
        return songStructure.slice();
    },
    setMode: function (value) {
        scaleMode = value;
    },
    setBpm: function (value) {
        BPM = Number(value) || 120;
    },
    getBpm: function () {
        return BPM;
    },
    setSongState: function (value) {
        song = value || {};
        return song;
    },
    getSongState: function () {
        return song;
    }
};
