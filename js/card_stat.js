// C4: stat card. data:{photo,head,sub,lt:'red|blue|purple',pre,to,dec,unit,bg,tag}
(function(){const C=window.CORE,E=C.ease;
const FR='02_overlays/ov_photo_frame_white',VG='02_overlays/ov_vignette_dark',TAG='02_overlays/ov_tag_breaking_news_hi',
 RB='02_overlays/ov_ribbon_subscribe_now',lt=d=>'02_overlays/ov_lowerthird_'+(d.lt||'red'),bgk=d=>d.bg||'01_backgrounds/bg_stadium_sunset_blur';
C.CARDS.stat={
 assets:d=>[bgk(d),FR,VG,lt(d),C.PH,RB].concat(d.tag?[TAG]:[]),
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur;
  C.cover(ctx,C.img(bgk(d)),0,0,W,H,1+0.06*t/dur,-30*t/dur,0);
  C.drawImg(ctx,VG,0,0,W,H);
  // photo in white frame: slides up + tiny tilt settle
  const fp=E.out(C.prog(t,0.15,0.85)),S=0.62,fw=1060*S,fh=1320*S,fx=130,fy=40;
  ctx.save();ctx.translate(fx+fw/2,fy+fh/2+(1-fp)*700);ctx.rotate((1-fp)*-0.12);
  ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=40;
  // slot x69-980,y73-1240 (in frame px)
  const sx=-fw/2+69*S,sy=-fh/2+73*S,sw=(980-69)*S,sh=(1240-73)*S,ph=C.photo(d.photo);
  ctx.fillStyle='#000';ctx.fillRect(sx,sy,sw,sh);ctx.shadowColor='transparent';
  const fr=C.img(FR);if(fr)ctx.drawImage(fr,-fw/2,-fh/2,fw,fh);
  // photo AFTER frame (frame inner is dark alpha) so photo stays bright; slot is inside the white border
  if(ph){ctx.save();ctx.beginPath();ctx.rect(sx,sy,sw,sh);ctx.clip();
    C.cover(ctx,ph,sx,sy,sw,sh,1+0.05*t/dur);ctx.restore();}
  ctx.restore();
  // big amount (count-up) on right
  const cx=1320,ap=E.out(C.prog(t,0.7,1.1));
  if(d.pre){ctx.save();ctx.globalAlpha=ap;C.text(ctx,d.pre,cx,330+30*(1-ap),{align:'center',px:64,stroke:10,shadow:12});ctx.restore();}
  if(d.to!=null||d.big){
   const sp=C.prog(t,0.9,1.15),sz=t<.9?0:(t<1.15?C.lerp(2.6,1,E.in(sp)):1+0.035*Math.sin((t-1.15)*9)*Math.exp(-(t-1.15)*3));
   const val=d.to!=null?(d.prefix||'')+C.countUp(0,d.to,C.prog(t,1.15,2.4),d.dec||0):d.big;
   if(sz>0){ctx.save();ctx.translate(cx,570);ctx.scale(sz,sz);ctx.globalAlpha=Math.min(1,sp*1.6);
    C.text(ctx,val,0,0,{align:'center',px:210,color:'#ffd23f',stroke:20,shadow:26,base:'middle'});
    if(d.unit)C.text(ctx,d.unit,0,140,{align:'center',px:84,stroke:12,base:'middle'});ctx.restore();}
  }
  // breaking tag (optional)
  if(d.tag){const tp=E.out(C.prog(t,0.1,0.6));C.drawImg(ctx,TAG,W-560-60+600*(1-tp),50);}
  // lower-third: bar y0-119 headline, strip y120-189 sub (dark text)
  const lp=E.out(C.prog(t,0.5,1.0)),lx=W-1560-60,ly=H-190-40;
  ctx.save();ctx.translate(-(1-lp)*1700,0);C.drawImg(ctx,lt(d),lx,ly);
  if(d.head){const f=C.fitText(ctx,d.head,1480,1,72,40,800);C.text(ctx,f.lines[0],lx+40,ly+82,{px:f.px,color:'#fff'});}
  if(d.sub){const f=C.fitText(ctx,d.sub,1480,1,48,30,700);C.text(ctx,f.lines[0],lx+40,ly+164,{px:f.px,color:'#14213d'});}
  ctx.restore();
  if(d.ribbon!==false){const p=E.back(C.prog(t,1.6,2.1));C.drawImg(ctx,RB,W-460-30+(1-p)*520,40+(d.tag?120:0));}
 }};
})();
