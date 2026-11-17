// C29: UI shell — 5 step tabs (Scenes / Photos / Audio / Captions / Export), khaali-state guide, keyboard shortcuts.
// Purane modules (scene_editor, photos, audio_tracks, captions, export) jaise hain waise; yahan sirf unke panels ko tabs mein rakha hai.
(function(){
const $=id=>document.getElementById(id);
function boot(){
  const wrap=$('wrap'),info=$('info'),bar2=$('bar2');
  const top=n=>{while(n&&n.parentElement!==wrap)n=n.parentElement;return n;};
  const scenesDet=[...wrap.children].find(c=>c.tagName==='DETAILS');
  const phP=top($('phq')),atP=top($('atf')),capP=top($('capt'));
  const btnBy=t=>[...bar2.querySelectorAll('button')].find(b=>b.textContent.indexOf(t)>=0);
  const phB=$('phb'),atB=btnBy('Audio tracks'),capB=btnBy('Captions');
  const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};

  // quick toggles (Short mode, Polish) player ke neeche
  const quick=$('quick');quick.appendChild($('fmt'));quick.appendChild($('pol'));
  $('fmt').style.background=$('fmt').style.background||'#555';

  // views
  const views={};
  function view(key,nodes,hint){const v=mk('div','view');v.style.display='none';if(hint)v.appendChild(mk('p','hint',hint));nodes.forEach(n=>v.appendChild(n));wrap.insertBefore(v,info);views[key]=v;return v;}
  view('scenes',[scenesDet],'Har scene ek card hai (hook, title, stat…). Scene chuno, text badlo, ↑↓ se order badlo. Script chat se mila JSON ho to "⬇ JSON load" dabao.');
  view('photos',[phP],'Har khiladi/photo ke slot mein photo upload karo. Scenes mein jo naam likha hai, wahi slot use hota hai. Backup zaroor rakho.');
  const audRow=mk('div','');audRow.style.cssText='margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--line)';
  audRow.appendChild($('aud').parentElement);
  view('audio',[audRow,atP],'Voice-over lagao. Ek file: upar wala box. Kai chunk / mic: neeche. ▶ dabane par ab awaaz preview mein bhi aati hai.');
  view('caps',[capP],'Script paste karo, "Spread karo" dabao — har line ek caption ban kar audio par phail jaati hai.');
  const exp=mk('div','exp-main');exp.appendChild($('expf'));exp.appendChild($('exp'));
  const ex=view('export',[exp],'⚡ Fast = jaldi (Chrome desktop). Agar usme audio/error aaye to Real-time use karo (tab khula rakho).');
  ex.appendChild($('expst'));

  // panel on/off (purane toggle buttons ko hi chalate hain taaki unki list render ho)
  function panel(p,b,on){p.style.display='none';if(on&&b)b.click();else if(on)p.style.display='block';}
  const defs=[['scenes','🎬','Scenes'],['photos','🖼','Photos'],['audio','🎙','Audio'],['caps','💬','Captions'],['export','⬇','Export']];
  const steps=mk('div');steps.id='steps';wrap.insertBefore(steps,views.scenes);
  let cur=null;const tabs={};
  function open(k){
    cur=(cur===k)?null:k;
    defs.forEach(([key])=>{const on=cur===key;views[key].style.display=on?'block':'none';tabs[key].classList.toggle('on',on);});
    if(scenesDet)scenesDet.open=(cur==='scenes');
    panel(phP,phB,cur==='photos');panel(atP,atB,cur==='audio');panel(capP,capB,cur==='caps');
    if(cur==='scenes'&&window.SE&&SE.P)try{SE.P.draw();}catch(e){}
  }
  defs.forEach(([k,ic,nm],i)=>{const b=mk('button','',`<span class="n">${i+1}</span>${ic} ${nm}`);b.onclick=()=>open(k);steps.appendChild(b);tabs[k]=b;});
  window.UI={open,views};

  // khaali-state box
  const emp=$('empty');
  $('em_load').onclick=()=>{open('scenes');if(cur!=='scenes')open('scenes');const j=$('se_json');if(j)j.click();};
  $('em_new').onclick=()=>{if(cur!=='scenes')open('scenes');};
  let lastN=-1;setInterval(()=>{const n=(window.CORE&&CORE.scenes)?CORE.scenes.length:0;if(n!==lastN){lastN=n;emp.style.display=n?'none':'block';}},400);

  // keyboard
  document.addEventListener('keydown',e=>{
    const t=e.target,tg=t&&t.tagName;if(['INPUT','TEXTAREA','SELECT','BUTTON','SUMMARY'].includes(tg)||(t&&t.isContentEditable))return;
    const P=window.PLAYER;if(!P||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.code==='Space'){e.preventDefault();$('play').click();}
    else if(e.code==='ArrowRight'){e.preventDefault();P.seek(P.t+1);}
    else if(e.code==='ArrowLeft'){e.preventDefault();P.seek(P.t-1);}
  });

  open('scenes'); // pehla step khula
}
const iv=setInterval(()=>{if(window.CORE&&CORE.ready&&$('phq')&&$('atf')&&$('capt')&&document.querySelector('#wrap > details')){clearInterval(iv);try{boot();}catch(e){console.error('UI shell error',e);}}},100);
})();
