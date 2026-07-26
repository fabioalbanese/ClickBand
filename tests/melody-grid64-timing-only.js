const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'../js');
const ctx={console,Math,Uint8Array,ArrayBuffer,DataView,TextEncoder,setTimeout,clearTimeout};ctx.window=ctx;ctx.global=ctx;
vm.createContext(ctx);
for(const f of ['vendor/Midi.js','RhythmPatternLibrary.js','MelodicRhythmGenerator.js','SongGenerator.js','ArrangementGenerator.js','MidiGenerator.js','MidiHumanizer.js']) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const base=new ctx.SongGenerator({tonic:'C4',mode:'major',style:'POP',sectionPhraseCounts:{intro:1,verse:1,chorus:1,bridge:1,outro:1},structure:['intro','verse','chorus','bridge','outro'],useTonal:false}).generate();
const arr=new ctx.ArrangementGenerator().arrange(base);
const bytes=new ctx.MidiGenerator({bpm:120,programs:{melody:1,arp:4,guitar:25,bass:33,pad:48,counter:4,ostinato:4,fx:9,choir:52,brass:61,strings:48,chromatic:0},activeTracks:{melody:true,arp:true,guitar:true,bass:true,chromatic:true,drums:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true,guitarLead:false}}).generate(arr);
const beforeMidi=new ctx.Midi(bytes); const before=beforeMidi.tracks.find(t=>t.channel===0).notes.slice().sort((a,b)=>a.ticks-b.ticks||a.midi-b.midi);
const rendered=ctx.ClickBandMidiHumanizer.humanizeMidi(bytes,{seed:'melody-timing-only',intensity:.55});
const afterMidi=new ctx.Midi(rendered); const after=afterMidi.tracks.find(t=>t.channel===0).notes.slice().sort((a,b)=>a.ticks-b.ticks||a.midi-b.midi);
if(before.length!==after.length) throw new Error(`Numero note modificato: ${before.length} -> ${after.length}`);
const sig=ns=>ns.map(n=>`${n.midi}:${n.durationTicks}`).sort();
if(JSON.stringify(sig(before))!==JSON.stringify(sig(after))) throw new Error('Altezze o durate melodiche modificate');
const moved=after.filter((n,i)=>n.ticks!==before[i].ticks).length;
if(!moved) throw new Error('Nessun microtiming melodico rilevato');
const ppq=afterMidi.header.ppq, slot64=(ppq*4)/64;
for(let i=0;i<after.length;i++){
  const d=Math.abs(after[i].ticks-before[i].ticks);
  if(d!==0 && d!==slot64) throw new Error(`Offset non valido: ${d}`);
}
console.log(JSON.stringify({status:'PASS',notes:before.length,moved,slot64,pitchesPreserved:true,noteCountPreserved:true,durationsPreserved:true},null,2));
