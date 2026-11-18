// C122-C126 (R3 - R7): paanch wide card (explainer style, docs/REFERENCE_EXPLAINER_STYLE.md). Transitions R8: js/transitions_r.js
// kinetic   (R3): data:{photo:'slot ya asset' (optional), words:'हमेशा सबसे *सस्ता* चुनता है' (*shabd* = peela), sub:'', bw:true (B&W photo), c:'y', bg} -> B&W photo + neela tint + bade shabd ek-ek karke pop
// barcount  (R4): data:{title, items:['35|देखा गया','6|छोड़ा'] (2-4, 'number|label'), unit:'%', max:100 (optional), hl:1 (kaunsa bar peela; default sabse bada), note:'', pill:'', c:'y', bg} -> bar grow + count-up
// quote     (R5): data:{quote:'...', name:'', role:'', photo:'slot ya asset', side:'l'|'r', bw:true, crowd:true, c:'y', bg} -> face cutout + bada quote chinh + peeli silhouette bheed
// post      (R6): data:{name:'', handle:'', text:'... *highlight* ...', img:'slot ya asset' (optional), avatar:'' , stats:'' (free text), src:'', pile:0-2, theme:'light'|'dark', c:'y', title, bg} -> social post card + highlight + dheere zoom
// iconscene (R7): data:{title, items:['asset/path|label' ya '🎟|label'] (1-4), btn:'Book Ticket' (optional), click:true, crowd:true, c:'y', bg} -> icon tiles pop + button + cursor click
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',PH='07_photo_slot_placeholders/ph_silhouette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const S=v=>v==null?'':String(v).trim(),isN=v=>v!=null&&v!==''&&isFinite(+v);
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);
const pimg=k=>k?((C.photos&&C.photos[k])||C.img(k)):null;
const assetOf=k=>k&&!slot(k)?[S(k)]:[];
function msg(ctx,txt){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(txt,C.W/2,C.H/2);ctx.restore();}
function base(ctx,t,d,sc,dim){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);if(dim){ctx.fillStyle='rgba(6,12,32,'+dim+')';ctx.fillRect(0,0,W,H);}C.drawImg(ctx,VG,0,0,W,H);}
function txt(ctx,s,x,y,w,lines,px,min,wt,col,align){const f=C.fitText(ctx,String(s),w,lines,px,min,wt||800);ctx.font=C.font(f.px,wt||800);ctx.fillStyle=col||'#fff';ctx.textAlign=align||'center';ctx.textBaseline='middle';const lh=f.px*1.2;f.lines.forEach((l,k)=>ctx.fillText(l,x,y+(k-(f.lines.length-1)/2)*lh));return f;}
function pillBox(ctx,s,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;const f=C.fitText(ctx,s,1500,1,fs,28,800);ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+120,h=104;
  ctx.fillStyle='rgba(10,19,48,.85)';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,h/2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x,y+3);ctx.restore();}
// *shabd* tokens -> lines of {w,hl,x,wd}; ctx.font pehle se set ho
C.rToks=function(str){const out=[];let st=false;String(str==null?'':str).split(/\s+/).forEach(tok=>{let w='',hl=false;for(const ch of tok){if(ch==='*')st=!st;else{w+=ch;if(st)hl=true;}}if(w)out.push({w:w,hl:hl});});return out;};
C.rLayout=function(ctx,str,maxW,o){const toks=C.rToks(str),sp=ctx.measureText(' ').width,lines=[];let cur=[],cw=0;
  toks.forEach(k=>{let wd;if(o&&k.hl&&o.px){const sv=ctx.font;ctx.font=C.font(o.px*(o.hlS||1),o.hlW||o.wt||800);wd=ctx.measureText(k.w).width;ctx.font=sv;}else wd=ctx.measureText(k.w).width;if(cur.length&&cw+sp+wd>maxW){lines.push({a:cur,w:cw});cur=[];cw=0;}k.wd=wd;k.x=cur.length?cw+sp:0;cw=k.x+wd;cur.push(k);});
  if(cur.length)lines.push({a:cur,w:cw});return lines;};
