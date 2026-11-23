# run: python tools/video_editor_tests/test_export_settings.py  (playwright + chromium; http server khud chalata hai)
# C216: Quality/Size dropdown + MB andaza label + asli fast export size
import os,json,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/';errs=[]
scenes=json.load(open(os.path.join(root,'docs','example_scenes_8.json')))[:2]
def sel(pg,i,v):pg.evaluate('([i,v])=>{const e=document.getElementById(i);e.value=v;e.dispatchEvent(new Event("change"))}',[i,v])
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'index.html?solo=1');pg.wait_for_function('window.CORE&&window.EXPORT&&window.EXPORT.settings&&document.getElementById("xs_q")',timeout=30000)
    pg.evaluate('async s=>{CORE.setScenes(s);await CORE.loadFont&&0;}',scenes);pg.wait_for_timeout(1500)
    T=pg.evaluate('CORE.total');print('total',T)
    # default = Badhiya 12 Mbps, 1080p
    assert pg.evaluate('EXPORT.vbr()')==12e6 and abs(pg.evaluate('EXPORT.outScale()')-1)<1e-9
    for q,v in(('low',4e6),('mid',8e6),('high',12e6)):
        sel(pg,'xs_q',q);e=pg.evaluate('EXPORT.estimate()')
        exp=(v+0)*T*1.03/8/1e6  # audio nahi judi
        print(q,round(e['mb'],2),round(exp,2));assert pg.evaluate('EXPORT.vbr()')==v and abs(e['mb']-exp)<.05
    lbl=pg.evaluate('document.getElementById("xs_mb").textContent');print(lbl);assert 'MB' in lbl
    sel(pg,'xs_r','720');assert abs(pg.evaluate('EXPORT.outScale()')-720/1080)<1e-6
    # asli export: low + 720p -> size andaze ke paas, aur 12 Mbps se chhota
    sup=pg.evaluate('EXPORT.fastSupported().then(v=>!!v)')
    if not sup:print('SKIP real export: WebCodecs H.264 nahi (headless chromium)')
    else:
        sel(pg,'xs_q','low')
        r=pg.evaluate('(async()=>{const r=await EXPORT.runFast(PLAYER,()=>{},{});return{n:r.blob.size,mb:r.blob.size/1e6,d:r.total}})()')
        est=pg.evaluate('EXPORT.estimate().mb');print('real',r,'est',est)
        assert r['mb']<est*1.5+0.3,'real size andaze se bahut zyada'
print('errors',errs);assert not errs
print('PASS test_export_settings')
