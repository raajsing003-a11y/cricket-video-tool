// C97 (G18): stack card (wide) — 3D-perspective list: upar chhoti, neeche badi rows, ek row highlight (peela glow border + pill), baad mein tick pop, peela circle mark.
// stack: data:{title, items:['..',..] (2-9), hl:3 (1 se), pill:'Most common doubt', done:'1,2,3' (tick), mark:'6,7' (peela circle), bg}
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark';
const idx=s=>(Array.isArray(s)?s:String(s==null?'':s).split(/[,\s]+/)).map(Number).filter(x=>x>=1&&isFinite(x));
C.CARDS.stack={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,its=(Array.isArray(d.items)?d.items:[]).filter(x=>x!=null&&String(x).trim()).slice(0,9),n=its.length;
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  const tp=E.out(C.prog(t,.1,.6));
  if(d.title){ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,d.title,1600,1,84,44,900);C.text(ctx,f.lines[0],W/2,110+24*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  if(n<2){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('items mein kam se kam 2 line do',W/2,H/2);ctx.restore();return;}
  const hl=Math.round(+d.hl)||0,done=idx(d.done),mark=idx(d.mark),top=215,bot=H-70,gap=14,rh=Math.min(104,((bot-top)-gap*(n-1))/n);
  const hlT=.3+n*.12+.3,tk0=hlT+.7,sway=Math.sin(t*.5)*10;
  for(let i=0;i<n;i++){
    const k=n===1?1:i/(n-1),sc2=.78+.22*k,w=1280*sc2,h=rh*(.82+.18*k),y=top+i*(rh+gap)+rh/2,a=.3+i*.12,p=E.out(C.prog(t,a,a+.5));if(p<=0)continue;
    const isH=hl===i+1,hp=isH?E.out(C.prog(t,hlT,hlT+.5)):0,cx=W/2+sway*(1-k*.6)-(1-p)*160;
    ctx.save();ctx.globalAlpha=p;ctx.translate(cx,y);ctx.scale(1+.05*hp,1+.05*hp);
    ctx.fillStyle=isH?'rgba(40,36,10,'+(.55+.2*hp)+')':'rgba(10,19,48,.62)';
    ctx.strokeStyle=isH?'rgba(245,197,24,'+(.4+.6*hp)+')':'rgba(255,255,255,.22)';ctx.lineWidth=isH?6:2;
    if(isH){ctx.shadowColor='#F5C518';ctx.shadowBlur=30*hp;}
    ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,h*.3);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    // number
    const fpx=Math.round(h*.46);ctx.font=C.font(fpx,900);ctx.textBaseline='middle';ctx.textAlign='left';
    ctx.fillStyle=isH?'#F5C518':'#6fa8ff';ctx.fillText(String(i+1).padStart(2,'0'),-w/2+36,3);
    ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;
    const f=C.fitText(ctx,String(its[i]),w-420,1,fpx,24,800);ctx.font=C.font(f.px,800);ctx.fillText(f.lines[0],-w/2+36+fpx*1.9,3);ctx.shadowBlur=0;
    // peela circle mark
    if(mark.indexOf(i+1)>=0){const ma=E.out(C.prog(t,tk0-.3,tk0+.2));if(ma>0){ctx.save();ctx.globalAlpha=ma;ctx.strokeStyle='#F5C518';ctx.lineWidth=6;ctx.shadowColor='#F5C518';ctx.shadowBlur=14;
      const r=h*.62;ctx.beginPath();ctx.ellipse(-w/2+36+fpx*.62,3,r*.8,r*.62,-.08,0,Math.PI*2);ctx.stroke();ctx.restore();}}
    // tick pop
    const di=done.indexOf(i+1);if(di>=0){const tp2=E.back(C.prog(t,tk0+di*.35,tk0+di*.35+.45));if(tp2>0){ctx.save();ctx.translate(w/2-70,0);ctx.scale(tp2,tp2);
      ctx.fillStyle='#2a6fdb';ctx.beginPath();ctx.arc(0,0,h*.34,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';
      const s=h*.15;ctx.beginPath();ctx.moveTo(-s,0);ctx.lineTo(-s*.25,s*.75);ctx.lineTo(s,-s*.7);ctx.stroke();ctx.restore();}}
    // pill
    if(isH&&d.pill){const pa=E.out(C.prog(t,hlT+.2,hlT+.7));if(pa>0){ctx.save();ctx.globalAlpha=pa;ctx.font=C.font(Math.round(h*.36),800);const tw=ctx.measureText(d.pill).width+56,ph=h*.62,px=w/2-(done.indexOf(i+1)>=0?170:60)-tw/2;
      ctx.fillStyle='#F5C518';ctx.beginPath();ctx.roundRect(px-tw/2,-ph/2,tw,ph,ph/2);ctx.fill();ctx.fillStyle='#10131f';ctx.textAlign='center';ctx.fillText(d.pill,px,3);ctx.restore();}}
    ctx.restore();}
 }};
})();
