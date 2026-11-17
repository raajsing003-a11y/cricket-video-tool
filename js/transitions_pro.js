// C31: 8 naye advanced transitions. API same: CORE.TRANS[name]=(ctx,A,B,p). Size C.W/C.H se (wide + short dono).
// push, iris, blinds, rgb, spin, lightwipe, tiles, blurfade
(function(){const C=window.CORE,E=C.ease,T=C.TRANS;
const cl=E.clamp,mk=()=>{const c=document.createElement('canvas');return c;};
const tmp=mk(),tx=tmp.getContext('2d');
// push: B right se dhakelta hai, A dheere (parallax) peeche hat kar dark hota hai; blur + chamakti edge
T.push=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p),sp=Math.sin(p*Math.PI);
  ctx.save();if(sp>.12)ctx.filter='blur('+Math.round(sp*14)+'px)';
  ctx.drawImage(A,-q*W*.55,0);ctx.fillStyle='rgba(0,0,0,'+(.55*q)+')';ctx.fillRect(0,0,W,H);
  const x=W-q*W;ctx.drawImage(B,x,0);ctx.restore();
  ctx.save();const g=ctx.createLinearGradient(x-90,0,x,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+.5*sp+')');ctx.fillStyle=g;ctx.fillRect(x-90,0,90,H);
  ctx.globalAlpha=sp;ctx.fillStyle='#ffe9a8';ctx.fillRect(x,0,5,H);ctx.restore();};
// iris: beech se goal circle khulta hai, sunehri ring
T.iris=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p),R=Math.hypot(W,H)/2*q*1.02;
  ctx.drawImage(A,0,0);
  ctx.save();ctx.beginPath();ctx.arc(W/2,H/2,R,0,Math.PI*2);ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
  if(R>2){ctx.save();ctx.strokeStyle='rgba(255,214,90,'+(.95*Math.sin(p*Math.PI))+')';ctx.lineWidth=Math.max(6,W/140);ctx.shadowColor='#ffb020';ctx.shadowBlur=40;
    ctx.beginPath();ctx.arc(W/2,H/2,R,0,Math.PI*2);ctx.stroke();ctx.restore();}};
// blinds: vertical patti ek ke baad ek khulti hain
T.blinds=(ctx,A,B,p)=>{const W=C.W,H=C.H,n=C.format==='short'?8:12,w=W/n;ctx.drawImage(A,0,0);
  for(let i=0;i<n;i++){const s=E.io(cl((p*1.7-i/n*.7)));if(s<=0)continue;
    ctx.save();ctx.beginPath();ctx.rect(i*w,0,w*s+1,H);ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
    if(s<1){ctx.save();ctx.fillStyle='rgba(255,255,255,'+.35*(1-s)+')';ctx.fillRect(i*w+w*s,0,4,H);ctx.restore();}}};
// rgb: zoom + lal/neela ghost split, beech mein cut
T.rgb=(ctx,A,B,p)=>{const W=C.W,H=C.H,first=p<.5,src=first?A:B,q=first?E.in(p*2):1-E.out((p-.5)*2),z=1+.22*q,off=34*q;
  if(tmp.width!==W||tmp.height!==H){tmp.width=W;tmp.height=H;}
  ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.drawImage(src,-W/2,-H/2);ctx.restore();
  if(q>.02){[['#ff0000',-off],['#00ffff',off]].forEach(([col,dx])=>{
    tx.globalCompositeOperation='source-over';tx.clearRect(0,0,W,H);tx.drawImage(src,0,0);tx.globalCompositeOperation='multiply';tx.fillStyle=col;tx.fillRect(0,0,W,H);
    ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.55*q;ctx.translate(W/2+dx,H/2);ctx.scale(z,z);ctx.drawImage(tmp,-W/2,-H/2);ctx.restore();});
    tx.globalCompositeOperation='source-over';}};
// spin: A ghoom kar bada hota hua ud jata hai, B ghoomta hua aata hai
T.spin=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p);
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=1-q;ctx.translate(W/2,H/2);ctx.rotate(q*.5);ctx.scale(1+q*.9,1+q*.9);ctx.drawImage(A,-W/2,-H/2);ctx.restore();
  ctx.save();ctx.globalAlpha=q;ctx.translate(W/2,H/2);ctx.rotate(-(1-q)*.5);const s=.55+.45*E.out(p);ctx.scale(s,s);ctx.drawImage(B,-W/2,-H/2);ctx.restore();};
// lightwipe: tirchhi sunehri roshni ki patti B ko khol deti hai
T.lightwipe=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p),sk=H*.4,s=-sk-260+q*(W+sk+520);
  ctx.drawImage(A,0,0);
  ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(s,0);ctx.lineTo(s-sk,H);ctx.lineTo(0,H);ctx.closePath();ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='screen';ctx.transform(1,0,-.4,1,0,0);
  const g=ctx.createLinearGradient(s-230+sk*.5,0,s+230+sk*.5,0);g.addColorStop(0,'rgba(255,200,80,0)');g.addColorStop(.5,'rgba(255,248,220,'+(.95*Math.sin(p*Math.PI)+.05)+')');g.addColorStop(1,'rgba(255,200,80,0)');
  ctx.fillStyle=g;ctx.fillRect(s-230+sk*.5,0,460,H);ctx.restore();};
// tiles: grid ke tile diagonal order mein pop hokar B dikhate hain
T.tiles=(ctx,A,B,p)=>{const W=C.W,H=C.H,cols=C.format==='short'?6:12,rows=C.format==='short'?10:7,tw=W/cols,th=H/rows;
  ctx.drawImage(A,0,0);
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const d=(i/cols+j/rows)/2,s=E.out(cl((p*1.55-d*.55)/.45));if(s<=0)continue;
    const cx=i*tw+tw/2,cy=j*th+th/2,w=tw*s+1,h=th*s+1;ctx.drawImage(B,i*tw+tw/2-w/2,j*th+th/2-h/2,w,h,cx-w/2,cy-h/2,w,h);}};
// blurfade: blur ke saath dheere se badalna (soft / cinematic)
T.blurfade=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p),sp=Math.sin(p*Math.PI);
  ctx.save();ctx.filter='blur('+Math.round(sp*22)+'px)';ctx.drawImage(A,0,0);ctx.globalAlpha=q;ctx.drawImage(B,0,0);ctx.restore();};
})();