C.rFit=function(ctx,str,maxW,maxLines,px,min,wt,o){let p=px,L;const oo=p=>o?{px:p,hlW:o.hlW,hlS:o.hlS,wt:wt}:null;for(;p>=min;p-=2){ctx.font=C.font(p,wt);L=C.rLayout(ctx,str,maxW,oo(p));if(L.length<=maxLines)break;}ctx.font=C.font(p,wt);L=C.rLayout(ctx,str,maxW,oo(p));return{px:p,lines:L};};
// peela silhouette bheed (head + kandhe), ek line mein
C.rCrowd=function(ctx,x,y,w,h,col,p,seed){const n=Math.max(6,Math.round(w/115));ctx.save();ctx.fillStyle=col;ctx.globalAlpha=(ctx.globalAlpha||1)*.9;
  for(let i=0;i<n;i++){const q=E.out(C.prog(p,i/n*.5,i/n*.5+.5));if(q<=0)continue;const jx=((i*37+(seed||0))%11-5)*3,s=.85+((i*53+(seed||0))%5)*.07,cx=x+(i+.5)*w/n+jx,r=h*.2*s,by=y+h+(1-q)*h*.6;
    ctx.beginPath();ctx.arc(cx,by-h*.62*s,r,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx,by,r*1.9,h*.5*s,0,Math.PI,0);ctx.fill();}ctx.restore();};
function grayPhoto(ctx,im,x,y,w,h,z,bw,anchor){if(!im)return;const iw=im.width||im.naturalWidth,ih=im.height||im.naturalHeight;if(!iw)return;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();if(bw)ctx.filter='grayscale(1) contrast(1.15) brightness(1.05)';
  const s=Math.max(w/iw,h/ih)*(z||1),dw=iw*s,dh=ih*s;ctx.drawImage(im,x+(w-dw)/2,anchor==='bottom'?y+h-dh:y+(h-dh)/2,dw,dh);ctx.restore();}
function arrow(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,34);ctx.lineTo(9,26);ctx.lineTo(16,42);ctx.lineTo(23,39);ctx.lineTo(16,24);ctx.lineTo(28,24);ctx.closePath();
  ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle='#fff';ctx.fill();ctx.shadowColor='transparent';ctx.lineWidth=3;ctx.strokeStyle='#10131f';ctx.stroke();ctx.restore();}
function avatar(ctx,cx,cy,r,col,img){if(img){ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();C.cover(ctx,img,cx-r,cy-r,r*2,r*2,1);ctx.restore();}
  else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(cx,cy-r*.2,r*.32,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx,cy+r*.58,r*.55,r*.36,0,Math.PI,0);ctx.fill();}}
C.barItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>S(v)).slice(0,4).map(s=>{const a=String(s).split('|');return{v:parseFloat(S(a[0])),l:S(a[1])};}).filter(o=>isFinite(o.v));
C.icItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>S(v)).slice(0,4).map(s=>{const a=String(s).split('|').map(x=>x.trim()),ic=a.length>1?a[0]:'',l=a.length>1?a[1]:a[0];return{ic,l,asset:ic.indexOf('/')>=0};});

