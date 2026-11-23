# Chunk 6: auto captions pipeline. Real whisper model network chahiye -> yahan mock engine (window.__asrHook) + real audio decode/resample + JSON formats
import sys,os,subprocess,json
from playwright.sync_api import sync_playwright
A='/tmp/test_a.ogg'
if not os.path.exists(A):subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=frequency=660:duration=3','-c:a','libvorbis',A],check=True)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1400,'height':860},accept_downloads=True)
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);E=lambda s:pg.evaluate(s)
    pg.set_input_files('#file',[A]);pg.wait_for_function('__ed.media.size==1')
    E('__ed.addMedia([...__ed.media.values()][0],3,2)')   # audio clip at t=2, len ~3
    c=E('__ed.clips[0]');assert abs(c['start']-2)<.01
    # --- pure functions: formats
    S=E('__ed.normSegs')  # just ensure exists
    n=lambda j:pg.evaluate('(j)=>__ed.normSegs(j)',j)
    a=n({'segments':[{'start':0,'end':2,'text':' Namaste doston','words':[{'word':' Namaste','start':0,'end':.8},{'word':' doston','start':1,'end':1.9}]}]});assert a[0]['words'][1]['text']=='doston'
    a=n({'chunks':[{'text':'hello there','timestamp':[1.5,3]}]});assert a[0]['start']==1.5 and a[0]['end']==3
    a=n({'transcription':[{'timestamps':{'from':'00:00:01,000','to':'00:00:02,500'},'offsets':{'from':1000,'to':2500},'text':' kya haal'}]});assert a[0]['start']==1 and a[0]['end']==2.5
    a=n([{'start':0,'end':1,'text':'x'}]);assert len(a)==1 and n({'junk':1})==[]
    W=pg.evaluate('(j)=>__ed.segsToWords(__ed.normSegs(j))',[{'start':0,'end':3,'text':'ek do teen char paanch'}]);assert len(W)==5 and abs(W[-1]['e']-3)<.01 and W[0]['est']
    G=pg.evaluate('(W)=>__ed.groupWords(W,{maxw:2})',W);assert [len(g) for g in G]==[2,2,1],G
    G=pg.evaluate('(W)=>__ed.groupWords(W,{maxw:9})',[{'w':'Hi.','s':0,'e':.3},{'w':'Next','s':.4,'e':.7},{'w':'far','s':3,'e':3.2}]);assert [len(g) for g in G]==[1,1,1],G  # sentence end + gap
    # --- real audio -> 16k mono pcm
    pcm=E('(async()=>{const p=await __ed.clipPCM(__ed.clips[0]);let s=0;for(const v of p)s+=v*v;return {n:p.length,rms:Math.sqrt(s/p.length)}})()')
    print('pcm',pcm);assert abs(pcm['n']-16000*c['len'])<400 and pcm['rms']>.05
    # trimmed clip -> shorter pcm
    E('(()=>{const c=__ed.clips[0];c.in=1;c.len=1.5})()');pcm=E('(async()=>(await __ed.clipPCM(__ed.clips[0])).length)()');assert abs(pcm-24000)<400,pcm
    E('(()=>{const c=__ed.clips[0];c.in=0;c.len=3})()')
    # --- full flow with mock engine
    E('''(()=>{window.__calls=[];window.__asrHook=async(pcm,o)=>{window.__calls.push({n:pcm.length,model:o.model,lang:o.lang});
      return [{start:0,end:1.4,text:' नमस्ते दोस्तों',words:[{text:' नमस्ते',start:.1,end:.6},{text:'दोस्तों',start:.7,end:1.3}]},
              {start:1.6,end:3,text:'aaj ka match bahut zabardast tha',words:[]}]}})()''')
    pg.click('#capb');assert 'clip' in pg.inner_text('#a_src') or pg.inner_text('#a_src')!='—'
    pg.select_option('#a_model','whisper-tiny_timestamped');pg.select_option('#a_lang','hi');pg.fill('#a_mw','3')
    pg.click('#a_go');pg.wait_for_function('document.getElementById("cap").style.display=="none"',timeout=8000)
    calls=E('window.__calls');assert calls[0]['model']=='whisper-tiny_timestamped' and calls[0]['lang']=='hi',calls
    caps=E('__ed.clips.filter(c=>c.cap)');print([(x['text'],x['start'],x['len']) for x in caps])
    assert len(caps)==3 and caps[0]['text']=='नमस्ते दोस्तों aaj' and abs(caps[0]['start']-2.1)<.02,caps  # c.start=2 + .1
    assert caps[0]['wh']==1 and caps[0]['words'][1]['w']=='दोस्तों' and abs(caps[0]['words'][1]['s']-.6)<.02
    assert caps[1]['text']=='ka match bahut' and caps[2]['text']=='zabardast tha',caps
    assert all(2-.01<=x['start']<=5.01 and x['start']+x['len']<=5.01 for x in caps),'clip ke andar'
    # highlight follows real word times (accent: left early, right late)
    pg.evaluate("(()=>{const c=__ed.clips.filter(c=>c.cap)[0];c.ac='#ffd23f';c.y=.5;c.fs=100;__ed.render()})()")
    CNT='''()=>{const d=document.getElementById("cv").getContext("2d").getImageData(0,0,1280,720).data;let l=0,r=0;for(let i=0;i<d.length;i+=4){if(d[i]>200&&d[i+1]>170&&d[i+2]<110){((i/4)%1280<640)?l++:r++}}return[l,r]}'''
    E('__ed.setT(2.2)');pg.wait_for_timeout(120);e1=E('('+CNT+')()');E('__ed.setT(2.95)');pg.wait_for_timeout(120);e2=E('('+CNT+')()');print('accent',e1,e2)
    assert e1[0]>e1[1] and e2[1]>e2[0]
    pg.screenshot(path='/tmp/ed6.png')
    # undo removes all auto captions in one step
    E('__ed.undo()');assert len(E('__ed.clips.filter(c=>c.cap)'))==0
    # --- no audio clip -> friendly message, no crash
    E('__ed.clips.length=0;__ed.render()');pg.click('#capb');pg.click('#a_go');pg.wait_for_timeout(200);assert 'clip' in pg.inner_text('#a_msg');pg.keyboard.press('Escape')
    # --- cancel path
    E('__ed.addMedia([...__ed.media.values()][0],3,0)')
    E('window.__asrHook=()=>new Promise(r=>setTimeout(()=>r([{start:0,end:1,text:"late"}]),600))')
    pg.click('#capb');pg.click('#a_go');pg.wait_for_selector('#a_cancel',state='visible');pg.click('#a_cancel');pg.wait_for_timeout(900)
    assert len(E('__ed.clips.filter(c=>c.cap)'))==0 and pg.locator('#a_go').is_enabled(),'cancel'
    # --- JSON import via UI (file-relative times, clip in=0 start=0)
    js=[{'start':0.5,'end':1.5,'text':'json one','words':[{'word':'json','start':.5,'end':1},{'word':'one','start':1,'end':1.5}]},{'start':1.6,'end':2.4,'text':'json two'}]
    open('/tmp/t6.json','w').write(json.dumps({'segments':js}))
    with pg.expect_file_chooser() as fc:pg.click('#a_json')
    fc.value.set_files('/tmp/t6.json');pg.wait_for_function('__ed.clips.filter(c=>c.cap).length>=2');assert pg.locator('#cap').is_hidden()
    # --- real engine path without network: error message, no uncaught exception
    E('delete window.__asrHook');E('__ed.clips.filter(c=>c.cap).forEach(c=>c.cap=0)')
    pg.click('#capb');pg.click('#cap summary');pg.fill('#a_url','http://127.0.0.1:9/none.js');pg.click('#a_go');pg.wait_for_function('document.getElementById("a_msg").textContent.includes("Engine nahi chala")',timeout=15000)
    assert pg.locator('#a_go').is_enabled()
    b.close()
errs=[e for e in errs if 'Failed to load resource' not in e and 'ERR_' not in e and 'none.js' not in e]
print('ERRORS:',errs);sys.exit(1 if errs else 0)
