import asyncio,numpy as np,wave
from playwright.async_api import async_playwright
async def dl(pg,name):
    await pg.select_option('#fmt','w16')
    async with pg.expect_download() as d: await pg.click('#exp')
    await (await d.value).save_as(name)
def rd(n):
    w=wave.open(n);x=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32768;return x,w.getframerate()
def band(x,sr,a,b):
    S=np.abs(np.fft.rfft(x*np.hanning(len(x))))**2;f=np.fft.rfftfreq(len(x),1/sr);return 10*np.log10(S[(f>=a)&(f<b)].sum()+1e-12)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page()
        await pg.goto('file:///mnt/user-data/outputs/audio_editor.html');await pg.set_input_files('#file','/tmp/noisy.wav');await pg.wait_for_timeout(600)
        await dl(pg,'/tmp/a0.wav')
        await pg.click('#rnb');await pg.wait_for_timeout(4000);await dl(pg,'/tmp/a1.wav')
        await pg.click('#hmb');await pg.wait_for_timeout(1500);await dl(pg,'/tmp/a2.wav')
        await b.close()
    for n in ['a0','a1','a2']:
        x,sr=rd(f'/tmp/{n}.wav');print(n,'voice150-600 %.1f dB | hum 45-55 %.1f dB | hiss 3k-10k %.1f dB'%(band(x,sr,150,600),band(x,sr,45,55),band(x,sr,3000,10000)))
asyncio.run(main())
