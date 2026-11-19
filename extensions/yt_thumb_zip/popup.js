(function () {
  const $ = id => document.getElementById(id);
  const RE = /(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})(?![\w-])/g;
  function parseIds(text) {
    const out = [], seen = new Set();
    const add = id => { if (!seen.has(id)) { seen.add(id); out.push(id); } };
    let m; RE.lastIndex = 0;
    while ((m = RE.exec(text))) add(m[1]);
    text.split(/[\s,]+/).forEach(w => { if (/^[\w-]{11}$/.test(w) && !/^https?/.test(w)) add(w); });
    return out;
  }
  function refresh() { const n = parseIds($('t').value).length; $('cnt').textContent = n ? n + ' video mile' : ''; }
  $('t').oninput = refresh;
  $('clr').onclick = () => { $('t').value = ''; $('st').textContent = ''; $('bar').firstChild.style.width = '0'; refresh(); };

  $('grab').onclick = async () => {
    const b = $('grab'); b.disabled = true; $('st').textContent = '⏳ Page padh raha hoon…';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !/^https?:\/\/([\w-]+\.)?youtube\.com\//.test(tab.url || '')) throw new Error('Pehle YouTube ka page kholo (channel / search / playlist).');
      const scrolls = Math.max(0, Math.min(40, +$('sc').value || 0));
      const r = await chrome.scripting.executeScript({
        target: { tabId: tab.id }, args: [scrolls],
        func: async n => {
          const sleep = ms => new Promise(r => setTimeout(r, ms));
          for (let i = 0; i < n; i++) { window.scrollTo(0, document.documentElement.scrollHeight); await sleep(1300); }
          const ids = [], seen = new Set(), re = /(?:[?&]v=|\/shorts\/)([\w-]{11})(?![\w-])/;
          document.querySelectorAll('a[href]').forEach(a => { const m = re.exec(a.getAttribute('href')); if (m && !seen.has(m[1])) { seen.add(m[1]); ids.push(m[1]); } });
          const cur = re.exec(location.href); if (cur && !seen.has(cur[1])) ids.unshift(cur[1]);
          return ids;
        }
      });
      const ids = (r && r[0] && r[0].result) || [];
      const have = new Set(parseIds($('t').value)), add = ids.filter(i => !have.has(i));
      $('t').value = ($('t').value.trim() + '\n' + add.map(i => 'https://youtu.be/' + i).join('\n')).trim();
      refresh(); $('st').textContent = '✔ ' + add.length + ' naye video link jode.';
    } catch (e) { $('st').textContent = '❌ ' + e.message; }
    b.disabled = false;
  };

  async function getThumb(id, mode) {
    const names = mode === 'max' ? ['maxresdefault', 'sddefault', 'hqdefault'] : ['hqdefault'];
    for (const n of names) {
      try {
        const res = await fetch('https://i.ytimg.com/vi/' + id + '/' + n + '.jpg');
        if (!res.ok) continue;
        const buf = new Uint8Array(await res.arrayBuffer());
        if (buf.length > 1500) return { data: buf, q: n };
      } catch (e) {}
    }
    return null;
  }

  async function getTitle(id) {
    try {
      const res = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id));
      if (!res.ok) return '';
      const d = await res.json(); return (d.title || '').trim();
    } catch (e) { return ''; }
  }
  function safeName(t) { const s = t.replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim(); return Array.from(s).slice(0, 80).join('').replace(/[\u200d\ufe0f]+$/, '').replace(/[. ]+$/, '').trim(); }
  const csvq = s => '"' + String(s).replace(/"/g, '""') + '"';

  $('cpt').onclick = async () => {
    const ids = parseIds($('t').value);
    if (!ids.length) { $('st').textContent = '❌ Koi link/ID nahi mili.'; return; }
    $('cpt').disabled = true; const T = new Array(ids.length); let n = 0, k = 0;
    const w = async () => { while (k < ids.length) { const i = k++; T[i] = await getTitle(ids[i]); n++; $('st').textContent = '⏳ Titles ' + n + '/' + ids.length; } };
    await Promise.all(Array.from({ length: Math.min(6, ids.length) }, w));
    const txt = ids.map((id, i) => (i + 1) + '. ' + (T[i] || '(title nahi mila)') + ' — https://youtu.be/' + id).join('\n');
    try { await navigator.clipboard.writeText(txt); $('st').textContent = '✅ ' + ids.length + ' titles copy ho gaye.'; } catch (e) { $('t').value = txt; $('st').textContent = '⚠ Copy nahi hua; titles upar box mein daal diye.'; }
    $('cpt').disabled = false;
  };

  $('dl').onclick = async () => {
    const ids = parseIds($('t').value);
    if (!ids.length) { $('st').textContent = '❌ Koi link/ID nahi mili.'; return; }
    const mode = $('q').value, useT = $('tn').checked, files = [], fail = [], pad = String(ids.length).length;
    let done = 0, next = 0; const meta = new Array(ids.length);
    $('dl').disabled = true; $('bar').firstChild.style.width = '0';
    const worker = async () => {
      while (next < ids.length) {
        const k = next++, id = ids[k], r = await Promise.all([getThumb(id, mode), getTitle(id)]), t = r[0], title = r[1];
        meta[k] = { id: id, title: title, q: t ? t.q : '' };
        const sn = useT ? safeName(title) : '';
        if (t) files.push({ k: k, name: String(k + 1).padStart(pad, '0') + (sn ? '_' + sn : '') + '_' + id + '.jpg', data: t.data }); else fail.push(id);
        done++; $('st').textContent = '⏳ ' + done + '/' + ids.length + ' thumbnail aaye…'; $('bar').firstChild.style.width = (done / ids.length * 100) + '%';
      }
    };
    await Promise.all(Array.from({ length: Math.min(6, ids.length) }, worker));
    files.sort((a, b) => a.k - b.k);
    if (!files.length) { $('st').textContent = '❌ Ek bhi thumbnail nahi mili (ID galat ya net band).'; $('dl').disabled = false; return; }
    const enc = new TextEncoder(), list = ids.map((id, i) => ({ i: i, id: id, title: (meta[i] && meta[i].title) || '', q: (meta[i] && meta[i].q) || '' }));
    const csv = '\ufeff' + 'no,video_id,title,url,thumb_quality\r\n' + list.map(x => [x.i + 1, x.id, csvq(x.title), 'https://youtu.be/' + x.id, x.q].join(',')).join('\r\n');
    const txt = list.map(x => (x.i + 1) + '. ' + (x.title || '(title nahi mila)') + ' — https://youtu.be/' + x.id).join('\r\n');
    const zip = makeZip(files.map(f => ({ name: f.name, data: f.data })).concat([{ name: 'titles.csv', data: enc.encode(csv) }]));
    const d = new Date(), p = n => String(n).padStart(2, '0');
    const nm = 'yt_thumbnails_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + '.zip';
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([zip], { type: 'application/zip' })); a.download = nm; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    const docx = makeDocx(list, 'YouTube Video Titles', list.length + ' videos · ' + d.toLocaleString('hi-IN'));
    const a2 = document.createElement('a'); a2.href = URL.createObjectURL(new Blob([docx], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })); a2.download = nm.replace('yt_thumbnails_', 'yt_titles_').replace('.zip', '.docx'); document.body.appendChild(a2);
    setTimeout(() => { a2.click(); setTimeout(() => { URL.revokeObjectURL(a2.href); a2.remove(); }, 4000); }, 600);
    $('st').textContent = '✅ ' + files.length + ' thumbnail ZIP mein save: ' + nm + '\n📄 Titles alag Word file mein: ' + nm.replace('yt_thumbnails_', 'yt_titles_').replace('.zip', '.docx') + (fail.length ? '\n⚠ ' + fail.length + ' nahi mili: ' + fail.slice(0, 8).join(', ') + (fail.length > 8 ? '…' : '') : '');
    $('dl').disabled = false;
  };
})();
