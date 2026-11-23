import asyncio,os,wave,io
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);ctx=await b.new_context(viewport={'width':390,'height':800},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/mA.wav');await pg.wait_for_timeout(600)
        await pg.select_option('#fmt','w16')
        # 1) single track: export = plain edit (no mix)
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;print('single-track file:',dl.suggested_filename)
        # 2) add track -> export auto mix
        await pg.evaluate("document.getElementById('mt').open=true");await pg.wait_for_timeout(300)
        await pg.set_input_files('#mtf','/tmp/mB.wav');await pg.wait_for_timeout(700)
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;path=str(await dl.path());print('multitrack file:',dl.suggested_filename,os.path.getsize(path))
        w=wave.open(path);fr=w.readframes(w.getnframes());import array;a=array.array('h');a.frombytes(fr)
        n=44100;seg=lambda i:max(abs(x) for x in a[i:i+2000])
        print('peak in 0-2s overlap region:',seg(1000),'| after track B ends (3s):',seg(3*n))
        print('main dur after export (readout):',await pg.inner_text('#tm'))
        # 3) checkbox off -> plain
        await pg.uncheck('#exm')
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;print('checkbox off:',dl.suggested_filename);await pg.check('#exm')
        T=lambda t:(lambda m,x:int(m)*60+float(x))(*t.split('|')[0].strip().split(':'))
        async def tm(): return T(await pg.inner_text('#tm'))
        # 4) seek during preview (~4s total): click at 75% -> ~3.0s, keeps playing
        await pg.click('#mtp');await pg.wait_for_timeout(1200)
        await pg.locator('#mtc').scroll_into_view_if_needed();box=await pg.locator('#mtc').bounding_box()
        await pg.mouse.click(box['x']+box['width']*0.75,box['y']+8);await pg.wait_for_timeout(250)
        print('seek@75%%: time=%.2f (expect ~3.0-3.4)'%await tm());c1=await tm();await pg.wait_for_timeout(400);print('still advancing:',await tm()>c1)
        await pg.click('#sp')
        # 5) loop whole preview: seek to 90% (~3.6s), 1.5s later must have wrapped (<3.6)
        await pg.check('#mtlp');await pg.click('#mtp');await pg.wait_for_timeout(300)
        await pg.locator('#mtc').scroll_into_view_if_needed();box=await pg.locator('#mtc').bounding_box()
        await pg.mouse.click(box['x']+box['width']*0.9,box['y']+8);await pg.wait_for_timeout(1500)
        t=await tm();print('loop: 1.5s after 90%% seek time=%.2f (wrapped if <3.6) '%t, 'WRAPPED' if t<3.6 else 'NOT wrapped')
        await pg.click('#sp');await pg.uncheck('#mtlp')
        # 6) main loop on selection 1-2s via drag on waveform
        cb=await pg.locator('#cv').bounding_box();W=cb['width']
        await pg.mouse.move(cb['x']+W*0.25,cb['y']+100);await pg.mouse.down();await pg.mouse.move(cb['x']+W*0.5,cb['y']+100,steps=5);await pg.mouse.up()
        print('selection readout:',await pg.inner_text('#tm'))
        await pg.check('#lp');await pg.click('#pl');await pg.wait_for_timeout(2600)
        t=await tm();print('main loop: 2.6s after play, time=%.2f (stays inside selection if loop works)'%t);await pg.click('#sp')
        print('JS errors',errs);await b.close()
asyncio.run(main())
