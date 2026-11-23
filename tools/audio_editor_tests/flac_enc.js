/* FLAC encoder — apna likha (lossless). Fixed predictor order 0-4 + Rice partition, 4096 block, STREAMINFO MD5 = 0 (unknown, spec mein allowed).
   Spec: xiph.org FLAC format (public). Koi GPL/BSD code copy nahi. Browser Worker + node dono mein chalta hai. */
var FLACENC=(function(){
'use strict';
var CRC8=new Uint8Array(256),CRC16=new Uint16Array(256);
(function(){for(var i=0;i<256;i++){var c=i;for(var k=0;k<8;k++)c=(c&0x80)?((c<<1)^0x07)&0xff:(c<<1)&0xff;CRC8[i]=c;
 var d=i<<8;for(k=0;k<8;k++)d=(d&0x8000)?((d<<1)^0x8005)&0xffff:(d<<1)&0xffff;CRC16[i]=d;}})();
function BW(){this.b=new Uint8Array(1<<16);this.n=0;this.acc=0;this.nb=0;}
BW.prototype.grow=function(){var o=new Uint8Array(this.b.length*2);o.set(this.b);this.b=o;};
BW.prototype.bits=function(v,n){// n <= 32, v >= 0 (unsigned)
 while(n>0){var t=Math.min(n,8-this.nb);var sh=n-t;var part=Math.floor(v/Math.pow(2,sh))%Math.pow(2,t);this.acc=(this.acc<<t)|part;this.nb+=t;n-=t;
  if(this.nb===8){if(this.n>=this.b.length)this.grow();this.b[this.n++]=this.acc&255;this.acc=0;this.nb=0;}}};
BW.prototype.sbits=function(v,n){this.bits(v<0?v+Math.pow(2,n):v,n);};
BW.prototype.unary=function(q){while(q>=8){this.bits(0,8);q-=8;}this.bits(1,q+1);};
BW.prototype.align=function(){if(this.nb)this.bits(0,8-this.nb);};
BW.prototype.bytes=function(){return this.b.subarray(0,this.n);};
function residual(x,order,out){var n=x.length,i;
 if(order===0){for(i=0;i<n;i++)out[i]=x[i];}
 else if(order===1){for(i=1;i<n;i++)out[i]=x[i]-x[i-1];}
 else if(order===2){for(i=2;i<n;i++)out[i]=x[i]-2*x[i-1]+x[i-2];}
 else if(order===3){for(i=3;i<n;i++)out[i]=x[i]-3*x[i-1]+3*x[i-2]-x[i-3];}
 else{for(i=4;i<n;i++)out[i]=x[i]-4*x[i-1]+6*x[i-2]-4*x[i-3]+x[i-4];}}
function riceCost(res,start,end,k){var s=0;for(var i=start;i<end;i++){var r=res[i],u=r>=0?2*r:-2*r-1;s+=Math.floor(u/Math.pow(2,k))+1+k;}return s;}
function bestK(res,start,end){var sum=0;for(var i=start;i<end;i++){var r=res[i];sum+=r>=0?2*r:-2*r-1;}var cnt=end-start,mean=sum/cnt,k=mean>1?Math.max(0,Math.floor(Math.log2(mean))):0,best=1e30,bk=0;
 for(var c=Math.max(0,k-1);c<=Math.min(30,k+1);c++){var b=riceCost(res,start,end,c);if(b<best){best=b;bk=c;}}return[bk,best];}
function planRice(res,order,n){// partition order chuno (0..5)
 var best=null;for(var po=0;po<=5;po++){var parts=1<<po;if(n%parts)break;var ps=n/parts;if(ps<=order)break;
  var total=0,ks=[];for(var p=0;p<parts;p++){var s=p*ps+(p===0?order:0),e=(p+1)*ps,r=bestK(res,s,e);ks.push(r[0]);total+=r[1]+5;}
  if(!best||total<best.bits)best={po:po,ks:ks,bits:total};}
 return best;}
function subframe(w,x,bps){var n=x.length,i,res=new Float64Array(n),best=null,constant=true;
 for(i=1;i<n;i++)if(x[i]!==x[0]){constant=false;break;}
 if(constant){w.bits(0,1);w.bits(0,6);w.bits(0,1);w.sbits(x[0],bps);return;}
 var maxO=Math.min(4,n-1);
 for(var o=0;o<=maxO;o++){residual(x,o,res);var pl=planRice(res,o,n);if(!pl)continue;var bits=o*bps+pl.bits+6;if(!best||bits<best.bits){best={o:o,pl:pl,bits:bits};}}
 if(!best||best.bits>=n*bps){w.bits(0,1);w.bits(1,6);w.bits(0,1);for(i=0;i<n;i++)w.sbits(x[i],bps);return;}
 var o2=best.o,pl2=best.pl;residual(x,o2,res);
 w.bits(0,1);w.bits(8+o2,6);w.bits(0,1);for(i=0;i<o2;i++)w.sbits(x[i],bps);
 w.bits(1,2);w.bits(pl2.po,4);var parts=1<<pl2.po,ps=n/parts;
 for(var p=0;p<parts;p++){var k=pl2.ks[p];w.bits(k,5);var s=p*ps+(p===0?o2:0),e=(p+1)*ps;
  for(i=s;i<e;i++){var r=res[i],u=r>=0?2*r:-2*r-1,q=Math.floor(u/Math.pow(2,k));w.unary(q);if(k)w.bits(u-q*Math.pow(2,k),k);}}}
function utf8(n){if(n<128)return[n];var o=[],mask=[0xC0,0xE0,0xF0,0xF8,0xFC,0xFE],cnt=n<2048?1:n<65536?2:n<2097152?3:n<67108864?4:5;
 for(var i=0;i<cnt;i++){o.unshift(0x80|(n&0x3f));n=Math.floor(n/64);}o.unshift(mask[cnt-1]|n);return o;}
// chs: Float32Array[] (-1..1), bps 16|24. onProg(0..1), shouldStop() => null
function encode(chs,sr,bps,onProg,shouldStop){
 var nch=chs.length,total=chs[0].length,BS=4096,maxv=Math.pow(2,bps-1)-1,minv=-Math.pow(2,bps-1),i,c;
 var out=[];var head=new BW();head.bits(0x664C6143,32);// fLaC
 head.bits(1,1);head.bits(0,7);head.bits(34,24);head.bits(BS,16);head.bits(BS,16);head.bits(0,24);head.bits(0,24);
 head.bits(sr,20);head.bits(nch-1,3);head.bits(bps-1,5);head.bits(Math.floor(total/4294967296)%16,4);head.bits(total>>>0,32);for(i=0;i<4;i++)head.bits(0,32);
 out.push(head.bytes().slice());
 var frames=Math.ceil(total/BS),fr=0;
 for(var pos=0;pos<total;pos+=BS,fr++){
  var n=Math.min(BS,total-pos),w=new BW();
  // header
  var hb=[0xFF,0xF8],bsCode=n===4096?12:(n<=256?6:7),b2=(bsCode<<4)|0;// sample rate = streaminfo (0)
  hb.push(b2);hb.push(((nch-1)<<4)|(((bps===16?4:bps===24?6:0))<<1)|0);
  utf8(fr).forEach(function(v){hb.push(v);});
  if(bsCode===6)hb.push(n-1);else if(bsCode===7){hb.push((n-1)>>8,(n-1)&255);}
  var crc=0;hb.forEach(function(v){crc=CRC8[crc^v];});hb.push(crc);
  for(i=0;i<hb.length;i++)w.bits(hb[i],8);
  for(c=0;c<nch;c++){var x=new Float64Array(n),src=chs[c];for(i=0;i<n;i++){var v=Math.round(src[pos+i]*(maxv+1));if(v>maxv)v=maxv;else if(v<minv)v=minv;x[i]=v;}subframe(w,x,bps);}
  w.align();var fb=w.bytes(),c16=0;for(i=0;i<fb.length;i++)c16=((c16<<8)&0xffff)^CRC16[((c16>>8)^fb[i])&255];
  var f=new Uint8Array(fb.length+2);f.set(fb);f[fb.length]=c16>>8;f[fb.length+1]=c16&255;out.push(f);
  if(onProg&&(fr&31)===0){onProg(fr/frames);if(shouldStop&&shouldStop())return null;}}
 var len=0;out.forEach(function(a){len+=a.length;});var res=new Uint8Array(len),o=0;out.forEach(function(a){res.set(a,o);o+=a.length;});return res;}
return{encode:encode};
})();
if(typeof module!=='undefined')module.exports=FLACENC;
