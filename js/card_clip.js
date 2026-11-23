// C120 (R1): Video clip layer. Rahul ka clip (mp4/webm upload) scene mein chalta hai, upar source tag + naam patti + subtitle.
// clip (R1): data:{clip:'file naam (🎞 Clips mein upload kiya)', start:0 (clip ke kitne sec se), fit:'cover'|'contain', src:'source ka naam (text, Rahul khud likhe)', name:'naam', role:'pad', sub:'neeche subtitle line', quote:false (bada " chinh), title:'', c:'y', bg}
// C217: data.speed (0.25-4, default 1), data.rev (ulti), data.vol (clip awaaz 0-3, default 0 = mute). Awaaz preview mein (vol<=1, ulti mein band) + Fast export mein mix.
// Clip ki apni awaaz default mute hai (vol=0). Clips browser (IndexedDB 'cvt_clips') mein save hote hain, repo mein nahi.
(function(){const C=window.CORE,E=C.ease;
const COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'},S=v=>v==null?'':String(v).trim();
C.clips=C.clips||{};C.clipsReady=false;
// ---------- storage ----------
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('cvt_clips',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('c'))r.result.createObjectStore('c');};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
const op=async(mode,fn)=>{const d=await idb();return new Promise((res,rej)=>{const tx=d.transaction('c',mode),rq=fn(tx.objectStore('c'));tx.oncomplete=()=>{d.close();res(rq&&rq.result);};tx.onerror=()=>{d.close();rej(tx.error);};});};
function mkVideo(blob){return new Promise((res,rej)=>{const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.loop=false;v.src=URL.createObjectURL(blob);
  v.onloadedmetadata=()=>res(v);v.onerror=()=>rej(new Error('video khula nahi (mp4 H.264 ya webm do)'));});}
C.clipAdd=async function(file){const name=file.name;const blob=new Blob([await file.arrayBuffer()],{type:file.type||'video/mp4'});const v=await mkVideo(blob);
  if(C.clips[name]){try{URL.revokeObjectURL(C.clips[name].video.src);}catch(e){}}
  C.clips[name]={name,blob,video:v,dur:v.duration,w:v.videoWidth,h:v.videoHeight,size:blob.size};
  try{await op('readwrite',s=>s.put({name,blob},name));}catch(e){console.warn('clip save',e);}return C.clips[name];};
C.clipDel=async function(name){const c=C.clips[name];if(c){try{URL.revokeObjectURL(c.video.src);}catch(e){}delete C.clips[name];}try{await op('readwrite',s=>s.delete(name));}catch(e){}};
C.clipRestore=async function(){try{const keys=await op('readonly',s=>s.getAllKeys());for(const k of keys||[]){const r=await op('readonly',s=>s.get(k));if(r&&r.blob&&!C.clips[k]){try{const v=await mkVideo(r.blob);C.clips[k]={name:k,blob:r.blob,video:v,dur:v.duration,w:v.videoWidth,h:v.videoHeight,size:r.blob.size};}catch(e){console.warn('clip restore',k,e);}}}}catch(e){console.warn('clip restore',e);}C.clipsReady=true;};
C.clipRestore();
// seek helper (export ke liye frame-exact)
const seekTo=(v,t)=>new Promise(res=>{if(Math.abs(v.currentTime-t)<.001&&v.readyState>=2){res();return;}let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('seeked',f);res();};v.addEventListener('seeked',f);v.currentTime=t;setTimeout(f,1500);});
const spd=d=>Math.max(.25,Math.min(4,+d.speed||1));
C.clipSpeed=spd;
const vt=(sc,t)=>{const d=sc.data||{},c=C.clips[S(d.clip)];if(!c)return null;const lt=Math.max(0,t-C.starts[C.scenes.indexOf(sc)]),sp=spd(d),st=+d.start||0,span=sc.dur*sp,want=d.rev?st+span-lt*sp:st+lt*sp;return{c,time:Math.max(0,Math.min(c.dur-.05,want)),sp,rev:!!d.rev,vol:Math.max(0,Math.min(3,+d.vol||0))};};
C.clipAt=vt;
// C217: export ke liye clip awaaz. oc = OfflineAudioContext (48k stereo), off = main video ka shuru (intro ke baad) sec mein.
const abuf={};
async function decodeClip(c){if(c.name in abuf)return abuf[c.name];let b=null;try{const o=new OfflineAudioContext(2,1,48000);b=await o.decodeAudioData(await c.blob.arrayBuffer());}catch(e){b=null;}abuf[c.name]=b;return b;}
C.clipDecode=decodeClip; // C223: overlays.js bhi use karta hai
C.clipMixNeeded=()=>(C.scenes||[]).some(sc=>sc.type==='clip'&&+(sc.data||{}).vol>0&&C.clips[S((sc.data||{}).clip)]);
C.clipMix=async function(oc,off){let n=0;
  for(let i=0;i<C.scenes.length;i++){const sc=C.scenes[i];if(sc.type!=='clip')continue;const d=sc.data||{},vol=Math.max(0,Math.min(3,+d.vol||0)),c=C.clips[S(d.clip)];if(!(vol>0)||!c)continue;
    const b=await decodeClip(c);if(!b)continue;const sp=spd(d),st=+d.start||0,when=off+C.starts[i];let buf=b,o=st;
    if(d.rev){const sr=b.sampleRate,a=Math.max(0,Math.floor(st*sr)),z=Math.min(b.length,Math.floor((st+sc.dur*sp)*sr)),len=Math.max(1,z-a);buf=oc.createBuffer(b.numberOfChannels,len,sr);
      for(let ch=0;ch<b.numberOfChannels;ch++){const src=b.getChannelData(ch),dst=buf.getChannelData(ch);for(let k=0;k<len;k++)dst[k]=src[z-1-k]||0;}o=0;}
    const s=oc.createBufferSource(),g=oc.createGain();s.buffer=buf;s.playbackRate.value=sp;g.gain.value=vol;s.connect(g);g.connect(oc.destination);
    s.start(when,o,Math.max(.01,sc.dur*sp));try{s.stop(when+sc.dur);}catch(e){}n++;}
  return n;};
