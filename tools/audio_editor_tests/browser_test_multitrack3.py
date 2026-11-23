import asyncio,math,wave,array,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/mA.wav');await pg.wait_for_timeout(600)   # 300Hz mono 4s
        await pg.evaluate("document.getElementById('mt').open=true");await pg.wait_for_timeout(300)
        async def run(lc,hc,name):
            for a,v in (('lc',lc),('hc',hc)):
                l=pg.locator('.mtr').nth(0).locator('[data-a=%s]'%a);await l.fill(str(v));await l.dispatch_event('change')
            await pg.click('#mtm');await pg.wait_for_function("document.getElementById('msg').textContent.includes('✔')",timeout=30000)
            await pg.select_option('#fmt','w16')
            async with pg.expect_download() as d: await pg.click('#exp')
            dl=await d.value;await dl.save_as('/tmp/f.wav');w=wave.open('/tmp/f.wav');n=w.getnframes();sr=w.getframerate();a=array.array('h');a.frombytes(w.readframes(n));w.close()
            r=math.sqrt(sum(x*x for x in a[sr:3*sr])/(2*sr));print(name,'rms',round(r),'(no filter = 7071)')
            await pg.click('#un');await pg.wait_for_timeout(300);await pg.evaluate("document.getElementById('msg').textContent=''")
        await run(2000,0,'Low-cut 2000Hz (300Hz tone should drop)')
        await run(0,100,'High-cut 100Hz (300Hz tone should drop)')
        await run(100,2000,'Band 100-2000Hz (300Hz tone should pass)')
        print('JS errors',errs);await b.close()
asyncio.run(main())
