// C6: transitions. API: CORE.TRANS[name]=(ctx,A,B,p,scene) ; A=outgoing canvas, B=incoming canvas, p 0..1
(function(){const C=window.CORE,E=C.ease;
const GR='01_backgrounds/bg_grunge_red_halftone',SC='08_gemini_generated/fx/fx_grunge_scratches_black',FX='08_gemini_generated/fx/fx_gold_sparks_black';
// preload helper: scenes using these transitions call CORE.transAssets(scenes)
C.TRANS_ASSETS={grunge:[GR,SC],zoom:[],whip:[]};
const _pre=C.preload;
C.preload=async function(scenes,onProg){
  const extra=new Set();scenes.forEach(s=>(C.TRANS_ASSETS[s.tr]||[]).forEach(k=>extra.add(k)));
  await Promise.all([...extra].map(k=>C.load(k)));
  return _pre.call(C,scenes,onProg);
};
// grunge wipe: red halftone band sweeps left->right; left of band = B, right of band = A
C.TRANS.grunge=(ctx,A,B,p)=>{
  const W=C.W,H=C.H,bw=620,s=-bw+E.io(p)*(W+bw);
  ctx.drawImage(A,0,0);
  ctx.save();ctx.beginPath();ctx.rect(0,0,Math.max(0,s),H);ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
  // band
  const x0=Math.max(0,s),x1=Math.min(W,s+bw);
  if(x1>x0){ctx.save();ctx.beginPath();ctx.rect(x0,0,x1-x0,H);ctx.clip();
    C.cover(ctx,C.img(GR),s,0,bw,H,1.2);
    const sc=C.img(SC);if(sc){ctx.globalCompositeOperation='screen';ctx.globalAlpha=.6;C.cover(ctx,sc,s,0,bw,H,1.1,(p*500)%80,0);}
    ctx.restore();
    // dark leading edge shadow
    ctx.save();const g=ctx.createLinearGradient(s+bw,0,s+bw+60,0);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(s+bw,0,60,H);ctx.restore();}
};
// zoom punch: A zooms in & fades, white flash, B punches in from 1.35 -> 1
C.TRANS.zoom=(ctx,A,B,p)=>{
  const W=C.W,H=C.H;
  const draw=(im,z,a)=>{ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.drawImage(im,-W/2,-H/2);ctx.restore();};
  if(p<.5){const q=E.in(p*2);draw(A,1+0.5*q,1);}
  else{const q=E.out((p-.5)*2);draw(B,1.35-0.35*q,1);}
  const fl=Math.max(0,1-Math.abs(p-.5)*5);if(fl>0){ctx.save();ctx.globalAlpha=fl*.85;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.restore();}
};
// whip: fast horizontal slide with blur
C.TRANS.whip=(ctx,A,B,p)=>{
  const W=C.W,H=C.H,q=E.io(p),sp=Math.sin(p*Math.PI),blur=Math.round(sp*40);
  ctx.save();if(blur>1)ctx.filter='blur('+blur+'px)';
  ctx.drawImage(A,-q*W,0);ctx.drawImage(B,W-q*W,0);ctx.restore();
  if(sp>.3){ctx.save();ctx.globalAlpha=(sp-.3)*.5;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.restore();}
};
})();
