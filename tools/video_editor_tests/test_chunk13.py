# Chunk 13: project save/load (+relink), autosave, export size/fps, shortcuts, help
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
    o=subprocess.run(['ffprobe','-v','error','-print_format','json','-show_streams','-show_format',p],capture_output=True,text=True);return json.loads(o.stdout)
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);ctx=b.new_context(viewport={'width':1400,'height':860},accept_downloads=True);pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    assert E('__ed.saveProject()') is None          # khali -> save nahi
    pg.set_input_files('#file',[V,TONE]);pg.wait_for_function('__ed.media.size==2',timeout=15000)
    E('(()=>{const v=[...__ed.media.values()].find(m=>m.kind=="v"),a=[...__ed.media.values()].find(m=>m.kind=="a");const c1=__ed.addMedia(v,3,0),c2=__ed.addMedia(v,3,2.5);__ed.addMedia(a,3,0);c2.tt="fade";c2.td=.5;c1.sp=1.5;c1.vol=.8;c1.ck={on:0,col:"#00ff00",sim:.2,sm:.1,sp:.5}})()')
    pg.wait_for_function('document.title.startsWith("●")',timeout=8000);print('dirty title ok')
    snap=E('JSON.stringify([__ed.tracks,__ed.clips])');nclip=E('__ed.clips.length')
    # --- Ctrl+S download
    with pg.expect_download(timeout=10000) as dl: pg.keyboard.press('Control+s')
    d=dl.value;d.save_as('/tmp/proj13.json');print('saved',d.suggested_filename,os.path.getsize('/tmp/proj13.json'))
    assert d.suggested_filename.startswith('project_') and d.suggested_filename.endswith('.json')
    pj=json.load(open('/tmp/proj13.json'));assert pj['app']=='video_editor' and len(pj['clips'])==nclip and len(pj['media'])==2 and 'url' not in pj['media'][0]
    assert E('__ed.savedSig')==E('__ed.projSig()'),'save ke baad dirty nahi hona chahiye'
    # --- autosave in localStorage
    pg.wait_for_function('localStorage.getItem("ve_autosave_v1")',timeout=8000);print('autosave ok')
    # --- new page (khali) -> Autosave button -> restore
    pg2=ctx.new_page();pg2.on('pageerror',lambda e:errs.append(str(e)));pg2.goto(f)
    pg2.wait_for_selector('#asb',state='visible',timeout=5000)
    pg2.click('#asb');pg2.wait_for_function('__ed.clips.length==%d'%nclip);miss=pg2.evaluate('[...__ed.media.values()].filter(m=>m.missing).length');print('autosave restore, missing',miss);assert miss==2
    assert pg2.locator('.mi.miss').count()==2
    pg2.close()
    # --- yahin: sab hata do, project file se load
    E('(()=>{__ed.clips.length=0;__ed.render()})()')
    r=E('__ed.loadProject(%s)'%json.dumps(open('/tmp/proj13.json').read()));print('load missing',r);assert r==2
    assert E('JSON.stringify([__ed.tracks,__ed.clips])')==snap,'timeline same nahi aayi'
    assert E('__ed.undoLen')==0
    # missing media: preview/export chale to bhi crash nahi, bin se add block
    E('__ed.setT(1)');pg.wait_for_timeout(300)
    assert E('(()=>{const m=[...__ed.media.values()][0];return __ed.addMedia(m)===null})()')
    ex=E('__ed.exportRun({fmt:"webm",save:0,rs:360,fps:24}).then(r=>({size:r.size,ac:r.acodec,w:r.w,h:r.h}),e=>({err:e.message}))');print('export with missing ->',ex);assert 'err' not in ex and not ex['ac']
    # relink: files dobara import
    pg.set_input_files('#file',[V]);pg.wait_for_function('[...__ed.media.values()].filter(m=>m.missing).length==1',timeout=15000)
    pg.set_input_files('#file',[TONE]);pg.wait_for_function('[...__ed.media.values()].filter(m=>m.missing).length==0',timeout=15000)
    assert E('__ed.media.size')==2 and pg.locator('.mi.miss').count()==0
    assert E('JSON.stringify([__ed.tracks,__ed.clips])')==snap
    print('relink ok')
    # --- export size/fps
    for fmt,rs,fps,w in [('mp4',480,24,854),('webm',360,30,640)]:
        r=E('__ed.exportRun({fmt:"%s",save:0,rs:%d,fps:%d}).then(async r=>({w:r.w,h:r.h,fps:r.fps,ac:r.acodec,tot:r.total,b64:await new Promise(k=>{const fr=new FileReader();fr.onload=()=>k(fr.result.split(",")[1]);fr.readAsDataURL(r.blob)})}),e=>({err:e.message}))'%(fmt,rs,fps))
        assert 'err' not in r,r
        path='/tmp/o13.'+fmt;open(path,'wb').write(base64.b64decode(r['b64']));j=probe(path);v=[s for s in j['streams'] if s['codec_type']=='video'][0]
        a,bb=v['r_frame_rate'].split('/');rate=float(a)/float(bb);print(fmt,v['width'],v['height'],rate,'audio' in [s['codec_type'] for s in j['streams']],j['format']['duration'])
        assert v['width']==w and v['height']==rs and abs(rate-fps)<.6 and r['ac'] and abs(float(j['format']['duration'])-6.5)<.4,(v,r['ac'])
    # --- dialog chips
    pg.click('#exb');pg.click('#x_r button[data-v="480"]');pg.click('#x_s button[data-v="24"]');txt=pg.inner_text('#x_i');print(txt);assert '854×480' in txt and '24 fps' in txt
    pg.keyboard.press('Escape');assert pg.locator('#exd').is_hidden()
    # --- shortcuts
    E('__ed.setT(0)');pg.keyboard.press('Shift+ArrowRight');assert abs(E('__ed.t')-1)<1e-6
    pg.keyboard.press('Shift+ArrowLeft');assert abs(E('__ed.t')-0)<1e-6
    pg.keyboard.press('End');assert abs(E('__ed.t')-E('Math.max(...__ed.clips.map(c=>c.start+c.len))'))<.01
    z0=E('__ed.pps');pg.keyboard.press('+');assert E('__ed.pps')>z0;pg.keyboard.press('-')
    E('__ed.sel=%d'%E('__ed.clips[2].id'));pg.keyboard.press('m');assert E('__ed.clips[2].mu')==1;pg.keyboard.press('m');assert E('__ed.clips[2].mu')is None
    pg.keyboard.press('Shift+Slash');assert pg.locator('#hlp').is_visible();pg.keyboard.press('Escape');assert pg.locator('#hlp').is_hidden()
    pg.click('#hpb');assert pg.locator('#hlp').is_visible();pg.click('#h_x')
    pg.keyboard.press('Control+e');assert pg.locator('#exd').is_visible();pg.keyboard.press('Escape')
    # bad project file
    assert E('__ed.loadProject("{nope")')==-1 and E('__ed.loadProject(\'{"app":"x"}\')')==-1 and E('__ed.clips.length')==nclip
    b.close()
print('errors:',errs);assert not errs,errs
print('CHUNK 13 OK')
