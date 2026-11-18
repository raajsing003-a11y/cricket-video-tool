// C118 (Y40 - Y48): nau wide card. C119: Y1 `burst` (neeche).
// variety   (Y40): data:{title, vl:'10 सेकंड तक कोई कट नहीं', vi:'asset' (optional avatar), emoji:'😴', et:'दर्शक बोर हो जाते हैं', bar:'बोरियत', c:'r', bg} -> video-box (REC dot + timer) + emoji card + laal bar
// vsvlog    (Y41): data:{title, la:'ट्यूटोरियल', a:'लाइन', lb:'वीलॉग', b:'लाइन', c:'y', bg} -> do card, baayein laal X, daayein peela smile
// energy    (Y42): data:{title, h:'हुक', p:'पेऑफ़', n:5 (2-8 node), dl:'ऊर्जा गिरती है', sl:'हर मोड़ पर नया कारण', c:'y', bg} -> laal dip-curve (Hook ... Payoff) + peeli sine-wave numbered 01.. nodes
// bestlast  (Y43): data:{title, label:'सबसे अच्छा अंत में', pts:[100,78,55,40,36,36] (2-10), c:'g', bg} -> hara curve gir ke theher-ti + end-dot + label pill
// locked    (Y44): data:{title, items:['नाम|छोटी लाइन'] (1-3 bhare card), total:4 (2-4), pill:'...', c:'y', bg} -> card row: bhare + baaki locked "?"
// longstat  (Y45): data:{title, head:'लंबे वीडियो', n1:1000, l1:'..', n2:7421, l2:'..', pill:'...', c1:'g', c2:'r', bg} -> do bade number count-up + pill
// offer     (Y46): data:{title, dots:50 (10-90), you:'आप', av:'asset', oh:'ऑफ़र', ot:'text', yes:'स्वीकार', no:'मना करें', pick:'yes'|'no', c:'y', bg} -> audience dots + avatar, offer card, cursor click
// products  (Y47): data:{title, items:['कोर्स','टेम्पलेट'] (1-4), gl:'फिर लॉन्च', pts:[10,14,22,40,70] (2-10), c:'y', bg} -> product tile + growth curve + label
// endscreen (Y48): data:{title:'अगला वीडियो', vt:'वीडियो का नाम', ch:'चैनल', views:'व्यूज़ text', vi:'asset thumbnail' (optional), sub:'सब्सक्राइब', c:'r', bg} -> bada "Watch next" video card + title/channel/views
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const S=v=>v==null?'':String(v).trim(),isN=v=>v!=null&&v!==''&&isFinite(+v);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw,glow)=>{ctx.save();ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=glow==null?20:glow;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.restore();};
function msg(ctx,txt){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(txt,C.W/2,C.H/2);ctx.restore();}
function pillBox(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;const f=C.fitText(ctx,txt,1500,1,fs,28,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+120,h=104;panel(ctx,x-w/2,y-h/2,w,h,col,h/2,.85,4,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x,y+3);ctx.restore();}
function txt(ctx,s,x,y,w,lines,px,min,wt,col,align){const f=C.fitText(ctx,String(s),w,lines,px,min,wt||800);ctx.font=C.font(f.px,wt||800);ctx.fillStyle=col||'#fff';ctx.textAlign=align||'center';ctx.textBaseline='middle';const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,x,y+(k-(f.lines.length-1)/2)*lh));return f;}
function avatar(ctx,cx,cy,r,col,img){if(img&&C.img(img)){ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();C.cover(ctx,C.img(img),cx-r,cy-r,r*2,r*2,1);ctx.restore();ctx.strokeStyle=col;ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();}
  else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(cx,cy-r*.2,r*.32,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx,cy+r*.58,r*.55,r*.36,0,Math.PI,0);ctx.fill();}}
