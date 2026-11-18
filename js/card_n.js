// C132 (G9, G10, G8 + N1-N8): Video-4 style (neon icon-card tutorial). card_v.js ke C.vBase/C.vText use karte hain. Sirf wide.
// Helpers: C.popAt(t,i,a0,gap) = G9 pop-in sequencer (bounce 0..~1.1) | C.nText(...) = G10 neon glow / red outline text | C.spotRect(...) = G8 spotlight dim + hole
// icontiles  (N1): data:{title:'', items:['06_icons/icon_tile_neon_headphones_green|Clean|g' ya '🎤|Mic|r'] (2-4, 'icon|label|colour y/g/r/b'), hl:0 (1..n = baaki dim), bg}
// stepcards  (N2): data:{head:'Step no.2', items:['Recording','AI enhance','Editing'] (2-4, 'icon|label' bhi chalta), hl:0, c:'b'|'r'|'g'|'y', bg}
// screenclip (N3 phone / N4 wide): data:{mode:'phone'|'wide', title:'', clip:'Clips naam', shot:'slot/asset', start:0, focus:'x|y|w|h' (% mein, spotlight + zoom), at:1.5 (kis sec par zoom shuru), tap:true, label:'bada callout', sub:'', bg}
// toggle     (N5): data:{title:'', items:['AI Voice|x','original Voice|v'] (2-3, 'label|x' ya 'label|v'), hl:0 (1..n = baaki dim), bg}
// askq       (N6): data:{head:'MOSTLY ASKED QUESTION?', name:'@naam', text:'comment text', audio:true, bg}
// promo      (N7): data:{name:'Channel naam', logo:'slot/asset', subs:'339k' (Rahul khud likhe; khali = pill nahi), thumbs:['slot/asset',..] (0-3), btn:'SUBSCRIBE', note:'', bg}
// outword    (N8): data:{words:'PROFESSIONAL' (space = alag shabd, ek-ek karke), img:'slot/asset' (optional, side mein), sub:'', c:'r'|'b', bg}
(function(){const C=window.CORE,E=C.ease;
const NEON={b:'#3b9bff',r:'#ff3b4e',g:'#2ee67a',y:'#ffd23b'},S=v=>v==null?'':String(v).trim();
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const pimg=k=>k?((C.photos&&C.photos[k])||C.img(k)):null;
const PH='07_photo_slot_placeholders/ph_silhouette_dark';
const msg=(ctx,t)=>{ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,C.W/2,C.H/2);};
const needAsset=k=>k&&k.indexOf('/')>=0&&!slot(k);
// ---- G9: pop-in sequencer. i-th element, start a0, gap sec. Return 0..~1.1 (back ease)
C.popAt=(t,i,a0,gap,dur)=>E.back(C.prog(t,a0+i*gap,a0+i*gap+(dur||.55)));
// ---- G10: neon text. o:{col:'b'|'r'|'g'|'y'|'#hex', mode:'glow'(fill+glow)|'outline'(khali, bahar line), align, wt, px lines}
C.nText=function(ctx,str,x,y,maxW,maxLines,px,min,o){o=o||{};const col=NEON[o.col]||o.col||NEON.b,wt=o.wt||900,f=C.fitText(ctx,String(str),maxW,maxLines,px,min,wt),lh=f.px*(o.lh||1.18),tot=f.lines.length*lh;
  ctx.save();ctx.font=C.font(f.px,wt);ctx.textAlign=o.align||'center';ctx.textBaseline='middle';ctx.lineJoin='round';
  f.lines.forEach((ln,i)=>{const yy=y-tot/2+lh/2+i*lh;
    if(o.mode==='outline'){ctx.shadowColor=col;ctx.shadowBlur=o.glow==null?26:o.glow;ctx.strokeStyle=col;ctx.lineWidth=Math.max(3,f.px*.055);ctx.strokeText(ln,x,yy);ctx.shadowBlur=0;ctx.fillStyle=o.fill||'rgba(255,255,255,.06)';ctx.fillText(ln,x,yy);}
    else{ctx.shadowColor=col;ctx.shadowBlur=o.glow==null?34:o.glow;ctx.fillStyle='#fff';ctx.fillText(ln,x,yy);ctx.shadowBlur=14;ctx.fillText(ln,x,yy);ctx.shadowBlur=0;ctx.lineWidth=Math.max(2,f.px*.03);ctx.strokeStyle=col;ctx.strokeText(ln,x,yy);ctx.fillStyle='#fff';ctx.fillText(ln,x,yy);}});
  ctx.restore();return{px:f.px,h:tot,lines:f.lines.length};};
// ---- G8: spotlight. Zoom transform lagao (zoomBegin), phir dim+hole (zoomEnd). frame={x,y,w,h}, r={x,y,w,h} frame ke andar (unzoomed px), p 0..1
C.spotZoom=function(ctx,w,h,r,p,kmax){const k=1+(kmax-1)*p,ax=w/2+((r.x+r.w/2)-w/2)*p,ay=h/2+((r.y+r.h/2)-h/2)*p;ctx.translate(w/2,h/2);ctx.scale(k,k);ctx.translate(-ax,-ay);return k;};
C.spotRect=function(ctx,fr,r,p,k,col){if(p<=0)return;const B=4000;ctx.save();ctx.fillStyle='rgba(2,6,16,'+(.62*p)+')';ctx.beginPath();ctx.rect(-B,-B,B*2,B*2);ctx.roundRect(r.x,r.y,r.w,r.h,18/k);ctx.fill('evenodd');
  ctx.globalAlpha=p;ctx.shadowColor=col;ctx.shadowBlur=26;ctx.strokeStyle=col;ctx.lineWidth=4/k;ctx.beginPath();ctx.roundRect(r.x,r.y,r.w,r.h,18/k);ctx.stroke();ctx.restore();};
function coverImg(ctx,im,x,y,w,h,z){if(!im)return;const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.max(w/iw,h/ih)*(z||1);ctx.drawImage(im,x+w/2-iw*s/2,y+h/2-ih*s/2,iw*s,ih*s);}
function glass(ctx,x,y,w,h,r,col,glow,al){ctx.save();ctx.globalAlpha=(ctx.globalAlpha||1)*(al==null?1:al);ctx.shadowColor=col;ctx.shadowBlur=glow?40:14;ctx.fillStyle='rgba(14,22,44,.93)';ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=col;ctx.lineWidth=glow?5:3;ctx.stroke();ctx.restore();}
function pill(ctx,txt,cx,cy,w,h,col){ctx.save();ctx.shadowColor=col;ctx.shadowBlur=18;ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(cx-w/2,cy-h/2,w,h,h/2);ctx.fill();ctx.shadowBlur=0;const f=C.fitText(ctx,txt,w-36,1,h*.52,18,800);ctx.font=C.font(f.px,800);ctx.fillStyle=(col===NEON.y||col===NEON.g)?'#0a1020':'#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],cx,cy+2);ctx.restore();}
function head(ctx,t,d,oa,y){if(!d.title)return;const tp=E.out(C.prog(t,.05,.5));ctx.save();ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),C.W/2,y+12*(1-tp),1600,1,58,32,{wt:700});ctx.restore();}
const parts=(arr,n)=>(Array.isArray(arr)?arr:[]).map(S).filter(Boolean).slice(0,n).map(s=>s.split('|').map(x=>x.trim()));
// ---- N1 icontiles
C.nTiles=d=>parts(d.items,4).map(a=>a.length>=3?{ic:a[0],l:a[1],c:a[2]}:a.length===2?{ic:a[0],l:a[1],c:''}:{ic:'',l:a[0],c:''});
C.CARDS.icontiles={assets:d=>C.nTiles(d).map(o=>o.ic).filter(needAsset),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=C.nTiles(d),hl=Math.round(+d.hl||0);C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-4 "icon|label|colour" do');return;}
  ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,100);
  const n=it.length,tw=n>3?330:380,gap=n>3?56:80,x0=W/2-(n*tw+(n-1)*gap)/2,th=tw,ty=Math.round((H-th-120)/2+(d.title?40:0));
  it.forEach((o,i)=>{const p=C.popAt(t,i,.3,.35);if(p<=0)return;const col=NEON[o.c]||[NEON.r,NEON.g,NEON.y,NEON.b][i%4],on=!hl||hl===i+1,x=x0+i*(tw+gap),cx=x+tw/2,cy=ty+th/2,s=Math.max(.01,Math.min(1.1,p));
    ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.6)*(on?1:.4);ctx.translate(cx,cy);ctx.scale(s,s);ctx.translate(-cx,-cy);glass(ctx,x,ty,tw,th,44,col,on&&(hl===i+1||t<.3+i*.35+1.2),1);
    const im=needAsset(o.ic)||o.ic.indexOf('/')>=0?C.img(o.ic):null;
    if(im){const k=Math.min((tw-70)/im.width,(th-70)/im.height);ctx.drawImage(im,cx-im.width*k/2,cy-im.height*k/2,im.width*k,im.height*k);}
    else{ctx.font=C.font(tw*.5,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.ic||String(i+1),cx,cy+6);}
    ctx.restore();
    const lp=E.out(C.prog(t,.3+i*.35+.3,.3+i*.35+.8));if(lp>0){ctx.save();ctx.globalAlpha=oa*lp*(on?1:.4);pill(ctx,o.l,cx+(1-lp)*-40,ty+th+70,Math.min(tw+30,tw-10+o.l.length*6),70,col);ctx.restore();}});
  ctx.restore();}};
