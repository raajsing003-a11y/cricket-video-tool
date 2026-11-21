// C193: chhota ZIP likhne/padhne wala (library nahi). write: stored (bina compress, images pehle se compressed hoti hain). read: stored + deflate (Chrome DecompressionStream).
// API: ZIPLITE.write([{name:'CSK/Rohit.jpg',data:Uint8Array|Blob}]) -> Promise<Blob>;  ZIPLITE.read(blobOrArrayBuffer) -> Promise<[{name,data:Uint8Array}]>
(function(root){
'use strict';
var T=null;function crcT(){if(T)return T;T=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;T[n]=c>>>0;}return T;}
function crc32(u8){var t=crcT(),c=0xFFFFFFFF;for(var i=0;i<u8.length;i++)c=t[(c^u8[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function u16(n){return[n&255,(n>>>8)&255];}function u32(n){return[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
var enc=new TextEncoder(),dec=new TextDecoder('utf-8');
function dosTime(d){d=d||new Date();return{t:(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),d:((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate()};}
async function toU8(x){if(x instanceof Uint8Array)return x;if(x instanceof ArrayBuffer)return new Uint8Array(x);return new Uint8Array(await x.arrayBuffer());}
async function write(entries){var parts=[],cd=[],off=0,dt=dosTime();
 for(var i=0;i<entries.length;i++){var e=entries[i],data=await toU8(e.data),nm=enc.encode(e.name),crc=crc32(data);
  var lh=new Uint8Array([].concat(u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(dt.t),u16(dt.d),u32(crc),u32(data.length),u32(data.length),u16(nm.length),u16(0)));
  parts.push(lh,nm,data);
  cd.push(new Uint8Array([].concat(u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(dt.t),u16(dt.d),u32(crc),u32(data.length),u32(data.length),u16(nm.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(off))),nm);
  off+=lh.length+nm.length+data.length;}
 var cdLen=0;cd.forEach(function(c){cdLen+=c.length;});
 var eo=new Uint8Array([].concat(u32(0x06054b50),u16(0),u16(0),u16(entries.length),u16(entries.length),u32(cdLen),u32(off),u16(0)));
 return new Blob(parts.concat(cd,[eo]),{type:'application/zip'});}
async function inflateRaw(u8){var ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer());}
async function read(src){var u8=await toU8(src),dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength),eo=-1;
 for(var i=u8.length-22;i>=Math.max(0,u8.length-65558);i--){if(dv.getUint32(i,true)===0x06054b50){eo=i;break;}}
 if(eo<0)throw new Error('ZIP nahi hai (end record nahi mila)');
 var n=dv.getUint16(eo+10,true),p=dv.getUint32(eo+16,true),out=[];
 for(var k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)throw new Error('ZIP kharab (central directory)');
  var meth=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true),
   name=dec.decode(u8.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;
  if(name.charAt(name.length-1)==='/')continue;
  var ln=dv.getUint16(lo+26,true),lx=dv.getUint16(lo+28,true),ds=lo+30+ln+lx,raw=u8.subarray(ds,ds+csz),data;
  if(meth===0)data=raw.slice();else if(meth===8)data=await inflateRaw(raw);else throw new Error('ZIP compression type '+meth+' samajh nahi aaya: '+name);
  out.push({name:name,data:data});}
 return out;}
root.ZIPLITE={write:write,read:read,crc32:crc32};
if(typeof module!=='undefined')module.exports=root.ZIPLITE;
})(typeof window!=='undefined'?window:globalThis);
