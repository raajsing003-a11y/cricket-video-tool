/* C192: Telegram share (sab pages par). Token/chat id sirf is browser ke localStorage (cvt_tg) mein; news.html ke setup ke saath same. */
(function(){'use strict';
if(window.__tgShare)return;window.__tgShare=1;
const K='cvt_tg';let tg={token:'',chat:'',on:true,dl:true,cp:false};
try{Object.assign(tg,JSON.parse(localStorage.getItem(K)||'{}'));}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(tg));}catch(e){}};
const ready=()=>!!(tg.token&&tg.chat);
const live=()=>ready()&&tg.on;
const API=m=>'https://api.telegram.org/bot'+encodeURIComponent(tg.token)+'/'+m;
let tEl=null,tT=0;
function toast(m,bad){try{if(!tEl){tEl=document.createElement('div');tEl.style.cssText='position:fixed;left:10px;bottom:56px;max-width:80vw;padding:8px 12px;border-radius:10px;font:14px system-ui,sans-serif;z-index:100000;color:#fff;box-shadow:0 2px 8px #0008';document.body.appendChild(tEl);}
  tEl.textContent=m;tEl.style.background=bad?'#8a2323':'#1f6b2c';tEl.style.display='block';clearTimeout(tT);tT=setTimeout(()=>{tEl.style.display='none';},3500);}catch(e){}}
function sendFile(blob,name,cap){
  if(!live()){toast('Pehle 📨 se Telegram setup karo',true);return Promise.resolve(false);}
  if(blob.size>50*1024*1024){toast('✖ '+name+' 50MB se badi hai (Telegram bot limit)',true);return Promise.resolve(false);}
  const fd=new FormData();fd.append('chat_id',tg.chat);if(cap)fd.append('caption',String(cap).slice(0,900));fd.append('document',blob,name||'file');
  toast('📨 Telegram par bhej raha: '+name);
  return fetch(API('sendDocument'),{method:'POST',body:fd}).then(r=>r.json()).then(j=>{toast(j&&j.ok?'✔ Telegram par bhej diya: '+name:'✖ Telegram: '+((j&&j.description)||'error'),!(j&&j.ok));return !!(j&&j.ok);}).catch(()=>{toast('✖ Telegram tak nahi pahunch paya',true);return false;});}
function sendText(text){
  if(!live()){toast('Pehle 📨 se Telegram setup karo',true);return Promise.resolve(false);}
  text=String(text||'');if(!text.trim()){toast('Bhejne ko kuch nahi hai',true);return Promise.resolve(false);}
  if(text.length>3900)return sendFile(new Blob([text],{type:'text/plain;charset=utf-8'}),'text_'+Date.now()+'.txt','📋 lamba text (file mein)');
  toast('📨 Telegram par bhej raha…');
  return fetch(API('sendMessage'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:tg.chat,text:text,disable_web_page_preview:true})}).then(r=>r.json()).then(j=>{toast(j&&j.ok?'✔ Telegram par bhej diya':'✖ Telegram: '+((j&&j.description)||'error'),!(j&&j.ok));return !!(j&&j.ok);}).catch(()=>{toast('✖ Telegram tak nahi pahunch paya',true);return false;});}
window.TG_SEND_TEXT=sendText;window.TG_SEND_FILE=sendFile;
// 1) har download (blob:/data: link) apne aap Telegram par bhi
const NOH=!!window.__tgNoHooks;
const oc=HTMLAnchorElement.prototype.click;
if(!NOH)HTMLAnchorElement.prototype.click=function(){
  try{if(live()&&tg.dl&&this.hasAttribute('download')&&/^(blob:|data:)/.test(this.href)){const nm=this.getAttribute('download')||'file';fetch(this.href).then(r=>r.blob()).then(b=>sendFile(b,nm,'📁 '+nm)).catch(()=>{});}}catch(e){}
  return oc.apply(this,arguments);};
// 2) har "Copy" apne aap Telegram par bhi (default band; panel se ON)
try{if(!NOH&&navigator.clipboard&&navigator.clipboard.writeText){const ow=navigator.clipboard.writeText.bind(navigator.clipboard);
  navigator.clipboard.writeText=function(t){try{if(live()&&tg.cp&&t&&String(t).trim().length>1)sendText(t);}catch(e){}return ow(t);};}}catch(e){}
// 3) har textarea ke neeche 📨 button
function addTa(ta){if(ta.dataset.tg)return;ta.dataset.tg='1';const b=document.createElement('button');b.type='button';b.textContent='📨 Telegram par bhejo';
  b.style.cssText='margin:2px 0 6px;padding:5px 10px;border:0;border-radius:8px;background:#26425f;color:#cfe8ff;font-size:13px;cursor:pointer';
  b.onclick=()=>{const v=ta.value&&ta.value.trim()?ta.value:'';const sel=(ta.selectionEnd>ta.selectionStart)?ta.value.slice(ta.selectionStart,ta.selectionEnd):'';sendText(sel||v);};
  ta.insertAdjacentElement('afterend',b);}
