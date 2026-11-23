# run: python tools/audio_editor_tests/browser_test_bass_vocal.py  (C213: Bass boost + Vocal remover)
import os,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start();errs=[]
# Goertzel level (dB) of a frequency in channel c
G='''(f,c,ch)=>{const d=__ae.st.buf.getChannelData(c||0),sr=__ae.st.buf.sampleRate,a=sr*0.5|0,b=d.length-a;let re=0,im=0;for(let i=a;i<b;i++){const w=2*Math.PI*f*i/sr;re+=d[i]*Math.cos(w);im+=d[i]*Math.sin(w);}return 20*Math.log10(2*Math.hypot(re,im)/(b-a)+1e-9)}'''
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(f'http://127.0.0.1:{port}/tools/audio_editor.html');pg.wait_for_function('window.__ae',timeout=30000)
    pg.evaluate('()=>{window.GL='+G+'}')
    # BASS: mono 80Hz + 2kHz, 0.1 each
    pg.evaluate('''(()=>{const sr=44100,n=sr*3,d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=0.1*Math.sin(2*Math.PI*80*i/sr)+0.1*Math.sin(2*Math.PI*2000*i/sr);__ae.load([d],sr,'bb');})()''')
    pg.wait_for_function('__ae.st.buf');pg.wait_for_timeout(500)
    b80=pg.evaluate('GL(80)');b2k=pg.evaluate('GL(2000)')
    pg.fill('#bbg','9');pg.click('#bbb');pg.wait_for_timeout(1500)
    a80=pg.evaluate('GL(80)');a2k=pg.evaluate('GL(2000)');print('bass 80Hz',round(b80,1),'->',round(a80,1),' 2k',round(b2k,1),'->',round(a2k,1))
    assert a80-b80>6.5 and abs(a2k-b2k)<1.5
    # VOCAL: L=R 1kHz (centre/vocal) + 60Hz centre bass + L=-R 3kHz (side)
    pg.evaluate('''(()=>{const sr=44100,n=sr*3,L=new Float32Array(n),R=new Float32Array(n);for(let i=0;i<n;i++){const v=0.2*Math.sin(2*Math.PI*1000*i/sr),k=0.2*Math.sin(2*Math.PI*60*i/sr),s=0.2*Math.sin(2*Math.PI*3000*i/sr);L[i]=v+k+s;R[i]=v+k-s;}__ae.load([L,R],sr,'vr');})()''')
    pg.wait_for_function('__ae.st.buf');pg.wait_for_timeout(500)
    v0=pg.evaluate('GL(1000)');s0=pg.evaluate('GL(3000)');k0=pg.evaluate('GL(60)')
    pg.click('#vrm');pg.wait_for_timeout(1500)
    v1=pg.evaluate('GL(1000)');s1=pg.evaluate('GL(3000)');k1=pg.evaluate('GL(60)')
    print('vocal1k',round(v0,1),'->',round(v1,1),' side3k',round(s0,1),'->',round(s1,1),' bass60',round(k0,1),'->',round(k1,1))
    assert v0-v1>30 and abs(s0-s1)<2 and abs(k0-k1)<3
    # mono par message
    pg.evaluate('''(()=>{const sr=44100,d=new Float32Array(sr);__ae.load([d],sr,'m');})()''');pg.wait_for_timeout(200);pg.click('#vrm');pg.wait_for_function('__ae.st.buf');pg.wait_for_timeout(500)
    print('errors',errs);assert not errs;print('BASS/VOCAL OK')