function active(t){const a=[];(C.scenes||[]).forEach((sc,i)=>{if((sc.type==='clip'||sc.type==='phoneann'||sc.type==='split'||sc.type==='screenclip'||sc.type==='vidcard')&&t>=C.starts[i]&&t<C.starts[i]+sc.dur)a.push(sc);});return a;}
// export: har frame se pehle exact seek
C.beforeFrame=async function(t){for(const sc of active(t)){const x=vt(sc,t);if(x)await seekTo(x.c.video,x.time);}};
// preview sync (render ke pehle)
const render0=C.render;
C.render=function(ctx,t){if(!C.exporting){const act=active(t),used=new Set();
  act.forEach(sc=>{const x=vt(sc,t);if(!x)return;const v=x.c.video;used.add(v);
    v.muted=!(x.vol>0)||x.rev;v.volume=Math.min(1,x.vol);if(v.playbackRate!==x.sp&&!x.rev)v.playbackRate=x.sp;
    if(C.playing&&!x.rev){if(v.paused){v.currentTime=x.time;v.play().catch(()=>{});}else if(Math.abs(v.currentTime-x.time)>.3*Math.max(1,x.sp))v.currentTime=x.time;}
    else{if(!v.paused)v.pause();if(Math.abs(v.currentTime-x.time)>.04)v.currentTime=x.time;}});
  Object.keys(C.clips).forEach(k=>{const v=C.clips[k].video;if(!used.has(v)){v.muted=true;if(!v.paused)v.pause();}});}
  return render0.call(C,ctx,t);};
