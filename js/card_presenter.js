// C16: presenter intro card — apna cutout (green-screen photo se) + animation + channel naam + neeche tumhara naam.
// data:{channel:'99cricketnews',name:'Yuvraj Sisodiya',sub:'...',photos:['slot1','slot2',...],key:'auto'|true|false,swap:1.4,bg}
// photos = alag alag expression (green background ya transparent PNG). key:'auto' = corner green ho to hara hata deta hai.
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_floodlight_blue',HT='02_overlays/ov_halftone_dots_white',SC='08_gemini_generated/fx/fx_grunge_scratches_black',SP='08_gemini_generated/fx/fx_gold_sparks_black',
 ICONS=['06_icons/icon_ball','06_icons/icon_bat','06_icons/icon_stumps','06_icons/icon_trophy_generic'];
const rnd=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
// ---- chroma key (cached) ----
C.keyed=function(im,mode){
  if(!im)return null;if(im._keyed&&im._keyedMode===mode)return im._keyed;
  const s=Math.min(1,1200/Math.max(im.height||im.naturalHeight,1)),w=Math.round((im.width||im.naturalWidth)*s),h=Math.round((im.height||im.naturalHeight)*s);
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h);
  const d=x.getImageData(0,0,w,h),a=d.data;
  let doKey=mode===true;
  if(mode==='auto'||mode==null){let r=0,g=0,b=0,n=0;[[0,0],[w-8,0],[0,h-8],[w-8,h-8]].forEach(p=>{for(let yy=0;yy<8;yy++)for(let xx=0;xx<8;xx++){const i=((p[1]+yy)*w+p[0]+xx)*4;if(a[i+3]>200){r+=a[i];g+=a[i+1];b+=a[i+2];n++;}}});
    if(n){r/=n;g/=n;b/=n;doKey=g>r+30&&g>b+30;}}
  if(doKey){for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],m=Math.max(r,b),df=g-m;
      if(df>18){const al=Math.max(0,1-(df-18)/42);a[i+3]=Math.round(a[i+3]*al);}
      if(df>0)a[i+1]=m+Math.min(df,0)*0; // despill: hara kinara hatao
    }}
  x.putImageData(d,0,0);
  // trim transparent margins
  let x0=w,y0=h,x1=0,y1=0;for(let yy=0;yy<h;yy+=2)for(let xx=0;xx<w;xx+=2){if(a[(yy*w+xx)*4+3]>40){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(yy<y0)y0=yy;if(yy>y1)y1=yy;}}
  if(x1<=x0||y1<=y0){x0=0;y0=0;x1=w;y1=h;}
  const tw=x1-x0+1,th=y1-y0+1,t=document.createElement('canvas');t.width=tw;t.height=th;t.getContext('2d').drawImage(c,x0,y0,tw,th,0,0,tw,th);
  // C25: agar cutout frame ke left/right kinare se kata hua hai (haath/bazu bahar), to us side par chhota soft fade lagao (hard kata kinara na dikhe)
  { const td=t.getContext('2d').getImageData(0,0,tw,th).data,col=xx=>{let n=0;for(let yy=0;yy<th;yy+=3)if(td[(yy*tw+xx)*4+3]>40)n++;return n/(th/3);};
    const fl=col(0)>.03,fr=col(tw-1)>.03,fw=Math.max(24,Math.round(tw*.07));
    if(fl||fr){const tc=t.getContext('2d'),mg=tc.createLinearGradient(0,0,tw,0);
      mg.addColorStop(0,fl?'rgba(0,0,0,0)':'#000');mg.addColorStop(fl?fw/tw:0,'#000');mg.addColorStop(fr?1-fw/tw:1,'#000');mg.addColorStop(1,fr?'rgba(0,0,0,0)':'#000');
      tc.globalCompositeOperation='destination-in';tc.fillStyle=mg;tc.fillRect(0,0,tw,th);tc.globalCompositeOperation='source-over';} }
  im._keyed=t;im._keyedMode=mode;return t;};
