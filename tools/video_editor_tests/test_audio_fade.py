# run: python tools/video_editor_tests/test_audio_fade.py  (playwright + chromium; http server khud chalata hai)
# C218: voice-over segment fade in/out + music fade in (Scenes Audio tracks panel)
import os,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/';errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'index.html?solo=1');pg.wait_for_function('window.AT&&window.MUSIC&&window.EXPORT',timeout=30000)
    T=lambda s:pg.evaluate(s)
    T("""(()=>{const ac=EXPORT.actx||(EXPORT.actx=new AudioContext()),sr=ac.sampleRate,b=ac.createBuffer(2,sr*4,sr);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=.5;}AT.add('dc',b,0);})()""")
    amp="(t=>{const d=EXPORT.audio.getChannelData(0),sr=EXPORT.audio.sampleRate;return d[Math.floor(t*sr)]})"
    a=lambda t:pg.evaluate(amp+f"({t})")
    print('no fade',a(.1),a(2),a(3.9));assert abs(a(.1)-.5)<1e-6 and abs(a(3.9)-.5)<1e-6
    T("AT.setFade(0,1,1)")
    f=[a(0.0),a(.5),a(2),a(3.5),a(3.99)];print('fade 1s',f)
    assert f[0]<.01 and abs(f[1]-.25)<.01 and abs(f[2]-.5)<1e-6 and abs(f[3]-.25)<.01 and f[4]<.02
    # UI: panel kholo, inputs
    T("(()=>{[...document.querySelectorAll('#bar2 button')].find(b=>b.textContent.includes('Audio tracks')).click()})()")
    n=T("document.querySelectorAll('.atfade').length");print('fade inputs',n);assert n==2
    T("(()=>{const e=document.querySelector('.atfade[data-k=fadeIn]');e.value='2';e.dispatchEvent(new Event('change'))})()")
    assert T("AT.segs[0].fadeIn")==2 and abs(a(1)-.25)<.01
    # music fade in
    T("""(()=>{const ac=EXPORT.actx,sr=ac.sampleRate,b=ac.createBuffer(2,sr*6,sr);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=.5;}AT.segs=[];AT.setMusic('m',b);AT.music.vol=0;AT.music.duck=0;AT.music.fadeOut=0;AT.music.fadeIn=2;AT.rebuild();})()""")
    m=[a(.5),a(1),a(3)];print('music fadein 2s',m)
    assert abs(m[0]-m[2]*.25)<.01*max(1,m[2]) and abs(m[1]-m[2]*.5)<.02 and m[2]>.1
print('errors',errs);assert not errs
print('PASS test_audio_fade')
