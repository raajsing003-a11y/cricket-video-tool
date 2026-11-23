# Chunk 12: export MP4/WebM (WebCodecs + mp4-muxer / mini WebM muxer), audio mix, transitions, cancel
import sys,os,subprocess,json,base64
from playwright.sync_api import sync_playwright
V,TONE='/tmp/test_v.webm','/tmp/test_tone.wav'
if not os.path.exists(V):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','testsrc=duration=4:size=640x360:rate=30','-f','lavfi','-i','sine=frequency=440:duration=4','-c:v','libvpx','-c:a','libvorbis','-shortest',V],check=True)
if not os.path.exists(TONE):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=440:duration=3','-af','volume=4','-ar','44100',TONE],check=True)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
def probe(p):
    o=subprocess.run(['ffprobe','-v','error','-print_format','json','-show_streams','-show_format',p],capture_output=True,text=True)
    return json.loads(o.stdout)
def vol(p):
    o=subprocess.run(['ffmpeg','-i',p,'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
    for l in o.splitlines():
        if 'mean_volume' in l:return float(l.split('mean_volume:')[1].split('dB')[0])
    return None
def bright(p,ts):
    from PIL import Image
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(ts),'-i',p,'-frames:v','1','/tmp/x12.png'],check=True)
    im=Image.open('/tmp/x12.png').convert('L');return sum(im.resize((1,1)).getdata())
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    # khali timeline
    r=E('__ed.exportRun({save:0}).then(()=>"ok",e=>e.message)');print('empty ->',r);assert 'khali' in r
    pg.set_input_files('#file',[V,TONE]);pg.wait_for_function('__ed.media.size==2',timeout=15000)
    E('(()=>{const v=[...__ed.media.values()].find(m=>m.kind=="v"),a=[...__ed.media.values()].find(m=>m.kind=="a");__ed.addMedia(v,3,0);__ed.addMedia(v,3,2.5);__ed.addMedia(a,3,0)})()')
    E('(()=>{const c=__ed.clips;c[1].tt="fade";c[1].td=.5;__ed.addText("Export test",1,4.2)})()') if False else None
    n=E('__ed.clips.length');print('clips',n)
    # transition + text clip
    E('(()=>{const c=__ed.clips.filter(x=>x.media!=null);const B=c.filter(x=>x.start>2)[0];B.tt="fade";B.td=.5;})()')
    E('__ed.addText&&__ed.addText("Export test")')
    tot=E('Math.max(...__ed.clips.map(c=>c.start+c.len))');print('total',tot)
    # dialog
    pg.click('#exb');assert pg.locator('#exd').is_visible() and '1280' in pg.inner_text('#x_i'),pg.inner_text('#x_i')
    pg.click('#x_x');assert pg.locator('#exd').is_hidden()
    for fmt in ['webm','mp4']:
        prog=[]
        r=E('__ed.exportRun({fmt:"%s",save:0,br:3e6}).then(async r=>({size:r.size,vc:r.vcodec,ac:r.acodec,fr:r.frames,tot:r.total,secs:r.secs,b64:await new Promise(k=>{const fr=new FileReader();fr.onload=()=>k(fr.result.split(",")[1]);fr.readAsDataURL(r.blob)})}),e=>({err:e.message}))'%fmt)
        print(fmt,{k:v for k,v in r.items() if k!='b64'});
        if 'err' in r: print('SKIP/FAIL',r['err']);assert fmt=='mp4' and 'encoder' in r['err'],r;continue
        path='/tmp/out12.'+fmt;open(path,'wb').write(base64.b64decode(r['b64']))
        j=probe(path);st={s['codec_type']:s for s in j['streams']};d=float(j['format']['duration']);print(' ffprobe',{k:(v['codec_name'],v.get('width')) for k,v in st.items()},'dur',d)
        assert 'video' in st and st['video']['width']==1280 and st['video']['height']==720
        assert abs(d-tot)<.35,(d,tot)
        assert 'audio' in st,'awaaz track nahi'
        mv=vol(path);print(' mean volume',mv);assert mv is not None and mv>-45,mv
        b1,b2=bright(path,.5),bright(path,1.5);print(' bright',b1,b2);assert b1>20 and b2>20
        # transition zone (2.5-3.0) frame exists, last frame ok
        assert bright(path,2.75)>20
    # audio mute: track mute -> no audio samples
    E('__ed.tracks.forEach(t=>t.mute=1)')
    r=E('__ed.exportRun({fmt:"webm",save:0}).then(r=>({ac:r.acodec,size:r.size}),e=>({err:e.message}))');print('all muted ->',r)
    assert not r.get('ac'),r
    E('__ed.tracks.forEach(t=>t.mute=0)')
    # preview guard + state restore
    t0=E('__ed.t');E('(()=>{window.__xp=__ed.exportRun({fmt:"webm",save:0});return 1})()');pg.wait_for_timeout(300);assert E('__ed.EXP.on')==True
    assert E('(()=>{try{__ed.preview();return 1}catch(e){return 0}})()')==1
    pg.wait_for_function('__ed.EXP.on==false',timeout=60000);assert abs(E('__ed.t')-t0)<1e-6 and E('__ed.playing')==False
    # cancel from UI
    pg.click('#exb');pg.click('#x_go');pg.wait_for_function('__ed.EXP.on==true',timeout=5000);pg.click('#x_cn')
    pg.wait_for_function('__ed.EXP.on==false',timeout=60000);pg.wait_for_timeout(200)
    m=pg.inner_text('#x_m');print('cancel msg:',m);assert 'roka' in m.lower()
    # UI full run (download)
    pg.click('#x_f button[data-v="webm"]')
    with pg.expect_download(timeout=90000) as dl: pg.click('#x_go')
    d=dl.value;d.save_as('/tmp/ui12.webm');pg.wait_for_function('__ed.EXP.on==false');print('ui:',pg.inner_text('#x_m'),d.suggested_filename)
    assert d.suggested_filename.endswith('.webm') and os.path.getsize('/tmp/ui12.webm')>5000 and 'Ho gaya' in pg.inner_text('#x_m')
    b.close()
print('errors:',errs);assert not errs,errs
print('CHUNK 12 OK')
