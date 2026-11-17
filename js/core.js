// core.js (C1) - loader, easing, text helpers, timeline render, player
(function(){
'use strict';
const W=1920,H=1080,FPS=30;
const C={W,H,FPS,format:'wide',onFormat:[],CARDS:{},TRANS:{},images:{},scenes:[],starts:[],total:0,ready:false};
window.CORE=C;

// ---------- easing ----------
C.ease={
  lin:t=>t,
  in:t=>t*t*t,
  out:t=>1-Math.pow(1-t,3),
  io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  back:t=>{const c=1.70158,d=c+1;return 1+d*Math.pow(t-1,3)+c*Math.pow(t-1,2);},
  elastic:t=>t===0||t===1?t:Math.pow(2,-10*t)*Math.sin((t*10-.75)*(2*Math.PI/3))+1,
  clamp:(t)=>Math.max(0,Math.min(1,t))
};
C.prog=(t,a,b)=>C.ease.clamp((t-a)/(b-a)); // 0..1 between a..b seconds
C.lerp=(a,b,p)=>a+(b-a)*p;

// ---------- loader ----------
C.url=k=>{const f=window.MANIFEST&&window.MANIFEST[k];return f?'assets/'+f:null;};
C.load=function(key){
  if(C.images[key])return C.images[key].p;
  const u=C.url(key);
  const p=new Promise(res=>{
    if(!u){console.warn('asset missing:',key);res(null);return;}
    const im=new Image();im.onload=()=>res(im);im.onerror=()=>{console.warn('load fail',key);res(null);};im.src=u;
  });
  C.images[key]={p:p,im:null};
  p.then(im=>{C.images[key].im=im;});
  return p;
};
C.img=k=>(C.images[k]&&C.images[k].im)||null;
C.loadFont=async function(){
  try{const f=new FontFace('NotoDev','url(assets/NotoSansDevanagari.ttf)',{weight:'100 900'});
    await f.load();document.fonts.add(f);}catch(e){console.warn('font fail',e);}
};
C.font=(px,w)=>`${w||700} ${px}px NotoDev, "Noto Sans Devanagari", sans-serif`;

// ---------- draw helpers ----------
// fit image to cover (x,y,w,h), optional zoom z and pan
C.cover=function(ctx,im,x,y,w,h,z,px,py){
  if(!im)return;z=z||1;
  const s=Math.max(w/im.width,h/im.height)*z,dw=im.width*s,dh=im.height*s;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  ctx.drawImage(im,x+(w-dw)/2+(px||0),y+(h-dh)/2+(py||0),dw,dh);ctx.restore();
};
C.drawImg=function(ctx,k,x,y,w,h){const im=C.img(k);if(im)ctx.drawImage(im,x,y,w||im.width,h||im.height);};
// word wrap -> lines
C.wrap=function(ctx,text,maxW){
  const words=String(text).split(/\s+/),lines=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;
    if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;}
  if(cur)lines.push(cur);return lines;
};
// text box: shrinks font until fits maxLines; returns {lines,px}
C.fitText=function(ctx,text,maxW,maxLines,startPx,minPx,weight){
  let px=startPx,lines;
  for(;px>=minPx;px-=4){ctx.font=C.font(px,weight);lines=C.wrap(ctx,text,maxW);if(lines.length<=maxLines)break;}
  return {lines,px};
};
C.text=function(ctx,s,x,y,o){
  o=o||{};ctx.save();ctx.font=C.font(o.px||60,o.w);ctx.textAlign=o.align||'left';ctx.textBaseline=o.base||'alphabetic';
  if(o.shadow){ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=o.shadow;ctx.shadowOffsetY=4;}
  if(o.stroke){ctx.lineWidth=o.stroke;ctx.strokeStyle=o.strokeColor||'#000';ctx.lineJoin='round';ctx.strokeText(s,x,y);}
  ctx.fillStyle=o.color||'#fff';ctx.fillText(s,x,y);ctx.restore();
};
C.countUp=(from,to,p,dec)=>(from+(to-from)*C.ease.out(C.ease.clamp(p))).toFixed(dec||0);


// ---------- photo slots (C4) ----------
// C.photos[slot] = HTMLImageElement (user upload, C8). Fallback = silhouette placeholder.
C.photos={};
C.PH='07_photo_slot_placeholders/ph_silhouette_dark';
C.setPhoto=(slot,im)=>{C.photos[slot]=im;};
C.photo=slot=>(slot&&C.photos[slot])||C.img(C.PH);

// ---------- timeline ----------
C.setScenes=function(scenes){
  C.scenes=scenes;C.starts=[];let s=0,end=0;
  scenes.forEach((sc,i)=>{
    sc.trDur=i===0?0:(sc.trDur!=null?sc.trDur:(sc.tr&&sc.tr!=='cut'?0.5:0));
    if(i>0)s=C.starts[i-1]+scenes[i-1].dur-sc.trDur;
    C.starts.push(s);end=Math.max(end,s+sc.dur);
  });
  C.total=end;
};
C.preload=async function(scenes,onProg){
  const keys=new Set();
  scenes.forEach(sc=>{const cd=C.CARDS[sc.type];if(cd&&cd.assets)cd.assets(sc.data||{}).forEach(k=>keys.add(k));});
  let n=0;const arr=[...keys];
  await Promise.all(arr.map(k=>C.load(k).then(()=>{n++;onProg&&onProg(n,arr.length);})));
};
const buf=[document.createElement('canvas'),document.createElement('canvas')];
buf.forEach(b=>{b.width=W;b.height=H;});
// C19: format switch. 'wide' 1920x1080, 'short' 1080x1920 (9:16). Cards C.W/C.H dynamic padhte hain.
C.FORMATS={wide:{W:1920,H:1080},short:{W:1080,H:1920}};
C.setFormat=function(name){
  const f=C.FORMATS[name];if(!f)throw new Error('unknown format '+name);
  C.format=name;C.W=f.W;C.H=f.H;
  buf.forEach(b=>{b.width=f.W;b.height=f.H;});
  const cv=document.getElementById('cv');if(cv){cv.width=f.W;cv.height=f.H;cv.style.aspectRatio=f.W+'/'+f.H;cv.style.maxHeight=name==='short'?'80vh':'';cv.style.width=name==='short'?'auto':'100%';cv.style.margin=name==='short'?'0 auto':'';}
  C.onFormat.forEach(fn=>{try{fn(name,f);}catch(e){console.warn('onFormat',e);}});
};
function drawScene(ctx,i,t){
  const sc=C.scenes[i],cd=C.CARDS[sc.type];
  const lt=t-C.starts[i];
  ctx.save();
  if(cd&&cd.draw)cd.draw(ctx,lt,sc.data||{},sc);
  else{ctx.fillStyle='#222';ctx.fillRect(0,0,C.W,C.H);C.text(ctx,'? '+sc.type,C.W/2,C.H/2,{align:'center',px:80});}
  ctx.restore();
}
C.render=function(ctx,t){
  const W=C.W,H=C.H;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const act=[];
  C.scenes.forEach((sc,i)=>{if(t>=C.starts[i]&&t<C.starts[i]+sc.dur)act.push(i);});
  if(!act.length)return;
  if(act.length===1){drawScene(ctx,act[0],t);return;}
  const a=act[act.length-2],b=act[act.length-1],sc=C.scenes[b];
  const p=C.ease.clamp((t-C.starts[b])/Math.max(sc.trDur,.001));
  const A=buf[0].getContext('2d'),B=buf[1].getContext('2d');
  A.clearRect(0,0,W,H);B.clearRect(0,0,W,H);
  drawScene(A,a,t);drawScene(B,b,t);
  const tr=C.TRANS[sc.tr]||C.TRANS.cut;
  tr(ctx,buf[0],buf[1],p,sc);
};
// base transitions (more in C6)
C.TRANS.cut=(ctx,A,B,p)=>{ctx.drawImage(p<.5?A:B,0,0);};
C.TRANS.fade=(ctx,A,B,p)=>{ctx.drawImage(A,0,0);ctx.globalAlpha=p;ctx.drawImage(B,0,0);ctx.globalAlpha=1;};

// ---------- player ----------
C.player=function(canvas,ui){
  const ctx=canvas.getContext('2d');
  const P={t:0,playing:false,last:0};
  P.draw=()=>{C.render(ctx,P.t);ui&&ui.onTime&&ui.onTime(P.t,C.total);};
  P.seek=t=>{P.t=Math.max(0,Math.min(C.total-1/FPS,t));P.draw();};
  P.toggle=()=>{P.playing=!P.playing;P.last=performance.now();if(P.playing)requestAnimationFrame(loop);ui&&ui.onState&&ui.onState(P.playing);};
  function loop(now){
    if(!P.playing)return;
    P.t+=(now-P.last)/1000;P.last=now;
    if(P.t>=C.total){P.t=C.total-1/FPS;P.playing=false;ui&&ui.onState&&ui.onState(false);}
    P.draw();if(P.playing)requestAnimationFrame(loop);
  }
  return P;
};
})();
