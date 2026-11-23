// C227: + Ripple toggle, transition select. C226: + lanes Audio (a1) aur Text (t1). C225: + trim (edge drag), split (playhead), zoom (scroll). C224 (S4-B3): Overlay timeline UI — Scenes ke neeche canvas lanes. Scenes lane (read-only) + Video 2 lane (OV.items): draw, click-seek, drag move, select, delete, props.
// Trim/split/snap-zyada = C225. API: OVT.show/hide/draw/pickAt/dragTo (tests ke liye). Design: docs/S4_DESIGN.md
(function(){const C=window.CORE,OV=window.OV;if(!C||!OV)return;
let P=window.PLAYER;
const OVT=window.OVT={sel:null,pps:1,x0:70,rowH:34,hdr:22,lanes:['v2','a1','t1'],open:false,zoom:1,edge:7,ripple:false};
const COLS=['#3b6fd8','#2a9d6f','#c27b1a','#9b4fd1','#c0453f','#2a8fa8'];
let panel,cv,ctx,selClip,props,info,raf=0,drag=null;
const W=()=>cv.clientWidth||600;
OVT.setZoom=z=>{OVT.zoom=Math.max(1,Math.min(8,z));if(cv)cv.style.width=(OVT.zoom*100)+'%';OVT.sync();};
OVT.layout=()=>{OVT.pps=Math.max(8,(W()-OVT.x0-10)/Math.max(1,C.total));};
const tx=t=>OVT.x0+t*OVT.pps,xt=x=>(x-OVT.x0)/OVT.pps;
OVT.laneAt=y=>{const r=Math.floor((y-OVT.hdr)/OVT.rowH);return r>=1&&r<=3?OVT.lanes[r-1]:null;};
OVT.pickAt=(x,y)=>{const ln=OVT.laneAt(y);if(!ln)return null;const t=xt(x);const a=OV.items.filter(o=>o.lane===ln&&t>=o.start&&t<=o.start+o.len);return a.length?a[a.length-1]:null;};
function snap(t,o){let best=Math.round(t*10)/10;const pts=[0].concat(C.starts||[],[C.total]);pts.forEach(p=>{if(Math.abs(p-t)<8/OVT.pps)best=p;});OV.items.forEach(q=>{if(q.id===o.id)return;[q.start,q.start+q.len].forEach(p=>{if(Math.abs(p-t)<8/OVT.pps)best=p;});});return Math.max(0,best);}
OVT.edgeAt=(o,x)=>{if(x-tx(o.start)<OVT.edge)return'l';if(tx(o.start+o.len)-x<OVT.edge)return'r';return'm';};
// C225: trim. s = drag shuru ka snapshot {start,len,in,speed,rev,clip}. Left trim: start+in badlo (ulti mein in wahi). Right trim: len (ulti mein in bhi).
OVT.trim=(id,edge,t,s)=>{const c=C.clips[s.clip];if(!c&&s.lane!=='t1')return;const sp=s.speed,dur=c?(c.dur||1e9):1e9,mx=dur-.05;t=snap(t,{id});let patch;
  if(edge==='l'){let d=t-s.start;d=Math.max(d,-s.start);d=Math.min(d,s.len-.2);
    if(s.rev)d=Math.max(d,-((mx-s.in)/sp-s.len));else d=Math.max(d,-s.in/sp);
    patch={start:s.start+d,len:s.len-d,in:s.rev?s.in:s.in+d*sp};}
  else{let nl=Math.max(.2,t-s.start);if(s.rev)nl=Math.min(nl,s.len+s.in/sp);else nl=Math.min(nl,(mx-s.in)/sp);
    patch={len:nl,in:s.rev?s.in+(s.len-nl)*sp:s.in};}
  OV.update(id,patch);if(OVT.ripple&&edge==='r'&&s.others)OVT.shift(s.others,patch.len-s.len);};
// C225: split at t (default playhead). Pehla hissa id rakhta hai, doosra naya. Ulti mein source order ulta hota hai.
OVT.split=(id,t)=>{const o=OV.get(id||OVT.sel);if(!o)return null;t=(t==null?P.t:t);if(!(t>o.start+.1&&t<o.start+o.len-.1))return null;
  const l1=t-o.start,l2=o.len-l1,sp=o.speed;
  const second=Object.assign({},o,{id:undefined,start:t,len:l2,in:o.rev?o.in:o.in+l1*sp,fadeIn:0});
  OV.update(o.id,{len:l1,in:o.rev?o.in+l2*sp:o.in,fadeOut:0});const n=OV.add(second);OVT.sel=n.id;OVT.sync();return n;};
// C227: ripple — same lane ke baad wale items delta se khiskao. others = [{id,start}] drag shuru ka snapshot
OVT.laterOf=o=>OV.items.filter(q=>q.id!==o.id&&q.lane===o.lane&&q.start>=o.start+o.len-1e-6).map(q=>({id:q.id,start:q.start}));
OVT.shift=(others,delta)=>{others.forEach(q=>{const x=OV.get(q.id);if(x&&Math.abs(x.start-Math.max(0,q.start+delta))>1e-9)OV.update(q.id,{start:Math.max(0,q.start+delta)});});};
OVT.remove=id=>{const o=OV.get(id);if(!o)return false;const later=OVT.ripple?OVT.laterOf(o):[],len=o.len;OV.del(id);if(later.length)OVT.shift(later,-len);if(OVT.sel===id)OVT.sel=null;OVT.sync();return true;};
// C231: lane badlo (sirf v2 <-> a1; t1 text alag data hai). a1 mein vol 0 ho to 1 (warna chup block)
OVT.moveLane=(id,ln)=>{const o=OV.get(id);if(!o||o.lane===ln||o.lane==='t1'||(ln!=='v2'&&ln!=='a1'))return false;OV.update(id,{lane:ln,vol:ln==='a1'&&!(o.vol>0)?1:o.vol});return true;};
OVT.dragTo=(id,start)=>{const o=OV.get(id);if(!o)return;OV.update(id,{start:snap(start,o)});};
OVT.draw=()=>{if(!cv||!OVT.open)return;const w=W(),h=cv.clientHeight||120,dpr=window.devicePixelRatio||1;
  if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);OVT.layout();ctx.fillStyle='#111';ctx.fillRect(0,0,w,h);
  ctx.font='11px sans-serif';ctx.textBaseline='middle';
  const step=OVT.pps>40?1:OVT.pps>16?2:5;ctx.fillStyle='#888';ctx.strokeStyle='#333';
  for(let s=0;s<=C.total;s+=step){const x=tx(s);ctx.beginPath();ctx.moveTo(x,OVT.hdr-4);ctx.lineTo(x,h);ctx.stroke();ctx.fillText(s+'s',x+2,OVT.hdr/2);}
  const y1=OVT.hdr,LN=['Video 2','Audio','Text'];ctx.fillStyle='#999';ctx.fillText('Scenes',6,y1+OVT.rowH/2);LN.forEach((n,i)=>ctx.fillText(n,6,y1+OVT.rowH*(i+1)+OVT.rowH/2));
  (C.scenes||[]).forEach((sc,i)=>{const x=tx(C.starts[i]),w2=sc.dur*OVT.pps;ctx.fillStyle='#2b2f3a';ctx.fillRect(x+1,y1+3,w2-2,OVT.rowH-6);ctx.fillStyle='#bbb';ctx.save();ctx.beginPath();ctx.rect(x+1,y1,w2-2,OVT.rowH);ctx.clip();ctx.fillText((i+1)+' '+sc.type,x+4,y1+OVT.rowH/2);ctx.restore();});
  const LC={v2:null,a1:'#1f8a70',t1:'#a8741a'};
  OV.items.forEach((o,i)=>{const row=OVT.lanes.indexOf(o.lane)+1;if(row<1)return;const y2=y1+OVT.rowH*row,x=tx(o.start),w2=Math.max(4,o.len*OVT.pps),on=o.id===OVT.sel,off=o.start>=C.total;
    ctx.fillStyle=off?'#555':(LC[o.lane]||COLS[i%COLS.length]);ctx.fillRect(x,y2+3,w2,OVT.rowH-6);if(on){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,y2+3,w2,OVT.rowH-6);ctx.lineWidth=1;}
    ctx.fillStyle='#fff';ctx.save();ctx.beginPath();ctx.rect(x,y2,w2,OVT.rowH);ctx.clip();ctx.fillText(o.lane==='t1'?('T '+o.text):((o.clip||'?')+(o.speed!==1?' '+o.speed+'x':'')+(o.rev?' ◀':'')+(o.vol>0&&o.lane==='v2'?' 🔊':'')),x+4,y2+OVT.rowH/2);ctx.restore();});
  const px=tx(P.t||0);ctx.strokeStyle='#ff4040';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,h);ctx.stroke();ctx.lineWidth=1;};
