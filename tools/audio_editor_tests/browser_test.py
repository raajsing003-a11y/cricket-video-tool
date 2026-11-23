import asyncio,math,struct,wave,sys
from playwright.async_api import async_playwright
# make test wav: 3s tone + 1s silence + 3s tone, stereo
sr=22050;fr=[]
for i in range(sr*7):
    t=i/sr; v=0 if 3<=t<4 else int(12000*math.sin(2*math.pi*(300+200*(t%1))*t))
    fr.append(struct.pack('<hh',v,v//2))
w=wave.open('/tmp/t.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(b''.join(fr));w.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':1200,'height':900})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/t.wav');await pg.wait_for_timeout(800)
        print('info',await pg.inner_text('#inf'))
        await pg.mouse.click(300,420) if False else None
        async def clk(i):
            await pg.click('#'+i);await pg.wait_for_timeout(1500);print(i,'->',await pg.inner_text('#msg'),'|',await pg.inner_text('#inf'))
        for i in ['mka','sa','cmp','gt','dse','rvb','ech','tpb','ptb','spb','an','bs','un']: await clk(i)
        await pg.select_option('#vw','spec');await pg.wait_for_timeout(800)
        await pg.screenshot(path='/tmp/spec.png')
        await pg.select_option('#vw','wave');await pg.wait_for_timeout(300)
        await pg.select_option('#fmt','m128')
        async with pg.expect_download() as d: await pg.click('#exp')
        dl=await d.value;await dl.save_as('/tmp/out.mp3');print('mp3 saved')
        await pg.screenshot(path='/tmp/wave.png')
        print('errors',errs[:5]);await b.close()
asyncio.run(main())
