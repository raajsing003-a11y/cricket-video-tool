// C113 (Y31 + Y32): do wide card.
// formula     (Y31): data:{title, name:'CTR', a:'क्लिक', op:'÷', b:'इम्प्रेशन', la:'थंबनेल' (a ke neeche label, optional), lb:'टाइटल' (b ke neeche), c:'y', bg} -> "CTR = क्लिक ÷ इम्प्रेशन" ek-ek aata hai, neeche 2 arrows se label
// beforeafter (Y32): data:{title, before:'पुराना तरीका', after:'नया तरीका', bi:'asset path', ai:'asset path' (optional images), bl:'पहले', al:'बाद में', bar:60 (0-100, optional; neeche laal progress bar), barlabel:'', bg} -> laal X BEFORE | hara tick AFTER
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw)=>{ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.shadowBlur=0;};
const S=v=>v==null?'':String(v).trim();
C.CARDS.formula={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  const items=[{t:S(d.name),k:'n'},{t:'=',k:'s'},{t:S(d.a),k:'a'},{t:S(d.op)||'÷',k:'s'},{t:S(d.b),k:'b'}].filter(o=>o.t);
  const bh=190,gap=40,cy=H/2+(d.title?10:0)-60;ctx.save();ctx.globalAlpha=outA;ctx.font=C.font(80,900);
  let fs=80;const meas=px=>{ctx.font=C.font(px,900);return items.map(o=>o.k==='s'?ctx.measureText(o.t).width+10:ctx.measureText(o.t).width+110);};let ws=meas(fs);const avail=W-200;
  while(fs>40&&ws.reduce((a,b)=>a+b,0)+gap*(items.length-1)>avail){fs-=4;ws=meas(fs);}
  const tot=ws.reduce((a,b)=>a+b,0)+gap*(items.length-1);let x=W/2-tot/2;const pos={};
  items.forEach((o,i)=>{const a=.3+i*.4,p=E.out(C.prog(t,a,a+.45)),w=ws[i];if(p>0){ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x+w/2,cy+(1-p)*30);ctx.font=C.font(fs,900);ctx.textAlign='center';ctx.textBaseline='middle';
    if(o.k==='s'){ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;ctx.fillText(o.t,0,4);}
    else{panel(ctx,-w/2,-bh/2,w,bh,o.k==='n'?col:'#6fa8ff',40,.85,o.k==='n'?6:4);ctx.fillStyle=o.k==='n'?col:'#fff';ctx.fillText(o.t,0,4);}ctx.restore();}
   pos[o.k+i]=[x+w/2,w];x+=w+gap;});
  [['a',d.la],['b',d.lb]].forEach(([k,l],j)=>{if(!l)return;const key=Object.keys(pos).find(q=>q[0]===k);if(!key)return;const a=.3+items.length*.4+.2+j*.4,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const px=pos[key][0],y0=cy+bh/2+20;
   ctx.save();ctx.globalAlpha=outA*p;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=7;ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(px,y0);ctx.lineTo(px,y0+90*p);ctx.stroke();ctx.beginPath();ctx.moveTo(px-18,y0+90*p-4);ctx.lineTo(px+18,y0+90*p-4);ctx.lineTo(px,y0+90*p+22);ctx.fill();ctx.shadowBlur=0;
   const f=C.fitText(ctx,String(l),520,1,54,28,800),hh=96,ww=Math.min(560,ctx.measureText(f.lines[0]).width+90);ctx.font=C.font(f.px,800);const w2=ctx.measureText(f.lines[0]).width+90;panel(ctx,px-w2/2,y0+120,w2,hh,col,hh/2,.85,3);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],px,y0+120+hh/2+2);ctx.restore();});
  ctx.restore();}};
C.CARDS.beforeafter={assets:d=>{const k=[d.bg||BG,VG];if(d.bi)k.push(d.bi);if(d.ai)k.push(d.ai);return k;},
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),hasBar=d.bar!=null&&d.bar!==''&&isFinite(+d.bar);
  const pw=800,ph=hasBar?500:620,gap=80,top=(d.title?200:140),sides=[{k:'b',txt:S(d.before),im:d.bi,lab:S(d.bl)||'पहले',col:COL.r,x:W/2-pw-gap/2,a:.3},{k:'a',txt:S(d.after),im:d.ai,lab:S(d.al)||'बाद में',col:COL.g,x:W/2+gap/2,a:1.0}];
  ctx.save();ctx.globalAlpha=outA;
  sides.forEach(o=>{const p=E.out(C.prog(t,o.a,o.a+.5));if(p<=0)return;const y=top+(1-p)*40;ctx.save();ctx.globalAlpha=outA*p;panel(ctx,o.x,y,pw,ph,o.col,44,.8,6);
   const ih=ph-190;if(o.im&&C.img(o.im)){ctx.save();ctx.beginPath();ctx.roundRect(o.x+30,y+30,pw-60,ih,28);ctx.clip();C.cover(ctx,C.img(o.im),o.x+30,y+30,pw-60,ih,1);ctx.restore();}
   else if(o.txt){const f=C.fitText(ctx,o.txt,pw-100,3,80,36,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,o.x+pw/2,y+30+ih/2+(k-(f.lines.length-1)/2)*lh));}
   if(o.im&&o.txt){const f=C.fitText(ctx,o.txt,pw-100,1,46,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],o.x+pw/2,y+ph-95);}
   // badge (X ya tick) + label
   const bx=o.x+80,by=y+ph-(o.im&&o.txt?0:0)-60;ctx.restore();
   const bp=E.out(C.prog(t,o.a+.4,o.a+.9));if(bp>0){ctx.save();ctx.globalAlpha=outA*bp;ctx.translate(o.x+pw/2,y+ph+10);ctx.scale(.6+.4*bp,.6+.4*bp);ctx.fillStyle=o.col;ctx.shadowColor=o.col;ctx.shadowBlur=18;ctx.beginPath();ctx.roundRect(-190,-45,380,90,45);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='#fff';ctx.lineWidth=9;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(o.k==='b'){ctx.moveTo(-150,-16);ctx.lineTo(-118,16);ctx.moveTo(-118,-16);ctx.lineTo(-150,16);}else{ctx.moveTo(-154,0);ctx.lineTo(-136,16);ctx.lineTo(-108,-16);}ctx.stroke();
    ctx.fillStyle='#fff';ctx.font=C.font(48,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.lab,18,3);ctx.restore();}});
  if(hasBar){const ba=E.out(C.prog(t,1.8,2.3));if(ba>0){const bw=1200,bh=44,bx=W/2-bw/2,by=top+ph+130+(1-ba)*20,v=Math.max(0,Math.min(100,+d.bar))/100,g=E.out(C.prog(t,2.0,3.2));ctx.save();ctx.globalAlpha=outA*ba;ctx.fillStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,22);ctx.fill();
    ctx.fillStyle=COL.r;ctx.shadowColor=COL.r;ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(bx,by,Math.max(bh,bw*v*g),bh,22);ctx.fill();ctx.shadowBlur=0;if(d.barlabel){const f=C.fitText(ctx,String(d.barlabel),bw,1,46,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,by+bh+50);}ctx.restore();}}
  ctx.restore();}};
})();
