// C7: export (MediaRecorder, real-time) + audio file. window.EXPORT={loadAudio(file),run(player,onStatus)}
(function(){const C=window.CORE;
const X=window.EXPORT={audio:null,actx:null};
X.loadAudio=async function(file){
  X.actx=X.actx||new (window.AudioContext||window.webkitAudioContext)();
  X.audio=await X.actx.decodeAudioData(await file.arrayBuffer());
  return X.audio.duration;
};
X.pickMime=function(){
  const c=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4;codecs=avc1','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  return c.find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m))||'';
};
// returns Promise<{blob,ext,mime}>
X.run=function(P,canvas,onStatus){
  return new Promise(async(resolve,reject)=>{
    try{
      const mime=X.pickMime();if(!mime)throw new Error('MediaRecorder support nahi (Chrome use karo)');
      const stream=canvas.captureStream(C.FPS);
      let src=null;
      if(X.audio){
        const ac=X.actx;if(ac.state==='suspended')await ac.resume();
        const dest=ac.createMediaStreamDestination();src=ac.createBufferSource();src.buffer=X.audio;src.connect(dest);
        dest.stream.getAudioTracks().forEach(tr=>stream.addTrack(tr));
      }
      const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:12e6,audioBitsPerSecond:192e3});
      const chunks=[];rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
      rec.onstop=()=>{const ext=mime.startsWith('video/mp4')?'mp4':'webm';resolve({blob:new Blob(chunks,{type:mime.split(';')[0]}),ext,mime});};
      rec.onerror=e=>reject(e.error||e);
      if(P.playing)P.toggle();
      P.seek(0);
      rec.start(500);
      if(src)src.start(0);
      const t0=performance.now();
      const prevState=P.onStateHook;
      P.toggle();
      const timer=setInterval(()=>{
        onStatus&&onStatus(P.t,C.total);
        if(!P.playing||P.t>=C.total-1/C.FPS-.01){
          clearInterval(timer);
          setTimeout(()=>{try{src&&src.stop();}catch(e){}rec.stop();},400);
        }
      },200);
    }catch(e){reject(e);}
  });
};
X.download=function(res,name){
  const a=document.createElement('a');a.href=URL.createObjectURL(res.blob);a.download=(name||'cricket_video')+'.'+res.ext;
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);
};
})();
