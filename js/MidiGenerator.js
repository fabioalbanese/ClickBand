/*
 * ClickBand Junior — MidiGenerator.js
 * Translates theoretical degrees and local key contexts into a Standard MIDI File.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";
(function(global){
  
  function MidiGenerator(config){
    this.config=config||{};this.bpm=Number(this.config.bpm)||120;this.ppq=Number(this.config.ppq)||480;
    this.programs=Object.assign({melody:0,arp:4,bass:33,guitar:25,chromatic:10,pad:88,counter:73,ostinato:12,fx:9,choir:52,brass:61,strings:48,guitarLead:29},this.config.programs||{});
    this.volumes=Object.assign({melody:100,arp:85,bass:95,guitar:85,chromatic:75,pad:70,counter:75,ostinato:70,fx:70,choir:80,brass:80,strings:70,guitarLead:90,drums:95},this.config.volumes||{});
    this.activeTracks=Object.assign({melody:true,arp:true,bass:true,guitar:true,chromatic:true,pad:true,counter:true,ostinato:true,fx:true,drums:true,choir:true,brass:true,strings:true,guitarLead:true},this.config.activeTracks||{});
  }
  var PC={C:0,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:4,F:5,"F#":6,Gb:6,G:7,"G#":8,Ab:8,A:9,"A#":10,Bb:10,B:11};
  var INTERVALS={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10]};
  var DRUMS={kick:36,snare:38,closedHat:42,openHat:46,crash:49,ride:51};
  function parseTonic(s){var m=/^([A-Ga-g])([#b]?)(-?\d+)$/.exec(String(s||''));if(!m)throw new Error('MidiGenerator: tonic not valida.');var n=m[1].toUpperCase()+m[2];return{pc:PC[n],name:n,octave:parseInt(m[3],10),midi:(parseInt(m[3],10)+1)*12+PC[n]};}
  function keySignature(name,mode){var M={C:0,G:1,D:2,A:3,E:4,B:5,"F#":6,"C#":7,F:-1,Bb:-2,Eb:-3,Ab:-4,Db:-5,Gb:-6,Cb:-7},m={A:0,E:1,B:2,"F#":3,"C#":4,"G#":5,"D#":6,"A#":7,D:-1,G:-2,C:-3,F:-4,Bb:-5,Eb:-6,Ab:-7},t=mode==='minor'?m:M;return{sf:t[name]===undefined?0:t[name],mi:mode==='minor'?1:0};}
  var PC_SHARP=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  function shiftedKeyName(tonic,shift){return PC_SHARP[(tonic.pc+(shift||0)+12)%12];}
  function planFor(song){return song.structurePlan||song.structure.map(function(name){return{sectionId:name,keyContext:{shiftSemitones:0,mode:song.metadata.mode}};});}
  function u32(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}function u16(n){return[(n>>>8)&255,n&255];}function vlq(n){var b=[n&127];while((n>>=7))b.unshift((n&127)|128);return b;}function ascii(s){var a=[];for(var i=0;i<s.length;i++)a.push(s.charCodeAt(i)&255);return a;}function chunk(id,data){return ascii(id).concat(u32(data.length),data);}function clamp(n,a,b){return Math.max(a,Math.min(b,n));}function push(t,a){for(var i=0;i<a.length;i++)t.push(a[i]);}
  function addNote(list,start,duration,pitch,velocity,channel){var on=Math.max(0,Math.round(start)),off=Math.max(on+1,Math.round(start+duration));list.push({tick:on,order:1,bytes:[0x90|channel,pitch,velocity]});list.push({tick:off,order:0,bytes:[0x80|channel,pitch,0]});}
  function trackBytes(name,channel,program,volume,events){var all=[{tick:0,order:-4,bytes:[0xFF,0x03].concat(vlq(ascii(name).length),ascii(name))}];if(channel!==9)all.push({tick:0,order:-3,bytes:[0xC0|channel,clamp(program,0,127)]});all.push({tick:0,order:-2,bytes:[0xB0|channel,7,clamp(volume,0,127)]});all=all.concat(events);all.sort(function(a,b){return a.tick-b.tick||a.order-b.order;});var data=[],last=0;for(var i=0;i<all.length;i++){push(data,vlq(all[i].tick-last));push(data,all[i].bytes);last=all[i].tick;}push(data,[0,0xFF,0x2F,0]);return chunk('MTrk',data);}
  MidiGenerator.prototype.resolveContext=function(song){var md=song.metadata||{},tonic=parseTonic(md.tonic),mode=md.mode;if(!INTERVALS[mode])throw new Error('MidiGenerator: way not valido.');return{tonic:tonic,mode:mode,intervals:INTERVALS[mode]};};
  MidiGenerator.prototype.pitch=function(e,ctx,shift){if(!e||e.degree<1||e.degree>7)throw new Error('MidiGenerator: invalid scale degree.');var p=ctx.tonic.midi+(shift||0)+ctx.intervals[e.degree-1]+12*(e.octaveOffset||0)+(e.accidental||0);if(p<0||p>127)throw new Error('MidiGenerator: note is outside the MIDI range.');return p;};
  








  MidiGenerator.prototype.velocity=function(e,track,startTick){
    if(track==='melody'){
      var onBeat=Math.round(startTick||0)%this.ppq===0;
      return onBeat?95:89;
    }
    var dyn=e.dynamic===undefined?0.7:Number(e.dynamic);
    if(!isFinite(dyn))dyn=0.7;
    return clamp(Math.round(dyn*127),1,127);
  };
  MidiGenerator.prototype.generate=function(song){this.validate(song);var ctx=this.resolveContext(song),tracks=this.collect(song,ctx),chunks=[this.metaTrack(song,ctx)],defs=[['melody','Melody',0],['arp','Arpeggio',1],['bass','Bass',2],['guitar','Guitar',3],['chromatic','Chromatic',4],['pad','Pad',5],['counter','Countermelody',6],['ostinato','Ostinato',7],['fx','FX',8],['drums','Drums',9],['choir','Choir',10],['brass','Brass',11],['strings','Strings',12],['guitarLead','Lead',13]];for(var i=0;i<defs.length;i++){var d=defs[i],ev=tracks[d[0]]||[];if(this.activeTracks[d[0]]!==false&&ev.length)chunks.push(trackBytes(d[1],d[2],this.programs[d[0]]||0,this.volumes[d[0]]||90,ev));}var header=chunk('MThd',[0,1].concat(u16(chunks.length),u16(this.ppq))),out=header.slice();for(i=0;i<chunks.length;i++)push(out,chunks[i]);return new Uint8Array(out);};
  MidiGenerator.prototype.metaTrack=function(song,ctx){var time=Math.round(60000000/this.bpm),ts=song.metadata.timeSignature||[4,4],den=Math.round(Math.log(ts[1])/Math.log(2)),events=[{tick:0,order:-4,bytes:[0xFF,0x03].concat(vlq(9),ascii('ClickBand'))},{tick:0,order:-3,bytes:[0xFF,0x51,3,(time>>16)&255,(time>>8)&255,time&255]},{tick:0,order:-2,bytes:[0xFF,0x58,4,ts[0],den,24,8]}],plan=planFor(song),barNo=0,lastShift=null;for(var i=0;i<plan.length;i++){var entry=plan[i],shift=entry.keyContext&&entry.keyContext.shiftSemitones||0;if(shift!==lastShift){var keyName=shiftedKeyName(ctx.tonic,shift),ks=keySignature(keyName,ctx.mode),sf=ks.sf<0?256+ks.sf:ks.sf;events.push({tick:barNo*4*this.ppq,order:-1,bytes:[0xFF,0x59,2,sf,ks.mi]});lastShift=shift;}var sec=song.sections[entry.sectionId];barNo+=sec.sequence.length*4;}events.sort(function(a,b){return a.tick-b.tick||a.order-b.order;});var data=[],last=0;for(i=0;i<events.length;i++){push(data,vlq(events[i].tick-last));push(data,events[i].bytes);last=events[i].tick;}push(data,[0,0xFF,0x2F,0]);return chunk('MTrk',data);};
  MidiGenerator.prototype.validate=function(song){if(!song||!song.metadata||!song.sections||!Array.isArray(song.structure))throw new Error('MidiGenerator: structure dati incompleta.');};
  MidiGenerator.prototype.empty=function(){return{melody:[],arp:[],bass:[],guitar:[],chromatic:[],pad:[],counter:[],ostinato:[],fx:[],drums:[],choir:[],brass:[],strings:[],guitarLead:[]};};
  MidiGenerator.prototype.collect=function(song,ctx){return song.baseSong?this.collectArranged(song,ctx):this.collectBase(song,ctx);};
  MidiGenerator.prototype.addTheoretical=function(list,e,base,channel,track,ctx,shift){var start=base+(e.startSpot||0)*this.ppq/4,duration=(e.durationSpots||1)*this.ppq/4,vel=this.velocity(e,track,start),self=this;if(e.notes)e.notes.forEach(function(n){addNote(list,start,duration,self.pitch(n,ctx,shift),vel,channel);});else addNote(list,start,duration,this.pitch(e,ctx,shift),vel,channel);};
  MidiGenerator.prototype.addDrums=function(list,events,base){for(var i=0;i<events.length;i++){var e=events[i],p=DRUMS[e.instrument];if(!p)throw new Error('MidiGenerator: unknown percussion instrument '+e.instrument);addNote(list,base+e.startSpot*this.ppq/4,(e.durationSpots||1)*this.ppq/4,p,this.velocity(e,'drums'),9);}};
  MidiGenerator.prototype.collectBase=function(song,ctx){var t=this.empty(),barNo=0,self=this;planFor(song).forEach(function(entry){var sec=song.sections[entry.sectionId],shift=entry.keyContext&&entry.keyContext.shiftSemitones||0;sec.sequence.forEach(function(v){var phrase=sec.phrases[v];phrase.notes.forEach(function(n){self.addTheoretical(t.melody,{degree:n.degree,octaveOffset:n.octaveOffset,accidental:n.accidental,startSpot:n.bar*16+n.spot,durationSpots:n.duration,dynamic:n.dynamic},barNo*4*self.ppq,0,'melody',ctx,shift);});for(var b=0;b<4;b++){var ev=[],map=[['c','kick',0.72],['r','snare',0.66],['h','closedHat',0.45],['k','crash',0.70]],off=b*16;map.forEach(function(x){var line=phrase.lines[x[0]].slice(off,off+16);for(var i=0;i<16;i++)if(line.charAt(i)==='x')ev.push({instrument:x[1],startSpot:i,durationSpots:1,dynamic:x[2]});});self.addDrums(t.drums,ev,(barNo+b)*4*self.ppq);}barNo+=4;});});return t;};
  MidiGenerator.prototype.collectArranged=function(song,ctx){var t=this.empty(),barNo=0,self=this;planFor(song).forEach(function(entry){var sec=song.sections[entry.sectionId],shift=entry.keyContext&&entry.keyContext.shiftSemitones||0;sec.sequence.forEach(function(v){sec.phrases[v].forEach(function(bar){var base=barNo*4*self.ppq;bar.melody.forEach(function(e){self.addTheoretical(t.melody,e,base,0,'melody',ctx,shift);});self.addDrums(t.drums,bar.drums||[],base);var voices=bar.voices||{};Object.keys(voices).forEach(function(k){if(!t[k])return;voices[k].forEach(function(e){self.addTheoretical(t[k],e,base,self.channelFor(k),k,ctx,shift);});});barNo++;});});});return t;};
  MidiGenerator.prototype.channelFor=function(k){return{melody:0,arp:1,bass:2,guitar:3,chromatic:4,pad:5,counter:6,ostinato:7,fx:8,drums:9,choir:10,brass:11,strings:12,guitarLead:13}[k];};
  MidiGenerator.prototype.download=function(song,filename){var bytes=this.generate(song),blob=new Blob([bytes],{type:'audio/midi'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename||'clickband.mid';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);};
  global.MidiGenerator=MidiGenerator;
})(window);
