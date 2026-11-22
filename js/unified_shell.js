// C195 (22 Nov 2026): UNIFIED layout = Filmora (rail + preview + timeline) + Classic ke saare achhe features, ek hi screen mein.
// Filmora shell (js/filmora_shell.js) base hai; ye file uske upar chalti hai. ?layout=classic par purana Classic (classic_shell.js).
// Jo Classic se aaya: scenes ki compact list (↑ ↓ ⧉ ✕), ⏮ ⏭ + 'Scene 3/8' chip, Undo/Redo/Safe zone transport mein,
//   buttons ke 5 group tabs (Look / Intro-Outro / Text / Video / Kit), header mein ⚡ Export + status.
// Jo Filmora se: timeline (split/trim/drag), Media bin, Properties, resize handles, shortcuts.
// Purane modules ko chhua nahi — sirf unke elements nayi jagah. Naya button kisi group mein na aaye to groupOf() mein keyword jodo.
(function(){
'use strict';
let classic=false;try{classic=new URLSearchParams(location.search).get('layout')==='classic';}catch(e){}
if(classic)return;
const $=id=>document.getElementById(id);
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const LS='cvt_un_tab';
const tcode=t=>{t=Math.max(0,t||0);return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');};
const tcol=t=>{let h=0;String(t).split('').forEach(c=>{h=(h*31+c.charCodeAt(0))%360;});return 'hsl('+h+',55%,40%)';};
const lab=sc=>{const d=(sc&&sc.data)||{};const v=d.headline||d.head||d.title||d.name||d.pre||d.line1||(sc&&sc.header)||'';return String(Array.isArray(v)?v.join(' '):v).replace(/\s+/g,' ').replace(/\*/g,'').trim();};

function css(){
  const s=mk('style');s.id='un_css';s.textContent=`
/* header */
#fm-top{gap:10px;min-width:0}
#fm-top h1{flex:none}
#fm-top #nav{flex:1;min-width:0;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;gap:4px}
#fm-top #nav::-webkit-scrollbar{display:none}
#fm-top #nav a{white-space:nowrap;flex:none}
#fm-top .sp{display:none}
#un-st{font-size:12px;color:#cfe3ff;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none}
#fm-top #info{max-width:150px;flex:none}
#fm-cls{flex:none;opacity:.75}
#fm-exp{flex:none;background:#00c389}
#fm-exp[disabled]{opacity:.5}
/* left: compact scene list */
#un-lh{display:flex;align-items:center;gap:8px;margin:0 0 6px}
#un-lh b{font-size:13px;flex:1}
#un-lh button{background:#2b2f38;padding:4px 9px;font-size:12px;border-radius:6px}
#un-rows{max-height:min(40vh,360px);overflow:auto;position:relative;border:1px solid #2a313c;border-radius:8px;background:#12161c;scrollbar-width:thin;margin-bottom:8px}
.un-r{display:flex;align-items:center;gap:6px;padding:5px 7px;border-bottom:1px solid #1d232c;cursor:pointer;border-left:3px solid transparent}
.un-r:hover{background:#1a212b}
.un-r.sel{background:#1f2a40;border-left-color:#00e0a0}
.un-r.play{border-left-color:#ff3b55}.un-r.play .un-n{background:#ff3b55}
.un-n{flex:none;width:21px;height:21px;line-height:21px;text-align:center;border-radius:50%;background:#2b323e;font-size:11px}
.un-t{flex:none;font-size:10.5px;font-weight:700;padding:2px 6px;border-radius:5px;color:#fff;min-width:44px;text-align:center;max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.un-l{flex:1;min-width:0;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#dfe5ee}
.un-d{flex:none;font-size:11px;color:#8b95a5;font-variant-numeric:tabular-nums}
.un-a{flex:none;display:flex;gap:2px;opacity:.25}.un-r:hover .un-a,.un-r.sel .un-a{opacity:1}
.un-a button{background:#2b323e;padding:0;width:22px;height:22px;font-size:11px;border-radius:5px}
.un-a button.x:hover{background:#b3262b}
.un-se-row>div:first-child{display:none!important}
.un-off{display:none!important}
.un-msg{max-height:90px;overflow:auto;scrollbar-width:thin}
.un-hint{display:none!important}
#fm-lp:not(.sum-open) .un-sum{display:none!important}
/* transport extras */
#fm-tr .un-tb{background:#2b2f38;padding:0;width:34px;height:32px;font-size:14px;flex:none}
#fm-tr .un-x{background:#2b2f38;padding:6px 9px;font-size:12px;flex:none;border-radius:6px}
#fm-tr .un-x:disabled{opacity:.4}
#un-chip{font-size:12px;color:#cfe3ff;background:#1e2a44;border-radius:999px;padding:4px 11px;white-space:nowrap;flex:none}
#fm-tr{flex-wrap:nowrap}
#fm-tr #fm-tt{display:none}
#fm-tr #seek{flex:1;min-width:40px}
#fm-tr{gap:7px!important;padding:6px 8px!important}
#fm-tr .un-x{padding:5px 7px;font-size:11.5px}
#un-chip{padding:4px 9px;font-size:11.5px}
#fm-tr #seek{min-width:60px}
/* right: tabs */
#un-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:10px;position:sticky;top:-10px;z-index:5;background:#1b1e25;padding:10px 0 6px;margin-top:-10px}
#un-tabs button{background:#262d38;padding:7px 4px;font-size:12px;border-radius:7px;color:#c3cbd8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#un-tabs button.on{background:#00c389;color:#04130e;font-weight:700}
.un-pane{display:none;flex-direction:column;gap:6px}.un-pane.on{display:flex}
.un-pane button,.un-pane select{width:100%;text-align:left;border-radius:6px;padding:8px 10px;font-size:12.5px}
.un-pane input[type=text],.un-pane input[type=file]{width:100%}
#un-kb{margin-top:14px;font-size:11px;color:#8b95a5}
#un-kb summary{cursor:pointer;color:#9aa3b2}
/* preview ke neeche hint/undo-element bar */
#ee-hint{font-size:11px!important;padding:4px 12px!important;margin:0!important;color:#8b95a5;flex:none;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
#ee-hint button{padding:3px 8px;font-size:11px;background:#2b2f38}
#bar2{flex:none}
`;document.head.appendChild(s);}

function boot(){
  const C=window.CORE,P=window.PLAYER,SE=window.SE,UI=window.UI;
  css();
  const wrap=$('wrap'),left=$('fm-left'),lp=$('fm-lp'),right=$('fm-right'),tr=$('fm-tr'),mid=$('fm-mid'),quick=$('quick');
  if(!wrap||!left||!lp||!right||!tr||!mid||!quick){console.warn('unified_shell: filmora layout nahi mila');return;}
  document.body.classList.add('un');

  // ---- right panel thoda chauda (pehli baar) ----
  try{if(!localStorage.getItem('cvt_rw'))wrap.style.setProperty('--rw','330px');}catch(e){}

  // ---- header: Export (status ke saath) ----
  const top=$('fm-top'),ex=$('fm-exp'),st=mk('span');st.id='un-st';
  const h3=right.querySelector(':scope > h3');if(h3)h3.style.display='none';
  if(top&&ex){top.insertBefore(st,$('fm-cls')||ex);
    ex.textContent='⚡ Export (MP4)';ex.title='Fast export shuru (Export panel khulta hai, progress yahin dikhega)';
    ex.onclick=()=>{try{UI.open('export');}catch(e){}const f=$('expf');if(f&&!f.disabled)f.click();};
    setInterval(()=>{const x=$('expst')?$('expst').textContent:'';if(st.textContent!==x){st.textContent=x;st.title=x;}const f=$('expf');ex.disabled=!!(f&&f.disabled);},400);}

  // ---- preview ke neeche: element hint + undo bar ----
  ['ee-hint','bar2'].forEach(id=>{const e=$(id);if(e)mid.appendChild(e);});

  // ---- transport: ⏮ ⏭ + chip + Undo/Redo/Safe ----
  const play=$('play');
  const sceneAt=t=>{let i=0;for(let k=0;k<C.starts.length;k++)if(C.starts[k]<=t+1e-6)i=k;return i;};
  const pv=mk('button','un-tb','⏮'),nx=mk('button','un-tb','⏭');pv.title='Pichhla scene (↑)';nx.title='Agla scene (↓)';
  tr.insertBefore(pv,play);tr.insertBefore(nx,play.nextSibling);
  const chip=mk('span','','—');chip.id='un-chip';tr.appendChild(chip);
  const barX=mk('span');barX.style.cssText='display:flex;gap:6px;flex:none';tr.appendChild(barX);

  // ---- right panel: tabs (Properties + 5 groups) ----
  const pr=$('fm-props');
  const GROUPS=[['pr','⚙ Properties'],['lk','🎨 Look'],['io','🎬 Intro/Outro'],['tx','🔤 Text'],['vd','🎞 Video'],['kit','🗂 Kit']];
  const tabs=mk('div');tabs.id='un-tabs';right.insertBefore(tabs,right.firstChild);
  const panes={},tbtn={};let cur='lk';try{cur=localStorage.getItem(LS)||'lk';}catch(e){}
  if(!GROUPS.some(g=>g[0]===cur))cur='lk';
  const showTab=k=>{cur=k;try{localStorage.setItem(LS,k);}catch(e){}GROUPS.forEach(([g])=>{panes[g].classList.toggle('on',g===k);tbtn[g].classList.toggle('on',g===k);});};
  GROUPS.forEach(([k,nm])=>{const b=mk('button','',nm);b.onclick=()=>showTab(k);tabs.appendChild(b);tbtn[k]=b;const p=mk('div','un-pane');right.appendChild(p);panes[k]=p;});
  if(pr)panes.pr.appendChild(pr);
  quick.style.display='none';
  const groupOf=e=>{
    if(e.id==='lk_msg'||e.id==='bk_file'||e.tagName==='INPUT')return 'kit';
    const t=((e.tagName==='SELECT'?(e.options[0]&&e.options[0].text):e.textContent)||'').trim();
    if(/Undo|Redo|Safe zone/.test(t))return 'bar';
    if(/Intro|Outro|Like\/Comment|Standard intro/.test(t))return 'io';
    if(/Header line|Pills|Carry chip/.test(t))return 'tx';
    if(/Video yahan|Clips|Chapter flow|Short 9:16|Storyboard|Auto-vary/.test(t))return 'vd';
    if(/Kit|Sab photos/.test(t))return 'kit';
    return 'lk';};
  const sweep=()=>{[...quick.children].forEach(e=>{const g=groupOf(e);if(g==='bar'){e.classList.add('un-x');barX.appendChild(e);}else panes[g].appendChild(e);});};
  sweep();showTab(cur);new MutationObserver(sweep).observe(quick,{childList:true});
  // shortcuts hint (neeche, band)
  const kb=$('kbd');if(kb){const d=mk('details');d.id='un-kb';d.appendChild(mk('summary','','⌨ Shortcuts'));kb.style.display='block';d.appendChild(kb);right.appendChild(d);}

  // ---- left: scenes ki compact list ----
  const sv=UI.views.scenes,det=sv&&sv.querySelector('details');
  if(!sv||!det){console.warn('unified_shell: scenes view nahi mila');return;}
  const h=sv.querySelector('.hint');if(h)h.style.display='none';
  const lh0=mk('div');lh0.id='un-lh';const ttl=mk('b','','🎬 Scenes');const phb=mk('button','','📷');phb.title='Photos ka hisaab dikhao/chhupao';
  phb.onclick=()=>lp.classList.toggle('sum-open');lh0.appendChild(ttl);lh0.appendChild(phb);
  const rows=mk('div');rows.id='un-rows';
  sv.insertBefore(lh0,sv.firstChild);sv.insertBefore(rows,det);
  const box=()=>det.children[1];
  const seRows=()=>{const b=box();return b?[...b.children]:[];};
  const rowIdx=c=>{const f=c.firstChild;const b=f&&f.querySelector&&f.querySelector('b');const m=b&&/^(\d+)\.\s/.exec(b.textContent);return m?(+m[1]-1):-1;};
  const seRow=i=>seRows().find(c=>rowIdx(c)===i);
  const act=(i,label)=>{const r=seRow(i);if(!r||!r.firstChild)return;const b=[...r.firstChild.querySelectorAll('button')].find(x=>x.textContent===label);if(b)b.click();};
  function select(i){i=Math.max(0,Math.min(C.scenes.length-1,i));if(i<0)return;const r=seRow(i);const pb=r&&r.firstChild&&r.firstChild.querySelector('button');
    if(pb&&pb.textContent==='▶')pb.click();else{SE.sel=i;P.seek(C.starts[i]);}}
  function tag(){const b=box();if(!b)return;[...b.children].forEach((c,k)=>{const i=rowIdx(c);
    if(i>=0){c.classList.add('un-se-row');c.classList.toggle('un-off',i!==SE.sel);}
    else{const tx=(c.textContent||'').trim();c.classList.remove('un-sum','un-hint','un-msg');
      if(tx.indexOf('📷 Is video')===0){c.classList.add('un-sum');const bb=c.querySelector('b');phb.textContent='📷 '+(bb?bb.textContent.replace(/^📷\s*Is video ke liye photos:\s*/,'').replace(/\s*·.*$/,''):'');}
      else if(k===1&&tx.indexOf('Har scene mein')===0)c.classList.add('un-hint');
      else if(k>1)c.classList.add('un-msg');}});}
  let sig='';
  function build(force){const sc=C.scenes||[];
    const s2=JSON.stringify(sc.map(x=>[x.type,x.dur,lab(x),x.chunk||0]))+'|'+SE.sel+'|'+(C.total||0).toFixed(1);
    if(!force&&s2===sig)return;sig=s2;rows.innerHTML='';
    ttl.textContent='🎬 Scenes ('+sc.length+') · '+tcode(C.total);
    if(!sc.length){const e=mk('div','un-l','Koi scene nahi. Neeche "+ Scene jodo" ya "⬇ JSON load".');e.style.cssText='padding:12px;white-space:normal';rows.appendChild(e);}
    sc.forEach((x,i)=>{const r=mk('div','un-r'+(i===SE.sel?' sel':''));r.dataset.i=i;
      r.appendChild(mk('span','un-n',String(i+1)));
      const t=mk('span','un-t');t.textContent=x.type;t.style.background=tcol(x.type);r.appendChild(t);
      const lb0=mk('span','un-l');lb0.textContent=lab(x)||'—';r.appendChild(lb0);
      r.appendChild(mk('span','un-d',(+x.dur||0).toFixed(1)+'s'));
      const a=mk('div','un-a');[['↑',''],['↓',''],['⧉',''],['✕','x']].forEach(([txt,c])=>{const bt=mk('button',c,txt);bt.title={'↑':'Upar','↓':'Neeche','⧉':'Duplicate','✕':'Hatao (Ctrl+Z se wapas)'}[txt];bt.onclick=ev=>{ev.stopPropagation();act(i,txt);};a.appendChild(bt);});
      r.appendChild(a);r.onclick=()=>select(i);rows.appendChild(r);});
    tag();}
  let lastCur=-1;
  function tick(){const sc=C.scenes||[];if(!sc.length){chip.textContent='Koi scene nahi';return;}
    const i=sceneAt(P.t);chip.textContent='Scene '+(i+1)+'/'+sc.length+' · '+sc[i].type;
    if(i!==lastCur){lastCur=i;[...rows.children].forEach(r=>r.classList&&r.classList.toggle('play',+r.dataset.i===i));
      const r=rows.children[i];if(r&&r.dataset&&(r.offsetTop<rows.scrollTop||r.offsetTop+r.offsetHeight>rows.scrollTop+rows.clientHeight))rows.scrollTop=Math.max(0,r.offsetTop-rows.clientHeight/2+r.offsetHeight/2);}}
  const b0=box();if(b0)new MutationObserver(()=>requestAnimationFrame(()=>{build(true);lastCur=-1;})).observe(b0,{childList:true});
  setInterval(()=>{build(false);tick();},200);
  build(true);

  pv.onclick=()=>{const i=sceneAt(P.t);select((P.t-C.starts[i]>0.3)?i:i-1);};
  nx.onclick=()=>select(sceneAt(P.t)+1);
  window.UNIFIED={select,showTab};
}
const iv=setInterval(()=>{if(window.CORE&&CORE.ready&&window.PLAYER&&window.UI&&UI.views&&UI.views.scenes&&window.SE&&SE.P&&$('fm-right')&&$('fm-props')&&$('fm-tr')&&$('quick')){clearInterval(iv);try{boot();}catch(e){console.error('unified_shell error',e);}}},150);
})();
