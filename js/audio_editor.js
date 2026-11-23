// C210: label ab '✂ Segment Edit' (naya poora 🎛 Audio Editor tab alag hai: AI Enhance/multitrack). C58: Audio Editor (Audacity jaisa + News-anchor voice). API: AUDIOED.open(segIndex)
// Select/Cut/Delete/Silence/Trim/Split/Copy-Paste, Fade, Amplify, Normalize, Noise reduction (spectral gate),
// Auto silence remove, Anchor voice chain (HPF+EQ+de-ess+compressor+loudness+limiter), Best one-click, A/B preview, Undo/Redo.
(function(){
'use strict';
const $=id=>document.getElementById(id);
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const ac=()=>{const X=window.EXPORT;return X.actx||(X.actx=new (window.AudioContext||window.webkitAudioContext)());};
const db2g=d=>Math.pow(10,d/20);
const chans=b=>{const o=[];for(let c=0;c<b.numberOfChannels;c++)o.push(b.getChannelData(c));return o;};
const toBuf=(arrs,sr)=>{const b=ac().createBuffer(arrs.length,Math.max(1,arrs[0].length),sr);arrs.forEach((a,c)=>b.getChannelData(c).set(a));return b;};
const sub=(a,s,e)=>a.subarray(Math.max(0,s),Math.max(0,e));
const cat=(parts)=>{const n=parts.reduce((m,p)=>m+p.length,0),o=new Float32Array(n);let k=0;parts.forEach(p=>{o.set(p,k);k+=p.length;});return o;};

// ---------- DSP ----------
function fft(re,im,inv){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t;}}
 for(let len=2;len<=n;len<<=1){const a=(inv?-2:2)*Math.PI/len,wr=Math.cos(a),wi=Math.sin(a);
  for(let i=0;i<n;i+=len){let cr=1,ci=0;for(let k=0;k<len/2;k++){const u=i+k,v=i+k+len/2,xr=re[v]*cr-im[v]*ci,xi=re[v]*ci+im[v]*cr;re[v]=re[u]-xr;im[v]=im[u]-xi;re[u]+=xr;im[u]+=xi;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t;}}}
 if(inv)for(let i=0;i<n;i++){re[i]/=n;im[i]/=n;}}
const N=2048,HOP=512,WIN=(()=>{const w=new Float32Array(N);for(let i=0;i<N;i++)w[i]=0.5-0.5*Math.cos(2*Math.PI*i/N);return w;})();
function noiseProfile(x,s,e){// average magnitude of frames in [s,e)
 const m=new Float32Array(N/2+1);let cnt=0;const re=new Float32Array(N),im=new Float32Array(N);
 for(let p=s;p+N<=e;p+=HOP){for(let i=0;i<N;i++){re[i]=x[p+i]*WIN[i];im[i]=0;}fft(re,im);for(let k=0;k<=N/2;k++)m[k]+=Math.hypot(re[k],im[k]);cnt++;}
 if(cnt)for(let k=0;k<m.length;k++)m[k]/=cnt;return m;}
function autoNoiseRange(x,sr){// sabse shaant ~0.4s ka hissa
 const f=Math.floor(sr*0.05),n=Math.floor(x.length/f),r=[];for(let i=0;i<n;i++){let s=0;for(let k=0;k<f;k++){const v=x[i*f+k];s+=v*v;}r.push(s/f);}
 const w=8;let best=1e9,bi=0;for(let i=0;i+w<=n;i++){let s=0;for(let k=0;k<w;k++)s+=r[i+k];if(s<best){best=s;bi=i;}}return[bi*f,(bi+w)*f];}
