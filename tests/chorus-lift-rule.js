const fs=require('fs'), vm=require('vm'), path=require('path');
const math=Object.create(Math);
const context={console, Math:math};
context.window=context; context.global=context; context.localStorage={getItem(){return null},setItem(){}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../js/SongGenerator.js'),'utf8'),context,{filename:'SongGenerator.js'});
function assert(c,m){if(!c)throw new Error(m)}
function plan(structure, randomValues, mode='major'){
  let i=0;
  context.Math.random=()=>randomValues[Math.min(i++,randomValues.length-1)];
  const g=new context.SongGenerator({tonic:'C4',mode,style:'POP',structure,sectionPhraseCounts:{chorus:1,verse:1,intro:1,bridge:1,outro:1}});
  return g.createStructurePlan();
}
const three=['intro','chorus','verse','chorus','bridge','chorus','outro'];
let p=plan(three,[0.39,0.20]);
assert(p.modulation.applied,'40% draw should apply');
assert(p.modulation.triggerChorusOccurrence===2,'must start at chorus 2');
assert(p.modulation.triggerStructureIndex===3,'wrong chorus 2 index');
assert(p.entries[1].keyContext.shiftSemitones===0,'first chorus must stay original');
assert(p.entries[3].keyContext.shiftSemitones===1,'second chorus must be lifted');
assert(p.entries[6].keyContext.shiftSemitones===0,'outro must return');
p=plan(three,[0.39,0.80],'minor');
assert(p.modulation.triggerChorusOccurrence===3,'must start at chorus 3');
assert(p.entries[3].keyContext.shiftSemitones===0,'second chorus must stay original when third is selected');
assert(p.entries[5].keyContext.shiftSemitones===1,'third chorus must be lifted');
assert(p.entries[5].keyContext.mode==='minor','minor mode must be preserved');
p=plan(three,[0.40]);
assert(!p.modulation.applied,'40% boundary must not apply');
assert(p.entries.every(e=>e.keyContext.shiftSemitones===0),'no section should be lifted');
const two=['chorus','verse','chorus','outro'];
p=plan(two,[0.10]);
assert(p.modulation.triggerChorusOccurrence===2,'two-chorus form must use chorus 2');
assert(p.entries[0].keyContext.shiftSemitones===0,'first chorus must stay original');
assert(p.entries[2].keyContext.shiftSemitones===1,'second chorus must be lifted');
console.log(JSON.stringify({status:'PASS',rule:'40%-chorus-2-or-3'}));
