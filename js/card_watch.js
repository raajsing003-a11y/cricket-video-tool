// C10a: watch + rumour cards.
// watch : data:{title,names:[..<=6],photos:[slot,slot],note,bg,city,flip}  (C35: flip:true = photos dayen, list bayen)  (नज़र रहेगी list, stamp watch)
// rumour: data:{head,sub,photos:[slot,slot],note,bg,flip}  (C35: flip:true = 2 photo ki jagah adli-badli)                (अफवाह, stamp rumour, split photos)
// label "संभावित: ऑफिशियल लिस्ट नहीं" dono par dikhta hai.
(function(){const C=window.CORE,E=C.ease;
const VG='02_overlays/ov_vignette_dark',HT='02_overlays/ov_halftone_dots_white',RB='02_overlays/ov_ribbon_subscribe_now',
 LB='03_stamps/label_sambhavit_not_official_hi',SW='03_stamps/stamp_watch_amber',SR='03_stamps/stamp_rumour_hi_orange',
 DV='02_overlays/ov_split_divider_green',LT='02_overlays/ov_lowerthird_blue';
function shake(t,at){const s=t-at;return (s>0&&s<.5)?[Math.sin(s*75)*(1-s/.5)*14,Math.cos(s*90)*(1-s/.5)*14]:[0,0];}
function stamp(ctx,t,at,key,x,y,rot,sc){
 const sp=C.prog(t,at-.22,at),z=t<at-.22?0:(t<at?C.lerp(3.2,1,E.in(sp)):1+0.05*Math.sin((t-at)*10)*Math.exp(-(t-at)*3.5)),im=C.img(key);
 if(z>0&&im){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(z*sc,z*sc);ctx.globalAlpha=Math.min(1,sp*1.6);
  ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=20;ctx.drawImage(im,-im.width/2,-im.height/2);ctx.restore();}}
function photoBox(ctx,t,slot,x,y,w,h,delay,dir){
 const p=E.out(C.prog(t,delay,delay+.7)),ph=C.photo(slot);
 ctx.save();ctx.translate(dir*(1-p)*-900,0);ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=30;
 ctx.fillStyle='#fff';ctx.fillRect(x-10,y-10,w+20,h+20);ctx.shadowColor='transparent';
 ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();C.cover(ctx,ph,x,y,w,h,1+0.05*t/6);ctx.restore();}
function label(ctx,t,at){const lp=E.out(C.prog(t,at,at+.4));ctx.save();ctx.globalAlpha=lp;C.drawImg(ctx,LB,(C.W-900)/2,C.H-90-30+20*(1-lp));ctx.restore();}
function ribbon(ctx,t,at,d){if(d.ribbon===false)return;const p=E.back(C.prog(t,at,at+.5));C.drawImg(ctx,RB,C.W-460-30+(1-p)*520,C.H-96-30);}

C.CARDS.watch={
 assets:d=>[d.bg||'01_backgrounds/bg_floodlight_blue',VG,HT,RB,C.PH],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,at=1.4,[sx,sy]=shake(t,at),names=(d.names||[]).slice(0,6),ph=(d.photos||[]).slice(0,2),fl=!!d.flip;
  ctx.save();ctx.translate(sx,sy);
  C.cover(ctx,C.img(d.bg||'01_backgrounds/bg_floodlight_blue'),-30,-30,W+60,H+60,1+0.05*t/dur);
  ctx.save();ctx.globalAlpha=.18;C.drawImg(ctx,HT,0,0,W,H);ctx.restore();C.drawImg(ctx,VG,0,0,W,H);
  // photos left (1 big or 2 stacked)
  const dr=fl?-1:1;
  if(ph.length===1)photoBox(ctx,t,ph[0],fl?W-150-520:150,150,520,760,.15,dr);
  else if(ph.length===2){photoBox(ctx,t,ph[0],fl?W-150-420:150,130,420,380,.15,dr);photoBox(ctx,t,ph[1],fl?W-150-420:150,560,420,380,.35,dr);}
  const lx=ph.length?(fl?180:800):300;
  // title
  const tp=E.out(C.prog(t,.2,.7));ctx.save();ctx.globalAlpha=tp;
  C.text(ctx,d.title||'नज़र रहेगी',lx,200+30*(1-tp),{px:110,stroke:14,shadow:16,color:'#ffc400'});ctx.restore();
  // names stagger
  const rowH=names.length>4?110:128;
  names.forEach((n,i)=>{const p=E.out(C.prog(t,.6+i*.18,1.0+i*.18));if(p<=0)return;
   ctx.save();ctx.globalAlpha=p;ctx.translate((1-p)*-300,0);
   ctx.fillStyle='rgba(10,20,50,.72)';ctx.fillRect(lx-30,260+i*rowH-8,900,rowH-24);
   ctx.fillStyle='#ffc400';ctx.fillRect(lx-30,260+i*rowH-8,12,rowH-24);
   const f=C.fitText(ctx,n,820,1,70,36,800);C.text(ctx,f.lines[0],lx+10,260+i*rowH+(rowH-24)/2-8,{px:f.px,base:'middle'});ctx.restore();});
  if(d.note){const np=E.out(C.prog(t,1.8,2.2));ctx.save();ctx.globalAlpha=np;const f=C.fitText(ctx,d.note,900,2,48,32,700);
   f.lines.forEach((l,i)=>C.text(ctx,l,lx,260+names.length*rowH+60+i*(f.px+8),{px:f.px,stroke:8}));ctx.restore();}
  ctx.restore();ribbon(ctx,t,2.3,d);
 }};

C.CARDS.rumour={
 assets:d=>[d.bg||'01_backgrounds/bg_news_control_room',VG,HT,RB,LT,DV,C.PH],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,at=1.2,[sx,sy]=shake(t,at),ph=(d.photos||[]).slice(0,2);
  if(d.flip&&ph.length===2)ph.reverse();
  ctx.save();ctx.translate(sx,sy);
  C.cover(ctx,C.img(d.bg||'01_backgrounds/bg_news_control_room'),-30,-30,W+60,H+60,1+0.05*t/dur);
  C.drawImg(ctx,VG,0,0,W,H);
  // split photos: left/right halves in tilted-free panels, green divider
  if(ph.length===2){photoBox(ctx,t,ph[0],160,90,700,560,.1,1);photoBox(ctx,t,ph[1],1060,90,700,560,.25,-1);
   const dp=E.out(C.prog(t,.5,.9));ctx.save();ctx.globalAlpha=dp;ctx.beginPath();ctx.rect(0,0,W,680);ctx.clip();C.drawImg(ctx,DV,0,0,W,H);ctx.restore();}
  else if(ph.length===1)photoBox(ctx,t,ph[0],660,90,600,560,.1,1);
  // lower-third (blue): head + sub
  const lp=E.out(C.prog(t,.8,1.3)),lx=(W-1560)/2,ly=H-190-150;
  ctx.save();ctx.translate(-(1-lp)*1800,0);C.drawImg(ctx,LT,lx,ly);
  if(d.head){const f=C.fitText(ctx,d.head,1480,1,72,40,800);C.text(ctx,f.lines[0],lx+40,ly+82,{px:f.px});}
  if(d.sub){const f=C.fitText(ctx,d.sub,1480,1,48,30,700);C.text(ctx,f.lines[0],lx+40,ly+164,{px:f.px,color:'#14213d'});}
  ctx.restore();ctx.restore();
  ribbon(ctx,t,2.2,d);
 }};
})();