function drawCross(ctx,cx,cy,r,col){ctx.save();ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=r*.2;ctx.lineCap='round';const k=r*.38;ctx.beginPath();ctx.moveTo(cx-k,cy-k);ctx.lineTo(cx+k,cy+k);ctx.moveTo(cx+k,cy-k);ctx.lineTo(cx-k,cy+k);ctx.stroke();ctx.restore();}
function drawSmile(ctx,cx,cy,r,col){ctx.save();ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(cx-r*.32,cy-r*.22,r*.1,0,Math.PI*2);ctx.arc(cx+r*.32,cy-r*.22,r*.1,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#10131f';ctx.lineWidth=r*.12;ctx.lineCap='round';ctx.beginPath();ctx.arc(cx,cy+r*.02,r*.5,.2*Math.PI,.8*Math.PI);ctx.stroke();ctx.restore();}
function drawLock(ctx,cx,cy,s,col){ctx.save();ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=s*.14;ctx.beginPath();ctx.roundRect(cx-s*.5,cy-s*.1,s,s*.75,s*.12);ctx.fill();ctx.beginPath();ctx.arc(cx,cy-s*.1,s*.32,Math.PI,0);ctx.stroke();ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(cx,cy+s*.22,s*.09,0,Math.PI*2);ctx.fill();ctx.restore();}
// polyline draw: pts=[[x,y]...], prog 0..1, returns end point
function poly(ctx,P,prog,col,lw){const n=P.length,seg=(n-1)*prog;ctx.save();ctx.strokeStyle=col;ctx.lineWidth=lw||8;ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let e=P[0];for(let i=1;i<n&&i-1<seg;i++){const u=P[i-1],v=P[i],f=Math.min(1,seg-(i-1));e=[u[0]+(v[0]-u[0])*f,u[1]+(v[1]-u[1])*f];ctx.lineTo(e[0],e[1]);}ctx.stroke();ctx.restore();return e;}
function dot(ctx,x,y,r,col){ctx.save();ctx.fillStyle='#fff';ctx.shadowColor=col;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();}
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
C.lkItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>S(v)).slice(0,3).map(s=>{const a=String(s).split('|').map(x=>x.trim());return{t:a[0],l:a[1]||''};});
C.bl2Pts=d=>(Array.isArray(d.pts)?d.pts:[]).filter(isN).slice(0,10).map(Number);
C.prItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>S(v)).slice(0,4).map(s=>S(s));
// ---- Y40
C.CARDS.variety={assets:d=>[d.bg||BG,VG].concat(d.vi?[d.vi]:[]),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.r,oa=outAt(t,sc),top=d.title?190:120;
  const bw=840,bh=500,bx=W/2-bw-30,by=top+10,ex=W/2+30,ew=840;
  ctx.save();ctx.globalAlpha=oa;
  const p1=E.out(C.prog(t,.25,.8));if(p1>0){ctx.save();ctx.globalAlpha=oa*p1;ctx.translate(-(1-p1)*50,0);panel(ctx,bx,by,bw,bh,'#6fa8ff',36,.85,5,22);
    avatar(ctx,bx+bw/2,by+bh/2-25,125,'#6fa8ff',S(d.vi));
    const on=Math.floor(t*2)%2===0;ctx.fillStyle=on?'#ff4d4f':'rgba(255,77,79,.3)';ctx.shadowColor='#ff4d4f';ctx.shadowBlur=on?16:0;ctx.beginPath();ctx.arc(bx+60,by+58,16,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.font=C.font(40,900);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('REC',bx+92,by+60);
    const sec=Math.min(10,Math.floor(Math.max(0,t-.8)/3.2*10));ctx.textAlign='right';ctx.fillStyle='#b8c4e0';ctx.fillText('0:'+(sec<10?'0':'')+sec,bx+bw-40,by+60);
    if(d.vl){ctx.fillStyle='rgba(8,18,42,.85)';ctx.beginPath();ctx.roundRect(bx+30,by+bh-110,bw-60,80,24);ctx.fill();txt(ctx,d.vl,bx+bw/2,by+bh-70,bw-120,1,50,26,800,'#fff');}
    ctx.restore();}
  const p2=E.out(C.prog(t,.8,1.35));if(p2>0){ctx.save();ctx.globalAlpha=oa*p2;ctx.translate((1-p2)*50,0);panel(ctx,ex,by,ew,bh,col,36,.85,5,22);
    ctx.font=C.font(230,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S(d.emoji)||'😴',ex+ew/2,by+bh/2-50);
    txt(ctx,S(d.et)||'दर्शक बोर हो जाते हैं',ex+ew/2,by+bh-95,ew-90,2,64,32,900,'#fff');ctx.restore();}
  const p3=E.out(C.prog(t,1.6,2.1));if(p3>0){const bar=1700,bX=W/2-bar/2,bY=H-170,g=E.out(C.prog(t,1.8,4.4));ctx.save();ctx.globalAlpha=oa*p3;ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.roundRect(bX,bY,bar,40,20);ctx.fill();ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.beginPath();ctx.roundRect(bX,bY,Math.max(40,bar*g),40,20);ctx.fill();ctx.shadowBlur=0;
    if(d.bar){ctx.font=C.font(48,800);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(S(d.bar),bX,bY-44);}ctx.restore();}
  ctx.restore();}};
