# run: python tools/video_editor_tests/test_ov_lanes.py  (C226: Audio lane + Text lane)
import os,json,subprocess,base64,re,threading,http.server,socketserver
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
    # model: lane validation + defaults
    a=T("OV.add({lane:'a1',clip:'t.webm',start:0,len:3})");assert a['lane']=='a1' and a['vol']==1
    x=T("OV.add({lane:'zzz'})");assert x['lane']=='v2';T("OV.del('%s')"%x['id'])
    T("OV.items.slice().forEach(q=>OV.del(q.id))")
    # UI: audio + text jodo
    T("PLAYER.seek(1)");pg.click('#ovt_aud');assert T("OV.items.length")==1 and T("OV.items[0].lane")=='a1' and abs(T("OV.items[0].start")-1)<.15
    pg.fill('#ovt_txt','Breaking news');T("PLAYER.seek(2)");pg.click('#ovt_addt')
    t=T("OV.items.filter(o=>o.lane==='t1')[0]");print('text item',t['text'],t['start'],t['len']);assert t['text']=='Breaking news'
    assert pg.is_visible('#ovt_t2') and pg.input_value('#ovt_t2')=='Breaking news','text props'
    # row picking
    T("OVT.draw()");b=pg.locator('#ovt_cv').bounding_box()
    X=lambda tt:b['x']+T("OVT.x0+%s*OVT.pps"%tt)
    pg.mouse.click(X(T("OV.items[0].start")+.5),b['y']+22+34*2+17);assert T("OV.get(OVT.sel).lane")=='a1','audio row pick'
    b=pg.locator('#ovt_cv').bounding_box();pg.mouse.click(X(t['start']+.5),b['y']+22+34*3+17);assert T("OV.get(OVT.sel).lane")=='t1','text row pick'
    # text edit via props
    pg.fill('#ovt_t2','Naya text');pg.dispatch_event('#ovt_t2','change');pg.select_option('#ovt_pos','top');assert T("OV.get(OVT.sel).text")=='Naya text' and T("OV.get(OVT.sel).tpos")=='top'
    pg.fill('#ovt_t2','Breaking news');pg.dispatch_event('#ovt_t2','change');pg.select_option('#ovt_pos','bottom')
    # text trim (clip ke bina) + split
    T("OVT.trim('%s','r',%s,Object.assign({},OV.get('%s')))"%(t['id'],t['start']+1.0,t['id']));assert abs(T("OV.get('%s').len"%t['id'])-1.0)<.15
    n=T("OVT.sel='%s';OVT.split('%s',%s)"%(t['id'],t['id'],t['start']+.5));assert n and n['lane']=='t1' and n['text']=='Breaking news'
    T("OV.del('%s')"%n['id'])
    # render: text pixel badalta hai (t=2.2 par bottom area)
    diff=T("""(()=>{const mk=()=>{const cv=document.createElement('canvas');cv.width=CORE.W;cv.height=CORE.H;const x=cv.getContext('2d');CORE.render(x,%s);return x.getImageData(0,Math.round(CORE.H*.8),CORE.W,Math.round(CORE.H*.15)).data};
      const A=mk();const it=OV.get('%s');it.lane='x';const B=mk();it.lane='t1';let d=0;for(let i=0;i<A.length;i+=4)d+=Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2]);return d})()"""%(t['start']+.3,t['id']))
    print('text diff',diff);assert diff>50000,'text draw nahi hua'
    # export: audio lane awaaz mix mein (1s se 4s) + text frame
    sup=T("EXPORT.fastSupported().then(v=>!!v)")
    if sup:
        T("OV.items.filter(o=>o.lane==='t1').forEach(o=>OV.del(o.id))")
        T("OV.update(OV.items[0].id,{start:1,len:3,vol:1})")
        d=T("""(async()=>{const r=await EXPORT.runFast(PLAYER,()=>{},{});const b=new Uint8Array(await r.blob.arrayBuffer());let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(s)})()""")
        open('/tmp/ovl.mp4','wb').write(base64.b64decode(d))
        def mv(ss,tt):
            r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-ss',str(ss),'-t',str(tt),'-i','/tmp/ovl.mp4','-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
            m=re.search(r'mean_volume: (-?[\d.]+) dB',r);return float(m.group(1)) if m else None
        a_in,a_out=mv(1.2,2.5),mv(5,1.5);print('audio lane export dB in/out',a_in,a_out)
        assert a_in is not None and a_in>-40,'audio lane awaaz export mein nahi';assert a_out is None or a_out<-60,'audio lane ke baad chup'
    else:print('SKIP export')
    T("OV.items.slice().forEach(q=>OV.del(q.id))")
print('errors',errs);assert not errs;print('PASS test_ov_lanes')
