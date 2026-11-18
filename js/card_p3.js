// C137 (P12): Video-5 style world/India dot-map card (card_p.js helpers). Sirf wide.
// dotmap (P12): {title:'', map:'india'|'world', items:['Mumbai','Delhi'] ya ['label|x|y'] (x,y = map image ke % mein), hl:0 (1-based; baaki dim), sub:''}
// india map par IPL sheher naam se mil jaate hain (Mumbai, Chennai, Kolkata, Delhi, Bengaluru, Hyderabad, Ahmedabad/Gujarat, Jaipur/Rajasthan, Lucknow, Mohali/Punjab). Baaki ke liye 'naam|x|y'. world map par bhi ~45 bade cricket sheher naam se (WC list neeche; London, Dubai, Sydney, Colombo, Johannesburg, Auckland...), baaki 'naam|x|y'.
(function(){const C=window.CORE,E=C.ease;
const VI='#a06bff',S=v=>v==null?'':String(v).trim();
const outAt=(t,sc)=>1-E.in(C.prog(t,sc.dur-.3,sc.dur));
const MAPS={india:'18_maps/map_india_dots_cyan',world:'18_maps/map_world_dots_cyan'};
const CITY={mumbai:[21,60],chennai:[44,83],kolkata:[61,55],delhi:[33,33],bengaluru:[35,82],bangalore:[35,82],hyderabad:[40,66],ahmedabad:[20,49],gujarat:[20,49],jaipur:[28,40],rajasthan:[28,40],lucknow:[43,40],mohali:[31,30],punjab:[31,30]};
// C140: world map par sheher naam se (lon,lat -> map %). X% = (lon+180)/3.6-2.5; Y% piecewise (map asset par haath se calibrate, sheher ke paas)
const WC={london:[-.1,51.5],manchester:[-2.2,53.5],birmingham:[-1.9,52.5],leeds:[-1.55,53.8],nottingham:[-1.15,53],southampton:[-1.4,50.9],cardiff:[-3.2,51.5],dublin:[-6.3,53.3],'new york':[-74,40.7],kingston:[-76.8,18],bridgetown:[-59.6,13.1],'port of spain':[-61.5,10.7],dubai:[55.3,25.3],sharjah:[55.4,25.3],'abu dhabi':[54.4,24.5],karachi:[67,24.9],lahore:[74.3,31.5],kabul:[69.2,34.5],mumbai:[72.8,19],delhi:[77.2,28.6],chennai:[80.3,13],kolkata:[88.4,22.6],bengaluru:[77.6,13],bangalore:[77.6,13],hyderabad:[78.5,17.4],ahmedabad:[72.6,23],jaipur:[75.8,26.9],lucknow:[80.9,26.8],mohali:[76.7,30.7],dhaka:[90.4,23.8],colombo:[79.9,6.9],kandy:[80.6,7.3],pallekele:[80.7,7.3],singapore:[103.8,1.35],'kuala lumpur':[101.7,3.1],sydney:[151.2,-33.9],melbourne:[144.9,-37.8],brisbane:[153,-27.5],perth:[115.9,-32],adelaide:[138.6,-34.9],auckland:[174.8,-36.8],wellington:[174.8,-41.3],christchurch:[172.6,-43.5],johannesburg:[28,-26.2],centurion:[28.2,-25.9],'cape town':[18.4,-33.9],durban:[31,-29.9],harare:[31,-17.8],nairobi:[36.8,-1.3]};
const YA=[[-34,84],[7,59.8],[28.6,51.4],[51.5,40.1]];
function wxy(lon,lat){const x=(lon+180)/3.6-2.5;let i=0;while(i<2&&lat>YA[i+1][0])i++;const a=YA[i],b=YA[i+1];return[x,a[1]+(lat-a[0])*(b[1]-a[1])/(b[0]-a[0])];}
C.WCITY=WC;
const cache={};
function tinted(key){const im=C.img(key);if(!im)return null;if(cache[key]&&cache[key].src===im)return cache[key].cv;const w=im.width||im.naturalWidth,h=im.height||im.naturalHeight,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-in';const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#6a3cff');gr.addColorStop(1,'#c9a6ff');g.fillStyle=gr;g.fillRect(0,0,w,h);g.globalCompositeOperation='source-over';if(key===MAPS.world)g.clearRect(w-70,h-90,70,90);cache[key]={src:im,cv:cv};return cv;}
function items(d,mk){return (Array.isArray(d.items)?d.items:[]).map(S).filter(Boolean).slice(0,mk==='world'?8:10).map(s=>{const a=s.split('|').map(x=>x.trim()),l=a[0];let x=parseFloat(a[1]),y=parseFloat(a[2]);if(!isFinite(x)||!isFinite(y)){let c=null;if(mk==='india')c=CITY[l.toLowerCase()];else if(WC[l.toLowerCase()])c=wxy(WC[l.toLowerCase()][0],WC[l.toLowerCase()][1]);if(!c)return null;x=c[0];y=c[1];}return{l:l,x:x,y:y};}).filter(Boolean);}
C.CARDS.dotmap={assets:d=>[MAPS[S(d.map)==='world'?'world':'india']],
 draw(ctx,t,d,sc){const W=C.W,H=C.H,oa=outAt(t,sc),mk=S(d.map)==='world'?'world':'india',it=items(d,mk),hl=Math.round(+d.hl||0);C.pBase(ctx,t);
  const cv=tinted(MAPS[mk]);if(!cv){ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('map asset nahi mila',W/2,H/2);return;}
  if(!it.length){ctx.fillStyle='#9aa4b2';ctx.font=C.font(44,700);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('items mein sheher do (ya \"naam|x|y\")',W/2,H/2);return;}
  ctx.save();ctx.globalAlpha=oa;const top=S(d.title)?170:100,sub=S(d.sub)?70:0;let mw,mh;if(mk==='india'){mh=H-top-40-sub;mw=mh*cv.width/cv.height;}else{mw=1700;mh=mw*cv.height/cv.width;if(mh>H-top-40-sub){mh=H-top-40-sub;mw=mh*cv.width/cv.height;}}
  const mx=W/2-mw/2,my=top+(H-top-40-sub-mh)/2,mp=E.out(C.prog(t,0,.8));
  if(S(d.title)){ctx.save();ctx.globalAlpha=oa*E.out(C.prog(t,.05,.5));C.pWhite(ctx,S(d.title),W/2,90,1600,1,64,34,{wt:800});ctx.restore();}
  ctx.save();ctx.globalAlpha=oa*mp*(hl?.7:.85);ctx.shadowColor=VI;ctx.shadowBlur=22;ctx.drawImage(cv,mx,my,mw,mh);ctx.restore();
  let ph=96;let pw=380;const pins=it.map((o,i)=>({o:o,i:i,px:mx+o.x/100*mw,py:my+o.y/100*mh}));
  let pos=pins.map(p=>({x:p.px,y:p.py-80,side:0}));
  if(mk==='india'){const sr=pins.slice().sort((a,b)=>a.px-b.px),nl=Math.floor(sr.length/2),L=sr.slice(0,nl).sort((a,b)=>a.py-b.py),R=sr.slice(nl).sort((a,b)=>a.py-b.py),mxn=Math.max(L.length,R.length),y0=top+10,y1=H-40-sub-10;ph=Math.min(96,(y1-y0)/mxn-14);[[L,150+pw/2],[R,W-150-pw/2]].forEach(([g,x])=>{const n=g.length;g.forEach((p,k)=>{const y=n===1?(y0+y1)/2:y0+ph/2+(y1-y0-ph)*(k/(n-1));pos[p.i]={x:x,y:y,side:x<W/2?-1:1};});});}
  else{ph=80;pw=300;const placed=[],cand=[[0,-95],[0,95],[-170,-95],[170,-95],[-170,95],[170,95],[0,-190],[0,190],[-170,-190],[170,-190],[-170,190],[170,190],[0,-285],[0,285]],hit=(x,y)=>placed.some(r=>Math.abs(r.x-x)<pw+14&&Math.abs(r.y-y)<ph+12)||pins.some(q=>Math.abs(q.px-x)<pw/2+22&&Math.abs(q.py-y)<ph/2+22);
   pins.slice().sort((a,b)=>a.px-b.px).forEach(p=>{let best=null;for(const c of cand){const x=Math.max(pw/2+20,Math.min(W-pw/2-20,p.px+c[0])),y=p.py+c[1];if(y<ph/2+top-60||y>H-ph/2-20)continue;if(!hit(x,y)){best={x:x,y:y};break;}}if(!best)best={x:Math.max(pw/2+20,Math.min(W-pw/2-20,p.px)),y:Math.max(ph/2+top-60,p.py-95)};placed.push(best);pos[p.i]={x:best.x,y:best.y,side:0};});}
  pins.forEach(p=>{const a0=.8+p.i*.45,pp=E.back(C.prog(t,a0,a0+.55));if(pp<=0)return;const dim=hl&&hl!==p.i+1?.35:1,q=pos[p.i];ctx.save();ctx.globalAlpha=oa*dim;
   const lp=E.io(C.prog(t,a0,a0+.5));if(mk==='india'){const ex=q.x-q.side*pw/2;C.pLine(ctx,ex,q.y,p.px,p.py,lp,0);}else{ctx.strokeStyle=VI;ctx.lineWidth=4;ctx.shadowColor=VI;ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.px+(q.x-p.px)*lp,p.py+(q.y+(q.y<p.py?ph/2:-ph/2)-p.py)*lp);ctx.stroke();ctx.shadowBlur=0;}
   const pulse=(t*1.2+p.i*.3)%1;ctx.strokeStyle='rgba(201,166,255,'+(1-pulse)*.8+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.px,p.py,16+pulse*34,0,Math.PI*2);ctx.stroke();
   ctx.shadowColor=VI;ctx.shadowBlur=26;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.px,p.py,Math.min(1,pp)*13,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=VI;ctx.lineWidth=5;ctx.stroke();
   ctx.translate(q.x,q.y);ctx.scale(Math.min(1.06,pp),Math.min(1.06,pp));ctx.globalAlpha=oa*dim*Math.min(1,pp*1.5);C.pCard(ctx,-pw/2,-ph/2,pw,ph,36,hl===p.i+1,1);C.pWhite(ctx,p.o.l,0,0,pw-50,1,mk==='world'?40:48,22,{wt:800});ctx.restore();});
  if(S(d.sub)){const sp=E.out(C.prog(t,.8+it.length*.45,1.5+it.length*.45));ctx.globalAlpha=oa*sp;C.pWhite(ctx,S(d.sub),W/2,H-62,1500,1,44,26,{wt:600,col:'#b9a8dd'});}
  ctx.restore();}};
})();
