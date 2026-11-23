// C217: Scenes ke 'clip' scene ke liye Speed / Ulti (Reverse) / Awaaz controls. SE panel mein (scene_editor.js CLIPCTL.controls).
// Speed badalne par scene ki lambai badalti hai taaki clip ka wahi hissa chale (span = dur x speed). Awaaz % : 0 = mute (purana), 100 = original, 300 tak.
(function(){const C=window.CORE;if(!C)return;
const SP=[.25,.5,.75,1,1.5,2,3,4];
window.CLIPCTL={
  setSpeed(sc,v){const d=sc.data=sc.data||{},old=C.clipSpeed(d),nv=Math.max(.25,Math.min(4,+v||1)),span=sc.dur*old;d.speed=nv;if(nv===1)delete d.speed;sc.dur=+Math.max(.5,span/nv).toFixed(2);return sc.dur;},
  controls(sc,f,el,apply){
    const d=sc.data=sc.data||{},b=el('div','margin-top:6px;border-top:1px solid #333;padding-top:4px');b.id='clipctl';
    b.appendChild(el('b',null,'🎞 Clip: speed / awaaz '));
    const l1=el('label','margin-right:10px','Speed ');const s=el('select');s.id='cc_sp';
    SP.forEach(x=>{const o=el('option',null,x+'x');o.value=x;if(C.clipSpeed(d)===x)o.selected=true;s.appendChild(o);});
    s.onchange=()=>{CLIPCTL.setSpeed(sc,s.value);apply(true);};l1.appendChild(s);b.appendChild(l1);
    const l2=el('label','margin-right:10px');const c=el('input');c.type='checkbox';c.id='cc_rv';c.checked=!!d.rev;
    c.onchange=()=>{if(c.checked)d.rev=true;else delete d.rev;apply(true);};l2.appendChild(c);l2.appendChild(document.createTextNode(' Ulti (reverse)'));b.appendChild(l2);
    const l3=el('label','margin-right:10px','Awaaz % ');const n=el('input','width:60px');n.type='number';n.id='cc_vol';n.min=0;n.max=300;n.step=10;n.value=Math.round((+d.vol||0)*100);
    n.onchange=()=>{const v=Math.max(0,Math.min(300,parseFloat(n.value)||0));if(v>0)d.vol=+(v/100).toFixed(2);else delete d.vol;apply(true);};l3.appendChild(n);b.appendChild(l3);
    b.appendChild(el('div','font-size:11px;opacity:.7;margin-top:2px','Awaaz 0 = mute. Preview mein 100% tak sunai deti, ulti clip ki awaaz preview mein band (export mein judti hai). Awaaz sirf ⚡ Fast export mein mix hoti hai.'));
    f.appendChild(b);}
};
})();
