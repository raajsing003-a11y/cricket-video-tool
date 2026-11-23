# run: python tools/audio_editor_tests/browser_test_export_sr_aac.py  (C214: sample-rate export + AAC/M4A)
# NOTE: sandbox Chromium mein asli AAC encoder nahi hota -> yahan nakli AudioEncoder (fake frames) se sirf M4A container test hota hai.
import os,threading,http.server,socketserver,struct,subprocess,json
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start();errs=[]
FAKE='''(()=>{window.AudioEncoder=class{constructor(o){this.o=o;this.encodeQueueSize=0}static async isConfigSupported(c){return{supported:c.codec==='mp4a.40.2',config:c}}
configure(c){this.c=c}encode(ad){const n=Math.ceil(ad.numberOfFrames/1024);for(let i=0;i<n;i++){const u=new Uint8Array(60+(i%7));for(let k=0;k<u.length;k++)u[k]=(k*31+i)&255;this.o.output({byteLength:u.length,copyTo:d=>d.set(u)})}}
async flush(){}close(){}}})()'''
def load(pg,n=44100*3,sr=44100,ch=1):
    pg.evaluate('''([n,sr,ch])=>{const a=[];for(let c=0;c<ch;c++){const d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=0.3*Math.sin(2*Math.PI*440*i/sr);a.push(d);}__ae.load(a,sr,'ex');}''',[n,sr,ch]);pg.wait_for_function('__ae.st.buf');pg.wait_for_timeout(400)
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(accept_downloads=True);pg=ctx.new_page();pg.set_viewport_size({'width':1400,'height':900})
    pg.add_init_script(FAKE)
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(f'http://127.0.0.1:{port}/tools/audio_editor.html');pg.wait_for_function('window.__ae',timeout=30000)
    # 1) sample-rate: WAV 16k
    load(pg,sr=44100)
    pg.select_option('#fmt','w16');pg.select_option('#exsr','16000')
    with pg.expect_download(timeout=20000) as d:pg.click('#exp')
    f=d.value.path();h=open(f,'rb').read(44);sr=struct.unpack('<I',h[24:28])[0];dl=os.path.getsize(f)
    print('wav sr',sr,'bytes',dl);assert sr==16000 and abs(dl-(16000*3*2+44))<400
    # 2) AAC M4A (fake frames), stereo 44.1k
    load(pg,sr=44100,ch=2);pg.select_option('#exsr','0');pg.select_option('#fmt','a128')
    with pg.expect_download(timeout=20000) as d:pg.click('#exp')
    f=d.value.path();name=d.value.suggested_filename;print(name)
    assert name.endswith('.m4a')
    r=subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',f],capture_output=True,text=True);print(r.stderr[:300])
    j=json.loads(r.stdout);s0=j['streams'][0];print(s0['codec_name'],s0['sample_rate'],s0['channels'],j['format']['duration'])
    assert s0['codec_name']=='aac' and s0['sample_rate']=='44100' and s0['channels']==2 and abs(float(j['format']['duration'])-3.0)<0.1
    # 3) AAC + 22050 sr (AAC list mein) mono
    load(pg,sr=44100,ch=1);pg.select_option('#exsr','22050')
    with pg.expect_download(timeout=20000) as d:pg.click('#exp')
    j=json.loads(subprocess.run(['ffprobe','-v','error','-show_streams','-of','json',d.value.path()],capture_output=True,text=True).stdout);s0=j['streams'][0]
    print(s0['sample_rate'],s0['channels']);assert s0['sample_rate']=='22050' and s0['channels']==1
    print('errors',errs);assert not errs;print('EXPORT SR/AAC OK')
