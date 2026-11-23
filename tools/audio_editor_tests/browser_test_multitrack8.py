import asyncio,os
from playwright.async_api import async_playwright
T=lambda t:(lambda m,x:int(m)*60+float(x))(*t.split('|')[0].strip().split(':'))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);ctx=await b.new_context(viewport={'width':390,'height':800},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','base','audio_editor.html')))
        await pg.set_input_files('#file','/tmp/mA.wav');await pg.wait_for_timeout(600);await pg.select_option('#fmt','w16')
        tm=lambda: pg.inner_text('#tm')
        await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');print('2x Right ->',await tm())
        await pg.keyboard.press('Shift+ArrowRight');print('Shift+Right ->',await tm())
        await pg.keyboard.press('ArrowLeft');print('Left ->',await tm())
        await pg.keyboard.press('Alt+ArrowLeft');print('Alt+Left (0.1s) ->',await tm())
        await pg.keyboard.press('Home');print('Home ->',await tm())
        await pg.keyboard.press('End');print('End ->',await tm())
        await pg.keyboard.press('Home');await pg.keyboard.press('Space');await pg.wait_for_timeout(500)
        await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(200)
        print('seek while playing (expect ~2.5-3.0):',await tm());await pg.keyboard.press('Space')
        await pg.keyboard.press('l');print('L toggled lp:',await pg.is_checked('#lp'));await pg.keyboard.press('l')
        # markers split with tracks mix
        await pg.evaluate("document.getElementById('mt').open=true");await pg.set_input_files('#mtf','/tmp/mB.wav');await pg.wait_for_timeout(700)
        await pg.keyboard.press('Home');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('m')  # marker at 2s
        names=[]
        pg.on('download',lambda d:names.append(d.suggested_filename))
        await pg.click('#mkn');await pg.wait_for_timeout(2500);print('split files:',names)
        print('JS errors',errs);await b.close()
asyncio.run(main())
