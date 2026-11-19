// C10b: anth + intro cards.
// anth : data:{title,qs:[3 sawal],cta,bg,flip}  (C36: flip:true = sawal ki patti dayen se aati hai, badge dayen)  3 sawal stagger (question badge), phir cta (कमेंट...) + ribbon
// intro: data:{line1,line2,bg,flip}  (C36: flip:true = ball dayen se, strip bayen se)             paper bg, torn strip slide-in, red ball roll, gold sparks
(function(){const C=window.CORE,E=C.ease;
const VG='02_overlays/ov_vignette_dark',HT='02_overlays/ov_halftone_dots_white',RB='02_overlays/ov_ribbon_subscribe_now',
 QB='06_icons/icon_question_badge',CK='06_icons/icon_check_green',FX='08_gemini_generated/fx/fx_gold_sparks_black',
 TP='02_overlays/ov_torn_paper_strip',BP='01_backgrounds/bg_paper_texture_white',BALL='08_gemini_generated/objects/obj_ball_red',BR='01_backgrounds/bg_grunge_red_halftone';
C.CARDS.anth={
 assets:d=>[d.bg||BR,VG,HT,QB,CK,RB],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,qs=(d.qs||[]).slice(0,3),fl=!!d.flip;
  C.cover(ctx,C.img(d.bg||BR),-30,-30,W+60,H+60,1+0.05*t/dur);
  ctx.save();ctx.globalAlpha=.15;C.drawImg(ctx,HT,0,0,W,H);ctx.restore();C.drawImg(ctx,VG,0,0,W,H);
  const tp=E.out(C.prog(t,.1,.6));ctx.save();ctx.globalAlpha=tp;
  C.text(ctx,d.title||'कल के 3 बड़े सवाल',W/2,160+30*(1-tp),{align:'center',px:92,stroke:12,shadow:14,color:'#ffd23f'});ctx.restore();
  qs.forEach((q,i)=>{const p=E.out(C.prog(t,.7+i*.55,1.2+i*.55));if(p<=0)return;
   const y=250+i*190;ctx.save();ctx.globalAlpha=p;ctx.translate((fl?1:-1)*(1-p)*500,0);
   C.panel(ctx,230,y,1460,160,{accent:'#ffd23f',right:fl});
   const bs=E.back(C.prog(t,.9+i*.55,1.4+i*.55));ctx.save();ctx.translate(fl?1590:330,y+80);ctx.scale(bs,bs);const im=C.img(QB);if(im)ctx.drawImage(im,-60,-60,120,120);else{ctx.beginPath();ctx.arc(0,0,52,0,Math.PI*2);ctx.fillStyle='#ffd23f';ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=14;ctx.fill();ctx.shadowColor='transparent';C.text(ctx,String(i+1),0,3,{align:'center',px:70,color:'#7a1010',base:'middle',w:900});}ctx.restore();
   const f=C.fitText(ctx,q,1240,2,60,34,800);const lh=f.px+6,y0=y+80-(f.lines.length-1)*lh/2;
   f.lines.forEach((l,k)=>C.text(ctx,l,fl?290:420,y0+k*lh,{px:f.px,base:'middle'}));ctx.restore();});
  const cp=E.out(C.prog(t,2.6,3.1));if(cp>0){ctx.save();ctx.globalAlpha=cp;const pulse=1+0.02*Math.sin(t*6);ctx.translate(W/2,860);ctx.scale(pulse,pulse);
   const f=C.fitText(ctx,d.cta||'What do you think? Tell us in the comments',1500,1,70,40,800);C.text(ctx,f.lines[0],0,0,{align:'center',px:f.px,stroke:10,shadow:12,base:'middle'});ctx.restore();}
  const rp=E.back(C.prog(t,3.2,3.7));C.drawImg(ctx,RB,W-460-30+(1-rp)*520,H-96-30);
 }};
// green-screen -> alpha (cached per image key)
const KEYED={};
function keyGreen(k){const im=C.img(k);if(!im)return null;if(KEYED[k])return KEYED[k];
 const S=512,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');x.drawImage(im,0,0,S,S);
 const d=x.getImageData(0,0,S,S),a=d.data;
 for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],gd=g-Math.max(r,b);
  if(gd>40)a[i+3]=0;else if(gd>15){a[i+3]=Math.round(255*(40-gd)/25);a[i+1]=Math.max(r,b);}}
 x.putImageData(d,0,0);KEYED[k]=c;return c;}
C.CARDS.intro={
 assets:d=>[d.bg||BP,TP,BALL,FX,RB],
 draw(ctx,t,d,sc){
  const W=C.W,H=C.H,dur=sc.dur,fl=!!d.flip;
  C.cover(ctx,C.img(d.bg||BP),0,0,W,H,1+0.04*t/dur);
  // ball rolls in from left, spins
  const bp=E.out(C.prog(t,0,1.2)),bx=fl?C.lerp(W+300,W-420,bp):C.lerp(-300,420,bp),r=C.lerp(0,Math.PI*3,bp)*(fl?-1:1),bi=keyGreen(BALL);
  if(bi){ctx.save();ctx.translate(bx,760);ctx.rotate(r);ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=30;ctx.drawImage(bi,-170,-170,340,340);ctx.restore();}
  // torn strip slides from right
  const sp=E.out(C.prog(t,.5,1.2)),sx=(W-1560)/2+(fl?-1:1)*(1-sp)*1900,sy=250;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=24;C.drawImg(ctx,TP,sx,sy);ctx.shadowColor='transparent';
  if(d.line1){const f=C.fitText(ctx,d.line1,1400,1,96,48,900);C.text(ctx,f.lines[0],sx+780,sy+130,{align:'center',px:f.px,color:'#b0121b',base:'middle'});}
  if(d.line2){const f=C.fitText(ctx,d.line2,1400,1,64,36,700);C.text(ctx,f.lines[0],sx+780,sy+230,{align:'center',px:f.px,color:'#14213d',base:'middle'});}
  ctx.restore();
  // sparks when strip lands
  const s=t-1.1;if(s>0&&s<1.2){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=1-s/1.2;C.cover(ctx,C.img(FX),0,0,W,H,1+s*.15);ctx.restore();}
  if(d.ribbon!==false){const p=E.back(C.prog(t,1.8,2.3));C.drawImg(ctx,RB,W-460-30+(1-p)*520,H-96-30);}
 }};
})();
