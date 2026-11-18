// C130 (V8-V14): Video-3 style ke baaki cards. card_v.js helpers (C.vBase, C.vText). Sirf wide.
// plans     (V8):  data:{title, items:['Pro|$20|*best* value','Max|$100|note'] (2-3, 'naam|keemat|note'), hl:1 (0=koi nahi), badge:'Most popular', c}
// timelist  (V9):  data:{title, items:['Research|15','Script|30'] (2-6, 'naam|number'), unit:'min', total:'Total: 45 min' (optional)}
// ctapill   (V10): data:{title, btn:'Join Now', n:'14', nl:'days left' (n serif italic blue), note}
// adcard    (V11): data:{title, old:'$99', price:'$49', btn:'Buy now', proof:['..','..'] (0-6 chhoti line, piche halke card), note}
// uimock    (V12): data:{title, url:'', beats:['..'] (1-4), options:['A|..','B|..'] (2-3), pick:1, click:true}
// checklist (V13): data:{title:'window naam', items:['step *1*','step 2'] (2-6), note}
// chips     (V14): data:{title, chips:['Short-form *skill*',..] (2-6), thumbs:['slot/asset',..] (0-4 -> 2x2), pills:['L','R'] (0-2)}
(function(){const C=window.CORE,E=C.ease;
const BLUE='#3b9bff',S=v=>v==null?'':String(v).trim(),L=(v,n)=>(Array.isArray(v)?v:[]).map(S).filter(Boolean).slice(0,n);
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const slot=k=>!!(k&&C.photos&&C.photos[k]);const pimg=k=>k?((C.photos&&C.photos[k])||C.img(k)):null;
const msg=(ctx,t)=>{ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,C.W/2,C.H/2);};
const parts=s=>String(s).split('|').map(x=>x.trim());
function head(ctx,t,d,oa){if(!d.title)return 0;const p=E.out(C.prog(t,.05,.5));ctx.save();ctx.globalAlpha=oa*p;C.vText(ctx,S(d.title),C.W/2,98+12*(1-p),1640,1,58,32,{wt:700});ctx.restore();return 150;}
function card(ctx,x,y,w,h,glow,r,fill){ctx.save();ctx.shadowColor=glow?'rgba(59,155,255,.85)':'rgba(0,0,0,.45)';ctx.shadowBlur=glow?44:18;ctx.fillStyle=fill||'rgba(18,28,50,.93)';ctx.beginPath();ctx.roundRect(x,y,w,h,r||26);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=glow?BLUE:'rgba(255,255,255,.16)';ctx.lineWidth=glow?4:2;ctx.stroke();ctx.restore();}
function bluePill(ctx,s,cx,cy,sc,pulse){const f=C.fitText(ctx,s,900,1,66,34,800);ctx.save();ctx.font=C.font(f.px,800);const w=ctx.measureText(f.lines[0]).width+130,h=f.px+58;ctx.translate(cx,cy);ctx.scale(sc,sc);ctx.shadowColor='rgba(59,155,255,'+(.55+.25*pulse)+')';ctx.shadowBlur=36+16*pulse;ctx.fillStyle=BLUE;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,h/2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,3);ctx.restore();return{w,h};}
function cursor(ctx,x,y,s,press){ctx.save();ctx.translate(x,y);ctx.scale(s*(press?.9:1),s*(press?.9:1));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,34);ctx.lineTo(9,26);ctx.lineTo(16,42);ctx.lineTo(23,39);ctx.lineTo(16,24);ctx.lineTo(28,24);ctx.closePath();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=10;ctx.fillStyle='#fff';ctx.fill();ctx.shadowBlur=0;ctx.lineWidth=3;ctx.strokeStyle='#10131f';ctx.stroke();ctx.restore();}
function wchrome(ctx,x,y,w,h,title,glow){card(ctx,x,y,w,h,glow,22,'#121a2b');['#ff5f57','#febc2e','#28c840'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x+34+i*30,y+32,8,0,Math.PI*2);ctx.fill();});if(title){ctx.fillStyle='#8b97ad';ctx.font=C.font(26,600);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(title,x+w/2,y+33);}}
// V8 plans
C.CARDS.plans={assets:d=>[],draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=L(d.items,3).map(parts);C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-3 "naam|keemat|note" do');return;}
  const top=head(ctx,t,d,oa)||90,n=it.length,cw=Math.min(520,(W-300-(n-1)*60)/n),ch=H-top-170,hl=Math.round(+d.hl||0);
  it.forEach((o,i)=>{const x=W/2-(n*cw+(n-1)*60)/2+i*(cw+60),a0=.25+i*.25,p=E.out(C.prog(t,a0,a0+.55));if(p<=0)return;const g=hl===i+1,sc2=g?1.04:1,y=top+30+(1-p)*40;
    ctx.save();ctx.globalAlpha=oa*p*(hl&&!g?.55:1);ctx.translate(x+cw/2,y+ch/2);ctx.scale(sc2,sc2);ctx.translate(-cw/2,-ch/2);card(ctx,0,0,cw,ch,g);
    C.vText(ctx,o[0]||'',cw/2,ch*.2,cw-60,1,64,34,{wt:700,col:'#b8c4e0'});C.vText(ctx,o[1]||'',cw/2,ch*.5,cw-50,1,130,54,{wt:900});if(o[2])C.vText(ctx,o[2],cw/2,ch*.8,cw-70,2,44,26,{wt:600,col:'#b8c4e0'});
    if(g&&S(d.badge)){const f=C.fitText(ctx,S(d.badge),cw-40,1,34,20,800);ctx.font=C.font(f.px,800);const bw=ctx.measureText(f.lines[0]).width+44;ctx.fillStyle=BLUE;ctx.beginPath();ctx.roundRect(cw/2-bw/2,-24,bw,48,24);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],cw/2,1);}
    ctx.restore();});}};
