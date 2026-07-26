const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={console,Uint8Array,ArrayBuffer,Map,Set,Math,Number,String,Object,Promise};ctx.window=ctx;ctx.self=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/vendor/Midi.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/MidiHumanizer.js'),'utf8'),ctx);
const input=new Uint8Array(fs.readFileSync(path.join(root,'MIDIs/clickband_junior.mid')));
const before=new ctx.Midi(input);
const output=ctx.ClickBandMidiHumanizer.humanizeMidi(input,{seed:'grid64-test',intensity:.55,drumMoveRatio:.05});
const after=new ctx.Midi(output);
const ppq=before.header.ppq||480;
const offset=ppq*4/64;
let total=0,moved=0,badOffset=0,protectedMoved=0;
function isProtected(n){
  const step=Math.round((((n.ticks%(ppq*4))+(ppq*4))%(ppq*4))/(ppq/4))%16;
  const p=n.midi;
  if(step===0) return true;
  if((p===35||p===36)&&(step===0||step===8)) return true;
  if((p===38||p===40)&&(step===4||step===12)) return true;
  if([49,52,55,57].includes(p)&&(step===0||step===8)) return true;
  return false;
}
before.tracks.forEach((bt,ti)=>{
  if(!(bt.channel===9 || /drum|percussion|batter/i.test(bt.name||''))) return;
  const at=after.tracks[ti];
  const bnotes=bt.notes.slice().sort((a,b)=>a.ticks-b.ticks||a.midi-b.midi);
  const anotes=at.notes.slice().sort((a,b)=>a.ticks-b.ticks||a.midi-b.midi);
  if(bnotes.length!==anotes.length) throw new Error('Numero note batteria cambiato');
  total+=bnotes.length;
  // Match per pitch and closest tick because sorting can change locally.
  const unused=anotes.slice();
  for(const bn of bnotes){
    let best=-1,dist=Infinity;
    for(let i=0;i<unused.length;i++) if(unused[i].midi===bn.midi){
      const d=Math.abs(unused[i].ticks-bn.ticks); if(d<dist){dist=d;best=i;}
    }
    if(best<0) throw new Error('Nota batteria non trovata');
    const an=unused.splice(best,1)[0];
    const d=an.ticks-bn.ticks;
    if(d!==0){ moved++; if(Math.abs(d)!==offset) badOffset++; if(isProtected(bn)) protectedMoved++; }
  }
});
if(moved>Math.floor(total*.05)) throw new Error(`Superato 5%: ${moved}/${total}`);
if(badOffset) throw new Error(`Offset non conforme alla griglia 64: ${badOffset}`);
if(protectedMoved) throw new Error(`Eventi strutturali spostati: ${protectedMoved}`);
if(total>=20 && moved===0) throw new Error('Nessun evento umanizzato');
console.log(JSON.stringify({status:'PASS',ppq,tempSlotTicks:offset,totalDrumEvents:total,moved,maxAllowed:Math.floor(total*.05)}));
