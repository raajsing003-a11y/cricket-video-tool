// C32: Look presets + Auto-vary — har video ek jaisa na lage.
// Look = polish values + colour look + bars/progress ka ek bundle. Auto-vary = scenes ke bg + transition ghumata hai (pichli baar jaisa nahi).
// Text/facts ko nahi chhuta. Title/retain (team colour) aur intro (paper) ka bg nahi badalta.
(function(){
const C=window.CORE,$=id=>document.getElementById(id);
const BG='01_backgrounds/',GB='08_gemini_generated/backgrounds/';
const LOOKS={
 night:{n:'🌃 Night',polish:{vignette:.62,grain:.08,sweep:.06,leak:.14,smoke:.14,shake:1,dust:1},fx:{look:'night',bars:false,prog:false},
  bg:[BG+'bg_stadium_night_blur',GB+'bg_stadium_night_floodlights',GB+'bg_stadium_aerial_night',GB+'bg_floodlight_towers_dusk',GB+'bg_crowd_silhouette_blur',BG+'bg_floodlight_blue'],
  tr:['fade','zoom','iris','blurfade','push','lightwipe']},
 gold:{n:'🌇 Gold',polish:{vignette:.5,grain:.06,sweep:.1,leak:.3,smoke:.06,shake:.8,dust:1},fx:{look:'golden',bars:false,prog:false},
  bg:[GB+'bg_stadium_sunset_golden',GB+'bg_trophy_gold_generic_spotlight',BG+'bg_stadium_sunset_blur',GB+'bg_auction_hall_generic',GB+'bg_dressing_room_generic'],
  tr:['lightwipe','flash','zoom','fade','slideup','iris']},
 clean:{n:'🧼 Clean',polish:{vignette:.3,grain:.03,sweep:.03,leak:0,smoke:0,shake:.4,dust:0},fx:{look:'none',bars:false,prog:true},
  bg:[BG+'bg_navy_plain',BG+'bg_pitch_topview',GB+'bg_scoreboard_blank',GB+'bg_gear_flatlay_generic',BG+'bg_floodlight_blue'],
  tr:['cut','fade','push','blinds','slideup','tiles']},
 grunge:{n:'🔥 Grunge',polish:{vignette:.72,grain:.12,sweep:.05,leak:.3,smoke:.16,shake:1.5,dust:1},fx:{look:'vivid',bars:false,prog:false},
  bg:[BG+'bg_grunge_red_halftone',GB+'bg_rain_covers_pitch',GB+'bg_dressing_room_generic',GB+'bg_gear_flatlay_generic',GB+'bg_crowd_silhouette_blur'],
  tr:['grunge','glitch','whip','rgb','flash','spin']},
 navy:{n:'🌊 Navy Glow',polish:{vignette:.55,grain:.03,sweep:.03,leak:0,smoke:0,shake:.3,dust:0},fx:{look:'navy',bars:false,prog:false},
  bg:[BG+'bg_blue_radial_glow_dark',BG+'bg_blue_gradient_glow',BG+'bg_dark_gradient_blue_glow_bottom',BG+'bg_black_blue_gradient',BG+'bg_navy_plain',BG+'bg_blue_light_streaks_particles',BG+'bg_contour_bokeh_blue_wide'],
  tr:['fade','push','slideup','blurfade','zoom']},
 purple:{n:'🟣 Purple Glow',polish:{vignette:.6,grain:.03,sweep:.03,leak:0,smoke:0,shake:.3,dust:0},fx:{look:'purple',bars:false,prog:false},
  bg:[BG+'bg_black_blue_gradient',BG+'bg_dark_gradient_blue_glow_bottom',BG+'bg_blue_radial_glow_dark',BG+'bg_channel_stadium_blur_dark'],
  tr:['fade','push','slideup','blurfade','zoom']},
 studio:{n:'📺 Studio',polish:{vignette:.4,grain:.04,sweep:.08,leak:.05,smoke:.03,shake:.5,dust:0},fx:{look:'cinema',bars:true,prog:false},
  bg:[BG+'bg_news_control_room',GB+'bg_tv_news_studio_blank',GB+'bg_press_conference_generic',GB+'bg_scoreboard_blank',GB+'bg_auction_hall_generic'],
  tr:['push','blinds','slideup','fade','tiles','lightwipe']}
};
const L={LOOKS,cur:'',DEF:Object.assign({},C.POLISH)};
window.LOOKSET=L;
const has=k=>!window.MANIFEST||!!window.MANIFEST[k];
const poolBg=()=>{const ks=L.cur&&LOOKS[L.cur]?LOOKS[L.cur].bg:[].concat(...Object.values(LOOKS).map(x=>x.bg));return [...new Set(ks)].filter(has);};
const poolTr=()=>{const ks=L.cur&&LOOKS[L.cur]?LOOKS[L.cur].tr:[].concat(...Object.values(LOOKS).map(x=>x.tr));return [...new Set(ks)];};
const NOBG=['title','retain','intro']; // team colour / paper: bg nahi badalte

L.apply=function(k){
  L.cur=LOOKS[k]?k:'';
  const P=C.POLISH,FX=C.FX;
  if(L.cur){const l=LOOKS[k];Object.assign(P,l.polish);if(FX){Object.assign(FX,l.fx);FX.save&&FX.save();}}
  else Object.assign(P,L.DEF);
  try{localStorage.setItem('cvt_look',L.cur);}catch(e){}
  window.UI&&UI.syncFX&&UI.syncFX();
  window.PLAYER&&PLAYER.draw();
};

// history: pichli baar kaunse bg/tr lage (format ke hisaab se)
const HK='cvt_vary_hist';
const hget=()=>{try{return JSON.parse(localStorage.getItem(HK)||'{}')[C.format]||{bg:[],tr:[]};}catch(e){return{bg:[],tr:[]};}};
const hset=h=>{try{const a=JSON.parse(localStorage.getItem(HK)||'{}');a[C.format]=h;localStorage.setItem(HK,JSON.stringify(a));}catch(e){}};
// ek chunav: pichle scene jaisa nahi, pichli baar wala nahi (agar vikalp ho), is baar kam use hua
function pick(pool,prev,avoid,used){
  let c=pool.filter(x=>x!==prev);if(!c.length)c=pool.slice();
  const fresh=c.filter(x=>avoid.indexOf(x)<0);if(fresh.length)c=fresh;
  const mn=Math.min(...c.map(x=>used[x]||0));c=c.filter(x=>(used[x]||0)===mn);
  const r=c[Math.floor(Math.random()*c.length)];used[r]=(used[r]||0)+1;return r;
}
L.vary=async function(){
  const SE=window.SE;if(!SE||!SE.scenes.length)return 'Pehle scenes lao';
  const pb=poolBg(),pt=poolTr(),h=hget(),ub={},ut={},nb=[],nt=[];
  let prevBg='',prevTr='',nBg=0,nTr=0,nFl=0,flip=Math.random()<.5;
  SE.scenes.forEach((sc,i)=>{
    const d=sc.data||(sc.data={});
    if(NOBG.indexOf(sc.type)<0&&!d.city&&pb.length){const b=pick(pb,prevBg,h.bg,ub);d.bg=b;prevBg=b;nb.push(b);nBg++;}
    if(sc.type==='stat'||sc.type==='retain'||sc.type==='watch'){flip=!flip;d.flip=flip;nFl++;}
    if(sc.type==='hook'||sc.type==='title'){d.left=Math.random()<.5;nFl++;}
    if(sc.type==='anth'||sc.type==='intro'){d.flip=Math.random()<.5;nFl++;}
    if(sc.type==='rumour'){d.flip=Math.random()<.5;nFl++;}
    if(i>0&&pt.length){const t=pick(pt,prevTr,h.tr,ut);sc.tr=t;prevTr=t;nt.push(t);nTr++;if(sc.trDur==null||sc.trDur<=0||sc.trDur>=sc.dur)sc.trDur=Math.min(.6,Math.max(.3,sc.dur/3));}
  });
  hset({bg:[...new Set(nb)],tr:[...new Set(nt)]});
  await SE.apply(true);
  return nBg+' scene ka bg + '+nTr+' transition badla'+(nFl?', '+nFl+' card ka layout badla':'')+' ('+(L.cur?LOOKS[L.cur].n:'Mix')+'). Pasand na aaye to ↶ Undo ya dobara 🎲.';
};

function boot(){
  const q=$('quick');if(!q||!window.SE||!window.PLAYER)return false;
  const sel=document.createElement('select');sel.id='lk_sel';sel.style.cssText='background:#3a4250;color:#fff;border:0;border-radius:8px;padding:7px 10px;font-size:13px;font-family:inherit';
  const o0=document.createElement('option');o0.value='';o0.textContent='🎨 Look preset: koi nahi';sel.appendChild(o0);
  Object.keys(LOOKS).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent='🎨 '+LOOKS[k].n;sel.appendChild(o);});
  let saved='';try{saved=localStorage.getItem('cvt_look')||'';}catch(e){}
  sel.value=LOOKS[saved]?saved:'';
  sel.onchange=()=>L.apply(sel.value);
  const b=document.createElement('button');b.id='lk_vary';b.textContent='🎲 Auto-vary';b.style.background='#7a3fd0';
  const st=document.createElement('div');st.id='lk_msg';st.style.cssText='font-size:12px;opacity:.85;margin:4px 0;width:100%';
  b.onclick=async()=>{b.disabled=true;try{st.textContent=await L.vary();}catch(e){st.textContent='Auto-vary error: '+e.message;}b.disabled=false;};
  // C37: Standard intro (presenter scene) — ek baar save, har video mein ek click
  const SK='cvt_std_intro',bS=document.createElement('button'),bA=document.createElement('button');
  bS.textContent='⭐ Standard intro save';bA.textContent='🎬 Standard intro jodo';bS.style.background=bA.style.background='#3a4250';bA.style.background='#1f8f55';bS.id='lk_stdsave';bA.id='lk_stdadd';
  bS.onclick=()=>{const SE=window.SE,sc=SE.scenes[SE.sel];
    if(C.format!=='wide'){st.textContent='Standard intro sirf wide mode mein.';return;}
    if(!sc||sc.type!=='presenter'){st.textContent='Pehle wo presenter scene chuno (Scenes tab mein) jise standard banana hai.';return;}
    try{localStorage.setItem(SK,JSON.stringify({dur:sc.dur,data:sc.data}));st.textContent='Standard intro save ho gaya. Ab har video mein 🎬 dabao.';}catch(e){st.textContent='Save error: '+e.message;}};
  bA.onclick=async()=>{const SE=window.SE;
    if(window.STDB&&STDB.hasIntro()){st.textContent=await STDB.addIntroScene();return;}
    if(C.format!=='wide'){st.textContent='Standard intro sirf wide mode mein.';return;}
    if(SE.scenes.some(s=>s.type==='presenter')){st.textContent='Presenter intro pehle se hai.';return;}
    let sv=null;try{sv=JSON.parse(localStorage.getItem(SK)||'null');}catch(e){}
    const data=sv?sv.data:{channel:'99cricketnews',name:'Yuvraj Sisodiya',sub:'क्रिकेट की हर खबर',photos:[''],key:'auto',swap:1.4};
    const sc={type:'presenter',dur:sv?sv.dur:6,trDur:0,data:JSON.parse(JSON.stringify(data))};
    if(SE.scenes.length&&SE.scenes[0].chunk)sc.chunk=SE.scenes[0].chunk;
    // C38: pehle scene = "is video mein" teaser, uske BAAD standard intro, phir baaki video
    const pos=SE.scenes.length?1:0;
    SE.scenes.splice(pos,0,sc);const nx=SE.scenes[pos+1];
    if(nx&&nx.trDur===0&&!nx.tr)nx.tr='fade';
    if(nx)nx.trDur=nx.trDur||.6;
    if(pos&&!SE.scenes[pos].tr)SE.scenes[pos].tr='fade';SE.scenes[pos].trDur=SE.scenes[pos].trDur||.6;
    SE.sel=pos;await SE.apply(false);
    st.textContent=sv?'Standard intro teaser scene ke baad jud gaya.':'Presenter scene jud gaya (photos lagao, phir ⭐ save dabao).';};
  // C46: Like/Subscribe (video ke beech) + Comment/Like/Subscribe (aakhir) slides, ek click
  const bC=document.createElement('button');bC.id='lk_ctaadd';bC.textContent='📣 Like/Comment/Subscribe slides jodo';bC.style.background='#c0392b';
  bC.onclick=async()=>{const SE=window.SE;
    if(C.format!=='wide'){st.textContent='CTA slides sirf wide mode mein.';return;}
    if(SE.scenes.some(s=>s.type==='cta')){st.textContent='CTA slides pehle se hain.';return;}
    if(SE.scenes.length<3){st.textContent='Pehle video ke scenes banao/load karo, phir ye button.';return;}
    const mk=(mode,prev)=>{const sc={type:'cta',dur:mode==='end'?5:4,tr:'fade',trDur:.6,data:{mode}};if(prev&&prev.chunk)sc.chunk=prev.chunk;return sc;};
    const mid=Math.ceil(SE.scenes.length/2);                       // beech ke aas-paas
    SE.scenes.splice(mid,0,mk('like',SE.scenes[mid-1]));
    SE.scenes.push(mk('end',SE.scenes[SE.scenes.length-1]));
    SE.sel=mid;await SE.apply(false);
    st.textContent='2 CTA slides jude: beech mein (Like+Subscribe) aur aakhir mein (Like+Comment+Subscribe). Script ki CTA line ke saamne khiskao.';};
  // C66: punch-in zoom selector
  const zs=document.createElement('select');zs.id='lk_zoom';zs.style.cssText=sel.style.cssText;
  [['off','🔍 Zoom: band'],['soft','🔍 Zoom: halka'],['medium','🔍 Zoom: medium'],['strong','🔍 Zoom: tez']].forEach(a=>zs.add(new Option(a[1],a[0])));
  zs.value=window.PUNCH?PUNCH.level:'off';zs.onchange=()=>{PUNCH.set(zs.value);window.PLAYER&&PLAYER.draw();};
  // C67: Brand Kit — 3 slot (A/B/C): look + caption style/rang/shabd-highlight + zoom ek saath save/load
  const bk=document.createElement('select');bk.id='bk_slot';bk.style.cssText=sel.style.cssText;
  ['A','B','C'].forEach(x=>bk.add(new Option('🗂 Kit '+x,x)));
  const bkS=document.createElement('button'),bkL=document.createElement('button');bkS.id='bk_save';bkL.id='bk_load';
  bkS.textContent='💾 Kit save';bkL.textContent='📂 Kit lagao';bkS.style.background=bkL.style.background='#3a4250';
  const BKK=x=>'cvt_kit_'+x;
  bkS.onclick=()=>{const k={look:L.cur||'',zoom:window.PUNCH?PUNCH.level:'off'};
    if(window.CAP){k.cs=CAP.st.k;k.cc=CAP.st.c;k.wh=!!CAP.wh;k.pos=CAP.pos;}
    try{localStorage.setItem(BKK(bk.value),JSON.stringify(k));st.textContent='Kit '+bk.value+' save: '+(k.look&&LOOKS[k.look]?LOOKS[k.look].n:'koi look nahi')+(k.cs?' | caption '+CAP.STYLES[k.cs]+' ('+k.cc+')'+(k.wh?' + shabd highlight':''):'')+' | zoom '+k.zoom;}catch(e){st.textContent='Kit save error: '+e.message;}};
  bkL.onclick=()=>{let k=null;try{k=JSON.parse(localStorage.getItem(BKK(bk.value))||'null');}catch(e){}
    if(!k){st.textContent='Kit '+bk.value+' khaali hai. Pehle style set karke 💾 dabao.';return;}
    if(LOOKS[k.look]){L.apply(k.look);sel.value=k.look;}else{sel.value='';}
    if(window.CAP&&k.cs){CAP.setStyle(k.cs,k.cc);CAP.setWH(k.wh);if(k.pos){CAP.setPos(k.pos);CAP.syncPos&&CAP.syncPos();}CAP.syncSel&&CAP.syncSel();const wc=document.getElementById('capwh');if(wc)wc.checked=!!k.wh;}
    if(window.PUNCH&&k.zoom){PUNCH.set(k.zoom);zs.value=k.zoom;}
    window.PLAYER&&PLAYER.draw();st.textContent='Kit '+bk.value+' laga diya (look, caption, zoom). Bg/transition ke liye 🎲 Auto-vary alag se.';};
  // C72: Brand Kit file export/import — teeno kit (A/B/C) ek JSON file mein, dusre phone/laptop par le jaane ke liye
  const bkX=document.createElement('button'),bkI=document.createElement('button'),bkF=document.createElement('input');
  bkX.id='bk_export';bkI.id='bk_import';bkX.textContent='⬇ Kit file';bkI.textContent='⬆ Kit file kholo';bkX.style.background=bkI.style.background='#3a4250';
  bkF.type='file';bkF.accept='.json,application/json';bkF.style.display='none';bkF.id='bk_file';
  bkX.onclick=()=>{const o={app:'cricket_video_tool',kind:'brand_kit',v:1,kits:{}};
    ['A','B','C'].forEach(x=>{try{const k=JSON.parse(localStorage.getItem(BKK(x))||'null');if(k)o.kits[x]=k;}catch(e){}});
    if(!Object.keys(o.kits).length){st.textContent='Koi kit save nahi hai. Pehle 💾 Kit save karo.';return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,1)],{type:'application/json'}));a.download='brand_kit.json';
    document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
    st.textContent='brand_kit.json download hui ('+Object.keys(o.kits).join(', ')+'). Dusre device par ⬆ se kholo.';};
  bkI.onclick=()=>bkF.click();
  bkF.onchange=async()=>{const f=bkF.files&&bkF.files[0];bkF.value='';if(!f)return;
    try{const o=JSON.parse(await f.text());if(!o||o.kind!=='brand_kit'||!o.kits)throw new Error('ye Brand Kit file nahi hai');
      const done=[];['A','B','C'].forEach(x=>{const k=o.kits[x];if(k&&typeof k==='object'){
        const c={look:LOOKS[k.look]?k.look:'',zoom:(window.PUNCH&&PUNCH.AMP[k.zoom]!==undefined)?k.zoom:'off'};
        if(window.CAP&&CAP.STYLES[k.cs]&&CAP.COLORS[k.cc]){c.cs=k.cs;c.cc=k.cc;c.wh=!!k.wh;if(CAP.POS[k.pos])c.pos=k.pos;}
        localStorage.setItem(BKK(x),JSON.stringify(c));done.push(x);}});
      st.textContent=done.length?'Kit '+done.join(', ')+' load ho gaye (purane A/B/C badal gaye). Ab 📂 Kit lagao.':'File mein koi kit nahi mili.';
    }catch(e){st.textContent='Kit file error: '+e.message;}};
  // C64: 🎬 Naya Style — ek click mein look + caption style/rang + auto-vary; pichli baar wala nahi aata
  const bR=document.createElement('button');bR.id='lk_recipe';bR.textContent='🎬 Naya Style (ek click)';bR.style.background='#d0397a';
  bR.onclick=async()=>{bR.disabled=true;try{
    if(window.STYLENAMES){st.textContent=await STYLENAMES.random();bR.disabled=false;return;}
    let h={};try{h=JSON.parse(localStorage.getItem('cvt_recipe_hist')||'{}');}catch(e){}
    const pk=(arr,last)=>{const c=arr.filter(x=>x!==last);const l=c.length?c:arr;return l[Math.floor(Math.random()*l.length)];};
    const lk=pk(Object.keys(LOOKS),h.look),cs=window.CAP?pk(Object.keys(CAP.STYLES),h.cs):'',cc=window.CAP?pk(Object.keys(CAP.COLORS).filter(x=>x!=='white'),h.cc):'';
    L.apply(lk);sel.value=lk;
    if(window.PUNCH){const zl=pk(['off','soft','medium'],h.z);PUNCH.set(zl);zs.value=zl;h.zz=zl;}
    if(window.CAP){CAP.setStyle(cs,cc);CAP.syncSel&&CAP.syncSel();}
    try{localStorage.setItem('cvt_recipe_hist',JSON.stringify({look:lk,cs:cs,cc:cc,z:h.zz}));}catch(e){}
    const m=await L.vary();
    st.textContent='Naya style: '+LOOKS[lk].n+(cs?' | caption: '+CAP.STYLES[cs]+' ('+cc+')':'')+' | '+m;
    window.PLAYER&&PLAYER.draw();
  }catch(e){st.textContent='Style error: '+e.message;}bR.disabled=false;};
  q.appendChild(sel);q.appendChild(zs);q.appendChild(bk);q.appendChild(bkS);q.appendChild(bkL);q.appendChild(bkX);q.appendChild(bkI);q.appendChild(bkF);q.appendChild(bR);q.appendChild(b);q.appendChild(bA);q.appendChild(bC);q.appendChild(bS);q.appendChild(st);
  if(LOOKS[saved])L.apply(saved); // reload par wahi look
  return true;
}
const iv=setInterval(()=>{if(window.UI&&window.UI.syncFX&&C.ready&&boot())clearInterval(iv);},120);
})();
