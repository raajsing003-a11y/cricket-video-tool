// C135 (G11 base + G12 typewriter + G13 connector + G14 blur + G15 particles + P1, P2, P3, P4, P5, P6, P8, P16): Video-5 style (purple-glow faceless-channel tutorial). Sirf wide.
// ideatitle (P1): {small:'Channel idea 1', big:'Secret state file', sub:''}
// chipcarousel (P2): {title:'', chips:['🚢|Warships','06_icons/..|Food'] (3-8), hl:1 (0=koi nahi)}
// flowline (P3): {title:'', nodes:['Reference Channels','Idea','Script'] (2-4), mode:'chain'|'fan' (fan: pehla node -> baaki), pill:''}
// chatmock (P4): {ph:'How can I help you today?', q:'typed prompt', chips:['a','b','c'] (0-4), note:''}
// statcard (P5): {n:29145, dec:0, pre:'$', suf:'', label:'Revenue', side:['RPM|5.58','Views|3.8M'] (0-2, blur), blur:true, rain:true}
// thumbwall (P6): {thumbs:['slot/asset',..] (khali = placeholder), n:9 (4-12), hl:3 (0=koi nahi), label:''}
// ladder (P8): {title:'', steps:['icon|label'] (3-4), hl:0}
// ring (P16): {n:17, label:'Channel Ideas', orbit:['🚢','asset',...] (0-8), pre:'', suf:''}
(function(){const C=window.CORE,E=C.ease;
const VI='#a06bff',VD='#6a3cff',S=v=>v==null?'':String(v).trim();
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const pimg=k=>k?((C.photos&&C.photos[k])||C.img(k)):null;
const needA=k=>k&&k.indexOf('/')>=0&&!slot(k);
const PH='07_photo_slot_placeholders/ph_silhouette_dark';
const msg=(ctx,t)=>{ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,C.W/2,C.H/2);};
const parts=(a,n)=>(Array.isArray(a)?a:[]).map(S).filter(Boolean).slice(0,n).map(s=>s.split('|').map(x=>x.trim()));
function cover(ctx,im,x,y,w,h){if(!im)return;const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.max(w/iw,h/ih);ctx.drawImage(im,x+w/2-iw*s/2,y+h/2-ih*s/2,iw*s,ih*s);}
// ---- G11 purple base (halo arc neeche se)
C.pBase=function(ctx,t){const W=C.W,H=C.H;ctx.fillStyle='#050308';ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(W/2,H*1.18,60,W/2,H*1.18,W*.62);g.addColorStop(0,'rgba(150,90,255,.75)');g.addColorStop(.45,'rgba(100,50,220,.32)');g.addColorStop(1,'rgba(80,30,200,0)');ctx.save();ctx.translate(0,0);ctx.scale(1,.8+.02*Math.sin(t*.8));ctx.fillStyle=g;ctx.fillRect(0,0,W,H/.8);ctx.restore();
  const h=ctx.createRadialGradient(W/2,H*1.12,W*.28,W/2,H*1.12,W*.3);h.addColorStop(0,'rgba(190,140,255,0)');h.addColorStop(.5,'rgba(190,140,255,.28)');h.addColorStop(1,'rgba(190,140,255,0)');ctx.fillStyle=h;ctx.fillRect(0,H*.5,W,H*.5);};
C.pCard=function(ctx,x,y,w,h,r,glow,al){ctx.save();ctx.globalAlpha=(ctx.globalAlpha||1)*(al==null?1:al);ctx.shadowColor=VI;ctx.shadowBlur=glow?46:16;ctx.fillStyle='rgba(18,10,36,.92)';ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=glow?'#c9a6ff':VI;ctx.lineWidth=glow?4:2.5;ctx.stroke();ctx.restore();};
// violet gradient text (ek line)
C.pGrad=function(ctx,str,x,y,maxW,px,min,wt,align){const f=C.fitText(ctx,String(str),maxW,1,px,min,wt||900);ctx.save();ctx.font=C.font(f.px,wt||900);const w=ctx.measureText(f.lines[0]).width,g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#d9c2ff');g.addColorStop(.5,'#a06bff');g.addColorStop(1,'#7a4dff');ctx.fillStyle=g;ctx.shadowColor=VI;ctx.shadowBlur=26;ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x,y);ctx.restore();return f.px;};
C.pWhite=function(ctx,str,x,y,maxW,maxLines,px,min,o){o=o||{};const f=C.fitText(ctx,String(str),maxW,maxLines,px,min,o.wt||700),lh=f.px*1.22,tot=f.lines.length*lh;ctx.save();ctx.font=C.font(f.px,o.wt||700);ctx.fillStyle=o.col||'#fff';ctx.textAlign=o.align||'center';ctx.textBaseline='middle';f.lines.forEach((l,i)=>ctx.fillText(l,x,y-tot/2+lh/2+i*lh));ctx.restore();return f.px;};
// ---- G13 connector line: (x0,y0)->(x1,y1) p 0..1 tak, bend = curve (px), dot head
C.pLine=function(ctx,x0,y0,x1,y1,p,bend,col){if(p<=0)return;col=col||VI;const mx=(x0+x1)/2,my=(y0+y1)/2-(bend||0),pt=q=>{const a=1-q;return[a*a*x0+2*a*q*mx+q*q*x1,a*a*y0+2*a*q*my+q*q*y1];};
  ctx.save();ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<=40;i++){const q=p*i/40,c=pt(q);ctx.lineTo(c[0],c[1]);}ctx.stroke();const h=pt(p);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(h[0],h[1],10,0,Math.PI*2);ctx.fill();ctx.restore();};
// ---- G12 typewriter: str, t, t0, cps -> {s, cur}
C.pType=function(str,t,t0,cps){const n=Math.max(0,Math.min(str.length,Math.floor((t-t0)*(cps||18))));return{s:str.slice(0,n),done:n>=str.length,cur:Math.floor(t*2.5)%2===0};};
// ---- G15 falling sparks
C.pRain=function(ctx,t,n,al){const W=C.W,H=C.H;ctx.save();for(let i=0;i<n;i++){const sd=i*97.13,x=(Math.sin(sd)*.5+.5)*W,sp=160+(i%5)*70,y=((t*sp+sd*37)%(H+200))-100,r=3+(i%4)*2;ctx.globalAlpha=(al==null?1:al)*(.35+.4*((i%3)/2));ctx.fillStyle=i%3?'#d9c2ff':'#ffe27a';ctx.shadowColor=VI;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x+Math.sin(t*2+i)*14,y,r,0,Math.PI*2);ctx.fill();}ctx.restore();};
function head(ctx,t,d,oa,y){if(!d.title)return;const tp=E.out(C.prog(t,.05,.5));ctx.save();ctx.globalAlpha=oa*tp;C.pWhite(ctx,S(d.title),C.W/2,y+12*(1-tp),1600,1,58,32,{wt:700});ctx.restore();}
// ---- P1
C.CARDS.ideatitle={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.pBase(ctx,t);if(!S(d.big)&&!S(d.small)){msg(ctx,'big ya small likho');return;}
  ctx.save();ctx.globalAlpha=oa;const a=E.out(C.prog(t,.1,.7)),b=E.out(C.prog(t,.45,1.15));
  if(S(d.small)){ctx.globalAlpha=oa*a;C.pWhite(ctx,S(d.small),W/2,H/2-150+40*(1-a),1500,1,84,44,{wt:600,col:'#e6dcff'});}
  if(S(d.big)){ctx.globalAlpha=oa*b;const f=C.fitText(ctx,S(d.big),1640,2,190,70,900);ctx.font=C.font(f.px,900);f.lines.forEach((l,i)=>{const yy=H/2+30+i*f.px*1.15-(f.lines.length-1)*f.px*.575+60*(1-b);C.pGrad(ctx,l,W/2,yy,1640,f.px,f.px,900);});}
  if(S(d.sub)){const sp=E.out(C.prog(t,1.1,1.7));ctx.globalAlpha=oa*sp;C.pWhite(ctx,S(d.sub),W/2,H-170,1500,2,56,30,{wt:600,col:'#cbbcf0'});}
  ctx.restore();}};
