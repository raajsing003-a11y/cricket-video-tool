// node tests/flac_test.js — apna FLAC encoder ffmpeg se decode karke bit-exact check
const F=require('./flac_enc.js'),fs=require('fs'),cp=require('child_process');let fail=0;
function mk(sr,sec,nch,kind){const n=Math.round(sr*sec),ch=[];let s=5;const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296-.5;};
 for(let c=0;c<nch;c++){const x=new Float32Array(n);for(let i=0;i<n;i++){const t=i/sr;x[i]=kind==='speech'?0.3*Math.sin(2*Math.PI*(140+c*20)*t)*(0.5+0.5*Math.sin(2*Math.PI*3*t))+0.02*r():kind==='noise'?1.6*r():kind==='silence'?0:Math.sin(2*Math.PI*1000*t)*0.99;}ch.push(x);}return ch;}
for(const [name,sr,sec,nch,kind,bps] of [['speech16',44100,5,2,'speech',16],['speech24',48000,3,2,'speech',24],['mono',22050,2.3,1,'speech',16],['noiseClip16',44100,2,2,'noise',16],['silence',44100,1,2,'silence',16],['sine24',44100,2,1,'sine',24],['short',44100,0.01,2,'speech',16]]){
 const ch=mk(sr,sec,nch,kind),t=Date.now(),enc=F.encode(ch,sr,bps),ms=Date.now()-t;fs.writeFileSync('/tmp/t.flac',enc);
 // expected PCM (same rounding)
 const maxv=Math.pow(2,bps-1)-1,minv=-Math.pow(2,bps-1),bytes=bps/8,n=ch[0].length,exp=Buffer.alloc(n*nch*bytes);
 for(let i=0;i<n;i++)for(let c=0;c<nch;c++){let v=Math.round(ch[c][i]*(maxv+1));v=Math.max(minv,Math.min(maxv,v));const o=(i*nch+c)*bytes;if(bytes===2)exp.writeInt16LE(v,o);else{exp[o]=v&255;exp[o+1]=(v>>8)&255;exp[o+2]=(v>>16)&255;}}
 let dec;try{dec=cp.execSync(`ffmpeg -v error -i /tmp/t.flac -f ${bps===16?'s16le':'s24le'} -`,{maxBuffer:1<<28});}catch(e){console.log('FAIL',name,'ffmpeg error',String(e.stderr||e).slice(0,200));fail++;continue;}
 const ok=Buffer.compare(dec,exp)===0;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+name+' bit-exact; size '+(enc.length/1024).toFixed(1)+'KB vs raw '+(exp.length/1024).toFixed(1)+'KB ('+(100*enc.length/exp.length).toFixed(0)+'%), '+ms+'ms');}
console.log(fail?'FAILED '+fail:'SAB PASS');process.exit(fail?1:0);
