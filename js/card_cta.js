// C46: cta card (wide) — Like / Comment / Subscribe icons pop-in. data:{mode:'like'|'end', title, line, bg}
//  mode 'like' (video ke beech): 👍 Like + 🔔 Subscribe     mode 'end' (aakhir mein): 👍 Like + 💬 Comment + 🔔 Subscribe
// Icons canvas Path2D (Material icons, Apache-2.0) — koi image asset nahi chahiye.
(function(){const C=window.CORE,E=C.ease;
const YT='06_icons/icon_youtube_logo',VG='02_overlays/ov_vignette_dark',HT='02_overlays/ov_halftone_dots_white',BR='01_backgrounds/bg_grunge_red_halftone';
const ICON={
 like:{p:'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',c:'#1e6fe8',hi:'Like'},
 comment:{p:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',c:'#2a9d4a',hi:'Comment'},
 bell:{p:'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',c:'#e62117',hi:'Subscribe'}};
const P2={};const path=k=>P2[k]||(P2[k]=new Path2D(ICON[k].p));
C.CARDS.cta={
 assets:d=>[d.bg||BR,VG,HT,YT],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,end=d.mode==='end';
  const keys=end?['like','comment','bell']:['like','bell'];
  C.cover(ctx,C.img(d.bg||BR),-30,-30,W+60,H+60,1+0.05*t/dur);
  ctx.save();ctx.globalAlpha=.15;C.drawImg(ctx,HT,0,0,W,H);ctx.restore();C.drawImg(ctx,VG,0,0,W,H);
  const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;
  const HI=s=>/[\u0900-\u097F]/.test(s||''),okT=s=>s&&(!HI(s)||d.hindi);  // C163: basic text English; Hindi title/line tabhi jab data.hindi:true
   const title=okT(d.title)?d.title:(end?'What do you think?':'Enjoying the video?');
  const tf=C.fitText(ctx,title,1600,1,100,50,900);
  C.text(ctx,tf.lines[0],W/2,190+30*(1-tp),{align:'center',px:tf.px,stroke:12,shadow:14,color:'#ffd23f',base:'middle'});ctx.restore();
  const n=keys.length,gap=end?520:640,x0=W/2-(n-1)*gap/2,cy=520,R=end?150:170;
  keys.forEach((k,i)=>{const a=.7+i*.45,p=E.back(C.prog(t,a,a+.55));if(p<=0)return;
   const ic=ICON[k],x=x0+i*gap;let s=p,rot=0;
   const pt=t-(a+.9);                      // pop ke baad halka pulse; bell hilti hai
   if(pt>0)s*=1+0.04*Math.sin(pt*5);
   if(k==='bell'&&pt>0)rot=Math.sin(pt*9)*.22*Math.max(0,1-pt/2.5);
   const yt=k==='bell'?C.img(YT):null;
   if(yt){                                  // subscribe = asli YouTube logo
    ctx.save();ctx.translate(x,cy);ctx.scale(s,s);ctx.rotate(rot*.6);const w=R*2.3,h=w*yt.height/yt.width;
    ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.drawImage(yt,-w/2,-h/2,w,h);ctx.shadowColor='transparent';
    C.text(ctx,ic.hi,0,R+80,{align:'center',px:end?62:72,stroke:9,shadow:10,base:'middle'});ctx.restore();return;}
   ctx.save();ctx.translate(x,cy);ctx.scale(s,s);
   ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.fillStyle=ic.c;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();
   ctx.shadowColor='transparent';ctx.lineWidth=10;ctx.strokeStyle='#ffd23f';ctx.stroke();
   ctx.save();ctx.rotate(rot);const is=R*1.25/24;ctx.scale(is,is);ctx.translate(-12,-12);
   if(k==='like'&&pt>0){const up=Math.max(0,Math.sin(pt*6))*Math.max(0,1-pt/1.5);ctx.translate(0,-3*up);}
   ctx.fillStyle='#fff';ctx.fill(path(k));ctx.restore();
   C.text(ctx,ic.hi,0,R+80,{align:'center',px:end?62:72,stroke:9,shadow:10,base:'middle'});
   ctx.restore();});
  const lp=E.out(C.prog(t,end?2.2:1.8,end?2.7:2.3));
  if(lp>0){ctx.save();ctx.globalAlpha=lp;
   const line=okT(d.line)?d.line:(end?'Tell us in the comments':"Don't forget to subscribe");
   const lf=C.fitText(ctx,line,1600,1,64,36,800);
   C.text(ctx,lf.lines[0],W/2,H-170,{align:'center',px:lf.px,stroke:10,shadow:12,base:'middle'});ctx.restore();}
 }};
})();
