// C111 (Y11 + Y2 + Y4): teen wide card.
// market   (Y11): data:{title, tiles:['लेबल|y', ...](2-12; rang y/g/r/b/p), pills:['करोड़ों वीडियो|y','करोड़ों दर्शक|g'] (0-2), c, bg} -> rangeen tile grid ek-ek pop + neeche pills
// comments (Y2) : data:{title, items:['नाम|कमेंट', ...](2-4), hl:2 (1 se, peela border), pill:'सबसे आम सवाल', c, bg} -> comment cards halke tilt mein, hl wala seedha+bada
// timeline (Y4) : data:{title, points:['2018','2020','2024'] (2-6), at:3 (1 se; dot yahan tak slide), label:'हम यहाँ', c, bg} -> line par dot slide
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',p:'#b266ff'};
const parts=s=>String(s).split('|').map(x=>x.trim()),arr=a=>(Array.isArray(a)?a:[]).filter(v=>v!=null&&String(v).trim());
C.marketTiles=d=>arr(d.tiles).slice(0,12).map(s=>{const a=parts(s);return{t:a[0],c:COL[a[1]]?a[1]:'b'};});
C.marketPills=d=>arr(d.pills).slice(0,2).map(s=>{const a=parts(s);return{t:a[0],c:COL[a[1]]?a[1]:'y'};});
C.cmtItems=d=>arr(d.items).slice(0,4).map(s=>{const a=parts(s);return{n:a[0],t:a.slice(1).join('|')};});
C.tlPoints=d=>arr(d.points).slice(0,6).map(String);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw)=>{ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.shadowBlur=0;};
function pill(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;ctx.font=C.font(fs,800);const w=ctx.measureText(txt).width+110,h=fs*1.9;panel(ctx,x-w/2,y-h/2,w,h,col,h/2,.82,3);
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-w/2+42,y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,x-w/2+66,y+2);ctx.restore();return w;}
C.CARDS.market={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,tl=C.marketTiles(d),pl=C.marketPills(d),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),n=tl.length;if(!n)return;
  const cols=n>8?4:n>4?4:Math.min(n,4),rows=Math.ceil(n/cols),tw=360,th=n>8?170:210,gx=30,gy=30,gw=cols*tw+(cols-1)*gx,gh=rows*th+(rows-1)*gy,top=(d.title?190:120),wh=gh+80,ww=gw+80,wx=W/2-ww/2,wy=top;
  ctx.save();ctx.globalAlpha=outA;const wp=E.out(C.prog(t,.2,.6));ctx.globalAlpha=outA*wp;panel(ctx,wx,wy,ww,wh,'#6fa8ff',40,.6);
  ctx.fillStyle='rgba(255,255,255,.3)';[0,1,2].forEach(k=>{ctx.beginPath();ctx.arc(wx+44+k*30,wy+30,8,0,Math.PI*2);ctx.fill();});
  tl.forEach((o,i)=>{const a=.5+i*.12,p=E.out(C.prog(t,a,a+.4));if(p<=0)return;const x=wx+40+(i%cols)*(tw+gx),y=wy+50+Math.floor(i/cols)*(th+gy),col=COL[o.c];ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x+tw/2,y+th/2);ctx.scale(.85+.15*p,.85+.15*p);
   ctx.fillStyle=col;ctx.globalAlpha*=.88;ctx.shadowColor=col;ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-tw/2,-th/2,tw,th,26);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=outA*p;
   if(o.t){const f=C.fitText(ctx,String(o.t),tw-40,2,48,26,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#0a1330';ctx.textAlign='center';ctx.textBaseline='middle';const lh=f.px*1.15;f.lines.forEach((l,k)=>ctx.fillText(l,0,(k-(f.lines.length-1)/2)*lh));}ctx.restore();});
  ctx.restore();
  pl.forEach((o,i)=>{const a=.5+n*.12+.5+i*.3,p=E.out(C.prog(t,a,a+.5));if(p>0)pill(ctx,o.t,W/2+(pl.length>1?(i?1:-1)*(Math.min(W/4,520)):0),wy+wh+80+(1-p)*20,COL[o.c],outA*p,46);});}};
