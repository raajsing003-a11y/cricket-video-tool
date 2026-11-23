# run: python tools/video_editor_tests/test_overlays_audio.py  (C223: overlay clip ki awaaz export mix mein)
import os,json,subprocess,base64,threading,http.server,socketserver,re
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
def mean_db(path,ss=None,t=None):
    a=['ffmpeg','-hide_banner','-nostats']
    if ss is not None:a+=['-ss',str(ss)]
    if t is not None:a+=['-t',str(t)]
    r=subprocess.run(a+['-i',path,'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
    m=re.search(r'mean_volume: (-?[\d.]+) dB',r);return float(m.group(1)) if m else None
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'index.html?solo=1');pg.wait_for_function('window.CORE&&window.OV&&window.EXPORT',timeout=30000)
    pg.evaluate("""async([u,s])=>{const r=await fetch(u),bl=await r.blob();await CORE.clipAdd(new File([bl],'t.webm',{type:'video/webm'}));CORE.setScenes(s);}""",['tools/video_editor_tests/_clip_tmp.webm',scenes]);pg.wait_for_timeout(1200)
    T=lambda x:pg.evaluate(x)
    tot=T("CORE.total");print('total',tot)
    assert T("OV.mixNeeded()")==False
    T("OV.add({start:0,len:3,clip:'t.webm',in:0,fit:'pip',vol:0})");assert T("OV.mixNeeded()")==False,'vol 0 par mix nahi chahiye'
    sup=T("EXPORT.fastSupported().then(v=>!!v)")
    if not sup:print('SKIP export (fast unsupported)')
    else:
        def run(tag,patch):
            T("OV.update(OV.items[0].id,%s)"%json.dumps(patch))
            d=T("""(async()=>{const r=await EXPORT.runFast(PLAYER,()=>{},{});const b=new Uint8Array(await r.blob.arrayBuffer());let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(s)})()""")
            f='/tmp/ova_%s.mp4'%tag;open(f,'wb').write(base64.b64decode(d));return f
        f0=run('v0',{'vol':0});f1=run('v1',{'vol':1});f2=run('v2',{'vol':2});fr=run('rev',{'vol':1,'rev':True,'in':1})
        d0,d1,d2,dr=[mean_db(f,0,2.5) for f in (f0,f1,f2,fr)];print('mean dB (0-2.5s) vol0/1/2/rev',d0,d1,d2,dr)
        assert d0 is None or d0<-60,'vol0 par awaaz nahi honi chahiye'
        assert d1 is not None and d1>-40,'vol1 par awaaz honi chahiye'
        assert 4.5<d2-d1<7.5,'vol2 = ~+6 dB'
        assert dr is not None and dr>-40,'reverse awaaz honi chahiye'
        # clip 3s par khatam: 3.2s ke baad chup
        late=mean_db(f1,3.4,0.6);print('late',late);assert late is None or late<-60,'overlay ke baad awaaz nahi'
        # fade in 2s: shuru ka 0.5s dheema, baad ka zyada
        f=run('fade',{'vol':1,'rev':False,'in':0,'fadeIn':2});e,l=mean_db(f,0,.5),mean_db(f,1.5,.5);print('fade early/late',e,l);assert l-e>6,'fadeIn kaam nahi kiya'
    T("OV.del(OV.items[0].id)")
print('errors',errs);assert not errs;print('PASS test_overlays_audio')
