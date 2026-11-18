// C136 (P7, P9, P10, P11, P13, P14, P15, P17, P18, P19): Video-5 style baaki cards (card_p.js ke helpers). Sirf wide. P12 world dot-map aur P20 (= screenclip) alag.
// vidcard (P7): {clip:'Clips naam' ya shot:'slot/asset', start:0, title:'', meta:'', title2:''}
// gauge (P9): {label:'High RPM', v:0.8 (0-1 needle), n:'', pre:'', suf:'', c1:'66.1%|Label', c2:'47.8%|Label'}
// barlist (P10): {title:'Top Geographies', items:['India|42','USA|30'] (3-6, 'naam|number'), suf:'%'}
// tree (P11): {root:'Old Money', l2:['A','B'] (1-3), l3:['C','D','E','F'] (0-6)}
// cardtiles (P13): {items:['icon|label'] (3-4), brace:'Mythologies'}
// fan (P14): {src:'Prompt', outs:['Script|By Claude','Voice|By AI','Video'] (2-4)}
// replies (P15): {src:'Source text', items:['@naam|comment'] (2-4)}
// vs2 (P17): {a:'', sa:'', b:'', sb:'', pill:''}
// bonus (P18): {a:'Bonus Idea 1', ta:'', b:'Bonus Idea 2', tb:'', icon:'🎁'}
// prodnode (P19): {a:'icon|label', b:'icon|label', c:'icon|label' (optional)}
(function(){const C=window.CORE,E=C.ease;
const VI='#a06bff',S=v=>v==null?'':String(v).trim();
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const pimg=k=>k?((C.photos&&C.photos[k])||C.img(k)):null;
const needA=k=>k&&k.indexOf('/')>=0&&!slot(k);
const PH='07_photo_slot_placeholders/ph_silhouette_dark';
const msg=(ctx,t)=>{ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,C.W/2,C.H/2);};
const parts=(a,n)=>(Array.isArray(a)?a:[]).map(S).filter(Boolean).slice(0,n).map(s=>s.split('|').map(x=>x.trim()));
function cover(ctx,im,x,y,w,h){if(!im)return;const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.max(w/iw,h/ih);ctx.drawImage(im,x+w/2-iw*s/2,y+h/2-ih*s/2,iw*s,ih*s);}
function ico(ctx,k,x,y,sz){const im=k&&k.indexOf('/')>=0?C.img(k):null;if(im){const q=Math.min(sz/im.width,sz/im.height);ctx.drawImage(im,x-im.width*q/2,y-im.height*q/2,im.width*q,im.height*q);}else{ctx.font=C.font(sz*.8,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(k||'•',x,y+4);}}
const icl=a=>a.length>1?{ic:a[0],l:a.slice(1).join('|')}:{ic:'',l:a[0]};
function head(ctx,t,d,oa,y){if(!d.title)return;const tp=E.out(C.prog(t,.05,.5));ctx.save();ctx.globalAlpha=oa*tp;C.pWhite(ctx,S(d.title),C.W/2,y+12*(1-tp),1600,1,58,32,{wt:700});ctx.restore();}
const pop=(t,i,a0,g)=>E.back(C.prog(t,a0+i*g,a0+i*g+.55));
// ---- P7
C.CARDS.vidcard={assets:d=>[PH].concat(needA(S(d.shot))?[S(d.shot)]:[]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),p=E.back(C.prog(t,.1,.8));C.pBase(ctx,t);ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);
  const cw=1180,ch=cw*9/16,cx=W/2-cw/2,cy=(H-ch)/2-(S(d.title)?60:20);ctx.translate(W/2,H/2);ctx.scale(Math.min(1.05,p),Math.min(1.05,p));ctx.translate(-W/2,-H/2);
  C.pCard(ctx,cx,cy,cw,ch,36,true,1);ctx.save();ctx.beginPath();ctx.roundRect(cx+6,cy+6,cw-12,ch-12,30);ctx.clip();
  const x=C.clipAt?C.clipAt(sc,C.starts[C.scenes.indexOf(sc)]+t):null;if(x){const v=x.c.video,vw=x.c.w||1920,vh=x.c.h||1080,s=Math.max((cw-12)/vw,(ch-12)/vh);try{ctx.drawImage(v,cx+cw/2-vw*s/2,cy+ch/2-vh*s/2,vw*s,vh*s);}catch(e){}}else cover(ctx,pimg(S(d.shot))||C.img(PH),cx+6,cy+6,cw-12,ch-12);ctx.restore();
  if(S(d.title))C.pWhite(ctx,S(d.title),W/2,cy+ch+70,cw,2,60,30,{wt:800});if(S(d.meta))C.pWhite(ctx,S(d.meta),W/2,cy+ch+(S(d.title)?150:70),cw,1,44,24,{wt:600,col:'#b9a8dd'});ctx.restore();}};
