// C112 (Y22 + Y30): do wide card.
// hub    (Y22): data:{title, center:'मुख्य', spokes:['ऐप','फ़ोरम',...](2-8), note:'' (neeche pill), c:'y', bg} -> beech mein bada node, spokes ek-ek line se judte
// search (Y30): data:{title, text:'शमी राजस्थान', results:['लाइन 1','लाइन 2'] (0-3), pill:'', c:'y', bg} -> search bar mein typewriter, phir results
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const arr=a=>(Array.isArray(a)?a:[]).filter(v=>v!=null&&String(v).trim()).map(v=>String(v).trim());
C.hubSpokes=d=>arr(d.spokes).slice(0,8);C.searchRes=d=>arr(d.results).slice(0,3);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw)=>{ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.shadowBlur=0;};
function pill(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;ctx.font=C.font(fs,800);const w=ctx.measureText(txt).width+110,h=fs*1.9;panel(ctx,x-w/2,y-h/2,w,h,col,h/2,.82,3);
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-w/2+42,y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,x-w/2+66,y+2);ctx.restore();}
C.CARDS.hub={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,sp=C.hubSpokes(d),n=sp.length,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.y;if(!n)return;
  const cx=W/2,cy=H/2+(d.title?35:0)-(d.note?25:0),rx=n>6?700:620,ry=n>6?330:300,pos=sp.map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
  ctx.save();ctx.globalAlpha=outA;
  pos.forEach((p,i)=>{const a=.9+i*.2,lp=E.out(C.prog(t,a,a+.4));if(lp<=0)return;ctx.strokeStyle=col;ctx.globalAlpha=outA*.7;ctx.lineWidth=5;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+(p[0]-cx)*lp,cy+(p[1]-cy)*lp);ctx.stroke();ctx.shadowBlur=0;});
  pos.forEach((p,i)=>{const a=1.1+i*.2,np=E.out(C.prog(t,a,a+.4));if(np<=0)return;ctx.save();ctx.globalAlpha=outA*np;ctx.translate(p[0],p[1]);ctx.scale(.8+.2*np,.8+.2*np);
   ctx.font=C.font(40,800);const f=C.fitText(ctx,sp[i],300,1,42,26,800),w=Math.min(340,ctx.measureText(f.lines[0]).width+60);ctx.font=C.font(f.px,800);const ww=Math.max(180,ctx.measureText(f.lines[0]).width+60);panel(ctx,-ww/2,-45,ww,90,'#6fa8ff',45,.9,3);
   ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,3);ctx.restore();});
  const hp=E.out(C.prog(t,.3,.9));if(hp>0){ctx.save();ctx.globalAlpha=outA*hp;ctx.translate(cx,cy);ctx.scale(.8+.2*hp,.8+.2*hp);const hw=440,hh=190;panel(ctx,-hw/2,-hh/2,hw,hh,col,50,.92,6);
   const f=C.fitText(ctx,String(d.center||''),hw-50,2,70,32,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';const lh=f.px*1.15;f.lines.forEach((l,k)=>ctx.fillText(l,0,(k-(f.lines.length-1)/2)*lh+3));ctx.restore();}
  if(d.note){const pa=E.out(C.prog(t,1.2+n*.2+.4,1.8+n*.2+.4));if(pa>0)pill(ctx,String(d.note),W/2,H-80+(1-pa)*15,col,outA*pa,46);}
  ctx.restore();}};
C.CARDS.search={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),txt=String(d.text||''),res=C.searchRes(d),
  bw=1300,bh=150,bx=W/2-bw/2,by=(d.title?250:200),bp=E.out(C.prog(t,.2,.7)),ty=.9,tdur=Math.max(.8,Math.min(3,txt.length*.12)),k=Math.floor(txt.length*E.clamp((t-ty)/tdur));
  ctx.save();ctx.globalAlpha=outA;ctx.globalAlpha=outA*bp;const yy=by+(1-bp)*30;panel(ctx,bx,yy,bw,bh,col,bh/2,.9,6);
  ctx.strokeStyle='#b8c4e0';ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.arc(bx+95,yy+bh/2-6,26,0,Math.PI*2);ctx.moveTo(bx+114,yy+bh/2+13);ctx.lineTo(bx+136,yy+bh/2+35);ctx.stroke();
  ctx.font=C.font(70,800);ctx.textAlign='left';ctx.textBaseline='middle';const sh=[...txt].slice(0,k).join(''),f=C.fitText(ctx,txt||' ',bw-300,1,70,36,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.fillText(sh,bx+175,yy+bh/2+3);
  if(Math.floor(t*2)%2===0||k<txt.length){const w=ctx.measureText(sh).width;ctx.fillStyle=col;ctx.fillRect(bx+175+w+6,yy+bh/2-42,6,84);}
  ctx.restore();
  const rs=ty+tdur+.3;res.forEach((s,i)=>{const a=rs+i*.3,p=E.out(C.prog(t,a,a+.45));if(p<=0)return;ctx.save();ctx.globalAlpha=outA*p;const y=by+bh+50+i*130+(1-p)*30;panel(ctx,bx+40,y,bw-80,100,'#6fa8ff',30,.75,3);
   ctx.fillStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.arc(bx+100,y+50,24,0,Math.PI*2);ctx.fill();const g=C.fitText(ctx,s,bw-300,1,46,28,700);ctx.font=C.font(g.px,700);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(g.lines[0],bx+150,y+53);ctx.restore();});
  if(d.pill){const pa=E.out(C.prog(t,rs+res.length*.3+.3,rs+res.length*.3+.8));if(pa>0)pill(ctx,String(d.pill),W/2,H-90+(1-pa)*15,col,outA*pa,46);}}};
})();
