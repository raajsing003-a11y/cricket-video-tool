# run: python tools/video_editor_tests/test_ov_trans.py  (C227: transition + ripple)
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
    # --- transition (render pixel diff, poori canvas) ---
    T("OV.items.slice().forEach(q=>OV.del(q.id))")
    o=T("OV.add({start:1,len:4,clip:'t.webm',in:0,fit:'pip'})");assert o['tr']=='none' and abs(o['trDur']-.4)<1e-9
    T("(()=>{const cv=document.createElement('canvas');cv.width=CORE.W;cv.height=CORE.H;CORE.render(cv.getContext('2d'),2)})()");pg.wait_for_timeout(900)
    img=lambda tt:T("""(async()=>{const cv=document.createElement('canvas');cv.width=CORE.W;cv.height=CORE.H;const x=cv.getContext('2d');CORE.render(x,%s);await new Promise(r=>setTimeout(r,350));CORE.render(x,%s);const d=x.getImageData(0,0,CORE.W,CORE.H).data;let h=0;for(let i=0;i<d.length;i+=4*7)h+=d[i]*3+d[i+1]*5+d[i+2]*7;return h})()"""%(tt,tt))
    id0=o['id'];T("OV.update('%s',{trDur:1})"%id0)
    base_start=img(1.05);base_mid=img(3)
    res={}
    for tr in ('fade','slide','zoom','wipe'):
        T("OV.update('%s',{tr:'%s'})"%(id0,tr));a,m=img(1.05),img(3);res[tr]=(a,m);print(tr,'start diff',abs(a-base_start),'mid diff',abs(m-base_mid))
        assert abs(a-base_start)>20000,tr+' shuru par transition nahi dikhi';assert abs(m-base_mid)<1,tr+' beech mein asar nahi hona chahiye'
        end=img(4.95);assert abs(end-img(4.95))==0
        T("OV.update('%s',{tr:'none'})"%id0);assert abs(img(4.95)-base_mid)>=0
    # C232 wipe: beech mein left hissa overlay, right hissa neeche ka scene (alpha 1, fade nahi)
    T("OV.update('%s',{fit:'full',tr:'none',trDur:1})"%id0)
    pxs=lambda tt:T("""(async()=>{const cv=document.createElement('canvas');cv.width=CORE.W;cv.height=CORE.H;const x=cv.getContext('2d');CORE.render(x,%s);await new Promise(r=>setTimeout(r,350));CORE.render(x,%s);const W=CORE.W,H=CORE.H,g=(a,b)=>{const d=x.getImageData(Math.round(W*a),Math.round(H*.05),Math.round(W*(b-a)),Math.round(H*.9)).data;let r=0,gg=0,bb=0,n=d.length/4;for(let i=0;i<d.length;i+=4){r+=d[i];gg+=d[i+1];bb+=d[i+2];}return [r/n,gg/n,bb/n];};return [g(.03,.3),g(.75,.98)]})()"""%(tt,tt))
    A=pxs(1.3);T("OV.update('%s',{start:99})"%id0);B=pxs(1.3);T("OV.update('%s',{start:1,tr:'wipe'})"%id0);Wp=pxs(1.3)
    print('wipe px left/right',Wp,'overlay',A,'base',B)
    d=lambda u,v:sum(abs(a-b) for a,b in zip(u,v))
    assert d(A[0],B[0])>30 and d(A[1],B[1])>30,'overlay aur base alag hone chahiye (test valid)'
    assert d(Wp[0],A[0])<15,'wipe: left hissa overlay dikhna chahiye (poora opaque)'
    assert d(Wp[1],B[1])<15,'wipe: right hissa abhi base hona chahiye'
    T("OV.update('%s',{tr:'none',fit:'pip',trDur:1})"%id0)
    # exit: end par transition (fade) frame none se alag
    T("OV.update('%s',{tr:'fade'})"%id0);e1=img(4.95);T("OV.update('%s',{tr:'none'})"%id0);e0=img(4.95);print('exit diff',abs(e1-e0));assert abs(e1-e0)>20000,'exit transition'
    # UI select
    T("OVT.sel='%s';OVT.sync()"%id0);pg.select_option('#ovt_tr','zoom');assert T("OV.get('%s').tr"%id0)=='zoom'
    pg.fill('#ovt_trd','0.6');pg.dispatch_event('#ovt_trd','change');assert abs(T("OV.get('%s').trDur"%id0)-.6)<1e-9
    # text transition bhi lagu (t1)
    tt=T("OV.add({lane:'t1',text:'Hi',start:1,len:3,tr:'zoom',trDur:1})");assert tt['tr']=='zoom'
    T("OV.items.slice().forEach(q=>OV.del(q.id))")
    # --- ripple ---
    ids=[T("OV.add({start:%s,len:2,clip:'t.webm'})['id']"%st) for st in (0,2,4)]
    # ripple OFF: remove middle -> baaki wahi
    T("OVT.ripple=false;OVT.remove('%s')"%ids[1]);assert abs(T("OV.get('%s').start"%ids[2])-4)<1e-9,'ripple off par shift nahi hona'
    T("OV.add({id:'%s',start:2,len:2,clip:'t.webm'})"%ids[1])
    # ripple ON via UI checkbox: remove middle -> last 2.0 par
    pg.check('#ovt_rip');assert T("OVT.ripple")
    T("OVT.sel='%s'"%ids[1]);pg.click('#ovt_del');assert abs(T("OV.get('%s').start"%ids[2])-2)<1e-9,T("OV.get('%s').start"%ids[2])
    # ripple trim: pehle item ki len 2 -> ~1: last (start 2) 1 se khiske
    A=T("OV.get('%s')"%ids[0]);S=T("Object.assign({others:OVT.laterOf(OV.get('%s'))},OV.get('%s'))"%(ids[0],ids[0]));T("OVT.trim('%s','r',1,%s)"%(ids[0],json.dumps(S)))
    la=T("OV.get('%s').len"%ids[0]);ls=T("OV.get('%s').start"%ids[2]);print('ripple trim',la,ls);assert la<1.5 and abs(ls-(2-(2-la)))<1e-9
    T("OV.items.slice().forEach(q=>OV.del(q.id))")
print('errors',errs);assert not errs;print('PASS test_ov_trans')