// ---- Y41
C.CARDS.vsvlog={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,oa=outAt(t,sc),la=S(d.la),lb=S(d.lb),a=S(d.a),b=S(d.b);
  if(!(la||a)||!(lb||b)){msg(ctx,'la/a aur lb/b do');return;}
  const cw=800,ch=640,gap=80,y0=(d.title?190:120)+((H-(d.title?190:120)-ch-60))/2;
  ctx.save();ctx.globalAlpha=oa;
  [[la,a,W/2-cw-gap/2,COL.r,.3,false],[lb,b,W/2+gap/2,COL.y,.85,true]].forEach(([h,tx,x,cc,at,ok])=>{const p=E.out(C.prog(t,at,at+.55));if(p<=0)return;const y=y0+(1-p)*50;ctx.save();ctx.globalAlpha=oa*p;panel(ctx,x,y,cw,ch,cc,44,.84,5,24);
    const ip=E.back(C.prog(t,at+.35,at+.85));if(ip>0){ok?drawSmile(ctx,x+cw/2,y+150,100*Math.min(1,ip),cc):drawCross(ctx,x+cw/2,y+150,100*Math.min(1,ip),cc);}
    if(h)txt(ctx,h,x+cw/2,y+330,cw-80,1,78,38,900,cc);if(tx)txt(ctx,tx,x+cw/2,y+500,cw-100,3,58,28,700,'#fff');ctx.restore();});
  ctx.restore();}};
// ---- Y42
C.CARDS.energy={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,oa=outAt(t,sc),n=Math.max(2,Math.min(8,Math.round(+d.n)||5)),h=S(d.h)||'हुक',pl=S(d.p)||'पेऑफ़';
  const pw=1560,ph=330,px=W/2-pw/2,top=d.title?180:110,gap=50,y1=top+((H-top-ph*2-gap-40))/2,y2=y1+ph+gap;
  ctx.save();ctx.globalAlpha=oa;
  const p1=E.out(C.prog(t,.25,.8));if(p1>0){ctx.save();ctx.globalAlpha=oa*p1;panel(ctx,px,y1,pw,ph,COL.r,40,.82,5,20);
    const lx=px+120,lw=pw-240,ly=y1+70,lh=ph-150,P=[];for(let i=0;i<=24;i++){const u=i/24;P.push([lx+lw*u,ly+lh*(u<.55?.05+.8*E.out(u/.55):.85-.8*E.in((u-.55)/.45))]);}
    const e=poly(ctx,P,E.out(C.prog(t,.6,2.2)),COL.r,9);dot(ctx,e[0],e[1],12,COL.r);
    ctx.font=C.font(48,900);ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(h,lx-60,ly+lh+46);ctx.textAlign='right';ctx.fillText(pl,lx+lw+60,ly+lh+46);
    if(d.dl){txt(ctx,d.dl,px+pw/2,y1+54,pw-600,1,44,26,800,'#ffb3b4');}ctx.restore();}
  const p2=E.out(C.prog(t,1.2,1.75));if(p2>0){ctx.save();ctx.globalAlpha=oa*p2;panel(ctx,px,y2,pw,ph,COL.y,40,.82,5,20);
    const lx=px+120,lw=pw-240,my=y2+ph/2-5,amp=70,P=[];for(let i=0;i<=60;i++){const u=i/60;P.push([lx+lw*u,my-amp*Math.sin(u*Math.PI*2*((n-1)/2+.5)+Math.PI/2*0)]);}
    const wp=E.out(C.prog(t,1.6,3.2));const e=poly(ctx,P,wp,COL.y,8);
    for(let i=0;i<n;i++){const u=n===1?0:i/(n-1),nx=lx+lw*u,ny=my-amp*Math.sin(u*Math.PI*2*((n-1)/2+.5)),np=E.back(C.prog(t,1.8+u*1.6,2.3+u*1.6));if(np<=0||u>wp+.02)continue;
      ctx.save();ctx.translate(nx,ny);ctx.scale(Math.min(1,np),Math.min(1,np));ctx.fillStyle='#10131f';ctx.strokeStyle=COL.y;ctx.lineWidth=5;ctx.shadowColor=COL.y;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.font=C.font(34,900);ctx.fillStyle=COL.y;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((i+1<10?'0':'')+(i+1),0,3);ctx.restore();}
    if(d.sl)txt(ctx,d.sl,px+pw/2,y2+ph-34,pw-400,1,42,26,800,'#b8c4e0');ctx.restore();}
  ctx.restore();}};