// ---- P9
C.CARDS.gauge={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),v=Math.max(0,Math.min(1,d.v==null||d.v===''?.75:+d.v));C.pBase(ctx,t);ctx.save();ctx.globalAlpha=oa;const cx=W/2,cy=H/2+60,R=380,gp=E.out(C.prog(t,.2,1.6));
  [['#ff4d6a',Math.PI,Math.PI*1.34],['#ffd23b',Math.PI*1.34,Math.PI*1.67],['#2ee67a',Math.PI*1.67,Math.PI*2]].forEach(([c,a,b])=>{ctx.strokeStyle=c;ctx.lineWidth=60;ctx.shadowColor=c;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(cx,cy,R,a,a+(b-a)*gp);ctx.stroke();});ctx.shadowBlur=0;
  const ang=Math.PI+Math.PI*v*gp;ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.fillStyle='#fff';ctx.shadowColor=VI;ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(0,-R+70);ctx.lineTo(14,0);ctx.fill();ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.fill();ctx.restore();
  if(S(d.label))C.pGrad(ctx,S(d.label),cx,cy-R-90,1200,110,50,900);
  if(S(d.n)){const np=E.out(C.prog(t,.8,1.4));ctx.globalAlpha=oa*np;C.pWhite(ctx,S(d.pre)+S(d.n)+S(d.suf),cx,cy+120,900,1,110,50,{wt:900});ctx.globalAlpha=oa;}
  [S(d.c1),S(d.c2)].forEach((s,i)=>{if(!s)return;const a=s.split('|'),p=pop(t,i,1.4,.3);if(p<=0)return;const x=i?W-260:260,y=cy+40;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,y);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));ctx.shadowColor=VI;ctx.shadowBlur=26;ctx.fillStyle='#160c2c';ctx.beginPath();ctx.arc(0,0,130,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=VI;ctx.lineWidth=5;ctx.stroke();C.pWhite(ctx,a[0],0,-12,220,1,64,30,{wt:900});if(a[1])C.pWhite(ctx,a[1],0,56,220,1,34,20,{wt:600,col:'#cbbcf0'});ctx.restore();});
  ctx.restore();}};
// ---- P10
C.CARDS.barlist={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=parts(d.items,6).map(a=>({l:a[0],v:parseFloat(a[1])})).filter(o=>isFinite(o.v));C.pBase(ctx,t);if(it.length<3){msg(ctx,'items mein 3-6 "naam|number" do');return;}
  ctx.save();ctx.globalAlpha=oa;const cw=1300,cx=W/2-cw/2,top=(S(d.title)?200:140),rh=Math.min(120,(H-top-160)/it.length),mx=Math.max(...it.map(o=>o.v));
  C.pCard(ctx,cx,top-50,cw,it.length*rh+100,40,true,1);if(S(d.title))C.pWhite(ctx,S(d.title),W/2,100,1500,1,64,34,{wt:800});
  it.forEach((o,i)=>{const p=E.out(C.prog(t,.3+i*.25,1.1+i*.25)),y=top+i*rh+rh/2;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*2);C.pWhite(ctx,o.l,cx+60,y,330,1,46,24,{align:'left',wt:700});const bx=cx+420,bw=cw-420-240;ctx.fillStyle='rgba(160,107,255,.14)';ctx.beginPath();ctx.roundRect(bx,y-18,bw,36,18);ctx.fill();const g=ctx.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,'#6a3cff');g.addColorStop(1,'#c9a6ff');ctx.fillStyle=g;ctx.shadowColor=VI;ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(bx,y-18,Math.max(8,bw*o.v/mx*p),36,18);ctx.fill();ctx.shadowBlur=0;C.pWhite(ctx,C.fmtNum(o.v*p,0)+S(d.suf),cx+cw-60,y,200,1,48,26,{align:'right',wt:800});ctx.restore();});
  ctx.restore();}};
