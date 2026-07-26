'use strict';
const fs=require('fs');
for(const file of ['index.kids.it.html','index.kids.html']){
  const html=fs.readFileSync(file,'utf8');
  const must=['id="structure"','draggable=true','dragstart','dragover','drop','id="status"','aria-live="polite"','id="play" disabled','id="pause" disabled','id="stop" disabled','id="downloadAudio" disabled','clickband:audio-state','ClickBandUIAdapter','cbStartMp3Render','cbDownloadMp3'];
  for(const token of must) if(!html.includes(token)) throw new Error(`${file}: missing ${token}`);
  const palette=html.indexOf('class="palette"');
  const structure=html.indexOf('id="structure"');
  if(palette<0||structure<0||palette>structure) throw new Error(`${file}: palette must be above structure`);
  for(const forbidden of ['id="styleSelect"','id="songBlocks"','id="statusText"','id="cbMp3Button"']){
    if(html.includes(forbidden)) throw new Error(`${file}: hidden official UI dependency ${forbidden}`);
  }
}
console.log(JSON.stringify({status:'PASS',pages:2,independent:true,dragDrop:true,audioLifecycle:true}));
