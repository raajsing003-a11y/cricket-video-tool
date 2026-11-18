// C108 (Y16 + Y18): do wide card.
// bars (Y16): data:{title, items:['नाम|5|आइकन(optional)', ...](2-6), unit:'मिनट', c:'g', total:true, bg} -> har bar count-up se badhta hai, neeche equation "5+4+2 = 11 मिनट"
// dash (Y18): data:{title, tiles:['लेबल|1,200|+5%', ...](2-4; 3rd part optional, '-' se shuru = laal), pts:['3','5','4','8','12'] (line chart, 2-12 number), note:'', c:'g', bg} -> 4 metric tile + neeche line chart draw
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',w:'#ffffff'};
const parts=s=>String(s).split('|').map(x=>x.trim());
C.barItems=d=>(Array.isArray(d.items)?d.items:[]).filter(v=>v!=null&&String(v).trim()).slice(0,6).map(s=>{const a=parts(s);return{t:a[0],v:parseFloat(String(a[1]).replace(/,/g,'')),i:a[2]||''};});
C.dashTiles=d=>(Array.isArray(d.tiles)?d.tiles:[]).filter(v=>v!=null&&String(v).trim()).slice(0,4).map(s=>{const a=parts(s);return{l:a[0],v:a[1]||'',d:a[2]||''};});
C.dashPts=d=>(Array.isArray(d.pts)?d.pts:[]).map(v=>parseFloat(String(v).replace(/,/g,''))).filter(isFinite).slice(0,12);
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;const f=C.fitText(ctx,String(d.title),1600,1,80,42,900);C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}}
const panel=(ctx,x,y,w,h,col,r)=>{ctx.fillStyle='rgba(10,19,48,.74)';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke();ctx.shadowBlur=0;};
const dec=v=>(String(v).split('.')[1]||'').length;
C.CARDS.bars={
 assets:d=>{const k=[d.bg||BG,VG];C.barItems(d).forEach(o=>{if(o.i)k.push(o.i);});return k;},
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,it=C.barItems(d).filter(o=>isFinite(o.v)),n=it.length;if(!n)return;
  const outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur)),col=COL[d.c]||COL.g,unit=d.unit?' '+d.unit:'',mx=Math.max(...it.map(o=>Math.abs(o.v)))||1;
  const showTot=d.total!==false,rh=n>4?96:116,gap=22,top=d.title?210:150,lx=250,bx=lx+40,bw=1220;
  ctx.save();ctx.globalAlpha=outA;
  it.forEach((o,i)=>{const a=.3+i*.28,p=E.out(C.prog(t,a,a+.5)),g=E.out(C.prog(t,a+.15,a+1.3));if(p<=0)return;const y=top+i*(rh+gap)+(1-p)*30;
   ctx.save();ctx.globalAlpha=outA*p;
   const f=C.fitText(ctx,String(o.t),lx-20-(o.i?110:0),1,52,28,800);ctx.font=C.font(f.px,800);ctx.fillStyle='#fff';ctx.textAlign='right';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;ctx.fillText(f.lines[0],lx+30-(o.i?110:0),y+rh/2);ctx.shadowBlur=0;
   if(o.i){const im=C.img(o.i);if(im)C.drawImg(ctx,o.i,lx+50-100+20,y+6,rh-12,rh-12);}
   const w=Math.max(rh,bw*Math.abs(o.v)/mx*g);panel(ctx,bx+90,y,w,rh,col,rh/2);
   const vt=C.fmtNum?C.fmtNum(o.v*g,dec(it[i].v)):String(o.v);ctx.font=C.font(56,900);ctx.fillStyle=col;ctx.textAlign='left';ctx.shadowColor=col;ctx.shadowBlur=14;ctx.fillText(vt+unit,bx+90+w+24,y+rh/2+2);ctx.restore();});
  if(showTot&&n>1){const ta=E.out(C.prog(t,.3+n*.28+1,.3+n*.28+1.6));if(ta>0){const sum=it.reduce((s,o)=>s+o.v,0),dd=Math.max(...it.map(o=>dec(o.v))),eq=it.map(o=>C.fmtNum(o.v,dd)).join(' + ')+' = '+C.fmtNum(sum,dd)+unit;
   ctx.save();ctx.globalAlpha=outA*ta;let px=64;ctx.font=C.font(px,900);const mw=W-200,fw=ctx.measureText(eq).width;if(fw>mw){px=Math.floor(px*mw/fw);ctx.font=C.font(px,900);}
   const w=Math.min(mw+80,ctx.measureText(eq).width+110),h=110,y=top+n*(rh+gap)+40+(1-ta)*20;panel(ctx,W/2-w/2,y,w,h,COL.y,h/2);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(eq,W/2,y+h/2+2);ctx.restore();}}
  ctx.restore();}};
