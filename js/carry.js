// C102 (G22/G1): Carry-over chip. Scene mein top-level "carry":{"id":"k1","t":"CTR","c":"y","pos":"0.5,0.5","s":1}
// Agle scene mein SAME id likho (nayi pos/s/t ke saath) = chip cut ke bina glide/morph hota hai. Id alag/khatam = fade-out; pehli baar = pop-in.
// pos = canvas ke fraction (x,y) chip ka center; s = size multiplier (0.5-3); c = y/g/r/b/w.
(function(){const C=window.CORE,E=C.ease,K='cvt_carry';
const CAR=window.CARRY={on:true,COL:{y:'#F5C518',g:'#2ecc71',r:'#ff4d4f',b:'#6fa8ff',w:'#ffffff'}};
try{if(localStorage.getItem(K)==='0')CAR.on=false;}catch(e){}
CAR.set=v=>{CAR.on=!!v;try{localStorage.setItem(K,CAR.on?'1':'0');}catch(e){}};
CAR.pos=s=>{const a=String(s==null?'0.5,0.5':s).split(',').map(parseFloat);if(a.length!==2||a.some(x=>!isFinite(x)||x<0||x>1))return null;return{x:a[0],y:a[1]};};
CAR.str=o=>o?[o.id||'',o.t||'',o.pos||'',o.c||'',o.s!=null?o.s:''].join('|').replace(/\|+$/,''):'';
CAR.parse=s=>{const a=String(s||'').split('|').map(x=>x.trim());if(!a[0]||!a[1])return null;const o={id:a[0],t:a[1]};if(a[2])o.pos=a[2];if(a[3])o.c=a[3];if(a[4]&&isFinite(+a[4]))o.s=+a[4];return o;};
function chip(ctx,txt,x,y,s,col,a){ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,a));ctx.translate(x,y);ctx.scale(s,s);
  const px=54;ctx.font=C.font(px,900);const w=ctx.measureText(txt).width+100,h=104;
  ctx.shadowColor=col;ctx.shadowBlur=26;ctx.fillStyle='rgba(10,19,48,.82)';ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,h/2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(-w/2+46,0,14,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;ctx.fillText(txt,-w/2+76,3);ctx.restore();}
CAR.draw=(ctx,t)=>{
  const S=C.scenes,st=C.starts;if(!S||!S.length)return;const W=C.W,H=C.H;
  S.forEach((sc,i)=>{const cr=sc.carry;if(!cr||!cr.id||t<st[i]||t>=st[i]+sc.dur)return;
    const nx=S[i+1],pv=S[i-1],nSame=nx&&nx.carry&&nx.carry.id===cr.id,pSame=pv&&pv.carry&&pv.carry.id===cr.id;
    if(nSame&&t>=st[i+1])return; // transition ke dauran agla scene khud draw karta hai
    const lt=t-st[i],p1=CAR.pos(cr.pos)||{x:.5,y:.5},s1=(+cr.s>0?+cr.s:1),col=CAR.COL[cr.c]||CAR.COL.y;
    let x=p1.x*W,y=p1.y*H,s=s1,txt=cr.t,a=1;
    if(pSame){const p0=CAR.pos(pv.carry.pos)||{x:.5,y:.5},s0=(+pv.carry.s>0?+pv.carry.s:1),g=E.io(C.prog(lt,.05,.75));
      x=(p0.x+(p1.x-p0.x)*g)*W;y=(p0.y+(p1.y-p0.y)*g)*H;s=s0+(s1-s0)*g;txt=g<.5?pv.carry.t:cr.t;
      if(pv.carry.c!==cr.c){/* rang seedha naye ka */}}
    else{const g=E.back(C.prog(lt,.15,.7));s=s1*Math.max(.01,g);a=E.out(C.prog(lt,.15,.4));}
    if(!nSame)a*=1-E.in(C.prog(lt,sc.dur-.3,sc.dur));
    chip(ctx,String(txt),x,y,s,col,a);});
};
const r0=C.render;C.render=function(ctx,t){r0(ctx,t);if(CAR.on)CAR.draw(ctx,t);};
const iv=setInterval(()=>{const q=document.getElementById('quick');if(!q||!window.PLAYER)return;clearInterval(iv);
  const b=document.createElement('button');const paint=()=>{b.textContent='🔗 Carry chip: '+(CAR.on?'ON':'OFF');b.style.background=CAR.on?'#2a6fdb':'#3a4250';};
  b.onclick=()=>{CAR.set(!CAR.on);paint();PLAYER.draw();};paint();b.title='Scene.carry: ek chip agle scene mein bina cut ke glide karta hai (same id)';q.appendChild(b);},200);
setTimeout(()=>clearInterval(iv),20000);
})();
