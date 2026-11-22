// C18: scenes JSON validator. SCHK.check(scenes,env) -> {errors[],warns[]}; SCHK.report(...) -> text.
// env (optional): {slots:Set|Array of ids, have:fn(id), manifest:obj}. Browser mein apne aap window se leta hai.
(function(){
'use strict';
const S=window.SCHK={};
const WIDE=['hook','title','stat','retain','watch','rumour','anth','intro','presenter','cta','curve','stack','chapter','crowd','bigwords','qcards','spot','compare','tiles','levels','chip','options','stat2','bars','dash','trio','rating','portrait','phone','winprob','h2h','pitch','xi','market','comments','timeline','hub','search','formula','beforeafter','setting','radio','ideas','reel','phones','gcurve','steps','expect','equals','payoff','tickgrid','variety','vsvlog','energy','bestlast','locked','longstat','offer','products','endscreen','burst','clip','diamond','kinetic','barcount','quote','post','iconscene','bullets','phoneann','phonewall','numgrid','compare2','plans','timelist','ctapill','adcard','uimock','checklist','chips','split','icontiles','stepcards','screenclip','toggle','askq','promo','outword','flowdiag','crossprice','docfolder','topicend','measure','meme','wavestrip','ideatitle','chipcarousel','flowline','chatmock','statcard','thumbwall','ladder','ring','vidcard','gauge','barlist','tree','cardtiles','fan','replies','vs2','bonus','prodnode','dotmap'];
const SHORT=['short_hook','short_stat','short_cta'];
const TYPES=WIDE.concat(SHORT);
const TRS=['cut','fade','grunge','zoom','whip','glitch','flash','slideup','push','iris','blinds','rgb','spin','lightwipe','tiles','blurfade','split','chevron','torn'];
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
 cta:['mode','title','line'],
 bigwords:['a','b','join','pills','title','ca','cb'],
 qcards:['title','qs','hl'],
 bars:['title','items','unit','c','total'],
 dash:['title','tiles','pts','note','c'],
 winprob:['title','a','b','pa','pb','ca','cb','note'],
 h2h:['title','a','b','wa','wb','nr','fa','fb','note'],
 pitch:['title','type','items','toss','note'],
 xi:['title','team','c','players','note'],
 trio:['title','head','icon','items','c'],
 rating:['title','head','stars','label','tiles','c'],
 portrait:['title','text','sub','photo','side','c'],
 phone:['title','feed','label','n','c'],
 market:['title','tiles','pills','c'],
 comments:['title','items','hl','pill','c'],
 timeline:['title','points','at','label','c'],
 hub:['title','center','spokes','note','c'],
 search:['title','text','results','pill','c'],
 formula:['title','name','a','op','b','la','lb','c'],
 beforeafter:['title','before','after','bi','ai','bl','al','bar','barlabel'],
 setting:['title','step','name','pills','c','bg'],
 radio:['title','items','hl','pill','c','bg'],
 ideas:['title','items','avatar','av','c','bg'],
 reel:['title','n','unit','big','label','gauge','glabel','gl','c','bg'],
 phones:['title','a','b','ia','ib','la','lb','hl','caption','c','bg'],
 gcurve:['title','gauge','glabel','gl','pts','cl','c','bg'],
 steps:['title','items','hl','caption','c','bg'],
 expect:['title','thumb','ti','thought','user','av','pill','tick','c','bg'],
 equals:['title','a','av','b','bv','ex','c','bg'],
 payoff:['title','a','b','ta','tb','q','qt','c','bg'],
 tickgrid:['title','total','cols','quote','pts','c','bg'],
 clip:['title','clip','start','fit','src','name','role','sub','quote','c','bg'],
 diamond:['title','num','tag','icon','pill','c','bg'],
 kinetic:['photo','words','sub','bw','c','bg'],
 barcount:['title','items','unit','max','hl','note','pill','c','bg'],
 quote:['quote','name','role','photo','side','bw','crowd','c','bg'],
 post:['title','name','handle','text','img','avatar','stats','src','pile','theme','zoom','c','bg'],
 iconscene:['title','items','btn','click','crowd','c','bg'],
 bullets:['title','items','c','bg'],
 split:['inner','pres','clip','start','side','ratio','bg'],
 icontiles:['title','items','hl','bg'],
 stepcards:['head','items','hl','c','bg'],
 screenclip:['mode','title','clip','shot','start','focus','at','tap','label','sub','bg'],
 toggle:['title','items','hl','bg'],
 askq:['head','name','text','audio','bg'],
 promo:['name','logo','subs','thumbs','btn','note','bg'],
 flowdiag:['title','a','b','la','lb','result','wave','c','bg'],
 crossprice:['title','img','price','label','cross','bg'],
 docfolder:['title','doc','folder','label','bg'],
 vidcard:['clip','shot','start','title','meta','bg'],
 gauge:['label','v','n','pre','suf','c1','c2','bg'],
 barlist:['title','items','suf','bg'],
 tree:['root','l2','l3','bg'],
 cardtiles:['items','brace','bg'],
 fan:['src','outs','bg'],
 replies:['src','items','bg'],
 vs2:['a','sa','b','sb','pill','bg'],
 bonus:['a','ta','b','tb','icon','bg'],
 prodnode:['a','b','c','bg'],
 dotmap:['title','map','items','hl','sub','bg'],
 ideatitle:['small','big','sub','bg'],
 chipcarousel:['title','chips','hl','bg'],
 flowline:['title','nodes','mode','pill','bg'],
 chatmock:['ph','q','chips','note','bg'],
 statcard:['n','dec','pre','suf','label','side','blur','rain','bg'],
 thumbwall:['thumbs','n','hl','label','bg'],
 ladder:['title','steps','hl','bg'],
 ring:['n','dec','pre','suf','label','orbit','bg'],
 measure:['title','img','label','sub','bg'],
 meme:['img','text','side','bg'],
 wavestrip:['name','img','text','c','bg'],
 topicend:['text','topic','bg'],
 outword:['words','img','sub','c','bg'],
 plans:['title','items','hl','badge','c','bg'],
 timelist:['title','items','unit','total','c','bg'],
 ctapill:['title','btn','n','nl','note','c','bg'],
 adcard:['title','old','price','btn','proof','note','c','bg'],
 uimock:['title','url','beats','options','pick','click','c','bg'],
 checklist:['title','items','note','c','bg'],
 chips:['title','chips','thumbs','pills','c','bg'],
 phonewall:['title','n','shots','labels','mode','hl','c','bg'],
 numgrid:['title','items','hl','c','bg'],
 compare2:['title','ia','ib','la','lb','ua','ub','hl','c','bg'],
 phoneann:['title','clip','start','shot','arrows','sub','c','bg'],
 burst:['title','shot','n','dec','pre','unit','big','label','pill','c','bg'],
 variety:['title','vl','vi','emoji','et','bar','c','bg'],
 vsvlog:['title','la','a','lb','b','c','bg'],
 energy:['title','h','p','n','dl','sl','c','bg'],
 bestlast:['title','label','pts','c','bg'],
 locked:['title','items','total','pill','c','bg'],
 longstat:['title','head','n1','l1','n2','l2','pill','c1','c2','bg'],
 offer:['title','dots','you','av','oh','ot','yes','no','pick','c','bg'],
 products:['title','items','gl','pts','c','bg'],
 endscreen:['title','vt','ch','views','vi','sub','c','bg'],
 stat2:['title','n1','l1','n2','l2','p1','s1','p2','s2','c1','c2','mid','pill'],
 chip:['title','name','by','icon','c'],
 options:['title','items','pills','hl'],
 tiles:['title','items','c','banner'],
 levels:['title','items','done','lock','hl','pill'],
 compare:['title','la','lb','a','b','ma','mb','ca','cb'],
 spot:['title','shot','box','label','pill','cursor','click','zoom'],
 crowd:['title','total','hi','label','sub','c','scatter'],
 chapter:['num','title','pill','lock'],
 stack:['title','items','hl','pill','done','mark'],
 curve:['title','xl','y1','l1','c1','mark1','y2','l2','c2','mark2','note','ymin','ymax'],
 presenter:['channel','name','sub','photos','key','swap'],
 short_hook:['pre','big','to','dec','unit','post'],
 short_stat:['photo','pre','prefix','to','dec','unit','big','head','sub','lt','tag'],
 short_cta:['line1','line2','cta']};
// max chars (is se zyada ho to text chhota/kat sakta hai)
const MAXC={dotmap:{title:60,sub:80},vidcard:{title:80,meta:60},gauge:{label:30,n:10,pre:4,suf:6},barlist:{title:50},tree:{root:30},cardtiles:{brace:30},fan:{src:60},replies:{src:200},vs2:{a:24,sa:40,b:24,sb:40,pill:50},bonus:{a:24,ta:40,b:24,tb:40},ideatitle:{small:30,big:40,sub:70},chipcarousel:{title:60},flowline:{title:60,pill:50},chatmock:{ph:50,q:220,note:60},statcard:{label:40,pre:4,suf:6},thumbwall:{label:50},ladder:{title:60},ring:{label:40,pre:4,suf:6},measure:{title:60,label:24,sub:40},meme:{text:70},wavestrip:{name:10,text:70},flowdiag:{title:60,la:24,lb:24,result:70},crossprice:{title:60,price:14,label:60},docfolder:{title:60,label:60},topicend:{text:120,topic:20},icontiles:{title:60},stepcards:{head:24},screenclip:{title:60,label:30,sub:70},toggle:{title:60},askq:{head:30,name:24,text:200},promo:{name:30,subs:10,btn:20,note:60},outword:{words:30,sub:70},plans:{title:60,badge:24},timelist:{title:60,total:50},ctapill:{title:70,btn:30,n:6,nl:20,note:60},adcard:{title:60,old:12,price:12,btn:30,note:60},uimock:{title:60},checklist:{title:40,note:60},chips:{title:60},phonewall:{title:60},numgrid:{title:60},compare2:{title:60,la:40,lb:40},bullets:{title:60},phoneann:{title:60,sub:60},title:{headline:70,sub:60,ticker:140},hook:{pre:40,unit:20,post:80},stat:{pre:40,head:50,sub:60,unit:20},
 retain:{name:30,amount:20,note:80},watch:{title:30,note:80},rumour:{head:50,sub:60},anth:{title:60,cta:60},
 intro:{line1:50,line2:70},cta:{title:40,line:60},bigwords:{a:20,b:20,title:60},qcards:{title:60},spot:{title:60,label:50,pill:50},compare:{title:60,la:30,lb:30},tiles:{title:60,banner:50},chip:{title:60,name:28,by:40},formula:{title:60,name:16,a:24,b:24,la:30,lb:30},beforeafter:{title:60,before:60,after:60,bl:16,al:16,barlabel:50},setting:{title:60,step:20,name:30},radio:{title:60,pill:50},ideas:{title:60,avatar:30},reel:{title:60,label:24,big:12,glabel:10,gl:30,unit:4},phones:{title:60,a:80,b:80,la:20,lb:20,caption:60},gcurve:{title:60,glabel:10,gl:24,cl:24},steps:{title:60,caption:60},expect:{title:60,thumb:50,thought:60,user:24,pill:50},equals:{title:60,a:24,av:24,b:24,bv:24,ex:60},payoff:{title:60,a:24,b:24,ta:8,tb:8,qt:40},tickgrid:{title:60,quote:60},clip:{title:60,src:40,name:40,role:50,sub:120},diamond:{title:60,tag:14,pill:50},kinetic:{words:60,sub:60},barcount:{title:60,unit:4,note:60,pill:50},quote:{quote:200,name:30,role:50},post:{title:60,name:30,handle:30,text:220,stats:60,src:40},iconscene:{title:60,btn:24},burst:{title:60,pre:10,unit:6,big:14,label:60,pill:50},variety:{title:60,vl:40,et:40,bar:30},vsvlog:{title:60,la:24,a:70,lb:24,b:70},energy:{title:60,h:14,p:14,dl:40,sl:50},bestlast:{title:60,label:40},locked:{title:60,pill:50},longstat:{title:60,head:40,l1:36,l2:36,pill:50},offer:{title:60,you:14,oh:24,ot:100,yes:16,no:16},products:{title:60,gl:30},endscreen:{title:60,vt:70,ch:40,views:30,sub:20},hub:{title:60,center:30,note:50},search:{title:60,text:60,pill:50},market:{title:60},comments:{title:60,pill:50},timeline:{title:60,label:24},portrait:{title:60,text:70,sub:80},phone:{title:60,label:24},trio:{title:60,head:50},rating:{title:60,head:40,label:20},bars:{title:60,unit:12},dash:{title:60,note:50},stat2:{title:60,l1:40,l2:40,pill:50,mid:3},options:{title:60},levels:{title:60,pill:50},crowd:{title:60,label:30,sub:60},chapter:{title:40,pill:50},stack:{title:60,pill:24},curve:{title:60,l1:24,l2:24,note:80},presenter:{channel:30,name:30,sub:50},
 short_hook:{pre:40,unit:20,post:80},short_stat:{pre:30,head:40,sub:50,unit:16},short_cta:{line1:60,line2:40,cta:30}};
const BAD_WORDS=/dream\s*11|dream11|fantasy|betting|\bbet\b|सट्टा|फैंटेसी|ड्रीम\s*11/i;
const SHORTS=/\b(MI|CSK|RCB|KKR|SRH|DC|PBKS|RR|GT|LSG)\b/;
const BANW=/रूमर|रुमर|अफवाह|अफ़वाह|ऑफिशियल|ऑफ़िशियल|आधिकारिक|rumou?r|official/i;
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
    if(sc.pills!=null){if(!Array.isArray(sc.pills))err(i,L+'"pills" list hona chahiye (1-3 pill).');else{if(sc.pills.length>3)warn(i,L+'pills '+sc.pills.length+' hain — sirf pehli 3 dikhengi.');sc.pills.forEach((o,k)=>{const t=typeof o==='string'?o:(o&&o.t);if(!isStr(t)||!t.trim())err(i,L+'pill '+(k+1)+' mein text chahiye.');else if(t.length>24)warn(i,L+'pill '+(k+1)+' lamba ('+t.length+' akshar) — 24 ke andar rakho.');if(o&&typeof o==='object'&&o.c!=null&&!/^(g|r|y|x|green|red|yellow|grey|gray)$/i.test(String(o.c)))warn(i,L+'pill '+(k+1)+' ka rang g/r/y/x mein se ho.');});}}
    if(sc.carry!=null){const cr=sc.carry;if(typeof cr!=='object'||Array.isArray(cr)||!isStr(cr.id)||!cr.id.trim()||!isStr(cr.t)||!cr.t.trim())err(i,L+'"carry" object chahiye: {"id":"k1","t":"text"} (id aur t zaruri).');
      else{if(cr.pos!=null&&!(window.CARRY&&CARRY.pos(cr.pos)))err(i,L+'carry "pos" "x,y" hona chahiye, dono 0-1 mein (jaise 0.5,0.5).');
        if(cr.c!=null&&!/^[ygrbw]$/.test(cr.c))warn(i,L+'carry "c" y/g/r/b/w mein se ho.');if(cr.s!=null&&!(cr.s>=.5&&cr.s<=3))warn(i,L+'carry "s" 0.5 se 3 ke beech ho.');if(cr.t.length>24)warn(i,L+'carry "t" lamba ('+cr.t.length+' akshar, 24 tak).');
        const nx=scenes[k+1];if(nx&&nx.carry&&nx.carry.id===cr.id&&(nx.carry.t===cr.t&&nx.carry.pos===cr.pos&&nx.carry.s===cr.s))warn(i,L+'agle scene mein same carry (id, pos, s, t sab ek jaisa) — glide nahi dikhega.');}}
    if(sc.pillsPos!=null&&['low','mid','top'].indexOf(sc.pillsPos)<0)warn(i,L+'pillsPos low/mid/top mein se ho.');
    if(sc.header!=null){if(!isStr(sc.header))err(i,L+'"header" text (string) hona chahiye.');else{const hp=sc.header.replace(/\*/g,'');if(hp.length>70)warn(i,L+'header '+hp.length+' akshar — 70 ke andar rakho (2 line mein aaye).');if((sc.header.match(/\*/g)||[]).length%2)warn(i,L+'header mein * jodi mein likho (*shabd*).');}}
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
      if(slotSet&&!slotSet.has(String(id).split('#')[0])){err(i,L+label+' unknown photo slot "'+id+'". Library ke slot id ya custom_<naam> chahiye.');return;}
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
        }
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
    if(t==='bigwords'){if(!(isStr(d.a)&&d.a.trim())||!(isStr(d.b)&&d.b.trim()))err(i,L+'\"a\" aur \"b\" (do bade shabd) dono chahiye.');
      if(d.pills!=null&&!Array.isArray(d.pills))err(i,L+'\"pills\" list hona chahiye.');else if(d.pills&&d.pills.length>3)warn(i,L+'pills 3 se zyada — sirf pehli 3 dikhengi.');
      ['ca','cb'].forEach(k=>{if(d[k]!=null&&!/^[ygrbw]$/.test(d[k]))warn(i,L+'\"'+k+'\" y/g/r/b/w mein se ho.');});}
    if(t==='qcards'){if(!Array.isArray(d.qs)||d.qs.filter(x=>isStr(x)&&x.trim()).length<2)err(i,L+'\"qs\" mein 2-3 sawal chahiye.');
      else{if(d.qs.length>3)warn(i,L+'qs 3 se zyada — sirf pehle 3 dikhenge.');d.qs.forEach((q,j)=>{if(isStr(q)&&q.length>60)warn(i,L+'qs['+j+'] lamba ('+q.length+' akshar, 60 tak).');});}
      if(d.hl!=null&&d.hl!==0&&(!(d.hl>=1)||d.hl>(d.qs||[]).length))warn(i,L+'\"hl\" 1 se '+(d.qs||[]).length+' ke beech ho (ya 0).');}
    if(t==='stat2'){[['n1','l1'],['n2','l2']].forEach(k=>{if(d[k[0]]==null||d[k[0]]===''||!isFinite(+d[k[0]]))err(i,L+'"'+k[0]+'" number chahiye (jaise 1000).');if(!isStr(d[k[1]])||!d[k[1]].trim())warn(i,L+'"'+k[1]+'" (label) khali hai.');});
      ['c1','c2'].forEach(k=>{if(d[k]!=null&&!/^[ygrb]$/.test(d[k]))warn(i,L+'"'+k+'" y/g/r/b mein se ho.');});}
    if(t==='bars'){const n=window.CORE&&CORE.barItems?CORE.barItems(d).filter(o=>isFinite(o.v)).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'"items" mein 2-6 line chahiye, har ek "naam|number" (jaise पहला|5).');else{if(d.items.length>6)warn(i,L+'items 6 se zyada — sirf pehli 6 dikhengi.');if(window.CORE&&CORE.barItems(d).length!==n)err(i,L+'kisi item ka number galat hai (naam|number).');}
      if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='dash'){const n=window.CORE&&CORE.dashTiles?CORE.dashTiles(d).length:0,pn=window.CORE&&CORE.dashPts?CORE.dashPts(d).length:0;if(!Array.isArray(d.tiles)||n<2)err(i,L+'"tiles" mein 2-4 tile chahiye (label|value|+5%).');else if(d.tiles.length>4)warn(i,L+'tiles 4 se zyada — sirf pehle 4 dikhenge.');
      if(pn<2)warn(i,L+'"pts" mein 2+ number do, warna line chart nahi banega.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='trio'){const n=window.CORE&&CORE.trioItems?CORE.trioItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'"items" mein 2-4 line chahiye (शीर्षक|छोटी लाइन).');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4 dikhenge.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='rating'){if(d.stars==null||!isFinite(+d.stars)||+d.stars<0||+d.stars>5)err(i,L+'"stars" 0 se 5 ke beech number ho (jaise 4 ya 4.5).');if(d.tiles!=null&&!Array.isArray(d.tiles))err(i,L+'"tiles" list hona chahiye (label|value).');else if(d.tiles&&d.tiles.length>2)warn(i,L+'tiles 2 se zyada — sirf pehle 2 dikhenge.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='portrait'){if(!isStr(d.text)||!d.text.trim())err(i,L+'"text" chahiye (jaise लिंक *डिस्क्रिप्शन* में).');else if((d.text.match(/\*/g)||[]).length%2)warn(i,L+'"text" mein * jodi mein ho (*peela shabd*).');if(d.side!=null&&!/^[lr]$/.test(d.side))warn(i,L+'"side" l ya r ho.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='phone'){if(d.feed!=null&&!Array.isArray(d.feed))err(i,L+'"feed" list hona chahiye.');else if(d.feed&&d.feed.length>8)warn(i,L+'feed 8 se zyada — sirf pehli 8.');if(d.n!=null&&d.n!==''&&!isFinite(+d.n))err(i,L+'"n" number ho (counter).');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='market'){const n=window.CORE&&CORE.marketTiles?CORE.marketTiles(d).length:0;if(!Array.isArray(d.tiles)||n<2)err(i,L+'"tiles" mein 2-12 line chahiye (लेबल|y).');else if(d.tiles.length>12)warn(i,L+'tiles 12 se zyada — sirf pehle 12.');if(d.pills!=null&&!Array.isArray(d.pills))err(i,L+'"pills" list hona chahiye.');else if(d.pills&&d.pills.length>2)warn(i,L+'pills 2 se zyada — sirf pehli 2.');}
    if(t==='comments'){const n=window.CORE&&CORE.cmtItems?CORE.cmtItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'"items" mein 2-4 comment chahiye (नाम|कमेंट).');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.hl!=null&&n&&(!(d.hl>=1)||d.hl>n))warn(i,L+'"hl" 1 se '+n+' ke beech ho.');}
    if(t==='timeline'){const n=window.CORE&&CORE.tlPoints?CORE.tlPoints(d).length:0;if(!Array.isArray(d.points)||n<2)err(i,L+'"points" mein 2-6 label chahiye (jaise 2018).');else{if(d.points.length>6)warn(i,L+'points 6 se zyada — sirf pehle 6.');if(d.at!=null&&(!(d.at>=1)||d.at>n))warn(i,L+'"at" 1 se '+n+' ke beech ho.');}}
    if(t==='hub'){const n=window.CORE&&CORE.hubSpokes?CORE.hubSpokes(d).length:0;if(!isStr(d.center)||!d.center.trim())err(i,L+'"center" chahiye (beech ka node).');if(!Array.isArray(d.spokes)||n<2)err(i,L+'"spokes" mein 2-8 naam chahiye.');else if(d.spokes.length>8)warn(i,L+'spokes 8 se zyada — sirf pehle 8.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='search'){if(!isStr(d.text)||!d.text.trim())err(i,L+'"text" chahiye (search bar ka text).');if(d.results!=null&&!Array.isArray(d.results))err(i,L+'"results" list hona chahiye.');else if(d.results&&d.results.length>3)warn(i,L+'results 3 se zyada — sirf pehle 3.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='formula'){['a','b'].forEach(q=>{if(!isStr(d[q])||!d[q].trim())err(i,L+'"'+q+'" chahiye (formula ka hissa).');});if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='beforeafter'){if(!(isStr(d.before)&&d.before.trim())&&!d.bi)err(i,L+'"before" text ya "bi" image chahiye.');if(!(isStr(d.after)&&d.after.trim())&&!d.ai)err(i,L+'"after" text ya "ai" image chahiye.');if(d.bar!=null&&d.bar!==''&&(!isFinite(+d.bar)||+d.bar<0||+d.bar>100))warn(i,L+'"bar" 0 se 100 ke beech ho.');}
    if(t==='setting'){if(!(isStr(d.step)&&d.step.trim())&&!(isStr(d.name)&&d.name.trim()))err(i,L+'\"step\" ya \"name\" chahiye.');if(d.pills!=null&&!Array.isArray(d.pills))err(i,L+'\"pills\" list hona chahiye.');else if(d.pills&&d.pills.length>4)warn(i,L+'pills 4 se zyada — sirf pehli 4.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='radio'){const n=window.CORE&&CORE.radioItems?CORE.radioItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'\"items\" mein 2-5 option chahiye.');else{if(d.items.length>5)warn(i,L+'items 5 se zyada — sirf pehle 5.');const hh=window.CORE&&CORE.radioHl?CORE.radioHl(d):[];if(hh.some(x=>x>n))warn(i,L+'\"hl\" 1 se '+n+' ke beech ho.');}if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='ideas'){const n=window.CORE&&CORE.ideaItems?CORE.ideaItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'\"items\" mein 2-3 idea chahiye (शीर्षक|छोटी लाइन|आइकन).');else if(d.items.length>3)warn(i,L+'items 3 se zyada — sirf pehle 3.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='reel'){if(!(d.n!=null&&d.n!==''&&isFinite(+d.n))&&!(isStr(d.big)&&d.big.trim()))err(i,L+'\"n\" (number) ya \"big\" (text) chahiye.');if(d.gauge!=null&&d.gauge!==''&&(!isFinite(+d.gauge)||+d.gauge<0||+d.gauge>100))warn(i,L+'\"gauge\" 0 se 100 ke beech ho.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='phones'){if(!(isStr(d.a)&&d.a.trim())&&!d.ia)err(i,L+'\"a\" text ya \"ia\" image chahiye.');if(!(isStr(d.b)&&d.b.trim())&&!d.ib)err(i,L+'\"b\" text ya \"ib\" image chahiye.');if(d.hl!=null&&d.hl!==''&&d.hl!==1&&d.hl!==2)warn(i,L+'\"hl\" 1 ya 2 ho.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='gcurve'){const np=window.CORE&&CORE.gcPts?CORE.gcPts(d).length:0,hg=d.gauge!=null&&d.gauge!==''&&isFinite(+d.gauge);if(!hg&&np<2)err(i,L+'\"gauge\" (number) ya \"pts\" (2-10 number) chahiye.');if(hg&&(+d.gauge<0||+d.gauge>100))warn(i,L+'\"gauge\" 0 se 100 ke beech ho.');if(d.pts!=null&&!Array.isArray(d.pts))err(i,L+'\"pts\" list hona chahiye.');else if(d.pts&&d.pts.length>10)warn(i,L+'pts 10 se zyada — sirf pehle 10.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='steps'){const n=window.CORE&&CORE.stepItems?CORE.stepItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'\"items\" mein 2-4 step chahiye (शीर्षक|छोटी लाइन).');else{if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.hl!=null&&d.hl!==''&&(!(d.hl>=1)||d.hl>n))warn(i,L+'\"hl\" 1 se '+n+' ke beech ho.');}if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='expect'){if(!(isStr(d.thumb)&&d.thumb.trim())&&!d.ti&&!(isStr(d.thought)&&d.thought.trim()))err(i,L+'\"thumb\" / \"ti\" ya \"thought\" chahiye.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='equals'){const ok=(x,y)=>isStr(d[x])&&d[x].trim()&&isStr(d[y])&&d[y].trim();if(!ok('a','av')&&!ok('b','bv'))err(i,L+'\"a\"+\"av\" (ya \"b\"+\"bv\") chahiye.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='payoff'){if(!isStr(d.a)||!d.a.trim()||!isStr(d.b)||!d.b.trim())err(i,L+'\"a\" aur \"b\" dono chahiye.');if(d.q!=null&&d.q!==''&&(!isFinite(+d.q)||+d.q<0||+d.q>4))warn(i,L+'\"q\" 0 se 4 ke beech ho.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='tickgrid'){if(d.total!=null&&d.total!==''&&(!isFinite(+d.total)||+d.total<6||+d.total>60))warn(i,L+'\"total\" 6 se 60 ke beech ho.');if(d.pts!=null&&!Array.isArray(d.pts))err(i,L+'\"pts\" list hona chahiye.');else if(d.pts&&d.pts.length>8)warn(i,L+'pts 8 se zyada — sirf pehle 8.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='clip'){if(!isStr(d.clip)||!d.clip.trim())err(i,L+'\"clip\" (clip file ka naam) chahiye.');else if(typeof window!=='undefined'&&window.CORE&&CORE.clipsReady&&CORE.clips&&!CORE.clips[d.clip.trim()])warn(i,L+'clip "'+d.clip+'" abhi upload nahi hai (🎞 Clips).');if(!(isStr(d.src)&&d.src.trim()))warn(i,L+'\"src\" (source tag) lagao — edit karne se copyright nahi hatta.');if(d.start!=null&&d.start!==''&&(!isFinite(+d.start)||+d.start<0))warn(i,L+'\"start\" 0 ya zyada ho.');if(d.fit!=null&&d.fit!==''&&d.fit!=='cover'&&d.fit!=='contain')warn(i,L+'\"fit\" cover ya contain ho.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='diamond'){if(!(isStr(d.title)&&d.title.trim())&&(d.num==null||d.num===''))err(i,L+'\"title\" ya \"num\" chahiye.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='kinetic'){if(!(isStr(d.words)&&d.words.trim()))err(i,L+'\\"words\\" chahiye (*shabd* = peela).');else if((d.words.match(/\*/g)||[]).length%2)warn(i,L+'words mein * ki jodi poori nahi.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\\"c\\" y/g/r/b mein se ho.');}
    if(t==='barcount'){const n=window.CORE&&CORE.barItems?CORE.barItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'\\"items\\" mein 2-4 \\"number|label\\" chahiye.');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.hl!=null&&d.hl!==''&&(!(d.hl>=1)||d.hl>n))warn(i,L+'\\"hl\\" 1 se '+n+' ke beech ho.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\\"c\\" y/g/r/b mein se ho.');}
    if(t==='quote'){if(!(isStr(d.quote)&&d.quote.trim()))err(i,L+'\\"quote\\" chahiye.');if(d.side!=null&&d.side!==''&&d.side!=='l'&&d.side!=='r')warn(i,L+'\\"side\\" l ya r ho.');if(d.name==null||!String(d.name).trim())warn(i,L+'\\"name\\" lagao (kisne kaha) — naye facts/jhoothe quote nahi.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\\"c\\" y/g/r/b mein se ho.');}
    if(t==='post'){if(!(isStr(d.text)&&d.text.trim())&&!(isStr(d.name)&&d.name.trim()))err(i,L+'\\"text\\" ya \\"name\\" chahiye.');if(!(isStr(d.src)&&d.src.trim()))warn(i,L+'\\"src\\" (source tag) lagao — asli post ho to; apna banaya mock ho to likh do.');if(d.pile!=null&&d.pile!==''&&(!isFinite(+d.pile)||+d.pile<0||+d.pile>2))warn(i,L+'\\"pile\\" 0 se 2 ho.');if(d.theme!=null&&d.theme!==''&&d.theme!=='light'&&d.theme!=='dark')warn(i,L+'\\"theme\\" light ya dark ho.');}
    if(t==='bullets'){const n=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(n<2)err(i,L+'"items" mein 2-5 lines chahiye.');else if(d.items.length>5)warn(i,L+'items 5 se zyada — sirf pehle 5.');(Array.isArray(d.items)?d.items:[]).concat([d.title]).forEach(x=>{if(isStr(x)&&(x.match(/\*/g)||[]).length%2)warn(i,L+'* ki jodi poori nahi: '+x.slice(0,20));});}
    if(t==='phoneann'){const hc=isStr(d.clip)&&d.clip.trim(),hs=isStr(d.shot)&&d.shot.trim();if(!hc&&!hs)err(i,L+'"clip" ya "shot" chahiye.');else if(hc&&typeof window!=='undefined'&&window.CORE&&CORE.clipsReady&&CORE.clips&&!CORE.clips[d.clip.trim()])warn(i,L+'clip "'+d.clip+'" upload nahi — 🎞 Clips se upload karo.');if(d.arrows!=null){if(!Array.isArray(d.arrows))err(i,L+'"arrows" list ho: ["label|x|y"].');else{if(d.arrows.length>5)warn(i,L+'arrows 5 se zyada — sirf pehle 5.');d.arrows.forEach(a=>{const p=String(a).split('|'),x=parseFloat(p[1]),y=parseFloat(p[2]);if(!p[0].trim()||!isFinite(x)||!isFinite(y)||x<0||x>100||y<0||y>100)warn(i,L+'arrow "'+String(a).slice(0,20)+'" "label|x|y" (x,y 0-100) ho.');});}}if((d.title&&(String(d.title).match(/\*/g)||[]).length%2))warn(i,L+'title mein * ki jodi poori nahi.');}
    if(t==='phonewall'){const n=+d.n;if(d.n!=null&&d.n!==''&&(!isFinite(n)||n<2||n>10))warn(i,L+'"n" 2 se 10 ke beech ho.');if(d.mode!=null&&d.mode!==''&&d.mode!=='fan'&&d.mode!=='row')warn(i,L+'"mode" fan ya row ho.');if(d.mode!=='row'&&n>6)warn(i,L+'fan mein 6 se zyada phone row mein dikhenge.');if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>(n||10)))warn(i,L+'"hl" 0 ya 1..n ho.');}
    if(t==='numgrid'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(m<2)err(i,L+'"items" mein 2-8 "number|label" chahiye.');else if(d.items.length>8)warn(i,L+'items 8 se zyada — sirf pehle 8.');if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>m))warn(i,L+'"hl" 0 ya 1..items ho.');}
    if(t==='compare2'){const ok=(a,b)=>(isStr(d[a])&&d[a].trim())||(isStr(d[b])&&d[b].trim());if(!ok('ia','la')||!ok('ib','lb'))err(i,L+'dono side chahiye: "ia/la" aur "ib/lb" (image ya label).');if(d.hl!=null&&d.hl!==''&&![0,1,2].includes(+d.hl))warn(i,L+'"hl" 0, 1 ya 2 ho.');}
    if(t==='plans'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(m<2)err(i,L+'"items" mein 2-3 "naam|keemat|note" chahiye.');else if(d.items.length>3)warn(i,L+'items 3 se zyada — sirf pehle 3.');if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>m))warn(i,L+'"hl" 0 ya 1..items ho.');}
    if(t==='timelist'){const a=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.split('|').length>1&&isFinite(parseFloat(x.split('|')[1]))):[];if(a.length<2)err(i,L+'"items" mein 2-6 "naam|number" chahiye.');else if(d.items.length>6)warn(i,L+'items 6 se zyada — sirf pehle 6.');}
    if(t==='ctapill'){if(!(isStr(d.btn)&&d.btn.trim()))warn(i,L+'"btn" khaali — "Join Now" dikhega.');if(d.n!=null&&d.n!==''&&String(d.n).length>6)warn(i,L+'"n" chhota ho (jaise 14).');}
    if(t==='adcard'){if(!(d.price!=null&&String(d.price).trim()))err(i,L+'"price" chahiye.');if(Array.isArray(d.proof)&&d.proof.length>6)warn(i,L+'proof 6 se zyada — sirf pehle 6. (proof Rahul ke asli comments/text hi ho)');}
    if(t==='uimock'){if(!Array.isArray(d.options)||d.options.filter(x=>isStr(x)&&x.trim()).length<2)err(i,L+'"options" mein 2-3 "A|text" chahiye.');if(d.pick!=null&&d.pick!==''&&(!isFinite(+d.pick)||+d.pick<0||+d.pick>3))warn(i,L+'"pick" 0-3 ho.');if(Array.isArray(d.beats)&&d.beats.length>4)warn(i,L+'beats 4 se zyada — sirf pehle 4.');}
    if(t==='checklist'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(m<2)err(i,L+'"items" mein 2-6 steps chahiye.');else if(d.items.length>6)warn(i,L+'items 6 se zyada — sirf pehle 6.');}
    if(t==='icontiles'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(m<2)err(i,L+'"items" mein 2-4 "icon|label|colour" chahiye.');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>m))warn(i,L+'"hl" 0 ya 1..items ho.');}
    if(t==='stepcards'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(m<2)err(i,L+'"items" mein 2-4 card chahiye.');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='screenclip'){const hc=isStr(d.clip)&&d.clip.trim(),hs=isStr(d.shot)&&d.shot.trim();if(!hc&&!hs)err(i,L+'"clip" ya "shot" chahiye.');else if(hc&&typeof window!=='undefined'&&window.CORE&&CORE.clipsReady&&CORE.clips&&!CORE.clips[d.clip.trim()])warn(i,L+'clip "'+d.clip+'" upload nahi — 🎞 Clips se daalo.');
      if(d.mode!=null&&d.mode!==''&&!['phone','wide'].includes(d.mode))warn(i,L+'"mode" phone ya wide ho.');
      if(isStr(d.focus)&&d.focus.trim()){const a=d.focus.split('|').map(parseFloat);if(a.length!==4||a.some(x=>!isFinite(x))||a[2]<=0||a[3]<=0||a[0]<0||a[1]<0||a[0]+a[2]>100.5||a[1]+a[3]>100.5)warn(i,L+'"focus" = "x|y|w|h" (% mein, 0-100, frame ke andar).');else if(d.at!=null&&d.at!==''&&(!isFinite(+d.at)||+d.at<0||+d.at>sc.dur-1))warn(i,L+'"at" 0 se (dur-1) ke beech ho.');}}
    if(t==='toggle'){const a=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()):[];if(a.length<2)err(i,L+'"items" mein 2-3 "label|x ya v" chahiye.');else{if(a.length>3)warn(i,L+'items 3 se zyada — sirf pehle 3.');a.forEach((q,j)=>{const mk=(q.split('|')[1]||'').trim().toLowerCase();if(!['x','v','✗','✓','0','1','no','yes','true','false'].includes(mk))warn(i,L+'items['+j+'] mein "|x" ya "|v" likho (nahi to tick maana jayega).');});}if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>a.length))warn(i,L+'"hl" 0 ya 1..items ho.');}
    if(t==='askq'){if(!(isStr(d.text)&&d.text.trim()))err(i,L+'"text" (comment) chahiye.');if(!(isStr(d.name)&&d.name.trim()))warn(i,L+'"name" khali — @viewer dikhega.');}
    if(t==='promo'){if(!(isStr(d.name)&&d.name.trim()))warn(i,L+'"name" (channel naam) khali.');if(Array.isArray(d.thumbs)&&d.thumbs.length>3)warn(i,L+'thumbs 3 se zyada — sirf pehle 3.');if(d.subs!=null&&String(d.subs).trim()&&!/\d/.test(String(d.subs)))warn(i,L+'"subs" mein number ho (jaise 339k) — Rahul apna asli number likhe.');}
    if(t==='vidcard'&&!(isStr(d.clip)&&d.clip.trim())&&!(isStr(d.shot)&&d.shot.trim()))warn(i,L+'"clip" ya "shot" do — abhi placeholder dikhega.');
    if(t==='barlist'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&isFinite(parseFloat((x.split('|')[1]||'')))).length:0;if(m<3)err(i,L+'"items" mein 3-6 "naam|number" chahiye.');else if(d.items.length>6)warn(i,L+'items 6 se zyada — sirf pehle 6.');}
    if(t==='tree'){if(!(isStr(d.root)&&d.root.trim()))err(i,L+'"root" chahiye.');if(!Array.isArray(d.l2)||!d.l2.length)err(i,L+'"l2" mein 1-3 naam chahiye.');}
    if(t==='cardtiles'){const m=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()).length:0;if(m<3)err(i,L+'"items" mein 3-4 chahiye.');}
    if(t==='fan'&&(!Array.isArray(d.outs)||d.outs.filter(x=>isStr(x)&&x.trim()).length<2))err(i,L+'"outs" mein 2-4 chahiye.');
    if(t==='replies'&&(!Array.isArray(d.items)||d.items.filter(x=>isStr(x)&&x.trim()).length<2))err(i,L+'"items" mein 2-4 "@naam|comment" chahiye (Rahul ke asli comments).');
    if(t==='vs2'&&(!(isStr(d.a)&&d.a.trim())||!(isStr(d.b)&&d.b.trim())))err(i,L+'"a" aur "b" chahiye.');
    if(t==='dotmap'){const mk=d.map==='world'?'world':'india',a=Array.isArray(d.items)?d.items.filter(x=>isStr(x)&&x.trim()):[],CT=['mumbai','chennai','kolkata','delhi','bengaluru','bangalore','hyderabad','ahmedabad','gujarat','jaipur','rajasthan','lucknow','mohali','punjab'];if(d.map!=null&&d.map!==''&&!['india','world'].includes(d.map))warn(i,L+'"map" india ya world ho.');if(!a.length)err(i,L+'"items" mein sheher chahiye.');else{if(a.length>(mk==='world'?8:10))warn(i,L+'items zyada — world 8, india 10 tak.');a.forEach((q,j)=>{const p=q.split('|').map(x=>x.trim()),ok=isFinite(parseFloat(p[1]))&&isFinite(parseFloat(p[2]));const WCt=window.CORE&&CORE.WCITY;if(!ok&&!(mk==='india'&&CT.includes(p[0].toLowerCase()))&&!(mk==='world'&&WCt&&WCt[p[0].toLowerCase()]))warn(i,L+'items['+j+'] "'+p[0]+'" ka jagah pata nahi — "naam|x|y" (map ke % mein) do.');});}if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>a.length))warn(i,L+'"hl" 0 ya 1-'+a.length+' ho.');}
    if(t==='prodnode'&&!(isStr(d.a)&&d.a.trim()&&isStr(d.b)&&d.b.trim()))err(i,L+'"a" aur "b" ("icon|label") chahiye.');
    if(t==='gauge'&&d.v!=null&&d.v!==''&&(!isFinite(+d.v)||+d.v<0||+d.v>1))warn(i,L+'"v" 0 se 1 ke beech ho.');
    if(t==='ideatitle'&&!(isStr(d.big)&&d.big.trim())&&!(isStr(d.small)&&d.small.trim()))err(i,L+'"big" ya "small" chahiye.');
    if(t==='chipcarousel'){const m=Array.isArray(d.chips)?d.chips.filter(x=>isStr(x)&&x.trim()).length:0;if(m<3)err(i,L+'"chips" mein 3-8 "icon|label" chahiye.');else if(d.chips.length>8)warn(i,L+'chips 8 se zyada — sirf pehle 8.');}
    if(t==='flowline'){const m=Array.isArray(d.nodes)?d.nodes.filter(x=>isStr(x)&&x.trim()).length:0;if(m<2)err(i,L+'"nodes" mein 2-4 naam chahiye.');else if(d.nodes.length>4)warn(i,L+'nodes 4 se zyada — sirf pehle 4.');if(d.mode!=null&&d.mode!==''&&!['chain','fan'].includes(d.mode))warn(i,L+'"mode" chain ya fan ho.');}
    if(t==='chatmock'){if(!(isStr(d.q)&&d.q.trim()))err(i,L+'"q" (typed prompt) chahiye.');if(Array.isArray(d.chips)&&d.chips.length>4)warn(i,L+'chips 4 se zyada — sirf pehle 4.');}
    if(t==='statcard'){if(d.n==null||d.n===''||!isFinite(+d.n))err(i,L+'"n" number chahiye (Rahul ka asli, confirmed number).');if(Array.isArray(d.side)&&d.side.length>2)warn(i,L+'side 2 se zyada — sirf pehle 2.');}
    if(t==='thumbwall'){if(d.n!=null&&d.n!==''&&(!isFinite(+d.n)||+d.n<4||+d.n>12))warn(i,L+'"n" 4-12 ho.');if(d.hl!=null&&d.hl!==''&&(!isFinite(+d.hl)||+d.hl<0||+d.hl>12))warn(i,L+'"hl" 0..n ho.');}
    if(t==='ladder'){const m=Array.isArray(d.steps)?d.steps.filter(x=>isStr(x)&&x.trim()).length:0;if(m<3)err(i,L+'"steps" mein 3-4 chahiye.');else if(d.steps.length>4)warn(i,L+'steps 4 se zyada — sirf pehle 4.');}
    if(t==='ring'){if(d.n==null||d.n===''||!isFinite(+d.n))err(i,L+'"n" number chahiye.');if(Array.isArray(d.orbit)&&d.orbit.length>8)warn(i,L+'orbit 8 se zyada — sirf pehle 8.');}
    if(t==='measure'&&!(isStr(d.label)&&d.label.trim()))err(i,L+'"label" chahiye (jaise 6 to 8 inches).');
    if(t==='meme'&&!(isStr(d.img)&&d.img.trim()))warn(i,L+'"img" (reaction photo slot) do — abhi placeholder dikhega.');
    if(t==='meme'&&d.side!=null&&d.side!==''&&!/^[lr]$/.test(d.side))warn(i,L+'"side" l ya r ho.');
    if(t==='wavestrip'&&d.c!=null&&d.c!==''&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');
    if(t==='topicend'&&!(isStr(d.text)&&d.text.trim())&&!(isStr(d.topic)&&d.topic.trim()))warn(i,L+'"text" ya "topic" do (khali = sirf TOPIC ??).');
    if(t==='crossprice'&&d.price!=null&&String(d.price).length>14)warn(i,L+'"price" chhota ho.');
    if(t==='outword'){const w=isStr(d.words)?d.words.trim().split(/\s+/).filter(Boolean):[];if(!w.length)err(i,L+'"words" chahiye.');else if(w.length>4)warn(i,L+'words 4 se zyada — sirf pehle 4.');if(d.c!=null&&d.c!==''&&!/^[rb]$/.test(d.c))warn(i,L+'"c" r ya b ho.');}
    if(t==='chips'){const a=Array.isArray(d.chips)?d.chips.filter(x=>isStr(x)&&x.trim()).length:0,b=Array.isArray(d.thumbs)?d.thumbs.length:0;if(!a&&!b)err(i,L+'"chips" ya "thumbs" chahiye.');if(a>6)warn(i,L+'chips 6 se zyada — sirf pehle 6.');if(b>4)warn(i,L+'thumbs 4 se zyada — sirf pehle 4.');}
    if(t==='split'){const inn=d.inner;if(!inn||typeof inn!=='object'||!isStr(inn.type))err(i,L+'"inner" ({type,data}) chahiye.');else if(inn.type==='split')err(i,L+'inner mein split nahi chalta.');else if(inn.type==='clip'||inn.type==='phoneann'||inn.type==='presenter')warn(i,L+'inner "'+inn.type+'" split mein theek nahi chalta (clip sync/layout).');else{const r=S.check([{type:inn.type,dur:6,data:inn.data||{}}],env);r.errors.forEach(x=>err(i,L+'inner: '+x.m));r.warns.forEach(x=>warn(i,L+'inner: '+x.m));}
      const hp=isStr(d.pres)&&d.pres.trim(),hc=isStr(d.clip)&&d.clip.trim();if(!hp&&!hc)err(i,L+'"pres" (photo) ya "clip" chahiye — presenter gayab nahi hona chahiye.');else if(hc&&typeof window!=='undefined'&&window.CORE&&CORE.clipsReady&&CORE.clips&&!CORE.clips[d.clip.trim()])warn(i,L+'clip "'+d.clip+'" upload nahi — 🎞 Clips se upload karo.');if(d.side!=null&&d.side!==''&&d.side!=='l'&&d.side!=='r')warn(i,L+'"side" l ya r ho.');if(d.ratio!=null&&d.ratio!==''&&(!isFinite(+d.ratio)||+d.ratio<.45||+d.ratio>.75))warn(i,L+'"ratio" 0.45-0.75 ho.');}
    if(t==='iconscene'){const n=window.CORE&&CORE.icItems?CORE.icItems(d).length:0;if(!Array.isArray(d.items)||n<1)err(i,L+'\\"items\\" mein 1-4 \\"icon|label\\" chahiye.');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\\"c\\" y/g/r/b mein se ho.');}
    if(t==='burst'){if(!(d.n!=null&&d.n!==''&&isFinite(+d.n))&&!(isStr(d.big)&&d.big.trim()))err(i,L+'\"n\" (number) ya \"big\" (text) chahiye.');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='variety'){if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'\"c\" y/g/r/b mein se ho.');}
    if(t==='vsvlog'){const ok=(x,y)=>(isStr(d[x])&&d[x].trim())||(isStr(d[y])&&d[y].trim());if(!ok('la','a')||!ok('lb','b'))err(i,L+'\"la/a\" aur \"lb/b\" dono side chahiye.');}
    if(t==='energy'){if(d.n!=null&&d.n!==''&&(!isFinite(+d.n)||+d.n<2||+d.n>8))warn(i,L+'\"n\" 2 se 8 ke beech ho.');}
    if(t==='bestlast'){if(d.pts!=null&&!Array.isArray(d.pts))err(i,L+'\"pts\" list hona chahiye.');else if(d.pts&&d.pts.length>10)warn(i,L+'pts 10 se zyada — sirf pehle 10.');}
    if(t==='locked'){const n=window.CORE&&CORE.lkItems?CORE.lkItems(d).length:0;if(!Array.isArray(d.items)||n<1)err(i,L+'\"items\" mein 1-3 bhare card chahiye (नाम|छोटी लाइन).');else if(d.items.length>3)warn(i,L+'items 3 se zyada — sirf pehle 3.');if(d.total!=null&&d.total!==''&&(!isFinite(+d.total)||+d.total<2||+d.total>4))warn(i,L+'\"total\" 2 se 4 ke beech ho.');}
    if(t==='longstat'){const h=x=>d[x]!=null&&d[x]!==''&&isFinite(+d[x]);if(!h('n1')&&!h('n2'))err(i,L+'\"n1\" ya \"n2\" (number) chahiye.');}
    if(t==='offer'){if(d.dots!=null&&d.dots!==''&&(!isFinite(+d.dots)||+d.dots<10||+d.dots>90))warn(i,L+'\"dots\" 10 se 90 ke beech ho.');if(d.pick!=null&&d.pick!==''&&d.pick!=='yes'&&d.pick!=='no')warn(i,L+'\"pick\" yes ya no ho.');}
    if(t==='products'){const n=window.CORE&&CORE.prItems?CORE.prItems(d).length:0;if(!Array.isArray(d.items)||n<1)err(i,L+'\"items\" mein 1-4 product chahiye.');else if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4.');if(d.pts!=null&&!Array.isArray(d.pts))err(i,L+'\"pts\" list hona chahiye.');}
    if(t==='endscreen'){if(!(isStr(d.vt)&&d.vt.trim())&&!d.vi)warn(i,L+'\"vt\" (video ka naam) ya \"vi\" (thumbnail) dena behtar.');}
    if(t==='chip'){if(!isStr(d.name)||!d.name.trim())err(i,L+'"name" chahiye (chip ka naam).');if(d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='options'){const n=window.CORE&&CORE.optItems?CORE.optItems(d).length:0;if(!Array.isArray(d.items)||n<2)err(i,L+'"items" mein 2-4 option chahiye (title|line|icon).');else{if(d.items.length>4)warn(i,L+'items 4 se zyada — sirf pehle 4 dikhenge.');}
      if(d.pills!=null&&!Array.isArray(d.pills))err(i,L+'"pills" list hona chahiye (text|rang).');else if(d.pills&&d.pills.length>2)warn(i,L+'pills 2 se zyada — sirf pehli 2 dikhengi.');
      if(d.hl!=null&&n&&(!(d.hl>=1)||d.hl>n))warn(i,L+'"hl" 1 se '+n+' ke beech ho.');}
    if(t==='tiles'||t==='levels'){const n=window.CORE&&CORE.tileItems?CORE.tileItems(d).length:0,mx=t==='tiles'?6:6;
      if(!Array.isArray(d.items)||n<2)err(i,L+'"items" mein kam se kam 2 line chahiye.');else{if(d.items.length>mx)warn(i,L+'items '+mx+' se zyada — sirf pehli '+mx+' dikhengi.');d.items.forEach((q,j)=>{if(isStr(q)&&q.split('|')[0].length>34)warn(i,L+'items['+j+'] ka label lamba (34 tak).');});}
      if(t==='levels'&&d.hl!=null&&(!(d.hl>=1)||d.hl>n))warn(i,L+'"hl" 1 se '+n+' ke beech ho.');
      if(t==='tiles'&&d.c!=null&&!/^[ygrb]$/.test(d.c))warn(i,L+'"c" y/g/r/b mein se ho.');}
    if(t==='compare'){const R=window.CORE&&CORE.compareRows?CORE.compareRows(d):{a:[],b:[]};
      if(!Array.isArray(d.a)||!Array.isArray(d.b)||!R.a.length||!R.b.length)err(i,L+'"a" aur "b" dono list chahiye, har ek mein 1-6 line.');
      else{if(d.a.length>6||d.b.length>6)warn(i,L+'a/b mein 6 se zyada line — sirf pehli 6 dikhengi.');[].concat(d.a,d.b).forEach((q,j)=>{if(isStr(q)&&q.length>40)warn(i,L+'lamba line ('+q.length+' akshar, 40 tak).');});}
      if(d.ma!=null&&!/^(tick|cross)$/.test(d.ma))warn(i,L+'"ma" tick ya cross ho.');if(d.mb!=null&&!/^(tick|cross)$/.test(d.mb))warn(i,L+'"mb" tick ya cross ho.');}
    if(t==='spot'){if(d.box!=null&&!(window.CORE&&CORE.spotBox&&CORE.spotBox(d.box)))err(i,L+'"box" 4 number chahiye 0-1 mein: x,y,w,h (jaise 0.3,0.35,0.4,0.15), x+w aur y+h 1 se zyada nahi.');
      if(d.zoom!=null&&!(d.zoom>=1&&d.zoom<=2.2))warn(i,L+'"zoom" 1 se 2.2 ke beech ho.');}
    if(t==='crowd'){if(d.total!=null&&!(d.total>=10&&d.total<=200))warn(i,L+'\"total\" 10 se 200 ke beech ho (default 100).');
      if(d.hi!=null&&(!(d.hi>=0)||d.hi>(d.total||100)))err(i,L+'\"hi\" 0 se total ke beech ho.');
      if(d.c!=null&&!/^[ygr]$/.test(d.c))warn(i,L+'\"c\" y/g/r mein se ho.');}
    if(t==='chapter'){if(!isStr(d.title)||!d.title.trim())err(i,L+'\"title\" chahiye (chapter ka naam).');if(d.num!=null&&String(d.num).length>3)warn(i,L+'\"num\" chhota rakho (jaise 02).');}
    if(t==='stack'){if(!Array.isArray(d.items)||d.items.filter(x=>isStr(x)&&x.trim()).length<2)err(i,L+'\"items\" mein kam se kam 2 line chahiye.');
      else{if(d.items.length>9)warn(i,L+'items 9 se zyada — sirf pehli 9 dikhengi.');d.items.forEach((q,j)=>{if(isStr(q)&&q.length>40)warn(i,L+'items['+j+'] lamba ('+q.length+' akshar, 40 tak).');});
        if(d.hl!=null&&(!(d.hl>=1)||d.hl>d.items.length))warn(i,L+'\"hl\" 1 se '+d.items.length+' ke beech ho.');}}
    if(t==='curve'){const cs=window.CORE&&CORE.curveSpec?CORE.curveSpec(d):[];if(!cs.length)err(i,L+'\"y1\" mein kam se kam 2 number chahiye (jaise 5,12,40,90).');
      if(cs.length&&cs.some(c=>c.pts.length>12))warn(i,L+'12 se zyada point — curve bhari lagegi.');
      if(d.y2!=null&&String(d.y2).trim()&&cs.length<2)warn(i,L+'\"y2\" mein 2 number chahiye, nahi to dusri curve nahi dikhegi.');
      if(d.xl!=null&&!Array.isArray(d.xl))err(i,L+'\"xl\" list hona chahiye (x-axis labels).');
      ['c1','c2'].forEach(k=>{if(d[k]!=null&&!/^[gry]$/.test(d[k]))warn(i,L+'\"'+k+'\" g/r/y mein se ho.');});
      ['mark1','mark2'].forEach(k=>{if(d[k]&&!/^\d+\s*:\s*\S/.test(d[k]))warn(i,L+'\"'+k+'\" aise likho: 3:Peak');});}
    if(t==='cta'){if(d.mode!=null&&d.mode!=='like'&&d.mode!=='end')err(i,L+'"mode" "like" ya "end" hona chahiye.');}
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
