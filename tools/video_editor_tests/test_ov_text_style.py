# run: python tools/video_editor_tests/test_ov_text_style.py  (C230: text lane rang + font)
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
    # model normalise
    o=T("OV.add({lane:'t1',text:'x',tcolor:'red',tfont:'zzz'})");assert o['tcolor']=='#ffffff' and o['tfont']=='default',o
    T("OV.del(%s)"%json.dumps(o['id']))
    T("OVT.addText('MMMM')");pg.wait_for_selector('#ovt_col',state='visible')
    T("OV.update(OVT.sel,{tpos:'center',tsize:160,tbg:false,start:0,len:3})");T("PLAYER.seek(1)");pg.wait_for_timeout(300)
    # region stats of main canvas
    stats="""(c)=>{const cv=document.getElementById('cv'),x=cv.getContext('2d'),W=cv.width,H=cv.height,d=x.getImageData(W*.1,H*.4,W*.8,H*.2).data;let r=0,w=0,h=0;for(let i=0;i<d.length;i+=4){if(d[i]>200&&d[i+1]<60&&d[i+2]<60)r++;if(d[i]>235&&d[i+1]>235&&d[i+2]>235)w++;h=(h*31+d[i]+d[i+1]*3+d[i+2]*7)>>>0;}return {r,w,h}}"""
    s0=pg.evaluate(stats,0);print('default white',s0);assert s0['w']>300,s0
    pg.fill('#ovt_col','#ff0000');pg.wait_for_timeout(300);s1=pg.evaluate(stats,0);print('red',s1)
    assert T("OV.get(OVT.sel).tcolor")=='#ff0000' and s1['r']>300 and s1['w']<s0['w']*0.5,s1
    for f in ['serif','mono','impact','hand']:
        pg.select_option('#ovt_fnt',f);pg.wait_for_timeout(300);s=pg.evaluate(stats,0);print(f,s)
        assert T("OV.get(OVT.sel).tfont")=='%s'%f and s['r']>200 and (f=='hand' or s['h']!=s1['h']),(f,s)  # hand=Comic Sans: sandbox mein font nahi -> fallback, hash same ho sakta hai
    pg.select_option('#ovt_fnt','default');pg.wait_for_timeout(300);s2=pg.evaluate(stats,0);assert s2['h']==s1['h'],'default par wapas purana look'
    # block dobara chuno -> UI values
    T("OVT.sel=null;OVT.sync&&OVT.sync()");T("OVT.sel=OV.items[0].id;OVT.sync&&OVT.sync()")
    assert pg.input_value('#ovt_col')=='#ff0000' and pg.input_value('#ovt_fnt')=='default'
    # save/load (localStorage) mein bacha rehta hai
    T("OV.update(OVT.sel,{tfont:'mono'})");T("OV.load()");assert T("OV.items[0].tfont")=='mono' and T("OV.items[0].tcolor")=='#ff0000'
print('errors',errs);assert not errs;print('PASS test_ov_text_style')
