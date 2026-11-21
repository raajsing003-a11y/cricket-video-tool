// C189b: Standard Intro / Outro chooser (PC se upload, Chrome mein save). Intro = script ki line ("मैं हूँ युवराज ... खबर मैदान की") ke time par clip scene; Outro = sabse aakhir (BUMP end item).
// Video 🎞 Clips library (IndexedDB 'cvt_clips') mein save hoti hai; choice localStorage 'cvt_std_bump' mein.
(function(){const C=window.CORE,B=window.BUMP;if(!C||!B)return;
const K='cvt_std_bump',mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let P={intro:'',outro:'',mode:'line',introVol:100,outroVol:100};try{Object.assign(P,JSON.parse(localStorage.getItem(K)||'{}'));}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(P));}catch(e){}};
const S=window.STDB={};
S.hasIntro=()=>!!(P.intro&&C.clips[P.intro]&&P.mode==='line');
const LINE=/खबर मैदान की|मैं हूँ युवराज|khabar maidan/i;
// intro ki jagah: script ki line ka time (captions) -> sabse paas ka scene boundary; warna teaser (pehle) scene ke baad
function findPos(SE){const sc=SE.scenes;let i=sc.findIndex(s=>s.std==='intro');if(i>=0)return{pos:i,rep:true,how:'purana standard intro badla'};
  i=sc.findIndex(s=>s.type==='presenter');if(i>=0)return{pos:i,rep:true,how:'presenter intro ki jagah'};
  try{const L=(window.CAP&&CAP.lines||[]),k=L.find(l=>LINE.test(l.text));
    if(k&&k.t0>0&&C.starts){let b=0,bd=1e9;for(let j=0;j<=sc.length;j++){const t=j<sc.length?C.starts[j]:C.total,d=Math.abs(t-k.t0);if(d<bd){bd=d;b=j;}}return{pos:b,rep:false,how:'script line ke time ('+k.t0.toFixed(1)+'s) par'};}}catch(e){}
  return{pos:sc.length?1:0,rep:false,how:'teaser scene ke baad'};}
S.addIntroScene=async function(){const SE=window.SE,c=C.clips[P.intro];if(!SE)return'Scene editor ready nahi';if(!c)return'Pehle 🎬 Intro/Outro chuno se intro chuno';
  if(C.format!=='wide')return'Intro scene sirf wide mode mein (Short mein ⏮ "Video ki shuruaat" mode chuno)';
  const f=findPos(SE),d=Math.min(8,Math.max(2,Math.round(c.dur*10)/10)),wide=c.w>=c.h;
  const sc={type:'clip',std:'intro',dur:d,trDur:.4,tr:'fade',data:{clip:P.intro,start:0,fit:wide?'cover':'contain'}};
  const ch=(SE.scenes[f.pos]||SE.scenes[f.pos-1]||{}).chunk;if(ch)sc.chunk=ch;
  if(f.rep)SE.scenes.splice(f.pos,1,sc);else SE.scenes.splice(f.pos,0,sc);
  const nx=SE.scenes[f.pos+1];if(nx&&!nx.tr){nx.tr='fade';nx.trDur=nx.trDur||.5;}
  SE.sel=f.pos;await SE.apply(false);return'✔ Intro video lag gaya ('+f.how+', scene #'+(f.pos+1)+', '+d+'s)';};
function applyBump(){// outro hamesha aakhir mein; intro "start" mode mein shuru mein
  const one=(where,clip,vol)=>{let o=B.items.find(z=>z.where===where);if(!clip){if(o)o.on=false;return;}
    if(!o){o={id:Date.now()+Math.random(),clip:'',where,vol:100,fit:'contain',on:true};B.items.push(o);}o.clip=clip;o.on=true;o.vol=Math.max(0,Math.min(300,+vol>=0?+vol:100));};
  one('end',P.outro,P.outroVol);
  if(P.mode==='start')one('start',P.intro,P.introVol);else{const o=B.items.find(z=>z.where==='start'&&z.clip===P.intro);if(o)o.on=false;}
  B.save();if(B.box){B.open();B.open();}}