function loop(){OVT.draw();raf=OVT.open?requestAnimationFrame(loop):0;}
function refreshProps(){const o=OV.get(OVT.sel);props.style.display=o?'flex':'none';if(!o){info.textContent=OV.items.length?'Block chuno ya timeline par click karo (red line = playhead).':'Clip chuno, "＋ Playhead par jodo" dabao.';return;}
  props.querySelector('#ovt_tr').value=o.tr;props.querySelector('#ovt_trd').value=o.trDur;props.querySelector('#ovt_tp').style.display=o.lane==='t1'?'inline-flex':'none';if(o.lane==='t1'){props.querySelector('#ovt_t2').value=o.text;props.querySelector('#ovt_pos').value=o.tpos;props.querySelector('#ovt_sz').value=o.tsize;props.querySelector('#ovt_bg').checked=o.tbg;props.querySelector('#ovt_col').value=o.tcolor;props.querySelector('#ovt_fnt').value=o.tfont;}
  info.textContent=(o.lane==='t1'?'text':o.clip)+' · start '+o.start.toFixed(1)+'s · len '+o.len.toFixed(1)+'s';
  props.querySelector('#ovt_vol').value=Math.round(o.vol*100);props.querySelector('#ovt_spd').value=o.speed;props.querySelector('#ovt_fit').value=o.fit;props.querySelector('#ovt_len').value=o.len;props.querySelector('#ovt_st').value=o.start;}
