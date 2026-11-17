// C11 (generic): scene editor. SE.init(player, setScenesFn). No script/video specific content.
(function(){
'use strict';
const C=window.CORE;
const KEYS={wide:'cvt_scenes',short:'cvt_scenes_short'};
const keyOf=()=>KEYS[C.format]||KEYS.wide;
const TYPES_W=['hook','title','stat','retain','watch','rumour','anth','intro','presenter','cta'],TYPES_S=['short_hook','short_stat','short_cta'];
const types=()=>C.format==='short'?TYPES_S:TYPES_W;
const TRS=['cut','fade','grunge','zoom','whip','glitch','flash','slideup','push','iris','blinds','rgb','spin','lightwipe','tiles','blurfade'];
const DEF={
 hook:{dur:4,data:{pre:'ऊपर की लाइन',to:10,dec:0,unit:'करोड़'}},
 title:{dur:4,data:{city:'mumbai',headline:'हेडलाइन यहाँ',sub:'सब-हेडिंग',ticker:'टिकर टेक्स्ट यहाँ'}},
 stat:{dur:4.5,data:{photo:'',pre:'छोटी लाइन',prefix:'₹',to:10,dec:0,unit:'करोड़',head:'हेडलाइन',sub:'',lt:'red',tag:true}},
 retain:{dur:4.5,data:{city:'mumbai',photo:'',name:'नाम',amount:'₹ 10 CR',stamp:'retain',note:'नोट'}},
 watch:{dur:5,data:{title:'नज़र रहेगी',names:['नाम 1','नाम 2'],photos:[],note:''}},
 rumour:{dur:5,data:{head:'हेडलाइन',sub:'अभी ऑफिशियल नहीं',photos:[]}},
 anth:{dur:5,data:{title:'',qs:['सवाल 1','सवाल 2','सवाल 3'],cta:''}},
 intro:{dur:4,data:{line1:'लाइन 1',line2:'लाइन 2'}},
 cta:{dur:4,data:{mode:'like',title:'',line:''}},
 presenter:{dur:5,data:{channel:'99cricketnews',name:'Yuvraj Sisodiya',sub:'क्रिकेट की हर खबर',photos:[''],key:'auto',swap:1.4}},
 short_hook:{dur:3.5,data:{pre:'ऊपर की लाइन',to:10,dec:0,unit:'करोड़',post:''}},
 short_stat:{dur:4,data:{photo:'',pre:'छोटी लाइन',prefix:'₹',to:10,dec:0,unit:'करोड़',head:'हेडलाइन',sub:'',lt:'red',tag:true}},
 short_cta:{dur:3.5,data:{line1:'आपकी राय क्या है?',line2:'कमेंट में बताओ',cta:'चैनल सब्सक्राइब करो'}}
};
const SE=window.SE={scenes:[],sel:0,msg:''};
SE.apply=(k)=>apply(k);
SE.render=()=>render(); // C52: timeline se scene chunne par panel refresh
const clone=o=>JSON.parse(JSON.stringify(o));
function save(){try{localStorage.setItem(keyOf(),JSON.stringify(SE.scenes));}catch(e){}}

async function apply(keepT){
  const t=SE.P.t;C.setScenes(SE.scenes);
  await C.preload(SE.scenes);
  SE.P.seek(keepT?Math.min(t,C.total-.1):0);
  const i=document.getElementById('info');if(i)i.textContent='Ready — '+SE.scenes.length+' scenes, '+C.total.toFixed(1)+'s';
  save();render();
}
function seekTo(i){SE.P.seek((C.starts[i]||0)+0.05);}
function el(tag,css,txt){const e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e;}
function btn(txt,fn,bg){const b=el('button','padding:4px 9px;font-size:13px;margin:2px;background:'+(bg||'#444'),txt);b.onclick=fn;return b;}

// ---- photo helpers (C15): har scene mein kaunsi photo chahiye (naam ke saath), upload yahin se, library se reuse ----
const PH=()=>window.PHOTOS;
const have=id=>!!(id&&C.photos[id]);
function refsOf(sc){const d=sc.data||(sc.data={}),r=[];
  if(sc.type==='stat'||sc.type==='retain')r.push({get:()=>d.photo||'',set:v=>{d.photo=v;},hint:sc.type==='retain'?d.name:d.head});
  if(Array.isArray(d.photos))d.photos.forEach((_,k)=>r.push({get:()=>d.photos[k]||'',set:v=>{d.photos[k]=v;},hint:(d.names&&d.names[k])||'',k}));
  return r;}
function thumb(id){const t=el('div','width:34px;height:42px;background:#333;border-radius:3px;flex:none;background-size:cover;background-position:top');
  const im=have(id)&&C.photos[id];if(im&&im.src)t.style.backgroundImage='url('+im.src+')';return t;}
function uploadBtn(label,getId,ref){const up=el('label','background:#2a6;padding:5px 9px;border-radius:5px;cursor:pointer;font-size:13px',label);
  const fi=el('input');fi.type='file';fi.accept='image/*';fi.style.display='none';
  fi.onchange=async()=>{const f=fi.files[0];if(!f)return;try{let sid=getId();
    if(!sid){const nm=prompt('Is photo ka naam likho (player ya type), jaise: रोहित शर्मा / स्टेडियम भीड़','');if(!nm)return;sid=PH().addCustom(nm);if(ref)ref.set(sid);}
    await PH().set(sid,f);await apply(true);}catch(e){alert('Photo error: '+e.message);}};
  up.appendChild(fi);return up;}
function picker(ref,idx){
  const row=el('div','display:flex;align-items:center;gap:6px;margin:4px 0;flex-wrap:wrap');
  const id=ref.get();row.appendChild(thumb(id));
  const sel=el('select','max-width:240px;font-size:13px;padding:4px');
  const o0=el('option',null,'— photo chuno / naam —');o0.value='';sel.appendChild(o0);
  const S=PH().slots(),groups={};S.forEach(x=>{(groups[x.city]=groups[x.city]||[]).push(x);});
  const keys=Object.keys(groups).sort((a,b)=>(a==='custom'?0:1)-(b==='custom'?0:1));
  keys.forEach(c=>{const g=el('optgroup');g.label=PH().cityHi(c);groups[c].forEach(x=>{const o=el('option',null,(have(x.id)?'✓ ':'✗ ')+x.hi+(x.en?' · '+x.en:''));o.value=x.id;g.appendChild(o);});sel.appendChild(g);});
  if(id&&!S.find(x=>x.id===id)){const o=el('option',null,id);o.value=id;sel.appendChild(o);}
  sel.value=id;sel.onchange=()=>{ref.set(sel.value);apply(true);};
  row.appendChild(sel);
  row.appendChild(el('span','font-size:12px;color:'+(have(id)?'#6c6':'#f96'),id?(have(id)?'✓ photo hai':'✗ photo upload karo'):'photo chuno'));
  row.appendChild(uploadBtn(have(id)?'बदलो':'अपलोड',()=>ref.get(),ref));
  if(ref.hint)row.appendChild(el('span','font-size:12px;opacity:.7','('+ref.hint+')'));
  return row;}
function summary(){
  const need={},empty=[];
  SE.scenes.forEach((sc,i)=>refsOf(sc).forEach(r=>{const id=r.get();if(id){(need[id]=need[id]||[]).push(i+1);}else empty.push({i:i+1,type:sc.type,hint:r.hint});}));
  const ids=Object.keys(need),missing=ids.filter(x=>!have(x));
  const box2=el('div','background:#222;border-radius:6px;padding:6px;margin-bottom:8px;font-size:13px');
  box2.appendChild(el('b',null,'📷 Is video ke liye photos: '+(ids.length-missing.length)+'/'+ids.length+' taiyar'+(empty.length?' · '+empty.length+' scene mein photo chuni nahi':'')));
  missing.forEach(id=>{const r=el('div','display:flex;align-items:center;gap:6px;margin-top:4px');r.appendChild(thumb(id));
    r.appendChild(el('span','flex:1;color:#f96','✗ '+PH().label(id)+'  (scene '+need[id].join(', ')+')'));r.appendChild(uploadBtn('अपलोड',()=>id,null));box2.appendChild(r);});
  empty.forEach(e=>box2.appendChild(el('div','margin-top:4px;color:#fc3','• Scene '+e.i+' ('+e.type+'): photo chuno'+(e.hint?' — '+e.hint:''))));
  const okIds=ids.filter(have);if(okIds.length)box2.appendChild(el('div','margin-top:4px;opacity:.7','✓ '+okIds.map(x=>PH().label(x)).join(', ')));
  if(!ids.length&&!empty.length)box2.appendChild(el('div','opacity:.7','Is video ke scenes mein photo slot nahi hai.'));
  sumEl&&(sumEl.textContent='🎬 Scenes'+(missing.length+empty.length?'  ·  📷 '+(missing.length+empty.length)+' photo baaki':''));
  return box2;}
let box,sumEl;
function render(){
  if(!box)return;box.innerHTML='';
  // add row
  const add=el('div','margin-bottom:8px');
  const sel=el('select','font-size:14px;padding:4px');types().forEach(t=>{const o=el('option',null,t);o.value=t;sel.appendChild(o);});
  add.appendChild(sel);
  add.appendChild(btn('+ Scene jodo',()=>{const d=clone(DEF[sel.value]);SE.scenes.push({type:sel.value,dur:d.dur,tr:SE.scenes.length?'grunge':undefined,trDur:.7,data:d.data});SE.sel=SE.scenes.length-1;apply(false).then(()=>seekTo(SE.sel));},'#e11'));
  add.appendChild(btn('⬆ JSON save',()=>{const a=el('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(SE.scenes,null,1)],{type:'application/json'}));a.download='scenes.json';a.click();}));
  const fi=el('input');fi.type='file';fi.accept='.json';fi.id='se_json';fi.style.display='none';
  fi.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(!Array.isArray(j))throw new Error('array chahiye');const rp=window.SCHK?SCHK.report(j):null;if(rp&&!rp.ok){SE.msg='⬇ Load nahi hua (error hain):\n'+rp.text;render();return;}SE.scenes=j;SE.sel=0;await apply(false);if(rp){SE.msg=rp.text;render();}}catch(err){alert('JSON error: '+err.message);}};
  add.appendChild(btn('⬇ JSON load',()=>fi.click()));add.appendChild(fi);
  add.appendChild(btn('Sab hatao',()=>{if(confirm('Sab scenes hata dun?')){SE.scenes=[];SE.sel=0;C.setScenes([]);save();render();SE.P.draw();}}));
  add.appendChild(btn('🎙 Chunk baanto',async()=>{const r=FIT.autoAssign();SE.msg=r.msg;await apply(true);SE.msg=r.msg;render();},'#2a6'));
  add.appendChild(btn('⏱ Audio ke hisaab se fit',async()=>{const r=FIT.run();SE.msg=r.msg;if(r.ok){await apply(true);SE.msg=r.msg+'\nVideo '+C.total.toFixed(1)+'s ↔ audio '+r.audioEnd.toFixed(1)+'s';}render();},'#2a6'));
  add.appendChild(btn('✔ JSON check',()=>{const r=window.SCHK?SCHK.report(SE.scenes):{text:'checker load nahi hua'};SE.msg=r.text;render();},'#2a6'));
  box.appendChild(add);
  box.appendChild(el('div','font-size:12px;opacity:.7;margin-bottom:6px','Har scene mein "Chunk" number do = kaun si voice-over file (🎚 Audio tracks ki n-th) us scene ke saath chalegi. Pehle audio lagao, phir ⏱ fit dabao.'));
  if(SE.msg)box.appendChild(el('div','font-size:13px;padding:6px 8px;margin-bottom:6px;background:#1d2b1d;border-radius:5px;white-space:pre-wrap',SE.msg));
  box.appendChild(summary());
  SE.scenes.forEach((sc,i)=>{
    const row=el('div','border:1px solid '+(i===SE.sel?'#e11':'#444')+';border-radius:6px;padding:6px;margin-bottom:6px;background:#1a1a1a');
    const top=el('div','display:flex;flex-wrap:wrap;align-items:center;gap:4px');
    top.appendChild(el('b','min-width:90px',(i+1)+'. '+sc.type));
    top.appendChild(el('span','font-size:12px',(C.starts[i]||0).toFixed(1)+'s'));
    if(sc.chunk)top.appendChild(el('span','font-size:12px;color:#6cf;margin:0 4px','🎙'+sc.chunk));
    top.appendChild(btn('▶',()=>{SE.sel=i;seekTo(i);render();}));
    top.appendChild(btn('↑',()=>move(i,-1)));top.appendChild(btn('↓',()=>move(i,1)));
    top.appendChild(btn('⧉',()=>{SE.scenes.splice(i+1,0,clone(sc));SE.sel=i+1;apply(true);}));
    top.appendChild(btn('✕',()=>{SE.scenes.splice(i,1);SE.sel=Math.max(0,i-1);apply(true);},'#822'));
    row.appendChild(top);
    if(i===SE.sel){
      const f=el('div','margin-top:6px;font-size:13px');
      const num=(lab,val,fn,step)=>{const l=el('label','margin-right:10px',lab+' ');const n=el('input','width:60px');n.type='number';n.step=step||.1;n.value=val;n.onchange=()=>{fn(parseFloat(n.value)||0);apply(true);};l.appendChild(n);return l;};
      f.appendChild(num('Dur(s)',sc.dur,v=>sc.dur=Math.max(.5,v)));
      f.appendChild(num('Chunk',sc.chunk||'',v=>{if(v>=1)sc.chunk=Math.round(v);else delete sc.chunk;},1));
      if(i>0){const l=el('label','margin-right:10px','Transition ');const s=el('select');TRS.forEach(t=>{const o=el('option',null,t);o.value=t;if((sc.tr||'cut')===t)o.selected=true;s.appendChild(o);});s.onchange=()=>{sc.tr=s.value;apply(true);};l.appendChild(s);f.appendChild(l);f.appendChild(num('trDur',sc.trDur!=null?sc.trDur:.5,v=>sc.trDur=Math.max(0,v)));}
      const rs=refsOf(sc);
      if(rs.length||sc.type==='watch'||sc.type==='rumour'){const pb=el('div','margin-top:6px;border-top:1px solid #333;padding-top:4px');pb.appendChild(el('b',null,'📷 Photos (is scene ke liye)'));
        rs.forEach(r=>pb.appendChild(picker(r)));
        if(Array.isArray(sc.data.photos)){pb.appendChild(btn('+ photo',()=>{sc.data.photos.push('');apply(true);}));if(sc.data.photos.length)pb.appendChild(btn('− photo',()=>{sc.data.photos.pop();apply(true);}));}
        f.appendChild(pb);}
      const ta=el('textarea','width:100%;height:150px;margin-top:6px;background:#000;color:#9f9;font-family:monospace;font-size:12px');
      ta.value=JSON.stringify(sc.data,null,1);f.appendChild(ta);
      const er=el('div','color:#f66;font-size:12px');f.appendChild(er);
      f.appendChild(btn('Data lagao',()=>{try{sc.data=JSON.parse(ta.value);er.textContent='';apply(true);}catch(e){er.textContent='JSON galat: '+e.message;}},'#e11'));
      row.appendChild(f);
    } else row.onclick=e=>{if(e.target.tagName==='BUTTON')return;SE.sel=i;render();};
    box.appendChild(row);
  });
  if(!SE.scenes.length)box.appendChild(el('div','opacity:.7','Koi scene nahi. Upar se card type chun kar "+ Scene jodo" dabao.'));
}
function move(i,d){const j=i+d;if(j<0||j>=SE.scenes.length)return;const t=SE.scenes[i];SE.scenes[i]=SE.scenes[j];SE.scenes[j]=t;
  if(j===0)SE.scenes[0].trDur=0;SE.sel=j;apply(true);}
// C19: format badalna. Har format ke scenes alag save hote hain (cvt_scenes / cvt_scenes_short) — kuch lost nahi hota.
SE.loadFormat=(initial)=>{
  let s=null;try{s=JSON.parse(localStorage.getItem(keyOf())||'null');}catch(e){}
  SE.scenes=Array.isArray(s)?s:(initial?clone(initial):[]);SE.sel=0;SE.msg='';
};
SE.setFormat=async(name)=>{
  if(name===C.format)return;
  save();C.setFormat(name);SE.loadFormat(null);
  await apply(false);
};
SE.init=(P,initial)=>{
  SE.P=P;
  SE.loadFormat(initial);
  const wrap=document.getElementById('wrap');
  const det=el('details','margin-top:10px');sumEl=el('summary','cursor:pointer;font-size:16px','🎬 Scenes');det.appendChild(sumEl);
  if(window.PHOTOS){const old=PHOTOS.onChange;PHOTOS.onChange=sl=>{old&&old(sl);render();};}
  box=el('div','margin-top:6px');det.appendChild(box);wrap.appendChild(det);
  return apply(false);
};
})();