function thumb(name){return new Promise(res=>{const c=C.clips[name];if(!c)return res('');const v=document.createElement('video');v.muted=true;v.preload='auto';v.src=URL.createObjectURL(c.blob);
  v.onloadeddata=()=>{v.currentTime=Math.min(3.5,c.dur/2);};v.onseeked=()=>{try{const cv=document.createElement('canvas');cv.width=240;cv.height=Math.round(240*(c.h/c.w))||135;cv.getContext('2d').drawImage(v,0,0,cv.width,cv.height);res(cv.toDataURL('image/jpeg',.7));}catch(e){res('');}URL.revokeObjectURL(v.src);};v.onerror=()=>res('');setTimeout(()=>res(''),6000);});}
let box=null,tab='intro';
function msg(t){const e=box&&box.querySelector('#sb_st');if(e)e.textContent=t;}
function pv(name){const c=C.clips[name];if(!c)return;const el=mk('div');el.style.cssText='position:fixed;inset:0;z-index:200;background:#000d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px';
  const v=document.createElement('video');v.controls=true;v.autoplay=true;v.src=URL.createObjectURL(c.blob);v.style.cssText='max-width:92vw;max-height:70vh;background:#000;border-radius:8px';
  const x=mk('button','','✕ Band karo');x.style.cssText='background:#e5262d;color:#fff;border:0;border-radius:8px;padding:10px 18px;font-size:15px';x.onclick=()=>{v.pause();URL.revokeObjectURL(v.src);el.remove();};el.append(v,x);document.body.appendChild(el);}
async function render(){if(!box)return;const L=box.querySelector('#sb_grid');L.innerHTML='';const cur=P[tab];
  box.querySelectorAll('.sb_tab').forEach(b=>b.style.background=b.dataset.t===tab?'#7c3aed':'#2b2f38');
  box.querySelector('#sb_cur').innerHTML='Abhi '+(tab==='intro'?'Intro':'Outro')+': <b>'+(cur?esc(cur):'koi nahi')+'</b>'+(cur&&!C.clips[cur]?' <span style="color:#ff9b9b">⚠ library mein nahi mila, dobara upload karo</span>':'');
  box.querySelector('#sb_mode').style.display=tab==='intro'?'block':'none';
  {const k=tab==='intro'?'introVol':'outroVol',v=P[k]>=0?P[k]:100,r=box.querySelector('#sb_vr');r.value=v;box.querySelector('#sb_vv').textContent=v+'%';
   box.querySelector('#sb_vl').textContent=(tab==='intro'?'Intro':'Outro')+' ki awaaz';
   const lineIntro=tab==='intro'&&P.mode==='line';r.disabled=lineIntro;
   box.querySelector('#sb_vh').textContent=lineIntro?'Script-line wale intro scene mein video mute rehti hai (voice-over upar chalta hai), isliye yahan awaaz nahi. Awaaz chahiye to "shuruaat mein" mode chuno.':'0% = bilkul chup, 100% = original, 300% tak badha sakte ho. Export mein final MP4 ke andar isi volume se judta hai.';}
  box.querySelectorAll('input[name=sbm]').forEach(r=>r.checked=r.value===P.mode);
  const ks=Object.keys(C.clips);if(!ks.length){L.innerHTML='<div style="color:#8b95a5;grid-column:1/3">Library khaali. Upar ⬆ PC se video add karo (intro ya outro, ek saath kitni bhi).</div>';return;}
  for(const k of ks){const c=C.clips[k],d=mk('div','sb_c');d.style.cssText='background:#22262f;border:2px solid '+(k===cur?'#00c389':'#2f3541')+';border-radius:8px;padding:6px';
    d.innerHTML='<img style="width:100%;border-radius:6px;background:#000;min-height:60px"><div style="font-size:12px;word-break:break-all;margin:4px 0"><b>'+esc(k)+'</b><br><span style="color:#8b95a5">'+c.dur.toFixed(1)+'s · '+c.w+'x'+c.h+(c.h>c.w?' · 9:16':'')+'</span></div>'
     +'<div style="display:flex;gap:4px;flex-wrap:wrap"><button class="p">👁</button><button class="u" style="background:#00c389;color:#04130e;font-weight:700">'+(k===cur?'✔ Chuna hai':'✔ Ye chuno')+'</button></div>';
    d.querySelector('.p').onclick=()=>pv(k);
    d.querySelector('.u').onclick=async()=>{P[tab]=k;save();applyBump();msg('✔ '+(tab==='intro'?'Intro':'Outro')+' save: '+k+(tab==='intro'?(P.mode==='line'?' — ab 🎬 Standard intro jodo dabao (script line par lagega)':' — video ke bilkul shuru mein judega'):' — export mein sabse aakhir mein judega'));render();};
    L.appendChild(d);thumb(k).then(u=>{const im=d.querySelector('img');if(u)im.src=u;});}}
