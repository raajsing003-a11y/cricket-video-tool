// C116 (Y34 + Y35 + Y36): teen wide card.
// gcurve (Y34): data:{title, gauge:18, glabel:'18%', gl:'CTR', pts:[100,72,50,36,28,22] (retention curve, 0-100, 2-10 point), cl:'रिटेंशन' (curve card ka label), c:'y', bg} -> baayein gauge card, daayein curve card (line draw hoti hai, end dot)
// steps  (Y35): data:{title, items:['पहला|छोटी लाइन', ...](2-4), hl:2 (optional; sirf wo step roshan, baaki dim; na do to ek-ek roshan hote jaate hain), caption:'...' (optional neeche pill), c:'y', bg} -> "Step N" cards
// expect (Y36): data:{title, thumb:'text', ti:'asset image' (optional), thought:'मैं सीखूँगा...', user:'दर्शक', av:'asset' (optional), pill:'वादा पूरा' (optional), tick:true, c:'y', bg} -> thumbnail card ---- thought bubble ---- avatar + hara tick
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const S=v=>v==null?'':String(v).trim(),isN=v=>v!=null&&v!==''&&isFinite(+v);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw,glow)=>{ctx.save();ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=glow==null?20:glow;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.restore();};
function msg(ctx,txt){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(txt,C.W/2,C.H/2);ctx.restore();}
function pillBox(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;const f=C.fitText(ctx,txt,1500,1,fs,28,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+120,h=104;panel(ctx,x-w/2,y-h/2,w,h,col,h/2,.85,4,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x,y+3);ctx.restore();}
C.gcPts=d=>(Array.isArray(d.pts)?d.pts:[]).filter(isN).slice(0,10).map(Number);
C.stepItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>S(v)).slice(0,4).map(s=>{const a=String(s).split('|').map(x=>x.trim());return{t:a[0],l:a[1]||''};});
function avatar(ctx,cx,cy,r,col,img){if(img&&C.img(img)){ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();C.cover(ctx,C.img(img),cx-r,cy-r,r*2,r*2,1);ctx.restore();ctx.strokeStyle=col;ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();}
  else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(cx,cy-r*.2,r*.32,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx,cy+r*.58,r*.55,r*.36,0,Math.PI,0);ctx.fill();}}