// ---- N2 stepcards
C.nCards=d=>parts(d.items,4).map(a=>a.length>=2?{ic:a[0],l:a.slice(1).join('|')}:{ic:'',l:a[0]});
C.CARDS.stepcards={assets:d=>C.nCards(d).map(o=>o.ic).filter(needAsset),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=C.nCards(d),hl=Math.round(+d.hl||0),col=NEON[d.c]||NEON.b;C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-4 card do');return;}
  ctx.save();ctx.globalAlpha=oa;
  const hp=E.back(C.prog(t,.05,.6));if(S(d.head)&&hp>0){ctx.globalAlpha=oa*Math.min(1,hp*1.5);C.nText(ctx,S(d.head),W/2,150+(1-Math.min(1,hp))*40,1500,1,120,56,{col:d.c==='r'?'r':'b',mode:'glow'});ctx.globalAlpha=oa;}
  const n=it.length,cw=n>3?330:380,ch=cw*1.38,gap=n>3?36:50,cy=(S(d.head)?680:600);
  it.forEach((o,i)=>{const p=C.popAt(t,i,.55,.3,.6);if(p<=0)return;const u=n>1?i-(n-1)/2:0,on=!hl||hl===i+1,cx=W/2+u*(cw+gap),yy=cy+Math.abs(u)*28+(1-Math.min(1,p))*120,rot=u*.07;
    ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5)*(on?1:.45);ctx.translate(cx,yy);ctx.rotate(rot);ctx.scale(Math.min(1.08,p)*(hl===i+1?1.06:1),Math.min(1.08,p)*(hl===i+1?1.06:1));
    glass(ctx,-cw/2,-ch/2,cw,ch,34,col,on&&(!hl||hl===i+1),1);
    ctx.fillStyle='rgba(255,255,255,.07)';ctx.font=C.font(52,900);ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(String(i+1),-cw/2+26,-ch/2+18);
    const im=needAsset(o.ic)?C.img(o.ic):null;
    if(im){const k=Math.min((cw-90)/im.width,(ch*.5)/im.height);ctx.drawImage(im,-im.width*k/2,-ch*.32-im.height*k/2+30,im.width*k,im.height*k);}
    else if(o.ic){ctx.font=C.font(cw*.36,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.ic,0,-ch*.12);}
    else{ctx.strokeStyle=col;ctx.lineWidth=4;ctx.globalAlpha*=.7;ctx.beginPath();ctx.arc(0,-ch*.12,cw*.18,0,Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=oa*Math.min(1,p*1.5)*(on?1:.45);C.nText(ctx,o.l,0,ch*.3,cw-50,2,56,28,{col:on?col:'#5d6b88',mode:'glow',glow:on?22:0});ctx.restore();});
  ctx.restore();}};
