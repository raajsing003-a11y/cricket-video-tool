// C128 (G5 + G6 + V3 + V4): Video-3 "premium minimal" style (docs/REFERENCE_EXPLAINER_STYLE.md, VIDEO 3). Sirf wide.
// G5 helper: text mein *shabd* = BLUE + serif ITALIC (C.vText). G6 helper: curved annotation arrows (C.vArrows).
// bullets  (V3): data:{title:'', items:['पहली *लाइन*','दूसरी *लाइन*'] (2-5, *shabd* = blue serif italic), c:'b', bg} -> lines ek-ek karke aati hain
// phoneann (V4): data:{title:'', clip:'Clips mein upload kiya naam' ya shot:'photo slot / asset', start:0, arrows:['label|x|y'] (0-5; x,y = frame par % jagah, label mein *shabd* chalta hai), sub:'', c:'b', bg}
//   -> vertical phone-frame (clip/photo) + patli curved arrows draw hoti hain + dot + label
(function(){const C=window.CORE,E=C.ease;
const BLUE='#3b9bff',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#3b9bff'},S=v=>v==null?'':String(v).trim();
const SERIF=px=>'italic 600 '+px+'px Georgia, "Times New Roman", serif';
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const PH='07_photo_slot_placeholders/ph_silhouette_dark';
function vBase(ctx,t){const W=C.W,H=C.H;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0e19');g.addColorStop(1,'#131b2e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,255,.022)';for(let x=60;x<W;x+=120)ctx.fillRect(x,0,2,H);
  const cx=W/2+Math.sin(t*.35)*70,rg=ctx.createRadialGradient(cx,H*.62,40,cx,H*.62,W*.62);rg.addColorStop(0,'rgba(45,100,215,.26)');rg.addColorStop(1,'rgba(45,100,215,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);}
C.vBase=vBase;C.vSerif=SERIF;
// ---- G5: accent text. word mein *x* ho to blue serif italic
C.vLayout=function(ctx,str,maxW,px,wt){const toks=C.rToks(str);ctx.font=C.font(px,wt);const sp=ctx.measureText(' ').width,lines=[];let cur=[],cw=0;
  toks.forEach(k=>{ctx.font=k.hl?SERIF(Math.round(px*1.06)):C.font(px,wt);const wd=ctx.measureText(k.w).width;if(cur.length&&cw+sp+wd>maxW){lines.push({a:cur,w:cw});cur=[];cw=0;}k.wd=wd;k.x=cur.length?cw+sp:0;cw=k.x+wd;cur.push(k);});
  if(cur.length)lines.push({a:cur,w:cw});return lines;};
C.vFit=function(ctx,str,maxW,maxLines,px,min,wt){let p=px,L;for(;p>=min;p-=2){L=C.vLayout(ctx,str,maxW,p,wt);if(L.length<=maxLines)break;}L=C.vLayout(ctx,str,maxW,p,wt);return{px:p,lines:L};};
// o:{align:'center'|'left'|'right', wt, col, upTo (kitne shabd dikhen, float), lh}
C.vText=function(ctx,str,x,y,maxW,maxLines,px,min,o){o=o||{};const wt=o.wt||700,f=C.vFit(ctx,String(str),maxW,maxLines,px,min,wt),lh=f.px*(o.lh||1.25),tot=f.lines.length*lh;let k=0;
  ctx.save();ctx.textAlign='left';ctx.textBaseline='middle';const ga=ctx.globalAlpha;
  f.lines.forEach((L,li)=>{const x0=o.align==='left'?x:o.align==='right'?x-L.w:x-L.w/2,yy=y-tot/2+lh/2+li*lh;
    L.a.forEach(wd=>{let a=1;if(o.upTo!=null)a=Math.max(0,Math.min(1,o.upTo-k));k++;if(a<=0)return;ctx.globalAlpha=ga*a;
      if(wd.hl){ctx.font=SERIF(Math.round(f.px*1.06));ctx.fillStyle=BLUE;ctx.shadowColor=BLUE;ctx.shadowBlur=16;}else{ctx.font=C.font(f.px,wt);ctx.fillStyle=o.col||'#fff';ctx.shadowBlur=0;}
      ctx.fillText(wd.w,x0+wd.x,yy);});});
  ctx.restore();return{h:tot,px:f.px,lines:f.lines.length};};
// ---- G6: annotation arrows. items: [{l,x,y}] (x,y = box par %)
C.vArrowItems=d=>(Array.isArray(d.arrows)?d.arrows:[]).slice(0,5).map(s=>{const a=String(s).split('|');return{l:S(a[0]),x:parseFloat(a[1]),y:parseFloat(a[2])};}).filter(o=>o.l&&isFinite(o.x)&&isFinite(o.y)&&o.x>=0&&o.x<=100&&o.y>=0&&o.y<=100);
C.vArrows=function(ctx,t,items,box,t0,oa){const W=C.W,H=C.H;
  items.forEach((o,i)=>{const a0=t0+i*.75,p=E.out(C.prog(t,a0,a0+1.0));if(p<=0)return;const left=o.x<50,tx=box.x+box.w*o.x/100,ty=box.y+box.h*o.y/100,
      sx=left?box.x-110:box.x+box.w+110,sy=Math.max(150,Math.min(H-130,ty+(i%2?110:-110))),cx=sx+(tx-sx)*.55,cy=sy;
    const pt=u=>{const a=(1-u)*(1-u),b=2*u*(1-u),c=u*u;return[a*sx+b*cx+c*tx,a*sy+b*cy+c*ty];};
    ctx.save();ctx.globalAlpha=oa;ctx.strokeStyle='rgba(255,255,255,.88)';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=8;
    ctx.beginPath();const n=44,m=Math.max(1,Math.round(n*p));for(let s=0;s<=m;s++){const q=pt(s/n);if(s)ctx.lineTo(q[0],q[1]);else ctx.moveTo(q[0],q[1]);}ctx.stroke();
    const dp=E.back(C.prog(t,a0+.8,a0+1.2));if(dp>0){const r=12*Math.min(1.2,dp);ctx.shadowBlur=0;ctx.fillStyle=BLUE;ctx.beginPath();ctx.arc(tx,ty,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(59,155,255,.55)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(tx,ty,r+8+4*Math.sin(t*4+i),0,Math.PI*2);ctx.stroke();}
    const lp=E.out(C.prog(t,a0,a0+.5));ctx.globalAlpha=oa*lp;const mw=left?sx-70:W-sx-70;C.vText(ctx,o.l,left?sx-18:sx+18,sy,Math.max(300,mw),2,54,28,{align:left?'right':'left',wt:700});
    ctx.restore();});};
// ---- V3 bullets
C.vItems=d=>(Array.isArray(d.items)?d.items:[]).map(S).filter(Boolean).slice(0,5);
C.CARDS.bullets={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=C.vItems(d);vBase(ctx,t);
  if(it.length<2){ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('items mein 2-5 lines do',W/2,H/2);return;}
  ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.05,.5));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),W/2,118+14*(1-tp),1600,1,58,34,{wt:700,col:'#8b97ad'});ctx.globalAlpha=oa;}
  const n=it.length,px=n<=3?100:n===4?88:78,lh=px*1.62,top=H/2+(d.title?40:0)-(n*lh)/2+lh/2,x0=300;
  it.forEach((s,i)=>{const a0=.45+i*.8,p=E.out(C.prog(t,a0,a0+.6));if(p<=0)return;ctx.save();ctx.globalAlpha=oa*p;ctx.translate(0,(1-p)*26);const y=top+i*lh;
    ctx.font=C.font(Math.round(px*.4),700);ctx.fillStyle='#4b5873';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(String(i+1).padStart(2,'0'),x0-150,y);
    ctx.fillStyle='rgba(59,155,255,.5)';ctx.fillRect(x0-62,y-px*.38,3,px*.76);
    C.vText(ctx,s,x0,y,W-x0-220,1,px,38,{align:'left',wt:600});ctx.restore();});
  ctx.restore();}};
