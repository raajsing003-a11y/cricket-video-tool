// C114 (Y26 + Y27 + Y28): teen wide card.
// setting (Y26): data:{title, step:'सेटिंग 3', name:'कीवर्ड', pills:['चैनल नाम','गलत स्पेलिंग','आपका niche'] (1-4; 'text|रंग' bhi chalta hai), c:'y', bg} -> upar step badge + naam, neeche pills ek-ek pop
// radio   (Y27): data:{title, items:['option',...](2-5), hl:2 ya [1,3] (peele border wali rows, 1 se), pill:'बच्चों के लिए नहीं|g' (optional), c:'y', bg} -> radio rows ek-ek, hl wali row mein bhara dot + peela border
// ideas   (Y28): data:{title, items:['शीर्षक|छोटी लाइन|आइकन'](2-3), avatar:'आपकी ऑडियंस', av:'asset path' (optional), c:'y', bg} -> idea cards pop, neeche avatar chip + upar ki taraf connector lines
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',x:'#aab2c0',w:'#ffffff'};
const S=v=>v==null?'':String(v).trim();
const parse=(arr,max)=>(Array.isArray(arr)?arr:[]).filter(v=>S(v)).slice(0,max).map(s=>String(s).split('|').map(x=>x.trim()));
C.setPills=d=>parse(d.pills,4).map(a=>({t:a[0],c:COL[a[1]]?a[1]:''}));
C.radioItems=d=>parse(d.items,5).map(a=>a[0]).filter(Boolean);
C.radioHl=d=>{const h=Array.isArray(d.hl)?d.hl:(d.hl==null||d.hl===''?[]:[d.hl]);return h.map(x=>Math.round(+x)).filter(x=>x>=1);};
C.ideaItems=d=>parse(d.items,3).map(a=>({t:a[0],l:a[1]||'',i:a[2]||''})).filter(o=>o.t);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
function rr(ctx,x,y,w,h,r,fill,stroke,lw,glow){ctx.save();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=lw||3;if(glow){ctx.shadowColor=stroke;ctx.shadowBlur=glow;}ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();if(lw!==0)ctx.stroke();ctx.restore();}
function msg(ctx,txt){const W=C.W,H=C.H;ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText(txt,W/2,H/2);ctx.restore();}
function icon(ctx,k,cx,cy,sz,fb,col){const im=k?C.img(k):null;if(im){const s=Math.min(sz/im.width,sz/im.height);ctx.drawImage(im,cx-im.width*s/2,cy-im.height*s/2,im.width*s,im.height*s);}
  else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,cy,sz*.42,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.font=C.font(Math.round(sz*.45),900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(fb,cx,cy+3);}}
