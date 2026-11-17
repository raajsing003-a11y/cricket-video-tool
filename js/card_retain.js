// C5: retain card. data:{city,photo,name,amount,stamp:'retain|watch|rumour|official',note,bg,flip}
// C34: flip:true = card dayen, naam/amount/note bayen (card ki image mirror nahi hoti, sirf jagah badalti hai).
// RULES: label "संभावित: ऑफिशियल लिस्ट नहीं" HAMESHA dikhta hai (official stamp ko chhodkar nahi - woh bhi dikhta hai agar d.forceLabel). RELEASE stamp allowed nahi.
(function(){const C=window.CORE,E=C.ease;
const LB='03_stamps/label_sambhavit_not_official_hi',VG='02_overlays/ov_vignette_dark',HT='02_overlays/ov_halftone_dots_white',
 RB='02_overlays/ov_ribbon_subscribe_now',STAMPS={retain:'03_stamps/stamp_retain_hi_green',watch:'03_stamps/stamp_watch_amber',rumour:'03_stamps/stamp_rumour_hi_orange',official:'03_stamps/stamp_official_blue'};
const st=d=>{const k=(d.stamp||'retain').toLowerCase();if(k==='release'){console.warn('RELEASE stamp blocked until official list');return STAMPS.retain;}return STAMPS[k]||STAMPS.retain;};
const bgk=d=>d.bg||('01_backgrounds/team_colour/bg_team_'+d.city),card=d=>'05_player_card_base/card_vertical_'+d.city;
C.CARDS.retain={
 assets:d=>[bgk(d),card(d),st(d),LB,VG,HT,C.PH,RB],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,slamAt=1.3,since=t-slamAt,fl=!!d.flip;
  let sx=0,sy=0;if(since>0&&since<.5){const a=(1-since/.5)*16;sx=Math.sin(since*75)*a;sy=Math.cos(since*90)*a;}
  ctx.save();ctx.translate(sx,sy);
  C.cover(ctx,C.img(bgk(d)),-30,-30,W+60,H+60,1+0.05*t/dur);
  ctx.save();ctx.globalAlpha=.25;C.drawImg(ctx,HT,0,0,W,H);ctx.restore();
  C.drawImg(ctx,VG,0,0,W,H);
  // vertical card slides in from left, scale 1.0 (640x1000) at x=170,y=40
  const cp=E.out(C.prog(t,0.1,0.8)),cx=fl?W-170-640:170,cy=40;
  ctx.save();ctx.translate((fl?1:-1)*(1-cp)*800,0);ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=36;
  // card art first, then photo clipped to photo area x30-610,y30-800 on top
  const ph=C.photo(d.photo);
  ctx.shadowColor='transparent';C.drawImg(ctx,card(d),cx,cy);
  if(ph){ctx.save();ctx.beginPath();ctx.rect(cx+30,cy+30,580,770);ctx.clip();C.cover(ctx,ph,cx+30,cy+30,580,770,1+0.04*t/dur);ctx.restore();}
  if(d.name){const f=C.fitText(ctx,d.name,540,1,64,34,800);C.text(ctx,f.lines[0],cx+320,cy+888,{align:'center',px:f.px,color:'#14213d',base:'middle'});}
  if(d.amount){C.text(ctx,d.amount,cx+320,cy+960,{align:'center',px:40,color:'#fff',base:'middle'});}
  ctx.restore();
  // stamp slam (scale 3->1) at slamAt, on the card's photo area
  const sp=C.prog(t,slamAt-.22,slamAt),stp=t<slamAt-.22?0:(t<slamAt?C.lerp(3.2,1,E.in(sp)):1+0.05*Math.sin(Math.max(0,since)*10)*Math.exp(-since*3.5));
  if(stp>0){const im=C.img(st(d));if(im){ctx.save();ctx.translate(cx+320,cy+660);ctx.rotate(-0.12);ctx.scale(stp*1.0,stp*1.0);
    ctx.globalAlpha=Math.min(1,sp*1.6);ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=20;ctx.drawImage(im,-im.width/2,-im.height/2);ctx.restore();}}
  // MUST label under card area on right side bottom
  const lp=E.out(C.prog(t,1.7,2.1));ctx.save();ctx.globalAlpha=lp;C.drawImg(ctx,LB,fl?100:W-900-100,H-90-150+20*(1-lp));ctx.restore();
  // right side: name big + note
  const rp=E.out(C.prog(t,0.6,1.1)),rx=fl?W-1330:1330;
  if(d.name){ctx.save();ctx.globalAlpha=rp;const f=C.fitText(ctx,d.name,900,2,120,60,800);
    f.lines.forEach((l,i)=>C.text(ctx,l,rx,360+i*(f.px+10)+40*(1-rp),{align:'center',px:f.px,stroke:12,shadow:16}));
    if(d.amount)C.text(ctx,d.amount,rx,360+f.lines.length*(f.px+10)+30,{align:'center',px:84,color:'#ffd23f',stroke:10});
    if(d.note){const g=C.fitText(ctx,d.note,900,2,52,36,700);g.lines.forEach((l,i)=>C.text(ctx,l,rx,360+f.lines.length*(f.px+10)+130+i*(g.px+8),{align:'center',px:g.px,stroke:8}));}
    ctx.restore();}
  ctx.restore();
  if(d.ribbon!==false){const p=E.back(C.prog(t,2.0,2.5));C.drawImg(ctx,RB,fl?30-(1-p)*520:W-460-30+(1-p)*520,H-96-30);}
 }};
})();
