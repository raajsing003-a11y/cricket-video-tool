#!/usr/bin/env python3
"""Competitor channel ke SAARE videos ke title + views + thumbnail download.
Chalao:  pip install yt-dlp   (ek baar)
         python scripts/competitor_grab.py https://www.youtube.com/@channel  [--max 200] [--min-views 50000]
Output: competitor_out/<channel>/titles.csv, titles.txt, thumbs/*.jpg
Sirf reference ke liye. Thumbnail jyon ki tyon apne video mein mat lagao."""
import sys,os,re,csv,json,subprocess,urllib.request,argparse
ap=argparse.ArgumentParser();ap.add_argument('urls',nargs='+');ap.add_argument('--max',type=int,default=200);ap.add_argument('--min-views',type=int,default=0)
a=ap.parse_args()
safe=lambda s:re.sub(r'[\\/:*?"<>|#\n]+',' ',s).strip()[:60]
for u in a.urls:
    if not re.search(r'/(videos|shorts|streams)$',u) and ('@' in u or '/channel/' in u): u=u.rstrip('/')+'/videos'
    p=subprocess.run(['yt-dlp','--flat-playlist','-J','--playlist-end',str(a.max),u],capture_output=True,text=True)
    if p.returncode: print('yt-dlp error:',p.stderr[-300:]);continue
    j=json.loads(p.stdout);ch=safe(j.get('channel') or j.get('title') or 'channel');d=os.path.join('competitor_out',ch);os.makedirs(d+'/thumbs',exist_ok=True)
    rows=[e for e in j.get('entries',[]) if e and (e.get('view_count') or 0)>=a.min_views];rows.sort(key=lambda e:-(e.get('view_count') or 0))
    with open(d+'/titles.csv','w',newline='',encoding='utf-8-sig') as f:
        w=csv.writer(f);w.writerow(['title','views','link'])
        for i,e in enumerate(rows,1):
            w.writerow([e['title'],e.get('view_count') or 0,'https://youtu.be/'+e['id']])
            for q in('maxresdefault','hqdefault'):
                try:urllib.request.urlretrieve(f"https://i.ytimg.com/vi/{e['id']}/{q}.jpg",f"{d}/thumbs/{i:03d}_{safe(e['title'])}.jpg");break
                except Exception:pass
    open(d+'/titles.txt','w',encoding='utf-8').write('\n'.join(e['title'] for e in rows))
    print(ch,len(rows),'videos ->',d)
