import asyncio,math,struct,wave,random
from playwright.async_api import async_playwright
sr=22050;random.seed(1);fr=[]
for i in range(sr*6):
    t=i/sr;sp=int(9000*(math.sin(2*math.pi*180*t)+0.5*math.sin(2*math.pi*540*t))*(0.5+0.5*math.sin(2*math.pi*3*t)))
    n=int(random.gauss(0,1500)+2500*math.sin(2*math.pi*50*t))
    v=max(-32768,min(32767,sp+n));fr.append(struct.pack('<h',v))
w=wave.open('/tmp/noisy.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(b''.join(fr));w.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1200,'height':900});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file:///mnt/user-data/outputs/audio_editor.html');await pg.set_input_files('#file','/tmp/noisy.wav');await pg.wait_for_timeout(600)
        async def rms():return await pg.evaluate("""()=>{}""")
        for i in ['rnb','hmb','hpb','lpb','bs','un']:
            await pg.click('#'+i);await pg.wait_for_timeout(3500 if i=='rnb' else 1500);print(i,'->',await pg.inner_text('#msg'),'|',await pg.inner_text('#inf'))
        # measure noise floor with before/after via export wav download
        print('errors',errs[:4]);await b.close()
asyncio.run(main())