// ---- P11
C.CARDS.tree={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),root=S(d.root),l2=parts(d.l2,3).map(a=>a[0]),l3=parts(d.l3,6).map(a=>a[0]);C.pBase(ctx,t);if(!root||!l2.length){msg(ctx,'root aur l2 do');return;}
  ctx.save();ctx.globalAlpha=oa;const y1=230,y2=520,y3=820,nw=340,nh=110,box=(x,y,l,p,g)=>{if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,y);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));C.pCard(ctx,-nw/2,-nh/2,nw,nh,30,g,1);C.pWhite(ctx,l,0,0,nw-40,2,44,24,{wt:800});ctx.restore();};
  box(W/2,y1,root,pop(t,0,.1,0),true);const x2=l2.map((l,i)=>W/2+(i-(l2.length-1)/2)*(l3.length>4?800:600));
  l2.forEach((l,i)=>{C.pLine(ctx,W/2,y1+nh/2,x2[i],y2-nh/2,E.io(C.prog(t,.5+i*.3,1+i*.3)),0);box(x2[i],y2,l,pop(t,i,.9,.3),false);});
  if(l3.length){const per=Math.ceil(l3.length/l2.length);l3.forEach((l,i)=>{const par=Math.min(l2.length-1,Math.floor(i/per)),k=i%per,cnt=Math.min(per,l3.length-par*per),x=x2[par]+(k-(cnt-1)/2)*(nw+20);C.pLine(ctx,x2[par],y2+nh/2,x,y3-nh/2,E.io(C.prog(t,1.6+i*.2,2.1+i*.2)),0);box(x,y3,l,pop(t,i,1.9,.2),false);});}
  ctx.restore();}};
// ---- P13
C.CARDS.cardtiles={assets:d=>parts(d.items,4).map(a=>a.length>1?a[0]:'').filter(needA),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=parts(d.items,4).map(icl);C.pBase(ctx,t);if(it.length<3){msg(ctx,'items mein 3-4 "icon|label" do');return;}
  ctx.save();ctx.globalAlpha=oa;const n=it.length,cw=360,ch=520,gap=60,x0=W/2-(n*cw+(n-1)*gap)/2,cy=H/2-50;
  it.forEach((o,i)=>{const p=pop(t,i,.2,.3);if(p<=0)return;const x=x0+i*(cw+gap)+cw/2;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,cy+(1-Math.min(1,p))*80);ctx.rotate((i-(n-1)/2)*.035);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));C.pCard(ctx,-cw/2,-ch/2,cw,ch,36,false,1);ico(ctx,o.ic,0,-60,cw-120);C.pWhite(ctx,o.l,0,ch/2-90,cw-40,2,52,26,{wt:800});ctx.restore();});
  const bp=E.out(C.prog(t,.3+n*.3+.3,.3+n*.3+1));if(bp>0&&S(d.brace)){const bx0=x0,bx1=W-x0,by=cy+ch/2+50;ctx.save();ctx.globalAlpha=oa*bp;ctx.strokeStyle=VI;ctx.shadowColor=VI;ctx.shadowBlur=14;ctx.lineWidth=6;ctx.lineCap='round';const m=(bx0+bx1)/2,hw=(bx1-bx0)/2*bp;ctx.beginPath();ctx.moveTo(m-hw,by);ctx.quadraticCurveTo(m-hw,by+30,m-hw+40,by+30);ctx.lineTo(m-30,by+30);ctx.quadraticCurveTo(m,by+30,m,by+60);ctx.quadraticCurveTo(m,by+30,m+30,by+30);ctx.lineTo(m+hw-40,by+30);ctx.quadraticCurveTo(m+hw,by+30,m+hw,by);ctx.stroke();ctx.restore();ctx.globalAlpha=oa*bp;C.pGrad(ctx,S(d.brace),W/2,by+130,1400,96,44,900);}
  ctx.restore();}};