// ---- V4 phoneann
C.CARDS.phoneann={assets:d=>{const a=[];if(S(d.shot)&&!slot(S(d.shot)))a.push(S(d.shot));a.push(PH);return a;},
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),ia=E.out(C.prog(t,0,.5));vBase(ctx,t);
  const top=d.title?170:100,fh=H-top-(d.sub?190:90),fw=fh*9/16,fx=W/2-fw/2,fy=top+(1-ia)*40,z=1+.05*t/sc.dur;
  ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.05,.5));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),W/2,92+12*(1-tp),1600,1,60,34,{wt:700});ctx.globalAlpha=oa;}
  ctx.save();ctx.globalAlpha=oa*ia;ctx.shadowColor='rgba(40,110,230,.45)';ctx.shadowBlur=60;ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(fx,fy,fw,fh,48);ctx.fill();ctx.shadowBlur=0;
  ctx.save();ctx.beginPath();ctx.roundRect(fx+8,fy+8,fw-16,fh-16,40);ctx.clip();
  const x=C.clipAt?C.clipAt(sc,C.starts[C.scenes.indexOf(sc)]+t):null,k=S(d.shot),im=k?((C.photos&&C.photos[k])||C.img(k)):null;
  if(x){const v=x.c.video,vw=x.c.w||1080,vh=x.c.h||1920,s=Math.max((fw-16)/vw,(fh-16)/vh)*z,dw=vw*s,dh=vh*s;try{ctx.drawImage(v,fx+fw/2-dw/2,fy+fh/2-dh/2,dw,dh);}catch(e){}}
  else if(im){const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.max((fw-16)/iw,(fh-16)/ih)*z,dw=iw*s,dh=ih*s;ctx.drawImage(im,fx+fw/2-dw/2,fy+fh/2-dh/2,dw,dh);}
  else{ctx.fillStyle='#0f1626';ctx.fillRect(fx,fy,fw,fh);ctx.fillStyle='#6b7a96';ctx.font=C.font(40,700);ctx.textAlign='center';ctx.fillText(S(d.clip)?'clip nahi mila — 🎞 Clips':'clip ya shot do',fx+fw/2,fy+fh/2);}
  ctx.restore();ctx.strokeStyle='rgba(255,255,255,.32)';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(fx,fy,fw,fh,48);ctx.stroke();
  ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(fx+fw/2-70,fy+16,140,30,15);ctx.fill();ctx.restore();
  C.vArrows(ctx,t,C.vArrowItems(d),{x:fx,y:fy,w:fw,h:fh},.9,oa);
  if(d.sub){const sp=E.out(C.prog(t,.5,1.1));ctx.globalAlpha=oa*sp;C.vText(ctx,S(d.sub),W/2,H-90+16*(1-sp),1640,2,56,30,{wt:600});}
  ctx.restore();}};
})();
