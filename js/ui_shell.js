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


  // ---- C30: Undo / Redo (scenes ke har badlav ka history) ----
  const C=window.CORE;
  const hist=[],fut=[];let last=JSON.stringify(SE.scenes),fmt=C.format,busy=false;
  const bU=mk('button','','↶ Undo'),bR=mk('button','','↷ Redo');[bU,bR].forEach(b=>{b.style.background='#3a4250';quick.appendChild(b);});
  const upd=()=>{bU.disabled=!hist.length;bR.disabled=!fut.length;};
  async function restore(p){busy=true;last=p;SE.scenes=JSON.parse(p);SE.sel=Math.max(0,Math.min(SE.sel,SE.scenes.length-1));try{await SE.apply(true);}catch(e){console.error(e);}busy=false;upd();}
  const undo=()=>{if(busy||!hist.length)return;fut.push(last);restore(hist.pop());};
  const redo=()=>{if(busy||!fut.length)return;hist.push(last);restore(fut.pop());};
  bU.onclick=undo;bR.onclick=redo;upd();
  setInterval(()=>{if(busy)return;
    if(C.format!==fmt){fmt=C.format;hist.length=0;fut.length=0;last=JSON.stringify(SE.scenes);upd();return;}
    const cur=JSON.stringify(SE.scenes);if(cur!==last){hist.push(last);if(hist.length>60)hist.shift();fut.length=0;last=cur;upd();}},500);
  document.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey))return;const t=e.target,tg=t&&t.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tg)||(t&&t.isContentEditable))return;
    const k=(e.key||'').toLowerCase();if(k==='z'&&!e.shiftKey){e.preventDefault();undo();}else if(k==='y'||(k==='z'&&e.shiftKey)){e.preventDefault();redo();}});

  // ---- C30: Safe-zone guide (sirf preview mein; export mein nahi aata) ----
  const bS=mk('button','','▦ Safe zone: OFF');bS.style.background='#3a4250';quick.appendChild(bS);
  const UIs={safe:false};window.UI.safe=UIs;
  bS.onclick=()=>{UIs.safe=!UIs.safe;bS.textContent='▦ Safe zone: '+(UIs.safe?'ON':'OFF');bS.style.background=UIs.safe?'#2a6fdb':'#3a4250';window.PLAYER&&PLAYER.draw();};
  const P0=window.PLAYER,draw0=P0.draw;
  P0.draw=function(){draw0.apply(this,arguments);if(!UIs.safe)return;
    const cv=$('cv'),x=cv.getContext('2d'),W=cv.width,H=cv.height,sh=C.format==='short';
    x.save();x.lineWidth=Math.max(2,W/540);x.font=C.font(Math.round(W/60),700);x.textBaseline='top';
    const box=(m,col,label)=>{x.setLineDash([W/60,W/90]);x.strokeStyle=col;x.strokeRect(m,m*(sh?1:H/W),W-2*m,H-2*m*(sh?1:H/W));x.setLineDash([]);x.fillStyle=col;x.fillText(label,m+8,m*(sh?1:H/W)+6);};
    box(C.SAFE,'rgba(60,255,140,.9)','text yahan tak (auto-fit)');
    box(Math.round(W*0.05),'rgba(255,200,60,.85)','title-safe 90%');
    if(sh){x.fillStyle='rgba(255,60,60,.22)';x.fillRect(0,0,W,160);x.fillRect(0,H-300,W,300);x.fillStyle='#ff8080';x.fillText('YouTube Shorts UI (upar)',16,170);x.fillText('YouTube Shorts UI (neeche: title/buttons)',16,H-296);}
    x.strokeStyle='rgba(255,255,255,.25)';x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,H);x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();
    x.restore();};
  // real-time export ke dauran guide band (warna video mein record ho jaata)
  if(window.EXPORT&&EXPORT.run){const r0=EXPORT.run;EXPORT.run=async function(){const was=UIs.safe;UIs.safe=false;try{return await r0.apply(this,arguments);}finally{UIs.safe=was;}};}


  // ---- C31: FX — Colour Look, Cinematic bars, Progress bar ----
  if(C.FX){const FX=C.FX;
    const sel=mk('select','');sel.style.cssText='background:#3a4250;color:#fff;border:0;border-radius:8px;padding:7px 10px;font-size:13px;font-family:inherit';
    Object.keys(FX.LOOKS).forEach(k=>{const o=mk('option','',FX.LOOKS[k]);o.value=k;sel.appendChild(o);});sel.value=FX.look;
    sel.onchange=()=>{FX.look=sel.value;FX.save();window.PLAYER&&PLAYER.draw();};quick.appendChild(sel);
    const tg=(label,key)=>{const b=mk('button','',label+': '+(FX[key]?'ON':'OFF'));const paint=()=>{b.textContent=label+': '+(FX[key]?'ON':'OFF');b.style.background=FX[key]?'#2a6fdb':'#3a4250';};paint();
      b.onclick=()=>{FX[key]=!FX[key];FX.save();paint();window.PLAYER&&PLAYER.draw();};quick.appendChild(b);};
    const paints=[];
    const tg2=(label,key)=>{const b=mk('button','',label);const paint=()=>{b.textContent=label+': '+(FX[key]?'ON':'OFF');b.style.background=FX[key]?'#2a6fdb':'#3a4250';};paint();paints.push(paint);
      b.onclick=()=>{FX[key]=!FX[key];FX.save();paint();window.PLAYER&&PLAYER.draw();};quick.appendChild(b);};
    tg2('🎞 Cinema bars','bars');tg2('▬ Progress bar','prog');
    window.UI.syncFX=()=>{sel.value=FX.look;paints.forEach(f=>f());};}

  open('scenes'); // pehla step khula
}
const iv=setInterval(()=>{if(window.CORE&&CORE.ready&&$('phq')&&$('atf')&&$('capt')&&document.querySelector('#wrap > details')){clearInterval(iv);try{boot();}catch(e){console.error('UI shell error',e);}}},100);
})();