// V9 timelist
C.CARDS.timelist={assets:d=>[],draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=L(d.items,6).map(parts).map(a=>({l:a[0],v:parseFloat(a[1])})).filter(o=>o.l&&isFinite(o.v));C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-6 "naam|number" do');return;}
  const top=head(ctx,t,d,oa)||90,unit=S(d.unit),mx=Math.max.apply(null,it.map(o=>o.v)),rh=Math.min(110,(H-top-(d.total?240:130))/it.length),x0=330,bw=W-x0*2-230;
  ctx.save();ctx.globalAlpha=oa;it.forEach((o,i)=>{const a0=.3+i*.35,p=E.out(C.prog(t,a0,a0+.5)),bp=E.out(C.prog(t,a0+.1,a0+.9));if(p<=0)return;const y=top+30+i*rh+rh/2;ctx.save();ctx.globalAlpha=oa*p;
    C.vText(ctx,o.l,x0-30,y,x0-80+120,1,54,28,{align:'right',wt:700});ctx.fillStyle='rgba(255,255,255,.07)';ctx.beginPath();ctx.roundRect(x0,y-18,bw,36,18);ctx.fill();
    const g=ctx.createLinearGradient(x0,0,x0+bw,0);g.addColorStop(0,'#2a6fdb');g.addColorStop(1,BLUE);ctx.fillStyle=g;ctx.shadowColor='rgba(59,155,255,.6)';ctx.shadowBlur=14;ctx.beginPath();ctx.roundRect(x0,y-18,Math.max(36,bw*o.v/mx*bp),36,18);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.font=C.font(50,800);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText((Math.round(o.v*bp*10)/10)+(unit?' '+unit:''),x0+bw+30,y);ctx.restore();});
  if(d.total){const tp=E.out(C.prog(t,.3+it.length*.35+.3,.3+it.length*.35+.9));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.total),W/2,H-95+14*(1-tp),1500,1,76,36,{wt:800});}ctx.restore();}};
