# python3 tests/browser_test_enhance.py  — playwright chahiye. CDN request local df_bg.wasm se serve hoti hai.
import asyncio,math,struct,wave,os,random,time
from playwright.async_api import async_playwright
BASE=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','base');HTML=os.path.join(BASE,'audio_editor.html');WASM=open(os.path.join(BASE,'df_bg.wasm'),'rb').read()
sr=44100;random.seed(3);fr=[]
for i in range(sr*8):
    t=i/sr;env=max(0,math.sin(2*math.pi*2*t));f0=130+20*math.sin(2*math.pi*.5*t);v=sum(math.sin(2*math.pi*f0*h*t+h)/h for h in range(1,13))*0.22*env+random.uniform(-.1,.1)
    s=int(32767*max(-1,min(1,v)));fr.append(struct.pack('<hh',s,s))
w=wave.open('/tmp/en.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(b''.join(fr));w.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);ctx=await b.new_context(viewport={'width':1200,'height':1200});pg=await ctx.new_page()
        hits=[]
        async def serve(route):
            hits.append(route.request.url);await route.fulfill(status=200,body=WASM,headers={'content-type':'application/wasm','content-length':str(len(WASM)),'access-control-allow-origin':'*'})
        await ctx.route('https://cdn.jsdelivr.net/**',serve)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'df_bg.wasm' not in m.text and 'ERR_FILE' not in m.text else None)
        await pg.goto('file://'+os.path.abspath(HTML));await pg.set_input_files('#file','/tmp/en.wav');await pg.wait_for_timeout(800)
        await pg.click('#lm');await pg.wait_for_timeout(1200);print('pehle  ->',await pg.inner_text('#msg'))
        t=time.time();await pg.click('#aeb')
        # UI free rehni chahiye: kaam ke dauran dusre button ka click turant chale
        await pg.wait_for_timeout(1500);t1=time.time();await pg.click('#mka');print('UI response during job: %.0f ms'%((time.time()-t1)*1000))
        await pg.wait_for_function("document.getElementById('aeb').disabled===false",timeout=120000)
        print('enhance ->',await pg.inner_text('#msg'),'| %.1fs'%(time.time()-t));print(await pg.inner_text('#aetx'))
        await pg.click('#lm');await pg.wait_for_timeout(1200);print('baad   ->',await pg.inner_text('#msg'))
        await pg.screenshot(path='/tmp/enh.png')
        await pg.keyboard.press('Control+z');await pg.wait_for_timeout(400);await pg.click('#lm');await pg.wait_for_timeout(1200);print('undo   ->',await pg.inner_text('#msg'))
        # Podcast Ready (poori chain)
        await pg.click('#pr');await pg.wait_for_timeout(500);await pg.wait_for_function("document.getElementById('msg').innerText.includes('Podcast Ready')",timeout=120000);await pg.click('#lm');await pg.wait_for_timeout(1200);print('podcast ready ->',await pg.inner_text('#msg'))
        await pg.keyboard.press('Control+z');await pg.keyboard.press('Control+z');await pg.wait_for_timeout(300)
        # Best + DeepFilter option
        await pg.check('#bsd');await pg.click('#bs');await pg.wait_for_function("document.getElementById('msg').innerText.includes('Best ho gaya')||document.getElementById('msg').innerText.includes('fail')",timeout=180000);print('best+DFN ->',await pg.inner_text('#msg'))
        await pg.keyboard.press('Control+z');await pg.wait_for_timeout(300)
        # cancel test
        await pg.click('#aeb');await pg.wait_for_timeout(1200);await pg.click('#aex');await pg.wait_for_function("document.getElementById('aeb').disabled===false",timeout=60000);print('cancel ->',await pg.inner_text('#msg'))
        print('CDN hits',len(hits),'ERRORS',errs[:5]);await b.close()
asyncio.run(main())
