// C196 (chunk 2): Background video. Full-canvas "backgrounds/" image ki jagah scene ka video frame (dim 0.2). title/retain/intro/clip par nahi.
// scene.data.bgv = loop ka naam (JSON mein save). Na ho to seed se deterministic pick. Video ready na ho to purani image (kabhi kaala nahi).
(function(){const C=window.CORE;if(!C)return;
const LIST=['01_foggy_stadium_floodlights_grass','02_golden_smoke_swirl','03_red_cricket_ball_closeup_dark','04_stadium_aerial_day_pitch','05_boundary_rope_grass_night','06_empty_red_seats_dark','07_stadium_dusk_floodlights_wide','08_pitch_stumps_misty_night','09_broken_stumps_bokeh_grass','10_cracked_dry_ground_closeup','11_dugout_empty_stands','12_stadium_hologram_grid_gold','13_city_skyline_stadium_night','14_floodlight_towers_dusk_sky','15_bokeh_lights_blurred','16_pavilion_building_windows_night','17_spotlight_beams_smoke','18_rainy_ground_floodlights_bokeh','19_scoreboard_blurred_smoke','20_golden_light_burst_particles','21_highway_traffic_to_stadium_night','22_cricket_ball_cracked_pitch_day','23_empty_blue_seats_rows_night','24_purple_gold_light_streaks','25_spotlight_stadium_wet_grass','26_practice_nets_foggy_morning','27_blue_bokeh_smoke','28_smoke_over_grass_night_cinematic','29_stadium_crowd_golden_lights','30_dark_smoke_plume_gold','31_dark_dotted_lights_texture','32_stumps_explosion_ball_slowmo','33_dry_cracked_grass_patch_day','34_stadium_floodlights_dust_dusk','35_floodlight_panel_stands_amber','36_wet_reflections_rain_bokeh','37_roller_dust_ball_golden_drip','38_torn_paper_stadium_outline','39_stadium_lights_over_grass','40_stands_glide_tunnel','41_floodlights_stadium','42_aerial_stadium','43_ball_on_grass'];
const NO={title:1,retain:1,intro:1,clip:1},DIM=.2;
const B=window.BGV={list:LIST,base:'assets/bgvideo/',src:f=>(window.BGU&&BGU.src(f))||B.base+f+'.mp4',S:{mode:'mix',one:'',seed:1,mine:false}};
try{const j=JSON.parse(localStorage.getItem('cvt_bgv')||'null');if(j&&typeof j==='object')Object.assign(B.S,j);else B.S.seed=1+Math.floor(Math.random()*1e6);}catch(e){}
B.save=()=>{try{localStorage.setItem('cvt_bgv',JSON.stringify(B.S));}catch(e){}};
B.save();
const hash=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
B.norm=x=>{const s=String(x==null?'':x).replace(/\.mp4$/i,'').trim();if(!s)return null;if(LIST.indexOf(s)>=0)return s;const m=s.match(/^(\d{1,2})(_|$)/);if(m){const p=('0'+m[1]).slice(-2)+'_';return LIST.find(n=>n.indexOf(p)===0)||null;}return null;};
const V={};
function get(name){if(V[name])return V[name];const v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;v.preload='auto';
  const o=V[name]={name,v,cv:document.createElement('canvas'),has:false,bad:false,lastT:-1,lastT2:-1};o.cx=o.cv.getContext('2d');
  v.addEventListener('error',()=>{o.bad=true;});
  v.addEventListener('seeked',()=>{if(!C.playing&&!C.exporting)redraw();});
  v.src=B.src(name);try{v.load();}catch(e){}
  if(window.BGU&&BGU.is(name)){const v2=o.v2=document.createElement('video');v2.muted=true;v2.defaultMuted=true;v2.playsInline=true;v2.loop=true;v2.preload='auto';v2.addEventListener('seeked',()=>{if(!C.playing&&!C.exporting)redraw();});v2.src=v.src;try{v2.load();}catch(e){}}
  return o;}
let rq=0;function redraw(){if(rq)return;rq=requestAnimationFrame(()=>{rq=0;try{window.PLAYER&&PLAYER.draw();}catch(e){}});}
// ---------- kaunsa video kis scene ko ----------
let cache={k:'',a:[]};
const autoL=()=>{const U=window.BGU;return(B.S.mine&&U&&U.items.length)?U.names():LIST;};
function chain(){const n=C.scenes.length,AL=autoL(),k=B.S.seed+':'+n+':'+AL.length+':'+(B.S.mine?1:0);if(cache.k===k)return cache.a;const a=[],L=AL.length;let prev=-1;
  for(let i=0;i<n;i++){let h=hash(B.S.seed+'_'+i)%L;if(L>1&&h===prev)h=(h+1+hash(B.S.seed+'x'+i)%(L-1))%L;a.push(h);prev=h;}cache={k,a};return a;}
B.nameOf=function(sc,i){if(!sc||NO[sc.type]||B.S.mode==='off')return null;const d=sc.data||{};
  if(B.S.mode==='one'){return B.norm(B.S.one)||autoL()[chain()[0]||0];}
  if(d.bgv==='off')return null;const n=B.norm(d.bgv);if(n)return n;const AL=autoL();return AL[chain()[i]%AL.length];};
function activeNames(t){const a=[];(C.scenes||[]).forEach((sc,i)=>{if(t>=C.starts[i]&&t<C.starts[i]+sc.dur){const n=B.nameOf(sc,i);if(n&&a.indexOf(n)<0)a.push(n);}});return a;}
const wantT=(o,t)=>{const d=o.v.duration;if(!(d>0))return 0;const off=(hash(o.name)%1000)/1000*d;return Math.min(d-.05,(((t+off)%d)+d)%d);};
const circ=(a,b,d)=>{const x=Math.abs(a-b)%d;return Math.min(x,d-x);};
// ---------- frame canvas (render se PEHLE copy: elem_edit ka drawImage wrap bogus hit na banaye) ----------
function refresh(names){names.forEach(n=>{const o=V[n];if(!o||o.bad)return;const v=o.v,v2=o.v2;if(v.readyState<2||!v.videoWidth)return;
  const t2=(v2&&v2.readyState>=2)?v2.currentTime:-1;
  if(v.currentTime===o.lastT&&t2===o.lastT2&&o.has)return;
  const cw=Math.min(v.videoWidth,1280),ch=Math.round(v.videoHeight*cw/v.videoWidth);
  if(o.cv.width!==cw||o.cv.height!==ch){o.cv.width=cw;o.cv.height=ch;}
  try{const d=v.duration,a=(t2>=0&&d>0)?Math.max(0,Math.min(1,Math.min(v.currentTime,d-v.currentTime)/BGU.FADE)):1;
    o.cx.globalAlpha=1;if(a<1)o.cx.drawImage(v2,0,0,cw,ch);
    if(a>0){o.cx.globalAlpha=a;o.cx.drawImage(v,0,0,cw,ch);}
    o.cx.globalAlpha=1;o.cx.fillStyle='rgba(0,0,0,'+DIM+')';o.cx.fillRect(0,0,cw,ch);o.has=true;o.lastT=v.currentTime;o.lastT2=t2;}catch(e){}});}
// ---------- scene context ----------
const stk=[];
function wrapCards(){Object.keys(C.CARDS).forEach(k=>{const cd=C.CARDS[k];if(!cd||cd._bgv||!cd.draw)return;cd._bgv=1;const d0=cd.draw;
  cd.draw=function(ctx,lt,data,sc){stk.push(sc&&sc.type?sc:stk[stk.length-1]);try{return d0.apply(this,arguments);}finally{stk.pop();}};});}
const imgKey=new WeakMap();
function isBg(im){if(imgKey.has(im))return imgKey.get(im);let r=false;for(const k in C.images){if(C.images[k].im===im){r=k.indexOf('backgrounds/')>=0;break;}}imgKey.set(im,r);return r;}
const V1=C.cover;
C.cover=function(ctx,im,x,y,w,h,z,px,py){const sc=stk[stk.length-1];
  if(im&&sc&&x<=.5&&y<=.5&&x+w>=C.W-.5&&y+h>=C.H-.5&&isBg(im)){const n=B.nameOf(sc,C.scenes.indexOf(sc)),o=n&&V[n];
    if(o&&o.has&&!o.bad){try{o.cv.src=im.src;}catch(e){}return V1.call(C,ctx,o.cv,x,y,w,h,z,px,py);}}
  return V1.apply(C,arguments);};
// ---------- preview sync ----------
function sync(t){const act=activeNames(t),used={};
  act.forEach(n=>{const o=get(n);used[n]=1;if(o.bad)return;const v=o.v;if(v.readyState<1)return;const d=v.duration,w=wantT(o,t);
    if(C.playing){if(v.paused){try{v.currentTime=w;}catch(e){}v.play().catch(()=>{});}else if(circ(v.currentTime,w,d)>.35){try{v.currentTime=w;}catch(e){}}}
    else{if(!v.paused)v.pause();if(circ(v.currentTime,w,d)>.06){try{v.currentTime=w;}catch(e){}}}
    const v2=o.v2;if(v2&&v2.readyState>=1){const w2=(w+d/2)%d;
      if(C.playing){if(v2.paused){try{v2.currentTime=w2;}catch(e){}v2.play().catch(()=>{});}else if(circ(v2.currentTime,w2,d)>.35){try{v2.currentTime=w2;}catch(e){}}}
      else{if(!v2.paused)v2.pause();if(circ(v2.currentTime,w2,d)>.06){try{v2.currentTime=w2;}catch(e){}}}}});
  Object.keys(V).forEach(k=>{if(!used[k]){if(!V[k].v.paused)V[k].v.pause();if(V[k].v2&&!V[k].v2.paused)V[k].v2.pause();}});return act;}
const R0=C.render,cvEl=()=>document.getElementById('cv');
C.render=function(ctx,t){wrapCards();
  if(C.exporting)refresh(activeNames(t));
  else if(ctx&&ctx.canvas===cvEl())refresh(sync(t));
  return R0.apply(this,arguments);};
// ---------- export: har frame se pehle exact seek ----------
const seekTo=(v,t)=>new Promise(res=>{if(Math.abs(v.currentTime-t)<.001&&v.readyState>=2){res();return;}let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('seeked',f);res();};v.addEventListener('seeked',f);try{v.currentTime=t;}catch(e){f();}setTimeout(f,1500);});
const waitMeta=o=>new Promise(res=>{if(o.v.readyState>=1||o.bad){res();return;}const i=setInterval(()=>{if(o.v.readyState>=1||o.bad){clearInterval(i);res();}},30);setTimeout(()=>{clearInterval(i);res();},5000);});
const bf0=C.beforeFrame;
C.beforeFrame=async function(t){if(bf0)await bf0.call(C,t);
  Object.keys(V).forEach(k=>{if(!V[k].v.paused)V[k].v.pause();if(V[k].v2&&!V[k].v2.paused)V[k].v2.pause();});
  for(const n of activeNames(t)){const o=get(n);if(o.bad)continue;await waitMeta(o);if(o.bad||o.v.readyState<1)continue;const w=wantT(o,t);await seekTo(o.v,w);
    if(o.v2){await waitMeta({v:o.v2});if(o.v2.readyState>=1)await seekTo(o.v2,(w+o.v.duration/2)%o.v.duration);}}};
// ---------- preload: scenes ke video bana lo (zyada der nahi rukte) ----------
const P0=C.preload;
C.preload=async function(scenes,onProg){const r=await P0.call(C,scenes,onProg);
  try{const set={};(scenes||[]).forEach((sc,i)=>{const n=B.nameOf(sc,i);if(n)set[n]=1;});
    const ks=Object.keys(V);if(ks.length>14)ks.forEach(k=>{if(!set[k]){try{V[k].v.removeAttribute('src');V[k].v.load();if(V[k].v2){V[k].v2.removeAttribute('src');V[k].v2.load();}}catch(e){}delete V[k];}});
    const ps=Object.keys(set).map(n=>{const o=get(n);return new Promise(res=>{if(o.v.readyState>=2||o.bad){res();return;}o.v.addEventListener('loadeddata',res,{once:true});o.v.addEventListener('error',res,{once:true});});});
    await Promise.race([Promise.all(ps),new Promise(r=>setTimeout(r,3000))]);}catch(e){}
  return r;};

// ---------- C196 chunk 3: UI (Look tab, #quick) + style pools ----------
const $=id=>document.getElementById(id);
const lab=n=>{const U=window.BGU,it=U&&U.items.find(x=>x.name===n);return it?'👤 '+it.label:n.slice(0,2)+' · '+n.slice(3).replace(/_/g,' ');};
const minePool=()=>{const U=window.BGU;return(B.S.mine&&U&&U.items.length)?U.names():null;};
const num=a=>a.map(k=>LIST[k-1]);
const POOL={night:num([1,5,6,8,18,25,28,16,36,41,35]),gold:num([2,7,14,29,20,30,34,42]),clean:num([4,22,26,33,10,39,43,40]),grunge:num([3,9,32,19,10,11,17,37]),navy:num([23,27,15,13,16,40,42]),purple:num([24,31,15,20]),studio:num([17,19,12,25,31,38,35])};
B.POOL=POOL;
const elig=()=>(window.SE?SE.scenes:[]).filter(sc=>!NO[sc.type]);
const say=t=>{const e=$('lk_msg');if(e)e.textContent=t;};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function assign(pool){const sc=elig();if(!sc.length||B.S.mode==='off')return '';
  if(B.S.mode==='one'){let c=pool.filter(x=>x!==B.norm(B.S.one));const n=rnd(c.length?c:pool);B.S.one=n;B.save();sc.forEach(x=>{(x.data||(x.data={})).bgv=n;});return 'BG video: '+lab(n);}
  const used={};let prev='',set={};sc.forEach(x=>{let c=pool.filter(n=>n!==prev);if(!c.length)c=pool.slice();const mn=Math.min.apply(null,c.map(n=>used[n]||0));c=c.filter(n=>(used[n]||0)===mn);const n=rnd(c);used[n]=(used[n]||0)+1;prev=n;set[n]=1;(x.data||(x.data={})).bgv=n;});
  return 'BG video: mix ('+Object.keys(set).length+' alag)';}
B.assign=assign;
B.reroll=async function(){if(!window.SE||!SE.scenes.length)return 'Pehle scenes lao';if(B.S.mode==='off')return 'BG video OFF hai — pehle MIX ya EK HI';
  const L=window.LOOKSET,pool=minePool()||(L&&L.cur&&POOL[L.cur])||LIST;B.S.seed=1+Math.floor(Math.random()*1e6);B.save();const m=assign(pool);await SE.apply(true);return '🎲 '+m;};
function ui(){const q=$('quick');if(!q||!window.SE||!window.PLAYER)return false;if($('bgv_mode'))return true;
  const MN={mix:'MIX',one:'EK HI',off:'OFF'},bm=document.createElement('button');bm.id='bgv_mode';bm.style.background='#0e7490';
  const paint=()=>{bm.textContent='🎞 BG video: '+MN[B.S.mode];};paint();
  bm.onclick=async()=>{const o=['mix','one','off'];B.S.mode=o[(o.indexOf(B.S.mode)+1)%3];
    if(B.S.mode==='one'){const n=B.norm(B.S.one)||rnd(LIST);B.S.one=n;elig().forEach(x=>{(x.data||(x.data={})).bgv=n;});}
    B.save();paint();await SE.apply(true);say('🎞 BG video: '+MN[B.S.mode]+(B.S.mode==='one'?' ('+lab(B.S.one)+')':''));};
  const br=document.createElement('button');br.id='bgv_roll';br.textContent='🎲 BG badlo';br.style.background='#0e7490';
  br.onclick=async()=>{br.disabled=true;try{say(await B.reroll());}catch(e){say('BG error: '+e.message);}br.disabled=false;};
  const sel=document.createElement('select');sel.id='bgv_sel';sel.style.cssText='background:#3a4250;color:#fff;border:0;border-radius:8px;padding:7px 10px;font-size:13px;font-family:inherit;max-width:100%';
  const o0=document.createElement('option');o0.value='';o0.textContent='🎞 BG: auto (is scene ka)';sel.appendChild(o0);
  LIST.forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=lab(n);sel.appendChild(o);});
  sel.onchange=async()=>{const v=sel.value,sc=SE.scenes[SE.sel];if(B.S.mode==='off'){say('BG video OFF hai — pehle MIX ya EK HI');return;}
    if(B.S.mode==='one'){if(!v)return;B.S.one=v;B.save();elig().forEach(x=>{(x.data||(x.data={})).bgv=v;});}
    else{if(!sc||NO[sc.type]){say('Is scene par BG video nahi lagta (title/retain/intro/clip).');return;}const d=sc.data||(sc.data={});if(v)d.bgv=v;else delete d.bgv;}
    await SE.apply(true);say('🎞 BG: '+(v?lab(v):'auto'));};
  [bm,br,sel].forEach(e=>q.appendChild(e));
  // C202: PC se apne BG videos
  const fi=document.createElement('input');fi.type='file';fi.id='bgv_file';fi.accept='video/*,.mp4,.webm,.mov,.m4v,.mkv';fi.multiple=true;fi.style.display='none';
  const ba=document.createElement('button');ba.id='bgv_add';ba.textContent='➕ Apne BG video (PC se)';ba.style.background='#7c3aed';ba.onclick=()=>fi.click();
  fi.onchange=async()=>{const fs=Array.from(fi.files||[]);fi.value='';if(!fs.length)return;ba.disabled=true;try{say(await B.addFiles(fs));}catch(e){say('BG add error: '+e.message);}ba.disabled=false;};
  const bn=document.createElement('button');bn.id='bgv_mine';bn.style.background='#7c3aed';
  const paintM=()=>{bn.textContent='👤 Sirf mere BG: '+(B.S.mine?'ON':'OFF');};paintM();
  bn.onclick=async()=>{const U=window.BGU;if(!B.S.mine&&!(U&&U.items.length)){say('Pehle ➕ se apne video daalo');return;}B.S.mine=!B.S.mine;B.save();paintM();cache={k:'',a:[]};
    if(window.SE&&SE.scenes.length&&B.S.mode!=='off'){const m=assign(minePool()||LIST);await SE.apply(true);say('👤 '+(B.S.mine?'Sirf mere BG ON — ':'Sab BG — ')+m);}else say('👤 Sirf mere BG: '+(B.S.mine?'ON':'OFF'));};
  const bx=document.createElement('button');bx.id='bgv_clear';bx.textContent='🗑 Mere BG hatao';bx.style.background='#7c3aed';
  bx.onclick=async()=>{const U=window.BGU;if(!(U&&U.items.length)){say('Koi apna BG video nahi hai');return;}if(!confirm(U.items.length+' apne BG video hata du?'))return;
    await U.clear();B.S.mine=false;B.save();paintM();cache={k:'',a:[]};if(window.SE&&SE.scenes.length)await SE.apply(true);say('🗑 Apne BG video hata diye');};
  [fi,ba,bn,bx].forEach(e=>q.appendChild(e));
  setInterval(()=>{if(document.activeElement===sel)return;const sc=window.SE&&SE.scenes[SE.sel],d=sc&&sc.data;const n=d&&B.norm(d.bgv);const w=B.S.mode==='one'?B.norm(B.S.one)||'':(n||'');if(sel.value!==w)sel.value=w;paint();},600);
  return true;}
