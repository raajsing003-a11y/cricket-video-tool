// C98 (Y10): chapter card (wide) — peeli patti par "02  The algorithm" + upar lock-pill (glass, chhoti line). Chapter ke shuru mein lagao.
// chapter: data:{num:'02', title:'The algorithm', pill:'One simple rule, at the end', lock:true (default true), bg}
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark';
function lock(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=5;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(0,-6,9,Math.PI,0);ctx.lineTo(9,0);ctx.moveTo(-9,-6);ctx.lineTo(-9,0);ctx.stroke();
  ctx.beginPath();ctx.roundRect(-14,0,28,22,5);ctx.fill();ctx.fillStyle='#0a1330';ctx.beginPath();ctx.arc(0,9,3.2,0,Math.PI*2);ctx.fill();ctx.restore();}
C.CARDS.chapter={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,num=String(d.num==null?'':d.num),title=String(d.title||''),outA=1-E.in(C.prog(t,dur-.35,dur));
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.05*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  const cy=H/2+30,bh=190,p=E.out(C.prog(t,.2,.85));
  // peeli patti: left se kheench kar
  ctx.save();ctx.globalAlpha=outA;
  ctx.font=C.font(110,900);const tw=ctx.measureText(title).width,nw=num?ctx.measureText(num).width+70:0,bw=Math.min(1700,Math.max(900,nw+tw+150)),x0=W/2-bw/2;
  const f=C.fitText(ctx,title,bw-nw-130,1,110,52,900);
  ctx.save();ctx.beginPath();ctx.rect(x0-20,cy-bh/2-20,(bw+40)*p,bh+40);ctx.clip();
  ctx.shadowColor='rgba(245,197,24,.55)';ctx.shadowBlur=40;ctx.fillStyle='#F5C518';ctx.beginPath();ctx.roundRect(x0,cy-bh/2,bw,bh,30);ctx.fill();ctx.shadowBlur=0;
  if(num){ctx.fillStyle='rgba(10,19,48,.14)';ctx.beginPath();ctx.roundRect(x0,cy-bh/2,nw+10,bh,30);ctx.fill();
    ctx.fillStyle='#10131f';ctx.font=C.font(120,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(num,x0+(nw+10)/2,cy+6);}
  ctx.fillStyle='#10131f';ctx.font=C.font(f.px,900);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x0+nw+50,cy+6);
  ctx.restore();
  // lock pill (upar)
  if(d.pill){const pa=E.out(C.prog(t,.9,1.4));if(pa>0){ctx.save();ctx.globalAlpha=pa*outA;ctx.font=C.font(46,800);const withL=d.lock!==false&&d.lock!=='false',lw=withL?60:0,pw=ctx.measureText(d.pill).width+lw+80,ph=96,py=cy-bh/2-90-(1-pa)*-20;
    ctx.fillStyle='rgba(10,19,48,.7)';ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(W/2-pw/2,py-ph/2,pw,ph,ph/2);ctx.fill();ctx.stroke();
    if(withL)lock(ctx,W/2-pw/2+58,py-9,1.15,'#F5C518');
    ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;ctx.fillText(d.pill,W/2-pw/2+40+lw,py+3);ctx.restore();}}
  ctx.restore();
 }};
})();
