// ---------- CHUNK3 FX (pure JS) ----------
function resample(x,f){const n=Math.floor(x.length/f),o=new Float32Array(n);for(let i=0;i<n;i++){const p=i*f,k=Math.floor(p),t=p-k,a=x[k],b=k+1<x.length?x[k+1]:a;o[i]=a+(b-a)*t;}return o;}
function wsola(chs,sr,tempo){// pitch same, speed = tempo (1.25 = 25% tez)
 const n=chs[0].length,win=Math.round(sr*0.03)&~1,Hs=win>>1,Ha=Hs*tempo,tol=Math.round(sr*0.012),outLen=Math.ceil(n/tempo)+win,
 W=new Float32Array(win);for(let i=0;i<win;i++)W[i]=0.5-0.5*Math.cos(2*Math.PI*(i+0.5)/win);
 const out=chs.map(()=>new Float32Array(outLen)),nrm=new Float32Array(outLen),x0=chs[0];let prev=0;
 for(let k=0;;k++){const o=k*Hs;if(o>=outLen-win)break;let p=Math.round(k*Ha);if(p>=n)break;let best=p;
  if(k>0){const ref=prev+Hs;let bc=-1e18;for(let d=-tol;d<=tol;d+=2){const q=p+d;if(q<0||q+win>=n||ref+win>=n)continue;let c=0;for(let i=0;i<win;i+=8)c+=x0[q+i]*x0[ref+i];if(c>bc){bc=c;best=q;}}}
  prev=best;chs.forEach((x,c)=>{const y=out[c];for(let i=0;i<win;i++){const v=best+i<n?x[best+i]:0;y[o+i]+=v*W[i];}});for(let i=0;i<win;i++)nrm[o+i]+=W[i];}
 return out.map(y=>{const r=new Float32Array(Math.floor(n/tempo));for(let i=0;i<r.length;i++)r[i]=nrm[i]>1e-4?y[i]/nrm[i]:0;return r;});}
function pitchShift(chs,sr,semi){const f=Math.pow(2,semi/12);return wsola(chs,sr,1/f).map(a=>resample(a,f));}
function gate(chs,sr,thDb,floorDb){const th=db2g(thDb),fl=db2g(floorDb),n=chs[0].length,aC=1-Math.exp(-1/(sr*0.004)),rC=1-Math.exp(-1/(sr*0.12)),rel=Math.exp(-1/(sr*0.05));let env=0,g=fl;
 const o=chs.map(a=>Float32Array.from(a));for(let i=0;i<n;i++){let m=0;for(let c=0;c<chs.length;c++){const v=Math.abs(chs[c][i]);if(v>m)m=v;}env=Math.max(m,env*rel);const t=env>th?1:fl;g+=(t-g)*(t>g?aC:rC);for(let c=0;c<o.length;c++)o[c][i]*=g;}return o;}
function echo(chs,sr,dly,fb,mix){const d=Math.max(1,Math.round(dly*sr)),taps=fb>0.01?Math.min(40,Math.ceil(Math.log(0.01)/Math.log(fb))):1,tail=Math.min(Math.round(5*sr),d*taps),n=chs[0].length;
 return chs.map(x=>{const L=n+tail,w=new Float32Array(L);for(let i=d;i<L;i++){const s=i-d<n?x[i-d]:0;w[i]=s+fb*w[i-d];}const o=new Float32Array(L);for(let i=0;i<L;i++)o[i]=(i<n?x[i]:0)+mix*w[i];return o;});}
function deess(chs,band,sr,thDb,ratio){const th=db2g(thDb),aC=Math.exp(-1/(sr*0.001)),rC=Math.exp(-1/(sr*0.02)),k=1-1/ratio;
 return chs.map((x,c)=>{const b=band[c],o=new Float32Array(x.length);let env=0;for(let i=0;i<x.length;i++){const v=Math.abs(b[i]);env=v>env?aC*env+(1-aC)*v:rC*env+(1-rC)*v;let g=env>th?Math.pow(th/env,k):1;o[i]=x[i]-b[i]*(1-g);}return o;});}
