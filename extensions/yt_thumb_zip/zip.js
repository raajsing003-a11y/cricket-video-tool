// Chhota ZIP (store, bina compression) writer. JPG pehle se compressed hoti hai, isliye store theek hai.
(function (root) {
  const T = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; }
  function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = T[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function dosTime(d) { return { t: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), d: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() }; }
  // files: [{name:string, data:Uint8Array}] -> Uint8Array
  function makeZip(files) {
    const enc = new TextEncoder(), now = dosTime(new Date()), parts = [], cen = [];
    let off = 0;
    files.forEach(f => {
      const nm = enc.encode(f.name), crc = crc32(f.data), sz = f.data.length;
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, now.t, true); lh.setUint16(12, now.d, true); lh.setUint32(14, crc, true); lh.setUint32(18, sz, true); lh.setUint32(22, sz, true);
      lh.setUint16(26, nm.length, true); lh.setUint16(28, 0, true);
      parts.push(new Uint8Array(lh.buffer), nm, f.data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, now.t, true); ch.setUint16(14, now.d, true); ch.setUint32(16, crc, true); ch.setUint32(20, sz, true); ch.setUint32(24, sz, true);
      ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
      cen.push(new Uint8Array(ch.buffer), nm);
      off += 30 + nm.length + sz;
    });
    let cs = 0; cen.forEach(p => cs += p.length);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cs, true); e.setUint32(16, off, true);
    const all = parts.concat(cen, [new Uint8Array(e.buffer)]);
    let tot = 0; all.forEach(p => tot += p.length);
    const out = new Uint8Array(tot); let o = 0; all.forEach(p => { out.set(p, o); o += p.length; });
    return out;
  }
  root.makeZip = makeZip;
  if (typeof module !== 'undefined') module.exports = { makeZip, crc32 };
})(typeof window !== 'undefined' ? window : globalThis);
