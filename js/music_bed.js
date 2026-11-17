// C62: Background music + voice ducking. API: AT.music = {name,buf,vol,duck,loop,fadeOut,offset}; MUSIC.open(); MUSIC.mix()
// Voice-over bolte waqt music apne aap dheema (duck), chup mein wapas upar. Mix EXPORT.audio mein jaata (preview + export dono).
// Mix ki lambai voice jitni (captions/fit ka timing na badle); voice na ho to video ki lambai.
(function(){
'use strict';
const $=id=>document.getElementById(id);
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const g=d=>Math.pow(10,d/20);
const X=window.EXPORT,AT=window.AT;
if(!X||!AT)return;
const ac=()=>X.actx||(X.actx=new (window.AudioContext||window.webkitAudioContext)());
const MUSIC=window.MUSIC={};
AT.music=null;

// voice ke hisaab se gain envelope (har 20ms), duck dB
MUSIC.envelope=(voice,duckDb,lead)=>{
  const sr=voice.sampleRate,f=Math.round(sr*0.02),n=Math.floor(voice.length/f),a=voice.getChannelData(0),r=new Float32Array(n);
  for(let i=0;i<n;i++){let s=0;for(let k=0;k<f;k++){const v=a[i*f+k];s+=v*v;}r[i]=Math.sqrt(s/f);}
  const srt=Float32Array.from(r).sort(),p90=srt[Math.floor(n*0.9)]||0,thr=Math.max(0.003,p90*0.15);
  const gd=g(duckDb),leadF=Math.round((lead||0.12)/0.02),act=new Uint8Array(n);
  for(let i=0;i<n;i++)if(r[i]>thr){for(let k=Math.max(0,i-leadF);k<=i;k++)act[k]=1;}
  // bolne ke beech chhoti ruk (<0.35s) mein music wapas na uthe
  const hold=Math.round(0.35/0.02);let last=-1e9;const act2=new Uint8Array(n);
  for(let i=0;i<n;i++){if(act[i])last=i;act2[i]=(i-last<=hold)?1:0;}
  const env=new Float32Array(n);let cur=1;const atk=1-Math.exp(-0.02/0.08),rel=1-Math.exp(-0.02/0.5);
  for(let i=0;i<n;i++){const tgt=act2[i]?gd:1;cur+=(tgt-cur)*(tgt<cur?atk:rel);env[i]=cur;}
  return{env,step:f};};

MUSIC.mix=()=>{
  const voice=AT.voiceOnly;const M=AT.music;
  if(!M||!M.buf){X.audio=voice||null;return;}
  const ctx=ac(),sr=voice?voice.sampleRate:ctx.sampleRate,len=voice?voice.length:Math.ceil(((window.CORE&&CORE.total)||10)*sr);
  const out=ctx.createBuffer(2,len,sr),L=out.getChannelData(0),R=out.getChannelData(1);
  if(voice){const a=voice.getChannelData(0),b=voice.numberOfChannels>1?voice.getChannelData(1):a;L.set(a);R.set(b);}
  const mb=M.buf,ratio=mb.sampleRate/sr,ma=mb.getChannelData(0),mc=mb.numberOfChannels>1?mb.getChannelData(1):ma,mlen=mb.length;
  const E=(voice&&M.duck<0)?MUSIC.envelope(voice,M.duck,0.12):null,vol=g(M.vol),fo=Math.max(0,M.fadeOut||0)*sr,off=Math.round((M.offset||0)*sr);
  for(let i=off;i<len;i++){let p=(i-off)*ratio;if(!M.loop&&p>=mlen)break;p=p%mlen;const i0=Math.floor(p),i1=(i0+1)%mlen,fr=p-i0;
    let gain=vol;if(E){const q=i/E.step,e0=Math.min(E.env.length-1,Math.floor(q)),e1=Math.min(E.env.length-1,e0+1);gain*=E.env[e0]+(E.env[e1]-E.env[e0])*(q-e0);}
    if(fo&&len-i<fo)gain*=(len-i)/fo;
    // loop jod par 20ms crossfade-free simple; start par chhota fade-in 0.3s
    const fi=Math.min(1,(i-off)/(0.3*sr));gain*=fi;
    L[i]+=(ma[i0]+(ma[i1]-ma[i0])*fr)*gain;R[i]+=(mc[i0]+(mc[i1]-mc[i0])*fr)*gain;}
  for(let i=0;i<len;i++){if(L[i]>1)L[i]=1;else if(L[i]<-1)L[i]=-1;if(R[i]>1)R[i]=1;else if(R[i]<-1)R[i]=-1;}
  X.audio=out;};

// AT.rebuild ke baad music mix karo
const rb0=AT.rebuild;
AT.rebuild=function(){rb0.apply(this,arguments);AT.voiceOnly=AT.segs.length?X.audio:null;if(AT.music)MUSIC.mix();};
AT.setMusic=(name,buf)=>{AT.music=Object.assign({vol:-18,duck:-12,loop:true,fadeOut:2,offset:0},AT.music||{},{name,buf});AT.rebuild();};
AT.clearMusic=()=>{AT.music=null;AT.rebuild();};

// ---------- save (IndexedDB 'cvt_music') ----------
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('cvt_music',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('m'))r.result.createObjectStore('m');};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
const idbOp=async(mode,fn)=>{const d=await idb();return new Promise((res,rej)=>{const tx=d.transaction('m',mode),st=tx.objectStore('m'),rq=fn(st);tx.oncomplete=()=>{d.close();res(rq&&rq.result);};tx.onerror=()=>{d.close();rej(tx.error);};});};
MUSIC.save=async()=>{const M=AT.music;try{if(!M||!M.raw){await idbOp('readwrite',s=>s.delete('bed'));return;}
  await idbOp('readwrite',s=>s.put({name:M.name,raw:M.raw,vol:M.vol,duck:M.duck,loop:M.loop,fadeOut:M.fadeOut,offset:M.offset},'bed'));}catch(e){console.warn('music save',e);}};
MUSIC.restore=async()=>{try{const r=await idbOp('readonly',s=>s.get('bed'));if(!r||!r.raw)return false;
  const buf=await ac().decodeAudioData(r.raw.slice(0));AT.music={name:r.name,raw:r.raw,buf,vol:r.vol,duck:r.duck,loop:r.loop,fadeOut:r.fadeOut,offset:r.offset};AT.rebuild();return true;}catch(e){console.warn('music restore',e);return false;}};
MUSIC.restore();

// ---------- UI ----------
let box=null;
function close(){if(box){box.remove();box=null;}}
MUSIC.open=()=>{
  if(box){close();return;}
  const b=mk('div');box=b;b.id='music_box';
  b.style.cssText='position:fixed;right:16px;bottom:310px;z-index:80;width:330px;background:#1b1e25;border:1px solid #000;border-radius:10px;padding:12px;color:#e9edf3;font:13px system-ui,sans-serif;box-shadow:0 8px 28px #000c';
  b.innerHTML=`<style>#music_box button,#music_box input{font-size:12px;border-radius:5px;border:0}#music_box button{background:#2b2f38;color:#e9edf3;padding:6px 10px;cursor:pointer}
#music_box .r{display:flex;align-items:center;gap:6px;margin:7px 0}#music_box .r>span{width:112px;color:#8b95a5;font-size:12px}#music_box input[type=range]{flex:1}#music_box input[type=number]{width:64px;padding:4px;background:#10141a;color:#e9edf3;border:1px solid #2a313c}
#music_box .g{background:#00c389;color:#04130e;font-weight:700}</style>
<div style="display:flex;justify-content:space-between;align-items:center"><b>🎵 Background music + ducking</b><button id="mx">✕</button></div>
<div class="r"><label class="g" style="padding:6px 10px;border-radius:5px;cursor:pointer">+ Music file<input id="mf" type="file" accept="audio/*" style="display:none"></label><span id="mn" style="flex:1;width:auto;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"></span></div>
<div class="r"><span>Music volume</span><input id="mv" type="range" min="-40" max="0" value="-18"><b id="mvv" style="width:44px">-18dB</b></div>
<div class="r"><span>Voice par duck</span><input id="md" type="range" min="-30" max="0" value="-12"><b id="mdv" style="width:44px">-12dB</b></div>
<div class="r"><span>Fade out (sec)</span><input id="mfo" type="number" value="2" min="0" max="10" step="0.5"><label><input id="ml" type="checkbox" checked> loop</label></div>
<div class="r"><span>Start offset (sec)</span><input id="mo" type="number" value="0" min="0" step="0.5"></div>
<div class="r"><button id="mc" style="background:#a33">Music hatao</button><span id="ms" style="flex:1;width:auto;color:#ffd400"></span></div>`;
  document.body.appendChild(b);
  const q=s=>b.querySelector(s),M0=AT.music;
  const sync=()=>{const M=AT.music;q('#mn').textContent=M?M.name:'(koi music nahi)';if(M){q('#mv').value=M.vol;q('#md').value=M.duck;q('#mfo').value=M.fadeOut;q('#ml').checked=M.loop;q('#mo').value=M.offset;}
    q('#mvv').textContent=q('#mv').value+'dB';q('#mdv').textContent=q('#md').value+'dB';};
  sync();
  q('#mx').onclick=close;
  q('#mf').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{q('#ms').textContent='⏳ decode…';const raw=await f.arrayBuffer(),buf=await ac().decodeAudioData(raw.slice(0));
    AT.music=Object.assign({vol:+q('#mv').value,duck:+q('#md').value,loop:q('#ml').checked,fadeOut:+q('#mfo').value,offset:+q('#mo').value},{name:f.name,buf,raw});AT.rebuild();MUSIC.save();sync();q('#ms').textContent='✔ '+buf.duration.toFixed(0)+'s music laga';}catch(err){q('#ms').textContent='Error: '+err.message;}e.target.value='';};
  let tm=0;const upd=()=>{if(!AT.music)return;const M=AT.music;M.vol=+q('#mv').value;M.duck=+q('#md').value;M.loop=q('#ml').checked;M.fadeOut=+q('#mfo').value||0;M.offset=Math.max(0,+q('#mo').value||0);
    q('#mvv').textContent=M.vol+'dB';q('#mdv').textContent=M.duck+'dB';clearTimeout(tm);tm=setTimeout(()=>{AT.rebuild();MUSIC.save();q('#ms').textContent='✔ mix update';},250);};
  ['#mv','#md','#mfo','#ml','#mo'].forEach(s=>{q(s).oninput=upd;q(s).onchange=upd;});
  q('#mc').onclick=()=>{AT.clearMusic();MUSIC.save();sync();q('#ms').textContent='Music hat gaya';};
};
const addBtn=()=>{const b2=$('bar2');if(b2&&!$('mus_btn')){const b=mk('button','','🎵 Music');b.id='mus_btn';b.onclick=MUSIC.open;b2.appendChild(b);}
  const tt=$('tl-tools');if(tt&&!$('mus_btn2')){const b=mk('button','','🎵 Music');b.id='mus_btn2';b.title='Background music + voice ducking';b.onclick=MUSIC.open;tt.appendChild(b);}};
setInterval(addBtn,500);addBtn();
})();
