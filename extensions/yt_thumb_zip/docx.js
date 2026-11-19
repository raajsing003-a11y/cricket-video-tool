// Bina library ke chhota .docx banata hai (docx = zip + XML). zip.js ka makeZip use karta hai.
(function (root) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const EMO = /(?:[\u{1F1E6}-\u{1F1FF}]{2}|(?![\u00a9\u00ae\u2122])\p{Extended_Pictographic}(?:[\ufe0f\u20e3]|\p{Emoji_Modifier})*(?:\u200d\p{Extended_Pictographic}(?:[\ufe0f]|\p{Emoji_Modifier})*)*)/gu;
  const rpr = (o, emoji) => '<w:rPr><w:rFonts w:ascii="' + (emoji ? 'Segoe UI Emoji' : 'Calibri') + '" w:hAnsi="' + (emoji ? 'Segoe UI Emoji' : 'Calibri') + '" w:eastAsia="Segoe UI Emoji" w:cs="' + (emoji ? 'Segoe UI Emoji' : 'Nirmala UI') + '"/>' + ((o && o.b) ? '<w:b/><w:bCs/>' : '') + ((o && o.c) ? '<w:color w:val="' + o.c + '"/>' : '') + '<w:sz w:val="' + ((o && o.sz) || 24) + '"/><w:szCs w:val="' + ((o && o.sz) || 24) + '"/><w:lang w:val="en-IN" w:bidi="hi-IN"/></w:rPr>';
  const piece = (t, o, emoji) => t.split(/\r\n|\r|\n/).map(l => '<w:t xml:space="preserve">' + esc(l) + '</w:t>').join('<w:br/>');
  // text ko emoji / non-emoji tukdon mein todta hai taaki har ek ko sahi font mile (Hindi + emoji dono exact dikhen)
  const run = (t, o) => {
    t = String(t); let out = '', last = 0, m; EMO.lastIndex = 0;
    while ((m = EMO.exec(t))) {
      if (m.index > last) out += '<w:r>' + rpr(o, false) + piece(t.slice(last, m.index)) + '</w:r>';
      out += '<w:r>' + rpr(o, true) + piece(m[0]) + '</w:r>'; last = m.index + m[0].length;
    }
    if (last < t.length || !out) out += '<w:r>' + rpr(o, false) + piece(t.slice(last)) + '</w:r>';
    return out;
  };
  const para = (runs, after) => '<w:p><w:pPr><w:spacing w:after="' + (after == null ? 80 : after) + '"/></w:pPr>' + runs + '</w:p>';
  // list: [{i, id, title}]
  function makeDocx(list, heading, sub) {
    let body = para(run(heading, { b: 1, sz: 36 }), 60) + para(run(sub, { c: '666666', sz: 20 }), 200);
    list.forEach(x => {
      body += para(run((x.i + 1) + '. ', { b: 1 }) + run(x.title || '(title nahi mila)', { b: 1 }), 20);
      body += para(run('https://youtu.be/' + x.id, { c: '1F6FEB', sz: 20 }), 160);
    });
    const doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>';
    const ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
    const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
    const enc = new TextEncoder();
    return root.makeZip([{ name: '[Content_Types].xml', data: enc.encode(ct) }, { name: '_rels/.rels', data: enc.encode(rels) }, { name: 'word/document.xml', data: enc.encode(doc) }]);
  }
  root.makeDocx = makeDocx;
})(typeof window !== 'undefined' ? window : globalThis);
