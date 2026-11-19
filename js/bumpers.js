// C165: 🎬 Intro / Outro (aur koi bhi extra video). PC se upload, browser mein save (library = 🎞 Clips wali IndexedDB 'cvt_clips'),
// har video ki apni awaaz + volume slider (0-300%), shuru mein ya aakhir mein, Fast export mein final MP4 ke andar judta hai.
// API: BUMP.items [{id,clip,where:'start'|'end',vol:100,fit:'contain'|'cover',on:true}], BUMP.prepare(FPS) (export_fast.js use karta hai), BUMP.cleanup(list)
// Settings localStorage 'cvt_bumpers' mein. Video khud C.clips (IndexedDB) mein. Real-time export mein bumpers NAHI judte (sirf Fast export).
(function(){const C=window.CORE,X=window.EXPORT;
const KEY='cvt_bumpers',mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const B=window.BUMP={items:[],box:null};
let uid=1;
const def=()=>[{id:uid++,clip:'',where:'start',vol:100,fit:'contain',on:true},{id:uid++,clip:'',where:'end',vol:100,fit:'contain',on:true}];
function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&Array.isArray(j.items)&&j.items.length){B.items=j.items.map(o=>({id:uid++,clip:String(o.clip||''),where:o.where==='end'?'end':'start',vol:Math.max(0,Math.min(300,+o.vol>=0?+o.vol:100)),fit:o.fit==='cover'?'cover':'contain',on:o.on!==false}));return;}}catch(e){}B.items=def();}
B.save=()=>{try{localStorage.setItem(KEY,JSON.stringify({items:B.items.map(({clip,where,vol,fit,on})=>({clip,where,vol,fit,on}))}));}catch(e){}};
load();
const FPS=()=>C.FPS;
// kaun kaun se items abhi export mein jayenge (start wale pehle, end wale baad mein, list ke order mein)
B.active=()=>{const ok=B.items.filter(o=>o.on&&o.clip&&C.clips[o.clip]);return{pre:ok.filter(o=>o.where==='start'),post:ok.filter(o=>o.where==='end')};};
B.secs=()=>{const a=B.active(),f=o=>Math.round(C.clips[o.clip].dur*FPS())/FPS();return{pre:a.pre.reduce((s,o)=>s+f(o),0),post:a.post.reduce((s,o)=>s+f(o),0)};};
const mkVid=blob=>new Promise((res,rej)=>{const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.src=URL.createObjectURL(blob);v.onloadedmetadata=()=>res(v);v.onerror=()=>rej(new Error('video khula nahi'));});
// export ke liye taiyari: har item ka alag <video> (frame-exact seek) + decode kiya hua audio
B.prepare=async function(fps){const a=B.active(),out={pre:[],post:[],hasAudio:false,warn:[]};
  const ac=X.actx=X.actx||new (window.AudioContext||window.webkitAudioContext)();
  const one=async o=>{const c=C.clips[o.clip],video=await mkVid(c.blob);let buf=null;
    if(o.vol>0){try{buf=await ac.decodeAudioData(await c.blob.arrayBuffer());}catch(e){buf=null;}} // bina awaaz wala video bhi chalega
    if(buf)out.hasAudio=true;
    return{item:o,name:o.clip,video,buf,dur:video.duration,w:video.videoWidth||c.w||1920,h:video.videoHeight||c.h||1080,frames:Math.max(1,Math.round(video.duration*fps)),vol:o.vol/100,fit:o.fit};};
  for(const o of a.pre)out.pre.push(await one(o));
  for(const o of a.post)out.post.push(await one(o));
  return out;};
B.cleanup=function(list){[].concat(list.pre||[],list.post||[]).forEach(x=>{try{URL.revokeObjectURL(x.video.src);}catch(e){}x.video.removeAttribute('src');try{x.video.load();}catch(e){}});};
const seekTo=(v,t)=>new Promise(res=>{if(Math.abs(v.currentTime-t)<.0005&&v.readyState>=2){res();return;}let d=false;const f=()=>{if(d)return;d=true;v.removeEventListener('seeked',f);res();};v.addEventListener('seeked',f);v.currentTime=t;setTimeout(f,1500);});
// export frame: bumper ka frame canvas par (fit: contain = kaali patti, cover = poori screen)
B.drawFrame=async function(ctx,x,i,fps){const W=C.W,H=C.H;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  await seekTo(x.video,Math.max(0,Math.min(x.dur-.001,i/fps)));
  const k=x.fit==='cover'?Math.max(W/x.w,H/x.h):Math.min(W/x.w,H/x.h),w=x.w*k,h=x.h*k;
  try{ctx.drawImage(x.video,(W-w)/2,(H-h)/2,w,h);}catch(e){}};
