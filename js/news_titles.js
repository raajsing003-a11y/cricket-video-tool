// C182: news card ke liye 4 YouTube title ideas (Rahul ke 3 yt_titles docx ka style: CAPS hook + emoji + detail + | IPL 2027).
// Rule-based (AI nahi): khabar ki headlines se khiladi/team/event/₹ number nikaal ke 4 alag style ke title. Sirf idea — video banane se pehle dekhne ke liye.
// API: window.TITLEGEN(story,{names:[..],team:'..'}) -> [{t:'title',style:'..'}] (4). window.TITLE_STYLE_TXT = Gemini prompt mein jaane wali style line.
(function(){
const SHORT={'Rajasthan Royals':'RR','Lucknow Super Giants':'LSG','Chennai Super Kings':'CSK','Royal Challengers Bengaluru':'RCB','Mumbai Indians':'MI','Kolkata Knight Riders':'KKR','Sunrisers Hyderabad':'SRH','Delhi Capitals':'DC','Punjab Kings':'PBKS','Gujarat Titans':'GT'};
const EV=[ // pehla match jeetta hai
 ['retire',/retire/i],['injury',/injur|ruled out|fitness|miss(es|ing)? /i],['captain',/captain|skipper/i],
 ['trade',/trade|swap|traded|move to|moves to|join(s|ed)? /i],['release',/releas|let go|axed|dropped|part ways/i],
 ['retain',/retain|retention/i],['auction',/auction|purse|slots?/i],['squad',/squad|named|picked|selected|playing xi|\bxi\b/i],
 ['win',/\bwon\b|\bwins?\b|beat|defeat|victory/i],['lose',/\blost\b|\bloses?\b|all out|humiliat|collapse/i],['coach',/coach|support staff/i]];
const HOOKS={
 trade:['WAIT, WHAT?! 😭','THIS TRADE MAKES NO SENSE!! 💀','I DIDN\'T EXPECT THIS!! 😱','THIS CHANGES EVERYTHING!! 👀'],
 release:['SHOCKING RELEASE!! 😭','THEY REALLY LET HIM GO?! 💀','WHAT ARE THEY DOING?! 😭','BIGGEST RELEASE SHOCK!! 😱'],
 retain:['THEY ARE STAYING!! 🔥','THIS IS A BIG CALL!! 👀','I\'M NOT SURPRISED!! 😮','RETENTION TWIST!! 😱'],
 retire:['IT\'S REALLY OVER.. 😭','END OF AN ERA!! 💔','I CAN\'T BELIEVE THIS!! 😭','THIS HURTS!! 💔'],
 injury:['BAD NEWS!! 😭','THIS IS A HUGE BLOW!! 💀','NOT AGAIN!! 😭','WE CAN\'T LOSE HIM!! 😭'],
 captain:['NEW CAPTAIN?! 😳','THIS IS A BOLD CALL!! 👀','I\'M SHOCKED!! 😱','CAPTAINCY DRAMA!! 🔥'],
 auction:['THIS CHANGES THE AUCTION!! 👀','HUGE PURSE TWIST!! 😱','THIS IS GETTING WILD!! 🔥','AUCTION ALERT!! 🚨'],
 squad:['FINALLY!! 😭','SQUAD IS OUT!! 👀','WHAT IS THIS SQUAD?! 😭','BIG SURPRISES!! 😱'],
 win:['WE DID IT!! 🔥','WHAT A WIN!! 😭','THIS WAS NEEDED!! 🔥','THEY DELIVERED!! 💪'],
 lose:['WE JUST GOT HUMILIATED!! 😭','I CAN\'T DEFEND THIS!! 💀','THIS IS EMBARRASSING!! 😭','WHAT WAS THAT?! 💀'],
 coach:['BIG CHANGE!! 👀','THIS IS UNEXPECTED!! 😱','NEW ERA?! 🔥','SURPRISE MOVE!! 😮'],
 other:['THIS IS BIG!! 😱','YOU WON\'T BELIEVE THIS!! 👀','WHAT IS HAPPENING?! 😭','BREAKING!! 🚨']};
const VERB={trade:'Trade',release:'Release',retain:'Retention',retire:'Retirement',injury:'Injury Update',captain:'Captaincy',auction:'Auction Update',squad:'Squad',win:'Heroics',lose:'Flop Show',coach:'Coach Move',other:'Update'};
function pick(a,k){return a[k%a.length];}
function hash(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
function cut(t,n){t=clean(t);if(t.length<=n)return t;const p=t.lastIndexOf(' | ');if(p>20&&p<=n)return t.slice(0,p);return t.slice(0,n-1).replace(/[\s|,\-:]+\S*$/,'')+'…';}
window.TITLE_STYLE_TXT='Title style (Rahul ke competitor titles jaisa): pehle CAPS mein emotional hook + emoji (😭💀🔥👀😱), phir khiladi/team ka naam aur ek pakka detail (number/₹ jo story pack mein ho), aakhir mein "| IPL 2027" jaisa tag. 100 akshar se kam. Rumor ko pakka mat likho (? lagao). Words rumor/official/afwah title mein mat likho. English/Hinglish (Roman) mein.';
window.TITLEGEN=function(st,h){
 h=h||{};const items=(st.items||[]),text=items.map(i=>i.title||'').join(' | ')+' '+(st.title||'');
 let ev='other';for(const e of EV){if(e[1].test(text)){ev=e[0];break;}}
 const names=(h.names||[]).filter(n=>n&&n.length>2&&!/kings|royals|indians|giants|riders|capitals|titans|sunrisers|challengers|super|bcci|ipl/i.test(n)).slice(0,2);
 const team=h.team&&SHORT[h.team]?SHORT[h.team]:'';
 const ym=/IPL\s*(20\d\d)/i.exec(text),tag=(st.tags||[]).includes('India Match')?(/(?:India|IND)\s+(?:vs?\.?|v)\s+([A-Z][A-Za-z]+)/i.exec(text)?'IND vs '+/(?:India|IND)\s+(?:vs?\.?|v)\s+([A-Z][A-Za-z]+)/i.exec(text)[1].slice(0,3).toUpperCase():'India'):'IPL '+(ym?ym[1]:'2027');
 const S=names.length?names[0].toUpperCase()===names[0]?names[0]:names[0]:(team||'IPL');
 const S2=names.length>1?names[0].split(' ')[0]+'-'+names[1].split(' ')[0]:S;
 const cm=/(?:Rs\.?|₹|INR)\s*([\d.,]+)\s*(crore|cr)|([\d.,]+)\s*(crore|cr)\b/i.exec(text);
 const amt=cm?'₹'+((cm[1]||cm[3])+'').replace(/,/g,'')+' Cr':'';
 const rum=st.label!=='Confirmed',k=hash(String(st.id||st.title||'x'));
 const hooks=HOOKS[ev],V=VERB[ev],T=team&&names.length?' '+team:'';
 const q=rum?'?':'';
 const out=[];
 out.push({style:'Emotion hook',t:pick(hooks,k)+' '+S+(amt?' '+amt:'')+' '+V+q+' 🔥 | '+tag});
 out.push({style:'Sawaal (curiosity)',t:(rum?'':'')+S2+' '+V.toUpperCase()+(ev==='trade'&&team?' to '+team:'')+'? 👀 '+(names.length>1?'Who WON? ':'What Happens Next? ')+'| '+tag+' News'});
 out.push({style:'Breaking',t:'BREAKING: '+S+' '+V+(amt?' ('+amt+')':'')+q+' 😱 '+(team&&!T?'':'')+(team?team+' ':'')+'Big Update | '+tag});
 out.push({style:'Full reaction',t:pick(hooks,k+1)+' '+(rum?'Is ':'')+S+(T?T:'')+' '+V+' '+(rum?'Real?':'IT\'S DONE!')+' | '+tag});
 const seen=new Set();return out.map(o=>({style:o.style,t:cut(o.t.replace(/\s+/g,' ').replace(/\s\?/g,'?'),100)})).filter(o=>{const x=o.t.toLowerCase();if(seen.has(x))return false;seen.add(x);return true;});
};
})();
