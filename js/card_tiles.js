// C105 (Y9 + Y24): do wide card.
// tiles  (Y9) : data:{title, items:['लेबल|पिल|आइकन', ...](2-4; पिल/आइकन optional; आइकन = asset path जैसे 06_icons/icon_bat), c:'g' (पिल का रंग y/g/r/b), banner:'', bg} -> glass tiles ek-ek pop, upar icon, label, neeche rangeen pill, aakhir mein banner pill
// levels (Y24): data:{title, items:['Level 1','Level 2','Level 3'](2-6), done:'1,2' (tick), lock:'3' (taala), hl:2 (peela border), pill:'To unlock: ...', bg} -> rows ek-ek slide, tick/lock pop, neeche pill
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',w:'#ffffff'};
C.tileItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>v!=null&&String(v).trim()).slice(0,6).map(s=>{const a=String(s).split('|').map(x=>x.trim());return{l:a[0],p:a[1]||'',i:a[2]||''};});
C.levelSet=s=>{const o={};String(s==null?'':s).split(/[,\s]+/).forEach(x=>{const n=parseInt(x);if(n>0)o[n]=1;});return o;};
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
function pill(ctx,txt,x,y,col,a,fs){ctx.save();ctx.globalAlpha=a;ctx.font=C.font(fs||44,800);const w=ctx.measureText(txt).width+100,h=(fs||44)*1.9;
  ctx.fillStyle='rgba(10,19,48,.8)';ctx.strokeStyle=col;ctx.lineWidth=3;ctx.shadowColor=col;ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,h/2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-w/2+40,y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,x-w/2+64,y+2);ctx.restore();}