// ---------- UI ----------
const fmt=s=>s.toFixed(1)+'s';
const mb=n=>(n/1048576).toFixed(1)+' MB';
function label(o,idx){const same=B.items.filter(z=>z.where===o.where),n=same.indexOf(o)+1;return(o.where==='start'?'Intro':'Outro')+(same.length>1?' '+n:'');}
function render(){const b=B.box;if(!b)return;const L=b.querySelector('#bm_list');L.innerHTML='';
  B.items.forEach((o,i)=>{const c=C.clips[o.clip],r=mk('div','bm_it');if(!o.on)r.style.opacity='.55';
    const opts='<option value="">(video chuno)</option>'+Object.keys(C.clips).map(k=>'<option value="'+esc(k)+'"'+(k===o.clip?' selected':'')+'>'+esc(k)+' · '+fmt(C.clips[k].dur)+'</option>').join('');
    r.innerHTML='<div class="bm_h"><label><input type="checkbox" class="on"'+(o.on?' checked':'')+'> <b>'+label(o)+'</b></label>'
      +'<select class="wh"><option value="start"'+(o.where==='start'?' selected':'')+'>Shuru mein</option><option value="end"'+(o.where==='end'?' selected':'')+'>Aakhir mein</option></select>'
      +'<span style="flex:1"></span><button class="up" title="upar">↑</button><button class="dn" title="neeche">↓</button><button class="eye" title="dekho + awaaz suno">👁</button><button class="rm" title="is slot ko hatao (video library mein rehta hai)">✕</button></div>'
      +'<select class="cl">'+opts+'</select>'
      +(o.clip&&!c?'<div style="color:#ff9b9b;font-size:11px;margin-top:4px">⚠ "'+esc(o.clip)+'" library mein nahi mila — dobara upload karo</div>':'')
      +'<div class="bm_v"><span>🔊 Awaaz</span><input type="range" class="vol" min="0" max="300" step="5" value="'+o.vol+'"><b class="vn">'+o.vol+'%</b><button class="v0">100%</button><button class="vm">Mute</button></div>'
      +'<div class="bm_v"><span>🖼 Fit</span><select class="ft"><option value="contain"'+(o.fit==='contain'?' selected':'')+'>Poora dikhe (kaali patti)</option><option value="cover"'+(o.fit==='cover'?' selected':'')+'>Screen bhare (kinare kat sakte)</option></select></div>';
    const q=s=>r.querySelector(s);
    q('.on').onchange=e=>{o.on=e.target.checked;B.save();render();};
    q('.wh').onchange=e=>{o.where=e.target.value;B.save();render();};
    q('.cl').onchange=e=>{o.clip=e.target.value;B.save();render();};
    const setV=v=>{o.vol=Math.max(0,Math.min(300,Math.round(v)));q('.vol').value=o.vol;q('.vn').textContent=o.vol+'%';B.save();sum();if(prevO===o)applyPrevVol();};
    q('.vol').oninput=e=>setV(+e.target.value);q('.v0').onclick=()=>setV(100);q('.vm').onclick=()=>setV(0);
    q('.ft').onchange=e=>{o.fit=e.target.value;B.save();};
    q('.rm').onclick=()=>{if(B.items.length>1)B.items.splice(i,1);else{o.clip='';}B.save();render();};
    q('.up').onclick=()=>{if(i>0){[B.items[i-1],B.items[i]]=[B.items[i],B.items[i-1]];B.save();render();}};
    q('.dn').onclick=()=>{if(i<B.items.length-1){[B.items[i+1],B.items[i]]=[B.items[i],B.items[i+1]];B.save();render();}};
    q('.eye').onclick=()=>{if(!c){st('⚠ pehle video chuno');return;}preview(o);};
    L.appendChild(r);});
  const lib=b.querySelector('#bm_lib');lib.innerHTML='';const ks=Object.keys(C.clips);
  if(!ks.length)lib.innerHTML='<div style="color:#8b95a5">(library khaali — upar PC se video add karo)</div>';
  ks.forEach(k=>{const c=C.clips[k],r=mk('div','bm_lr');r.innerHTML='<div style="flex:1;overflow:hidden"><b style="word-break:break-all">'+esc(k)+'</b><br><span style="color:#8b95a5;font-size:11px">'+fmt(c.dur)+' · '+c.w+'x'+c.h+' · '+mb(c.size)+'</span></div>';
    const d=mk('button','','Hatao');d.onclick=async()=>{if(!confirm('"'+k+'" library se hamesha ke liye hatao?'))return;await C.clipDel(k);B.items.forEach(o=>{if(o.clip===k)o.clip='';});B.save();render();};r.appendChild(d);lib.appendChild(r);});
  sum();}
