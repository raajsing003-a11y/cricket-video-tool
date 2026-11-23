// C232: + wipe. C227: tr ('none'|'fade'|'slide'|'zoom'|'wipe') + trDur — shuru/ant par transition (v2 + t1). C226: lanes v2 (video) + a1 (sirf awaaz, clip se) + t1 (text). t1: text,tpos(top|center|bottom),tsize,tcolor,tbg. a1: vol default 1.
// C222 (S4-B1): Overlay lanes — Scenes ke upar free clips. Abhi sirf lane 'v2' (video). Design: docs/S4_DESIGN.md
// OV.items = [{id,lane:'v2',start(sec, global),len,clip,in,speed,rev,vol,fit:'full'|'contain'|'pip',pip:{x,y,w},opacity,fadeIn,fadeOut}]
// Render: C.render ke baad scenes ke upar. Export: C.beforeFrame mein exact seek. Har overlay ka apna <video> (scene clip se alag).
// Save: localStorage cvt_ov_wide / cvt_ov_short (format ke hisaab se, scenes ki tarah). API: OV.add/update/del/list/exportJSON/importJSON
(function(){const C=window.CORE;if(!C)return;
const KEYS={wide:'cvt_ov_wide',short:'cvt_ov_short'},keyOf=()=>KEYS[C.format]||KEYS.wide;
const OV=window.OV={items:[],vids:{},nid:1};
const num=(v,d)=>{v=parseFloat(v);return isFinite(v)?v:d;};
const LANES=['v2','a1','t1'];
const FONTS={default:'',serif:'Georgia, "Times New Roman", serif',mono:'"Courier New", monospace',impact:'Impact, "Arial Black", sans-serif',hand:'"Comic Sans MS", cursive'};const norm=o=>{o=o||{};const ln=LANES.indexOf(o.lane)>=0?o.lane:'v2';const x=Object.assign({lane:'v2',start:0,len:3,clip:'',in:0,speed:1,rev:false,vol:ln==='a1'?1:0,fit:'full',opacity:1,fadeIn:0,fadeOut:0,text:'',tpos:'bottom',tsize:56,tcolor:'#ffffff',tfont:'default',tbg:true,tr:'none',trDur:.4},o);x.lane=ln;
  x.text=String(x.text==null?'':x.text);if(['top','center','bottom'].indexOf(x.tpos)<0)x.tpos='bottom';x.tsize=Math.max(16,Math.min(200,num(x.tsize,56)));x.tbg=!!x.tbg;if(['none','fade','slide','zoom','wipe'].indexOf(x.tr)<0)x.tr='none';x.trDur=Math.max(.1,Math.min(2,num(x.trDur,.4)));x.tcolor=/^#[0-9a-fA-F]{6}$/.test(x.tcolor)?x.tcolor:'#ffffff';if(!FONTS[x.tfont])x.tfont='default';
  x.start=Math.max(0,num(x.start,0));x.len=Math.max(.2,num(x.len,3));x.in=Math.max(0,num(x.in,0));x.speed=Math.max(.25,Math.min(4,num(x.speed,1)));x.vol=Math.max(0,Math.min(3,num(x.vol,0)));
  x.opacity=Math.max(0,Math.min(1,num(x.opacity,1)));x.fadeIn=Math.max(0,num(x.fadeIn,0));x.fadeOut=Math.max(0,num(x.fadeOut,0));x.rev=!!x.rev;
  if(['full','contain','pip'].indexOf(x.fit)<0)x.fit='full';
  const p=Object.assign({x:.62,y:.06,w:.34},x.pip||{});x.pip={x:num(p.x,.62),y:num(p.y,.06),w:Math.max(.05,Math.min(1,num(p.w,.34)))};
  if(x.id==null)x.id='ov'+(OV.nid++);return x;};
OV.save=()=>{try{localStorage.setItem(keyOf(),JSON.stringify(OV.items));}catch(e){}if(OV.onChange)OV.onChange();};
OV.load=()=>{let a=[];try{a=JSON.parse(localStorage.getItem(keyOf())||'[]')||[];}catch(e){}OV.items=a.filter(x=>x&&(!x.lane||LANES.indexOf(x.lane)>=0)).map(norm);
  OV.items.forEach(x=>{const m=/^ov(\d+)$/.exec(x.id);if(m)OV.nid=Math.max(OV.nid,+m[1]+1);});OV.dropVids();};
OV.list=lane=>OV.items.filter(x=>!lane||x.lane===lane);
OV.add=o=>{const x=norm(o);OV.items.push(x);OV.save();return x;};
OV.get=id=>OV.items.find(x=>x.id===id);
OV.update=(id,patch)=>{const i=OV.items.findIndex(x=>x.id===id);if(i<0)return null;OV.items[i]=norm(Object.assign({},OV.items[i],patch,{id}));OV.save();return OV.items[i];};
OV.del=id=>{const i=OV.items.findIndex(x=>x.id===id);if(i<0)return false;OV.items.splice(i,1);dropVid(id);OV.save();return true;};
OV.exportJSON=()=>JSON.stringify({ov:1,items:OV.items},null,1);
OV.importJSON=txt=>{const j=JSON.parse(txt),a=Array.isArray(j)?j:j.items;if(!Array.isArray(a))throw new Error('overlay list nahi mili');OV.dropVids();OV.items=a.map(norm);OV.save();return OV.items.length;};
// ---------- video elements ----------
function dropVid(id){const v=OV.vids[id];if(v){try{v.pause();}catch(e){}delete OV.vids[id];}}
OV.dropVids=()=>Object.keys(OV.vids).forEach(dropVid);
function vidOf(o){const c=C.clips[o.clip];if(!c)return null;let v=OV.vids[o.id];
  if(!v||v._src!==c.video.src){if(v)try{v.pause();}catch(e){}v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.src=c.video.src;v._src=c.video.src;OV.vids[o.id]=v;}
  return{v,c};}
const spanOf=o=>o.len*o.speed;
OV.timeAt=(o,t)=>{const c=C.clips[o.clip];if(!c)return null;const lt=Math.max(0,Math.min(o.len,t-o.start)),want=o.rev?o.in+spanOf(o)-lt*o.speed:o.in+lt*o.speed;return Math.max(0,Math.min(c.dur-.05,want));};
const active=t=>OV.items.filter(o=>o.lane==='v2'&&t>=o.start&&t<o.start+o.len&&t<C.total+.001);
const activeMedia=t=>OV.items.filter(o=>(o.lane==='v2'||o.lane==='a1')&&t>=o.start&&t<o.start+o.len&&t<C.total+.001);
OV.activeAt=active;OV.activeMedia=activeMedia;OV.textAt=t=>OV.items.filter(o=>o.lane==='t1'&&o.text&&t>=o.start&&t<o.start+o.len&&t<C.total+.001);
const seekTo=(v,t)=>new Promise(res=>{if(Math.abs(v.currentTime-t)<.001&&v.readyState>=2){res();return;}let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('seeked',f);res();};v.addEventListener('seeked',f);v.currentTime=t;setTimeout(f,1500);});
// export: har frame se pehle exact seek (card_clip ka beforeFrame bhi chalta hai)
const bf0=C.beforeFrame;
C.beforeFrame=async function(t){if(bf0)await bf0.call(C,t);for(const o of active(t)){const x=vidOf(o);if(x){if(x.v.readyState<1)await new Promise(r=>{x.v.onloadedmetadata=r;setTimeout(r,2000);});await seekTo(x.v,OV.timeAt(o,t));}}};
// ---------- draw ----------
function alphaOf(o,t){const lt=t-o.start;let a=o.opacity;if(o.fadeIn>0)a*=Math.min(1,lt/o.fadeIn);if(o.fadeOut>0)a*=Math.min(1,(o.len-lt)/o.fadeOut);return Math.max(0,Math.min(1,a));}
// C227: transition — ctx par transform lagata hai, alpha multiplier lautata hai (caller ctx.save/restore karta hai)
function trFx(ctx,o,t){if(!o.tr||o.tr==='none')return 1;const d=o.trDur,lt=t-o.start,pi=Math.min(1,lt/d),po=Math.min(1,(o.len-lt)/d),p=Math.max(0,Math.min(pi,po)),e=1-Math.pow(1-p,3),W=C.W,H=C.H;
  if(o.tr==='slide')ctx.translate(pi<=po?-(1-e)*W*.4:(1-e)*W*.4,0);
  else if(o.tr==='wipe'){ctx.beginPath();if(pi<=po)ctx.rect(0,0,W*e,H);else ctx.rect(W*(1-e),0,W*e,H);ctx.clip();return 1;}
  else if(o.tr==='zoom'){const k=.7+.3*e;ctx.translate(W/2,H/2);ctx.scale(k,k);ctx.translate(-W/2,-H/2);}
  return e;}
OV.trFx=trFx;
function drawOne(ctx,o,t,v,c){const W=C.W,H=C.H,vw=c.w||1920,vh=c.h||1080;ctx.save();ctx.globalAlpha=alphaOf(o,t)*trFx(ctx,o,t);
  try{if(o.fit==='pip'){const w=W*o.pip.w,h=w*vh/vw,x=W*o.pip.x,y=H*o.pip.y;ctx.beginPath();ctx.roundRect(x,y,w,h,Math.max(6,w*.03));ctx.save();ctx.clip();ctx.drawImage(v,x,y,w,h);ctx.restore();ctx.lineWidth=Math.max(3,w*.006);ctx.strokeStyle='rgba(255,255,255,.9)';ctx.stroke();}
    else if(o.fit==='contain'){const k=Math.min(W/vw,H/vh),w=vw*k,h=vh*k;ctx.drawImage(v,(W-w)/2,(H-h)/2,w,h);}
    else{const k=Math.max(W/vw,H/vh),w=vw*k,h=vh*k;ctx.drawImage(v,(W-w)/2,(H-h)/2,w,h);}}catch(e){}
  ctx.restore();}
function drawText(ctx,o,t){const cf=C.font,st=FONTS[o.tfont];if(st&&o.tfont!=='default')C.font=(px,w)=>`${w||800} ${px}px ${st}, NotoDev, "Noto Sans Devanagari", sans-serif`;try{drawText0(ctx,o,t);}finally{C.font=cf;}}
function drawText0(ctx,o,t){const W=C.W,H=C.H,k=Math.min(W,H)/1080,px0=o.tsize*k;ctx.save();ctx.globalAlpha=alphaOf(o,t)*trFx(ctx,o,t);ctx.textAlign='center';ctx.textBaseline='middle';
  let lines=[o.text],px=px0;try{if(C.fitText){const f=C.fitText(ctx,o.text,W*.86,3,px0,Math.max(14,px0*.5),800);lines=f.lines;px=f.px;}}catch(e){}
  ctx.font=C.font?C.font(px,800):'800 '+px+'px sans-serif';const lh=px*1.25,hh=lines.length*lh,mw=Math.max.apply(null,lines.map(l=>ctx.measureText(l).width)),pad=px*.45;
  const cy=o.tpos==='top'?H*.12+hh/2:o.tpos==='center'?H/2:H*.88-hh/2;
  if(o.tbg){ctx.fillStyle='rgba(0,0,0,.6)';ctx.beginPath();ctx.roundRect(W/2-mw/2-pad,cy-hh/2-pad*.6,mw+pad*2,hh+pad*1.2,pad*.7);ctx.fill();}
  ctx.fillStyle=o.tcolor;lines.forEach((l,i)=>ctx.fillText(l,W/2,cy-hh/2+lh*(i+.5)));ctx.restore();}
const render0=C.render;
C.render=function(ctx,t){render0.call(C,ctx,t);
  const act=activeMedia(t),used=new Set();
  act.forEach(o=>{const x=vidOf(o);if(!x)return;used.add(o.id);const v=x.v,want=OV.timeAt(o,t);
    if(!C.exporting){v.muted=!(o.vol>0)||o.rev;v.volume=Math.min(1,o.vol);if(!o.rev&&v.playbackRate!==o.speed)v.playbackRate=o.speed;
      if(C.playing&&!o.rev){if(v.paused){v.currentTime=want;v.play().catch(()=>{});}else if(Math.abs(v.currentTime-want)>.3*Math.max(1,o.speed))v.currentTime=want;}
      else{if(!v.paused)v.pause();if(Math.abs(v.currentTime-want)>.04)v.currentTime=want;}}
    if(o.lane==='v2'&&v.readyState>=2)drawOne(ctx,o,t,v,x.c);});
  OV.textAt(t).forEach(o=>drawText(ctx,o,t));
  if(!C.exporting)Object.keys(OV.vids).forEach(id=>{if(!used.has(id)){const v=OV.vids[id];if(!v.paused)v.pause();}});};
// ---------- C223: export audio mix (overlay clip ki awaaz) ----------
// oc = OfflineAudioContext, off = main video ka shuru (intro ke baad) sec mein. card_clip.clipMix jaisa: speed = playbackRate, ulti = ulta buffer, vol 0-3, fadeIn/Out = gain ramp.
OV.mixNeeded=()=>OV.items.some(o=>(o.lane==='v2'||o.lane==='a1')&&o.vol>0&&o.start<C.total&&C.clips[o.clip]);
OV.mix=async function(oc,off){let n=0;
  for(const o of OV.items){if((o.lane!=='v2'&&o.lane!=='a1')||!(o.vol>0)||o.start>=C.total)continue;const c=C.clips[o.clip];if(!c||!C.clipDecode)continue;
    const b=await C.clipDecode(c);if(!b)continue;
    const len=Math.min(o.len,C.total-o.start),sp=o.speed,span=len*sp,when=off+o.start;let buf=b,st=o.in;
    if(o.rev){const sr=b.sampleRate,full=o.len*sp,a=Math.max(0,Math.floor(o.in*sr)),z=Math.min(b.length,Math.floor((o.in+full)*sr)),L=Math.max(1,z-a);
      buf=oc.createBuffer(b.numberOfChannels,L,sr);
      for(let ch=0;ch<b.numberOfChannels;ch++){const src=b.getChannelData(ch),dst=buf.getChannelData(ch);for(let k=0;k<L;k++)dst[k]=src[z-1-k]||0;}st=0;}
    const s=oc.createBufferSource(),g=oc.createGain();s.buffer=buf;s.playbackRate.value=sp;
    const g0=Math.min(3,o.vol),fi=Math.min(o.fadeIn,len),fo=Math.min(o.fadeOut,len);
    if(fi>0){g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(g0,when+fi);}else g.gain.setValueAtTime(g0,when);
    if(fo>0){g.gain.setValueAtTime(g0,Math.max(when+fi,when+len-fo));g.gain.linearRampToValueAtTime(0,when+len);}
    s.connect(g);g.connect(oc.destination);s.start(when,st,Math.max(.01,span));try{s.stop(when+len);}catch(e){}n++;}
  return n;};
// format badalne par overlays bhi badlo (scenes ki tarah alag save)
const sf0=C.setFormat;C.setFormat=function(name){const r=sf0.apply(C,arguments);OV.load();return r;};
const wait=()=>{if(C.clipsReady===false&&OV.items.some(o=>!C.clips[o.clip]))setTimeout(()=>{if(OV.onChange)OV.onChange();},800);};
OV.load();wait();
})();
