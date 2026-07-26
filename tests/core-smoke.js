const fs=require('fs'), vm=require('vm'), path=require('path');
const root=path.resolve(__dirname, '../js');
const context={console, Math, Uint8Array, ArrayBuffer, DataView, TextEncoder, setTimeout, clearTimeout};
context.window=context; context.global=context; context.document=undefined; context.localStorage={getItem(){return null},setItem(){}};
vm.createContext(context);
for(const f of ['RhythmPatternLibrary.js','MelodicRhythmGenerator.js','SongGenerator.js','ArrangementGenerator.js','MidiGenerator.js']){
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
}
function assert(c,m){if(!c)throw new Error(m)}
let totalBars=0,totalEvents=0,modulated=0;
for(const mode of ['major','minor']) for(const style of ['POP','ROCK','DANCE','FOLK','LATIN','JAZZ','BLUES','CELTIC']) for(let i=0;i<30;i++){
  const cfg={tonic:'C4',mode,style,sectionPhraseCounts:{intro:1,verse:2,chorus:2,bridge:1,outro:1},structure:['intro','verse','chorus','verse','chorus','bridge','chorus','outro'],useTonal:false};
  const base=new context.SongGenerator(cfg).generate();
  assert(base && base.sections && base.structurePlan,'base song invalid');
  if(style==='FOLK'){
    for(const secName of Object.keys(base.sections)) for(const variant of Object.keys(base.sections[secName].phrases)){
      const phrase=base.sections[secName].phrases[variant];
      assert(phrase.rhythmPatterns.style==='FOLK','folk rhythm style lost');
      assert(phrase.rhythmPatterns.ids.every(id=>/^folk_/.test(id)),'non-folk rhythm pattern selected');
    }
  }
  if(style==='JAZZ'){
    for(const section of Object.values(base.sections))for(const phrase of Object.values(section.phrases)){
      assert(phrase.rhythmPatterns.style==='JAZZ','jazz rhythm style lost');
      assert(phrase.rhythmPatterns.ids.every(id=>/^jazz_/.test(id)),'non-jazz rhythm pattern selected');
    }
  }
  if(style==='LATIN'){
    for(const secName of Object.keys(base.sections)) for(const variant of Object.keys(base.sections[secName].phrases)){
      const phrase=base.sections[secName].phrases[variant];
      assert(phrase.rhythmPatterns.style==='LATIN','latin rhythm style lost');
      assert(phrase.rhythmPatterns.ids.every(id=>/^latin_/.test(id)),'non-latin rhythm pattern selected');
    }
  }
  if(style==='BLUES' || style==='CELTIC'){
    for(const section of Object.values(base.sections))for(const phrase of Object.values(section.phrases)){
      assert(phrase.rhythmPatterns.style===style,style+' rhythm style lost');
      assert(phrase.rhythmPatterns.ids.every(id=>new RegExp('^'+style.toLowerCase()+'_').test(id)),'wrong '+style+' rhythm pattern selected');
    }
  }
  const arranged=new context.ArrangementGenerator().arrange(base);
  assert(arranged && arranged.sections && arranged.structurePlan,'arranged song invalid');
  if(style==='FOLK'){
    const firstSection=arranged.sections[Object.keys(arranged.sections)[0]];
    const firstBar=firstSection.phrases[firstSection.sequence[0]][0];
    assert(firstBar.voices.bass && firstBar.voices.bass.some(n=>n.role==='root-fifth'),'folk root-fifth bass missing');
    assert(firstBar.voices.guitar && firstBar.voices.guitar.some(n=>n.role==='boom'),'folk boom-chick guitar missing');
    assert(firstBar.voices.ostinato && firstBar.voices.ostinato.some(n=>n.role==='banjo-roll'),'folk banjo roll missing');
  }
  if(style==='JAZZ'){
    const verse=arranged.sections.verse;
    const firstBar=verse.phrases[verse.sequence[0]][0];
    assert(firstBar.voices.bass && firstBar.voices.bass.some(n=>n.role==='walking-bass'),'jazz walking bass missing');
    assert(firstBar.voices.guitar && firstBar.voices.guitar.some(n=>n.role==='freddie-green-comping'),'jazz guitar comping missing');
    assert(firstBar.voices.ostinato && firstBar.voices.ostinato.some(n=>n.role==='vibraphone-comping'),'jazz vibes missing');
  }
  if(style==='LATIN'){
    const verse=arranged.sections.verse;
    const firstBar=verse.phrases[verse.sequence[0]][0];
    assert(firstBar.voices.bass && firstBar.voices.bass.some(n=>n.role==='tumbao-bass'),'latin tumbao bass missing');
    assert(firstBar.voices.guitar && firstBar.voices.guitar.some(n=>n.role==='salsa-comping'),'latin salsa comping missing');
    assert(firstBar.voices.ostinato && firstBar.voices.ostinato.some(n=>n.role==='marimba-cascara'),'latin cascara ostinato missing');
  }
  if(style==='BLUES'){
    const firstBar=arranged.sections.verse.phrases[arranged.sections.verse.sequence[0]][0];
    assert(firstBar.voices.bass.some(n=>n.role==='blues-shuffle-bass'),'blues bass missing');
    assert(firstBar.voices.guitar.some(n=>n.role==='blues-shuffle-guitar'),'blues guitar missing');
  }
  if(style==='CELTIC'){
    const firstBar=arranged.sections.verse.phrases[arranged.sections.verse.sequence[0]][0];
    assert(firstBar.voices.bass.some(n=>n.role==='celtic-root-fifth'),'celtic bass missing');
    assert(firstBar.voices.ostinato.some(n=>n.role==='celtic-harp-ostinato'),'celtic harp missing');
  }
  // theoretical model must contain no MIDI properties
  const text=JSON.stringify(arranged);
  assert(!/"midi"\s*:/.test(text),'MIDI leaked into theoretical model');
  for(const secName of Object.keys(base.sections)) {
    const sec=base.sections[secName];
    for(const variant of Object.keys(sec.phrases)) {
      const phrase=sec.phrases[variant];
      for(let barIndex=0;barIndex<4;barIndex++){
        const events=phrase.notes.filter(e => e.bar===barIndex).sort((a,b)=>a.spot-b.spot);
        totalBars++;
        assert(events.length>0 && events[0].spot===0,'bar does not start with a note');
        for(const e of events){
          totalEvents++;
          assert([2,4,8,16].includes(e.duration),'invalid melodic duration '+e.duration);
          assert(e.spot%2===0,'odd melodic onset');
          assert(e.spot+e.duration<=16,'note crosses bar');
        }
      }
    }
  }
  if(base.modulation && base.modulation.applied) modulated++;
  const midiAll=new context.MidiGenerator({bpm:120,activeTracks:{melody:true,drums:true,arp:true,guitar:true,bass:true,chromatic:true,pad:true,counter:true,ostinato:true,fx:true,choir:true,brass:true,strings:true}}).generate(arranged);
  const midiMel=new context.MidiGenerator({bpm:120,activeTracks:{melody:true,drums:false,arp:false,guitar:false,bass:false,chromatic:false,pad:false,counter:false,ostinato:false,fx:false,choir:false,brass:false,strings:false}}).generate(arranged);
  assert(midiAll.length>midiMel.length,'track filtering ineffective');
  assert(String.fromCharCode(...midiAll.slice(0,4))==='MThd','invalid MIDI header');
}
console.log(JSON.stringify({status:'PASS',totalBars,totalEvents,modulated}));
