import asyncio,math,wave,array,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/mA.wav');await pg.wait_for_timeout(600)   # 4s 300Hz mono
        await pg.evaluate("document.getElementById('mt').open=true");await pg.wait_for_timeout(300)
        await pg.set_input_files('#mtf','/tmp/mB.wav');await pg.wait_for_timeout(700)    # 2s 1kHz, start 0
        async def setv(row,a,v):
            l=pg.locator('.mtr').nth(row).locator('[data-a=%s]'%a);await l.fill(str(v));await l.dispatch_event('change')
        await setv(1,'o',1);await setv(1,'p',100);await setv(1,'fi',0.5)
        # cursor at ~1.5s: click waveform
        cv=pg.locator('#cv');await cv.scroll_into_view_if_needed();bb=await cv.bounding_box()
        await pg.mouse.click(bb['x']+bb['width']*1.5/4,bb['y']+100)
        await pg.locator('.mtr').nth(1).locator('[data-a=sp]').click();await pg.wait_for_timeout(200)
        print('rows after split',await pg.locator('.mtr').count(),'|',await pg.inner_text('#msg'))
        print('part2 start/trim',[await pg.locator('.mtr').nth(2).locator('[data-a=%s]'%a).input_value() for a in ('o','ts','te')])
        await pg.click('#mtm');await pg.wait_for_timeout(1500);print(await pg.inner_text('#msg'))
        await pg.select_option('#fmt','w16')
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;await dl.save_as('/tmp/mt2.wav')
        w=wave.open('/tmp/mt2.wav');nc,sr,n=w.getnchannels(),w.getframerate(),w.getnframes();a=array.array('h');a.frombytes(w.readframes(n));w.close()
        rms=lambda ch,t0,t1:math.sqrt(sum(a[i*nc+ch]**2 for i in range(int(t0*sr),int(t1*sr)))/int((t1-t0)*sr))
        print('R 1.00-1.10 (fade start, low):',round(rms(1,1.0,1.1)),'| R 1.6-1.9 (part2, B+main):',round(rms(1,1.6,1.9)),'| R 2.2-2.9:',round(rms(1,2.2,2.9)),'| R 3.2-3.9 (main only ~7071):',round(rms(1,3.2,3.9)))
        await pg.click('#un');await pg.wait_for_timeout(300);print('undo ->',await pg.inner_text('#inf'))
        print('overflow-x',await pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth"),'JS errors:',errs)
        await pg.screenshot(path='/tmp/mt2.png');await b.close()
asyncio.run(main())