// preload: clip scenes ke liye clip maujood hona chahiye
const pre0=C.preload;
C.preload=async function(scenes,onProg){if(!C.clipsReady){await new Promise(r=>{const i=setInterval(()=>{if(C.clipsReady){clearInterval(i);r();}},50);setTimeout(()=>{clearInterval(i);r();},4000);});}
  return pre0.call(C,scenes,onProg);};
// ---------- card ----------
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark';
function pill(ctx,txt,x,y,col,fs){const f=C.fitText(ctx,txt,900,1,fs,22,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+56,h=f.px+34;ctx.save();ctx.fillStyle='rgba(8,18,42,.85)';ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x+28,y+h/2+2);ctx.restore();return w;}
C.CARDS.clip={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=1-E.in(C.prog(t,sc.dur-.25,sc.dur)),ia=E.out(C.prog(t,0,.3)),x=vt(sc,C.starts[C.scenes.indexOf(sc)]+t);
  ctx.fillStyle='#050a1a';ctx.fillRect(0,0,W,H);
  if(!x){ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(S(d.clip)?'clip "'+S(d.clip)+'" nahi mila — 🎞 Clips se upload karo':'clip naam do',W/2,H/2);return;}
  const v=x.c.video,vw=x.c.w||1920,vh=x.c.h||1080;ctx.save();ctx.globalAlpha=ia;
  if(S(d.fit)==='contain'){C.cover(ctx,C.img(d.bg||BG),0,0,W,H,1);ctx.fillStyle='rgba(5,10,26,.55)';ctx.fillRect(0,0,W,H);const k=Math.min(W/vw,H/vh),w=vw*k,h=vh*k;try{ctx.drawImage(v,(W-w)/2,(H-h)/2,w,h);}catch(e){}}
  else{const k=Math.max(W/vw,H/vh),w=vw*k,h=vh*k;try{ctx.drawImage(v,(W-w)/2,(H-h)/2,w,h);}catch(e){}}
  ctx.restore();
  // neeche gaharaai
  const g=ctx.createLinearGradient(0,H*.55,0,H);g.addColorStop(0,'rgba(5,10,26,0)');g.addColorStop(1,'rgba(5,10,26,.82)');ctx.fillStyle=g;ctx.fillRect(0,H*.55,W,H*.45);
  ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.2,.7));ctx.globalAlpha=oa*tp;const f=C.fitText(ctx,String(d.title),1600,1,76,40,900);C.text(ctx,f.lines[0],W/2,100+16*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.globalAlpha=oa;}
  const sp=E.out(C.prog(t,.3,.8));
  if(S(d.src)){ctx.globalAlpha=oa*sp;pill(ctx,'SOURCE: '+S(d.src),50,d.title?170:50,col,34);ctx.globalAlpha=oa;}
  if(d.quote){const qp=E.back(C.prog(t,.4,1.0));ctx.save();ctx.globalAlpha=oa*Math.min(1,qp);ctx.font='900 320px Georgia, serif';ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=30;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('\u201C',60,H*.5-90);ctx.restore();}
  const lp=E.out(C.prog(t,.5,1.1));
  if(S(d.name)){ctx.globalAlpha=oa*lp;ctx.save();ctx.translate(-(1-lp)*60,0);const bx=60,by=H-(d.sub?330:200);ctx.fillStyle=col;ctx.fillRect(bx,by,12,S(d.role)?128:88);
    ctx.font=C.font(66,900);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';const fn=C.fitText(ctx,S(d.name),1200,1,66,32,900);ctx.font=C.font(fn.px,900);ctx.fillText(fn.lines[0],bx+34,by+44);
    if(S(d.role)){const fr=C.fitText(ctx,S(d.role),1200,1,44,24,700);ctx.font=C.font(fr.px,700);ctx.fillStyle='#b8c4e0';ctx.fillText(fr.lines[0],bx+34,by+100);}ctx.restore();ctx.globalAlpha=oa;}
  if(S(d.sub)){const sp2=E.out(C.prog(t,.6,1.1));ctx.globalAlpha=oa*sp2;const f=C.fitText(ctx,S(d.sub),1640,2,60,30,800);ctx.font=C.font(f.px,800);const lh=f.px*1.25,bh=f.lines.length*lh+36,by=H-60-bh;ctx.fillStyle='rgba(5,10,26,.78)';ctx.beginPath();ctx.roundRect(120,by,W-240,bh,22);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';f.lines.forEach((l,k)=>ctx.fillText(l,W/2,by+18+lh/2+k*lh));}
  ctx.restore();}};
