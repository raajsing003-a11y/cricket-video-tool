// C101 (G19 -> Y23): spot card (wide) — screenshot/screen-record par peela highlight box + cursor + baaki dim + neeche pill.
// spot: data:{shot:'photo slot naam ya asset path' (default ui_browser_window_white), box:'x,y,w,h' (0-1, shot ke hisse mein), cursor:true, click:true, zoom:1.35, label:'', pill:'', title:'', bg}
// Photo slot (custom_xyz) mein screenshot upload karo, phir shot mein wahi naam do. Sensitive hissa ho to usse box mein na lo / photo mein pehle blur karo.
(function(){const C=window.CORE,E=C.ease;
const BG='01_backgrounds/bg_blue_radial_glow_dark',VG='02_overlays/ov_vignette_dark',SH='15_ui_mockups/ui_browser_window_white';
C.spotBox=function(s){const a=String(s==null?'0.3,0.35,0.4,0.15':s).split(',').map(x=>parseFloat(x));
  if(a.length!==4||a.some(x=>!isFinite(x)))return null;let[x,y,w,h]=a;if(w<=0||h<=0||x<0||y<0||x+w>1.001||y+h>1.001)return null;return{x,y,w,h};};
function shotImg(d){const k=d.shot;if(k&&C.photos&&C.photos[k])return C.photos[k];return C.img(k||SH)||C.img(SH);}
function arrow(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,34);ctx.lineTo(9,26);ctx.lineTo(16,42);ctx.lineTo(23,39);ctx.lineTo(16,24);ctx.lineTo(28,24);ctx.closePath();
  ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle='#fff';ctx.fill();ctx.shadowColor='transparent';ctx.lineWidth=3;ctx.strokeStyle='#10131f';ctx.stroke();ctx.restore();}
C.CARDS.spot={
 assets:d=>[d.bg||BG,VG,d.shot&&!(C.photos&&C.photos[d.shot])?d.shot:SH],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,outA=1-E.in(C.prog(t,dur-.3,dur)),bx=C.spotBox(d.box)||{x:.3,y:.35,w:.4,h:.15};
  C.cover(ctx,C.img(d.bg||BG),-30,-30,W+60,H+60,1+0.04*t/dur);C.drawImg(ctx,VG,0,0,W,H);
  if(d.title){const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp*outA;const f=C.fitText(ctx,String(d.title),1600,1,76,40,900);C.text(ctx,f.lines[0],W/2,90+20*(1-tp),{align:'center',px:f.px,stroke:10,shadow:12,color:'#fff',base:'middle'});ctx.restore();}
  const im=shotImg(d);if(!im)return;
  // screenshot panel (fit), zoom box ki taraf
  const top=d.title?150:50,bot=d.pill||d.label?230:60,aw=W-240,ah=H-top-bot,iw=im.width||im.naturalWidth||1600,ih=im.height||im.naturalHeight||900,fit=Math.min(aw/iw,ah/ih),pw=iw*fit,ph=ih*fit,
    px0=W/2-pw/2,py0=top+(ah-ph)/2,zmax=Math.max(1,Math.min(2.2,+d.zoom||1.35)),zp=E.io?E.io(C.prog(t,.9,2.0)):E.out(C.prog(t,.9,2.0)),z=1+(zmax-1)*zp,
    cx=px0+(bx.x+bx.w/2)*pw,cy=py0+(bx.y+bx.h/2)*ph,fx=W/2,fy=top+ah/2;
  ctx.save();ctx.beginPath();ctx.rect(60,top-14,W-120,ah+28);ctx.clip();ctx.globalAlpha=E.out(C.prog(t,0,.5))*outA;
  // zoom: box ka center screen ke center ki taraf khiskta hai (z ke saath)
  ctx.translate(fx,fy);ctx.scale(z,z);ctx.translate(-(fx+(cx-fx)*zp*(z>1?1:0)),-(fy+(cy-fy)*zp*(z>1?1:0)));
  ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=40;ctx.fillStyle='#000';ctx.beginPath();ctx.roundRect(px0,py0,pw,ph,18);ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.roundRect(px0,py0,pw,ph,18);ctx.clip();ctx.drawImage(im,px0,py0,pw,ph);
  // dim (box ke bahar), box ke saath ubhaar
  const dp=E.out(C.prog(t,.6,1.2)),rx=px0+bx.x*pw,ry=py0+bx.y*ph,rw=bx.w*pw,rh=bx.h*ph;
  ctx.fillStyle='rgba(5,10,25,'+(.62*dp)+')';ctx.beginPath();ctx.rect(px0,py0,pw,ph);ctx.roundRect(rx-6,ry-6,rw+12,rh+12,10);ctx.fill('evenodd');ctx.restore();
  // peela rectangle draw (perimeter ke saath)
  const rp=E.out(C.prog(t,.7,1.5));if(rp>0){const per=2*(rw+rh),L=per*rp;ctx.save();ctx.strokeStyle='#F5C518';ctx.lineWidth=7/Math.sqrt(z);ctx.shadowColor='#F5C518';ctx.shadowBlur=22;ctx.lineJoin='round';ctx.setLineDash([L,per]);
    ctx.beginPath();ctx.roundRect(rx-6,ry-6,rw+12,rh+12,10);ctx.stroke();ctx.restore();}
  // cursor: neeche-right se box ke andar, click ripple
  const useC=!(d.cursor===false||d.cursor==='false');
  if(useC){const cp=E.out(C.prog(t,1.0,2.0)),sx=rx+rw*.5+260,sy=ry+rh+220,ex=rx+rw*.72,ey=ry+rh*.62,x=sx+(ex-sx)*cp,y=sy+(ey-sy)*cp;
    const ck=!(d.click===false||d.click==='false'),ct=2.15,since=t-ct;
    if(ck&&since>0&&since<.7){const r=E.out(since/.7);ctx.save();ctx.globalAlpha=(1-r)*.9;ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(ex,ey,14+r*60,0,Math.PI*2);ctx.stroke();ctx.restore();}
    const press=ck&&since>0&&since<.18?.85:1;arrow(ctx,x,y,(1.5/Math.sqrt(z))*press);}
  ctx.restore();
  // neeche label + pill
  if(d.label||d.pill){const la=E.out(C.prog(t,1.6,2.1));if(la>0){ctx.save();ctx.globalAlpha=la*outA;let yy=H-150+(1-la)*20;
    if(d.label){const f=C.fitText(ctx,String(d.label),1500,1,64,36,900);C.text(ctx,f.lines[0],W/2,yy-(d.pill?20:0),{align:'center',px:f.px,stroke:9,shadow:10,color:'#F5C518',base:'middle'});}
    if(d.pill){ctx.font=C.font(44,800);const pw2=ctx.measureText(String(d.pill)).width+90,ph2=84,py2=yy+(d.label?60:0);ctx.fillStyle='rgba(10,19,48,.78)';ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(W/2-pw2/2,py2-ph2/2,pw2,ph2,ph2/2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#F5C518';ctx.beginPath();ctx.arc(W/2-pw2/2+40,py2,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(String(d.pill),W/2-pw2/2+66,py2+2);}
    ctx.restore();}}
 }};
})();