// ---- N3/N4 screenclip (G8 spotlight zoom)
C.nFocus=d=>{const a=S(d.focus).split('|').map(parseFloat);return(a.length===4&&a.every(isFinite)&&a[2]>0&&a[3]>0)?{x:a[0],y:a[1],w:a[2],h:a[3]}:null;};
C.CARDS.screenclip={assets:d=>{const a=[PH];if(needAsset(S(d.shot)))a.push(S(d.shot));return a;},
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),ia=E.out(C.prog(t,0,.5)),phone=S(d.mode)!=='wide',col=NEON.b;C.vBase(ctx,t);
  const top=d.title?170:90,bot=(d.sub||d.label)?200:80,availH=H-top-bot;let fw,fh;if(phone){fh=availH;fw=fh*9/16;}else{fw=Math.min(W-240,availH*16/9);fh=fw*9/16;}
  const fx=W/2-fw/2,fy=top+(availH-fh)/2+(1-ia)*40;ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,95);
  ctx.save();ctx.globalAlpha=oa*ia;ctx.shadowColor='rgba(40,110,230,.5)';ctx.shadowBlur=60;ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(fx,fy,fw,fh,phone?44:22);ctx.fill();ctx.shadowBlur=0;
  const pad=phone?8:6,inner={x:fx+pad,y:fy+pad,w:fw-pad*2,h:fh-pad*2};ctx.save();ctx.beginPath();ctx.roundRect(inner.x,inner.y,inner.w,inner.h,phone?36:18);ctx.clip();
  const fo=C.nFocus(d),at=+d.at>=0&&d.at!==''&&d.at!=null?+d.at:1.5,zp=fo?E.io(C.prog(t,at,at+.9)):0;
  const r=fo?{x:fo.x/100*inner.w,y:fo.y/100*inner.h,w:fo.w/100*inner.w,h:fo.h/100*inner.h}:null,kmax=fo?Math.max(1.2,Math.min(3.2,Math.min(inner.w/r.w,inner.h/r.h)*.7)):1;
  ctx.save();ctx.translate(inner.x,inner.y);const fr0={x:0,y:0,w:inner.w,h:inner.h};let k=1;
  if(fo)k=C.spotZoom(ctx,inner.w,inner.h,r,zp,kmax);
  const x=C.clipAt?C.clipAt(sc,C.starts[C.scenes.indexOf(sc)]+t):null,kk=S(d.shot),im=kk?pimg(kk):null,z=1+.02*t/sc.dur;
  if(x){const v=x.c.video,vw=x.c.w||1080,vh=x.c.h||1920,s=Math.max(inner.w/vw,inner.h/vh)*z;try{ctx.drawImage(v,inner.w/2-vw*s/2,inner.h/2-vh*s/2,vw*s,vh*s);}catch(e){}}
  else if(im)coverImg(ctx,im,0,0,inner.w,inner.h,z);
  else{ctx.fillStyle='#0f1626';ctx.fillRect(0,0,inner.w,inner.h);ctx.fillStyle='rgba(255,255,255,.08)';for(let q=0;q<7;q++){ctx.beginPath();ctx.roundRect(inner.w*.08,inner.h*(.1+q*.12),inner.w*(q%3===1?.5:q%3===2?.7:.84),inner.h*.07,12);ctx.fill();}ctx.fillStyle='#6b7a96';ctx.font=C.font(Math.min(44,inner.w*.05),700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S(d.clip)?'clip nahi mila — 🎞 Clips':'clip ya shot do',inner.w/2,inner.h/2);}
  if(fo){C.spotRect(ctx,fr0,r,zp,k,col);
    if(d.tap!==false&&zp>.6){const tt=Math.max(0,t-(at+.6)),cx=r.x+r.w/2,cy=r.y+r.h/2,ph=(tt%1.1)/1.1;ctx.save();ctx.globalAlpha=Math.min(1,tt*3);ctx.fillStyle='rgba(255,255,255,.95)';ctx.shadowColor=col;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(cx,cy,14/k,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,'+(1-ph)+')';ctx.lineWidth=5/k;ctx.beginPath();ctx.arc(cx,cy,(18+70*ph)/k,0,Math.PI*2);ctx.stroke();ctx.restore();}}
  ctx.restore();ctx.restore();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=phone?5:3;ctx.beginPath();ctx.roundRect(fx,fy,fw,fh,phone?44:22);ctx.stroke();
  if(phone){ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(fx+fw/2-70,fy+14,140,28,14);ctx.fill();}ctx.restore();
  const lb=S(d.label)||S(d.sub);if(lb){const lp=E.out(C.prog(t,fo?at+.5:.6,fo?at+1.1:1.2));ctx.globalAlpha=oa*lp;if(S(d.label))C.nText(ctx,S(d.label),W/2,H-96+16*(1-lp),1600,1,76,36,{col:'b',mode:'glow'});else C.vText(ctx,S(d.sub),W/2,H-96+16*(1-lp),1640,2,56,30,{wt:600});}
  ctx.restore();}};
