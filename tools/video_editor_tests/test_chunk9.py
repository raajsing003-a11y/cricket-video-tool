# Chunk 9: speed / reverse / ramp. needs /tmp/test_v.webm (4s, made by test_chunk3)
import sys,os,subprocess
from playwright.sync_api import sync_playwright
V,A,I='/tmp/test_v.webm','/tmp/test_a.ogg','/tmp/test_i.png'
if not os.path.exists(V):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','testsrc=duration=4:size=640x360:rate=30','-c:v','libvpx',V],check=True)
if not os.path.exists(A):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=660:duration=3','-c:a','libvorbis',A],check=True)
if not os.path.exists(I):
    from PIL import Image;Image.new('RGB',(400,300),(200,30,30)).save(I)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[];near=lambda a,b,e=.12:abs(a-b)<=e
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[V,A,I]);pg.wait_for_function('__ed.media.size==3',timeout=15000)
    D=E('[...__ed.media.values()].find(m=>m.kind=="v").dur')
    E('(()=>{const m=[...__ed.media.values()].find(m=>m.kind=="v");__ed.addMedia(m,1,0);__ed.addMedia(m,1,'+str(D)+')})()')
    A_,B_=E('__ed.clips[0].id'),E('__ed.clips[1].id')
    E('__ed.sel=%d'%A_);pg.wait_for_timeout(100)
    assert pg.locator('#sfx').is_visible() and pg.locator('#kfx').is_visible()
    # 2x: len halves, clip B ripples left, source time follows
    pg.click('#s_ch [data-v="2"]');pg.wait_for_timeout(150)
    a=E('__ed.clips[0]');bb=E('__ed.clips[1]');print('2x',a['len'],bb['start'])
    assert a['sp']==2 and near(a['len'],D/2,.02) and near(bb['start'],D/2,.02),'ripple'
    assert '2×' in pg.inner_text('.clip[data-id="%d"] small'%A_)
    E('__ed.setT(1)');pg.wait_for_timeout(500);ct=E('__ed.els.get(%d).currentTime'%A_);print('ct@1s',ct);assert near(ct,2,.2),ct
    # slider speed 0.5 -> len doubles
    pg.fill('#s_sp','50');pg.dispatch_event('#s_sp','input');pg.dispatch_event('#s_sp','change');pg.wait_for_timeout(100)
    assert near(E('__ed.clips[0].len'),D*2,.02) and E('__ed.clips[0].sp')==.5
    # undo = one step per drag
    u=E('__ed.undoLen');E("(()=>{const e=document.getElementById('s_sp');for(const v of [60,70,80]){e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}})()");assert E('__ed.undoLen')-u==1
    E('__ed.undo()');assert E('__ed.clips[0].sp')==.5
    pg.click('#s_ch [data-v="1"]');a=E('__ed.clips[0]');assert 'sp' not in a and near(a['len'],D,.02) and near(E('__ed.clips[1].start'),D,.02)
    # playback at 2x: playbackRate applied
    pg.click('#s_ch [data-v="2"]');E('__ed.setT(0)');pg.keyboard.press('Space');pg.wait_for_timeout(700)
    rate=E('__ed.els.get(%d).playbackRate'%A_);ct=E('__ed.els.get(%d).currentTime'%A_);print('play rate',rate,'ct',ct)
    assert rate==2 and ct>.8,(rate,ct)
    pg.keyboard.press('Space');pg.wait_for_timeout(100)
    # reverse: source time runs backwards
    pg.click('#s_ch [data-v="1"]');pg.click('#s_rv');pg.wait_for_timeout(100)
    assert E('__ed.clips[0].rv')==1;E('__ed.setT(1)');pg.wait_for_timeout(500)
    ct=E('__ed.els.get(%d).currentTime'%A_);print('rev ct@1s',ct,'D',D);assert near(ct,D-1,.2),ct
    assert E('__ed.els.get(%d).muted'%A_)==True
    # reverse trim: R handle drag left by 60px -> in rises by (60/pps)
    pps=E('__ed.pps');el=pg.locator('.clip[data-id="%d"]'%A_).bounding_box();in0=E('__ed.clips[0].in');len0=E('__ed.clips[0].len')
    pg.mouse.move(el['x']+el['width']-3,el['y']+20);pg.mouse.down();pg.mouse.move(el['x']+el['width']-63,el['y']+20,steps=6);pg.mouse.up()
    a=E('__ed.clips[0]');print('rev R trim',in0,a['in'],len0,a['len']);assert a['len']<len0-.1 and near(a['in']-in0,len0-a['len'],.02)
    E('__ed.undo()')
    # speed-2 trim: L handle drag right 60px -> in rises 2x timeline delta
    pg.click('#s_rv');pg.click('#s_ch [data-v="2"]');pg.wait_for_timeout(100)
    el=pg.locator('.clip[data-id="%d"]'%A_).bounding_box();s0=E('__ed.clips[0].start')
    pg.mouse.move(el['x']+3,el['y']+20);pg.mouse.down();pg.mouse.move(el['x']+63,el['y']+20,steps=6);pg.mouse.up()
    a=E('__ed.clips[0]');print('2x L trim',a['start'],a['in']);assert a['start']>s0+.1 and near(a['in'],2*(a['start']-s0),.03)
    E('__ed.undo()')
    # split at 2x: second.in = in + 2*offset ; reverse: first.in = in+span-2*offset
    E('__ed.sel=%d'%A_);E('__ed.setT(%f)'%(E('__ed.clips[0].start')+.5));E('__ed.split()')
    cl=E('__ed.clips.filter(c=>c.media==__ed.clips[0].media&&c.tr==1)');c1,c2=sorted(cl,key=lambda c:c['start'])[:2];print('split',c1['in'],c2['in'])
    assert near(c1['in'],0,.01) and near(c2['in'],1.0,.03),(c1,c2)
    E('__ed.undo()')
    pg.click('#s_rv');E('__ed.setT(%f)'%(E('__ed.clips[0].start')+.5));E('__ed.sel=%d'%A_);E('__ed.split()')
    c1,c2=sorted(E('__ed.clips.filter(c=>c.rv)'),key=lambda c:c['start'])[:2];print('rev split',c1['in'],c2['in'],c1['len'],c2['len'])
    span=D;assert near(c2['in'],0,.01) and near(c1['in'],span-1.0,.05),(c1,c2)
    E('__ed.undo();__ed.undo()')
    # ramp: len = S/(sp*M); source start..end covered; monotonic; instant speed at ends
    pg.click('#s_rv') if E('__ed.clips[0].rv') else None
    pg.click('#s_ch [data-v="1"]');pg.click('#s_rp [data-v="in"]');pg.wait_for_timeout(100)
    a=E('__ed.clips[0]');print('ramp',a['ramp'],a['len']);assert near(a['len'],D/1.125,.02)
    r=E('(()=>{const c=__ed.clips[0];const v=[0,.25,.5,.75,1].map(f=>__ed.srcAt(c,f*c.len));return{v,s0:__ed.instSp(c,0),s1:__ed.instSp(c,c.len)}})()');print(r)
    assert near(r['v'][0],0,.001) and near(r['v'][4],D,.01) and all(r['v'][i]<r['v'][i+1] for i in range(4)) and near(r['s0'],.25,.001) and near(r['s1'],2,.001)
    # ramp blocks trim and split
    el=pg.locator('.clip[data-id="%d"]'%A_).bounding_box();l0=E('__ed.clips[0].len')
    pg.mouse.move(el['x']+el['width']-3,el['y']+20);pg.mouse.down();pg.mouse.move(el['x']+el['width']-63,el['y']+20,steps=6);pg.mouse.up()
    assert E('__ed.clips[0].len')==l0,'ramp trim block'
    n=E('__ed.clips.length');E('__ed.sel=%d'%A_);E('__ed.setT(1)');E('__ed.split()');assert E('__ed.clips.length')==n,'ramp split block'
    # ramp playback: playbackRate changes over time
    E('__ed.setT(0)');pg.keyboard.press('Space');pg.wait_for_timeout(250);r1=E('__ed.els.get(%d).playbackRate'%A_);pg.keyboard.press('Space')
    print('ramp rate early',r1);assert r1<.6
    pg.click('#s_rp [data-v=""]');assert 'ramp' not in E('__ed.clips[0]') and near(E('__ed.clips[0].len'),D,.02)
    # panels: audio -> only speed ; image -> only chroma/bg ; text -> hidden
    E('(()=>{const m=[...__ed.media.values()].find(m=>m.kind=="a");__ed.addMedia(m,3,0)})()');pg.wait_for_timeout(100)
    assert pg.locator('#kpn').is_visible() and pg.locator('#sfx').is_visible() and pg.locator('#kfx').is_hidden()
    E('(()=>{const m=[...__ed.media.values()].find(m=>m.kind=="i");__ed.addMedia(m,2,0)})()');pg.wait_for_timeout(100)
    assert pg.locator('#sfx').is_hidden() and pg.locator('#kfx').is_visible()
    E('__ed.addText("hi")');assert pg.locator('#kpn').is_hidden()
    # perf: preview with speed
    E('__ed.sel=%d'%A_);pg.click('#s_ch [data-v="2"]');E('__ed.setT(.5)')
    ms=E('(()=>{const a=performance.now();for(let i=0;i<40;i++)__ed.preview();return (performance.now()-a)/40})()');print('preview ms:',round(ms,2));assert ms<25
    pg.screenshot(path='/tmp/ed9.png');b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
