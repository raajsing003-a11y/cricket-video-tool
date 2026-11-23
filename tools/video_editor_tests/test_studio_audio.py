# run: python tools/video_editor_tests/test_studio_audio.py  (playwright + chromium; http server khud chalata hai)
import os,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/';errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'studio.html');pg.wait_for_function('STUDIO.scenes().CORE&&STUDIO.editor().__ed',timeout=30000)
    assert not pg.evaluate('document.getElementById("fa").getAttribute("src")'),'audio lazy hona chahiye'
    pg.click('#t_audio');pg.wait_for_timeout(2500)
    assert 'audio_editor.html' in pg.evaluate('document.getElementById("fa").src')
    assert pg.evaluate('document.getElementById("fa").classList.contains("off")')==False
    assert pg.evaluate('document.getElementById("fs").classList.contains("off")')==True
    bk=pg.evaluate('getComputedStyle(STUDIO.audio().document.getElementById("bk")).display');print('back link display',bk);assert bk=='none'
    assert pg.evaluate('STUDIO.audio().document.title').find('Audio Editor')>=0
    pg.click('#t_scenes');pg.wait_for_timeout(500)
    assert pg.evaluate('document.getElementById("fa").classList.contains("off")')==True
    # scenes nav link audio tab kholta hai
    pg.evaluate('STUDIO.scenes().document.querySelector("a[href=\\"#\\"]")&&0')
    clicked=pg.evaluate('(()=>{const a=[...STUDIO.scenes().document.querySelectorAll("#nav a")].find(x=>/Audio/.test(x.textContent));if(!a)return false;a.click();return true})()');print('nav audio link',clicked);assert clicked
    pg.wait_for_timeout(500);assert pg.evaluate('document.getElementById("t_audio").classList.contains("on")')
    b.close()
print('errors',errs);assert not errs;print('PASS')
