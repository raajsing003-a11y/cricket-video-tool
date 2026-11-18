// C107 (Y17): stat2 card (wide) — do bade number card (count-up) + neeche pill.
// stat2: data:{title, n1:1000, l1:'लेबल', n2:4000, l2:'लेबल', p1:'₹' (prefix), s1:'' (suffix), p2, s2, c1:'g', c2:'y' (y/g/r/b), pill:'', mid:'→' (do card ke beech chinh, optional), bg}
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',w:'#ffffff'};
C.fmtNum=(v,dec)=>{const n=+v;if(!isFinite(n))return String(v);const s=Math.abs(n).toFixed(dec||0).split('.');s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return(n<0?'-':'')+s.join('.');};
C.CARDS.stat2={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,outA=1-E.in(C.prog(t,dur-.3,dur));
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp*outA;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const cards=[{n:+d.n1,l:d.l1,p:d.p1,s:d.s1,c:COL[d.c1]||COL.g,a:.3},{n:+d.n2,l:d.l2,p:d.p2,s:d.s2,c:COL[d.c2]||COL.y,a:.8}],cw=740,ch=520,gap=d.mid?150:80,cy=H/2+(d.title?10:0)-(d.pill?40:0);
  ctx.save();ctx.globalAlpha=outA;
  cards.forEach((o,i)=>{const p=E.out(C.prog(t,o.a,o.a+.5));if(p<=0)return;const x=W/2+(i?1:-1)*(cw/2+gap/2),y=cy+(1-p)*50,dec=(String(i?d.n2:d.n1).split('.')[1]||'').length,cp=E.out(C.prog(t,o.a+.3,o.a+1.5));
    ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x,y);ctx.fillStyle='rgba(10,19,48,.72)';ctx.strokeStyle=o.c;ctx.lineWidth=5;ctx.shadowColor=o.c;ctx.shadowBlur=26;ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,40);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    const txt=(o.p?String(o.p):'')+C.fmtNum(isFinite(o.n)?o.n*cp:0,dec)+(o.s?String(o.s):'');
    let px=190;ctx.font=C.font(px,900);const fw=ctx.measureText(C.fmtNum(isFinite(o.n)?o.n:0,dec)+(o.p||'')+(o.s||'')).width;if(fw>cw-70)px=Math.floor(px*(cw-70)/fw);
    ctx.font=C.font(px,900);ctx.fillStyle=o.c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=o.c;ctx.shadowBlur=22;ctx.fillText(txt,0,-30);ctx.shadowBlur=0;
    if(o.l){const f=C.fitText(ctx,String(o.l),cw-80,2,56,32,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;const lh=Math.round(f.px*1.2),y0=110-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,0,y0+k*lh));}
    ctx.restore();});
  if(d.mid){const mp=E.out(C.prog(t,.9,1.4));ctx.save();ctx.globalAlpha=outA*mp;ctx.font=C.font(110,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;ctx.fillText(String(d.mid),W/2,cy-10);ctx.restore();}
  if(d.pill){const pa=E.out(C.prog(t,1.6,2.1));if(pa>0){ctx.save();ctx.globalAlpha=outA*pa;ctx.font=C.font(48,800);const s=String(d.pill),w=ctx.measureText(s).width+110,h=94,y=cy+ch/2+110+(1-pa)*20;
    ctx.fillStyle='rgba(10,19,48,.82)';ctx.strokeStyle=COL.y;ctx.lineWidth=3;ctx.shadowColor=COL.y;ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(W/2-w/2,y-h/2,w,h,h/2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=COL.y;ctx.beginPath();ctx.arc(W/2-w/2+44,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(s,W/2-w/2+70,y+2);ctx.restore();}}
  ctx.restore();
 }};
})();