// ---- Y26 setting
C.CARDS.setting={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,col=COL[d.c]||COL.y,pl=C.setPills(d),step=S(d.step),name=S(d.name),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(!step&&!name){msg(ctx,'step ya name do');return;}
  const hp=E.back(C.prog(t,.25,.8));if(hp<=0)return;const hy=H/2-(pl.length?90:0)+(d.title?30:0);
  ctx.save();ctx.globalAlpha=outA*Math.min(1,hp*2);ctx.translate(W/2,hy);ctx.scale(Math.max(.01,hp),Math.max(.01,hp));
  ctx.font=C.font(88,900);const sw=step?ctx.measureText(step).width+90:0;let nf=96;ctx.font=C.font(nf,900);let nw=name?ctx.measureText(name).width:0;
  while(nf>44&&sw+nw+(sw&&name?50:0)+120>1700){nf-=4;ctx.font=C.font(nf,900);nw=ctx.measureText(name).width;}
  const tot=sw+nw+(sw&&name?50:0)+120,h=190;let x=-tot/2;rr(ctx,x,-h/2,tot,h,h/2.4,'rgba(10,19,48,.86)',col,6,36);x+=60;ctx.textBaseline='middle';ctx.textAlign='left';
  if(step){ctx.font=C.font(96,900);rr(ctx,x,-68,sw,136,68,col,col,0);ctx.fillStyle='#10131f';ctx.font=C.font(88,900);ctx.fillText(step,x+45,8);x+=sw+50;}
  if(name){ctx.font=C.font(nf,900);ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;ctx.fillText(name,x,4);}
  ctx.restore();
  const fs=pl.length>3?42:50;ctx.save();ctx.font=C.font(fs,800);const ws=pl.map(o=>ctx.measureText(o.t).width+110),gap=36,py=hy+190;
  // 1 line mein na aaye to 2 line
  const tw=ws.reduce((a,b)=>a+b,0)+gap*Math.max(0,pl.length-1),two=tw>W-160;ctx.restore();
  pl.forEach((o,i)=>{const a=1.0+i*.4,p=E.out(C.prog(t,a,a+.45));if(p<=0)return;const pc=o.c?COL[o.c]:'#6fa8ff';let x,y;
    if(!two){const before=ws.slice(0,i).reduce((q,b)=>q+b,0)+gap*i;x=W/2-tw/2+before+ws[i]/2;y=py;}
    else{const half=Math.ceil(pl.length/2),row=i<half?0:1,idx=row?i-half:i,grp=row?ws.slice(half):ws.slice(0,half),gt=grp.reduce((q,b)=>q+b,0)+gap*(grp.length-1);x=W/2-gt/2+grp.slice(0,idx).reduce((q,b)=>q+b,0)+gap*idx+grp[idx]/2;y=py+row*130;}
    ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x,y+(1-p)*30);ctx.font=C.font(fs,800);const w=ws[i],h=fs*1.9;
    rr(ctx,-w/2,-h/2,w,h,h/2,'rgba(10,19,48,.82)',pc,3,14);ctx.fillStyle=pc;ctx.beginPath();ctx.arc(-w/2+42,0,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(o.t,-w/2+68,2);ctx.restore();});
 }};