function sum(){const b=B.box;if(!b)return;const s=B.secs(),m=C.total||0,a=B.active();
  b.querySelector('#bm_sum').innerHTML='Final video: <b>'+fmt(s.pre)+'</b> intro + <b>'+fmt(m)+'</b> main + <b>'+fmt(s.post)+'</b> outro = <b>'+fmt(s.pre+m+s.post)+'</b> ('+(a.pre.length+a.post.length)+' video judenge)';}
function st(t){const b=B.box;if(b)b.querySelector('#bm_st').textContent=t;}
// ---------- preview (awaaz ke saath, volume slider ka asar) ----------
let pv=null,prevO=null,pvGain=null;
function applyPrevVol(){if(pvGain&&prevO)pvGain.gain.value=prevO.vol/100;}
function closePrev(){if(pv){try{pv.v.pause();}catch(e){}try{pv.ac.close();}catch(e){}try{URL.revokeObjectURL(pv.v.src);}catch(e){}pv.el.remove();pv=null;pvGain=null;prevO=null;}}
function preview(o){closePrev();const c=C.clips[o.clip];if(!c)return;prevO=o;
  const el=mk('div');el.style.cssText='position:fixed;inset:0;z-index:120;background:#000c;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px';
  const v=document.createElement('video');v.style.cssText='max-width:80vw;max-height:70vh;background:#000;border-radius:8px';v.controls=true;v.src=URL.createObjectURL(c.blob);
  const info=mk('div','',esc(o.clip)+' — awaaz '+o.vol+'% (slider se badlo, yahin turant sunayi dega)');info.style.cssText='color:#e9edf3;font:13px system-ui';
  const x=mk('button','','✕ Band karo');x.style.cssText='background:#e5262d;color:#fff;border:0;border-radius:6px;padding:8px 14px;cursor:pointer';x.onclick=closePrev;
  el.append(v,info,x);document.body.appendChild(el);
  const ac=new (window.AudioContext||window.webkitAudioContext)();pvGain=ac.createGain();pvGain.gain.value=o.vol/100;
  try{const s=ac.createMediaElementSource(v);s.connect(pvGain);pvGain.connect(ac.destination);}catch(e){}
  pv={v,ac,el};ac.resume().catch(()=>{});v.play().catch(()=>{});}
// ---------- upload / default ----------
async function addFiles(files){const done=[];for(const f of files){try{st('⏳ '+f.name);await C.clipAdd(f);done.push(f.name);}catch(e){st('✖ '+f.name+': '+e.message);}}
  // naya video khaali slot mein apne aap (pehle Intro, phir Outro)
  done.forEach(n=>{const slot=B.items.find(o=>o.on&&!o.clip&&!B.items.some(z=>z.clip===n));if(slot&&!B.items.some(z=>z.clip===n))slot.clip=n;});
  B.save();if(done.length)st('✔ '+done.length+' video library mein save (browser mein, future ke liye)');render();}
const DEFAULTS=[['intro_8s.mp4','assets/22_bumpers/intro_8s.mp4','start'],['outro_6s.mp4','assets/22_bumpers/outro_6s.mp4','end']];
async function loadDefaults(){let n=0;for(const [name,url,where] of DEFAULTS){try{st('⏳ '+name);const r=await fetch(url);if(!r.ok)throw new Error('HTTP '+r.status);const blob=await r.blob();
      await C.clipAdd(new File([blob],name,{type:'video/mp4'}));
      const o=B.items.find(z=>z.where===where&&!z.clip);
      if(o)o.clip=name;else if(!B.items.some(z=>z.clip===name))B.items.push({id:uid++,clip:name,where,vol:100,fit:'contain',on:true});n++;}
    catch(e){st('✖ '+name+': '+e.message+' (file:// se nahi chalta — GitHub Pages / local server par chalega, ya PC se upload karo)');return render();}}
  B.save();st('✔ default intro + outro load ho gaye ('+n+')');render();}
