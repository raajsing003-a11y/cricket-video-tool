// C117 (Y37 + Y38 + Y39): teen wide card.
// equals   (Y37): data:{title, a:'पहली लाइन', av:'टाइटल', b:'पहला शॉट', bv:'थंबनेल', ex:'उदाहरण text' (optional neeche mini-card), c:'y', bg} -> do row "a = av", "b = bv" (connector), neeche example mini-card
// payoff   (Y38): data:{title, a:'कॉन्टेक्स्ट', b:'पेऑफ़', ta:'0s', tb:'20s', q:3 (0-4; baad mein "?" thumbnails + progress line), qt:'' (q ke neeche label), c:'y', bg} -> 2 card + neeche timeline bar
// tickgrid (Y39): data:{title, total:40 (6-60), cols:10 (optional), quote:'...' (neeche pill), pts:[100,90,85,80] (optional retention line, 2-8 number), c:'g', bg} -> hare tick ki grid ek-ek pop + quote pill + chhoti retention line
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const S=v=>v==null?'':String(v).trim(),isN=v=>v!=null&&v!==''&&isFinite(+v);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw,glow)=>{ctx.save();ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=glow==null?20:glow;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.restore();};
function msg(ctx,txt){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(txt,C.W/2,C.H/2);ctx.restore();}
function label(ctx,txt,cx,cy,w,h,col,fs,fill){const f=C.fitText(ctx,txt,w-60,2,fs,28,900);ctx.save();panel(ctx,cx-w/2,cy-h/2,w,h,col,28,.85,4,fill?26:14);ctx.font=C.font(f.px,900);ctx.fillStyle=fill?col:'#fff';ctx.textAlign='center';ctx.textBaseline='middle';const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,cx,cy+(k-(f.lines.length-1)/2)*lh+3));ctx.restore();}
function pillBox(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;const f=C.fitText(ctx,txt,1500,1,fs,28,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+120,h=104;panel(ctx,x-w/2,y-h/2,w,h,col,h/2,.85,4,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x,y+3);ctx.restore();}
C.tgPts=d=>(Array.isArray(d.pts)?d.pts:[]).filter(isN).slice(0,8).map(Number);
// ---- Y37
C.CARDS.equals={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),rows=[[S(d.a),S(d.av)],[S(d.b),S(d.bv)]].filter(r=>r[0]&&r[1]),ex=S(d.ex);
  if(!rows.length){msg(ctx,'a + av (aur/ya b + bv) do');return;}
  const rh=170,gap=50,tot=rows.length*rh+(rows.length-1)*gap,top=(d.title?190:120)+((H-(d.title?190:120)-(ex?300:100))-tot)/2,lw=640;
  ctx.save();ctx.globalAlpha=outA;
  rows.forEach((r,i)=>{const a=.3+i*.7,p1=E.out(C.prog(t,a,a+.5)),p2=E.out(C.prog(t,a+.35,a+.85)),p3=E.out(C.prog(t,a+.6,a+1.1));const cy=top+i*(rh+gap)+rh/2,xl=W/2-lw-140,xr=W/2+140;
   if(p1>0){ctx.save();ctx.globalAlpha=outA*p1;ctx.translate(-(1-p1)*40,0);label(ctx,r[0],xl+lw/2,cy,lw,rh,'#6fa8ff',64,false);ctx.restore();}
   if(p2>0){ctx.save();ctx.globalAlpha=outA*p2;ctx.strokeStyle=col;ctx.lineWidth=7;ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=12;const x0=xl+lw+16,x1=xr-16,xm=(x0+x1)/2;ctx.beginPath();ctx.moveTo(x0,cy-10);ctx.lineTo(xm-(xm-x0)*0+ -0,cy-10);ctx.moveTo(x0,cy-10);ctx.lineTo(x0+(x1-x0)*p2,cy-10);ctx.moveTo(x0,cy+14);ctx.lineTo(x0+(x1-x0)*p2,cy+14);ctx.stroke();ctx.restore();}
   if(p3>0){ctx.save();ctx.globalAlpha=outA*p3;ctx.translate((1-p3)*40,0);label(ctx,r[1],xr+lw/2,cy,lw,rh,col,64,true);ctx.restore();}});
  if(ex){const a=.3+rows.length*.7+.3,p=E.out(C.prog(t,a,a+.5));if(p>0){const ew=1100,eh=140,ey=H-130+(1-p)*30;ctx.save();ctx.globalAlpha=outA*p;
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;ctx.setLineDash([12,10]);[W/2-140-lw/2,W/2+140+lw/2].forEach(cx=>{ctx.beginPath();ctx.moveTo(cx,top+(rows.length-1)*(rh+gap)+rh+8);ctx.lineTo(W/2,ey-eh/2-8);ctx.stroke();});ctx.setLineDash([]);
    panel(ctx,W/2-ew/2,ey-eh/2,ew,eh,'#9aa8c8',30,.88,3,0);const f=C.fitText(ctx,ex,ew-80,1,56,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,ey+3);ctx.restore();}}
  ctx.restore();}};
