/*
 * ClickBand Junior — MidiHumanizer.js
 * Local deterministic MIDI humanization for browser execution.
 * Based conceptually on midi-humanizer-deterministic 0.1.0 (MIT), adapted
 * to ClickBand's local browser pipeline and the bundled @tonejs/midi API.
 */
"use strict";
(function (global) {
  var DEFAULTS = Object.freeze({ seed: "clickband", intensity: 0.55, drumMoveRatio: 0.05, melodyMoveRatio: 0.05 });

  function hashSeed(seed) {
    var text=String(seed), hash=0x811c9dc5;
    for(var i=0;i<text.length;i++){ hash^=text.charCodeAt(i); hash=Math.imul(hash,0x01000193)>>>0; }
    return hash || 0x6d2b79f5;
  }
  function rngFor(seed){
    var state=hashSeed(seed);
    return function(){ state=(state+0x6d2b79f5)>>>0; var v=state; v=Math.imul(v^(v>>>15),v|1); v^=v+Math.imul(v^(v>>>7),v|61); return ((v^(v>>>14))>>>0)/4294967296; };
  }
  function triangular(rng){ return rng()-rng(); }
  function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  function trackKind(track){
    var name=String(track.name||"").toLowerCase();
    if(track.channel===9 || /drum|percussion|batter/.test(name)) return "drums";
    if(track.channel===0 || /melody|melodia|lead|fiddle|sax|harmonica/.test(name)) return "melody";
    if(track.channel===1 || /bass|basso/.test(name)) return "bass";
    if(/counter/.test(name)) return "melody";
    if(/pad|string|choir|archi/.test(name)) return "sustain";
    return "accompaniment";
  }
  function profile(kind, ppq, intensity){
    var scale=clamp(Number(intensity)||0,0,1);
    var beat=Math.max(24, Number(ppq)||480);
    var base={
      drums:{timing:beat*0.006,velocity:7,duration:0},
      bass:{timing:beat*0.008,velocity:6,duration:beat*0.008},
      melody:{timing:beat*0.013,velocity:9,duration:beat*0.012},
      sustain:{timing:beat*0.003,velocity:4,duration:beat*0.015},
      accompaniment:{timing:beat*0.008,velocity:6,duration:beat*0.009}
    }[kind];
    return {timing:Math.round(base.timing*scale),velocity:Math.round(base.velocity*scale),duration:Math.round(base.duration*scale)};
  }
  function drumGridInfo(note, ppq){
    var barTicks=ppq*4;
    var relative=((note.ticks%barTicks)+barTicks)%barTicks;
    var slot16=Math.round(relative/(barTicks/16))%16;
    return {barTicks:barTicks,relative:relative,slot16:slot16,slot64:slot16*4,tempSlotTicks:barTicks/64};
  }
  function protectedDrum(note, ppq, trackNotes){
    var g=drumGridInfo(note,ppq), step=g.slot16, pitch=note.midi;
    var isKick=pitch===35 || pitch===36;
    var isSnare=pitch===38 || pitch===40;
    var isCrash=pitch===49 || pitch===52 || pitch===55 || pitch===57;
    var isTom=(pitch>=41 && pitch<=48) || pitch===50;
    if(step===0) return true;
    if(isKick && (step===0 || step===8)) return true;
    if(isSnare && (step===4 || step===12)) return true;
    if(isCrash && (step===0 || step===8)) return true;
    if(isTom){
      var bar=Math.floor(note.ticks/g.barTicks);
      var sameBarToms=trackNotes.filter(function(n){
        return Math.floor(n.ticks/g.barTicks)===bar && ((n.midi>=41&&n.midi<=48)||n.midi===50);
      });
      if(sameBarToms.length && note===sameBarToms[sameBarToms.length-1]) return true;
    }
    return false;
  }
  function humanizeDrumTiming(track, ppq, rng, ratio){
    var notes=track.notes.slice().sort(function(a,b){return a.ticks-b.ticks || a.midi-b.midi;});
    var maxMoved=Math.floor(notes.length*clamp(Number(ratio)||0,0,0.05));
    if(maxMoved<1) return {moved:0,total:notes.length,candidates:0};
    var occupied=new Set(notes.map(function(n){return n.midi+":"+n.ticks;}));
    var candidates=notes.filter(function(note,index){
      return index>0 && !protectedDrum(note,ppq,notes);
    });
    for(var i=candidates.length-1;i>0;i--){
      var j=Math.floor(rng()*(i+1)), tmp=candidates[i]; candidates[i]=candidates[j]; candidates[j]=tmp;
    }
    var moved=0;
    for(var c=0;c<candidates.length && moved<maxMoved;c++){
      var note=candidates[c], g=drumGridInfo(note,ppq);
      var direction=rng()<0.5?-1:1;
      var offset=Math.round(g.tempSlotTicks)*direction;
      var newTick=note.ticks+offset;
      var barStart=Math.floor(note.ticks/g.barTicks)*g.barTicks;
      if(newTick<barStart || newTick>=barStart+g.barTicks) continue;
      if(occupied.has(note.midi+":"+newTick)){
        direction=-direction; offset=Math.round(g.tempSlotTicks)*direction; newTick=note.ticks+offset;
      }
      if(newTick<barStart || newTick>=barStart+g.barTicks || occupied.has(note.midi+":"+newTick)) continue;
      occupied.delete(note.midi+":"+note.ticks);
      note.ticks=newTick;
      occupied.add(note.midi+":"+note.ticks);
      moved++;
    }
    return {moved:moved,total:notes.length,candidates:candidates.length};
  }

  function melodyGridInfo(note,ppq){
    var barTicks=ppq*4, relative=((note.ticks%barTicks)+barTicks)%barTicks;
    return {barTicks:barTicks,relative:relative,slot16:Math.round(relative/(barTicks/16))%16,tempSlotTicks:barTicks/64};
  }
  function protectedMelody(note,ppq,index,notes){
    var g=melodyGridInfo(note,ppq), bar=Math.floor(note.ticks/g.barTicks);
    if(index===0 || g.slot16===0) return true;
    if(index>0 && Math.floor(notes[index-1].ticks/g.barTicks)!==bar) return true;
    if((g.slot16===4 || g.slot16===8 || g.slot16===12) && note.durationTicks>=ppq/2) return true;
    return false;
  }
  function humanizeMelodyTiming(track,ppq,rng,ratio){
    var notes=track.notes.slice().sort(function(a,b){return a.ticks-b.ticks || a.midi-b.midi;});
    if(notes.length<2) return {moved:0,total:notes.length,candidates:0};
    var maxMoved=Math.floor(notes.length*clamp(Number(ratio)||0,0,0.05));
    if(maxMoved<1 && notes.length>=20) maxMoved=1;
    if(maxMoved<1) return {moved:0,total:notes.length,candidates:0};
    var candidates=[];
    notes.forEach(function(note,index){
      if(protectedMelody(note,ppq,index,notes)) return;
      var prev=notes[index-1], next=notes[index+1], step=Math.round(melodyGridInfo(note,ppq).tempSlotTicks);
      if(prev && note.ticks-step < prev.ticks+Math.min(prev.durationTicks,step)) return;
      if(next && note.ticks+step+note.durationTicks > next.ticks) return;
      candidates.push(note);
    });
    for(var i=candidates.length-1;i>0;i--){ var j=Math.floor(rng()*(i+1)),tmp=candidates[i];candidates[i]=candidates[j];candidates[j]=tmp; }
    var moved=0;
    for(var c=0;c<candidates.length && moved<maxMoved;c++){
      var note=candidates[c], index=notes.indexOf(note), prev=notes[index-1], next=notes[index+1];
      var g=melodyGridInfo(note,ppq), step=Math.round(g.tempSlotTicks), direction=rng()<0.5?-1:1;
      var newTick=note.ticks+direction*step, barStart=Math.floor(note.ticks/g.barTicks)*g.barTicks;
      function valid(t){
        if(t<barStart || t>=barStart+g.barTicks) return false;
        if(prev && t < prev.ticks+Math.min(prev.durationTicks,step)) return false;
        if(next && t+note.durationTicks > next.ticks) return false;
        return true;
      }
      if(!valid(newTick)){ direction=-direction; newTick=note.ticks+direction*step; }
      if(!valid(newTick)) continue;
      note.ticks=newTick; moved++;
    }
    return {moved:moved,total:notes.length,candidates:candidates.length};
  }
  function seedFromBytes(bytes){
    var hash=0x811c9dc5, limit=Math.min(bytes.length,4096);
    for(var i=0;i<limit;i++){hash^=bytes[i];hash=Math.imul(hash,0x01000193)>>>0;}
    return hash.toString(16);
  }

  function humanizeMidi(input, options){
    if(typeof global.Midi!=="function") throw new Error("MidiHumanizer: js/vendor/Midi.js non disponibile.");
    var bytes=input instanceof Uint8Array?input:new Uint8Array(input);
    var settings=Object.assign({},DEFAULTS,options||{});
    var midi=new global.Midi(bytes);
    var ppq=(midi.header&&midi.header.ppq)||480;
    var masterSeed=String(settings.seed||DEFAULTS.seed)+":"+seedFromBytes(bytes);

    midi.tracks.forEach(function(track,trackIndex){
      var kind=trackKind(track), p=profile(kind,ppq,settings.intensity);
      var rng=rngFor(masterSeed+":"+trackIndex+":"+kind);
      if(kind==="drums"){
        humanizeDrumTiming(track,ppq,rng,settings.drumMoveRatio);
        track.notes.forEach(function(note){
          var velocity=Math.round(triangular(rng)*p.velocity)/127;
          note.velocity=clamp(note.velocity+velocity,1/127,1);
        });
      } else if(kind==="melody") {
        humanizeMelodyTiming(track,ppq,rng,settings.melodyMoveRatio);
        track.notes.forEach(function(note){
          var velocity=Math.round(triangular(rng)*p.velocity)/127;
          note.velocity=clamp(note.velocity+velocity,1/127,1);
        });
      } else {
        var groups=new Map();
        track.notes.forEach(function(note){ var key=String(note.ticks); if(!groups.has(key))groups.set(key,[]); groups.get(key).push(note); });
        var ordered=[].concat.apply([],Array.from(groups.values()));
        var lastTick=0;
        ordered.forEach(function(note,index){
          var sameStart=groups.get(String(note.ticks))||[note];
          var groupSeedOffset=sameStart.indexOf(note)===0;
          var timing=Math.round(triangular(rng)*p.timing);
          var velocity=Math.round(triangular(rng)*p.velocity)/127;
          var duration=Math.round(triangular(rng)*p.duration);
          var protect=index===0;
          var newTick=protect?note.ticks:Math.max(0,note.ticks+timing);
          if(groupSeedOffset){ lastTick=Math.max(lastTick,newTick); }
          else { newTick=lastTick; }
          note.ticks=newTick;
          note.velocity=clamp(note.velocity+velocity,1/127,1);
          if(p.duration>0) note.durationTicks=Math.max(1,note.durationTicks+duration);
        });
      }
      track.notes.sort(function(a,b){return a.ticks-b.ticks || a.midi-b.midi;});
    });
    return Uint8Array.from(midi.toArray());
  }

  global.ClickBandMidiHumanizer={humanizeMidi:humanizeMidi,version:"1.2.1"};
  global.cbRunMidiHumanization=function(bytes,intensity,onProgress){
    if(typeof onProgress==="function") onProgress("humanize",1,1);
    return Promise.resolve(humanizeMidi(bytes,{intensity:intensity}));
  };
})(window);
