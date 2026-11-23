// C216: Export settings — Quality (Chhoti/Madhyam/Badhiya) + Size (1080p/720p) + live "≈ MB" andaza.
// EXPORT.vbr()/abr()/outScale() export_fast.js aur export.js padhte hain. Default = Badhiya + 1080p (purana jaisa).
(function(){const C=window.CORE,X=window.EXPORT;if(!C||!X)return;
const Q={low:{v:4e6,a:128e3,n:'Chhoti ~4 Mbps'},mid:{v:8e6,a:192e3,n:'Madhyam ~8 Mbps'},high:{v:12e6,a:192e3,n:'Badhiya 12 Mbps'}};
X.settings={q:'high',res:'full'};
X.vbr=()=>Q[X.settings.q].v;X.abr=()=>Q[X.settings.q].a;
X.outScale=()=>X.settings.res==='720'?(Math.min(C.W,C.H)>0?720/Math.min(C.W,C.H):1):1; // chhota side 720
X.estimate=function(){ // -> {mb,secs}  (video+audio bitrate * duration, +3% container)
  const b=window.BUMP&&BUMP.secs?BUMP.secs():{pre:0,post:0};
  const secs=(C.total||0)+(b.pre||0)+(b.post||0);
  const bits=(X.vbr()+(X.audio||(window.BUMP&&b.pre+b.post>0)?X.abr():0))*secs*1.03;
  return{mb:bits/8/1e6,secs};
};
function init(){
  const bar=document.getElementById('bar2');if(!bar||document.getElementById('xs216'))return;
  const sp=document.createElement('span');sp.id='xs216';sp.style.cssText='display:inline-flex;gap:6px;align-items:center;font-size:13px;margin:0 6px';
  sp.innerHTML='<label>Quality <select id="xs_q">'+Object.keys(Q).map(k=>'<option value="'+k+'"'+(k==='high'?' selected':'')+'>'+Q[k].n+'</option>').join('')+'</select></label>'+
   '<label>Size <select id="xs_r"><option value="full" selected>Poora (1080p)</option><option value="720">720p</option></select></label>'+
   '<span id="xs_mb" title="Andaza, +-20%" style="color:#9fd">≈ — MB</span>';
  const st=document.getElementById('expst');bar.insertBefore(sp,st||null);
  const upd=()=>{X.settings.q=document.getElementById('xs_q').value;X.settings.res=document.getElementById('xs_r').value;
    const e=X.estimate();document.getElementById('xs_mb').textContent='≈ '+(e.mb<10?e.mb.toFixed(1):Math.round(e.mb))+' MB ('+Math.round(e.secs)+'s, andaza)';};
  document.getElementById('xs_q').onchange=upd;document.getElementById('xs_r').onchange=upd;
  upd();setInterval(upd,1000);X.updateEstimate=upd;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