// ---- N5 toggle
C.nToggles=d=>parts(d.items,3).map(a=>{const m=(a[1]||'').toLowerCase();return{l:a[0],ok:!(m==='x'||m==='✗'||m==='0'||m==='no'||m==='false')};});
C.CARDS.toggle={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=C.nToggles(d),hl=Math.round(+d.hl||0);C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-3 "label|x ya v" do');return;}
  ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,100);
  const n=it.length,pw=Math.min(1100,W-300),ph=n>2?170:200,gap=44,tot=n*ph+(n-1)*gap,y0=(d.title?190:120)+(H-(d.title?190:120)-120-tot)/2;
  it.forEach((o,i)=>{const p=E.out(C.prog(t,.3+i*.7,.3+i*.7+.5));if(p<=0)return;const col=o.ok?NEON.g:NEON.r,on=!hl||hl===i+1,x=W/2-pw/2+(i%2?1:-1)*(1-p)*120,y=y0+i*(ph+gap);
    ctx.save();ctx.globalAlpha=oa*p*(on?1:.4);glass(ctx,x,y,pw,ph,ph/2,col,on&&(hl===i+1||!hl),1);
    const c0=.3+i*.7+.45,mp=E.back(C.prog(t,c0,c0+.5)),cx=x+ph/2+14,cy=y+ph/2,R=ph*.34;
    if(mp>0){ctx.save();ctx.translate(cx,cy);ctx.scale(Math.min(1.1,mp),Math.min(1.1,mp));ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=26;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=R*.2;ctx.lineCap='round';ctx.lineJoin='round';
      const dp=E.out(C.prog(t,c0+.15,c0+.6));ctx.beginPath();
      if(o.ok){const a=[-R*.42,R*.02],b=[-R*.08,R*.36],c=[R*.46,-R*.34];if(dp<.5){const q=dp/.5;ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q);}else{const q=(dp-.5)/.5;ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[0]+(c[0]-b[0])*q,b[1]+(c[1]-b[1])*q);}}
      else{const q1=Math.min(1,dp*2),q2=Math.max(0,dp*2-1),e=R*.38;ctx.moveTo(-e,-e);ctx.lineTo(-e+2*e*q1,-e+2*e*q1);if(q2>0){ctx.moveTo(e,-e);ctx.lineTo(e-2*e*q2,-e+2*e*q2);}}
      ctx.stroke();ctx.restore();}
    C.vText(ctx,o.l,x+ph+30+(pw-ph-60)/2,y+ph/2,pw-ph-90,2,n>2?64:74,30,{wt:800,col:on?'#fff':'#7a869e'});ctx.restore();});
  ctx.restore();}};
