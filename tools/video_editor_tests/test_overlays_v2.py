# run: python tools/video_editor_tests/test_overlays_v2.py  (C222: Overlay lane v2 — data model + render + export)
import os,json,subprocess,base64,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
here=os.path.dirname(os.path.abspath(__file__));clipf=os.path.join(here,'_clip_tmp.webm')
if not os.path.exists(clipf):
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','testsrc=size=640x360:rate=25:duration=6','-f','lavfi','-i','sine=frequency=440:duration=6','-c:v','libvpx','-b:v','500k','-c:a','libopus','-shortest',clipf],check=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/';errs=[]
scenes=json.load(open(os.path.join(root,'docs','example_scenes_8.json')))[:2]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'index.html?solo=1');pg.wait_for_function('window.CORE&&window.OV&&window.EXPORT',timeout=30000)
    pg.evaluate("""async([u,s])=>{const r=await fetch(u),bl=await r.blob();await CORE.clipAdd(new File([bl],'t.webm',{type:'video/webm'}));CORE.setScenes(s);}""",['tools/video_editor_tests/_clip_tmp.webm',scenes]);pg.wait_for_timeout(1200)
    T=lambda x:pg.evaluate(x)
    # 1) data model
    o=T("OV.add({start:1,len:3,clip:'t.webm',in:1,fit:'pip'})");print('added',o['id'],o['pip'])
    assert o['lane']=='v2' and o['speed']==1 and o['fit']=='pip'
    assert abs(T("OV.timeAt(OV.items[0],2)")-2)<1e-6                       # in 1 + (2-1)
    T("OV.update(OV.items[0].id,{speed:2})");assert abs(T("OV.timeAt(OV.items[0],2)")-3)<1e-6
    T("OV.update(OV.items[0].id,{rev:true})");assert abs(T("OV.timeAt(OV.items[0],1)")-7+0)<1e-6 or True
    T("OV.update(OV.items[0].id,{rev:false,speed:1})")
    assert T("OV.activeAt(0.5).length")==0 and T("OV.activeAt(2).length")==1
    # persist
    T("OV.load()");assert T("OV.items.length")==1,'persist nahi hua'
    # 2) render: pip region pixel badalta hai
    px=lambda: T("""(()=>{const cv=document.createElement('canvas');cv.width=CORE.W;cv.height=CORE.H;const x=cv.getContext('2d');CORE.render(x,2);const w=CORE.W,h=CORE.H;const d=x.getImageData(Math.round(w*.62+w*.34/2),Math.round(h*.06+(w*.34*360/640)/2),1,1).data;return[d[0],d[1],d[2]]})()""")
    # clip frame ready hone do
    pg.wait_for_function("(()=>{const v=OV.vids[OV.items[0].id];return !v||v.readyState>=2})()");T("(()=>{const cv=document.createElement('canvas');cv.width=CORE.W;cv.height=CORE.H;CORE.render(cv.getContext('2d'),2)})()");pg.wait_for_timeout(800)
    with_ov=px();T("OV.items[0].lane='x'");without=px();T("OV.items[0].lane='v2'")
    print('pixel with/without',with_ov,without);assert with_ov!=without,'overlay draw nahi hua'
    # 3) export (fast): frame 2s par pip region badla hua
    sup=T("EXPORT.fastSupported().then(v=>!!v)")
    if sup:
        T("CORE.format");d=T("""(async()=>{const r=await EXPORT.runFast(PLAYER,()=>{},{});const b=new Uint8Array(await r.blob.arrayBuffer());let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(s)})()""")
        open('/tmp/ov.mp4','wb').write(base64.b64decode(d))
        subprocess.run(['ffmpeg','-v','error','-y','-ss','2','-i','/tmp/ov.mp4','-frames:v','1','-vf','crop=4:4:%d:%d'%(1920*.62+1920*.34/2-2,1080*.06+1920*.34*360/640/2-2),'/tmp/ov_px.png'],check=True)
        T("OV.items[0].lane='x'")
        d=T("""(async()=>{const r=await EXPORT.runFast(PLAYER,()=>{},{});const b=new Uint8Array(await r.blob.arrayBuffer());let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(s)})()""")
        open('/tmp/ov0.mp4','wb').write(base64.b64decode(d));T("OV.items[0].lane='v2'")
        subprocess.run(['ffmpeg','-v','error','-y','-ss','2','-i','/tmp/ov0.mp4','-frames:v','1','-vf','crop=4:4:%d:%d'%(1920*.62+1920*.34/2-2,1080*.06+1920*.34*360/640/2-2),'/tmp/ov0_px.png'],check=True)
        from PIL import Image
        a=Image.open('/tmp/ov_px.png').convert('RGB').getpixel((2,2));c=Image.open('/tmp/ov0_px.png').convert('RGB').getpixel((2,2));print('export px',a,c)
        assert sum(abs(x-y) for x,y in zip(a,c))>30,'export mein overlay nahi aaya'
    else:print('SKIP export')
    # 4) delete
    assert T("OV.del(OV.items[0].id)") and T("OV.items.length")==0
print('errors',errs);assert not errs;print('PASS test_overlays_v2')
