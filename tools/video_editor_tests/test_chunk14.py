# Chunk 14: WebM seek index (Cues) + 1080p export
import os,subprocess,json,base64
from playwright.sync_api import sync_playwright
V='/tmp/test_v.webm'
if not os.path.exists(V):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','testsrc=duration=4:size=640x360:rate=30','-f','lavfi','-i','sine=frequency=440:duration=4','-c:v','libvpx','-c:a','libvorbis','-shortest',V],check=True)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'));errs=[]
def probe(p):
    o=subprocess.run(['ffprobe','-v','error','-print_format','json','-show_streams','-show_format',p],capture_output=True,text=True);return json.loads(o.stdout)
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[V]);pg.wait_for_function('__ed.media.size==1',timeout=15000)
    E('(()=>{const v=[...__ed.media.values()][0];__ed.addMedia(v,3,0);__ed.addMedia(v,3,2.5)})()')
    def run(opts):
        return E('__ed.exportRun(%s).then(async r=>({w:r.w,h:r.h,ac:r.acodec,b64:await new Promise(k=>{const fr=new FileReader();fr.onload=()=>k(fr.result.split(",")[1]);fr.readAsDataURL(r.blob)})}),e=>({err:e.message}))'%opts)
    # WebM with Cues
    r=run('{fmt:"webm",save:0,rs:360,fps:30}');assert 'err' not in r,r
    raw=base64.b64decode(r['b64']);open('/tmp/c14.webm','wb').write(raw)
    ci=raw.find(bytes([0x1C,0x53,0xBB,0x6B])),;ci=ci[0];cl=raw.find(bytes([0x1F,0x43,0xB6,0x75]));print('Cues at',ci,'first cluster at',cl);assert 0<ci<cl
    j=probe('/tmp/c14.webm');assert float(j['format']['duration'])>6
    # ffmpeg seek decode
    o=subprocess.run(['ffmpeg','-v','error','-ss','4.5','-i','/tmp/c14.webm','-frames:v','1','-f','null','-'],capture_output=True,text=True);assert o.returncode==0 and not o.stderr.strip(),o.stderr
    # Chrome seek
    pg.evaluate("window.__u=URL.createObjectURL(new Blob([Uint8Array.from(atob('%s'),c=>c.charCodeAt(0))],{type:'video/webm'}))"%r['b64'])
    res=E("""new Promise(r=>{const v=document.createElement('video');v.src=window.__u;v.onloadedmetadata=()=>{v.onseeked=()=>r({t:v.currentTime,d:v.duration,w:v.videoWidth});v.currentTime=4.5};v.onerror=()=>r({err:1})})""");print('chrome seek',res);assert 'err' not in res and abs(res['t']-4.5)<.1 and res['d']>6
    # 1080p
    r=run('{fmt:"webm",save:0,rs:1080,fps:24}');print('1080',{k:v for k,v in r.items() if k!='b64'});assert 'err' not in r and r['w']==1920 and r['h']==1080
    open('/tmp/c14b.webm','wb').write(base64.b64decode(r['b64']));v=[s for s in probe('/tmp/c14b.webm')['streams'] if s['codec_type']=='video'][0];assert v['width']==1920 and v['height']==1080
    pg.click('#exb');pg.click('#x_r button[data-v="1080"]');t=pg.inner_text('#x_i');print(t);assert '1920×1080' in t
    b.close()
print('errors:',errs);assert not errs,errs
print('CHUNK 14 OK')
