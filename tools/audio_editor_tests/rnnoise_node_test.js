const fs=require('fs');
const glue=fs.readFileSync('/home/claude/gh/rnn_glue.js','utf8'),b64=fs.readFileSync('/home/claude/gh/rnn_wasm.b64','utf8');
const mk=new Function('require','process',glue+';return createRNNWasmModule;')(require,process);
(async()=>{const wasmBinary=Uint8Array.from(Buffer.from(b64,'base64'));const M=await mk({wasmBinary});
 console.log('exports',typeof M._rnnoise_create,typeof M._rnnoise_process_frame,typeof M.HEAPF32);
 const st=M._rnnoise_create(0),ptr=M._malloc(480*4);
 // test: noisy 48k signal: voice-like harmonic tone + white noise
 const n=48000*2,x=new Float32Array(n);let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647-0.5;};
 for(let i=0;i<n;i++){const t=i/48000;x[i]=0.2*(Math.sin(2*Math.PI*150*t)+0.6*Math.sin(2*Math.PI*300*t)+0.4*Math.sin(2*Math.PI*900*t))*(0.6+0.4*Math.sin(2*Math.PI*4*t))+0.08*rnd();}
 const y=new Float32Array(n);let vadSum=0;
 for(let p=0;p+480<=n;p+=480){const o=ptr>>2;for(let i=0;i<480;i++)M.HEAPF32[o+i]=x[p+i]*32768;vadSum+=M._rnnoise_process_frame(st,ptr,ptr);for(let i=0;i<480;i++)y[p+i]=M.HEAPF32[o+i]/32768;}
 const rms=a=>{let s=0;for(const v of a)s+=v*v;return Math.sqrt(s/a.length);};
 console.log('rms in',rms(x).toFixed(4),'out',rms(y).toFixed(4),'avg vad',(vadSum/(n/480)).toFixed(2));
 const clean=new Float32Array(n);for(let i=0;i<n;i++){const t=i/48000;clean[i]=0.2*(Math.sin(2*Math.PI*150*t)+0.6*Math.sin(2*Math.PI*300*t)+0.4*Math.sin(2*Math.PI*900*t))*(0.6+0.4*Math.sin(2*Math.PI*4*t));}let best=0,bl=0;for(let L=-50;L<=1000;L+=1){let c=0;for(let i=2000;i<n-2000;i+=3)c+=y[i+L]*clean[i];if(c>best){best=c;bl=L;}}console.log("best lag (y[i+L] vs clean[i])",bl);
})();