C.CARDS.tiles={
 assets:d=>{const k=[d.bg||BG,VG];C.tileItems(d).forEach(o=>{if(o.i)k.push(o.i);});return k;},
 draw(ctx,t,d,sc){
  base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.tileItems(d),n=it.length,pc=COL[d.c]||COL.g,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(n<2){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('items mein kam se kam 2 tile do',W/2,H/2);ctx.restore();return;}
  const m=Math.min(n,4),cw=m<=3?520:420,ch=560,gap=50,rows=Math.ceil(n/m),tw=m*cw+(m-1)*gap,x0=W/2-tw/2,cy0=(d.title?150:90)+(d.banner?0:30);
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((o,i)=>{const r=Math.floor(i/m),c=i%m,a=.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const cnt=Math.min(m,n-r*m),rx=W/2-(cnt*cw+(cnt-1)*gap)/2+c*(cw+gap),x=rx+cw/2,y=cy0+ch/2+r*(ch+40)+(1-p)*50+(rows===1?60:0);
    ctx.save();ctx.globalAlpha=outA*p;ctx.translate(x,y);ctx.fillStyle='rgba(10,19,48,.7)';ctx.strokeStyle='rgba(255,255,255,.24)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-cw/2,-ch/2,cw,ch,36);ctx.fill();ctx.stroke();
    const im=o.i?C.img(o.i):null;if(im){const s=Math.min(200/im.width,200/im.height);ctx.drawImage(im,-im.width*s/2,-ch/2+50,im.width*s,im.height*s);}
    else{ctx.fillStyle='#6fa8ff';ctx.beginPath();ctx.arc(0,-ch/2+150,80,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.font=C.font(90,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),0,-ch/2+156);}
    const f=C.fitText(ctx,o.l,cw-60,2,54,32,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=5;
    const lh=Math.round(f.px*1.2),y0=60-(f.lines.length-1)*lh/2;f.lines.forEach((l,k)=>ctx.fillText(l,0,y0+k*lh));ctx.shadowBlur=0;ctx.restore();
    if(o.p){const pa=E.out(C.prog(t,a+.35,a+.8));if(pa>0)pill(ctx,o.p,x,y+ch/2-70,pc,pa*outA,38);}});
  if(d.banner){const ba=E.out(C.prog(t,.3+n*.3+.3,.3+n*.3+.8));if(ba>0)pill(ctx,String(d.banner),W/2,H-110+(1-ba)*20,COL.y,ba*outA,46);}
  ctx.restore();
 }};
function lockIcon(ctx,x,y,p){ctx.save();ctx.translate(x,y);ctx.scale(p,p);ctx.fillStyle='#8b93a3';ctx.strokeStyle='#8b93a3';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-10,13,Math.PI,0);ctx.lineTo(13,-2);ctx.moveTo(-13,-10);ctx.lineTo(-13,-2);ctx.stroke();ctx.beginPath();ctx.roundRect(-20,-2,40,30,7);ctx.fill();ctx.fillStyle='#10131f';ctx.beginPath();ctx.arc(0,12,4.5,0,Math.PI*2);ctx.fill();ctx.restore();}
C.CARDS.levels={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){
  base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.tileItems(d).map(o=>o.l),n=it.length,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  if(n<2){ctx.save();ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.fillText('items mein kam se kam 2 level do',W/2,H/2);ctx.restore();return;}
  const dn=C.levelSet(d.done),lk=C.levelSet(d.lock),hl=Math.round(+d.hl)||0,rw=1100,rh=Math.min(130,Math.floor((H-(d.title?200:120)-(d.pill?240:120))/n)),top=(d.title?200:110),gap=Math.min(26,rh*.2);
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((s,i)=>{const a=.3+i*.3,p=E.out(C.prog(t,a,a+.5));if(p<=0)return;const x=W/2-rw/2,y=top+i*(rh+gap),isH=hl===i+1;
    ctx.save();ctx.globalAlpha=outA*p;ctx.translate((1-p)*-120,0);
    ctx.fillStyle=isH?'rgba(40,36,10,.75)':'rgba(10,19,48,.7)';ctx.strokeStyle=isH?'#F5C518':'rgba(255,255,255,.22)';ctx.lineWidth=isH?5:2;if(isH){ctx.shadowColor='#F5C518';ctx.shadowBlur=24;}
    ctx.beginPath();ctx.roundRect(x,y,rw,rh,rh/2.4);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=isH?'#F5C518':'#6fa8ff';ctx.beginPath();ctx.arc(x+rh/2+10,y+rh/2,rh*.32,0,Math.PI*2);ctx.fill();ctx.fillStyle='#10131f';ctx.font=C.font(Math.round(rh*.4),900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),x+rh/2+10,y+rh/2+3);
    const f=C.fitText(ctx,s,rw-rh*2-60,1,Math.round(rh*.46),28,800);ctx.font=C.font(f.px,800);ctx.fillStyle=lk[i+1]?'#aab2c0':'#fff';ctx.textAlign='left';ctx.fillText(f.lines[0],x+rh+40,y+rh/2+3);
    ctx.restore();
    const ta=a+.5,tp=E.back(C.prog(t,ta,ta+.45));
    if(tp>0&&(dn[i+1]||lk[i+1])){ctx.save();ctx.globalAlpha=outA;const cx=x+rw-rh/2-10,cy=y+rh/2;
      if(dn[i+1]){ctx.translate(cx,cy);ctx.scale(tp,tp);ctx.fillStyle=COL.g;ctx.shadowColor=COL.g;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,0,rh*.3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#0a1330';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-rh*.12,1);ctx.lineTo(-rh*.03,rh*.1);ctx.lineTo(rh*.14,-rh*.1);ctx.stroke();}
      else lockIcon(ctx,cx,cy,tp*rh/70);ctx.restore();}});
  if(d.pill){const pa=E.out(C.prog(t,.3+n*.3+.5,.3+n*.3+1));if(pa>0)pill(ctx,String(d.pill),W/2,H-100+(1-pa)*20,COL.y,pa*outA,44);}
  ctx.restore();
 }};
})();
