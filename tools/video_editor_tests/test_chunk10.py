# Chunk 10: stabilization. Static textured scene + white target, filmed with a shaky "camera" (ffmpeg crop jitter).
import sys,os,subprocess,random,statistics as st
from PIL import Image,ImageDraw,ImageFilter
from playwright.sync_api import sync_playwright
T,S='/tmp/test_tex.png','/tmp/test_shaky.webm'
if not os.path.exists(S):
    random.seed(3);im=Image.new('RGB',(900,560),(90,110,130));d=ImageDraw.Draw(im)
    for _ in range(500):
        x,y,r=random.randint(0,900),random.randint(0,560),random.randint(4,30);d.ellipse([x-r,y-r,x+r,y+r],fill=(random.randint(20,200),random.randint(20,200),random.randint(20,200)))
    d.rectangle([436,266,464,294],fill=(255,255,255));im.save(T)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-loop','1','-i',T,'-vf',"crop=640:360:'130+24*sin(n*0.9)+10*sin(n*2.1)':'100+14*cos(n*0.7)+6*sin(n*1.9)'",'-t','4','-r','30','-c:v','libvpx','-b:v','4M',S],check=True)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
CEN='''(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(0,0,1280,720).data;let sx=0,sy=0,n=0;for(let y=0;y<720;y+=1)for(let x=0;x<1280;x+=1){const i=(y*1280+x)*4;if(d[i]>245&&d[i+1]>245&&d[i+2]>245){sx+=x;sy+=y;n++}}return n?[sx/n,sy/n,n]:null})()'''
def measure(pg):
    pts=[]
    for k in range(9):
        pg.evaluate('__ed.setT(%f)'%(.4+.4*k));pg.wait_for_timeout(380);c=pg.evaluate(CEN)
        for _ in range(12):  # seek/frame-ready flaky: jab tak 2 reading same na aayein
            pg.wait_for_timeout(150);c2=pg.evaluate(CEN)
            if c and c2 and abs(c[0]-c2[0])<.01 and abs(c[1]-c2[1])<.01:break
            c=c2
        assert c,'target nahi dikha';pts.append(c)
    return st.pstdev([p[0] for p in pts]),st.pstdev([p[1] for p in pts]),pts
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[S]);pg.wait_for_function('__ed.media.size==1',timeout=15000)
    E('__ed.addMedia([...__ed.media.values()][0],1,0)');pg.wait_for_timeout(300)
    assert pg.locator('#stx').is_visible() and pg.locator('#sb_on').is_hidden()
    rx,ry,_=measure(pg);print('RAW jitter std x,y (canvas px):',round(rx,1),round(ry,1));assert rx>12,'test video hilta nahi'
    # analyse via button, with progress UI
    pg.click('#sb_go');pg.wait_for_timeout(300);print('btn:',pg.inner_text('#sb_go'))
    pg.wait_for_function('__ed.clips[0].sb&&__ed.clips[0].sb.p',timeout=90000)
    b0=E('(()=>{const b=__ed.clips[0].sb;return{on:b.on,n:b.n,zm:b.zm,za:b.za,sm:b.sm,m:Math.max(...b.p.map(Math.abs))}})()');print(b0)
    assert b0['on']==1 and b0['n']>=110 and b0['m']>.01 and 1.0<b0['zm']<1.5
    assert pg.locator('#sb_on').is_visible() and 'Analyse ho gaya' in pg.inner_text('#sb_msg')
    sx,sy,pts=measure(pg);print('STAB jitter std x,y:',round(sx,1),round(sy,1),[[round(a) for a in q[:2]] for q in pts])
    assert sx<rx*.4 and sy<ry*.4,('stabilize kaam nahi kiya',rx,ry,sx,sy)
    # toggle off -> jitter back
    pg.click('#sb_on');pg.wait_for_timeout(100);ox,oy,_=measure(pg);assert ox>rx*.6,('off',ox,rx);pg.click('#sb_on')
    # smoothing slider: 0 -> weaker smoothing, still sane; zoom slider user-set sticks
    pg.fill('#sb_zm','130');pg.dispatch_event('#sb_zm','input');pg.dispatch_event('#sb_zm','change');pg.fill('#sb_sm','60');pg.dispatch_event('#sb_sm','input');pg.dispatch_event('#sb_sm','change')
    b1=E('__ed.clips[0].sb');assert abs(b1['zm']-1.3)<.001 and b1['zu']==1,'user zoom overwrite ho gaya'
    # undo is one step per drag; split/dup don't share the sb object; path survives
    u=E('__ed.undoLen');E("(()=>{const e=document.getElementById('sb_sm');for(const v of [10,20,30]){e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}})()");assert E('__ed.undoLen')-u==1
    E('__ed.undo()');assert E('__ed.clips[0].sb.sm')==.6
    E('__ed.setT(2);__ed.sel=__ed.clips[0].id;__ed.split()');a,c2=E('__ed.clips.filter(c=>c.sb)')[:2]
    E('__ed.clips.filter(c=>c.sb)[1].sb.sm=.9');assert E('__ed.clips.filter(c=>c.sb)[0].sb.sm')!=.9,'sb shared!'
    E('__ed.undo()')
    # works with speed 2x (source-time indexed): target still steady
    E('__ed.sel=__ed.clips[0].id');pg.click('#s_ch [data-v="2"]');pg.wait_for_timeout(150)
    pts=[]
    for k in range(6):
        E('__ed.setT(%f)'%(.2+.3*k));pg.wait_for_timeout(380);c=E(CEN);assert c;pts.append(c)
    print('2x std',round(st.pstdev([q[0] for q in pts]),1));assert st.pstdev([q[0] for q in pts])<rx*.5
    pg.click('#s_ch [data-v="1"]')
    # cancel path: start and cancel immediately -> no crash, button back
    E('__ed.clips[0].sb=null');pg.click('#sb_go');pg.wait_for_timeout(200);pg.click('#sb_go');pg.wait_for_timeout(600)
    assert 'Analyse karke' in pg.inner_text('#sb_go'),pg.inner_text('#sb_go')
    # audio / image: no stabilize panel
    E('__ed.addText("hi")');assert pg.locator('#kpn').is_hidden()
    pg.screenshot(path='/tmp/ed10.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