// 3b) Telegram se file load: file input / textarea ke paas "📥 Telegram se" button
function okAccept(acc,name,mime){acc=(acc||'').trim();if(!acc)return true;name=(name||'').toLowerCase();mime=(mime||'').toLowerCase();
  return acc.split(',').some(t=>{t=t.trim().toLowerCase();if(!t)return false;if(t[0]==='.')return name.endsWith(t);if(t.slice(-2)==='/*')return mime.indexOf(t.slice(0,-1))===0||(t==='image/*'&&/\.(png|jpe?g|webp|gif)$/.test(name))||(t==='audio/*'&&/\.(mp3|wav|m4a|ogg|aac)$/.test(name))||(t==='video/*'&&/\.(mp4|webm|mov)$/.test(name));return mime===t;});}
function listDocs(acc){
  return fetch(API('getUpdates')+'?limit=100&allowed_updates='+encodeURIComponent('["message","channel_post"]')).then(r=>r.json()).then(j=>{
    if(!j||!j.ok)throw new Error((j&&j.description)||'getUpdates error');
    const out=[];(j.result||[]).forEach(u=>{const m=u.message||u.channel_post;if(!m||!m.document)return;if(String(m.chat&&m.chat.id)!==String(tg.chat))return;
      const d=m.document;if(!okAccept(acc,d.file_name,d.mime_type))return;out.push({id:d.file_id,name:d.file_name||'file',size:d.file_size||0,t:(m.date||0)*1000,mime:d.mime_type||''});});
    return out.sort((a,b)=>b.t-a.t);});}
function getTgFile(it){
  if(it.size>20*1024*1024)return Promise.reject(new Error('20MB se badi file bot nahi utha sakta'));
  return fetch(API('getFile')+'?file_id='+encodeURIComponent(it.id)).then(r=>r.json()).then(j=>{if(!j||!j.ok)throw new Error((j&&j.description)||'getFile error');
    return fetch('https://api.telegram.org/file/bot'+encodeURIComponent(tg.token)+'/'+j.result.file_path);}).then(r=>{if(!r.ok)throw new Error('download fail');return r.blob();});}
function pick(acc,onFile){
  if(!live()){toast('Pehle 📨 TG se setup karo',true);return;}
  toast('📥 Telegram se list la raha…');
  listDocs(acc).then(list=>{
    const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:#000a;z-index:100002;display:flex;align-items:center;justify-content:center';
    const bx=document.createElement('div');bx.style.cssText='background:#1b1b1b;color:#eee;border:1px solid #555;border-radius:12px;padding:12px;max-width:92vw;width:420px;max-height:80vh;overflow:auto;font:14px system-ui,sans-serif';
    const h=document.createElement('div');h.style.cssText='font-weight:700;margin-bottom:6px';h.textContent='📥 Telegram se file chuno (apne bot ko bheji hui)';bx.appendChild(h);
    if(!list.length){const e=document.createElement('div');e.textContent='Koi file nahi mili. Pehle file ko "File" ki tarah bot ko bhejo (photo ki tarah nahi), phir dobara dabao. (Bot sirf pichhle ~24 ghante ki files dekhta hai.)';e.style.margin='6px 0';bx.appendChild(e);}
    list.slice(0,20).forEach(it=>{const b=document.createElement('button');b.type='button';b.style.cssText='display:block;width:100%;text-align:left;margin:4px 0;padding:9px 10px;border:0;border-radius:8px;background:#333;color:#fff;font-size:14px;cursor:pointer';
      b.textContent=it.name+'  ·  '+(it.size>1048576?(it.size/1048576).toFixed(1)+' MB':Math.max(1,Math.round(it.size/1024))+' KB')+'  ·  '+new Date(it.t).toLocaleTimeString('hi-IN',{hour:'2-digit',minute:'2-digit'});
      b.onclick=()=>{ov.remove();toast('📥 '+it.name+' utha raha…');getTgFile(it).then(bl=>{onFile(new File([bl],it.name,{type:it.mime||bl.type}));toast('✔ Load ho gayi: '+it.name);}).catch(e=>toast('✖ '+e.message,true));};bx.appendChild(b);});
    const c=document.createElement('button');c.type='button';c.textContent='✖ Band karo';c.style.cssText='margin-top:6px;padding:8px 12px;border:0;border-radius:8px;background:#555;color:#fff;cursor:pointer';c.onclick=()=>ov.remove();bx.appendChild(c);
    ov.onclick=e=>{if(e.target===ov)ov.remove();};ov.appendChild(bx);document.body.appendChild(ov);
  }).catch(e=>toast('✖ '+e.message+(/409|webhook/i.test(e.message)?' (bot par webhook laga hai)':''),true));}
