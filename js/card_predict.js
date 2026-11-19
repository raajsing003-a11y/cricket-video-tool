// C177: match prediction cards. winprob / h2h / pitch / xi  (predict.html inko JSON mein banata hai)
// winprob: {title,a,b,pa,pb?,ca?,cb?,note,bg}  h2h: {title,a,b,wa,wb,nr?,fa?,fb?,note}  pitch: {title,type,items:['label|value'](2-4),toss?,note}
// xi: {title,team,c?:y|g|b|r,players:['Naam','Naam (C)','Naam|slot_id'](1-11),note}   Photo slot default = custom_<naam>
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',COL={y:'#F5C518',g:'#2ecc71',b:'#6fa8ff',r:'#ff4d4f',w:'#ffffff'};
const slug=n=>'custom_'+String(n).toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu,'_').replace(/^_|_$/g,'');
const TAG='प्रेडिक्शन — पक्का नहीं, सिर्फ़ अनुमान';
function base(ctx,t,d,sc){const W=C.W,H=C.H;C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+.04*t/sc.dur);C.drawImg(ctx,VG,0,0,W,H);
 if(d.title){const tp=E.out(C.prog(t,.1,.6)),f=C.fitText(ctx,String(d.title),1600,1,76,40,900);ctx.save();ctx.globalAlpha=tp;C.text(ctx,f.lines[0],W/2,105+22*(1-tp),{align:'center',px:f.px,stroke:8,strokeColor:'#000'});ctx.restore();}}
function tag(ctx,t,sc){const W=C.W,H=C.H,a=E.out(C.prog(t,.8,1.3));ctx.save();ctx.globalAlpha=a*.85;C.text(ctx,TAG,W/2,H-34,{align:'center',px:30,color:'#ffd27a'});ctx.restore();}
function note(ctx,t,d,y){if(!d.note)return;const W=C.W,p=E.out(C.prog(t,1.6,2.1)),f=C.fitText(ctx,String(d.note),1500,1,50,28,800);ctx.save();ctx.globalAlpha=p;
 ctx.fillStyle='rgba(10,19,48,.8)';ctx.strokeStyle='#F5C518';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(W/2-780,y,1560,92,46);ctx.fill();ctx.stroke();C.text(ctx,f.lines[0],W/2,y+46,{align:'center',px:f.px,color:'#fff'});ctx.restore();}
const outA=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
C.CARDS.winprob={assets:d=>[d.bg||BG,VG].concat(d.ca?[d.ca]:[],d.cb?[d.cb]:[]),
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,pa=Math.max(1,Math.min(99,+d.pa||50)),pb=d.pb!=null?+d.pb:100-pa,g=E.out(C.prog(t,.5,1.9)),bw=1400,bx=(W-bw)/2,by=560,bh=96;
  ctx.save();ctx.globalAlpha=outA(t,sc);
  [[d.a,d.ca,bx+120,'#F5C518'],[d.b,d.cb,bx+bw-120,'#6fa8ff']].forEach(([n,ch,x,col],i)=>{const p=E.out(C.prog(t,.2+i*.15,.8+i*.15));ctx.save();ctx.globalAlpha*=p;
   const ci=ch&&C.img(ch);if(ci&&ci.width){const k=Math.min(300/ci.width,210/ci.height),cw=ci.width*k,chh=ci.height*k;ctx.drawImage(ci,x-cw/2,210+(210-chh)/2,cw,chh);}const f=C.fitText(ctx,String(n||''),560,1,88,44,900);C.text(ctx,f.lines[0],x,515,{align:'center',px:f.px,color:col,stroke:7,strokeColor:'#000'});ctx.restore();});
  const wa=bw*(.5+(pa/100-.5)*g);ctx.save();ctx.beginPath();ctx.roundRect(bx,by,bw,bh,bh/2);ctx.clip();ctx.fillStyle='#6fa8ff';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#F5C518';ctx.fillRect(bx,by,wa,bh);ctx.fillStyle='#fff';ctx.fillRect(bx+wa-4,by,8,bh);ctx.restore();
  ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,bh/2);ctx.stroke();
  C.text(ctx,C.countUp(0,pa,g,0)+'%',bx+150,by+bh+110,{align:'center',px:150,color:'#F5C518',stroke:8,strokeColor:'#000'});
  C.text(ctx,C.countUp(0,pb,g,0)+'%',bx+bw-150,by+bh+110,{align:'center',px:150,color:'#6fa8ff',stroke:8,strokeColor:'#000'});
  C.text(ctx,'जीत का चांस',W/2,by+bh+90,{align:'center',px:46,color:'#fff'});note(ctx,t,d,880);tag(ctx,t,sc);ctx.restore();}};