function refreshClips(){const k=Object.keys(C.clips||{});selClip.innerHTML=k.length?k.map(n=>'<option>'+n+'</option>').join(''):'<option value="">(pehle 🎞 Clips se upload)</option>';}
OVT.add=name=>{name=name||selClip.value;const c=C.clips[name];if(!c)return null;const o=OV.add({clip:name,start:Math.min(P.t||0,Math.max(0,C.total-.5)),len:Math.min(5,Math.max(.5,c.dur||3)),fit:'pip'});OVT.sel=o.id;OVT.sync();return o;};
OVT.addAudio=name=>{name=name||selClip.value;const c=C.clips[name];if(!c)return null;const o=OV.add({lane:'a1',clip:name,start:Math.min(P.t||0,Math.max(0,C.total-.5)),len:Math.min(8,Math.max(.5,c.dur||3)),vol:1});OVT.sel=o.id;OVT.sync();return o;};
OVT.addText=txt=>{txt=(txt||'').trim()||'Text';const o=OV.add({lane:'t1',text:txt,start:Math.min(P.t||0,Math.max(0,C.total-.5)),len:Math.min(3,Math.max(.5,C.total-(P.t||0)))});OVT.sel=o.id;OVT.sync();return o;};
OVT.build=()=>{panel=document.createElement('div');panel.id='ovt';panel.style.cssText='display:none;margin-top:8px;background:#1b1b1b;border-radius:6px;padding:8px';
  panel.innerHTML='<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px"><select id="ovt_clip" style="padding:6px"></select><button id="ovt_add" style="padding:8px 12px;background:#2a6;border-radius:6px">＋ Playhead par jodo</button><button id="ovt_aud" style="padding:8px 12px;background:#1f8a70;border-radius:6px">＋ Audio</button><input id="ovt_txt" placeholder="text likho" style="width:120px;padding:6px"><button id="ovt_addt" style="padding:8px 12px;background:#a8741a;border-radius:6px">＋ Text</button><button id="ovt_split" style="padding:8px 12px;background:#2a6fdb;border-radius:6px">✂ Split</button><button id="ovt_zo" style="padding:8px 10px">−</button><button id="ovt_zi" style="padding:8px 10px">＋</button><label style="font-size:13px"><input id="ovt_rip" type="checkbox"> Ripple</label><button id="ovt_del" style="padding:8px 12px;background:#a33;border-radius:6px">🗑 Hatao</button><span id="ovt_info" style="font-size:13px;color:#bbb"></span></div>'
   +'<div id="ovt_sc" style="overflow-x:auto"><canvas id="ovt_cv" style="width:100%;height:158px;display:block;border-radius:4px;touch-action:none;cursor:pointer"></canvas></div>'
   +'<div id="ovt_props" style="display:none;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px;font-size:13px">'
   +'<label>start <input id="ovt_st" type="number" step="0.1" min="0" style="width:62px"></label><label>len <input id="ovt_len" type="number" step="0.1" min="0.2" style="width:62px"></label>'
   +'<label>awaaz % <input id="ovt_vol" type="number" min="0" max="300" step="10" style="width:62px"></label><label>speed <input id="ovt_spd" type="number" min="0.25" max="4" step="0.25" style="width:60px"></label>'
   +'<label>fit <select id="ovt_fit"><option>pip</option><option>full</option><option>contain</option></select></label><label>transition <select id="ovt_tr"><option>none</option><option>fade</option><option>slide</option><option>zoom</option><option>wipe</option></select></label><label>sec <input id="ovt_trd" type="number" min="0.1" max="2" step="0.1" style="width:52px"></label><span id="ovt_tp" style="display:none;gap:8px;align-items:center"><label>text <input id="ovt_t2" style="width:140px"></label><label>jagah <select id="ovt_pos"><option>bottom</option><option>center</option><option>top</option></select></label><label>size <input id="ovt_sz" type="number" min="16" max="200" step="4" style="width:56px"></label><label>rang <input id="ovt_col" type="color" style="width:38px;height:28px;padding:0"></label><label>font <select id="ovt_fnt"><option value="default">default</option><option>serif</option><option>mono</option><option>impact</option><option>hand</option></select></label><label><input id="ovt_bg" type="checkbox"> bg</label></span></div>';
  document.getElementById('wrap').insertBefore(panel,document.getElementById('info'));
  cv=panel.querySelector('#ovt_cv');ctx=cv.getContext('2d');selClip=panel.querySelector('#ovt_clip');props=panel.querySelector('#ovt_props');info=panel.querySelector('#ovt_info');
  panel.querySelector('#ovt_add').onclick=()=>{OVT.add();};
  panel.querySelector('#ovt_aud').onclick=()=>{OVT.addAudio();};panel.querySelector('#ovt_addt').onclick=()=>{OVT.addText(panel.querySelector('#ovt_txt').value);};
  panel.querySelector('#ovt_rip').onchange=e=>{OVT.ripple=e.target.checked;};
  panel.querySelector('#ovt_split').onclick=()=>{OVT.split();};panel.querySelector('#ovt_zi').onclick=()=>OVT.setZoom(OVT.zoom*2);panel.querySelector('#ovt_zo').onclick=()=>OVT.setZoom(OVT.zoom/2);
  panel.querySelector('#ovt_del').onclick=()=>{if(OVT.sel)OVT.remove(OVT.sel);};
  const upd=(k,f)=>panel.querySelector('#ovt_'+k).onchange=e=>{if(OVT.sel){const v=f(e.target.value);OV.update(OVT.sel,v);}};
  upd('tr',v=>({tr:v}));upd('trd',v=>({trDur:parseFloat(v)||.4}));upd('t2',v=>({text:v}));upd('pos',v=>({tpos:v}));upd('sz',v=>({tsize:parseFloat(v)||56}));upd('col',v=>({tcolor:v}));upd('fnt',v=>({tfont:v}));panel.querySelector('#ovt_bg').onchange=e=>{if(OVT.sel)OV.update(OVT.sel,{tbg:e.target.checked});};
  upd('vol',v=>({vol:(parseFloat(v)||0)/100}));upd('spd',v=>({speed:parseFloat(v)||1}));upd('fit',v=>({fit:v}));upd('len',v=>({len:parseFloat(v)||1}));upd('st',v=>({start:parseFloat(v)||0}));
  const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];};
  cv.onpointerdown=e=>{const[x,y]=pos(e),o=OVT.pickAt(x,y);if(o){OVT.sel=o.id;drag={id:o.id,dx:xt(x)-o.start,edge:OVT.edgeAt(o,x),snap:Object.assign({others:OVT.ripple?OVT.laterOf(o):null},o)};cv.setPointerCapture(e.pointerId);}else{OVT.sel=null;P.seek(Math.max(0,xt(x)));}OVT.sync();};
  cv.onpointermove=e=>{const[x,y]=pos(e);if(!drag){const o=OVT.pickAt(x,y);cv.style.cursor=o&&OVT.edgeAt(o,x)!=='m'?'ew-resize':o?'grab':'pointer';return;}if(drag.edge==='m'){OVT.dragTo(drag.id,xt(x)-drag.dx);const ln=OVT.laneAt(y);if(ln)OVT.moveLane(drag.id,ln);}else OVT.trim(drag.id,drag.edge,xt(x),drag.snap);};
  cv.onpointerup=cv.onpointercancel=()=>{drag=null;};
  const b=document.createElement('button');b.id='ovt_btn';b.textContent='🎞 Overlay timeline';b.onclick=()=>OVT.open?OVT.hide():OVT.show();document.getElementById('bar2').appendChild(b);
  let rd=false;const prev=OV.onChange;OV.onChange=()=>{if(prev)prev();OVT.sync();if(rd||!P||P.playing||C.exporting)return;rd=true;try{P.seek(P.t);}catch(e){}rd=false;};};
OVT.sync=()=>{if(!panel)return;refreshProps();OVT.draw();};
OVT.show=()=>{OVT.open=true;panel.style.display='block';refreshClips();OVT.sync();if(!raf)raf=requestAnimationFrame(loop);};
OVT.hide=()=>{OVT.open=false;panel.style.display='none';};
const go=()=>{P=window.PLAYER;if(!P||!document.getElementById('bar2'))return false;OVT.build();return true;};
if(!go()){const iv=setInterval(()=>{if(go())clearInterval(iv);},100);setTimeout(()=>clearInterval(iv),15000);}
})();