// ---- R3 kinetic
C.CARDS.kinetic={assets:d=>[d.bg||BG,VG].concat(assetOf(d.photo)),
 draw(ctx,t,d,sc){const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),words=S(d.words);if(!words){base(ctx,t,d,sc);msg(ctx,'words do');return;}
  base(ctx,t,d,sc);const im=pimg(S(d.photo));
  if(im){const z=1.05+.08*t/sc.dur;ctx.save();ctx.globalAlpha=E.out(C.prog(t,0,.5));grayPhoto(ctx,im,0,0,W,H,z,d.bw!==false,'center');
    ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(30,70,190,.62)';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(5,10,30,.55)');g.addColorStop(.5,'rgba(5,10,30,.25)');g.addColorStop(1,'rgba(5,10,30,.7)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();C.drawImg(ctx,VG,0,0,W,H);}
  const f=C.rFit(ctx,words,1640,3,210,70,900,{hlW:900,hlS:1.12}),lh=f.px*1.12,tot=f.lines.length*lh,cy0=H/2-(d.sub?50:0),y0=cy0-tot/2+lh/2;let k=0;
  ctx.save();ctx.globalAlpha=oa;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  f.lines.forEach((L,li)=>{const x0=W/2-L.w/2;L.a.forEach(wd=>{const a0=.25+k*.24,p=E.back(C.prog(t,a0,a0+.45));k++;if(p<=0)return;const hl=wd.hl,cx=x0+wd.x+wd.wd/2,cy=y0+li*lh+(1-Math.min(1,p))*60;
    ctx.save();ctx.translate(cx,cy);const s=hl?(.55+.45*p)*(1+.04*Math.sin(t*3)):(.6+.4*p);ctx.scale(s,s);ctx.globalAlpha=oa*Math.min(1,p*1.6);ctx.font=C.font(f.px*(hl?1.12:1),900);
    ctx.lineWidth=f.px*.14;ctx.strokeStyle='rgba(6,12,32,.92)';ctx.strokeText(wd.w,-wd.wd/2,0);ctx.fillStyle=hl?col:'#fff';if(hl){ctx.shadowColor=col;ctx.shadowBlur=30;}ctx.fillText(wd.w,-wd.wd/2,0);ctx.restore();});});
  ctx.restore();
  if(d.sub){const sp=E.out(C.prog(t,.25+k*.24,.25+k*.24+.5));if(sp>0){ctx.save();ctx.globalAlpha=oa*sp;txt(ctx,S(d.sub),W/2,cy0+tot/2+75+(1-sp)*20,1500,1,64,30,800,'#dfe8ff');ctx.restore();}}}};

// ---- R4 barcount
C.CARDS.barcount={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),it=C.barItems(d);if(it.length<2){msg(ctx,'items mein 2-4 "number|label" do');return;}
  const unit=S(d.unit),top=d.title?200:120,mx=isN(d.max)&&+d.max>0?+d.max:Math.max.apply(null,it.map(o=>o.v)),hi=isN(d.hl)&&+d.hl>=1&&+d.hl<=it.length?+d.hl-1:it.reduce((b,o,i)=>o.v>it[b].v?i:b,0);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp*oa;const f=C.fitText(ctx,S(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const n=it.length,bw=n>3?230:300,gap=n>3?110:170,tw=n*bw+(n-1)*gap,x0=W/2-tw/2,baseY=H-(d.pill||d.note?290:220),maxH=baseY-top-170;
  ctx.save();ctx.globalAlpha=oa;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0-70,baseY);ctx.lineTo(x0+tw+70,baseY);ctx.stroke();
  it.forEach((o,i)=>{const a0=.4+i*.35,p=E.out(C.prog(t,a0,a0+1.4)),isH=i===hi,cc=isH?col:'#6fa8ff',h=Math.max(8,maxH*Math.min(1,o.v/mx)*p),x=x0+i*(bw+gap);
    ctx.save();ctx.fillStyle=cc;ctx.shadowColor=cc;ctx.shadowBlur=isH?34:16;ctx.beginPath();ctx.roundRect(x,baseY-h,bw,h,[26,26,0,0]);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.roundRect(x+bw*.12,baseY-h+10,bw*.14,Math.max(0,h-20),10);ctx.fill();ctx.restore();
    const dec=Math.abs(o.v-Math.round(o.v))>.001?1:0,val=(o.v*p).toFixed(dec)+unit,f=C.fitText(ctx,val,bw+gap-30,1,120,50,900);ctx.font=C.font(f.px,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=14;ctx.strokeStyle='rgba(8,18,42,.9)';ctx.strokeText(val,x+bw/2,baseY-h-62);ctx.fillStyle=isH?col:'#fff';ctx.fillText(val,x+bw/2,baseY-h-62);
    const lp=E.out(C.prog(t,a0+.3,a0+.9));if(o.l&&lp>0){ctx.save();ctx.globalAlpha=oa*lp;txt(ctx,o.l,x+bw/2,baseY+62,bw+gap-20,2,52,26,800,'#fff');ctx.restore();}});
  ctx.restore();
  if(d.note){const a=E.out(C.prog(t,2.2,2.8));if(a>0){ctx.save();ctx.globalAlpha=oa*a;txt(ctx,S(d.note),W/2,H-120+(1-a)*20,1600,1,50,26,700,'#b8c4e0');ctx.restore();}}
  if(d.pill){const a=E.out(C.prog(t,2.4,3.0));if(a>0)pillBox(ctx,S(d.pill),W/2,H-110+(1-a)*20,col,oa*a,52);}}};

