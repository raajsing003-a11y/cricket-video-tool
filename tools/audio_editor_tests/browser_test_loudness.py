# python3 tests/browser_test_loudness.py [html_path]  — playwright chahiye
import asyncio,math,struct,wave,sys,os,re
from playwright.async_api import async_playwright
HTML=sys.argv[1] if len(sys.argv)>1 else os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')
sr=48000;fr=[]
# 8s stereo 1kHz -23 dBFS (=-23 LUFS) + 4s -33 dBFS : integrated ~ -24..-23
for i in range(sr*12):
    t=i/sr;a=10**(-23/20) if t<8 else 10**(-33/20);v=int(32767*a*math.sin(2*math.pi*1000*t));fr.append(struct.pack('<hh',v,v))
w=wave.open('/tmp/lt.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(b''.join(fr));w.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':1200,'height':1100})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+os.path.abspath(HTML))
        await pg.set_input_files('#file','/tmp/lt.wav');await pg.wait_for_timeout(800)
        await pg.click('#lm');await pg.wait_for_timeout(1500);m1=await pg.inner_text('#msg');print('meter ->',m1)
        print(await pg.inner_text('#lgrid'));print(await pg.inner_text('#lnote'))
        await pg.screenshot(path='/tmp/lufs_meter.png')
        await pg.select_option('#lps','-14');print('target input =',await pg.input_value('#lt'))
        await pg.click('#ln');await pg.wait_for_timeout(2500);m2=await pg.inner_text('#msg');print('normalize ->',m2)
        await pg.click('#lm');await pg.wait_for_timeout(1500);m3=await pg.inner_text('#msg');print('re-meter ->',m3)
        await pg.screenshot(path='/tmp/lufs_after.png')
        # undo
        await pg.keyboard.press('Control+z');await pg.wait_for_timeout(500);await pg.click('#lm');await pg.wait_for_timeout(1500);print('undo ke baad ->',await pg.inner_text('#msg'))
        # selection-only + Apna custom
        await pg.fill('#lt','-18');print('preset ->',await pg.input_value('#lps'))
        ok=re.search(r'(-?\d+\.\d) LUFS',m3);print('ERRORS',errs[:5]);await b.close()
asyncio.run(main())