// ---- P2
C.CARDS.chipcarousel={assets:d=>parts(d.chips,8).map(a=>a.length>1?a[0]:'').filter(needA),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=parts(d.chips,8).map(a=>a.length>1?{ic:a[0],l:a[1]}:{ic:'',l:a[0]});C.pBase(ctx,t);if(it.length<3){msg(ctx,'chips mein 3-8 "icon|label" do');return;}
  const n=it.length,hl=d.hl==null||d.hl===''?1:Math.round(+d.hl),sz=300,gap=70,step=sz+gap,sc0=C.prog(t,.3,sc.dur-.5),target=hl>0?hl-1:0,off=(-(target-(n-1)/2)*step)*E.io(sc0)*.0+(-(target-(n-1)/2)*step)*E.io(C.prog(t,.6,1.6));
  ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,110);const cy=H/2+20;
  it.forEach((o,i)=>{const p=E.out(C.prog(t,.1+i*.08,.6+i*.08));if(p<=0)return;const x=W/2+(i-(n-1)/2)*step+off,on=hl>0&&i===target,s=on?1.12:.92;ctx.save();ctx.globalAlpha=oa*p*(on||!hl?1:.55);ctx.translate(x,cy+(1-p)*50);ctx.scale(s,s);C.pCard(ctx,-sz/2,-sz/2,sz,sz,48,on,1);
    const im=o.ic.indexOf('/')>=0?C.img(o.ic):null;if(im){const k=Math.min((sz-90)/im.width,(sz-90)/im.height);ctx.drawImage(im,-im.width*k/2,-im.height*k/2-12,im.width*k,im.height*k);}else{ctx.font=C.font(sz*.42,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.ic||String(i+1),0,-10);}ctx.restore();
    ctx.save();ctx.globalAlpha=oa*p*(on||!hl?1:.55);C.pWhite(ctx,o.l,x,cy+sz*.5*s+54,sz+40,1,50,26,{wt:700});ctx.restore();});
  ctx.restore();}};
