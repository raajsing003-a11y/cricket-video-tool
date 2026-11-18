// C93 (G16): Header line (upar ki chhoti line) + *peela shabd*. Scene mein top-level "header":"Aaj ki *badi* khabar" (chunk jaisa). Captions mein bhi *shabd* peela.
// Fade-swap: har scene ki header andar fade-in (0.1-0.5s) aur aakhir mein fade-out; agle scene ki header same ho to bina fade chalti rehti hai.
(function(){
const C=window.CORE,K='cvt_hdr';
const HDR=window.HDR={on:true,color:'#F5C518'};
try{if(localStorage.getItem(K)==='0')HDR.on=false;}catch(e){}
HDR.set=v=>{HDR.on=!!v;try{localStorage.setItem(K,HDR.on?'1':'0');}catch(e){}};
HDR.plain=s=>String(s==null?'':s).replace(/\*/g,'');
function layout(ctx,words,maxW,px0,pxMin){
  let px=px0,lines;
  for(;;){ctx.font=C.font(px,800);const sp=ctx.measureText(' ').width;lines=[];let cur=[],cw=0;
    words.forEach(o=>{const w=ctx.measureText(o.w).width;if(cur.length&&cw+sp+w>maxW){lines.push({ws:cur,w:cw});cur=[];cw=0;}cw+=(cur.length?sp:0)+w;cur.push({w:o.w,hl:o.hl,mw:w});});
    if(cur.length)lines.push({ws:cur,w:cw});
    if(lines.length<=2||px<=pxMin)break;px-=2;}
  return {px,lines,sp:ctx.measureText(' ').width};}
function drawOne(ctx,text,a,rise){
  const words=C.starWords(text);if(!words.length||a<=0)return;
  const sh=C.format==='short',maxW=sh?900:1500,cx=C.W/2,cy0=(sh?250:70)+rise;
  ctx.save();
  const L=layout(ctx,words,maxW,sh?54:46,sh?34:30),lh=Math.round(L.px*1.28),h=L.lines.length*lh+22,w=Math.max.apply(null,L.lines.map(l=>l.w))+64;
  const cy=Math.max(cy0,h/2+16+rise); // 2 line ho to canvas ke upar se na chipke
  ctx.globalAlpha=Math.max(0,Math.min(1,a));
  ctx.fillStyle='rgba(10,19,48,.58)';ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(cx-w/2,cy-h/2,w,h,22);ctx.fill();ctx.stroke();
  ctx.font=C.font(L.px,800);ctx.textAlign='left';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=8;
  L.lines.forEach((ln,i)=>{let x=cx-ln.w/2;const y=cy-h/2+11+lh*(i+.5);
    ln.ws.forEach(o=>{ctx.fillStyle=o.hl?HDR.color:'#ffffff';ctx.fillText(o.w,x,y);x+=o.mw+L.sp;});});
  ctx.restore();}
HDR.draw=(ctx,t)=>{
  const S=C.scenes,st=C.starts;if(!S||!S.length)return;
  const act=[];S.forEach((sc,i)=>{if(t>=st[i]&&t<st[i]+sc.dur)act.push(i);});
  act.forEach(i=>{const sc=S[i];if(!sc.header)return;
    const nx=S[i+1],pv=S[i-1],nextSame=nx&&nx.header===sc.header,prevSame=pv&&pv.header===sc.header;
    if(nextSame&&act.indexOf(i+1)>=0)return; // transition ke dauran ek hi baar
    const lt=t-st[i],ain=prevSame?1:C.ease.out(C.prog(lt,.1,.5)),aout=nextSame?1:1-C.ease.in(C.prog(lt,sc.dur-.3,sc.dur));
    drawOne(ctx,sc.header,Math.min(ain,aout),prevSame?0:12*(1-ain));});
};
const r0=C.render;C.render=function(ctx,t){r0(ctx,t);if(HDR.on)HDR.draw(ctx,t);};
// quick button (right panel)
const iv=setInterval(()=>{const q=document.getElementById('quick');if(!q||!window.PLAYER)return;clearInterval(iv);
  const b=document.createElement('button');const paint=()=>{b.textContent='🔤 Header line: '+(HDR.on?'ON':'OFF');b.style.background=HDR.on?'#2a6fdb':'#3a4250';};
  b.onclick=()=>{HDR.set(!HDR.on);paint();PLAYER.draw();};paint();b.title='Scene ki upar wali header line (scene.header, *shabd* = peela)';q.appendChild(b);},200);
setTimeout(()=>clearInterval(iv),20000);
})();