// ---- Y43
C.CARDS.bestlast={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.g,oa=outAt(t,sc);let pts=C.bl2Pts(d);if(pts.length<2)pts=[100,78,55,40,36,36];
  const pw=1500,ph=600,px=W/2-pw/2,top=d.title?190:120,py=top+((H-top-ph-(d.label?200:80)))/2;
  ctx.save();ctx.globalAlpha=oa;const pp=E.out(C.prog(t,.2,.75));
  if(pp>0){ctx.save();ctx.globalAlpha=oa*pp;panel(ctx,px,py,pw,ph,col,44,.8,5,20);const lx=px+110,ly=py+80,lw=pw-220,lh=ph-170;
    ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;for(let k=0;k<=4;k++){ctx.beginPath();ctx.moveTo(lx,ly+lh*k/4);ctx.lineTo(lx+lw,ly+lh*k/4);ctx.stroke();}
    const n=pts.length,P=pts.map((v,i)=>[lx+lw*i/(n-1),ly+lh*(1-Math.max(0,Math.min(100,v))/100)]);const dp=E.out(C.prog(t,.7,3.2));
    ctx.save();ctx.globalAlpha=.16*Math.min(1,dp*2);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(P[0][0],ly+lh);const seg=(n-1)*dp;let e=P[0];ctx.lineTo(P[0][0],P[0][1]);for(let i=1;i<n&&i-1<seg;i++){const u=P[i-1],v=P[i],f=Math.min(1,seg-(i-1));e=[u[0]+(v[0]-u[0])*f,u[1]+(v[1]-u[1])*f];ctx.lineTo(e[0],e[1]);}ctx.lineTo(e[0],ly+lh);ctx.closePath();ctx.fill();ctx.restore();
    const ee=poly(ctx,P,dp,col,10);const pulse=dp>=.99?1+.18*Math.sin((t-3.2)*6):1;dot(ctx,ee[0],ee[1],15*pulse,col);ctx.restore();}
  if(d.label){const a=E.out(C.prog(t,3.0,3.6));if(a>0)pillBox(ctx,S(d.label),W/2,py+ph+95+(1-a)*20,col,oa*a,60);}
  ctx.restore();}};
// ---- Y44
C.CARDS.locked={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),it=C.lkItems(d);
  if(!it.length){msg(ctx,'items mein 1-3 naam do');return;}
  const total=Math.max(it.length+1,Math.min(4,Math.round(+d.total)||4)),cw=total===4?390:480,ch=470,gap=50,tw=total*cw+(total-1)*gap,x0=W/2-tw/2,top=d.title?190:120,y0=top+((H-top-ch-(d.pill?200:60)))/2;
  ctx.save();ctx.globalAlpha=oa;
  for(let i=0;i<total;i++){const filled=i<it.length,at=.3+i*.35,p=E.out(C.prog(t,at,at+.5));if(p<=0)continue;const x=x0+i*(cw+gap),y=y0+(1-p)*50;ctx.save();ctx.globalAlpha=oa*p;
    if(filled){panel(ctx,x,y,cw,ch,col,40,.86,5,26);txt(ctx,it[i].t,x+cw/2,y+ch/2-(it[i].l?30:0),cw-60,2,72,34,900,'#fff');if(it[i].l)txt(ctx,it[i].l,x+cw/2,y+ch/2+95,cw-70,2,44,26,700,'#b8c4e0');}
    else{const lp=E.out(C.prog(t,2.2+i*.2,2.7+i*.2));panel(ctx,x,y,cw,ch,'rgba(255,255,255,.3)',40,.7,3,0);ctx.save();ctx.globalAlpha=oa*p*(.55+.45*lp);drawLock(ctx,x+cw/2,y+ch/2-70,110,'#b8c4e0');ctx.font=C.font(150,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',x+cw/2,y+ch/2+105);ctx.restore();}
    ctx.restore();}
  if(d.pill){const a=E.out(C.prog(t,2.0,2.6));if(a>0)pillBox(ctx,S(d.pill),W/2,y0+ch+100+(1-a)*20,col,oa*a,58);}
  ctx.restore();}};
