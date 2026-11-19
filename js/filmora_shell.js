// C52-C57: Filmora-style layout (C57 = F6: shortcuts J/K/L, +/-/0 zoom, Home/End, , . frame step, Up/Down scene jump, Ctrl+D, [ ] move, timeline resize handle, clip right-click menu; C56 = F5: audio segment + caption drag on timeline, Delete audio seg; C55 = F4: Media bin (assets + photos grid, drag-drop on timeline); C54 = F3: right-panel Properties for selected scene; C53 = F2: drag-reorder, split S, snapping, transition menu, Delete key). Upar bar | left: media/panels (tabs rail) | beech: preview | right: look/FX | neeche: TIMELINE
// Timeline: ruler, video track (scene clips, trim handle, transition tag), audio waveform, captions track, playhead scrub, zoom.
// Purane modules ko chhua nahi — sirf unke elements ko naye jagah rakha. Classic layout wapas: ?layout=classic ya top ka button.
(function(){
'use strict';
const $=id=>document.getElementById(id);
const LS='cvt_layout';
let classic=false;try{classic=new URLSearchParams(location.search).get('layout')!=='filmora';}catch(e){}

const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const COL={hook:'#c0392b',title:'#2a6fdb',stat:'#8e44ad',retain:'#d35400',watch:'#16a085',rumour:'#b7950b',anth:'#34495e',intro:'#7f8c8d',presenter:'#27ae60',cta:'#e84393',curve:'#0ea5a5',stack:'#6c5ce7',chapter:'#d4a017',crowd:'#00a8a8',bigwords:'#e17055',qcards:'#0984e3',spot:'#e1b12c',compare:'#27ae60',tiles:'#e84118',chip:'#f0932b',stat2:'#8e44ad',bars:'#16a085',trio:'#e58e26',portrait:'#f19066',market:'#10ac84',hub:'#0abde3',formula:'#fd9644',beforeafter:'#eb3b5a',setting:'#4b7bec',radio:'#20bf6b',ideas:'#fa8231',reel:'#a55eea',phones:'#0fb9b1',gcurve:'#3867d6',steps:'#f7b731',expect:'#26de81',equals:'#a29bfe',payoff:'#fd79a8',tickgrid:'#00b894',variety:'#ff6b6b',burst:'#f9ca24',clip:'#2d3436',diamond:'#fdcb6e',kinetic:'#0652dd',barcount:'#009432',quote:'#b53471',post:'#1289a7',iconscene:'#f79f1f',bullets:'#3b9bff',phonewall:'#1e90ff',numgrid:'#54a0ff',compare2:'#2e86de',plans:'#4b7bec',timelist:'#3867d6',ctapill:'#0a84ff',adcard:'#fa8231',uimock:'#45aaf2',checklist:'#20bf6b',chips:'#2d98da',split:'#8e44ad',icontiles:'#ff4d4f',stepcards:'#3b9bff',screenclip:'#0a84ff',toggle:'#2ee67a',askq:'#ff3b4e',promo:'#e8132c',outword:'#ff3b4e',flowdiag:'#35e6ff',crossprice:'#e8132c',docfolder:'#d63031',topicend:'#ff3b4e',measure:'#ff4d4f',meme:'#ffd23b',wavestrip:'#35e6ff',ideatitle:'#a06bff',chipcarousel:'#8c5cff',flowline:'#7a4dff',chatmock:'#b794ff',statcard:'#a06bff',thumbwall:'#6a3cff',ladder:'#9b6bff',ring:'#c9a6ff',vidcard:'#7a4dff',gauge:'#ffd23b',barlist:'#8c5cff',tree:'#a06bff',cardtiles:'#b794ff',fan:'#9b6bff',replies:'#c9a6ff',vs2:'#ff6b9a',bonus:'#ffb347',prodnode:'#6a3cff',dotmap:'#7d4fe0',phoneann:'#0a84ff',vsvlog:'#feca57',energy:'#ff9f43',bestlast:'#1dd1a1',locked:'#8395a7',longstat:'#ee5a24',offer:'#f368e0',products:'#00d2d3',endscreen:'#e55039',search:'#576574',comments:'#ee5253',timeline:'#5f27cd',phone:'#778beb',rating:'#f6b93b',dash:'#2d98da',options:'#4834d4',levels:'#44bd32',short_hook:'#c0392b',short_stat:'#8e44ad',short_cta:'#e84393'};
const lab=sc=>{const d=sc.data||{};return String(d.headline||d.head||d.title||d.name||d.pre||d.line1||'').replace(/\s+/g,' ');};
const tc=t=>{t=Math.max(0,t);const m=Math.floor(t/60),s=Math.floor(t%60),f=Math.floor((t%1)*30);return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+':'+String(f).padStart(2,'0');};

function css(){
const s=mk('style');s.id='fm_css';s.textContent=`
body.fm{overflow:hidden;height:100vh;background:#15171c;font-size:13px}
body.fm #wrap{max-width:none;margin:0;padding:0;height:100vh;display:grid;grid-template-columns:var(--lw,410px) minmax(0,1fr) var(--rw,262px);position:relative;grid-template-rows:46px minmax(0,1fr) var(--th,284px);grid-template-areas:"top top top" "left mid right" "tl tl tl"}
#fm-top{grid-area:top;display:flex;align-items:center;gap:14px;padding:0 12px;background:#101216;border-bottom:1px solid #000}
#fm-top h1{font-size:15px;margin:0;font-weight:700;white-space:nowrap}#fm-top h1 span{color:var(--red)}
#fm-top #nav a{padding:4px 10px;font-size:12px;background:transparent;border-color:#2b2f38}
#fm-top .sp{flex:1}
#fm-top #info{margin:0;font-size:12px;color:#8b95a5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
#fm-exp{background:#00c389;color:#04130e;font-weight:700;padding:7px 18px;border-radius:6px;font-size:13px}
#fm-cls{background:#2b2f38;font-size:12px;padding:6px 10px}
#fm-left{grid-area:left;position:relative;display:flex;min-height:0;background:#1b1e25;border-right:1px solid #000}
#fm-rail{width:66px;flex:none;background:#14161b;display:flex;flex-direction:column;padding-top:4px}
#fm-rail button{background:transparent;border-radius:0;padding:10px 2px 8px;font-size:11px;color:#9aa3b2;border-left:3px solid transparent;line-height:1.2}
#fm-rail button b{display:block;font-size:20px;font-weight:400;margin-bottom:2px}
#fm-rail button.on{color:#00e0a0;background:#1b1e25;border-left-color:#00e0a0}
#fm-lp{flex:1;min-width:0;overflow:auto;padding:8px}
#fm-lp .view{margin-top:0;border:0;background:transparent;padding:4px}
#fm-mid{grid-area:mid;display:flex;flex-direction:column;min-width:0;min-height:0;background:#0f1115}
#fm-pv{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:10px;position:relative}
#fm-pv canvas{width:auto;aspect-ratio:auto;border:1px solid #000;border-radius:2px;flex:none}
#fm-mid #empty{margin:0 10px 8px}
#fm-tr{display:flex;align-items:center;gap:10px;padding:6px 12px;background:#14161b;border-top:1px solid #000}
#fm-tr #play{width:38px;height:32px;font-size:15px;background:#2b2f38}
#fm-tr #seek{flex:1}#fm-tr #tm{display:none}
#fm-tc{font:600 15px ui-monospace,Menlo,Consolas,monospace;color:#00e0a0;min-width:86px}
#fm-tt{font:12px ui-monospace,Menlo,Consolas,monospace;color:#8b95a5}
#fm-right{grid-area:right;overflow:auto;background:#1b1e25;border-left:1px solid #000;padding:10px}
#fm-right h3{margin:0 0 8px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:#8b95a5;font-weight:600}
#fm-right #quick{margin:0;flex-direction:column;align-items:stretch}
#fm-right #quick button,#fm-right #quick select{width:100%;text-align:left;border-radius:6px;padding:8px 10px}
#fm-right #kbd{margin-top:14px}
#fm-tl{grid-area:tl;display:flex;flex-direction:column;min-height:0;background:#181a20;border-top:1px solid #000}
#tl-tools{display:flex;align-items:center;gap:6px;padding:5px 10px;background:#14161b;border-bottom:1px solid #000;flex:none}
#tl-tools button{background:#2b2f38;padding:5px 10px;font-size:12px;border-radius:5px}
#tl-tools .sp{flex:1}#tl-tools input[type=range]{width:130px;accent-color:#00e0a0}
#tl-body{flex:1;display:flex;min-height:0}
#tl-lab{width:74px;flex:none;background:#14161b;border-right:1px solid #000;padding-top:26px}
#tl-lab div{display:flex;align-items:center;justify-content:center;font-size:11px;color:#8b95a5;border-bottom:1px solid #0d0e12}
#tl-sc{flex:1;min-width:0;overflow:auto;position:relative}
#tl-in{position:relative;min-height:100%}
#tl-ruler{height:26px;position:relative;background:#14161b;border-bottom:1px solid #000;cursor:col-resize}
#tl-ruler i{position:absolute;top:14px;bottom:0;width:1px;background:#3a3f4b}
#tl-ruler span{position:absolute;top:1px;font-size:10px;color:#8b95a5;padding-left:3px;user-select:none}
.tl-tr{position:relative;border-bottom:1px solid #0d0e12;background:#1d2027}
#tl-v{height:70px}#tl-a{height:56px}#tl-c{display:none;height:0}
.clip{position:absolute;top:6px;bottom:6px;border-radius:5px;overflow:hidden;cursor:pointer;border:2px solid rgba(255,255,255,.08);color:#fff;font-size:11px;padding:3px 6px;white-space:nowrap;user-select:none;box-shadow:0 1px 3px #0008}
.clip.sel{border-color:#fff;box-shadow:0 0 0 1px #00e0a0,0 1px 6px #000}
.clip b{display:block;font-size:11px}.clip small{opacity:.8;font-size:10px}
.clip .h{position:absolute;right:0;top:0;bottom:0;width:7px;cursor:ew-resize;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55))}
.clip .tx{position:absolute;left:0;top:0;bottom:0;background:repeating-linear-gradient(135deg,rgba(255,255,255,.35) 0 4px,rgba(255,255,255,.08) 4px 8px);pointer-events:none}
.clip .tg{position:absolute;left:2px;bottom:2px;font-size:9px;background:#000a;border-radius:3px;padding:0 3px;pointer-events:none}
.seg{position:absolute;top:3px;bottom:3px;border:1px solid #00e0a077;background:#00e0a014;border-radius:4px;font-size:10px;color:#7ff5d2;padding:1px 4px;overflow:hidden;white-space:nowrap;cursor:grab;z-index:2}
.seg.sel{border-color:#fff;background:#00e0a033}
.cap{cursor:grab;position:absolute;top:5px;bottom:5px;background:#3b4256;border:1px solid #556;border-radius:4px;font-size:10px;color:#dde;padding:2px 4px;overflow:hidden;white-space:nowrap}
#tl-wf{position:absolute;left:0;top:0;height:56px}
#tl-ph{position:absolute;top:0;bottom:0;width:0;z-index:5;pointer-events:none}
#tl-ph::before{content:"";position:absolute;left:-1px;top:0;bottom:0;width:2px;background:#ff3b55}
#tl-ph::after{content:"";position:absolute;left:-6px;top:0;border:6px solid transparent;border-top:9px solid #ff3b55}
.trb{position:absolute;left:0;bottom:0;height:15px;min-width:17px;padding:0 4px;background:#000c;border-radius:0 5px 0 0;font-size:9px;line-height:15px;z-index:3;cursor:pointer;color:#7ff5d2}
.trb:hover{background:#00c389;color:#04130e}
.ins{position:absolute;top:0;bottom:0;width:3px;background:#00e0a0;z-index:8;pointer-events:none;box-shadow:0 0 6px #00e0a0}
.snp{position:absolute;top:0;bottom:0;width:1px;background:#ffd400;z-index:7;pointer-events:none}
#tl-msg{font-size:12px;color:#ffd400;margin-left:8px}
.trm{position:fixed;z-index:60;background:#23262e;border:1px solid #000;border-radius:8px;padding:10px;width:250px;box-shadow:0 8px 28px #000c}
.trm h4{margin:0 0 8px;font-size:12px;color:#aab}
.trm .g{display:flex;flex-wrap:wrap;gap:5px}
.trm button{background:#2b2f38;padding:5px 8px;font-size:12px;border-radius:5px}
.trm button.on{background:#00c389;color:#04130e;font-weight:700}
.trm label{display:block;margin-top:9px;font-size:12px;color:#aab}.trm input[type=range]{width:100%;accent-color:#00e0a0}
#fm-props{margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #2b2f38}
#fm-props .pf{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
#fm-props .pf>label{font-size:11px;color:#8b95a5}
#fm-props .pf input[type=text],#fm-props .pf input[type=number],#fm-props .pf textarea,#fm-props .pf select{width:100%;padding:5px 7px;font-size:12px;background:#10141a;color:#e9edf3;border:1px solid #2a313c;border-radius:5px}
#fm-props .pf textarea{min-height:54px;resize:vertical;font-family:inherit}
#fm-props .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#fm-props .pm{font-size:11px;color:#6b7482;margin-top:4px}
#fm-props .sec{font-size:11px;color:#00e0a0;margin:10px 0 6px;font-weight:600}
#fm-media{position:absolute;left:66px;right:0;top:0;bottom:0;background:#1b1e25;display:none;flex-direction:column;z-index:6}
#fm-media .mh{padding:8px;display:flex;gap:6px;align-items:center}
#fm-media .mh button,#fm-media .chips button{background:#2b2f38;font-size:12px;padding:5px 10px;border-radius:6px}
#fm-media .mh button.on,#fm-media .chips button.on{background:#00c389;color:#04130e;font-weight:700}
#fm-media input[type=search]{flex:1;min-width:0;padding:6px 8px;font-size:12px;background:#10141a;color:#e9edf3;border:1px solid #2a313c;border-radius:6px}
#fm-media .chips{display:flex;gap:5px;flex-wrap:wrap;padding:0 8px 6px}
#fm-media .chips button{font-size:11px;padding:3px 9px;border-radius:12px}
#fm-media .mg{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:7px;padding:8px;align-content:start;grid-auto-rows:max-content}
.mi{background:#14161b;border:2px solid transparent;border-radius:6px;overflow:hidden;cursor:pointer;position:relative}
.mi.sel{border-color:#00e0a0}
.mi .th{height:66px;background:#2a2d35 center/cover no-repeat;display:flex;align-items:center;justify-content:center;color:#6b7482;font-size:18px}
.mi .th img{width:100%;height:100%;object-fit:contain;pointer-events:none}
.mi span.n{display:block;font-size:10px;padding:3px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#aab}
.mi .bd{position:absolute;top:3px;right:3px;font-size:10px;border-radius:8px;padding:0 5px;background:#00c389;color:#04130e}
.mi .bd.no{background:#e08a1e}
#fm-media .ma{padding:8px;border-top:1px solid #000;background:#14161b;display:flex;flex-direction:column;gap:6px}
#fm-media .ma .st{font-size:11px;color:#ffd400;min-height:14px}
#fm-media .ma .nm{font-size:11px;color:#9aa3b2;word-break:break-all}
#fm-media .ma button{background:#2b2f38;font-size:12px;padding:6px 8px;border-radius:6px;text-align:left}
#fm-media .ma button.pr{background:#00c389;color:#04130e;font-weight:700}
#tl-v.dz{outline:2px dashed #00e0a0;outline-offset:-3px}
#tl-rs{position:absolute;left:0;right:0;top:-6px;height:12px;cursor:ns-resize;z-index:9;touch-action:none}
#tl-rs:hover,#tl-rs.on{background:#00e0a055}
.vrs{position:absolute;top:46px;bottom:var(--th,284px);width:12px;cursor:ew-resize;z-index:9;touch-action:none}
#rs-l{left:calc(var(--lw,410px) - 6px)}#rs-r{right:calc(var(--rw,262px) - 6px)}
.vrs:hover,.vrs.on{background:#00e0a055}
body.fm.rsz{user-select:none;-webkit-user-select:none}
#fm-tl{position:relative}
.ctx{position:fixed;z-index:70;background:#23262e;border:1px solid #000;border-radius:8px;padding:4px;min-width:190px;box-shadow:0 8px 28px #000c}
.ctx button{display:block;width:100%;text-align:left;background:transparent;color:#e9edf3;padding:6px 10px;font-size:12px;border-radius:5px}
.ctx button:hover{background:#00c389;color:#04130e}
.ctx hr{border:0;border-top:1px solid #333a46;margin:3px 0}
#tl-empty{position:absolute;left:0;right:0;top:70px;text-align:center;color:#6b7482;font-size:12px;pointer-events:none}
`;document.head.appendChild(s);}

function boot(){
  const C=window.CORE,P=window.PLAYER,SE=window.SE,wrap=$('wrap');
  if(classic){const a=mk('a','', '🧩 Filmora layout');a.href='?layout=filmora';a.title='Filmora jaisa layout';$('nav').appendChild(a);return;}
  css();document.body.classList.add('fm');

  // ---------- top bar ----------
  const top=mk('div');top.id='fm-top';
  top.appendChild($('top').querySelector('h1'));top.appendChild($('nav'));top.appendChild(mk('div','sp'));
  top.appendChild($('info'));
  const cls=mk('button','','Classic layout');cls.id='fm-cls';cls.onclick=()=>{location.href=location.pathname+'?layout=classic';};
  const ex=mk('button','','⬇ Export');ex.id='fm-exp';ex.onclick=()=>{UI.open('export');setRail('export');};
  top.appendChild(cls);top.appendChild(ex);$('top').remove();

  // ---------- left: rail + panels ----------
  const left=mk('div');left.id='fm-left';const rail=mk('div');rail.id='fm-rail';const lp=mk('div');lp.id='fm-lp';
  const defs=[['scenes','🎬','Scenes'],['photos','🖼','Photos'],['audio','🎙','Audio'],['export','⬇','Export']];
  const rb={};
  const isOn=k=>UI.views[k]&&UI.views[k].style.display!=='none';
  let mediaOn=false;
  function setRail(cur){defs.forEach(([k])=>rb[k].classList.toggle('on',!mediaOn&&k===cur));if(rb.media)rb.media.classList.toggle('on',mediaOn);}
  defs.forEach(([k,ic,nm])=>{const b=mk('button','',`<b>${ic}</b>${nm}`);b.onclick=()=>{showMedia(false);if(!isOn(k))UI.open(k);setRail(k);};rail.appendChild(b);rb[k]=b;});
  {const mb=mk('button','','<b>🗂</b>Media');mb.onclick=()=>showMedia(!mediaOn);rail.insertBefore(mb,rail.firstChild);rb.media=mb;}
  Object.keys(UI.views).forEach(k=>lp.appendChild(UI.views[k]));
  const steps=$('steps');if(steps)steps.style.display='none';
  left.appendChild(rail);left.appendChild(lp);
  const uo=UI.open;UI.open=function(k){const r=uo.apply(this,arguments);const on=defs.find(([x])=>isOn(x));setRail(on?on[0]:null);return r;};
  if(!defs.some(([k])=>isOn(k)))UI.open('scenes');else setRail(defs.find(([k])=>isOn(k))[0]);

  // ---------- middle: preview + transport ----------
  const mid=mk('div');mid.id='fm-mid';const pv=mk('div');pv.id='fm-pv';pv.appendChild($('cv'));
  const tr=$('bar');tr.id='fm-tr';
  const tcEl=mk('span');tcEl.id='fm-tc';tcEl.textContent='00:00:00';const ttEl=mk('span');ttEl.id='fm-tt';
  tr.insertBefore(tcEl,$('seek'));tr.appendChild(ttEl);
  mid.appendChild(pv);mid.appendChild($('empty'));mid.appendChild(tr);
  function fitCv(){const cv=$('cv'),r=cv.width/cv.height,bw=pv.clientWidth-20,bh=pv.clientHeight-20;if(bw<=0||bh<=0)return;let w=bw,h=w/r;if(h>bh){h=bh;w=h*r;}cv.style.width=Math.floor(w)+'px';cv.style.height=Math.floor(h)+'px';}
  new ResizeObserver(fitCv).observe(pv);

  // ---------- right: look & effects ----------
  const right=mk('div');right.id='fm-right';right.appendChild(mk('h3','','Look &amp; Effects'));right.appendChild($('quick'));right.appendChild($('kbd'));

  // ---------- timeline ----------
  const tl=mk('div');tl.id='fm-tl';
  tl.innerHTML=`<div id="tl-tools"></div><div id="tl-body"><div id="tl-lab"><div style="height:70px">🎬 Video</div><div style="height:56px">🎙 Audio</div></div><div id="tl-sc"><div id="tl-in"><div id="tl-ruler"></div><div class="tl-tr" id="tl-v"></div><div class="tl-tr" id="tl-a"><canvas id="tl-wf" height="56"></canvas></div><div class="tl-tr" id="tl-c"></div><div id="tl-empty">Timeline khaali hai — Scenes tab mein JSON load karo ya scene jodo</div><div id="tl-ph"></div></div></div></div>`;
  wrap.insertBefore(top,wrap.firstChild);
  wrap.appendChild(left);wrap.appendChild(mid);wrap.appendChild(right);wrap.appendChild(tl);
  setTimeout(fitCv,0);

  const tools=$('tl-tools'),sc=$('tl-sc'),inn=$('tl-in'),ruler=$('tl-ruler'),vT=$('tl-v'),aT=$('tl-a'),cT=$('tl-c'),ph=$('tl-ph'),wf=$('tl-wf');
  const tb=(txt,fn,title)=>{const b=mk('button','',txt);b.onclick=fn;if(title)b.title=title;tools.appendChild(b);return b;};
  const commit=async()=>{await SE.apply(true);};
  const sel=()=>SE.scenes[SE.sel];
  tb('✂ Split (S)',()=>split(),'Playhead par scene ko do hisson mein todo');
  tb('⧉ Duplicate',()=>{const s=sel();if(!s)return;SE.scenes.splice(SE.sel+1,0,JSON.parse(JSON.stringify(s)));SE.sel++;commit();},'Chuna hua scene copy');
  tb('◀ Peeche',()=>{const i=SE.sel,j=i-1;if(j<0)return;[SE.scenes[i],SE.scenes[j]]=[SE.scenes[j],SE.scenes[i]];if(j===0)SE.scenes[0].trDur=0;SE.sel=j;commit();},'Scene ek jagah peeche');
  tb('Aage ▶',()=>{const i=SE.sel,j=i+1;if(j>=SE.scenes.length)return;[SE.scenes[i],SE.scenes[j]]=[SE.scenes[j],SE.scenes[i]];if(i===0)SE.scenes[0].trDur=0;SE.sel=j;commit();},'Scene ek jagah aage');
  tb('✕ Delete',()=>{if(!SE.scenes.length)return;SE.scenes.splice(SE.sel,1);SE.sel=Math.max(0,SE.sel-1);commit();},'Chuna hua scene hatao (Undo se wapas)');
  const msg=mk('span');msg.id='tl-msg';tools.appendChild(msg);let mt=0;let toast=t=>{msg.textContent=t;clearTimeout(mt);mt=setTimeout(()=>msg.textContent='',3000);};
  tools.appendChild(mk('div','sp'));
  const zl=mk('span','','🔍');tools.appendChild(zl);
  const zr=mk('input');zr.type='range';zr.min=4;zr.max=160;zr.step=1;zr.value=40;tools.appendChild(zr);
  tb('Fit',()=>{fit=true;draw(true);},'Poori timeline screen mein');
  let pps=40,fit=true;
  zr.oninput=()=>{fit=false;pps=+zr.value;draw(true);};

  // ---------- draw ----------
  let sig='',peaks=null,peakBuf=null,selSeg=null;
  const X=()=>window.EXPORT;
  function getPeaks(buf){if(peakBuf===buf)return peaks;const n=4000,d=buf.getChannelData(0),step=Math.max(1,Math.floor(d.length/n)),out=new Float32Array(n);
    for(let i=0;i<n;i++){let m=0;const a=i*step,b=Math.min(d.length,a+step);for(let k=a;k<b;k+=Math.max(1,step>>5)){const v=Math.abs(d[k]);if(v>m)m=v;}out[i]=m;}
    peakBuf=buf;peaks=out;return out;}
  function mkSig(){const a=X()&&X().audio;return JSON.stringify([C.format,C.total.toFixed(2),SE.scenes.map(s=>[s.type,s.dur,s.tr,s.trDur,lab(s)]),SE.sel,window.AT?AT.segs.map(s=>[s.name,s.start,s.buf.duration]):0,window.CAP?CAP.lines.map(l=>[l.t0,l.t1]):0,a?a.duration:0,pps,selSeg]);}
  function draw(force){
    const total=Math.max(C.total,1),a=X()&&X().audio,end=Math.max(total,a?a.duration:0);
    if(fit){pps=Math.max(4,Math.min(160,(sc.clientWidth-60)/end));zr.value=pps;}
    const s=mkSig();if(!force&&s===sig)return;sig=s;
    const W=Math.ceil(end*pps+80);inn.style.width=W+'px';
    // ruler
    const step=[0.5,1,2,5,10,15,30,60].find(x=>x*pps>=60)||60;ruler.innerHTML='';
    for(let t=0;t<=end+step;t+=step){const x=t*pps;ruler.appendChild(Object.assign(mk('i'),{style:'left:'+x+'px'}));const l=mk('span','',tc(t).slice(0,5));l.style.left=x+'px';ruler.appendChild(l);}
    // video clips
    vT.innerHTML='';$('tl-empty').style.display=SE.scenes.length?'none':'block';
    SE.scenes.forEach((scn,i)=>{
      const x=(C.starts[i]||0)*pps,w=Math.max(8,scn.dur*pps);
      const c=mk('div','clip'+(i===SE.sel?' sel':''));c.style.cssText+=`left:${x}px;width:${w}px;background:linear-gradient(180deg,${COL[scn.type]||'#555'},${COL[scn.type]||'#555'}cc)`;
      c.title=`${i+1}. ${scn.type} • ${scn.dur}s • transition: ${scn.tr||'cut'}${scn.trDur?' '+scn.trDur+'s':''}\nDrag kinaara = lamba/chhota. Click = chuno.`;
      c.innerHTML=`<b>${i+1}. ${scn.type}</b><small>${scn.dur}s</small>`+(w>90?`<small style="display:block;overflow:hidden;text-overflow:ellipsis">${lab(scn).replace(/</g,'&lt;')}</small>`:'')+'<i class="h"></i>';
      if(i>0&&scn.trDur>0&&scn.tr&&scn.tr!=='cut'){const t=mk('div','tx');t.style.width=Math.min(w,scn.trDur*pps)+'px';c.appendChild(t);}
      if(i>0){const tbn=mk('div','trb','◆'+(w>110?' '+(scn.tr||'cut'):''));tbn.title='Transition badlo ('+(scn.tr||'cut')+')';tbn.onmousedown=e=>{e.stopPropagation();e.preventDefault();trMenu(i,tbn);};c.appendChild(tbn);}
      c.onmousedown=e=>{if(e.target.classList.contains('h')||e.target.classList.contains('trb'))return;e.stopPropagation();dragClip(e,i,c);};
      c.querySelector('.h').onmousedown=e=>{e.stopPropagation();e.preventDefault();trim(e,i,c);};
      vT.appendChild(c);});
    // audio waveform
    cT.innerHTML='';[...aT.querySelectorAll('.seg')].forEach(n=>n.remove());
    const cw=Math.min(W,16000);wf.width=cw;wf.style.width=cw+'px';const g=wf.getContext('2d');g.clearRect(0,0,cw,56);
    if(a){const pk=getPeaks(a),aw=a.duration*pps,sx=Math.min(aw,cw);g.fillStyle='#00c389';
      for(let x=0;x<sx;x++){const v=pk[Math.min(pk.length-1,Math.floor(x/aw*pk.length))];const h=Math.max(1,v*50);g.fillRect(x,28-h/2,1,h);}}
    if(window.AT)AT.segs.forEach((sg,si)=>{const d=mk('div','seg'+(si===selSeg?' sel':''),sg.name);d.title=sg.name+' • '+sg.buf.duration.toFixed(1)+'s\nDrag = time badlo, Delete = hatao';d.style.left=sg.start*pps+'px';d.style.width=Math.max(10,sg.buf.duration*pps)+'px';d.onmousedown=e=>{e.stopPropagation();e.preventDefault();dragSeg(e,si,d);};aT.appendChild(d);});
    // captions
    if(window.CAP&&CAP.on)CAP.lines.forEach((l,ci)=>{const d=mk('div','cap');d.textContent=l.text.replace(/\*/g,'');d.title=l.text.replace(/\*/g,'')+'\nDrag = caption ka start time badlo';d.style.left=l.t0*pps+'px';d.style.width=Math.max(6,((l.t1||l.t0+1)-l.t0)*pps-2)+'px';d.onmousedown=e=>{e.stopPropagation();e.preventDefault();dragCap(e,ci,d);};cT.appendChild(d);});
    ttEl.textContent='/ '+tc(C.total);movePh(true);
  }
  function movePh(scroll){const x=P.t*pps;ph.style.left=x+'px';tcEl.textContent=tc(P.t);
    if(scroll&&P.playing){const v0=sc.scrollLeft,v1=v0+sc.clientWidth;if(x>v1-40||x<v0)sc.scrollLeft=Math.max(0,x-60);}}
  // ---------- interactions ----------
  function pick(i){selSeg=null;SE.sel=i;P.seek((C.starts[i]||0)+0.05);if(UI.views.scenes&&UI.views.scenes.style.display==='none')UI.open('scenes');try{SE.render();}catch(e){}draw(true);}
  function xToT(e){const r=inn.getBoundingClientRect();return Math.max(0,(e.clientX-r.left)/pps);}
  function scrub(e){P.seek(xToT(e));movePh();}
  function startScrub(e){if(e.button)return;if(selSeg!=null){selSeg=null;draw(true);}scrub(e);const mv=ev=>scrub(ev),up=()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up);};addEventListener('mousemove',mv);addEventListener('mouseup',up);}
  ruler.onmousedown=startScrub;[vT,aT,cT].forEach(n=>n.onmousedown=startScrub);
  function trim(e0,i,c){const scn=SE.scenes[i],d0=scn.dur,x0=e0.clientX;
    const st=C.starts[i]||0,pts=snapPts(i);let line=null;
    const mv=e=>{let nd=Math.max(0.5,+(d0+(e.clientX-x0)/pps).toFixed(1));const end=st+nd;
      const hit=pts.find(p=>Math.abs(p-end)*pps<8&&p-st>=0.5);
      if(hit!=null){nd=+(hit-st).toFixed(2);if(!line){line=mk('div','snp');inn.appendChild(line);}line.style.left=hit*pps+'px';}else if(line){line.remove();line=null;}
      scn.dur=nd;c.style.width=Math.max(8,nd*pps)+'px';c.querySelector('small').textContent=nd+'s';};
    const up=async()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up);if(line)line.remove();SE.sel=i;await commit();draw(true);};
    addEventListener('mousemove',mv);addEventListener('mouseup',up);}
  sc.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();fit=false;pps=Math.max(4,Math.min(160,pps*(e.deltaY<0?1.15:1/1.15)));zr.value=pps;draw(true);},{passive:false});

  // ---- F2: snap points, drag-reorder, split, transition menu ----
  function snapPts(skip,skipSeg,skipCap){const a=[P.t,0];SE.scenes.forEach((s,j)=>{if(j===skip)return;a.push(C.starts[j],C.starts[j]+s.dur);});
    if(window.CAP)CAP.lines.forEach((l,k)=>{if(k!==skipCap)a.push(l.t0);});if(window.AT)AT.segs.forEach((g,k)=>{if(k!==skipSeg)a.push(g.start,g.start+g.buf.duration);});return a;}
  function dragClip(e0,i,c){const x0=e0.clientX,scn=SE.scenes[i];let moved=false,target=i,mark=null;
    const others=SE.scenes.map((s,j)=>j).filter(j=>j!==i);
    const mv=e=>{const dx=e.clientX-x0;if(!moved&&Math.abs(dx)<6)return;moved=true;
      c.style.opacity='.55';c.style.zIndex=9;c.style.transform='translateX('+dx+'px)';
      const cx=C.starts[i]*pps+scn.dur*pps/2+dx;let k=0;others.forEach(j=>{if(C.starts[j]*pps+SE.scenes[j].dur*pps/2<cx)k++;});target=k;
      const bx=k<others.length?C.starts[others[k]]*pps:(C.starts[others[others.length-1]]+SE.scenes[others[others.length-1]].dur)*pps;
      if(!mark){mark=mk('div','ins');vT.appendChild(mark);}mark.style.left=(bx-1)+'px';};
    const up=async()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up);if(mark)mark.remove();
      if(!moved){pick(i);return;}
      c.style.transform='';c.style.opacity='';
      if(target===i){draw(true);return;}
      const wasFirst=i===0,[m]=SE.scenes.splice(i,1);SE.scenes.splice(target,0,m);
      if(wasFirst){if(!m.tr||m.tr==='cut')m.tr='grunge';if(!m.trDur)m.trDur=.7;}
      SE.scenes[0].trDur=0;SE.sel=target;await commit();draw(true);P.seek((C.starts[target]||0)+0.05);toast('Scene '+(i+1)+' → '+(target+1)+' par gaya (Undo se wapas)');};
    addEventListener('mousemove',mv);addEventListener('mouseup',up);}
  function dragSeg(e0,i,d){const sg=AT.segs[i],x0=e0.clientX,s0=sg.start,len=sg.buf.duration,pts=snapPts(-1,i,-1);let nt=s0,moved=false,line=null;
    if(selSeg!==i){selSeg=i;aT.querySelectorAll('.seg').forEach(n=>n.classList.remove('sel'));d.classList.add('sel');}
    const mv=e=>{const dx=e.clientX-x0;if(!moved&&Math.abs(dx)<4)return;moved=true;let t=Math.max(0,s0+dx/pps),best=8/pps,at=null;
      pts.forEach(p=>{if(Math.abs(t-p)<best){best=Math.abs(t-p);t=p;at=p;}else if(Math.abs(t+len-p)<best){best=Math.abs(t+len-p);t=p-len;at=p;}});
      t=Math.max(0,t);nt=t;d.style.left=t*pps+'px';
      if(at!=null){if(!line){line=mk('div','snp');inn.appendChild(line);}line.style.left=at*pps+'px';}else if(line){line.remove();line=null;}};
    const up=()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up);if(line)line.remove();
      if(moved){AT.nudge(i,+(nt-s0).toFixed(2));toast('Audio '+sg.name+' → '+sg.start.toFixed(2)+'s par');}
      sig='';draw(true);};
    addEventListener('mousemove',mv);addEventListener('mouseup',up);}
  function dragCap(e0,i,d){const L=CAP.lines,l=L[i],x0=e0.clientX,t00=l.t0,pts=snapPts(-1,-1,i);let nt=t00,moved=false,line=null;
    const lo=i?L[i-1].t0+.1:0,hi=i<L.length-1?L[i+1].t0-.1:Math.max(.1,C.total-.1);
    const mv=e=>{const dx=e.clientX-x0;if(!moved&&Math.abs(dx)<4)return;moved=true;let t=Math.max(lo,Math.min(hi,t00+dx/pps)),at=null;
      const h=pts.find(p=>Math.abs(p-t)*pps<8&&p>=lo&&p<=hi);if(h!=null){t=h;at=h;}
      nt=t;d.style.left=t*pps+'px';
      if(at!=null){if(!line){line=mk('div','snp');inn.appendChild(line);}line.style.left=at*pps+'px';}else if(line){line.remove();line=null;}};
    const up=()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up);if(line)line.remove();
      if(moved){CAP.nudge(i,+(nt-t00).toFixed(2));toast('Caption '+(i+1)+' ab '+L[i].t0.toFixed(2)+'s se shuru');P.draw();}
      sig='';draw(true);};
    addEventListener('mousemove',mv);addEventListener('mouseup',up);}
  function split(){let j=-1;SE.scenes.forEach((s,k)=>{if(P.t>=C.starts[k]&&P.t<C.starts[k]+s.dur)j=k;});
    if(j<0){toast('Playhead kisi scene par rakho');return;}
    const s=SE.scenes[j],lt=P.t-C.starts[j];if(lt<0.5||lt>s.dur-0.5){toast('Kinare se kam se kam 0.5s door todo');return;}
    const b=JSON.parse(JSON.stringify(s)),d=s.dur;b.tr='cut';b.trDur=0;s.dur=+lt.toFixed(2);b.dur=+(d-lt).toFixed(2);
    SE.scenes.splice(j+1,0,b);SE.sel=j+1;commit().then(()=>{draw(true);toast('Scene '+(j+1)+' do hisson mein bata');});}
  const TRL=['cut','fade','grunge','zoom','whip','glitch','flash','slideup','push','iris','blinds','rgb','spin','lightwipe','tiles','blurfade','split','chevron','torn'];
  let menu=null;const closeMenu=()=>{if(menu){menu.remove();menu=null;}};
  function trMenu(i,anchor){closeMenu();const scn=SE.scenes[i],m=mk('div','trm');menu=m;
    m.innerHTML='<h4>Transition — scene '+(i+1)+' ke shuru mein</h4><div class="g"></div><label>Lambai: <b></b>s<input type="range" min="0.2" max="1.5" step="0.1"></label>';
    const g=m.querySelector('.g'),rg=m.querySelector('input'),lb=m.querySelector('b');rg.value=scn.trDur||.7;lb.textContent=rg.value;
    const prev=async()=>{await commit();draw(true);P.seek((C.starts[i]||0)+(scn.trDur||.7)*0.5);};
    TRL.forEach(n=>{const b=mk('button',(scn.tr||'cut')===n?'on':'',n);b.onclick=async()=>{scn.tr=n;if(n!=='cut'&&!scn.trDur)scn.trDur=.7;if(n==='cut')scn.trDur=0;else if(!scn.trDur)scn.trDur=.7;await prev();[...g.children].forEach(x=>x.classList.toggle('on',x===b));};g.appendChild(b);});
    rg.oninput=()=>{lb.textContent=rg.value;};rg.onchange=async()=>{if((scn.tr||'cut')==='cut'){lb.textContent='—';return;}scn.trDur=+rg.value;await prev();};
    document.body.appendChild(m);const r=anchor.getBoundingClientRect();m.style.left=Math.min(innerWidth-262,Math.max(4,r.left))+'px';m.style.top=Math.max(4,r.top-m.offsetHeight-6)+'px';
    setTimeout(()=>{const off=e=>{if(menu&&!menu.contains(e.target)){closeMenu();removeEventListener('mousedown',off,true);}};addEventListener('mousedown',off,true);},0);}
  document.addEventListener('keydown',e=>{const t=e.target,tg=t&&t.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tg)||(t&&t.isContentEditable)||e.ctrlKey||e.metaKey||e.altKey)return;
    const k=(e.key||'').toLowerCase();if(k==='s'){e.preventDefault();split();}else if((k==='delete'||k==='backspace')&&selSeg!=null&&window.AT&&AT.segs[selSeg]){e.preventDefault();const nm=AT.segs[selSeg].name;AT.del(selSeg);selSeg=null;sig='';draw(true);toast('Audio '+nm+' hata diya');}else if((k==='delete'||k==='backspace')&&SE.scenes.length){e.preventDefault();SE.scenes.splice(SE.sel,1);SE.sel=Math.max(0,SE.sel-1);commit().then(()=>draw(true));}});

  // ---- F3: Properties panel (chune hue scene ke fields) ----
  const pr=mk('div');pr.id='fm-props';right.insertBefore(pr,right.firstChild);
  const dl=mk('datalist');dl.id='fm-photo-dl';document.body.appendChild(dl);
  (function(){const seen={};(window.PHOTO_SLOTS||[]).forEach(x=>{seen[x.id]=1;const o=mk('option');o.value=x.id;o.label=(x.hi||'')+' '+(x.en||'');dl.appendChild(o);});
    Object.keys(C.photos||{}).forEach(k=>{if(!seen[k]&&/^custom_/.test(k)){const o=mk('option');o.value=k;dl.appendChild(o);}});})();
  let psig='',ptm=0;
  const pj=()=>{const sc=SE.scenes[SE.sel];return SE.sel+'|'+SE.scenes.length+'|'+(sc?JSON.stringify(sc):'');};
  const LONG=/^(head|sub|note|title|line|headline|ticker|post|pre|cta)/;
  function props(force){const sg=pj();if(!force&&sg===psig)return;
    if(!force&&pr.contains(document.activeElement)&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
    psig=sg;buildProps();}
  function buildProps(){
    const i=SE.sel,sc=SE.scenes[i];pr.innerHTML='';
    if(!sc){pr.appendChild(mk('h3','','Properties'));pr.appendChild(mk('div','pm','Koi scene nahi. Scenes tab se scene jodo.'));return;}
    pr.appendChild(mk('h3','','Properties — '+(i+1)+'. '+sc.type));
    const edit=fn=>{fn();clearTimeout(ptm);ptm=setTimeout(async()=>{await SE.apply(true);psig=pj();draw(true);},350);};
    const fld=(label,el,cls)=>{const d=mk('div','pf '+(cls||''));d.appendChild(mk('label','',label));d.appendChild(el);return d;};
    const inp=(type,val)=>{const e=mk('input');e.type=type;if(val!=null)e.value=val;return e;};
    pr.appendChild(mk('div','sec','⏱ Timing'));
    const row=mk('div','two');
    const dN=inp('number',sc.dur);dN.step=.1;dN.min=.5;dN.oninput=()=>edit(()=>{sc.dur=Math.max(.5,parseFloat(dN.value)||sc.dur);});
    const cN=inp('number',sc.chunk||'');cN.step=1;cN.min=1;cN.oninput=()=>edit(()=>{const v=Math.round(+cN.value);if(v>=1)sc.chunk=v;else delete sc.chunk;});
    row.appendChild(fld('Duration (sec)',dN));row.appendChild(fld('Audio chunk #',cN));pr.appendChild(row);
    if(i>0){
      const sel=mk('select');TRL.forEach(t=>{const o=mk('option','',t);o.value=t;if((sc.tr||'cut')===t)o.selected=true;sel.appendChild(o);});
      sel.onchange=()=>edit(()=>{sc.tr=sel.value;if(sel.value==='cut')sc.trDur=0;else if(!sc.trDur)sc.trDur=.7;});
      const tr=inp('number',sc.trDur||0);tr.step=.1;tr.min=0;tr.max=2;tr.oninput=()=>edit(()=>{sc.trDur=Math.max(0,Math.min(2,parseFloat(tr.value)||0));});
      const r2=mk('div','two');r2.appendChild(fld('Transition',sel));r2.appendChild(fld('Transition (sec)',tr));pr.appendChild(r2);
    }
    pr.appendChild(mk('div','sec','🔤 Header line (upar)'));
    const hI=inp('text',sc.header||'');hI.placeholder='Jaise: Aaj ki *badi* khabar';hI.oninput=()=>edit(()=>{if(hI.value.trim())sc.header=hI.value;else delete sc.header;});
    pr.appendChild(fld('*shabd* = peela (khali = koi header nahi)',hI));
    pr.appendChild(mk('div','sec','💊 Pill row (1-3)'));
    const pI=inp('text',window.PILLS?PILLS.str(sc.pills):'');pI.placeholder='Sahi|g ; Galat|r ; Shayad|y';pI.oninput=()=>edit(()=>{const v=window.PILLS?PILLS.parse(pI.value):[];if(v.length)sc.pills=v;else{delete sc.pills;}});
    const pS=document.createElement('select');[['top','upar (header ke neeche)'],['mid','beech'],['low','neeche (caption ke upar)']].forEach(o=>pS.add(new Option(o[1],o[0])));pS.value=sc.pillsPos||'top';pS.onchange=()=>edit(()=>{if(pS.value==='top')delete sc.pillsPos;else sc.pillsPos=pS.value;});
    pr.appendChild(fld('text|rang ; text|rang  (g hara, r laal, y peela, x grey)',pI));pr.appendChild(fld('Pill jagah',pS));
    pr.appendChild(mk('div','sec','🔗 Carry chip (agle scene mein glide)'));
    const cI=inp('text',window.CARRY?CARRY.str(sc.carry):'');cI.placeholder='k1|CTR|0.5,0.5|y|1';cI.oninput=()=>edit(()=>{const v=window.CARRY?CARRY.parse(cI.value):null;if(v)sc.carry=v;else{delete sc.carry;}});
    pr.appendChild(fld('id|text|x,y|rang|size  (agle scene mein SAME id, nayi x,y = glide)',cI));
    pr.appendChild(mk('div','sec','✏ Content'));
    const d=sc.data||(sc.data={});let skipped=0;
    Object.keys(d).forEach(k=>{const v=d[k];
      if(typeof v==='boolean'){const c=inp('checkbox');c.checked=v;c.onchange=()=>edit(()=>{d[k]=c.checked;});const w=mk('div','pf');const l=mk('label');l.appendChild(c);l.appendChild(document.createTextNode(' '+k));w.appendChild(l);pr.appendChild(w);}
      else if(typeof v==='number'){const n=inp('number',v);n.step='any';n.oninput=()=>edit(()=>{const x=parseFloat(n.value);if(!isNaN(x))d[k]=x;});pr.appendChild(fld(k,n));}
      else if(typeof v==='string'){
        if(/^(photo|bg)$/.test(k)){const t=inp('text',v);t.setAttribute('list','fm-photo-dl');t.onchange=()=>edit(()=>{d[k]=t.value.trim();if(k==='photo'&&window.PHOTOS&&PHOTOS.ensureCustom)PHOTOS.ensureCustom(d[k]);});pr.appendChild(fld(k+(k==='photo'?' (photo slot naam)':''),t));}
        else if(v.length>34||LONG.test(k)){const t=mk('textarea');t.value=v;t.rows=Math.min(5,Math.max(2,Math.ceil(v.length/28)));t.oninput=()=>edit(()=>{d[k]=t.value;});pr.appendChild(fld(k,t));}
        else{const t=inp('text',v);t.oninput=()=>edit(()=>{d[k]=t.value;});pr.appendChild(fld(k,t));}}
      else if(Array.isArray(v)&&v.every(x=>typeof x==='string')){const t=mk('textarea');t.value=v.join('\n');t.rows=Math.min(6,Math.max(2,v.length));t.oninput=()=>edit(()=>{d[k]=t.value.split('\n');});pr.appendChild(fld(k+' (ek line = ek item)',t));}
      else skipped++;});
    if(skipped)pr.appendChild(mk('div','pm',skipped+' complex field Scenes panel ke JSON box mein edit karo.'));
  }

  // ---- F4: Media bin (overlay left panel par; neeche ke views jaise ke taise) ----
  const media=mk('div');media.id='fm-media';
  media.innerHTML='<div class="mh"><button data-m="assets" class="on">🖼 Assets</button><button data-m="photos">👤 Photos</button><input type="search" placeholder="khojo…"></div><div class="chips"></div><div class="mg"></div><div class="ma"><div class="nm">Koi item nahi chuna</div><div class="btns" style="display:flex;flex-direction:column;gap:6px"></div><div class="st"></div></div>';
  left.appendChild(media);
  const mgE=media.querySelector('.mg'),chE=media.querySelector('.chips'),nmE=media.querySelector('.nm'),btE=media.querySelector('.btns'),stE=media.querySelector('.st'),qE=media.querySelector('input');
  const ms={mode:'assets',cat:'',q:'',sel:null};
  const toast0=toast;toast=t=>{toast0(t);stE.textContent=t;};
  function showMedia(on){mediaOn=!!on;media.style.display=on?'flex':'none';if(on)renderMedia();const k=defs.find(([x])=>isOn(x));setRail(k?k[0]:null);}
  const CATL={'01_backgrounds':'Backgrounds','02_overlays':'Overlays','06_icons':'Icons','12_city_photos':'City/Stadium','13_logos':'Logos','14_channel_brand':'Channel brand'};
  const catName=f=>CATL[f]||f.replace(/^\d+_/,'');
  const slotList=()=>{const out=[],seen={};(window.PHOTO_SLOTS||[]).forEach(x=>{seen[x.id]=1;out.push({id:x.id,label:(x.hi||'')+' '+(x.en||''),city:x.city});});
    const add=id=>{if(id&&!seen[id]){seen[id]=1;out.push({id,label:id.replace(/^custom_/,'').replace(/_/g,' '),city:'custom'});}};
    Object.keys(C.photos||{}).forEach(add);SE.scenes.forEach(sc=>{const d=sc.data||{};add(d.photo);(d.photos||[]).forEach(add);});return out;};
  const hasPh=id=>!!(C.photos&&C.photos[id]&&C.photos[id].src);
  function renderMedia(){
    media.querySelectorAll('.mh button').forEach(b=>b.classList.toggle('on',b.dataset.m===ms.mode));
    let items,cats;
    if(ms.mode==='assets'){items=Object.keys(window.MANIFEST||{}).map(k=>({id:k,label:k.split('/').pop(),cat:k.split('/')[0]}));cats=[...new Set(items.map(x=>x.cat))].sort();}
    else{items=slotList().map(x=>({id:x.id,label:x.label,cat:x.city}));cats=[...new Set(items.map(x=>x.cat))];}
    chE.innerHTML='';const mkc=(v,t)=>{const b=mk('button',ms.cat===v?'on':'',t);b.onclick=()=>{ms.cat=v;renderMedia();};chE.appendChild(b);};
    mkc('','Sab');if(ms.mode==='photos')mkc('__up','✓ Uploaded');cats.forEach(c=>mkc(c,ms.mode==='assets'?catName(c):c));
    const q=ms.q.toLowerCase();mgE.innerHTML='';let n=0;
    items.forEach(it=>{
      if(ms.cat==='__up'){if(!hasPh(it.id))return;}else if(ms.cat&&it.cat!==ms.cat)return;
      if(q&&(it.label+' '+it.id).toLowerCase().indexOf(q)<0)return;
      if(++n>400)return;
      const c=mk('div','mi'+(ms.sel===it.id?' sel':''));c.draggable=true;c.title=it.id;
      const th=mk('div','th');
      if(ms.mode==='assets'){const im=mk('img');im.loading='lazy';im.src='assets/'+window.MANIFEST[it.id];th.appendChild(im);}
      else if(hasPh(it.id)){th.style.backgroundImage='url('+C.photos[it.id].src+')';th.style.backgroundPosition='top';}
      else th.textContent='👤';
      c.appendChild(th);c.appendChild(mk('span','n',it.label));
      if(ms.mode==='photos')c.appendChild(mk('span','bd'+(hasPh(it.id)?'':' no'),hasPh(it.id)?'✓':'photo chahiye'));
      c.onclick=()=>{ms.sel=it.id;renderMedia();};
      c.ondblclick=()=>useItem(it.id);
      c.ondragstart=e=>{e.dataTransfer.setData('text/plain',ms.mode+':'+it.id);e.dataTransfer.effectAllowed='copy';};
      mgE.appendChild(c);});
    if(!n)mgE.appendChild(mk('div','pm','Kuch nahi mila'));
    nmE.textContent=ms.sel?ms.sel:'Koi item nahi chuna. Click = chuno, double-click ya drag = scene par lagao.';
    btE.innerHTML='';const bt=(t,fn,cls)=>{const b=mk('button',cls||'',t);b.onclick=fn;btE.appendChild(b);};
    if(ms.sel){
      if(ms.mode==='assets'){bt('🖼 Chune hue scene ka background',()=>useItem(ms.sel),'pr');bt('➕ Naya hook scene is background ke saath',()=>newScene(ms.sel));}
      else{bt('📷 Chune hue scene mein lagao',()=>useItem(ms.sel),'pr');
        const up=mk('label','');up.style.cssText='background:#2b2f38;font-size:12px;padding:6px 8px;border-radius:6px;cursor:pointer';up.textContent='⬆ Is slot ke liye photo upload';
        const fi=mk('input');fi.type='file';fi.accept='image/*';fi.style.display='none';
        fi.onchange=async()=>{const f=fi.files[0];if(!f)return;try{await PHOTOS.set(ms.sel,f);await SE.apply(true);toast('Photo lag gayi ✓');}catch(e){toast('Photo error: '+e.message);}renderMedia();};
        up.appendChild(fi);btE.appendChild(up);}
    }
  }
  media.querySelector('.mh').addEventListener('click',e=>{const m=e.target.dataset&&e.target.dataset.m;if(m){ms.mode=m;ms.cat='';ms.sel=null;renderMedia();}});
  qE.oninput=()=>{ms.q=qE.value;renderMedia();};
  async function setBg(key,i){const sc=SE.scenes[i];if(!sc){toast('Pehle koi scene chuno / banao');return;}
    const d=sc.data||(sc.data={}),old=d.bg,had='bg' in d;d.bg=key;
    const ok=C.CARDS[sc.type]&&C.CARDS[sc.type].assets&&C.CARDS[sc.type].assets(d).indexOf(key)>=0;
    if(!ok){if(had)d.bg=old;else delete d.bg;toast('"'+sc.type+'" card mein background nahi badalta');return;}
    SE.sel=i;await commit();draw(true);props(true);toast('Scene '+(i+1)+' ka background badla');}
  async function setPhoto(id,i){const sc=SE.scenes[i];if(!sc){toast('Pehle koi scene chuno');return;}
    const d=sc.data||(sc.data={});
    if(Array.isArray(d.photos)){const k=d.photos.indexOf('');if(k>=0)d.photos[k]=id;else d.photos.push(id);}
    else if(sc.type==='stat'||sc.type==='retain'||sc.type==='short_stat'||'photo' in d)d.photo=id;
    else{toast('"'+sc.type+'" card mein photo nahi hoti');return;}
    SE.sel=i;await commit();draw(true);props(true);toast('Photo scene '+(i+1)+' mein lagi');}
  function useItem(id){if(ms.mode==='assets')setBg(id,SE.sel);else setPhoto(id,SE.sel);}
  async function newScene(key,at){const s={type:'hook',dur:4,tr:'grunge',trDur:.7,data:{pre:'ऊपर की लाइन',to:10,dec:0,unit:'करोड़',bg:key}};
    const pos=at==null?(SE.scenes.length?SE.sel+1:0):at;if(pos===0)delete s.tr,s.trDur=0;SE.scenes.splice(pos,0,s);if(SE.scenes.length>1)SE.scenes[0].trDur=0;
    SE.sel=pos;await commit();draw(true);props(true);P.seek((C.starts[pos]||0)+0.05);toast('Naya hook scene jud gaya');}
  // timeline par drop
  vT.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';vT.classList.add('dz');});
  vT.addEventListener('dragleave',()=>vT.classList.remove('dz'));
  vT.addEventListener('drop',e=>{e.preventDefault();vT.classList.remove('dz');const v=e.dataTransfer.getData('text/plain')||'';const m=v.match(/^(assets|photos):(.+)$/);if(!m)return;
    const t=xToT(e);let j=-1;SE.scenes.forEach((s,k)=>{if(t>=C.starts[k]&&t<C.starts[k]+s.dur)j=k;});
    if(m[1]==='assets'){if(j>=0)setBg(m[2],j);else newScene(m[2],SE.scenes.length);}else{if(j>=0)setPhoto(m[2],j);else toast('Photo kisi scene ke upar chhodo');}});


  // ---- F6: shortcuts + timeline resize + clip right-click menu ----
  // ---- C61: asli J/K/L shuttle (L aage 1x->2x->4x->8x, J peeche, K roko) ----
  let shSpeed=0,shTm=0;const tg0=P.toggle;
  const shClr=()=>{if(shTm){clearInterval(shTm);shTm=0;}};
  function shSet(sp){shClr();if(P.playing)tg0.call(P);shSpeed=0;if(!sp){toast('Shuttle ruka');return;}
    if(sp===1){if(P.t>=C.total-0.1)P.seek(0);tg0.call(P);shSpeed=1;toast('▶ 1x');return;}
    shSpeed=sp;toast((sp<0?'◀ ':'▶ ')+Math.abs(sp)+'x');let last=performance.now();
    shTm=setInterval(()=>{const n=performance.now(),dt=(n-last)/1000;last=n;const t=P.t+sp*dt;if(t<=0||t>=C.total-0.05){shClr();shSpeed=0;P.seek(t<=0?0:C.total);return;}P.seek(t);},40);}
  P.toggle=function(){shClr();shSpeed=0;return tg0.apply(this,arguments);};
  const FPSv=C.FPS||30,seekTo=t=>P.seek(t);
  const zoom=f=>{fit=false;pps=Math.max(4,Math.min(160,pps*f));zr.value=pps;draw(true);};
  const sceneAt=t=>{let j=-1;SE.scenes.forEach((s,k)=>{if(t>=C.starts[k]-1e-6&&t<C.starts[k]+s.dur-1e-6)j=k;});return j;};
  function dup(){const s=sel();if(!s){toast('Pehle scene chuno');return;}SE.scenes.splice(SE.sel+1,0,JSON.parse(JSON.stringify(s)));SE.sel++;commit().then(()=>{draw(true);toast('Scene copy ho gaya (Undo se wapas)');});}
  function delSel(){if(!SE.scenes.length)return;SE.scenes.splice(SE.sel,1);if(SE.scenes[0])SE.scenes[0].trDur=0;SE.sel=Math.max(0,Math.min(SE.sel,SE.scenes.length-1));commit().then(()=>draw(true));}
  function moveSel(d){const i=SE.sel,j=i+d;if(j<0||j>=SE.scenes.length)return;[SE.scenes[i],SE.scenes[j]]=[SE.scenes[j],SE.scenes[i]];SE.scenes[0].trDur=0;SE.sel=j;commit().then(()=>{draw(true);P.seek((C.starts[j]||0)+0.05);});}
  document.addEventListener('keydown',e=>{const t=e.target,tg=t&&t.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tg)||(t&&t.isContentEditable))return;
    const k=e.key||'',kl=k.toLowerCase();
    if((e.ctrlKey||e.metaKey)&&!e.altKey&&kl==='d'){e.preventDefault();dup();return;}
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(kl==='k'){e.preventDefault();if(shSpeed!==0||P.playing)shSet(0);else shSet(1);}
    else if(kl==='j'){e.preventDefault();shSet(shSpeed<0?Math.max(-8,shSpeed*2):-1);}
    else if(kl==='l'){e.preventDefault();shSet(shSpeed>0?Math.min(8,shSpeed*2):1);}
    else if(k==='+'||k==='='){e.preventDefault();zoom(1.25);}
    else if(k==='-'||k==='_'){e.preventDefault();zoom(1/1.25);}
    else if(k==='0'){e.preventDefault();fit=true;draw(true);}
    else if(k==='Home'){e.preventDefault();seekTo(0);sc.scrollLeft=0;}
    else if(k==='End'){e.preventDefault();seekTo(C.total);}
    else if(k===','){e.preventDefault();if(P.playing)P.toggle();seekTo(P.t-1/FPSv);}
    else if(k==='.'){e.preventDefault();if(P.playing)P.toggle();seekTo(P.t+1/FPSv);}
    else if(k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();const cur=sceneAt(P.t);let n;
      if(k==='ArrowUp'){n=(cur>=0&&P.t-C.starts[cur]>0.2)?cur:cur-1;}else n=cur+1;
      n=Math.max(0,Math.min(SE.scenes.length-1,n));if(SE.scenes.length)pick(n);}
    else if(k==='['){e.preventDefault();moveSel(-1);}
    else if(k===']'){e.preventDefault();moveSel(1);}
  });
  // C91: panel resize handles (left width, right width, timeline height) - mouse + touch, size yaad rehta hai, double-click = reset
  (function(){
    const LSK={lw:'cvt_lw',rw:'cvt_rw',th:'cvt_tlh'};
    const lim={lw:v=>Math.round(Math.max(200,Math.min(innerWidth*0.6,innerWidth-262-260,v))),
      rw:v=>Math.round(Math.max(180,Math.min(innerWidth*0.5,innerWidth-410-260,v))),
      th:v=>Math.round(Math.max(120,Math.min(innerHeight*0.7,v)))};
    const set=(k,v)=>{v=lim[k](v);wrap.style.setProperty('--'+k,v+'px');return v;};
    const save=(k,v)=>{try{localStorage.setItem(LSK[k],v);}catch(e){}};
    const load=k=>{try{const v=+localStorage.getItem(LSK[k]);if(v>0)set(k,v);}catch(e){}};
    const handle=(id,cls,title,k,axis,sign,cur)=>{
      const h=mk('div',cls);h.id=id;h.title=title;
      h.addEventListener('pointerdown',e=>{
        e.preventDefault();try{h.setPointerCapture(e.pointerId);}catch(_){}
        h.classList.add('on');document.body.classList.add('rsz');
        const p0=axis==='x'?e.clientX:e.clientY;const v0=cur();let v=v0;
        const mv=ev=>{const p=axis==='x'?ev.clientX:ev.clientY;v=set(k,v0+sign*(p-p0));fitCv();};
        const up=()=>{h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);
          h.classList.remove('on');document.body.classList.remove('rsz');save(k,v);fitCv();draw(true);};
        h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up);});
      h.ondblclick=()=>{wrap.style.removeProperty('--'+k);try{localStorage.removeItem(LSK[k]);}catch(e){}fitCv();draw(true);};
      return h;};
    const old=tl.querySelector('#tl-rs');if(old)old.remove();
    tl.appendChild(handle('tl-rs','','Upar-neeche kheencho = timeline ki height (double-click = reset)','th','y',-1,()=>tl.getBoundingClientRect().height));
    wrap.appendChild(handle('rs-l','vrs','Left-right kheencho = left panel ki chaudai (double-click = reset)','lw','x',1,()=>$('fm-left').getBoundingClientRect().width));
    wrap.appendChild(handle('rs-r','vrs','Left-right kheencho = right panel ki chaudai (double-click = reset)','rw','x',-1,()=>$('fm-right').getBoundingClientRect().width));
    ['lw','rw','th'].forEach(load);
    addEventListener('resize',()=>{['lw','rw','th'].forEach(k=>{const v=parseFloat(wrap.style.getPropertyValue('--'+k));if(v)set(k,v);});});
  })();
  // clip right-click menu
  let ctx=null;const closeCtx=()=>{if(ctx){ctx.remove();ctx=null;}};
  vT.addEventListener('contextmenu',e=>{const c=e.target.closest&&e.target.closest('.clip');if(!c)return;e.preventDefault();
    const i=[...vT.querySelectorAll('.clip')].indexOf(c);if(i<0)return;closeMenu();closeCtx();
    SE.sel=i;selSeg=null;const lt=P.t-C.starts[i];
    const m=mk('div','ctx');ctx=m;
    const it=(txt,fn,dis)=>{const b=mk('button','',txt);if(dis){b.disabled=true;b.style.opacity='.4';}b.onclick=()=>{closeCtx();fn();};m.appendChild(b);};
    it('✂ Playhead par split (S)',()=>{P.seek(Math.max(C.starts[i]+0.05,Math.min(P.t,C.starts[i]+SE.scenes[i].dur-0.05)));if(lt<0.5||lt>SE.scenes[i].dur-0.5){toast('Playhead is clip ke andar, kinare se 0.5s door rakho');return;}split();},lt<0.5||lt>SE.scenes[i].dur-0.5);
    it('⧉ Duplicate (Ctrl+D)',dup);
    it('◀ Ek jagah peeche ([)',()=>moveSel(-1),i===0);
    it('Aage ▶ ek jagah (])',()=>moveSel(1),i===SE.scenes.length-1);
    if(i>0)it('◆ Transition badlo…',()=>trMenu(i,c.querySelector('.trb')||c));
    m.appendChild(mk('hr'));
    it('✕ Delete',delSel);
    document.body.appendChild(m);m.style.left=Math.min(innerWidth-m.offsetWidth-4,e.clientX)+'px';m.style.top=Math.min(innerHeight-m.offsetHeight-4,e.clientY)+'px';
    draw(true);
    setTimeout(()=>{const off=ev=>{if(ctx&&!ctx.contains(ev.target)){closeCtx();removeEventListener('mousedown',off,true);}};addEventListener('mousedown',off,true);},0);});
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeCtx();closeMenu();}});
  // shortcut help (right panel)
  (function(){const k=$('kbd');if(!k)return;k.innerHTML='<b style="color:#8b95a5">Shortcuts</b><br>'+[
    ['Space / K','play-pause'],['J / K / L','shuttle: peeche / roko / aage (baar-baar = tez)'],['← →','1s peeche / aage'],[', .','1 frame'],['↑ ↓','pichla / agla scene'],['Home / End','shuru / aakhir'],
    ['S','split'],['Ctrl+D','duplicate'],['[ ]','scene peeche / aage'],['Del','hatao'],['+ − 0','zoom / fit'],['Ctrl+Z / Y','undo / redo'],['Right-click clip','menu']
  ].map(a=>'<kbd>'+a[0]+'</kbd> '+a[1]).join('<br>');})();

  // player draw hook -> playhead
  const d0=P.draw;P.draw=function(){const r=d0.apply(this,arguments);movePh(true);return r;};
  setInterval(()=>{try{fitCv();draw(false);props(false);}catch(e){console.error('timeline',e);}},400);
  addEventListener('resize',()=>{if(fit)draw(true);});
  draw(true);props(true);
  window.FM={shSet,dup,zoom,moveSel,showMedia,props:()=>props(true),split,trMenu,draw:()=>draw(true),fit:()=>{fit=true;draw(true);}};
}
const iv=setInterval(()=>{if(window.UI&&window.UI.views&&window.PLAYER&&window.SE&&window.CORE&&CORE.ready){clearInterval(iv);try{boot();}catch(e){console.error('Filmora shell error',e);}}},120);
})();
