// C100 (Y19 + Y20): do wide card.
// bigwords : data:{a:'CTR', b:'Watch time', join:'+' (ya 'vs','&'), pills:['चैप्टर 1','चैप्टर 2'] (0-3), title, ca:'y', cb:'g', bg}  -> do bade shabd pop-in + beech mein join + neeche numbered pills
// qcards   : data:{title, qs:['सवाल 1','सवाल 2','सवाल 3'] (2-3), hl:2 (1 se, optional), bg}  -> numbered glass cards ek-ek karke, hl wala peela border
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',w:'#ffffff'};
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,d.title,1600,1,84,44,900);C.text(ctx,f.lines[0],W/2,110+24*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
C.CARDS.bigwords={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  base(ctx,t,d,sc);const W=C.W,H=C.H,A=String(d.a||''),B=String(d.b||''),J=String(d.join==null?'+':d.join),pills=(Array.isArray(d.pills)?d.pills:[]).filter(x=>x!=null&&String(x).trim()).slice(0,3),
    cy=pills.length?H/2-70:H/2,ca=COL[d.ca]||COL.y,cb=COL[d.cb]||COL.g,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  ctx.save();ctx.globalAlpha=outA;ctx.textBaseline='middle';
  let px=230;ctx.font=C.font(px,900);const jw=J?150:60;
  while(px>90&&ctx.measureText(A).width+ctx.measureText(B).width+jw+200>W-160){px-=10;ctx.font=C.font(px,900);}
  const aw=ctx.measureText(A).width,bw=ctx.measureText(B).width,tot=aw+bw+jw,x0=W/2-tot/2;
  [[A,x0,ca,.2],[B,x0+aw+jw,cb,.7]].forEach(([s,x,c,a])=>{const p=E.back(C.prog(t,a,a+.55));if(p<=0)return;ctx.save();ctx.translate(x+ctx.measureText(s).width/2,cy);ctx.scale(Math.max(.01,p),Math.max(.01,p));
    ctx.font=C.font(px,900);ctx.textAlign='center';ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=24;ctx.fillText(s,0,0);ctx.shadowBlur=0;ctx.restore();});
  if(J){const jp=E.out(C.prog(t,.55,.95));ctx.save();ctx.globalAlpha=jp*outA;ctx.font=C.font(Math.round(px*.55),900);ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.85)';ctx.fillText(J,x0+aw+jw/2,cy);ctx.restore();}
  // pills
  const pn=pills.length;if(pn){ctx.font=C.font(46,800);const ws=pills.map(s=>ctx.measureText(String(s)).width+170),gap=36,tw=ws.reduce((a,b)=>a+b,0)+gap*(pn-1),sk=Math.min(1,(W-160)/tw);let x=W/2-tw*sk/2;
    pills.forEach((s,i)=>{const a=1.3+i*.2,p=E.out(C.prog(t,a,a+.45));const w=ws[i]*sk;if(p>0){ctx.save();ctx.globalAlpha=p*outA;ctx.translate(x+w/2,cy+px*.62+90+(1-p)*18);ctx.scale(sk,sk);const ww=ws[i],ph=100;
      ctx.fillStyle='rgba(10,19,48,.7)';ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-ww/2,-ph/2,ww,ph,ph/2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#F5C518';ctx.beginPath();ctx.arc(-ww/2+58,0,30,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.font=C.font(36,900);ctx.textAlign='center';ctx.fillText(String(i+1),-ww/2+58,2);
      ctx.fillStyle='#fff';ctx.font=C.font(46,800);ctx.textAlign='left';ctx.fillText(String(s),-ww/2+110,3);ctx.restore();}x+=w+gap*sk;});}
  ctx.restore();
 }};
C.CARDS.qcards={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  base(ctx,t,d,sc);const W=C.W,H=C.H,qs=(Array.isArray(d.qs)?d.qs:[]).filter(x=>x!=null&&String(x).trim()).slice(0,3),n=qs.length,hl=Math.round(+d.hl)||0;
  if(n<2){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('qs mein kam se kam 2 sawal do',W/2,H/2);ctx.restore();return;}
  const cw=n===3?520:700,ch=520,gap=50,tw=n*cw+(n-1)*gap,x0=W/2-tw/2,cy=H/2+(d.title?50:0),hT=.4+n*.35+.3;
  for(let i=0;i<n;i++){const a=.35+i*.35,p=E.out(C.prog(t,a,a+.55));if(p<=0)continue;const isH=hl===i+1,hp=isH?E.out(C.prog(t,hT,hT+.5)):0,x=x0+i*(cw+gap)+cw/2,y=cy+(1-p)*60;
    ctx.save();ctx.globalAlpha=p;ctx.translate(x,y);ctx.scale(1+.04*hp,1+.04*hp);
    ctx.fillStyle=isH?'rgba(40,36,10,.7)':'rgba(10,19,48,.66)';ctx.strokeStyle=isH?'rgba(245,197,24,'+(.4+.6*hp)+')':'rgba(255,255,255,.24)';ctx.lineWidth=isH?6:2;
    if(isH){ctx.shadowColor='#F5C518';ctx.shadowBlur=30*hp;}ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,36);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=isH?'#F5C518':'#6fa8ff';ctx.beginPath();ctx.arc(0,-ch/2+10,56,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#10131f';ctx.font=C.font(66,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),0,-ch/2+14);
    const f=C.fitText(ctx,String(qs[i]),cw-70,4,64,34,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;
    const lh=Math.round(f.px*1.3),y0=10-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,0,y0+k*lh));ctx.restore();}
 }};
})();
