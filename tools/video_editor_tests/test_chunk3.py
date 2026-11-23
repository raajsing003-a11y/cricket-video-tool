# Chunk 3: import + preview. Test media: ffmpeg se banao (webm+ogg+png) /tmp mein
import sys,os,subprocess
from playwright.sync_api import sync_playwright
V,A,I='/tmp/test_v.webm','/tmp/test_a.ogg','/tmp/test_i.png'
if not os.path.exists(V):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','testsrc=duration=4:size=640x360:rate=30','-f','lavfi','-i','sine=frequency=440:duration=4','-c:v','libvpx','-c:a','libvorbis','-shortest',V],check=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=660:duration=3','-c:a','libvorbis',A],check=True)
    from PIL import Image;Image.new('RGB',(400,300),(200,30,30)).save(I)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1280,'height':800})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f)
    assert pg.evaluate('__ed.media.size')==0 and pg.evaluate('getComputedStyle(document.getElementById("empty")).display')=='flex'
    pg.set_input_files('#file',[V,A,I]);pg.wait_for_function('__ed.media.size==3',timeout=15000)
    assert pg.locator('.mi').count()==3
    dur=pg.evaluate('[...__ed.media.values()].find(m=>m.kind=="v").dur');assert 3<dur<5,dur
    # double-click video -> clip on video track at 0
    pg.locator('.mi:not(.a)').first.dblclick();assert pg.evaluate('__ed.clips.length')==1
    c=pg.evaluate('__ed.clips[0]');assert abs(c['len']-dur)<.01 and c['tr']==1
    # audio goes to audio track
    pg.locator('.mi.a').dblclick();assert pg.evaluate('__ed.clips[1].tr')==3,'audio track'
    # drag-drop image from bin to Video 2 row at x
    pg.evaluate('''()=>{const id=[...__ed.media.values()].find(m=>m.kind=="i").id;const dt=new DataTransfer();dt.setData("text/plain","media:"+id);
      const r=document.getElementById("rows").getBoundingClientRect();
      const ev=new DragEvent("drop",{dataTransfer:dt,clientX:r.left+300,clientY:r.top+52+20,bubbles:true,cancelable:true});document.getElementById("rows").dispatchEvent(ev)}''')
    assert pg.evaluate('__ed.clips.length')==3 and pg.evaluate('__ed.clips[2].tr')==2,'drop'
    # preview shows video frame (non-black) at t=1
    pg.evaluate('__ed.setT(1)');pg.wait_for_timeout(900)
    px=pg.evaluate('(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(640,360,1,1).data;return [d[0],d[1],d[2]]})()')
    print('pixel t=1',px);assert sum(px)>30,'video frame draw'
    # image on top? B-roll image is on Video 2 (below Video 1) - at t=1 only video active
    # play: currentTime advances + sync
    pg.evaluate('__ed.setT(0)');pg.keyboard.press('Space');pg.wait_for_timeout(1200)
    t=pg.evaluate('__ed.t');el=pg.evaluate('[...__ed.els.values()].map(e=>e.currentTime)')
    print('t',round(t,2),'media times',[round(x,2) for x in el]);assert t>0.8 and any(abs(x-t)<0.4 for x in el),'sync'
    pg.keyboard.press('Space')
    # trim clamp: right trim beyond media length not allowed
    el=pg.locator('.clip[data-id="1"]');bb=el.bounding_box()
    pg.mouse.move(bb['x']+bb['width']-3,bb['y']+20);pg.mouse.down();pg.mouse.move(bb['x']+bb['width']+200,bb['y']+20,steps=5);pg.mouse.up()
    l=pg.evaluate('__ed.clips.find(c=>c.id==1).len');assert l<=dur+.01,('clamp',l,dur)
    # split keeps media
    pg.evaluate('__ed.setT(1.5);__ed.sel=1');pg.keyboard.press('s');assert pg.evaluate('__ed.clips.at(-1).media')==1
    pg.wait_for_timeout(700);px=pg.evaluate('(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(640,360,1,1).data;return d[0]+d[1]+d[2]})()');assert px>30,'black after split'
    pg.screenshot(path='/tmp/ed3.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
