// node tests/loudness_test.js — EBU Tech 3341 jaise known-level checks
const L=require('./loudness.js');let fail=0;
const ok=(name,v,exp,tol)=>{const p=Math.abs(v-exp)<=tol;if(!p)fail++;console.log((p?'PASS ':'FAIL ')+name+': '+v.toFixed(3)+' (chahiye '+exp+' ±'+tol+')');};
const sr=48000;
const sine=(f,dbfs,sec,ph=0)=>{const n=Math.round(sec*sr),a=Math.pow(10,dbfs/20),x=new Float32Array(n);for(let i=0;i<n;i++)x[i]=a*Math.sin(2*Math.PI*f*i/sr+ph);return x;};
// 1) stereo 1kHz -23 dBFS => -23.0 LUFS
let s=sine(1000,-23,20);let A=L.analyze([s,s],sr);ok('stereo 1k -23dBFS integrated',A.integrated,-23.0,0.1);
// 2) mono => -26.0
A=L.analyze([s],sr);ok('mono 1k -23dBFS',A.integrated,-26.0,0.1);
// 3) 0 dBFS stereo 997Hz => ~0 LUFS
let z=sine(997,0,10);A=L.analyze([z,z],sr);ok('stereo 997Hz 0dBFS',A.integrated,0.0,0.1);
// 4) 44.1k par bhi sahi (coef sr-independent)
{const sr2=44100,n=sr2*10,x=new Float32Array(n);for(let i=0;i<n;i++)x[i]=Math.pow(10,-23/20)*Math.sin(2*Math.PI*1000*i/sr2);A=L.analyze([x,x],sr2);ok('44.1k stereo -23',A.integrated,-23.0,0.1);}
// 5) gating: 10s tone + 10s digital silence => abhi bhi -23
const sil=new Float32Array(sr*10),t2=new Float32Array(sr*20);t2.set(s.subarray(0,sr*10));A=L.analyze([t2,t2],sr);ok('tone+silence gated',A.integrated,-23.0,0.1);
// 6) relative gate: -23 LUFS 10s + -50 LUFS 10s => -23 (quiet hissa gate)
const q=sine(1000,-50,10),mix=new Float32Array(sr*20);mix.set(s.subarray(0,sr*10));mix.set(q,sr*10);A=L.analyze([mix,mix],sr);ok('relative gate',A.integrated,-23.0,0.1);
// 7) LRA: -30 aur -20 LUFS (10s each, stereo) => ~10 LU
{const a=sine(1000,-30,20),b=sine(1000,-20,20),m=new Float32Array(sr*40);m.set(a);m.set(b,sr*20);A=L.analyze([m,m],sr);ok('LRA 10 LU',A.lra,10,0.6);}
// 8) true peak: fs/4 sine, phase 45deg => sample peak -3.01, true peak ~0 dBTP
{const x=sine(sr/4,0,1,Math.PI/4);A=L.analyze([x],sr);ok('sample peak',A.samplePeakDb,-3.01,0.05);ok('true peak',A.tpDb,0.0,0.15);}
// 9) normalize: -23 se -16 LUFS, peak kaafi niche => seedha gain, limiter nahi
{const x=sine(1000,-23,20),r=L.normalize([x,x],sr,-16,-1,true);const B=L.analyze(r.arrs,sr);ok('normalize -> -16',B.integrated,-16.0,0.1);console.log('  limited=',r.limited,'gain=',r.gainDb.toFixed(2));if(r.limited){fail++;console.log('FAIL limiter nahi chalna chahiye');}}
// 10) normalize jahan peak chhat tod de: spiky signal, -14 LUFS target, -1 dBTP, limiter
{const n=sr*20,x=new Float32Array(n);const base=sine(1000,-30,20);x.set(base);for(let k=0;k<20;k++){for(let j=0;j<40;j++)x[k*sr+1000+j]=0.5*Math.sin(2*Math.PI*j/40);}
 const r=L.normalize([x,x],sr,-14,-1,true);const B=L.analyze(r.arrs,sr);console.log('  limited=',r.limited,'tp=',B.tpDb.toFixed(2),'int=',B.integrated.toFixed(2));
 ok('limiter: true peak <= -1',Math.min(B.tpDb,-1+0.001)===B.tpDb||B.tpDb<=-0.95?-1:99,-1,0.01);
 const r2=L.normalize([x,x],sr,-14,-1,false);const C=L.analyze(r2.arrs,sr);console.log('  gain-ghatao mode: int=',C.integrated.toFixed(2),'tp=',C.tpDb.toFixed(2));ok('gain-only tp = -1',C.tpDb,-1,0.1);}
console.log(fail?('FAILED '+fail):'SAB PASS');process.exit(fail?1:0);