// V10 ctapill
C.CARDS.ctapill={assets:d=>[],draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc);C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.globalAlpha=oa*tp;C.vText(ctx,S(d.title),W/2,H*.3+16*(1-tp),1600,2,96,44,{wt:700});ctx.globalAlpha=oa;}
  const bp=E.back(C.prog(t,.5,1.1));if(bp>0)bluePill(ctx,S(d.btn)||'Join Now',W/2,H*.55,Math.min(1,bp),(Math.sin(t*3)+1)/2);
  if(S(d.n)){const np=E.out(C.prog(t,1.0,1.6));ctx.globalAlpha=oa*np;const nl=S(d.nl)||'days left',s1='only ',px=76;ctx.font=C.font(px,600);const w1=ctx.measureText(s1).width;ctx.font=C.vSerif(Math.round(px*1.4));const w2=ctx.measureText(S(d.n)).width;ctx.font=C.font(px,600);const w3=ctx.measureText(' '+nl).width,x0=W/2-(w1+w2+w3)/2,y=H*.75+14*(1-np);
    ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(s1,x0,y);ctx.font=C.vSerif(Math.round(px*1.4));ctx.fillStyle=BLUE;ctx.shadowColor=BLUE;ctx.shadowBlur=18;ctx.fillText(S(d.n),x0+w1,y);ctx.shadowBlur=0;ctx.font=C.font(px,600);ctx.fillStyle='#fff';ctx.fillText(' '+nl,x0+w1+w2,y);}
  if(d.note){const a=E.out(C.prog(t,1.5,2.1));ctx.globalAlpha=oa*a;C.vText(ctx,S(d.note),W/2,H-80,1500,1,46,26,{wt:600,col:'#8b97ad'});}ctx.restore();}};
// V11 adcard
C.CARDS.adcard={assets:d=>[],draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),pr=L(d.proof,6);C.vBase(ctx,t);ctx.save();ctx.globalAlpha=oa;
  pr.forEach((s,i)=>{const p=E.out(C.prog(t,i*.12,i*.12+.5)),cw=520,ch=150,x=[90,W-90-cw,260,W-260-cw,60,W-60-cw][i%6],y=[110,130,430,460,750,770][i%6];ctx.save();ctx.globalAlpha=oa*p*.32;ctx.translate(0,Math.sin(t*.8+i)*8);card(ctx,x,y,cw,ch,false,20);C.vText(ctx,s,x+cw/2,y+ch/2,cw-50,2,36,22,{wt:600,col:'#b8c4e0'});ctx.restore();});
  const cw=900,ch=640,x=W/2-cw/2,y=H/2-ch/2-20,cp=E.out(C.prog(t,.3,.9));ctx.globalAlpha=oa*cp;ctx.translate(0,(1-cp)*40);card(ctx,x,y,cw,ch,true,36);
  if(d.title)C.vText(ctx,S(d.title),W/2,y+85,cw-100,1,58,30,{wt:700});
  if(S(d.old)){ctx.font=C.font(78,700);ctx.fillStyle='#6b7a96';ctx.textAlign='center';ctx.textBaseline='middle';const tx=W/2,ty=y+200,w=ctx.measureText(S(d.old)).width;ctx.fillText(S(d.old),tx,ty);const xp=E.out(C.prog(t,.9,1.4));ctx.strokeStyle='#ff4d4f';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(tx-w/2-10,ty+6);ctx.lineTo(tx-w/2-10+(w+20)*xp,ty+6-(12*xp));ctx.stroke();}
  const np=E.back(C.prog(t,1.1,1.7));if(np>0&&S(d.price)){ctx.save();ctx.translate(W/2,y+345);ctx.scale(Math.min(1,np),Math.min(1,np));const f=C.fitText(ctx,S(d.price),cw-120,1,190,80,900);ctx.font=C.font(f.px,900);ctx.fillStyle='#fff';ctx.shadowColor=BLUE;ctx.shadowBlur=30;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.lines[0],0,0);ctx.restore();}
  const bp=E.back(C.prog(t,1.6,2.2));if(bp>0)bluePill(ctx,S(d.btn)||'Buy now',W/2,y+ch-100,Math.min(1,bp),(Math.sin(t*3)+1)/2);
  ctx.restore();if(d.note){const a=E.out(C.prog(t,2,2.6));ctx.save();ctx.globalAlpha=oa*a;C.vText(ctx,S(d.note),W/2,H-60,1500,1,44,26,{wt:600,col:'#8b97ad'});ctx.restore();}}};
