// C18: scenes JSON validator. SCHK.check(scenes,env) -> {errors[],warns[]}; SCHK.report(...) -> text.
// env (optional): {slots:Set|Array of ids, have:fn(id), manifest:obj}. Browser mein apne aap window se leta hai.
(function(){
'use strict';
const S=window.SCHK={};
const WIDE=['hook','title','stat','retain','watch','rumour','anth','intro','presenter'];
const SHORT=['short_hook','short_stat','short_cta'];
const TYPES=WIDE.concat(SHORT);
const TRS=['cut','fade','grunge','zoom','whip','glitch','flash','slideup','push','iris','blinds','rgb','spin','lightwipe','tiles','blurfade'];
const CITIES=['bengaluru','chennai','delhi','gujarat','hyderabad','kolkata','lucknow','mumbai','punjab','rajasthan'];
const STAMPS=['retain','watch','rumour','official'],LTS=['red','blue','purple'];
const COMMON=['bg','ribbon'];
const KEYS={
 hook:['pre','big','to','dec','unit','post','shake','left'],
 title:['city','headline','sub','ticker','left'],
 stat:['photo','pre','prefix','to','dec','unit','big','head','sub','lt','tag','flip'],
 retain:['city','photo','name','amount','stamp','note','forceLabel','flip'],
 watch:['title','names','photos','note','city','flip'],
 rumour:['head','sub','photos','note','flip'],
 anth:['title','qs','cta','flip'],
 intro:['line1','line2','flip'],
 presenter:['channel','name','sub','photos','key','swap'],
 short_hook:['pre','big','to','dec','unit','post'],
 short_stat:['photo','pre','prefix','to','dec','unit','big','head','sub','lt','tag'],
 short_cta:['line1','line2','cta']};
// max chars (is se zyada ho to text chhota/kat sakta hai)
const MAXC={title:{headline:70,sub:60,ticker:140},hook:{pre:40,unit:20,post:80},stat:{pre:40,head:50,sub:60,unit:20},
 retain:{name:30,amount:20,note:80},watch:{title:30,note:80},rumour:{head:50,sub:60},anth:{title:60,cta:60},
 intro:{line1:50,line2:70},presenter:{channel:30,name:30,sub:50},
 short_hook:{pre:40,unit:20,post:80},short_stat:{pre:30,head:40,sub:50,unit:16},short_cta:{line1:60,line2:40,cta:30}};
const BAD_WORDS=/dream\s*11|dream11|fantasy|betting|\bbet\b|सट्टा|फैंटेसी|ड्रीम\s*11/i;
const SHORTS=/\b(MI|CSK|RCB|KKR|SRH|DC|PBKS|RR|GT|LSG)\b/;
const SOURCES=/(cricbuzz|espncricinfo|cricinfo|times of india|ndtv|hindustan times|india today|dainik|amar ujala|sportskeeda)/i;
const isStr=v=>typeof v==='string',isNum=v=>typeof v==='number'&&isFinite(v);

S.check=function(scenes,env){
  env=env||{};const E=[],W=[];
  const err=(i,m)=>E.push({i,m}),warn=(i,m)=>W.push({i,m});
  const man=env.manifest||window.MANIFEST||null;
  const slotSet=env.slots?new Set(env.slots):(window.PHOTOS&&PHOTOS.slots?new Set(PHOTOS.slots().map(x=>x.id)):null);
  const have=env.have||(id=>!!(window.CORE&&CORE.photos&&CORE.photos[id]));
  if(!Array.isArray(scenes)){err(0,'JSON array hona chahiye ([ {...}, {...} ]).');return {errors:E,warns:W};}
  if(!scenes.length)warn(0,'Koi scene nahi.');
  const fmt=env.format||(window.CORE&&window.CORE.format)||'wide';
  scenes.forEach((sc,k)=>{const t=sc&&sc.type;if(!TYPES.includes(t))return;
    if(fmt==='short'&&WIDE.includes(t))err(k+1,t+' wide (16:9) card hai — Short mode mein sirf '+SHORT.join(', ')+' chalte hain.');
    if(fmt==='wide'&&SHORT.includes(t))err(k+1,t+' Short (9:16) card hai — pehle \"📱 Short\" mode on karo.');});
  if(fmt==='short'){let tot=0;scenes.forEach(sc=>{if(sc&&isNum(sc.dur))tot+=sc.dur-(isNum(sc.trDur)?sc.trDur:0);});
    if(tot>60)warn(0,'Short '+tot.toFixed(0)+'s ka hai — 60s ke andar rakho (Shorts ke liye safe).');}
  let prevChunk=0;
  scenes.forEach((sc,k)=>{
    const i=k+1;
    if(!sc||typeof sc!=='object'||Array.isArray(sc)){err(i,'scene object nahi hai.');return;}
    const t=sc.type;
    if(!TYPES.includes(t)){err(i,'unknown type "'+t+'". Allowed: '+TYPES.join(', '));return;}
    const d=sc.data;
    if(!d||typeof d!=='object'||Array.isArray(d)){err(i,t+': "data" object chahiye.');return;}
    const L=t+' ';
    // timing
    if(!isNum(sc.dur))err(i,L+'"dur" number (seconds) chahiye.');
    else if(sc.dur<1.5)warn(i,L+'dur '+sc.dur+'s bahut chhota (kam se kam 1.5s rakho).');
    else if(sc.dur>30)warn(i,L+'dur '+sc.dur+'s bahut lamba (30s se kam rakho).');
    if(sc.tr!=null&&!TRS.includes(sc.tr))err(i,L+'unknown transition "'+sc.tr+'". Allowed: '+TRS.join(', '));
    if(sc.trDur!=null){if(!isNum(sc.trDur)||sc.trDur<0)err(i,L+'trDur number >= 0 chahiye.');else if(isNum(sc.dur)&&sc.trDur>sc.dur)err(i,L+'trDur dur se bada hai.');else if(sc.trDur>1.5)warn(i,L+'trDur '+sc.trDur+'s bahut lamba.');}
    if(sc.chunk!=null){const c=sc.chunk;
      if(!Number.isInteger(c)||c<1)err(i,L+'"chunk" 1,2,3... integer hona chahiye.');
      else{if(c<prevChunk)err(i,L+'chunk '+c+' pichle chunk '+prevChunk+' se chhota hai (badhte order mein).');prevChunk=Math.max(prevChunk,c);}}
    // unknown fields
    const okKeys=COMMON.concat(KEYS[t]);
    Object.keys(d).forEach(key=>{if(!okKeys.includes(key))warn(i,L+'unknown field "'+key+'" (card use nahi karega).');});
    // text length + banned stuff
    const mc=MAXC[t]||{};
    Object.keys(d).forEach(key=>{const v=d[key];const arr=Array.isArray(v)?v:[v];
      arr.forEach(x=>{if(!isStr(x))return;
        if(mc[key]&&x.length>mc[key])warn(i,L+'"'+key+'" lamba hai ('+x.length+' akshar, '+mc[key]+' tak rakho).');
        if(BAD_WORDS.test(x))err(i,L+'"'+key+'" mein fantasy/Dream11/betting jaisa shabd hai — nahi chalega.');
        if(SHORTS.test(x))warn(i,L+'"'+key+'" mein team ka short form hai — sheher ka naam likho.');
        if(SOURCES.test(x))warn(i,L+'"'+key+'" mein source ka naam hai — script/cards mein source naam nahi.');});});
    // bg
    if(d.bg!=null){if(!isStr(d.bg))err(i,L+'"bg" string (asset key) chahiye.');else if(man&&!(d.bg in man))err(i,L+'bg "'+d.bg+'" assets mein nahi hai.');}
    if(d.ribbon!=null&&typeof d.ribbon!=='boolean')warn(i,L+'"ribbon" true/false hona chahiye.');
    // photos
    const photo=(id,label)=>{
      if(id==null||id===''){warn(i,L+label+' khali hai — photo chuno/upload karo.');return;}
      if(!isStr(id)){err(i,L+label+' string (slot id) chahiye.');return;}
      if(id.indexOf('demo_')===0)return; // tool ke demo portraits
      if(slotSet&&!slotSet.has(id)){err(i,L+label+' unknown photo slot "'+id+'". Library ke slot id ya custom_<naam> chahiye.');return;}
      if(!have(id))warn(i,L+label+' "'+id+'" ki photo abhi upload nahi hui.');};
    const city=(req)=>{if(d.city==null||d.city===''){if(req)err(i,L+'"city" chahiye. Allowed: '+CITIES.join(', '));}else if(!CITIES.includes(d.city))err(i,L+'unknown city "'+d.city+'". Allowed: '+CITIES.join(', '));};
    const need=(key)=>{if(!isStr(d[key])||!d[key].trim())err(i,L+'"'+key+'" chahiye (text).');};
    const numOpt=(key,lo,hi)=>{if(d[key]!=null&&(!isNum(d[key])||d[key]<lo||d[key]>hi))err(i,L+'"'+key+'" number '+lo+'-'+hi+' chahiye.');};
    if(t==='hook'){
      if(d.big==null&&d.to==null)err(i,L+'"big" (text) ya "to" (count-up number) chahiye.');
      if(d.to!=null&&!isNum(d.to))err(i,L+'"to" number chahiye.');
      numOpt('dec',0,3);
    }
    if(t==='title'){city(true);need('headline');}
    if(t==='short_hook'){
      if(d.big==null&&d.to==null)err(i,L+'\"big\" (text) ya \"to\" (count-up number) chahiye.');
      if(d.to!=null&&!isNum(d.to))err(i,L+'\"to\" number chahiye.');
      numOpt('dec',0,3);
    }
    if(t==='short_stat'){
      photo(d.photo,'photo');need('head');
      if(d.big==null&&d.to==null)warn(i,L+'\"to\" ya \"big\" nahi hai — number nahi dikhega.');
      if(d.to!=null&&!isNum(d.to))err(i,L+'\"to\" number chahiye.');
      numOpt('dec',0,3);
      if(d.lt!=null&&!LTS.includes(d.lt))err(i,L+'\"lt\" '+LTS.join('|')+' mein se ek.');
    }
    if(t==='short_cta'){if(!(isStr(d.line1)&&d.line1.trim())&&!(isStr(d.line2)&&d.line2.trim()))err(i,L+'\"line1\" ya \"line2\" chahiye.');}
    if(t==='stat'){
      photo(d.photo,'photo');need('head');
      if(d.big==null&&d.to==null)warn(i,L+'"to" ya "big" nahi hai — number nahi dikhega.');
      if(d.to!=null&&!isNum(d.to))err(i,L+'"to" number chahiye.');
      numOpt('dec',0,3);
      if(d.lt!=null&&!LTS.includes(d.lt))err(i,L+'"lt" '+LTS.join('|')+' mein se ek.');
    }
    if(t==='retain'){
      city(true);photo(d.photo,'photo');need('name');
      if(d.stamp!=null){const s=String(d.stamp).toLowerCase();
        if(s==='release')err(i,L+'RELEASE stamp official list tak allowed nahi.');
        else if(!STAMPS.includes(s))err(i,L+'unknown stamp "'+d.stamp+'". Allowed: '+STAMPS.join(', '));
        else if(s==='official')warn(i,L+'"official" stamp tabhi lagao jab ye official list se confirm ho.');}
      if(d.label===false||d.noLabel||d.hideLabel)err(i,L+'"संभावित: ऑफिशियल लिस्ट नहीं" label hatana allowed nahi.');
    }
    if(t==='watch'){
      if(d.city!=null)city(false);
      if(!Array.isArray(d.names)||!d.names.length)err(i,L+'"names" list (1-6 naam) chahiye.');
      else{if(d.names.length>6)err(i,L+'"names" mein 6 se zyada naam ('+d.names.length+') — sirf pehle 6 dikhenge.');
        d.names.forEach((n,j)=>{if(!isStr(n)||!n.trim())err(i,L+'names['+j+'] khali/galat.');else if(n.length>30)warn(i,L+'names['+j+'] lamba hai.');});}
      if(d.photos!=null){if(!Array.isArray(d.photos))err(i,L+'"photos" list chahiye.');else{if(d.photos.length>2)warn(i,L+'photos 2 se zyada — sirf pehli 2 dikhengi.');d.photos.forEach((p,j)=>photo(p,'photos['+j+']'));}}
    }
    if(t==='rumour'){
      need('head');
      if(d.photos!=null){if(!Array.isArray(d.photos))err(i,L+'"photos" list chahiye.');else{if(d.photos.length>2)warn(i,L+'photos 2 se zyada — sirf pehli 2 dikhengi.');d.photos.forEach((p,j)=>photo(p,'photos['+j+']'));}}
      else warn(i,L+'"photos" nahi hai (1-2 photo chahiye).');
    }
    if(t==='anth'){
      if(!Array.isArray(d.qs)||!d.qs.length)err(i,L+'"qs" list (1-3 sawal) chahiye.');
      else{if(d.qs.length>3)err(i,L+'"qs" mein 3 se zyada sawal — sirf pehle 3 dikhenge.');
        d.qs.forEach((q,j)=>{if(!isStr(q)||!q.trim())err(i,L+'qs['+j+'] khali/galat.');else if(q.length>90)warn(i,L+'qs['+j+'] lamba hai ('+q.length+' akshar, 90 tak).');});}
    }
    if(t==='intro'){if(!(isStr(d.line1)&&d.line1.trim())&&!(isStr(d.line2)&&d.line2.trim()))err(i,L+'"line1" ya "line2" chahiye.');}
    if(t==='presenter'){
      if(!Array.isArray(d.photos)||!d.photos.filter(Boolean).length)err(i,L+'"photos" mein kam se kam 1 photo slot chahiye.');
      else d.photos.forEach((p,j)=>photo(p,'photos['+j+']'));
      if(d.key!=null&&!(d.key==='auto'||d.key===true||d.key===false))err(i,L+'"key" "auto"|true|false hona chahiye.');
      if(d.swap!=null&&(!isNum(d.swap)||d.swap<0.5||d.swap>5))err(i,L+'"swap" 0.5-5 seconds.');
      need('name');
    }
  });
  return {errors:E,warns:W};
};

S.report=function(scenes,env){
  const r=S.check(scenes,env),n=Array.isArray(scenes)?scenes.length:0;
  const f=x=>(x.i?'Scene '+x.i+': ':'')+x.m;
  const head=r.errors.length?'✘ JSON check: '+r.errors.length+' error'+(r.warns.length?', '+r.warns.length+' warning':'')+' ('+n+' scenes)'
    :'✔ JSON check OK ('+n+' scenes)'+(r.warns.length?' — '+r.warns.length+' warning':'');
  return {ok:!r.errors.length,errors:r.errors,warns:r.warns,
    text:[head].concat(r.errors.map(x=>'✘ '+f(x)),r.warns.map(x=>'⚠ '+f(x))).join('\n')};
};
S.TYPES=TYPES;S.WIDE=WIDE;S.SHORT=SHORT;S.TRS=TRS;S.CITIES=CITIES;
if(typeof module!=='undefined')module.exports=S;
})();
