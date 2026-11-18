// C96 (G21): curve card (wide) — 1-2 curve ek-ek karke ban-ti hain (area gradient + glow end-dot + label), x-axis labels, mark (peak/dip) bubble.
// curve: data:{title, xl:['Day 1','Day 2',..], y1:'5,12,30,70' (ya [..]), l1, c1:'g|r|y', mark1:'3:Peak', y2,l2,c2,mark2, note, bg, ymin, ymax}
// Sirf sach ya confirmed trend dikhao; rumour ka graph ho to l1/note mein "Rumour" likho (Rahul ka niyam).
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark';
const COL={g:'#2ecc71',r:'#ff4d4f',y:'#F5C518'};
const num=v=>(Array.isArray(v)?v:String(v==null?'':v).split(/[,\s]+/)).map(Number).filter(x=>isFinite(x)&&x!==null);
const mk=s=>{const m=String(s||'').match(/^(\d+)\s*:\s*(.+)$/);return m?{i:+m[1],t:m[2].trim()}:null;};
C.curveSpec=d=>{const cs=[];[1,2].forEach(n=>{const p=num(d['y'+n]);if(p.length>=2)cs.push({pts:p,l:d['l'+n]||'',c:COL[d['c'+n]]?d['c'+n]:(n===1?'g':'r'),mk:mk(d['mark'+n])});});return cs;};
function sample(P,steps){ // Catmull-Rom -> polyline
  const o=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
    for(let s=0;s<steps;s++){const u=s/steps,u2=u*u,u3=u2*u;
      o.push([.5*((2*p1[0])+(-p0[0]+p2[0])*u+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*u2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*u3),
              .5*((2*p1[1])+(-p0[1]+p2[1])*u+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*u2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*u3)]);}}
  o.push(P[P.length-1]);return o;}
C.CARDS.curve={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,cs=C.curveSpec(d);
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  const tp=E.out(C.prog(t,.1,.6));
  if(d.title){ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,d.title,1600,1,84,44,900);C.text(ctx,f.lines[0],W/2,120+24*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  // glass panel
  const px=190,py=215,pw=W-380,ph=700,pa=E.out(C.prog(t,.2,.7));
  ctx.save();ctx.globalAlpha=pa;ctx.fillStyle='rgba(10,19,48,.55)';ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(px,py+(1-pa)*30,pw,ph,36);ctx.fill();ctx.stroke();ctx.restore();
  if(!cs.length){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('y1 mein kam se kam 2 number do',W/2,py+ph/2);ctx.restore();return;}
  const ax0=px+110,ax1=px+pw-110,ay0=py+90,ay1=py+ph-120;
  let lo=Infinity,hi=-Infinity;cs.forEach(c=>c.pts.forEach(v=>{lo=Math.min(lo,v);hi=Math.max(hi,v);}));
  if(isFinite(+d.ymin))lo=+d.ymin;if(isFinite(+d.ymax))hi=+d.ymax;if(hi<=lo)hi=lo+1;
  const pad=(hi-lo)*.08,Y=v=>ay1-((v-lo)/(hi-lo+pad))*(ay1-ay0);
  const xl=Array.isArray(d.xl)?d.xl:[],nmax=Math.max.apply(null,cs.map(c=>c.pts.length)),X=(i,n)=>ax0+(ax1-ax0)*(n<=1?0:i/(n-1));
  // axis + x labels
  ctx.save();ctx.globalAlpha=pa;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ax0-40,ay1);ctx.lineTo(ax1+40,ay1);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=2;for(let g=1;g<=3;g++){const gy=ay1-(ay1-ay0)*g/3.4;ctx.beginPath();ctx.moveTo(ax0-40,gy);ctx.lineTo(ax1+40,gy);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,.85)';ctx.font=C.font(36,700);ctx.textAlign='center';ctx.textBaseline='top';
  xl.slice(0,nmax).forEach((s,i)=>ctx.fillText(String(s),X(i,xl.length<nmax?xl.length:nmax),ay1+26));ctx.restore();
  // curves
  cs.forEach((c,ci)=>{
    const col=COL[c.c],P=c.pts.map((v,i)=>[X(i,c.pts.length),Y(v)]),S=sample(P,14),a=.8+ci*.7,p=E.io(C.prog(t,a,a+2.0));
    if(p<=0)return;const L=(S.length-1)*p,n=Math.floor(L),fr=L-n,part=S.slice(0,n+1);
    if(n<S.length-1){const a0=S[n],a1=S[n+1];part.push([a0[0]+(a1[0]-a0[0])*fr,a0[1]+(a1[1]-a0[1])*fr]);}
    const end=part[part.length-1];
    // area
    ctx.save();const g=ctx.createLinearGradient(0,ay0,0,ay1);g.addColorStop(0,col+'55');g.addColorStop(1,col+'00');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(part[0][0],ay1);part.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.lineTo(end[0],ay1);ctx.closePath();ctx.fill();
    // line + glow
    ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=col;ctx.lineWidth=10;ctx.shadowColor=col;ctx.shadowBlur=26;
    ctx.beginPath();part.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
    // end dot (pulse)
    const pu=1+.18*Math.sin(t*6);ctx.shadowBlur=36;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(end[0],end[1],15*pu,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle=col;ctx.lineWidth=6;ctx.stroke();ctx.restore();
    // mark bubble (jab curve wahan pahunch jaye)
    if(c.mk&&c.mk.i<c.pts.length){const mp=P[c.mk.i],mi=c.mk.i/(c.pts.length-1);if(p>=mi){const ma=E.out(C.prog(t,a+2*mi+0.05,a+2*mi+.5));
      ctx.save();ctx.globalAlpha=ma;ctx.font=C.font(36,800);const tw=ctx.measureText(c.mk.t).width+44,dir=(ci||c.mk.i===c.pts.length-1)?1:-1,by=mp[1]+dir*70-(1-ma)*10;
      ctx.fillStyle='rgba(10,19,48,.85)';ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(mp[0]-tw/2,by-30,tw,60,30);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c.mk.t,mp[0],by+2);
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(mp[0],mp[1],9,0,Math.PI*2);ctx.fill();ctx.restore();}}
    // label (end ke paas, curve poori hone par)
    if(c.l){const la=E.out(C.prog(t,a+2.0,a+2.5));if(la>0){ctx.save();ctx.globalAlpha=la;ctx.font=C.font(42,800);ctx.textAlign='right';ctx.textBaseline='middle';
      ctx.fillStyle=col;ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=8;ctx.fillText(c.l,Math.min(ax1+60,end[0]-30),Math.max(py+50,end[1]-60));ctx.restore();}}
  });
  if(d.note){const na=E.out(C.prog(t,.9,1.4));ctx.save();ctx.globalAlpha=na;const f=C.fitText(ctx,d.note,1500,1,46,30,700);C.text(ctx,f.lines[0],W/2,py+ph+70,{align:'center',px:f.px,stroke:8,shadow:8,color:'#ffd23f',base:'middle'});ctx.restore();}
 }};
})();
