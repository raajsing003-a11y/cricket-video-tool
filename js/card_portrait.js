// C110 (Y8 + Y13): do wide card.
// portrait (Y8): data:{text:'लिंक *डिस्क्रिप्शन* में', sub:'' (chhoti line), photo:'19_presenter/presenter_point_left' (asset path), side:'r' (presenter daayein; 'l' = baayein), c:'y', title, bg} -> presenter glass portrait card mein, text ek taraf, *shabd* peela
// phone    (Y13): data:{title, feed:['पोस्ट 1','पोस्ट 2',...] (0-8 line; phone mein scroll hoti hai), label:'इम्प्रेशन', n:1 (counter, count-up), c:'y', bg} -> phone mock + counter box
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff'},PH='19_presenter/presenter_point_left';
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r,a)=>{ctx.fillStyle='rgba(10,19,48,'+(a||.74)+')';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.shadowBlur=0;};
// "*peela* shabd" -> [{w,y}]
C.starWords=s=>{const out=[];let y=false;String(s==null?'':s).split(/(\*)/).forEach(p=>{if(p==='*'){y=!y;return;}p.split(/(\s+)/).forEach(w=>{if(w)out.push({w,y});});});return out;};
function wrap(ctx,words,maxW,px){ctx.font=C.font(px,900);const lines=[[]],ws=[0];words.forEach(o=>{const w=ctx.measureText(o.w).width,L=lines[lines.length-1];if(/^\s+$/.test(o.w)&&!L.length)return;if(ws[ws.length-1]+w>maxW&&L.length&&!/^\s+$/.test(o.w)){lines.push([o]);ws.push(w);}else{L.push(o);ws[ws.length-1]+=w;}});return{lines,ws};}
const dec=v=>(String(v).split('.')[1]||'').length;
C.CARDS.portrait={
 assets:d=>[d.bg||BG,VG,d.photo||PH],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.y,right=d.side!=='l',cy=H/2+(d.title?40:0);
  ctx.save();ctx.globalAlpha=outA;
  const pw=620,ph=760,px=right?W-pw-150:150,pp=E.out(C.prog(t,.2,.8)),py=cy-ph/2+(1-pp)*60;
  if(pp>0){ctx.save();ctx.globalAlpha=outA*pp;panel(ctx,px,py,pw,ph,col,52,.8);ctx.save();ctx.beginPath();ctx.roundRect(px,py,pw,ph,52);ctx.clip();
   const im=C.img(d.photo||PH);if(im){const iw=im.width||im.naturalWidth,ih=im.height||im.naturalHeight,s=Math.min((pw-40)/iw,(ph-20)/ih)*1.08,w=iw*s,h=ih*s;ctx.drawImage(im,px+pw/2-w/2,py+ph-h+6,w,h);}ctx.restore();ctx.restore();}
  const tx=right?150:px+pw+90,tw=W-pw-150-150-90,tp=E.out(C.prog(t,.7,1.3));
  if(d.text&&tp>0){const words=C.starWords(d.text);let px2=120,w;for(;px2>48;px2-=6){w=wrap(ctx,words,tw,px2);if(w.lines.length<=3)break;}w=wrap(ctx,words,tw,px2);const lh=px2*1.22,y0=cy-(w.lines.length*lh)/2-(d.sub?40:0)+(1-tp)*30;
   ctx.save();ctx.globalAlpha=outA*tp;ctx.font=C.font(px2,900);ctx.textBaseline='middle';ctx.textAlign='left';
   w.lines.forEach((L,i)=>{let x=tx;L.forEach(o=>{ctx.fillStyle=o.y?COL.y:'#fff';ctx.shadowColor=o.y?COL.y:'rgba(0,0,0,.6)';ctx.shadowBlur=o.y?16:8;ctx.fillText(o.w,x,y0+(i+.5)*lh);x+=ctx.measureText(o.w).width;});});
   if(d.sub){ctx.shadowBlur=0;ctx.font=C.font(52,700);ctx.fillStyle='#b8c4e0';const f=C.fitText(ctx,String(d.sub),tw,2,52,30,700);ctx.font=C.font(f.px,700);f.lines.forEach((l,k)=>ctx.fillText(l,tx,y0+w.lines.length*lh+50+k*f.px*1.25));}
   ctx.restore();}
  ctx.restore();}};
C.CARDS.phone={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.y,cy=H/2+(d.title?40:0),feed=(Array.isArray(d.feed)?d.feed:[]).filter(v=>v!=null&&String(v).trim()).slice(0,8);
  ctx.save();ctx.globalAlpha=outA;
  const pw=470,ph=800,hasN=d.n!=null&&d.n!==''&&isFinite(+d.n),px=hasN?W/2-pw-80:W/2-pw/2,pp=E.out(C.prog(t,.2,.8)),py=cy-ph/2+(1-pp)*60;
  if(pp>0){ctx.save();ctx.globalAlpha=outA*pp;panel(ctx,px,py,pw,ph,'#9aa8c8',64,.92);const sx=px+22,sy=py+22,sw=pw-44,sh=ph-44;ctx.save();ctx.beginPath();ctx.roundRect(sx,sy,sw,sh,46);ctx.clip();ctx.fillStyle='#0b1226';ctx.fillRect(sx,sy,sw,sh);
   const cardH=190,g=26,sp=(t-.9)*150,off=Math.max(0,sp)%(Math.max(feed.length,1)*(cardH+g));const rows=feed.length?feed:['','',''];
   for(let k=0;k<rows.length*2;k++){const y=sy+90+k*(cardH+g)-off;if(y>sy+sh||y+cardH<sy)continue;const s=rows[k%rows.length],cc=['#6fa8ff','#2ecc71','#F5C518','#ff7a59'][k%4];
    ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.roundRect(sx+22,y,sw-44,cardH,26);ctx.fill();ctx.fillStyle=cc;ctx.beginPath();ctx.arc(sx+78,y+60,32,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.roundRect(sx+130,y+38,150,16,8);ctx.fill();ctx.beginPath();ctx.roundRect(sx+130,y+66,100,14,7);ctx.fill();
    if(s){const f=C.fitText(ctx,String(s),sw-120,1,40,24,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(f.lines[0],sx+48,y+142);}}
   ctx.restore();ctx.fillStyle='#000';ctx.beginPath();ctx.roundRect(px+pw/2-70,py+30,140,30,15);ctx.fill();ctx.restore();}
  if(hasN){const bp=E.out(C.prog(t,1.2,1.8)),cp=E.out(C.prog(t,1.6,2.8));if(bp>0){const bw=640,bh=420,bx=W/2+40,by=cy-bh/2+(1-bp)*40,nn=+d.n,dd=dec(d.n);ctx.save();ctx.globalAlpha=outA*bp;panel(ctx,bx,by,bw,bh,col,44);
    if(d.label){const f=C.fitText(ctx,String(d.label),bw-60,1,56,30,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#b8c4e0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],bx+bw/2,by+85);}
    const full=C.fmtNum?C.fmtNum(nn,dd):String(nn);let fs=190;ctx.font=C.font(fs,900);const fw=ctx.measureText(full).width;if(fw>bw-70)fs=Math.floor(fs*(bw-70)/fw);ctx.font=C.font(fs,900);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=24;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(C.fmtNum?C.fmtNum(nn*cp,dd):String(nn*cp),bx+bw/2,by+250);ctx.restore();}}
  ctx.restore();}};
})();