// ---- R5 quote
C.CARDS.quote={assets:d=>[d.bg||BG,VG].concat(assetOf(d.photo)),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),q=S(d.quote);if(!q){msg(ctx,'quote do');return;}
  const left=d.side!=='r',pw=700,ph=H-(d.crowd===false?120:260),px0=left?110:W-110-pw,tx0=left?px0+pw+90:110,tw=W-pw-110*2-90;
  ctx.save();ctx.globalAlpha=oa;
  // photo panel: neela diamond/box + B&W cutout
  const pp=E.out(C.prog(t,.1,.8));if(pp>0){ctx.save();ctx.globalAlpha=oa*pp;ctx.translate((left?-1:1)*(1-pp)*80,0);
    ctx.fillStyle='rgba(30,70,190,.55)';ctx.strokeStyle=col;ctx.lineWidth=6;ctx.shadowColor=col;ctx.shadowBlur=22;ctx.beginPath();ctx.roundRect(px0,70,pw,ph-30,36);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    const im=pimg(S(d.photo))||C.img(PH);ctx.save();ctx.beginPath();ctx.roundRect(px0,70,pw,ph-30,36);ctx.clip();grayPhoto(ctx,im,px0,70,pw,ph-30,1.02+.04*t/sc.dur,d.bw!==false&&!!pimg(S(d.photo)),'bottom');ctx.restore();ctx.restore();}
  // quote chinh + text
  const qp=E.back(C.prog(t,.5,1.0));if(qp>0){ctx.save();ctx.translate(tx0,200);ctx.scale(Math.min(1,qp),Math.min(1,qp));ctx.font=C.font(300,900);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=26;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('\u201C',0,60);ctx.restore();}
  const tp=E.out(C.prog(t,.8,1.5));if(tp>0){ctx.save();ctx.globalAlpha=oa*tp;ctx.translate(0,(1-tp)*30);const f=C.rFit(ctx,q,tw,6,86,38,800),lh=f.px*1.22,hy=310;ctx.textBaseline='middle';ctx.textAlign='left';
    f.lines.forEach((L,li)=>{L.a.forEach(wd=>{ctx.fillStyle=wd.hl?col:'#fff';ctx.fillText(wd.w,tx0+wd.x,hy+li*lh+lh/2);});});
    const ny=hy+f.lines.length*lh+60;
    if(d.name){const np=E.out(C.prog(t,1.6,2.2));ctx.globalAlpha=oa*np;ctx.fillStyle=col;ctx.fillRect(tx0,ny-34,10,d.role?100:54);txt(ctx,S(d.name),tx0+34,ny,tw-40,1,64,30,900,col,'left');if(d.role)txt(ctx,S(d.role),tx0+34,ny+58,tw-40,1,44,24,700,'#dfe8ff','left');}
    ctx.restore();}
  if(d.crowd!==false){const cp=C.prog(t,1.0,3.4);ctx.save();ctx.globalAlpha=oa*.8;C.rCrowd(ctx,80,H-190,W-160,150,col,cp,3);ctx.restore();}
  ctx.restore();}};

