# run: python tools/video_editor_tests/test_studio.py  (playwright + chromium + ffprobe; http server khud chalata hai)
import os,sys,json,threading,http.server,socketserver,functools,subprocess,base64,tempfile
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/'
errs=[]
ex=json.load(open(os.path.join(root,'docs','example_scenes_8.json'),encoding='utf-8'))
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    # 1) index.html seedha kholo -> studio par redirect
    pg.goto(base+'index.html',wait_until='commit');pg.wait_for_timeout(1500);assert pg.url.split('?')[0].endswith('studio.html'),pg.url
    pg.wait_for_function('STUDIO.scenes().CORE&&STUDIO.editor().__ed',timeout=30000);pg.wait_for_timeout(1500)
    S=lambda s:pg.evaluate('(async()=>{const S=STUDIO.scenes();return '+s+'})()')
    E=lambda s:pg.evaluate('(async()=>{const E=STUDIO.editor();return '+s+'})()')
    # 2) scenes load
    S('(S.SE.scenes=%s,await S.SE.apply(true),S.CORE.total)'%json.dumps(ex))
    tot=S('S.CORE.total');print('scenes total',tot);assert tot>5
    # 3) bhejo
    pg.click('#send');pg.wait_for_timeout(1500)
    assert pg.evaluate('document.getElementById("fe").classList.contains("off")')==False
    n=E('E.__ed.clips.length');print('clips',n);assert n==1
    c=E('E.__ed.clips[0]');assert abs(c['len']-tot)<.05,c
    assert E('E.__ed.hasSc()')==True
    # 4) preview: frame sach mein scene se aaya (non-black)
    E('(E.__ed.setT(2.0),1)');pg.wait_for_timeout(600)
    px=E('(()=>{const cv=E.document.getElementById("cv"),d=cv.getContext("2d").getImageData(0,0,cv.width,cv.height).data;let s=0;for(let i=0;i<d.length;i+=40)s+=d[i]+d[i+1]+d[i+2];return s})()')
    print('preview pixel sum',px);assert px>200000
    # 5) scenes badlo -> refresh
    S('(S.SE.scenes.pop(),await S.SE.apply(true),1)');tot2=S('S.CORE.total');assert tot2<tot
    pg.click('#t_scenes');pg.click('#t_editor');pg.wait_for_timeout(800)
    c=E('E.__ed.clips[0]');print('after refresh len',c['len'],'scenes',tot2);assert abs(c['len']-tot2)<.05
    # 6) project save/load -> scenes media wapas jud jaye
    proj=E('E.__ed.projData()');assert any(m.get('sc') for m in proj['media'])
    E('(E.__ed.loadProject(%s),1)'%json.dumps(json.dumps(proj)));pg.wait_for_timeout(600)
    assert E('E.__ed.hasSc()')==True;print('project reload relink OK')
    # 7) export (360p, chhota) -> ffprobe
    E('(E.__ed.XF.rs=360,E.__ed.XF.fps=24,1)')
    # voice-over: scenes ki awaaz (EXPORT.audio) editor clip ke saath aani chahiye
    S('(()=>{const ac=new S.OfflineAudioContext(2,48000*3,48000),b=ac.createBuffer(2,48000*3,48000);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=.3*Math.sin(i*2*Math.PI*440/48000)}S.EXPORT.audio=b;return 1})()')
    E('E.__ed.pullScenes(false).then(r=>1)')
    # bumpers (intro 1s + outro 1s, laal frame, 880 Hz) stub
    S("(()=>{const ac=new S.OfflineAudioContext(2,48000,48000),b=ac.createBuffer(2,48000,48000);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=.3*Math.sin(i*2*Math.PI*880/48000)}S.__bp={pre:[{frames:30,buf:b,vol:1}],post:[{frames:30,buf:b,vol:1}]};S.BUMP.prepare=async()=>S.__bp;S.BUMP.drawFrame=async(ctx)=>{ctx.fillStyle='#f00';ctx.fillRect(0,0,S.CORE.W,S.CORE.H)};return 1})()")
    dur=E('E.__ed.pullScenes(false).then(r=>r.m.dur)');tm=S('S.CORE.total');print('with bumpers dur',dur,'main',tm);assert abs(dur-(tm+2))<.05
    assert abs(E('E.__ed.clips[0].len')-dur)<.05
    pg.evaluate('STUDIO.editor().__ed.clips[0].len=2.0')
    r=pg.evaluate('''STUDIO.editor().__ed.exportRun({fmt:"mp4",save:0,br:3e6}).then(async r=>({size:r.size,vc:r.vcodec,ac:r.acodec,fr:r.frames,b64:await new Promise(k=>{const f=new FileReader();f.onload=()=>k(f.result.split(",")[1]);f.readAsDataURL(r.blob)})}),e=>({err:e.message}))''')
    print('export',{k:v for k,v in r.items() if k!='b64'});assert 'err' not in r,r
    path=os.path.join(tempfile.gettempdir(),'studio_exp.mp4');open(path,'wb').write(base64.b64decode(r['b64']))
    j=json.loads(subprocess.run(['ffprobe','-v','error','-print_format','json','-show_streams','-show_format',path],capture_output=True,text=True).stdout)
    assert any(x['codec_type']=='audio' for x in j['streams']),'audio nahi aayi'
    d=float(j['format']['duration']);print('ffprobe dur',d);assert 1.8<d<2.3
    # frame non-black
    subprocess.run(['ffmpeg','-y','-v','error','-ss','1.6','-i',path,'-frames:v','1','/tmp/studio_f.png'])
    from PIL import Image
    im=Image.open('/tmp/studio_f.png').convert('RGB');ex_=im.getextrema();print('frame',im.size,ex_);assert max(x[1] for x in ex_)>60
    subprocess.run(['ffmpeg','-y','-v','error','-ss','0.5','-i',path,'-frames:v','1','/tmp/studio_f0.png']);i0=Image.open('/tmp/studio_f0.png').convert('RGB').resize((1,1)).getpixel((0,0));print('intro frame avg',i0);assert i0[0]>150 and i0[1]<60
    i1=Image.open('/tmp/studio_f.png').convert('RGB').resize((1,1)).getpixel((0,0));print('main frame avg',i1);assert not(i1[0]>150 and i1[1]<60)
    print('ERRORS',errs);assert not errs
    print('STUDIO OK')
srv.shutdown()