// ---- Y45
C.CARDS.longstat={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,oa=outAt(t,sc),c1=COL[d.c1]||COL.g,c2=COL[d.c2]||COL.r;
  if(!isN(d.n1)&&!isN(d.n2)){msg(ctx,'n1 aur n2 do');return;}
  const pw=1600,ph=620,px=W/2-pw/2,top=d.title?190:120,py=top+((H-top-ph-(d.pill?200:60)))/2;
  ctx.save();ctx.globalAlpha=oa;const pp=E.out(C.prog(t,.2,.75));
  if(pp>0){ctx.save();ctx.globalAlpha=oa*pp;panel(ctx,px,py,pw,ph,'#6fa8ff',46,.82,5,22);
    if(d.head)txt(ctx,d.head,px+pw/2,py+80,pw-200,1,66,32,900,'#fff');
    [[d.n1,d.l1,c1,px+pw/4,.6],[d.n2,d.l2,c2,px+pw*3/4,1.3]].forEach(([n,l,cc,cx,at])=>{if(!isN(n))return;const a=E.out(C.prog(t,at,at+.5));if(a<=0)return;ctx.save();ctx.globalAlpha=oa*pp*a;const v=+n*E.out(C.prog(t,at,at+1.6));
      const f=C.fitText(ctx,fmt(+n),pw/2-120,1,210,90,900);ctx.font=C.font(f.px,900);ctx.fillStyle=cc;ctx.shadowColor=cc;ctx.shadowBlur=26;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(fmt(v),cx,py+ph/2+25);ctx.shadowBlur=0;if(l)txt(ctx,l,cx,py+ph-100,pw/2-120,2,50,26,800,'#b8c4e0');ctx.restore();});
    ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=3;ctx.setLineDash([10,10]);ctx.beginPath();ctx.moveTo(px+pw/2,py+150);ctx.lineTo(px+pw/2,py+ph-60);ctx.stroke();ctx.restore();}
  if(d.pill){const a=E.out(C.prog(t,2.4,3.0));if(a>0)pillBox(ctx,S(d.pill),W/2,py+ph+100+(1-a)*20,c2,oa*a,58);}
  ctx.restore();}};
// ---- Y46
C.CARDS.offer={assets:d=>[d.bg||BG,VG].concat(d.av?[d.av]:[]),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),dots=Math.max(10,Math.min(90,Math.round(+d.dots)||50)),yes=S(d.yes)||'स्वीकार',no=S(d.no)||'मना करें',pickYes=S(d.pick)!=='no';
  const top=d.title?190:120,ph=700,py=top+((H-top-ph-60))/2,lw=720,rw=840,gap=60,x0=W/2-(lw+gap+rw)/2;
  ctx.save();ctx.globalAlpha=oa;
  const p1=E.out(C.prog(t,.25,.8));if(p1>0){ctx.save();ctx.globalAlpha=oa*p1;ctx.translate(-(1-p1)*40,0);panel(ctx,x0,py,lw,ph,'#6fa8ff',44,.82,5,20);
    const cols=Math.ceil(Math.sqrt(dots*1.5)),rows=Math.ceil(dots/cols),gw=lw-120,cell=Math.min(gw/cols,(ph-330)/rows),gx=x0+(lw-cell*cols)/2+cell/2,gy=py+70+cell/2;
    for(let i=0;i<dots;i++){const a=E.back(C.prog(t,.6+i*.015,.95+i*.015));if(a<=0)continue;ctx.fillStyle='rgba(111,168,255,.85)';ctx.beginPath();ctx.arc(gx+(i%cols)*cell,gy+Math.floor(i/cols)*cell,cell*.3*Math.min(1,a),0,Math.PI*2);ctx.fill();}
    const ap=E.back(C.prog(t,1.6,2.1));if(ap>0){const r=95*Math.min(1,ap);avatar(ctx,x0+lw/2,py+ph-165,r,col,S(d.av));txt(ctx,S(d.you)||'आप',x0+lw/2,py+ph-42,lw-100,1,50,28,900,col);}
    ctx.restore();}
  const p2=E.out(C.prog(t,1.0,1.55));if(p2>0){const rx=x0+lw+gap;ctx.save();ctx.globalAlpha=oa*p2;ctx.translate((1-p2)*40,0);panel(ctx,rx,py,rw,ph,col,44,.86,5,24);
    txt(ctx,S(d.oh)||'ऑफ़र',rx+rw/2,py+95,rw-100,1,70,34,900,col);if(d.ot)txt(ctx,S(d.ot),rx+rw/2,py+270,rw-110,4,58,28,700,'#fff');
    const bw=340,bh=120,by=py+ph-190,bxs=[rx+rw/2-bw-25,rx+rw/2+25],labs=[yes,no],ct=[COL.g,COL.r],pickI=pickYes?0:1,clickT=3.3,cp=E.out(C.prog(t,2.4,3.3)),pr=C.prog(t,clickT,clickT+.35);
    labs.forEach((lb,i)=>{const on=i===pickI&&t>clickT;ctx.save();ctx.fillStyle=on?ct[i]:'rgba(10,19,48,.9)';ctx.strokeStyle=ct[i];ctx.lineWidth=5;ctx.shadowColor=ct[i];ctx.shadowBlur=on?26:10;ctx.beginPath();ctx.roundRect(bxs[i],by,bw,bh,60);ctx.fill();ctx.stroke();ctx.shadowBlur=0;txt(ctx,lb,bxs[i]+bw/2,by+bh/2+2,bw-50,1,52,28,900,'#fff');ctx.restore();});
    // cursor
    const tx=bxs[pickI]+bw*.7,ty=by+bh*.65,sx=rx+rw+40,sy=py+ph+60,cx=sx+(tx-sx)*cp,cy=sy+(ty-sy)*cp;
    if(pr>0&&pr<1){ctx.save();ctx.strokeStyle=ct[pickI];ctx.lineWidth=6;ctx.globalAlpha=oa*p2*(1-pr);ctx.beginPath();ctx.arc(tx,ty,20+70*pr,0,Math.PI*2);ctx.stroke();ctx.restore();}
    ctx.save();ctx.translate(cx,cy);const sc2=pr>0&&pr<.5?.88:1;ctx.scale(sc2,sc2);ctx.fillStyle='#fff';ctx.strokeStyle='#10131f';ctx.lineWidth=4;ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,62);ctx.lineTo(17,47);ctx.lineTo(30,76);ctx.lineTo(44,69);ctx.lineTo(31,41);ctx.lineTo(54,40);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.restore();}
  ctx.restore();}};
