// C200: 🎯 Photo frame — har photo ka crop/zoom khud adjust (upar-niche/left-right, chhota-bada) + face AUTO detect.
// - Upload/restore par face apne aap dhoondh kar photo 4:5 head-and-shoulders crop mein set (face ~ beech mein, upar thoda jagah).
// - Original photo IndexedDB mein jaisi thi waisi rehti hai; crop sirf dikhne wali copy hai (kabhi bhi 🖼 Original / dobara adjust).
// - Crop sab jagah lagta hai (cards + cameo + side fill) kyunki photo hi crop hoke aati hai.
// - Face detector: js/vendor/face-api.js (MIT) + assets/face_models (tiny detector 190 KB), pehli baar zaroorat par load hota hai. Server/GitHub Pages par chalta hai (file:// par model load nahi hota -> manual adjust phir bhi chalta hai).
(function(){
const C=window.CORE,P=window.PHOTOS;if(!C||!P||!C.setPhoto)return;
const AR=.8,LS='cvt_pframe',LA='cvt_pface_auto';
let F={};try{F=JSON.parse(localStorage.getItem(LS)||'{}')||{};}catch(e){F={};}
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(F));}catch(e){}};
const RAW={},FRESH={},STASH={};
let AUTO=true;try{AUTO=localStorage.getItem(LA)!=='0';}catch(e){}
let FAILMSG='';
const sp0=C.setPhoto;
let rdT=0;const redraw=()=>{clearTimeout(rdT);rdT=setTimeout(()=>{try{C.photoRefresh&&C.photoRefresh();window.PLAYER&&PLAYER.draw&&PLAYER.draw();}catch(e){}},80);};
const bk=k=>String(k).split('#')[0];
const el=(t,css,txt)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dim=im=>({W:im.naturalWidth||im.width,H:im.naturalHeight||im.height});

// ---- crop window (raw pixels): cx,cy = window ka center (raw ka fraction), z = zoom (1 = sabse bada 4:5 window)
function win(W,H,fr){const mw=Math.min(W,H*AR),z=clamp(fr.z||1,1,6),w=mw/z,h=w/AR;
 return{x:clamp((fr.cx==null?.5:fr.cx)*W-w/2,0,W-w),y:clamp((fr.cy==null?.4:fr.cy)*H-h/2,0,H-h),w,h};}
async function frameImg(raw,fr){const d=dim(raw),r=win(d.W,d.H,fr);
 const oh=Math.max(2,Math.round(Math.min(r.h,1200))),ow=Math.max(2,Math.round(oh*AR));
 const cv=document.createElement('canvas');cv.width=ow;cv.height=oh;const g=cv.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(raw,r.x,r.y,r.w,r.h,0,0,ow,oh);
 const im=new Image();await new Promise((res,rej)=>{im.onload=res;im.onerror=()=>rej(new Error('frame image'));im.src=cv.toDataURL('image/webp',.92);});im.__pfr=1;return im;}
let AQ=Promise.resolve();
function applyFrame(slot){AQ=AQ.then(async()=>{const raw=RAW[slot],fr=F[slot];if(!raw)return;
 let im=raw;if(fr&&(fr.ok||fr.m)&&!fr.off){try{im=await frameImg(raw,fr);}catch(e){im=raw;}}
 if(RAW[slot]!==raw)return;sp0.call(C,slot,im);redraw();}).catch(()=>{});return AQ;}

// ---- face detect (lazy)
let faceP=null;
function loadFace(){if(faceP)return faceP;
 faceP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='js/vendor/face-api.js';
  s.onload=async()=>{try{const f=window.faceapi;try{await f.tf.setBackend('webgl');}catch(e){await f.tf.setBackend('cpu');}await f.tf.ready();
    await f.nets.tinyFaceDetector.loadFromUri('assets/face_models');res(f);}catch(e){rej(e);}};
  s.onerror=()=>rej(new Error('face-api.js load nahi hui'));document.head.appendChild(s);});
 faceP.catch(e=>{faceP=null;FAILMSG='Face model load nahi hua ('+(e&&e.message||e)+') — tool ko GitHub Pages/server se kholo; manual adjust chalta hai.';upd();});return faceP;}
