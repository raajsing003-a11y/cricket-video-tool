import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/mA.wav');await pg.wait_for_timeout(600)
        await pg.evaluate("document.getElementById('mt').open=true");await pg.wait_for_timeout(300)
        await pg.set_input_files('#mtf','/tmp/mB.wav');await pg.wait_for_timeout(700)   # 2s 1kHz at 0s
        await pg.click('#mtp');await pg.wait_for_timeout(2200)
        lv1=await pg.inner_text('#lv');tm1=await pg.inner_text('#tm')
        await pg.wait_for_timeout(700);lv2=await pg.inner_text('#lv');tm2=await pg.inner_text('#tm')
        print('live meter during preview:',repr(lv1),'->',repr(lv2));print('time readout:',tm1,'->',tm2)
        await pg.click('#sp');await pg.wait_for_timeout(300);print('after stop meter:',repr(await pg.inner_text('#lv')))
        # main play meter still works
        await pg.click('#pl');await pg.wait_for_timeout(1800);print('main play meter:',repr(await pg.inner_text('#lv')));await pg.click('#sp')
        print('JS errors',errs);await b.close()
asyncio.run(main())
