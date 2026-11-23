# python3 tests/browser_test_live_export.py — live LUFS meter + export-time normalize
import asyncio,os,subprocess,sys
from playwright.async_api import async_playwright
HTML=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','base','audio_editor.html'))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':1200,'height':900},accept_downloads=True)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+HTML);await pg.set_input_files('#file','/tmp/lt.wav');await pg.wait_for_timeout(800)
        await pg.evaluate("window._gap=0;let l=performance.now();setInterval(()=>{const n=performance.now();window._gap=Math.max(window._gap,n-l-50);l=n;},50)")
        await pg.click('#pl');seen=set()
        for _ in range(14):
            await pg.wait_for_timeout(300);seen.add(await pg.inner_text('#lv'))
        print('live meter samples:',[s for s in seen if s][:4]);await pg.click('#sp');await pg.wait_for_timeout(200);print('stop ke baad lv =',repr(await pg.inner_text('#lv')))
        print('max main-thread gap ms',round(await pg.evaluate('window._gap'),1))
        await pg.select_option('#fmt','w16');await pg.select_option('#lps','-16');await pg.check('#exl')
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;await dl.save_as('/tmp/exp_norm.wav');await pg.wait_for_timeout(500);print('export ->',await pg.inner_text('#msg'));print('ERRORS',errs[:4]);await b.close()
asyncio.run(main())
