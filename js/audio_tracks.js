// C9b: per-chunk audio segments + mic record -> mixed into EXPORT.audio. API: AT.init(P), AT.add(name,buf,start)
(function(){
const X=window.EXPORT;
const AT=window.AT={segs:[],P:null,rec:null};
const ctx=()=>X.actx||(X.actx=new (window.AudioContext||window.webkitAudioContext)());
const endOf=()=>AT.segs.reduce((m,s)=>Math.max(m,s.start+s.buf.duration),0);
AT.rebuild=()=>{
 if(!AT.segs.length){X.audio=null;return;}
 const ac=ctx(),sr=ac.sampleRate,len=Math.ceil(endOf()*sr),out=ac.createBuffer(2,len,sr),L=out.getChannelData(0),R=out.getChannelData(1);
 for(const s of AT.segs){const o=Math.round(s.start*sr),a=s.buf.getChannelData(0),b=s.buf.numberOfChannels>1?s.buf.getChannelData(1):a;
  for(let i=0;i<a.length&&o+i<len;i++){L[o+i]+=a[i];R[o+i]+=b[i];}}
 for(let i=0;i<len;i++){if(L[i]>1)L[i]=1;else if(L[i]<-1)L[i]=-1;if(R[i]>1)R[i]=1;else if(R[i]<-1)R[i]=-1;}
 X.audio=out;};
AT.add=(name,buf,start)=>{AT.segs.push({name,buf,start:+(start==null?endOf():start).toFixed(2)});AT.rebuild();render();};
AT.addFile=async(f)=>{const buf=await ctx().decodeAudioData(await f.arrayBuffer());AT.add(f.name,buf);};
// C209: Studio mein Audio Editor se enhanced mix wapas -> poori audio ek seg ban jati hai (purani AT.prev mein, wapas laa sakte ho)
AT.replaceMix=async(arrs,sr,name)=>{const ac=ctx();let b=ac.createBuffer(arrs.length,Math.max(1,arrs[0].length),sr);arrs.forEach((a,c)=>b.getChannelData(c).set(a));
 if(sr!==ac.sampleRate){const oc=new OfflineAudioContext(arrs.length,Math.max(1,Math.ceil(arrs[0].length*ac.sampleRate/sr)),ac.sampleRate),sn=oc.createBufferSource();sn.buffer=b;sn.connect(oc.destination);sn.start();b=await oc.startRendering();}
 AT.prev=AT.segs.slice();AT.segs=[{name:name||'voice-over ✨',buf:b,start:0}];AT.rebuild();render();return b;};
AT.restorePrev=()=>{if(!AT.prev)return false;AT.segs=AT.prev;AT.prev=null;AT.rebuild();render();return true;};
AT.sendToAudio=()=>{let S=null;try{S=window.parent!==window&&window.parent.STUDIO&&window.parent.STUDIO.toAudio?window.parent.STUDIO:null;}catch(e){}
 if(!S){if(st)st.textContent='Ye sirf Studio mein chalta hai';return;}
 const b=X.audio;if(!b){if(st)st.textContent='Pehle audio jodo (+ Audio chunk / Mic / Teleprompter)';return;}
 const arrs=[];for(let c=0;c<b.numberOfChannels;c++)arrs.push(Float32Array.from(b.getChannelData(c)));
 S.toAudio({arrs,sr:b.sampleRate,name:'voiceover',cid:null,target:'scenes'});};
AT.nudge=(i,d)=>{AT.segs[i].start=+Math.max(0,AT.segs[i].start+d).toFixed(2);AT.rebuild();render();};
AT.del=i=>{AT.segs.splice(i,1);AT.rebuild();render();};
AT.startMic=async()=>{const st=await navigator.mediaDevices.getUserMedia({audio:true}),mr=new MediaRecorder(st),ch=[];
 mr.ondataavailable=e=>e.data.size&&ch.push(e.data);
 mr.onstop=async()=>{st.getTracks().forEach(t=>t.stop());try{const b=new Blob(ch,{type:mr.mimeType});AT.add('mic '+(AT.segs.length+1),await ctx().decodeAudioData(await b.arrayBuffer()));}catch(e){alert('Mic decode error: '+e.message);}AT.rec=null;render();};
 mr.start();AT.rec=mr;render();};
AT.stopMic=()=>AT.rec&&AT.rec.stop();
// C24: teleprompter.html ki recordings (IndexedDB 'cvt_voice') chunk 1,2,3 order mein jodo
AT.importVoice=()=>new Promise((res,rej)=>{const r=indexedDB.open('cvt_voice',1);
 r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('rec'))r.result.createObjectStore('rec',{keyPath:'chunk'});};
 r.onerror=()=>rej(r.error);
 r.onsuccess=()=>{const d=r.result,q=d.transaction('rec','readonly').objectStore('rec').getAll();
  q.onsuccess=async()=>{d.close();const L=(q.result||[]).sort((a,b)=>a.chunk-b.chunk);let n=0;
   for(const x of L){try{const buf=await ctx().decodeAudioData(await x.blob.arrayBuffer());AT.add('chunk '+x.chunk+' (teleprompter)',buf);n++;}catch(e){}}
   res({found:L.length,added:n});};q.onerror=()=>{d.close();rej(q.error);};};});
