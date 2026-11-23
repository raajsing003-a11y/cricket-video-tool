# run: python tools/video_editor_tests/test_studio_vo.py  (playwright + chromium; http server khud chalata hai)
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
    # scenes mein 3s voice-over (440Hz) jodo
    S('(()=>{const ac=S.EXPORT.actx||(S.EXPORT.actx=new AudioContext()),sr=ac.sampleRate,b=ac.createBuffer(2,sr*3,sr);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=.8*Math.sin(2*Math.PI*440*i/sr)}S.AT.add("vo test",b,0);return 0})()')
    assert S('S.AT.segs.length')==1 and S('!!S.EXPORT.audio')
    assert S('!!S.document.getElementById("atae")'),'Studio mein enhance button hona chahiye'
    peak0=S('(()=>{const d=S.EXPORT.audio.getChannelData(0);let m=0;for(let i=0;i<d.length;i+=50)m=Math.max(m,Math.abs(d[i]));return m})()');print('peak before',peak0)
    S('(S.document.getElementById("atae").click(),0)')
    pg.wait_for_function('STUDIO.audio().__ae&&STUDIO.audio().__ae.st.buf',timeout=15000)
    assert pg.evaluate('document.getElementById("fa").classList.contains("off")')==False
    d=pg.evaluate('STUDIO.audio().__ae.st.buf.duration');print('audio dur',d);assert abs(d-3)<.05
    lbl=pg.evaluate('STUDIO.audio().document.getElementById("tov").textContent');print(lbl);assert 'Scenes' in lbl
    pg.evaluate('(()=>{const b=STUDIO.audio().__ae.st.buf;for(let c=0;c<b.numberOfChannels;c++){const a=b.getChannelData(c);for(let i=0;i<a.length;i++)a[i]*=.5}})()')
    pg.frame_locator('#fa').locator('#tov').click()
    pg.wait_for_function('STUDIO.scenes().AT.segs.length==1&&/✨/.test(STUDIO.scenes().AT.segs[0].name)',timeout=15000)
    assert pg.evaluate('document.getElementById("fs").classList.contains("off")')==False
    peak1=S('(()=>{const d=S.EXPORT.audio.getChannelData(0);let m=0;for(let i=0;i<d.length;i+=50)m=Math.max(m,Math.abs(d[i]));return m})()');print('peak after',peak1)
    assert abs(peak1-peak0*.5)<.05,(peak0,peak1)
    assert abs(S('S.EXPORT.audio.duration')-3)<.05
    assert S('S.document.getElementById("atrs").style.display')!='none'
    S('(S.AT.restorePrev(),0)');assert S('S.AT.segs[0].name')=='vo test' and S('S.document.getElementById("atrs").style.display')=='none'
    peak2=S('(()=>{const d=S.EXPORT.audio.getChannelData(0);let m=0;for(let i=0;i<d.length;i+=50)m=Math.max(m,Math.abs(d[i]));return m})()');assert abs(peak2-peak0)<.01
    b.close()
print('errors',errs);assert not errs;print('VO HANDOFF OK')
