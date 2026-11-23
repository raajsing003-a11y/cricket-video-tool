# Chunk 7: chroma key. green-screen image (green bg + red square + soft edge) on V1 over blue image on V2
import sys,os
from PIL import Image,ImageDraw,ImageFilter
from playwright.sync_api import sync_playwright
G='/tmp/test_green.png'
im=Image.new('RGB',(640,360),(0,255,0));d=ImageDraw.Draw(im);d.rectangle([220,100,420,260],fill=(220,30,30))
im.save(G)
if not os.path.exists('/tmp/test_i2.png'):Image.new('RGB',(400,300),(30,30,200)).save('/tmp/test_i2.png')
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
def px(pg,x,y):return pg.evaluate('(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(%d,%d,1,1).data;return [d[0],d[1],d[2]]})()'%(x,y))
def green(c):return c[1]>200 and c[0]<60 and c[2]<60
def blue(c):return c[2]>150 and c[0]<80 and c[1]<80
def red(c):return c[0]>150 and c[1]<80 and c[2]<80
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[G,'/tmp/test_i2.png']);pg.wait_for_function('__ed.media.size==2')
    E('(()=>{const [g,bl]=[...__ed.media.values()];__ed.addMedia(bl,2,0);__ed.addMedia(g,1,0);__ed.setT(1)})()')  # blue on V2 (below), green on V1 (top)
    pg.wait_for_timeout(150)
    assert pg.locator('#kpn').is_visible() and pg.locator('#tpn').is_hidden()
    assert green(px(pg,300,100)) and red(px(pg,640,360)),'key off: green dikhna chahiye'
    # eyedropper: wrong key colour first (default green ok) -> set to magenta then pick
    pg.fill('#k_col','#ff00ff') if False else E("(()=>{__ed.clips[1].ck={on:0,col:'#ff00ff',sim:.2,sm:.1,sp:.5};__ed.render()})()")
    pg.click('#k_pick');box=pg.locator('#cv').bounding_box()
    pg.mouse.click(box['x']+box['width']*.1,box['y']+box['height']*.1);pg.wait_for_timeout(150)
    k=E('__ed.clips[1].ck');print('picked',k);assert k['on']==1 and k['col'].lower()=='#00ff00',k
    assert blue(px(pg,300,100)),('green gayab, bg blue',px(pg,300,100))
    assert red(px(pg,640,360)),('subject bacha',px(pg,640,360))
    # sliders: similarity tiny -> still keys exact green; huge -> kills red too
    pg.fill('#k_sim','70');pg.dispatch_event('#k_sim','input');pg.fill('#k_sm','50');pg.dispatch_event('#k_sm','input');pg.wait_for_timeout(120)
    assert E('__ed.clips[1].ck.sim')==.7
    c=px(pg,640,360);print('sim70',c);assert not red(c),'bahut zyada similarity subject ko bhi kaat deti hai'
    pg.fill('#k_sim','20');pg.dispatch_event('#k_sim','input');pg.fill('#k_sm','10');pg.dispatch_event('#k_sm','input');pg.wait_for_timeout(120)
    assert red(px(pg,640,360)) and blue(px(pg,300,100))
    # toggle off / on
    pg.click('#k_on');pg.wait_for_timeout(100);assert green(px(pg,300,100));pg.click('#k_on');pg.wait_for_timeout(100);assert blue(px(pg,300,100))
    # blue screen preset chip sets colour
    pg.click('#k_ch [data-c="#0a2cff"]');assert E('__ed.clips[1].ck.col')=='#0a2cff'
    pg.click('#k_ch [data-c="#00ff00"]')
    # undo is one step per slider drag
    u=E('__ed.undoLen');E("(()=>{const e=document.getElementById('k_sp');for(const v of [10,15,20]){e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}})()");assert E('__ed.undoLen')-u==1,E('__ed.undoLen')-u
    E('__ed.undo()');assert E('__ed.clips[1].ck.sp')==.5
    # split / dup do not share ck object
    E('__ed.setT(2.5);__ed.sel=__ed.clips[1].id;__ed.split()');cl=E('__ed.clips');a,b2=[c for c in cl if c.get('ck')][:2]
    E('(()=>{const c=__ed.clips.filter(c=>c.ck);c[1].ck.sim=.5})()');assert E('__ed.clips.filter(c=>c.ck)[0].ck.sim')!=.5,'ck shared!'
    E('__ed.setT(1)');pg.wait_for_timeout(120);E('__ed.clips.filter(c=>c.ck)[1].ck.sim=.2')
    # CPU fallback gives same result
    E('window.__noGL=1;__ed.setT(1.01)');pg.wait_for_timeout(200)
    assert blue(px(pg,300,100)) and red(px(pg,640,360)),('2d fallback',px(pg,300,100),px(pg,640,360))
    E('window.__noGL=0;__ed.setT(1)');pg.wait_for_timeout(120)
    # image panel hides for text clip / audio
    E('__ed.addText("hi")');assert pg.locator('#kpn').is_hidden() and pg.locator('#tpn').is_visible()
    # perf (GL path)
    E('__ed.sel=__ed.clips.find(c=>c.ck).id;__ed.setT(1)')
    ms=E('(()=>{const a=performance.now();for(let i=0;i<40;i++)__ed.preview();return (performance.now()-a)/40})()');print('preview ms/frame keyed 720p:',round(ms,2));assert ms<25
    pg.screenshot(path='/tmp/ed7.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