// ---- P14
C.CARDS.fan={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),outs=parts(d.outs,4).map(a=>({l:a[0],s:a[1]||''}));C.pBase(ctx,t);if(outs.length<2){msg(ctx,'outs mein 2-4 do');return;}
  ctx.save();ctx.globalAlpha=oa;const sx=W*.2,sy=H/2-20,n=outs.length,ow=560,oh=170,gap=60,p0=pop(t,0,.1,0);
  if(p0>0){ctx.save();ctx.translate(sx,sy);ctx.scale(Math.min(1.08,p0),Math.min(1.08,p0));ctx.shadowColor=VI;ctx.shadowBlur=50;ctx.fillStyle='#160c2c';ctx.beginPath();ctx.arc(0,0,130,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#c9a6ff';ctx.lineWidth=5;ctx.stroke();ctx.font=C.font(120,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✨',0,6);ctx.restore();if(S(d.src))C.pWhite(ctx,S(d.src),sx,sy+190,420,2,48,26,{wt:700});}
  outs.forEach((o,i)=>{const y=sy+(i-(n-1)/2)*(oh+gap),x=W*.72;C.pLine(ctx,sx+130,sy,x-ow/2,y,E.io(C.prog(t,.6+i*.3,1.2+i*.3)),(y-sy)*.2);const p=pop(t,i,1.0,.3);if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,y);ctx.scale(Math.min(1.06,p),Math.min(1.06,p));C.pCard(ctx,-ow/2,-oh/2,ow,oh,36,false,1);C.pWhite(ctx,o.l,0,o.s?-26:0,ow-60,1,60,30,{wt:800});if(o.s)C.pWhite(ctx,o.s,0,40,ow-60,1,40,22,{wt:600,col:'#b9a8dd'});ctx.restore();});
  ctx.restore();}};
// ---- P15
C.CARDS.replies={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=parts(d.items,4).map(a=>({n:a.length>1?a[0]:'@viewer',x:a.length>1?a.slice(1).join('|'):a[0]}));C.pBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-4 "@naam|comment" do');return;}
  ctx.save();ctx.globalAlpha=oa;const sx=W*.2,sy=H/2,sw=480,sh=360,p0=pop(t,0,.1,0);
  if(p0>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,p0*1.5);ctx.translate(sx,sy);ctx.scale(Math.min(1.06,p0),Math.min(1.06,p0));C.pCard(ctx,-sw/2,-sh/2,sw,sh,36,true,1);C.pWhite(ctx,S(d.src)||'...',0,0,sw-60,5,50,26,{wt:700});ctx.restore();}
  const n=it.length,rw=1000,rh=Math.min(190,(H-260)/n-24),x=W-90-rw;
  it.forEach((o,i)=>{const y=H/2+(i-(n-1)/2)*(rh+24);C.pLine(ctx,sx+sw/2,sy,x,y,E.io(C.prog(t,.5+i*.3,1+i*.3)),0);const p=pop(t,i,.9,.3);if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x+rw/2,y);ctx.scale(Math.min(1.05,p),Math.min(1.05,p));C.pCard(ctx,-rw/2,-rh/2,rw,rh,34,false,1);ctx.fillStyle='#3a2380';ctx.beginPath();ctx.arc(-rw/2+80,0,46,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font=C.font(48,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((o.n.replace('@','')[0]||'?').toUpperCase(),-rw/2+80,4);C.pWhite(ctx,o.n,-rw/2+160,-rh*.25,rw-220,1,38,22,{align:'left',wt:800,col:'#c9a6ff'});C.pWhite(ctx,o.x,-rw/2+160,rh*.18,rw-220,2,46,24,{align:'left',wt:600});ctx.restore();});
  ctx.restore();}};