const dots=(ctx,s,x,y,t,a0)=>{String(s||'').toUpperCase().replace(/[^WLN]/g,'').slice(0,5).split('').forEach((c,i)=>{const p=E.out(C.prog(t,a0+i*.12,a0+.4+i*.12)),cx=x+i*84;ctx.save();ctx.globalAlpha*=p;
  ctx.fillStyle=c==='W'?'#2ecc71':c==='L'?'#ff4d4f':'#888';ctx.beginPath();ctx.arc(cx,y,32*p,0,7);ctx.fill();C.text(ctx,c==='W'?'जी':c==='L'?'हा':'–',cx,y+2,{align:'center',px:30,color:'#fff'});ctx.restore();});};
C.CARDS.h2h={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,g=E.out(C.prog(t,.4,1.6)),wa=+d.wa||0,wb=+d.wb||0;ctx.save();ctx.globalAlpha=outA(t,sc);
  [[d.a,wa,W/2-520,'#F5C518',d.fa],[d.b,wb,W/2+520,'#6fa8ff',d.fb]].forEach(([n,v,x,col,form],i)=>{const p=E.out(C.prog(t,.2+i*.15,.8+i*.15));ctx.save();ctx.globalAlpha*=p;
   const f=C.fitText(ctx,String(n||''),520,1,80,40,900);C.text(ctx,f.lines[0],x,250,{align:'center',px:f.px,color:col,stroke:7,strokeColor:'#000'});
   C.text(ctx,C.countUp(0,v,g,0),x,470,{align:'center',px:260,color:col,stroke:10,strokeColor:'#000'});C.text(ctx,'जीत',x,590,{align:'center',px:50,color:'#fff'});ctx.restore();
   if(form){C.text(ctx,'पिछले 5 मैच',x,700,{align:'center',px:34,color:'#bbb'});dots(ctx,form,x-168,780,t,1.2+i*.2);}});
  C.text(ctx,'आमने-सामने',W/2,330,{align:'center',px:56,color:'#fff'});C.text(ctx,'कुल '+(wa+wb+(+d.nr||0))+' मैच',W/2,420,{align:'center',px:44,color:'#ffd27a'});if(d.nr)C.text(ctx,'बेनतीजा '+d.nr,W/2,490,{align:'center',px:36,color:'#bbb'});
  note(ctx,t,d,880);ctx.restore();}};
C.CARDS.pitch={assets:d=>[d.bg||BG,VG],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,it=(d.items||[]).slice(0,4).map(s=>String(s).split('|').map(x=>x.trim())),n=it.length||1,tw=n>3?390:480,gap=30,x0=(W-(n*tw+(n-1)*gap))/2;ctx.save();ctx.globalAlpha=outA(t,sc);
  if(d.type){const p=E.out(C.prog(t,.2,.7));ctx.save();ctx.globalAlpha*=p;ctx.fillStyle='#2d7a3a';ctx.beginPath();ctx.roundRect(W/2-420,200,840,100,50);ctx.fill();C.text(ctx,String(d.type),W/2,252,{align:'center',px:58,color:'#fff'});ctx.restore();}
  it.forEach((a,i)=>{const p=E.out(C.prog(t,.5+i*.2,1.1+i*.2)),x=x0+i*(tw+gap),y=360+(1-p)*40;ctx.save();ctx.globalAlpha*=p;ctx.fillStyle='rgba(10,19,48,.78)';ctx.strokeStyle='#F5C518';ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(x,y,tw,300,26);ctx.fill();ctx.stroke();
   const v=a[1]||'',num=parseFloat(v.replace(/,/g,'')),f=C.fitText(ctx,v,tw-40,1,110,46,900);C.text(ctx,v,x+tw/2,y+130,{align:'center',px:f.px,color:'#F5C518',stroke:6,strokeColor:'#000'});
   const l=C.fitText(ctx,a[0]||'',tw-40,2,40,26,800);l.lines.forEach((s,k)=>C.text(ctx,s,x+tw/2,y+225+k*44,{align:'center',px:l.px,color:'#fff'}));ctx.restore();});
  if(d.toss){const p=E.out(C.prog(t,1.5,2));ctx.save();ctx.globalAlpha*=p;C.text(ctx,'🪙 '+d.toss,W/2,760,{align:'center',px:50,color:'#fff',stroke:5,strokeColor:'#000'});ctx.restore();}
  note(ctx,t,d,860);tag(ctx,t,sc);ctx.restore();}};
