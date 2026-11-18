// C71: 🗂 Storyboard review — render se pehle saare scenes ek grid mein; har scene par ✅ theek / ❌ hatao / 📝 note.
// ❌ wale scenes ek click mein hatte (↶ Undo se wapas). Notes copy karke chat mein bhej sakte ho. State: localStorage 'cvt_sb_wide' / 'cvt_sb_short'.
(function(){
const C=window.CORE,$=id=>document.getElementById(id);
const SB=window.SB={st:[]};
const key=()=>'cvt_sb_'+C.format;
const load=()=>{try{SB.st=JSON.parse(localStorage.getItem(key())||'[]');}catch(e){SB.st=[];}};
const save=()=>{try{localStorage.setItem(key(),JSON.stringify(SB.st));}catch(e){}};
const el=(t,css,txt)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e;};
function thumb(i,w,h){const cv=document.querySelector('canvas'),ctx=cv.getContext('2d'),sc=C.scenes[i];
  const t=C.starts[i]+Math.min(sc.dur,4)*.55,out=el('canvas');out.width=w;out.height=h;out.style.cssText='width:100%;border-radius:6px;display:block;background:#000';
  try{C.render(ctx,t);out.getContext('2d').drawImage(cv,0,0,w,h);}catch(e){}return out;}
SB.open=async function(){
  if(!C.scenes.length){return;}
  load();while(SB.st.length<C.scenes.length)SB.st.push({s:'',n:''});SB.st.length=C.scenes.length;
  const sh=C.format==='short',tw=sh?180:320,th=sh?320:180;
  const ov=el('div','position:fixed;inset:0;z-index:99999;background:rgba(10,12,18,.96);overflow:auto;padding:14px;font-family:inherit;color:#fff');
  ov.id='sb_ov';
  const top=el('div','display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;position:sticky;top:0;background:rgba(10,12,18,.96);padding:6px 0;z-index:2');
  const ttl=el('b','font-size:16px;margin-right:auto','🗂 Storyboard review — '+C.scenes.length+' scenes');
  const bcl=el('button','background:#3a4250','✕ Band karo'),bdel=el('button','background:#c0392b'),bcp=el('button','background:#1f8f55','📋 Notes copy');
  top.append(ttl,bcp,bdel,bcl);ov.appendChild(top);
  const msg=el('div','font-size:12px;opacity:.85;margin-bottom:8px','Thumbnail par tap = video wahan khulega. ❌ wale scenes "hatao" se ek saath hat jaate (↶ Undo se wapas).');ov.appendChild(msg);
  const grid=el('div','display:grid;grid-template-columns:repeat(auto-fill,minmax('+(tw+20)+'px,1fr));gap:10px');ov.appendChild(grid);
  const cards=[];
  const refresh=()=>{const nr=SB.st.filter(x=>x.s==='r').length;bdel.textContent='❌ '+nr+' scene hatao';bdel.disabled=!nr;
    cards.forEach((c,i)=>{const s=SB.st[i];c.box.style.outline=s.s==='r'?'3px solid #e74c3c':s.s==='a'?'3px solid #2ecc71':'3px solid transparent';c.img.style.opacity=s.s==='r'?.35:1;c.note.textContent=s.n?'📝 '+s.n:'';});};
  C.scenes.forEach((sc,i)=>{
    const box=el('div','background:#1b2030;border-radius:8px;padding:8px'),img=thumb(i,tw,th);
    img.style.cursor='pointer';img.onclick=()=>{ov.remove();window.PLAYER&&PLAYER.seek((C.starts[i]||0)+.05);};
    const lab=el('div','font-size:13px;margin:6px 0 4px',(i+1)+' · '+sc.type+' · '+(+sc.dur).toFixed(1)+'s');
    const row=el('div','display:flex;gap:6px;flex-wrap:wrap');
    const mk=(t,fn,bg)=>{const b=el('button','padding:5px 10px;font-size:13px;background:'+bg,t);b.onclick=fn;return b;};
    row.append(mk('✅ Theek',()=>{SB.st[i].s=SB.st[i].s==='a'?'':'a';save();refresh();},'#2a6'),
      mk('❌ Hatao',()=>{SB.st[i].s=SB.st[i].s==='r'?'':'r';save();refresh();},'#a33'),
      mk('📝 Note',()=>{const v=window.prompt('Scene '+(i+1)+' ka note (khaali = hatao):',SB.st[i].n||'');if(v!==null){SB.st[i].n=v.trim();save();refresh();}},'#555'));
    const note=el('div','font-size:12px;opacity:.9;margin-top:5px;word-break:break-word');
    box.append(img,lab,row,note);grid.appendChild(box);cards.push({box,img,note});});
  bcl.onclick=()=>{ov.remove();window.PLAYER&&PLAYER.draw();};
  bcp.onclick=()=>{const L=['Storyboard review ('+C.format+', '+C.scenes.length+' scenes):'];
    SB.st.forEach((x,i)=>{const sc=C.scenes[i];if(x.s||x.n)L.push('Scene '+(i+1)+' ('+sc.type+'): '+(x.s==='r'?'HATAO':x.s==='a'?'theek':'')+(x.n?' — '+x.n:''));});
    if(L.length===1)L.push('(koi mark/note nahi)');const tx=L.join('\n');
    const ok=()=>{msg.textContent='Notes copy ho gaye — chat mein paste karo.';};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(tx).then(ok,()=>{window.prompt('Copy karo:',tx);});else window.prompt('Copy karo:',tx);};
  bdel.onclick=async()=>{const idx=SB.st.map((x,i)=>x.s==='r'?i:-1).filter(i=>i>=0);if(!idx.length)return;
    if(idx.length>=C.scenes.length){msg.textContent='Saare scenes nahi hata sakte.';return;}
    if(!window.confirm(idx.length+' scene hatane hain? (↶ Undo se wapas aa sakte)'))return;
    const SE=window.SE;for(let k=idx.length-1;k>=0;k--){SE.scenes.splice(idx[k],1);SB.st.splice(idx[k],1);}
    SE.sel=0;save();ov.remove();await SE.apply(false);};
  document.body.appendChild(ov);refresh();window.PLAYER&&PLAYER.draw();
};
function boot(){const q=$('quick');if(!q||!window.SE||!window.PLAYER)return false;
  const b=el('button','background:#8e5bd8','🗂 Storyboard');b.id='sb_btn';b.onclick=()=>SB.open();q.appendChild(b);return true;}
const iv=setInterval(()=>{if(window.UI&&window.UI.syncFX&&C.ready&&boot())clearInterval(iv);},120);
})();