function denoise(x,prof,redDb,alpha){const out=new Float32Array(x.length+N),norm=new Float32Array(x.length+N),fl=db2g(-redDb);
 const re=new Float32Array(N),im=new Float32Array(N);
 for(let p=-N+HOP;p<x.length;p+=HOP){for(let i=0;i<N;i++){const q=p+i;re[i]=(q>=0&&q<x.length?x[q]:0)*WIN[i];im[i]=0;}
  fft(re,im);for(let k=0;k<=N/2;k++){const mg=Math.hypot(re[k],im[k])||1e-12;let g=Math.max(fl,(mg-alpha*prof[k])/mg);if(g>1)g=1;re[k]*=g;im[k]*=g;if(k>0&&k<N/2){re[N-k]=re[k];im[N-k]=-im[k];}}
  fft(re,im,true);for(let i=0;i<N;i++){const q=p+i;if(q>=0&&q<x.length){out[q]+=re[i]*WIN[i];norm[q]+=WIN[i]*WIN[i];}}}
 for(let i=0;i<x.length;i++)out[i]=norm[i]>1e-6?out[i]/norm[i]:x[i];return out.subarray(0,x.length);}
function silenceCut(arrs,sr,thDb,minP,keep){// lambi pause chhoti karo
 const x=arrs[0],f=Math.floor(sr*0.01),n=Math.floor(x.length/f),th=db2g(thDb),sil=[];
 for(let i=0;i<n;i++){let s=0;for(let k=0;k<f;k++){const v=x[i*f+k];s+=v*v;}sil.push(Math.sqrt(s/f)<th);}
 const rs=[];for(let i=0;i<n;i++){let s2=0;for(let k=0;k<f;k++){const v=x[i*f+k];s2+=v*v;}rs.push(Math.sqrt(s2/f));}rs.sort((a,b)=>a-b);const fl=rs[Math.floor(n*0.1)]||0;const thA=Math.max(th,fl*2.5);for(let i=0;i<n;i++){let s2=0;for(let k=0;k<f;k++){const v=x[i*f+k];s2+=v*v;}sil[i]=Math.sqrt(s2/f)<thA;}
 const keepIdx=new Uint8Array(n).fill(1);let i=0,removed=0;const minF=Math.round(minP*100),kF=Math.round(keep*100);
 while(i<n){if(!sil[i]){i++;continue;}let j=i;while(j<n&&sil[j])j++;if(j-i>=minF){const a=i+Math.floor(kF/2),b=j-Math.ceil(kF/2);for(let k=a;k<b;k++){keepIdx[k]=0;removed++;}}i=j;}
 const xf=Math.floor(sr*0.006);return{removed:removed*0.01,arrs:arrs.map(ch=>{const parts=[];let s=-1;for(let k=0;k<=n;k++){const on=k<n&&keepIdx[k];if(on&&s<0)s=k;if(!on&&s>=0){const seg=ch.slice(s*f,k*f);const m=Math.min(xf,seg.length>>1);for(let z=0;z<m;z++){seg[z]*=z/m;seg[seg.length-1-z]*=z/m;}parts.push(seg);s=-1;}}
  parts.push(ch.slice(n*f));return cat(parts);})};}
function gatedRms(arrs,sr){const x=arrs[0],f=Math.floor(sr*0.05),n=Math.floor(x.length/f),r=[];for(let i=0;i<n;i++){let s=0;for(let k=0;k<f;k++){const v=x[i*f+k];s+=v*v;}r.push(s/f);}
 const mx=Math.max(...r,1e-12),thr=mx*1e-3,a=r.filter(v=>v>thr);return a.length?Math.sqrt(a.reduce((p,c)=>p+c,0)/a.length):1e-6;}
const peakOf=arrs=>{let m=0;arrs.forEach(a=>{for(let i=0;i<a.length;i++){const v=Math.abs(a[i]);if(v>m)m=v;}});return m;};
function limiter(arrs){arrs.forEach(a=>{for(let i=0;i<a.length;i++){const v=a[i],s=Math.abs(v);if(s>0.7){a[i]=Math.sign(v)*(0.7+0.28*Math.tanh((s-0.7)/0.28));}}});}
async function eqRender(buf,bands){const off=new OfflineAudioContext(buf.numberOfChannels,buf.length,buf.sampleRate),src=off.createBufferSource();src.buffer=buf;let n=src;
 bands.forEach(([t,f,g])=>{if(!g)return;const b=off.createBiquadFilter();b.type=t;b.frequency.value=f;b.gain.value=g;if(t==='peaking')b.Q.value=1;n.connect(b);n=b;});n.connect(off.destination);src.start();
 const o=chans(await off.startRendering()).map(a=>Float32Array.from(a));limiter(o);return o;}
