// C2: hook card. data:{bg,pre,big,to,dec,unit,post,ribbon,shake}
(function(){const C=window.CORE,E=C.ease;
const FX='08_gemini_generated/fx/fx_gold_sparks_black',SC='08_gemini_generated/fx/fx_grunge_scratches_black',
 VG='02_overlays/ov_vignette_dark',RB='02_overlays/ov_ribbon_subscribe_now';
C.CARDS.hook={
 assets:d=>[d.bg||'01_backgrounds/bg_grunge_red_halftone',FX,SC,VG].concat(d.ribbon?[RB]:[]),
 draw(ctx,t,d,sc){
  const dur=sc.dur,W=C.W,H=C.H;
  // bg: slow zoom + subtle shake after slam
  const slamAt=0.55,since=t-slamAt;
  let sx=0,sy=0;
  if(since>0&&since<0.5){const a=(1-since/0.5)*14;sx=Math.sin(since*70)*a;sy=Math.cos(since*83)*a;}
  ctx.save();ctx.translate(sx,sy);
  C.cover(ctx,C.img(d.bg||'01_backgrounds/bg_grunge_red_halftone'),-30,-30,W+60,H+60,1+0.06*t/dur);
  // scratches (screen)
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=.35;
  const s=C.img(SC);if(s)C.cover(ctx,s,0,0,W,H,1.05,(t*40%60)-30,0);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  C.drawImg(ctx,VG,0,0,W,H);
  // pre line
  if(d.pre){const p=E.out(C.prog(t,0.1,0.5));ctx.save();ctx.globalAlpha=p;
    C.text(ctx,d.pre,W/2,300-40*(1-p),{align:'center',px:78,stroke:10,shadow:12});ctx.restore();}
  // big number slam
  const sp=C.prog(t,slamAt-0.25,slamAt),sz=t<slamAt-0.25?0:(t<slamAt?C.lerp(3,1,E.in(sp)):1+0.04*Math.sin(Math.max(0,since)*9)*Math.exp(-since*3));
  const val=d.to!=null?C.countUp(0,d.to,C.prog(t,slamAt,slamAt+1.3),d.dec||0):(d.big||'');
  if(sz>0){ctx.save();ctx.translate(W/2,H/2+60);ctx.scale(sz,sz);ctx.globalAlpha=Math.min(1,sp*1.5);
    C.text(ctx,val,0,0,{align:'center',px:260,color:'#ffd23f',stroke:22,shadow:30,base:'middle'});
    if(d.unit)C.text(ctx,d.unit,0,150,{align:'center',px:90,stroke:12,base:'middle'});ctx.restore();}
  // sparks burst on slam
  if(since>0&&since<1.2){ctx.globalCompositeOperation='screen';ctx.globalAlpha=1-since/1.2;
    const f=C.img(FX);if(f)C.cover(ctx,f,0,0,W,H,1+since*0.5);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  // post line
  if(d.post){const p=E.out(C.prog(t,1.2,1.7));ctx.save();ctx.globalAlpha=p;
    const f=C.fitText(ctx,d.post,1600,2,70,44,700);ctx.font=C.font(f.px);
    f.lines.forEach((l,i)=>C.text(ctx,l,W/2,H-190+i*(f.px+10)+30*(1-p),{align:'center',px:f.px,stroke:10,shadow:10}));ctx.restore();}
  ctx.restore();
  // ribbon slides in
  if(d.ribbon){const p=E.back(C.prog(t,1.6,2.1));C.drawImg(ctx,RB,W-460-40+(1-p)*520,H-96-30);}
 }};
})();
