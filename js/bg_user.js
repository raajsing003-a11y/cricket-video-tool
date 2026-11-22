// C202: PC se apne BG videos. IndexedDB (cvt_bgu) mein save — reload ke baad bhi rehte hain.
// index.html (js/bg_video.js) aur reels.html dono yahi store use karte hain. Seamless loop ka kaam draw ke time (do video offset d/2 + crossfade FADE sec).
(function(){
const DB='cvt_bgu',ST='v',MAXN=40,MAXMB=400;
const U=window.BGU={items:[],urls:{},subs:[],FADE:.75,persist:true,seq:0};
let db=null;const mem={};
const open=()=>new Promise((res,rej)=>{try{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{r.result.createObjectStore(ST,{keyPath:'name'});};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('blocked'));}catch(e){rej(e);}});
const tx=(mode,fn)=>new Promise((res,rej)=>{const t=db.transaction(ST,mode),s=t.objectStore(ST);let q=fn(s);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error);});
const put=async rec=>{if(db)await tx('readwrite',s=>s.put(rec));else mem[rec.name]=rec;};
const del=async name=>{if(db)await tx('readwrite',s=>s.delete(name));else delete mem[name];};
const wipe=async()=>{if(db)await tx('readwrite',s=>s.clear());else Object.keys(mem).forEach(k=>delete mem[k]);};
function register(rec){if(U.urls[rec.name])return;U.urls[rec.name]=URL.createObjectURL(rec.blob);U.items.push({name:rec.name,label:rec.label,dur:rec.dur,w:rec.w,h:rec.h,added:rec.added});}
const fire=()=>U.subs.forEach(f=>{try{f();}catch(e){}});
U.on=f=>{U.subs.push(f);};
U.is=n=>!!U.urls[n];
U.src=n=>U.urls[n];
U.names=()=>U.items.map(x=>x.name);
const probe=f=>new Promise(res=>{const u=URL.createObjectURL(f),v=document.createElement('video');let done=false,tm=0;
  const fin=ok=>{if(done)return;done=true;clearTimeout(tm);const r={ok:ok&&v.videoWidth>0&&isFinite(v.duration)&&v.duration>=.8,dur:v.duration||0,w:v.videoWidth||0,h:v.videoHeight||0};try{v.removeAttribute('src');v.load();}catch(e){}URL.revokeObjectURL(u);res(r);};
  v.muted=true;v.preload='auto';v.onloadeddata=()=>fin(true);v.onerror=()=>fin(false);tm=setTimeout(()=>fin(false),12000);v.src=u;});
const slug=s=>(String(s).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,20))||'video';
U.ready=(async()=>{try{db=await open();const all=(await tx('readonly',s=>s.getAll()))||[];all.sort((a,b)=>a.added-b.added).forEach(register);}catch(e){db=null;U.persist=false;}fire();})();
U.init=()=>U.ready;
U.add=async function(files){await U.ready;const r={added:[],bad:[]};
  for(const f of Array.from(files||[])){const base=String(f.name||'video').replace(/\.[^.]+$/,''),label=base.slice(0,28);
    if(!(String(f.type).indexOf('video')===0||/\.(mp4|webm|mov|m4v|mkv)$/i.test(f.name||''))){r.bad.push(label+' (video nahi)');continue;}
    if(f.size>MAXMB*1048576){r.bad.push(label+' (>'+MAXMB+'MB)');continue;}
    if(U.items.length>=MAXN){r.bad.push(label+' (limit '+MAXN+')');continue;}
    const p=await probe(f);if(!p.ok){r.bad.push(label+(p.dur&&p.dur<.8?' (bahut chhota)':' (chala nahi)'));continue;}
    const rec={name:'u'+Date.now().toString(36)+(++U.seq)+'_'+slug(base),label,blob:f,dur:p.dur,w:p.w,h:p.h,added:Date.now()+U.seq};
    try{await put(rec);}catch(e){r.bad.push(label+' (save nahi hua)');continue;}
    register(rec);r.added.push(rec.name);}
  fire();return r;};
U.remove=async function(name){await U.ready;try{await del(name);}catch(e){}if(U.urls[name]){try{URL.revokeObjectURL(U.urls[name]);}catch(e){}delete U.urls[name];}U.items=U.items.filter(x=>x.name!==name);fire();};
U.clear=async function(){await U.ready;try{await wipe();}catch(e){}Object.keys(U.urls).forEach(k=>{try{URL.revokeObjectURL(U.urls[k]);}catch(e){}});U.urls={};U.items=[];fire();};
})();
