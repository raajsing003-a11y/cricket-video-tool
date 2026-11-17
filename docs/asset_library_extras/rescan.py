#!/usr/bin/env python3
"""Naya asset folder mein daalo -> `python rescan.py` -> MASTER_INDEX.csv + gallery data update.
- Naye files auto-add hote hain (tags = folder + filename ke shabd), status YELLOW (license check karo).
- Jo TODO file ab folder mein aa gayi, uska status YELLOW ho jata hai (license bharke GREEN karo).
- CSV mein tags/license/status khud edit kar sakte ho (Excel/Sheets mein khulta hai)."""
import csv, json, os, sys
R = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(R, 'MASTER_INDEX.csv')
COLS = ['file', 'category', 'tags', 'description', 'size', 'transparent', 'source', 'license', 'status']
rows = list(csv.DictReader(open(P, encoding='utf-8-sig'))); have = {r['file']: r for r in rows}
try:
    from PIL import Image
except Exception:
    Image = None
new = 0
for dp, dn, fn in os.walk(R):
    for f in fn:
        if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')): continue
        rel = os.path.relpath(os.path.join(dp, f), R).replace(os.sep, '/')
        size = ''
        if Image:
            try: size = '%dx%d' % Image.open(os.path.join(R, rel)).size
            except Exception: pass
        if rel in have:
            r = have[rel]
            if r['status'] == 'TODO': r['status'] = 'YELLOW'; r['size'] = size; r['source'] = r['source'].replace('TODO: ', 'added: ')
            continue
        toks = [t for t in os.path.splitext(rel)[0].replace('/', '_').split('_') if t and not t[0].isdigit()]
        rows.append(dict(file=rel, category=rel.split('/')[0], tags=' | '.join(dict.fromkeys(toks)), description='', size=size,
                         transparent='', source='ADDED (fill in)', license='UNKNOWN - check', status='YELLOW')); new += 1
with open(P, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=COLS); w.writeheader(); w.writerows(rows)
open(os.path.join(R, 'index_data.js'), 'w', encoding='utf-8').write('window.ASSETS=' + json.dumps(rows, ensure_ascii=False) + ';')
print('Index updated. New files:', new, '| Total rows:', len(rows))
