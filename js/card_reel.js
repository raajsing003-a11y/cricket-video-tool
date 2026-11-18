// C115 (Y29 + Y33): do wide card.
// reel   (Y29): data:{title, n:4.4 (count-up number) ya big:'४.४M' (seedha text), unit:'M' (n ke baad), label:'व्यूज़', gauge:2 (0-100, optional), glabel:'2%' (gauge ke beech text, default gauge+'%'), gl:'देखने वाले' (gauge ke neeche), c:'y', bg} -> reel-style phone + bada number box + gauge
// phones (Y33): data:{title, a:'text', b:'text' (phone screen ka text), ia:'asset', ib:'asset' (optional image), la:'फ़ोन', lb:'कंप्यूटर' (phone ke neeche label), hl:1|2 (peela border), caption:'ज़्यादातर लोग फ़ोन पर देखते हैं' (neeche pill), c:'y', bg} -> do phone side-by-side
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const S=v=>v==null?'':String(v).trim(),isN=v=>v!=null&&v!==''&&isFinite(+v);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a,lw)=>{ctx.save();ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.restore();};
function frame(ctx,px,py,pw,ph,edge,glow){ctx.save();ctx.fillStyle='rgba(10,19,48,.92)';ctx.strokeStyle=edge;ctx.lineWidth=glow?7:4;ctx.shadowColor=edge;ctx.shadowBlur=glow?30:16;ctx.beginPath();ctx.roundRect(px,py,pw,ph,60);ctx.fill();ctx.stroke();ctx.restore();}
function msg(ctx,txt){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(txt,C.W/2,C.H/2);ctx.restore();}
// ---- Y29 reel
C.CARDS.reel={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),hasN=isN(d.n),big=S(d.big),hasG=isN(d.gauge);
  if(!hasN&&!big){msg(ctx,'n ya big do');return;}
  const cy=H/2+(d.title?40:0),pw=450,ph=800,px=W/2-pw-110,pp=E.out(C.prog(t,.2,.8)),py=cy-ph/2+(1-pp)*60;
  ctx.save();ctx.globalAlpha=outA;
  if(pp>0){ctx.save();ctx.globalAlpha=outA*pp;frame(ctx,px,py,pw,ph,'#9aa8c8');const sx=px+22,sy=py+22,sw=pw-44,sh=ph-44;ctx.save();ctx.beginPath();ctx.roundRect(sx,sy,sw,sh,42);ctx.clip();
    const g=ctx.createLinearGradient(0,sy,0,sy+sh);g.addColorStop(0,'#17294f');g.addColorStop(1,'#0b1226');ctx.fillStyle=g;ctx.fillRect(sx,sy,sw,sh);
    const pr=1+.06*Math.sin(t*3);ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();const cx=sx+sw/2-30,cc=sy+sh/2-50,r=62*pr;ctx.moveTo(cx-r*.6,cc-r);ctx.lineTo(cx+r,cc);ctx.lineTo(cx-r*.6,cc+r);ctx.closePath();ctx.fill();
    [0,1,2].forEach(i=>{const y=sy+sh-250+i*70,cs=['#ff4d6d','#6fa8ff','#fff'][i];ctx.fillStyle=cs;ctx.globalAlpha=outA*pp*.9;ctx.beginPath();ctx.arc(sx+sw-52,y,24,0,Math.PI*2);ctx.fill();ctx.globalAlpha=outA*pp;});
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.roundRect(sx+30,sy+sh-130,230,18,9);ctx.fill();ctx.beginPath();ctx.roundRect(sx+30,sy+sh-96,160,16,8);ctx.fill();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(sx+56,sy+sh-170,22,0,Math.PI*2);ctx.fill();
    const prog=((t*.12)%1);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(sx,sy+sh-14,sw,14);ctx.fillStyle=col;ctx.fillRect(sx,sy+sh-14,sw*prog,14);
    ctx.restore();ctx.fillStyle='#000';ctx.beginPath();ctx.roundRect(px+pw/2-70,py+30,140,30,15);ctx.fill();ctx.restore();}
  const bw=760,bh=hasG?300:420,gh=hasG?400:0,tot=bh+(hasG?40+gh:0),bx=W/2+40,by0=cy-tot/2;
  const bp=E.out(C.prog(t,1.0,1.6)),cp=E.out(C.prog(t,1.3,2.5));
  if(bp>0){const by=by0+(1-bp)*40;ctx.save();ctx.globalAlpha=outA*bp;panel(ctx,bx,by,bw,bh,col,44);
    if(d.label){const f=C.fitText(ctx,String(d.label),bw-60,1,56,30,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#b8c4e0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],bx+bw/2,by+62);}
    const dd=(String(d.n).split('.')[1]||'').length,txt=hasN?(C.fmtNum?C.fmtNum(+d.n*cp,dd):(+d.n*cp).toFixed(dd))+S(d.unit):big;let fs=190;ctx.font=C.font(fs,900);const fw=ctx.measureText(hasN?(C.fmtNum?C.fmtNum(+d.n,dd):String(+d.n))+S(d.unit):big).width;if(fw>bw-70)fs=Math.floor(fs*(bw-70)/fw);
    ctx.font=C.font(fs,900);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=24;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,bx+bw/2,by+(d.label?(hasG?205:bh/2+55):bh/2));ctx.restore();}
  if(hasG){const gp=E.out(C.prog(t,2.0,2.6)),ga=E.out(C.prog(t,2.2,3.4));if(gp>0){const gy=by0+bh+40+(1-gp)*30,gv=Math.max(0,Math.min(100,+d.gauge))/100;ctx.save();ctx.globalAlpha=outA*gp;panel(ctx,bx,gy,bw,gh,col,44);
    const gx=bx+bw/2,gc=gy+gh-120,R=190;ctx.lineCap='round';ctx.lineWidth=40;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.arc(gx,gc,R,Math.PI,2*Math.PI);ctx.stroke();
    ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(gx,gc,R,Math.PI,Math.PI+Math.PI*Math.max(.01,gv*ga));ctx.stroke();ctx.shadowBlur=0;
    const gt=S(d.glabel)||(Math.round(+d.gauge*ga)+'%');ctx.font=C.font(88,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S(d.glabel)||(Math.round(+d.gauge*ga)+'%'),gx,gc-30);
    if(d.gl){const f=C.fitText(ctx,String(d.gl),bw-80,1,48,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#b8c4e0';ctx.fillText(f.lines[0],gx,gc+75);}ctx.restore();}}
  ctx.restore();}};
// ---- Y33 phones
C.CARDS.phones={assets:d=>{const k=[d.bg||BG,VG];if(d.ia)k.push(d.ia);if(d.ib)k.push(d.ib);return k;},
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),cap=S(d.caption),hl=Math.round(+d.hl)||0;
  const sides=[{k:'a',txt:S(d.a),im:d.ia,lab:S(d.la),x:W/2-500-80,a:.25},{k:'b',txt:S(d.b),im:d.ib,lab:S(d.lb),x:W/2+80,a:.65}];
  if(!sides.some(o=>o.txt||o.im)){msg(ctx,'a ya b (text/image) do');return;}
  const hasLab=!!(S(d.la)||S(d.lb)),pw=500,ph=cap?(hasLab?600:690):(hasLab?700:760),top=(d.title?170:110);
  ctx.save();ctx.globalAlpha=outA;
  sides.forEach((o,i)=>{const p=E.out(C.prog(t,o.a,o.a+.6));if(p<=0)return;const px=o.x,py=top+(1-p)*60,isH=hl===i+1;ctx.save();ctx.globalAlpha=outA*p;frame(ctx,px,py,pw,ph,isH?col:'#9aa8c8',isH);
   const sx=px+22,sy=py+22,sw=pw-44,sh=ph-44;ctx.save();ctx.beginPath();ctx.roundRect(sx,sy,sw,sh,42);ctx.clip();ctx.fillStyle='#0b1226';ctx.fillRect(sx,sy,sw,sh);
   if(o.im&&C.img(o.im))C.cover(ctx,C.img(o.im),sx,sy,sw,sh,1);
   if(o.txt){const f=C.fitText(ctx,o.txt,sw-70,4,76,32,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=10;const lh=f.px*1.22,yy=o.im?sy+sh-90-(f.lines.length-1)*lh:sy+sh/2-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,sx+sw/2,yy+k*lh));}
   ctx.restore();ctx.fillStyle='#000';ctx.beginPath();ctx.roundRect(px+pw/2-70,py+30,140,30,15);ctx.fill();
   if(o.lab){const lp=E.out(C.prog(t,o.a+.5,o.a+1));ctx.globalAlpha=outA*lp;ctx.font=C.font(52,800);const w=ctx.measureText(o.lab).width+90,h=92,y=py+ph+30;panel(ctx,px+pw/2-w/2,y,w,h,isH?col:'#6fa8ff',h/2,.85,3);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.lab,px+pw/2,y+h/2+3);}
   ctx.restore();});
  if(cap){const cp=E.out(C.prog(t,1.5,2.0));if(cp>0){ctx.save();ctx.globalAlpha=outA*cp;const f=C.fitText(ctx,cap,1500,1,54,30,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+120,h=104,y=H-95+(1-cp)*20;panel(ctx,W/2-w/2,y-h/2,w,h,col,h/2,.85,4);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,y+3);ctx.restore();}}
  ctx.restore();}};
})();
