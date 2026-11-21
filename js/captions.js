// C9a: captions overlay + script spread + nudge editor. API: CAP.init(player), CAP.spread(), CAP.draw(ctx,t)
(function(){
const C=window.CORE,K='cvt_caps';
const CAP=window.CAP={lines:[],on:false,script:'',P:null};
function dur(){return (window.EXPORT&&EXPORT.audio&&EXPORT.audio.duration)||C.total;}
function ends(){const L=CAP.lines,D=dur();L.forEach((l,i)=>l.t1=i<L.length-1?L[i+1].t0:D);}
// C191: script mein ⏸ aur expression emoji ho sakte hain (teleprompter ke liye); captions mein nahi dikhne chahiye
const clean=s=>String(s||'').replace(/⏸|\u200d|\ufe0f|\p{Extended_Pictographic}/gu,'').replace(/[ \t]{2,}/g,' ').replace(/[ \t]+$/gm,'');
CAP.clean=clean;
CAP.setScript=s=>{s=clean(s);CAP.script=s;CAP.lines=s.split('\n').map(x=>x.trim()).filter(Boolean).map(t=>({text:t,t0:0,t1:0}));CAP.spread();};
CAP.spread=()=>{const L=CAP.lines,D=dur();if(!L.length)return;const w=L.map(l=>l.text.length+6),sum=w.reduce((a,b)=>a+b,0);let t=0;
 L.forEach((l,i)=>{l.t0=+t.toFixed(2);t+=w[i]/sum*D;});ends();save();};
CAP.nudge=(i,d)=>{const L=CAP.lines,lo=i?L[i-1].t0+.1:0,hi=i<L.length-1?L[i+1].t0-.1:dur()-.1;L[i].t0=+Math.max(lo,Math.min(hi,L[i].t0+d)).toFixed(2);ends();save();};
function save(){try{localStorage.setItem(K,JSON.stringify({s:CAP.script,t:CAP.lines.map(l=>l.t0),on:CAP.on}));}catch(e){}}
function load(){try{const j=JSON.parse(localStorage.getItem(K)||'null');if(!j)return;CAP.script=clean(j.s||'');CAP.on=false;
 CAP.lines=CAP.script.split('\n').map(x=>x.trim()).filter(Boolean).map((t,i)=>({text:t,t0:(j.t&&j.t[i])||0,t1:0}));ends();}catch(e){}}
CAP.at=t=>{const L=CAP.lines;for(let i=L.length-1;i>=0;i--)if(t>=L[i].t0)return t<L[i].t1?L[i]:null;return null;};
// C64: caption styles (har video ka caption alag dikhe). CAP.st = {k:style, c:accent colour}; localStorage 'cvt_capstyle'
CAP.STYLES={box:'Box (purana)',outline:'Outline (bina box)',bar:'Poori patti',line:'Box + rang ki line',pop:'Pop (uchhal)',neon:'Neon glow',type:'Typewriter (ek-ek akshar)'};
CAP.COLORS={gold:'#ffd23f',cyan:'#3ec8ff',orange:'#ff7a3d',green:'#4cd964',pink:'#ff4d8d',white:'#ffffff'};
CAP.st={k:'box',c:'gold'};CAP.wh=false; // C65: word-by-word highlight
try{CAP.wh=localStorage.getItem('cvt_capwh')==='1';}catch(e){}
CAP.POS={normal:'Jagah: normal',low:'Jagah: thoda neeche',high:'Jagah: thoda upar',auto:'Jagah: AUTO (scene dekhkar)'};CAP.pos='normal'; // C67b: card text se takrao bachane ke liye
try{const v=localStorage.getItem('cvt_cappos');if(CAP.POS[v])CAP.pos=v;}catch(e){}
CAP.setPos=v=>{if(!CAP.POS[v])return;CAP.pos=v;try{localStorage.setItem('cvt_cappos',v);}catch(e){}};
CAP.setWH=v=>{CAP.wh=!!v;try{localStorage.setItem('cvt_capwh',CAP.wh?'1':'0');}catch(e){}};
try{const j=JSON.parse(localStorage.getItem('cvt_capstyle')||'null');if(j&&CAP.STYLES[j.k]&&CAP.COLORS[j.c])CAP.st=j;}catch(e){}
CAP.setStyle=(k,c)=>{if(CAP.STYLES[k])CAP.st.k=k;if(CAP.COLORS[c])CAP.st.c=c;try{localStorage.setItem('cvt_capstyle',JSON.stringify(CAP.st));}catch(e){}};
CAP.draw=(ctx,t)=>{if(!CAP.on)return;const l=CAP.at(t);if(!l)return;
 const sh=C.format==='short',cx=C.W/2,mw=sh?900:1560,cy=(CAP.pos==='auto'&&CAP._cy)?CAP._cy:(sh?1240:900)+({normal:0,low:sh?90:58,high:sh?-110:-95}[CAP.pos]||0),ml=sh?3:2,k=CAP.st.k,ac=CAP.COLORS[CAP.st.c]||'#ffd23f';
  let fp=sh?68:52,lh,lines;ctx.save();
  const sw=C.starWords(l.text),plain=sw.map(o=>o.w).join(' '),hasM=sw.some(o=>o.hl);
  for(;;){ctx.font=C.font(fp,'bold');lines=C.wrap(ctx,plain,mw);if(lines.length<=ml||fp<=(sh?38:30))break;fp-=2;} // C30: text kate nahi, font chhota
  lh=Math.round(fp*1.3);const h=lines.length*lh+30,y0=cy-h/2;
  const a=C.ease.clamp((t-l.t0)/.15);ctx.globalAlpha=a;
  const w=Math.max(...lines.map(s=>ctx.measureText(s).width))+70;
  ctx.textAlign='center';ctx.textBaseline='middle';
  // C65: active shabd (lambai ke hisaab se time), baaki shabd base rang mein
  const wl=lines.map(x=>x.split(' ').filter(Boolean)),flat=[].concat(...wl),wt=flat.map(x=>x.length+2),wsum=wt.reduce((a,b)=>a+b,0)||1;
  const pr=C.ease.clamp((t-l.t0)/Math.max(.3,(l.t1-l.t0)*.92));let act=0,acc=0;for(let q=0;q<flat.length;q++){acc+=wt[q]/wsum;if(pr<=acc){act=q;break;}act=q;}
  let wOff=0;
  const mcol=b=>String(b).toLowerCase()==='#fff'||String(b).toLowerCase()==='#ffffff'?'#F5C518':'#ffffff'; // C93: *shabd* ka rang base se alag
  const okM=hasM&&flat.length===sw.length;
  const put=(txt,y,base,stroke)=>{
    if(!CAP.wh&&!okM){if(stroke)ctx.strokeText(txt,cx,y);ctx.fillStyle=base;ctx.fillText(txt,cx,y);return;}
    const ws=txt.split(' ').filter(Boolean),sp=ctx.measureText(' ').width,ww=ws.map(x=>ctx.measureText(x).width),tw=ww.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
    let x=cx-tw/2;const ta=ctx.textAlign;ctx.textAlign='left';
    ws.forEach((wd,j)=>{const on=CAP.wh&&(wOff+j)===act,mk=okM&&sw[wOff+j]&&sw[wOff+j].hl;if(stroke)ctx.strokeText(wd,x,y);ctx.fillStyle=mk?mcol(base):on?ac:base;ctx.fillText(wd,x,y);x+=ww[j]+sp;});
    wOff+=ws.length;ctx.textAlign=ta;};
  if(k==='pop'){const u=C.ease.clamp((t-l.t0)/.28),sc=u<1?1+.18*Math.sin(u*Math.PI)*(1-u):1;ctx.translate(cx,cy);ctx.scale(sc,sc);ctx.translate(-cx,-cy);}
  if(k==='box'||k==='line'){
    ctx.fillStyle='rgba(0,0,0,.62)';ctx.beginPath();ctx.roundRect(cx-w/2,y0,w,h,16);ctx.fill();
    if(k==='line'){ctx.fillStyle=ac;ctx.fillRect(cx-w/2+24,y0+h-9,w-48,5);}
    ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=6;
    lines.forEach((s,i)=>put(s,y0+15+lh*(i+.5),'#fff',false));
  }else if(k==='bar'){
    const bh=h+26,by=cy-bh/2;ctx.fillStyle='rgba(8,10,16,.82)';ctx.fillRect(0,by,C.W,bh);ctx.fillStyle=ac;ctx.fillRect(0,by,C.W,6);
    ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=4;lines.forEach((s,i)=>put(s,by+13+lh*(i+.5)+3,'#fff',false));
  }else if(k==='neon'){ // C138 (G10): safed text + rang ka glow, bina box
    ctx.lineJoin='round';ctx.lineWidth=Math.max(2,Math.round(fp*.07));ctx.strokeStyle=ac;ctx.shadowColor=ac;ctx.shadowBlur=Math.round(fp*.7);ctx.fillStyle='#fff';
    lines.forEach((s,i)=>put(s,y0+15+lh*(i+.5),'#fff',true));ctx.shadowBlur=Math.round(fp*.25);lines.forEach((s,i)=>put(s,y0+15+lh*(i+.5),'#fff',false));
  }else if(k==='type'){ // C138 (G12): glass box + akshar ek-ek karke + cursor (*shabd* / shabd-highlight is style mein nahi)
    const gs=x=>{try{return Array.from(new Intl.Segmenter('hi',{granularity:'grapheme'}).segment(x),q=>q.segment);}catch(e){return Array.from(x);}}, G=lines.map(gs),tot=G.reduce((q,x)=>q+x.length,0),pr2=C.ease.clamp((t-l.t0)/Math.max(.4,Math.min(1.8,(l.t1-l.t0)*.6))),rv=Math.floor(tot*pr2+.0001); // akshar-cluster (matra tootte nahi)
    ctx.shadowColor=ac;ctx.shadowBlur=18;ctx.fillStyle='rgba(18,10,36,.88)';ctx.beginPath();ctx.roundRect(cx-w/2,y0,w,h,22);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=ac;ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#fff';ctx.textAlign='left';let left=rv,cur=null;
    lines.forEach((s,i)=>{const fw=ctx.measureText(s).width,x=cx-fw/2,yy=y0+15+lh*(i+.5),gl=G[i].length,n=Math.max(0,Math.min(gl,left)),part=G[i].slice(0,n).join('');ctx.fillText(part,x,yy);if(cur===null&&left<=gl&&(left<gl||i===lines.length-1))cur={x:x+ctx.measureText(part).width+4,y:yy};left-=gl;});
    if(cur&&(rv<tot||Math.floor(t*2)%2===0)){ctx.fillStyle=ac;ctx.fillRect(cur.x,cur.y-fp*.5,Math.max(4,fp*.09),fp);}
  }else{ // outline / pop: bina box, moti kaali outline, accent rang ka text
    ctx.lineJoin='round';ctx.lineWidth=Math.round(fp*.2);ctx.strokeStyle='#000';ctx.fillStyle=ac;ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=10;
    lines.forEach((s,i)=>put(s,y0+15+lh*(i+.5),CAP.wh?'#fff':ac,true));
  }
  ctx.restore();};
// C69: AUTO jagah — har scene ke liye (ek baar) 4 jagah ki 'bheed' naapta (pixel gradient), sabse khaali jagah chunta
CAP._ac={ref:null,map:{}};CAP._cy=0;
CAP.autoPick=(ctx,t,r0)=>{const S=C.scenes,st=C.starts||[];let idx=0;for(let i=st.length-1;i>=0;i--)if(t>=st[i]){idx=i;break;}
  if(CAP._ac.ref!==S||CAP._ac.fmt!==C.format){CAP._ac={ref:S,fmt:C.format,map:{}};}
  const m=CAP._ac.map,key=idx;if(m[key]){CAP._cy=m[key];return;}
  const sh=C.format==='short',cands=sh?[1060,1120,1180,1240,1300,1360,1420,1480]:[780,820,860,900,940,980],bw=sh?800:1100,bh=sh?150:110,sc=S[idx];
  const tm=st[idx]+Math.min((sc&&sc.dur)||2,4)*.55;let best=cands[sh?3:3],bs=1e18;
  try{r0(ctx,tm);
   cands.forEach((cy,ci)=>{const x0=Math.round(C.W/2-bw/2),y0=Math.round(cy-bh/2),d=ctx.getImageData(x0,y0,bw,bh).data;let g=0,n=0;
    for(let y=0;y<bh-4;y+=4)for(let x=0;x<bw-4;x+=4){const i=(y*bw+x)*4,j=(y*bw+x+4)*4,k2=((y+4)*bw+x)*4;
     const L0=d[i]*.3+d[i+1]*.59+d[i+2]*.11,L1=d[j]*.3+d[j+1]*.59+d[j+2]*.11,L2=d[k2]*.3+d[k2+1]*.59+d[k2+2]*.11;g+=Math.abs(L0-L1)+Math.abs(L0-L2);n++;}
    const score=g/n*(1+Math.abs(cy-(sh?1240:900))/(sh?3000:1500)); // normal ke paas wali jagah ko halka fayda
    if(score<bs){bs=score;best=cy;}});
  }catch(e){best=cands[3];}
  m[key]=best;CAP._cy=best;r0(ctx,t);};
const r0=C.render;C.render=function(ctx,t){r0(ctx,t);if(CAP.pos==='auto'&&CAP.on&&CAP.at(t))CAP.autoPick(ctx,t,r0);CAP.draw(ctx,t);};
let panel,list;
CAP.init=P=>{CAP.P=P;load();
 panel=document.createElement('div');panel.style.cssText='display:none;margin-top:8px;background:#1b1b1b;border-radius:6px;padding:8px';
 panel.innerHTML='<textarea id="capt" rows="5" placeholder="Script yahan paste karo (har line = ek caption)" style="width:100%;box-sizing:border-box;font-size:15px"></textarea><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px"><button id="cap1">Spread karo</button><label style="font-size:14px"><input type="checkbox" id="capon"> Captions dikhao</label><span style="font-size:12px;opacity:.7">Spread audio length par hota hai (audio nahi to video length)</span></div><div style=\"display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px\"><label style=\"font-size:14px\"><input type=\"checkbox\" id=\"capwh\"> Shabd-par-shabd highlight</label><select id=\"cappos\"></select><select id=\"capsty\"></select><select id=\"capcol\"></select></div><div id="capl" style="max-height:300px;overflow:auto;margin-top:6px"></div>';
 document.getElementById('wrap').insertBefore(panel,document.getElementById('info'));
 list=panel.querySelector('#capl');const ta=panel.querySelector('#capt');ta.value=CAP.script;panel.querySelector('#capon').checked=CAP.on;
 panel.querySelector('#cap1').onclick=()=>{CAP.setScript(ta.value);render();P.draw();};
 const ss=panel.querySelector('#capsty'),sc=panel.querySelector('#capcol');
 Object.keys(CAP.STYLES).forEach(x=>ss.add(new Option('Style: '+CAP.STYLES[x],x)));Object.keys(CAP.COLORS).forEach(x=>sc.add(new Option('Rang: '+x,x)));
 CAP.syncSel=()=>{ss.value=CAP.st.k;sc.value=CAP.st.c;};CAP.syncSel();
 const ps=panel.querySelector('#cappos');Object.keys(CAP.POS).forEach(x=>ps.add(new Option(CAP.POS[x],x)));ps.value=CAP.pos;ps.onchange=()=>{CAP.setPos(ps.value);P.draw();};CAP.syncPos=()=>{ps.value=CAP.pos;};
 const wc=panel.querySelector('#capwh');wc.checked=CAP.wh;wc.onchange=()=>{CAP.setWH(wc.checked);P.draw();};
 ss.onchange=sc.onchange=()=>{CAP.setStyle(ss.value,sc.value);P.draw();};
 panel.querySelector('#capon').onchange=e=>{CAP.on=e.target.checked;save();P.draw();};
 const b=document.createElement('button');b.style.display='none';b.textContent='💬 Captions';b.onclick=()=>{panel.style.display=panel.style.display==='none'?'block':'none';render();};
 document.getElementById('bar2').appendChild(b);};
function render(){if(panel.style.display==='none')return;list.textContent='';
 CAP.lines.forEach((l,i)=>{const r=document.createElement('div');r.style.cssText='display:flex;gap:6px;align-items:center;padding:3px 0;font-size:14px';
  const mk=(txt,fn,bg)=>{const b=document.createElement('button');b.textContent=txt;b.style.cssText='padding:5px 9px;font-size:13px;background:'+(bg||'#555');b.onclick=fn;return b;};
  const tm=document.createElement('span');tm.textContent=l.t0.toFixed(1)+'s';tm.style.cssText='width:48px;flex:none';
  r.append(mk('−',()=>{CAP.nudge(i,-.1);CAP.P.seek(l.t0+.05);render();}),tm,mk('+',()=>{CAP.nudge(i,.1);CAP.P.seek(l.t0+.05);render();}),
   mk('▶',()=>CAP.P.seek(l.t0+.05),'#2a6'));
  const tx=document.createElement('span');tx.textContent=l.text.replace(/\*/g,'');tx.style.flex='1';r.appendChild(tx);list.appendChild(r);});}
})();
