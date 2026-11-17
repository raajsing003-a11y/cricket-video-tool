#!/usr/bin/env python3
"""Tag se asset dhundo:  python find_asset.py stamp retain      (sab tags match hone chahiye)"""
import csv, os, sys
R = os.path.dirname(os.path.abspath(__file__))
q = [a.lower() for a in sys.argv[1:]]
for r in csv.DictReader(open(os.path.join(R, 'MASTER_INDEX.csv'), encoding='utf-8-sig')):
    hay = (r['tags'] + ' ' + r['file'] + ' ' + r['description']).lower()
    if all(t in hay for t in q): print(f"[{r['status']:6}] {r['file']}   <- {r['tags']}")
