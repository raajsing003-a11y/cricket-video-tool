# run: python tools/video_editor_tests/test_studio_editor_overlay.py  (C222: Scenes -> Editor overlay, tab badle bina)
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
    pg.goto(base+'studio.html');pg.wait_for_function('STUDIO.scenes().CORE&&STUDIO.scenes().SE&&STUDIO.editor().__ed',timeout=30000)
    pg.wait_for_function('STUDIO.scenes().document.getElementById("ci_tl")',timeout=10000)
    cls=lambda i:pg.evaluate(f'document.getElementById("{i}").className')
    assert not pg.evaluate('STUDIO.editor().__ed.hasSc()')
    pg.evaluate('STUDIO.scenes().document.getElementById("ci_tl").click()')
    pg.wait_for_function('STUDIO.editor().__ed.hasSc()',timeout=20000)
    print('fe',cls('fe'),'fs',cls('fs'))
    assert 'ov' in cls('fe') and 'off' not in cls('fe') and 'off' not in cls('fs')
    assert 'on' in pg.evaluate('document.getElementById("t_scenes").className')
    assert 'Timeline' in pg.evaluate('document.getElementById("ovx").textContent')
    pg.click('#ovx');assert 'ov' not in cls('fe') and 'off' in cls('fe') and 'off' not in cls('fs')
    # dobara kholo: update (live clip dobara), band
    pg.evaluate('STUDIO.scenes().document.getElementById("ci_tl").click()');pg.wait_for_timeout(1500);assert 'ov' in cls('fe')
    pg.click('#ovx');assert 'off' in cls('fe')
    # Editor tab ab bhi poori screen
    pg.click('#t_editor');assert 'off' not in cls('fe') and 'ov' not in cls('fe')
print('errors',errs);assert not errs;print('PASS test_studio_editor_overlay')
