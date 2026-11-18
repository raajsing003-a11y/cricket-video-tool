// C106 (Y7 + Y25): do wide card.
// chip    (Y7) : data:{name:'Channel Studio', by:'by Rahul' (optional), icon:'asset path' (optional), title, c:'y' (rang y/g/r/b), bg} -> beech mein bada rounded chip (icon + naam + chhota "by" line), pop-in + halka float
// options (Y25): data:{title, items:['शीर्षक|छोटी लाइन|आइकन', ...](2-4), pills:['जल्दी चाहिए?|g','अपने आप खुलता है|x'] (0-2; rang y/g/r/b/x), hl:1 (optional), bg} -> option cards ek-ek pop, neeche pills
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',x:'#aab2c0',w:'#ffffff'};
C.optItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>v!=null&&String(v).trim()).slice(0,4).map(s=>{const a=String(s).split('|').map(x=>x.trim());return{t:a[0],l:a[1]||'',i:a[2]||''};});
C.optPills=d=>(Array.isArray(d.pills)?d.pills:[]).filter(v=>v!=null&&String(v).trim()).slice(0,2).map(s=>{const a=String(s).split('|').map(x=>x.trim());return{t:a[0],c:COL[a[1]]?a[1]:'x'};});
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
function pill(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;ctx.font=C.font(fs,800);const w=ctx.measureText(txt).width+100,h=fs*1.9;
  ctx.fillStyle='rgba(10,19,48,.8)';ctx.strokeStyle=col;ctx.lineWidth=3;ctx.shadowColor=col;ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,h/2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-w/2+40,y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,x-w/2+64,y+2);ctx.restore();return w;}
function icon(ctx,k,cx,cy,sz,fallback,col){const im=k?C.img(k):null;if(im){const s=Math.min(sz/im.width,sz/im.height);ctx.drawImage(im,cx-im.width*s/2,cy-im.height*s/2,im.width*s,im.height*s);}
  else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,cy,sz*.42,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.font=C.font(Math.round(sz*.45),900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(fallback,cx,cy+3);}}
C.CARDS.chip={
 assets:d=>{const k=[d.bg||BG,VG];if(d.icon)k.push(d.icon);return k;},
 draw(ctx,t,d,sc){
  base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,name=String(d.name||''),by=String(d.by||''),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(!name.trim()){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('name zaruri hai',W/2,H/2);ctx.restore();return;}
  const p=E.back(C.prog(t,.3,.9)),fl=Math.sin(t*1.6)*6;if(p<=0)return;
  ctx.save();ctx.globalAlpha=outA*Math.min(1,p*2);ctx.translate(W/2,H/2+(d.title?40:0)+fl);ctx.scale(Math.max(.01,p),Math.max(.01,p));
  ctx.font=C.font(110,900);const nw=ctx.measureText(name).width;ctx.font=C.font(52,700);const bw=by?ctx.measureText(by).width:0;
  const hasI=!!d.icon||true,iw=200,tw=Math.max(nw,bw),cw=Math.min(1700,tw+iw+170),ch=by?260:220,fs=cw<tw+iw+170?(cw-iw-170)/tw:1;
  ctx.shadowColor=col;ctx.shadowBlur=40;ctx.fillStyle='rgba(10,19,48,.86)';ctx.strokeStyle=col;ctx.lineWidth=6;ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,ch/2.6);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  icon(ctx,d.icon,-cw/2+iw/2+40,0,150,(name.trim()[0]||'?').toUpperCase(),col);
  ctx.textAlign='left';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;
  ctx.font=C.font(Math.round(110*fs),900);ctx.fillStyle='#fff';ctx.fillText(name,-cw/2+iw+70,by?-34:4);
  if(by){ctx.font=C.font(Math.round(52*fs),700);ctx.fillStyle=col;ctx.fillText(by,-cw/2+iw+74,60);}
  ctx.restore();
 }};
C.CARDS.options={
 assets:d=>{const k=[d.bg||BG,VG];C.optItems(d).forEach(o=>{if(o.i)k.push(o.i);});return k;},
 draw(ctx,t,d,sc){
  base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.optItems(d),n=it.length,pl=C.optPills(d),hl=Math.round(+d.hl)||0,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(n<2){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('items mein kam se kam 2 option do',W/2,H/2);ctx.restore();return;}
  const cw=n===4?410:n===3?520:640,ch=560,gap=44,tw=n*cw+(n-1)*gap,x0=W/2-tw/2,cy=(d.title?150:90)+ch/2+(pl.length?10:50);
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((o,i)=>{const a=.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const isH=hl===i+1,x=x0+i*(cw+gap)+cw/2,y=cy+(1-p)*50;
    ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x,y);ctx.fillStyle=isH?'rgba(40,36,10,.75)':'rgba(10,19,48,.7)';ctx.strokeStyle=isH?'#F5C518':'rgba(255,255,255,.24)';ctx.lineWidth=isH?5:2;if(isH){ctx.shadowColor='#F5C518';ctx.shadowBlur=24;}
    ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,36);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    icon(ctx,o.i,0,-ch/2+130,190,String(i+1),'#6fa8ff');
    const f=C.fitText(ctx,o.t,cw-60,2,54,32,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=5;
    const lh=Math.round(f.px*1.2),y0=60-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,0,y0+k*lh));
    if(o.l){const g=C.fitText(ctx,o.l,cw-70,3,38,26,600);ctx.font=C.font(g.px,600);ctx.fillStyle='#aab6d0';const l2=Math.round(g.px*1.25),yy=y0+f.lines.length*lh+34;g.lines.forEach((l,k)=>ctx.fillText(l,0,yy+k*l2));}
    ctx.shadowBlur=0;ctx.restore();});
  const pa0=.3+n*.3+.3;pl.forEach((o,k)=>{const pa=E.out(C.prog(t,pa0+k*.25,pa0+k*.25+.45));if(pa<=0)return;ctx.font=C.font(44,800);const w=ctx.measureText(o.t).width+100;
    const xs=pl.length===2?[W/2-w/2-40-(k?0:0),0]:[W/2,0];let x=W/2;if(pl.length===2){ctx.font=C.font(44,800);const w0=ctx.measureText(pl[0].t).width+100,w1=ctx.measureText(pl[1].t).width+100,tot=w0+w1+50;x=k===0?W/2-tot/2+w0/2:W/2+tot/2-w1/2;}
    pill(ctx,o.t,x,H-120+(1-pa)*20,COL[o.c],pa*outA,44);});
  ctx.restore();
 }};
})();
