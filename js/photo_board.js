// C194: 🖼 Sab photos board — poore video ke saare scenes ki photos ek jagah.
// - har scene mein jo photo dikhegi (card + side cameo + side fill) tile mein; ✕/🗑 hatao, 🔁 agli photo, ⬆ nayi upload, 🔍 Google (extension) se nayi
// - ek player ki photo ek se zyada scene mein ho to har baar alag photo (auto-rotate, photo_variants.js); kam padi to yahan "kitni aur chahiye" + Google/upload
// - missing photo ke aage 🔍 icon (scene editor ke 📷 box mein bhi) = Photo Finder extension se seedha upload
(function(){
const C=window.CORE,SE=window.SE,P=window.PHOTOS;if(!C||!SE||!P)return;
const bk=k=>String(k).split('#')[0];
const el=(t,css,txt)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e;};
const B=(txt,fn,bg,title)=>{const b=el('button','padding:3px 7px;font-size:13px;margin:1px;border:0;border-radius:5px;color:#fff;cursor:pointer;background:'+(bg||'#444'),txt);if(title)b.title=title;b.onclick=ev=>{ev.stopPropagation();fn(ev);};return b;};
const pending={},reserved={};
let ov=null,onlyBad=false,q=null,qRun=false,status='';

// ---------- extension (Photo Finder v1.2+) ----------
const extOk=()=>typeof window.PF_FIND==='function';
function extMissing(){alert('Photo Finder extension nahi mila (ya purana hai).\n\n1) chrome://extensions kholo\n2) Photo Finder par Reload dabao (v1.2 chahiye — is zip ka photo_finder_extension folder Load unpacked karo)\n3) is tool page ko refresh karo (F5).');}
function nextVarId(b){let n=2;while(P.have[b+'#'+n]||reserved[b+'#'+n])n++;return b+'#'+n;}
function countOf(b){let n=P.have[b]?1:0;Object.keys(P.have).forEach(k=>{if(k.indexOf(b+'#')===0)n++;});return n;}
// newId = jo slot id banega (base ya base#n). nth = Google ki kaun si image (0 = pehli) taaki dusri photo aaye
function google(newId,cb,nth){if(!extOk()){extMissing();return false;}
  if(cb)pending[newId]=cb;const ok=window.PF_FIND(newId,{auto:true,nth:nth||0});if(!ok){delete pending[newId];alert('Is naam ka slot library mein nahi mila.');}return ok;}
function freshId(b){return P.have[b]?nextVarId(b):b;}
function googleBtn(id,cb){const b=B('🔍','', '#1a73e8','Photo Finder extension se Google se seedha photo lo');
  b.style.cssText+=';padding:5px 9px';b.onclick=ev=>{ev.stopPropagation();const base=bk(id);const nid=freshId(base);reserved[nid]=1;google(nid,cb,countOf(base));};return b;}

// ---------- P.set / P.remove ke baad board + cameo refresh ----------
let tm=0;const later=()=>{clearTimeout(tm);tm=setTimeout(()=>{if(ov&&ov.style.display!=='none')render();},120);};
const set0=P.set;P.set=async function(slot){const r=await set0.apply(this,arguments);
  try{C.photoRefresh&&C.photoRefresh();const cb=pending[slot];delete reserved[slot];if(cb){delete pending[slot];if(typeof cb==='function')cb(slot);}
   window.PLAYER&&PLAYER.draw&&PLAYER.draw();}catch(e){}later();return r;};
const rem0=P.remove;P.remove=async function(){const r=await rem0.apply(this,arguments);try{C.photoRefresh&&C.photoRefresh();window.PLAYER&&PLAYER.draw&&PLAYER.draw();}catch(e){}later();return r;};
// extension ka "result" (skip/cancel/ok) — queue aage badhao
window.addEventListener('message',e=>{if(e.source!==window||!e.data||e.data.src!=='pf-ext')return;const m=e.data.msg;if(!m||m.cmd!=='pf-result'||!qRun||!q||!q.cur||m.slotId!==q.cur.id)return;
  if(m.cancel){qRun=false;q=null;status='⏹ Queue roki gayi';later();return;}
  setTimeout(nextQ,700);});
function nextQ(){if(!qRun||!q)return;const it=q.items.shift();if(!it){qRun=false;q=null;status='✅ Queue poori';later();return;}
  q.cur=it;status='🔍 '+P.label(it.id)+' ('+q.items.length+' baaki)';later();
  reserved[it.id]=1;if(it.cb)pending[it.id]=it.cb;if(!window.PF_FIND(it.id,{auto:true,nth:it.nth})){qRun=false;q=null;status='⚠ extension jawab nahi de raha';later();}}
function startQueue(items){if(!extOk()){extMissing();return;}if(qRun)return;if(!items.length){alert('Koi kami nahi hai.');return;}
  if(items.length>8&&!confirm(items.length+' photo ek ke baad ek Google se aayengi. Chalu karun?'))return;q={items:items.slice(),cur:null};qRun=true;nextQ();}

// ---------- scene ke andar ki photo refs ----------
function slotSet(){const s=new Set();P.slots().forEach(x=>s.add(x.id));return s;}
function walk(o,SS,out,depth){if(!o||typeof o!=='object'||depth>4)return;
  Object.keys(o).forEach(k=>{if(k==='names'||k==='noCameoIds')return;const v=o[k];
    if(typeof v==='string'){if(v&&(SS.has(bk(v))||/^(player_|custom_)/.test(v)))out.push({parent:o,key:k,id:v,arr:Array.isArray(o)});}
    else if(v&&typeof v==='object')walk(v,SS,out,depth+1);});}
function sceneTiles(i,SS){const sc=C.scenes[i],d=sc.data||{},tiles=[],refs=[];walk(d,SS,refs,0);
  refs.forEach(r=>{const b=bk(r.id),pinned=r.id.indexOf('#')>=0;let key,n=1,idx=0;
    if(pinned){key=/#1$/.test(r.id)?b:r.id;}else{const u=C.photoUsed(i,b);key=u?u.key:b;n=u?u.n:0;idx=u?u.i:0;}
    tiles.push({kind:'card',ref:r,base:b,key,pinned,n,idx,label:r.key+(r.arr?'['+r.key+']':'')});});
  const ci=C.cameoIds?C.cameoIds(i):{cameo:[],fill:[]};
  ci.cameo.concat(ci.fill).forEach((b,x)=>{const u=C.photoUsed(i,b);tiles.push({kind:x<ci.cameo.length?'cameo':'fill',base:b,key:u?u.key:b,n:u?u.n:0,idx:u?u.i:0});});
  return tiles;}
const imgOf=key=>{const im=C.photos[key];return im&&im.src?im:null;};
function scLabel(sc){const d=sc.data||{};return String(d.headline||d.title||d.head||d.big||d.line1||d.text||d.name||'').slice(0,48);}

// ---------- actions ----------
async function done(){C.photoRefresh&&C.photoRefresh();try{await SE.apply(true);}catch(e){}render();}
function setRef(r,val){r.parent[r.key]=val;}
function cycle(t){const b=t.base,all=[];if(P.have[b])all.push(b);Object.keys(P.have).filter(k=>k.indexOf(b+'#')===0).sort((x,y)=>(+x.split('#')[1])-(+y.split('#')[1])).forEach(k=>all.push(k));
  if(all.length<2){alert('Is player ki ek hi photo hai — 🔍 ya ⬆ se aur photo jodo.');return;}
  const cur=all.indexOf(t.key),nx=all[(cur+1)%all.length];setRef(t.ref,nx===b?b+'#1':nx);done();}
function del(t,i){const sc=C.scenes[i],d=sc.data||(sc.data={});
  if(t.kind==='card'){const r=t.ref;if(r.arr&&r.parent.length>1)r.parent.splice(+r.key,1);else r.parent[r.key]='';}
  else{d.noCameoIds=(d.noCameoIds||[]).concat([t.base]);}
  done();}
function replaceWithNew(t,i,how){const b=t.base;
  const pin=nid=>{if(t.kind==='card'&&t.ref){setRef(t.ref,nid);}done();};
  if(how==='google'){const nid=freshId(b);reserved[nid]=1;google(nid,pin,countOf(b));return;}
  const fi=el('input');fi.type='file';fi.accept='image/*';fi.multiple=false;
  fi.onchange=async()=>{const f=fi.files[0];if(!f)return;try{let nid;if(!P.have[b]){await P.set(b,f);nid=b;}else{const n=await P.addVariant(b,f);nid=b+'#'+n;}pin(nid);}catch(e){alert('Photo error: '+e.message);}};fi.click();}
async function addMany(b,files){for(const f of files){try{if(!P.have[b])await P.set(b,f);else await P.addVariant(b,f);}catch(e){alert('Photo error: '+e.message);}}await done();}

// ---------- UI ----------
function tileEl(t,i,cnt){
  const w=el('div','width:128px;background:#1b1b22;border-radius:8px;padding:5px;position:relative;border:2px solid '+(t.n?'#2a2a33':'#c33'));
  const im=t.n?imgOf(t.key):null;
  const th=el('div','width:116px;height:140px;border-radius:5px;background:#333 center top/cover no-repeat');if(im)th.style.backgroundImage='url('+im.src+')';
  if(!im)th.appendChild(el('div','color:#f96;font-size:13px;padding:50px 6px;text-align:center','✗ photo nahi'));
  w.appendChild(th);
  const dup=t.n&&cnt[t.key]>1;
  if(dup)w.style.borderColor='#e90';
  const tag={card:'card',cameo:'side (cameo)',fill:'side (auto)'}[t.kind];
  w.appendChild(el('div','font-size:12px;margin-top:3px;line-height:1.25;min-height:30px',P.label(t.key||t.base).replace(/^(.{22}).*( #\d+)$/,'$1…$2')));
  w.appendChild(el('div','font-size:11px;opacity:.75',tag+(t.n>1?' · photo '+(t.idx+1)+'/'+t.n:'')+(t.pinned?' · 📌':'')));
  if(dup)w.appendChild(el('div','font-size:11px;color:#fc3','⚠ ye photo '+cnt[t.key]+' scene mein repeat'));
  const a=el('div','margin-top:3px;display:flex;flex-wrap:wrap');
  a.appendChild(B('🔍',()=>replaceWithNew(t,i,'google'),'#1a73e8','Google se nayi photo (extension)'));
  a.appendChild(B('⬆',()=>replaceWithNew(t,i,'upload'),'#2a6','Apni nayi photo upload'));
  if(t.kind==='card'&&t.n>1||t.pinned)a.appendChild(B('🔁',()=>cycle(t),'#456','Isi player ki agli photo'));
  if(t.kind==='card'&&t.pinned)a.appendChild(B('↺',()=>{setRef(t.ref,t.base);done();},'#456','Pin hatao — auto-rotate'));
  a.appendChild(B('🗑',()=>del(t,i),'#a33',t.kind==='card'?'Is scene se photo hatao':'Is scene mein ye side card mat dikhao'));
  w.appendChild(a);return w;}

function render(){
  if(!ov)return;ov.innerHTML='';
  const SS=slotSet(),scs=C.scenes||[],plan=C.photoPlan?C.photoPlan():{};
  const tiles=scs.map((_,i)=>sceneTiles(i,SS));
  const cnt={};tiles.forEach(ts=>ts.forEach(t=>{if(t.n)cnt[t.key]=(cnt[t.key]||0)+1;}));
  const needs=Object.keys(plan).map(k=>plan[k]).filter(x=>x.missing||x.need>0);
  const total=needs.reduce((a,x)=>a+(x.missing?x.scenes.length:x.need),0);
  const top=el('div','position:sticky;top:0;background:#0d0d12;padding:6px 0 8px;z-index:3;display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #333');
  top.appendChild(el('b','font-size:17px','🖼 Sab scenes ki photos ('+scs.length+' scene)'));
  top.appendChild(B('⚡ Kami sab Google se ('+total+')',()=>startQueue(allMissingItems(plan)),total?'#1a73e8':'#555','Jo photo kam hai ek ke baad ek Google se aayegi'));
  const lb=el('label','font-size:13px;display:flex;gap:4px;align-items:center');const cb=el('input');cb.type='checkbox';cb.checked=onlyBad;cb.onchange=()=>{onlyBad=cb.checked;render();};lb.append(cb,'Sirf dikkat wale scene');top.appendChild(lb);
  const hb=t=>[...document.querySelectorAll('button')].find(b=>b.textContent.indexOf(t)>=0&&!ov.contains(b));
  top.appendChild(B('↶ Undo',async()=>{const b=hb('Undo');if(b&&!b.disabled)b.click();setTimeout(render,700);},'#3a4250','Pichla badlav wapas (Ctrl+Z)'));
  top.appendChild(B('↷ Redo',async()=>{const b=hb('Redo');if(b&&!b.disabled)b.click();setTimeout(render,700);},'#3a4250','Wapas lagao (Ctrl+Y)'));
  top.appendChild(B('🔄',()=>{C.photoRefresh&&C.photoRefresh();render();},'#555','Refresh'));
  if(qRun)top.appendChild(B('⏹ Queue roko',()=>{qRun=false;q=null;status='⏹ Roka';render();},'#822'));
  top.appendChild(el('span','font-size:13px;color:#9cf',status));
  const x=B('✕ Band',()=>{ov.style.display='none';},'#822');x.style.marginLeft='auto';x.style.fontSize='15px';top.appendChild(x);
  ov.appendChild(top);
  // kami box
  const nb=el('div','background:#241a12;border:1px solid #6a4;border-radius:8px;padding:8px;margin:8px 0');
  if(!needs.length)nb.appendChild(el('div','color:#7d7','✓ Har player ki photo har scene ke hisaab se kaafi hai — koi repeat nahi.'));
  else{nb.appendChild(el('b','color:#fc3','⚠ Ye player ek se zyada scene mein aate hain, photo kam hain (repeat na ho isliye aur chahiye):'));
    needs.forEach(x=>{const r=el('div','display:flex;align-items:center;gap:6px;margin-top:5px;flex-wrap:wrap');
      r.appendChild(el('span','flex:1;min-width:220px;font-size:14px',(x.missing?'✗ ':'')+P.label(x.id)+' — scene '+x.scenes.map(j=>j+1).join(', ')+' ('+(x.missing?'photo hai hi nahi':x.total+' photo hain, '+x.need+' aur chahiye')+')'));
      r.appendChild(B('🔍 Google',()=>startQueue(itemsFor(x)),'#1a73e8'));
      const lab=el('label','background:#2a6;padding:3px 8px;border-radius:5px;cursor:pointer;font-size:13px','⬆ Upload');const fi=el('input');fi.type='file';fi.accept='image/*';fi.multiple=true;fi.style.display='none';
      fi.onchange=()=>{if(fi.files.length)addMany(x.id,[...fi.files]);};lab.appendChild(fi);r.appendChild(lab);nb.appendChild(r);});}
  ov.appendChild(nb);
  // scene-wise
  let shown=0;
  scs.forEach((sc,i)=>{const ts=tiles[i];if(!ts.length)return;
    const bad=ts.some(t=>!t.n||cnt[t.key]>1);if(onlyBad&&!bad)return;shown++;
    const box=el('div','margin:8px 0;background:#15151b;border-radius:8px;padding:6px 8px');
    const h=el('div','cursor:pointer;font-size:14px;margin-bottom:4px;color:#fc3','Scene '+(i+1)+' · '+sc.type+(scLabel(sc)?' · '+scLabel(sc):'')+'  ▶');
    h.onclick=()=>{try{SE.sel=i;SE.P.seek((C.starts[i]||0)+.05);}catch(e){}};box.appendChild(h);
    const row=el('div','display:flex;gap:8px;flex-wrap:wrap');ts.forEach(t=>row.appendChild(tileEl(t,i,cnt)));box.appendChild(row);ov.appendChild(box);});
  if(!shown)ov.appendChild(el('div','padding:16px;opacity:.7',onlyBad?'Koi dikkat wala scene nahi 👍':'Kisi scene mein photo slot nahi hai.'));
}
function itemsFor(x){const out=[],base=x.id;let have=countOf(base);const want=x.missing?Math.max(1,x.scenes.length):x.need;
  for(let k=0;k<want;k++){const id=have+k===0?base:nextIdFrom(base,out);out.push({id,nth:have+k});}return out;}
function nextIdFrom(b,out){let n=2;while(P.have[b+'#'+n]||reserved[b+'#'+n]||out.some(o=>o.id===b+'#'+n))n++;return b+'#'+n;}
function allMissingItems(plan){let it=[];Object.keys(plan).map(k=>plan[k]).filter(x=>x.missing||x.need>0).forEach(x=>{it=it.concat(itemsFor(x));});return it;}

function open(){if(!ov){ov=el('div','position:fixed;inset:0;background:#0d0d12;color:#eee;z-index:99999;overflow:auto;padding:10px 14px;font-family:sans-serif');document.body.appendChild(ov);}
  ov.style.display='block';render();}
window.PHB={open,render,googleBtn,startQueue,
  summaryExtra(box2,elf,btn){try{const plan=C.photoPlan?C.photoPlan():{},nd=Object.keys(plan).map(k=>plan[k]).filter(x=>!x.missing&&x.need>0);
    const r=elf('div','margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap');
    r.appendChild(btn('🖼 Sab scenes ki photos dekho / badlo',open,'#6a3'));
    if(nd.length)r.appendChild(elf('span','color:#fc3','⚠ '+nd.length+' player ki photo repeat hogi — aur photo chahiye'));
    box2.appendChild(r);}catch(e){}}};
// bar2 mein button
setTimeout(()=>{const bar=document.getElementById('bar2');if(!bar||document.getElementById('phboard'))return;const b=document.createElement('button');b.id='phboard';b.textContent='🖼 Sab photos';b.title='Sab scenes ki photos ek saath';b.onclick=open;bar.appendChild(b);},0);
})();