// ---- R6 post
C.CARDS.post={assets:d=>[d.bg||BG,VG].concat(assetOf(d.img),assetOf(d.avatar)),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),text=S(d.text),name=S(d.name),dark=d.theme==='dark';if(!text&&!name){msg(ctx,'text ya name do');return;}
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp*oa;const f=C.fitText(ctx,S(d.title),1600,1,76,40,900);C.text(ctx,f.lines[0],W/2,90+20*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const bg=dark?'#15202b':'#ffffff',fg=dark?'#e7e9ea':'#0f1419',mu=dark?'#8b98a5':'#536471',cw=1280,im=pimg(S(d.img)),top=d.title?170:70;
  // pehle text lines naap lo (card ki height ke liye)
  const pad=56,tw=cw-pad*2;ctx.save();const f=C.rFit(ctx,text,tw,im?4:7,58,34,600,{hlW:900}),lh=f.px*1.34;ctx.restore();
  const imH=im?Math.min(330,Math.round(tw*((im.height||im.naturalHeight||9)/(im.width||im.naturalWidth||16)))):0,headH=140,ch=pad+headH+f.lines.length*lh+(imH?imH+30:0)+(d.stats?90:30)+pad*.5,cx=W/2-cw/2,cy=Math.max(top,(H-(d.src?90:30)-ch)/2+ (d.title?60:0));
  const zp=E.io?E.io(C.prog(t,1.0,2.6)):E.out(C.prog(t,1.0,2.6)),zoom=d.zoom===false?1:1+.16*zp,fx=W/2,fy=cy+ch*.45;
  ctx.save();ctx.globalAlpha=oa;ctx.translate(fx,fy);ctx.scale(zoom,zoom);ctx.translate(-fx,-fy);
  const pile=Math.max(0,Math.min(2,+d.pile||0)),ip=E.back(C.prog(t,.2,.9));
  for(let i=pile;i>=1;i--){const pp=E.out(C.prog(t,.1+(pile-i)*.1,.7+(pile-i)*.1));if(pp<=0)continue;ctx.save();ctx.globalAlpha=oa*pp;ctx.translate(fx,fy);ctx.rotate((i%2?-1:1)*.045*i*pp);ctx.translate(-fx+(i%2?-1:1)*40*i,-fy+30*i);ctx.fillStyle=dark?'#101923':'#e8edf2';ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.beginPath();ctx.roundRect(cx,cy,cw,ch,34);ctx.fill();ctx.restore();}
  if(ip>0){ctx.save();ctx.globalAlpha=oa*Math.min(1,ip*1.4);ctx.translate(0,(1-Math.min(1,ip))*90);
    ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=44;ctx.shadowOffsetY=14;ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(cx,cy,cw,ch,34);ctx.fill();ctx.shadowColor='transparent';
    const ax=cx+pad+50,ay=cy+pad+44;avatar(ctx,ax,ay,50,col,pimg(S(d.avatar)));
    ctx.textBaseline='middle';ctx.textAlign='left';ctx.font=C.font(46,900);ctx.fillStyle=fg;ctx.fillText(name,ax+78,ay-16);ctx.font=C.font(38,600);ctx.fillStyle=mu;ctx.fillText(S(d.handle),ax+78,ay+30);
    let y=cy+pad+headH;ctx.font=C.font(f.px,600);const hp=E.out(C.prog(t,1.0,1.8));
    f.lines.forEach((L,li)=>{L.a.forEach(wd=>{const x=cx+pad+wd.x,yy=y+li*lh+lh/2;if(wd.hl){ctx.fillStyle=col;ctx.globalAlpha=oa*.9*hp;ctx.beginPath();ctx.roundRect(x-8,yy-f.px*.62,wd.wd*hp+16,f.px*1.24,10);ctx.fill();ctx.globalAlpha=oa;ctx.fillStyle='#10131f';}else ctx.fillStyle=fg;ctx.font=C.font(f.px,wd.hl?900:600);ctx.fillText(wd.w,x,yy);});});
    y+=f.lines.length*lh+10;
    if(im){ctx.save();ctx.beginPath();ctx.roundRect(cx+pad,y+10,tw,imH,24);ctx.clip();C.cover(ctx,im,cx+pad,y+10,tw,imH,1);ctx.restore();ctx.strokeStyle=dark?'#38444d':'#cfd9de';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(cx+pad,y+10,tw,imH,24);ctx.stroke();y+=imH+30;}
    if(d.stats){ctx.font=C.font(38,600);ctx.fillStyle=mu;ctx.textAlign='left';ctx.fillText(S(d.stats),cx+pad,y+44);}
    ctx.restore();}
  ctx.restore();
  if(d.src){const a=E.out(C.prog(t,.9,1.5));if(a>0){ctx.save();ctx.globalAlpha=oa*a;ctx.font=C.font(40,800);ctx.textAlign='left';ctx.textBaseline='middle';const s='SOURCE: '+S(d.src),w=ctx.measureText(s).width+60;ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(W/2-cw/2,H-110,w,70,16);ctx.fill();ctx.fillStyle='#10131f';ctx.fillText(s,W/2-cw/2+30,H-74);ctx.restore();}}}};

