// C99 (Y14): crowd card (wide) — dot-crowd grid: total chhote avatar dots (default 100), hi unme se peele highlight, beech mein glass card (label + sub).
// crowd: data:{title, total:100, hi:10, label:'10% देखते हैं', sub:'बाकी 90 आगे बढ़ जाते हैं', c:'y|g|r', scatter:true, bg}
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f'};
const hash=i=>{let x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
C.crowdPick=(total,hi,scatter)=>{const ids=[...Array(total).keys()];if(scatter!==false)ids.sort((a,b)=>hash(a+1)-hash(b+1));return ids.slice(0,Math.min(hi,total));};
function person(ctx,x,y,r,col,glow){ctx.save();ctx.fillStyle=col;if(glow){ctx.shadowColor=col;ctx.shadowBlur=22;}
  ctx.beginPath();ctx.arc(x,y-r*.45,r*.42,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x-r*.8,y+r*.85);ctx.quadraticCurveTo(x-r*.8,y+r*.1,x,y+r*.1);ctx.quadraticCurveTo(x+r*.8,y+r*.1,x+r*.8,y+r*.85);ctx.closePath();ctx.fill();ctx.restore();}
C.CARDS.crowd={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,total=Math.max(10,Math.min(200,Math.round(+d.total)||100)),hi=Math.max(0,Math.min(total,Math.round(d.hi==null?10:+d.hi))),col=COL[d.c]||COL.y;
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  const tp=E.out(C.prog(t,.1,.6));
  if(d.title){ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,d.title,1600,1,84,44,900);C.text(ctx,f.lines[0],W/2,110+24*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const cols=total<=60?10:20,rows=Math.ceil(total/cols),gx=Math.min(88,1560/cols),gy=Math.min(100,520/rows),x0=W/2-(cols-1)*gx/2,y0=(d.title?215:170),r=Math.min(gx,gy)*.36;
  const pick=C.crowdPick(total,hi,d.scatter),hiSet={};pick.forEach((k,j)=>hiSet[k]=j);
  const hT=.3+total*.012+.5; // dots ke baad highlight
  for(let i=0;i<total;i++){const c=i%cols,rw=Math.floor(i/cols),a=.25+i*.012,p=E.out(C.prog(t,a,a+.35));if(p<=0)continue;
    const x=x0+c*gx,y=y0+rw*gy+(1-p)*18,h=hiSet[i];let colr='rgba(150,190,255,.55)',glow=false,s=p;
    if(h!=null){const hp=E.back(C.prog(t,hT+h*.08,hT+h*.08+.4));if(hp>0){colr=col;glow=true;s=p*(1+.35*Math.min(1,hp));}}
    ctx.save();ctx.globalAlpha=p;ctx.translate(x,y);ctx.scale(s,s);person(ctx,0,0,r,colr,glow);ctx.restore();}
  // glass card
  const cT=hT+hi*.08+.3;if(d.label&&t>cT){const ca=E.out(C.prog(t,cT,cT+.5));ctx.save();ctx.globalAlpha=ca;
    ctx.font=C.font(110,900);const f=C.fitText(ctx,String(d.label),1100,1,110,56,900),sf=d.sub?C.fitText(ctx,String(d.sub),1100,1,50,30,700):null,cw=Math.max(f.w||0,700),
      w=Math.min(1300,Math.max(760,ctx.measureText(f.lines[0]).width+140)),h=sf?270:190,cy=y0+(rows-1)*gy+r+55+h/2+(1-ca)*20;
    ctx.fillStyle='rgba(10,19,48,.9)';ctx.strokeStyle=col;ctx.lineWidth=5;ctx.shadowColor=col;ctx.shadowBlur=30;ctx.beginPath();ctx.roundRect(W/2-w/2,cy-h/2,w,h,36);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.font=C.font(f.px,900);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,cy-(sf?42:0)+4);
    if(sf){ctx.font=C.font(sf.px,700);ctx.fillStyle='#fff';ctx.fillText(sf.lines[0],W/2,cy+72);}ctx.restore();}
 }};
})();
