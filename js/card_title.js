// C3: title card. data:{city,headline,sub,ticker,bg}
(function(){const C=window.CORE,E=C.ease;
const TAG='02_overlays/ov_tag_breaking_news_hi',TK='02_overlays/ov_ticker_bar_white_empty',VG='02_overlays/ov_vignette_dark',
 LR='02_overlays/ov_light_rays_top',HT='02_overlays/ov_halftone_dots_white';
const bgKey=d=>d.bg||('01_backgrounds/team_colour/bg_team_'+d.city);
C.CARDS.title={
 assets:d=>[bgKey(d),'04_team_chips/chip_'+d.city,TAG,TK,VG,LR],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur;
  C.cover(ctx,C.img(bgKey(d)),0,0,W,H,1+0.07*t/dur,-20*t/dur,0);
  ctx.save();ctx.globalAlpha=.5+.2*Math.sin(t*1.5);C.drawImg(ctx,LR,0,0,W,H);ctx.restore();
  C.drawImg(ctx,VG,0,0,W,H);
  // breaking tag slides from left
  const tp=E.out(C.prog(t,0.1,0.6));C.drawImg(ctx,TAG,60-600*(1-tp),60);
  // chip drops with bounce
  const cp=E.back(C.prog(t,0.3,0.9)),chip=C.img('04_team_chips/chip_'+d.city);
  if(chip){ctx.save();ctx.translate(W/2,330);ctx.scale(cp*1.25,cp*1.25);ctx.globalAlpha=Math.min(1,cp*2);
    ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.drawImage(chip,-chip.width/2,-chip.height/2);ctx.restore();}
  // headline (fit 2 lines), words pop in
  if(d.headline){ctx.save();const f=C.fitText(ctx,d.headline,1560,2,120,64,800);
    const p=E.out(C.prog(t,0.8,1.3));ctx.globalAlpha=p;
    f.lines.forEach((l,i)=>C.text(ctx,l,W/2,620+i*(f.px+14)+50*(1-p),{align:'center',px:f.px,stroke:12,shadow:16}));
    if(d.sub){const sp=E.out(C.prog(t,1.3,1.8));ctx.globalAlpha=sp;
      C.text(ctx,d.sub,W/2,620+f.lines.length*(f.px+14)+40,{align:'center',px:56,color:'#ffd23f',stroke:8});}
    ctx.restore();}
  // ticker
  const ty=H-96,tk=E.out(C.prog(t,0.4,0.9));
  ctx.save();ctx.translate(0,(1-tk)*100);C.drawImg(ctx,TK,0,ty);
  if(d.ticker){ctx.beginPath();ctx.rect(150,ty,W-170,96);ctx.clip();
    ctx.font=C.font(50,700);const txt=d.ticker+'     •     ',w=ctx.measureText(txt).width,x=-(t*170)%w;
    for(let k=0;k<Math.ceil(W/w)+2;k++)C.text(ctx,txt,150+x+k*w,ty+66,{px:50,color:'#14213d'});}
  ctx.restore();
 }};
})();
