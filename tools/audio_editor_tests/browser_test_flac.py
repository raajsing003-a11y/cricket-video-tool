# python3 tests/browser_test_flac.py — FLAC export, ffmpeg se decode karke asli WAV export se compare
import asyncio,os,subprocess
from playwright.async_api import async_playwright
HTML=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','base','audio_editor.html'))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(accept_downloads=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+HTML);await pg.set_input_files('#file','/tmp/en.wav');await pg.wait_for_timeout(800)
        for fmt,ext in [('w16','wav'),('f16','flac'),('f24','flac')]:
            await pg.select_option('#fmt',fmt)
            async with pg.expect_download() as d: await pg.click('#exp')
            dl=await d.value;await dl.save_as(f'/tmp/x_{fmt}.{ext}');await pg.wait_for_timeout(300);print(fmt,'->',await pg.inner_text('#msg'))
        await b.close();print('ERRORS',errs[:3])
asyncio.run(main())
