# run: python tools/audio_editor_tests/browser_test_presets.py  (C219: Audio Editor Presets — save/load/chain/export/import)
import os,json,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start();errs=[]
G='''(f)=>{const d=__ae.st.buf.getChannelData(0),sr=__ae.st.buf.sampleRate,a=sr*0.5|0,b=d.length-a;let re=0,im=0;for(let i=a;i<b;i++){const w=2*Math.PI*f*i/sr;re+=d[i]*Math.cos(w);im+=d[i]*Math.sin(w);}return 20*Math.log10(2*Math.hypot(re,im)/(b-a)+1e-12)}'''
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.on('dialog',lambda d:d.accept('Mera bass'))
    url=f'http://127.0.0.1:{port}/tools/audio_editor.html'
    pg.goto(url);pg.wait_for_function('window.__ae&&window.AEPRESET',timeout=30000)
    pg.evaluate('()=>{window.GL='+G+'}')
    assert 'Video voice-over (saaf)' in pg.evaluate('AEPRESET.list()')
    # settings + chain save (UI)
    pg.fill('#bbg','9');pg.fill('#bbf','100');pg.fill('#cth','-30')
    pg.evaluate("document.getElementById('prc_bbb').checked=true")
    pg.click('#prv');pg.wait_for_timeout(200)
    assert 'Mera bass' in pg.evaluate('AEPRESET.list()'),'save nahi hua'
    assert pg.evaluate("AEPRESET.get('Mera bass').chain")==['bbb']
    # settings badlo, phir Load
    pg.fill('#bbg','0');pg.fill('#cth','-10');pg.evaluate("document.getElementById('prc_bbb').checked=false")
    pg.select_option('#prs','Mera bass');pg.click('#prl')
    v=pg.evaluate("[document.getElementById('bbg').value,document.getElementById('bbf').value,document.getElementById('cth').value,document.getElementById('prc_bbb').checked]");print('loaded',v)
    assert v==['9','100','-30',True]
    # chain chalao: 80Hz + 2kHz tone par bass boost
    pg.evaluate('''(()=>{const sr=44100,n=sr*3,d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=0.1*Math.sin(2*Math.PI*80*i/sr)+0.1*Math.sin(2*Math.PI*2000*i/sr);__ae.load([d],sr,'pt');})()''')
    pg.wait_for_function('__ae.st.buf');pg.wait_for_timeout(500)
    b80=pg.evaluate('GL(80)');b2k=pg.evaluate('GL(2000)')
    pg.click('#pra');pg.wait_for_timeout(2500)
    a80=pg.evaluate('GL(80)');a2k=pg.evaluate('GL(2000)');print('chain 80Hz',round(b80,1),'->',round(a80,1),' 2k',round(b2k,1),'->',round(a2k,1))
    assert a80-b80>6 and abs(a2k-b2k)<1.5
    # builtin hat nahi sakta
    assert pg.evaluate("AEPRESET.del('Video voice-over (saaf)')")==False
    # reload par persist
    pg.reload();pg.wait_for_function('window.AEPRESET');assert 'Mera bass' in pg.evaluate('AEPRESET.list()');print('persist ok')
    # export / import roundtrip
    with pg.expect_download() as dl:pg.click('#pre')
    path=dl.value.path();j=json.load(open(path));print('export keys',list(j['presets']));assert 'Mera bass' in j['presets'] and 'Video voice-over (saaf)' not in j['presets']
    pg.evaluate("AEPRESET.del('Mera bass')");assert 'Mera bass' not in pg.evaluate('AEPRESET.list()')
    pg.set_input_files('#prf',path);pg.wait_for_timeout(300)
    assert 'Mera bass' in pg.evaluate('AEPRESET.list()');print('import ok')
print('errors',errs);assert not errs;print('PRESETS OK')