// ---- N6 askq
C.CARDS.askq={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),name=S(d.name)||'@viewer',txt=S(d.text);C.vBase(ctx,t);if(!txt){msg(ctx,'text mein comment likho');return;}
  ctx.save();ctx.globalAlpha=oa;const hp=E.back(C.prog(t,.05,.6)),hd=S(d.head)||'MOSTLY ASKED QUESTION?';
  if(hp>0){ctx.globalAlpha=oa*Math.min(1,hp*1.5);C.nText(ctx,hd,W/2,150+(1-Math.min(1,hp))*30,1600,1,104,48,{col:'r',mode:'outline'});ctx.globalAlpha=oa;}
  const cw=Math.min(1400,W-320),cx=W/2-cw/2,cy=300,ch=d.audio===false?420:560,cp=E.out(C.prog(t,.45,1.0));
  ctx.save();ctx.globalAlpha=oa*cp;ctx.translate(0,(1-cp)*50);glass(ctx,cx,cy,cw,ch,44,NEON.b,true,1);
  ctx.fillStyle='#1f3a74';ctx.beginPath();ctx.arc(cx+110,cy+110,56,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font=C.font(58,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((name.replace('@','')[0]||'?').toUpperCase(),cx+110,cy+114);
  ctx.textAlign='left';ctx.fillStyle='#8fb4ff';ctx.font=C.font(46,800);ctx.fillText(name,cx+190,cy+110);
  const nw=Math.max(1,txt.split(/\s+/).length),up=C.prog(t,1.0,1.0+Math.min(3.5,nw*.18))*(nw+.5);
  C.vText(ctx,txt,cx+80,cy+250+(d.audio===false?20:0),cw-160,3,64,34,{align:'left',wt:600,upTo:up});
  if(d.audio!==false){const by=cy+ch-96,bw=cw-160,bx=cx+80,pr=C.prog(t,1.0,Math.max(4,sc.dur-.5));ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.roundRect(bx+70,by-5,bw-70,10,5);ctx.fill();ctx.fillStyle=NEON.b;ctx.shadowColor=NEON.b;ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(bx+70,by-5,(bw-70)*pr,10,5);ctx.fill();ctx.beginPath();ctx.arc(bx+70+(bw-70)*pr,by,13,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(bx+28,by,28,0,Math.PI*2);ctx.fill();ctx.fillStyle='#0a1020';ctx.beginPath();ctx.moveTo(bx+20,by-14);ctx.lineTo(bx+20,by+14);ctx.lineTo(bx+42,by);ctx.fill();}
  ctx.restore();ctx.restore();}};
// ---- N7 promo
C.CARDS.promo={assets:d=>[S(d.logo),S(d.btnIcon)].concat((Array.isArray(d.thumbs)?d.thumbs:[]).map(S)).filter(needAsset),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),th=(Array.isArray(d.thumbs)?d.thumbs:[]).map(S).filter(Boolean).slice(0,3);C.vBase(ctx,t);
  ctx.save();ctx.globalAlpha=oa;
  const lp=E.back(C.prog(t,.1,.7)),R=110,lx=W/2,ly=190;
  if(lp>0){ctx.save();ctx.translate(lx,ly);ctx.scale(Math.min(1.08,lp),Math.min(1.08,lp));ctx.shadowColor=NEON.b;ctx.shadowBlur=40;ctx.fillStyle='#0d1530';ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.save();ctx.beginPath();ctx.arc(0,0,R-6,0,Math.PI*2);ctx.clip();const li=S(d.logo)?pimg(S(d.logo)):null;if(li)coverImg(ctx,li,-R,-R,R*2,R*2,1);else{ctx.fillStyle='#1c3a7a';ctx.fillRect(-R,-R,R*2,R*2);ctx.fillStyle='#fff';ctx.font=C.font(R*.9,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((S(d.name)[0]||'C').toUpperCase(),0,6);}ctx.restore();
    ctx.strokeStyle=NEON.b;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.stroke();ctx.restore();}
  const np=E.out(C.prog(t,.4,.9));if(S(d.name)&&np>0){ctx.globalAlpha=oa*np;C.nText(ctx,S(d.name),W/2,ly+R+70+10*(1-np),1500,1,84,40,{col:'b',mode:'glow'});ctx.globalAlpha=oa;}
  const sp=C.popAt(t,0,.8,0,.5);if(S(d.subs)&&sp>0){const lab=S(d.subs)+' Subscribers',f=C.fitText(ctx,lab,900,1,54,28,800);ctx.save();ctx.translate(W/2,ly+R+160);ctx.scale(Math.min(1.08,sp),Math.min(1.08,sp));ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+90;ctx.fillStyle='#fff';ctx.shadowColor='rgba(255,255,255,.5)';ctx.shadowBlur=18;ctx.beginPath();ctx.roundRect(-w/2,-42,w,84,42);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#0a1020';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,3);ctx.restore();}
  if(th.length){const n=th.length,tw=n>2?420:480,thh=tw*9/16,gap=50,x0=W/2-(n*tw+(n-1)*gap)/2,ty=ly+R+250;
    th.forEach((k,i)=>{const p=E.out(C.prog(t,1.1+i*.3,1.1+i*.3+.55));if(p<=0)return;const x=x0+i*(tw+gap);ctx.save();ctx.globalAlpha=oa*p;ctx.translate(0,(1-p)*60);ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=24;ctx.fillStyle='#0d1530';ctx.beginPath();ctx.roundRect(x,ty,tw,thh,20);ctx.fill();ctx.shadowBlur=0;
      ctx.save();ctx.beginPath();ctx.roundRect(x+4,ty+4,tw-8,thh-8,16);ctx.clip();const im=pimg(k);if(im)coverImg(ctx,im,x+4,ty+4,tw-8,thh-8,1);else{ctx.fillStyle='#16224a';ctx.fillRect(x,ty,tw,thh);ctx.fillStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.moveTo(x+tw/2-26,ty+thh/2-32);ctx.lineTo(x+tw/2-26,ty+thh/2+32);ctx.lineTo(x+tw/2+34,ty+thh/2);ctx.fill();}ctx.restore();
      ctx.strokeStyle=NEON.b;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x,ty,tw,thh,20);ctx.stroke();ctx.restore();});}
  const bp=C.popAt(t,0,1.9,0,.6),bt=S(d.btn)||'SUBSCRIBE';
  if(bp>0){const by=H-130,bw=520,bh=110,pulse=1+.025*Math.sin(t*6);ctx.save();ctx.translate(W/2,by);ctx.scale(Math.min(1.1,bp)*pulse,Math.min(1.1,bp)*pulse);ctx.shadowColor='#ff2a2a';ctx.shadowBlur=36;ctx.fillStyle='#e8132c';ctx.beginPath();ctx.roundRect(-bw/2,-bh/2,bw,bh,bh/2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.font=C.font(54,900);ctx.textAlign='center';ctx.textBaseline='middle';const bw2=ctx.measureText(bt).width;ctx.fillText(bt,36,3);ctx.font=C.font(52,400);ctx.fillText('🔔',-bw2/2-18+36-6,2);ctx.restore();}
  if(S(d.note)){const np2=E.out(C.prog(t,2.4,3));ctx.globalAlpha=oa*np2;C.vText(ctx,S(d.note),W/2,H-35,1600,1,38,24,{wt:600,col:'#9fb2d6'});}
  ctx.restore();}};
// ---- N8 outword
C.nWords=d=>S(d.words).split(/\s+/).filter(Boolean).slice(0,4);
C.CARDS.outword={assets:d=>[PH].concat(needAsset(S(d.img))?[S(d.img)]:[]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),ws=C.nWords(d),col=d.c==='b'?'b':'r',hasI=!!S(d.img);C.vBase(ctx,t);if(!ws.length){msg(ctx,'words mein shabd do');return;}
  ctx.save();ctx.globalAlpha=oa;const tx=hasI?W*.335:W/2,mw=hasI?W*.52:W-240,n=ws.length,lh=n>1?Math.min(230,(H-360)/n):0;
  const px=Math.min(250,Math.max(70,mw/Math.max(...ws.map(w=>w.length))*1.55)),y0=H/2-(S(d.sub)?30:0)-((n-1)*Math.max(lh,px*1.05))/2;
  ws.forEach((w,i)=>{const a0=.3+i*.6,p=C.popAt(t,i,.3,.6,.55);if(p<=0)return;const s=Math.min(1.12,.6+.4*p),shake=C.prog(t,a0+.5,a0+.9)<1?Math.sin(t*60)*5*(1-C.prog(t,a0+.5,a0+.9)):0,yy=y0+i*Math.max(lh,px*1.05),last=i===n-1;
    ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.8);ctx.translate(tx+shake,yy);ctx.scale(s,s);C.nText(ctx,w.toUpperCase(),0,0,mw/s,1,px,40,{col,mode:'outline',fill:last&&t>a0+.6?'rgba(255,255,255,.16)':'rgba(255,255,255,.05)'});ctx.restore();});
  if(hasI){const p=E.back(C.prog(t,.5,1.2)),im=pimg(S(d.img))||C.img(PH),iw=W*.26,ih=H*.68,ix=W*.78-iw/2,iy=H/2-ih/2+(1-Math.min(1,p))*60;if(p>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.shadowColor=NEON.b;ctx.shadowBlur=34;ctx.fillStyle='rgba(14,22,44,.9)';ctx.beginPath();ctx.roundRect(ix,iy,iw,ih,36);ctx.fill();ctx.shadowBlur=0;ctx.save();ctx.beginPath();ctx.roundRect(ix+5,iy+5,iw-10,ih-10,32);ctx.clip();coverImg(ctx,im,ix+5,iy+5,iw-10,ih-10,1+.04*t/sc.dur);ctx.restore();ctx.strokeStyle=NEON.b;ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(ix,iy,iw,ih,36);ctx.stroke();ctx.restore();}}
  if(S(d.sub)){const sp=E.out(C.prog(t,.3+n*.6,.3+n*.6+.6));ctx.globalAlpha=oa*sp;C.vText(ctx,S(d.sub),W/2,H-90+16*(1-sp),1640,2,56,30,{wt:600});}
  ctx.restore();}};