async function anchorChain(buf,strength,targetDb){
 const sr=buf.sampleRate,off=new OfflineAudioContext(buf.numberOfChannels,buf.length,sr),src=off.createBufferSource();src.buffer=buf;
 const F=(type,f,g,q)=>{const n=off.createBiquadFilter();n.type=type;n.frequency.value=f;if(g!=null)n.gain.value=g;if(q!=null)n.Q.value=q;return n;};
 const chain=[F('highpass',80,null,0.7),F('lowshelf',150,2.5),F('peaking',280,-1.5,1),F('peaking',3500,3,1),F('peaking',7000,-3,3),F('highshelf',10000,1.5)];
 const cp=off.createDynamicsCompressor();cp.threshold.value=-24;cp.knee.value=12;cp.ratio.value=3.5;cp.attack.value=0.005;cp.release.value=0.12;
 let n=src;[...chain,cp].forEach(x=>{n.connect(x);n=x;});n.connect(off.destination);src.start();
 const wet=chans(await off.startRendering()).map(a=>Float32Array.from(a)),dry=chans(buf);
 const g=db2g(targetDb)/gatedRms(wet,sr);wet.forEach((a,c)=>{for(let i=0;i<a.length;i++)a[i]=(a[i]*g)*strength+(dry[c][i])*(1-strength);});
 limiter(wet);return wet;}

