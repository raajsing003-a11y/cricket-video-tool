// C19: Short (9:16, 1080x1920) cards. Sirf format 'short' mein use hote hain.
// short_hook {pre,big|to+dec,unit,post,bg}  short_stat {photo,pre,prefix,to,dec,unit|big,head,sub,lt,tag,bg}  short_cta {line1,line2,cta,bg}
// Safe zone: upar 160px aur neeche 300px mein YouTube UI aata hai — zaroori text beech mein. Captions y~1240 (captions.js).
(function(){const C=window.CORE,E=C.ease;
const FX='08_gemini_generated/fx/fx_gold_sparks_black',SC='08_gemini_generated/fx/fx_grunge_scratches_black',VG='02_overlays/ov_vignette_dark',
 FR='02_overlays/ov_photo_frame_white',TAG='02_overlays/ov_tag_breaking_news_hi',
 BGH='01_backgrounds/bg_grunge_red_halftone',BGS='01_backgrounds/bg_stadium_sunset_blur',BGC='01_backgrounds/bg_floodlight_blue';
const LTC={red:['#d7263d','#fff3c4'],blue:['#1d4fa3','#e6f0ff'],purple:['#6a2c91','#f3e6ff']};
const shake=(since,amp)=>since>0&&since<.5?[Math.sin(since*70)*(1-since/.5)*amp,Math.cos(since*83)*(1-since/.5)*amp]:[0,0];

// ---- short_hook ----
C.CARDS.short_hook={
 assets:d=>[d.bg||BGH,FX,SC,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,slamAt=.55,since=t-slamAt,[sx,sy]=shake(since,14),bg=d.bg||BGH;
  ctx.save();ctx.translate(sx,sy);
  C.cover(ctx,C.img(bg),-30,-30,W+60,H+60,1+.07*t/dur);
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=.35;const s=C.img(SC);if(s)C.cover(ctx,s,0,0,W,H,1.1,(t*40%60)-30,0);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  C.drawImg(ctx,VG,0,0,W,H);
  if(d.pre){const p=E.out(C.prog(t,.1,.5)),f=C.fitText(ctx,d.pre,940,2,84,48,800);ctx.save();ctx.globalAlpha=p;
    f.lines.forEach((l,i)=>C.text(ctx,l,W/2,560+i*(f.px+14)-40*(1-p),{align:'center',px:f.px,stroke:10,shadow:12}));ctx.restore();}
  const sp=C.prog(t,slamAt-.25,slamAt),sz=t<slamAt-.25?0:(t<slamAt?C.lerp(3,1,E.in(sp)):1+.04*Math.sin(Math.max(0,since)*9)*Math.exp(-since*3));
  const val=d.to!=null?C.countUp(0,d.to,C.prog(t,slamAt,slamAt+1.3),d.dec||0):(d.big||'');
  if(sz>0){ctx.save();ctx.translate(W/2,H/2+40);ctx.scale(sz,sz);ctx.globalAlpha=Math.min(1,sp*1.5);
    const bf=C.fitText(ctx,String(val),980,1,300,120,900);
    C.text(ctx,String(val),0,0,{align:'center',px:bf.px,color:'#ffd23f',stroke:22,shadow:30,base:'middle'});
    if(d.unit)C.text(ctx,d.unit,0,bf.px*.62+30,{align:'center',px:96,stroke:12,base:'middle'});ctx.restore();}
  if(since>0&&since<1.2){ctx.globalCompositeOperation='screen';ctx.globalAlpha=1-since/1.2;const f=C.img(FX);if(f)C.cover(ctx,f,0,0,W,H,1+since*.5);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  if(d.post){const p=E.out(C.prog(t,1.2,1.7)),f=C.fitText(ctx,d.post,940,3,70,44,700);ctx.save();ctx.globalAlpha=p;
    f.lines.forEach((l,i)=>C.text(ctx,l,W/2,1480+i*(f.px+12)+30*(1-p),{align:'center',px:f.px,stroke:10,shadow:10}));ctx.restore();}
  ctx.restore();
 }};

// ---- short_stat ----
C.CARDS.short_stat={
 assets:d=>[d.bg||BGS,FR,VG,C.PH].concat(d.tag?[TAG]:[]),
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,bg=d.bg||BGS,ltc=LTC[d.lt||'red']||LTC.red;
  C.cover(ctx,C.img(bg),0,0,W,H,1+.06*t/dur,-30*t/dur,0);C.drawImg(ctx,VG,0,0,W,H);
  // tag (upar-left, safe zone ke neeche)
  if(d.tag){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;C.drawImg(ctx,TAG,50-(1-tp)*500,170,420,Math.round(420*110/560));ctx.restore();}
  // pre + amount
  const ap=E.out(C.prog(t,.5,.9));
  if(d.pre){ctx.save();ctx.globalAlpha=ap;C.text(ctx,d.pre,W/2,340+30*(1-ap),{align:'center',px:60,stroke:10,shadow:12});ctx.restore();}
  if(d.to!=null||d.big){
   const sp=C.prog(t,.8,1.05),sz=t<.8?0:(t<1.05?C.lerp(2.6,1,E.in(sp)):1+.035*Math.sin((t-1.05)*9)*Math.exp(-(t-1.05)*3));
   const val=d.to!=null?(d.prefix||'')+C.countUp(0,d.to,C.prog(t,1.05,2.3),d.dec||0):d.big;
   if(sz>0){ctx.save();ctx.translate(W/2,470);ctx.scale(sz,sz);ctx.globalAlpha=Math.min(1,sp*1.6);
    const bf=C.fitText(ctx,String(val),900,1,200,100,900);
    C.text(ctx,String(val),0,0,{align:'center',px:bf.px,color:'#ffd23f',stroke:20,shadow:26,base:'middle'});
    if(d.unit)C.text(ctx,d.unit,0,bf.px*.55+20,{align:'center',px:70,stroke:10,base:'middle'});ctx.restore();}
  }
  // photo frame (slides up, tiny tilt settle). frame 1060x1320 -> S
  const fp=E.out(C.prog(t,.15,.85)),S=.76,fw=1060*S,fh=1320*S,fx=(W-fw)/2,fy=640;
  ctx.save();ctx.translate(fx+fw/2,fy+fh/2+(1-fp)*900);ctx.rotate((1-fp)*-.1);
  ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=40;
  const sx=-fw/2+69*S,sy=-fh/2+73*S,sw=(980-69)*S,sh=(1240-73)*S,ph=C.photo(d.photo);
  ctx.fillStyle='#000';ctx.fillRect(sx,sy,sw,sh);ctx.shadowColor='transparent';
  const fr=C.img(FR);if(fr)ctx.drawImage(fr,-fw/2,-fh/2,fw,fh);
  if(ph){ctx.save();ctx.beginPath();ctx.rect(sx,sy,sw,sh);ctx.clip();C.cover(ctx,ph,sx,sy,sw,sh,1+.05*t/dur);ctx.restore();}
  ctx.restore();
  // lower panel (head + sub) photo ke neeche, safe zone ke upar (y 1500-1650)
  const lp=E.out(C.prog(t,.5,1)),px0=50,pw=W-100,py=1500;
  ctx.save();ctx.translate(-(1-lp)*1300,0);
  ctx.fillStyle=ltc[0];ctx.beginPath();ctx.roundRect(px0,py,pw,92,[14,14,0,0]);ctx.fill();
  ctx.fillStyle=ltc[1];ctx.beginPath();ctx.roundRect(px0,py+92,pw,d.sub?62:8,[0,0,14,14]);ctx.fill();
  if(d.head){const f=C.fitText(ctx,d.head,pw-60,1,64,36,800);C.text(ctx,f.lines[0],px0+30,py+66,{px:f.px,color:'#fff'});}
  if(d.sub){const f=C.fitText(ctx,d.sub,pw-60,1,40,26,700);C.text(ctx,f.lines[0],px0+30,py+92+43,{px:f.px,color:'#14213d'});}
  ctx.restore();
 }};

// ---- short_cta ----
C.CARDS.short_cta={
 assets:d=>[d.bg||BGC,VG,FX],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,bg=d.bg||BGC;
  C.cover(ctx,C.img(bg),0,0,W,H,1+.06*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  const p1=E.out(C.prog(t,.1,.6)),p2=E.out(C.prog(t,.45,.95)),p3=E.back(C.prog(t,.9,1.4));
  if(d.line1){const f=C.fitText(ctx,d.line1,940,3,92,52,900);ctx.save();ctx.globalAlpha=p1;
    f.lines.forEach((l,i)=>C.text(ctx,l,W/2,620+i*(f.px+16)+40*(1-p1),{align:'center',px:f.px,stroke:12,shadow:14}));ctx.restore();}
  if(d.line2){const f=C.fitText(ctx,d.line2,940,2,76,44,800);ctx.save();ctx.globalAlpha=p2;
    f.lines.forEach((l,i)=>C.text(ctx,l,W/2,980+i*(f.px+12)+40*(1-p2),{align:'center',px:f.px,color:'#ffd23f',stroke:10,shadow:12}));ctx.restore();}
  // subscribe button: pulse
  const pulse=1+.045*Math.sin(Math.max(0,t-1.4)*6),bw=760,bh=150,by=1250;
  ctx.save();ctx.translate(W/2,by+bh/2);ctx.scale(Math.max(.001,p3)*pulse,Math.max(.001,p3)*pulse);
  ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.fillStyle='#e11';ctx.beginPath();ctx.roundRect(-bw/2,-bh/2,bw,bh,28);ctx.fill();ctx.shadowColor='transparent';
  ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.stroke();
  const f=C.fitText(ctx,d.cta||'Subscribe to the channel',bw-70,1,64,34,900);C.text(ctx,f.lines[0],0,0,{align:'center',px:f.px,color:'#fff',base:'middle'});
  ctx.restore();
  const s=t-1.0;if(s>0&&s<1.2){ctx.globalCompositeOperation='screen';ctx.globalAlpha=(1-s/1.2)*.8;const fx=C.img(FX);if(fx)C.cover(ctx,fx,0,0,W,H,1+s*.4);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
 }};

})();