async function detect(raw){const f=await loadFace();
 for(const[sz,th]of[[512,.4],[608,.3]]){const ds=await f.detectAllFaces(raw,new f.TinyFaceDetectorOptions({inputSize:sz,scoreThreshold:th}));
  if(ds&&ds.length){let mx=0;ds.forEach(d=>{if(d.score>mx)mx=d.score;});
   // sabse bharose wale ke aas-paas wale (>=70%) mein se sabse bada face (helmet/kapde jaise jhoothe box kam score ke hote hain)
   let b=null;ds.forEach(d=>{if(d.score<mx*.7)return;const x=d.box,a=x.width*x.height;if(!b||a>b.a)b={x:x.x,y:x.y,w:x.width,h:x.height,a};});return b;}}
 return null;}
// face box -> frame: face ~ window ki 30% unchi, face ka center window mein ~44% (upar), kaafi jagah kandhon ke liye
function faceFrame(b,W,H){const fcx=b.x+b.w/2,fcy=b.y+b.h/2,mw=Math.min(W,H*AR),wantH=b.h/.30,wantW=wantH*AR,z=clamp(mw/wantW,1,5),h=(mw/z)/AR;
 return{cx:fcx/W,cy:(fcy+.06*h)/H,z:Math.round(z*100)/100};}

// ---- background queue
const Q=[];let busy=false,pumping=null;
function enqueue(slot){if(!AUTO||FAILMSG&&!faceP&&false)return;if(Q.indexOf(slot)<0)Q.push(slot);pump();upd();}
async function pump(){if(busy)return;busy=true;
 try{while(Q.length){const slot=Q.shift(),raw=RAW[slot];if(!raw||F[slot]){upd();continue;}
  let b=null,failed=false;
  try{b=await detect(raw);}catch(e){failed=true;console.warn('face detect',slot,e);}
  if(failed){Q.length=0;break;}
  if(RAW[slot]!==raw)continue;
  const d=dim(raw);F[slot]=b?Object.assign({ok:1},faceFrame(b,d.W,d.H)):{nf:1};save();
  if(F[slot].ok)applyFrame(slot);upd();
  await new Promise(r=>setTimeout(r,25));}}
 finally{busy=false;upd();}}

// ---- hooks: C.setPhoto, P.set, P.remove
function onPhoto(slot,im){if(im&&im.__pfr)return sp0.call(C,slot,im);
 RAW[slot]=im;if(FRESH[slot]){delete F[slot];delete FRESH[slot];save();}
 sp0.call(C,slot,im);const fr=F[slot];
 if(fr&&(fr.ok||fr.m)&&!fr.off)applyFrame(slot);else if(!fr)enqueue(slot);}
C.setPhoto=function(slot,im){return onPhoto(slot,im);};
const set0=P.set;P.set=async function(slot){FRESH[slot]=1;if(STASH[slot]){F[slot]=STASH[slot];delete STASH[slot];delete FRESH[slot];save();}return set0.apply(this,arguments);};
const rem0=P.remove;P.remove=async function(slot){delete F[slot];delete RAW[slot];delete FRESH[slot];save();return rem0.apply(this,arguments);};
// agar photos pehle se load ho chuki hon
setTimeout(()=>{try{Object.keys(C.photos).forEach(k=>{if(!RAW[k]){const im=C.photos[k];if(im&&im.width&&!im.__pfr)onPhoto(k,im);}});}catch(e){}},0);

