// C193b (21 Nov 2026): Classic layout ka naya interface — preview bada, scenes ki list side mein, buttons ke groups.
// Purane modules ko chhua nahi: sirf unke elements ko nayi jagah rakha (ui_shell/scene_editor/looks/bumpers sab jaise the waise).
// Sirf Classic mein chalta hai (?layout=filmora par band). Choti screen (<1100px) par purana stacked layout.
(function(){
'use strict';
let classic=true;try{classic=new URLSearchParams(location.search).get('layout')!=='filmora';}catch(e){}
if(!classic)return;
const $=id=>document.getElementById(id);
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const LS='cvt_cl_tab';
const tcode=t=>{t=Math.max(0,t||0);return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');};
const tcol=t=>{let h=0;String(t).split('').forEach(c=>{h=(h*31+c.charCodeAt(0))%360;});return 'hsl('+h+',55%,40%)';};
const lab=sc=>{const d=(sc&&sc.data)||{};const v=d.headline||d.head||d.title||d.name||d.pre||d.line1||(sc&&sc.header)||'';return String(Array.isArray(v)?v.join(' '):v).replace(/\s+/g,' ').replace(/\*/g,'').trim();};

function css(){
  const s=mk('style');s.id='cl_css';s.textContent=`
#wrap{max-width:1780px;padding:8px 14px 24px}
#top{flex-wrap:nowrap;gap:12px;margin:0 0 8px}
#top h1{font-size:17px;white-space:nowrap}
#nav{flex:1;min-width:0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}
#nav a{white-space:nowrap;padding:5px 10px;font-size:12.5px}
#cl-hr{display:flex;align-items:center;gap:10px;flex:none}
#cl-st{font-size:12.5px;color:#cfe3ff;max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#cl-exp{background:var(--green);font-weight:700;padding:9px 18px;font-size:14px}
#cl-grid{display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:14px;align-items:start}
#cl-main{min-width:0}
#cl-main canvas#cv{width:min(100%,calc((100vh - 300px)*var(--arn,1.7778)));aspect-ratio:var(--ar,16/9);margin:0 auto;box-shadow:0 6px 30px #0008}
#bar{margin-top:8px;padding:6px 10px;gap:8px;flex-wrap:wrap}
#bar #play{width:50px;height:38px}
.cl-tb{background:#2b323e;padding:0;width:40px;height:38px;font-size:15px}
#bar #tm{min-width:70px}
.cl-chip{font-size:13px;color:#cfe3ff;background:#1e2a44;border-radius:999px;padding:5px 12px;white-space:nowrap}
.cl-sep{width:1px;align-self:stretch;background:var(--line);margin:0 2px}
#bar .cl-x{background:#2b323e;padding:7px 11px;font-size:13px}
#quick{display:block;margin-top:8px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px}
#cl-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
#cl-tabs button{background:#262d38;padding:7px 14px;font-size:13.5px;border-radius:999px;color:#c3cbd8}
#cl-tabs button.on{background:var(--blue);color:#fff;font-weight:600}
.cl-pane{display:none;flex-wrap:wrap;gap:8px;align-items:center}.cl-pane.on{display:flex}
.cl-pane button{padding:8px 13px;font-size:13.5px}
.cl-pane select{padding:8px 10px;font-size:13px;border-radius:8px}
#cl-side{position:sticky;top:8px;max-height:calc(100vh - 16px);overflow:auto;scrollbar-width:thin}
#cl-side #steps{margin-top:0;position:sticky;top:0;z-index:5;background:var(--bg);padding-bottom:6px;overflow:visible}
#cl-side #steps button{min-width:0;padding:9px 2px;font-size:13px}
#cl-side #steps button .n{display:none}
#cl-side .view{margin-top:0;padding:8px;border-radius:10px}
#cl-side .view .hint{font-size:12px;margin:0 0 6px}
#cl-lh{display:flex;align-items:center;gap:8px;margin:0 0 6px}
#cl-lh b{font-size:14px;flex:1}
#cl-lh button{background:#2b323e;padding:5px 10px;font-size:12px}
#cl-rows{max-height:min(46vh,430px);overflow:auto;position:relative;border:1px solid var(--line);border-radius:8px;background:#12161c;scrollbar-width:thin}
.cl-r{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #1d232c;cursor:pointer;border-left:3px solid transparent}
.cl-r:hover{background:#1a212b}
.cl-r.sel{background:#1f2a40;border-left-color:var(--blue)}
.cl-r.play{border-left-color:var(--red)}.cl-r.play .cl-n{background:var(--red)}
.cl-n{flex:none;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#2b323e;font-size:11.5px}
.cl-t{flex:none;font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px;color:#fff;min-width:50px;text-align:center}
.cl-l{flex:1;min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#dfe5ee}
.cl-d{flex:none;font-size:11.5px;color:var(--mut);font-variant-numeric:tabular-nums}
.cl-a{flex:none;display:flex;gap:2px;opacity:.25}.cl-r:hover .cl-a,.cl-r.sel .cl-a{opacity:1}
.cl-a button{background:#2b323e;padding:0;width:24px;height:24px;font-size:12px;border-radius:5px}
.cl-a button.x:hover{background:#b3262b}
.cl-se-row>div:first-child{display:none!important}
.cl-off{display:none!important}
.cl-msg{max-height:96px;overflow:auto;scrollbar-width:thin}
.cl-hint{display:none!important}
#cl-side:not(.sum-open) .cl-sum{display:none!important}
#cl-side .view details>div{margin-top:8px!important}
#kbd{margin-top:8px}
@media(max-width:1100px){
 #cl-grid{grid-template-columns:minmax(0,1fr)}#cl-side{position:static;max-height:none}
 #cl-main canvas#cv{width:100%}#top{flex-wrap:wrap}#cl-hr{width:100%;justify-content:space-between}}
`;document.head.appendChild(s);}

function boot(){
  const C=window.CORE,P=window.PLAYER,SE=window.SE,UI=window.UI;
  css();
  const wrap=$('wrap'),top=$('top');
  // ---- layout: main (preview+bar+buttons) | side (tabs + scenes) ----
  const grid=mk('div');grid.id='cl-grid';const main=mk('div');main.id='cl-main';const side=mk('aside');side.id='cl-side';
  wrap.insertBefore(grid,top.nextSibling);grid.appendChild(main);grid.appendChild(side);
  ['cv','bar','quick','ee-hint','empty','bar2','info','kbd'].forEach(id=>{const e=$(id);if(e)main.appendChild(e);});
  side.appendChild($('steps'));[...wrap.querySelectorAll(':scope > .view')].forEach(v=>side.appendChild(v));

  // ---- header: Export button + status (har tab se) ----
  const hr=mk('div');hr.id='cl-hr';const st=mk('span');st.id='cl-st';const eb=mk('button','','⚡ Export (MP4)');eb.id='cl-exp';
  eb.title='Fast export shuru (Export tab khulta hai, progress yahin dikhega)';
  eb.onclick=()=>{const t=$('steps').children[3];if(t&&!t.classList.contains('on'))t.click();$('expf').click();};
  hr.appendChild(st);hr.appendChild(eb);top.appendChild(hr);
  setInterval(()=>{const x=$('expst')?$('expst').textContent:'';if(st.textContent!==x){st.textContent=x;st.title=x;}eb.disabled=$('expf').disabled;},400);

  // ---- preview ka aspect (Short 9:16 mein bhi fit) ----
  const cv=$('cv');let lw=0,lh=0;
  const ar=()=>{if(cv.width!==lw||cv.height!==lh){lw=cv.width;lh=cv.height;main.style.setProperty('--ar',lw+'/'+lh);main.style.setProperty('--arn',(lw/lh).toFixed(4));cv.style.setProperty('--ar',lw+'/'+lh);cv.style.setProperty('--arn',(lw/lh).toFixed(4));}};
  ar();setInterval(ar,400);

  // ---- transport: ⏮ ▶ ⏭ + scene chip + Undo/Redo/Safe zone ----
  const bar=$('bar'),play=$('play');
  const sceneAt=t=>{let i=0;for(let k=0;k<C.starts.length;k++)if(C.starts[k]<=t+1e-6)i=k;return i;};
  const pv=mk('button','cl-tb','⏮'),nx=mk('button','cl-tb','⏭');pv.title='Pichhla scene (↑)';nx.title='Agla scene (↓)';
  bar.insertBefore(pv,play);bar.insertBefore(nx,play.nextSibling);
  const chip=mk('span','cl-chip','—');bar.appendChild(bar.querySelector('#tm'));bar.appendChild(chip);
  const sep=mk('span','cl-sep');bar.appendChild(sep);
  const barX=mk('span');barX.style.cssText='display:flex;gap:6px;flex-wrap:wrap';bar.appendChild(barX);

  // ---- buttons ke groups ----
  const q=$('quick');
  const GROUPS=[['lk','🎨 Look'],['io','🎬 Intro/Outro'],['tx','🔤 Text'],['vd','🎞 Video'],['kit','🗂 Kit']];
  const tabs=mk('div');tabs.id='cl-tabs';q.insertBefore(tabs,q.firstChild);
  const panes={},tbtn={};let curTab='lk';try{curTab=localStorage.getItem(LS)||'lk';}catch(e){}
  if(!GROUPS.some(g=>g[0]===curTab))curTab='lk';
  const showTab=k=>{curTab=k;try{localStorage.setItem(LS,k);}catch(e){}GROUPS.forEach(([g])=>{panes[g].classList.toggle('on',g===k);tbtn[g].classList.toggle('on',g===k);});};
  GROUPS.forEach(([k,nm])=>{const b=mk('button','',nm);b.onclick=()=>showTab(k);tabs.appendChild(b);tbtn[k]=b;const p=mk('div','cl-pane');q.appendChild(p);panes[k]=p;});
  const groupOf=e=>{
    if(e.id==='lk_msg'||e.id==='bk_file'||e.tagName==='INPUT')return 'kit';
    const t=((e.tagName==='SELECT'?(e.options[0]&&e.options[0].text):e.textContent)||'').trim();
    if(/Undo|Redo|Safe zone/.test(t))return 'bar';
    if(/Intro|Outro|Like\/Comment|Standard intro/.test(t))return 'io';
    if(/Header line|Pills|Carry chip/.test(t))return 'tx';
    if(/Video yahan|Clips|Chapter flow|Short 9:16|Storyboard|Auto-vary/.test(t))return 'vd';
    if(/Kit/.test(t))return 'kit';
    return 'lk';};
  const sweep=()=>{[...q.children].forEach(e=>{if(e===tabs||e.classList.contains('cl-pane'))return;
    const g=groupOf(e);if(g==='bar'){e.classList.add('cl-x');barX.appendChild(e);}else panes[g].appendChild(e);});};
  sweep();showTab(curTab);new MutationObserver(sweep).observe(q,{childList:true});

  // ---- scenes list (side) ----
  const sv=UI.views.scenes,det=sv.querySelector('details');
  const h=sv.querySelector('.hint');if(h)h.style.display='none';
  const lh0=mk('div');lh0.id='cl-lh';const ttl=mk('b','','🎬 Scenes');const phb=mk('button','','📷');phb.title='Photos ka hisaab dikhao/chhupao';
  phb.onclick=()=>side.classList.toggle('sum-open');lh0.appendChild(ttl);lh0.appendChild(phb);
  const rows=mk('div');rows.id='cl-rows';
  sv.insertBefore(lh0,sv.firstChild);sv.insertBefore(rows,det);
  const box=()=>det&&det.children[1];
  const seRows=()=>{const b=box();return b?[...b.children]:[];};
  const rowIdx=c=>{const f=c.firstChild;const b=f&&f.querySelector&&f.querySelector('b');const m=b&&/^(\d+)\.\s/.exec(b.textContent);return m?(+m[1]-1):-1;};
  const seRow=i=>seRows().find(c=>rowIdx(c)===i);
  const act=(i,label)=>{const r=seRow(i);if(!r||!r.firstChild)return;const b=[...r.firstChild.querySelectorAll('button')].find(x=>x.textContent===label);if(b)b.click();};
  function select(i){i=Math.max(0,Math.min(C.scenes.length-1,i));if(i<0)return;const r=seRow(i);const pb=r&&r.firstChild&&r.firstChild.querySelector('button');
    if(pb&&pb.textContent==='▶')pb.click();else{SE.sel=i;P.seek(C.starts[i]);}}
  // SE ke apne rows: selected ke alawa chhupao, extras chhote karo
  function tag(){const b=box();if(!b)return;[...b.children].forEach((c,k)=>{const i=rowIdx(c);
    if(i>=0){c.classList.add('cl-se-row');c.classList.toggle('cl-off',i!==SE.sel);}
    else{const tx=(c.textContent||'').trim();c.classList.remove('cl-sum','cl-hint','cl-msg');
      if(tx.indexOf('📷 Is video')===0){c.classList.add('cl-sum');const bb=c.querySelector('b');phb.textContent='📷 '+(bb?bb.textContent.replace(/^📷\s*Is video ke liye photos:\s*/,'').replace(/\s*·.*$/,''):'');}
      else if(k===1&&tx.indexOf('Har scene mein')===0)c.classList.add('cl-hint');
      else if(k>1)c.classList.add('cl-msg');}});}
  let sig='';
  function build(force){const sc=C.scenes||[];
    const s2=JSON.stringify(sc.map(x=>[x.type,x.dur,lab(x),x.chunk||0]))+'|'+SE.sel+'|'+(C.total||0).toFixed(1);
    if(!force&&s2===sig)return;sig=s2;rows.innerHTML='';
    ttl.textContent='🎬 Scenes ('+sc.length+') · '+tcode(C.total);
    if(!sc.length){rows.appendChild(mk('div','cl-l','Koi scene nahi. Neeche "+ Scene jodo" ya "⬇ JSON load".')).style.cssText='padding:12px;white-space:normal';}
    sc.forEach((x,i)=>{const r=mk('div','cl-r'+(i===SE.sel?' sel':''));r.dataset.i=i;
      r.appendChild(mk('span','cl-n',String(i+1)));
      const t=mk('span','cl-t');t.textContent=x.type;t.style.background=tcol(x.type);r.appendChild(t);
      const lb0=mk('span','cl-l');lb0.textContent=lab(x)||'—';r.appendChild(lb0);
      r.appendChild(mk('span','cl-d',(+x.dur||0).toFixed(1)+'s'));
      const a=mk('div','cl-a');[['↑','↑',''],['↓','↓',''],['⧉','⧉',''],['✕','✕','x']].forEach(([txt,lb,c])=>{const bt=mk('button',c,txt);bt.title={'↑':'Upar','↓':'Neeche','⧉':'Duplicate','✕':'Hatao (Ctrl+Z se wapas)'}[txt];bt.onclick=ev=>{ev.stopPropagation();act(i,lb);};a.appendChild(bt);});
      r.appendChild(a);r.onclick=()=>select(i);rows.appendChild(r);});
    tag();}
  let lastCur=-1,lastSel=-1;
  function tick(){const sc=C.scenes||[];if(!sc.length){chip.textContent='Koi scene nahi';return;}
    const i=sceneAt(P.t);chip.textContent='Scene '+(i+1)+'/'+sc.length+' · '+sc[i].type+' · '+tcode(P.t)+'/'+tcode(C.total);
    if(i!==lastCur){lastCur=i;[...rows.children].forEach(r=>r.classList&&r.classList.toggle('play',+r.dataset.i===i));
      const r=rows.children[i];if(r&&r.dataset&&(r.offsetTop<rows.scrollTop||r.offsetTop+r.offsetHeight>rows.scrollTop+rows.clientHeight))rows.scrollTop=Math.max(0,r.offsetTop-rows.clientHeight/2+r.offsetHeight/2);}}
  const b0=box();if(b0)new MutationObserver(()=>requestAnimationFrame(()=>{build(true);lastCur=-1;})).observe(b0,{childList:true});
  setInterval(()=>{build(false);tick();},200);
  build(true);

  pv.onclick=()=>{const i=sceneAt(P.t);select((P.t-C.starts[i]>0.3)?i:i-1);};
  nx.onclick=()=>select(sceneAt(P.t)+1);

  // ---- keyboard: ↑↓ scene, Home/End ----
  document.addEventListener('keydown',e=>{const t=e.target,tg=t&&t.tagName;
    if(['INPUT','TEXTAREA','SELECT'].includes(tg)||(t&&t.isContentEditable)||e.ctrlKey||e.metaKey||e.altKey)return;
    if(window.EE&&EE.sel)return; // preview par element chuna ho to arrow uska nudge hai
    if(e.code==='ArrowDown'){e.preventDefault();nx.click();}
    else if(e.code==='ArrowUp'){e.preventDefault();pv.click();}
    else if(e.code==='Home'){e.preventDefault();P.seek(0);}
    else if(e.code==='End'){e.preventDefault();P.seek(C.total);}});
  const kb=$('kbd');if(kb)kb.innerHTML+=' &nbsp; <kbd>↑</kbd> <kbd>↓</kbd> scene &nbsp; <kbd>Home</kbd> <kbd>End</kbd> &nbsp; <kbd>Ctrl+Z</kbd> undo';
  window.CLASSIC={select,showTab};
}
const iv=setInterval(()=>{if(window.CORE&&CORE.ready&&window.PLAYER&&window.UI&&UI.views&&UI.views.scenes&&window.SE&&SE.P&&$('steps')&&$('quick')){clearInterval(iv);try{boot();}catch(e){console.error('classic_shell error',e);}}},150);
})();