function lt(ctx,x,y,w,h,sk,fill){ctx.beginPath();ctx.moveTo(x+sk,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w-sk,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
C.CARDS.presenter={
 assets:d=>[d.bg||BG,HT,SC,SP].concat(ICONS),
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,photos=(d.photos||[]).filter(Boolean);
  // --- background ---
  C.cover(ctx,C.img(d.bg||BG),-40,-40,W+80,H+80,1.04+0.05*t/dur,-20*t/dur,0);
  let g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'rgba(6,18,70,.55)');g.addColorStop(1,'rgba(20,60,170,.25)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=.30;C.drawImg(ctx,HT,0,0,W,H);ctx.restore();
  { const s=C.img(SC);if(s){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.35;C.cover(ctx,s,0,0,W,H,1.1,(t*50%80)-40,0);ctx.restore();} }
  // --- speed lines burst (centered behind presenter) ---
  const cx=1330,cy=520,burst=E.out(C.prog(t,0,.7));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.04);ctx.lineCap='round';
  for(let k=0;k<30;k++){const a=k/30*Math.PI*2+rnd(k)*.18,r0=330+rnd(k+3)*140,len=(260+rnd(k+7)*520)*burst;
    ctx.strokeStyle='rgba(185,210,255,'+(.22+.3*rnd(k+9)*(.7+.3*Math.sin(t*3+k)))+')';ctx.lineWidth=3+rnd(k+5)*5;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);ctx.lineTo(Math.cos(a)*(r0+len),Math.sin(a)*(r0+len));ctx.stroke();}
  ctx.restore();
  // glow behind presenter
  g=ctx.createRadialGradient(cx,cy,40,cx,cy,620);g.addColorStop(0,'rgba(90,170,255,.55)');g.addColorStop(1,'rgba(90,170,255,0)');
  ctx.save();ctx.globalAlpha=E.out(C.prog(t,.1,.8));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
  // --- floating cricket icons ---
  ICONS.forEach((k,i)=>{const im=C.img(k);if(!im)return;const p=E.out(C.prog(t,.2+i*.12,.9+i*.12)),
    x=[190,820,560,1010][i]+Math.sin(t*.8+i)*14,y=[820,170,700,130][i]+Math.cos(t*.9+i*2)*16,s=[120,100,110,120][i];
    ctx.save();ctx.globalAlpha=.30*p;ctx.translate(x,y);ctx.rotate(Math.sin(t*.6+i)*.25+i*.4);ctx.drawImage(im,-s/2,-s/2,s,s*im.height/im.width);ctx.restore();});
  // --- presenter cutout ---
  if(photos.length){
    const t0=.9,swap=d.swap||1.4,idx=t<t0?0:Math.floor((t-t0)/swap)%photos.length,since=t<t0?9:((t-t0)%swap);
    const raw=C.photos[photos[idx]]||C.img(C.PH),im=C.keyed(raw,d.key==null?'auto':d.key);
    if(im){const pe=E.back(C.prog(t,.25,.95)),H2=1020,sc2=H2/im.height,w2=im.width*sc2;
      const pop=since<.28&&t>=t0?1+.05*(1-since/.28):1,bob=Math.sin(t*1.5)*7;
      ctx.save();ctx.translate(cx+(1-pe)*760,H+14-H2/2+bob);ctx.scale(pop*(1+.008*Math.sin(t*1.1)),pop);
      ctx.shadowColor='rgba(0,10,50,.6)';ctx.shadowBlur=46;ctx.shadowOffsetY=10;ctx.globalAlpha=Math.min(1,pe*2);
      ctx.drawImage(im,-w2/2,-H2/2,w2,H2);ctx.restore();
      if(since<.18&&t>=t0){ctx.save();ctx.globalAlpha=.30*(1-since/.18);ctx.fillStyle='#cfe6ff';ctx.fillRect(0,0,W,H);ctx.restore();}}
  }
  // --- channel name slam ---
  if(d.channel){const sp=C.prog(t,.45,.75),since=t-.75,z=t<.45?0:(t<.75?C.lerp(2.4,1,E.in(sp)):1+.03*Math.sin(Math.max(0,since)*9)*Math.exp(-since*3));
    if(z>0){const m=String(d.channel).match(/^(\d+)(.*)$/),x0=110,y0=470;
      ctx.save();ctx.translate(x0+300,y0);ctx.scale(z,z);ctx.translate(-(x0+300),-y0);ctx.globalAlpha=Math.min(1,sp*1.6);
      let px=170;ctx.font=C.font(px,900);const tw=ctx.measureText(d.channel).width;if(tw>1000)px=Math.floor(px*1000/tw);
      const part=(s,x,col)=>C.text(ctx,s,x,y0,{px,w:900,color:col,stroke:16,strokeColor:'#061246',shadow:24});
      if(m){ctx.font=C.font(px,900);const w1=ctx.measureText(m[1]).width;part(m[1],x0,'#ffd23f');part(m[2],x0+w1,'#ffffff');}else part(d.channel,x0,'#ffffff');
      ctx.restore();}
    if(d.sub){const p=E.out(C.prog(t,1.0,1.5));ctx.save();ctx.globalAlpha=p;
      C.text(ctx,d.sub,116,y0Sub(),{px:62,w:800,color:'#bfe0ff',stroke:8,strokeColor:'#061246'});ctx.restore();}
  }
  function y0Sub(){return 580+20*(1-E.out(C.prog(t,1.0,1.5)));}
  // spark burst on slam
  {const since=t-.75;if(since>0&&since<1.1){const f=C.img(SP);if(f){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.8*(1-since/1.1);C.cover(ctx,f,0,0,W,H,1+since*.4);ctx.restore();}}}
  // --- lower third: tumhara naam ---
  if(d.name){const p=E.out(C.prog(t,1.4,2.0)),x=-(1-p)*900;ctx.save();ctx.translate(x,0);
    ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=24;
    lt(ctx,70,872,980,128,34,'rgba(7,16,60,.94)');ctx.shadowBlur=0;
    lt(ctx,70,872,26,128,26,'#e6212b');
    lt(ctx,70,990,980,10,0,'#ffd23f');
    let px=78;ctx.font=C.font(px,800);const w=ctx.measureText(d.name).width;if(w>800)px=Math.floor(px*800/w);
    C.text(ctx,d.name,140,936,{px,w:800,color:'#fff',base:'middle'});ctx.restore();}
 }};
})();
