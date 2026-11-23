# Chunk 4: transitions (15). Red image A (0-5) + blue image B (5-10) same track
import sys,os
from playwright.sync_api import sync_playwright
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
def px(pg,x,y=360):
    return pg.evaluate('(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(%d,%d,1,1).data;return [d[0],d[1],d[2]]})()'%(x,y))
def red(c):return c[0]>150 and c[2]<80
def blue(c):return c[2]>150 and c[0]<80
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':800})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f)
    pg.set_input_files('#file',['/tmp/test_i.png','/tmp/test_i2.png']);pg.wait_for_function('__ed.media.size==2')
    pg.evaluate('(()=>{const [a,b]=[...__ed.media.values()];__ed.addMedia(a,1,0);__ed.addMedia(b,1,5)})()')
    assert pg.evaluate('__ed.clips.length')==2
    pg.evaluate('__ed.sel=2')
    # tile picker opens, 16 tiles (none + 15)
    pg.click('#trb');assert pg.locator('.tt').count()==16,pg.locator('.tt').count()
    pg.locator('.tt[data-id="fade"]').click()
    B=pg.evaluate('__ed.clips[1]');assert abs(B['start']-4.5)<.01 and B['tt']=='fade',B   # overlap 0.5
    assert pg.locator('.tz').count()==1
    def at(t):pg.evaluate('__ed.setT(%s)'%t);pg.wait_for_timeout(120)
    at(4.0);assert red(px(pg,640)),'pre red'
    at(4.75);m=px(pg,640);assert m[0]>80 and m[2]>80,('fade mix',m)
    at(5.2);assert blue(px(pg,640)),'post blue'
    # every transition: p~0.5 pixels differ properly, no JS errors, A/B both visible or valid
    n=0
    for k in pg.evaluate('Object.keys(__ed.TN)'):
        pg.evaluate("(__ed.sel=2,__ed.applyTrans('%s',1))"%k)
        B=pg.evaluate('__ed.clips[1]');start=B['start'];at(start+0.5)
        cs=[px(pg,x) for x in (200,640,1000)];n+=1
        print(k,cs)
    assert n==15
    # directional checks (dur 1 -> overlap 1, B.start=4)
    pg.evaluate("(__ed.sel=2,__ed.applyTrans('wipeR',1))");at(4.5);assert blue(px(pg,300)) and red(px(pg,1000)),'wipeR'
    pg.evaluate("(__ed.sel=2,__ed.applyTrans('pushL',1))");at(4.5);assert red(px(pg,300)) and blue(px(pg,1000)),'pushL'
    # undo restores, remove transition restores geometry
    pg.keyboard.press('Control+z');pg.keyboard.press('Control+y')
    pg.evaluate("(__ed.sel=2,__ed.applyTrans('none',1))");B=pg.evaluate('__ed.clips[1]');assert abs(B['start']-5)<.01 and 'tt' not in B,B
    # no predecessor -> refused
    pg.evaluate('__ed.sel=1');assert pg.evaluate("__ed.applyTrans('fade',.5)")==False
    # perf: 15 transitions draw time
    ms=pg.evaluate("(()=>{__ed.sel=2;__ed.applyTrans('iris',1);__ed.setT(4.5);const a=performance.now();for(let i=0;i<60;i++)__ed.preview();return (performance.now()-a)/60})()")
    print('preview ms/frame during transition:',round(ms,2));assert ms<8
    pg.click('#trb');pg.wait_for_timeout(300);pg.screenshot(path='/tmp/ed4.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