// ---- N9 flowdiag: data:{a:'icon', b:'icon', la:'', lb:'', result:'text', wave:true, c:'b'}
// ---- N10 crossprice: data:{img:'slot/asset', price:'$10,000', label:'', cross:true}
// ---- N11 docfolder: data:{title:'', doc:'slot/asset', folder:true, label:''}
// ---- N12 topicend: data:{text:'...', topic:'TOPIC ??'}
const DOC='06_icons/icon_document_page',FOL='06_icons/icon_folder_red',MIC='06_icons/icon_mic_crossed_price_tag',MAG='06_icons/icon_tile_neon_magic_wand_blue',MICT='06_icons/icon_tile_flat_mic_white';
function iconAt(ctx,k,cx,cy,sz){const im=k?pimg(k):null;if(im){const q=Math.min(sz/(im.width||1),sz/(im.height||1));ctx.drawImage(im,cx-im.width*q/2,cy-im.height*q/2,im.width*q,im.height*q);return;}
  ctx.font=C.font(sz*.8,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(k||'?',cx,cy+4);}
C.CARDS.flowdiag={assets:d=>[S(d.a)||MICT,S(d.b)||MAG].filter(needAsset),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),col=NEON[d.c]||NEON.b;C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,100);
  const ty=(d.title?250:200),tw=380,ax=W/2-380,bx=W/2+380,cy=ty+tw/2;
  [[S(d.a)||MICT,S(d.la),ax,0],[S(d.b)||MAG,S(d.lb),bx,1]].forEach(([k,l,x,i])=>{const p=C.popAt(t,i,.3,.9);if(p<=0)return;const s=Math.min(1.08,p);ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.6);ctx.translate(x,cy);ctx.scale(s,s);ctx.translate(-x,-cy);glass(ctx,x-tw/2,ty,tw,tw,44,i?NEON.g:NEON.r,true,1);iconAt(ctx,k,x,cy,tw-90);ctx.restore();
    if(l){const lp=E.out(C.prog(t,.6+i*.9,1.1+i*.9));ctx.globalAlpha=oa*lp;C.nText(ctx,l,x,ty+tw+60,tw+120,1,54,28,{col:i?'g':'r'});ctx.globalAlpha=oa;}});
  const ap=E.out(C.prog(t,.9,1.6));if(ap>0){const x0=ax+tw/2+30,x1=bx-tw/2-30,xe=x0+(x1-x0)*ap;ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=24;ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,cy);ctx.lineTo(xe-20,cy);ctx.stroke();if(ap>.9){ctx.beginPath();ctx.moveTo(xe,cy);ctx.lineTo(xe-44,cy-34);ctx.lineTo(xe-44,cy+34);ctx.fill();}ctx.restore();}
  const rp=E.out(C.prog(t,1.8,2.4));if(S(d.result)&&rp>0){ctx.globalAlpha=oa*rp;C.vText(ctx,S(d.result),W/2,ty+tw+170+10*(1-rp),1500,1,64,32,{wt:700});ctx.globalAlpha=oa;}
  if(d.wave!==false){const wp=E.out(C.prog(t,2.0,2.7)),wy=H-110,n=60,ww=1100;ctx.save();ctx.globalAlpha=oa*wp;ctx.fillStyle='#35e6ff';ctx.shadowColor='#35e6ff';ctx.shadowBlur=14;for(let i=0;i<n;i++){const h=10+Math.abs(Math.sin(i*.7+t*5)*Math.sin(i*.23+1))*70*wp;ctx.beginPath();ctx.roundRect(W/2-ww/2+i*(ww/n),wy-h/2,ww/n*.6,h,4);ctx.fill();}ctx.restore();}
  ctx.restore();}};