const ti=setInterval(()=>{if(ui())clearInterval(ti);},400);
// Naya Style / Style list: style ke Look ke hisaab se video pool
function hookStyle(){const SN=window.STYLENAMES;if(!SN||SN._bgv)return false;SN._bgv=1;const A0=SN.apply;
  SN.apply=async function(s,doVary){const m=await A0.call(SN,s,doVary);let bm='';
    try{if(B.S.mode!=='off'&&window.SE&&SE.scenes.length){bm=assign(minePool()||POOL[s.look]||LIST);await SE.apply(true);}}catch(e){bm='';}
    return m+(bm?' | '+bm:'');};return true;}
const th=setInterval(()=>{if(hookStyle())clearInterval(th);},300);

// ---------- C202: PC se apne videos (js/bg_user.js) — LIST + sab POOL mein auto jud jaate hain ----------
const BASE=LIST.length;
function fillSel(){const sel=$('bgv_sel');if(!sel)return;const cur=sel.value;while(sel.options.length>1)sel.remove(1);LIST.forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=lab(n);sel.appendChild(o);});sel.value=cur;}
function syncUser(){const U=window.BGU;if(!U)return;LIST.length=BASE;U.items.forEach(it=>LIST.push(it.name));
  Object.keys(POOL).forEach(k=>{POOL[k]=POOL[k].filter(n=>{const i=LIST.indexOf(n);return i>=0&&i<BASE;});U.items.forEach(it=>POOL[k].push(it.name));});
  if(!U.items.length&&B.S.mine){B.S.mine=false;B.save();}
  cache={k:'',a:[]};fillSel();redraw();}
B.syncUser=syncUser;
// naye videos: list mein jodo + scenes par auto set (mode OFF ho to MIX kar do)
B.addFiles=async function(files){const U=window.BGU;if(!U)return 'bg_user.js load nahi hua';
  say('⏳ '+files.length+' video check ho rahe...');const r=await U.add(files);syncUser();let msg='';
  if(r.added.length){const has=window.SE&&SE.scenes.length;
    if(B.S.mode==='off'){B.S.mode='mix';B.save();}
    if(B.S.mode==='one'){B.S.one=r.added[0];B.save();if(has)elig().forEach(x=>{(x.data||(x.data={})).bgv=r.added[0];});}
    else if(has)assign(r.added);
    if(has)await SE.apply(true);
    msg='✅ '+r.added.length+' BG video jude'+(has?' aur scenes par set ho gaye':' (scenes lao to apne aap lagenge)')+(U.persist?'':' — NOTE: is browser mein save nahi honge');}
  if(r.bad.length)msg+=(msg?' | ':'')+'❌ nahi jude: '+r.bad.join(', ');
  return msg||'Koi video nahi mila';};
if(window.BGU){BGU.on(syncUser);BGU.init().then(syncUser);}
})();