C.CARDS.comments={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.cmtItems(d),n=it.length,hl=Math.round(+d.hl)||0,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));if(!n)return;
  const cw=1200,ch=n>3?150:180,gap=24,top=(d.title?200:130),tot=n*ch+(n-1)*gap,col=COL[d.c]||COL.y,hp=E.out(C.prog(t,1.4+n*.3,2.1+n*.3));
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((o,i)=>{const a=.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const on=hl===i+1,k=on?hp:0,dim=hl&&!on?1-.45*hp:1,y=top+i*(ch+gap)+(1-p)*40,sk=(1-k)*(-.06);
   ctx.save();ctx.globalAlpha=outA*p*dim;ctx.translate(W/2,y+ch/2);ctx.transform(1,0,sk*(i%2?-1:1),1,0,0);const s=1+.04*k;ctx.scale(s,s);panel(ctx,-cw/2,-ch/2,cw,ch,on&&k>0?col:'#6fa8ff',32,.8,on&&k>0?7:3);
   ctx.beginPath();ctx.arc(-cw/2+90,0,44,0,Math.PI*2);ctx.fillStyle=['#6fa8ff','#2ecc71','#F5C518','#ff7a59'][i%4];ctx.fill();ctx.fillStyle='#0a1330';ctx.font=C.font(50,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((o.n||'?').charAt(0),-cw/2+90,3);
   ctx.textAlign='left';ctx.font=C.font(34,800);ctx.fillStyle='#b8c4e0';ctx.fillText(o.n||'',-cw/2+160,-ch/2+42);const f=C.fitText(ctx,String(o.t||''),cw-230,2,46,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';f.lines.forEach((l,j)=>ctx.fillText(l,-cw/2+160,-ch/2+90+j*f.px*1.2));ctx.restore();});
  if(d.pill){const pa=E.out(C.prog(t,2.2+n*.3,2.7+n*.3));if(pa>0)pill(ctx,String(d.pill),W/2,top+tot+90+(1-pa)*20,col,outA*pa,48);}
  ctx.restore();}};
C.CARDS.timeline={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,pts=C.tlPoints(d),n=pts.length,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.y;if(n<2)return;
  const at=Math.max(1,Math.min(n,Math.round(+d.at)||n)),x0=260,x1=W-260,y=H/2+(d.title?30:0),lp=E.out(C.prog(t,.2,.9)),sl=E.out(C.prog(t,1.0,2.6)),px=i=>x0+(x1-x0)*i/(n-1);
  ctx.save();ctx.globalAlpha=outA;ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+(x1-x0)*lp,y);ctx.stroke();
  const dx=px(0)+(px(at-1)-px(0))*sl;ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(dx,y);ctx.stroke();ctx.shadowBlur=0;
  pts.forEach((s,i)=>{const p=E.out(C.prog(t,.3+i*.1,.8+i*.1)),reached=dx>=px(i)-2;ctx.save();ctx.globalAlpha=outA*p;ctx.fillStyle=reached?col:'#33415f';ctx.beginPath();ctx.arc(px(i),y,18,0,Math.PI*2);ctx.fill();
   const f=C.fitText(ctx,s,(x1-x0)/(n-1)-30,1,64,30,900);ctx.font=C.font(f.px,900);ctx.fillStyle=reached?'#fff':'#8a97b8';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],px(i),y+80);ctx.restore();});
  const dp=E.out(C.prog(t,.8,1.2));ctx.save();ctx.globalAlpha=outA*dp;ctx.fillStyle='#fff';ctx.strokeStyle=col;ctx.lineWidth=10;ctx.shadowColor=col;ctx.shadowBlur=26;ctx.beginPath();ctx.arc(dx,y,34,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  if(d.label){const la=E.out(C.prog(t,2.5,3));if(la>0)pill(ctx,String(d.label),dx,y-130+(1-la)*15,col,outA*la,48);}
  ctx.restore();}};
})();