function open(){if(B.box){close();return;}const b=mk('div');B.box=b;b.id='bm_box';
  b.style.cssText='position:fixed;right:16px;bottom:310px;z-index:80;width:400px;max-height:72vh;overflow:auto;background:#1b1e25;border:1px solid #000;border-radius:10px;padding:12px;color:#e9edf3;font:13px system-ui,sans-serif;box-shadow:0 8px 28px #000c';
  b.innerHTML='<style>#bm_box button{font-size:12px;border-radius:5px;border:0;background:#2b2f38;color:#e9edf3;padding:6px 10px;cursor:pointer}#bm_box .g{background:#00c389;color:#04130e;font-weight:700;padding:7px 11px;border-radius:5px;cursor:pointer;display:inline-block}'
    +'#bm_box .bm_it{background:#22262f;border:1px solid #2f3541;border-radius:8px;padding:8px;margin:8px 0}#bm_box .bm_h{display:flex;align-items:center;gap:6px;margin-bottom:6px}#bm_box .bm_v{display:flex;align-items:center;gap:6px;margin-top:6px}#bm_box .bm_v>span{width:62px;color:#aab4c4}#bm_box .bm_v input[type=range]{flex:1;accent-color:#00c389}#bm_box select{background:#10141a;color:#e9edf3;border:1px solid #2f3541;border-radius:5px;padding:4px;max-width:100%}#bm_box .cl{width:100%}#bm_box .bm_lr{display:flex;align-items:center;gap:6px;margin:5px 0;border-bottom:1px solid #2b2f38;padding-bottom:5px}</style>'
    +'<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:15px">🎬 Intro / Outro / Extra video</b><button id="bm_x">✕</button></div>'
    +'<div style="color:#8b95a5;font-size:12px;margin:4px 0 8px">Video ki apni awaaz saath judti hai. Volume 0-300%. Library browser mein save rehti hai.</div>'
    +'<div style="display:flex;gap:6px;flex-wrap:wrap"><label class="g">⬆ PC se video add<input type="file" id="bm_f" accept="video/*" multiple style="display:none"></label><button id="bm_d">📦 Default intro+outro</button><button id="bm_a">➕ Aur video slot</button></div>'
    +'<div id="bm_list"></div><div id="bm_sum" style="margin:8px 0;color:#cfe3ff"></div>'
    +'<div style="color:#f5c518;font-size:12px;margin-bottom:6px">⚠ Sirf ⚡ Fast export mein judte hain (Real-time export mein nahi). Main player preview mein bhi nahi dikhte: 👁 se alag dekho.</div>'
    +'<div id="bm_st" style="min-height:16px;color:#9fd5ff;font-size:12px"></div>'
    +'<details style="margin-top:8px"><summary style="cursor:pointer;color:#aab4c4">📚 Saved video library</summary><div id="bm_lib"></div></details>';
  document.body.appendChild(b);
  b.querySelector('#bm_x').onclick=close;
  b.querySelector('#bm_f').onchange=async e=>{const fs=[...e.target.files];e.target.value='';await addFiles(fs);};
  b.querySelector('#bm_d').onclick=loadDefaults;
  b.querySelector('#bm_a').onclick=()=>{B.items.push({id:uid++,clip:'',where:'end',vol:100,fit:'contain',on:true});B.save();render();};
  render();}
function close(){closePrev();if(B.box){B.box.remove();B.box=null;}}
B.open=open;
const addBtn=()=>{const b2=document.getElementById('bar2');if(b2&&!document.getElementById('bm_btn')){const b=mk('button','','🎬 Intro/Outro');b.id='bm_btn';b.onclick=open;b2.appendChild(b);}
  const tt=document.getElementById('tl-tools');if(tt&&!document.getElementById('bm_btn2')){const b=mk('button','','🎬 Intro/Outro');b.id='bm_btn2';b.title='Intro / Outro / extra video (C165)';b.onclick=open;tt.appendChild(b);}};
setInterval(addBtn,500);addBtn();
// library restore ke baad dropdown taazi karo; scenes badalne par total update
const t0=setInterval(()=>{if(C.clipsReady){clearInterval(t0);if(B.box)render();}},300);setTimeout(()=>clearInterval(t0),8000);
})();
