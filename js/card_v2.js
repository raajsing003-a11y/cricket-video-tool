// C129 (V5 + V6 + V7): Video-3 style cards, card_v.js ke helpers (C.vBase, C.vText) use karte hain. Sirf wide.
// phonewall (V5): data:{title:'', n:3 (2-10), shots:['slot/asset',...] (optional, n se kam ho to baaki khaali tile), labels:['..'] (optional), mode:'fan'|'row', hl:0 (1..n glow; 0 = koi nahi), c:'b', bg}
// numgrid   (V6): data:{title:'', items:['9|Object + text','10|Text'] (2-8, 'number|label', label mein *shabd*), hl:1 (kaunsa glow; 0 = ek-ek karke sab), c:'b', bg}
// compare2  (V7): data:{title:'', ia:'slot/asset', ib:'slot/asset', la:'Design *basics*', lb:'Editing *psychology*', ua:'url/naam (window ke upar)', ub:'', hl:0|1|2, c:'b', bg}
(function(){const C=window.CORE,E=C.ease;
const BLUE='#3b9bff',S=v=>v==null?'':String(v).trim();
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const pimg=k=>k?((C.photos&&C.photos[k])||C.img(k)):null;
const PH='07_photo_slot_placeholders/ph_silhouette_dark';
const msg=(ctx,t)=>{ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(t,C.W/2,C.H/2);};
function coverImg(ctx,im,x,y,w,h,z){if(!im)return;const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.max(w/iw,h/ih)*(z||1);ctx.drawImage(im,x+w/2-iw*s/2,y+h/2-ih*s/2,iw*s,ih*s);}
function phone(ctx,x,y,w,h,im,i,glow,al){ctx.save();ctx.globalAlpha=(ctx.globalAlpha||1)*al;ctx.shadowColor=glow?'rgba(59,155,255,.9)':'rgba(0,0,0,.55)';ctx.shadowBlur=glow?50:26;ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(x,y,w,h,w*.1);ctx.fill();ctx.shadowBlur=0;
  ctx.save();ctx.beginPath();ctx.roundRect(x+5,y+5,w-10,h-10,w*.085);ctx.clip();
  if(im)coverImg(ctx,im,x+5,y+5,w-10,h-10,1.03);else{const g=ctx.createLinearGradient(x,y,x,y+h);const hue=[215,200,230,190,245,205,225,195,235,210][i%10];g.addColorStop(0,'hsl('+hue+',45%,22%)');g.addColorStop(1,'hsl('+hue+',55%,10%)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,255,255,.12)';ctx.font=C.font(w*.3,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),x+w/2,y+h/2);}
  ctx.restore();ctx.strokeStyle=glow?BLUE:'rgba(255,255,255,.3)';ctx.lineWidth=glow?5:3;ctx.beginPath();ctx.roundRect(x,y,w,h,w*.1);ctx.stroke();ctx.restore();}
// ---- V5 phonewall
C.CARDS.phonewall={assets:d=>(Array.isArray(d.shots)?d.shots:[]).map(S).filter(k=>k&&!slot(k)),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.vBase(ctx,t);const n=Math.max(2,Math.min(10,Math.round(+d.n||(Array.isArray(d.shots)&&d.shots.length)||3))),shots=Array.isArray(d.shots)?d.shots.map(S):[],labels=Array.isArray(d.labels)?d.labels.map(S):[],hl=Math.round(+d.hl||0),fan=S(d.mode)!=='row'&&n<=6;
  ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.05,.5));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),W/2,95+12*(1-tp),1600,1,58,32,{wt:700});ctx.globalAlpha=oa;}
  const top=d.title?150:70,z=1+.04*t/sc.dur;
  if(fan){const ph=H-top-250,pw=ph*9/16,span=Math.min(W-500,(n-1)*pw*.8),cy=top+ph/2+20;
    for(let i=0;i<n;i++){const a0=.2+i*.18,p=E.back(C.prog(t,a0,a0+.6));if(p<=0)continue;const u=n>1?i/(n-1)-.5:0,cx=W/2+u*span,rot=u*.34,yy=cy+Math.abs(u)*70+(1-Math.min(1,p))*80,g=hl===i+1;
      ctx.save();ctx.translate(cx,yy);ctx.rotate(rot);ctx.scale(z*(g?1.06:1),z*(g?1.06:1));phone(ctx,-pw/2,-ph/2,pw,ph,pimg(shots[i]),i,g,Math.min(1,p*1.5)*(hl&&!g?.55:1));ctx.restore();}}
  else{const rows=n>5?2:1,per=Math.ceil(n/rows),availH=H-top-(rows>1?60:110),ph=Math.min(availH/rows-30,(W-200)/per/(9/16)*.95),pw=ph*9/16,gap=Math.min(50,(W-200-per*pw)/Math.max(1,per-1));
    for(let i=0;i<n;i++){const r=Math.floor(i/per),c=i%per,cnt=r===rows-1?n-per*(rows-1):per,rw=cnt*pw+(cnt-1)*gap,x=W/2-rw/2+c*(pw+gap),y=top+(availH-rows*(ph+30))/2+r*(ph+30)+10,a0=.2+i*.12,p=E.out(C.prog(t,a0,a0+.5));if(p<=0)continue;const g=hl===i+1;
      phone(ctx,x,y+(1-p)*50,pw,ph,pimg(shots[i]),i,g,p*(hl&&!g?.55:1));}}
  const li=hl>0?hl-1:-1;if(li>=0&&labels[li]){const lp=E.out(C.prog(t,.9,1.4));ctx.globalAlpha=oa*lp;C.vText(ctx,labels[li],W/2,H-62+14*(1-lp),1600,1,54,30,{wt:600});}
  ctx.restore();}};