let panel,list,st;
AT.init=P=>{AT.P=P;
 panel=document.createElement('div');panel.style.cssText='display:none;margin-top:8px;background:#1b1b1b;border-radius:6px;padding:8px';
 panel.innerHTML='<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label style="background:#2a6;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:15px">+ Audio chunk(s)<input type="file" id="atf" accept="audio/*" multiple style="display:none"></label><button id="atm">⏺ Mic record</button><button id="atv" style="background:#2a6fdb">🎤 Recordings lo</button><span id="atst" style="font-size:13px"></span></div><div style="font-size:12px;opacity:.7;margin-top:4px">Har file pichli ke baad lagti hai; start time − / + se hilao. Sab mix hoke export mein jaata hai.</div><div id="atl" style="margin-top:6px"></div>';
 document.getElementById('wrap').insertBefore(panel,document.getElementById('info'));
 try{if(window.parent!==window&&window.parent.STUDIO&&window.parent.STUDIO.toAudio){const r0=panel.firstElementChild;
  const b1=document.createElement('button');b1.id='atae';b1.textContent='🎛 Audio Editor mein enhance';b1.title='Poori voice-over/mix Audio Editor mein bhejo (AI Enhance, noise, LUFS), phir wahan se wapas';b1.style.cssText='padding:8px 12px;background:#2a6fdb;border-radius:6px';b1.onclick=()=>AT.sendToAudio();
  const b2=document.createElement('button');b2.id='atrs';b2.textContent='↩ Purani audio';b2.style.cssText='padding:8px 12px;background:#555;border-radius:6px;display:none';b2.onclick=()=>{AT.restorePrev();};
  r0.appendChild(b1);r0.appendChild(b2);}}catch(e){}
 list=panel.querySelector('#atl');st=panel.querySelector('#atst');
 panel.querySelector('#atf').onchange=async e=>{for(const f of e.target.files){try{await AT.addFile(f);}catch(err){st.textContent='Error: '+err.message;}}e.target.value='';};
 panel.querySelector('#atv').onclick=async()=>{try{const r=await AT.importVoice();st.textContent=r.found?('Teleprompter se '+r.added+'/'+r.found+' chunk lage'):'Teleprompter mein koi recording nahi.';}catch(err){st.textContent='Error: '+err.message;}};
 panel.querySelector('#atm').onclick=async()=>{try{AT.rec?AT.stopMic():await AT.startMic();}catch(err){st.textContent='Mic error: '+err.message;}};
 const b=document.createElement('button');b.textContent='🎚 Audio tracks';b.onclick=()=>{panel.style.display=panel.style.display==='none'?'block':'none';render();};
 document.getElementById('bar2').appendChild(b);};
function render(){if(!panel)return;
 const rs=panel.querySelector('#atrs');if(rs)rs.style.display=AT.prev?'':'none';
 panel.querySelector('#atm').textContent=AT.rec?'⏹ Stop':'⏺ Mic record';
 if(panel.style.display==='none')return;
 st.textContent=AT.segs.length?('Total '+endOf().toFixed(1)+'s (video '+window.CORE.total.toFixed(1)+'s)'):'';
 list.textContent='';
 AT.segs.forEach((s,i)=>{const r=document.createElement('div');r.style.cssText='display:flex;gap:6px;align-items:center;padding:3px 0;font-size:14px';
  const mk=(t,fn,bg)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='padding:5px 9px;font-size:13px;background:'+(bg||'#555');b.onclick=fn;return b;};
  const tm=document.createElement('span');tm.textContent=s.start.toFixed(1)+'s';tm.style.cssText='width:48px;flex:none';
  const nm=document.createElement('span');nm.style.flex='1';nm.textContent=s.name+' ('+s.buf.duration.toFixed(1)+'s)';
  r.append(mk('−',()=>AT.nudge(i,-.1)),tm,mk('+',()=>AT.nudge(i,.1)),nm,mk('✕',()=>AT.del(i)));list.appendChild(r);});}
})();