function tgBtnCss(b){b.type='button';b.style.cssText='margin:2px 4px;padding:5px 10px;border:0;border-radius:8px;background:#2a5a8a;color:#fff;font-size:13px;cursor:pointer';return b;}
function addIn(inp){if(inp.dataset.tgl||inp.type!=='file')return;const acc=inp.getAttribute('accept')||'';
  const anchor=inp.closest('label')||inp;if(!inp.closest('label')&&(inp.hidden||inp.style.display==='none')&&!/\.(json|txt|csv|md)/i.test(acc))return;inp.dataset.tgl='1';
  const b=tgBtnCss(document.createElement('button'));b.textContent='📥 Telegram se';
  b.onclick=()=>pick(acc,f=>{try{const dt=new DataTransfer();if(inp.multiple&&inp.files)Array.from(inp.files).forEach(x=>dt.items.add(x));dt.items.add(f);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){toast('✖ File set nahi hui: '+e.message,true);}});
  anchor.insertAdjacentElement('afterend',b);}
function addTaLoad(ta){if(ta.dataset.tgl||ta.readOnly||ta.disabled)return;ta.dataset.tgl='1';const b=tgBtnCss(document.createElement('button'));b.textContent='📥 Telegram se text/JSON lo';
  b.onclick=()=>pick('.json,.txt,.md,.csv,text/plain,application/json',f=>f.text().then(t=>{ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));ta.dispatchEvent(new Event('change',{bubbles:true}));}));
  ta.insertAdjacentElement('afterend',b);}
window.TG_PICK=pick;
function scan(){document.querySelectorAll('textarea').forEach(t=>{addTa(t);addTaLoad(t);});document.querySelectorAll('input[type=file]').forEach(addIn);}
// 4) floating panel
function panel(){
  const f=document.createElement('button');f.type='button';f.id='tgFab';f.style.cssText='position:fixed;left:10px;bottom:10px;z-index:100000;border:0;border-radius:22px;padding:10px 14px;font-size:16px;color:#fff;background:#333;box-shadow:0 2px 8px #0008;cursor:pointer';
  const p=document.createElement('div');p.style.cssText='position:fixed;left:10px;bottom:56px;z-index:100001;background:#1b1b1b;color:#eee;border:1px solid #444;border-radius:12px;padding:10px;font:14px system-ui,sans-serif;display:none;min-width:240px;box-shadow:0 4px 14px #000a';
  function lab(){f.textContent=ready()?(tg.on?'📨 TG ✔':'📨 TG off'):'📨 TG setup';f.style.background=live()?'#2a8a3a':'#333';}
  function row(txt,fn){const b=document.createElement('button');b.type='button';b.textContent=txt;b.style.cssText='display:block;width:100%;text-align:left;margin:3px 0;padding:8px 10px;border:0;border-radius:8px;background:#333;color:#fff;font-size:14px;cursor:pointer';b.onclick=()=>{fn();draw();};p.appendChild(b);}
  function setup(){const t=prompt('Bot token daalo (@BotFather se):',tg.token||'');if(t===null)return;const c=prompt('Apna chat ID daalo (@userinfobot se). Bot ko pehle /start bhej do:',tg.chat||'');if(c===null)return;tg.token=t.trim();tg.chat=c.trim();tg.on=true;save();if(ready())fetch(API('sendMessage'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:tg.chat,text:'✅ Telegram connect ho gaya ('+document.title+')'})}).then(r=>r.json()).then(j=>toast(j&&j.ok?'✔ Test message gaya, Telegram dekho':'✖ '+((j&&j.description)||'token/chat id galat'),!(j&&j.ok))).catch(()=>toast('✖ Telegram tak nahi pahunch paya',true));}
  function draw(){p.innerHTML='';lab();
    const h=document.createElement('div');h.style.cssText='font-weight:700;margin-bottom:4px';h.textContent='📨 Telegram share';p.appendChild(h);
    if(!ready()){row('🔑 Setup (token + chat ID)',setup);return;}
    row(tg.on?'✔ Telegram ON (band karo)':'✖ Telegram OFF (chalu karo)',()=>{tg.on=!tg.on;save();});
    row((tg.dl?'✔':'☐')+' Download hote hi Telegram par bhi',()=>{tg.dl=!tg.dl;save();});
    row((tg.cp?'✔':'☐')+' Copy karte hi Telegram par bhi',()=>{tg.cp=!tg.cp;save();});
    row('🧪 Test message bhejo',()=>sendText('✅ Test: '+document.title));
    row('✂ Chuna hua text bhejo',()=>{const s=String(window.getSelection?window.getSelection():'');sendText(s);});
    row('🔁 Token/chat ID badlo',setup);
    row('🗑 Telegram hata do',()=>{tg.token='';tg.chat='';save();});}
  f.onclick=()=>{p.style.display=p.style.display==='none'?'block':'none';draw();};
  document.body.appendChild(f);document.body.appendChild(p);lab();}
function init(){scan();panel();try{new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}catch(e){}}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
