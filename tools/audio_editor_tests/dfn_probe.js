const fs=require('fs'),D=require('./dfn_core.js');
(async()=>{
 const wasm=fs.readFileSync('/tmp/np/b/package/dist/df_bg.wasm');
 let t=Date.now();const df=await D.DeepFilter.create({wasmBytes:wasm});console.log('load ms',Date.now()-t,'frame',df.frameLength);
 const F=df.frameLength,sr=48000,n=sr*6,x=new Float32Array(n);
 // "awaaz": harmonic tone with syllable envelope; shor: white noise
 let seed=1;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296-0.5;};
 const clean=new Float32Array(n);for(let i=0;i<n;i++){const tt=i/sr,env=Math.max(0,Math.sin(2*Math.PI*3*tt)),f0=120+30*Math.sin(2*Math.PI*0.7*tt);let v=0;for(let h=1;h<=12;h++)v+=Math.sin(2*Math.PI*f0*h*tt+h)/h;clean[i]=0.25*env*v;x[i]=clean[i]+0.08*rnd()*2;}
 const run=async lat=>{D.setLat(lat);const d2=await D.DeepFilter.create({wasmBytes:wasm});t=Date.now();const r=await D.dfnEnhanceChannels(d2,[x],100,null,null);return{y:r[0],ms:Date.now()-t};};
 // latency: cross-correlation clean vs output at lat=0
 const {y,ms}=await run(0);console.log('6s audio in',ms,'ms => RTF',(6000/ms).toFixed(1)+'x realtime');
 let best=-1,bl=0;for(let l=0;l<8*F;l+=1){let s=0;for(let i=sr;i<sr*5;i+=7)s+=y[i+l]*clean[i];if(s>best){best=s;bl=l;}}console.log('best lag samples (output kitna late)',bl,'frames',(bl/F).toFixed(2));
 const rms=(a,s,e)=>{let q=0;for(let i=s;i<e;i++)q+=a[i]*a[i];return Math.sqrt(q/(e-s));};
 // after aligning by bl: noise-only region vs voiced
 D.setLat(bl);const d3=await D.DeepFilter.create({wasmBytes:wasm});const r3=(await D.dfnEnhanceChannels(d3,[x],100,null,null))[0];
 const err=(a)=>{let e=0,c=0;for(let i=sr;i<sr*5;i++){const d=a[i]-clean[i];e+=d*d;c+=clean[i]*clean[i];}return 10*Math.log10(c/e);};
 console.log('SNR before dB',err(x).toFixed(1),'after',err(r3).toFixed(1));
})();
