// C185: "➕ Video yahan jodo" — playhead ke paas (sabse nazdeeki scene ki seema par) koi bhi video clip scene ban kar jud jaati hai.
// Classic: player ke neeche; Filmora: timeline toolbar. 🎞 Clips button bhi classic mein bahar. Clip ki awaaz abhi mute (card_clip.js).
(function(){
'use strict';
const C=window.CORE;if(!C)return;
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
function toast(m,bad){let t=document.getElementById('ci_toast');if(!t){t=mk('div');t.id='ci_toast';t.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;padding:10px 16px;border-radius:8px;font-size:14px;color:#fff;max-width:80vw';document.body.appendChild(t);}
  t.style.background=bad?'#c0392b':'#1f8f55';t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>{t.style.display='none';},4500);}
const inp=mk('input');inp.type='file';inp.accept='video/*';inp.style.display='none';document.body.appendChild(inp);
async function addAt(file){
  const SE=window.SE,P=window.PLAYER;
  if(!SE||!P||!SE.scenes){toast('Tool abhi ready nahi',1);return;}
  if(C.format!=='wide'){toast('Video clip sirf wide (16:9) mode mein. Short mode band karo.',1);return;}
  toast('⏳ Clip load ho rahi hai…');
  let clip;try{clip=await C.clipAdd(file);}catch(e){toast('Clip khuli nahi: '+e.message,1);return;}
  const sc=SE.scenes,n=sc.length;let idx=0;
  if(n){let a=-1;for(let i=0;i<n;i++)if(P.t>=C.starts[i]&&P.t<C.starts[i]+sc[i].dur)a=i;if(a<0)a=P.t<=0?0:n-1;
    const mid=C.starts[a]+sc[a].dur/2;idx=P.t<mid?a:a+1;}
  const nb=sc[idx-1]||sc[idx]||null;
  const dur=+Math.max(1.5,Math.min(60,clip.dur)).toFixed(1);
  const ns={type:'clip',dur:dur,tr:idx===0?'cut':'fade',trDur:idx===0?0:.5,data:{clip:clip.name,start:0,fit:'cover'}};
  if(nb&&nb.chunk!=null)ns.chunk=nb.chunk;
  sc.splice(idx,0,ns);SE.sel=idx;
  try{await SE.apply(true);}catch(e){console.error(e);}
  try{P.seek(C.starts[idx]+0.1);}catch(e){}
  toast('✔ Video scene '+(idx+1)+' par jud gayi ('+dur+'s). Hilane ke liye timeline mein drag / ◀ ▶.');
}
inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.value='';if(f)addAt(f);};
function btns(){
  const q=document.getElementById('quick');
  if(q&&!document.getElementById('ci_btn')){
    const b=mk('button','','➕ Video yahan jodo');b.id='ci_btn';b.style.background='#16a085';b.title='Playhead ke paas koi bhi video clip scene ke beech mein lagao';b.onclick=()=>inp.click();q.insertBefore(b,q.firstChild);
    const c=mk('button','','🎞 Clips');c.id='ci_clips';c.style.background='#3a4250';c.onclick=()=>C.clipsOpen&&C.clipsOpen();q.insertBefore(c,b.nextSibling);}
  // C222: Studio mein "✂ Timeline edit" — Editor Scenes ke upar overlay mein (tab badle bina)
  let S=null;try{S=window.parent!==window&&window.parent.STUDIO&&window.parent.STUDIO.openEditorOverlay?window.parent.STUDIO:null;}catch(e){}
  if(S){const go=()=>S.openEditorOverlay();
    if(q&&!document.getElementById('ci_tl')){const t=mk('button','','✂ Timeline edit');t.id='ci_tl';t.style.background='#8e44ad';t.title='Scenes ko Editor ki timeline mein kholo (tracks, transitions, ripple, speed) — tab badle bina';t.onclick=go;q.insertBefore(t,q.firstChild);}
    const tt2=document.getElementById('tl-tools');if(tt2&&!document.getElementById('ci_tl2')){const t=mk('button','','✂ Timeline edit');t.id='ci_tl2';t.title='Editor overlay mein kholo';t.onclick=go;tt2.appendChild(t);}}
  const tt=document.getElementById('tl-tools');
  if(tt&&!document.getElementById('ci_btn2')){const b=mk('button','','➕ Video yahan');b.id='ci_btn2';b.title='Playhead ke paas video clip jodo';b.onclick=()=>inp.click();tt.appendChild(b);}
}
setInterval(btns,500);btns();
window.CLIPINS={add:addAt};
})();