// ---- Y34
C.CARDS.gcurve={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,pts=C.gcPts(d),hasG=isN(d.gauge),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(!hasG&&pts.length<2){msg(ctx,'gauge ya pts (2+) do');return;}
  const cy=H/2+(d.title?40:0),ch=640,gw=hasG?620:0,cw=pts.length>=2?(hasG?1000:1500):0,gap=hasG&&cw?60:0,tot=gw+gap+cw,x0=W/2-tot/2;
  ctx.save();ctx.globalAlpha=outA;
  if(hasG){const p=E.out(C.prog(t,.25,.8)),ga=E.out(C.prog(t,.6,1.8));if(p>0){const y=cy-ch/2+(1-p)*50;ctx.save();ctx.globalAlpha=outA*p;panel(ctx,x0,y,gw,ch,col,44);
    const gx=x0+gw/2,gc=y+ch-190,R=215,gv=Math.max(0,Math.min(100,+d.gauge))/100;ctx.lineCap='round';ctx.lineWidth=46;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.arc(gx,gc,R,Math.PI,2*Math.PI);ctx.stroke();
    ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.arc(gx,gc,R,Math.PI,Math.PI+Math.PI*Math.max(.008,gv*ga));ctx.stroke();ctx.shadowBlur=0;
    ctx.font=C.font(104,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S(d.glabel)||(Math.round(+d.gauge*ga)+'%'),gx,gc-35);
    if(d.gl){const f=C.fitText(ctx,String(d.gl),gw-80,1,60,30,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#b8c4e0';ctx.fillText(f.lines[0],gx,gc+95);}ctx.restore();}}
  if(cw){const p=E.out(C.prog(t,.55,1.1)),dp=E.out(C.prog(t,1.0,3.0));if(p>0){const x=x0+gw+gap,y=cy-ch/2+(1-p)*50;ctx.save();ctx.globalAlpha=outA*p;panel(ctx,x,y,cw,ch,'#6fa8ff',44);
    const lx=x+90,ly=y+80,lw=cw-150,lh=ch-210;ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;for(let k=0;k<=4;k++){ctx.beginPath();ctx.moveTo(lx,ly+lh*k/4);ctx.lineTo(lx+lw,ly+lh*k/4);ctx.stroke();}
    const n=pts.length,pos=i=>[lx+lw*i/(n-1),ly+lh*(1-Math.max(0,Math.min(100,pts[i]))/100)],seg=(n-1)*dp;
    const path=()=>{const a=pos(0);ctx.moveTo(a[0],a[1]);for(let i=1;i<n;i++){if(i-1>=seg)break;const q=pos(i-1),r=pos(i),f=Math.min(1,seg-(i-1));ctx.lineTo(q[0]+(r[0]-q[0])*f,q[1]+(r[1]-q[1])*f);}};
    ctx.save();const gr=ctx.createLinearGradient(0,ly,0,ly+lh);gr.addColorStop(0,'rgba(111,168,255,.35)');gr.addColorStop(1,'rgba(111,168,255,0)');ctx.fillStyle=gr;ctx.beginPath();path();const endI=Math.min(n-1,seg),eq=pos(Math.floor(endI)),er=pos(Math.min(n-1,Math.floor(endI)+1)),ef=endI-Math.floor(endI),ex=eq[0]+(er[0]-eq[0])*ef;ctx.lineTo(ex,ly+lh);ctx.lineTo(lx,ly+lh);ctx.closePath();ctx.fill();ctx.restore();
    ctx.strokeStyle='#6fa8ff';ctx.lineWidth=9;ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor='#6fa8ff';ctx.shadowBlur=16;ctx.beginPath();path();ctx.stroke();ctx.shadowBlur=0;
    const ei=Math.min(n-1,seg),a0=pos(Math.floor(ei)),a1=pos(Math.min(n-1,Math.floor(ei)+1)),fr=ei-Math.floor(ei),dx=a0[0]+(a1[0]-a0[0])*fr,dy=a0[1]+(a1[1]-a0[1])*fr;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(dx,dy,15,0,Math.PI*2);ctx.fill();
    if(d.cl){const f=C.fitText(ctx,String(d.cl),cw-100,1,52,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#b8c4e0';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(f.lines[0],lx,y+ch-60);}ctx.restore();}}
  ctx.restore();}};
// ---- Y35
C.CARDS.steps={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,it=C.stepItems(d),n=it.length,hl=Math.round(+d.hl)||0,cap=S(d.caption),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(n<2){msg(ctx,'items mein kam se kam 2 step do');return;}
  const cw=n===4?410:n===3?520:640,ch=520,gap=44,tw=n*cw+(n-1)*gap,x0=W/2-tw/2,cy=H/2+(d.title?45:0)-(cap?55:0);
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((o,i)=>{const a=.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const lit=hl?hl===i+1:E.out(C.prog(t,a+.5+n*.3,a+1+n*.3))>0||false,seqT=.3+n*.3+.6+i*.7,lp=hl?(hl===i+1?1:0):E.out(C.prog(t,seqT,seqT+.4)),dim=hl?(hl===i+1?0:1):1-lp;
    const x=x0+i*(cw+gap)+cw/2,y=cy+(1-p)*50;ctx.save();ctx.globalAlpha=outA*p*(1-.62*dim);ctx.translate(x,y);panel(ctx,-cw/2,-ch/2,cw,ch,dim>.5?'rgba(255,255,255,.3)':col,36,.78,dim>.5?2:6,dim>.5?0:26);
    ctx.fillStyle=dim>.5?'#8fa0c4':col;ctx.font=C.font(46,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('STEP '+(i+1),0,-ch/2+80);
    ctx.fillStyle=dim>.5?'#8fa0c4':col;ctx.beginPath();ctx.arc(0,-ch/2+190,62,0,Math.PI*2);ctx.globalAlpha*=.2;ctx.fill();ctx.globalAlpha=outA*p*(1-.62*dim);ctx.fillStyle=dim>.5?'#cfd8ee':'#fff';ctx.font=C.font(80,900);ctx.fillText(String(i+1),0,-ch/2+194);
    const f=C.fitText(ctx,o.t,cw-60,2,52,30,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=5;const lh=Math.round(f.px*1.2),y0=60-(f.lines.length-1)*lh/2+20;f.lines.forEach((l,k)=>ctx.fillText(l,0,y0+k*lh));
    if(o.l){const g=C.fitText(ctx,o.l,cw-70,3,36,26,600);ctx.font=C.font(g.px,600);ctx.fillStyle='#aab6d0';const l2=Math.round(g.px*1.25),yy=y0+f.lines.length*lh+40;g.lines.forEach((l,k)=>ctx.fillText(l,0,yy+k*l2));}
    ctx.shadowBlur=0;ctx.restore();});
  if(cap){const a=.3+n*.3+.3,pa=E.out(C.prog(t,a,a+.5));if(pa>0)pillBox(ctx,cap,W/2,H-110+(1-pa)*20,col,outA*pa,54);}
  ctx.restore();}};
// ---- Y36
C.CARDS.expect={assets:d=>{const k=[d.bg||BG,VG];if(d.ti)k.push(d.ti);if(d.av)k.push(d.av);return k;},
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),th=S(d.thumb),tho=S(d.thought),us=S(d.user),pill=S(d.pill),tick=d.tick!==false;
  if(!th&&!d.ti&&!tho){msg(ctx,'thumb ya thought do');return;}
  const cy=H/2+(d.title?10:0)-(pill?40:0),y0=cy;ctx.save();ctx.globalAlpha=outA;
  // thumbnail card (left)
  const tw=440,tht=248,tx=130,ty=y0-tht/2,p1=E.out(C.prog(t,.25,.8));
  if(p1>0){ctx.save();ctx.globalAlpha=outA*p1;ctx.translate(0,(1-p1)*40);panel(ctx,tx,ty,tw,tht,'#6fa8ff',28,.85);ctx.save();ctx.beginPath();ctx.roundRect(tx+12,ty+12,tw-24,tht-24,20);ctx.clip();
    if(d.ti&&C.img(d.ti))C.cover(ctx,C.img(d.ti),tx+12,ty+12,tw-24,tht-24,1);else{ctx.fillStyle='#17294f';ctx.fillRect(tx+12,ty+12,tw-24,tht-24);}
    if(th){const f=C.fitText(ctx,th,tw-80,3,64,28,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.8)';ctx.shadowBlur=10;const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,tx+tw/2,y0+(k-(f.lines.length-1)/2)*lh));}
    ctx.restore();ctx.restore();}
  // thought bubble (centre)
  const bw=540,bh=250,bx=W/2-bw/2,by=y0-bh/2-20,p2=E.out(C.prog(t,.9,1.5));
  const lp1=E.out(C.prog(t,.8,1.2)),lp2=E.out(C.prog(t,1.4,1.9));
  ctx.save();ctx.strokeStyle=col;ctx.lineWidth=6;ctx.setLineDash([16,12]);ctx.globalAlpha=outA*.9;
  if(lp1>0){ctx.beginPath();ctx.moveTo(tx+tw+10,y0);ctx.lineTo(tx+tw+10+(bx-tx-tw-20)*lp1,y0);ctx.stroke();}
  const ax=W-170-130;if(lp2>0){ctx.beginPath();ctx.moveTo(bx+bw+10,y0);ctx.lineTo(bx+bw+10+(ax-bx-bw-60)*lp2,y0);ctx.stroke();}ctx.restore();
  if(p2>0&&tho){ctx.save();ctx.globalAlpha=outA*p2;ctx.translate(0,(1-p2)*30);panel(ctx,bx,by,bw,bh,col,125,.85,5,24);
    [[bx+90,by+bh+22,18],[bx+55,by+bh+60,11]].forEach(([x,y,r])=>{ctx.fillStyle='rgba(10,19,48,.9)';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.stroke();});
    const f=C.fitText(ctx,tho,bw-130,3,60,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,bx+bw/2,by+bh/2+(k-(f.lines.length-1)/2)*lh));ctx.restore();}
  // user avatar (right)
  const p3=E.back(C.prog(t,1.8,2.4));
  if(p3>0){const axc=W-170-130,r=110;ctx.save();ctx.globalAlpha=outA*Math.min(1,p3*2);ctx.translate(axc,y0);ctx.scale(Math.max(.01,p3),Math.max(.01,p3));avatar(ctx,0,0,r,col,d.av);
    if(us){const f=C.fitText(ctx,us,360,1,50,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,r+55);}
    if(tick){const tp=E.back(C.prog(t,2.5,3.0));if(tp>0){ctx.save();ctx.translate(r*.78,-r*.78);ctx.scale(Math.max(.01,tp),Math.max(.01,tp));ctx.fillStyle='#2ecc71';ctx.shadowColor='#2ecc71';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(0,0,44,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=10;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-18,2);ctx.lineTo(-5,15);ctx.lineTo(19,-14);ctx.stroke();ctx.restore();}}
    ctx.restore();}
  if(pill){const a=E.out(C.prog(t,2.8,3.3));if(a>0)pillBox(ctx,pill,W/2,H-120+(1-a)*20,col,outA*a,54);}
  ctx.restore();}};
})();
