# run: python tools/video_editor_tests/test_studio_overlay.py  (C220: Scenes -> Audio Editor overlay, tab badle bina)
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
    pg.goto(base+'studio.html');pg.wait_for_function('STUDIO.scenes().CORE&&STUDIO.scenes().AT&&STUDIO.editor().__ed',timeout=30000)
    S=lambda s:pg.evaluate('(async()=>{const S=STUDIO.scenes();return '+s+'})()')
    cls=lambda i:pg.evaluate(f'document.getElementById("{i}").className')
    S('(()=>{const ac=S.EXPORT.actx||(S.EXPORT.actx=new AudioContext()),sr=ac.sampleRate,b=ac.createBuffer(2,sr*3,sr);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=.8*Math.sin(2*Math.PI*440*i/sr)}S.AT.add("vo",b,0);return 0})()')
    S('(S.document.getElementById("atae").click(),0)')
    pg.wait_for_function('STUDIO.audio().__ae&&STUDIO.audio().__ae.st.buf',timeout=15000)
    print('fa',cls('fa'),'fs',cls('fs'),'tab',pg.evaluate('document.getElementById("t_scenes").className'))
    assert 'ov' in cls('fa') and 'off' not in cls('fa'),'overlay nahi khula'
    assert 'off' not in cls('fs') and 'on' in pg.evaluate('document.getElementById("t_scenes").className'),'Scenes tab badal gaya'
    assert pg.evaluate('getComputedStyle(document.getElementById("ovx")).display')=='block'
    # close (✕) -> overlay band, Scenes wahi
    pg.click('#ovx');assert 'ov' not in cls('fa') and 'off' in cls('fa') and 'off' not in cls('fs')
    # dobara kholo, gain .5, wapas bhejo
    S('(S.document.getElementById("atae").click(),0)')
    pg.wait_for_function('STUDIO.audio().__ae.st.buf&&document.getElementById("fa").classList.contains("ov")',timeout=15000)
    pg.evaluate('(()=>{const b=STUDIO.audio().__ae.st.buf;for(let c=0;c<b.numberOfChannels;c++){const a=b.getChannelData(c);for(let i=0;i<a.length;i++)a[i]*=.5}})()')
    pg.frame_locator('#fa').locator('#tov').click()
    pg.wait_for_function('STUDIO.scenes().AT.segs.length==1&&/✨/.test(STUDIO.scenes().AT.segs[0].name)',timeout=15000)
    pk=S('(()=>{const d=S.EXPORT.audio.getChannelData(0);let m=0;for(let i=0;i<d.length;i+=50)m=Math.max(m,Math.abs(d[i]));return m})()');print('peak after',pk)
    assert abs(pk-.4)<.05
    assert 'ov' not in cls('fa') and 'off' in cls('fa') and 'off' not in cls('fs'),'wapas aane par overlay band hona chahiye'
    # normal 🎛 Audio tab ab bhi poori screen
    pg.click('#t_audio');assert 'off' not in cls('fa') and 'ov' not in cls('fa')
print('errors',errs);assert not errs;print('PASS test_studio_overlay')
