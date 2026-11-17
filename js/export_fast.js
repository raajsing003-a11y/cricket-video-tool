// C12: fast export (WebCodecs VideoEncoder/AudioEncoder + mp4-muxer, offline = real-time se tez)
// EXPORT.runFast(player,onStatus,opts)->{blob,ext,mime}. Needs js/vendor/mp4-muxer.js (global Mp4Muxer)
(function(){const C=window.CORE,X=window.EXPORT;
const SR=48000;
X.fastSupported=async function(){
  const W=C.W,H=C.H;
  if(!window.VideoEncoder||!window.Mp4Muxer)return null;
  const list=[['avc','avc1.640028'],['avc','avc1.4d0028'],['avc','avc1.42001f'],['vp9','vp09.00.40.08']];
  for(const [mc,codec] of list){
    try{const s=await VideoEncoder.isConfigSupported({codec,width:W,height:H,bitrate:12e6,framerate:C.FPS});
      if(s&&s.supported)return{mc,codec};}catch(e){}
  }
  return null;
};
async function resample(buf,len){ // -> 2 Float32Array (48k stereo), length len samples
  const oc=new OfflineAudioContext(2,len,SR);
  const s=oc.createBufferSource();s.buffer=buf;s.connect(oc.destination);s.start(0);
  const r=await oc.startRendering();
  return[r.getChannelData(0),r.getChannelData(1)];
}
X.runFast=async function(P,onStatus,opts){
  opts=opts||{};
  const W=C.W,H=C.H;
  const vc=await X.fastSupported();
  if(!vc)throw new Error('Fast export is browser mein supported nahi (Chrome desktop use karo) — normal Export use karo');
  if(P.playing)P.toggle();
  const FPS=C.FPS,N=Math.round(C.total*FPS);
  const hasA=!!X.audio&&typeof AudioEncoder!=='undefined';
  let aCfg=null,aMux=null;
  if(hasA){
    for(const [codec,mc] of [['mp4a.40.2','aac'],['opus','opus']]){ // AAC pehle (sab jagah chalta hai), warna Opus
      try{const cfg={codec,sampleRate:SR,numberOfChannels:2,bitrate:192e3};const s=await AudioEncoder.isConfigSupported(cfg);if(s&&s.supported){aCfg=cfg;aMux=mc;break;}}catch(e){}
    }
  }
  const target=new Mp4Muxer.ArrayBufferTarget();
  const muxer=new Mp4Muxer.Muxer({target,fastStart:'in-memory',
    video:{codec:vc.mc,width:W,height:H,frameRate:FPS},
    audio:aCfg?{codec:aMux,numberOfChannels:2,sampleRate:SR}:undefined});
  let err=null;
  const ve=new VideoEncoder({output:(c,m)=>muxer.addVideoChunk(c,m),error:e=>{err=e;}});
  ve.configure({codec:vc.codec,width:W,height:H,bitrate:opts.bitrate||12e6,framerate:FPS,latencyMode:'quality'});
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');
  const t0=performance.now();
  for(let i=0;i<N;i++){
    if(err)throw err;
    C.render(ctx,i/FPS);
    const f=new VideoFrame(cv,{timestamp:Math.round(i*1e6/FPS),duration:Math.round(1e6/FPS)});
    ve.encode(f,{keyFrame:i%(FPS*2)===0});f.close();
    while(ve.encodeQueueSize>6){await new Promise(r=>setTimeout(r,2));if(err)throw err;}
    if(i%10===0){onStatus&&onStatus(i/FPS,N/FPS,(performance.now()-t0)/1000);await new Promise(r=>setTimeout(r,0));}
  }
  await ve.flush();ve.close();
  if(aCfg){
    const len=Math.min(Math.round(X.audio.duration*SR),Math.round(N/FPS*SR));
    const [L,R]=await resample(X.audio,len);
    const ae=new AudioEncoder({output:(c,m)=>muxer.addAudioChunk(c,m),error:e=>{err=e;}});
    ae.configure(aCfg);
    const CH=4800; // 0.1s
    for(let o=0;o<len;o+=CH){
      const n=Math.min(CH,len-o),d=new Float32Array(n*2);
      d.set(L.subarray(o,o+n),0);d.set(R.subarray(o,o+n),n);
      const ad=new AudioData({format:'f32-planar',sampleRate:SR,numberOfFrames:n,numberOfChannels:2,timestamp:Math.round(o*1e6/SR),data:d});
      ae.encode(ad);ad.close();
      while(ae.encodeQueueSize>20){await new Promise(r=>setTimeout(r,2));}
      if(err)throw err;
    }
    await ae.flush();ae.close();
  }
  if(err)throw err;
  muxer.finalize();
  P.seek(0);
  const blob=new Blob([target.buffer],{type:'video/mp4'});
  return{blob,ext:'mp4',mime:'video/mp4;'+vc.codec,secs:(performance.now()-t0)/1000,vcodec:vc.codec,audio:!!aCfg,acodec:aMux};
};
})();