// ---------- UI: 🎞 Clips ----------
let box=null;const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
function closeBox(){if(box){box.remove();box=null;}}
const mb=n=>(n/1048576).toFixed(1)+' MB';
function open(){if(box){closeBox();return;}const b=mk('div');box=b;b.id='clip_box';
  b.style.cssText='position:fixed;right:16px;bottom:310px;z-index:80;width:360px;max-height:60vh;overflow:auto;background:#1b1e25;border:1px solid #000;border-radius:10px;padding:12px;color:#e9edf3;font:13px system-ui,sans-serif;box-shadow:0 8px 28px #000c';
  b.innerHTML='<style>#clip_box button{font-size:12px;border-radius:5px;border:0;background:#2b2f38;color:#e9edf3;padding:6px 10px;cursor:pointer}#clip_box .row{display:flex;align-items:center;gap:6px;margin:6px 0;border-bottom:1px solid #2b2f38;padding-bottom:6px}#clip_box .g{background:#00c389;color:#04130e;font-weight:700;padding:6px 10px;border-radius:5px;cursor:pointer}</style><div style="display:flex;justify-content:space-between;align-items:center"><b>🎞 Video clips (R1)</b><button id="cx">✕</button></div><div style="margin:8px 0;color:#8b95a5;font-size:12px">Clip scene mein <code>clip:"file naam"</code> likho. Clip mute chalta hai. Browser mein save hota hai (repo mein nahi). Source tag zaroor lagao (<code>src</code>) — edit karne se copyright nahi hatta.</div><label class="g">+ Clip file (mp4/webm)<input id="cf" type="file" accept="video/*" multiple style="display:none"></label> <span id="cs" style="color:#ffd400;font-size:12px"></span><div id="cl" style="margin-top:8px"></div>';
  document.body.appendChild(b);const q=s=>b.querySelector(s);q('#cx').onclick=closeBox;
  const list=()=>{const L=q('#cl');L.innerHTML='';const ks=Object.keys(C.clips);if(!ks.length){L.innerHTML='<div style="color:#8b95a5">(koi clip nahi)</div>';return;}
    ks.forEach(k=>{const c=C.clips[k],r=mk('div','row');r.innerHTML='<div style="flex:1;overflow:hidden"><b style="word-break:break-all">'+k.replace(/</g,'&lt;')+'</b><br><span style="color:#8b95a5;font-size:11px">'+c.dur.toFixed(1)+'s · '+c.w+'x'+c.h+' · '+mb(c.size)+'</span></div>';const del=mk('button','','Hatao');del.onclick=async()=>{await C.clipDel(k);list();};r.appendChild(del);L.appendChild(r);});};
  list();
  q('#cf').onchange=async e=>{const fs=[...e.target.files];for(const f of fs){try{q('#cs').textContent='⏳ '+f.name;await C.clipAdd(f);q('#cs').textContent='✔ '+f.name;}catch(err){q('#cs').textContent='✖ '+err.message;}}list();e.target.value='';};}
C.clipsOpen=open;
const addBtn=()=>{const b2=document.getElementById('bar2');if(b2&&!document.getElementById('clip_btn')){const b=mk('button','','🎞 Clips');b.id='clip_btn';b.onclick=open;b2.appendChild(b);}
  const tt=document.getElementById('tl-tools');if(tt&&!document.getElementById('clip_btn2')){const b=mk('button','','🎞 Clips');b.id='clip_btn2';b.title='Video clips upload (R1)';b.onclick=open;tt.appendChild(b);}};
setInterval(addBtn,500);addBtn();
})();
