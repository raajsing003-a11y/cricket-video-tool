const db2g=d=>Math.pow(10,d/20);
const src=require('fs').readFileSync('/home/claude/gh/fx_dsp.js','utf8');
const F=new Function('db2g',src+';return {resample,wsola,pitchShift,gate,echo,deess};')(db2g);
const sr=44100,n=sr*3,x=new Float32Array(n);for(let i=0;i<n;i++)x[i]=0.5*Math.sin(2*Math.PI*440*i/sr);
function freq(a){let z=0;for(let i=1;i<a.length;i++)if(a[i-1]<0&&a[i]>=0)z++;return z/(a.length/sr);}
let t=Date.now();
const tm=F.wsola([x],sr,1.5)[0];console.log('tempo1.5 len',tm.length,'expect',n/1.5,'freq',freq(tm.subarray(2000,tm.length-3000)).toFixed(1));
const ps=F.pitchShift([x],sr,12)[0];console.log('pitch+12 len',ps.length,'expect',n,'freq',freq(ps.subarray(2000,ps.length-3000)).toFixed(1),'(880)');
const sp=F.resample(x,2);console.log('speed2 len',sp.length,'freq',freq(sp).toFixed(0));
const y=new Float32Array(n);for(let i=0;i<n;i++)y[i]=i<sr?0.005*Math.sin(i):(i<2*sr?0.5*Math.sin(i/7):0.005*Math.sin(i));
const g=F.gate([y],sr,-40,-60)[0];const rms=(a,s,e)=>{let z=0;for(let i=s;i<e;i++)z+=a[i]*a[i];return Math.sqrt(z/(e-s));};
console.log('gate quiet in/out',rms(y,sr*2.3|0,sr*2.9|0).toFixed(4),rms(g,sr*2.3|0,sr*2.9|0).toFixed(5),'loud',rms(y,sr*1.2|0,sr*1.8|0).toFixed(3),rms(g,sr*1.2|0,sr*1.8|0).toFixed(3));
const e=F.echo([x.subarray(0,sr)],sr,0.3,0.4,0.5)[0];console.log('echo len',e.length);
console.log('ms',Date.now()-t);