// ---- R7 iconscene
C.CARDS.iconscene={assets:d=>[d.bg||BG,VG].concat(C.icItems(d).filter(o=>o.asset).map(o=>o.ic)),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,oa=outAt(t,sc),it=C.icItems(d);if(!it.length){msg(ctx,'items mein 1-4 "icon|label" do');return;}
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp*oa;const f=C.fitText(ctx,S(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const n=it.length,tw=n>2?380:440,gap=n>2?60:90,tot=n*tw+(n-1)*gap,x0=W/2-tot/2,hasBtn=!!S(d.btn),ty=(d.title?210:130)+(hasBtn?0:40),th=hasBtn?400:470;
  ctx.save();ctx.globalAlpha=oa;
  it.forEach((o,i)=>{const a0=.3+i*.3,p=E.back(C.prog(t,a0,a0+.6));if(p<=0)return;const x=x0+i*(tw+gap),s=Math.min(1.08,p),cx=x+tw/2,cy=ty+th/2+(1-Math.min(1,p))*50;
    ctx.save();ctx.globalAlpha=oa*Math.min(1,p*1.5);ctx.translate(cx,cy);ctx.scale(s,s);ctx.translate(-cx,-cy);
    ctx.fillStyle='rgba(10,19,48,.78)';ctx.strokeStyle=i===0?col:'#6fa8ff';ctx.lineWidth=5;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,ty,tw,th,38);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    const im=o.asset?C.img(o.ic):null;
    if(im){const k=Math.min((tw-110)/im.width,(th-190)/im.height);ctx.drawImage(im,cx-im.width*k/2,ty+30+((th-190)-im.height*k)/2,im.width*k,im.height*k);}
    else if(o.ic&&!o.asset){ctx.font=C.font(190,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.ic,cx,ty+th/2-50);}
    else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,ty+th/2-50,80,0,Math.PI*2);ctx.fill();}
    if(o.l)txt(ctx,o.l,cx,ty+th-72,tw-50,2,50,26,800,'#fff');ctx.restore();});
  ctx.restore();
  // button + cursor click
  if(hasBtn){const bp=E.back(C.prog(t,.3+n*.3+.2,.3+n*.3+.8));if(bp>0){const bw=Math.min(980,Math.max(520,S(d.btn).length*52+200)),bh=130,bx=W/2-bw/2,by=H-(d.crowd===false?230:350),click=d.click!==false,ct=.3+n*.3+1.3,mv=E.io?E.io(C.prog(t,ct,ct+.9)):E.out(C.prog(t,ct,ct+.9)),pr=click&&t>ct+.9&&t<ct+1.2?.94:1;
    ctx.save();ctx.globalAlpha=oa*Math.min(1,bp);ctx.translate(W/2,by+bh/2);ctx.scale(Math.min(1,bp)*pr,Math.min(1,bp)*pr);ctx.translate(-W/2,-(by+bh/2));
    ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=30;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,bh/2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#10131f';ctx.font=C.font(Math.min(70,Math.floor((bw-100)/Math.max(4,S(d.btn).length*.62))),900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S(d.btn),W/2,by+bh/2+3);ctx.restore();
    if(click&&t>ct+.9){const rp=C.prog(t,ct+.9,ct+1.6);if(rp>0&&rp<1){ctx.save();ctx.globalAlpha=oa*(1-rp);ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.beginPath();ctx.arc(W/2+bw*.18,by+bh*.7,30+rp*90,0,Math.PI*2);ctx.stroke();ctx.restore();}}
    if(click){const sx=W/2+bw*.5+260,sy=by+bh+260,ex=W/2+bw*.18,ey=by+bh*.7;ctx.save();ctx.globalAlpha=oa*Math.min(1,C.prog(t,ct-.2,ct+.1));arrow(ctx,sx+(ex-sx)*mv,sy+(ey-sy)*mv,2.2);ctx.restore();}}}
  if(d.crowd!==false){const cp=C.prog(t,.8,3.0);ctx.save();ctx.globalAlpha=oa*.75;C.rCrowd(ctx,80,H-170,W-160,130,col,cp,7);ctx.restore();}}};
})();