// ---- P3
C.CARDS.flowline={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),nd=parts(d.nodes,4).map(a=>a[0]),fan=S(d.mode)==='fan';C.pBase(ctx,t);if(nd.length<2){msg(ctx,'nodes mein 2-4 naam do');return;}
  ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,110);const n=nd.length,cy=H/2-20,nw=fan?520:Math.min(440,(W-300)/n-90),nh=190;let pos=[];
  if(fan){pos.push([W*.22,cy]);const m=n-1,gap=250;for(let i=0;i<m;i++)pos.push([W*.72,cy+(i-(m-1)/2)*gap]);}else{const gap=(W-200-n*nw)/(n-1+0.0001);for(let i=0;i<n;i++)pos.push([100+nw/2+i*(nw+gap),cy]);}
  nd.forEach((l,i)=>{const p=E.back(C.prog(t,.2+i*.5,.7+i*.5));if(p<=0)return;const [x,y]=pos[i];ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(x,y);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));C.pCard(ctx,-nw/2,-nh/2,nw,nh,36,i===0,1);C.pWhite(ctx,l,0,0,nw-50,2,56,28,{wt:800});ctx.restore();});
  const segs=fan?pos.slice(1).map((q,i)=>[0,i+1]):pos.slice(1).map((q,i)=>[i,i+1]);
  segs.forEach((sg,i)=>{const a=pos[sg[0]],b=pos[sg[1]],p=E.io(C.prog(t,.6+i*.5,1.3+i*.5));const bend=fan?(b[1]-a[1])*-.0+((b[1]<a[1])?-90:b[1]>a[1]?90:0):0;C.pLine(ctx,a[0]+nw/2,a[1],b[0]-nw/2,b[1],p,fan?-bend:0);});
  const lp=E.out(C.prog(t,1.4+n*.5,2+n*.5));if(S(d.pill)&&lp>0){ctx.globalAlpha=oa*lp;const f=C.fitText(ctx,S(d.pill),1100,1,56,30,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+80;ctx.fillStyle='rgba(160,107,255,.2)';ctx.strokeStyle=VI;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(W/2-w/2,H-210,w,90,45);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,H-165);}
  ctx.restore();}};
