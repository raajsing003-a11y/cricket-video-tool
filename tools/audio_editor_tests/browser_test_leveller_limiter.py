# run: python tools/audio_editor_tests/browser_test_leveller_limiter.py  (C212: Limiter + Leveller)
import os,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start();errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(f'http://127.0.0.1:{port}/tools/audio_editor.html');pg.wait_for_function('window.__ae',timeout=30000)
    # 2s dheema (0.03) + 2s tez (0.6) 300Hz-ish tone
    pg.evaluate('''(()=>{const sr=44100,n=sr*4,d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=(i<sr*2?0.03:0.6)*Math.sin(2*Math.PI*300*i/sr);__ae.load([d],sr,'lv');})()''')
    pg.wait_for_timeout(400)
    R='''(()=>{const d=__ae.st.buf.getChannelData(0),sr=__ae.st.buf.sampleRate;const rms=(a,b)=>{let s=0;for(let i=a*sr|0;i<b*sr;i++)s+=d[i]*d[i];return 20*Math.log10(Math.sqrt(s/((b-a)*sr))+1e-9)};let pk=0;for(let i=0;i<d.length;i++)pk=Math.max(pk,Math.abs(d[i]));return {q:rms(0.3,1.7),l:rms(3.0,3.9),pk:20*Math.log10(pk),dur:__ae.st.buf.duration}})()'''
    a=pg.evaluate(R);print('before',a)
    pg.fill('#lvt','-20');pg.click('#lvb');pg.wait_for_function('__ae.st.buf&&document.getElementById("lvb")&&true');pg.wait_for_timeout(1500)
    c=pg.evaluate(R);print('after leveller',c)
    gap0=a['l']-a['q'];gap1=c['l']-c['q'];print('gap',round(gap0,1),'->',round(gap1,1))
    assert gap1<gap0-8,'leveller gap kam nahi hua'
    assert c['pk']<=-0.9,'leveller ke baad peak -1dB se upar'
    assert abs(c['dur']-4)<0.01
    # limiter: -6 dB chhat
    pg.fill('#lmc','-6');pg.click('#lmb');pg.wait_for_timeout(1500)
    d2=pg.evaluate(R);print('after limiter',d2);assert d2['pk']<=-5.9,'limiter chhat tooti'
    print('errors',errs);assert not errs;print('LEVELLER/LIMITER OK')
