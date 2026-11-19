(async function(){
const C=window.CORE,$=id=>document.getElementById(id),info=$('info');
await C.loadFont();
// scenes: ?scenes=url.json else demo (real scenes JSON in C11)
let fmt0='wide';try{fmt0=localStorage.getItem('cvt_format')||'wide';}catch(e){}
if(!C.FORMATS[fmt0])fmt0='wide';
if(fmt0!=='wide')C.setFormat(fmt0);
let scenes=[];
C.setScenes(scenes);
await C.preload(scenes,(n,m)=>info.textContent='Loading assets '+n+'/'+m);
const P=C.player($('cv'),{
  onTime:(t,T)=>{$('tm').textContent=t.toFixed(1)+'/'+T.toFixed(1);$('seek').value=T?t/T*1000:0;},
  onState:p=>$('play').textContent=p?'⏸':'▶'
});
$('play').onclick=()=>{if(P.t>=C.total-.1)P.seek(0);P.toggle();};
$('seek').oninput=e=>P.seek(e.target.value/1000*C.total);
window.PLAYER=P;
$('pol').onclick=()=>{C.POLISH.on=!C.POLISH.on;$('pol').textContent='✨ Polish: '+(C.POLISH.on?'ON':'OFF');$('pol').style.background=C.POLISH.on?'#2a6fdb':'#555';P.draw();};
$('aud').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=await EXPORT.loadAudio(f);CAP.spread&&CAP.lines.length&&CAP.spread();$('expst').textContent='Audio '+d.toFixed(1)+'s (video '+C.total.toFixed(1)+'s)';}catch(err){$('expst').textContent='Audio error: '+err.message;}};
$('exp').onclick=async()=>{$('exp').disabled=true;try{
  $('expst').textContent='Recording… tab khula rakho';
  const r=await EXPORT.run(P,$('cv'),(t,T)=>{$('expst').textContent='Recording '+t.toFixed(1)+'/'+T.toFixed(1)+'s';});
  window.LAST_EXPORT=r;EXPORT.download(r,'cricket_video'+(C.format==='short'?'_short':''));$('expst').textContent='Done: '+(r.blob.size/1e6).toFixed(1)+' MB .'+r.ext;
 }catch(err){$('expst').textContent='Export error: '+err.message;}$('exp').disabled=false;};
$('expf').onclick=async()=>{$('expf').disabled=true;$('exp').disabled=true;try{
  const r=await EXPORT.runFast(P,(t,T,el)=>{$('expst').textContent='Fast export '+t.toFixed(1)+'/'+T.toFixed(1)+'s ('+el.toFixed(0)+'s)'+(window.BUMP&&BUMP.secs().pre+BUMP.secs().post>0?' · intro/outro judega':'');});
  window.LAST_EXPORT=r;EXPORT.download(r,'cricket_video'+(C.format==='short'?'_short':''));$('expst').textContent='Done: '+(r.blob.size/1e6).toFixed(1)+' MB .mp4 in '+r.secs.toFixed(0)+'s'+(r.bumpers?' · '+r.bumpers+' intro/outro video judey (total '+r.total.toFixed(1)+'s)':'')+((EXPORT.audio||r.bumpers)&&!r.audio?' (audio encode support nahi — Real-time export use karo)':'')+(r.acodec==='opus'?' (audio Opus — kuch editors mein na chale to Real-time export use karo)':'');
 }catch(err){$('expst').textContent='Fast export error: '+err.message;}$('expf').disabled=false;$('exp').disabled=false;};
EXPORT.fastSupported().then(v=>{if(!v){$('expf').disabled=true;$('expf').title='Is browser mein WebCodecs H.264 nahi';}});
CAP.init(P);AT.init(P);AP.init(P);
await PHOTOS.init(C,()=>P.draw());
await SE.init(P,null);
const fmtUI=()=>{const sh=C.format==='short';$('fmt').textContent='📱 Short 9:16: '+(sh?'ON':'OFF');$('fmt').style.background=sh?'#e11':'#555';};fmtUI();
$('fmt').onclick=async()=>{if(P.playing)P.toggle();await SE.setFormat(C.format==='short'?'wide':'short');try{localStorage.setItem('cvt_format',C.format);}catch(e){}fmtUI();P.seek(0);};
C.ready=true;P.seek(0);
info.textContent='Ready — '+C.scenes.length+' scenes, '+C.total.toFixed(1)+'s';
})();
