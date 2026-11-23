// C11 (generic): scene editor. SE.init(player, setScenesFn). No script/video specific content.
(function(){
'use strict';
const C=window.CORE;
const KEYS={wide:'cvt_scenes',short:'cvt_scenes_short'};
const keyOf=()=>KEYS[C.format]||KEYS.wide;
const TYPES_W=['hook','title','stat','retain','watch','rumour','anth','intro','presenter','cta','curve','stack','chapter','crowd','bigwords','qcards','spot','compare','tiles','levels','chip','options','stat2','bars','dash','trio','rating','portrait','phone','winprob','h2h','pitch','xi','market','comments','timeline','hub','search','formula','beforeafter','setting','radio','ideas','reel','phones','gcurve','steps','expect','equals','payoff','tickgrid','variety','vsvlog','energy','bestlast','locked','longstat','offer','products','endscreen','burst','clip','diamond','kinetic','barcount','quote','post','iconscene','bullets','phoneann','phonewall','numgrid','compare2','plans','timelist','ctapill','adcard','uimock','checklist','chips','split','icontiles','stepcards','screenclip','toggle','askq','promo','outword','flowdiag','crossprice','docfolder','topicend','measure','meme','wavestrip','ideatitle','chipcarousel','flowline','chatmock','statcard','thumbwall','ladder','ring','vidcard','gauge','barlist','tree','cardtiles','fan','replies','vs2','bonus','prodnode','dotmap'],TYPES_S=['short_hook','short_stat','short_cta'];
const types=()=>C.format==='short'?TYPES_S:TYPES_W;
const TRS=['cut','fade','grunge','zoom','whip','glitch','flash','slideup','push','iris','blinds','rgb','spin','lightwipe','tiles','blurfade','split','chevron','torn'];
const DEF={
 hook:{dur:4,data:{pre:'ऊपर की लाइन',to:10,dec:0,unit:'करोड़'}},
 title:{dur:4,data:{city:'mumbai',headline:'हेडलाइन यहाँ',sub:'सब-हेडिंग',ticker:'टिकर टेक्स्ट यहाँ'}},
 stat:{dur:4.5,data:{photo:'',pre:'छोटी लाइन',prefix:'₹',to:10,dec:0,unit:'करोड़',head:'हेडलाइन',sub:'',lt:'red',tag:true}},
 retain:{dur:4.5,data:{city:'mumbai',photo:'',name:'नाम',amount:'₹ 10 CR',stamp:'retain',note:'नोट'}},
 watch:{dur:5,data:{title:'नज़र रहेगी',names:['नाम 1','नाम 2'],photos:[],note:''}},
 rumour:{dur:5,data:{head:'हेडलाइन',sub:'',photos:[]}},
 anth:{dur:5,data:{title:'',qs:['सवाल 1','सवाल 2','सवाल 3'],cta:''}},
 intro:{dur:4,data:{line1:'लाइन 1',line2:'लाइन 2'}},
 cta:{dur:4,data:{mode:'like',title:'',line:''}},
 bigwords:{dur:5,data:{a:'CTR',b:'Watch time',join:'+',pills:[],title:'',ca:'y',cb:'g'}},
 qcards:{dur:7,data:{title:'',qs:['सवाल 1','सवाल 2','सवाल 3'],hl:0}},
 tiles:{dur:6,data:{title:'',items:['वीडियो एडिटिंग|+₹1,200|06_icons/icon_bat','थंबनेल डिज़ाइन|+₹900','स्क्रिप्टिंग|+₹700'],c:'g',banner:''}},
 levels:{dur:6,data:{title:'',items:['लेवल 1','लेवल 2','लेवल 3'],done:'1',lock:'3',hl:2,pill:''}},
 chip:{dur:4,data:{title:'',name:'Cricket Studio',by:'by Rahul',icon:'',c:'y'}},
 options:{dur:6,data:{title:'',items:['तेज़ तरीका|छोटी लाइन','धीमा तरीका|छोटी लाइन','अपने आप|छोटी लाइन'],pills:['जल्दी चाहिए?|g','अपने आप खुलता है|x'],hl:0}},
 stat2:{dur:6,data:{title:'',n1:1000,l1:'पहला नंबर',n2:4000,l2:'दूसरा नंबर',p1:'',s1:'',p2:'',s2:'',c1:'g',c2:'y',mid:'→',pill:''}},
 bars:{dur:7,data:{title:'',items:['पहला|5','दूसरा|4','तीसरा|2','चौथा|1'],unit:'मिनट',c:'g',total:true}},
 winprob:{dur:8,data:{title:'जीत का चांस',a:'टीम A',b:'टीम B',pa:55,note:'पिच देखकर थोड़ा बदल सकता है'}},
 h2h:{dur:8,data:{title:'आमने-सामने',a:'टीम A',b:'टीम B',wa:12,wb:9,fa:'WWLWL',fb:'LWWLW',note:''}},
 pitch:{dur:8,data:{title:'पिच रिपोर्ट',type:'बल्लेबाज़ी पिच',items:['पहली पारी औसत|172','चेज़ जीत|58%','पावरप्ले रन|52'],toss:'टॉस जीतो, पहले गेंदबाज़ी',note:''}},
 xi:{dur:10,data:{title:'प्लेइंग XI',team:'टीम A',c:'y',players:['खिलाड़ी 1 (C)','खिलाड़ी 2','खिलाड़ी 3'],note:''}},
 dash:{dur:7,data:{title:'',tiles:['लेबल 1|1,200|+5%','लेबल 2|340|-2%','लेबल 3|58%','लेबल 4|12'],pts:['3','5','4','8','12','10','15'],note:'',c:'g'}},
 trio:{dur:7,data:{title:'3 चीज़ों पर निर्भर',head:'मुख्य बात',items:['पहली चीज़|छोटी लाइन','दूसरी चीज़|छोटी लाइन','तीसरी चीज़|छोटी लाइन'],c:'y'}},
 rating:{dur:7,data:{title:'',head:'एक फ़ैन',stars:4,label:'रेटिंग',tiles:['कितना देखा|80%','पसंद आया?|हाँ'],c:'y'}},
 portrait:{dur:6,data:{title:'',text:'लिंक *डिस्क्रिप्शन* में',sub:'',photo:'19_presenter/presenter_point_left',side:'r',c:'y'}},
 phone:{dur:7,data:{title:'',feed:['पहली पोस्ट','दूसरी पोस्ट','तीसरी पोस्ट'],label:'इम्प्रेशन',n:1,c:'y'}},
 market:{dur:7,data:{title:'',tiles:['वीडियो|y','दर्शक|g','चैनल|b','मैच|r','खिलाड़ी|p','टीम|y','रन|g','विकेट|b'],pills:['करोड़ों वीडियो|y','करोड़ों दर्शक|g'],c:'y'}},
 comments:{dur:7,data:{title:'',items:['फ़ैन 1|पहला कमेंट यहाँ','फ़ैन 2|दूसरा कमेंट यहाँ','फ़ैन 3|तीसरा कमेंट यहाँ'],hl:2,pill:'सबसे आम सवाल',c:'y'}},
 timeline:{dur:6,data:{title:'',points:['2018','2020','2022','2024'],at:4,label:'हम यहाँ',c:'y'}},
 hub:{dur:8,data:{title:'',center:'मुख्य',spokes:['ऐप','फ़ोरम','म्यूज़िक','वीडियो','खबर','मैच'],note:'',c:'y'}},
 search:{dur:6,data:{title:'',text:'शमी राजस्थान',results:['पहला नतीजा','दूसरा नतीजा'],pill:'',c:'y'}},
 formula:{dur:7,data:{title:'',name:'CTR',a:'क्लिक',op:'÷',b:'इम्प्रेशन',la:'थंबनेल',lb:'टाइटल',c:'y'}},
 beforeafter:{dur:7,data:{title:'',before:'पुराना तरीका',after:'नया तरीका',bl:'पहले',al:'बाद में',bi:'',ai:'',bar:'',barlabel:''}},
 reel:{dur:7,data:{title:'',n:4.4,unit:'M',label:'व्यूज़',gauge:2,glabel:'2%',gl:'देखने वाले',c:'y'}},
 phones:{dur:7,data:{title:'',a:'फ़ोन की स्क्रीन',b:'दूसरी स्क्रीन',la:'फ़ोन',lb:'टीवी',hl:1,caption:'ज़्यादातर लोग फ़ोन पर देखते हैं',ia:'',ib:'',c:'y'}},
 gcurve:{dur:8,data:{title:'',gauge:18,glabel:'18%',gl:'CTR',pts:[100,72,50,36,28,22],cl:'रिटेंशन',c:'y'}},
 steps:{dur:7,data:{title:'',items:['पहला काम|छोटी लाइन','दूसरा काम|छोटी लाइन','तीसरा काम|छोटी लाइन'],hl:'',caption:'ज़्यादातर लोग उल्टा करते हैं',c:'y'}},
 expect:{dur:8,data:{title:'',thumb:'थंबनेल का वादा',ti:'',thought:'मैं कुछ नया सीखूँगा',user:'दर्शक',av:'',pill:'वादा पूरा हुआ',tick:true,c:'y'}},
 equals:{dur:8,data:{title:'',a:'पहली लाइन',av:'टाइटल',b:'पहला शॉट',bv:'थंबनेल',ex:'उदाहरण: शमी राजस्थान में?',c:'y'}},
 payoff:{dur:8,data:{title:'',a:'कॉन्टेक्स्ट',b:'पेऑफ़',ta:'0s',tb:'20s',q:3,qt:'',c:'y'}},
 tickgrid:{dur:8,data:{title:'',total:40,cols:10,quote:'आगे क्या होगा, देखना है',pts:[100,92,88,85],c:'g'}},
 clip:{dur:8,data:{title:'',clip:'',start:0,fit:'cover',src:'',name:'',role:'',sub:'',quote:false,c:'y'}},
 diamond:{dur:5,data:{title:'ख़बर क्या है',num:1,tag:'CHAPTER',icon:'',pill:'',c:'y'}},
 kinetic:{dur:5,data:{photo:'',words:'सबसे *बड़ी* खबर',sub:'',bw:true,c:'y'}},
 barcount:{dur:6,data:{title:'',items:['35|पहला','6|दूसरा'],unit:'%',max:'',hl:'',note:'',pill:'',c:'y'}},
 quote:{dur:7,data:{quote:'यहाँ *कोट* लिखो',name:'नाम',role:'',photo:'',side:'l',bw:true,crowd:true,c:'y'}},
 post:{dur:7,data:{title:'',name:'नाम',handle:'@handle',text:'पोस्ट का *ज़रूरी हिस्सा* यहाँ',img:'',avatar:'',stats:'',src:'',pile:0,theme:'light',c:'y'}},
 iconscene:{dur:7,data:{title:'',items:['🎟|टिकट','📱|फ़ोन'],btn:'',click:true,crowd:true,c:'y'}},
 phonewall:{dur:7,data:{title:'',n:4,shots:[],labels:[],mode:'fan',hl:0,c:'b'}},
 numgrid:{dur:7,data:{title:'',items:['9|पहला *कार्ड*','10|दूसरा कार्ड','11|तीसरा कार्ड'],hl:0,c:'b'}},
 compare2:{dur:7,data:{title:'',ia:'',ib:'',la:'पहला *विंडो*',lb:'दूसरा *विंडो*',ua:'',ub:'',hl:0,c:'b'}},
 plans:{dur:7,data:{title:'प्लान *चुनो*',items:['Pro|$20|*best* value','Max|$100|ज़्यादा काम'],hl:1,badge:'Most popular',c:'b'}},
 timelist:{dur:8,data:{title:'समय का *हिसाब*',items:['रिसर्च|15','स्क्रिप्ट|30','एडिटिंग|45'],unit:'min',total:'कुल: 90 min',c:'b'}},
 ctapill:{dur:6,data:{title:'अभी *जुड़ो*',btn:'Join Now',n:'14',nl:'दिन बाकी',note:''}},
 adcard:{dur:7,data:{title:'ऑफ़र',old:'$99',price:'$49',btn:'Buy now',proof:[],note:''}},
 uimock:{dur:8,data:{title:'',url:'',beats:['पहला *बीट*','दूसरा बीट'],options:['A|पहला','B|दूसरा','C|तीसरा'],pick:2,click:true}},
 checklist:{dur:8,data:{title:'checklist',items:['पहला *स्टेप*','दूसरा स्टेप','तीसरा स्टेप'],note:''}},
 chips:{dur:7,data:{title:'',chips:['पहला *स्किल*','दूसरा *स्किल*'],thumbs:[],pills:['लेफ़्ट','राइट']}},
 icontiles:{dur:7,data:{title:'',items:['06_icons/icon_tile_neon_bat_red|Batting|r','06_icons/icon_tile_neon_cricket_ball_green|Bowling|g','06_icons/icon_tile_neon_keeper_gloves_orange|Fielding|y'],hl:0}},
 stepcards:{dur:7,data:{head:'Step no.2',items:['Khabar','Verify','Script'],hl:0,c:'b'}},
 screenclip:{dur:9,data:{mode:'phone',title:'',clip:'',shot:'',start:0,focus:'20|55|60|14',at:1.5,tap:true,label:'यहाँ टैप करो'}},
 toggle:{dur:7,data:{title:'',items:['पुरानी बात|x','असली खबर|v'],hl:0}},
 askq:{dur:8,data:{head:'MOSTLY ASKED QUESTION?',name:'@fan',text:'भाई ये खबर पक्की है क्या?',audio:true}},
 promo:{dur:8,data:{name:'Channel naam',logo:'',subs:'',thumbs:['','',''],btn:'SUBSCRIBE',note:''}},
 outword:{dur:6,data:{words:'CONFIRMED',img:'',sub:'',c:'r'}},
 flowdiag:{dur:8,data:{a:'',b:'',la:'पहले',lb:'बाद में',result:'साफ़ नतीजा',wave:true,c:'b'}},
 crossprice:{dur:6,data:{img:'',price:'$10,000',label:'',cross:true}},
 docfolder:{dur:6,data:{doc:'',folder:true,label:''}},
 topicend:{dur:7,data:{text:'अगले वीडियो में मिलते हैं',topic:'TOPIC ??'}},
 measure:{dur:7,data:{img:'',label:'6 to 8 inches',sub:'Side angle'}},
 meme:{dur:4,data:{img:'',text:'',side:'r'}},
 wavestrip:{dur:7,data:{name:'ME',img:'',text:'',c:'b'}},
 vidcard:{dur:7,data:{clip:'',shot:'',start:0,title:'',meta:''}},
 gauge:{dur:7,data:{label:'High',v:0.8,n:'',c1:'66%|Label',c2:'48%|Label'}},
 barlist:{dur:7,data:{title:'Top',items:['पहला|42','दूसरा|30','तीसरा|18'],suf:'%'}},
 tree:{dur:8,data:{root:'ऊपर',l2:['A','B'],l3:['C','D','E','F']}},
 cardtiles:{dur:7,data:{items:['🏏|पहला','🎯|दूसरा','🧤|तीसरा'],brace:''}},
 fan:{dur:8,data:{src:'प्रॉम्प्ट',outs:['Script|By Claude','Voice|By AI','Video']}},
 replies:{dur:8,data:{src:'सवाल',items:['@fan1|पहला कमेंट','@fan2|दूसरा कमेंट','@fan3|तीसरा कमेंट']}},
 vs2:{dur:7,data:{a:'A',sa:'',b:'B',sb:'',pill:''}},
 bonus:{dur:6,data:{a:'Bonus Idea 1',ta:'',b:'Bonus Idea 2',tb:'',icon:'🎁'}},
 dotmap:{dur:8,data:{title:'10 टीमें, 10 शहर',map:'india',items:['Mumbai','Chennai','Kolkata','Delhi'],hl:0,sub:''}},
 prodnode:{dur:7,data:{a:'🏏|पहला',b:'🏆|दूसरा',c:''}},
 ideatitle:{dur:5,data:{small:'Video idea 1',big:'Team ki khabar'}},
 chipcarousel:{dur:7,data:{title:'',chips:['🏏|Batting','🎯|Bowling','🧤|Fielding','📊|Records'],hl:2}},
 flowline:{dur:8,data:{title:'',nodes:['खबर','वेरिफाई','स्क्रिप्ट'],mode:'chain',pill:''}},
 chatmock:{dur:9,data:{ph:'How can I help you today?',q:'आज की टॉप 5 क्रिकेट खबरें बताओ',chips:['खबर 1','खबर 2','खबर 3'],note:''}},
 statcard:{dur:7,data:{n:100,dec:0,pre:'',suf:'',label:'Label',side:[],blur:true,rain:true}},
 thumbwall:{dur:7,data:{thumbs:[],n:9,hl:3,label:''}},
 ladder:{dur:8,data:{title:'',steps:['🥇|पहला','🥈|दूसरा','🥉|तीसरा'],hl:0}},
 ring:{dur:7,data:{n:10,label:'Teams',orbit:['🏏','🏆','🎯','🧤']}},
 split:{dur:8,data:{inner:{type:'bullets',data:{title:'',items:['पहली *लाइन*','दूसरी लाइन','तीसरी *लाइन*']}},pres:'19_presenter/presenter_point_left',clip:'',start:0,side:'l',ratio:0.6}},
 bullets:{dur:7,data:{title:'आज की *खबर*',items:['पहली लाइन में *ज़रूरी* शब्द','दूसरी लाइन में *नीला* शब्द','तीसरी *लाइन*'],c:'b'}},
 phoneann:{dur:7,data:{title:'',clip:'',start:0,shot:'',arrows:['यहाँ *देखो*|50|30','ये *शॉट*|50|70'],sub:'',c:'b'}},
 burst:{dur:6,data:{title:'',shot:'',n:375,dec:0,pre:'',unit:'x',label:'ज़्यादा व्यूज़',pill:'',c:'y'}},
 variety:{dur:8,data:{title:'',vl:'10 सेकंड तक कोई कट नहीं',vi:'',emoji:'😴',et:'दर्शक बोर हो जाते हैं',bar:'बोरियत',c:'r'}},
 vsvlog:{dur:7,data:{title:'',la:'सिर्फ़ खबर',a:'सीधी खबर, कोई कहानी नहीं',lb:'खबर + कहानी',b:'वजह बताओ, दर्शक रुकेंगे',c:'y'}},
 energy:{dur:9,data:{title:'',h:'हुक',p:'पेऑफ़',n:5,dl:'ऊर्जा गिरती है',sl:'हर मोड़ पर नया कारण',c:'y'}},
 bestlast:{dur:8,data:{title:'',label:'सबसे अच्छा अंत में',pts:[100,78,55,40,36,36],c:'g'}},
 locked:{dur:8,data:{title:'',items:['पहला|आज का वीडियो'],total:4,pill:'बाक़ी अगले वीडियो में',c:'y'}},
 longstat:{dur:8,data:{title:'',head:'लंबे वीडियो',n1:1000,l1:'पहला आँकड़ा',n2:7421,l2:'दूसरा आँकड़ा',pill:'फ़र्क़ बड़ा है',c1:'g',c2:'r'}},
 offer:{dur:9,data:{title:'',dots:50,you:'आप',av:'',oh:'ऑफ़र',ot:'क्या आप यह मौक़ा लेंगे?',yes:'स्वीकार',no:'मना करें',pick:'yes',c:'y'}},
 products:{dur:9,data:{title:'',items:['कोर्स','टेम्पलेट'],gl:'फिर लॉन्च',pts:[10,14,22,40,70],c:'y'}},
 endscreen:{dur:8,data:{title:'Watch next',vt:'Next video title',ch:'99 Cricket News',views:'1.2K views',vi:'',sub:'Subscribe',c:'r'}},
 setting:{dur:6,data:{title:'',step:'सेटिंग 3',name:'कीवर्ड',pills:['चैनल नाम','गलत स्पेलिंग','आपका niche'],c:'y'}},
 radio:{dur:7,data:{title:'',items:['सबके लिए','सिर्फ बड़ों के लिए','बच्चों के लिए'],hl:[1,2],pill:'बच्चों के लिए नहीं|g',c:'y'}},
 ideas:{dur:7,data:{title:'',items:['पहला आइडिया|छोटी लाइन','दूसरा आइडिया|छोटी लाइन','तीसरा आइडिया|छोटी लाइन'],avatar:'आपकी ऑडियंस',av:'',c:'y'}},
 compare:{dur:7,data:{title:'',la:'Pros',lb:'Cons',a:['Point 1','Point 2','Point 3'],b:['Point 1','Point 2'],ma:'tick',mb:'cross',ca:'g',cb:'r'}},
 spot:{dur:6,data:{title:'',shot:'',box:'0.3,0.35,0.4,0.15',label:'यहाँ क्लिक करो',pill:'',cursor:true,click:true,zoom:1.35}},
 crowd:{dur:7,data:{title:'100 लोगों में से',total:100,hi:10,label:'10% देखते हैं',sub:'',c:'y',scatter:true}},
 chapter:{dur:3,data:{num:'01',title:'चैप्टर का नाम',pill:'',lock:true}},
 stack:{dur:7,data:{title:'9 चैप्टर',items:['चैप्टर 1','चैप्टर 2','चैप्टर 3','चैप्टर 4'],hl:2,pill:'',done:'1',mark:''}},
 curve:{dur:6,data:{title:'ग्रोथ',xl:['Day 1','Day 2','Day 7','Day 25'],y1:'5,12,40,90',l1:'ग्रोथ',c1:'g',mark1:'',y2:'',l2:'',c2:'r',mark2:'',note:''}},
 presenter:{dur:5,data:{channel:'99cricketnews',name:'Yuvraj Sisodiya',sub:'क्रिकेट की हर खबर',photos:[''],key:'auto',swap:1.4}},
 short_hook:{dur:3.5,data:{pre:'ऊपर की लाइन',to:10,dec:0,unit:'करोड़',post:''}},
 short_stat:{dur:4,data:{photo:'',pre:'छोटी लाइन',prefix:'₹',to:10,dec:0,unit:'करोड़',head:'हेडलाइन',sub:'',lt:'red',tag:true}},
 short_cta:{dur:3.5,data:{line1:'What do you think?',line2:'Tell us in the comments',cta:'Subscribe to the channel'}}
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
    r.appendChild(el('span','flex:1;color:#f96','✗ '+PH().label(id)+'  (scene '+need[id].join(', ')+')'));r.appendChild(uploadBtn('अपलोड',()=>id,null));if(window.PHB&&PHB.googleBtn)r.appendChild(PHB.googleBtn(id));box2.appendChild(r);});
  if(window.PHB&&PHB.summaryExtra)PHB.summaryExtra(box2,el,btn);
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
  add.appendChild(btn('⬆ JSON save',()=>{const a=el('a');let ss=SE.scenes;try{const sc=localStorage.getItem('cvt_tp_script');if(sc&&ss.length){ss=JSON.parse(JSON.stringify(ss));ss[0].script=sc;}}catch(e){}a.href=URL.createObjectURL(new Blob([JSON.stringify(ss,null,1)],{type:'application/json'}));a.download='scenes.json';a.click();}));
  const fi=el('input');fi.type='file';fi.accept='.json';fi.id='se_json';fi.style.display='none';
  fi.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{let j=JSON.parse(await f.text());if(j&&!Array.isArray(j)&&Array.isArray(j.scenes)){const ws=typeof j.script==='string'?j.script:'';j=j.scenes;if(ws&&j[0]&&typeof j[0].script!=='string')j[0].script=ws;}if(!Array.isArray(j))throw new Error('array chahiye');const nw=window.PHOTOS&&PHOTOS.autoFromScenes?PHOTOS.autoFromScenes(j):[];const rp=window.SCHK?SCHK.report(j):null;if(rp&&nw.length)rp.text+='\n🆕 '+nw.length+' naye photo naam apne aap bane: '+nw.join(', ')+' — ab bas 📷 se photo upload karo.';if(rp&&!rp.ok){SE.msg='⬇ Load nahi hua (error hain):\n'+rp.text;render();return;}SE.scenes=j;SE.sel=0;await apply(false);if(rp){SE.msg=rp.text;render();}
  // C172: pehle scene ke top-level "script" ko teleprompter ki script bana do (teleprompter.html isi browser/domain par script yahin se padhta hai)
  try{const sf=j.find(x=>x&&typeof x.script==='string'&&x.script.trim()),sj=sf?sf.script.trim():'';if(sj){localStorage.setItem('cvt_tp_script',sj);SE.msg=(SE.msg?SE.msg+'\n':'')+'🎤 Script teleprompter mein bhej di ('+sj.split(/\s+/).length+' shabd). Teleprompter mein apne aap aa jayegi (khula ho to turant badal jaati hai).';render();}}catch(e){}}catch(err){alert('JSON error: '+err.message);}};
  add.appendChild(btn('⬇ JSON load',()=>fi.click()));add.appendChild(fi);
  add.appendChild(btn('Sab hatao',()=>{if(confirm('Sab scenes hata dun?')){SE.scenes=[];SE.sel=0;C.setScenes([]);save();render();SE.P.draw();}}));
  add.appendChild(btn('🎙 Chunk baanto',async()=>{const r=FIT.autoAssign();SE.msg=r.msg;await apply(true);SE.msg=r.msg;render();},'#2a6'));
  add.appendChild(btn('⏱ Audio ke hisaab se fit',async()=>{const r=FIT.run();SE.msg=r.msg;if(r.ok){await apply(true);SE.msg=r.msg+'\nVideo '+C.total.toFixed(1)+'s ↔ audio '+r.audioEnd.toFixed(1)+'s';}render();},'#2a6'));
  add.appendChild(btn('✔ JSON check',()=>{if(window.PHOTOS&&PHOTOS.autoFromScenes)PHOTOS.autoFromScenes(SE.scenes);const r=window.SCHK?SCHK.report(SE.scenes):{text:'checker load nahi hua'};SE.msg=r.text;render();},'#2a6'));
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
      {const l=el('label','margin-right:10px;display:block;margin-top:4px','Header (upar, *shabd* = peela) ');const n=el('input','width:70%');n.type='text';n.value=sc.header||'';n.onchange=()=>{if(n.value.trim())sc.header=n.value;else delete sc.header;apply(true);};l.appendChild(n);f.appendChild(l);}
      {const l=el('label','margin-right:10px;display:block;margin-top:4px','Pills (text|g ; text|r ; text|y) ');const n=el('input','width:70%');n.type='text';n.value=window.PILLS?PILLS.str(sc.pills):'';n.onchange=()=>{const v=window.PILLS?PILLS.parse(n.value):[];if(v.length)sc.pills=v;else delete sc.pills;apply(true);};l.appendChild(n);f.appendChild(l);}
      if(i>0){const l=el('label','margin-right:10px','Transition ');const s=el('select');TRS.forEach(t=>{const o=el('option',null,t);o.value=t;if((sc.tr||'cut')===t)o.selected=true;s.appendChild(o);});s.onchange=()=>{sc.tr=s.value;apply(true);};l.appendChild(s);f.appendChild(l);f.appendChild(num('trDur',sc.trDur!=null?sc.trDur:.5,v=>sc.trDur=Math.max(0,v)));}
      if(sc.type==='clip'&&window.CLIPCTL)CLIPCTL.controls(sc,f,el,apply);
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
