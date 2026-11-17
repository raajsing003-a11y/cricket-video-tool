// C17: audio-fit timing. scene.chunk (1,2,3...) = Audio tracks list ki n-th voice-over file.
// FIT.run() har chunk ke scenes ki dur aise set karta hai ki scenes us audio ke saath chalein.
// FIT.autoAssign() scenes ko audio chunks mein lambai ke hisaab se baant deta hai.
(function(){
'use strict';
const FIT=window.FIT={MIN:1.5};
const r2=x=>Math.round(x*100)/100;
const eff=(sc,i)=>i===0?0:(sc.trDur!=null?sc.trDur:(sc.tr&&sc.tr!=='cut'?0.5:0));

FIT.segs=()=>{
  if(window.AT&&AT.segs.length)return AT.segs.map(s=>({name:s.name,start:s.start,dur:s.buf.duration}));
  const a=window.EXPORT&&EXPORT.audio;
  return a?[{name:'audio',start:0,dur:a.duration}]:[];
};

// scenes ke chunk numbers (khali ho to pichle scene ka, pehle ka 1)
FIT.chunks=(scenes,nseg)=>{
  const ch=[];
  for(let i=0;i<scenes.length;i++){
    const c=parseInt(scenes[i].chunk,10);
    ch.push(c>=1?c:(i?ch[i-1]:1));
    if(i&&ch[i]<ch[i-1])return {err:'Scene '+(i+1)+': chunk '+ch[i]+' pichle scene ke chunk '+ch[i-1]+' se chhota hai. Chunk numbers badhte order mein rakho.'};
    if(ch[i]>nseg)return {err:'Scene '+(i+1)+': chunk '+ch[i]+' hai par audio sirf '+nseg+' hain.'};
  }
  return {ch};
};

// pure function: scenes + segs -> {durs, notes, report} ya {err}
FIT.compute=(scenes,segs,min)=>{
  min=min||FIT.MIN;
  if(!scenes.length)return {err:'Koi scene nahi.'};
  if(!segs.length)return {err:'Pehle 🎚 Audio tracks ya 🎙 Audio se voice-over lagao.'};
  const g=FIT.chunks(scenes,segs.length);if(g.err)return g;
  const ch=g.ch,n=scenes.length,totalEnd=Math.max(...segs.map(s=>s.start+s.dur));
  const runs=[];
  for(let i=0;i<n;i++){const L=runs[runs.length-1];if(L&&L.c===ch[i])L.e=i;else runs.push({c:ch[i],s:i,e:i});}
  const durs=scenes.map(s=>s.dur),notes=[],report=[];
  runs.forEach((R,gi)=>{
    const B=gi===0?0:segs[R.c-1].start;
    const nx=runs[gi+1],B2=nx?segs[nx.c-1].start:totalEnd,nextTr=nx?eff(scenes[nx.s],nx.s):0;
    let sumTr=0;for(let j=R.s+1;j<=R.e;j++)sumTr+=eff(scenes[j],j);
    const target=(B2-B)+nextTr+sumTr,k=R.e-R.s+1;
    const mins=[],w=[];
    for(let j=R.s;j<=R.e;j++){
      const nt=j+1<n?eff(scenes[j+1],j+1):0;
      mins.push(Math.max(min,eff(scenes[j],j)+nt+0.3));
      w.push(Math.max(.1,+scenes[j].dur||1));
    }
    const fixed=new Array(k).fill(false),res=new Array(k).fill(0);let rem=target;
    for(let it=0;it<=k;it++){
      let sw=0;for(let a=0;a<k;a++)if(!fixed[a])sw+=w[a];
      if(sw===0)break;
      let hit=-1;
      for(let a=0;a<k;a++)if(!fixed[a]&&rem*w[a]/sw<mins[a]){hit=a;break;}
      if(hit<0){for(let a=0;a<k;a++)if(!fixed[a])res[a]=rem*w[a]/sw;break;}
      fixed[hit]=true;res[hit]=mins[hit];rem-=mins[hit];
    }
    for(let a=0;a<k;a++)res[a]=r2(res[a]);
    const sum=res.reduce((x,y)=>x+y,0),diff=r2(target-sum);
    if(Math.abs(diff)>0.004){let bi=0;for(let a=1;a<k;a++)if(res[a]>res[bi])bi=a;if(res[bi]+diff>=mins[bi])res[bi]=r2(res[bi]+diff);}
    const got=res.reduce((x,y)=>x+y,0),over=got-target;
    if(over>0.05)notes.push('⚠ Chunk '+R.c+': audio sirf '+(B2-B).toFixed(1)+'s ki hai par '+k+' scenes ko kam se kam '+(B2-B+over).toFixed(1)+'s chahiye ('+over.toFixed(1)+'s zyada). Scene kam karo ya transition chhoti rakho.');
    res.forEach((v,a)=>durs[R.s+a]=v);
    report.push({chunk:R.c,from:R.s+1,to:R.e+1,target:r2(B2-B)});
  });
  const used=new Set(ch);
  for(let c=1;c<=segs.length;c++)if(!used.has(c))notes.push('ℹ Audio chunk '+c+' ke liye koi scene nahi — pichle chunk ka aakhri scene us audio par ruka rahega.');
  return {durs,notes,report,audioEnd:totalEnd};
};

// scenes ki dur badal deta hai; scene editor ka apply() baad mein chalega
FIT.run=()=>{
  const SE=window.SE,r=FIT.compute(SE.scenes,FIT.segs());
  if(r.err)return {ok:false,msg:'⏱ Fit nahi hua: '+r.err};
  SE.scenes.forEach((s,i)=>{s.dur=r.durs[i];});
  const lines=['⏱ Fit ho gaya: '+r.report.map(x=>'chunk '+x.chunk+' → scene '+(x.from===x.to?x.from:x.from+'–'+x.to)+' ('+x.target.toFixed(1)+'s)').join(' · ')];
  return {ok:true,msg:lines.concat(r.notes).join('\n'),audioEnd:r.audioEnd};
};

// scenes ko audio chunks mein audio ki lambai ke hisaab se baant do (chunk number likh deta hai)
FIT.autoAssign=()=>{
  const SE=window.SE,segs=FIT.segs();
  if(!SE.scenes.length)return {ok:false,msg:'🎙 Koi scene nahi.'};
  if(!segs.length)return {ok:false,msg:'🎙 Pehle audio chunk(s) lagao.'};
  const tot=segs.reduce((a,s)=>a+s.dur,0),n=SE.scenes.length;
  SE.scenes.forEach((sc,i)=>{
    const pos=(i+.5)/n*tot;let acc=0,c=segs.length;
    for(let k=0;k<segs.length;k++){acc+=segs[k].dur;if(pos<acc){c=k+1;break;}}
    sc.chunk=c;
  });
  return {ok:true,msg:'🎙 Chunk baant diye: '+SE.scenes.map(s=>s.chunk).join(', ')+'. Ab ⏱ fit dabao.'};
};
})();