// ---- editor
function edit(key,done){const raw=RAW[key];if(!raw){alert('Is photo ki original nahi mili (pehle photo upload karo).');return;}
 const d=dim(raw),W=d.W,H=d.H,old=F[key];
 let fr=(old&&!old.nf&&!old.off)?{cx:old.cx,cy:old.cy,z:old.z}:{cx:.5,cy:.4,z:1};let off=!!(old&&old.off),faded=true;
 const ov=el('div','position:fixed;inset:0;background:rgba(0,0,0,.86);z-index:100001;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:#eee;overflow:auto');
 const box=el('div','background:#17171d;border-radius:12px;padding:14px;display:flex;gap:16px;flex-wrap:wrap;max-width:96vw;max-height:96vh;overflow:auto;justify-content:center');
 const PW=320,PH=400;
 const left=el('div','display:flex;flex-direction:column;align-items:center;gap:6px');
 const pvw=el('div','position:relative;width:'+PW+'px;height:'+PH+'px;background:#000 repeating-conic-gradient(#222 0 25%,#2c2c2c 0 50%) 0 0/20px 20px;border-radius:8px;overflow:hidden;touch-action:none;cursor:grab');
 const cv=el('canvas','width:100%;height:100%;display:block');cv.width=PW*2;cv.height=PH*2;pvw.appendChild(cv);
 const guide=el('div','position:absolute;left:31%;top:29%;width:38%;height:30%;border:2px dashed rgba(255,230,80,.75);border-radius:50%;pointer-events:none');pvw.appendChild(guide);
 left.append(el('div','font-size:13px;opacity:.8','Photo ko pakad ke khiskao · scroll = zoom · peela oval = face yahan'),pvw);
 const g=cv.getContext('2d');
 function draw(){g.clearRect(0,0,cv.width,cv.height);
  if(off){const s=Math.min(cv.width/W,cv.height/H),w=W*s,h=H*s;g.drawImage(raw,(cv.width-w)/2,(cv.height-h)/2,w,h);}
  else{const r=win(W,H,fr);fr.cx=(r.x+r.w/2)/W;fr.cy=(r.y+r.h/2)/H;g.drawImage(raw,r.x,r.y,r.w,r.h,0,0,cv.width,cv.height);}
  const m=faded?'linear-gradient(to bottom,transparent 0,#000 7%,#000 62%,transparent 100%),linear-gradient(to right,transparent 0,#000 12%,#000 88%,transparent 100%)':'none';
  cv.style.webkitMaskImage=m;cv.style.maskImage=m;cv.style.webkitMaskComposite='source-in';cv.style.maskComposite='intersect';
  zs.value=fr.z;zl.textContent='Zoom '+(+fr.z).toFixed(2)+'x';guide.style.display=off?'none':'block';}
 let drag=null;
 pvw.onpointerdown=e=>{if(off){off=false;}drag={x:e.clientX,y:e.clientY,cx:fr.cx,cy:fr.cy};pvw.setPointerCapture(e.pointerId);pvw.style.cursor='grabbing';};
 pvw.onpointermove=e=>{if(!drag)return;const r=win(W,H,fr),k=r.w/PW;fr.cx=drag.cx-(e.clientX-drag.x)*k/W;fr.cy=drag.cy-(e.clientY-drag.y)*k/H;draw();};
 pvw.onpointerup=pvw.onpointercancel=()=>{drag=null;pvw.style.cursor='grab';};
 pvw.onwheel=e=>{e.preventDefault();off=false;fr.z=clamp(fr.z*(e.deltaY<0?1.06:1/1.06),1,6);draw();};
 const right=el('div','display:flex;flex-direction:column;gap:8px;min-width:260px;max-width:340px');
 right.appendChild(el('b','font-size:17px','🎯 '+P.label(key)));
 right.appendChild(el('div','font-size:12px;opacity:.7','Original photo '+W+'×'+H+'. Crop sirf dikhne wali copy hai.'));
 const zl=el('div','font-size:14px'),zs=el('input','width:100%');zs.type='range';zs.min=1;zs.max=6;zs.step=.01;zs.oninput=()=>{off=false;fr.z=+zs.value;draw();};
 right.append(zl,zs,el('div','display:flex;justify-content:space-between;font-size:12px;opacity:.7','<- chhota (zyada dikhe)  ·  bada (face pass) ->'.replace('<-','←').replace('->','→')));
 const nud=el('div','display:grid;grid-template-columns:repeat(3,52px);gap:4px;justify-content:center;margin:4px 0');
 const step=(dx,dy)=>{off=false;const r=win(W,H,fr);fr.cx+=dx*r.w*.04/W;fr.cy+=dy*r.h*.04/H;draw();};
 const nb=(t,dx,dy,ttl)=>{const b=el('button','padding:9px 0;font-size:18px;background:#34343f;color:#fff;border:0;border-radius:6px;cursor:pointer',t);b.title=ttl;b.onclick=()=>step(dx,dy);return b;};
 nud.append(el('span'),nb('⬆',0,-1,'photo upar karo (window upar)'),el('span'),nb('⬅',-1,0,''),nb('⬇',0,1,'photo neeche karo (window neeche)'),nb('➡',1,0,''));
 right.appendChild(nud);
 right.appendChild(el('div','font-size:12px;opacity:.7;text-align:center','⬆ = window upar (photo neeche khiskegi) · ⬇ = window neeche'));
 const stat=el('div','font-size:13px;color:#9cf;min-height:18px');
 const btn=(t,bg,fn)=>{const b=el('button','padding:9px 12px;font-size:14px;background:'+bg+';color:#fff;border:0;border-radius:6px;cursor:pointer',t);b.onclick=fn;return b;};
 const row1=el('div','display:flex;gap:6px;flex-wrap:wrap');
 row1.append(btn('🎯 Auto face','#1a73e8',async()=>{stat.textContent='Face dhoondh raha hoon…';try{const b=await detect(raw);if(!b){stat.textContent='⚠ Face nahi mila — khud adjust karo.';return;}fr=faceFrame(b,W,H);off=false;stat.textContent='✓ Face mil gaya, set kar diya.';draw();}catch(e){stat.textContent='⚠ '+(FAILMSG||e.message);}}),
  btn('🖼 Original (bina crop)','#555',()=>{off=true;draw();}),
  btn('↺ Reset','#555',()=>{fr={cx:.5,cy:.4,z:1};off=false;draw();}));
 const lb=el('label','font-size:13px;display:flex;gap:6px;align-items:center;cursor:pointer');const cb=el('input');cb.type='checkbox';cb.checked=true;cb.onchange=()=>{faded=cb.checked;draw();};lb.append(cb,'Cameo jaisa dikhao (kinare fade)');
 const row2=el('div','display:flex;gap:8px;margin-top:6px');
 const close=()=>{ov.remove();};
 row2.append(btn('✅ Save','#2a6',async()=>{F[key]=off?{off:1,m:1}:{m:1,cx:Math.round(fr.cx*10000)/10000,cy:Math.round(fr.cy*10000)/10000,z:Math.round(fr.z*100)/100};save();await applyFrame(key);close();done&&done();}),btn('✕ Cancel','#822',close));
 right.append(row1,lb,stat,row2);
 box.append(left,right);ov.appendChild(box);ov.onclick=e=>{if(e.target===ov)close();};document.body.appendChild(ov);draw();}

