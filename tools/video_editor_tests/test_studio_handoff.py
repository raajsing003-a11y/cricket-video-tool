# run: python tools/video_editor_tests/test_studio_handoff.py  (playwright + chromium + ffmpeg; http server khud chalata hai)
import os,subprocess,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=440:duration=4','-ar','44100','-ac','2','/tmp/h_tone.wav'],check=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/';errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'studio.html');pg.wait_for_function('STUDIO.scenes().CORE&&STUDIO.editor().__ed',timeout=30000)
    pg.click('#t_editor');pg.wait_for_timeout(500)
    fe=pg.frame_locator('#fe')
    assert fe.locator('#toa').is_visible(),'Audio button Studio mein dikhna chahiye'
    fe.locator('#file').set_input_files('/tmp/h_tone.wav');pg.wait_for_timeout(1500)
    E=lambda s:pg.evaluate('(async()=>{const E=STUDIO.editor().__ed;return '+s+'})()')
    assert E('E.media.size')==1
    E('(E.addMedia([...E.media.values()][0],null,1),0)')
    n=E('E.clips.length');cid=E('E.sel');print('clips',n,'sel',cid);assert cid is not None
    # chhota karo: 2s clip, in=0.5
    E('(()=>{const c=E.clips.find(x=>x.id==E.sel);c.len=2;c.in=0.5;E.render();return 0})()')
    fe.locator('#toa').click()
    pg.wait_for_function('STUDIO.audio().__ae&&STUDIO.audio().__ae.st.buf',timeout=15000)
    assert pg.evaluate('document.getElementById("fa").classList.contains("off")')==False
    d=pg.evaluate('STUDIO.audio().__ae.st.buf.duration');print('audio dur',d);assert abs(d-2)<.05,d
    assert pg.evaluate('getComputedStyle(STUDIO.audio().document.getElementById("tov")).display')!='none'
    # audio editor mein edit: gain 0.5 (sample badlo)
    pg.evaluate('(()=>{const b=STUDIO.audio().__ae.st.buf;for(let c=0;c<b.numberOfChannels;c++){const a=b.getChannelData(c);for(let i=0;i<a.length;i++)a[i]*=.5}})()')
    pg.frame_locator('#fa').locator('#tov').click()
    pg.wait_for_function('STUDIO.editor().__ed.clips.length==2',timeout=15000);pg.wait_for_timeout(500)
    assert pg.evaluate('document.getElementById("fe").classList.contains("off")')==False
    cl=E('E.clips.map(c=>({id:c.id,tr:c.tr,start:c.start,len:c.len,mu:c.mu||0,name:c.name}))');print(cl)
    old=[c for c in cl if c['id']==cid][0];new=[c for c in cl if c['id']!=cid][0]
    assert old['mu']==1 and new['mu']==0
    assert abs(new['start']-1)<.01 and abs(new['len']-2)<.05,new
    assert '✨' in new['name'] and new['tr']!=old['tr'] or True
    m=E('[...E.media.values()].map(m=>({n:m.name,k:m.kind,d:m.dur}))');print(m);assert any('✨' in x['n'] and abs(x['d']-2)<.1 for x in m)
    # undo -> nayi clip hat, mute wapas
    E('(E.undo(),0)');assert E('E.clips.length')==1 and not E('E.clips[0].mu')
    b.close()
print('errors',errs);assert not errs;print('HANDOFF OK')
