# run: python tools/video_editor_tests/test_chunk2.py   (playwright + chromium chahiye)
import sys,os
from playwright.sync_api import sync_playwright
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
def ev(pg,s):return pg.evaluate(s)
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':800})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);pg.evaluate('__ed.loadDemo()')
    assert ev(pg,'__ed.tracks.length')==4 and ev(pg,'__ed.clips.length')==5
    # zoom + scrub
    z=ev(pg,'__ed.pps');pg.click('#zi');assert ev(pg,'__ed.pps')>z
    pg.click('#zo');pg.click('#zo');assert ev(pg,'__ed.pps')<z
    pg.click('#fit');pg.evaluate('__ed.zoom(60)')
    # split: playhead 3s on Intro (0-6)
    ev(pg,'__ed.setT(3)');ev(pg,'__ed.sel=1');pg.keyboard.press('s')
    assert ev(pg,'__ed.clips.length')==6,'split'
    c1=ev(pg,'__ed.clips.find(c=>c.id==1)');assert abs(c1['len']-3)<.01
    c6=ev(pg,'__ed.clips[5]');assert abs(c6['start']-3)<.01 and abs(c6['in']-3)<.01 and abs(c6['len']-3)<.01
    # undo/redo
    pg.keyboard.press('Control+z');assert ev(pg,'__ed.clips.length')==5,'undo'
    pg.keyboard.press('Control+y');assert ev(pg,'__ed.clips.length')==6,'redo'
    # trim right handle of clip 1 (0-3): drag left 60px (=1s) -> len 2
    el=pg.locator('.clip[data-id="1"]');bb=el.bounding_box()
    pg.mouse.move(bb['x']+bb['width']-3,bb['y']+20);pg.mouse.down();pg.mouse.move(bb['x']+bb['width']-63,bb['y']+20,steps=6);pg.mouse.up()
    l=ev(pg,'__ed.clips.find(c=>c.id==1).len');assert 1.5<l<2.6,('trimR',l)
    # trim left handle of 'News 1' (id 2, start 7)
    el=pg.locator('.clip[data-id="2"]');bb=el.bounding_box();s0=ev(pg,'__ed.clips.find(c=>c.id==2).start')
    pg.mouse.move(bb['x']+3,bb['y']+20);pg.mouse.down();pg.mouse.move(bb['x']+63,bb['y']+20,steps=6);pg.mouse.up()
    c2=ev(pg,'__ed.clips.find(c=>c.id==2)');assert c2['start']>s0+.5 and c2['in']>.5,('trimL',c2)
    # move to other video track (row 2)
    el=pg.locator('.clip[data-id="2"]');bb=el.bounding_box()
    pg.mouse.move(bb['x']+40,bb['y']+20);pg.mouse.down();pg.mouse.move(bb['x']+40,bb['y']+20+52,steps=6);pg.mouse.up()
    assert ev(pg,'__ed.clips.find(c=>c.id==2).tr')==2,'track move'
    # ripple delete: on track 1, clip 1 (0-2) and clip 6 (3-6): delete clip 1 ripple -> clip6 start 3-2=1
    ev(pg,'__ed.sel=1');pg.keyboard.press('Shift+Delete')
    c6=ev(pg,'__ed.clips.find(c=>c.id==6)');assert abs(c6['start']-1)<.1,('ripple',c6)
    # normal delete leaves gap
    ev(pg,'__ed.sel=6');s=c6['start'];n=ev(pg,'__ed.clips.length');pg.keyboard.press('Delete');assert ev(pg,'__ed.clips.length')==n-1
    # play
    t0=ev(pg,'__ed.t');pg.keyboard.press('Space');pg.wait_for_timeout(500);pg.keyboard.press('Space');assert ev(pg,'__ed.t')>t0
    # PERF: 600 clips render + ruler
    ms=ev(pg,'''(()=>{const a=performance.now();for(let i=0;i<600;i++)__ed.clips.push({id:1000+i,tr:1+(i%4),start:i*0.5,len:2,in:0,name:'c'+i});__ed.render();return performance.now()-a})()''')
    print('render 600 clips ms:',round(ms,1));assert ms<250,'slow render'
    # drag perf: frame time while dragging with 600 clips
    el=pg.locator('.clip').first;bb=el.bounding_box()
    t=ev(pg,'''new Promise(r=>{let n=0,a=performance.now();function f(){n++;if(n<30)requestAnimationFrame(f);else r((performance.now()-a)/30)}requestAnimationFrame(f)})''')
    pg.mouse.move(bb['x']+30,bb['y']+20);pg.mouse.down()
    for i in range(20):pg.mouse.move(bb['x']+30+i*8,bb['y']+20)
    pg.mouse.up();print('frame ms idle:',round(t,1))
    pg.screenshot(path='/tmp/ed2.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