// ---- Y47
C.CARDS.products={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),it=C.prItems(d);let pts=C.bl2Pts(d);if(pts.length<2)pts=[10,14,22,40,70];
  if(!it.length){msg(ctx,'items mein 1-4 product do');return;}
  const top=d.title?190:120,ph=700,py=top+((H-top-ph-60))/2,lw=640,rw=940,gap=60,x0=W/2-(lw+gap+rw)/2,th=Math.min(150,(ph-(it.length-1)*26)/it.length);
  ctx.save();ctx.globalAlpha=oa;
  it.forEach((s,i)=>{const at=.3+i*.35,p=E.out(C.prog(t,at,at+.5));if(p<=0)return;const th0=th,ty=py+(ph-(it.length*th0+(it.length-1)*26))/2+i*(th0+26);ctx.save();ctx.globalAlpha=oa*p;ctx.translate(-(1-p)*50,0);panel(ctx,x0,ty,lw,th0,col,34,.86,5,20);ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x0+26,ty+th0/2-34,68,68,18);ctx.fill();ctx.fillStyle='#10131f';ctx.font=C.font(44,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),x0+60,ty+th0/2+3);txt(ctx,s,x0+110+(lw-130)/2,ty+th0/2+3,lw-150,1,60,28,900,'#fff');ctx.restore();});
  const p2=E.out(C.prog(t,.9,1.45));if(p2>0){const rx=x0+lw+gap;ctx.save();ctx.globalAlpha=oa*p2;ctx.translate((1-p2)*40,0);panel(ctx,rx,py,rw,ph,'#6fa8ff',44,.82,5,20);
    const lx=rx+90,ly=py+130,lwd=rw-180,lh=ph-250;ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;for(let k=0;k<=4;k++){ctx.beginPath();ctx.moveTo(lx,ly+lh*k/4);ctx.lineTo(lx+lwd,ly+lh*k/4);ctx.stroke();}
    const n=pts.length,mx=Math.max.apply(null,pts)||1,P=pts.map((v,i)=>[lx+lwd*i/(n-1),ly+lh*(1-Math.max(0,v)/Math.max(100,mx))]),dp=E.out(C.prog(t,1.2,3.4));const e=poly(ctx,P,dp,COL.g,10);dot(ctx,e[0],e[1],14,COL.g);
    if(d.gl){const a=E.out(C.prog(t,3.2,3.8));if(a>0){ctx.save();ctx.globalAlpha=oa*p2*a;ctx.font=C.font(52,900);const f=C.fitText(ctx,S(d.gl),rw-220,1,52,28,900);ctx.font=C.font(f.px,900);const w=ctx.measureText(f.lines[0]).width+90,pxx=Math.max(rx+20,Math.min(rx+rw-w-20,P[n-1][0]-w+20)),pyy=py+50;ctx.fillStyle='rgba(10,19,48,.95)';ctx.strokeStyle=COL.g;ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(pxx,pyy,w,84,42);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],pxx+w/2,pyy+44);ctx.restore();}}
    ctx.restore();}
  ctx.restore();}};