C.CARDS.crossprice={assets:d=>[S(d.img)||MIC].filter(needAsset),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,100);
  const p=E.back(C.prog(t,.2,.9)),cx=W/2,cy=H/2-20,sz=560;
  if(p>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(cx,cy);ctx.scale(Math.min(1.08,p),Math.min(1.08,p));iconAt(ctx,S(d.img)||MIC,0,0,sz);
    const xp=E.out(C.prog(t,1.0,1.5));if(d.cross!==false&&xp>0){ctx.strokeStyle=NEON.r;ctx.shadowColor=NEON.r;ctx.shadowBlur=30;ctx.lineWidth=34;ctx.lineCap='round';const r=sz*.42;ctx.beginPath();ctx.moveTo(-r,-r);ctx.lineTo(-r+2*r*Math.min(1,xp*2),-r+2*r*Math.min(1,xp*2));if(xp>.5){const q=(xp-.5)*2;ctx.moveTo(r,-r);ctx.lineTo(r-2*r*q,-r+2*r*q);}ctx.stroke();}ctx.restore();}
  const bp=C.popAt(t,0,1.4,0,.5);if(S(d.price)&&bp>0){ctx.save();ctx.translate(cx+330,cy-250);ctx.rotate(.14);ctx.scale(Math.min(1.1,bp),Math.min(1.1,bp));ctx.fillStyle='#e8132c';ctx.shadowColor='#ff2a2a';ctx.shadowBlur=26;const f=C.fitText(ctx,S(d.price),420,1,86,40,900);ctx.font=C.font(f.px,900);const w=ctx.measureText(f.lines[0]).width+80;ctx.beginPath();ctx.roundRect(-w/2,-62,w,124,62);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,4);ctx.restore();}
  if(S(d.label)){const lp=E.out(C.prog(t,.9,1.5));ctx.globalAlpha=oa*lp;C.nText(ctx,S(d.label),W/2,H-100+14*(1-lp),1600,1,76,36,{col:'b'});}
  ctx.restore();}};
C.CARDS.docfolder={assets:d=>[S(d.doc)||DOC,FOL].filter(needAsset),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),fol=d.folder!==false;C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,100);
  const dp=E.back(C.prog(t,.2,.9)),dx=fol?W/2-300:W/2,cy=H/2-30;
  if(dp>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,dp*1.5);ctx.translate(dx,cy+(1-Math.min(1,dp))*60);ctx.rotate(-.04);ctx.shadowColor=NEON.b;ctx.shadowBlur=40;iconAt(ctx,S(d.doc)||DOC,0,0,600);ctx.restore();}
  const fp=E.back(C.prog(t,1.0,1.6));if(fol&&fp>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,fp*1.5);ctx.translate(W/2+330,cy+80);ctx.scale(Math.min(1.08,fp),Math.min(1.08,fp));iconAt(ctx,FOL,0,0,420);ctx.restore();
    const ap=E.out(C.prog(t,1.5,2.1));if(ap>0){ctx.save();ctx.globalAlpha=oa*ap;ctx.strokeStyle=NEON.b;ctx.fillStyle=NEON.b;ctx.shadowColor=NEON.b;ctx.shadowBlur=20;ctx.lineWidth=12;ctx.lineCap='round';const x0=W/2-30,x1=W/2+90;ctx.beginPath();ctx.moveTo(x0,cy);ctx.lineTo(x1,cy);ctx.stroke();ctx.beginPath();ctx.moveTo(x1+30,cy);ctx.lineTo(x1-14,cy-30);ctx.lineTo(x1-14,cy+30);ctx.fill();ctx.restore();}}
  if(S(d.label)){const lp=E.out(C.prog(t,.8,1.4));ctx.globalAlpha=oa*lp;C.nText(ctx,S(d.label),W/2,H-100+14*(1-lp),1600,1,76,36,{col:'b'});}
  ctx.restore();}};
C.CARDS.topicend={assets:d=>[],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),tx=S(d.text);C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;
  const hasT=!!S(d.topic)||d.topic==null,tp=S(d.topic)||'TOPIC ??';
  const p=E.out(C.prog(t,.1,.7));ctx.globalAlpha=oa*p;if(tx)C.vText(ctx,tx,W/2,hasT?250+10*(1-p):H/2,1600,3,84,40,{wt:800});ctx.globalAlpha=oa;
  const cp=E.back(C.prog(t,.9,1.6));if(hasT&&cp>0){const R=250,cy=H-R-120,pulse=1+.02*Math.sin(t*5);ctx.save();ctx.translate(W/2,cy);ctx.scale(Math.min(1.08,cp)*pulse,Math.min(1.08,cp)*pulse);ctx.fillStyle='rgba(14,22,44,.95)';ctx.shadowColor=NEON.r;ctx.shadowBlur=44;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=NEON.r;ctx.lineWidth=8;ctx.stroke();ctx.restore();ctx.globalAlpha=oa*Math.min(1,cp*1.4);C.nText(ctx,tp,W/2,cy,R*1.5,2,100,40,{col:'r',mode:'outline'});}
  ctx.restore();}};