C.CARDS.dash={
 assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,H=C.H,tl=C.dashTiles(d),pts=C.dashPts(d),col=COL[d.c]||COL.g,outA=1-E.in(C.prog(t,sc.dur-.3,sc.dur));
  ctx.save();ctx.globalAlpha=outA;
  const n=tl.length,tw=n>3?400:500,tg=34,tot=n*tw+(n-1)*tg,tx=W/2-tot/2,ty=d.title?190:130,th=210;
  tl.forEach((o,i)=>{const a=.3+i*.2,p=E.out(C.prog(t,a,a+.45));if(p<=0)return;const x=tx+i*(tw+tg),y=ty+(1-p)*40;ctx.save();ctx.globalAlpha=outA*p;panel(ctx,x,y,tw,th,'#6fa8ff',30);
   const lf=C.fitText(ctx,String(o.l),tw-50,1,40,26,700);ctx.font=C.font(lf.px,700);ctx.fillStyle='#b8c4e0';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lf.lines[0],x+28,y+42);
   const vf=C.fitText(ctx,String(o.v),tw-50,1,88,40,900);ctx.font=C.font(vf.px,900);ctx.fillStyle='#fff';ctx.fillText(vf.lines[0],x+28,y+112);
   if(o.d){const neg=o.d[0]==='-';ctx.font=C.font(40,800);ctx.fillStyle=neg?COL.r:COL.g;ctx.fillText((neg?'▼ ':'▲ ')+o.d.replace(/^[+-]/,''),x+28,y+171);}ctx.restore();});
  const cx=tx,cy=ty+th+50,cw=tot,ch=H-cy-(d.note?150:70),cp=E.out(C.prog(t,1.0,1.4));
  if(cp>0){ctx.save();ctx.globalAlpha=outA*cp;panel(ctx,cx,cy,cw,ch,'#6fa8ff',30);
   if(pts.length>1){const mn=Math.min(...pts),mxv=Math.max(...pts),rg=(mxv-mn)||1,pl=70,pt=50,pw=cw-2*pl,ph=ch-2*pt,P=pts.map((v,i)=>[cx+pl+pw*i/(pts.length-1),cy+pt+ph*(1-(v-mn)/rg)]);
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=2;for(let k=0;k<4;k++){const yy=cy+pt+ph*k/3;ctx.beginPath();ctx.moveTo(cx+pl,yy);ctx.lineTo(cx+cw-pl,yy);ctx.stroke();}
    const dp=E.out(C.prog(t,1.3,2.8)),segs=(P.length-1)*dp,full=Math.floor(segs),fr=segs-full;const pp=[P[0]];for(let k=1;k<=full&&k<P.length;k++)pp.push(P[k]);if(full<P.length-1){const a=P[full],b=P[full+1];pp.push([a[0]+(b[0]-a[0])*fr,a[1]+(b[1]-a[1])*fr]);}
    ctx.beginPath();pp.forEach((q,k)=>k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.strokeStyle=col;ctx.lineWidth=8;ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=18;ctx.stroke();ctx.shadowBlur=0;
    const e=pp[pp.length-1];ctx.fillStyle='#fff';ctx.shadowColor=col;ctx.shadowBlur=22;ctx.beginPath();ctx.arc(e[0],e[1],13,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
   ctx.restore();}
  if(d.note){const na=E.out(C.prog(t,2.3,2.8));if(na>0){ctx.save();ctx.globalAlpha=outA*na;ctx.font=C.font(46,800);const s=String(d.note),w=ctx.measureText(s).width+110,h=90,y=H-85+(1-na)*15;panel(ctx,W/2-w/2,y-h/2,w,h,COL.y,h/2);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,W/2,y+2);ctx.restore();}}
  ctx.restore();}};
})();
