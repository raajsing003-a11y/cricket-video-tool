# run: python tools/video_editor_tests/test_segedit_label.py (C210: purana AUDIOED ka label + open)
import os,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start();errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1500,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/index.html?solo=1');pg.wait_for_function('window.AUDIOED&&window.AT',timeout=30000)
    pg.evaluate('(()=>{const ac=new AudioContext(),sr=ac.sampleRate,b=ac.createBuffer(1,sr*2,sr);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=.5*Math.sin(i/20);AT.add("t",b,0);})()')
    pg.wait_for_timeout(900)
    t=pg.evaluate('[...document.querySelectorAll("#aed_btn,#aed_btn2")].map(x=>x.textContent)');print(t);assert t and all('Segment Edit' in x for x in t)
    pg.evaluate('AUDIOED.open(0)');pg.wait_for_timeout(500)
    h=pg.evaluate('document.querySelector("h3")&&[...document.querySelectorAll("h3")].map(x=>x.textContent).join("|")');print(h);assert 'Segment Edit' in h
    print('errors',errs);assert not errs;print('SEGEDIT OK')
