// C31: FX layer — Colour Look (grading), Cinematic bars, Progress bar. Captions iske baad aate hain (untouched).
// CORE.FX={look,bars,prog}; localStorage 'cvt_fx' mein save.
(function(){const C=window.CORE,E=C.ease;
const FX=C.FX={look:'none',bars:false,prog:false};
try{Object.assign(FX,JSON.parse(localStorage.getItem('cvt_fx')||'{}'));}catch(e){}
FX.save=()=>{try{localStorage.setItem('cvt_fx',JSON.stringify({look:FX.look,bars:FX.bars,prog:FX.prog}));}catch(e){}};
FX.LOOKS={none:'Look: Normal',warm:'🔥 Warm',golden:'🌇 Golden hour',cool:'❄ Cool',night:'🌃 Night stadium',cinema:'🎬 Teal-Orange',vivid:'🌈 Vivid',bw:'⚫ Black & White',navy:'🌊 Navy glow',purple:'🟣 Purple glow'};
const L={
 warm:[['soft-light','rgba(255,140,40,.30)'],['multiply','rgba(255,240,225,.10)']],
 golden:[['soft-light','rgba(255,185,60,.38)'],['overlay','rgba(255,170,60,.10)']],
 cool:[['soft-light','rgba(40,120,255,.30)']],
 night:[['soft-light','rgba(30,60,170,.42)'],['multiply','rgba(185,200,255,.16)']],
 navy:['navy'],
 purple:['purple'],
 cinema:['grad'],
 vivid:[['saturation','rgba(255,40,40,.32)'],['soft-light','rgba(255,255,255,.10)']],
 bw:[['saturation','#000']]
};
const r0=C.render;
C.render=function(ctx,t){
  r0(ctx,t);if(!C.scenes.length)return;
  const W=ctx.canvas.width,H=ctx.canvas.height;
  const lk=L[FX.look];
  if(lk){ctx.save();
    if(lk[0]==='grad'){ // shadows teal, highlights orange
      ctx.globalCompositeOperation='soft-light';let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,150,60,.42)');g.addColorStop(1,'rgba(20,110,150,.55)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='overlay';ctx.fillStyle='rgba(0,90,120,.10)';ctx.fillRect(0,0,W,H);
    }else if(lk[0]==='navy'){ // C94 (G17): navy tint + beech mein halka neela glow
      ctx.globalCompositeOperation='soft-light';ctx.fillStyle='rgba(20,60,200,.30)';ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(W/2,H*.48,0,W/2,H*.48,Math.max(W,H)*.6);g.addColorStop(0,'rgba(59,130,246,.16)');g.addColorStop(1,'rgba(59,130,246,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='multiply';const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.45,W/2,H/2,Math.max(W,H)*.78);v.addColorStop(0,'rgba(255,255,255,1)');v.addColorStop(1,'rgba(150,170,230,1)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
    }else if(lk[0]==='purple'){ // C138 (G11): kaala base + violet tint + neeche se violet halo + kinaare dark
      ctx.globalCompositeOperation='soft-light';ctx.fillStyle='rgba(120,50,220,.34)';ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(W/2,H*1.05,0,W/2,H*1.05,Math.max(W,H)*.62);g.addColorStop(0,'rgba(140,80,255,.26)');g.addColorStop(1,'rgba(140,80,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='multiply';const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.42,W/2,H/2,Math.max(W,H)*.78);v.addColorStop(0,'rgba(255,255,255,1)');v.addColorStop(1,'rgba(175,150,225,1)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
    }else lk.forEach(([op,col])=>{ctx.globalCompositeOperation=op;ctx.fillStyle=col;ctx.fillRect(0,0,W,H);});
    ctx.restore();}
  if(FX.bars){const bh=Math.round(H*(W>H?.075:.045))*E.out(C.prog(t,0,.7));ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh);ctx.restore();}
  if(FX.prog&&C.total>0){const k=Math.max(0,Math.min(1,t/C.total)),h=Math.max(6,Math.round(H/150)),y=H-h-(FX.bars?Math.round(H*(W>H?.075:.045)):0);
    ctx.save();ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,y,W,h);
    const g=ctx.createLinearGradient(0,0,W*k,0);g.addColorStop(0,'#ff2d2d');g.addColorStop(1,'#ffb020');ctx.fillStyle=g;ctx.shadowColor='#ff3030';ctx.shadowBlur=14;ctx.fillRect(0,y,W*k,h);ctx.restore();}
};
})();
