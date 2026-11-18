// C104 (Y21): compare card (wide) — do glass column, har row par tick ya cross, ek-ek karke aati hain.
// compare: data:{title, la:'पक्की खबर', lb:'अफवाह', a:['लाइन',...](1-6), b:[...](1-6), ma:'tick'|'cross' (default tick), mb:'cross'|'tick' (default cross), ca:'g', cb:'r', bg}
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',w:'#ffffff'};
function lst(x){return(Array.isArray(x)?x:[]).filter(v=>v!=null&&String(v).trim()).map(String).slice(0,6);}
C.compareRows=d=>({a:lst(d.a),b:lst(d.b)});
function mark(ctx,x,y,kind,p){ctx.save();ctx.translate(x,y);ctx.scale(p,p);const g=kind!=='cross',c=g?COL.g:COL.r;
  ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle='#0a1330';ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
  if(g){ctx.moveTo(-11,1);ctx.lineTo(-3,10);ctx.lineTo(12,-9);}else{ctx.moveTo(-10,-10);ctx.lineTo(10,10);ctx.moveTo(10,-10);ctx.lineTo(-10,10);}
  ctx.stroke();ctx.restore();}
C.CARDS.compare={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,outA=1-E.in(C.prog(t,dur-.3,dur)),R=C.compareRows(d);
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp*outA;const f=C.fitText(ctx,String(d.title),1600,1,76,40,900);C.text(ctx,f.lines[0],W/2,100+20*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const n=Math.max(R.a.length,R.b.length,1),top=d.title?190:110,pw=800,gap=70,rowH=Math.min(110,Math.floor((H-top-230)/n)),hh=120,ph=hh+n*rowH+40,py=top+Math.max(0,(H-top-80-ph)/2),
    cols=[{x:W/2-gap/2-pw,items:R.a,l:d.la,c:COL[d.ca]||COL.g,m:d.ma==='cross'?'cross':'tick',a0:.3},{x:W/2+gap/2,items:R.b,l:d.lb,c:COL[d.cb]||COL.r,m:d.mb==='tick'?'tick':'cross',a0:.6}];
  ctx.save();ctx.globalAlpha=outA;
  cols.forEach(col=>{const p=E.out(C.prog(t,col.a0,col.a0+.5));if(p<=0)return;ctx.save();ctx.globalAlpha=outA*p;ctx.translate(0,(1-p)*40);
    ctx.fillStyle='rgba(10,19,48,.7)';ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(col.x,py,pw,ph,36);ctx.fill();ctx.stroke();
    ctx.fillStyle=col.c;ctx.globalAlpha=outA*p*.2;ctx.beginPath();ctx.roundRect(col.x,py,pw,hh,[36,36,0,0]);ctx.fill();ctx.globalAlpha=outA*p;
    ctx.fillStyle=col.c;ctx.fillRect(col.x+40,py+hh-4,pw-80,4);
    if(col.l){const f=C.fitText(ctx,String(col.l),pw-80,1,60,34,900);ctx.font=C.font(f.px,900);ctx.fillStyle=col.c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;ctx.fillText(f.lines[0],col.x+pw/2,py+hh/2+2);ctx.shadowBlur=0;}
    ctx.restore();
    col.items.forEach((s,i)=>{const a=col.a0+.5+i*.28,rp=E.out(C.prog(t,a,a+.4));if(rp<=0)return;const y=py+hh+20+i*rowH+rowH/2;
      ctx.save();ctx.globalAlpha=outA*rp;ctx.translate((col.x<W/2?-1:1)*(1-rp)*30,0);
      mark(ctx,col.x+64,y,col.m,E.back(C.prog(t,a+.1,a+.5)));
      const f=C.fitText(ctx,s,pw-170,2,48,30,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=5;
      const lh=Math.round(f.px*1.15),y0=y-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,col.x+120,y0+k*lh+2));ctx.restore();});});
  ctx.restore();
 }};
})();