function open(){if(box){box.remove();box=null;return;}box=mk('div');box.id='sb_box';
  box.style.cssText='position:fixed;inset:0;z-index:150;background:#14161bf2;color:#e9edf3;font:14px system-ui,sans-serif;overflow:auto;padding:12px';
  box.innerHTML='<style>#sb_box button{font-size:13px;border-radius:6px;border:0;background:#2b2f38;color:#e9edf3;padding:8px 12px}#sb_grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}</style>'
   +'<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px">🎬 Standard Intro / Outro</b><button id="sb_x">✕ Band</button></div>'
   +'<div style="color:#9aa4b2;margin:6px 0">PC se video upload karo, Chrome mein save rehti hai. Intro = script ki line "मैं हूँ युवराज, और आप देख रहे हैं खबर मैदान की" par; Outro = sabse aakhir mein.</div>'
   +'<label style="display:inline-block;background:#00c389;color:#04130e;font-weight:700;padding:9px 14px;border-radius:6px">⬆ PC se video add<input type="file" id="sb_f" accept="video/*" multiple style="display:none"></label>'
   +'<div style="margin:10px 0"><button class="sb_tab" data-t="intro">Intro chuno</button> <button class="sb_tab" data-t="outro">Outro chuno</button></div>'
   +'<div id="sb_cur" style="margin:4px 0"></div>'
   +'<div id="sb_vol" style="margin:6px 0;background:#22262f;padding:8px;border-radius:8px"><div style="display:flex;align-items:center;gap:8px"><span id="sb_vl" style="min-width:120px">Awaaz</span><input id="sb_vr" type="range" min="0" max="300" step="5" style="flex:1;height:28px"><b id="sb_vv" style="min-width:52px;text-align:right">100%</b></div><div id="sb_vh" style="color:#8b95a5;font-size:12px;margin-top:4px"></div></div>'
   +'<div id="sb_mode" style="margin:6px 0;background:#22262f;padding:8px;border-radius:8px"><label><input type="radio" name="sbm" value="line"> Script ki line par (scene ban kar, voice-over upar chalta hai) — <b>ye chuno</b></label><br><label><input type="radio" name="sbm" value="start"> Video ki bilkul shuruaat mein (apni awaaz ke saath)</label></div>'
   +'<div id="sb_st" style="min-height:18px;color:#9fd5ff;margin:6px 0"></div><div id="sb_grid"></div>';
  document.body.appendChild(box);box.querySelector('#sb_x').onclick=open;
  box.querySelectorAll('.sb_tab').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render();});
  box.querySelectorAll('input[name=sbm]').forEach(r=>r.onchange=()=>{P.mode=r.value;save();applyBump();msg('✔ Mode: '+(P.mode==='line'?'script line par':'shuruaat mein'));render();});
  {const r=box.querySelector('#sb_vr');r.oninput=()=>{const k=tab==='intro'?'introVol':'outroVol';P[k]=+r.value;box.querySelector('#sb_vv').textContent=r.value+'%';};
   r.onchange=()=>{save();applyBump();msg('✔ '+(tab==='intro'?'Intro':'Outro')+' awaaz '+r.value+'% save');};}
  box.querySelector('#sb_f').onchange=async e=>{const fs=[...e.target.files];e.target.value='';let n=0;for(const f of fs){try{msg('⏳ '+f.name);const c=await C.clipAdd(f);n++;if(!P[tab]&&(tab==='intro'?c.dur<=10:true)){P[tab]=f.name;}}catch(er){msg('✖ '+f.name+': '+er.message);}}
    save();applyBump();if(n)msg('✔ '+n+' video Chrome library mein save. Ab 👁 se dekho aur ✔ Ye chuno dabao.');render();};
  render();}
S.open=open;
const addBtn=()=>{[['quick','insertFirst'],['tl-tools','append']].forEach(([id,how])=>{const p=document.getElementById(id);if(p&&!p.querySelector('.sb_open')){const b=mk('button','sb_open','🎬 Intro/Outro chuno');b.style.background='#7c3aed';b.onclick=open;how==='append'?p.appendChild(b):p.insertBefore(b,p.firstChild);}});};
setInterval(addBtn,600);addBtn();
const t0=setInterval(()=>{if(C.clipsReady){clearInterval(t0);applyBump();}},300);setTimeout(()=>clearInterval(t0),8000);
})();
