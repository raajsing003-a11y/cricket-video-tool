// C103 (Y3): Chapter flow. Chapter naam do -> har chapter ke liye 2 scene bante hain: `stack` (list, is chapter par highlight, purane par tick) + `chapter` banner.
// Button: right panel "📚 Chapter flow" (wide mode). Naam ; se alag (2-9). Scenes list ke aakhir mein jud jaate hain. CF.build(names,opt) pure function.
(function(){const C=window.CORE,CF=window.CF={};
CF.parse=s=>String(s||'').split(/[;\n]/).map(x=>x.trim()).filter(Boolean).slice(0,9);
CF.build=(names,o)=>{o=o||{};const n=names.length,out=[],lt=o.listTitle||(n+' chapters'),sd=o.stackDur||4,cd=o.chapterDur||3,tr=o.tr||'fade';
  names.forEach((nm,i)=>{
    out.push({type:'stack',dur:sd,tr:tr,trDur:.5,data:{title:lt,items:names.slice(),hl:i+1,pill:o.pill||'',done:names.slice(0,i).map((_,k)=>k+1).join(','),mark:''}});
    out.push({type:'chapter',dur:cd,tr:tr,trDur:.5,data:{num:String(i+1).padStart(2,'0'),title:nm,pill:'',lock:true}});});
  return out;};
const iv=setInterval(()=>{const q=document.getElementById('quick');if(!q||!window.SE||!window.PLAYER)return;clearInterval(iv);
  const b=document.createElement('button');b.textContent='📚 Chapter flow';b.style.background='#6c5ce7';b.title='Chapter naam do -> list + banner scenes apne aap (wide)';
  b.onclick=async()=>{if(C.format!=='wide'){alert('Chapter flow sirf wide mode mein.');return;}
    const s=prompt('Chapter ke naam (2-9), ; se alag:\njaise: Hook ; Retention ; Thumbnail');if(s==null)return;const names=CF.parse(s);
    if(names.length<2){alert('Kam se kam 2 chapter naam do.');return;}
    const sc=CF.build(names);const first=!SE.scenes.length;if(first)sc[0].tr=undefined;SE.scenes.push.apply(SE.scenes,sc);SE.sel=SE.scenes.length-sc.length;
    await SE.apply(true);SE.msg=names.length+' chapter ke '+sc.length+' scene jude (stack + chapter).';SE.render();};
  q.appendChild(b);},200);
setTimeout(()=>clearInterval(iv),20000);
})();