// V12 uimock
C.CARDS.uimock={assets:d=>[],draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),bt=L(d.beats,4),op=L(d.options,3).map(parts);C.vBase(ctx,t);const top=head(ctx,t,d,oa)||80;
  const wx=250,wy=top+10,ww=W-500,wh=H-top-90,wp=E.out(C.prog(t,.1,.7));ctx.save();ctx.globalAlpha=oa*wp;ctx.translate(0,(1-wp)*40);wchrome(ctx,wx,wy,ww,wh,S(d.url),false);
  bt.forEach((s,i)=>{const p=E.out(C.prog(t,.6+i*.35,1.0+i*.35));if(p<=0)return;ctx.save();ctx.globalAlpha=ctx.globalAlpha*p;C.vText(ctx,'•  '+s,wx+70,wy+130+i*66,ww-140,1,48,26,{align:'left',wt:600});ctx.restore();});
  const n=op.length,ow=Math.min(420,(ww-120-(n-1)*40)/Math.max(1,n)),oy=wy+wh-290,pick=Math.round(+d.pick||0),pos=[];
  op.forEach((o,i)=>{const x=wx+ww/2-(n*ow+(n-1)*40)/2+i*(ow+40),a0=1.6+i*.25,p=E.out(C.prog(t,a0,a0+.45)),g=pick===i+1&&t>3.1;pos.push([x+ow/2,oy+110]);if(p<=0)return;ctx.save();ctx.globalAlpha=ctx.globalAlpha*p;card(ctx,x,oy+(1-p)*20,ow,220,g,22,g?'rgba(30,70,150,.9)':'rgba(24,34,58,.95)');ctx.fillStyle=g?BLUE:'#2d3a58';ctx.beginPath();ctx.arc(x+60,oy+60,28,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font=C.font(32,800);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o[0]||String.fromCharCode(65+i),x+60,oy+61);C.vText(ctx,o.slice(1).join(' ')||'',x+ow/2+20,oy+135,ow-60,2,42,24,{wt:600});ctx.restore();});
  if(d.click!==false&&pick>=1&&pick<=n){const cp=E.inOut?E.inOut(C.prog(t,2.4,3.1)):C.prog(t,2.4,3.1),px=pos[pick-1][0]+120,py=pos[pick-1][1]+60,sx=wx+ww-200,sy=wy+300;if(cp>0){cursor(ctx,sx+(px-sx)*cp,sy+(py-sy)*cp,1.5,t>3.1&&t<3.3);}}
  ctx.restore();}};
// V13 checklist
C.CARDS.checklist={assets:d=>[],draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),it=L(d.items,6);C.vBase(ctx,t);if(it.length<2){msg(ctx,'items mein 2-6 steps do');return;}
  const ww=1200,wh=Math.min(H-200,260+it.length*115),wx=W/2-ww/2,wy=H/2-wh/2-(d.note?25:0),wp=E.out(C.prog(t,.1,.7));ctx.save();ctx.globalAlpha=oa*wp;ctx.translate(0,(1-wp)*40);wchrome(ctx,wx,wy,ww,wh,S(d.title)||'checklist',false);
  it.forEach((s,i)=>{const a0=.8+i*.6,p=E.out(C.prog(t,a0,a0+.4)),tk=E.back(C.prog(t,a0+.5,a0+.9));if(p<=0)return;const y=wy+130+i*112;ctx.save();ctx.globalAlpha=ctx.globalAlpha*p;ctx.translate((1-p)*-30,0);
    ctx.strokeStyle=tk>0?'#2ecc71':'#3a4766';ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(wx+60,y-24,48,48,12);ctx.stroke();
    if(tk>0){ctx.fillStyle='rgba(46,204,113,.2)';ctx.fill();ctx.save();ctx.translate(wx+84,y);ctx.scale(Math.min(1,tk),Math.min(1,tk));ctx.strokeStyle='#2ecc71';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-4,11);ctx.lineTo(15,-12);ctx.stroke();ctx.restore();}
    C.vText(ctx,s,wx+140,y,ww-220,1,58,28,{align:'left',wt:600});ctx.restore();});
  ctx.restore();if(d.note){const a=E.out(C.prog(t,.8+it.length*.6+.5,.8+it.length*.6+1.1));ctx.save();ctx.globalAlpha=oa*a;C.vText(ctx,S(d.note),W/2,H-70,1500,1,50,26,{wt:600,col:'#8b97ad'});ctx.restore();}}};
