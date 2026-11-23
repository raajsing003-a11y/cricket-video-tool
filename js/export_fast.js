// C12: fast export (WebCodecs VideoEncoder/AudioEncoder + mp4-muxer, offline = real-time se tez)
// EXPORT.runFast(player,onStatus,opts)->{blob,ext,mime}. Needs js/vendor/mp4-muxer.js (global Mp4Muxer)
// C165: js/bumpers.js ke intro/outro (BUMP.prepare) main video se pehle/baad mein judte hain, unki awaaz + volume ke saath.
(function(){const C=window.CORE,X=window.EXPORT;
const SR=48000;
X.fastSupported=async function(w,h){
  const W=w||C.W,H=h||C.H;
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
  const W0=C.W,H0=C.H,sc=(X.outScale&&X.outScale())||1;
  const W=Math.round(W0*sc/2)*2,H=Math.round(H0*sc/2)*2; // C216: output size (720p/1080p)
  const vc=await X.fastSupported(W,H);
  if(!vc)throw new Error('Fast export is browser mein supported nahi (Chrome desktop use karo) — normal Export use karo');
  if(P.playing)P.toggle();
  const FPS=C.FPS,N=Math.round(C.total*FPS);
  const BP=window.BUMP?await BUMP.prepare(FPS):{pre:[],post:[],hasAudio:false};
  const preN=BP.pre.reduce((a,x)=>a+x.frames,0),postN=BP.post.reduce((a,x)=>a+x.frames,0),T=preN+N+postN;
  const hasClipA=!!(C.clipMixNeeded&&C.clipMixNeeded()),hasOvA=!!(window.OV&&OV.mixNeeded&&OV.mixNeeded()); // C223: overlay awaaz
  const hasA=(!!X.audio||BP.hasAudio||hasClipA||hasOvA)&&typeof AudioEncoder!=='undefined';
  let aCfg=null,aMux=null;
  if(hasA){
    for(const [codec,mc] of [['mp4a.40.2','aac'],['opus','opus']]){ // AAC pehle (sab jagah chalta hai), warna Opus
      try{const cfg={codec,sampleRate:SR,numberOfChannels:2,bitrate:(X.abr&&X.abr())||192e3};const s=await AudioEncoder.isConfigSupported(cfg);if(s&&s.supported){aCfg=cfg;aMux=mc;break;}}catch(e){}
    }
  }
  const target=new Mp4Muxer.ArrayBufferTarget();
  const muxer=new Mp4Muxer.Muxer({target,fastStart:'in-memory',
    video:{codec:vc.mc,width:W,height:H,frameRate:FPS},
    audio:aCfg?{codec:aMux,numberOfChannels:2,sampleRate:SR}:undefined});
  let err=null;
  const ve=new VideoEncoder({output:(c,m)=>muxer.addVideoChunk(c,m),error:e=>{err=e;}});
  ve.configure({codec:vc.codec,width:W,height:H,bitrate:opts.bitrate||(X.vbr&&X.vbr())||12e6,framerate:FPS,latencyMode:'quality'});
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');
  const big=(W!==W0||H!==H0)?document.createElement('canvas'):null; // chhota size: pehle poore size par draw, phir scale
  if(big){big.width=W0;big.height=H0;}
  const bctx=big?big.getContext('2d'):ctx;
  const t0=performance.now();
  // segments: intro(s) -> main -> outro(s)
  const segs=[];let off=0;
  BP.pre.forEach(x=>{segs.push({x,n:x.frames,o:off});off+=x.frames;});
  segs.push({main:true,n:N,o:off});off+=N;
  BP.post.forEach(x=>{segs.push({x,n:x.frames,o:off});off+=x.frames;});
  C.exporting=true;try{let g=0;for(const sg of segs){for(let i=0;i<sg.n;i++,g++){
    if(err)throw err;
    if(sg.main){if(C.beforeFrame)await C.beforeFrame(i/FPS);C.render(bctx,i/FPS);}
    else await BUMP.drawFrame(bctx,sg.x,i,FPS);
    if(big)ctx.drawImage(big,0,0,W,H);
    const f=new VideoFrame(cv,{timestamp:Math.round(g*1e6/FPS),duration:Math.round(1e6/FPS)});
    ve.encode(f,{keyFrame:g%(FPS*2)===0});f.close();
    while(ve.encodeQueueSize>6){await new Promise(r=>setTimeout(r,2));if(err)throw err;}
    if(g%10===0){onStatus&&onStatus(g/FPS,T/FPS,(performance.now()-t0)/1000);await new Promise(r=>setTimeout(r,0));}
  }}}finally{C.exporting=false;}
  await ve.flush();ve.close();
  if(aCfg){
    // ek hi offline mix: main audio (intro ke baad se) + har bumper ki awaaz (apne volume ke saath)
    const len=Math.round(T/FPS*SR);
    const oc=new OfflineAudioContext(2,len,SR);
    if(X.audio){const s=oc.createBufferSource();s.buffer=X.audio;s.connect(oc.destination);s.start(preN/FPS,0,Math.min(X.audio.duration,N/FPS));}
    segs.forEach(sg=>{if(sg.main||!sg.x.buf||sg.x.vol<=0)return;const s=oc.createBufferSource(),gn=oc.createGain();s.buffer=sg.x.buf;gn.gain.value=sg.x.vol;s.connect(gn);gn.connect(oc.destination);s.start(sg.o/FPS,0,Math.min(sg.x.buf.duration,sg.x.frames/FPS));});
    if(hasClipA)await C.clipMix(oc,preN/FPS); // C217: clip ki awaaz
    if(hasOvA)await OV.mix(oc,preN/FPS); // C223: overlay clip ki awaaz
    const mix=await oc.startRendering();
    const L=mix.getChannelData(0),R=mix.getChannelData(1);
    for(let i=0;i<len;i++){if(L[i]>1)L[i]=1;else if(L[i]<-1)L[i]=-1;if(R[i]>1)R[i]=1;else if(R[i]<-1)R[i]=-1;} // zyada volume par clip
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
  if(window.BUMP)BUMP.cleanup(BP);
  P.seek(0);
  const blob=new Blob([target.buffer],{type:'video/mp4'});
  return{blob,ext:'mp4',mime:'video/mp4;'+vc.codec,secs:(performance.now()-t0)/1000,vcodec:vc.codec,audio:!!aCfg,acodec:aMux,bumpers:BP.pre.length+BP.post.length,total:T/FPS};
};
})();
