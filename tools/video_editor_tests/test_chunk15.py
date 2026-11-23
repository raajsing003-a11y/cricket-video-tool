# Chunk 15: asli 1080p render, 9:16/1:1/4:5 canvas + Fill, music auto-duck, templates
import os,subprocess,json,base64
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
V,A,I='/tmp/test_v.webm','/tmp/test_a.ogg','/tmp/test_i.png'
if not os.path.exists(V):subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','testsrc=duration=4:size=640x360:rate=30','-c:v','libvpx',V],check=True)
if not os.path.exists(A):subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=440:duration=4','-c:a','libvorbis',A],check=True)
if not os.path.exists(I):Image.new('RGB',(400,300),(200,60,60)).save(I)
ST='/tmp/test_stripes.png'  # 1920x1080, 2px vertical stripes (asli 1080 detail test)
im=Image.new('RGB',(1920,1080),(0,0,0));d=ImageDraw.Draw(im)
for x in range(0,1920,4):d.rectangle([x,0,x+1,1079],fill=(255,255,255))
im.save(ST)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'));errs=[]
def probe(p):
    o=subprocess.run(['ffprobe','-v','error','-print_format','json','-show_streams','-show_format',p],capture_output=True,text=True);return json.loads(o.stdout)
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    def run(opts):
        return E('__ed.exportRun(%s).then(async r=>({w:r.w,h:r.h,b64:await new Promise(k=>{const fr=new FileReader();fr.onload=()=>k(fr.result.split(",")[1]);fr.readAsDataURL(r.blob)})}),e=>({err:e.message}))'%opts)
    # --- aspect
    pg.select_option('#asp','9:16');assert E('[__ed.CW,__ed.CH,document.getElementById("cv").width,document.getElementById("cv").height]')==[720,1280,720,1280]
    vb=E('(()=>{const r=document.getElementById("view").getBoundingClientRect();return r.width/r.height})()');print('view ratio',vb);assert abs(vb-9/16)<.02
    pg.set_input_files('#file',[V,I,ST]);pg.wait_for_function('__ed.media.size==3',timeout=15000)
    ms=E('[...__ed.media.values()].map(m=>[m.id,m.kind,m.w,m.h])');mi=[m for m in ms if m[1]=='i' and m[2]==400][0][0];mv=[m for m in ms if m[1]=='v'][0][0];ms_=[m for m in ms if m[2]==1920][0][0]
    E('__ed.addMedia(__ed.media.get(%d),1,0)'%mi);pg.wait_for_timeout(400)
    c=E('__ed.clips[0]');print('auto fill',c.get('fl'));assert c.get('fl')==1
    px=lambda x,y:E('Array.from(document.getElementById("cv").getContext("2d").getImageData(%d,%d,1,1).data)'%(x,y))
    pg.wait_for_timeout(300);a=px(10,10);print('fill corner',a);assert a[0]>150 and a[1]<100  # kinara bhi laal (bar nahi)
    E('(()=>{__ed.sel=__ed.clips[0].id})()');pg.click('#k_fl');pg.wait_for_timeout(300);a=px(10,10);print('fit corner',a);assert a[0]<20 and a[1]<20
    # --- 9:16 export 1080 -> 1080x1920
    E('__ed.clips.length=0;__ed.addMedia(__ed.media.get(%d),1,0)'%mv);pg.wait_for_timeout(300)
    r=run('{fmt:"webm",save:0,rs:1080,fps:24}');print('9:16',r.get('w'),r.get('h'),r.get('err'));assert 'err' not in r and (r['w'],r['h'])==(1080,1920)
    assert E('[__ed.RS,document.getElementById("cv").width]')==[1,720]
    open('/tmp/c15v.webm','wb').write(base64.b64decode(r['b64']));v=[s for s in probe('/tmp/c15v.webm')['streams'] if s['codec_type']=='video'][0];assert (v['width'],v['height'])==(1080,1920)
    # --- 4:5 and 1:1 sizes
    pg.select_option('#asp','4:5');assert E('[__ed.CW,__ed.CH]')==[720,900]
    r=run('{fmt:"webm",save:0,rs:480,fps:24}');print('4:5',r.get('w'),r.get('h'));assert (r['w'],r['h'])==(480,600)
    pg.select_option('#asp','1:1');r=run('{fmt:"webm",save:0,rs:360,fps:24}');assert (r['w'],r['h'])==(360,360)
    # --- asli 1080p detail (stripes): native render ho to 2px stripes bachi rehti hain
    pg.select_option('#asp','16:9');E('__ed.clips.length=0;__ed.addMedia(__ed.media.get(%d),1,0)'%ms_);pg.wait_for_timeout(300)
    r=run('{fmt:"webm",save:0,rs:1080,fps:24,br:10000000}');assert 'err' not in r and (r['w'],r['h'])==(1920,1080),r.get('err')
    open('/tmp/c15s.webm','wb').write(base64.b64decode(r['b64']))
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss','1','-i','/tmp/c15s.webm','-frames:v','1','/tmp/c15s.png'],check=True)
    g=Image.open('/tmp/c15s.png').convert('L');row=[g.getpixel((x,540)) for x in range(400,1400)];mn,mx=min(row),max(row);print('stripe contrast',mn,mx);assert mx-mn>120,'1080p detail nahi (upscale jaisa)'
    # 720p wala same stripes ko blur karta hai (720 canvas -> 2px stripe 1.33px) - sirf dikhane ke liye
    # --- duck
    E('__ed.clips.length=0;__ed.tracks.push({id:90,type:"a",name:"Voice",mute:false});__ed.render()')
    E('__ed.addMedia([...__ed.media.values()].find(m=>m.kind=="v"),3,0)')  # placeholder video (dusra track par), baad mein hata denge
    E('__ed.clips.length=0')
    pg.set_input_files('#file',[A]);pg.wait_for_function('__ed.media.size==4',timeout=15000)
    ma=E('[...__ed.media.values()].find(m=>m.kind=="a").id')
    music=E('(()=>{const c=__ed.addMedia(__ed.media.get(%d),null,0);c.len=4;return c.id})()'%ma);mtr=E('__ed.clips.find(c=>c.id==%d).tr'%music)
    E('(()=>{const c=__ed.addMedia(__ed.media.get(%d),90,2);c.len=1})()'%ma)
    E('__ed.render()')
    g0=E('__ed.gainOf(__ed.clips.find(c=>c.id==%d),3)'%music);assert abs(g0-1)<1e-6  # duck off
    E('__ed.sel=%d'%music);pg.wait_for_timeout(200)
    assert pg.locator('#a_dk').is_visible()
    pg.evaluate("(()=>{const e=document.getElementById('a_dk');e.value=80;e.dispatchEvent(new Event('input',{bubbles:true}))})()")
    G=lambda T:E('__ed.gainOf(__ed.clips.find(c=>c.id==%d),%f)'%(music,T))
    print('duck gains',[round(G(x),3) for x in (.5,1.9,2.5,3.3,3.8)])
    assert abs(G(.5)-1)<.01 and abs(G(2.5)-.2)<.01 and .4<G(1.9)<.6 and .5<G(3.3)<.7 and abs(G(3.9)-1)<.05
    assert E('__ed.tracks.find(t=>t.id==90).duck')==None  # voice track khud duck nahi hota
    # --- templates
    E('__ed.clips.length=0;__ed.setT(1)')
    pg.click('#tplb');pg.fill('#tp_ch','Test Channel');pg.click('[data-tp="end"]');pg.wait_for_timeout(200)
    tx=E('__ed.clips.filter(c=>c.text).map(c=>[c.text,Math.round(c.start*10)/10,c.len])');print(tx);assert len(tx)==3 and tx[0][0]=='SUBSCRIBE' and tx[1][0]=='Test Channel' and tx[0][1]==1
    pg.click('#tplb');pg.click('[data-tp="intro"]');pg.click('#tplb');pg.click('[data-tp="lower"]');assert E('__ed.clips.filter(c=>c.text).length')==5
    assert E('__ed.clips.filter(c=>c.st=="ul").length')==1
    pg.select_option('#asp','9:16');E('__ed.setT(1.5)');pg.wait_for_timeout(300)
    n=E('(()=>{const d=document.getElementById("cv").getContext("2d").getImageData(0,0,720,1280).data;let k=0;for(let i=0;i<d.length;i+=4)if(d[i]>200&&d[i+1]>150)k++;return k})()');print('template pixels (9:16)',n);assert n>2000
    # --- project roundtrip keeps aspect
    pg.select_option('#asp','9:16');js=E('JSON.stringify(__ed.projData())');assert json.loads(js)['asp']=='9:16'
    pg.select_option('#asp','16:9');E('__ed.loadProject(%s)'%json.dumps(js));assert E('[__ed.CW,__ed.CH]')==[720,1280] and pg.input_value('#asp')=='9:16'
    b.close()
print('errors:',errs);assert not errs,errs
print('CHUNK 15 OK')