// V14 chips
C.CARDS.chips={assets:d=>L(d.thumbs,4).filter(k=>!slot(k)),draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),ch=L(d.chips,6),th=L(d.thumbs,4),pl=L(d.pills,2);C.vBase(ctx,t);if(!ch.length&&!th.length){msg(ctx,'chips ya thumbs do');return;}
  const top=head(ctx,t,d,oa)||70;ctx.save();ctx.globalAlpha=oa;
  if(th.length){const n=4,tw=420,tH=236,gx=40,x0=W/2-(2*tw+gx)/2,y0=top+(ch.length?170:40);for(let i=0;i<n;i++){const r=Math.floor(i/2),c=i%2,p=E.out(C.prog(t,.3+i*.2,.8+i*.2)),im=pimg(th[i]);if(p<=0)continue;const x=x0+c*(tw+gx),y=y0+r*(tH+gx)+(1-p)*30;ctx.save();ctx.globalAlpha=oa*p;card(ctx,x,y,tw,tH,false,18,'#0d1322');if(im){ctx.save();ctx.beginPath();ctx.roundRect(x+4,y+4,tw-8,tH-8,15);ctx.clip();const iw=im.width||im.naturalWidth||1,ih=im.height||im.naturalHeight||1,s=Math.max((tw-8)/iw,(tH-8)/ih);ctx.drawImage(im,x+tw/2-iw*s/2,y+tH/2-ih*s/2,iw*s,ih*s);ctx.restore();}else{ctx.fillStyle='rgba(255,255,255,.1)';ctx.font=C.font(70,900);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),x+tw/2,y+tH/2);}ctx.restore();}}
  ch.forEach((s,i)=>{const p=E.out(C.prog(t,.2+i*.22,.7+i*.22));if(p<=0)return;const f=C.vFit(ctx,s,th.length?340:700,th.length?2:1,46,24,700),w=Math.min(th.length?430:780,Math.max.apply(null,f.lines.map(q=>q.w))+80),left=i%2===0,cx=th.length?(left?W/2-470-w/2:W/2+470+w/2):W/2+(i%2?1:-1)*(330+(i%3)*60),cy=th.length?top+90+i*95:top+120+Math.floor(i/2)*150+(left?0:60);
    ctx.save();ctx.globalAlpha=oa*p;ctx.translate(cx,cy+Math.sin(t*1.2+i)*7);ctx.shadowColor='rgba(59,155,255,.4)';ctx.shadowBlur=18;ctx.fillStyle='rgba(20,32,60,.95)';ctx.strokeStyle='rgba(59,155,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-w/2,-38,w,76,38);ctx.fill();ctx.stroke();ctx.shadowBlur=0;C.vText(ctx,s,0,2,w-70,th.length?2:1,46,24,{wt:700});ctx.restore();});
  pl.forEach((s,i)=>{const p=E.out(C.prog(t,1.2+i*.3,1.7+i*.3));if(p<=0)return;const cx=W/2+(pl.length>1?(i?1:-1)*330:0),cy=H-85+(1-p)*20,f=C.vFit(ctx,s,640,1,50,26,700),w=f.lines[0].w+90;ctx.save();ctx.globalAlpha=oa*p;ctx.fillStyle=i?BLUE:'#2a3a5e';ctx.beginPath();ctx.roundRect(cx-w/2,cy-40,w,80,40);ctx.fill();C.vText(ctx,s,cx,cy+2,w,1,50,26,{wt:700});ctx.restore();});
  ctx.restore();}};
})();