// ---- Y38
C.CARDS.payoff={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),a=S(d.a),b=S(d.b),q=Math.max(0,Math.min(4,Math.round(+d.q)||0)),ta=S(d.ta)||'0s',tb=S(d.tb);
  if(!a||!b){msg(ctx,'a aur b dono do');return;}
  const ph2=q>0&&t>2.6,sw=ph2?E.out(C.prog(t,2.6,3.2)):0,cw=780,ch=300,gap=70,y0=(d.title?200:130);
  ctx.save();ctx.globalAlpha=outA;
  [[a,W/2-cw-gap/2,.3,'#6fa8ff'],[b,W/2+gap/2,.8,col]].forEach(([txt,x,at,cc],i)=>{const p=E.out(C.prog(t,at,at+.5));if(p<=0)return;const y=y0+(1-p)*40-sw*20;ctx.save();ctx.globalAlpha=outA*p*(1-.35*sw);ctx.fillStyle='rgba(10,19,48,.8)';panel(ctx,x,y,cw,ch,cc,40,.82,5,22);
    ctx.fillStyle=cc;ctx.font=C.font(40,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(i?'PAYOFF':'CONTEXT',x+cw/2,y+60);const f=C.fitText(ctx,txt,cw-80,2,84,36,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,x+cw/2,y+ch/2+36+(k-(f.lines.length-1)/2)*lh));ctx.restore();});
  // timeline bar
  const bp=E.out(C.prog(t,1.4,1.9)),bw=1500,bx=W/2-bw/2,by=y0+ch+80-sw*20,g=E.out(C.prog(t,1.6,2.8));
  if(bp>0){ctx.save();ctx.globalAlpha=outA*bp;ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.roundRect(bx,by,bw,26,13);ctx.fill();ctx.fillStyle='#6fa8ff';ctx.shadowColor='#6fa8ff';ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(bx,by,Math.max(26,bw*g),26,13);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(bx+Math.max(13,bw*g-13),by+13,18,0,Math.PI*2);ctx.fill();ctx.font=C.font(46,800);ctx.fillStyle='#b8c4e0';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(ta,bx,by+70);if(tb){ctx.textAlign='right';ctx.fillText(tb,bx+bw,by+70);}ctx.restore();}
  if(sw>0){const tw=q===4?360:420,th=236,gp=44,tt=q*tw+(q-1)*gp,tx0=W/2-tt/2,ty=H-405+(1-sw)*60;ctx.save();ctx.globalAlpha=outA*sw;
    for(let i=0;i<q;i++){const p=E.out(C.prog(t,2.8+i*.25,3.3+i*.25));if(p<=0)continue;const x=tx0+i*(tw+gp);ctx.save();ctx.globalAlpha=outA*p;panel(ctx,x,ty,tw,th,'rgba(255,255,255,.35)',24,.85,3,0);ctx.fillStyle='#fff';ctx.font=C.font(130,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',x+tw/2,ty+th/2+8);ctx.restore();}
    const pl=E.out(C.prog(t,3.6,5.0));ctx.strokeStyle='#6fa8ff';ctx.lineWidth=8;ctx.lineCap='round';ctx.shadowColor='#6fa8ff';ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(tx0,ty+th+40);ctx.lineTo(tx0+tt*pl,ty+th+40);ctx.stroke();ctx.shadowBlur=0;
    if(d.qt){ctx.font=C.font(44,800);ctx.fillStyle='#b8c4e0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S(d.qt),W/2,ty+th+95);}ctx.restore();}
  ctx.restore();}};
// ---- Y39
C.CARDS.tickgrid={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.g,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),tot=Math.max(6,Math.min(60,Math.round(+d.total)||40)),pts=C.tgPts(d),q=S(d.quote);
  const cols=Math.max(3,Math.min(15,Math.round(+d.cols)||(tot<=12?6:tot<=30?10:12))),rowsN=Math.ceil(tot/cols),hasL=pts.length>=2;
  const gw=hasL?1000:1300,top=d.title?180:110,avail=H-top-(q?210:100),cell=Math.min(Math.floor((gw-80)/cols),Math.floor((avail-60)/rowsN),130),gh=rowsN*cell+60,gx=hasL?W/2-gw-30+ (gw/2) :W/2-gw/2+0,gx0=hasL?W/2-(gw+60+560)/2:W/2-gw/2,gy=top+(avail-gh)/2;
  ctx.save();ctx.globalAlpha=outA;
  const pp=E.out(C.prog(t,.2,.7));if(pp>0){ctx.save();ctx.globalAlpha=outA*pp;panel(ctx,gx0,gy,gw,gh,col,40,.78,4,18);
    const per=Math.min(.09,2.4/tot),x00=gx0+(gw-cols*cell)/2+cell/2,y00=gy+30+cell/2;
    for(let i=0;i<tot;i++){const a=.7+i*per,p=E.back(C.prog(t,a,a+.35));if(p<=0)continue;const x=x00+(i%cols)*cell,y=y00+Math.floor(i/cols)*cell,r=cell*.34*Math.min(1,p);ctx.save();ctx.translate(x,y);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#08122a';ctx.lineWidth=Math.max(3,cell*.07);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-r*.45,r*.02);ctx.lineTo(-r*.1,r*.38);ctx.lineTo(r*.5,-r*.32);ctx.stroke();ctx.restore();}
    ctx.restore();}
  if(hasL){const lp=E.out(C.prog(t,.5,1.0)),dp=E.out(C.prog(t,1.0,2.6)),lw=560,lx=gx0+gw+60;if(lp>0){ctx.save();ctx.globalAlpha=outA*lp;panel(ctx,lx,gy,lw,gh,'#6fa8ff',40,.8,4,16);const px=lx+50,py=gy+60,pw=lw-100,ph=gh-150,n=pts.length,pos=i=>[px+pw*i/(n-1),py+ph*(1-Math.max(0,Math.min(100,pts[i]))/100)],seg=(n-1)*dp;
    ctx.strokeStyle='#6fa8ff';ctx.lineWidth=8;ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor='#6fa8ff';ctx.shadowBlur=14;ctx.beginPath();const a0=pos(0);ctx.moveTo(a0[0],a0[1]);let e=a0;for(let i=1;i<n&&i-1<seg;i++){const u=pos(i-1),v=pos(i),f=Math.min(1,seg-(i-1));e=[u[0]+(v[0]-u[0])*f,u[1]+(v[1]-u[1])*f];ctx.lineTo(e[0],e[1]);}ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(e[0],e[1],12,0,Math.PI*2);ctx.fill();
    ctx.font=C.font(42,800);ctx.fillStyle='#b8c4e0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('रिटेंशन',lx+lw/2,gy+gh-45);ctx.restore();}}
  if(q){const a=.7+tot*Math.min(.09,2.4/tot)+.2,pa=E.out(C.prog(t,a,a+.5));if(pa>0)pillBox(ctx,q,W/2,H-100+(1-pa)*20,col,outA*pa,56);}
  ctx.restore();}};
})();