// ---- N13 measure: data:{img:'slot/asset', label:'6 to 8 inches', sub:'Side angle', title:''}
// ---- N14 meme: data:{img:'slot/asset', text:'', side:'r'|'l'}  (dark/blur bg + chhota reaction photo)
// ---- N15 wavestrip: data:{name:'ME', img:'slot/asset', text:'', c:'b'}
C.CARDS.measure={assets:d=>[PH].concat(needAsset(S(d.img))?[S(d.img)]:[]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;head(ctx,t,d,oa,100);
  const pp=E.out(C.prog(t,.1,.7)),ph=H-(d.title?300:200),pw=ph*9/16,px=W/2-pw/2-260,py=(d.title?170:100)+(1-pp)*40;
  ctx.save();ctx.globalAlpha=oa*pp;ctx.shadowColor='rgba(40,110,230,.5)';ctx.shadowBlur=50;ctx.fillStyle='#04060c';ctx.beginPath();ctx.roundRect(px,py,pw,ph,44);ctx.fill();ctx.shadowBlur=0;
  ctx.save();ctx.beginPath();ctx.roundRect(px+8,py+8,pw-16,ph-16,36);ctx.clip();coverImg(ctx,pimg(S(d.img))||C.img(PH),px+8,py+8,pw-16,ph-16,1);ctx.restore();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(px,py,pw,ph,44);ctx.stroke();ctx.restore();
  const lp=E.out(C.prog(t,.8,1.5)),lx=px+pw+90,y0=py+ph*.12,y1=py+ph*.88,ym=(y0+y1)/2;
  if(lp>0){ctx.save();ctx.strokeStyle=NEON.r;ctx.shadowColor=NEON.r;ctx.shadowBlur=22;ctx.lineWidth=10;ctx.lineCap='round';const a=ym-(ym-y0)*lp,b=ym+(y1-ym)*lp;ctx.beginPath();ctx.moveTo(lx,a);ctx.lineTo(lx,b);ctx.moveTo(lx-26,a);ctx.lineTo(lx+26,a);ctx.moveTo(lx-26,b);ctx.lineTo(lx+26,b);ctx.stroke();ctx.restore();}
  const tp=E.out(C.prog(t,1.3,1.9));if(tp>0){ctx.globalAlpha=oa*tp;if(S(d.label))C.nText(ctx,S(d.label),lx+60+(1-tp)*-30,ym-40,W-lx-140,2,96,44,{col:'r',align:'left',mode:'outline'});if(S(d.sub))C.vText(ctx,S(d.sub),lx+60,ym+90,W-lx-140,2,64,34,{align:'left',wt:700});}
  ctx.restore();}};
C.CARDS.meme={assets:d=>[PH].concat(needAsset(S(d.img))?[S(d.img)]:[]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),L=S(d.side)==='l';C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,W,H);
  const p=E.back(C.prog(t,.2,.9)),sz=520,cx=W/2+(L?-1:1)*(S(d.text)?-0:0),cy=H/2-(S(d.text)?40:0);
  if(p>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(cx,cy);ctx.rotate(Math.sin(t*3)*.03+(L?-.05:.05));ctx.scale(Math.min(1.08,p),Math.min(1.08,p));ctx.shadowColor=NEON.y;ctx.shadowBlur=34;ctx.fillStyle='#0b1222';ctx.beginPath();ctx.roundRect(-sz/2,-sz/2,sz,sz,40);ctx.fill();ctx.shadowBlur=0;ctx.save();ctx.beginPath();ctx.roundRect(-sz/2+6,-sz/2+6,sz-12,sz-12,34);ctx.clip();coverImg(ctx,pimg(S(d.img))||C.img(PH),-sz/2+6,-sz/2+6,sz-12,sz-12,1);ctx.restore();ctx.strokeStyle=NEON.y;ctx.lineWidth=6;ctx.beginPath();ctx.roundRect(-sz/2,-sz/2,sz,sz,40);ctx.stroke();ctx.restore();}
  if(S(d.text)){const tp=E.out(C.prog(t,.8,1.4));ctx.globalAlpha=oa*tp;C.nText(ctx,S(d.text),W/2,H-150+14*(1-tp),1600,2,84,40,{col:'y'});}
  ctx.restore();}};
C.CARDS.wavestrip={assets:d=>[PH].concat(needAsset(S(d.img))?[S(d.img)]:[]),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),col=NEON[d.c]||NEON.b;C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;
  const ap=E.back(C.prog(t,.1,.7)),R=130,ax=W/2-(S(d.text)?0:0),ay=330;
  if(ap>0){ctx.save();ctx.translate(ax,ay);ctx.scale(Math.min(1.08,ap),Math.min(1.08,ap));ctx.shadowColor=col;ctx.shadowBlur=44;ctx.fillStyle='#0d1530';ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.save();ctx.beginPath();ctx.arc(0,0,R-6,0,Math.PI*2);ctx.clip();if(S(d.img))coverImg(ctx,pimg(S(d.img))||C.img(PH),-R,-R,R*2,R*2,1);else{ctx.fillStyle='#1c3a7a';ctx.fillRect(-R,-R,R*2,R*2);ctx.fillStyle='#fff';ctx.font=C.font(R*.7,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((S(d.name)||'ME').slice(0,3).toUpperCase(),0,6);}ctx.restore();ctx.strokeStyle=col;ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.stroke();ctx.restore();}
  const wp=E.out(C.prog(t,.6,1.3)),n=90,ww=1500,wy=640;ctx.save();ctx.globalAlpha=oa*wp;ctx.fillStyle='#35e6ff';ctx.shadowColor='#35e6ff';ctx.shadowBlur=16;for(let i=0;i<n;i++){const h=12+Math.abs(Math.sin(i*.55+t*6)*Math.sin(i*.17+t*1.3+1))*190*wp;ctx.beginPath();ctx.roundRect(W/2-ww/2+i*(ww/n),wy-h/2,ww/n*.62,h,5);ctx.fill();}ctx.restore();
  if(S(d.text)){const tp=E.out(C.prog(t,1.0,1.6));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.text),W/2,H-170+12*(1-tp),1600,2,70,34,{wt:700});}
  ctx.restore();}};
})();
