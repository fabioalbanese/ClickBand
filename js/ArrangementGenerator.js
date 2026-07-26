/*
 * ClickBand Junior — ArrangementGenerator.js
 * Expands the theoretical song into all accessory voices while preserving relative musical data.
 *
 * Copyright (c) 2026 Fabio Albanese
 * SPDX-License-Identifier: CC-BY-NC-4.0
 * Licensed for non-commercial use with attribution. See LICENSE.
 */
"use strict";
(function(global){
  



  function ArrangementGenerator(config){
    this.config=config||{};
    this.voices={arp:true,guitar:true,bass:true,chromatic:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true,guitarLead:true};
  }
  function clone(or){return JSON.parse(JSON.stringify(or));}
  function enabled(){return true;}
  function note(degree,octaveOffset,startSpot,durationSpots,dynamic,extra){
    return Object.assign({degree:degree,octaveOffset:octaveOffset||0,accidental:0,startSpot:startSpot,durationSpots:durationSpots,dynamic:dynamic,articulation:"normal"},extra||{});
  }
  function chordNotes(chord,shift){return chord.tones.map(function(t){return {degree:t.degree,octaveOffset:t.octaveOffset+(shift||0),accidental:t.accidental||0};});}
  function chordEvent(chord,start,duration,dynamic,shift){return {startSpot:start,durationSpots:duration,dynamic:dynamic,articulation:"normal",notes:chordNotes(chord,shift)};}
  function ArrangementGeneratorError(message){this.name="ArrangementGeneratorError";this.message=message;}
  ArrangementGeneratorError.prototype=Object.create(Error.prototype);
  ArrangementGenerator.prototype.arrange=function(baseSong){
    this.validateBase(baseSong);this.style=String(baseSong.metadata.style||"POP").toUpperCase();var snapshot=JSON.stringify(baseSong);
    var out={version:3,baseSong:baseSong,metadata:clone(baseSong.metadata),theme:clone(baseSong.theme),structure:baseSong.structure.slice(),structurePlan:clone(baseSong.structurePlan||baseSong.structure.map(function(name){return{sectionId:name,keyContext:{shiftSemitones:0,mode:baseSong.metadata.mode}};})),sections:{},arrangement:{voices:clone(this.voices)}};
    var self=this;Object.keys(baseSong.sections).forEach(function(name){out.sections[name]=self.arrangeSection(baseSong.sections[name]);});
    if(JSON.stringify(baseSong)!==snapshot)throw new ArrangementGeneratorError("The source song was modified unexpectedly.");
    return out;
  };
  ArrangementGenerator.prototype.validateBase=function(song){
    if(!song||!song.sections||!song.metadata)throw new ArrangementGeneratorError("Song base not valido.");
    function scan(v){if(!v||typeof v!=="object")return; if(Object.prototype.hasOwnProperty.call(v,"midi")||Object.prototype.hasOwnProperty.call(v,"note"))throw new ArrangementGeneratorError("The source song contains absolute performance data."); Object.keys(v).forEach(function(k){scan(v[k]);});}
    scan(song);
  };
  ArrangementGenerator.prototype.arrangeSection=function(section){var out={name:section.name,sequence:section.sequence.slice(),phrases:{}};for(var key in section.phrases)out.phrases[key]=this.arrangePhrase(section.name,section.phrases[key]);return out;};
  ArrangementGenerator.prototype.arrangePhrase=function(sectionName,phrase){var bars=[];for(var bar=0;bar<4;bar++)bars.push(this.arrangeBar(sectionName,phrase,bar));return bars;};
  ArrangementGenerator.prototype.arrangeBar=function(sectionName,phrase,bar){
    var chord=phrase.progression[bar], melody=phrase.notes.filter(function(n){return n.bar===bar;}).map(function(n){return note(n.degree,n.octaveOffset,n.spot,n.duration,n.dynamic,{accidental:n.accidental,articulation:n.articulation,role:n.role,chord:n.chord});});
    var root=chord.tones[0],fifth=chord.tones[2],voices={},i,isFolk=this.style==="FOLK";
    if(enabled(this,"arp")){voices.arp=[];for(i=0;i<8;i++){var t=isFolk?chord.tones[[0,1,2,1,0,1,2,1][i]]:chord.tones[i%3];voices.arp.push(note(t.degree,t.octaveOffset+1,i*2,2,isFolk?(sectionName==="intro"?0.34:0.40):(sectionName==="intro"?0.38:0.46),isFolk?{articulation:"short",role:"acoustic-picking"}:null));}}
    if(enabled(this,"bass")){voices.bass=[];for(i=0;i<4;i++){var bt=isFolk?(i%2===0?root:fifth):(i===3?fifth:root);voices.bass.push(note(bt.degree,bt.octaveOffset-2,i*4,4,sectionName==="chorus"?0.64:0.58,isFolk?{articulation:"short",role:"root-fifth"}:null));}}
    if(enabled(this,"guitar")){voices.guitar=[];if(isFolk){voices.guitar.push(note(root.degree,root.octaveOffset-1,0,3,0.42,{articulation:"short",role:"boom"}));voices.guitar.push(chordEvent(chord,4,2,0.40,-1));voices.guitar.push(note(fifth.degree,fifth.octaveOffset-1,8,3,0.42,{articulation:"short",role:"boom"}));voices.guitar.push(chordEvent(chord,12,2,sectionName==="chorus"?0.48:0.42,-1));}else{for(i=0;i<4;i++)voices.guitar.push(chordEvent(chord,i*4,3,sectionName==="chorus"?0.46:0.38,-1));}}
    if(!isFolk&&enabled(this,"chromatic")&&(sectionName==="chorus"||sectionName==="bridge")){
      voices.chromatic=[
        note(root.degree,root.octaveOffset+1,12,2,0.34,{accidental:-1,articulation:"short",role:"chromatic-approach"}),
        note(root.degree,root.octaveOffset+1,14,2,0.38,{accidental:root.accidental||0,articulation:"normal",role:"resolution"})
      ];
    }
    if(enabled(this,"pad")&&!isFolk)voices.pad=[chordEvent(chord,0,15,0.32,0)];
    if(enabled(this,"ostinato")){voices.ostinato=[];for(i=0;i<8;i++){var ot=isFolk?chord.tones[[0,1,2,1,2,1,0,2][i]]:chord.tones[(i%4<2)?0:2];voices.ostinato.push(note(ot.degree,ot.octaveOffset+1,i*2,2,isFolk?0.42:0.36,isFolk?{articulation:"short",role:"banjo-roll"}:null));}}
    if(enabled(this,"counter")&&(sectionName==="chorus"||sectionName==="bridge")){var ct=chord.tones[1];voices.counter=isFolk?[note(ct.degree,ct.octaveOffset+1,8,2,0.38,{articulation:"short",role:"harmonica-answer"}),note(fifth.degree,fifth.octaveOffset+1,12,3,0.42,{role:"harmonica-answer"})]:[note(ct.degree,ct.octaveOffset+1,10,3,0.40)];}
    if(!isFolk&&enabled(this,"fx")&&bar===0){var ft=chord.tones[0];voices.fx=[note(ft.degree,ft.octaveOffset+2,0,2,0.36)];}
    if(!isFolk&&enabled(this,"choir")&&(sectionName==="chorus"||sectionName==="bridge"||sectionName==="outro"))voices.choir=melody.map(function(n){return note(n.degree,n.octaveOffset+1,n.startSpot,n.durationSpots,sectionName==="chorus"?0.42:0.35,{accidental:n.accidental,articulation:"legato",source:"melody-double"});});
    if(!isFolk&&enabled(this,"brass")&&sectionName==="chorus")voices.brass=[chordEvent(chord,0,2,0.42,0)];
    if(enabled(this,"strings")&&sectionName==="chorus"){voices.strings=[];if(isFolk){[6,14].forEach(function(st){voices.strings.push(note(fifth.degree,fifth.octaveOffset+1,st,2,0.36,{articulation:"short",role:"fiddle-answer"}));});}else{[2,6,10,14].forEach(function(st){voices.strings.push(chordEvent(chord,st,2,0.33,0));});}}
    if(enabled(this,"guitarLead")&&sectionName==="solo")voices.guitarLead=melody.map(function(n){return note(n.degree,n.octaveOffset+1,n.startSpot,n.durationSpots,0.72,{accidental:n.accidental});});
    return {section:sectionName,variant:phrase.variant,barIndex:bar,chord:clone(chord),melody:melody,drums:this.drumEvents(phrase,bar),voices:voices,rhythmPattern:(phrase.rhythmPatterns.ids||[])[bar]||"generated"};
  };
  ArrangementGenerator.prototype.drumEvents=function(phrase,bar){var map=[['c','kick',0.72],['r','snare',0.66],['h','closedHat',0.45],['k','crash',0.70]],out=[],offset=bar*16;map.forEach(function(x){var line=phrase.lines[x[0]].slice(offset,offset+16);for(var i=0;i<16;i++)if(line.charAt(i)==='x')out.push({instrument:x[1],startSpot:i,durationSpots:1,dynamic:x[2]});});return out;};
  ArrangementGenerator.prototype.flatten=function(arranged){
    var bars=[],plan=arranged.structurePlan||arranged.structure.map(function(name){return{sectionId:name,keyContext:{shiftSemitones:0,mode:arranged.metadata.mode}};});plan.forEach(function(entry){var sec=arranged.sections[entry.sectionId];sec.sequence.forEach(function(v){sec.phrases[v].forEach(function(b){var theoreticalBar=clone(b);theoreticalBar.keyContext=clone(entry.keyContext);bars.push({section:b.section,phraseRole:b.variant,chord:b.chord.symbol,rhythmName:b.rhythmPattern,melody:b.melody.map(function(n){return{type:"note",note:n.degree,duration:n.durationSpots/4};}),keyContext:clone(entry.keyContext),theoreticalBar:theoreticalBar});});});});return bars;
  };
  global.ArrangementGenerator=ArrangementGenerator;
})(window);
