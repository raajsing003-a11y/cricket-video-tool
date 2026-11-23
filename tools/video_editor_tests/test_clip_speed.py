# run: python tools/video_editor_tests/test_clip_speed.py  (playwright + chromium + ffmpeg; http server khud chalata hai)
# C217: Scenes clip speed / reverse / awaaz (UI + time mapping + dur + export audio mix)
import os,json,base64,subprocess,threading,http.server,socketserver
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
def rms(path):
    r=subprocess.run(['ffmpeg','-v','info','-i',path,'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True);o=r.stderr
    import re;m=re.search(r'mean_volume: (-?[\d.]+|-inf)',o);return float(m.group(1)) if m and m.group(1)!='-inf' else -99.0
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'index.html?solo=1');pg.wait_for_function('window.CORE&&window.EXPORT&&window.SE&&window.CLIPCTL',timeout=30000)
    pg.evaluate("""async u=>{const r=await fetch(u),bl=await r.blob();await CORE.clipAdd(new File([bl],'t.webm',{type:'video/webm'}));}""",'tools/video_editor_tests/_clip_tmp.webm')
    pg.evaluate("""async()=>{SE.scenes.length=0;SE.scenes.push({type:'clip',dur:4,tr:'cut',data:{clip:'t.webm',start:1,fit:'cover'}});await SE.apply(true);}""")
    pg.wait_for_timeout(800)
    t=lambda x:pg.evaluate(x)
    # 1) time mapping: normal / 2x / reverse
    assert abs(t("CORE.clipAt(CORE.scenes[0],1).time")-2)<1e-6
    pg.evaluate("CLIPCTL.setSpeed(CORE.scenes[0],2)")  # span 4 -> dur 2
    assert abs(t("CORE.scenes[0].dur")-2)<1e-6,t("CORE.scenes[0].dur")
    assert abs(t("CORE.clipAt(CORE.scenes[0],1).time")-3)<1e-6   # 1 + 1*2
    pg.evaluate("CORE.scenes[0].data.rev=true")
    assert abs(t("CORE.clipAt(CORE.scenes[0],0).time")-5)<1e-6    # start+span=1+4
    assert abs(t("CORE.clipAt(CORE.scenes[0],1).time")-3)<1e-6    # 5-2
    pg.evaluate("CLIPCTL.setSpeed(CORE.scenes[0],1)");assert abs(t("CORE.scenes[0].dur")-4)<1e-6
    pg.evaluate("delete CORE.scenes[0].data.rev;delete CORE.scenes[0].data.speed")
    print('time mapping + dur ok')
    # 2) UI panel
    pg.evaluate("async()=>{SE.sel=0;await SE.apply(true);}");pg.wait_for_timeout(300)
    ui=pg.evaluate("!!document.getElementById('cc_sp')&&!!document.getElementById('cc_rv')&&!!document.getElementById('cc_vol')")
    if not ui:
        pg.evaluate("document.querySelector('#wrap details')&&(document.querySelector('#wrap details').open=true)");pg.wait_for_timeout(300)
        ui=pg.evaluate("!!document.getElementById('cc_sp')")
    print('ui',ui);assert ui
    pg.evaluate("(()=>{const e=document.getElementById('cc_sp');e.value='2';e.dispatchEvent(new Event('change'))})()")
    pg.wait_for_timeout(500)
    assert abs(t("CORE.scenes[0].dur")-2)<1e-6 and t("CORE.scenes[0].data.speed")==2
    pg.evaluate("(()=>{const e=document.getElementById('cc_vol');e.value='100';e.dispatchEvent(new Event('change'))})()");pg.wait_for_timeout(500)
    assert t("CORE.scenes[0].data.vol")==1
    # 3) export: vol 100 -> awaaz, vol 0 -> chup
    sup=t("EXPORT.fastSupported().then(v=>!!v)")
    if not sup:print('SKIP export: WebCodecs nahi')
    else:
        def exp(name):
            d=t("""(async()=>{const r=await EXPORT.runFast(PLAYER,()=>{},{});const b=new Uint8Array(await r.blob.arrayBuffer());let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(s)})()""")
            open(name,'wb').write(base64.b64decode(d));return rms(name)
        pg.evaluate("CORE.scenes[0].data.speed=1;CORE.scenes[0].dur=4")  # normal speed pehle
        pg.evaluate("async()=>{await SE.apply(true);}");pg.wait_for_timeout(500)
        a=exp('/tmp/c_vol1.mp4');print('vol100 mean dB',a)
        pg.evaluate("CORE.scenes[0].data.vol=0;async()=>0");
        c=exp('/tmp/c_vol0.mp4');print('vol0 mean dB',c)
        assert a>-40 and c<-60 or (c==-99.0),(a,c)
        pg.evaluate("CORE.scenes[0].data.vol=2")
        a2=exp('/tmp/c_vol2.mp4');print('vol200 mean dB',a2);assert a2>a+3,(a,a2)
        pg.evaluate("CORE.scenes[0].data.vol=1;CORE.scenes[0].data.rev=true")
        r=exp('/tmp/c_rev.mp4');print('rev vol100 mean dB',r);assert r>-40
print('errors',errs);assert not errs
print('PASS test_clip_speed')