// ---- P4
C.CARDS.chatmock={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),q=S(d.q),ph=S(d.ph)||'How can I help you today?',ch=parts(d.chips,4).map(a=>a[0]);C.pBase(ctx,t);if(!q){msg(ctx,'q (typed prompt) likho');return;}
  ctx.save();ctx.globalAlpha=oa;const cw=Math.min(1500,W-300),cx=W/2-cw/2,cy=250,cp=E.out(C.prog(t,.1,.6));ctx.globalAlpha=oa*cp;
  const ty=C.pType(q,t,1.0,22),th=ty.s?330:200;C.pCard(ctx,cx,cy,cw,360,40,true,1);
  if(!ty.s){C.pWhite(ctx,ph,W/2,cy+120,cw-120,1,64,34,{wt:700,col:'#8c7bb0'});}
  const lines=(()=>{ctx.font=C.font(54,600);const out=[];let cur='';ty.s.split(' ').forEach(w=>{const tt=cur?cur+' '+w:w;if(ctx.measureText(tt).width>cw-140&&cur){out.push(cur);cur=w;}else cur=tt;});out.push(cur);return out.slice(-4);})();
  if(ty.s){ctx.font=C.font(54,600);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';lines.forEach((l,i)=>ctx.fillText(l,cx+60,cy+90+i*72));if(!ty.done||ty.cur){const lw=ctx.measureText(lines[lines.length-1]).width;ctx.fillStyle=VI;ctx.fillRect(cx+64+lw,cy+60+(lines.length-1)*72,5,60);}}
  ctx.fillStyle=VD;ctx.beginPath();ctx.arc(cx+cw-80,cy+360-70,34,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(cx+cw-80,cy+360-88);ctx.lineTo(cx+cw-96,cy+360-66);ctx.lineTo(cx+cw-64,cy+360-66);ctx.fill();
  const t0=1.0+q.length/22+.4;ch.forEach((l,i)=>{const p=E.back(C.prog(t,t0+i*.3,t0+i*.3+.5));if(p<=0)return;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);const f=C.fitText(ctx,l,700,1,50,26,700);ctx.font=C.font(f.px,700);const w=ctx.measureText(f.lines[0]).width+70,x=cx+60+(i%2)*0,rows=[cy+450,cy+450,cy+560,cy+560],cols=[0,1,0,1];const px=cx+60+cols[i]*(cw/2),py=rows[i];ctx.translate(px+w/2,py);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));ctx.fillStyle='rgba(160,107,255,.16)';ctx.strokeStyle=VI;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-w/2,-38,w,76,38);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,3);ctx.restore();});
  if(S(d.note)){const np=E.out(C.prog(t,t0+1.6,t0+2.2));ctx.globalAlpha=oa*np;C.pWhite(ctx,S(d.note),W/2,H-110,1500,1,48,28,{col:'#cbbcf0'});}
  ctx.restore();}};
// ---- P5 statcard (G14 blur + G15 rain)
C.CARDS.statcard={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),nv=+d.n;C.pBase(ctx,t);if(!isFinite(nv)||d.n===''||d.n==null){msg(ctx,'n (number) do');return;}
  const dec=Math.max(0,Math.min(3,Math.round(+d.dec||0)));ctx.save();ctx.globalAlpha=oa;if(d.rain!==false)C.pRain(ctx,t,26,oa*.8);
  const side=parts(d.side,2),blur=d.blur!==false,sw=420,sh=280,cy=H/2-10;
  side.forEach((a,i)=>{const p=E.out(C.prog(t,.3+i*.25,.9+i*.25));if(p<=0)return;const x=i?W-60-sw:60,y=cy-sh/2+(i?60:-60);ctx.save();ctx.globalAlpha=oa*p*.9;if(blur)ctx.filter='blur(7px)';C.pCard(ctx,x,y,sw,sh,36,false,1);C.pGrad(ctx,a[1]||'',x+sw/2,y+sh*.4,sw-60,110,44,900);C.pWhite(ctx,a[0]||'',x+sw/2,y+sh*.78,sw-60,1,48,26,{wt:700});ctx.filter='none';ctx.restore();});
  const mp=E.back(C.prog(t,.1,.8)),mw=860,mh=480,mx=W/2-mw/2,my=cy-mh/2;if(mp>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,mp*1.5);ctx.translate(W/2,cy);ctx.scale(Math.min(1.06,mp),Math.min(1.06,mp));ctx.translate(-W/2,-cy);C.pCard(ctx,mx,my,mw,mh,50,true,1);
    const cp=E.out(C.prog(t,.5,2.2)),v=nv*cp,txt=(S(d.pre))+C.fmtNum(v,dec)+S(d.suf);C.pGrad(ctx,txt,W/2,cy-30,mw-80,170,60,900);if(S(d.label))C.pWhite(ctx,S(d.label),W/2,cy+140,mw-100,1,58,30,{wt:700,col:'#e6dcff'});ctx.restore();}
  ctx.restore();}};
