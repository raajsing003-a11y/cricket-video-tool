// C184: Preview par kisi bhi cheez (text / image / panel / photo) par click -> drag se jagah badlo, +/- se size, Delete se hatao.
// Kaise: CORE.text / drawImg / panel / cover aur ctx.drawImage ko wrap karke har draw ka box yaad rakhta hai; badlav scene.ov (Short mein scene.ovS) mein
// {key:{dx,dy,s,hide}} ki tarah save hota hai (scenes JSON ke saath jaata hai, export mein bhi lagta hai). key = type + text/asset + kitni-vi baar.
(function(){
'use strict';
const C=window.CORE;if(!C)return;
const EE=window.EE={sel:null,on:true,hitsOf:null};
const stack=[],HIT=new WeakMap();EE.hitsOf=sc=>HIT.get(sc)||[];
let inWrap=0;
const ovName=()=>C.format==='short'?'ovS':'ov';
const top=()=>stack[stack.length-1];
const base=s=>String(s||'').split('?')[0].split('/').pop();
function begin(sc,ctx){
  const rec=ctx&&ctx.canvas&&ctx.canvas.width===C.W&&ctx.canvas.height===C.H;
  stack.push({sc:sc,counts:{},hits:[],rec:rec});
}
function end(){
  const st=stack.pop();if(!st)return;
  if(st.rec)HIT.set(st.sc,st.hits);
}
function ovOf(st,k){const o=st.sc[ovName()];return o&&o[k];}
// bbox: local {x,y,w,h}. fn = asli draw call.
function run(ctx,kind,id,bb,fn){
  const st=top();
  if(!st||inWrap||!(bb.w>0)||!(bb.h>0)){fn();return;}
  const kk=kind+':'+id,n=(st.counts[kk]=(st.counts[kk]||0)+1),key=kk+'#'+n;
  const ov=ovOf(st,key);
  if(ov&&ov.hide)return;
  const m0=ctx.getTransform();
  const moved=ov&&(ov.dx||ov.dy||(ov.s&&ov.s!==1));
  inWrap++;
  try{
    if(moved){ctx.save();ctx.translate(ov.dx||0,ov.dy||0);
      if(ov.s&&ov.s!==1){const cx=bb.x+bb.w/2,cy=bb.y+bb.h/2;ctx.translate(cx,cy);ctx.scale(ov.s,ov.s);ctx.translate(-cx,-cy);}}
    const m1=ctx.getTransform();
    if(st.rec){
      const P=[[bb.x,bb.y],[bb.x+bb.w,bb.y],[bb.x,bb.y+bb.h],[bb.x+bb.w,bb.y+bb.h]].map(p=>[m1.a*p[0]+m1.c*p[1]+m1.e,m1.b*p[0]+m1.d*p[1]+m1.f]);
      const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys);
      st.hits.push({key:key,kind:kind,x:x0,y:y0,w:x1-x0,h:y1-y0,m:[m0.a,m0.b,m0.c,m0.d]});
    }
    fn();
    if(moved)ctx.restore();
  }finally{inWrap--;}
}
// ---------- wraps ----------
const T0=C.text,D0=C.drawImg,P0=C.panel,V0=C.cover;
C.text=function(ctx,s,x,y,o){
  const a=arguments;o=o||{};
  if(!top()||inWrap||s==null||String(s).trim()===''){return T0.apply(C,a);}
  const px=o.px||60;let w=0;
  ctx.save();ctx.font=C.font(px,o.w);w=Math.min(ctx.measureText(String(s)).width,C.W-2*C.SAFE)+(o.stroke||0);ctx.restore();
  const al=o.align||'left',bs=o.base||'alphabetic',h=px*1.25;
  const bx=al==='center'?x-w/2:(al==='right'||al==='end')?x-w:x;
  const by=bs==='middle'?y-h/2:bs==='top'?y:bs==='bottom'?y-h:y-px*0.95;
  run(ctx,'T',String(s).replace(/[0-9]+/g,'#').slice(0,40),{x:bx,y:by,w:w,h:h},()=>T0.apply(C,a));
};
C.drawImg=function(ctx,k,x,y,w,h){
  const a=arguments,im=C.img(k);if(!im||!top()||inWrap)return D0.apply(C,a);
  run(ctx,'I',k,{x:x,y:y,w:w||im.width,h:h||im.height},()=>D0.apply(C,a));
};
C.panel=function(ctx,x,y,w,h,o){
  const a=arguments;if(!top()||inWrap)return P0.apply(C,a);
  run(ctx,'P','',{x:x,y:y,w:w,h:h},()=>P0.apply(C,a));
};
C.cover=function(ctx,im,x,y,w,h,z,px,py){
  const a=arguments;if(!im||!top()||inWrap)return V0.apply(C,a);
  run(ctx,'V',base(im.src),{x:x,y:y,w:w,h:h},()=>V0.apply(C,a));
};
const DI=CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage=function(im){
  const a=arguments;
  if(!top()||inWrap||a.length<3)return DI.apply(this,a);
  let x,y,w,h;
  if(a.length>=9){x=a[5];y=a[6];w=a[7];h=a[8];}else{x=a[1];y=a[2];w=a.length>=5?a[3]:(im.width||im.videoWidth||0);h=a.length>=5?a[4]:(im.height||im.videoHeight||0);}
  const self=this;
  run(self,'D',im&&im.src?base(im.src):'cv',{x:x,y:y,w:w,h:h},()=>DI.apply(self,a));
};
function wrapCards(){
  Object.keys(C.CARDS).forEach(k=>{const cd=C.CARDS[k];if(!cd||cd._ee||!cd.draw)return;cd._ee=1;const d0=cd.draw;
    cd.draw=function(ctx,lt,data,sc){begin(sc,ctx);try{return d0.apply(this,arguments);}finally{end();}};});
}
const R0=C.render;
C.render=function(){wrapCards();return R0.apply(this,arguments);};

// ---------- UI ----------
function activeScene(P){const t=P.t;let a=-1;C.scenes.forEach((sc,i)=>{if(t>=C.starts[i]&&t<C.starts[i]+sc.dur)a=i;});return a<0?null:C.scenes[a];}
function init(){
  const P=window.PLAYER,cv=document.getElementById('cv');if(!P||!cv)return;
  const box=document.createElement('div');box.id='ee-box';
  box.style.cssText='position:fixed;display:none;border:2px dashed #38b6ff;box-shadow:0 0 0 1px #000a;pointer-events:none;z-index:50;border-radius:3px';
  const bar=document.createElement('div');
  bar.style.cssText='position:absolute;left:0;top:100%;margin-top:6px;display:flex;gap:4px;pointer-events:auto;white-space:nowrap';
  const mkb=(t,tip,fn,bg)=>{const b=document.createElement('button');b.textContent=t;b.title=tip;b.style.cssText='padding:5px 9px;font-size:13px;background:'+(bg||'#2a6fdb');b.onclick=e=>{e.stopPropagation();fn();};bar.appendChild(b);return b;};
  mkb('－','chhota (-)',()=>scale(-.1));mkb('＋','bada (+)',()=>scale(.1));
  mkb('↺','is cheez ko wapas jagah par',()=>resetOne(),'#555');
  mkb('🗑 Hatao','is cheez ko hatao (Delete)',()=>hideSel(),'#c0392b');
  box.appendChild(bar);document.body.appendChild(box);
  const hint=document.createElement('div');hint.id='ee-hint';
  hint.style.cssText='font-size:12px;color:#8b95a5;margin-top:6px';
  hint.innerHTML='🖱 Preview par kisi bhi cheez par <b>click</b> → <b>drag</b> se jagah badlo, <b>＋/－</b> size, <b>Delete</b> se hatao. <button id="ee-all" style="padding:3px 8px;font-size:12px;background:#3a4250">↺ Is scene ke sab badlav hatao</button> <button id="ee-show" style="padding:3px 8px;font-size:12px;background:#3a4250">👁 Hatai cheezein wapas</button>';
  const q=document.getElementById('quick'),anchor=q||cv;anchor.parentNode.insertBefore(hint,q?q.nextSibling:cv.nextSibling);
  const ovs=sc=>{const n=ovName();return sc[n]||(sc[n]={});};
  const entry=(sc,k)=>{const o=ovs(sc);return o[k]||(o[k]={});};
  const hits=sc=>HIT.get(sc)||[];
  const area=C.W*C.H;
  function pick(sc,px,py){const hs=hits(sc);
    for(let i=hs.length-1;i>=0;i--){const h=hs[i];if(h.w*h.h>area*.6)continue;const pd=6;
      if(px>=h.x-pd&&px<=h.x+h.w+pd&&py>=h.y-pd&&py<=h.y+pd+h.h)return h;}
    return null;}
  function place(){
    const sc=activeScene(P);
    if(!EE.sel||!sc||EE.sel.sc!==sc){box.style.display='none';if(EE.sel&&sc!==EE.sel.sc)EE.sel=null;return;}
    const h=hits(sc).find(z=>z.key===EE.sel.key);if(!h){box.style.display='none';return;}
    const r=cv.getBoundingClientRect(),kx=r.width/cv.width,ky=r.height/cv.height;
    box.style.display='block';box.style.left=(r.left+h.x*kx)+'px';box.style.top=(r.top+h.y*ky)+'px';box.style.width=Math.max(8,h.w*kx)+'px';box.style.height=Math.max(8,h.h*ky)+'px';
  }
  const d0=P.draw;P.draw=function(){const r=d0.apply(this,arguments);try{place();}catch(e){}return r;};
  window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
  function scale(d){if(!EE.sel)return;const e=entry(EE.sel.sc,EE.sel.key);e.s=+Math.max(.2,Math.min(4,(e.s||1)+d)).toFixed(2);P.draw();}
  function resetOne(){if(!EE.sel)return;const o=ovs(EE.sel.sc);delete o[EE.sel.key];P.draw();}
  function hideSel(){if(!EE.sel)return;entry(EE.sel.sc,EE.sel.key).hide=true;EE.sel=null;box.style.display='none';P.draw();}
  const g=id=>document.getElementById(id);
  g('ee-all').onclick=()=>{const sc=activeScene(P);if(!sc)return;delete sc[ovName()];EE.sel=null;P.draw();};
  g('ee-show').onclick=()=>{const sc=activeScene(P);if(!sc)return;const o=sc[ovName()];if(o)Object.keys(o).forEach(k=>{if(o[k].hide){delete o[k].hide;if(!Object.keys(o[k]).length)delete o[k];}});P.draw();};
  // mouse
  let drag=null;
  cv.addEventListener('mousedown',e=>{
    if(e.button!==0)return;const sc=activeScene(P);if(!sc)return;
    if(P.playing)P.toggle();
    P.draw(); // taaki hits taaza hon
    const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*cv.width/r.width,py=(e.clientY-r.top)*cv.height/r.height;
    const h=pick(sc,px,py);
    if(!h){EE.sel=null;place();return;}
    e.preventDefault();e.stopPropagation();
    EE.sel={sc:sc,key:h.key};
    const en=ovs(sc)[h.key]||{};
    drag={x:e.clientX,y:e.clientY,dx:en.dx||0,dy:en.dy||0,m:h.m,sc:sc,key:h.key,moved:false};place();
  },true);
  window.addEventListener('mousemove',e=>{
    if(!drag)return;const r=cv.getBoundingClientRect();
    const cx=(e.clientX-drag.x)*cv.width/r.width,cy=(e.clientY-drag.y)*cv.height/r.height;
    if(!drag.moved&&Math.hypot(cx,cy)<3)return;drag.moved=true;
    const a=drag.m[0],b=drag.m[1],c=drag.m[2],d=drag.m[3],det=a*d-b*c||1;
    const lx=(d*cx-c*cy)/det,ly=(-b*cx+a*cy)/det; // inverse linear map
    const en=entry(drag.sc,drag.key);en.dx=+(drag.dx+lx).toFixed(1);en.dy=+(drag.dy+ly).toFixed(1);
    P.draw();
  });
  window.addEventListener('mouseup',()=>{drag=null;});
  cv.style.cursor='pointer';
  // keys (capture: arrow seek se pehle)
  document.addEventListener('keydown',e=>{
    if(!EE.sel)return;const t=e.target,tg=t&&t.tagName;if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(tg)||(t&&t.isContentEditable))return;
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const k=e.key,st=e.shiftKey?20:4;let used=true;
    if(k==='Delete'||k==='Backspace')hideSel();
    else if(k==='Escape'){EE.sel=null;place();}
    else if(k==='+'||k==='=')scale(.1);else if(k==='-'||k==='_')scale(-.1);
    else if(k.indexOf('Arrow')===0){const en=entry(EE.sel.sc,EE.sel.key);
      if(k==='ArrowLeft')en.dx=(en.dx||0)-st;else if(k==='ArrowRight')en.dx=(en.dx||0)+st;else if(k==='ArrowUp')en.dy=(en.dy||0)-st;else en.dy=(en.dy||0)+st;P.draw();}
    else used=false;
    if(used){e.preventDefault();e.stopImmediatePropagation();}
  },true);
}
let tries=0;const iv=setInterval(()=>{if(++tries>200){clearInterval(iv);return;}if(window.PLAYER&&document.getElementById('cv')&&!document.getElementById('ee-hint')){clearInterval(iv);try{init();}catch(e){console.error('elem_edit init',e);}}},100);
})();
