# run: python tools/video_editor_tests/test_ov_timeline2.py  (C225: trim / split / zoom)
import os,json,subprocess,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
here=os.path.dirname(os.path.abspath(__file__));clipf=os.path.join(here,'_clip_tmp.webm')
if not os.path.exists(clipf):
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','testsrc=size=640x360:rate=25:duration=6','-f','lavfi','-i','sine=frequency=440:duration=6','-c:v','libvpx','-b:v','500k','-c:a','libopus','-shortest',clipf],check=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k):super().__init__(*a,directory=root,**k)
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.daemon_threads=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),Q);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{port}/';errs=[]
scenes=json.load(open(os.path.join(root,'docs','example_scenes_8.json')))[:3]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1500,'height':1500})
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)));pg.on('console',lambda m:m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
    pg.goto(base+'index.html?solo=1');pg.wait_for_function('window.CORE&&window.OV&&window.OVT',timeout=30000)
    pg.evaluate("""async([u,s])=>{localStorage.clear();const r=await fetch(u),bl=await r.blob();await CORE.clipAdd(new File([bl],'t.webm',{type:'video/webm'}));CORE.setScenes(s);document.getElementById('bar2').style.display='';OV.items=[];}""",['tools/video_editor_tests/_clip_tmp.webm',scenes]);pg.wait_for_timeout(1200)
    T=lambda x:pg.evaluate(x)
    pg.click('#ovt_btn');assert T("OVT.open")
    pg.evaluate("document.getElementById('tgFab')&&(document.getElementById('tgFab').style.display='none')")
    T("OV.add({start:2,len:4,clip:'t.webm',in:1,fit:'pip'})");T("OVT.sel=OV.items[0].id;OVT.sync()")
    BOX=lambda:pg.locator('#ovt_cv').bounding_box()
    Y=lambda b:b['y']+22+34+17
    X=lambda b,t:b['x']+T("OVT.x0+%s*OVT.pps"%t)
    pps=T("OVT.pps")
    # right trim: end (6s) ko -1s
    b=BOX();pg.mouse.move(X(b,6)-2,Y(b));pg.mouse.down();pg.mouse.move(X(b,5.5),Y(b),steps=4);pg.mouse.move(X(b,5)-2+2,Y(b),steps=4);pg.mouse.up()
    o=T("OV.items[0]");print('right trim',o['start'],o['len'],o['in']);assert 2.5<o['len']<3.5 and abs(o['start']-2)<1e-6 and abs(o['in']-1)<1e-6,'right trim'
    # left trim: start (2s) ko +1s
    b=BOX();pg.mouse.move(X(b,2)+2,Y(b));pg.mouse.down();pg.mouse.move(X(b,2.5),Y(b),steps=4);pg.mouse.move(X(b,3)+2-2,Y(b),steps=4);pg.mouse.up()
    o2=T("OV.items[0]");print('left trim',o2['start'],o2['len'],o2['in']);assert 2.6<o2['start']<3.4 and abs((o2['start']+o2['len'])-(o['start']+o['len']))<1e-6,'end wahi rehna chahiye'
    assert abs(o2['in']-(1+(o2['start']-2)))<1e-6,'in left trim se badhna chahiye'
    # content continuity: left trim ke baad bhi end ka frame wahi (timeAt)
    e=o['start']+o['len']-.01;assert abs(T("OV.timeAt(OV.items[0],%s)"%e)-(1+o['len']-.01))<.02
    # split (normal)
    T("OV.update(OV.items[0].id,{start:2,len:4,in:1,rev:false,speed:1})");T("PLAYER.seek(3.5)");pg.click('#ovt_split')
    assert T("OV.items.length")==2;a,c=T("OV.items[0]"),T("OV.items[1]");print('split',a['len'],c['start'],c['len'],c['in'])
    assert abs(a['len']-1.5)<.05 and abs(c['start']-3.5)<.05 and abs(a['len']+c['len']-4)<1e-6 and abs(c['in']-(1+a['len']))<1e-6
    assert abs(T("OV.timeAt(OV.items[0],3.499)")-T("OV.timeAt(OV.items[1],3.501)"))<.02,'split continuity'
    # split (ulti + speed 2)
    T("OV.items.slice().forEach(x=>OV.del(x.id));OV.add({start:1,len:2,clip:'t.webm',in:0.5,speed:2,rev:true})");T("OVT.sel=OV.items[0].id");T("PLAYER.seek(2)");T("OVT.split()")
    assert T("OV.items.length")==2;print('rev split',T("OV.timeAt(OV.items[0],1.999)"),T("OV.timeAt(OV.items[1],2.001)"))
    assert abs(T("OV.timeAt(OV.items[0],1.999)")-T("OV.timeAt(OV.items[1],2.001)"))<.05,'rev split continuity'
    # trim limits: right trim clip dur se zyada nahi
    id0=T("OV.items[0].id");T("OVT.trim('%s','r',40,Object.assign({},OV.get('%s')))"%(id0,id0));o=T("OV.items[0]");assert o['in']>=0 and (o['in']+o['len']*o['speed'])<=6.0+1e-6,o
    # zoom
    w0=T("document.getElementById('ovt_cv').clientWidth");pg.click('#ovt_zi');w1=T("document.getElementById('ovt_cv').clientWidth");print('zoom',w0,w1);assert w1>w0*1.9
    pg.click('#ovt_zo');assert abs(T("document.getElementById('ovt_cv').clientWidth")-w0)<2
    T("OV.items.slice().forEach(x=>OV.del(x.id))")
print('errors',errs);assert not errs;print('PASS test_ov_timeline2')
