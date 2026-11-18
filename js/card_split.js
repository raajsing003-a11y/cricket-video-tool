// C131 (G7): Split layout. Presenter (photo ya clip) ek side chhota + koi bhi WIDE card doosri side. Sirf wide.
// split: data:{inner:{type:'bullets', data:{...}} (koi bhi wide card, 'split' nahi),
//   pres:'19_presenter/presenter_point_left' (photo slot/asset) YA clip:'clip naam' (+start), side:'l'|'r' (presenter kis taraf; default l),
//   ratio:0.6 (card ka chowdai fraction 0.45-0.75), bg:'' (khaali = inner ka apna bg)}
// Presenter KABHI gayab nahi: poore scene mein dikhta hai. Card uske saath, rounded frame mein.
(function(){const C=window.CORE,E=C.ease,S=v=>v==null?'':String(v).trim();
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const inner=d=>{const i=d&&d.inner;return i&&typeof i==='object'&&C.CARDS[S(i.type)]&&S(i.type)!=='split'?i:null;};
C.splitInner=inner;
let off=null;const oc=()=>{if(!off)off=document.createElement('canvas');if(off.width!==C.W||off.height!==C.H){off.width=C.W;off.height=C.H;}return off;};
C.CARDS.split={assets:d=>{const a=[],i=inner(d);if(i){const cd=C.CARDS[S(i.type)];if(cd&&cd.assets)try{cd.assets(i.data||{}).forEach(k=>a.push(k));}catch(e){}}if(S(d.pres)&&!slot(S(d.pres)))a.push(S(d.pres));return a;},
 draw(ctx,t,d,sc){const W=C.W,H=C.H,i=inner(d),left=S(d.side)!=='r',ratio=Math.max(.45,Math.min(.75,+d.ratio||.6)),cw=Math.round(W*ratio)-20,ch=Math.round(cw*H/W),m=40,
    cx=left?W-cw-m:m,cy=Math.round((H-ch)/2),pw=W-cw-m*2,oa=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  // bg
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0e19');g.addColorStop(1,'#131b2e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(left?pw*.5:W-pw*.5,H*.7,40,left?pw*.5:W-pw*.5,H*.7,pw*.9);rg.addColorStop(0,'rgba(45,100,215,.3)');rg.addColorStop(1,'rgba(45,100,215,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=oa;
  // presenter
  const pp=E.out(C.prog(t,0,.6)),px0=left?m:W-m-pw,ox=(left?-1:1)*(1-pp)*120,cl=S(d.clip)&&C.clipAt?C.clipAt(sc,C.starts[C.scenes.indexOf(sc)]+t):null,pk=S(d.pres),im=pk?((C.photos&&C.photos[pk])||C.img(pk)):null;
  ctx.save();ctx.globalAlpha=oa*pp;ctx.translate(ox,0);
  if(cl){const ph=Math.min(H-160,pw*1.25),py=H/2-ph/2;ctx.save();ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(px0,py,pw,ph,32);ctx.fill();ctx.restore();ctx.save();ctx.beginPath();ctx.roundRect(px0,py,pw,ph,32);ctx.clip();const v=cl.c.video,vw=cl.c.w||1920,vh=cl.c.h||1080,s=Math.max(pw/vw,ph/vh),dw=vw*s,dh=vh*s;try{ctx.drawImage(v,px0+pw/2-dw/2,py+ph/2-dh/2,dw,dh);}catch(e){}ctx.restore();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(px0,py,pw,ph,32);ctx.stroke();}
  else if(im){const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.min(H*.96/ih,pw*1.15/iw)*(1+.012*Math.sin(t*1.4)),dw=iw*s,dh=ih*s;ctx.save();ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.drawImage(im,px0+pw/2-dw/2,H-dh,dw,dh);ctx.restore();}
  else{ctx.fillStyle='#9aa4b2';ctx.font=C.font(40,700);ctx.textAlign='center';ctx.fillText(S(d.clip)?'clip nahi mila — 🎞 Clips':'pres ya clip do',px0+pw/2,H/2);}
  ctx.restore();
  // card
  const kp=E.out(C.prog(t,.25,.85));
  if(!i){ctx.fillStyle='#9aa4b2';ctx.font=C.font(40,700);ctx.textAlign='center';ctx.fillText('inner card do',cx+cw/2,H/2);}
  else if(kp>0){const o=oc(),octx=o.getContext('2d');octx.setTransform(1,0,0,1,0,0);octx.globalAlpha=1;octx.clearRect(0,0,W,H);
    try{octx.save();C.CARDS[S(i.type)].draw(octx,t,i.data||{},{dur:sc.dur+1,type:S(i.type),data:i.data||{},tr:sc.tr,trDur:sc.trDur});octx.restore();}catch(e){octx.restore();octx.fillStyle='#300';octx.fillRect(0,0,W,H);}
    ctx.save();ctx.globalAlpha=oa*kp;ctx.translate((left?1:-1)*(1-kp)*80,0);ctx.shadowColor='rgba(59,155,255,.35)';ctx.shadowBlur=44;ctx.fillStyle='#050a1a';ctx.beginPath();ctx.roundRect(cx,cy,cw,ch,30);ctx.fill();ctx.shadowBlur=0;
    ctx.save();ctx.beginPath();ctx.roundRect(cx,cy,cw,ch,30);ctx.clip();ctx.drawImage(o,cx,cy,cw,ch);ctx.restore();ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(cx,cy,cw,ch,30);ctx.stroke();ctx.restore();}
  ctx.restore();}};
})();
