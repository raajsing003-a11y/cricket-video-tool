import asyncio,os,time,sys
from playwright.async_api import async_playwright
async def main(path):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+path)
        await pg.set_input_files('#file','/tmp/L1.wav');await pg.wait_for_timeout(3000)
        await pg.evaluate("document.getElementById('mt').open=true")
        await pg.set_input_files('#mtf','/tmp/L2.wav');await pg.wait_for_timeout(3000)
        await pg.evaluate("window.__lt=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']})")
        await pg.evaluate("window.__g=[];let l=performance.now();(function f(){const n=performance.now();window.__g.push(n-l);l=n;requestAnimationFrame(f)})()")
        t=time.time();await pg.click('#mtm')
        await pg.wait_for_function("document.getElementById('msg').textContent.includes('✔')",timeout=120000)
        el=time.time()-t;g=sorted(await pg.evaluate('window.__g'));lt=await pg.evaluate('window.__lt')
        print(os.path.basename(path),'mix %.1fs | max frame gap %d ms, >100ms: %d | longtasks(ms): %s'%(el,g[-1],sum(1 for x in g if x>100),sorted(lt)[-4:]),errs)
        await b.close()
asyncio.run(main(sys.argv[1]))