// ---- P6 thumbwall
C.CARDS.thumbwall={assets:d=>(Array.isArray(d.thumbs)?d.thumbs:[]).map(S).filter(needA).concat([PH]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),th=(Array.isArray(d.thumbs)?d.thumbs:[]).map(S),n=Math.max(4,Math.min(12,Math.round(+d.n||th.length||9))),hl=Math.round(+d.hl||0);C.pBase(ctx,t);
  const cols=n<=6?3:n<=8?4:n<=10?5:4,rows=Math.ceil(n/cols),gap=36,cw=Math.min(520,(W-260-(cols-1)*gap)/cols),ch=cw*9/16,gh=rows*ch+(rows-1)*gap,z=1+.05*t/sc.dur,y0=(H-gh)/2-(S(d.label)?30:0)-t*3;
  ctx.save();ctx.globalAlpha=oa;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);
  for(let i=0;i<n;i++){const r=Math.floor(i/cols),c=i%cols,cnt=r===rows-1?n-cols*(rows-1):cols,rw=cnt*cw+(cnt-1)*gap,x=W/2-rw/2+c*(cw+gap),y=y0+r*(ch+gap),p=E.out(C.prog(t,.1+i*.07,.6+i*.07));if(p<=0)continue;const g=hl===i+1;
    ctx.save();ctx.globalAlpha=oa*p*(hl&&!g?.45:1);ctx.translate(x+cw/2,y+ch/2+(1-p)*40);const s=g?1.08:1;ctx.scale(s,s);ctx.shadowColor=VI;ctx.shadowBlur=g?44:12;ctx.fillStyle='#120a24';ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,18);ctx.fill();ctx.shadowBlur=0;
    ctx.save();ctx.beginPath();ctx.roundRect(-cw/2+4,-ch/2+4,cw-8,ch-8,15);ctx.clip();const im=th[i]?pimg(th[i]):null;if(im)cover(ctx,im,-cw/2+4,-ch/2+4,cw-8,ch-8);else{const hu=[265,280,255,290][i%4];const gg=ctx.createLinearGradient(0,-ch/2,0,ch/2);gg.addColorStop(0,'hsl('+hu+',40%,24%)');gg.addColorStop(1,'hsl('+hu+',50%,10%)');ctx.fillStyle=gg;ctx.fillRect(-cw/2,-ch/2,cw,ch);ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.moveTo(-18,-24);ctx.lineTo(-18,24);ctx.lineTo(26,0);ctx.fill();}ctx.restore();
    ctx.strokeStyle=g?'#c9a6ff':'rgba(160,107,255,.55)';ctx.lineWidth=g?5:2;ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,18);ctx.stroke();ctx.restore();}
  ctx.restore();if(S(d.label)){const lp=E.out(C.prog(t,.9,1.5));ctx.save();ctx.globalAlpha=oa*lp;C.pWhite(ctx,S(d.label),W/2,H-80+14*(1-lp),1600,1,64,34,{wt:700});ctx.restore();}}};
