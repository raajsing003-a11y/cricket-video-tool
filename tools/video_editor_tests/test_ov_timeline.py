# run: python tools/video_editor_tests/test_ov_timeline.py  (C224: Overlay timeline UI)
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
    pg.click('#ovt_btn');assert T("OVT.open") and pg.is_visible('#ovt_cv')
    assert 't.webm' in T("document.getElementById('ovt_clip').innerHTML"),'clip list'
    # playhead 1s par jodo
    T("PLAYER.seek(1)");pg.click('#ovt_add');pg.wait_for_timeout(200)
    assert T("OV.items.length")==1 and abs(T("OV.items[0].start")-1)<.15,T("OV.items[0]")
    assert T("OVT.sel")==T("OV.items[0].id")
    # canvas par block ka rang: v2 lane center
    pg.evaluate("document.getElementById('tgFab')&&(document.getElementById('tgFab').style.display='none')");box=pg.locator('#ovt_cv').bounding_box()
    def px(t):
        return T("""(t=>{const c=document.getElementById('ovt_cv'),d=window.devicePixelRatio||1,x=Math.round((OVT.x0+t*OVT.pps)*d),y=Math.round((OVT.hdr+OVT.rowH+OVT.rowH-6)*d);const g=c.getContext('2d').getImageData(x,y,1,1).data;return[g[0],g[1],g[2]]})(%s)"""%t)
    inside=px(1.5);empty=px(T("CORE.total")-.5);print('px inside/empty',inside,empty);assert inside!=empty,'block draw nahi hua'
    # drag: block ko +2s right
    st0=T("OV.items[0].start");y=box['y']+22+34+17;x0=box['x']+T("OVT.x0+(OV.items[0].start+0.5)*OVT.pps");dx=2*T("OVT.pps")
    pg.mouse.move(x0,y);pg.mouse.down();pg.mouse.move(x0+dx/2,y,steps=4);pg.mouse.move(x0+dx,y,steps=4);pg.mouse.up()
    st1=T("OV.items[0].start");print('drag',st0,'->',st1);assert 1.5<st1-st0<2.5,'drag nahi hua'
    assert T("JSON.parse(localStorage.getItem('cvt_ov_wide'))[0].start")==st1,'persist'
    # ruler click = seek
    box=pg.locator('#ovt_cv').bounding_box();tt=T('CORE.total');tgt=round(tt*0.5,1);pg.mouse.click(box['x']+T('OVT.x0+%s*OVT.pps'%tgt),box['y']+10);print('total',tt,'seek',tgt,T('PLAYER.t'));assert abs(T('PLAYER.t')-tgt)<.2
    # props (canvas select hone par neeche khisak sakta hai -> y dobara nikalo)
    box=pg.locator('#ovt_cv').bounding_box();y=box['y']+22+34+17
    pg.mouse.click(box['x']+T("OVT.x0+(OV.items[0].start+0.5)*OVT.pps"),y);assert T("OVT.sel")
    pg.fill('#ovt_vol','150');pg.dispatch_event('#ovt_vol','change');assert abs(T("OV.items[0].vol")-1.5)<1e-6
    pg.fill('#ovt_spd','2');pg.dispatch_event('#ovt_spd','change');assert T("OV.items[0].speed")==2
    pg.select_option('#ovt_fit','full');assert T("OV.items[0].fit")=='full'
    # delete
    pg.click('#ovt_del');assert T("OV.items.length")==0
    pg.click('#ovt_btn');assert not T("OVT.open")
print('errors',errs);assert not errs;print('PASS test_ov_timeline')
