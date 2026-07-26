/* ClickBand Junior — MidiImprover.js: optional local MIDI humanization boundary. */
"use strict";
(function(global){
  function MidiImprover(config){this.config=config||{};}
  MidiImprover.prototype.improve=function(midiBytes,onProgress){
    if(!midiBytes) return Promise.reject(new Error("MidiImprover: MIDI mancante."));
    if(!this.config.enabled) return Promise.resolve({midiBytes:midiBytes,engine:"disabled",changed:false,warning:null});
    if(typeof global.cbRunMidiHumanization!=="function") return Promise.resolve({midiBytes:midiBytes,engine:"local-fallback",changed:false,warning:"Il motore di humanizzazione locale non è disponibile. È stato mantenuto il MIDI originale."});
    return global.cbRunMidiHumanization(midiBytes,this.config.intensity,onProgress).then(function(bytes){
      if(!bytes||!bytes.length) throw new Error("Il motore non ha restituito dati MIDI validi.");
      return {midiBytes:bytes,engine:"deterministic-humanizer",changed:true,warning:null};
    }).catch(function(error){
      return {midiBytes:midiBytes,engine:"local-fallback",changed:false,warning:"Humanizzazione non riuscita: "+error.message+". È stato mantenuto il MIDI originale."};
    });
  };
  global.MidiImprover=MidiImprover;
})(window);
