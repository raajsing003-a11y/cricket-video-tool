// C190: 42 NAAM wale styles (Look + caption style + rang + zoom). 🎨 Style list se seedha chuno; 🎬 Naya Style ab inhi mein se random chunta hai aur naam dikhata hai.
// Har style: {n:naam, look, cs:caption style, cc:caption rang, z:zoom}. Last lagaya style localStorage 'cvt_style_last' mein.
(function(){const C=window.CORE;if(!C)return;
const LIST=[
['Raat ka Stadium','night','outline','cyan','soft'],['Floodlight Breaking','night','bar','white','medium'],['Midnight Neon','night','neon','cyan','soft'],['Chand Raat','night','line','gold','off'],['Powerplay Raat','night','pop','orange','medium'],['Silent Pitch','night','type','white','off'],
['Sunehri Shaam','gold','box','gold','soft'],['Trophy Shine','gold','line','gold','medium'],['Auction Hall','gold','bar','white','off'],['Dhoop ka Chhakka','gold','pop','orange','medium'],['Golden Hour Neon','gold','neon','pink','soft'],['Purani Diary','gold','type','orange','off'],
['Saaf Scoreboard','clean','box','white','off'],['News Desk','clean','bar','cyan','soft'],['Minimal Line','clean','line','green','off'],['Pitch Report','clean','outline','white','soft'],['Quick Update','clean','pop','green','medium'],['Tickertape','clean','type','cyan','off'],
['Bouncer Alert','grunge','pop','orange','medium'],['Lal Siren','grunge','bar','pink','medium'],['Akhbaar ki Cutting','grunge','outline','white','medium'],['Dressing Room Drama','grunge','box','orange','soft'],['Glitch Wicket','grunge','neon','green','medium'],['Breaking Typewriter','grunge','type','white','soft'],
['Navy Breaking','navy','box','cyan','soft'],['Blue Hour','navy','neon','cyan','off'],['Deep Dive','navy','line','gold','soft'],['Analyst Desk','navy','bar','white','off'],['Yorker Blue','navy','pop','cyan','medium'],['Code Blue','navy','type','green','off'],
['Purple Reel','purple','pop','pink','medium'],['Violet Glow','purple','neon','pink','soft'],['Royal Purple','purple','line','gold','soft'],['Creator Mode','purple','box','white','off'],['Faceless Tutorial','purple','outline','cyan','soft'],['Night Reel Type','purple','type','pink','off'],
['Studio Live','studio','box','white','off'],['Prime Time','studio','bar','gold','soft'],['Debate Desk','studio','line','orange','off'],['Panel Show','studio','outline','cyan','soft'],['Highlights Reel','studio','pop','gold','medium'],['Studio Neon','studio','neon','green','soft']
].map(a=>({n:a[0],look:a[1],cs:a[2],cc:a[3],z:a[4]}));
const SN=window.STYLENAMES={list:LIST};
const $=id=>document.getElementById(id),mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
let auto=true;try{auto=localStorage.getItem('cvt_style_auto')!=='0';}catch(e){}
const last=()=>{try{return localStorage.getItem('cvt_style_last')||'';}catch(e){return'';}};
SN.apply=async function(s,doVary){const L=window.LOOKSET;if(!L||!L.LOOKS[s.look])return'Look nahi mila';
  L.apply(s.look);const sel=$('lk_sel');if(sel)sel.value=s.look;
  if(window.PUNCH){PUNCH.set(s.z);const zs=$('lk_zoom');if(zs)zs.value=s.z;}
  if(window.CAP){CAP.setStyle(s.cs,s.cc);CAP.syncSel&&CAP.syncSel();}
  let m='';if(doVary!==false){try{m=await L.vary();}catch(e){m='';}}
  try{localStorage.setItem('cvt_style_last',s.n);}catch(e){}
  try{window.PLAYER&&PLAYER.draw();}catch(e){}
  return'🎨 Style: '+s.n+' ('+L.LOOKS[s.look].n+(window.CAP?' | caption: '+CAP.STYLES[s.cs]+', '+s.cc:'')+' | zoom '+s.z+')'+(m?' | '+m:'');};
SN.random=function(){const l=last(),c=LIST.filter(x=>x.n!==l);return SN.apply(c[Math.floor(Math.random()*c.length)],true);};
let box=null,flt='all',q='';
function say(t){const e=$('sn_st');if(e)e.textContent=t;const m=$('lk_msg');if(m)m.textContent=t;}
function render(){const g=box.querySelector('#sn_grid');g.innerHTML='';const L=window.LOOKSET,l=last();
  LIST.filter(s=>(flt==='all'||s.look===flt)&&(!q||s.n.toLowerCase().includes(q))).forEach(s=>{
    const d=mk('div');d.style.cssText='background:#22262f;border:2px solid '+(s.n===l?'#00c389':'#2f3541')+';border-radius:10px;padding:8px';
    const col=(window.CAP&&CAP.COLORS[s.cc])||'#fff';
    d.innerHTML='<div style="font-weight:700;font-size:15px">'+s.n+'</div><div style="font-size:12px;color:#9aa4b2;margin:3px 0">'+L.LOOKS[s.look].n+'<br>caption: '+(window.CAP?CAP.STYLES[s.cs]:s.cs)+' <span style="display:inline-block;width:10px;height:10px;border-radius:5px;background:'+col+';vertical-align:middle"></span><br>zoom: '+s.z+'</div><button style="background:#00c389;color:#04130e;font-weight:700;border:0;border-radius:6px;padding:7px 12px">'+(s.n===l?'✔ Laga hai':'✔ Lagao')+'</button>';
    d.querySelector('button').onclick=async()=>{say('⏳ '+s.n+'…');const m=await SN.apply(s,auto);say(m);render();};
    g.appendChild(d);});}
function open(){if(box){box.remove();box=null;return;}box=mk('div');box.style.cssText='position:fixed;inset:0;z-index:150;background:#14161bf2;color:#e9edf3;font:14px system-ui,sans-serif;overflow:auto;padding:12px';
  const L=window.LOOKSET;
  box.innerHTML='<style>#sn_grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sn_f{border:0;border-radius:14px;padding:7px 12px;background:#2b2f38;color:#e9edf3;font-size:13px}</style>'
   +'<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px">🎨 Style list ('+LIST.length+' naam)</b><button id="sn_x" class="sn_f">✕ Band</button></div>'
   +'<div style="color:#9aa4b2;margin:6px 0">Har style = Look + caption style + rang + zoom. Ek tap mein lag jaata hai. Pasand na aaye to ↶ Undo.</div>'
   +'<label style="display:block;margin:6px 0"><input type="checkbox" id="sn_a" '+(auto?'checked':'')+'> Lagate hi background + transition bhi badlo (Auto-vary)</label>'
   +'<input id="sn_q" placeholder="🔎 naam khojo" style="width:100%;box-sizing:border-box;padding:9px;border-radius:8px;border:1px solid #444;background:#000;color:#eee;font-size:15px">'
   +'<div id="sn_f" style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"></div><div id="sn_st" style="min-height:18px;color:#9fd5ff;margin:6px 0"></div><div id="sn_grid"></div>';
  document.body.appendChild(box);box.querySelector('#sn_x').onclick=open;
  box.querySelector('#sn_a').onchange=e=>{auto=e.target.checked;try{localStorage.setItem('cvt_style_auto',auto?'1':'0');}catch(er){}};
  box.querySelector('#sn_q').oninput=e=>{q=e.target.value.trim().toLowerCase();render();};
  const F=box.querySelector('#sn_f');[['all','Sab']].concat(Object.keys(L.LOOKS).map(k=>[k,L.LOOKS[k].n])).forEach(([k,n])=>{const b=mk('button','sn_f',n);b.onclick=()=>{flt=k;F.querySelectorAll('button').forEach(x=>x.style.background='#2b2f38');b.style.background='#7c3aed';render();};if(k===flt)b.style.background='#7c3aed';F.appendChild(b);});
  render();}
SN.open=open;
const addBtn=()=>{const r=$('lk_recipe');if(r&&!$('sn_btn')){const b=mk('button','','🎨 Style list ('+LIST.length+' naam)');b.id='sn_btn';b.style.cssText=r.style.cssText;b.style.background='#7c3aed';b.onclick=open;r.parentNode.insertBefore(b,r);}};
setInterval(addBtn,500);addBtn();
})();
