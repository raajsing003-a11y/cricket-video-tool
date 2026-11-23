/* Loudness (EBU R128 / ITU-R BS.1770-4) — apna likha pure-JS DSP (browser + node dono mein chalta hai).
   Formulas: ITU-R BS.1770-4 + EBU Tech 3341/3342 (public standards). Koi GPL code copy nahi kiya.
   Refs padhe sirf idea ke liye: meigo normalise.ts (MIT), audionorm, go-audio-dsp. */
var LUFSLIB=(function(){
'use strict';
function kCoefs(sr){// K-weighting = shelf (head) + highpass (RLB), kisi bhi sample rate ke liye
 var f0=1681.974450955533,G=3.999843853973347,Q=0.7071752369554196;
 var K=Math.tan(Math.PI*f0/sr),Vh=Math.pow(10,G/20),Vb=Math.pow(Vh,0.4996667741545416),a0=1+K/Q+K*K;
 var s={b:[(Vh+Vb*K/Q+K*K)/a0,2*(K*K-Vh)/a0,(Vh-Vb*K/Q+K*K)/a0],a:[2*(K*K-1)/a0,(1-K/Q+K*K)/a0]};
 f0=38.13547087602444;Q=0.5003270373238773;K=Math.tan(Math.PI*f0/sr);a0=1+K/Q+K*K;
 var h={b:[1,-2,1],a:[2*(K*K-1)/a0,(1-K/Q+K*K)/a0]};
 return[s,h];}
function biquad(x,c){var n=x.length,o=new Float32Array(n),b0=c.b[0],b1=c.b[1],b2=c.b[2],a1=c.a[0],a2=c.a[1],z1=0,z2=0;
 for(var i=0;i<n;i++){var v=x[i],y=b0*v+z1;z1=b1*v-a1*y+z2;z2=b2*v-a2*y;o[i]=y;}return o;}
function kWeight(x,sr){var c=kCoefs(sr);return biquad(biquad(x,c[0]),c[1]);}
function chWeights(n){var w=[];for(var i=0;i<n;i++)w.push(1);if(n===6){w[3]=0;w[4]=w[5]=1.41;}else if(n>=4){w[n-1]=w[n-2]=1.41;}return w;}
var LUFS=function(e){return e>0?-0.691+10*Math.log10(e):-Infinity;};
// 100ms ke subblock energies (K-weighted, channel-weighted sum of mean-squares)
function subEnergies(chs,sr){
 var w=chWeights(chs.length),sb=Math.round(sr*0.1),n=chs[0].length,nb=Math.floor(n/sb),e=new Float64Array(nb);
 for(var c=0;c<chs.length;c++){if(!w[c])continue;var y=kWeight(chs[c],sr);
  for(var b=0;b<nb;b++){var s=0,o=b*sb;for(var i=0;i<sb;i++){var v=y[o+i];s+=v*v;}e[b]+=w[c]*s/sb;}}
 return e;}
function slide(e,k){// k subblocks ki average energy, 100ms step
 var out=[];if(e.length<k)return out;var s=0;for(var i=0;i<k;i++)s+=e[i];out.push(s/k);
 for(var j=k;j<e.length;j++){s+=e[j]-e[j-k];out.push(Math.max(0,s)/k);}return out;}
function integrated(blocks){// BS.1770-4: abs gate -70, relative gate -10
 var a=blocks.filter(function(z){return LUFS(z)>-70;});if(!a.length)return-Infinity;
 var m=a.reduce(function(p,c){return p+c;},0)/a.length,rel=LUFS(m)-10;
 var b=a.filter(function(z){return LUFS(z)>rel;});if(!b.length)return-Infinity;
 return LUFS(b.reduce(function(p,c){return p+c;},0)/b.length);}
function lra(st){// EBU Tech 3342: short-term, abs -70, rel -20, 10-95 percentile
 var a=st.filter(function(z){return LUFS(z)>-70;});if(a.length<2)return 0;
 var m=a.reduce(function(p,c){return p+c;},0)/a.length,rel=LUFS(m)-20;
 var b=a.filter(function(z){return LUFS(z)>rel;}).map(LUFS).sort(function(x,y){return x-y;});if(b.length<2)return 0;
 var pc=function(p){var i=p*(b.length-1),lo=Math.floor(i),hi=Math.ceil(i);return b[lo]+(b[hi]-b[lo])*(i-lo);};
 return pc(0.95)-pc(0.10);}
// True peak: 4x oversampling (windowed-sinc, 16 taps/phase)
var TP_H=(function(){var T=8,P=[];for(var p=1;p<4;p++){var t=[];for(var k=-T+1;k<=T;k++){var d=p/4-k,s=Math.abs(d)<1e-9?1:Math.sin(Math.PI*d)/(Math.PI*d),w=0.5+0.5*Math.cos(Math.PI*d/T);t.push(s*w);}P.push(t);}return{T:T,P:P};})();
function truePeak(chs){var sp=0,peak;
 chs.forEach(function(x){for(var i=0;i<x.length;i++){var v=x[i]<0?-x[i]:x[i];if(v>sp)sp=v;}});peak=sp;
 var T=TP_H.T,skip=sp*0.5,H0=new Float64Array(TP_H.P[0]),H1=new Float64Array(TP_H.P[1]),H2=new Float64Array(TP_H.P[2]),T2=2*T;
 chs.forEach(function(x){var n=x.length,i,k,a,b,s0,s1,s2;
  for(i=0;i<n-1;i++){a=x[i];b=x[i+1];if(a<0)a=-a;if(b<0)b=-b;if(a<skip&&b<skip)continue;
   var o=i-T+1;s0=s1=s2=0;
   if(o>=0&&o+T2<=n){for(k=0;k<T2;k++){var v=x[o+k];s0+=v*H0[k];s1+=v*H1[k];s2+=v*H2[k];}}
   else{for(k=0;k<T2;k++){var j=o+k;if(j>=0&&j<n){var w=x[j];s0+=w*H0[k];s1+=w*H1[k];s2+=w*H2[k];}}}
   if(s0<0)s0=-s0;if(s1<0)s1=-s1;if(s2<0)s2=-s2;if(s0>peak)peak=s0;if(s1>peak)peak=s1;if(s2>peak)peak=s2;}});
 return{sample:sp,tp:peak};}
var toDb=function(v){return v>1e-9?20*Math.log10(v):-Infinity;};
function analyze(chs,sr){
 var e=subEnergies(chs,sr),mom=slide(e,4),sts=slide(e,30),tp=truePeak(chs);
 var momMax=-Infinity;mom.forEach(function(z){var l=LUFS(z);if(l>momMax)momMax=l;});
 var stMax=-Infinity;sts.forEach(function(z){var l=LUFS(z);if(l>stMax)stMax=l;});
 return{integrated:integrated(mom),lra:lra(sts),momMax:momMax,stMax:stMax,tpDb:toDb(tp.tp),samplePeakDb:toDb(tp.sample),
  stSeries:sts.map(LUFS),momSeries:mom.map(LUFS),dur:chs[0].length/sr};}
// Lookahead brickwall limiter (5ms): gain min-filter + moving average => gain <= zaroori gain hamesha
function limitTo(chs,sr,ceilDb){
 var n=chs[0].length,L=Math.max(8,Math.round(sr*0.0025)),ceil=Math.pow(10,ceilDb/20),g=new Float32Array(n),i,c;
 for(i=0;i<n;i++){var m=0;for(c=0;c<chs.length;c++){var v=Math.abs(chs[c][i]);if(v>m)m=v;}g[i]=m>ceil?ceil/m:1;}
 // sliding min over [i-L,i+L]
 var mn=new Float32Array(n),dq=new Int32Array(n),h=0,t=0;
 for(i=0;i<n+L;i++){if(i<n){while(t>h&&g[dq[t-1]]>=g[i])t--;dq[t++]=i;}var o=i-L;if(o>=0){while(dq[h]<o-L)h++;mn[o]=g[dq[h]];}}
 var pre=new Float64Array(n+1);for(i=0;i<n;i++)pre[i+1]=pre[i]+mn[i];
 var sm=new Float32Array(n);for(i=0;i<n;i++){var a=Math.max(0,i-L),b=Math.min(n-1,i+L);sm[i]=(pre[b+1]-pre[a])/(b-a+1);}
 return chs.map(function(x){var o=new Float32Array(n);for(var k=0;k<n;k++)o[k]=x[k]*sm[k];return o;});}
// Target LUFS tak normalize. ceilDb = true-peak chhat (dBTP). useLimiter: gain badhane par peak ho to limiter, warna gain ghata do.
function normalize(chs,sr,targetLufs,ceilDb,useLimiter){
 var A=analyze(chs,sr);if(!isFinite(A.integrated))return{err:'Awaaz bahut dheemi/khaali hai, naap nahi sakta'};
 var gDb=targetLufs-A.integrated,out=chs.map(function(x){var o=new Float32Array(x.length),g=Math.pow(10,gDb/20);for(var i=0;i<x.length;i++)o[i]=x[i]*g;return o;});
 var tpAfter=A.tpDb+gDb,limited=false,reduced=0;
 if(tpAfter>ceilDb){
  if(useLimiter){limited=true;var cd=ceilDb-0.1;for(var it=0;it<4;it++){out=limitTo(out,sr,cd);var tp=toDb(truePeak(out).tp);if(tp<=ceilDb+0.01)break;cd-=(tp-ceilDb)+0.05;}}
  else{reduced=tpAfter-ceilDb;var g2=Math.pow(10,-reduced/20);out=out.map(function(o){for(var i=0;i<o.length;i++)o[i]*=g2;return o;});}}
 return{arrs:out,before:A,gainDb:gDb-reduced,limited:limited,reduced:reduced};}
return{analyze:analyze,normalize:normalize,truePeak:truePeak,limitTo:limitTo,kWeight:kWeight,toDb:toDb};
})();
if(typeof module!=='undefined')module.exports=LUFSLIB;
