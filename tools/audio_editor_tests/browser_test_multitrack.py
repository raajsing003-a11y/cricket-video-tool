import asyncio,math,struct,wave,os
from playwright.async_api import async_playwright
def mk(path,freq,sec,amp,sr=22050,mono=True):
    w=wave.open(path,'wb');w.setnchannels(1 if mono else 2);w.setsampwidth(2);w.setframerate(sr)
    fr=[]
    for i in range(int(sr*sec)):
        v=int(amp*math.sin(2*math.pi*freq*i/sr));fr.append(struct.pack('<h',v) if mono else struct.pack('<hh',v,v))
    w.writeframes(b''.join(fr));w.close()
mk('/tmp/mA.wav',300,4,10000);mk('/tmp/mB.wav',1000,2,10000,sr=44100)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/mA.wav');await pg.wait_for_timeout(600)
        await pg.evaluate("document.getElementById('mt').open=true");await pg.wait_for_timeout(400)
        await pg.set_input_files('#mtf','/tmp/mB.wav');await pg.wait_for_timeout(700)
        print('rows',await pg.locator('.mtr').count(),'|',await pg.inner_text('#msg'))
        # track2: start 1.0s, pan +100 (right only), vol 50
        r=pg.locator('.mtr').nth(1)
        await r.locator('[data-a=o]').fill('1');await r.locator('[data-a=o]').dispatch_event('change')
        r=pg.locator('.mtr').nth(1)
        await r.locator('[data-a=p]').fill('100');await r.locator('[data-a=p]').dispatch_event('change')
        r=pg.locator('.mtr').nth(1)
        await r.locator('[data-a=v]').fill('50');await r.locator('[data-a=v]').dispatch_event('change')
        # drag lane of track 2 by +~60px
        await pg.locator('#mtc').scroll_into_view_if_needed();await pg.wait_for_timeout(200)
        box=await pg.locator('#mtc').bounding_box()
        await pg.mouse.move(box['x']+box['width']*0.4,box['y']+box['height']*0.75);await pg.mouse.down();await pg.mouse.move(box['x']+box['width']*0.4+30,box['y']+box['height']*0.75,steps=4);await pg.mouse.up()
        print('off after drag (was 1.00, should change)',await pg.locator('.mtr').nth(1).locator('[data-a=o]').input_value())
        await pg.locator('.mtr').nth(1).locator('[data-a=o]').fill('1');await pg.locator('.mtr').nth(1).locator('[data-a=o]').dispatch_event('change')
        await pg.screenshot(path='/tmp/mt.png')
        print('overflow-x',await pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth"))
        await pg.click('#mtp');await pg.wait_for_timeout(500);print('play msg',await pg.inner_text('#msg'))
        await pg.click('#sp')
        await pg.click('#mtm');await pg.wait_for_timeout(800);print('mix msg',await pg.inner_text('#msg'),'|',await pg.inner_text('#inf'),'| rows',await pg.locator('.mtr').count())
        # measure: export WAV 16 and inspect
        await pg.select_option('#fmt','w16')
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;await dl.save_as('/tmp/mt_out.wav')
        w=wave.open('/tmp/mt_out.wav');nc,sr,n=w.getnchannels(),w.getframerate(),w.getnframes();raw=w.readframes(n);w.close()
        import array;a=array.array('h');a.frombytes(raw)
        def rms(ch,t0,t1):
            xs=[a[i*nc+ch] for i in range(int(t0*sr),int(t1*sr))];return math.sqrt(sum(x*x for x in xs)/len(xs))
        print('ch',nc,'sr',sr,'dur',round(n/sr,2))
        print('0-1s  L,R rms',round(rms(0,0.2,0.9)),round(rms(1,0.2,0.9)),'(main 300Hz both ~7071)')
        print('1.2-2.8s L,R rms',round(rms(0,1.2,2.8)),round(rms(1,1.2,2.8)),'(L main ~7071, R main+B should be larger)')
        await pg.click('#un');await pg.wait_for_timeout(400);print('undo ->',await pg.inner_text('#inf'))
        print('JS errors:',errs)
        await b.close()
asyncio.run(main())