const pl=d=>(Array.isArray(d.players)?d.players:[]).slice(0,11).map(s=>{const a=String(s).split('|'),n=a[0].trim();return{n:n.replace(/\s*\(C\)\s*$/i,''),cap:/\(C\)\s*$/i.test(n),slot:(a[1]||'').trim()||slug(n.replace(/\s*\(C\)\s*$/i,''))};});
C.CARDS.xi={assets:d=>[d.bg||BG,VG,C.PH],
 draw(ctx,t,d,sc){base(ctx,t,d,sc);const W=C.W,P=pl(d),col=COL[d.c]||COL.y,cols=6,tw=250,th=300,gx=26,gy=26,x0=(W-(cols*tw+(cols-1)*gx))/2;ctx.save();ctx.globalAlpha=outA(t,sc);
  if(d.team){const p=E.out(C.prog(t,.15,.6));ctx.save();ctx.globalAlpha*=p;C.text(ctx,String(d.team)+' — संभावित प्लेइंग XI',W/2,175,{align:'center',px:46,color:col});ctx.restore();}
  P.forEach((o,i)=>{const r=i<6?0:1,c=r?i-6:i,rowN=r?P.length-6:Math.min(6,P.length),xs=(W-(rowN*tw+(rowN-1)*gx))/2,x=xs+c*(tw+gx),y=215+r*(th+gy),a=.3+i*.13,p=E.out(C.prog(t,a,a+.45));if(p<=0)return;
   const im=C.photo(o.slot);ctx.save();ctx.globalAlpha*=p;ctx.translate(x+tw/2,y+th/2);ctx.scale(.85+.15*p,.85+.15*p);ctx.translate(-tw/2,-th/2);
   ctx.shadowColor=col;ctx.shadowBlur=o.cap?34:16;ctx.fillStyle='#10192e';ctx.beginPath();ctx.roundRect(0,0,tw,th,20);ctx.fill();ctx.shadowBlur=0;
   ctx.save();ctx.beginPath();ctx.roundRect(0,0,tw,th,20);ctx.clip();if(im&&im.width){const ar=tw/(th-50);let cw=im.width,ch=cw/ar;if(ch>im.height){ch=im.height;cw=ch*ar;}ctx.drawImage(im,(im.width-cw)/2,0,cw,ch,0,0,tw,th-50);}
   ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,th-58,tw,58);ctx.restore();ctx.strokeStyle=o.cap?'#F5C518':col;ctx.lineWidth=o.cap?7:4;ctx.beginPath();ctx.roundRect(0,0,tw,th,20);ctx.stroke();
   const f=C.fitText(ctx,o.n,tw-20,1,34,20,800);C.text(ctx,f.lines[0],tw/2,th-28,{align:'center',px:f.px,color:'#fff'});
   if(o.cap){ctx.fillStyle='#F5C518';ctx.beginPath();ctx.arc(tw-34,34,26,0,7);ctx.fill();C.text(ctx,'C',tw-34,36,{align:'center',px:34,color:'#000'});}ctx.restore();});
  note(ctx,t,d,880);tag(ctx,t,sc);ctx.restore();}};
})();