// ---- manager
let mgr=null,mfilter='all';
const label=k=>{const f=F[k];return !f?'⏳':f.off?'⬜ original':f.m?'✋ manual':f.ok?'🙂 face auto':f.nf?'❓ face nahi mila':'⏳';};
function openMgr(){if(!mgr){mgr=el('div','position:fixed;inset:0;background:#0d0d12;color:#eee;z-index:99998;overflow:auto;padding:10px 14px;font-family:sans-serif');document.body.appendChild(mgr);}
 mgr.style.display='block';renderMgr();}
function renderMgr(){if(!mgr||mgr.style.display==='none')return;mgr.innerHTML='';
 const keys=Object.keys(RAW).filter(k=>C.photos[k]).sort((a,b)=>P.label(a).localeCompare(P.label(b)));
 const top=el('div','position:sticky;top:0;background:#0d0d12;padding:6px 0 8px;z-index:3;display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #333');
 const B=(t,bg,fn)=>{const b=el('button','padding:6px 10px;font-size:13px;background:'+bg+';color:#fff;border:0;border-radius:5px;cursor:pointer',t);b.onclick=fn;return b;};
 top.appendChild(el('b','font-size:17px','🎯 Photo frame ('+keys.length+' photo)'));
 [['all','Sab'],['nf','❓ Face nahi mila'],['m','✋ Manual'],['ok','🙂 Auto']].forEach(([v,t])=>top.appendChild(B(t,mfilter===v?'#2a6fdb':'#444',()=>{mfilter=v;renderMgr();})));
 top.appendChild(B('🔁 Auto face sab par dobara (manual chhodke)','#1a73e8',()=>{keys.forEach(k=>{const f=F[k];if(f&&(f.m||f.off))return;delete F[k];applyFrame(k);enqueue(k);});save();renderMgr();}));
 top.appendChild(B('🎯 Auto face: '+(AUTO?'ON':'OFF'),AUTO?'#2a6':'#555',()=>{AUTO=!AUTO;try{localStorage.setItem(LA,AUTO?'1':'0');}catch(e){}if(AUTO)keys.forEach(k=>{if(!F[k])enqueue(k);});renderMgr();upd();}));
 top.appendChild(el('span','font-size:12px;color:#9cf',Q.length?('⏳ '+Q.length+' baaki'):'')); if(FAILMSG)top.appendChild(el('span','font-size:12px;color:#f96',FAILMSG));
 const x=B('✕ Band','#822',()=>{mgr.style.display='none';});x.style.marginLeft='auto';top.appendChild(x);mgr.appendChild(top);
 const grid=el('div','display:flex;flex-wrap:wrap;gap:8px;margin-top:8px');
 keys.forEach(k=>{const f=F[k]||{};if(mfilter==='nf'&&!f.nf)return;if(mfilter==='m'&&!(f.m||f.off))return;if(mfilter==='ok'&&!f.ok)return;
  const im=C.photos[k],w=el('div','width:112px;background:#1b1b22;border-radius:8px;padding:5px;cursor:pointer;border:2px solid '+(f.nf?'#c80':'#2a2a33'));
  w.appendChild(el('div','width:102px;height:128px;border-radius:5px;background:#333 center/cover no-repeat'+(im&&im.src?';background-image:url('+im.src+')':'')));
  w.appendChild(el('div','font-size:12px;margin-top:3px;line-height:1.25;min-height:30px',P.label(k).replace(/^(.{20}).*( #\d+)$/,'$1…$2')));
  w.appendChild(el('div','font-size:11px;opacity:.8',label(k)));w.onclick=()=>edit(k,renderMgr);grid.appendChild(w);});
 mgr.appendChild(grid);}

// ---- bar button + status
let btnEl=null;
function upd(){if(btnEl){btnEl.textContent='🎯 Photo frame'+(Q.length?' ⏳'+Q.length:'')+(FAILMSG?' ⚠':'');btnEl.title=FAILMSG||'Har photo ka crop/zoom adjust + face auto';}
 if(mgr&&mgr.style.display!=='none'){clearTimeout(upd._t);upd._t=setTimeout(renderMgr,200);}}
setTimeout(()=>{const bar=document.getElementById('bar2');if(!bar||document.getElementById('pfrbtn'))return;btnEl=el('button','',' ');btnEl.id='pfrbtn';btnEl.onclick=openMgr;bar.appendChild(btnEl);upd();},0);

window.PFR={edit,open:openMgr,all:()=>JSON.parse(JSON.stringify(F)),stash:fr=>{Object.keys(fr||{}).forEach(k=>{STASH[k]=fr[k];});},detect,faceFrame,win,_F:F,_RAW:RAW};
})();