// ---- P8 ladder
C.CARDS.ladder={assets:d=>parts(d.steps,4).map(a=>a.length>1?a[0]:'').filter(needA),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=parts(d.steps,4).map(a=>a.length>1?{ic:a[0],l:a[1]}:{ic:'',l:a[0]}),hl=Math.round(+d.hl||0);C.pBase(ctx,t);if(it.length<3){msg(ctx,'steps mein 3-4 "icon|label" do');return;}
  ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,110);const n=it.length,cw=Math.min(380,(W-260)/n-60),ch=cw*1.1,gap=(W-200-n*cw)/(n-1),cy=H/2+10,pos=it.map((o,i)=>100+cw/2+i*(cw+gap));
  for(let i=0;i<n-1;i++)C.pLine(ctx,pos[i]+cw/2,cy,pos[i+1]-cw/2,cy,E.io(C.prog(t,.7+i*.6,1.3+i*.6)),0);
  it.forEach((o,i)=>{const p=E.back(C.prog(t,.2+i*.6,.7+i*.6));if(p<=0)return;const on=!hl||hl===i+1;ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5)*(on?1:.45);ctx.translate(pos[i],cy);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));C.pCard(ctx,-cw/2,-ch/2,cw,ch,38,hl===i+1,1);
    const im=o.ic.indexOf('/')>=0?C.img(o.ic):null;if(im){const k=Math.min((cw-100)/im.width,(ch*.5)/im.height);ctx.drawImage(im,-im.width*k/2,-ch*.22-im.height*k/2,im.width*k,im.height*k);}else{ctx.font=C.font(cw*.32,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.ic||String(i+1),0,-ch*.2);}
    C.pWhite(ctx,o.l,0,ch*.3,cw-40,2,50,26,{wt:800});ctx.restore();});
  ctx.restore();}};
// ---- P16 ring
C.CARDS.ring={assets:d=>(Array.isArray(d.orbit)?d.orbit:[]).map(S).filter(needA),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),nv=+d.n,orb=(Array.isArray(d.orbit)?d.orbit:[]).map(S).filter(Boolean).slice(0,8);C.pBase(ctx,t);if(!isFinite(nv)||d.n===''||d.n==null){msg(ctx,'n (number) do');return;}
  ctx.save();ctx.globalAlpha=oa;const cx=W/2,cy=H/2-10,R=330,p=E.out(C.prog(t,.1,.8));
  ctx.save();ctx.globalAlpha=oa*p;ctx.strokeStyle='rgba(160,107,255,.45)';ctx.lineWidth=3;ctx.setLineDash([4,14]);ctx.beginPath();ctx.arc(cx,cy,R*p,0,Math.PI*2);ctx.stroke();ctx.restore();
  orb.forEach((k,i)=>{const q=E.back(C.prog(t,.5+i*.12,1+i*.12));if(q<=0)return;const a=t*.35+i*(Math.PI*2/orb.length),x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R,r=62;ctx.save();ctx.globalAlpha=oa*Math.min(1,q*1.5);ctx.translate(x,y);ctx.scale(Math.min(1.08,q),Math.min(1.08,q));ctx.shadowColor=VI;ctx.shadowBlur=26;ctx.fillStyle='#160c2c';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=VI;ctx.lineWidth=4;ctx.stroke();const im=k.indexOf('/')>=0?C.img(k):null;if(im){const s=Math.min(84/im.width,84/im.height);ctx.drawImage(im,-im.width*s/2,-im.height*s/2,im.width*s,im.height*s);}else{ctx.font=C.font(66,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(k,0,4);}ctx.restore();});
  const cp=E.out(C.prog(t,.4,1.8)),dec=Math.max(0,Math.min(3,Math.round(+d.dec||0)));ctx.globalAlpha=oa*Math.min(1,p*1.5);C.pGrad(ctx,S(d.pre)+C.fmtNum(nv*cp,dec)+S(d.suf),cx,cy-30,R*1.3,230,80,900);if(S(d.label))C.pWhite(ctx,S(d.label),cx,cy+130,R*1.5,2,64,32,{wt:700,col:'#e6dcff'});
  ctx.restore();}};
})();