// ---- P17
C.CARDS.vs2={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.pBase(ctx,t);if(!S(d.a)||!S(d.b)){msg(ctx,'a aur b likho');return;}
  ctx.save();ctx.globalAlpha=oa;const cw=720,ch=520,cy=H/2-50;[[S(d.a),S(d.sa),W/2-cw/2-110],[S(d.b),S(d.sb),W/2+cw/2+110]].forEach(([l,s,x],i)=>{const p=pop(t,i,.2,.8);if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,cy);ctx.scale(Math.min(1.06,p),Math.min(1.06,p));C.pCard(ctx,-cw/2,-ch/2,cw,ch,50,i===1,1);C.pGrad(ctx,l,0,-70,cw-80,110,48,900);if(s)C.pWhite(ctx,s,0,90,cw-80,2,60,28,{wt:800,col:i?'#e6dcff':'#ff9bb0'});ctx.restore();});
  C.pLine(ctx,W/2-110+10,cy,W/2+110-10,cy,E.io(C.prog(t,1.0,1.6)),0);
  if(S(d.pill)){const lp=E.out(C.prog(t,1.6,2.2));ctx.globalAlpha=oa*lp;const f=C.fitText(ctx,S(d.pill),1200,1,56,30,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+80;ctx.fillStyle='rgba(160,107,255,.2)';ctx.strokeStyle=VI;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(W/2-w/2,H-210,w,90,45);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,H-165);}
  ctx.restore();}};
// ---- P18
C.CARDS.bonus={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.pBase(ctx,t);ctx.save();ctx.globalAlpha=oa;const cw=720,ch=620,cy=H/2,ic=S(d.icon)||'🎁';
  [[S(d.a)||'Bonus Idea 1',S(d.ta),W/2-cw/2-60],[S(d.b)||'Bonus Idea 2',S(d.tb),W/2+cw/2+60]].forEach(([l,s,x],i)=>{const p=pop(t,i,.2,.5);if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,cy);ctx.scale(Math.min(1.06,p),Math.min(1.06,p));C.pCard(ctx,-cw/2,-ch/2,cw,ch,56,true,1);ctx.font=C.font(190,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ic,0,-140+Math.sin(t*3+i)*8);C.pWhite(ctx,l,0,40,cw-80,1,70,34,{wt:700,col:'#e6dcff'});if(s)C.pGrad(ctx,s,0,170,cw-80,92,40,900);ctx.restore();});
  ctx.restore();}};
// ---- P19
C.CARDS.prodnode={assets:d=>['a','b','c'].map(k=>parts([d[k]],1)[0]).filter(a=>a&&a.length>1).map(a=>a[0]).filter(needA),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=['a','b','c'].map(k=>S(d[k])).filter(Boolean).map(s=>icl(s.split('|').map(x=>x.trim())));C.pBase(ctx,t);if(it.length<2){msg(ctx,'a aur b ("icon|label") do');return;}
  ctx.save();ctx.globalAlpha=oa;const n=it.length,sz=380,gap=(W-200-n*sz)/(n-1),cy=H/2-20,pos=it.map((o,i)=>100+sz/2+i*(sz+gap));
  for(let i=0;i<n-1;i++)C.pLine(ctx,pos[i]+sz/2,cy,pos[i+1]-sz/2,cy,E.io(C.prog(t,.7+i*.6,1.3+i*.6)),0);
  it.forEach((o,i)=>{const p=pop(t,i,.2,.6);if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(pos[i],cy);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));C.pCard(ctx,-sz/2,-sz/2,sz,sz,60,i===0,1);ico(ctx,o.ic,0,-20,sz-150);ctx.restore();C.pWhite(ctx,o.l,pos[i],cy+sz/2+60,sz+60,1,56,28,{wt:800});});
  ctx.restore();}};
})();