// ---- V6 numgrid
C.nItems=d=>(Array.isArray(d.items)?d.items:[]).map(S).filter(Boolean).slice(0,8).map(s=>{const a=s.split('|');return a.length>1?{n:S(a[0]),l:S(a.slice(1).join('|'))}:{n:'',l:S(a[0])};});
C.CARDS.numgrid={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=C.nItems(d);C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-8 "number|label" do');return;}
  const n=it.length,cols=n<=4?n:Math.ceil(n/2),rows=Math.ceil(n/cols),top=d.title?190:110,cw=Math.min(380,(W-240-(cols-1)*36)/cols),ch=Math.min(330,(H-top-140-(rows-1)*36)/rows),hl=Math.round(+d.hl||0);
  ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.05,.5));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),W/2,100+12*(1-tp),1600,1,60,34,{wt:700});ctx.globalAlpha=oa;}
  const gh=rows*ch+(rows-1)*36,y0=top+(H-top-110-gh)/2;
  it.forEach((o,i)=>{const r=Math.floor(i/cols),c=i%cols,cnt=r===rows-1?n-cols*(rows-1):cols,rw=cnt*cw+(cnt-1)*36,x=W/2-rw/2+c*(cw+36),y=y0+r*(ch+36),a0=.3+i*.2,p=E.out(C.prog(t,a0,a0+.5));if(p<=0)return;
    const glow=hl?hl===i+1:(t>.3+n*.2+.2?false:Math.floor((t-.3)/.2)===i);
    ctx.save();ctx.globalAlpha=oa*p*(hl&&!glow?.5:1);ctx.translate(0,(1-p)*30);ctx.shadowColor=glow?'rgba(59,155,255,.85)':'rgba(0,0,0,.4)';ctx.shadowBlur=glow?44:18;ctx.fillStyle='rgba(18,28,50,.92)';ctx.beginPath();ctx.roundRect(x,y,cw,ch,28);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=glow?BLUE:'rgba(255,255,255,.16)';ctx.lineWidth=glow?4:2;ctx.stroke();
    if(o.n){ctx.font=C.font(Math.min(110,ch*.36),900);ctx.fillStyle=glow?BLUE:'#5d6b88';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.n,x+cw/2,y+ch*.32);}
    C.vText(ctx,o.l,x+cw/2,y+ch*(o.n?.7:.5),cw-44,3,46,26,{wt:700});ctx.restore();});
  ctx.restore();}};
// ---- V7 compare2
function win(ctx,x,y,w,h,im,url,al,glow,z){ctx.save();ctx.globalAlpha=(ctx.globalAlpha||1)*al;ctx.shadowColor=glow?'rgba(59,155,255,.85)':'rgba(0,0,0,.5)';ctx.shadowBlur=glow?46:26;ctx.fillStyle='#161d2e';ctx.beginPath();ctx.roundRect(x,y,w,h,22);ctx.fill();ctx.shadowBlur=0;
  ['#ff5f57','#febc2e','#28c840'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x+34+i*30,y+30,8,0,Math.PI*2);ctx.fill();});
  if(url){ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.roundRect(x+150,y+12,w-190,36,18);ctx.fill();ctx.fillStyle='#8b97ad';ctx.font=C.font(24,600);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(url,x+172,y+31);}
  ctx.save();ctx.beginPath();ctx.roundRect(x+6,y+62,w-12,h-68,[0,0,18,18]);ctx.clip();
  if(im)coverImg(ctx,im,x+6,y+62,w-12,h-68,z);else{ctx.fillStyle='#0d1322';ctx.fillRect(x,y+62,w,h);ctx.fillStyle='rgba(255,255,255,.09)';for(let k=0;k<6;k++){const ww=(w-120)*(k%3===1?.6:k%3===2?.8:1);ctx.beginPath();ctx.roundRect(x+50,y+100+k*((h-170)/6),ww,(h-170)/6-26,10);ctx.fill();}}
  ctx.restore();ctx.strokeStyle=glow?BLUE:'rgba(255,255,255,.18)';ctx.lineWidth=glow?4:2;ctx.beginPath();ctx.roundRect(x,y,w,h,22);ctx.stroke();ctx.restore();}
C.CARDS.compare2={assets:d=>[d.ia,d.ib].map(S).filter(k=>k&&!slot(k)),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),hl=Math.round(+d.hl||0);C.vBase(ctx,t);
  ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.05,.5));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),W/2,95+12*(1-tp),1600,1,58,32,{wt:700});ctx.globalAlpha=oa;}
  const top=d.title?160:90,ww=(W-380)/2,wh=H-top-(d.la||d.lb?210:100),z=1+.03*t/sc.dur;
  [["a"],["b"]].forEach((q,i)=>{const k=q[0],x=i?W-190-ww:190,a0=.2+i*.3,p=E.out(C.prog(t,a0,a0+.6));if(p<=0)return;const g=hl===i+1;
    win(ctx,x+(i?1:-1)*(1-p)*60,top,ww,wh,pimg(S(d['i'+k])),S(d['u'+k]),p*(hl&&!g?.55:1),g,z);
    const lt=S(d['l'+k]);if(lt){const lp=E.out(C.prog(t,a0+.5,a0+1.0));ctx.globalAlpha=oa*lp*(hl&&!g?.55:1);C.vText(ctx,lt,x+ww/2,top+wh+80+12*(1-lp),ww-20,2,58,30,{wt:700});ctx.globalAlpha=oa;}});
  const vp=E.back(C.prog(t,.9,1.3));if(vp>0){const r=40*Math.min(1,vp);ctx.fillStyle='#0b1222';ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();ctx.arc(W/2,top+wh/2,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font=C.font(r*.7,800);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('VS',W/2,top+wh/2+2);}
  ctx.restore();}};
})();
