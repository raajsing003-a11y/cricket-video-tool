# Chunk 8: background removal. grey noisy bg + brown subject (with a grey patch INSIDE) on V1 over blue image on V2
import sys,os,random
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
random.seed(1);G='/tmp/test_bg.png';W,H=640,360
im=Image.new('RGB',(W,H));pxs=im.load()
for y in range(H):
    for x in range(W):
        n=random.randint(-6,6);pxs[x,y]=(200+n,200+n,200+n)
d=ImageDraw.Draw(im);d.rectangle([200,80,440,300],fill=(150,100,90));d.rectangle([300,150,340,190],fill=(200,200,200))  # inner grey patch
im.save(G)
Image.new('RGB',(400,300),(30,30,200)).save('/tmp/test_i2.png')
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
def px(pg,x,y):return pg.evaluate('(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(%d,%d,1,1).data;return [d[0],d[1],d[2]]})()'%(x,y))
grey=lambda c:abs(c[0]-c[1])<12 and abs(c[1]-c[2])<12 and c[0]>180
blue=lambda c:c[2]>150 and c[0]<80 and c[1]<80
brown=lambda c:abs(c[0]-150)<25 and abs(c[1]-100)<25 and abs(c[2]-90)<25
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and 'Failed to load resource' not in m.text and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[G,'/tmp/test_i2.png']);pg.wait_for_function('__ed.media.size==2')
    E('(()=>{const [g,bl]=[...__ed.media.values()];__ed.addMedia(bl,2,0);__ed.addMedia(g,1,0);__ed.setT(1)})()')
    pg.wait_for_timeout(150)
    assert pg.locator('#kpn').is_visible()
    assert grey(px(pg,300,100)) and brown(px(pg,640,200)),'bg off: grey dikhna chahiye'
    pg.click('#b_on');pg.wait_for_timeout(200)
    bg=E('__ed.clips[1].bg');print('bg',bg);assert bg['on']==1 and bg['md']=='auto'
    c1=px(pg,300,100);c2=px(pg,640,200);c3=px(pg,640,360)  # corner, subject, inner grey patch (640x360 video-> canvas centre)
    print('corner',c1,'subject',c2,'inner',c3)
    assert blue(c1),('bg hata nahi',c1);assert brown(c2),('subject bacha nahi',c2);assert grey(c3),('andar ka grey patch kat gaya (sirf kinare se juda hatna chahiye)',c3)
    # tolerance huge -> subject bhi jata hai
    pg.fill('#b_tol','45');pg.dispatch_event('#b_tol','input');pg.wait_for_timeout(150)
    assert E('__ed.clips[1].bg.tol')==.45;assert not brown(px(pg,640,200)),'tol zyada: subject bhi kat jana chahiye'
    pg.fill('#b_tol','12');pg.dispatch_event('#b_tol','input');pg.wait_for_timeout(150)
    assert brown(px(pg,640,200)) and blue(px(pg,300,100))
    # edge shift: +6 sikodta hai (subject kinara andar), feather 0 -> sharp
    # subject left edge ~ x=200/640*1280=400 canvas px
    pg.fill('#b_fe','0');pg.dispatch_event('#b_fe','input');pg.fill('#b_gr','6');pg.dispatch_event('#b_gr','input');pg.wait_for_timeout(150)
    e_in=px(pg,404,200);print('edge +6 @404',e_in);assert blue(e_in),'kinara +6 par kinare ke paas bg dikhna chahiye'
    pg.fill('#b_gr','-6');pg.dispatch_event('#b_gr','input');pg.wait_for_timeout(150)
    e_out=px(pg,394,200);print('edge -6 @394',e_out);assert not blue(e_out),'kinara -6 par subject failna chahiye'
    pg.fill('#b_gr','0');pg.dispatch_event('#b_gr','input');pg.fill('#b_fe','2');pg.dispatch_event('#b_fe','input');pg.wait_for_timeout(150)
    # invert -> subject hat jata, bg bacha
    pg.click('#b_inv');pg.wait_for_timeout(150);assert blue(px(pg,640,200)) and grey(px(pg,300,100)),('invert',px(pg,640,200),px(pg,300,100))
    pg.click('#b_inv');pg.wait_for_timeout(150);assert blue(px(pg,300,100))
    # AI mode with mock mask (centre ellipse-ish rectangle = person)
    E('''window.__mpHook=(src,w,h)=>{const mw=64,mh=36,a=new Float32Array(mw*mh);for(let y=10;y<30;y++)for(let x=20;x<44;x++)a[y*mw+x]=1;return{data:a,w:mw,h:mh}}''')
    pg.click('#b_md [data-v="ai"]');pg.wait_for_timeout(200)
    assert E('__ed.clips[1].bg.md')=='ai' and pg.locator('#b_tr').is_hidden()
    assert blue(px(pg,300,100)) and brown(px(pg,640,230)),('AI mask',px(pg,300,100),px(pg,640,230))
    pg.click('#b_md [data-v="auto"]');pg.wait_for_timeout(150);assert pg.locator('#b_tr').is_visible()
    # chroma key and bg are exclusive
    pg.click('#k_on');pg.wait_for_timeout(100);assert E('__ed.clips[1].bg.on')==0 and E('__ed.clips[1].ck.on')==1
    pg.click('#b_on');pg.wait_for_timeout(100);assert E('__ed.clips[1].bg.on')==1 and E('__ed.clips[1].ck.on')==0
    # undo: one step per slider drag
    u=E('__ed.undoLen');E("(()=>{const e=document.getElementById('b_fe');for(const v of [3,4,5]){e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}})()");assert E('__ed.undoLen')-u==1
    E('__ed.undo()');assert E('__ed.clips[1].bg.fe')==2
    # split/dup do not share bg object
    E('__ed.setT(2.5);__ed.sel=__ed.clips[1].id;__ed.split()')
    E('(()=>{const c=__ed.clips.filter(c=>c.bg);c[1].bg.tol=.5})()');assert E('__ed.clips.filter(c=>c.bg)[0].bg.tol')!=.5,'bg shared!'
    E('__ed.clips.filter(c=>c.bg)[1].bg.tol=.12;__ed.setT(1)');pg.wait_for_timeout(150)
    # no-network AI path: no mock -> clear message, no crash, source dikhta rehta hai
    E('window.__mpHook=null;window.__mpUrl="http://127.0.0.1:9/none.mjs"')
    pg.click('#b_md [data-v="ai"]');pg.wait_for_timeout(1200);msg=pg.inner_text('#bg_msg');print('msg:',msg);assert 'AI' in msg
    pg.click('#b_md [data-v="auto"]')
    # text clip / audio: panel hidden
    E('__ed.addText("hi")');assert pg.locator('#kpn').is_hidden()
    E('__ed.sel=__ed.clips.find(c=>c.bg).id;__ed.setT(1)')
    ms=E('(()=>{const a=performance.now();for(let i=0;i<30;i++)__ed.preview();return (performance.now()-a)/30})()');print('preview ms/frame bg-auto:',round(ms,2));assert ms<25
    pg.screenshot(path='/tmp/ed8.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
