// C8+C15: photo library (IndexedDB, naam se save). API: PHOTOS.init(CORE,onChange), PHOTOS.slots(), PHOTOS.label(id), PHOTOS.set(id,file), PHOTOS.addCustom(name)
// 97 built-in player slots + apne naam wale custom slots (player ya kisi bhi type ki photo: "स्टेडियम भीड़", "ट्रॉफी" ...). Browser mein save rehti hain; backup/restore JSON se.
(function(){
const DB='cvt_photos',ST='p',CK='cvt_photo_custom';
function db(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function tx(mode,fn){const d=await db();return new Promise((res,rej)=>{const t=d.transaction(ST,mode),s=t.objectStore(ST),q=fn(s);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error);});}
const dbPut=(k,b)=>tx('readwrite',s=>s.put(b,k)),dbDel=k=>tx('readwrite',s=>s.delete(k)),
 dbKeys=()=>tx('readonly',s=>s.getAllKeys()),dbGet=k=>tx('readonly',s=>s.get(k));
function blobImg(b){return new Promise((res,rej)=>{const u=URL.createObjectURL(b),im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error('image load fail'));im.src=u;});}
const P={have:{},C:null,onChange:null,filter:'',custom:[]};
try{P.custom=JSON.parse(localStorage.getItem(CK)||'[]')||[];}catch(e){P.custom=[];}
const saveCustom=()=>{try{localStorage.setItem(CK,JSON.stringify(P.custom));}catch(e){}};
P.slots=()=>(window.PHOTO_SLOTS||[]).concat(P.custom.map(c=>({id:c.id,city:'custom',hi:c.name,en:'',custom:1})));
P.label=id=>{if(!id)return '';const b=String(id).split('#'),s=P.slots().find(x=>x.id===b[0]);const nm=s?(s.hi+(s.en?' · '+s.en:'')):b[0];return b.length>1?nm+' #'+b[1]:nm;};
P.addCustom=name=>{name=String(name||'').trim();if(!name)return null;
 const id='custom_'+name.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu,'_').replace(/^_|_$/g,'');
 if(!P.custom.find(c=>c.id===id)){P.custom.push({id,name});saveCustom();}return id;};
// C162: scene JSON mein jo custom_<naam> id hai wo library mein na ho to apne aap naam-slot ban jaye (sirf photo upload karni pade)
P.ensureCustom=(id,name)=>{id=String(id||'').trim().split('#')[0];if(id.indexOf('custom_')!==0||id.length<=7)return false;
 if(P.slots().find(x=>x.id===id))return false;
 if(!name)name=id.slice(7).replace(/_+/g,' ').trim().replace(/(^|\s)(\p{Ll})/gu,(m,a,b)=>a+b.toUpperCase());
 P.custom.push({id,name});saveCustom();return true;};
P.autoFromScenes=scenes=>{const made=[];if(!Array.isArray(scenes))return made;
 const one=v=>{if(typeof v==='string'&&P.ensureCustom(v))made.push(P.label(v));};
 scenes.forEach(sc=>{const d=sc&&sc.data;if(!d||typeof d!=='object')return;one(d.photo);if(Array.isArray(d.photos))d.photos.forEach(one);});
 return made;};
P.removeCustom=async id=>{P.custom=P.custom.filter(c=>c.id!==id);saveCustom();await P.remove(id);};
P.set=async(slot,file)=>{await dbPut(slot,file);P.C.setPhoto(slot,await blobImg(file));P.have[slot]=1;P.onChange&&P.onChange(slot);};
P.remove=async slot=>{await dbDel(slot);delete P.C.photos[slot];delete P.have[slot];P.onChange&&P.onChange(slot);};
P.init=async(C,onChange)=>{P.C=C;P.onChange=onChange;
 try{const ks=await dbKeys();for(const k of ks){try{C.setPhoto(k,await blobImg(await dbGet(k)));P.have[k]=1;}catch(e){}}}catch(e){console.warn('IndexedDB:',e);}
 buildUI();};
// backup / restore (browser data clear hone se bachne ke liye)
const b2d=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b);});
P.exportAll=async()=>{const out={v:1,custom:P.custom,frames:(window.PFR?PFR.all():{}),photos:{}};for(const k of await dbKeys()){out.photos[k]=await b2d(await dbGet(k));}
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:'application/json'}));a.download='photo_library_backup.json';a.click();return Object.keys(out.photos).length;};
P.importAll=async file=>{const j=JSON.parse(await file.text());let n=0;
 (j.custom||[]).forEach(c=>{if(!P.custom.find(x=>x.id===c.id))P.custom.push(c);});saveCustom();window.PFR&&PFR.stash(j.frames);
 for(const k of Object.keys(j.photos||{})){const b=await (await fetch(j.photos[k])).blob();await P.set(k,b);n++;}return n;};