// ---- Y48
C.CARDS.endscreen={assets:d=>[d.bg||BG,VG].concat(d.vi?[d.vi]:[]),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.r,oa=outAt(t,sc),vt=S(d.vt),ch=S(d.ch),vw=S(d.views);
  const cw=996,chh=560,top=d.title?180:110,cy0=top,cx0=W/2-cw/2;
  ctx.save();ctx.globalAlpha=oa;const p=E.out(C.prog(t,.25,.9)),pulse=1+.012*Math.sin(t*3);
  if(p>0){ctx.save();ctx.globalAlpha=oa*p;ctx.translate(W/2,cy0+chh/2+(1-p)*60);ctx.scale((.92+.08*p)*pulse,(.92+.08*p)*pulse);ctx.translate(-W/2,-(cy0+chh/2));
    panel(ctx,cx0,cy0,cw,chh,col,40,.9,6,30);ctx.save();ctx.beginPath();ctx.roundRect(cx0+12,cy0+12,cw-24,chh-24,30);ctx.clip();
    if(d.vi&&C.img(S(d.vi)))C.cover(ctx,C.img(S(d.vi)),cx0+12,cy0+12,cw-24,chh-24,1);else{const g=ctx.createLinearGradient(cx0,cy0,cx0+cw,cy0+chh);g.addColorStop(0,'#16285a');g.addColorStop(1,'#0a1330');ctx.fillStyle=g;ctx.fillRect(cx0,cy0,cw,chh);}
    ctx.restore();ctx.save();ctx.fillStyle='rgba(0,0,0,.5)';ctx.beginPath();ctx.arc(W/2,cy0+chh/2,100,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(W/2-28,cy0+chh/2-48);ctx.lineTo(W/2-28,cy0+chh/2+48);ctx.lineTo(W/2+54,cy0+chh/2);ctx.closePath();ctx.fill();ctx.restore();
    ctx.restore();}
  const q=E.out(C.prog(t,.9,1.5));if(q>0){ctx.save();ctx.globalAlpha=oa*q;const ty=cy0+chh+70+(1-q)*20;if(vt)txt(ctx,vt,W/2,ty,cw+300,1,64,32,900,'#fff');const ln=[ch,vw].filter(Boolean).join('  •  ');if(ln)txt(ctx,ln,W/2,ty+(vt?85:0),cw,1,44,26,700,'#b8c4e0');ctx.restore();}
  if(d.sub){const a=E.out(C.prog(t,1.8,2.4));if(a>0){ctx.save();ctx.globalAlpha=oa*a;const f=C.fitText(ctx,S(d.sub),600,1,46,26,900);ctx.font=C.font(f.px,900);const w=ctx.measureText(f.lines[0]).width+90,bx=W/2-w/2,by=cy0+chh+250;ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(bx,by-40,w,80,40);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,by+3);ctx.restore();}}
  ctx.restore();}};// ---- Y1 (C119) burst: data:{title, shot:'asset' (optional bg screen-record), n:375 (count-up), dec:0, pre:'', unit:'x', label:'...', pill:'...', c:'y', bg}
