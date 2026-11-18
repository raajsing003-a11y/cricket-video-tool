// C127 (R8): 3 naye transitions (explainer style). API same: CORE.TRANS[name]=(ctx,A,B,p). Wide + short dono.
// split   = do peela panel (upar/neeche) beech mein band hote hain, A chhupta hai, phir khulte hain aur B dikhta hai
// chevron = peele ">" chevron ki patti left se right sweep karti hai, uske peeche B
// torn    = peela phata-kagaz ki patti (jagged kinara) left se right, uske peeche B
(function(){const C=window.CORE,E=C.ease,T=C.TRANS,Y='#F5C518',YD='#c99a00';
// split: A ke upar do panel band, beech mein cut, phir khul kar B
T.split=(ctx,A,B,p)=>{const W=C.W,H=C.H,first=p<.5,q=first?E.in(p*2):1-E.out((p-.5)*2),h=H/2*q;
  ctx.drawImage(first?A:B,0,0);
  if(h>1){ctx.save();ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.fillStyle=Y;ctx.fillRect(0,0,W,h);ctx.fillRect(0,H-h,W,h);ctx.shadowBlur=0;
    ctx.fillStyle=YD;ctx.fillRect(0,h-8,W,8);ctx.fillRect(0,H-h,W,8);
    ctx.fillStyle='rgba(16,19,31,.9)';const n=C.format==='short'?5:9,cw=W/n;for(let i=0;i<n;i++){const x=i*cw+(p*cw*2)%cw;ctx.beginPath();ctx.moveTo(x,h*.2);ctx.lineTo(x+cw*.3,h*.5);ctx.lineTo(x,h*.8);ctx.lineTo(x+cw*.12,h*.5);ctx.closePath();if(h>40)ctx.fill();}
    ctx.restore();}};
// chevron: teer ki nok jaisa kinara, peeche 3 peele chevron
T.chevron=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p),k=H*.35,s=-k-340+q*(W+k+680),edge=y=>s-Math.abs(y-H/2)*.7;
  ctx.drawImage(A,0,0);
  ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(edge(0),0);ctx.lineTo(edge(H/2),H/2);ctx.lineTo(edge(H),H);ctx.lineTo(0,H);ctx.closePath();ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
  const al=Math.min(1,Math.sin(p*Math.PI)*2.2);
  if(al>0){ctx.save();ctx.globalAlpha=al;ctx.lineJoin='miter';ctx.lineCap='butt';ctx.shadowColor=Y;ctx.shadowBlur=24;
    [0,1,2].forEach(i=>{const o=-i*130,lw=i===0?70:i===1?52:36;ctx.strokeStyle=Y;ctx.globalAlpha=al*(1-i*.22);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(edge(0)+o,0);ctx.lineTo(edge(H/2)+o,H/2);ctx.lineTo(edge(H)+o,H);ctx.stroke();});ctx.restore();}};
// torn: jagged peeli patti (deterministic noise)
const jag=(y,seed)=>Math.sin(y*.045+seed)*16+Math.sin(y*.13+seed*2.3)*9+Math.sin(y*.37+seed*.7)*5;
T.torn=(ctx,A,B,p)=>{const W=C.W,H=C.H,q=E.io(p),bw=W*.32,s=-bw-80+q*(W+bw+160),step=C.format==='short'?14:8;
  ctx.drawImage(A,0,0);
  const leftEdge=y=>s+jag(y,1),rightEdge=y=>s+bw+jag(y,4);
  // B (patti ke left) — phata kinara
  ctx.save();ctx.beginPath();ctx.moveTo(0,0);for(let y=0;y<=H;y+=step)ctx.lineTo(leftEdge(y),y);ctx.lineTo(0,H);ctx.closePath();ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
  // peeli patti
  ctx.save();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=36;ctx.fillStyle=Y;ctx.beginPath();for(let y=0;y<=H;y+=step)ctx.lineTo(leftEdge(y),y);for(let y=H;y>=0;y-=step)ctx.lineTo(rightEdge(y),y);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
  // kagaz ka safed kinara (left) + halke dhabbe
  ctx.strokeStyle='rgba(255,248,225,.9)';ctx.lineWidth=7;ctx.beginPath();for(let y=0;y<=H;y+=step){const x=leftEdge(y)+10+jag(y,9)*.12;y===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
  ctx.clip();ctx.fillStyle='rgba(120,80,0,.1)';for(let i=0;i<14;i++){const x=s+((i*97)%100)/100*bw,y=((i*211)%H);ctx.beginPath();ctx.arc(x,y,40+(i%4)*20,0,Math.PI*2);ctx.fill();}
  ctx.restore();};
})();
