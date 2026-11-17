// C9a: captions overlay + script spread + nudge editor. API: CAP.init(player), CAP.spread(), CAP.draw(ctx,t)
(function(){
const C=window.CORE,K='cvt_caps';
const CAP=window.CAP={lines:[],on:true,script:'',P:null};
function dur(){return (window.EXPORT&&EXPORT.audio&&EXPORT.audio.duration)||C.total;}
function ends(){const L=CAP.lines,D=dur();L.forEach((l,i)=>l.t1=i<L.length-1?L[i+1].t0:D);}
CAP.setScript=s=>{CAP.script=s;CAP.lines=s.split('\n').map(x=>x.trim()).filter(Boolean).map(t=>({text:t,t0:0,t1:0}));CAP.spread();};
CAP.spread=()=>{const L=CAP.lines,D=dur();if(!L.length)return;const w=L.map(l=>l.text.length+6),sum=w.reduce((a,b)=>a+b,0);let t=0;
 L.forEach((l,i)=>{l.t0=+t.toFixed(2);t+=w[i]/sum*D;});ends();save();};
CAP.nudge=(i,d)=>{const L=CAP.lines,lo=i?L[i-1].t0+.1:0,hi=i<L.length-1?L[i+1].t0-.1:dur()-.1;L[i].t0=+Math.max(lo,Math.min(hi,L[i].t0+d)).toFixed(2);ends();save();};
function save(){try{localStorage.setItem(K,JSON.stringify({s:CAP.script,t:CAP.lines.map(l=>l.t0),on:CAP.on}));}catch(e){}}
function load(){try{const j=JSON.parse(localStorage.getItem(K)||'null');if(!j)return;CAP.script=j.s||'';CAP.on=j.on!==false;
 CAP.lines=CAP.script.split('\n').map(x=>x.trim()).filter(Boolean).map((t,i)=>({text:t,t0:(j.t&&j.t[i])||0,t1:0}));ends();}catch(e){}}
CAP.at=t=>{const L=CAP.lines;for(let i=L.length-1;i>=0;i--)if(t>=L[i].t0)return t<L[i].t1?L[i]:null;return null;};
CAP.draw=(ctx,t)=>{if(!CAP.on)return;const l=CAP.at(t);if(!l)return;
 const sh=C.format==='short',cx=C.W/2,mw=sh?900:1560,cy=sh?1240:900,ml=sh?3:2;
  let fp=sh?68:52,lh,lines;ctx.save();
  for(;;){ctx.font=C.font(fp,'bold');lines=C.wrap(ctx,l.text,mw);if(lines.length<=ml||fp<=(sh?38:30))break;fp-=2;} // C30: text kate nahi, font chhota
  lh=Math.round(fp*1.3);const h=lines.length*lh+30,y0=cy-h/2;
  const a=C.ease.clamp((t-l.t0)/.15);ctx.globalAlpha=a;
 ctx.fillStyle='rgba(0,0,0,.62)';const w=Math.max(...lines.map(s=>ctx.measureText(s).width))+70;
 ctx.beginPath();ctx.roundRect(cx-w/2,y0,w,h,16);ctx.fill();
 ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='#000';ctx.shadowBlur=6;
 lines.forEach((s,i)=>ctx.fillText(s,cx,y0+15+lh*(i+.5)));ctx.restore();};
const r0=C.render;C.render=function(ctx,t){r0(ctx,t);CAP.draw(ctx,t);};
let panel,list;
CAP.init=P=>{CAP.P=P;load();
 panel=document.createElement('div');panel.style.cssText='display:none;margin-top:8px;background:#1b1b1b;border-radius:6px;padding:8px';
 panel.innerHTML='<textarea id="capt" rows="5" placeholder="Script yahan paste karo (har line = ek caption)" style="width:100%;box-sizing:border-box;font-size:15px"></textarea><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px"><button id="cap1">Spread karo</button><label style="font-size:14px"><input type="checkbox" id="capon"> Captions dikhao</label><span style="font-size:12px;opacity:.7">Spread audio length par hota hai (audio nahi to video length)</span></div><div id="capl" style="max-height:300px;overflow:auto;margin-top:6px"></div>';
 document.getElementById('wrap').insertBefore(panel,document.getElementById('info'));
 list=panel.querySelector('#capl');const ta=panel.querySelector('#capt');ta.value=CAP.script;panel.querySelector('#capon').checked=CAP.on;
 panel.querySelector('#cap1').onclick=()=>{CAP.setScript(ta.value);render();P.draw();};
 panel.querySelector('#capon').onchange=e=>{CAP.on=e.target.checked;save();P.draw();};
 const b=document.createElement('button');b.textContent='💬 Captions';b.onclick=()=>{panel.style.display=panel.style.display==='none'?'block':'none';render();};
 document.getElementById('bar2').appendChild(b);};
function render(){if(panel.style.display==='none')return;list.textContent='';
 CAP.lines.forEach((l,i)=>{const r=document.createElement('div');r.style.cssText='display:flex;gap:6px;align-items:center;padding:3px 0;font-size:14px';
  const mk=(txt,fn,bg)=>{const b=document.createElement('button');b.textContent=txt;b.style.cssText='padding:5px 9px;font-size:13px;background:'+(bg||'#555');b.onclick=fn;return b;};
  const tm=document.createElement('span');tm.textContent=l.t0.toFixed(1)+'s';tm.style.cssText='width:48px;flex:none';
  r.append(mk('−',()=>{CAP.nudge(i,-.1);CAP.P.seek(l.t0+.05);render();}),tm,mk('+',()=>{CAP.nudge(i,.1);CAP.P.seek(l.t0+.05);render();}),
   mk('▶',()=>CAP.P.seek(l.t0+.05),'#2a6'));
  const tx=document.createElement('span');tx.textContent=l.text;tx.style.flex='1';r.appendChild(tx);list.appendChild(r);});}
})();
