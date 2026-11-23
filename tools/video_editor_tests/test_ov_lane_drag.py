# run: python tools/video_editor_tests/test_ov_lane_drag.py  (C231: lanes ke beech drag)
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
    T("PLAYER.seek(1)");pg.click('#ovt_add');pg.wait_for_timeout(200)
    id1=T("OV.items[0].id");assert T("OV.items[0].lane")=='v2' and T("OV.items[0].vol")==0
    T("OVT.addText('Hello')");tid=T("OVT.sel");assert T("OV.get(%s).lane"%json.dumps(tid))=='t1'
    def row(r):
        box=pg.locator('#ovt_cv').bounding_box();return box['y']+T("OVT.hdr")+(r+.5)*T("OVT.rowH"),box
    def sel_and_drag(id_,r_from,r_to,dt=0):
        T("OVT.sel=%s;OVT.sync&&OVT.sync()"%json.dumps(id_));pg.wait_for_timeout(150)
        y0,box=row(r_from);it=T("OV.get(%s)"%json.dumps(id_))
        x0=box['x']+T("OVT.x0+(%s+0.5)*OVT.pps"%it['start']);y1,_=row(r_to)
        pg.mouse.move(x0,y0);pg.mouse.down();pg.mouse.move(x0+dt,(y0+y1)/2,steps=4);pg.mouse.move(x0+dt,y1,steps=4);pg.mouse.up();pg.wait_for_timeout(150)
        return T("OV.get(%s)"%json.dumps(id_))
    # v2 -> a1 (row 2): vol 0 tha -> 1
    o=sel_and_drag(id1,1,2);print('v2->a1',o['lane'],o['vol']);assert o['lane']=='a1' and o['vol']==1,o
    assert T("OV.mixNeeded()")==True,'a1 block ki awaaz mix mein'
    # a1 -> v2, vol bacha
    o=sel_and_drag(id1,2,1);print('a1->v2',o['lane'],o['vol']);assert o['lane']=='v2' and o['vol']==1,o
    # v2 -> t1 row (3): lane nahi badli
    o=sel_and_drag(id1,1,3);print('v2->t1 (raste mein a1 row)',o['lane']);assert o['lane']=='a1',o  # t1 row par chhodne se kuch nahi badalta, aakhri valid lane (a1) rehti hai
    assert T("OVT.moveLane(%s,'v2')"%json.dumps(id1))==True;assert T("OV.get(%s).lane"%json.dumps(id1))=='v2'
    # text t1 -> v2 row: t1 hi rahe
    o=sel_and_drag(tid,3,1);print('t1->v2',o['lane']);assert o['lane']=='t1',o
    # horizontal + vertical saath: start bhi badle, lane bhi
    s0=T("OV.get(%s).start"%json.dumps(id1));o=sel_and_drag(id1,1,2,dt=T("OVT.pps")*1.0);print('diag',s0,'->',o['start'],o['lane']);assert o['lane']=='a1' and o['start']-s0>.6,o
    # persist
    assert T("JSON.parse(localStorage.getItem('cvt_ov_wide')).find(x=>x.id==%s).lane"%json.dumps(id1))=='a1'
    # API guard
    assert T("OVT.moveLane(%s,'t1')"%json.dumps(id1))==False and T("OV.get(%s).lane"%json.dumps(id1))=='a1'
    assert T("OVT.moveLane(%s,'a1')"%json.dumps(tid))==False
print('errors',errs);assert not errs;print('PASS test_ov_lane_drag')
