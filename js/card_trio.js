// C109 (Y15 + Y12): do wide card.
// trio   (Y15): data:{title:'3 चीज़ों पर निर्भर', head:'वीडियो आइडिया' (pehla bada card), icon:'asset path' (optional), items:['शीर्षक|छोटी लाइन', ...](2-4), c:'y', bg} -> ek bada card, phir wo 2-4 chhote card mein khulta hai
// rating (Y12): data:{title, head:'एक फ़ैन' (optional chip), stars:4 (0-5, .5 chalta hai), label:'रेटिंग', tiles:['कितना देखा|80%','पसंद आया?|हाँ'] (0-2; label|value), c:'y', bg} -> glass card mein 5 star ek-ek bharte hain + neeche tiles
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'};
const parts=s=>String(s).split('|').map(x=>x.trim());
C.trioItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>v!=null&&String(v).trim()).slice(0,4).map(s=>{const a=parts(s);return{t:a[0],l:a[1]||''};});
C.rateTiles=d=>(Array.isArray(d.tiles)?d.tiles:[]).filter(v=>v!=null&&String(v).trim()).slice(0,2).map(s=>{const a=parts(s);return{l:a[0],v:a[1]||''};});
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a)=>{ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.shadowBlur=0;};
const star=(ctx,x,y,R,fill,col)=>{ctx.beginPath();for(let k=0;k<10;k++){const r=k%2?R*.42:R,a=-Math.PI/2+k*Math.PI/5;ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));}ctx.closePath();
  ctx.save();ctx.clip();ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(x-R,y-R,2*R,2*R);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.fillRect(x-R,y-R,2*R*fill,2*R);ctx.restore();
  ctx.beginPath();for(let k=0;k<10;k++){const r=k%2?R*.42:R,a=-Math.PI/2+k*Math.PI/5;ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));}ctx.closePath();ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();};
C.CARDS.trio={
 assets:d=>{const k=[d.bg||BG,VG];if(d.icon)k.push(d.icon);return k;},
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.trioItems(d),n=it.length;if(!n)return;const outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.y,cy=H/2+(d.title?30:0);
  const hp=E.out(C.prog(t,.2,.7)),sp=E.inOut?E.inOut(C.prog(t,1.4,2.2)):E.out(C.prog(t,1.4,2.2));
  ctx.save();ctx.globalAlpha=outA;
  // bada head card: khulte waqt chhota hokar upar chala jata hai
  if(d.head){const hw=900-sp*300,hh=300-sp*170,y=cy-(sp*300)+(1-hp)*40;if(hp>0){ctx.save();ctx.globalAlpha=outA*hp;panel(ctx,W/2-hw/2,y-hh/2,hw,hh,col,44);
    let tx=W/2;if(d.icon&&C.img(d.icon)){const s=hh-60;C.drawImg(ctx,d.icon,W/2-hw/2+34,y-s/2,s,s);tx=W/2+s/2;}
    const f=C.fitText(ctx,String(d.head),hw-(d.icon?hh+40:90),2,96-sp*30,36,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;const lh=f.px*1.15;f.lines.forEach((l,k)=>ctx.fillText(l,tx,y+(k-(f.lines.length-1)/2)*lh));ctx.restore();}}
  // chhote cards
  const cw=n>3?420:520,gap=36,tot=n*cw+(n-1)*gap,ch=470;
  it.forEach((o,i)=>{const a=1.6+i*.25,p=E.out(C.prog(t,a,a+.55));if(p<=0)return;const x=W/2-tot/2+i*(cw+gap),y=cy+(d.head?90:0)-ch/2+(1-p)*60;
   ctx.save();ctx.globalAlpha=outA*p;panel(ctx,x,y,cw,ch,col,36);
   ctx.beginPath();ctx.arc(x+cw/2,y+80,48,0,Math.PI*2);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#0a1330';ctx.font=C.font(60,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),x+cw/2,y+84);
   const f=C.fitText(ctx,String(o.t),cw-60,2,64,34,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';const lh=f.px*1.15;f.lines.forEach((l,k)=>ctx.fillText(l,x+cw/2,y+210+k*lh));
   if(o.l){const g=C.fitText(ctx,o.l,cw-60,3,40,28,700);ctx.font=C.font(g.px,700);ctx.fillStyle='#b8c4e0';const l2=g.px*1.2,y0=y+210+f.lines.length*lh+30;g.lines.forEach((l,k)=>ctx.fillText(l,x+cw/2,y0+k*l2));}
   ctx.restore();});
  ctx.restore();}};
C.CARDS.rating={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.y,tl=C.rateTiles(d),v=Math.max(0,Math.min(5,+d.stars||0));
  ctx.save();ctx.globalAlpha=outA;const cy=H/2+(d.title?-10:-30)-(tl.length?60:0);
  const cp=E.out(C.prog(t,.2,.7));if(cp>0){ctx.save();ctx.globalAlpha=outA*cp;const cw=1100,ch=330,y=cy-ch/2+(1-cp)*40;panel(ctx,W/2-cw/2,y,cw,ch,col,44);
   if(d.head){const f=C.fitText(ctx,String(d.head),cw-100,1,60,32,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#b8c4e0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],W/2,y+60);}
   const R=62,sp=170,x0=W/2-2*sp;for(let i=0;i<5;i++){const a=.6+i*.3,sp2=E.out(C.prog(t,a,a+.5)),fill=Math.max(0,Math.min(1,v-i))*sp2;star(ctx,x0+i*sp,y+(d.head?170:ch/2-10),R,fill,col);}
   if(d.label||v){const ep=E.out(C.prog(t,2.0,2.5)),txt=(d.label?d.label+'  ':'')+v+' / 5';ctx.globalAlpha=outA*cp*ep;ctx.font=C.font(52,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,W/2,y+ch-42);}
   ctx.restore();}
  const tw=620,tg=50,tot=tl.length*tw+(tl.length-1)*tg;
  tl.forEach((o,i)=>{const a=2.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const x=W/2-tot/2+i*(tw+tg),y=cy+165+60+(1-p)*40,h=220;ctx.save();ctx.globalAlpha=outA*p;panel(ctx,x,y,tw,h,'#6fa8ff',32);
   const lf=C.fitText(ctx,String(o.l),tw-50,1,42,26,700);ctx.font=C.font(lf.px,700);ctx.fillStyle='#b8c4e0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(lf.lines[0],x+tw/2,y+55);
   const vf=C.fitText(ctx,String(o.v),tw-50,1,92,40,900);ctx.font=C.font(vf.px,900);ctx.fillStyle='#fff';ctx.fillText(vf.lines[0],x+tw/2,y+147);ctx.restore();});
  ctx.restore();}};
})();
