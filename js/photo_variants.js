// C173: ek player ki KAI photos + har baar nayi photo (auto-rotate) + auto player cameo.
// Variant photo = slot id + '#2', '#3'... (IndexedDB mein alag key). Scenes JSON mein koi badlav nahi: wahi slot id likho.
// Rule: jis scene mein slot pehli baar aaye -> 1st photo, doosri baar -> 2nd, ... (photos khatam to dobara 1st se).
// Cameo: jis scene ke text mein uploaded player ka naam ho aur us scene mein uski photo na ho, wahan corner mein animated player card aata hai.
(function(){
const C=window.CORE;if(!C||!C.photos)return;
const base=C.photos,vars={};let cur=-1,epoch=0,bump=0;
const bk=k=>String(k).split('#')[0];
function addV(k){const b=bk(k);if(b===k)return;(vars[b]=vars[b]||[]);if(vars[b].indexOf(k)<0){vars[b].push(k);vars[b].sort((x,y)=>(+x.split('#')[1])-(+y.split('#')[1]));}}
function delV(k){const b=bk(k);if(vars[b])vars[b]=vars[b].filter(x=>x!==k);}
let refMemo={},cam=[],camFor=null;
const strs=sc=>{if(sc.__s==null)try{sc.__s=JSON.stringify(sc.data||{});}catch(e){sc.__s='';}return sc.__s;};
function refs(j,k){const sc=C.scenes[j];if(!sc)return false;if(strs(sc).indexOf('"'+k+'"')>=0)return true;const cm=cameoMap()[j];return !!cm&&cm.indexOf(k)>=0;}
function occ(i,k){const key=i+'|'+k;if(key in refMemo)return refMemo[key];let n=0;for(let j=0;j<i;j++)if(refs(j,k))n++;return refMemo[key]=n;}
C.photos=new Proxy(base,{
 get(t,k){if(typeof k!=='string'||k.indexOf('#')>=0)return t[k];
  const v=vars[k];if(!v||!v.length||cur<0)return t[k];
  const all=(t[k]?[k]:[]).concat(v.filter(x=>t[x]));if(all.length<2)return all.length?t[all[0]]:t[k];
  return t[all[(occ(cur,k)+bump)%all.length]];},
 set(t,k,v){t[k]=v;addV(k);return true;},
 deleteProperty(t,k){delete t[k];delV(k);return true;}
});
Object.keys(base).forEach(addV);
C.photoVariants=k=>(vars[k]||[]).slice();
// ---- cameo (auto player card) ----
const ON={v:(function(){try{return localStorage.getItem('cvt_cameo')!=='0';}catch(e){return true;}})()};
C.CAMEO=ON;
function names(){const out=[],S=(window.PHOTOS&&window.PHOTOS.slots)?window.PHOTOS.slots():(window.PHOTO_SLOTS||[]);
 S.forEach(s=>{if(!base[s.id])return;const a=[];if(s.hi&&s.hi.length>=2)a.push(s.hi);
  if(s.en){a.push(s.en);const p=s.en.split(/\s+/);if(p.length>1&&p[p.length-1].length>=4)a.push(p[p.length-1]);}
  if(a.length)out.push({id:s.id,hi:s.hi||s.en,a:a.map(x=>x.toLowerCase())});});return out;}
function cameoMap(){if(camFor===C.scenes&&cam._n===epoch)return cam;camFor=C.scenes;cam=[];cam._n=epoch;if(!C.scenes)return cam;
 const N=names();
 C.scenes.forEach((sc,i)=>{const d=sc.data||{};if(d.noCameo||sc.type==='cta'||sc.type==='presenter')return;const s=strs(sc),sl=s.toLowerCase(),hits=[];
  N.forEach(n=>{if(s.indexOf('"'+n.id+'"')>=0)return;let pos=1e9;n.a.forEach(a=>{const p=sl.indexOf(a);if(p>=0&&p<pos)pos=p;});if(pos<1e9)hits.push([pos,n.id]);});
  hits.sort((x,y)=>x[0]-y[0]);const ids=hits.slice(0,2).map(h=>h[1]).filter(id=>!(i>0&&cam[i-1]&&cam[i-1].indexOf(id)>=0));if(ids.length)cam[i]=ids;});return cam;}
function cover(ctx,im,x,y,w,h,zoom){const sw=im.width,sh=im.height,ar=w/h;let cw=sw,ch=sw/ar;if(ch>sh){ch=sh;cw=sh*ar;}
 cw/=zoom;ch/=zoom;ctx.drawImage(im,(sw-cw)/2,0,cw,ch,x,y,w,h);}
const E=t=>1-Math.pow(1-t,3),BK=t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
// C179: cameo card list/wide card ke upar na aaye aur caption ko na dhake.
// CAM_AVOID[card type] = content ka [left,right] hissa (W ka fraction). Dono taraf jagah kam ho to cameo chhota hota hai, bilkul na ho to is scene mein nahi aata.
const CAM_AVOID={stack:[.14,.86],qcards:[.05,.95],bigwords:[.08,.92],bullets:[.14,.86],timelist:[.14,.86],checklist:[.14,.86],options:[.14,.86],barlist:[.14,.86],ladder:[.14,.86]};
function capTopY(t,H,s){try{const K=window.CAP;if(!K||!K.on||!K.at||!K.at(t))return null;const sh=C.format==='short',cy=(K.pos==='auto'&&K._cy)?K._cy:(sh?1240:900)+({normal:0,low:sh?90:58,high:sh?-110:-95}[K.pos]||0);return cy-100*(H/1080);}catch(e){return null;}}
function drawCameo(ctx,t){if(!ON.v||!C.scenes||!C.starts)return;let b=-1;
 C.scenes.forEach((sc,i)=>{if(t>=C.starts[i]&&t<C.starts[i]+sc.dur)b=i;});if(b<0)return;
 const ids=cameoMap()[b];if(!ids)return;const sc=C.scenes[b],lt=t-C.starts[b];if(sc.dur<2.2)return;
 const refresh=sc.dur>=7?sc.dur/2:0,seg=refresh&&lt>=refresh?1:0;
 ids.forEach((id,n)=>{cur=b;bump=seg;const im=C.photos[id];cur=-1;bump=0;if(!im||!im.width)return;
  const t0=.35+n*.25,segT=seg?lt-refresh:lt-t0;if(segT<0||lt>sc.dur-.1)return;
  const inT=.45,outT=.4,endAt=refresh&&!seg?refresh-.05:sc.dur-.1,remain=endAt-lt;if(remain<=0)return;
  const p=Math.min(1,segT/inT),q=remain<outT?Math.max(0,remain/outT):1;
  const W=C.W,H=C.H,s=H/1080,two=ids.length>1,m=48*s;let w=(two?270:330)*s,right=two?n===1:(b%2===0);
  const ct=capTopY(t,H,s),bottom=Math.min(H-m-70*s,ct!=null?ct-16*s:1e9),avoid=CAM_AVOID[sc.type];
  let h=w*1.27;if(bottom-h<140*s){h=Math.max(bottom-140*s,0);w=h/1.27;}
  if(avoid&&!two){const L=avoid[0]*W-m-36*s,R=(1-avoid[1])*W-m-36*s,pref=right?R:L,oth=right?L:R;
   if(pref>=oth||pref>=190*s){if(pref<w)w=pref;}else{right=!right;if(oth<w)w=oth;}
   h=w*1.27;}
  if(w<170*s)return;
  const x0=right?W-w-m:m,off=(1-Math.min(BK(p),1.08))*(w+m+30)*(right?1:-1),bob=Math.sin(lt*1.6+n)*6*s;
  const y=bottom-h+bob,x=x0+off,r=18*s;ctx.save();ctx.globalAlpha=Math.min(1,p*2)*q;
  ctx.shadowColor='rgba(255,200,40,.55)';ctx.shadowBlur=42*s;ctx.fillStyle='#fff';rr(ctx,x-7*s,y-7*s,w+14*s,h+14*s,r+4*s);ctx.fill();
  ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=26*s;ctx.shadowOffsetY=10*s;ctx.fill();ctx.shadowColor='transparent';
  ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();cover(ctx,im,x,y,w,h,1+.08*Math.min(1,(segT>0?segT:lt)/Math.max(sc.dur/(refresh?2:1),1)));
  const g=ctx.createLinearGradient(0,y+h*.6,0,y+h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');ctx.fillStyle=g;ctx.fillRect(x,y+h*.55,w,h*.45);
  const sw=((segT*.7)%2.2-.3)*(w*1.6)-w*.3,sg=ctx.createLinearGradient(x+sw,0,x+sw+w*.35,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.22)');sg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);
  if(seg&&segT<.18){ctx.fillStyle='rgba(255,255,255,'+(.7*(1-segT/.18))+')';ctx.fillRect(x,y,w,h);}
  ctx.restore();
  const nm=(names().find(z=>z.id===id)||{}).hi||'',tp=Math.min(1,Math.max(0,(segT-.2)/.3));
  ctx.fillStyle='#e8212b';rr(ctx,x-7*s,y+h-62*s,(w+14*s)*E(tp),70*s,12*s);ctx.fill();
  if(C.text&&nm&&tp>.6)C.text(ctx,nm,x+w/2,y+h-26*s,{align:'center',px:Math.round((two?30:36)*s),color:'#fff',weight:'bold'});
  ctx.restore();});}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
// ---- render hook ----
const R0=C.render,SS0=C.setScenes;
function wrapCards(){Object.keys(C.CARDS||{}).forEach(k=>{const cd=C.CARDS[k];if(!cd||!cd.draw||cd.__pv)return;cd.__pv=1;const d0=cd.draw;
 cd.draw=function(ctx,lt,d,sc){const pv=cur;cur=C.scenes?C.scenes.indexOf(sc):-1;try{return d0.apply(this,arguments);}finally{cur=pv;}};});}
C.render=function(ctx,t){wrapCards();R0.apply(this,arguments);try{drawCameo(ctx,t);}catch(e){}};
C.setScenes=function(){refMemo={};camFor=null;epoch++;(arguments[0]||[]).forEach&&arguments[0].forEach(s=>{delete s.__s;});return SS0.apply(this,arguments);};
// ---- UI: cameo toggle + photos panel variants ----
setTimeout(()=>{const pol=document.getElementById('pol'),host=(pol&&pol.parentNode)||document.getElementById('bar2');if(!host)return;
 const b=document.createElement('button');b.id='cam';const up=()=>{b.textContent='👤 Cameo: '+(ON.v?'ON':'OFF');b.style.background=ON.v?'#2a6fdb':'#555';};up();
 b.onclick=()=>{ON.v=!ON.v;try{localStorage.setItem('cvt_cameo',ON.v?'1':'0');}catch(e){}up();window.PLAYER&&PLAYER.draw&&PLAYER.draw();};host.appendChild(b);},0);
const P=window.PHOTOS;if(P){
 P.addVariant=async(slot,file)=>{let n=2;while(P.have[slot+'#'+n])n++;await P.set(slot+'#'+n,file);return n;};
 P.rowExtra=(s,list)=>{const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;padding:0 0 4px 42px;flex-wrap:wrap';
  const lb=document.createElement('label');lb.style.cssText='background:#456;padding:4px 9px;border-radius:5px;cursor:pointer;font-size:13px';lb.textContent='➕ aur photos';
  const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.multiple=true;fi.style.display='none';
  fi.onchange=async()=>{for(const f of fi.files){try{await P.addVariant(s.id,f);}catch(e){alert('Photo error: '+e.message);}}P.render();};lb.appendChild(fi);row.appendChild(lb);
  (vars[s.id]||[]).forEach(k=>{const th=document.createElement('div');th.style.cssText='position:relative;width:30px;height:38px;background:#333 center top/cover;border-radius:3px';
   const im=base[k];if(im)th.style.backgroundImage='url('+im.src+')';const x=document.createElement('span');x.textContent='✕';x.title='ye photo hatao';
   x.style.cssText='position:absolute;top:-5px;right:-5px;background:#c33;border-radius:50%;width:15px;height:15px;font-size:10px;text-align:center;line-height:15px;cursor:pointer';
   x.onclick=async()=>{await P.remove(k);P.render();};th.appendChild(x);row.appendChild(th);});
  if(vars[s.id]&&vars[s.id].length){const c=document.createElement('span');c.style.cssText='font-size:12px;color:#9c9';c.textContent=(vars[s.id].length+1)+' photos';row.appendChild(c);}
  list.appendChild(row);};}
})();
