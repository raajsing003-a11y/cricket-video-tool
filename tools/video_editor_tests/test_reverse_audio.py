# run: python tools/video_editor_tests/test_reverse_audio.py  (C215: reverse clip ki awaaz export mix mein ulti)
import os,subprocess
from playwright.sync_api import sync_playwright
RAMP='/tmp/test_ramp.wav'
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i',"aevalsrc=0.9*t/3*sin(2*PI*440*t):d=3:s=44100",RAMP],check=True)
f='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','video_editor.html'))
errs=[]
RMS='''async(set)=>{const m=[...__ed.media.values()][0];__ed.addMedia(m,3,0);const c=__ed.clips[0];Object.assign(c,set);const r=(await __ed.mixAudio(3.2,null)).r;const d=r.getChannelData(0),sr=r.sampleRate;const rms=(a,b)=>{let s=0,n=0;for(let i=a*sr|0;i<b*sr;i++){s+=d[i]*d[i];n++}return Math.sqrt(s/n)};return{a:rms(0.1,0.6),z:rms(2.3,2.8),len:c.len}}'''
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1400,'height':860})
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(f);pg.set_input_files('#file',[RAMP]);pg.wait_for_function('__ed.media.size==1',timeout=15000)
    fw=pg.evaluate(RMS,{});print('forward',fw);assert fw['z']>fw['a']*3
    pg.evaluate('()=>{__ed.clips.length=0}')
    rv=pg.evaluate(RMS,{'rv':1});print('reverse',rv);assert rv['a']>rv['z']*3 and rv['a']>0.1
    pg.evaluate('()=>{__ed.clips.length=0}')
    r2=pg.evaluate(RMS,{'rv':1,'sp':2,'len':1.5});print('reverse 2x',r2)
    assert r2['a']>0.1
    print('errors',errs);assert not errs;print('REVERSE AUDIO OK')