C.CARDS.burst={assets:d=>[d.bg||BG,VG].concat(d.shot?[d.shot]:[]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),has=isN(d.n),big=S(d.big);
  const im=d.shot&&C.img(S(d.shot))||C.img(d.bg||BG),wp=1-E.out(C.prog(t,0,1.0)),z=1+.05*t/sc.dur;
  // whip-blur: shuru mein side-motion blur, 1s mein saaf
  const k=Math.round(10*wp)+1;ctx.save();for(let i=0;i<k;i++){ctx.globalAlpha=1/(i+1)*(k>1?1:1);const dx=(i-(k-1)/2)*70*wp;C.cover(ctx,im,-60+dx,-30,W+120,H+60,z);}ctx.restore();
  ctx.fillStyle='rgba(6,12,32,'+(.45+.2*(1-wp))+')';ctx.fillRect(0,0,W,H);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.5,1.0));ctx.save();ctx.globalAlpha=tp*oa;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  if(!has&&!big){msg(ctx,'n (number) ya big (text) do');return;}
  const a0=.6,p=E.out(C.prog(t,a0,a0+.6)),dec=Math.max(0,Math.min(3,Math.round(+d.dec)||0)),val=has?(+d.n*E.out(C.prog(t,a0,a0+1.8))):0,
   sn=big||((S(d.pre))+(dec?val.toFixed(dec):fmt(val)));
  ctx.save();ctx.globalAlpha=oa*p;const cy=H/2-(d.label?30:0)+(1-p)*60;
  const f=C.fitText(ctx,sn+(has?S(d.unit):''),1700,1,380,120,900);ctx.font=C.font(f.px,900);ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineJoin='round';ctx.lineWidth=18;ctx.strokeStyle='rgba(8,18,42,.9)';const txtv=sn+(has?S(d.unit):'');ctx.strokeText(txtv,W/2,cy);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=36;ctx.fillText(txtv,W/2,cy);ctx.shadowBlur=0;
  const bw=Math.min(1500,ctx.measureText(txtv).width+120),bp=E.out(C.prog(t,a0+.3,a0+1.6));ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=22;ctx.beginPath();ctx.roundRect(W/2-bw/2,cy+f.px*.55,bw*bp,32,16);ctx.fill();ctx.shadowBlur=0;
  if(d.label){const lp=E.out(C.prog(t,a0+1.2,a0+1.8));ctx.globalAlpha=oa*lp;txt(ctx,S(d.label),W/2,cy+f.px*.55+130,1500,2,64,30,900,'#fff');}
  ctx.restore();
  if(d.pill){const a=E.out(C.prog(t,2.6,3.2));if(a>0)pillBox(ctx,S(d.pill),W/2,H-120+(1-a)*20,col,oa*a,56);}}};// ---- R2 (C121) diamond chapter card: data:{num:1, tag:'' (default 'CHAPTER'), title:'...', icon:'asset' (optional; na do to number), pill:'', c:'y', bg}
C.CARDS.diamond={assets:d=>[d.bg||BG,VG].concat(d.icon?[S(d.icon)]:[]),
 draw(ctx,t,d,sc){base(ctx,t,Object.assign({},d,{title:''}),sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),title=S(d.title),num=S(d.num),tag=S(d.tag)||'CHAPTER';
  if(!title&&!num){msg(ctx,'num ya title do');return;}
  const cx=W/2,cy=H/2-90,R=210,p=E.back(C.prog(t,.1,.8)),rot=(1-E.out(C.prog(t,.1,.9)))*Math.PI/2,dp=E.out(C.prog(t,.2,1.1));
  ctx.save();ctx.globalAlpha=oa;
  // bahar ki halki diamond
  ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.PI/4+rot);const s0=Math.min(1.15,p)*(1+.03*Math.sin(t*2));ctx.scale(s0,s0);
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-R*.88-34,-R*.88-34,(R*.88+34)*2,(R*.88+34)*2,26);ctx.stroke();
  // mukhya diamond (outline draw hoti hai)
  ctx.fillStyle='rgba(10,19,48,.86)';ctx.beginPath();ctx.roundRect(-R*.88,-R*.88,R*1.76,R*1.76,30);ctx.fill();
  ctx.strokeStyle=col;ctx.lineWidth=8;ctx.shadowColor=col;ctx.shadowBlur=26;ctx.setLineDash([R*7.04*dp+1,R*8]);ctx.beginPath();ctx.roundRect(-R*.88,-R*.88,R*1.76,R*1.76,30);ctx.stroke();ctx.restore();
  // andar icon ya number
  const ip=E.out(C.prog(t,.7,1.2));ctx.save();ctx.globalAlpha=oa*ip;
  const im=d.icon&&C.img(S(d.icon));
  if(im){const k=Math.min(250/im.width,250/im.height);ctx.drawImage(im,cx-im.width*k/2,cy-im.height*k/2+(1-ip)*20,im.width*k,im.height*k);}
  else if(num){ctx.font=C.font(230,900);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=24;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(num,cx,cy+8+(1-ip)*20);}
  ctx.restore();
  // CHAPTER N
  const tp=E.out(C.prog(t,.8,1.35));if(tp>0){ctx.save();ctx.globalAlpha=oa*tp;txt(ctx,(tag+(im&&num?' '+num:(im?'':''))).toUpperCase(),cx,cy+R+85+(1-tp)*20,1500,1,58,30,900,col);ctx.restore();}
  const hp=E.out(C.prog(t,1.0,1.6));if(hp>0&&title){ctx.save();ctx.globalAlpha=oa*hp;ctx.translate(0,(1-hp)*30);txt(ctx,title,cx,cy+R+200,1600,2,92,40,900,'#fff');ctx.restore();}
  if(d.pill){const a=E.out(C.prog(t,1.8,2.4));if(a>0)pillBox(ctx,S(d.pill),cx,H-90+(1-a)*20,col,oa*a,50);}
  ctx.restore();}};
})();