// ---------- UI ----------
let M=null;
function open(idx){
 const AT=window.AT;if(!AT||!AT.segs.length){alert('Pehle Audio tracks mein audio jodo (🎚 Audio tracks / 🎤 Recordings lo).');return;}
 if(M)close(true);
 const st={i:Math.max(0,Math.min(idx||0,AT.segs.length-1)),buf:null,orig:null,hist:[],fut:[],sel:null,cur:0,pps:60,clip:null,play:null,raf:0};
 const el=mk('div');el.id='aed';
 el.innerHTML=`<style>
#aed{position:fixed;inset:0;z-index:90;background:#000b;display:flex;align-items:center;justify-content:center;font-size:13px}
#aed .bx{width:min(1180px,96vw);max-height:94vh;overflow:auto;background:#1b1e25;border:1px solid #000;border-radius:10px;padding:12px;color:#e9edf3}
#aed h3{margin:0 0 8px;font-size:15px}#aed .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0}
#aed button,#aed select,#aed input{font-size:12px;border-radius:5px;border:0;padding:6px 9px}#aed button{background:#2b2f38;color:#e9edf3;cursor:pointer}#aed button:hover{background:#3a4250}
#aed button.g{background:#00c389;color:#04130e;font-weight:700}#aed button.p{background:#2a6fdb}#aed button.r{background:#a33}
#aed input[type=number]{width:62px;background:#10141a;color:#e9edf3;border:1px solid #2a313c}#aed select{background:#10141a;color:#e9edf3;border:1px solid #2a313c}
#aed .grp{background:#14161b;border-radius:8px;padding:6px 8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}#aed .grp>b{font-size:11px;color:#8b95a5;margin-right:2px}
#aed .ws{overflow-x:auto;background:#0f1115;border:1px solid #000;border-radius:6px}#aed canvas{display:block;height:200px;cursor:crosshair}
#aed #ast{color:#ffd400;min-height:16px;margin-top:4px}
</style><div class="bx"><h3>✂ Segment Edit — Audacity jaisa + News-anchor voice</h3>
<div class="row"><select id="asg"></select><span id="ainf" style="color:#8b95a5"></span><span style="flex:1"></span>
<button id="aun">↶ Undo</button><button id="are">↷ Redo</button><button id="aor" title="Shuru ki original awaaz par wapas">⟲ Original</button><label style="color:#8b95a5">Zoom <input id="azm" type="range" min="10" max="400" value="60"></label></div>
<div class="ws" id="aws"><canvas id="acv"></canvas></div>
<div class="row"><button id="apl" class="p">▶ Play (Space)</button><button id="apo">▶ Original sune</button><button id="ast0">■ Stop</button>
<span style="color:#8b95a5">Drag = select, click = cursor</span></div>
<div class="row">
<div class="grp"><b>✂ Edit</b><button id="acut">Cut/Delete</button><button id="acp">Copy</button><button id="apa">Paste</button><button id="atr">Trim (sirf select)</button><button id="asi">Silence</button><button id="asp">Split @cursor</button><button id="asa">Sab select</button></div>
<div class="grp"><b>🔊 Level</b><button id="afi">Fade in</button><button id="afo">Fade out</button><input id="afd" type="number" value="0.3" step="0.1" min="0.05" title="fade seconds">s
<input id="aam" type="number" value="3" step="1">dB <button id="aamp">Amplify</button><button id="anm">Normalize −1dB</button></div></div>
<div class="row">
<div class="grp"><b>🧹 Noise</b><button id="anp" title="Select = sirf shor wala hissa (bina bole), warna auto">Noise profile = select/auto</button><input id="anr" type="number" value="12" min="3" max="30">dB <button id="anz" class="g">Noise reduce</button></div>
<div class="grp"><b>⏸ Pause</b><input id="asth" type="number" value="-45">dB min<input id="asmp" type="number" value="0.45" step="0.05">s rakho<input id="askp" type="number" value="0.25" step="0.05">s <button id="asr">Auto silence remove</button></div></div>
<div class="row">
<div class="grp"><b>🎙 News anchor</b>Strength <input id="ans" type="range" min="0" max="100" value="100"><input id="ant" type="number" value="-17" title="target loudness dBFS (RMS)">dB <button id="aan" class="g">🎙 Anchor voice</button>
<button id="abs" class="g" style="background:#ffd400">⭐ Best (sab ek click)</button></div></div>
<div class="row"><div class="grp"><b>🎚 EQ</b>Bass<input id="eq1" type="range" min="-12" max="12" value="0">Mid<input id="eq2" type="range" min="-12" max="12" value="0">Presence<input id="eq3" type="range" min="-12" max="12" value="0">Air<input id="eq4" type="range" min="-12" max="12" value="0"><button id="aeq">Apply EQ</button><button id="aeq0">Reset</button></div>
<div class="grp"><label><input id="arp" type="checkbox" checked> Apply par baaki segments khisakao (ripple)</label><label><input id="afit" type="checkbox"> Apply ke baad scenes ko audio se ⏱ fit karo</label></div></div>
<div id="ast">&nbsp;</div>
<div class="row"><button id="aap" class="g">✔ Apply (tool mein lagao)</button><button id="acn" class="r">✕ Cancel</button><button id="aall" title="Sab segments par Best chain">⭐ Sab segments par Best</button></div>
</div>`;
 document.body.appendChild(el);M={el,st};
 const q=s=>el.querySelector(s),cv=q('#acv'),ws=q('#aws'),stT=q('#ast'),say=t=>{stT.textContent=t;};
 const sg=q('#asg');
 const fill=()=>{sg.innerHTML='';AT.segs.forEach((s,k)=>{const o=mk('option','',(k+1)+'. '+s.name);o.value=k;sg.appendChild(o);});sg.value=st.i;};
 const load=i=>{st.i=i;const b=AT.segs[i].buf;st.buf=b;st.orig=b;st.hist=[];st.fut=[];st.sel=null;st.cur=0;stop();draw();info();};
 const info=()=>{q('#ainf').textContent=st.buf.duration.toFixed(2)+'s • '+st.buf.numberOfChannels+'ch • '+st.buf.sampleRate+'Hz';};
 const push=nb=>{st.hist.push(st.buf);if(st.hist.length>10)st.hist.shift();st.fut=[];st.buf=nb;st.sel=null;draw();info();};
 const SR=()=>st.buf.sampleRate,rng=()=>{if(st.sel&&st.sel[1]-st.sel[0]>0.005)return[Math.round(st.sel[0]*SR()),Math.round(st.sel[1]*SR())];return[0,st.buf.length];};
 const hasSel=()=>st.sel&&st.sel[1]-st.sel[0]>0.005;
 const map=(fn)=>chans(st.buf).map((a,c)=>fn(Float32Array.from(a),c));
 // draw
 function draw(){const b=st.buf,d=b.duration;let w=Math.max(ws.clientWidth-2,Math.ceil(d*st.pps));w=Math.min(w,16000);const pps=w/d;cv.width=w;cv.style.width=w+'px';cv.height=200;
  const g=cv.getContext('2d');g.fillStyle='#0f1115';g.fillRect(0,0,w,200);const x=b.getChannelData(0),step=Math.max(1,Math.floor(x.length/w));
  if(hasSel()){g.fillStyle='#2a6fdb55';g.fillRect(st.sel[0]*pps,0,(st.sel[1]-st.sel[0])*pps,200);}
  g.strokeStyle='#1d2330';g.beginPath();g.moveTo(0,100);g.lineTo(w,100);g.stroke();g.fillStyle='#00c389';
  for(let px=0;px<w;px++){let mn=0,mxv=0;const a=px*step,e=Math.min(x.length,a+step);for(let k=a;k<e;k+=Math.max(1,step>>5)){const v=x[k];if(v<mn)mn=v;if(v>mxv)mxv=v;}g.fillRect(px,100-mxv*96,1,Math.max(1,(mxv-mn)*96));}
  g.fillStyle='#8b95a5';g.font='10px sans-serif';const ts=[0.5,1,2,5,10,30].find(t=>t*pps>70)||30;for(let t=0;t<d;t+=ts){g.fillRect(t*pps,0,1,8);g.fillText(t.toFixed(1)+'s',t*pps+3,18);}
  g.fillStyle='#ff3b55';g.fillRect(st.cur*pps,0,2,200);cv._pps=pps;}
 const stop=()=>{if(st.play){try{st.play.stop();}catch(e){}st.play=null;}cancelAnimationFrame(st.raf);};
 function play(buf,from,to){stop();const a=ac();if(a.state==='suspended')a.resume();const s=a.createBufferSource();s.buffer=buf;s.connect(a.destination);const t0=a.currentTime,off=from||0,dur=(to!=null?to-off:buf.duration-off);s.start(0,off,dur);st.play=s;s.onended=()=>{if(st.play===s){st.play=null;cancelAnimationFrame(st.raf);}};
  const tick=()=>{if(!st.play)return;if(buf===st.buf){st.cur=off+(a.currentTime-t0);draw();}st.raf=requestAnimationFrame(tick);};tick();}
 const playMain=()=>{if(st.play){stop();return;}if(hasSel())play(st.buf,st.sel[0],st.sel[1]);else play(st.buf,st.cur>=st.buf.duration-0.05?0:st.cur);};
 // mouse select
 cv.onmousedown=e=>{const r=cv.getBoundingClientRect(),t0=(e.clientX-r.left)/cv._pps;let moved=false;st.cur=Math.max(0,Math.min(st.buf.duration,t0));
  const mv=ev=>{const t=Math.max(0,Math.min(st.buf.duration,(ev.clientX-r.left)/cv._pps));if(Math.abs(t-t0)*cv._pps>3){moved=true;st.sel=[Math.min(t0,t),Math.max(t0,t)];draw();}};
  const up=()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up);if(!moved){st.sel=null;draw();}};addEventListener('mousemove',mv);addEventListener('mouseup',up);draw();};
 q('#azm').oninput=e=>{st.pps=+e.target.value;draw();};
 // ops
 const op=(name,fn)=>q(name).onclick=async()=>{try{stop();say('⏳ kaam chal raha…');await new Promise(r=>setTimeout(r,20));await fn();}catch(err){console.error(err);say('Error: '+err.message);}};
 op('#acut',()=>{const[s,e]=rng();if(!hasSel()){say('Pehle waveform par select karo');return;}push(toBuf(map(a=>cat([sub(a,0,s),sub(a,e,a.length)])),SR()));say('Kata: '+((e-s)/SR()).toFixed(2)+'s');});
 op('#acp',()=>{if(!hasSel()){say('Pehle select karo');return;}const[s,e]=rng();st.clip=chans(st.buf).map(a=>Float32Array.from(sub(a,s,e)));say('Copy ho gaya ('+((e-s)/SR()).toFixed(2)+'s)');});
 op('#apa',()=>{if(!st.clip){say('Pehle Copy karo');return;}const p=Math.round(st.cur*SR());const cl=st.clip;push(toBuf(map((a,c)=>cat([sub(a,0,p),cl[Math.min(c,cl.length-1)],sub(a,p,a.length)])),SR()));say('Cursor par paste hua');});
 op('#atr',()=>{if(!hasSel()){say('Pehle select karo');return;}const[s,e]=rng();push(toBuf(map(a=>Float32Array.from(sub(a,s,e))),SR()));say('Trim ho gaya');});
 op('#asi',()=>{if(!hasSel()){say('Pehle select karo');return;}const[s,e]=rng();push(toBuf(map(a=>{a.fill(0,s,e);return a;}),SR()));say('Select hissa shaant');});
 op('#asa',()=>{st.sel=[0,st.buf.duration];draw();say('Sab select');});
 op('#asp',()=>{const t=st.cur;if(t<0.1||t>st.buf.duration-0.1){say('Cursor beech mein rakho (click karo)');return;}const p=Math.round(t*SR()),i=st.i,s0=AT.segs[i];
  const L=toBuf(map(a=>Float32Array.from(sub(a,0,p))),SR()),R=toBuf(map(a=>Float32Array.from(sub(a,p,a.length))),SR());
  s0.buf=L;AT.segs.splice(i+1,0,{name:s0.name+' (2)',start:+(s0.start+t).toFixed(2),buf:R});AT.rebuild();AT.nudge(i,0);fill();load(i);say('Split ho gaya: '+AT.segs.length+' segments');});
 const fade=(inn)=>{const[s,e]=rng(),n=Math.min(e-s,Math.round(+q('#afd').value*SR()));push(toBuf(map(a=>{for(let k=0;k<n;k++){const g=k/n;if(inn)a[s+k]*=g;else a[e-1-k]*=g;}return a;}),SR()));say(inn?'Fade in laga':'Fade out laga');};
 op('#afi',()=>fade(true));op('#afo',()=>fade(false));
 op('#aamp',()=>{const[s,e]=rng(),g=db2g(+q('#aam').value);push(toBuf(map(a=>{for(let k=s;k<e;k++)a[k]=Math.max(-1,Math.min(1,a[k]*g));return a;}),SR()));say('Amplify '+q('#aam').value+'dB');});
 op('#anm',()=>{const[s,e]=rng(),arrs=chans(st.buf).map(a=>sub(a,s,e)),pk=peakOf(arrs)||1,g=db2g(-1)/pk;push(toBuf(map(a=>{for(let k=s;k<e;k++)a[k]*=g;return a;}),SR()));say('Normalize: '+(20*Math.log10(g)).toFixed(1)+'dB');});
 let prof=null;
 const getProf=()=>{const x=st.buf.getChannelData(0);let s,e;if(hasSel()){[s,e]=rng();say('Noise profile: select kiya hissa');}else{[s,e]=autoNoiseRange(x,SR());say('Noise profile: auto (sabse shaant hissa)');}if(e-s<N*2){throw new Error('Noise hissa bahut chhota (kam se kam 0.2s select karo)');}return noiseProfile(x,s,e);};
 op('#anp',()=>{prof=getProf();say('✔ Noise profile yaad hua. Ab Noise reduce dabao');});
 const doNR=()=>{const p=prof||getProf(),red=+q('#anr').value;return toBuf(map(a=>Float32Array.from(denoise(a,p,red,2))),SR());};
 op('#anz',()=>{const b=doNR();push(b);say('Noise kam hua ('+q('#anr').value+'dB). Sune: ▶ Play');});
 const doSil=(b)=>{const r=silenceCut(chans(b).map(a=>Float32Array.from(a)),b.sampleRate,+q('#asth').value,+q('#asmp').value,+q('#askp').value);return{buf:toBuf(r.arrs,b.sampleRate),removed:r.removed};};
 op('#asr',()=>{const r=doSil(st.buf);push(r.buf);say('Pauses hati: '+r.removed.toFixed(1)+'s kam hui');});
 const doAnchor=async(b)=>toBuf(await anchorChain(b,+q('#ans').value/100,+q('#ant').value),b.sampleRate);
 op('#aan',async()=>{push(await doAnchor(st.buf));say('🎙 Anchor voice laga. Sune aur A/B karo (▶ Original sune)');});
 const best=async(b)=>{const o=st.buf,os=st.sel;st.buf=b;st.sel=null;let p;try{p=getProf();}finally{st.buf=o;st.sel=os;}const d=toBuf(chans(b).map(a=>Float32Array.from(denoise(Float32Array.from(a),p,12,2))),b.sampleRate);
  const s=doSil(d).buf;return doAnchor(s);};
 op('#abs',async()=>{say('⭐ Noise → Pause → Anchor chal raha (thoda time lagega)…');const nb=await best(st.buf);push(nb);say('⭐ Best ho gaya: '+st.buf.duration.toFixed(1)+'s. Sune aur Apply karo');});
 op('#aeq',async()=>{const[s0,e0]=rng(),v=[1,2,3,4].map(k=>+q('#eq'+k).value),B=[['lowshelf',150,v[0]],['peaking',1000,v[1]],['peaking',3500,v[2]],['highshelf',10000,v[3]]];
  const part=toBuf(chans(st.buf).map(a=>Float32Array.from(sub(a,s0,e0))),SR()),r=await eqRender(part,B);
  push(toBuf(map((a,c)=>{a.set(r[Math.min(c,r.length-1)],s0);return a;}),SR()));say('EQ laga (Bass '+v[0]+', Mid '+v[1]+', Presence '+v[2]+', Air '+v[3]+' dB)');});
 op('#aeq0',()=>{[1,2,3,4].forEach(k=>q('#eq'+k).value=0);say('EQ reset');});
 op('#aun',()=>{if(!st.hist.length)return;st.fut.push(st.buf);st.buf=st.hist.pop();draw();info();});
 op('#are',()=>{if(!st.fut.length)return;st.hist.push(st.buf);st.buf=st.fut.pop();draw();info();});
 op('#aor',()=>{st.hist.push(st.buf);st.buf=st.orig;st.sel=null;draw();info();say('Original wapas (Undo se phir aa sakta)');});
 q('#apl').onclick=playMain;q('#apo').onclick=()=>{stop();play(st.orig,0);};q('#ast0').onclick=()=>stop();
 const ripple=(i,d)=>{if(!q('#arp').checked||Math.abs(d)<0.005)return;for(let k=i+1;k<AT.segs.length;k++)AT.segs[k].start=+Math.max(0,AT.segs[k].start+d).toFixed(2);};
 const autoFit=async()=>{if(!q('#afit')||!q('#afit').checked||!window.FIT||!window.SE)return'';try{const r=FIT.run();if(r.ok){await SE.apply(true);return' • Scenes fit ho gaye';}return' • Fit nahi hua: '+(r.msg||'').split('\n')[0];}catch(e){return' • Fit error';}};
 const commit=()=>{if(st.buf!==AT.segs[st.i].buf){const d=st.buf.duration-AT.segs[st.i].buf.duration;AT.segs[st.i].buf=st.buf;ripple(st.i,d);AT.rebuild();AT.nudge(st.i,0);}};
 q('#aap').onclick=async()=>{commit();const m=await autoFit();if(m)console.log('AudioEd'+m);close(true);};
 q('#acn').onclick=()=>close(true);
 q('#aall').onclick=async()=>{try{stop();const idx=st.i;for(let k=0;k<AT.segs.length;k++){say('⭐ Segment '+(k+1)+'/'+AT.segs.length+' par Best…');await new Promise(r=>setTimeout(r,20));
   const b=k===st.i?st.buf:AT.segs[k].buf;const o=st.buf;st.buf=b;let nb;try{nb=await best(b);}finally{st.buf=o;}
   if(k===st.i){push(nb);commit();}else{ripple(k,nb.duration-AT.segs[k].buf.duration);AT.segs[k].buf=nb;}}
  AT.rebuild();AT.nudge(0,0);const fm=await autoFit();say('✔ Sab segments par Best laga'+(fm||'. Scenes ke liye ⏱ fit chalao.'));load(idx);}catch(err){console.error(err);say('Error: '+err.message);}};
 sg.onchange=()=>{commit();load(+sg.value);};
 // keys (shell ke shortcuts roko)
 const kd=e=>{if(!M)return;const k=e.key,tg=e.target&&e.target.tagName;if(k==='Escape'){close(true);e.stopPropagation();return;}if(tg==='INPUT'||tg==='SELECT')return;
  e.stopPropagation();if(k===' '){e.preventDefault();playMain();}else if(k==='Delete'||k==='Backspace'){e.preventDefault();q('#acut').click();}
  else if((e.ctrlKey||e.metaKey)&&k.toLowerCase()==='z'){e.preventDefault();q('#aun').click();}else if((e.ctrlKey||e.metaKey)&&(k.toLowerCase()==='y')){e.preventDefault();q('#are').click();}
  else if((e.ctrlKey||e.metaKey)&&k.toLowerCase()==='a'){e.preventDefault();q('#asa').click();}else if((e.ctrlKey||e.metaKey)&&k.toLowerCase()==='c'){e.preventDefault();q('#acp').click();}else if((e.ctrlKey||e.metaKey)&&k.toLowerCase()==='v'){e.preventDefault();q('#apa').click();}};
 M.kd=kd;M.stop=stop;document.addEventListener('keydown',kd,true);
 q('#afit').checked=!!(window.SE&&SE.scenes.some(x=>x.chunk));
 fill();load(st.i);
}
function close(){if(!M)return;M.stop();document.removeEventListener('keydown',M.kd,true);M.el.remove();M=null;}
window.AUDIOED={open,close};

// ---------- entry points ----------
const addBtn=()=>{const b2=$('bar2');if(b2&&!$('aed_btn')){const b=mk('button','','✂ Segment Edit');b.id='aed_btn';b.onclick=()=>open(0);b2.appendChild(b);}
 const tt=$('tl-tools');if(tt&&!$('aed_btn2')){const b=mk('button','','✂ Segment Edit');b.id='aed_btn2';b.title='Audio segment edit (double-click segment bhi chalta)';b.onclick=()=>{const sel=document.querySelector('#tl-a .seg.sel');const i=sel?[...document.querySelectorAll('#tl-a .seg')].indexOf(sel):0;open(Math.max(0,i));};tt.appendChild(b);}};
setInterval(addBtn,500);addBtn();
document.addEventListener('dblclick',e=>{const sgm=e.target.closest&&e.target.closest('#tl-a .seg');if(!sgm)return;open([...document.querySelectorAll('#tl-a .seg')].indexOf(sgm));});
})();
