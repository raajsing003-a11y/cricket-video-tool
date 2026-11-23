import asyncio,math,struct,wave,array,os
from playwright.async_api import async_playwright
sr=22050
w=wave.open('/tmp/st.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr)
w.writeframes(b''.join(struct.pack('<hh',int(10000*math.sin(2*math.pi*300*i/sr)),int(1000*math.sin(2*math.pi*300*i/sr))) for i in range(sr*4)));w.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/st.wav');await pg.wait_for_timeout(600)
        await pg.evaluate("document.getElementById('mt').open=true");await pg.wait_for_timeout(300)
        async def run(vals,name,checks=()):
            for a,v in vals.items():
                l=pg.locator('.mtr').nth(0).locator('[data-a=%s]'%a);await l.fill(str(v));await l.dispatch_event('change')
            for a in checks:
                await pg.locator('.mtr').nth(0).locator('[data-a=%s]'%a).check()
            await pg.click('#mtm');await pg.wait_for_function("document.getElementById('msg').textContent.includes('✔')",timeout=30000)
            await pg.select_option('#fmt','w16')
            async with pg.expect_download() as d: await pg.click('#exp')
            dl=await d.value;await dl.save_as('/tmp/e.wav');w=wave.open('/tmp/e.wav');n=w.getnframes();s=w.getframerate();a=array.array('h');a.frombytes(w.readframes(n));w.close()
            rm=lambda c:math.sqrt(sum(a[i*2+c]**2 for i in range(s,3*s))/(2*s))
            L,R=rm(0),rm(1);print(name,'-> L %+.1f dB, R %+.1f dB (ref L 7071, R 707)'%(20*math.log10(L/7071),20*math.log10(R/707.1)))
            await pg.click('#un');await pg.wait_for_timeout(300);await pg.evaluate("document.getElementById('msg').textContent=''")
            for a in checks: await pg.locator('.mtr').nth(0).locator('[data-a=%s]'%a).uncheck()
            for a in vals: 
                l=pg.locator('.mtr').nth(0).locator('[data-a=%s]'%a);await l.fill('0' if a!='cr' else '3');await l.dispatch_event('change')
        await run({'eq0':12},'Low shelf +12dB @200Hz (300Hz tone: boost)')
        await run({'eq1':-12},'Mid bell -12dB @1k (300Hz: little change)')
        await run({'eq2':12},'High shelf +12dB @4k (300Hz: ~0)')
        await run({'ct':-20,'cr':4},'Compressor UNLINKED thr-20 r4 (L reduced, R untouched)')
        await run({'ct':-20,'cr':4},'Compressor LINKED (R reduced like L)',checks=('cl',))
        print('JS errors',errs);await b.close()
asyncio.run(main())
