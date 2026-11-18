// C95 (G20): Pill row — scene.pills = 1-3 glass pill (rang ka dot + text), ek line mein, pop-in (ek-ek karke). Header line jaisa overlay.
// scene.pills:[{"t":"Sahi baat","c":"g"},{"t":"Afwah","c":"r"}] ya ["text"] (grey). c: g=hara r=laal y=peela x=grey. scene.pillsPos: "top"(default, header ke neeche) | "mid" | "low"(caption ke upar)
(function(){
const C=window.CORE,K='cvt_pills';
const PIL=window.PILLS={on:true,COL:{g:'#2ecc71',r:'#ff4d4f',y:'#F5C518',x:'#9aa4b2'},NAME:{green:'g',red:'r',yellow:'y',grey:'x',gray:'x'}};
try{if(localStorage.getItem(K)==='0')PIL.on=false;}catch(e){}
PIL.set=v=>{PIL.on=!!v;try{localStorage.setItem(K,PIL.on?'1':'0');}catch(e){}};
PIL.norm=p=>{if(!Array.isArray(p))return[];return p.slice(0,3).map(o=>{if(typeof o==='string')return{t:o,c:'x'};let c=String(o&&o.c||'x').toLowerCase();c=PIL.COL[c]?c:(PIL.NAME[c]||'x');return{t:String(o&&o.t||''),c};}).filter(o=>o.t);};
// text box syntax: "Sahi|g ; Galat|r ; Shayad|y"
PIL.parse=s=>PIL.norm(String(s||'').split(/[;\n]/).map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^(.*)\|\s*(\w+)$/);return m?{t:m[1].trim(),c:m[2]}:{t:x,c:'x'};}));
PIL.str=p=>PIL.norm(p).map(o=>o.t+'|'+o.c).join(' ; ');
function y0(pos,sh){return {top:sh?410:190,mid:sh?960:540,low:sh?1090:790}[pos]||(sh?410:190);}
function drawRow(ctx,sc,lt){
  const items=PIL.norm(sc.pills);if(!items.length)return;
  const sh=C.format==='short',px=sh?40:36,padX=34,dot=sh?15:13,gap=sh?18:26,h=px*1.9,cx=C.W/2,cy=y0(sc.pillsPos,sh);
  ctx.save();ctx.font=C.font(px,800);
  const ws=items.map(o=>ctx.measureText(o.t).width+padX*2+dot*2+14);
  let tot=ws.reduce((a,b)=>a+b,0)+gap*(items.length-1),maxW=sh?980:1700,k=Math.min(1,maxW/tot);
  if(k<1){ctx.restore();ctx.save();ctx.font=C.font(Math.round(px*k),800);}
  const sw=ws.map(w=>w*k),T=tot*k,G=gap*k,H=h*k;let x=cx-T/2;
  const outA=1-C.ease.in(C.prog(lt,sc.dur-.3,sc.dur));
  items.forEach((o,i)=>{
    const p=C.prog(lt,.25+i*.18,.25+i*.18+.4),e=C.ease.out(p),a=Math.max(0,Math.min(1,e))*outA;
    if(a>0){const w=sw[i],s=.82+.18*e,pcx=x+w/2;
      ctx.save();ctx.globalAlpha=a;ctx.translate(pcx,cy+(1-e)*14);ctx.scale(s,s);
      ctx.fillStyle='rgba(10,19,48,.62)';ctx.strokeStyle='rgba(255,255,255,.24)';ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect(-w/2,-H/2,w,H,H/2);ctx.fill();ctx.stroke();
      const col=PIL.COL[o.c]||PIL.COL.x;
      ctx.shadowColor=col;ctx.shadowBlur=14;ctx.fillStyle=col;ctx.beginPath();ctx.arc(-w/2+padX*k*.8+dot*k,0,dot*k,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=6;ctx.shadowColor='rgba(0,0,0,.7)';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';
      ctx.fillText(o.t,-w/2+padX*k*.8+dot*k*2+14*k,2);ctx.restore();}
    x+=sw[i]+G;});
  ctx.restore();}
PIL.draw=(ctx,t)=>{const S=C.scenes,st=C.starts;if(!S||!S.length)return;
  S.forEach((sc,i)=>{if(sc.pills&&t>=st[i]&&t<st[i]+sc.dur)drawRow(ctx,sc,t-st[i]);});};
const r0=C.render;C.render=function(ctx,t){r0(ctx,t);if(PIL.on)PIL.draw(ctx,t);};
const iv=setInterval(()=>{const q=document.getElementById('quick');if(!q||!window.PLAYER)return;clearInterval(iv);
  const b=document.createElement('button');const paint=()=>{b.textContent='💊 Pills: '+(PIL.on?'ON':'OFF');b.style.background=PIL.on?'#2a6fdb':'#3a4250';};
  b.onclick=()=>{PIL.set(!PIL.on);paint();PLAYER.draw();};paint();b.title='Scene ki pill row (scene.pills, 1-3 pills, dot ka rang g/r/y/x)';q.appendChild(b);},200);
setTimeout(()=>clearInterval(iv),20000);
})();
