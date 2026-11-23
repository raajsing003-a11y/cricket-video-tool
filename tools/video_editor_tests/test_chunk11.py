# Chunk 11: audio mix (clip vol, fades, track vol, mute, auto level) + waveform + meter
import sys,os,subprocess
from playwright.sync_api import sync_playwright
V,TONE,I='/tmp/test_v.webm','/tmp/test_tone.wav','/tmp/test_i.png'
if not os.path.exists(V):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','testsrc=duration=4:size=640x360:rate=30','-f','lavfi','-i','sine=frequency=440:duration=4','-c:v','libvpx','-c:a','libvorbis','-shortest',V],check=True)
if not os.path.exists(TONE):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=440:duration=3','-af','volume=4','-ar','44100',TONE],check=True)
if not os.path.exists(I):
    from PIL import Image;Image.new('RGB',(400,300),(200,30,30)).save(I)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[];near=lambda a,b,e=.03:abs(a-b)<=e
WFSUM='''(id)=>{const cn=document.querySelector('.clip[data-id="'+id+'"] canvas.wf');if(!cn)return -1;const d=cn.getContext('2d').getImageData(0,0,cn.width,cn.height).data;let s=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)s++;return s/cn.width}'''
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[TONE,V,I]);pg.wait_for_function('__ed.media.size==3',timeout=15000)
    E('(()=>{const m=[...__ed.media.values()].find(m=>m.name.includes("tone"));__ed.addMedia(m,3,0);__ed.addMedia(m,3,3.5)})()')
    A,A2=E('__ed.clips[0].id'),E('__ed.clips[1].id')
    pg.wait_for_function('[...__ed.media.values()].find(m=>m.name.includes("tone")).peaks',timeout=10000)
    pk=E('(()=>{const m=[...__ed.media.values()].find(m=>m.name.includes("tone"));return{n:m.peaks.length,mx:Math.max(...m.peaks)}})()');print('peaks',pk)
    assert 140<=pk['n']<=160 and near(pk['mx'],.5,.06),pk
    E('__ed.sel=%d'%A);pg.wait_for_timeout(150)
    assert pg.locator('.clip canvas.wf').count()>=2,'waveform canvas nahi'
    w1=E('(%s)(%d)'%(WFSUM,A));print('wf rows@vol1',w1);assert w1>8
    assert pg.locator('#aud').is_visible() and pg.locator('#sfx').is_visible() and pg.locator('#kfx').is_hidden() and pg.locator('#stx').is_hidden()
    # volume 50 -> gain .5, waveform half height, tag
    pg.fill('#a_vol','50');pg.dispatch_event('#a_vol','input');pg.dispatch_event('#a_vol','change');pg.wait_for_timeout(120)
    assert near(E('__ed.gainOf(__ed.clips[0],1)'),.5) and '50%' in pg.inner_text('.clip[data-id="%d"] small'%A)
    w2=E('(%s)(%d)'%(WFSUM,A));print('wf rows@vol.5',w2);assert .3<w2/w1<.75,(w1,w2)
    pg.fill('#a_vol','100');pg.dispatch_event('#a_vol','input');pg.dispatch_event('#a_vol','change');assert 'vol' not in E('__ed.clips[0]')
    # fades
    pg.fill('#a_fi','10');pg.dispatch_event('#a_fi','input');pg.fill('#a_fo','10');pg.dispatch_event('#a_fo','input');pg.dispatch_event('#a_fo','change')
    c=E('__ed.clips[0]');L=c['len'];print('fi/fo',c['fi'],c['fo'])
    g=lambda u:E('__ed.gainOf(__ed.clips[0],%f)'%u)
    assert near(g(0),0) and near(g(.5),.5) and near(g(1.5),1) and near(g(L-.5),.5) and near(g(L),0)
    # fi+fo cannot exceed len
    pg.fill('#a_fi','50');pg.dispatch_event('#a_fi','input');pg.fill('#a_fo','50');pg.dispatch_event('#a_fo','input');pg.dispatch_event('#a_fo','change')
    c=E('__ed.clips[0]');assert c['fi']+c['fo']<=L+1e-6,c
    pg.fill('#a_fi','5');pg.dispatch_event('#a_fi','input');pg.fill('#a_fo','5');pg.dispatch_event('#a_fo','input');pg.dispatch_event('#a_fo','change')
    # split keeps fi on first part, fo on second
    E('__ed.setT(1.5);__ed.sel=%d;__ed.split()'%A);a,c2=sorted(E('__ed.clips.filter(c=>c.tr==3)'),key=lambda c:c['start'])[:2]
    assert a.get('fi')==.5 and 'fo' not in a and c2.get('fo')==.5 and 'fi' not in c2,(a,c2)
    E('__ed.undo()');E('__ed.sel=%d'%A)
    # track volume applies to all clips on the track, one undo step
    u=E('__ed.undoLen');pg.fill('#a_tv','50')
    print('tv',E('__ed.gainOf(__ed.clips[1],1)'),E('__ed.undoLen')-u,E('__ed.tracks.map(t=>t.vol)'),E('__ed.clips.map(c=>[c.id,c.tr,c.len])'))
    assert near(E('__ed.gainOf(__ed.clips[1],1)'),.5) and E('__ed.undoLen')-u==1
    E('__ed.undo()');assert near(E('__ed.gainOf(__ed.clips[1],1)'),1)
    # mute
    pg.click('#a_mu');assert E('__ed.gainOf(__ed.clips[0],1)')==0 and '🔇' in pg.inner_text('.clip[data-id="%d"] small'%A);pg.click('#a_mu');assert E('__ed.gainOf(__ed.clips[0],1)')>0
    # auto level: peak .5 -> vol ~1.78
    E('(()=>{const c=__ed.clips[0];delete c.fi;delete c.fo;__ed.render()})()');pg.click('#a_nm');v=E('__ed.clips[0].vol');print('auto vol',v,pg.inner_text('#a_msg'));assert 1.6<v<2.0,v
    # playback: routed through WebAudio, gain follows vol (boost >1 ok)
    E('__ed.setT(0.1)');pg.keyboard.press('Space');pg.wait_for_timeout(900)
    e=E('(()=>{const e=__ed.els.get(%d);return e&&e._g?e._g.gain.value:null})()'%A);print('routed gain',e);assert e is not None and near(e,v,.05)
    st=E('__ed.AC0&&__ed.AC0.state');print('AC state',st);mx=E('__ed.MT.mx');print('meter max',mx)
    pg.keyboard.press('Space');pg.wait_for_timeout(100)
    if st=='running':
        assert mx>.3,('meter level',mx)
        pg.fill('#a_vol','25');pg.dispatch_event('#a_vol','input');pg.dispatch_event('#a_vol','change');E('__ed.MT.mx=0;__ed.setT(0.1)');pg.keyboard.press('Space');pg.wait_for_timeout(900);mx2=E('__ed.MT.mx');pg.keyboard.press('Space');print('meter @25%',mx2);assert 0<mx2<mx*.6
    # video clip: audio panel shows, no crash even if no audio
    E('(()=>{const m=[...__ed.media.values()].find(m=>m.kind=="v");__ed.addMedia(m,1,0)})()');pg.wait_for_timeout(500)
    assert pg.locator('#aud').is_visible() and pg.locator('#kfx').is_visible()
    # image: no audio panel
    E('(()=>{const m=[...__ed.media.values()].find(m=>m.kind=="i");__ed.addMedia(m,2,0)})()');pg.wait_for_timeout(100);assert pg.locator('#aud').is_hidden()
    E('__ed.addText("hi")');assert pg.locator('#kpn').is_hidden()
    ms=E('(()=>{const a=performance.now();for(let i=0;i<40;i++)__ed.preview();return (performance.now()-a)/40})()');print('preview ms',round(ms,2));assert ms<25
    pg.screenshot(path='/tmp/ed11.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
