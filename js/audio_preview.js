// C27: preview mein audio sound (pehle sirf export mein jaata tha). AP.init(P) main.js se.
// ▶ dabane par EXPORT.audio (Audio tracks ka mix ya 🎙 single file) P.t se bajta hai; pause/seek par ruk kar naye P.t se phir chalta hai.
(function(){const X=window.EXPORT;
const AP=window.AP={src:null,muted:false,P:null};
function stop(){if(AP.src){try{AP.src.onended=null;AP.src.stop();}catch(e){}try{AP.src.disconnect();}catch(e){}AP.src=null;}}
async function play(){
  stop();const P=AP.P;AP.lastA=X.audio;
  if(!P||!P.playing||AP.muted||!X.audio)return;
  const ac=X.actx||(X.actx=new (window.AudioContext||window.webkitAudioContext)());
  if(ac.state==='suspended'){try{await ac.resume();}catch(e){}}
  if(!P.playing||AP.muted||!X.audio)return;
  if(P.t>=X.audio.duration)return; // audio khatam, video baaki
  const s=ac.createBufferSource();s.buffer=X.audio;s.connect(ac.destination);
  s.start(0,Math.max(0,P.t));AP.src=s;
}
AP.init=P=>{AP.P=P;
  const tg=P.toggle,sk=P.seek;
  P.toggle=function(){const r=tg.apply(this,arguments);if(P.playing)play();else stop();return r;};
  P.seek=function(t){const r=sk.apply(this,arguments);if(P.playing)play();else stop();return r;};
  // video khud ruk jaye (end) to audio bhi ruke
  setInterval(()=>{if(!P.playing&&AP.src)stop();},300);
  // audio badla (naya file / AT.rebuild) to chalte hue naye audio se resync
  AP.lastA=X.audio;setInterval(()=>{if(X.audio!==AP.lastA){AP.lastA=X.audio;if(P.playing)play();else stop();}},300);
  // export ke dauran preview audio band (export apna audio khud record karta hai)
  const run=X.run;X.run=async function(){AP.muted=true;stop();try{return await run.apply(this,arguments);}finally{AP.muted=false;}};
};
})();
