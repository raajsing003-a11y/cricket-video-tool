// C66: punch-in zoom. Har "beat" (caption line + scene ki shuruaat) par frame tezi se zoom-in, agle beat par wapas — alternate.
// API: PUNCH.set(level) level: off|soft|medium|strong ; localStorage 'cvt_punch'. Captions zoom nahi hote (ye CAP se pehle wrap hota hai).
(function(){
const C=window.CORE,K='cvt_punch',AMP={off:0,soft:.04,medium:.08,strong:.15};
const PUNCH=window.PUNCH={level:'off',AMP:AMP};
try{const v=localStorage.getItem(K);if(v&&AMP[v]!==undefined)PUNCH.level=v;}catch(e){}
PUNCH.set=v=>{if(AMP[v]===undefined)return;PUNCH.level=v;try{localStorage.setItem(K,v);}catch(e){}};
PUNCH.beats=()=>{const L=(window.CAP&&CAP.lines)||[],a=L.map(l=>l.t0).concat((C.starts||[]).slice()).sort((x,y)=>x-y),o=[];
  a.forEach(x=>{if(!o.length||x-o[o.length-1]>=.8)o.push(x);});return o;}; // caption + scene shuruaat dono, .8s se paas wale ek
PUNCH.scale=t=>{const a=AMP[PUNCH.level];if(!a)return 1;const b=PUNCH.beats();if(!b.length)return 1;
  let i=-1;for(let q=b.length-1;q>=0;q--)if(t>=b[q]){i=q;break;}
  if(i<0)return 1;
  const u=C.ease.clamp((t-b[i])/.28),e=1-Math.pow(1-u,3),zin=(i%2===0)?1:0,zprev=(i%2===0)?0:1;
  return 1+a*(zprev+(zin-zprev)*e);};
const r0=C.render;
C.render=function(ctx,t){const s=PUNCH.scale(t);
  if(s===1)return r0(ctx,t);
  ctx.save();ctx.translate(C.W/2,C.H/2);ctx.scale(s,s);ctx.translate(-C.W/2,-C.H/2);r0(ctx,t);ctx.restore();};
})();