// C160: PC ke folder mein save / folder se load (File System Access API, Chrome desktop). File naam = slot id + .jpg/.png/.webp, naam list _photo_names.json
const EXT={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif'};
P.saveToFolder=async()=>{if(!window.showDirectoryPicker)throw new Error('Is browser mein folder save nahi (Chrome desktop chahiye)');
 const dir=await window.showDirectoryPicker({mode:'readwrite',id:'cvt_photos'});let n=0;
 for(const k of await dbKeys()){const b=await dbGet(k);if(!b)continue;const fh=await dir.getFileHandle(k+(EXT[b.type]||'.jpg'),{create:true});const w=await fh.createWritable();await w.write(b);await w.close();n++;}
 const nf=await dir.getFileHandle('_photo_names.json',{create:true});const w2=await nf.createWritable();await w2.write(JSON.stringify({v:1,custom:P.custom,frames:(window.PFR?PFR.all():{})},null,1));await w2.close();return n;};
P.loadFromFolder=async()=>{if(!window.showDirectoryPicker)throw new Error('Is browser mein folder load nahi (Chrome desktop chahiye)');
 const dir=await window.showDirectoryPicker({mode:'read',id:'cvt_photos'});let n=0;const files=[];let names=null;
 for await(const e of dir.values()){if(e.kind!=='file')continue;if(e.name==='_photo_names.json'){try{names=JSON.parse(await (await e.getFile()).text());}catch(x){}continue;}
  const m=/^(.+)\.(jpe?g|png|webp|gif)$/i.exec(e.name);if(m)files.push([m[1],e]);}
 ((names&&names.custom)||[]).forEach(c=>{if(c&&c.id&&!P.custom.find(x=>x.id===c.id))P.custom.push(c);});window.PFR&&names&&PFR.stash(names.frames);
 for(const[id,e]of files){if(id.indexOf('custom_')===0&&!P.custom.find(x=>x.id===id)&&!(window.PHOTO_SLOTS||[]).find(x=>x.id===id))P.custom.push({id,name:id.slice(7).replace(/_/g,' ')});}
 saveCustom();for(const[id,e]of files){await P.set(id,await e.getFile());n++;}return n;};
let panel,list;
const CITY_HI={chennai:'चेन्नई',mumbai:'मुंबई',punjab:'पंजाब',lucknow:'लखनऊ',gujarat:'गुजरात',rajasthan:'राजस्थान',kolkata:'कोलकाता',hyderabad:'हैदराबाद',delhi:'दिल्ली',bengaluru:'बेंगलुरु',custom:'मेरे जोड़े हुए नाम'};
P.cityHi=c=>CITY_HI[c]||c;
function buildUI(){
 panel=document.createElement('div');
 panel.style.cssText='display:none;margin-top:8px;background:#1b1b1b;border-radius:6px;padding:8px';
 panel.innerHTML='<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><input id="phq" placeholder="खोज: नाम / city / name" style="flex:1;min-width:160px;padding:8px;font-size:15px"><span id="phc" style="font-size:13px"></span></div>'
  +'<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><input id="phn" placeholder="नया नाम (player ya photo type: रोहित शर्मा, स्टेडियम भीड़…)" style="flex:1;min-width:200px;padding:8px;font-size:14px"><button id="pha" style="background:#2a6;padding:8px 12px">+ नाम जोड़ो</button><button id="phx" style="background:#555;padding:8px 12px">⬆ Backup</button><button id="phi" style="background:#555;padding:8px 12px">⬇ Restore</button><button id="phd" style="background:#1a6;padding:8px 12px">📁 Folder mein save</button><button id="phr" style="background:#16a;padding:8px 12px">📂 Folder se load</button><input type="file" id="phf" accept=".json" style="display:none"></div>'
  +'<div id="phl" style="max-height:340px;overflow:auto;margin-top:6px"></div>';
 document.getElementById('wrap').insertBefore(panel,document.getElementById('info'));
 list=panel.querySelector('#phl');
 panel.querySelector('#phq').oninput=e=>{P.filter=e.target.value.trim().toLowerCase();render();};
 panel.querySelector('#pha').onclick=()=>{const i=panel.querySelector('#phn');if(P.addCustom(i.value)){i.value='';render();P.onChange&&P.onChange();}};
 panel.querySelector('#phx').onclick=async()=>{try{const n=await P.exportAll();alert(n+' photos ka backup download hua (photo_library_backup.json). Isse kahin safe rakho.');}catch(e){alert('Backup error: '+e.message);}};
 panel.querySelector('#phd').onclick=async()=>{try{const n=await P.saveToFolder();alert(n+' photos folder mein save ho gayi. Ye folder safe rakho (Drive/pen drive mein bhi copy karo).');}catch(e){if(e.name!=='AbortError')alert('Folder save error: '+e.message);}};
 panel.querySelector('#phr').onclick=async()=>{try{const n=await P.loadFromFolder();alert(n+' photos folder se load ho gayi.');render();}catch(e){if(e.name!=='AbortError')alert('Folder load error: '+e.message);}};
 panel.querySelector('#phi').onclick=()=>panel.querySelector('#phf').click();
 panel.querySelector('#phf').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const n=await P.importAll(f);alert(n+' photos restore ho gayi.');render();}catch(err){alert('Restore error: '+err.message);}e.target.value='';};
 const b=document.createElement('button');b.id='phb';b.textContent='🖼 Photos';b.onclick=()=>{panel.style.display=panel.style.display==='none'?'block':'none';render();};
 document.getElementById('bar2').appendChild(b);
}
function render(){
 if(!panel||panel.style.display==='none')return;
 const S=P.slots(),q=P.filter;let n=0;for(const s of S)if(P.have[s.id])n++;
 panel.querySelector('#phc').textContent=n+'/'+S.length+' photos uploaded';
 list.textContent='';let last='';
 const order=S.slice().sort((a,b)=>(a.city==='custom'?0:1)-(b.city==='custom'?0:1));
 for(const s of order){
  if(q&&!(s.hi+' '+s.en+' '+s.city+' '+(CITY_HI[s.city]||'')).toLowerCase().includes(q))continue;
  if(s.city!==last){last=s.city;const h=document.createElement('div');h.textContent=(CITY_HI[s.city]||s.city)+(s.city==='custom'?'':' ('+s.city+')');h.style.cssText='font-weight:bold;margin:8px 0 2px;color:#fc3';list.appendChild(h);}
  const r=document.createElement('div');r.style.cssText='display:flex;align-items:center;gap:8px;padding:3px 0;font-size:14px';
  const th=document.createElement('div');th.style.cssText='width:34px;height:42px;background:#333;border-radius:3px;flex:none;background-size:cover;background-position:top';
  const im=P.have[s.id]&&P.C.photos[s.id];if(im)th.style.backgroundImage='url('+im.src+')';
  const nm=document.createElement('div');nm.style.flex='1';nm.textContent=s.hi+(s.en?' · '+s.en:'');
  const up=document.createElement('label');up.style.cssText='background:#2a6;padding:6px 10px;border-radius:5px;cursor:pointer';up.textContent=P.have[s.id]?'बदलो':'अपलोड';
  const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.style.display='none';
  fi.onchange=async()=>{if(fi.files[0]){try{await P.set(s.id,fi.files[0]);}catch(e){alert('Photo error: '+e.message);}render();}};
  up.appendChild(fi);r.append(th,nm,up);
  if(P.have[s.id]){const x=document.createElement('button');x.textContent='✕';x.title='photo hatao';x.style.cssText='padding:6px 10px;background:#555';x.onclick=async()=>{await P.remove(s.id);render();};r.appendChild(x);}
  if(P.have[s.id]&&window.PFR){const fb=document.createElement('button');fb.textContent='🎯';fb.title='Crop / zoom / face adjust';fb.style.cssText='padding:6px 10px;background:#8a4';fb.onclick=()=>PFR.edit(s.id,render);r.appendChild(fb);}
  if(s.custom){const x=document.createElement('button');x.textContent='🗑';x.title='naam hatao';x.style.cssText='padding:6px 10px;background:#822';x.onclick=async()=>{if(confirm(s.hi+' naam aur photo hata dun?')){await P.removeCustom(s.id);render();}};r.appendChild(x);}
  list.appendChild(r);
  if(P.rowExtra&&!s.custom_skip&&P.have[s.id])P.rowExtra(s,list);
 }
}
P.render=render;
window.PHOTOS=P;
})();
