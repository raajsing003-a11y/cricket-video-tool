// C14: polish — new transitions (glitch, flash, slideup) + global finishing layer (scene punch, vignette, grain, light sweep, fade in/out)
// CORE.POLISH.on=false se band. Captions iske baad load hote hain, isliye captions in effects se untouched rehte hain.
(function(){const C=window.CORE,E=C.ease;let W=C.W,H=C.H;
C.TRANS_ASSETS.glitch=[];C.TRANS_ASSETS.flash=[];C.TRANS_ASSETS.slideup=[];
const rnd=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
// glitch: slices shift + RGB ghost, B takes over at middle
C.TRANS.glitch=(ctx,A,B,p)=>{
  const src=p<.5?A:B,sp=Math.sin(p*Math.PI),f=Math.floor(p*24);
  ctx.drawImage(src,0,0);
  for(let i=0;i<9;i++){const y=Math.floor(rnd(f*9+i)*H*.9),h=40+Math.floor(rnd(f*9+i+50)*160),dx=(rnd(f*9+i+99)-.5)*220*sp;
    ctx.drawImage(src,0,y,W,h,dx,y,W,h);}
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.28*sp;
  ctx.drawImage(src,-26*sp,0);ctx.globalAlpha=.2*sp;ctx.drawImage(src,26*sp,6*sp);ctx.restore();
  ctx.save();ctx.globalAlpha=.10*sp;ctx.fillStyle='#0ff';ctx.fillRect(0,Math.floor(rnd(f+7)*H),W,6);ctx.restore();
};
// flash: quick white-hot cut
C.TRANS.flash=(ctx,A,B,p)=>{
  ctx.drawImage(p<.45?A:B,0,0);
  const fl=Math.max(0,1-Math.abs(p-.45)*4.2);
  if(fl>0){ctx.save();ctx.globalAlpha=Math.min(1,fl*1.1);ctx.fillStyle='#fff6d6';ctx.fillRect(0,0,W,H);ctx.restore();}
};
// slideup: B pushes up from bottom over A, A drifts up + darkens, soft shadow edge
C.TRANS.slideup=(ctx,A,B,p)=>{
  const q=E.io(p),y=H*(1-q);
  ctx.drawImage(A,0,-H*.25*q);
  ctx.save();ctx.fillStyle='rgba(0,0,0,'+(.55*q)+')';ctx.fillRect(0,0,W,H);ctx.restore();
  ctx.save();const g=ctx.createLinearGradient(0,y-80,0,y);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.5)');
  ctx.fillStyle=g;ctx.fillRect(0,y-80,W,80);ctx.restore();
  ctx.drawImage(B,0,y);
};
// ---------- global finishing ----------
const P={on:true,punch:true,vignette:.55,grain:.07,sweep:.07,fade:.35,shake:1,leak:.22,smoke:.10,dust:1};
C.POLISH=P;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const buf=mk(W,H),bx=buf.getContext('2d');
const vg=mk(W,H);function mkVg(){vg.width=W;vg.height=H;const g=vg.getContext('2d'),r=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.45,W/2,H/2,(W>H?H*1.0:Math.max(W,H)*.62));r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle=r;g.fillRect(0,0,W,H);}mkVg();
C.onFormat.push(()=>{W=C.W;H=C.H;buf.width=W;buf.height=H;mkVg();});
const nz=mk(256,256);{const g=nz.getContext('2d'),d=g.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=Math.floor(rnd(i*.37)*255);d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}g.putImageData(d,0,0);}
let npat=null;
const LK='08_gemini_generated/fx/fx_light_leaks_black',SM='08_gemini_generated/fx/fx_smoke_black';
const _pre2=C.preload;C.preload=async function(sc,o){await Promise.all([C.load(LK),C.load(SM)]);return _pre2.call(C,sc,o);};
const spr=mk(48,48);{const g=spr.getContext('2d'),r=g.createRadialGradient(24,24,0,24,24,24);r.addColorStop(0,'rgba(255,236,170,1)');r.addColorStop(.25,'rgba(255,200,90,.55)');r.addColorStop(1,'rgba(255,160,40,0)');g.fillStyle=r;g.fillRect(0,0,48,48);}
const base=C.render;
C.render=function(ctx,t){
  if(!P.on||!C.scenes.length){base(ctx,t);return;}
  // camera: scene-start punch + gentle handheld drift (frame ko 1.2% bada karke edges chhupaye)
  let z=1.012;
  if(P.punch){let i=-1;C.starts.forEach((s,k)=>{if(t>=s)i=k;});
    if(i>0&&C.scenes[i].tr!=='zoom'&&C.scenes[i].tr!=='whip'){const lt=t-C.starts[i];z+=.04*(1-E.out(C.prog(lt,0,.45)));}}
  const sh=P.shake,dx=sh*(Math.sin(t*1.7)*3+Math.sin(t*3.1)*1.5),dy=sh*Math.cos(t*1.3)*2.5,rot=sh*Math.sin(t*.9)*.0025;
  bx.clearRect(0,0,W,H);base(bx,t);
  ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.translate(W/2+dx,H/2+dy);ctx.rotate(rot);ctx.scale(z,z);ctx.drawImage(buf,-W/2,-H/2);ctx.restore();
  const f=Math.round(t*C.FPS);
  // smoke + light leaks (screen)
  {const sm=C.img(SM),lk=C.img(LK);
   if(sm&&P.smoke>0){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=P.smoke;C.cover(ctx,sm,0,0,W,H,1.25,Math.sin(t*.35)*90,Math.cos(t*.27)*40);ctx.restore();}
   if(lk&&P.leak>0){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=P.leak*(.6+.4*Math.sin(t*.9));C.cover(ctx,lk,0,0,W,H,1.15,Math.sin(t*.5)*120,0);ctx.restore();}}
  // floating embers
  if(P.dust>0){ctx.save();ctx.globalCompositeOperation='screen';
    for(let k=0;k<34;k++){const sp=40+rnd(k+5)*70,y=H+30-((t*sp+rnd(k+9)*(H+60))%(H+60)),x=rnd(k)*W+Math.sin(t*.7+k)*34,r=6+rnd(k+3)*16;
      ctx.globalAlpha=(.18+.5*rnd(k+11))*Math.min(1,y/200)*(.6+.4*Math.sin(t*2+k));ctx.drawImage(spr,x-r,y-r,r*2,r*2);}ctx.restore();}
  // soft light sweep (diagonal band crossing every ~5s)
  if(P.sweep>0){const ph=((t/5)%1),x=-600+ph*(W+1200);ctx.save();ctx.globalCompositeOperation='screen';
    const g=ctx.createLinearGradient(x-260,0,x+260,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,240,210,'+P.sweep+')');g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.transform(1,0,-.35,1,0,0);ctx.fillRect(x-300,0,600,H);ctx.restore();}
  // vignette
  if(P.vignette>0){ctx.save();ctx.globalAlpha=P.vignette;ctx.drawImage(vg,0,0);ctx.restore();}
  // film grain (frame-seeded, deterministic for export)
  if(P.grain>0){if(!npat)npat=ctx.createPattern(nz,'repeat');
    ctx.save();ctx.globalAlpha=P.grain;ctx.globalCompositeOperation='overlay';ctx.translate(Math.floor(rnd(f)*256),Math.floor(rnd(f+13)*256));
    ctx.fillStyle=npat;ctx.fillRect(-256,-256,W+512,H+512);ctx.restore();}
  // fade in / out
  if(P.fade>0){const a=1-C.prog(t,0,P.fade),b=C.prog(t,C.total-P.fade,C.total);const k=Math.max(a,b);
    if(k>0){ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.restore();}}
};
})();
