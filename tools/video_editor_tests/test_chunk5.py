# Chunk 5: text clips + captions (SRT/VTT import, script spread, SRT export, panel, drag, anims)
import sys,os
from playwright.sync_api import sync_playwright
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
COUNT='''(sel)=>{const cv=document.getElementById("cv"),d=cv.getContext("2d").getImageData(0,0,1280,720).data;let n=0,l=0,r=0;
 for(let i=0;i<d.length;i+=4){const x=(i/4)%1280;const ok=sel=="white"?(d[i]>200&&d[i+1]>200&&d[i+2]>200):(d[i]>200&&d[i+1]>170&&d[i+2]<110);if(ok){n++;x<640?l++:r++}}return[n,l,r]}'''
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':860},accept_downloads=True)
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f)
    E=lambda s:pg.evaluate(s)
    def at(t):E('__ed.setT(%s)'%t);pg.wait_for_timeout(100)
    # --- 1. + Text
    assert pg.locator('#tpn').is_hidden()
    pg.click('#addT');pg.wait_for_timeout(150)
    assert E('__ed.clips.length')==1 and pg.locator('#tpn').is_visible()
    assert E('getComputedStyle(document.getElementById("empty")).display')=='none','empty overlay text ke upar nahi'
    c=E('__ed.clips[0]');tr=[x for x in E('__ed.tracks') if x['id']==c['tr']][0];assert tr['type']=='t' and c['text']=='Naya text',(c,tr)
    assert pg.locator('#p_tx').input_value()=='Naya text'
    u0=E('__ed.undoLen')
    pg.fill('#p_tx','');pg.locator('#p_tx').press_sequentially('Hello World')
    c=E('__ed.clips[0]');assert c['text']=='Hello World' and c['name']=='Hello World',c
    assert E('__ed.undoLen')-u0<=2,'typing = ek undo step'
    at(1.5);n=E('('+COUNT+')("white")');print('white px',n);assert n[0]>2000,'text dikha'
    at(0);assert E('('+COUNT+')("white")')[0]==0,'fade: start par gayab'
    # --- 2. styles / sizes
    at(1.5);base=E('('+COUNT+')("white")')[0]
    pg.fill('#p_fs','140');pg.dispatch_event('#p_fs','input');pg.wait_for_timeout(100)
    assert E('__ed.clips[0].fs')==140;big=E('('+COUNT+')("white")')[0];assert big>base*2,(base,big)
    for st in ['plain','outline','box','bar','neon']:
        pg.click('#p_st [data-v=%s]'%st);assert E('__ed.clips[0].st')=='%s'%st;pg.wait_for_timeout(60)
    at(1.5);pg.click('#p_st [data-v=bar]');pg.wait_for_timeout(80)
    # bar: bg dark but not pure black? (rgba .66 of black on black stays black) -> just check text still visible
    assert E('('+COUNT+')("white")')[0]>1000
    # --- 3. Hindi + न्न fix
    pg.click('#p_st [data-v=outline]');pg.fill('#p_tx','नमस्ते चेन्नई\nदूसरी लाइन');pg.wait_for_timeout(100)
    L=E('(()=>{const B=__ed.textBox(__ed.clips[0]);return B.L.lines.length+","+B.L.nw+","+(B.L.lines[0].words[1].w.includes("\\u200d"))})()');print('hindi layout',L);assert L=='2,4,true',L
    assert E('('+COUNT+')("white")')[0]>500
    pg.screenshot(path='/tmp/ed5_text.png')
    # --- 4. animations
    pg.fill('#p_tx','Pop test');
    for an in ['none','fade','pop','slide','type']:
        pg.click('#p_an [data-v=%s]'%an);assert E('__ed.clips[0].an')==an
        for tt in (0,.1,.2,.4,1.5,2.9):
            at(tt)
    pg.click('#p_an [data-v=none]');at(0);assert E('('+COUNT+')("white")')[0]>500,'none: pehle frame par bhi dikhe'
    pg.click('#p_an [data-v=type]');at(.05);a=E('('+COUNT+')("white")')[0];at(1.0);bb=E('('+COUNT+')("white")')[0];assert 0<=a<bb,(a,bb)
    pg.click('#p_an [data-v=fade]')
    # --- 5. drag on preview
    at(1.5);box=pg.locator('#cv').bounding_box()
    pg.mouse.move(box['x']+box['width']*.5,box['y']+box['height']*.5);pg.mouse.down()
    pg.mouse.move(box['x']+box['width']*.7,box['y']+box['height']*.25,steps=6);pg.mouse.up();pg.wait_for_timeout(100)
    c=E('__ed.clips[0]');print('drag ->',c['x'],c['y']);assert abs(c['x']-.7)<.04 and abs(c['y']-.25)<.04,c
    assert pg.locator('#tbx').is_visible()
    pg.click('#p_pos [data-y=".86"]');c=E('__ed.clips[0]');assert c['y']==.86 and c['x']==.5
    E('__ed.undo()');assert abs(E('__ed.clips[0].y')-.25)<.04,'undo position'
    # --- 6. word highlight (accent colour moves left -> right)
    pg.fill('#p_tx','ek do teen char paanch chhe');pg.click('#p_wh');pg.click('#p_an [data-v=none]')
    pg.evaluate("(()=>{const c=__ed.clips[0];c.x=.5;c.y=.5;c.ac='#ffd23f';__ed.render()})()")
    at(.1);a=E('('+COUNT+')("accent")');at(2.8);z=E('('+COUNT+')("accent")');print('accent early/late',a,z)
    assert a[0]>50 and z[0]>50 and a[1]>a[2] and z[2]>z[1],'highlight left->right'
    # --- 7. split keeps text/style
    at(1.0);E('__ed.sel=__ed.clips[0].id');E('__ed.split()');assert E('__ed.clips.length')==2
    c2=E('__ed.clips[1]');assert c2['text']=='ek do teen char paanch chhe' and c2['wh']==1 and abs(c2['start']-1)<.02,c2
    E('__ed.undo()');assert E('__ed.clips.length')==1
    # --- 8. captions: spread
    E('__ed.setT(0)');pg.click('#capb');assert pg.locator('#cap').is_visible()
    pg.fill('#c_tx','पहली लाइन छोटी\nYe doosri line thodi lambi hai\nTeesri');pg.fill('#c_f','0');pg.fill('#c_t','12');pg.click('#c_go')
    caps=E('__ed.clips.filter(c=>c.cap)');assert len(caps)==3,caps
    assert abs(caps[0]['start'])<.01 and abs(caps[2]['start']+caps[2]['len']-12)<.02 and abs(caps[0]['start']+caps[0]['len']-caps[1]['start'])<.01
    assert caps[1]['len']>caps[0]['len']>caps[2]['len']*0.9
    ct=[x for x in E('__ed.tracks') if x.get('cap')];assert len(ct)==1 and ct[0]['name']=='Captions'
    pg.locator('#cap').wait_for(state='hidden')
    # caption default look: box, bottom
    o=E('__ed.TX(__ed.clips.find(c=>c.cap))');assert o['st']=='box' and o['y']>.8,o
    at(6);assert E('('+COUNT+')("white")')[0]>800
    pg.screenshot(path='/tmp/ed5_caps.png')
    # Plain +Text must not land on the Captions track
    pg.click('#addT');pg.wait_for_timeout(100);nt=E('__ed.clips[__ed.clips.length-1]');assert not [x for x in E('__ed.tracks') if x['id']==nt['tr']][0].get('cap')
    # apply style to all captions
    E('__ed.selClip(__ed.clips.find(c=>c.cap).id)');pg.click('#p_st [data-v=outline]');pg.click('#p_all')
    assert all(c['st']=='outline' for c in E('__ed.clips.filter(c=>c.cap)'))
    # --- 9. SRT parse / import / export
    srt='\ufeff1\r\n00:00:01,000 --> 00:00:03,500\r\n<i>Namaste</i> doston\r\nduusri line\r\n\r\n2\r\n00:00:04,000 --> 00:00:06,250\r\nHindi: चेन्नई सुपर किंग्स\r\n\r\n'
    vtt='WEBVTT\n\n00:02.000 --> 00:04.000 align:start\nvtt line one\n\n01:00:00.500 --> 01:00:01.000\nlong hour\n'
    P=pg.evaluate('(s)=>__ed.parseSub(s)',srt);assert len(P)==2 and P[0]['s']==1 and P[0]['e']==3.5 and P[0]['text']=='Namaste doston\nduusri line',P
    P=pg.evaluate('(s)=>__ed.parseSub(s)',vtt);assert len(P)==2 and P[0]['s']==2 and abs(P[1]['s']-3600.5)<1e-6,P
    n0=E('__ed.clips.length')
    pg.click('#capb');
    with pg.expect_file_chooser() as fc:pg.click('#c_imp')
    open('/tmp/t5.srt','w',encoding='utf-8').write(srt);fc.value.set_files('/tmp/t5.srt');pg.wait_for_function('__ed.clips.length==%d'%(n0+2))
    assert pg.locator('#cap').is_hidden()
    pg.click('#capb')
    with pg.expect_download() as d:pg.click('#c_exp')
    pth=d.value.path();txt=open(pth,encoding='utf-8').read();print(txt[:300])
    assert '-->' in txt and 'चेन्नई सुपर किंग्स' in txt and '00:00:12,000' in txt and txt.startswith('1\n'),txt[:200]
    assert [x for x in txt.split('\n') if x.strip().isdigit()][-1]==str(len(E('__ed.clips.filter(c=>c.cap)')))
    pg.keyboard.press('Escape');assert pg.locator('#cap').is_hidden()
    # --- 10. panel hides for non-text; media clip selection
    E('__ed.addClip(1,0,3,"vid")');assert pg.locator('#tpn').is_hidden()
    E('__ed.selClip(__ed.clips.find(c=>c.cap).id)');assert pg.locator('#tpn').is_visible()
    # --- 11. text clip + transition still works (fade over text)
    # --- 12. perf: 8 text clips w/ highlight active
    E('(()=>{for(let i=0;i<7;i++){const c=__ed.addText("perf line number "+i+" kuch lamba text");c.wh=1;c.y=.1+i*.1;c.len=60;c.start=0}__ed.setT(5)})()')
    ms=E('(()=>{const a=performance.now();for(let i=0;i<60;i++)__ed.preview();return (performance.now()-a)/60})()');print('preview ms/frame, 8+ text clips:',round(ms,2));assert ms<10
    # 600 captions render time
    E('(()=>{for(let i=0;i<600;i++)__ed.clips.push({id:90000+i,tr:__ed.clips.find(c=>c.cap).tr,start:100+i*2,len:1.9,in:0,name:"c"+i,text:"c"+i,cap:1})})()')
    r=E('(()=>{const a=performance.now();__ed.render();return performance.now()-a})()');print('render ms (600+ clips)',round(r,1));assert r<150
    b.close()
print('ERRORS:',errs);sys.exit(1 if errs else 0)