// ---- Y27 radio
C.CARDS.radio={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.radioItems(d),n=it.length,hl=C.radioHl(d),col=COL[d.c]||COL.y,pillS=S(d.pill),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(n<2){msg(ctx,'items mein kam se kam 2 option do');return;}
  const rw=1300,rh=n>=5?118:n===4?132:150,gap=26,tot=n*rh+(n-1)*gap,top=(d.title?190:120)+((H-(d.title?190:120)-(pillS?210:90))-tot)/2,x0=W/2-rw/2;
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((s,i)=>{const a=.3+i*.28,p=E.out(C.prog(t,a,a+.45));if(p<=0)return;const isH=hl.includes(i+1),y=top+i*(rh+gap)+(1-p)*40;
    ctx.save();ctx.globalAlpha=outA*p;
    rr(ctx,x0,y,rw,rh,28,isH?'rgba(40,36,10,.78)':'rgba(10,19,48,.7)',isH?col:'rgba(255,255,255,.24)',isH?6:2,isH?26:0);
    const cx=x0+80,cy=y+rh/2;ctx.strokeStyle=isH?col:'#8fa0c4';ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx,cy,28,0,Math.PI*2);ctx.stroke();
    if(isH){const dp=E.back(C.prog(t,a+.5,a+.9));if(dp>0){ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(cx,cy,16*Math.min(1,dp),0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
    const f=C.fitText(ctx,s,rw-200,1,64,34,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(f.lines[0],x0+150,cy+3);ctx.restore();});
  if(pillS){const a=.3+n*.28+.5,pa=E.out(C.prog(t,a,a+.5));if(pa>0){const a2=pillS.split('|'),txt=a2[0].trim(),pc=COL[(a2[1]||'').trim()]||col;ctx.save();ctx.globalAlpha=outA*pa;ctx.font=C.font(52,800);const w=ctx.measureText(txt).width+120,h=100,y=H-120+(1-pa)*20;
    rr(ctx,W/2-w/2,y-h/2,w,h,h/2,'rgba(10,19,48,.85)',pc,4,18);ctx.fillStyle=pc;ctx.beginPath();ctx.arc(W/2-w/2+48,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,W/2-w/2+76,y+3);ctx.restore();}}
  ctx.restore();
 }};
// ---- Y28 ideas
C.CARDS.ideas={assets:d=>{const k=[d.bg||BG,VG];C.ideaItems(d).forEach(o=>{if(o.i)k.push(o.i);});if(d.av)k.push(d.av);return k;},
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.ideaItems(d),n=it.length,col=COL[d.c]||COL.y,av=S(d.avatar),outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(n<2){msg(ctx,'items mein kam se kam 2 idea do');return;}
  const cw=n===3?520:640,ch=470,gap=50,tw=n*cw+(n-1)*gap,x0=W/2-tw/2,cy=(d.title?170:100)+ch/2;
  ctx.save();ctx.globalAlpha=outA;
  // connector lines avatar -> cards
  const avY=H-130,lp=E.out(C.prog(t,.3+n*.3+.2,.3+n*.3+.9));
  if(av&&lp>0){ctx.save();ctx.globalAlpha=outA*lp;ctx.strokeStyle=col;ctx.lineWidth=5;ctx.setLineDash([14,12]);ctx.shadowColor=col;ctx.shadowBlur=10;it.forEach((o,i)=>{const x=x0+i*(cw+gap)+cw/2;ctx.beginPath();ctx.moveTo(W/2,avY-64);ctx.lineTo(x,cy+ch/2+(avY-64-cy-ch/2)*(1-lp));ctx.stroke();});ctx.restore();}
  it.forEach((o,i)=>{const a=.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const x=x0+i*(cw+gap)+cw/2,y=cy+(1-p)*50;
    ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x,y);rr(ctx,-cw/2,-ch/2,cw,ch,36,'rgba(10,19,48,.74)','rgba(255,255,255,.26)',2,0);
    icon(ctx,o.i,0,-ch/2+120,170,String(i+1),col);
    const f=C.fitText(ctx,o.t,cw-60,2,52,32,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=5;
    const lh=Math.round(f.px*1.2),y0=50-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,0,y0+k*lh));
    if(o.l){const g=C.fitText(ctx,o.l,cw-70,3,36,26,600);ctx.font=C.font(g.px,600);ctx.fillStyle='#aab6d0';const l2=Math.round(g.px*1.25),yy=y0+f.lines.length*lh+34;g.lines.forEach((l,k)=>ctx.fillText(l,0,yy+k*l2));}
    ctx.shadowBlur=0;ctx.restore();});
  if(av){const ap=E.back(C.prog(t,.3+n*.3+.1,.3+n*.3+.7));if(ap>0){ctx.save();ctx.globalAlpha=outA*Math.min(1,ap*2);ctx.translate(W/2,avY);ctx.scale(Math.max(.01,ap),Math.max(.01,ap));ctx.font=C.font(52,800);const w=ctx.measureText(av).width+190,h=128;
    rr(ctx,-w/2,-h/2,w,h,h/2,'rgba(10,19,48,.9)',col,5,26);const ax=-w/2+72;
    if(d.av&&C.img(d.av)){ctx.save();ctx.beginPath();ctx.arc(ax,0,46,0,Math.PI*2);ctx.clip();C.cover(ctx,C.img(d.av),ax-46,-46,92,92,1);ctx.restore();ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.arc(ax,0,46,0,Math.PI*2);ctx.stroke();}
    else{ctx.fillStyle=col;ctx.beginPath();ctx.arc(ax,0,46,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(ax,-10,15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(ax,28,26,17,0,Math.PI,0);ctx.fill();}
    ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(av,ax+72,3);ctx.restore();}}
  ctx.restore();
 }};
})();
