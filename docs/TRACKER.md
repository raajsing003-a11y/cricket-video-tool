# TRACKER — Cricket Video Tool (HTML, GitHub Pages)
Update this file at the end of EVERY chunk. Zip name: cricket_video_tool_chunkN.zip

## Decisions (final)
- Ek folder: index.html + js/*.js (plain <script>, no modules, no build) + assets/. GitHub Pages par seedha chalega.
- Canvas 1920x1080, 30fps, Chrome only. Timeline = scenes[] ({type,dur,tr,trDur,data}). Transition = overlap at start of next scene.
- Assets lazy-load per scene (har card template `assets(d)` return karta hai). Font: assets/NotoSansDevanagari.ttf (FontFace API).
- Photos: slot name -> user upload (baad mein IndexedDB). Placeholder: 07_photo_slot_placeholders. Web se photo download NAHI.
- Export v1: MediaRecorder (canvas.captureStream + WebAudio) -> MP4 agar Chrome support kare (video/mp4;codecs=avc1), warna WebM. Real-time. (User ne MP4-fast ka sawal ka jawab nahi diya; fast WebCodecs export baad ke chunk mein, mp4-muxer CDN pinned.)
- RETAIN card par label_sambhavit hamesha. RELEASE stamp official list tak nahi. Naye facts nahi jodna.

## Chunks (chhote rakhna)
- [x] C0: assets compress (11 MB), manifest.js, layout measurements, docs, plan
- [x] C1: js/core.js (loader, easing, text helpers, timeline render, fade/cut) + index.html shell + play/seek + demo scenes (tested)
- [x] C2: card `hook` (grunge bg, slam text, count-up, sparks, ribbon) - js/card_hook.js
- [x] C3: card `title` (team bg, chip, Breaking tag, scrolling ticker) - js/card_title.js
- [x] C4: card `stat` (blur bg, photo frame, lower-third, count-up)
- [x] C5: card `retain` (vertical card, photo, stamp slam + shake, sambhavit label)
- [x] C6: transitions: grunge wipe, zoom-punch, whip (+ later glitch, light-leak, smoke)
- [x] C7: export (MediaRecorder) + audio file input
- [x] C8: photo upload UI (slot list) + IndexedDB
- [x] C9a: captions (script lines spread over audio, nudge editor) - js/captions.js
- [x] C9b: per-chunk audio + mic record - js/audio_tracks.js
- [x] C10a: cards watch + rumour (js/card_watch.js)
- [x] C10b: cards anth + intro (js/card_anth.js)
- [~] C10c (optional): SKIP — user ne chhodne ko kaha (stat/retain reuse se kaam chalega)
- [x] C11 (generic): js/scene_editor.js — scene add/edit/reorder/duplicate/delete + JSON save/load. Tool future videos ke liye hai; koi specific video/script ka kaam NAHI (IPL script wala C11 cancel)
- [x] C12: fast export (WebCodecs + mp4-muxer, js/export_fast.js, vendored js/vendor/mp4-muxer.js)
- [x] C13: docs/GITHUB_GUIDE.md + README polish + .nojekyll
- [ ] Later (NEXT, jab user bole): thumbnail/Short templates, news tracker (GitHub Actions). Core tool complete.

## Testing rule
node --check har js file; headless chromium (playwright, /opt/pw-browsers) se frames screenshot dekhna; phir zip.

## Log
- C0 (16 Nov 2026): assets/manifest/docs ready. Code abhi nahi likha.
- Zip mein NAHI hai (jaan-boojhkar): purana plain video IPL2027_retention_visuals.mp4 + final_video/cards_png (user ko pasand nahi aaya), 09_player_photos khaali folders (photos user khud dalega). Original zip user ke paas hai.
- Assets PNG/WebP compressed hain (Gemini wale 1920px webp q82); original quality chahiye to original zip se lo.

- C1 (16 Nov 2026): core.js = window.CORE {ease, prog, load/img, font, cover, wrap, fitText, text, countUp, CARDS{}, TRANS{}, setScenes, preload, render, player}. Card API: CORE.CARDS[type]={assets(d)->keys, draw(ctx,t,d,scene)} (t = scene-local sec). Transition API: CORE.TRANS[name]=(ctx,A,B,p,scene). demo_scenes.js sirf test ke liye (C11 mein hatana). Font family 'NotoDev'. Test: chromium headless OK, no console errors.

- C2 (16 Nov 2026): js/card_hook.js. data:{bg,pre,big|to+dec,unit,post,ribbon}. Slam at 0.55s + shake + gold sparks (screen blend), ribbon slides in at 1.6s. Chromium test OK, no console errors. demo_scenes.js ab hook demo dikhata hai.

- C3 (16 Nov 2026): js/card_title.js. data:{city,headline,sub,ticker,bg}. city = kolkata/mumbai/... (chip + team bg auto). Tag slide-in, chip bounce, headline fitText 2 lines, ticker scroll. Test OK, no errors. Script load order in index.html: core, card_*.js, demo_scenes, main.

- C4 (16 Nov 2026): js/card_stat.js + core.js photo slots (CORE.photos, setPhoto(slot,img), photo(slot)->img|placeholder). data:{photo,pre,prefix,to,dec,unit|big,head,sub,lt:red|blue|purple,tag,bg,ribbon}. Photo frame ke ANDAR photo frame ke BAAD draw hoti hai (frame ka andar dark alpha hai). Test OK.
- C5 (16 Nov 2026): js/card_retain.js. data:{city,photo,name,amount,stamp:retain|watch|rumour|official,note,bg}. Card art pehle, photo uske upar (card ka photo area opaque hai). Stamp slam+shake 1.3s. label_sambhavit HAMESHA dikhta hai. stamp:'release' blocked (warn + retain stamp). Test OK.
- C6 (16 Nov 2026): js/transitions.js. TRANS: grunge (red halftone band, left->right), zoom (punch + white flash), whip (slide + blur). Scene mein tr:'grunge|zoom|whip|fade|cut', trDur. CORE.preload ab transition assets bhi load karta hai. Glitch/light-leak/smoke baad mein.
- C7 (16 Nov 2026): js/export.js. EXPORT.loadAudio(file), EXPORT.run(player,canvas,onStatus)->{blob,ext}, EXPORT.download. index.html: audio file input + Export button. Real-time record (tab khula/visible rakho). Chrome mein mp4(h264) agar support, warna webm. Test: 14.9s demo + wav -> mp4 1920x1080 h264 + audio, 15.3s, no errors. Audio video se lamba ho to video length par ruk jaata hai. Note: demo_scenes.js mein 'demo_slot' test photo main.js banata hai (C8/C11 mein hatana).

- C8 (16 Nov 2026): js/photo_slots.js (97 slots, PLAYER_PHOTO_CHECKLIST se; id = file stem jaise player_kolkata_sunil_narine_headshoulders) + js/photos.js (IndexedDB 'cvt_photos', PHOTOS.init/set/remove, '🖼 Photos' button -> city-wise list, search, upload/बदलो/✕, n/97 counter). Scene data.photo = slot id. Reload par photos wapas load. Test OK (upload, reload persist, remove, no errors). Next: C9 captions.

- C9a (16 Nov 2026): js/captions.js. CAP{lines[{text,t0,t1}],on}. Script textarea (har line = caption) -> Spread (char-length weights, audio length ya video length) -> per-line −/+ 0.1s nudge + ▶ seek. CORE.render wrap karke overlay (y~900, dark rounded box, 2 lines max) => export mein bhi aata hai. localStorage 'cvt_caps' mein save. Audio load par auto re-spread (nudges reset hote hain). Test OK, no errors. Next: C9b per-chunk audio + mic.

- C9b (16 Nov 2026): js/audio_tracks.js. AT{segs[{name,buf,start}]}. '🎚 Audio tracks' panel: multiple audio files (har ek pichli ke baad lagti hai), ⏺ Mic record (getUserMedia+MediaRecorder), per-segment start −/+ 0.1s, ✕ delete. AT.rebuild() sab ko stereo mix karke EXPORT.audio set karta hai => export/captions spread wahi use karte hain. Purana single 'Audio' input abhi bhi hai (EXPORT.audio replace karta hai; tracks panel ke saath mat mix karo). Captions auto re-spread nahi hote tracks badalne par - 'Spread karo' dobara dabao. Test OK (fake mic, 2 files, nudge, delete, export mp4, no errors). Next: C10 remaining cards (watch, rumour, split-screen, anth, intro torn paper, names list).

- C10a (16 Nov 2026): js/card_watch.js. watch data:{title,names[<=6],photos[1|2 slots],note,bg}: names stagger slide-in, WATCH stamp slam+shake 1.4s (top-right). rumour data:{head,sub,photos[1|2],bg}: 2 photo panels + green divider (full-screen overlay clipped y<680), RUMOUR stamp slam 1.2s, blue lower-third. Dono par label_sambhavit + ribbon. demo_scenes mein 2 naye demo. Test OK (chromium frames), no console errors. Next: C10b anth + intro.

- C10b (16 Nov 2026): js/card_anth.js. anth data:{title,qs[3],cta,bg}: 3 sawal stagger + question badge pop, cta pulse, ribbon. intro data:{line1,line2,bg,ribbon}: paper bg, red ball roll+spin (obj_ball_red green-screen hai -> keyGreen() chroma-key, cached 512px canvas), torn strip slide-in, gold sparks. Gemini objects (obj_*.webp) green-screen ho sakte hain -> keyGreen use karo. demo_scenes mein 2 naye demo. Test OK, no errors. Next: C11 IPL scenes JSON.

- C11 (16 Nov 2026, generic): js/scene_editor.js. '🎬 Scenes' panel (details) index.html ke neeche. SE.init(player, demoScenes) -> localStorage 'cvt_scenes' se scenes load (warna demo). Card type chun kar '+ Scene jodo' (defaults DEF{} mein), har scene: Dur, Transition (cut/fade/grunge/zoom/whip)+trDur, data JSON textarea ('Data lagao'), ↑↓ reorder, ⧉ duplicate, ✕ delete, ▶ seek. '⬆ JSON save' / '⬇ JSON load' scenes.json, 'Demo', 'Sab hatao'. Har change par CORE.setScenes + preload + autosave. Test OK (add, dur edit, reload persist, bad JSON error, clear, demo; no console errors). Note: photo slot id data.photo mein haath se likhna padta hai (slot-picker dropdown baad mein ho sakta hai). demo_scenes.js abhi bhi demo ke liye hai.

- C12 (16 Nov 2026): js/export_fast.js + js/vendor/mp4-muxer.js (v5.2.2, local copy, CDN nahi). '⚡ Fast export (MP4)' button (primary), purana '⏺ Real-time export' fallback ke liye rakha. EXPORT.fastSupported() (avc1.640028 -> 4d0028 -> 42001f -> vp9), EXPORT.runFast(P,onStatus)->{blob,ext,secs,vcodec,audio,acodec}. Frame-by-frame offscreen canvas -> VideoFrame -> VideoEncoder 12 Mbps, keyframe har 2s; audio resample 48k stereo -> AudioEncoder AAC (agar na ho to Opus fallback) . Audio video length par cut. Test (headless chromium, software encode): 31.1s demo, 1920x1080 h264 30fps + audio, no console errors; headless mein 47s lage (real Chrome GPU par tez hona chahiye, user machine par check baki). Headless mein AAC nahi tha -> Opus path test hua; AAC path real Chrome mein hi chalega. WebCodecs na ho to button disable.

- C13 (16 Nov 2026): docs/GITHUB_GUIDE.md (repo banao, upload, Pages on, roz ka use, update, backup), README.md polished, .nojekyll added. Sirf docs, code nahi badla.

- C14 (16 Nov 2026): js/polish.js — naye transitions glitch/flash/slideup (scene editor dropdown mein add) + global finishing: scene-start punch zoom, vignette, film grain (frame-seeded, export deterministic), light sweep, 0.35s fade in/out. CORE.POLISH.on=false (ya .grain/.vignette/.sweep/.fade/.punch values) se tweak/band. Captions in effects se untouched. Demo v2 (15s, 5 scenes, no audio) render hua: title -> hook(glitch) -> stat(slideup) -> retain(flash) -> anth(grunge). Default DEMO_SCENES abhi purane transitions par hain (optional update).

- C14b (17 Nov 2026): polish.js upgrade — handheld camera drift (CORE.POLISH.shake), smoke (.smoke), light leaks (.leak), floating embers (.dust); frame 1.2% scaled taaki edges na dikhein. Demo v3 (15s, hook->title(glitch)->stat(slideup)->retain(flash)->anth(grunge)) mein procedural demo portraits (canvas se bani, sirf demo ke liye, tool mein nahi). Sab POLISH values 0/false karke band ho sakti hain.

- C14c (17 Nov 2026): sab update tool mein merge — js/demo_portraits.js (CORE.demoPortrait, demo_slot/demo_a/demo_b), DEMO_SCENES ab v3 15s demo (hook->title glitch->stat slideup->retain flash->anth grunge), '✨ Polish: ON/OFF' button, polish.js full (handheld/smoke/leaks/embers/vignette/grain/sweep/fade). Test: page load OK (5 scenes, 15.0s), export 1920x1080 h264, console errors 0. Zip mein demo_15sec_v3_no_audio.mp4 bhi.

- C15 (17 Nov 2026): photo library naam se. photos.js: custom naam wale slots (player ya kisi bhi type: 'रोहित शर्मा', 'स्टेडियम भीड़'; id=custom_<naam>, list localStorage cvt_photo_custom, photo IndexedDB), PHOTOS.slots()/label()/addCustom(), '+ नाम जोड़ो', ⬆ Backup / ⬇ Restore (photo_library_backup.json). scene_editor.js: Scenes ke upar '📷 Is video ke liye photos: x/y taiyar' summary (missing photos naam + scene number + upload button), '🎬 Scenes · 📷 N photo baaki' badge, selected scene mein '📷 Photos' picker (library se chuno ✓/✗, ya upload — naam poochta hai agar slot khali ho, watch/rumour mein + / − photo). Test: custom upload -> scene mein assign -> reload ke baad bhi photo + naam, console errors 0. Slug fix: Devanagari matra (\p{M}) bhi rakhe.

- C16 (17 Nov 2026): js/card_presenter.js — 'presenter' intro card (scene editor mein type). data:{channel,name,sub,photos[],key:'auto'|true|false,swap}. Chroma key (CORE.keyed, auto-detect green corners, despill, trim), speed-line burst, glow, floating cricket icons, channel naam slam (digits gold), expression swap har ~1.4s (pop+flash), lower-third naam (Yuvraj Sisodiya). Test: synthetic green-screen expressions se 5s intro render OK, console errors 0. docs/GEMINI_GREENSCREEN_PROMPTS.md (green-screen expression prompts). Asli photos aane par check baaki (hair edges / green spill).

## Chunk queue v2 (17 Nov 2026, MASTER base se) — is order mein, ek chat = ek chunk
Rahul ne tay kiya: match prediction aur photo license tracking BAAD MEIN. Har chunk ke baad complete zip.
- [x] C17: Audio-fit timing. Scene mein optional `chunk` (1-based) = audio segment number. Button "⏱ Audio ke hisaab se scenes fit karo": har audio segment ke scenes ki dur ka sum = segment length (har scene min 1.5s, transition overlap ka dhyan), captions dobara spread. Test: 2 fake audio + 6 scenes.
- [x] C18: Scenes JSON schema + validator. docs/SCENES_JSON_SCHEMA.md (har card type ke data fields, defaults, 8-scene example, `chunk` field) + tool mein "✔ JSON check" (unknown type, unknown photo slot, bahut lamba headline, retain par label rule). Taaki Claude chat mein script se scenes.json bana kar de sake aur wo bina error load ho.
- [x] C19: Short (9:16, 1080x1920) mode: format switch, 3 vertical cards (hook, stat+photo, cta), polish/export same, bade captions.
- [x] C20: Thumbnail maker: 1280x720 canvas, photo slots (chehra + 2-4 collage), bold Devanagari/English brush text, tag, team colour, PNG download; 3 presets (sirf layout reference, kisi ka content copy nahi).
- [x] C21: Publish pack: 5 title options, description (scenes ke time se chapters + source list), tags, upload se pehle checklist; template-based, copy buttons.
- [x] C22: News tracker (GitHub Actions): feeds.json, fetch_news.py, .github/workflows/news.yml, news page (tags Trade/Retention/Release/Auction/Team News/India Match, Confirmed/Rumor label, Aaj ki top 5, Mark as used).
- [~] C23 (SKIP — Rahul ne kaha rehne do): Hisaab page: 4,000-hour progress bar, upload streak, video-wise views/hours input, 15 Dec aur mid-Jan checkpoint, localStorage + JSON export.
- POSTPONED: match prediction cards/kit (pitch report, Playing XI, team comparison, head-to-head, points table); photo source/license/credit status + export warning.

- MASTER base (17 Nov 2026): v3 tool + docs + demo ek zip mein, 00_START_HERE.md aur PROMPT_NEXT_CHAT.md root par. node --check sab js OK. Koi code change nahi.

- C17 (17 Nov 2026): js/audio_fit.js (+ scene_editor.js, index.html mein chhota patch). Scene mein optional `chunk` (1,2,3 = 🎚 Audio tracks ki n-th voice-over file; khali ho to pichle scene ka chunk, pehle ka 1; chunk badhte order mein). Scenes panel mein 3 cheezein: har scene mein 'Chunk' number field (+ 🎙n badge), '🎙 Chunk baanto' (scenes ko audio chunks mein audio ki lambai ke hisaab se baant deta hai), '⏱ Audio ke hisaab se fit' (har group ke scenes ki dur proportional scale hoti hai taaki group ka pehla scene us audio chunk ke start par shuru ho aur aakhri scene agle chunk tak/audio ke end tak chale; transition overlap ka hisaab; har scene min max(1.5s, trDur+agli trDur+0.3)). Pehle group 0s se shuru. Audio chunk jis ke liye scene nahi, uske liye pichla group chalta rehta hai (note). Audio chhoti ho to min par rakh kar warning. Error: chunk audio se zyada ya ghatta order -> message, kuch nahi badalta. Single purani 'Audio' file bhi 1 chunk maani jaati hai. Test (headless chromium, fake audio 6s+9s+5s, 5 demo scenes chunks 1,1,2,2,3): starts [0,2.84,6,10.77,15], total 20.0 = audio 20.0; chunk reload ke baad bhi rehta hai; bad chunk/decreasing order message OK; autoassign [1,2,2,2,3] + fit OK; tiny audio warning OK; console errors 0. Note: audio chunks (AT.segs) reload par nahi bachte — har baar dobara lagao. Next: C18 (scenes JSON schema + validator).

- C18 (17 Nov 2026): js/scenes_check.js (SCHK.check/report, node mein bhi chalta hai) + docs/SCENES_JSON_SCHEMA.md + docs/example_scenes_8.json (8 scenes, format example). Scene editor mein '✔ JSON check' button; '⬇ JSON load' ab pehle check karta hai: ERROR ho to load NAHI hota (list dikhti hai), WARNING ho to load hota hai + list. Pakadta hai: unknown type/transition/city/lt/stamp/key/bg, unknown photo slot (demo_* ok), photo upload baaki (warning), dur/trDur/chunk galat, names>6, qs>3, release stamp, label hatana, fantasy/Dream11/betting (error), team short form + source naam (warning), lamba text, unknown field. Scene editor ke JSON input ko id 'se_json' diya (test ke liye). Test: node unit (good example OK, 9 bad scenes ke 21 errors/10 warnings sahi), headless chromium (demo check OK, good example load 8 scenes 35.0s, 2 bad files refuse hui aur scenes nahi badle, non-array alert, console errors 0 sirf favicon 404). node --check sab js OK. Next: C19 (Short 9:16).

- C22 (17 Nov 2026, C19 se pehle Rahul ke kehne par): news tracker. feeds.json (6 feeds: Google News queries + ESPNcricinfo, tag_rules, rumor_words, blocked_words), scripts/fetch_news.py (stdlib; RSS+Atom; dedupe, 14 din, tags, Confirmed sirf official feed par warna Rumor, blocked words drop, title-similarity cluster + score), .github/workflows/news.yml (cron har 3 ghante + manual, actions/checkout@v4, setup-python@v5, news/news.json commit), news/news.json (khaali shuru), news.html (top 5, tag/label filter, khoj, Used mark + save/load, Copy; mobile dark, bada text), index.html mein 📰 link, docs/NEWS_TRACKER.md (setup + niyam). Test: local file:// sample RSS+Atom feeds (dedupe, old drop, blocked, bad feed tolerate, Hindi, 2nd run 0 naye, cluster) OK; headless chromium news.html (top5, filters, search, used + cluster hide, reload persist, console errors 0). NOT tested: live feeds (sandbox mein internet nahi) - pehli GitHub Run mein 'feed fail' line dekho. Actions permission 'Read and write' on karni hogi. Next: C19.

- C24 (17 Nov 2026, Rahul ke kehne par, chunk queue ke bahar): teleprompter.html — dark full-screen script reader. Chunks '---' se, A−/A+ size (16-160, localStorage), auto-scroll speed slider (user haath se hilaye to wahin se aage), mirror, controls chhupao, wake lock, Fullscreen API, keyboard shortcuts. Mic record (MediaRecorder, webm/opus ya m4a) har chunk ke liye, IndexedDB 'cvt_voice' (store 'rec', key chunk) mein save, ▶ suno/⬇ download/✕/sab download. audio_tracks.js mein '🎤 Recordings lo' (AT.importVoice) -> chunk order mein Audio tracks mein. index.html mein 🎤 link. docs/TELEPROMPTER.md. Test (headless chromium, fake mic): 3 chunks, font +/-, autoscroll, pause, manual scroll, mirror, record chunk1+2 (scroll saath), recs list, download voice_chunk1.webm, reload persist, tool import 2/2 (2.5s + 2.0s), delete, console errors 0. Real phone par mic/fullscreen check Rahul ke device par baaki. Next: C19.

- C19 (17 Nov 2026): Short 9:16 mode. core.js: CORE.setFormat('wide'|'short') (C.W/C.H badalte hain, buffers + canvas resize, CORE.onFormat hooks), CORE.FORMATS. polish.js (vignette/buffer W,H dynamic), captions.js (short mein bade 68px, 3 line, y~1240), export_fast.js (W,H C.W/C.H se; 1080x1920 h264 level 4.0 OK). Naya js/card_short.js: short_hook {pre,big|to,dec,unit,post,bg}, short_stat {photo,pre,prefix,to,dec,unit|big,head,sub,lt,tag,bg} (photo frame + neeche lower panel y1500-1650), short_cta {line1,line2,cta,bg} (subscribe button pulse); safe zone: upar 160px / neeche 300px khali. DEMO_SHORT (3 scenes). index.html mein '📱 Short 9:16: ON/OFF' button; format localStorage 'cvt_format' mein; har format ke scenes alag save (cvt_scenes / cvt_scenes_short) — switch karne par kuch lost nahi. Scene editor mein format ke hisaab se card type list + Demo. scenes_check.js: short_* types + keys + limits, galat format ka card = ERROR (wide card Short mein / short card wide mein), Short 60s se lamba = warning. Transitions (grunge/zoom/whip/glitch/flash/slideup) dono formats mein chalte hain. Test (headless chromium): wide 1920x1080 OK, toggle -> 1080x1920, 3 cards + transition + captions frames dekhe, checker (good/bad), editor types, reload par Short bana raha, fast export 9.3s -> h264 1080x1920 (ffprobe), wapas wide: 5 scenes 15.0s intact, console errors 0. node --check sab js OK. NOT tested: asli photos (frame/crop), real Chrome par speed, phone par YouTube Shorts UI overlap (safe zone sirf andaze se). Wide cards (presenter etc.) Short mode mein nahi chalte — Short ke liye sirf short_* cards. Next: C20 (thumbnail maker).

- C20 (17 Nov 2026): thumbnail.html (alag page, video tool ko nahi chhedta; index.html mein 🖼 link). 1280x720 canvas. Uploads: Background (Gemini, bina text; default = bg_stadium_night_floodlights), chehra (photo 1, optional green-screen key + despill), photo 2/3. 3 presets: (1) chehra bayen + text dayen, (2) 3 photo collage + text neeche, (3) bada number beech mein. Text: tag, upar ki line, badi line, number + unit; 4 rang (sona+laal/neela, safed+baingani, hara+sona); chehra size/left-right/up-down sliders; optional label "संभावित: ऑफिशियल लिस्ट नहीं" (default ON). Check: fantasy/Dream11/betting = error msg, team short form = warning, lamba text = warning. Download PNG + JPG (YouTube limit 2MB, size dikhta hai). Settings localStorage cvt_thumb mein (photos nahi). Test (headless chromium, synthetic green-screen + 2 photos): 3 presets frames dekhe aur overlap theek kiye, PNG 1280x720 (1.2MB), JPG (118KB), reload par text+preset persist, console errors 0. NOT tested: asli Gemini bg + asli photos (green spill / hair edges). Next: C21 (publish pack).

- C21 (17 Nov 2026): publish.html (alag page; index.html mein 📦 link). Input: topic, hook, number+unit, keywords, संभावित checkbox, sources, photo credit. Output: 5 title options (template, har ek par akshar count: hara <=60, peela <=100, laal >100; संभावित par "(संभावित)" suffix), chapters (cvt_scenes ya cvt_scenes_short ya scenes.json upload se; scenes ka label card data se; chhote scenes 10s tak mil jaate hain; 0:00 se, kam se kam 3 ki warning; textarea mein edit ho sakta hai), description (topic line + संभावित disclaimer + chapters + sources + credit + 3 hashtags, 5000 limit count), tags (keywords + topic + क्रिकेट न्यूज़/cricket news, 500 limit count), 13-point upload checklist (localStorage cvt_publish_ck). Copy buttons. Warnings: fantasy/Dream11/betting/giveaway = error, team short form = warning. Naye facts nahi judte (sirf Rahul ka bhara text). Test (headless chromium, example_scenes_8.json): chapters 0:00/0:12 + 3-chapter warning, 5 titles, description, tags 79/500, bad word error, galat chapter error, checklist persist, reload persist, console errors 0. NOT tested: real clipboard permission (fallback execCommand hai). Next: C23 (hisaab page).

- C23 (17 Nov 2026): Rahul ne skip kiya. Queue mein ab koi pending chunk nahi; naya kaam Rahul batayega (postponed: match prediction cards, photo license tracking).

- C25 (17 Nov 2026): presenter card asli photos ke saath check + fix. js/card_presenter.js: C.keyed ke end mein side-feather — agar cutout left/right kinare se kata hai (bazu/haath frame se bahar), us side par ~7% soft fade (hard kata kinara nahi dikhta); bottom ko chhua nahi (card mein neeche frame ke bahar jaata hai). Test (headless chromium, asli 7 green-screen photos: wave, point, baat, thumbs-up x2 + 2 kate-bazu wali): 7 expression swap (swap 1.0s) frames dekhe, hair/kaan/dadhi edges saaf, green spill nahi, console errors 0, node --check OK. Finding: photo ke corners hare na hon (jaise close-up chehra jiske corners safed the) to key:'auto' key nahi lagata — aise photo ke liye scene mein key:true ya hara background rakho. Rahul ke 13 pics mein 12 theek; 1 close-up (158549) chhod diya. Best swap set: wave, point, baat, thumbs-up (sab ek hi check shirt). Next: thumbnail maker asli photos + Gemini bg ke saath check, ya Rahul jo bole.

- C26 (17 Nov 2026): thumbnail maker asli photos ke saath check + 2 fix. thumbnail.html: (1) 'Green-screen hatao' checkbox ab default ON (pehle OFF tha, to green-screen photo ka hara dikhta tha). (2) Photo 2/3 (collage) ke corners hare hon to unka bhi hara auto hat jaata hai (cornerGreen + autoKeyed; photo 1 pehle se keyed tha; hare na hon to photo jaisi hai waisi). Test (headless chromium, asli green-screen photos, 3 presets + safed shirt wali photo, Gemini bg ki jagah default bg_stadium_night_floodlights): face preset, collage, bada number — teeno mein cutout saaf, hara spill nahi, text/tag/संभावित label theek, console errors 0. NOT tested: asli Gemini background (Rahul ka), Hindi text ka Gemini bg ke saath contrast. Next: Rahul jo bole (real Chrome par export speed, Short phone check, ya postponed kaam).

- SCRIPT WORKFLOW (17 Nov 2026, chunk31; koi code change nahi): Rahul ke kehne par script ka tareeka likha. Naye: docs/SCRIPT_WORKFLOW.md (kaam ka order, niyam, check-checklist, Gemini ki aam galtiyan), docs/GEMINI_SCRIPT_PROMPT_TEMPLATE.md (EK message: niyam shuru mein + facts + aakhir mein 'best se bhi best'), docs/scripts/2026-11-17_shami_curran_trade/ (pehle video ka Fact Pack, Gemini message, Gemini output v1, check notes, FINAL script 642 shabd, ek hi chunk), root par PROMPT_SCRIPT_CHAT.md. 00_START_HERE.md mein niyam 11-12 + 'Script ka kaam' section; PROMPT_NEXT_CHAT.md (tool chat) mein docs/scripts na padhne ki baat. Tool ke liye: script ek hi chunk ho to teleprompter mein '---' mat lagao; scenes mein sab chunk 1 (audio ek file) — ek audio par ⏱ fit kaisa baithta hai, ye Rahul ke asli video par check baaki. Next: Rahul voice-over karega, phir scenes.json (alag script chat mein).


- SCENES (17 Nov 2026, chunk32, koi code change nahi): Shami-Curran video ke liye docs/scripts/2026-11-17_shami_curran_trade/06_SCENES.json (22 scenes, chunk 1, dur jod 258.5s). scenes_check.js se node mein check: 0 errors, sirf photo-upload warnings. NOT tested: browser mein load + asli photos + ek audio par ⏱ fit (Rahul ke PC par). Next: Rahul scenes load kare, photos upload kare, captions + export, phir publish.html.

- SESSION NOTES (17 Nov 2026, chunk33, koi code change nahi): Rahul ke PC par scenes.json load: pehle custom photo slots na hone se 13 error (slots bana ke theek), demo scenes 'Sab hatao' se hataye, photo upload list se, audio 522.8s vs script ~4:20 (⏱ fit se), preview mein awaaz ka sawaal (checklist docs/SCRIPT_WORKFLOW.md mein). 22 scenes load OK (247.1s, 16 photo warnings). Next: photos upload, audio fit, preview, export, thumbnail, publish pack.


## C27 (17 Nov 2026) — Preview mein audio sound
Problem: audio upload karne par ▶ preview mein awaaz nahi aati thi (player sirf canvas draw karta tha, audio sirf export mein jaata tha).
Fix: naya js/audio_preview.js (AP). ▶ par EXPORT.audio P.t se bajta hai; pause/seek par ruk kar naye time se chalta hai; Real-time export ke dauran preview audio mute. index.html + js/main.js (AP.init) badle.
Test: node --check OK. Real Chrome par sound check baaki (Rahul).


## C28 (17 Nov 2026) — Demo hataye
Tool ab khaali (0 scenes) se shuru hota hai. Hataya: demo scenes (DEMO_SCENES, DEMO_SHORT), demo photos (demo_a/demo_b/demo_slot), 'Demo' button, js/demo_scenes.js, js/demo_portraits.js. 'Sab hatao' ke baad reload par bhi khaali rehta hai (pehle demo wapas aa jaata tha). Scenes JSON load / + Scene se banao.


## C29 (17 Nov 2026) — UI facelift (aasan + achha look)
Naya js/ui_shell.js + index.html CSS/markup. Dark theme, upar nav (News/Teleprompter/Thumbnail/Publish), player ke neeche Short/Polish toggle, 5 step tabs (1 Scenes, 2 Photos, 3 Audio, 4 Captions, 5 Export) - ek waqt ek hi panel, har tab par ek line ki hint. Khaali tool par guide box (JSON load / scene banao). Keyboard: Space play/pause, <- -> 1s seek. Purane modules ka logic nahi badla (panels sirf tabs mein rakhe). Test: headless chromium, 0 console errors, tabs + Space OK. Real Chrome par look check baaki (Rahul).


## C30 (17 Nov 2026) — Text bahar nahi jaata + editing behtar
Bug: text frame se bahar nikal kar kat raha tha (C.text ek line bina limit ke; fitText min size par ruk kar text chhod deta; wrap lambe shabd nahi todta; captions .slice se text kaat deta).
Fix (js/core.js): C.wrap lambe shabd ko todta hai; C.fitText font aadhe tak chhota karta hai, bilkul na aaye to hi aakhir mein "…"; C.text ab frame ke SAFE margin (40px) ke andar font khud chhota karta hai (tilt/scale mein bhi), zarurat par "…". js/captions.js: font chhota hota hai, text kata nahi.
Naya (js/ui_shell.js): ↶ Undo / ↷ Redo (scenes ka history, Ctrl+Z / Ctrl+Y), ▦ Safe zone guide (sirf preview; Short mein YouTube UI zone; real-time export mein band).
Test: 6 cards par 5x lambe text stress-test, sab frame ke andar; undo/redo + safe zone headless OK, 0 console errors.


## C31 (17 Nov 2026) — Advanced transitions + FX
Naya js/transitions_pro.js: 8 transitions (push, iris, blinds, rgb, spin, lightwipe, tiles, blurfade) - wide + Short dono. Naya js/fx_pro.js: Colour Look (Warm, Golden hour, Cool, Night stadium, Teal-Orange, Vivid, B&W), Cinema bars, Progress bar (sab export mein aate hain, captions ke neeche). Player ke neeche dropdown + toggles (ui_shell.js). scenes_check.js + scene_editor.js ki TRS list update, SCENES_JSON_SCHEMA update. Test: headless chromium, sab 8 transitions + looks render OK, 0 console errors. Real Chrome export par speed (tiles/rgb/blur) check baaki.


## C32 (17 Nov 2026) — Look preset + Auto-vary (har video ek jaisa na lage)
Naya js/looks.js (index.html mein ui_shell.js ke baad), ui_shell.js mein chhota patch (UI.syncFX: Colour Look dropdown + Cinema/Progress toggles preset ke saath sync).
- 🎨 Look preset dropdown (player ke neeche): Night, Gold, Clean, Grunge, Studio. Har look = polish values (vignette/grain/sweep/leak/smoke/shake/dust) + Colour Look + bars/progress + apne bg aur transition ka pool. 'koi nahi' = purane default wapas. Choice localStorage 'cvt_look' mein, reload par wahi.
- 🎲 Auto-vary button: scenes ke data.bg aur tr ghumata hai (look ke pool se; look na ho to sab pool). Niyam: lagatar do scene par same bg/tr nahi; pichli baar (cvt_vary_hist, format ke hisaab se) jo lage the unse bachta hai jab vikalp ho; is baar kam use hue ko pehle. Title/retain (team colour) aur intro (paper) ka bg nahi badalta; text/facts/dur/chunk nahi chhute. trDur galat/0 ho to 0.3-0.6 set. Pasand na aaye to ↶ Undo ya dobara 🎲.
- Bg sirf dark/mid wale (brightness < ~105) taaki safed text padhne mein aaye.
Test (headless chromium, example_scenes_8.json): look apply (polish + FX + dropdown sync), 3 baar vary (har baar alag bg/tr, koi lagatar repeat nahi, title/retain/intro bg khaali), ✔ JSON check OK (sirf photo warnings), Undo, reload par look rehta, 'koi nahi' par defaults wapas (vignette .55, grain .07), Night/Gold frames dekhe (text saaf), console errors 0. node --check sab js OK.
NOT tested: real Chrome par export, asli video par ye looks Rahul ko pasand aate hain ya nahi (pools badalna ho to js/looks.js ke LOOKS object mein).
Next: Rahul jo bole (naye card layout variants, real Chrome export check, Short phone check, ya postponed kaam).


## C33 (17 Nov 2026) — Stat card layout flip
js/card_stat.js: naya optional `flip:true` = layout aaina (photo dayen, number bayen, lower-third bayen + mirrored image, tag/ribbon bayen side; unme text hai isliye mirror nahi, sirf side badla; lower-third ka text flip mein +50px). scenes_check.js mein stat ke known fields mein 'flip'. js/looks.js: 🎲 Auto-vary ab stat cards par flip baari-baari lagata hai (pehla random) aur message mein batata hai.
Test (headless chromium): stat normal vs flip frames (final + animation beech), lower-third text saaf, Auto-vary se flip True/False, console errors 0. node --check sab js OK.
NOT tested: asli photo ke saath flip (photo frame ke andar hi rehti hai, isliye risk kam). Short stat/hook mein flip nahi (abhi sirf wide stat).
Next: Rahul jo bole (hook/retain ke layout variants, real Chrome export check, Short phone check, postponed kaam).


## C34 (17 Nov 2026) — Hook + Retain layout variants
js/card_retain.js: optional `flip:true` = card dayen, naam/amount/note bayen, label bayen, ribbon bayen (card image mirror nahi hoti, sirf jagah; slide-in dayen se). js/card_hook.js: optional `left:true` = pura text x~36% par (dayen taraf bg/sparks khuli); post line ki width 1000 (2 line mein wrap). scenes_check.js known fields: hook 'left', retain 'flip'. js/looks.js: 🎲 Auto-vary ab stat+retain par flip baari-baari, hook par left random lagata hai (message mein 'N card ka layout badla').
Test (headless chromium): hook normal/left, retain normal/flip frames dekhe (text/stamp/label saaf, kuch kata nahi), Auto-vary ke baad ✔ JSON check OK (sirf photo warning), console errors 0. node --check sab js OK.
NOT tested: asli photo ke saath retain flip; hook left mein bahut lamba pre/unit. Short cards mein variants nahi.
Next: Rahul jo bole (title/watch/rumour variants, real Chrome export check, Short phone check, postponed kaam).


## C35 (17 Nov 2026) — Title / Watch / Rumour layout variants
js/card_title.js: optional `left:true` = team chip bayen (chhota 0.95x), headline/sub dayen (3 line tak, width 900). js/card_watch.js: watch `flip:true` = photos dayen, list bayen, WATCH stamp beech mein; rumour `flip:true` = 2 photo ki jagah adli-badli. scenes_check.js known fields: title 'left', watch/rumour 'flip'. js/looks.js: 🎲 Auto-vary ab title/hook par left random, stat/retain/watch par flip baari-baari, rumour par flip random lagata hai.
Test (headless chromium): title normal/left (pehle chip frame se bahar kat raha tha: scale 1.6 -> 0.95 kiya), watch normal/flip (2 photo), rumour normal/flip, Auto-vary chala, console errors 0. node --check sab js OK. (Test mein nakli photo slot 'a','b' se checker ne error diya — wo test ki galti thi, tool ki nahi.)
NOT tested: asli photos ke saath rumour flip (placeholder mein dono photo ek jaisi, farak dikhta nahi); title left mein bahut lamba headline (3 line limit).
Next: Rahul jo bole (anth/intro/presenter variants, real Chrome export check, Short phone check, postponed kaam).


## C36 (17 Nov 2026) — Anth + Intro layout flip
js/card_anth.js: anth `flip:true` = sawal ki patti dayen se aati hai, ? badge dayen, gold line dayen, text bayen se (290). intro `flip:true` = red ball dayen se (ulta ghoomta), torn strip bayen se. scenes_check.js known fields: anth/intro 'flip'. js/looks.js: Auto-vary anth/intro par flip random.
Presenter card jaan-boojhkar nahi (speed lines, channel text, lower-third sab ek taraf bane hain; mirror karna bada kaam, aur ye card roz nahi aata) — chahiye to alag chunk.
Test (headless chromium): anth normal/flip, intro normal/flip + flip animation beech ka frame, Auto-vary, ✔ JSON check OK, console errors 0. node --check sab js OK.
NOT tested: anth flip mein 3 lambe sawal (2 line wrap, width 1240 hi hai, pehle jaisi).
Next: Rahul jo bole (presenter flip, real Chrome export check, Short phone check, postponed kaam).


## C37 (17 Nov 2026) — Fixed channel intro (script + tool)
Rahul ka niyam: har video ki shuruaat "नमस्कार दोस्तों! मैं हूँ युवराज, और आप देख रहे हैं 99 क्रिकेट न्यूज़।" -> "इस वीडियो में हम बात करेंगे ..." (preview) -> "तो बिना देर किए, शुरू करते हैं।" -> phir main video.
Naya docs/CHANNEL_INTRO.md (teeno hisse, niyam, tool ka tareeka). Script side: SCRIPT_WORKFLOW.md (niyam 9, checklist, lambai ~40 shabd zyada, scenes mein jagah), GEMINI_SCRIPT_PROMPT_TEMPLATE.md (SHURUAAT (FIXED) block + dhancha + aakhir ki yaad), PROMPT_SCRIPT_CHAT.md, 00_START_HERE.md niyam 13, SCENES_JSON_SCHEMA.md Claude-niyam 6 (JSON mein presenter scene nahi; pehla scene preview).
Tool (js/looks.js): player ke neeche '🎬 Standard intro jodo' (presenter scene sabse aage, dusre scene par fade transition, chunk pehle scene wala) aur '⭐ Standard intro save' (chuna hua presenter scene localStorage 'cvt_std_intro' mein; agli baar ek click mein wahi photos/naam/dur). Sirf wide mode. Pehla scene pehle se presenter ho to dobara nahi jodta.
Test (headless chromium): add (9 scenes, presenter first, hook par fade), dobara add roka, bina presenter chune save roka, save + reload + add (naam/dur/photos wahi aaye), console errors 0. node --check sab js OK.
NOT tested: asli presenter photos ke saath; asli audio par ~6 sec ki intro line ka timing (⏱ fit se baithna chahiye). Purana Shami script is intro ke bina hai (record ho chuka, badla nahi).
Next: Rahul jo bole (naya script is intro ke saath, caption styles, thumbnail preset, real Chrome export check).


- C44 (17 Nov 2026): Photo Finder Chrome extension (zip ke bahar, photo_finder_extension/ folder, repo mein nahi jaata). Photos panel mein 🔍 Google button + khaali sab auto queue. Tool code nahi badla. Install: photo_finder_extension/README.txt. Test: buttons + slot set OK (headless); asli Google pick/Auto Rahul ke Chrome mein check baaki.

## C38 (17 Nov 2026) — Intro order badla
Naya order: 'is video mein' teaser -> fixed intro (presenter) -> 'shuru karte hain' -> video. js/looks.js: 🎬 Standard intro jodo ab presenter scene pehle scene ke BAAD lagata hai (fade dono taraf); pehle se presenter ho to dobara nahi jodta. Docs badle: CHANNEL_INTRO, SCRIPT_WORKFLOW, SCENES_JSON_SCHEMA, GEMINI_SCRIPT_PROMPT_TEMPLATE.

## C46 (17 Nov 2026) — Like/Comment/Subscribe CTA (script + slides)
Naya docs/CHANNEL_CTA.md: har script mein 2 FIXED CTA (beech: like+subscribe, aakhir: comment+like+subscribe). Naya wide card `cta` (js/card_cta.js, mode like|end, Path2D icons, no assets); scene_editor + scenes_check mein jura; looks.js mein '📣 Like/Comment/Subscribe slides jodo' button (beech + aakhir, dobara nahi jodta). Script docs: GEMINI template, SCRIPT_WORKFLOW checklist, SCENES_JSON_SCHEMA. Test: node --check sab, headless: button 10 scenes banata (cta beech + aakhir), SCHK errors 0, dono mode render check (screenshot dekha), console errors 0. NOT tested: asli audio par timing, MP4 export mein cta.

## C47 (17 Nov 2026) — Rahul ke diye photos assets mein
assets/12_city_photos/ (10 stadium, 2 crowd, 3 khana cut-out transparent, bg_green_circle_slot) + 06_icons/icon_youtube_logo.png; js/manifest.js + MASTER_INDEX.csv + ASSET_LIBRARY_README update. CTA card ka subscribe icon ab asli YouTube logo. Test: scenes check errors 0 (bg key accept), Eden bg wala hook aur cta end render dekha, console errors 0. Note: kuch photos chhoti (600-900 px) -> 1080p par thodi soft; khana cut-out ke kinaare (vadapav) par halka halo; license/credit track nahi (postponed). bg_green_circle_slot ka kaam Rahul batayega (abhi sirf asset).

## C48 (17 Nov 2026) — Rahul ke 2nd batch photos/logos assets mein
Naye: 13_logos (logo_ipl, logo_kkr, ipl_trophy, badge_live), 01_backgrounds (bg_pitch_stumps_floodlights, bg_pitch_stumps_smoke, bg_yellow_halftone), 06_icons/icon_youtube_logo_gradient, food_vadapav naya (purana replace). Flat YouTube logo pehle se tha (duplicate skip). manifest.js + MASTER_INDEX.csv + README update; alpha check (preview) OK. Note: 3 bg sirf 612 px (1080p par soft), IPL logo gehra neela (dark bg par nahi dikhega), brand logo/license check baaki.

## C49 (17 Nov 2026) — Rahul ke 3rd batch (19 images) assets mein
Naya folder assets/14_channel_brand/ (11: tpl_frame_blue_screen_helmet, tpl_frame_white_box_bottom_bar [box transparent], tpl_outro_host_visit_at, tpl_kaun_jitega_match, tpl_split_black_red, tpl_curve_white_black, text_99_black, text_only_at, text_99cricketnews_com, text_get, text_match_prediction). 13_logos: photo_bcci_logo_glass, logo_99cricketnews_blue_yellow, logo_99_icon, logo_99cricketnews_circle. 01_backgrounds: bg_channel_stadium_blur_bright/dark, bg_yellow_texture_wall. 12_city_photos: stadium_mumbai_wankhede_aerial. Sab webp (max 1920). js/manifest.js (161 keys, sab files maujood), MASTER_INDEX.csv, ASSET_LIBRARY_README update. Duplicate check: koi pehle wala nahi mila. Tool code nahi badla (sirf assets).
Notes: text_only_at mein N/I/A/T par glitch (toote tukde) — dobara banwana behtar. bg_yellow_texture_wall (500 px) aur wankhede aerial (650 px) 1080p par soft. Ye graphics ab sirf asset hain; kisi card/scene mein kaise lagane hain (outro, thumbnail template, prediction post) Rahul batayega.

## C50 (17 Nov 2026) — Rahul ke 4th batch (20 images) assets mein
13_logos: logo_rcb, logo_srh, logo_csk, logo_mi, logo_dc, logo_bcci, logo_kings_xi_punjab_old, badge_live_red_flat. 06_icons: icon_vs_orange_small, icon_vs_orange, icon_vs_red_gold (pngtree.com watermark alpha se hataya, check kiya). 02_overlays: ov_lower_third_yellow_white (kaala bg transparent kiya), ov_circle_ring_black. 01_backgrounds: bg_studio_cricket_stadium_set, bg_stadium_night_floodlights_smoke. 12_city_photos: wankhede night_floodlights (left neeli patti kaati), day_empty, night_crowd, day_match, panorama. webp, max 1920. manifest 181 keys (sab files maujood), MASTER_INDEX + README update. Duplicate nahi mila. Code nahi badla.
Notes: logo_kings_xi_punjab_old purana hai (ab Punjab Kings) — naya logo chahiye. Team logos/BCCI ka brand-license check baaki (README rule: pehle sirf chips). ov_lower_third (468 px) aur kuch Wankhede/night bg (612-794 px) 1080p par soft. ov_circle_ring andar se safed bhara hai, transparent nahi. day_match photo mein scoreboard/sponsor dikhte hain.

## C51 (17 Nov 2026) — Rahul ke 5th batch (20 images) assets mein
19 naye assets (list: README C51 row). Duplicate skip: 158914 (= logo_99cricketnews_circle, 512 px version). 158912 = logo_99_icon ka bada version -> logo_99_icon_large. bg_black_blue_gradient: original par 'amply.com' watermark tha -> gradient dobara banaya (watermark nahi). icon_subscribe_button ke khaali kinare kaate. Phone mockup ki screen transparent (check kiya). manifest 200 keys, sab files maujood. Code nahi badla.
Status YELLOW (license/source verify karo): bg_baseball_stadium_red_sunset (BASEBALL stadium, board par text/ads), photo_ipl_trophy_ribbons (ribbon par DREAM11 — channel niyam fantasy/Dream11 nahi, isse bachna), crowd_csk_fan_sign (asli logon ke chehre + Jio/Gulf), player_chennai_csk_jersey_portrait (web ki photo; khiladi ka naam nahi diya), wankhede_panorama_small. Niyam 5 'photos web se download nahi' — in photos ko video/thumbnail mein daalne se pehle source/license check.
Chhote: bg_blue_gradient_glow (225 px, smooth hai), telegram button (300 px), yellow_halftone_burst (626 px), wankhede_panorama_small (540 px). logo_bcci_alt_rough ke kinare khurdure hain, logo_bcci use karo.


## C52 (17 Nov 2026) — Filmora-style layout (Phase F, chunk F1)
Rahul ne kaha: tool Filmora jaisa banao, chunks mein. Plan (Filmora Phase): F1 layout+timeline (DONE), F2 timeline drag-reorder + split (S) + scene ke beech transition chunna (timeline se), F3 right panel = chune hue scene ki Properties (dur/tr/trDur/photo slider), F4 media bin (assets/photos grid, drag-to-timeline), F5 audio lane drag (AT.segs move) + captions lane drag, F6 keyboard shortcuts (S split, Del, J/K/L, +/- zoom) + polish.
Kya bana: js/filmora_shell.js (naya, ~190 line). index.html mein sabse aakhir mein load. js/scene_editor.js mein sirf 1 line: SE.render export.
- Top bar (brand, nav, info, Classic layout button, hara Export button). Left: Filmora jaisa icon rail (Scenes/Photos/Audio/Captions/Export) + panel. Beech: preview (canvas auto-fit, Short 9:16 mein bhi) + timecode MM:SS:FF + play + seek. Right: Look & Effects (purane quick buttons). Neeche: TIMELINE.
- Timeline: ruler, Video track (scene clips type ke rang mein, naam, dur, transition ka tag/stripe), Audio track (waveform EXPORT.audio + AT.segs ke dabbe), Text track (CAP.lines), laal playhead. Ruler/track par click-drag = scrub. Clip click = scene chuna (left Scenes panel khulta hai). Clip ka daayan kinara drag = scene ki dur (min 0.5s, Undo chalta hai). Toolbar: Duplicate, Peeche, Aage, Delete, zoom slider + Fit, Ctrl+scroll zoom.
- Purane IDs/modules same: ui_shell, main, scene_editor, photos, audio, captions, export sab waise hi. Classic layout: ?layout=classic (ya top button); wapas: ?layout=filmora (classic mein nav mein '🧩 Filmora layout' link). Choice localStorage 'cvt_layout' mein.
- Test (headless chromium, 1600x900, 22-scene Shami JSON + synthetic audio + captions): node --check OK; console errors 0; clip click, trim drag, ruler scrub, zoom, Delete (22->21), classic mode (fm class nahi) sab OK. Screenshots dekhe: layout theek.
- Known/baaki: sirf desktop (>=900px) ke liye; timeline clips drag-reorder abhi nahi (F2); Properties panel abhi purane quick buttons hain (F3); clip trim ke baad captions/audio auto-fit nahi hota (⏱ fit dabao); Rahul ke real Chrome par dekhna baaki.


## C53 (17 Nov 2026) — Filmora F2: timeline editing (js/filmora_shell.js)
Kya naya: (1) Clip ko drag karke order badlo (hara insertion line dikhti hai; pehla scene hamesha trDur 0; purana pehla scene beech mein jaye to grunge 0.7 mil jata hai). Simple click = scene chuno. (2) ✂ Split / S key: playhead jis scene par ho use do hisson mein todta hai (dusra 'cut', kinare se min 0.5s). (3) Snapping: clip ka kinara drag karte waqt playhead, doosre clips ke kinare, captions, audio segments par chipakta hai (peeli line, 8px). (4) Har clip (pehle ko chhod) mein ◆ button: click = Transition menu (16 transitions + lambai slider; turant preview). (5) Delete/Backspace = chuna scene hatao (Undo chalta hai). Toolbar mein msg line (kya hua dikhata hai).
Test (headless, 22-scene JSON): reorder (hook:10 -> teesri jagah, first trDur 0), click select, split (14 -> 7+7, dusra cut), edge split refuse + msg, transition menu glitch (trDur 0.5), menu bahar click par band, snap trim (end == playhead 24.53), Delete 23->22, Undo 22->23. Console errors 0.
Baaki: F3 right panel = chune scene ki Properties (dur/tr/trDur/photo slot/text fields); F4 media bin; F5 audio+captions lane drag; F6 baaki shortcuts/polish. Split card ko dobara animate karta hai (dono hisse apni shuruaat se chalte hain) — Properties mein baad mein 'start offset' soch sakte hain. Real Chrome par check baaki.


## C54 (17 Nov 2026) — Filmora F3: Properties panel (js/filmora_shell.js)
Right panel ke upar 'PROPERTIES — N. type' (chune hue scene ka). Timing: Duration, Audio chunk #, Transition + Transition sec (pehle scene mein nahi). Content: scene.data ke fields apne aap form ban jate hain — text (chhota=input, lamba/head/sub/note=textarea), number, checkbox, string-list (ek line = ek item, jaise photos/names), 'photo'/'bg' par photo-slot suggestions (PHOTO_SLOTS + custom_). Complex (object) fields skip + note: Scenes panel ke JSON box mein edit karo.
Kaise kaam karta: har badlav 350ms baad SE.apply(true) se lagta hai (preview + timeline + Undo/Redo sab chalte hain). Panel tab rebuild hota jab scene chuna/badla ya Undo/left-panel se badlav aaye; type karte waqt focus nahi jata.
Test (headless): clip click -> panel title badla; Duration 9 -> scene+clip 9s; head textarea badla -> data update; transition select flash (trDur 0.5); Undo -> panel select wapas whip; stat scene par photo input (datalist) dikha. Console errors 0.
Baaki: F4 media bin (assets/photos grid, click/drag se scene jodna), F5 audio+captions lane drag, F6 shortcuts+polish. Photo upload button Properties mein nahi (Photos tab/Scenes panel mein hai). Real Chrome par check baaki.


## C55 (17 Nov 2026) — Filmora F4: Media bin (js/filmora_shell.js)
Left rail mein sabse upar naya '🗂 Media' tab (baaki tabs/views neeche jaise ke taise; Media overlay hai, dusra tab dabane par band).
- Assets: MANIFEST ke saare ~200 assets thumbnail grid mein (lazy), category chips (Backgrounds, Overlays, Icons, City/Stadium, Logos, Channel brand…), search. Click = chuno; double-click ya '🖼 Chune hue scene ka background' = scene.data.bg set (agar us card type mein bg badalta hai; warna message + badlav wapas — check C.CARDS[type].assets). '➕ Naya hook scene is background ke saath'.
- Photos: PHOTO_SLOTS (97) + custom_ slots + scenes mein use hue ids (jaise custom_shami, jo abhi upload nahi hue 'photo chahiye' badge ke saath), chips city-wise + '✓ Uploaded', search. Click chuno -> '📷 Chune hue scene mein lagao' (stat/retain/short_stat = data.photo; watch/rumour/presenter = data.photos mein pehli khaali jagah ya push). '⬆ Is slot ke liye photo upload' (PHOTOS.set + SE.apply).
- Drag & drop: tile ko timeline ke Video track par chhodo: clip par = us scene ka bg/photo; khaali jagah (assets) = naya hook scene aakhir mein.
Test (headless, 22-scene JSON): 200 tiles, Backgrounds chip 30, bg set hook, drag-drop clip 4 par, naya scene 22->23, Photos mode 99 tiles, search shami=1, stat scene par kohli photo lagi, Media band hone par Scenes view theek. Console errors 0. Bug mila+theek: grid tiles collapse (grid-auto-rows:max-content).
Baaki: F5 audio+captions lane drag (segments/caption start ko timeline par kheencho), F6 shortcuts (J/K/L, +/- zoom, Home/End) + polish. Photo thumbnails tabhi dikhte jab photos upload hon. Real Chrome par check baaki.


## C56 (17 Nov 2026) — Filmora F5: audio + caption lanes drag (js/filmora_shell.js)
- Audio lane: har voice-over segment (AT.segs) ab dabba hai — drag karke time badlo (start/end dono playhead, scene kinaron, captions, doosre segments par snap, peeli line). Chhodne par AT.nudge se mix dobara banta (waveform + export audio update, Audio panel bhi refresh). Click = segment chuna (safed kinara), Delete/Backspace = chuna segment hatao (AT.del); segment na chuna ho to Delete scene hatata hai. Khaali audio jagah click = scrub.
- Text lane: caption block drag karke uska start time (CAP.lines[i].t0) badlo — pichle/agle caption ke beech clamp (min 0.1s), snap; CAP.nudge se save hota. Pichle caption ka end apne aap badal jata (ends() logic).
- snapPts(skipScene, skipSeg, skipCap) ab teeno ke liye.
Test (headless): 3 synthetic segments + 5 captions: seg2 60s -> 74 (snap), mixed audio update, seg3 select+Delete (3->2, scenes 22 ke 22), caption 3 t0 62 -> 68.74, msg dikha, console errors 0.
Baaki: F6 shortcuts (J/K/L, +/- zoom, Home/End, Ctrl+D duplicate, ←/→ frame step, I/O?) + polish (timeline resize handle, clip right-click menu). Segment trim/split abhi nahi (sirf move/delete). Captions panel ki list drag ke baad refresh nahi hoti (data sahi hai; panel dobara kholo). Real Chrome par check baaki.


## C57 (17 Nov 2026) — Filmora F6: shortcuts + polish (js/filmora_shell.js)
- Keyboard: K = play/pause, J / L = 5s peeche / aage, , / . = 1 frame, Home / End = shuru / aakhir, ↑ / ↓ = pichle / agle scene par (pick), + / − = timeline zoom, 0 = Fit, Ctrl+D = scene duplicate (browser bookmark roka), [ / ] = chuna scene ek jagah peeche / aage. Pehle ke S (split), Del, Space, ←/→ (1s) jaise ke taise. Input/textarea/select mein shortcuts band.
- Timeline resize handle: timeline ke upar ki patli patti kheench kar height badlo (170px se 65% screen tak), double-click = default (284px). Height localStorage (cvt_tlh) mein yaad rehti. Preview canvas apne aap refit hota.
- Clip right-click menu: Split (playhead par), Duplicate, Peeche/Aage, Transition badlo…, Delete. Esc se menu band.
- Right panel ka Shortcuts help naya (kbd box).
- FM API: FM.dup, FM.zoom, FM.moveSel jude.
Test (headless chromium, docs/example_scenes_8.json, 8 scenes): End 34.97s, Home 0, . . = 2 frame, , = 1 frame, L +5s, J -5s (0 par clamp), Down/Up scene 0->1->2->1, + zoom 39->49, K play->pause, Ctrl+D 8->9, [ ] move, right-click menu 6 items, ctx Duplicate 9->10, ctx Delete 10->9, resize 284->374px, kbd help dikha. node --check sab js OK. Console errors: sirf assets ke 404 (test mein assets/ nikaale the) — code error 0.
Baaki (Filmora phase ke baad ke chhote idea): audio segment trim/split, captions panel list drag ke baad refresh, J/K/L ko asli shuttle speed banana, Real Chrome (Rahul ke PC) par check. Filmora Phase F1-F6 poora.


## C58 (17 Nov 2026) — Audio Editor: Audacity jaisa + News-anchor voice (js/audio_editor.js)
Khulta: Audio panel ka '🎛 Audio Editor' button, timeline toolbar ka button, ya timeline par audio segment par double-click. Upar dropdown se segment badlo. Apply = tool mein lagta (AT.segs[i].buf + mix rebuild), Cancel/Esc = kuch nahi badalta.
- Waveform: drag = select, click = cursor, zoom slider, Space play (select ho to wahi hissa), ▶ Original sune = A/B.
- Edit: Cut/Delete, Copy, Paste (cursor par), Trim, Silence, Sab select, Split @cursor (AT mein 2 segment). Undo/Redo (10 step), ⟲ Original.
- Level: Fade in/out (sec), Amplify (dB), Normalize -1dB (select ya poora).
- Noise reduce: spectral gating (FFT 2048). Noise profile = select kiya shor wala hissa, ya auto (sabse shaant 0.4s). Reduction dB.
- Auto silence remove: threshold dB + min pause + kitni pause rakhni; threshold noise floor ke hisaab se khud upar adjust hota. 6ms crossfade.
- 🎙 Anchor voice: HPF 80Hz, low-shelf +2.5dB@150, mud -1.5dB@280, presence +3dB@3.5k, de-ess -3dB@7k, air +1.5dB@10k, compressor (3.5:1), loudness target (default -17 dBFS RMS ~ -16 LUFS), soft limiter. Strength slider (wet/dry).
- ⭐ Best = Noise reduce -> Silence remove -> Anchor chain ek click. '⭐ Sab segments par Best' sab segments par.
Test (headless, synthetic 8s noisy voice): open, anchor, NR, silence 8.0->3.85s, best, select+cut, split (2 segs), fade, normalize, Space play, Apply (mix update, editor band), Best-all; console errors 0. Asli awaaz par kaan se check baaki (Rahul ka kaam): NR dB aur Anchor strength apne mic ke hisaab se set karo.
Dhyan: silence remove / cut se audio chhota hota -> scenes ka ⏱ fit (audio chunk) dobara chalao. Segments audio-time par hi rehte (baaki segments ko shift nahi karta).
Baaki: spectrum/EQ sliders, reverb-free, real shuttle J/K/L, Real Chrome check.


## C59 (17 Nov 2026) — Audio Editor: EQ sliders + ripple (js/audio_editor.js)
- 🎚 EQ: 4 slider (Bass 150Hz shelf, Mid 1kHz, Presence 3.5kHz, Air 10kHz shelf, ±12 dB) + Apply EQ (select ya poora) + Reset. Output par soft limiter.
- Ripple (checkbox, default ON): Apply par segment chhota/lamba hua to uske baad ke saare segments utna khisak jaate (cut/silence remove ke baad gap nahi). 'Sab segments par Best' mein bhi.
Test (headless): EQ Bass+6/Presence+4 laga, ripple segments chale, errors 0. Pehle wala C58 flow jaisa ka taisa.
Baaki: asli awaaz par kaan se check (Rahul), real shuttle J/K/L, Real Chrome check, ripple ke baad scenes ka ⏱ fit.


## C60 (17 Nov 2026) — Audio Editor: Apply ke baad auto ⏱ fit (js/audio_editor.js)
- Naya checkbox 'Apply ke baad scenes ko audio se ⏱ fit karo' (FIT.run + SE.apply). Default ON tabhi jab kisi scene mein chunk number set ho, warna OFF (scenes ki dur bina chunk ke na badle).
- 'Sab segments par Best' ke baad bhi chalta. Fit na ho paaye to msg mein wajah.
Test (headless, 8 scenes chunk=1, 2 audio segs): Apply par video 35s -> 8s (audio ke hisaab se), errors 0.
Baaki: asli awaaz par kaan se check (Rahul), real shuttle J/K/L, Real Chrome export check.


## C61 (17 Nov 2026) — Asli J/K/L shuttle (js/filmora_shell.js)
- L = aage play 1x, baar-baar dabao = 2x, 4x, 8x. J = peeche 1x, 2x, 4x, 8x (preview seek se; player reverse nahi chalata). K = roko (ruka ho to 1x play). Space/play button shuttle band karke normal play-pause karte. Kinare par khud ruk jaata. Msg timeline toolbar mein dikhta.
- C57 ka 'J/L = +-5s' hata diya; 1s ke liye ←/→ pehle jaise.
Test (headless): L 1x chala, L 2x = 2.0s/s, 4x = 4.0s/s, K ruka, J -1x = -1.0, J -2x = -2.03, Space se normal play, errors 0. Shuttle mein audio nahi bajta (sirf 1x par), 2x+ aur peeche sirf video dekhne ke liye.
Baaki: asli awaaz par kaan se check (Rahul), Real Chrome export check.


## C62 (17 Nov 2026) — Background music + voice ducking (js/music_bed.js)
- Button '🎵 Music' (Audio panel bar2 + timeline toolbar). Popup: + Music file, Music volume (-40..0dB, default -18), Voice par duck (-30..0dB, default -12; 0 = duck band), Fade out (sec), loop, Start offset. Music hatao button.
- Kaam: AT.rebuild ke baad mix = voice (AT.voiceOnly) + music. Voice bolte waqt music duck: 20ms envelope, lead 0.12s (bolne se pehle dabta), attack ~80ms, release ~0.5s, bolne ke beech <0.35s ruk mein music nahi uthta. Mix ki lambai = voice ki lambai (captions/⏱ fit ka timing nahi badalta); voice na ho to video ki lambai. Preview aur MP4 export dono mein jaata (EXPORT.audio). Music 0.3s fade-in.
- API: AT.music, AT.setMusic(name,buf), AT.clearMusic(), MUSIC.open/mix/envelope.
Test (headless): 8s voice (2 bursts) + 3s music loop: chup mein music rms 0.044 (=-18dB), bolte waqt mix rms 0.2124 ~ voice 0.2121 (music dab gaya), duck=0 par 0.2168, aakhri fade ~0, clear par lambai 8s, panel khula, errors 0.
Dhyan: music Rahul khud laaye (copyright: royalty-free / YouTube Audio Library). Music project mein save nahi hota (JSON mein nahi) — har baar dobara lagao. Voice editing (Audio Editor) ke baad mix khud update hota.
Baaki: asli music+awaaz par kaan se check (Rahul), music JSON/backup mein save, Real Chrome export check.


## C63 (17 Nov 2026) — Music browser mein save (js/music_bed.js)
- Music file + settings (volume, duck, fade, loop, offset) IndexedDB 'cvt_music' mein save hote (original file bytes). Page reload / tool dobara kholne par khud wapas lag jaata (MUSIC.restore). 'Music hatao' par IndexedDB se bhi hat jaata.
- Photos/scenes ki tarah ye browser mein hai, GitHub repo ya JSON mein nahi: dusre PC/browser par music dobara lagana padega.
Test (headless): wav upload -> volume -10 -> reload: music + vol -10 wapas; hatao -> reload: koi music nahi; errors 0.
Baaki: music ka Backup/Restore (photos backup jaisa) agar chahiye, asli music+awaaz par kaan se check (Rahul), Real Chrome export check.



## C64 (17 Nov 2026) — 🎬 Naya Style: caption styles + ek-click recipe (mass-production se bachne ke liye har video alag dikhe)
js/captions.js: 5 caption styles (Box purana, Outline bina box, Poori patti, Box + rang ki line, Pop uchhal) + 6 accent rang (gold/cyan/orange/green/pink/white). 💬 Captions panel mein Style + Rang dropdown. Choice localStorage 'cvt_capstyle'. Default = purana Box (kuch nahi badla jab tak choose na karo).
js/looks.js: naya button '🎬 Naya Style (ek click)' = random Look + caption style + rang + 🎲 Auto-vary ek saath; pichli baar wala look/style/rang nahi aata (localStorage 'cvt_recipe_hist'). Message mein batata hai kya laga. Pasand na aaye to ↶ Undo / dobara dabao.
Test (headless chromium, example_scenes_8.json): 5 baar button, har baar alag look/style/rang, frames dekhe (box+line, patti, pop, box), console errors 0, node --check OK.
Dhyan: caption (wide mein y=900) kuch cards ki neeche wali text line par chadh jaati hai (ye purana hai, C64 se nahi aaya). Agar Rahul ko dikhe to caption ki jagah ya card text upar karna agla chhota chunk.
NOT tested: real Chrome export mein naye caption styles; asli video par Rahul ko kaun sa style pasand aata hai.
Note: YouTube 'repetitious/mass-produced content' ka asli bachav alag script, apni awaaz aur apni analysis hai; ye tool sirf look ki variety deta hai.
Next: Rahul jo bole (caption overlap fix, intro/outro variety, accent colour cards mein, real Chrome check).


## C65 (17 Nov 2026) — Shabd-par-shabd caption highlight
js/captions.js: 💬 Captions panel mein checkbox 'Shabd-par-shabd highlight' (CAP.wh, localStorage 'cvt_capwh', default OFF). ON hone par line ka jo shabd 'chal raha' hai wo accent rang mein, baaki shabd safed. Shabd ka time = line ke time mein shabd ki lambai (+2) ke hisaab se baanta (line ke 92% tak, taaki aakhri shabd bhi chamke). Sab 5 styles mein chalta (box/line/bar/pop/outline). Whisper jaisi asli word-timing nahi hai; andaza hai, isliye kabhi 1 shabd aage-peeche ho sakta.
Test: headless chromium, 4 styles x alag time pe frames — active shabd badalta dikha, console errors 0.
NOT tested: real Chrome export; lambi line (3 lines, short mode 9:16) mein highlight.
Next: punch-in zoom (keyword/number par 1.15x) ya Brand Kit ya Storyboard review — Rahul se poochho.


## C66 (17 Nov 2026) — Punch-in zoom
Naya js/punch.js (index.html mein captions.js se pehle). PUNCH.set(off|soft|medium|strong) = 0 / 4% / 8% / 15% zoom, localStorage 'cvt_punch', default off. Beats = caption lines + scene shuruaat (.8s se paas wale ek). Har beat par 0.28s mein zoom-in, agle beat par wapas (alternate). Captions zoom nahi hote (C.render wrap CAP se pehle).
js/looks.js: '🔍 Zoom' dropdown (Look ke baad) + 🎬 Naya Style ab zoom bhi chunta (off/halka/medium, pichla repeat nahi).
Test: headless chromium — strong par scale 1.15 <-> 1 alternate hota dikha, off par 1, caption zoom nahi hua, console errors 0.
NOT tested: real Chrome export (C.render hi use hota hai to chalna chahiye), 9:16 short mein dikhne ka tareeka, zoom ke saath transitions.
Next: Brand Kit ya Storyboard review ya caption overlap fix — Rahul se poochho.


## C67 (17 Nov 2026) — Brand Kit (3 slot)
js/looks.js: '🗂 Kit A/B/C' dropdown + '💾 Kit save' + '📂 Kit lagao'. Ek kit mein: Look preset, caption style + rang + shabd-highlight, zoom level. localStorage 'cvt_kit_A/B/C'. Bg/transition (Auto-vary) kit mein nahi — wo har video mein 🎲 se alag aate (mass-production se bachne ke liye jaanbujhkar).
Test: headless chromium — look+pop+cyan+highlight+zoom medium save, sab badla, page reload, Kit A lagaya -> sab wapas; khaali Kit B ne sahi message diya; console errors 0.
NOT tested: real device pe; kit ko JSON file mein export/import (abhi sirf isi browser mein).
Next: Storyboard review ya caption overlap fix — Rahul se poochho.


## C68 (17 Nov 2026) — Caption ki jagah (overlap se bachne ke liye)
js/captions.js: 💬 Captions panel mein 'Jagah' dropdown — normal / thoda neeche (+58px wide, +90 short) / thoda upar (-95 wide, -110 short). localStorage 'cvt_cappos', default normal. Brand Kit (C67) mein jagah bhi save hoti.
Test: 8 example scenes par normal vs low screenshot. Nateeja MIXED: 'neeche' hook ("सबसे बड़ी चर्चा में") aur poll ("कमेंट में ज़रूर बताइए") wali text se takrao hataata, lekin kuch scenes ki neeche wali strip ("संभावित: ऑफिशियल सिस्त नहीं") ko dheere dhakta. Koi ek jagah sab scenes ke liye fit nahi — Rahul har video mein dekh ke chune.
Asli fix agla (agar chahiye): har card type ke liye safe caption y (card ki neeche ki text ke hisaab se) ya card text upar khiskana.
NOT tested: 9:16 short mein jagah, real Chrome export.


## C69 (17 Nov 2026) — Caption AUTO jagah
js/captions.js: 'Jagah' dropdown mein naya option 'AUTO (scene dekhkar)'. Har scene ke liye ek baar (scene ke ~55% waqt par frame render karke) 4 jagah (wide: y 800/870/930/990; short: 1100/1240/1380/1500) ki 'bheed' pixel gradient se naapi jaati, sabse khaali chuni jaati (normal ke paas wali ko halka fayda). Nateeja scene-index se cache; scenes badalne par reset. Default ab bhi 'normal'.
Test: 8 example scenes — hook, stat(1), poll, channel-card par takrao kam hua; 'afwah' (scene 5) aur watch(4) card par caption ab bhi text ke upar/paas aati (pehle bhi aati thi). Yaani AUTO madad karta par poora fix nahi. Console errors 0.
Limit: scene ke beech mein animation se layout badle to ek hi jagah rehti; sirf gradient naapta (text vs texture ka fark nahi jaanta).
NOT tested: 9:16 short, real Chrome export (export mein bhi C.render chalta, har scene par ek extra render lagta).
Agla (agar chahiye): card-type-wise haath se tay ki hui safe jagah (afwah/watch cards), ya in cards ka neeche ka text upar khiskana.


## C70 (17 Nov 2026) — AUTO jagah behtar (zyada candidates)
js/captions.js: AUTO ab wide mein 6 jagah (y 780..980, 40px gap), short mein 8 jagah (1060..1480) mein se chunta; normal (900/1240) se door jaane par chhota penalty (door ka matlab = caption bahut idhar-udhar na bhage). Pehle sirf 4 jagah thi.
Test: 8 example scenes — hook ('सबसे बड़ी चर्चा में'), afwah (caption ab headline bar ke upar photos par), poll, channel — saaf. watch card (scene 4) mein caption ab bhi neeche ke chhote text ke paas; kyunki wo text halka/patla hai aur gradient naap use kam 'busy' maanta. Console errors 0.
Limit: sirf gradient naapta; patla/halka text miss ho sakta. Asli pakka fix = card type ke hisaab se haath se safe jagah (watch card).
NOT tested: 9:16 short, real Chrome export.


## C71 (17 Nov 2026) — 🗂 Storyboard review
Naya js/storyboard.js (index.html mein looks.js ke baad). Quick bar mein '🗂 Storyboard' button -> poori screen ka overlay: har scene ki thumbnail (scene ke ~55% waqt ka frame, captions samet), 'N · type · dur', ✅ Theek / ❌ Hatao / 📝 Note. Thumbnail par tap = player wahan seek, overlay band. Upar: '❌ N scene hatao' (confirm ke baad SE.scenes se splice, SE.apply(false); saare scenes nahi hat sakte), '📋 Notes copy' (marks+notes ka text clipboard mein, nahi chale to prompt), '✕ Band karo'. State localStorage 'cvt_sb_wide' / 'cvt_sb_short' (scene index ke hisaab se).
Test (headless chromium, example_scenes_8.json): 8 cards khule, 2 ❌ mark, 1 note, hatao -> 6 scenes, ↶ Undo -> wapas 8, console errors 0, screenshot dekha.
Limit: marks scene INDEX se bandhe hain — scenes ke beech mein naya scene jodne par marks khisak sakte (hatao ya notes copy se pehle review dobara kholo). 'Hatao' ke baad sirf wahi scenes hatte, baaki ka transition/timing apne aap theek hota (SE.apply).
NOT tested: 9:16 short ke thumbnails, 40+ scenes par speed, real phone (prompt() ka note box).


## C72 (17 Nov 2026) — Brand Kit file export/import
js/looks.js: '⬇ Kit file' (saare save kiye kit A/B/C ek brand_kit.json mein download) aur '⬆ Kit file kholo' (file chun ke A/B/C localStorage mein, purane badal jaate). Import mein har field check hoti (look/style/rang/zoom/jagah galat ho to default); galat file par 'ye Brand Kit file nahi hai'. Kit lagane ke liye phir 📂 Kit lagao.
Test (headless chromium): khaali par sahi message; Kit B save -> download hui, JSON sahi; B hata ke import -> wapas; lagane par line/pink/highlight/low/strong sab aaye; bad.json par error message; console errors 0.
NOT tested: asli phone/dusre device ke beech transfer; file picker real phone par.


## PHASE R (17 Nov 2026) — Explainer-style cards (reference: docs/REFERENCE_EXPLAINER_STYLE.md)
R-chunks: R1 clip layer, R2 chapter card, R3 kinetic text, R4 bar chart/count-up, R5 quote card, R6 post/screenshot card, R7 icon scene, R8 transitions+sponsor. Abhi sirf plan likha (C73), code nahi. Agla: R1 ya jo Rahul chune.
- [x] R1  - [x] R2  - [x] R3  - [x] R4  - [x] R5  - [x] R6  - [x] R7  - [x] R8 (sponsor card optional, nahi bana)

## PHASE B (17 Nov 2026) — Video 2 'Dark data investigation' style (docs/REFERENCE_EXPLAINER_STYLE.md, VIDEO 2 section)
B0 Dark Look, B1 bar compare, B2 calendar, B3 document highlight, B4 dot-map/square grid, B5 count-up, B6 ranked+CLOSED stamp, B7 terminal, B8 cell grid, B9 lower-third+quote, B10 split compare, B11 subscribe pill. Sirf plan (C74). Rahul aur videos dega, phir chunk order tay hoga.

## C75 (17 Nov 2026) — DEEP PASS plan
Dono reference videos dobara har 8 sec par dekhi + scene-cut. Naye chunks: R9-R19, B12-B23, G1-G4 (docs/REFERENCE_EXPLAINER_STYLE.md 'DEEP PASS'). Code nahi. Final order Rahul sab videos dene ke baad tay karega.


## C76 (17 Nov 2026) — Video 3 style plan (sirf plan, code nahi)
Rahul ne 159067.mp4 (21 min, premium minimal tutorial style) diya. Har 8 sec par 157 frame + scene-cut dekhe (~101 cut, average ~12 sec). Naya: docs/REFERENCE_EXPLAINER_STYLE.md mein 'VIDEO 3' section: V1-V16 scene types, Phase V chunks (V1-V14), helpers G5 (serif-italic accent shabd), G6 (annotation arrows), G7 (split layout presenter+card). Video 4 (159071.mp4, 5 min, 854x480) abhi baaki — agle chat/agle step mein.
- [x] G5 (C128)  - [x] G6 (C128)  - [x] G7 (C131 `split`) — VIDEO 3 PHASE POORI  - [ ] V-chunks: V3 `bullets` + V4 `phoneann` DONE (C128); V5 `phonewall` + V6 `numgrid` + V7 `compare2` DONE (C129); V8-V14 DONE (C130: `plans` `timelist` `ctapill` `adcard` `uimock` `checklist` `chips`) — V QUEUE POORI; sirf G7 baaki (purana text: plan cards, time-breakdown, CTA pill, product ad, UI-mock, checklist, label chips) + G7


## C77 (17 Nov 2026) — Video 4 style plan (sirf plan, code nahi)
159071.mp4 (5 min, 854x480, Hinglish mobile-tutorial neon icon-card) dekhi: har 4 sec par 77 frame + ~24 cut. docs/REFERENCE_EXPLAINER_STYLE.md 'VIDEO 4': N1-N15 scene types, helpers G8 (spotlight zoom), G9 (pop-in sequencer), G10 (neon glow text). Chaaron videos (R, B, V, N) ka plan ab poora. Agla: Rahul final chunk order tay kare (common G-chunks pehle: G2, G4, G5, G9, R1).
- [x] G8 (C132)  - [x] G9 (C132)  - [~] G10 (C132: sirf card text helper; caption style mein abhi nahi)  - [x] N1-N8 (C132)  - [x] N9-N12 (C133)  - [x] N13-N15 (C134)


## C78 (17 Nov 2026) — Video 5 style plan (sirf plan, code nahi)
159073.mp4 (22 min, 640x360, purple-glow faceless-channel tutorial) dekhi: har 12 sec par 111 frame + ~150 cut. docs/REFERENCE_EXPLAINER_STYLE.md 'VIDEO 5': P1-P20 scene types, helpers G11 (Purple Glow Look), G12 (typewriter), G13 (connector line), G14 (blur toggle), G15 (falling particles). Paanchon videos (R, B, V, N, P) ka plan poora. Agla: Rahul final chunk order tay kare (suggested: G2, G4, G5, G9, G11, R1 pehle), phir sirf ek chhota chunk.
- [ ] G11  - [ ] G12  - [ ] G13  - [ ] G14  - [ ] G15  - [ ] P-chunks (P1-P20)


## C79 (18 Nov 2026) — Rahul ke 20 green-screen graphics assets mein (code nahi)
Hara bg + magenta screen alpha se hataye (unmix, kinaare saaf), Gemini sparkle watermark hataya, khaali margin kaata, webp max 1920. 06_icons (7), 08_gemini_generated/objects (2), naya 15_ui_mockups (11). Media bin mein 15_ui_mockups apne aap dikhta hai. manifest 220 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Laptop/TV/phone ki screen TRANSPARENT: peeche clip/photo rakhne par screen mein dikhega.
Notes: icon_mic_crossed_price_tag aur boom arm wali mic ki arm original image mein frame se kati hai. ui_list_rows_dark ke upar ka blur glow strip hata diya. Ye abhi sirf assets; kaun si scene/card mein lagana hai (G-chunks / P-scenes) Rahul batayega.


## C80 (18 Nov 2026) — Rahul ke 20 green-screen graphics (2nd batch) assets mein (code nahi)
19 naye assets (icon tiles 16 + card backs 3). Duplicate skip: magic wand 2 baar aaya (pixel-identical) -> ek hi rakha. Hara bg alpha se hataya (kinaare unmix), tile ke andar asli rang rakhe (hare neon tile hare hi dikhte hain), Gemini sparkle hataya, margin kaata, webp. manifest 239 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla; scene/card mein kahan lagana hai Rahul batayega.
Note: tiles ke andar halka hara tint original glass look ka hissa hai; card backs par beech khaali hai (text/photo upar rakhna).


## C81 (18 Nov 2026) — Rahul ke 18 assets (3rd batch) mein (code nahi)
8 green-screen (hara hataya, transparent): bat tile + 7 silhouettes (naya 16_silhouettes) aur 10 backgrounds (3 portrait Short 9:16, 7 wide). Gemini sparkle sab se hataya (paper par texture-clone, baaki inpaint). Backgrounds max 1920 webp, portrait 1080x1936. manifest 257 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: sil_crowd_cheering_yellow bahut patli patti (1920x451) hai, stretch karke lagana. Silhouettes ek rang ki hain (peeli/neeli); rang badalna ho to tool mein tint chahiye (abhi nahi). bg_stadium_topview_night_pitch real-photo jaisa dikhta hai, upload se pehle source/license ek baar dekh lo.


## C82 (18 Nov 2026) — Rahul ke 20 green-screen graphics (4th batch) assets mein (code nahi)
19 add (hara hataya, transparent webp, sparkle hataya): 08_gemini_generated/objects = calendar_blank_perspective, stopwatch_silver, padlock_gold, pie_chart_3d_blue, handshake_blue_icon, ticket_blank_vintage, stadium_seats_row_yellow_blur; 03_stamps/stamp_closed_red_grunge; 15_ui_mockups = 8 pill buttons (blue/yellow glossy glow, red glossy motion, green dark glass, red/green glass tilted, yellow/blue 3d), toggle off grey, toggle on blue, btn_round_yellow_gold_rim. SKIP: glass layers stack (translucent, dhabbe aa rahe the). Note: ticket aur peela glossy pill ke neeche bahut halke dhabbe reh sakte hain; red motion pill mein upar ka blur echo original ka hissa hai. Manifest 276 keys, MASTER_INDEX + index_data.js update.


## C83 (18 Nov 2026) — Rahul ke 13 assets (5th batch) mein (code nahi)
11 add: 06_icons = cross_red_coin_3d, check_green_glass_coin_3d, arrow_white_curved_hand, arrow_white_straight, subscribe_3d_bell, question_marks_3d_blue_glow; 15_ui_mockups/btn_rect_red_3d_tilted; 02_overlays = paper_torn_yellow_strip, chevrons_yellow_triple; 08_gemini_generated/fx = fx_light_leak_orange_black, fx_lens_flare_white_black (kala bg, sparkle hataya, 1920 wide, Screen/Add blend se). SKIP (keying kharab): split yellow panels, blue ink splat. Manifest 287 keys.


## C84 (18 Nov 2026) — Rahul ke 16 assets (6th batch) mein (code nahi)
14 add (hara hataya, transparent, sparkle inpaint): NAYA 17_halftone_portraits (4), NAYA 18_maps (india dots cyan, india states blue, cricket field diagram), NAYA 19_presenter (point_left, point_right, mic_plaid, hands_open_explain, fingers_v_connect, arms_crossed_grey), 15_ui_mockups/ui_polaroid_trio_blank. SKIP: world dots map (dhundhla haze), presenter phone (upar noise). Manifest 301 keys.


## C85 (18 Nov 2026) — Rahul ke 20 assets (7th batch, C84 ka dobara) mein (code nahi)
20 images mein se 14 pehle se C84 mein the (duplicate, skip). 6 naye add (hara hataya, transparent webp, sparkle hataya): 18_maps/map_world_dots_cyan (C84 mein dhundhla tha, ab saaf), 19_presenter/presenter_phone_plaid (phone wala pose, ab upar noise nahi dikha) + presenter_hands_open_explain_2, NAYA 20_cartoon_presenter (cartoon_wave, cartoon_point_left, cartoon_chin_think; kaali t-shirt wala cartoon host). Manifest 307 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: cartoon_point_left aur cartoon_chin_think mein sparkle haath par tha, inpaint kiya; haath ke kinare par bahut chhota dhabba reh sakta hai. Cartoon host ka bottom image se kata hai (kamar tak), neeche screen ke kinare par rakhna.


## C86 (18 Nov 2026) — Rahul ke 20 assets (8th batch) mein (code nahi)
Sab 20 add (koi skip nahi): 3 cartoon host poses (phone, khaali board, thumbs up) -> 20_cartoon_presenter; 4 fx overlays (dust, neela bokeh, dhuan, reshe-jaal; kala bg, Screen/Add blend) -> 08_gemini_generated/fx; 2 bg (neela radial glow wide + portrait 9:16) -> 01_backgrounds; 15_ui_mockups: 4 avatar circles (neela/peela/narangi/teal), settings panel, video player (jamuni screen), profile card, btn_pill_blue_lock; 06_icons: emoji bored + smile, stars 4/5. Hara bg alpha se hataya (kinaare unmix), Gemini sparkle hataya (cartoon par inpaint, baaki corner saaf), webp max 1920. Manifest 327 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: avatars/emoji ke aas-paas halka safed glow alpha mein hai (original ka hissa). Shadow wale panels (settings/profile/video) ke neeche halki parchhai transparent kaali hai. fx_smoke/fibre ke corner mein sparkle ki jagah thoda patch ho sakta hai (screen blend mein dikhega nahi).

## C87 (18 Nov 2026) — Rahul ke 20 assets (9th batch) mein (code nahi)
Sab 20 add (koi skip nahi): 5 stamps (INJURY UPDATE, NEW CAPTAIN, SQUAD OUT, SOLD gold, UNSOLD) -> 03_stamps; 5 number coins 1-5, shield+tick, gauge meter, idea-bulb glass tile -> 06_icons; 2 red neon grid bg (wide + portrait 9:16) -> 01_backgrounds; blank blue V-neck jersey -> objects; points table, notification card, document+pen -> 15_ui_mockups; India map + 12 pins -> 18_maps. Hara bg alpha se hataya (stamps ke andar ke hare hisse bhi), sparkle hataya, webp max 1920. Manifest 347 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: shield aur coins ke aas-paas halka glow alpha mein hai (original ka hissa; shield ka glow teal-neela). Points table / notification card glass ke neeche halki kaali parchhai hai. Red bg ke bottom-right corner mein sparkle ki jagah halka patch ho sakta hai. Coin 1-5 alag files hain (6+ chahiye to Gemini se aur banwao).

## C88 (18 Nov 2026) — Rahul ke 15 assets (10th batch) mein (code nahi)
Sab 15 add (koi skip nahi): 6 icons (burst 6/4/W, coin 100 laurel, highlight circle, wave scribble), 5 objects (auction paddle, akhbaar, siren, podium 1-2-3, megaphone), 2 fx (sparkle stars, red glitch scanlines; kala bg, Screen/Add blend), 2 bg (khaali stadium portrait 9:16, gold silk frame). Hara bg alpha se hataya (circle/scribble ke andar ke hare hisse bhi), sparkle hataya, webp max 1920. Manifest 362 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: siren ke chaaron taraf ka glow halka olive/hara dikh sakta hai (original glow hare par tha). Glitch fx ke corner mein sparkle ki jagah halka patch ho sakta hai (Screen blend mein dikhega nahi). bg_portrait_stadium_night_empty_blue real-photo jaisa hai, upload se pehle source/license ek baar dekh lo.

## C89 (18 Nov 2026) — Rahul ke 13 assets (11th batch) mein (code nahi)
Sab 13 add (koi skip nahi): 5 icons (coin NR/L/W, sun glass tile, chat bubbles), 2 objects (khaali tarazu, khaali sunehra coin tirchha), 5 ui (VS compare panel, 3-circle panel, TV pitch ball path, list 1-11, list 5 row), 1 map (pitch length zones). Hara bg alpha se hataya, glass panels ke andar ka rang rakha, sparkle hataya, webp max 1920. Manifest 375 keys (sab files maujood), MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: ui_list_rank_1to11_glass_dark mein ank 7 ki jagah nahi hai (1-6, 8-11, original Gemini image mein hi aise tha) — text ke upar apna ank lagana ho to numbers chhupane padenge ya naya Gemini image banwao. Sun tile aur W coin ke aas-paas halka glow/olive kinara original ka hissa hai. Compare panel mein 6 row hain (bars neela vs narangi).

## C90 (18 Nov 2026) — Rahul ki 10 asli green-screen photos (12th batch) assets mein (code nahi)
Sab 10 add (koi skip nahi, koi duplicate nahi): 19_presenter mein presenter_standing_dark_grey, standing_light_grey, thumbs_both_cream, thumb_left_cream, hands_talk_plaid, wave_plaid, thumbs_up_plaid, point_both_plaid, thumbs_up_blue_stripe, thumbs_up_white_shirt. Hara bg chroma-key se hataya (edges despill), transparent webp, max 2250 lambai. Manifest 385 keys, MASTER_INDEX + index_data.js + README update. Code nahi badla.
Notes: standing_* aur cream/blue/white photos neeche se kati hain (kamar/jeans tak), screen ke neeche kinare par rakho. hands_talk_plaid neeche seedhi kati hai. Haath par nishaan asli photo ka hissa hai. Short 9:16 ke liye presenter wide card nahi chalta, in photos ko bg/photo slot mein lagao.

## C91 (18 Nov 2026) — Panel resize: left width, right width, timeline height (js/filmora_shell.js)
Rahul ne kaha: sab panel ki width/height drag karke apne hisaab se kar sake. Pehle sirf timeline height handle tha. Ab 3 handle: left panel ke kinare (#rs-l), right panel ke kinare (#rs-r), timeline ke upar (#tl-rs). Pointer events = mouse + touch dono. Handle 12px mota, hover par hara. Min/max limit (left 200-60%, right 180-50%, timeline 120-70%). Size localStorage mein yaad (cvt_lw, cvt_rw, cvt_tlh). Double-click handle = reset. Preview apne aap fit hota hai. Test: node --check OK, headless chromium drag (410->560, 262->382, 284->384), reload par wahi size, dblclick reset, console errors 0.

## C92 (18 Nov 2026) — PLAN: Video 6 (159304.mp4, navy-blue glass-card tutorial) docs mein joda (pehle C79 naam se adhura tha) — sirf plan, code nahi
Plan file docs mein kabhi merge nahi hui thi. Ab: docs/REFERENCE_EXPLAINER_STYLE.md 'VIDEO 6' (Y1-Y48 scene types, G16-G22 helpers, rhythm rules, cricket mapping), docs/GEMINI_PROMPTS_PHASE_RVN.md section Y (Y-A1..Y-C9), original file docs/VIDEO6_PLAN_C79.md. Gemini assets check: 9 mein se 7 pehle se library mein; sirf Y-C3 (sign-in card) + Y-C4 (before/after thumbnail pair) baaki.
Phase Y queue (ek chat = ek chunk): 
- [x] G16 Header-line + peela shabd (C93 DONE)
- [x] G17 Navy Glow Look preset (C94 DONE)
- [x] G20 Pill row component (C95 DONE)
- [x] G21 Curve-draw chart helper (C96 DONE)
- [x] G18 3D-tilt list/stack card (C97 DONE)
- [x] Y3 Chapter list (3D, progress tick) (C103, 📚 Chapter flow button)
- [x] Y10 Chapter title banner (C98 DONE)
- [ ] Y5 / Y6 Growth curve + two-curve compare
- [x] Y14 Dot-crowd grid (C99 DONE)
- [x] Y19 / Y20 Two big words + 3 question cards (C100 DONE)
- [x] G19 Highlight-box + cursor -> Y23 screen-record (C101, `spot` card)
- [x] G22 / G1 Carry-over sequencer (C102, `carry` chip — pehla version)
- [ ] baaki Y chunks (Y1, Y2, Y4, Y8, Y11-Y13, Y15, Y16, Y18, Y22, Y26-Y48) baad mein (Y21 = C104 `compare`; Y9 + Y24 = C105 `tiles` + `levels`; Y7 + Y25 = C106 `chip` + `options`; Y17 = C107 `stat2`; Y16 + Y18 = C108 `bars` + `dash`; Y15 + Y12 = C109 `trio` + `rating`; Y8 + Y13 = C110 `portrait` + `phone`; Y11 + Y2 + Y4 = C111 `market` + `comments` + `timeline`; Y22 + Y30 = C112 `hub` + `search`; Y31 + Y32 = C113 `formula` + `beforeafter`; Y26 + Y27 + Y28 = C114 `setting` + `radio` + `ideas`; Y29 + Y33 = C115 `reel` + `phones`; Y34 + Y35 + Y36 = C116 `gcurve` + `steps` + `expect`; Y37 + Y38 + Y39 = C117 `equals` + `payoff` + `tickgrid`; Y40-Y48 = C118 `variety` + `vsvlog` + `energy` + `bestlast` + `locked` + `longstat` + `offer` + `products` + `endscreen` ho gaye — Y1 = C119 `burst`; Y queue POORI)
Suggested common order (Rahul tay karega): G2, G4, G5, G9, G11, G16, G17, R1 pehle.

## C93 (18 Nov 2026) — G16: Header line (upar) + *peela shabd*  (js/header_line.js, captions.js, core.js, scenes_check.js, filmora_shell.js, scene_editor.js, index.html)
Naya: scene mein top-level `"header":"Aaj ki *badi* khabar"` (chunk jaisa field). Upar glass pill mein chhoti line, `*shabd*` peela (#F5C518), baaki safed; 2 line tak (70 akshar ke andar). Fade-swap: scene shuru par 0.1-0.5s fade-in (thoda upar se utarta), aakhir mein fade-out; agle scene ki header bilkul same ho to bina fade chalti rehti hai (ek beat = ek header, kai scenes). Wide: y~70 (2 line ho to canvas se na chipke), Short 9:16: y~250 (YouTube UI safe zone ke neeche).
Captions mein bhi `*shabd*` = peela (box/bar/line style mein safed text par peela; outline/pop style mein accent text par safed shabd). Caption panel/timeline mein `*` chhupa kar dikhta hai.
Controls: right panel mein `🔤 Header line: ON/OFF` (yaad rehta hai, cvt_hdr); Properties (Filmora) mein `🔤 Header line (upar)` text box; classic editor mein bhi. Validator: header string hona chahiye, >70 akshar warn, * jodi mein warn. Helper `CORE.starWords(str)` -> [{w,hl}].
Test: node --check sab OK; headless chromium: wide 1-line + 2-line, same-header 2 scenes, ON/OFF, Short 9:16, captions yellow keyword, console errors 0.
Notes: header card ke upar ka hissa dhakta hai (hook/stat ke upar wale text/ribbon se takra sakta hai) — jahan jagah na ho wahan scene par header mat do ya OFF karo. Export mein header apne aap aata hai (C.render). Script chat ko `header` field SCENES_JSON_SCHEMA.md se pata chalega.

## C94 (18 Nov 2026) — G17: 🌊 Navy Glow Look preset (js/looks.js, js/fx_pro.js)
Naya 6th Look `navy` (🌊 Navy Glow): gehra navy + beech mein halka neela radial glow + kinaare dark vignette (purple nahi, blue). Polish halka (vignette .55, grain .03, leak/smoke/dust 0, shake .3). Colour look `navy` (fx_pro.js: neela soft-light tint + screen glow + multiply vignette) FX dropdown mein '🌊 Navy glow' naam se bhi alag se lag sakta hai. Bg pool (Auto-vary ke liye): bg_blue_radial_glow_dark, bg_blue_gradient_glow, bg_dark_gradient_blue_glow_bottom, bg_black_blue_gradient, bg_navy_plain, bg_blue_light_streaks_particles, bg_contour_bokeh_blue_wide. Transitions kam aur soft: fade, push, slideup, blurfade, zoom (video 6 mein hard cut bahut kam). 🎬 Naya Style aur 🎲 Auto-vary mein navy apne aap shamil (LOOKS se). Brand Kit save/load mein bhi chalta hai.
Header line (G16) ke saath mel: glass pill navy par achha dikhta hai. Glass card/pill ka alag component G20 (pill row) mein aayega.
Test: node --check OK, headless chromium: LOOKSET.apply('navy') -> FX.look=navy, vary (5 bg + 7 transition), 4 frames dekhe (navy bg, header pill, cards), console errors 0.
Notes: Auto-vary abhi sirf wide bg pool use karta hai; Short 9:16 ke liye portrait navy bg (bg_portrait_blue_radial_glow_dark, bg_portrait_blue_light_beams_dark) alag se manually lagao. Title/retain/intro cards apna team-colour/paper bg rakhte hain (Look nahi badalta). Zaroorat ho to Look ka glow kam/zyada karna fx_pro.js 'navy' block mein (.16 = glow, .30 = tint).

## C95 (18 Nov 2026) — G20: Pill row component (js/pill_row.js, scenes_check.js, filmora_shell.js, scene_editor.js, index.html)
Naya: scene mein top-level `"pills":[{"t":"Sahi baat","c":"g"},{"t":"Afwah","c":"r"}]` (ya sirf text = grey). 1-3 glass pill ek line mein (rang ka dot + safed text), ek-ek karke pop-in (0.18s gap), aakhir mein fade-out. Rang: g hara, r laal, y peela, x grey. `pillsPos`: top (default, header ke neeche; wide y190, short y410) / mid / low (caption ke upar). Zyada lambe pill apne aap chhote ho jaate hain (1700px / Short 980px ke andar).
Controls: right panel mein `💊 Pills: ON/OFF` (yaad rehta hai, cvt_pills); Properties (Filmora) mein `💊 Pill row` text box (`Sahi|g ; Galat|r ; Shayad|y`) + `Pill jagah` dropdown; classic editor mein bhi. Validator: list hona chahiye, >3 warn, text khali err, >24 akshar warn, rang galat warn, pillsPos galat warn.
Test: node --check sab OK; headless chromium: wide 3 pills + header, Short 9:16, text-only pill, parse/str round-trip, console errors 0.
Notes: Short 9:16 mein header (y250) kuch cards ke upar wale text se takrata hai (C93 wali baat), pills uske neeche aate hain. Pills card ke upar overlay hain, isliye hook/stat jaise bhare cards par `low` mat lagao (text se takra jaata hai); `top` ya `mid` use karo. Agla: G21 curve-draw chart, G18 3D-tilt list.

## C96 (18 Nov 2026) — G21: Curve-draw chart card `curve` (js/card_curve.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `curve`: 1-2 curve ek-ek karke banti hain (smooth Catmull-Rom, area gradient, glow, pulse wala end-dot), glass panel, x-axis labels, curve ke end par label, `mark` bubble (peak/dip) jab curve wahan pahunche. Data: `title, xl[], y1 ("5,12,40,90" ya list), l1, c1 (g/r/y), mark1 ("3:Peak"), y2, l2, c2, mark2, note, ymin, ymax, bg`. Dono curve ek hi y-scale par. Helper `CORE.curveSpec(data)`.
Editor: Scenes panel type list mein `curve` (default sample ke saath); Properties mein sab field text box ban jaate hain (y1/y2 string rakhe taaki edit ho sake). Validator: y1 mein 2+ number (err), >12 point warn, xl list, c1/c2 g/r/y, mark `3:Peak` format.
Test: node --check sab OK; headless chromium: 2 curve (green growth vs red spike) frame 1.6s aur 5.5s dekhe, label/bubble takrao theek kiye, console errors 0.
Notes: Sirf wide (Short 9:16 ke liye curve card abhi nahi). Background default bg_blue_radial_glow_dark hai par Look/FX ke kaaran test mein kaala-sa dikha; `bg` field se badal sakte ho. Rumour ka graph ho to label/note mein 'Rumour' likho. Agla: G18 3D-tilt list.

## C97 (18 Nov 2026) — G18: 3D-perspective list card `stack` (js/card_stack.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `stack` (Video 6 ka Y2/Y3 chapter list): rows upar chhoti, neeche badi (perspective jaisa), ek-ek karke slide-pop, halka sway. Ek row highlight (peela glow border + zoom), uspar `pill` label; baad mein `done` rows par blue tick pop (stagger), `mark` rows par peela circle. Data: `title, items[2-9], hl (1 se), pill, done "1,2,3", mark "6,7", bg`.
Editor: type list mein `stack` (sample ke saath), Properties mein items textarea (ek line = ek row). Validator: items 2+ (err), >9 / >40 akshar warn, hl range warn.
Test: node --check OK; headless chromium 9 rows, highlight+pill+ticks+circles dekha, console errors 0.
Notes: asli 3D nahi, 2D scale se perspective ka bhram (kaafi). Sirf wide. Video mein 3 baar aane wale chapter list ke liye same items rakho aur `hl/done` badlo (3 scenes). Agla: Y10 chapter title banner ya Y3 jaisa flow.

## C98 (18 Nov 2026) — Y10: Chapter title banner card `chapter` (js/card_chapter.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `chapter`: beech mein peeli patti (glow) left se kheenchti hai, andar number box (`02`) + chapter naam (kaala bold), upar glass lock-pill (chhoti line, peela lock icon canvas se bana). Aakhir mein fade-out. Data: `title (zaruri), num, pill, lock (false = icon nahi), bg`. `num` ya `pill` khali ho to wo hissa nahi dikhta.
Editor: type list mein `chapter` (sample ke saath), Properties mein sab fields. Validator: title chahiye (err), num >3 akshar warn.
Test: node --check OK; headless chromium: num+title+pill frame dekha, bina num/pill/lock wala Hindi title bhi render, console errors 0.
Notes: Sirf wide. Chapter list (stack) -> chapter banner -> content ka flow Y3/Y10 jaisa banta hai. Agla: Y5/Y6 growth curve presets, Y14 dot-crowd grid.

## C99 (18 Nov 2026) — Y14: Dot-crowd grid card `crowd` (js/card_crowd.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `crowd`: `total` (10-200, default 100) chhote avatar (sir+kandhe) dots ki grid wave mein pop-in (20 columns; <=60 ho to 10), phir `hi` dots (default 10, scatter = poori grid mein bikhre, `scatter:false` = shuru ke) peele glow mein ek-ek karke pop, phir neeche glass card (`label` bada + `sub`). Card grid ke neeche aata hai taaki dots na dhake. `c` rang y/g/r, `title`, `bg`. Helper `CORE.crowdPick(total,hi,scatter)`.
Editor: type list mein `crowd` (sample ke saath). Validator: total range warn, hi > total err, c warn.
Test: node --check OK; headless chromium 100 dots + 10 highlight + card frame dekha (pehle card dots par aa raha tha, neeche kiya), console errors 0.
Notes: Sirf wide. Y5/Y6 growth curve ke liye alag preset nahi banaya: C96 ka `curve` card hi (1-2 curve, mark, x-labels) wahi kaam karta hai. Agla: Y19/Y20 two big words + 3 question cards, ya G19 highlight-box + cursor.

## C100 (18 Nov 2026) — Y19 + Y20: `bigwords` aur `qcards` cards (js/card_words.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Do chhote wide card ek file mein.
`bigwords` (Y19): do bade shabd (`a`, `b`, rang `ca`/`cb` y/g/r/b/w, glow, pop) beech mein `join` (default `+`, 'vs' bhi), neeche 0-3 numbered glass pills (`pills`), optional `title`. Shabd lambe hon to font apne aap chhota.
`qcards` (Y20): 2-3 numbered glass sawal cards (`qs`, 60 akshar tak, 4 line tak wrap) ek-ek karke aate hain, `hl` (1 se) wale card par peela glow border + halka zoom. `title` optional.
Editor: type list mein dono (samples ke saath). Validator: a/b dono chahiye (err), qs 2+ (err), >3 / lambe warn, rang/hl range warn.
Test: node --check OK; headless chromium: 'CTR + Watch time' + 2 pills, 3 sawal cards + hl=2, console errors 0.
Notes: Sirf wide. Y5/Y6 ke liye curve card (C96) kaafi hai. Agla: G19 highlight-box + cursor -> Y23 screen-record, ya G22/G1 carry-over sequencer.

## C101 (18 Nov 2026) — G19 -> Y23: Highlight-box + cursor card `spot` (js/card_spot.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `spot`: screenshot/screen-record par ek hissa highlight. Screenshot panel pop-in -> baaki hissa dim -> peela rectangle (glow) perimeter ke saath draw -> halka zoom box ki taraf -> cursor neeche se aakar box ke andar click (ripple). Neeche peela `label` + glass `pill`. Data: `title, shot (photo slot naam jaise custom_signin, ya asset path; khali = browser window mock), box "x,y,w,h" (0-1, shot ke hisse mein), cursor (true), click (true), zoom (1-2.2, default 1.35), label, pill, bg`. Helper `CORE.spotBox(str)`.
Editor: type list mein `spot` (sample ke saath), Properties mein sab fields (shot par photo-slot datalist). Validator: box galat/bahar = err, zoom range warn, lambe title/label/pill warn.
Test: node --check sab js OK; headless chromium (http.server + playwright): 4 frame + 2nd scene (zoom 1.8, cursor off) dekhe; zoom mein title ke upar chadhta tha -> clip lagaya; spotBox valid/invalid check; console errors 0.
Notes: Sirf wide. Sensitive cheez (email/naam) screenshot mein pehle blur karke upload karo (tool mein blur nahi). Box screenshot ke kinare ho to zoom par panel ka kinara dikhta hai (theek). Asli screen-record (video) nahi, sirf screenshot (R1 video layer baaki). Agla: G22/G1 carry-over sequencer, Y3 chapter list flow, ya real Chrome / Short phone check — pehle Rahul se poochho.

## C102 (18 Nov 2026) — G22/G1: Carry-over chip `carry` (js/carry.js, index.html, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Scene mein top-level `"carry":{"id":"k1","t":"CTR","c":"y","pos":"0.5,0.5","s":1}`. Agle scene mein SAME `id` (nayi `pos` / `s` / `t` / `c`) likho to chip cut ke bina glide + resize hota hai (0.05-0.75s, ease in-out; text aadhe raste par badalta hai). Pehle scene mein pop-in; agle scene mein id na ho to aakhir mein fade-out. Transition (fade/whip) ke dauran bhi chip ek hi baar draw hota hai. `pos` = canvas ke fraction (center), `s` 0.5-3, `c` y/g/r/b/w. Wide aur Short dono mein chalta hai (fraction hain).
Controls: right panel `🔗 Carry chip: ON/OFF` (yaad rehta hai, cvt_carry); Properties (Filmora) mein `🔗 Carry chip` text box: `id|text|x,y|rang|size`. Classic editor mein field nahi (JSON se likho). Helper `CARRY.parse/str/pos`.
Validator: carry object + id + t zaruri (err), pos galat = err, c / s range warn, t >24 akshar warn, agle scene mein bilkul same carry = warn (glide nahi dikhega).
Test: node --check sab OK; headless chromium: bigwords -> qcards (fade transition) mein chip (0.2,0.82 y) -> (0.8,0.15 g, s1.4) beech raaste ka frame dekha, bina carry wala scene, parse/str round-trip, galat pos validator err, console errors 0.
Notes: Ye PEHLA, chhota version hai: sirf ek CHIP carry hota hai (card ke asli element morph nahi: jaise stack ki row -> chapter banner). Rang seedha naye scene ka ho jaata hai (glide mein blend nahi). Card ke element morph ke liye alag chunks (G1 poora) baad mein. Agla: Y3 chapter list flow, real Chrome / Short phone check — pehle Rahul se poochho.

## C103 (18 Nov 2026) — Y3: Chapter flow button (js/chapter_flow.js, index.html)
Right panel mein `📚 Chapter flow` (wide mode). Chapter ke naam `;` se alag (2-9) do -> har chapter ke liye 2 scene: `stack` (poori list, is chapter par highlight `hl`, pichhle chapters par tick `done`) + `chapter` banner (num 01, 02..). Fade transition, stack 4s, banner 3s; scenes list ke aakhir mein jud jaate hain (khaali list ho to pehle scene par transition nahi). Naya card code nahi, C97 `stack` + C98 `chapter` ka flow. Pure function `CF.build(names,{listTitle,pill,stackDur,chapterDur,tr})`.
Test: node --check OK; headless chromium mein asli button click (prompt: 'Hook ; Retention ; Thumbnail'): 6 scenes (stack,chapter x3), hl/done = 1:'' 2:'1' 3:'1,2', num 01/02/03, validator errors 0, total 18.5s, console errors 0.
Notes: Sirf wide. Baad mein chapter ka content scene in do ke beech khud daalna hai (ya Scenes panel se). Short mode mein nahi. Agla: real Chrome / Short phone check, ya R1 video clip layer — pehle Rahul se poochho.

## C104 (18 Nov 2026) — Y21: Compare card `compare` (js/card_compare.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `compare`: do glass column (header `la` / `lb` rang-patti ke saath), har row par hara tick ya laal cross, rows ek-ek karke slide-pop (left column pehle, phir right). Data: `title, la, lb, a[1-6], b[1-6], ma (tick|cross, default tick), mb (default cross), ca, cb (y/g/r/b, default g / r), bg`. Dono tick (`mb:'tick'`) ya do rang bhi chalte hain (Facecam vs Faceless). Rows kam hon to panel chhota; 6 tak. Helper `CORE.compareRows(d)`.
Editor: type list mein `compare` (sample: पक्की खबर vs अफवाह), Properties mein a/b/la/lb sab fields (list = ek line ek row). Validator: a/b dono chahiye (err), 6 se zyada warn, line >40 akshar warn, ma/mb galat warn.
Test: node --check sab OK; headless chromium: 3 vs 4 rows frame dekha (Hindi text, tick/cross glow theek), 1 vs 2 row + dono tick + blue/yellow, validator (b khali = err, sahi = 0 err), console errors 0.
Notes: Sirf wide. Rumour label wale video mein 'पक्की खबर vs अफवाह' jaisa comparison naye facts ke bina sirf checklist ki tarah use karo (niyam 7). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y chunks (Y7 brand chip, Y9 3 tile row, Y24 level list...) — pehle Rahul se poochho.

## C105 (18 Nov 2026) — Y9 + Y24: `tiles` aur `levels` cards (js/card_tiles.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Do chhote wide card ek file mein (Rahul ne "next 2" kaha).
`tiles` (Y9): 2-6 glass tile (4 se zyada ho to 2 line), ek-ek pop. `items` ki har line `label|pill|icon` (pill, icon optional; icon = asset path jaise 06_icons/icon_bat; khali = number circle). Pill ka rang `c` (y/g/r/b, default g), neeche `banner` peela pill, `title` optional.
`levels` (Y24): 2-6 pill-rows (number circle + naam) left se slide; `done` "1,2" = hara tick pop, `lock` "3" = grey taala + dim text, `hl` = peela glow border, neeche `pill` ("To unlock: ..."). `title` optional.
Editor: type list mein dono (samples ke saath), Properties mein items textarea (ek line = ek row/tile). Helpers `CORE.tileItems`, `CORE.levelSet`. Validator: items 2+ (err), 6 se zyada / label >34 akshar warn, levels `hl` range warn, tiles `c` warn.
Test: node --check sab OK; headless chromium: tiles (2 asset icon + 1 number circle + 3 green pill + banner), levels (tick/lock/hl + pill) frame dekhe, 5-tile list validator 0 err, items 1 = err, console errors 0.
Notes: Sirf wide. Tile pill mein ₹/number sirf asli confirmed ho to (niyam 7). Icon sirf assets/ se (photo slot icon nahi). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y chunks (Y7 brand chip, Y25 3 option cards...) — pehle Rahul se poochho.

## C106 (18 Nov 2026) — Y7 + Y25: `chip` aur `options` cards (js/card_options.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Do chhote wide card ek file mein (Rahul ne "koi bhi" kaha, to dono pending chhote chune).
`chip` (Y7): beech mein bada rounded chip: icon (ya pehla akshar circle) + `name` bada + `by` chhoti rangeen line; pop-in, halka float. Lamba naam apne aap chhota hota hai. Data: `name` (zaruri, 28 tak), `by`, `icon` (asset path), `c` y/g/r/b, `title`, `bg`. Generic chip, kisi company ka logo nahi.
`options` (Y25): 2-4 glass option cards (icon/number + `title` + chhoti `line`), ek-ek pop; `items` ki har line `title|line|icon`; `hl` (1 se) peela border; neeche 0-2 pill `text|rang` (y/g/r/b/x grey), do pill ek line mein beech mein. Helpers `CORE.optItems`, `CORE.optPills`.
Editor: type list mein dono (samples ke saath), Properties mein items/pills textarea (ek line = ek item). Validator: chip name (err), options items 2+ (err), 4 se zyada / pills 2 se zyada / hl range warn.
Test: node --check sab OK; headless chromium: options (icon + 2 number circle + hl + 2 pill) aur chip (icon wala + lamba naam wala) frame dekhe, galat data par validator err, console errors 0.
Notes: Sirf wide. Icon sirf assets/ path (photo slot nahi). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y chunks (Y8 presenter-in-card, Y11-Y13, Y15-Y18...) — pehle Rahul se poochho.

## C107 (18 Nov 2026) — Y17: `stat2` card, do bade number card (js/card_stat2.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya wide card type `stat2`: do bade glass card (rangeen glow border), andar bada number count-up (0 se, comma apne aap, decimal jitna likha utna) + label; beech mein optional `mid` chinh (->), neeche peela pill. Data: `n1, l1, n2, l2, p1/p2 (prefix jaise ₹), s1/s2 (suffix jaise %), c1, c2 (y/g/r/b, default g / y), mid, pill, title, bg`. Lamba number apne aap chhota. Helper `CORE.fmtNum(v,dec)`.
Editor: type list mein `stat2` (sample ke saath), Properties mein sab fields. Validator: n1/n2 number nahi = err, label khali warn, c1/c2 warn.
Test: node --check sab OK; headless chromium: 1,000 -> 4,000 (title + mid + pill) frame dekha, 7.5% aur ₹1,234,567 wala card, fmtNum('1,234,567' / '7.5' / '0'), galat n1 validator err, console errors 0.
Notes: Sirf wide. Number sirf asli/confirmed ho (niyam 7: naye facts nahi). Indian comma (12,34,567) nahi, western grouping hai. Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y chunks (Y8, Y11-Y13, Y15, Y16, Y18...) — pehle Rahul se poochho.

## C108 (18 Nov 2026) — Y16 + Y18: `bars` aur `dash` cards (js/card_bars.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Next 2" kaha, to do chhote wide card ek file mein.
`bars` (Y16): 2-6 glass bar, ek-ek karke badhte hain (count-up value + unit), neeche peela pill mein equation `5 + 4 + 2 = 11 मिनट` (apne aap, lamba ho to chhota). Data: `items` (`naam|number|icon`), `unit`, `c` y/g/r/b, `total` (false = equation band), `title`, `bg`. Helper `CORE.barItems`.
`dash` (Y18): 2-4 metric tile (label, bada value, ▲ hara / ▼ laal delta; `-` se shuru = laal) + neeche line chart jo left se draw hota hai (end-dot glow) + optional `note` pill. Data: `tiles` (`label|value|+5%`), `pts` (2-12 number strings), `note`, `c`, `title`, `bg`. Helpers `CORE.dashTiles`, `CORE.dashPts`.
Editor: dono type list mein (samples), Properties mein items/tiles/pts ek-line-ek-item textarea (generic). Validator: bars items 2+ (err) / galat number (err) / 6 se zyada warn; dash tiles 2+ (err) / pts <2 warn / c warn.
Test: node --check sab OK; headless chromium: bars (5 bar + equation 13 min, aur icon wala bar), dash (4 tile + chart + note) frame dekhe; galat data par validator err/warn; console errors 0.
Notes: Sirf wide. Number sirf asli/confirmed (niyam 7). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y chunks (Y8, Y11-Y13, Y15...) — pehle Rahul se poochho.

## C109 (18 Nov 2026) — Y15 + Y12: `trio` aur `rating` cards (js/card_trio.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Continue" kaha, to agle do chhote cards ek file mein.
`trio` (Y15): bada `head` card (optional icon) jo upar chhota hokar 2-4 numbered chhote cards (`शीर्षक|छोटी लाइन`) mein khulta hai. Data: `title, head, icon, items, c, bg`. Helper `CORE.trioItems`.
`rating` (Y12): glass card mein 5 star ek-ek bharte hain (half star chalta hai), `head` label, `label` + "3.5 / 5", neeche 0-2 tiles (`label|value`). Fan-sawaal card (fantasy/betting nahi). Data: `title, head, stars, label, tiles, c, bg`. Helper `CORE.rateTiles`.
Editor: dono type list mein (samples), Properties generic. Validator: trio items 2+ (err), rating stars 0-5 (err), tiles list/2 se zyada, c warn.
Test: node --check sab OK; headless chromium: trio (head + 3 cards), rating (3.5 star + 2 tiles) frame dekhe; galat data par validator err; console errors 0.
Notes: Sirf wide. Poora zip 67 MB (30 MB upload limit se bada) tha, isliye chat mein sirf badli hui files ka zip diya. Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y8, Y11, Y13, Y1, Y2, Y4...) — pehle Rahul se poochho.

## C110 (18 Nov 2026) — Y8 + Y13: `portrait` aur `phone` cards (js/card_portrait.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Continue" kaha, to agle do chhote cards ek file mein.
`portrait` (Y8): presenter (transparent asset) glass portrait card mein, ek taraf bada text jisme `*shabd*` peela; `sub` chhoti line; `side` r/l. Default photo 19_presenter/presenter_point_left. Helper `CORE.starWords`.
`phone` (Y13): phone mock jisme `feed` (0-8 line) scroll hoti hai + counter box (`label`, `n` count-up). `n` na do to sirf phone beech mein.
Editor: dono type list mein (samples), Properties generic. Validator: portrait text khali err / * jodi warn / side warn; phone feed list, n number err.
Test: node --check sab OK; headless chromium: portrait (point_left + peela shabd + sub), phone (3 post + 1,200 counter) frame dekhe; galat data par validator; console errors 0.
Notes: Sirf wide. Phone ka notch kabhi kabhi top post ke text par aa jata hai (chhota, baad mein). Poora zip 30 MB se bada hai, isliye sirf badli files ka zip. Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y11, Y1, Y2, Y4...) — pehle Rahul se poochho.

## C111 (18 Nov 2026) — Y11 + Y2 + Y4: `market`, `comments`, `timeline` cards (js/card_market.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Karo next 3" kaha, to teen chhote cards ek file mein.
`market` (Y11): browser-window jaisi dark panel mein 2-12 rangeen tile (`लेबल|y/g/r/b/p`) ek-ek pop, neeche 0-2 pills. Generic tiles (koi brand logo nahi).
`comments` (Y2): 2-4 comment cards (`नाम|कमेंट`) halke tilt mein, `hl` wala seedha + bada + peela border (baaki dim), neeche pill.
`timeline` (Y4): line par 2-6 label (jaise saal), dot `at` tak slide karta hai, `label` pill dot ke upar.
Editor: teeno type list mein (samples), Properties generic. Validator: tiles/items/points kam (err), hl/at range warn, pills/items zyada warn.
Test: node --check sab OK; headless chromium: market (8 tile + 2 pill), comments (hl=2 + pill), timeline (4 saal, dot 2024 tak + label) frame dekhe; galat data par validator; console errors 0.
Notes: Sirf wide. Comments Rahul ke asli/apne ho (niyam 7). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y22, Y26-Y48) — pehle Rahul se poochho.

## C112 (18 Nov 2026) — Y22 + Y30: `hub` aur `search` cards (js/card_hub.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Next 2" kaha, to do chhote cards ek file mein.
`hub` (Y22): beech mein bada `center` node, 2-8 `spokes` gol ghere mein; line draw hoti hai phir node pop; optional `note` pill neeche.
`search` (Y30): rounded search bar (magnifier + peela cursor), `text` typewriter, phir 0-3 `results` rows, optional `pill`.
Editor: dono type list mein (samples), Properties generic. Validator: hub center/spokes (err), spokes>8 warn; search text khali (err), results list/3 se zyada.
Test: node --check sab OK; headless chromium: hub (6 spoke + note), search (typed text + 2 result + pill) frame dekhe; galat data par validator; console errors 0.
Notes: Sirf wide. Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y23, Y26-Y29, Y31-Y48) — pehle Rahul se poochho.

## C113 (18 Nov 2026) — Y31 + Y32: `formula` aur `beforeafter` cards (js/card_formula.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Next kaam" kaha, to agle do chhote cards ek file mein.
`formula` (Y31): `name = a ÷ b` boxes ek-ek aate hain (lamba ho to apne aap chhota), `la`/`lb` ke neeche peela arrow + label pill.
`beforeafter` (Y32): laal X "पहले" | hara tick "बाद में" do panel; text ya asset image (`bi`/`ai`); optional neeche laal progress bar (`bar` 0-100 + `barlabel`).
Editor: dono type list mein (samples), Properties generic. Validator: formula a/b (err); beforeafter before/after text-ya-image (err), bar range warn.
Test: node --check sab OK; headless chromium: formula (CTR = क्लिक ÷ इम्प्रेशन + 2 label), beforeafter (text + bar 60) frame dekhe; galat data par validator; console errors 0.
Notes: Sirf wide. Image panel (bi/ai) frame mein alag se test nahi kiya (sirf text + bar). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y26-Y29, Y33-Y48) — pehle Rahul se poochho.

## C114 (18 Nov 2026) — Y26 + Y27 + Y28: `setting`, `radio`, `ideas` cards (js/card_steps.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "next 3 kaam" kaha, to Y queue ke agle teen chhote cards ek file mein.
`setting` (Y26): upar peela `step` badge + `name` (rounded label), neeche 1-4 `pills` (`text` ya `text|रंग`) ek-ek pop; lambe pills 2 line mein.
`radio` (Y27): 2-5 radio rows ek-ek aati hain, `hl` (number ya list) wali rows peele border + bhara dot, optional neeche `pill`.
`ideas` (Y28): 2-3 idea cards (`शीर्षक|छोटी लाइन|आइकन`), neeche `avatar` chip (`av` optional image) + dotted connector lines.
Editor: teeno type list mein (samples), Properties generic. Validator: setting step/name + pills (err/warn), radio items 2-5 + hl range, ideas items 2-3.
Test: node --check sab js OK; headless chromium: setting (3 pill + 5 pill), radio (hl [1,2] + pill, 5 rows hl 3), ideas (3 cards + avatar, 2 cards bina avatar) frame dekhe; validator good/bad data par theek; console errors 0.
Notes: Sirf wide. `ideas` mein av (avatar image) frame mein alag se test nahi kiya (default silhouette dekha). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y29, Y33-Y48) — pehle Rahul se poochho.

## C115 (18 Nov 2026) — Y29 + Y33: `reel` aur `phones` cards (js/card_reel.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Next 2" kaha, to Y queue ke agle do cards ek file mein.
`reel` (Y29): reel-style phone (play, side icons, progress) + bada number box (`n` count-up + `unit`, ya seedha `big` text, `label`) + optional semi-circle `gauge` (0-100, `glabel`, `gl`).
`phones` (Y33): do phone side-by-side, screen par text `a`/`b` ya image `ia`/`ib`, neeche labels `la`/`lb`, `hl` (1 ya 2) peela glow, neeche `caption` pill.
Editor: dono type list mein (samples). Validator: reel n/big (err), gauge range (warn); phones a/b text-ya-image (err), hl 1/2 (warn).
Test: node --check sab js OK; headless chromium: reel (n+unit+gauge, sirf big text), phones (labels+caption+hl, sirf a/b) frame dekhe, overlap 2 jagah theek kiye; validator good/bad data par theek; console errors 0.
Notes: Sirf wide. ia/ib image aur reel mein number/gauge ke baare mein: cricket mein sirf Rahul ke apne ya confirmed numbers. Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y34-Y48) — pehle Rahul se poochho.

## C116 (18 Nov 2026) — Y34 + Y35 + Y36: `gcurve`, `steps`, `expect` cards (js/card_flow.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Next 3" kaha, to Y queue ke agle teen cards ek file mein.
`gcurve` (Y34): baayein gauge card (`gauge`, `glabel`, `gl`), daayein retention curve card (`pts` 2-10 number, line draw hoti hai + end dot, `cl` label).
`steps` (Y35): 2-4 "STEP N" cards (`items` = `शीर्षक|छोटी लाइन`); `hl` do to sirf wo roshan baaki dim, na do to ek-ek roshan hote hain; optional `caption` pill.
`expect` (Y36): thumbnail card (`thumb` text ya `ti` image) ---- thought bubble (`thought`) ---- avatar (`user`, `av`) + hara tick, optional `pill`.
Editor: teeno type list mein (samples). Validator: gcurve gauge/pts, steps items 2-4 + hl range, expect thumb/ti/thought.
Test: node --check sab js OK; headless chromium: teeno frame dekhe; steps centering + expect overlap 2 jagah theek kiye; validator good/bad data par theek; console errors 0.
Notes: Sirf wide. ti/av images alag se test nahi (default thumb/silhouette dekhe). Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y37-Y48) — pehle Rahul se poochho.

## C117 (18 Nov 2026) — Y37 + Y38 + Y39: `equals`, `payoff`, `tickgrid` cards (js/card_flow2.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "Continue" kaha, to Y queue ke agle teen cards ek file mein.
`equals` (Y37): do row "a = av" / "b = bv" (double-line connector), neeche optional `ex` example mini-card dotted lines ke saath.
`payoff` (Y38): CONTEXT + PAYOFF do card (`a`, `b`), neeche timeline bar (`ta`..`tb`); `q` (1-4) do to baad mein "?" thumbnails + progress line (+ `qt` label).
`tickgrid` (Y39): hare tick ki grid (`total` 6-60, `cols`) ek-ek pop, `quote` pill, optional `pts` retention line card.
Editor: teeno type list mein (samples). Validator: equals a+av / b+bv, payoff a+b + q range, tickgrid total range + pts list.
Test: node --check sab js OK; headless chromium: teeno frame dekhe; equals connector aur payoff overlap/label cut theek kiye; validator good/bad data par theek; console errors 0.
Notes: Sirf wide. Payoff mein phase 2 (q) ~2.6s ke baad shuru hota hai, chhoti scene (<4s) mein q mat do. Agla: real Chrome / Short phone check, R1 video clip layer, ya baaki Y (Y1, Y40-Y48) — pehle Rahul se poochho.


## C118 (18 Nov 2026) — Y40 - Y48: nau cards (js/card_flow3.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "40-48 tak complete karo" kaha, to Y queue ke bache 9 cards ek hi file mein.
`variety` (Y40): video-box (REC dot + 0:00..0:10 timer) + emoji card + laal bar. `vsvlog` (Y41): laal X | peela smile do card. `energy` (Y42): laal dip-curve (hook...payoff) + peeli sine-wave numbered 01.. nodes. `bestlast` (Y43): hara curve gir ke theher-ti + pulse end-dot + label. `locked` (Y44): bhare card + locked "?" row + pill. `longstat` (Y45): do bade count-up number (hara/laal) + pill. `offer` (Y46): audience dots + avatar + offer card (Accept/Decline) + cursor click. `products` (Y47): product tiles + growth curve + "Then launch" pill. `endscreen` (Y48): bada "Watch next" video card + title/channel/views + subscribe.
Editor: nau type list mein (samples). Validator: FIELDS + MAXC + vsvlog both-side, energy n, locked items/total, longstat n1/n2, offer dots/pick, products items, bestlast pts, endscreen vt/vi.
Test: node --check sab js OK; headless chromium: nau cards ke 12 frame dekhe, variety (panel screen se bahar) + endscreen (button/text overlap) theek kiye; validator good data par 0/0, bad data par 5 err + 3 warn; console errors 0.
Notes: Sirf wide. vi/av (image) frame mein alag se test nahi (default silhouette / gradient dekha). Cricket mein longstat/bestlast ke number sirf Rahul ke apne ya confirmed. Y1 ko chhod kar Y queue poori. Agla: real Chrome / Short phone check, R1 video clip layer, Y1 — pehle Rahul se poochho.

## C119 (18 Nov 2026) — Y1: `burst` card (js/card_flow3.js, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
`burst` (Y1): opening — whip-blur bg (`shot` asset ya default) 1s mein saaf, bada peela number `n` count-up (`dec`, `pre`, `unit` ya `big` text) + grow hoti bar, `label`, `pill`.
Test: node --check OK; headless chromium 3 frame (0.25s blur/khaali, 1.0s count-up, 3.5s final) dekhe; validator 0/0; console errors 0. `shot` asli screenshot ke saath alag se test nahi.
Notes: Sirf wide. Number sirf Rahul ka apna/confirmed. Y QUEUE POORI (Y1-Y48). Agla: real Chrome / Short phone check, R1 video clip layer — pehle Rahul se poochho.

## C120 (18 Nov 2026) — R1: Video clip layer (js/card_clip.js, core.js, export_fast.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Naya `clip` card: Rahul ka mp4/webm clip scene mein chalta hai (`clip` naam, `start` sec, `fit` cover|contain) + `src` source tag ("SOURCE: ..." Rahul khud likhe) + `name`/`role` naam-patti + `sub` subtitle + `quote` bada " chinh + `title`.
🎞 Clips button (bar2 + timeline tools): clip upload/list/hatao; clips browser IndexedDB 'cvt_clips' mein save, reload par wapas (repo mein nahi).
Sync: preview mein video play/pause/scrub timeline ke saath (C.playing flag core.js player mein); FAST export mein har frame se pehle exact seek (C.beforeFrame + C.exporting, export_fast.js); real-time export mein video chalta rehta hai. Clip ki apni awaaz mute (sirf video) — clip audio mix baad ka kaam.
Validator: clip naam zaruri (err), clip upload nahi = warning, src khaali = warning (copyright yaad), start/fit range.
Test: node --check OK; headless chromium: webm clip upload, frame 0.2/1.5/3.5s alag frame aaye (timecode 1.2/2.5/4.5 = start 1 + t), missing clip ka message, reload ke baad clip wapas, fast export 5s -> 7.4 MB mp4, validator theek, console errors 0.
NOT tested: asli mp4 (H.264) Rahul ke Chrome par, lambe/bade clip (memory), real-time export mein clip sync, clip ki awaaz. Sirf wide.
Agla: real Chrome / Short phone check, ya R2 (chapter card) — pehle Rahul se poochho.

## C121 (18 Nov 2026) — R2: `diamond` chapter card (js/card_flow3.js, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
`diamond` (R2): glow diamond frame (outline draw + halki bahari frame, halka rotate-in) + andar `icon` (asset) ya number `num`, "CHAPTER" `tag`, bada `title`, optional `pill`. Y10 `chapter` (peeli patti) se alag style.
Test: node --check OK; headless chromium: number wala aur icon (icon_ball) wala frame dekhe (0.4s draw, 1.0s, 3.0s); title do jagah repeat ho raha tha — theek kiya; validator 0/0; console errors 0.
Notes: Sirf wide. Agla R chunk: R3 kinetic big-text (B&W photo + bada shabd-wise text). Ya real Chrome / Short phone check — pehle Rahul se poochho.

## C122-C127 (18 Nov 2026) — R3-R8: paanch naye cards + 3 transitions (js/card_r.js, js/transitions_r.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Ek chat mein Rahul ke kehne par 6 chunk ek saath. PHASE R poora (sirf optional sponsor card baaki).
- C122 R3 `kinetic`: B&W photo (slot ya asset) + neela tint + bade shabd ek-ek karke pop; `*shabd*` peela; `sub` chhoti line.
- C123 R4 `barcount`: 2-4 bar grow + count-up (`items:['35|देखा गया',...]`, `unit`, `max`, `hl`), `note`, `pill`.
- C124 R5 `quote`: face photo panel (B&W) + bada “ + quote (`*shabd*` peela) + `name`/`role` + peeli silhouette bheed; `side` l|r, `crowd`.
- C125 R6 `post`: social post card (avatar, name, handle, `text` with `*highlight*`, `img`, `stats`, `src` tag, `pile` 0-2, `theme` light|dark) + dheere zoom. Text Rahul ka apna/asli ho (niyam 7).
- C126 R7 `iconscene`: 1-4 icon tile (`asset/path|label` ya `emoji|label`) pop + `btn` peela button + cursor click + silhouette bheed.
- C127 R8 transitions `split` (peele panel upar/neeche), `chevron` (peele > chevron sweep), `torn` (phata-kagaz peeli patti) — wide + short dono.
Test: node --check sab js OK; headless chromium: har card ke 3 frame dekhe, photo-slot (C.photos) wala photo, khaali data par crash nahi, transitions 3 frame x 3 x (wide+short), validator galat data par err/warn theek (kinetic adhoora * bug test mein pakda aur theek kiya), console errors 0. Layout mein `C.starWords` ki jagah apna `C.rToks` (starWords header_line.js ne badal diya hai, alag format deta hai).
NOT tested: asli Rahul ki photos ke saath (sirf presenter webp), fast export mein naye cards/transitions alag se (canvas hain, C120 jaisa chalna chahiye), emoji icon colour (headless mein mono dikha; Chrome mein colour aayega). Sirf wide cards (transitions short mein bhi).
Agla: real Chrome / Short phone check, sponsor card (optional), ya Rahul koi aur chunk chune.

## C128 (18 Nov 2026) — G5 + G6 + V3 + V4: serif-italic accent, annotation arrows, `bullets`, `phoneann` (js/card_v.js, card_clip.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne Video 3 style (V1-V14 + G5-G7) chuna; plan ke "Suggested" order se pehle chhota hissa: G5 -> G6 -> V3 -> V4.
G5 `C.vText`: text mein `*shabd*` = BLUE + serif ITALIC (word-sync ke liye `upTo`). Abhi naye V cards (+ arrow labels) mein; purane cards ka `*shabd*` peela hi hai.
G6 `C.vArrows`: patli curved arrow draw hoti hai + dot + label (`arrows:['label|x|y']`, x,y = frame par %).
`bullets` (V3): 2-5 lines ek-ek karke, 01-05 numbering, accent shabd blue serif italic, optional `title`.
`phoneann` (V4): vertical phone-frame; `clip` (🎞 Clips, preview + fast export mein sync, card_clip.js mein phoneann jodha) ya `shot` (photo slot/asset); 0-5 arrows; `title`, `sub`; slow push-in.
Validator: bullets items 2-5 (err), * jodi (warn); phoneann clip/shot (err), clip upload nahi (warn), arrows format/range/5+ (warn).
Test: node --check sab js OK; headless chromium: bullets 3 frame, phoneann 4 frame (arrows draw dekhi), asli webm clip ke saath (timecode badla, arrows theek), shot=presenter webp, khaali data par crash nahi, validator good 0/0 aur bad data par err; console errors 0.
NOT tested: asli H.264 mp4 clip Rahul ke Chrome par, fast export mein phoneann (clip card jaisa chalna chahiye), lambe Devanagari arrow label (2 line tak fit hota hai).
Sirf wide. Agla (Rahul chune): V5 phone-frame wall/fan, V6 numbered card grid, V7 compare 2 windows, ... G7 split layout; ya Video 4/5 queue; ya real Chrome check.

## C129 (18 Nov 2026) — V5 + V6 + V7: `phonewall`, `numgrid`, `compare2` (js/card_v2.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md; helper C.vBase card_v.js se)
Rahul ne "Continue" kaha, to Video 3 queue ke agle teen cards ek file mein.
`phonewall` (V5): 2-10 vertical phone, fan (<=6) ya row; `shots` photo slot/asset (kam ho to khaali numbered tile); `hl` glow + baaki dim + `labels[hl-1]` neeche; slow zoom.
`numgrid` (V6): 2-8 numbered card ("9|label"), ek-ek pop; `hl` glow baaki dim, hl=0 to ek-ek chamakte hain; label mein *accent*.
`compare2` (V7): do browser window (chrome dots + url bar text `ua`/`ub`), screenshot `ia`/`ib` ya khaali placeholder, label `la`/`lb`, beech mein VS, `hl` 1/2 se ek dim.
Validator: phonewall n/mode/hl (warn), numgrid items 2-8 (err) + hl, compare2 dono side (err) + hl.
Test: node --check sab js OK; headless chromium: fan/row/grid/compare frame dekhe; fan upar-neeche overlap + compare windows chipak rahi thi — theek kiya; khaali data par crash nahi; validator good 0/0, bad par err/warn; console errors 0.
NOT tested: asli photos/screenshots ke saath (sirf placeholder tile), phonewall mein clip nahi (sirf photo), numgrid 8 item ka lamba Devanagari label.
Sirf wide. Agla (Rahul chune): V8 plan/price cards, V9 time-breakdown, V10 CTA pill, V11 product ad, V12 UI-mock, V13 checklist, V14 label chips, G7 split layout; ya Video 4/5; ya real Chrome check.

## C130 (18 Nov 2026) — V8-V14: sat cards (js/card_v3.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "V wale" kaha, to Video 3 queue ke bache saare V cards ek file mein. Naam: V8 `plans` (2-3 plan card + hl glow + badge), V9 `timelist` (bar fill + total), V10 `ctapill` (blue pill + serif italic number + "days left"), V11 `adcard` (kata purana daam + bada naya + Buy pill + piche halke `proof` card), V12 `uimock` (browser window + beats + A/B/C option + cursor click), V13 `checklist` (dark window, hare tick ek-ek), V14 `chips` (floating label chips + 2x2 thumbs + neeche pills).
Validator: har card ka err/warn (plans/timelist/uimock/checklist items, adcard price, chips chips-ya-thumbs, ranges).
Test: node --check sab js OK; headless chromium: saath card frame dekhe (contact sheet), chips thumbs ke saath kinare se kat rahe the — theek kiya; khaali data par crash nahi; validator good 0/0, bad data par err; console errors 0.
NOT tested: asli photos/thumbs ke saath, lambe Devanagari text 2 line se zyada, uimock click timing chhoti scene (<4s) mein (pick 2.4-3.1s par), cricket mein price/offer sirf Rahul ke apne.
V QUEUE POORI. G7 split layout (presenter chhota + card) baaki. Agla (Rahul chune): G7, Video 4 (N1-N15), Video 5 (P1-P20), ya real Chrome check.

## C131 (18 Nov 2026) — G7: `split` layout (js/card_split.js, card_clip.js, index.html, scene_editor.js, scenes_check.js, filmora_shell.js, SCENES_JSON_SCHEMA.md)
Rahul ne "G7" kaha. `split`: presenter chhota ek side (photo slot/asset ya clip) + koi bhi wide card (`inner:{type,data}`) doosri side rounded frame mein; `side` l|r, `ratio` 0.45-0.75 (default 0.6). Inner card offscreen canvas par chalta hai aur scale hokar lagta hai; presenter poore scene mein rehta hai (halka breathing + slide-in); end par dono saath fade.
Presenter clip: card_clip.js ke sync mein `split` jodha (preview + fast export frame-exact seek).
Validator: inner type + inner data ka poora check (inner: ... prefix), split/clip/phoneann/presenter inner = err/warn, pres ya clip zaruri, side/ratio range.
Test: node --check sab js OK; headless chromium: bullets+presenter(point_left, l), barcount+webm clip (r, ratio .55), plans+presenter(wave, r) frame dekhe; khaali/nested/khaali-inner data par crash nahi; validator theek; console errors 0.
Limits: inner mein clip-wale card (clip/phoneann) nahi chalte (clip sync), inner ke text chhote dikhte hain (card ~60% size) — bade font wale card/kam text rakho; asli H.264 mp4 presenter clip Rahul ke Chrome par test baaki.
VIDEO 3 PHASE POORI (G5-G7, V1-V14). Agla (Rahul chune): Video 4 (N1-N15 + G8-G10), Video 5 (P1-P20 + G11-G15), real Chrome check, ya sponsor card.

## C132 (18 Nov 2026) — G9 + G10 + G8 + N1-N8 (Rahul ne bola "n8 tak"), nayi file js/card_n.js
Helpers: `C.popAt(t,i,a0,gap,dur)` (G9 bounce pop-in), `C.nText(...)` (G10 neon glow / lal outline text, col b/r/g/y), `C.spotZoom` + `C.spotRect` (G8 zoom + baaki dim + neon box). G10 abhi sirf cards mein; caption style mein nahi jodha.
Naye wide cards (7):
- `icontiles` (N1): 2-4 glass icon tile + neeche rangeen pill, ek-ek karke pop. items 'icon|label|colour(y/g/r/b)', icon = asset path ya emoji. hl = baaki dim.
- `stepcards` (N2): bada glow head ("Step no.2") + 2-4 neon playing-card (fan), card pop. items 'icon|label'. c b/r/g/y.
- `screenclip` (N3 phone / N4 wide, mode 'phone'|'wide'): clip ya shot frame mein; `focus:'x|y|w|h'` (% mein) + `at` sec par zoom + baaki dim + neon box + tap dot (tap:false band) + `label` (glow callout) / `sub`. Clip sync ke liye card_clip.js ke active() mein `screenclip` jodha (preview + fast export frame-exact).
- `toggle` (N5): 2-3 pill, lal cross / hara tick draw hota. items 'label|x' ya 'label|v'. hl.
- `askq` (N6): lal outline heading + comment glass card (avatar, @naam, typewriter text) + audio player bar. audio:false = bar nahi.
- `promo` (N7): logo circle + channel naam + 'subs' white pill (Rahul apna asli number likhe; khali = pill nahi) + 0-3 thumbnail + SUBSCRIBE button (pulse). Koi number khud nahi bharta.
- `outword` (N8): bada lal outline shabd (space = alag shabd, ek-ek karke pop + shake) + optional img side mein (photo-slot/asset). c r/b.
Editor: sab 7 type list mein (samples). Validator: FIELDS + MAXC + checks (items count, hl, focus format, toggle |x/|v, promo subs, outword words/c). Timeline colours jode.
Test: node --check sab js OK; headless chromium: 7 card frames dekhe (contact sheet) — outword text image se chipak rahi thi, promo ka bell asset chhota/patti jaisa tha (emoji 🔔 kiya), icontiles upar the (beech mein kiye) — theek kiya; khaali data par crash nahi; validator good 0/0, bad par err/warn; console errors 0.
Limits: asli mp4 clip (screenclip) Rahul ke Chrome par check baaki (phoneann jaisa hi code). Fantasy/betting wala koi sample nahi. Agla (Rahul chune): N9 diagram arrow, N13 measure label, N10-N12/N14/N15, G10 caption style, Video 5 (P1-P20 + G11-G15), real Chrome check.

## C133 (18 Nov 2026) — N9-N12 (Rahul ne "N12 tak" bola), js/card_n.js mein jode
- `flowdiag` (N9): do icon tile + arrow draw + 'result' text + cyan waveform. data {title,a,b,la,lb,result,wave,c}; a/b khali = mic/magic-wand tile.
- `crossprice` (N10): bada image/icon par lal cross draw + lal price badge + label. data {title,img,price,label,cross}; img khali = mic+price-tag asset. Price Rahul khud likhe.
- `docfolder` (N11): document image + arrow + lal folder. data {title,doc,folder,label}.
- `topicend` (N12): beech ka caption text + 'TOPIC ??' lal outline circle (topic:'' = circle nahi). data {text,topic}.
Editor samples + validator (FIELDS, MAXC, topicend/crossprice warn) + timeline colours jode.
Test: node --check OK; headless chromium 4 card frames dekhe, khaali data par crash nahi, validator theek, console errors 0.
Agla: N13 measure label, N14, N15, G10 caption style, real Chrome check (screenclip mp4).

## C134 (18 Nov 2026) — N13-N15, js/card_n.js mein. VIDEO 4 QUEUE POORI (N1-N15, G8-G10; G10 caption style baaki)
- `measure` (N13): phone frame (photo slot) + lal naap-line + bada lal label + sub. data {title,img,label,sub}; label zaruri.
- `meme` (N14): dark overlay + chhota hilta reaction photo (peela border) + text. data {img,text,side}.
- `wavestrip` (N15): avatar circle ('ME' ya photo) + cyan waveform strip + text. data {name,img,text,c}.
Editor samples + validator + timeline colours. Test: node --check OK; 3 card frames dekhe; khaali data par crash nahi; console errors 0.
Agla: G10 caption style, Video 5 (P1-P20 + G11-G15), real Chrome check (screenclip mp4).

## C135 (18 Nov 2026) — Video 5 (purple glow): G11 base, G12, G13, G14, G15 + P1, P2, P3, P4, P5, P6, P8, P16 — nayi file js/card_p.js
Helpers: `C.pBase` (G11 purple halo bg; abhi looks.js ka 'Look' preset nahi, sirf P cards ka base), `C.pType` (G12 typewriter), `C.pLine` (G13 glow connector + dot), blur patch (G14, statcard side cards, `blur:false` band), `C.pRain` (G15 girte sparks, `rain:false` band), `C.pCard`, `C.pGrad`, `C.pWhite`.
Cards: `ideatitle` (P1), `chipcarousel` (P2), `flowline` (P3, mode chain/fan), `chatmock` (P4, typewriter + chips), `statcard` (P5, count-up + blur side + sparks; paise ke notes nahi, sparks), `thumbwall` (P6), `ladder` (P8), `ring` (P16, orbit). Fields: js/card_p.js ke upar comments + docs/SCENES_JSON_SCHEMA.md.
Editor samples + validator + timeline colours jode. Test: node --check OK; 8 card frames dekhe; statcard side cards main se chipak rahi thi — chhota kiya; khaali data par crash nahi; console errors 0.
Baaki: P7, P9-P15, P17-P20, G11 ko Look preset banana (looks.js), G12 caption style, G10 caption style, real Chrome check. statcard ka number Rahul ka asli/confirmed hi ho (naye facts nahi).

## C136 (18 Nov 2026) — Video 5 baaki cards: P7, P9, P10, P11, P13, P14, P15, P17, P18, P19 — nayi file js/card_p2.js
`vidcard` (P7, clip/shot + title/meta; clip sync card_clip.js mein jodi), `gauge` (P9), `barlist` (P10), `tree` (P11), `cardtiles` (P13 + brace), `fan` (P14), `replies` (P15), `vs2` (P17), `bonus` (P18), `prodnode` (P19). Fields: js/card_p2.js ke upar comments + docs/SCENES_JSON_SCHEMA.md.
Editor samples + validator + timeline colours jode. Test: node --check OK; 10 card frames dekhe; tree ke neeche ke node overlap kar rahe the — theek kiya; khaali data par crash nahi; console errors 0.
VIDEO 5 lagbhag poori. Baaki: P12 world dot-map, P20 (= screenclip se ho jata hai), G11 Look preset (looks.js), caption styles G10/G12, real Chrome check.


## C137 (18 Nov 2026) — P12 world dot-map: `dotmap`, nayi file js/card_p3.js (index.html mein card_p2 ke baad)
`dotmap` (wide): {title, map:'india'|'world', items:['Mumbai'] ya ['naam|x|y'] (x,y = map image ke % mein), hl (1-based, baaki dim), sub}. Map asset (18_maps) violet gradient mein tint hota hai (cache), pins pulse + glow, labels glass pill. India: 10 IPL sheher naam se mil jaate (Mumbai, Chennai, Kolkata, Delhi, Bengaluru, Hyderabad, Ahmedabad/Gujarat, Jaipur/Rajasthan, Lucknow, Mohali/Punjab), pills left/right column mein line se joode. World: hamesha 'naam|x|y', pill pin ke upar. Gemini watermark (world asset ka neeche-right kona) saaf kiya.
Editor sample + validator (FIELDS, MAXC, items/map/hl/jagah warn) + timeline colour + SCENES_JSON_SCHEMA jode.
Test: node --check sab js OK; headless chromium: india (10 sheher), hl, world, khaali, galat naam frames dekhe — pehle left column ke pills overlap kar rahe the, pins x se do column mein baante + pill height auto kiya, theek; validator good/empty/unknown/badmap/badhl sahi; console errors 0.
Limits: India pin jagah % se hath se calibrate ki (sheher ke paas, exact nahi). World par x|y Rahul/Claude haath se de.
Baaki: G11 Look preset (looks.js), caption styles G10/G12, real Chrome check. P20 = screenclip se ho jata hai.

## C138 (18 Nov 2026) — G11 Purple Glow Look preset (7th Look)
js/looks.js mein `purple` ('🟣 Purple Glow': vignette .6, grain .03, bars/prog off, dark bg pool: black_blue_gradient, dark_gradient_blue_glow_bottom, blue_radial_glow_dark, channel_stadium_blur_dark; tr fade/push/slideup/blurfade/zoom) + js/fx_pro.js mein colour look `purple` (violet soft-light tint + neeche se violet halo + kinaare dark; 'Look' dropdown mein '🟣 Purple glow').
Test: node --check sab js OK; headless chromium: LOOKSET.apply('purple') -> FX.look/POLISH sahi, dotmap frame look ke saath render, console errors 0. Note: koi asli purple bg asset nahi, isliye dark-blue bgs par violet tint chadhta hai (P cards apna pBase khud banate hain).
Baaki: caption styles G10/G12 (typewriter/neon), real Chrome check.

## C139 (18 Nov 2026) — Caption styles G10 `neon` + G12 `type` (js/captions.js)
`neon` = safed text + rang ka glow (accent rang, bina box). `type` = dark glass box + akshar ek-ek karke (Devanagari cluster nahi tootta, Intl.Segmenter) + blinking cursor; line ke ~60% time (max 1.8s) mein poora. `type` mein *shabd* aur shabd-highlight nahi chalta. Dono Style dropdown, Brand Kit, 🎬 Naya Style (random pick) mein apne aap aate hain.
Test: node --check OK; headless frames: neon, type (beech mein + poora) theek, errors 0.
REAL CHROME CHECK (Rahul ke PC par, mujhse nahi ho sakta): 1) index.html -> scenes load -> ⚡ fast MP4 export: speed + awaaz (AAC) chalti hai? 2) 🎞 Clips (screenclip/vidcard/clip) asli mp4 sync + export 3) 📱 Short 9:16 caption/Shorts UI overlap 4) naye cards (dotmap, P-cards) export mein frame dikhte hain? 5) 🟣 Purple Look + neon/type caption export. Jo gadbad dikhe uska screenshot/console error naye chat mein do.
Baaki: sirf real Chrome check (Rahul).

## C140 (18 Nov 2026) — dotmap world map par sheher naam se (js/card_p3.js)
World map par ~45 cricket sheher naam se milte hain (London, Manchester, Dubai, Karachi, Lahore, Colombo, Dhaka, Singapore, Sydney, Melbourne, Perth, Auckland, Johannesburg, Cape Town, Durban, Harare, Kingston, Bridgetown, Port of Spain, New York + Indian sheher...); list = `WC` in js/card_p3.js (C.WCITY). lon/lat se map % (X = (lon+180)/3.6-2.5, Y piecewise, asset par haath se calibrate). Baaki sheher ke liye 'naam|x|y'. World mode mein pills chhote (300x80) aur ek dusre/pins par nahi aate (auto jagah). Validator world sheher pehchanta hai.
Test: node --check OK; 16 sheher ke 2 frames dekhe (pins sahi mulkon par); pills pehle overlap karte the -> auto placement; unknown naam par validator warn; errors 0. Limit: line kabhi kisi dusre pill ke upar se guzar sakti hai.
Baaki: Rahul ka real Chrome check; postponed: match prediction cards, photo license tracking; sponsor card (optional).

## C141 (18 Nov 2026) — News tracker: 10 cricket sites jodi
feeds.json mein 10 nayi feeds ("Site: Cricbuzz/ESPNcricinfo/TheSportsTak/News18/Times of India/India Today/Hindustan Times/CricTracker/NDTV Sports/Sportskeeda"), Google News site: query (path ke saath, when:2d). Ab 16 feeds. Seedhe RSS URL jaanbujhkar nahi liye (guess/badalte). Test: JSON valid (16 feeds); fetch_news.py chala, sandbox mein internet nahi isliye sab 'feed fail' (script crash nahi hui). NOT tested live — pehli GitHub Run ke baad news.html par 'feed fail' line dekho; Google ki site: query kabhi kam results de to us site ki feed ka `when:2d` -> `when:7d` karo.

## C142 (18 Nov 2026) — News tracker: story-wise grouping (ek story = ek card, saari sites ki headline ek saath)
Rahul ka kaam: 10 sites ki latest posts mein jo ek jaisi khabar ho wo ek saath dikhe, taaki sabka use karke ek achi video ban sake.
- `scripts/fetch_news.py`: clustering naya (union-find, 72 ghante ke andar). Tokens: stopwords hataye, retention/retained/retain jaise roop ek kiye, team short form + Hindi naam -> English (feeds.json `aliases`, khud badha sakte ho; khaali value = shabd ignore). Rule: Jaccard >= 0.5, ya 3+ common shabd aur 60% overlap. Alag teams ki khabar kabhi ek nahi (MI list vs CSK list). Cluster id = sabse purani item ka id (naye item aane par nahi badalta).
- `news.html`: ab ek card = ek story: badges (label, tags, kitni sites), title, **har site ki apni headline + time + 🔗 Kholo** (pehli 4, baaki `▼ saare dikhao`). Buttons: ✓ Use ho gaya (poori story), **📋 Story pack copy** (title + tags + saari headlines/summary/links, Fact Pack ke liye Claude ko paste). Filters: tag, label, **kitni sites (2+/3+/4+)**, **site chips (har site kitni stories)**, kram (naya pehle / zyada sites pehle), khoj, used chhupao. Top 5 ab stories hain. Test ke liye `news.html?data=file.json`.
- Test: 6 sample RSS feeds (Cricbuzz, CricTracker, TOI, NDTV, Sportskeeda, HT Hindi) + 1 bad feed: 20 posts -> 10 stories; Shami/RR/LSG trade ki 5 sites ki headlines (Hindi samet) ek story; Dhoni CSK mentor 3 sites; CSK vs MI list alag; 2nd run 0 naye; headless chromium (mobile 420px): top5, 2+/3+ filter, site chip, sort, khoj, expand, used + hide + reload persist, pack copy, missing-data error msg, console errors 0.
- NOT tested: live feeds (sandbox mein internet nahi). Pehli GitHub Run ke baad news.html dekho: story sahi group hui? Galat jod/bichhdi story dikhe to headline do, aliases/rules tune honge. Limit: Hindi aur English headline tabhi judti hain jab team/player naam `aliases` mein ho.
- Update ka tareeka: repo mein `scripts/fetch_news.py`, `feeds.json`, `news.html` replace karo -> Commit + Push -> Actions > news-fetch > Run workflow (ek baar, taaki naya cluster ban jaye).
Baaki: Rahul ka real Chrome check; postponed: match prediction cards, photo license tracking; sponsor card (optional).

## C143 (18 Nov 2026) — news.html par 🔄 Abhi fetch karo button
GitHub API `POST /repos/{owner}/{repo}/actions/workflows/news.yml/dispatches` (ref main), owner/repo github.io URL se, token localStorage `cvt_gh_token` (🔑 Token button). Dispatch ke baad har 10 sec news.json check, `updated` badalte hi redraw; 6 min tak. Errors: token nahi / 401-403-404 ka saaf message.
Test (headless chromium, GitHub API mock): token nahi -> alert; 401 -> message + button wapas; 204 -> sahi URL/header/body, poll ke baad naya data (12 posts -> 6 stories), errors 0. NOT tested: asli GitHub token (sandbox mein internet nahi) — Rahul pehli baar try kare, error ka text bheje.

## C144 (18 Nov 2026) — news-fetch schedule har 1 ghante
`.github/workflows/news.yml` cron `15 * * * *` (pehle har 3 ghante). Code nahi badla. Repo mein sirf news.yml replace karo.

## C145 (18 Nov 2026) — News tracker: tez + advance (fetch parallel, 🔥 Trending, 🆕 Naya, ⭐ Baad mein, auto-refresh)
- `scripts/fetch_news.py`: saari feeds ek saath (8 thread; pehle ek-ek karke, 16 feeds = lamba intezaar), har feed 1 retry, `feed_secs` (kis feed ne kitne sec liye) news.json mein, har item par `seen` (pehli baar kab dikhi) aur `recent_n` (pichle 3 ghante mein us story par kitni alag sites).
- `news.html`: **🔥 Trending** badge (3 ghante mein 3+ sites) + chip; **🆕 Naya** badge (aapki pichli visit ke baad aayi story; tab title mein `(3)` count) + chip; **☆ Baad mein / ★** (video ke liye side mein rakho, filter `⭐ Baad mein`, save browser mein); **auto-refresh har 3 min** (page khula ho to khud naya data, tab chhupa ho to ruka rehta hai). Filter 'Sirf:' row.
- Test: 4 local sample feeds + 1 bad XML + 1 dead URL: 4 sites ki Shami/RR trade ek story (4 sites, trending), Dhoni 2 sites, fantasy blocked, bad/dead feed crash nahi, parallel fetch 6 feeds 2.1 sec; headless chromium (420px): trending/new/later filters, reopen par naya 0, later reload par save; console errors 0. NOT tested: live feeds, asli GitHub Run.
- Update ka tareeka: repo mein `scripts/fetch_news.py` + `news.html` replace -> Commit + Push -> Actions > news-fetch > Run workflow ek baar.
- Aage ke sujhaav (Rahul chune): (1) Story pack mein ready Fact-Pack prompt (ek click = Claude chat mein paste), (2) story par photo-slot/scene JSON starter (khabar -> scenes_json ka draft), (3) tag keywords/aliases tune (galat group ki headline do), (4) official BCCI/team RSS feeds, (5) phone par notification (Telegram bot) jab 3+ sites ek hi nayi story chhaape.

## C146 (18 Nov 2026) — news.html par 🎬 Fact-Pack prompt button
Har story card par **🎬 Fact-Pack prompt**: ready instructions (web se verify, naye facts nahi, source naam nahi, sheher ke naam, fantasy nahi, afwah par "संभावित: ऑफिशियल लिस्ट नहीं" label) + poora Story pack ek click mein copy -> seedha Claude chat mein paste. Rumor/Confirmed ke hisaab se line badalti hai.
Test: node --check OK; headless chromium: copy text sahi (niyam + STORY pack), console errors 0.
Baaki sujhaav: khabar -> scenes JSON draft, aliases tune (galat group ki headline do), official BCCI/team feeds, Telegram alert.



## C147 (18 Nov 2026) — news.html: ek hi copy button
Rahul ne kaha: Fact-Pack aur Story pack alag kyu, ek hi button chahiye. **📋 Story pack copy** hata diya; **🎬 Fact-Pack prompt** ka naam ab **📋 Copy (prompt + story)** (niyam + poora Story pack ek click mein). Top ki hint line bhi badli.
Test: node --check news.html script OK; button list = Use ho gaya / Baad mein / Copy (prompt + story).
Baaki sujhaav: har article par alag 'Sirf ye copy' button (Rahul ne abhi nahi bola), khabar -> scenes JSON draft, aliases tune, official feeds, Telegram alert.


## C148 (18 Nov 2026) — news.html: ek hi button, poora prompt (script + Gemini + scenes JSON)
Rahul ne kaha: sirf ek copy button chahiye; usi se Claude mein script bane, Gemini se dobara banwane ka prompt bhi saath mile, phir scenes JSON 'best se bhi best'. Pehle ka alag 🧩 Scenes JSON button hata diya.
Ab card par buttons: Use ho gaya / Baad mein / **📋 Copy (poora prompt)**. Prompt (~10 KB) mein 3 step:
- STEP 1 (abhi): web verify (2 searches) -> Fact Pack (F-number, label, trust) -> Claude ka ek-block script -> **Gemini message** (docs/GEMINI_SCRIPT_PROMPT_TEMPLATE.md ka poora template, Claude bharta hai) -> ruk jao.
- STEP 2 (Gemini output paste ya 'Claude script final'): SCRIPT_WORKFLOW ki checklist se CHECK -> FINAL script.
- STEP 3 ('JSON' bolne par): scenes.json — teaser hook (presenter scene nahi, tool ka 🎬 button), har 1-2 vaakya ka scene, card variety, header+pills (sahi/afwah rang), cta like beech mein, anth, cta end, tag ke hisaab se beech ke cards, city hint (RR/LSG jaise short form se bhi), custom photo slots ki list + 'Sab hatao' yaad, ERROR list self-check, chhota schema saath.
Default ek script = ek chunk (Rahul ka purana niyam). 'chunks mein' bolne par Claude chunk 1,2,3 bana sakta hai.
Test: node --check OK; headless chromium (sample 3 headlines): prompt ban raha, city hint rajasthan+lucknow, console errors 0. NOT tested: asli news data, Claude ka asli JSON tool ke ✔ JSON check se, Gemini ka output.
Baaki sujhaav: har article par 'Sirf ye copy', aliases tune, official BCCI/team feeds, Telegram alert.


## C149 (19 Nov 2026) — news.html: Rumor->Official alert + Nayi update (used story)
Suggestions 3 aur 4 (Rahul ne 'Continue' kaha).
- **✅ Ab Official ho gaya**: pichli baar (page band/hide hone par) jo posts sab Rumor thi, ab story Confirmed -> badge. Snapshot localStorage `cvt_news_seen` (id -> R/C), pagehide/hidden par save; pehli visit par koi badge nahi.
- **🔄 Nayi update: N nayi post**: story 'Use ho gaya' thi aur uske baad nayi posts aayi (used time ke baad ka `seen`) -> badge + nayi headline par 🆕, card dim nahi, 'Use ho chuki chhupao' mein nahi chhupti, top 5 mein aati hai. Button 'Update dekh li' dabane par badge hat jata.
- Naye 'Sirf' chips: 🔄 Nayi update (n), ✅ Ab official (n).
- Top 5 pehle se tha (alag 'top 3 banner' ki zaroorat nahi).
Test: node --check OK; headless chromium (seeded used+seen, 5 posts): update badge, official badge, dim card, Update dekh li, official filter sab sahi, console errors 0. NOT tested: asli news.json par.
Baaki sujhaav: har article par 'Sirf ye copy', official BCCI/team feeds, Telegram alert, aliases tune, 'Steps' tick (Script/Gemini/JSON).


## C150 (19 Nov 2026) — news.html: 🛠 Kaam steps (Script / Gemini / JSON) tick
Rahul ne 'Continue' kaha; bache hue mein se Steps tick liya.
- Har card par 3 chhote chip: **1 Script, 2 Gemini, 3 JSON** — tap karke ✔ lagao/hatao (copy button se alag, haath se; Gemini skip karna ho to chhod do).
- Naya 'Sirf' chip **🛠 Adhura kaam (n)**: jin stories par kuch step ho chuke par abhi 'Use ho gaya' nahi — wahin se kaam dobara uthao. 'Use ho gaya' dabane par wo list se hat jaati hai.
- Save: localStorage `cvt_news_steps` (item id -> step -> time), sirf is browser/phone mein; 'Used list save' file mein steps nahi jaate.
Test: node --check OK; headless chromium (sample 3 posts): tick, untick, filter, reload ke baad tick bana raha, Use ho gaya par wip count 0, console errors 0. NOT tested: asli news.json par.
Baaki sujhaav: har article par 'Sirf ye copy', official BCCI/team feeds, Telegram alert, aliases tune.


## C151 (19 Nov 2026) — news.html '📋 Sirf ye' + official BCCI/team feeds
Rahul ne dono maange: har article par 'Sirf ye copy' aur official feeds (Confirmed label ke liye).
1. **📋 Sirf ye** (har site ki row mein, 🔗 Kholo ke saath): wahi poora prompt (3 step + Gemini template + schema) par STORY PACK mein sirf wo ek headline. Prompt mein NOTE jodta hai: ek hi site hai, 2-3 sources se verify karo, sirf ek post wali baat [CHECK].
2. **Official feeds** (feeds.json, 4 nayi, official:true): BCCI (bcci.tv), IPL (iplt20.com), ICC (icc-cricket.com), IPL teams (10 team sites ek query mein: chennaisuperkings.com, mumbaiindians.com, rajasthanroyals.com, rcb.com, kkr.in, sunrisershyderabad.in, delhicapitals.in, punjabkingsipl.in, gujarattitansipl.com, lucknowsupergiants.in). Sab Google News ke 'site:' search se (jaise baaki Site: feeds), when:7d.
3. **scripts/fetch_news.py**: same link kisi generic feed mein bhi aaye to Confirmed hi rahe (pehle aakhri feed ka label jeet jaata tha). Rumor jaisa shabd (likely/reports...) ho to official feed ki item bhi Rumor.
Test: mock RSS se fetch_news.main() chalaya (offline): official item Confirmed, generic Rumor, doosre run mein Confirmed bana raha; page headless chromium mein Sirf ye (multi-site + single story) sahi; console errors 0.
**NOT tested (internet nahi tha):** asli Google News par in 4 feeds ka result. Google News mein har team/board site indexed ho zaroori nahi, to kuch feeds khaali aa sakti hain (fail nahi dikhega, bas 0 item). Pehli Run ke baad news.json mein source 'BCCI'/'IPL' jaise naam dhundho ya page par ✔ Confirmed badge dekho. Domain galat nikla (jaise sunrisershyderabad.in) to feeds.json mein sirf wahi domain badlo.
Baaki sujhaav: Telegram alert, aliases tune, asli RSS links mile to Google-site feed ki jagah seedha daalna.


## C152 (19 Nov 2026) — news.html: jis site ki post nahi, uska 'kholo' button
Rahul ne 10 sites ke link diye: jis story par kisi site ki post nahi, wahan us site ko kholne ka button chahiye.
- Har card mein source list ke neeche row **🌐 In sites par is story ki post nahi (khud dhundho)**: sirf wahi sites jinki is story mein post nahi, har ek ka **↗ button** (naye tab mein site ka cricket news page). Jin sites ki post hai unke liye pehle jaisa 🔗 Kholo.
- 10 sites aur link (SITES array, news.html): ESPNcricinfo cricinfo.com/cricket-news, Cricbuzz cricbuzz.com/cricket-news/latest-news, TheSportsTak thesportstak.com/cricket, News18 news18.com/cricket/, Times of India timesofindia.indiatimes.com/sports/cricket, India Today indiatoday.in/sports/cricket, Hindustan Times hindustantimes.com/cricket, CricTracker crictracker.com/cricket-news/?ref=hm, NDTV Sports sports.ndtv.com/cricket, Sportskeeda sportskeeda.com/cricket.
- Pehchan: post ke source naam (aur link) mein site ka naam dhundhta hai (jaise 'Times of India', 'The Sports Tak', 'ESPNcricinfo').
Test: node --check OK; headless chromium (sample 12 posts, 2 stories): sahi sites par button, sahi href, console errors 0. NOT tested: asli news.json ke source naam. Agar kisi site ki post hone par bhi uska button dikhe to source naam alag likha hai — wo naam batao, regex SITES mein badhaunga.
Baaki sujhaav: Telegram alert, aliases tune.


## C153 (19 Nov 2026) — baaki kaam zip mein
Rahul ne kaha 'Ye sab kaam zip mein rakho': news page ke 6 baaki kaam **docs/NEWS_TODO.md** mein detail ke saath rakhe (1 missing site par seedha khoj, 2 kai stories ka ek video, 3 used+steps backup, 4 story note, 5 Telegram alert, 6 aliases tune). Koi code nahi badla; sirf docs. Rahul bole tabhi uthao.


## C154 (19 Nov 2026) — news.html: site par is story ki 🔎 khoj + ek Backup file (NEWS_TODO 1 aur 3)
Rahul ne 'Next kaam karo' kaha (saath mein extension ko bhi advance karne ko).
1. **🔎 khoj**: jis site ki post nahi, uske ↗ ke saath ab 🔎 bhi. 🔎 Google ka `site:<domain> <story ke 6 khaas shabd>` search kholta hai (shabd story ke title se, chhote/stop shabd hata ke). ↗ pehle jaisa site ka cricket page kholta hai. Cricinfo ke liye domain espncricinfo.com.
3. **Backup**: ⬆ Backup save ab ek file `news_backup.json` (format cvt_news_backup_v2) mein **used + steps + baad mein** save karta hai; ⬇ Backup load wahi load karta hai (merge, purana mita nahi) aur purani sirf-used file (news_used.json) bhi load karta hai.
Test: node --check OK; headless chromium: 🔎 links sahi query, backup save -> localStorage saaf -> load -> used/steps/later wapas, purana format load, console errors 0. NOT tested: asli news.json; Google search ka asli result.
**Extension:** photo_finder_extension/ is zip mein NAHI hai (C44 ke hisaab se zip ke bahar, repo mein bhi nahi) — iske bina advance nahi kiya. Rahul se uska folder/zip maango (README.txt + manifest.json + js). Phir plan: news story ke khiladi ka naam extension ko bhejna / photo khoj queue (NEWS_TODO mein jodo).
Baaki: NEWS_TODO.md ke 2 (kai stories ka ek video), 4 (story note), 5 (Telegram), 6 (aliases).


## C155 (19 Nov 2026) — extension wale kaam bhi zip mein
Rahul ne kaha 'Ye sab kaam bhi zip mein rakhlo' (extension ko use + advance karna). Koi code nahi badla. **docs/NEWS_TODO.md** mein 'Extension' section: E1 story -> photo khoj, E2 site checker (10 sites par story mili/nahi), E3 sites ki headlines seedha padhna, E4 official check, E5 Photo Finder advance (batch queue, license tracking). Pehle Rahul se photo_finder_extension folder maangna zaruri (zip mein nahi).
NEWS_TODO ke baaki: 2 kai stories ka ek video, 4 story note, 5 Telegram, 6 aliases.


## C156 (19 Nov 2026) - news.html: Top-N multi-story video
Card par chip `☐ Top-N mein chuno` (max 8, kram = chunne ka kram, localStorage cvt_news_sel). Neeche fixed bar: 📋 Copy (Top-N prompt), 1 Script/2 Gemini/3 JSON sab par, ✓ Sab Use ho gayin, ✖ hatao. Prompt: FORMAT A (aaj ki top N), STORY 1..N alag pack + har ka label, S1-F1 fact numbering, lambai ~N*140 shabd, ek hi script.

## C157 (19 Nov 2026) - news.html: story par apna note
Card par ek line 📝 note (item.id par save, latest dikhta hai, localStorage cvt_news_notes). Prompt mein `RAHUL KA NOTE`, filter `📝 Note wali`, khoj mein note bhi. Backup ab `cvt_news_backup_v3` (+notes); v2 aur purani used file bhi load hoti hain.

## C158 (19 Nov 2026) - E1: 📷 Photo dhundho (extension v1.1)
Card par button: headline se naam ka andaza (English Title-Case, team/city/generic shabd hata ke), edit ho sakta hai. ⚡ dabane par extension ek-ek Google Images kholta hai; photo news.html seedha IndexedDB `cvt_photos` + `cvt_photo_custom` mein custom slot `custom_<naam>` banake daalta hai (same origin, photos.js jaisa id). Pehle se ho to skip. Bane slot ids prompt STEP 3 mein jaate hain. Tool tab refresh karna padta hai.
Extension: tool-bridge.js mein ping/pong; tool-main.js mein bug fix (news.html par PHOTOS nahi, pf-set par galat alert aata); manifest v1.1.

## C159 (19 Nov 2026) - E2/E3/E4: 🧩 Sites padho (extension v1.1)
Extension background.js `scrape` (scrape-lib.js): 10 sites + BCCI/IPL/ICC ke news page ki headline+link (sirf button dabane par). news.html: E2 chip ✔ site: headline / ✖ nahi mili / ⚠ padh nahi paaya; E3 matched headlines prompt STORY PACK mein 'Extra sites ki headline'; E4 official match par badge `🏛 Official site par mili` (label apne aap nahi badalta). Match: shabd overlap (>=3 aur 45% ya >=2 aur 70%).
Test: node --check sab; scrape-lib local HTML par; headless chromium + NAKLI extension (stub) 32 checks pass, console errors 0. Test mein ping race bug mila aur fix hua.
NOT tested: asli extension, asli Google Images, asli 13 sites (internet nahi tha). BCCI/IPL/ICC URL yaad se (news.html `OFFICIAL` array). JS se bani site khaali aayegi; 'CSK' jaise short form match nahi hote. Photo se galat player aa sakta hai (thumbnail check).
Baaki: NEWS_TODO 5 Telegram, 6 aliases, E5 (photo license tracking + batch queue).

## C160 (19 Nov 2026) - 🖼 Photos: 📁 Folder mein save / 📂 Folder se load
Photos panel mein 2 naye button (js/photos.js, File System Access API, Chrome desktop): 📁 sab photos PC ke chune hue folder mein (file naam = slot id + .jpg/.png/.webp, saath mein _photo_names.json custom naamon ki list); 📂 folder se wapas load (custom naam bhi wapas). Purana ⬆ Backup/⬇ Restore JSON waisa hi hai.
Test: node --check; headless chromium NAKLI directory handle ke saath save -> library saaf -> load (2/2 photo + custom naam wapas), console errors 0. NOT tested: asli folder picker aur Chrome ki permission prompt (Rahul ke Chrome mein check baaki). Folder load par Chrome ek baar 'view files' permission puchta hai.

## C161 (19 Nov 2026) - 📷 Photo ke saath team/series ka naam
news.html Photo box ab `naam | team/series` format leta hai (jaise `Mohammed Shami | Rajasthan Royals, Sam Curran | Lucknow Super Giants`). Slot id/naam mein team judta hai (`custom_mohammed_shami_rajasthan_royals`, library mein 'Mohammed Shami · Rajasthan Royals'), isliye ek hi player ki alag team/series ki alag photo (`| India`, `| IPL`) alag slot banti hai, purani overwrite nahi hoti. Google query mein bhi team judti hai (behtar jersey). Team ka andaza headline se: naam ke baad aane wali team, warna pehle wali, warna IPL; edit kar sakte ho. Folder save mein file naam mein bhi team aati hai.
Test: 34 checks pass (same player, doosri team = naya slot), console errors 0. Purani bina-team wali photos (custom_<naam>) jaisi hain waisi rehti hain.

## C162 (19 Nov 2026) - 🆕 Scene JSON se photo naam apne aap library mein
Ab scenes.json mein jo `custom_<naam>` photo id ho (stat/retain `photo`, watch/rumour `photos`) aur library mein na ho, to **⬇ JSON load** (aur ✔ JSON check) par wo naam apne aap custom slot ban jata hai (naam id se: `custom_mohammed_shami_rajasthan_royals` -> 'Mohammed Shami Rajasthan Royals', Hindi naam jaisa hai). Pehle ye 'unknown photo slot' error se load hi nahi hota tha. Ab load ke baad message: '🆕 N naye photo naam bane' + 📷 summary mein har naam ke saamne अपलोड button -> Rahul ko sirf photo upload karni hai. Scene Properties panel mein `photo` field mein naya custom_ naam type karne par bhi slot ban jata hai. Pehle se maujood slot (news.html wale nicer naam) overwrite nahi hote; dobara load par duplicate nahi.
Code: js/photos.js (`PHOTOS.ensureCustom`, `PHOTOS.autoFromScenes`), js/scene_editor.js (load + check), js/filmora_shell.js (photo field).
Rule: sirf `custom_` se shuru hone wale id auto bante hain; galat/anjaan id (jaise `bogus_x`, typo wali library id) ab bhi ERROR.
Test: node --check; headless chromium: JSON load -> 2 naye slot (Latin + Devanagari), dobara load par duplicate 0, bogus id par error bana raha, 📷 upload se photo slot mein gayi aur page reload ke baad bhi slot+photo maujood, console errors 0. NOT tested: asli Chrome mein Rahul ka asli scenes.json.

## C163 (19 Nov 2026) - Hindi text kat raha tha + basic text English
Rahul ne screenshot bheje: timeline card ka kinare wala Hindi label screen se kat raha tha; CTA card pura Hindi tha. Fix: (1) `timeline` card (js/card_market.js) label ab screen ke andar clamp (60px margin) + thoda chhota fit. (2) Bhasha niyam: sirf khabar Hindi, basic text English. cta card labels Like/Comment/Subscribe, default title 'What do you think?'/'Enjoying the video?', line 'Tell us in the comments'/'Don't forget to subscribe'; JSON mein Hindi title/line aaye to cta card use English se badal deta hai (data.hindi:true se Hindi chalega). Defaults English: short_cta, anth cta, endscreen (editor), chapter_flow ('N chapters'). Rule docs/SCENES_JSON_SCHEMA.md + 00_START_HERE niyam 14 mein.
Test: node --check; headless chromium frames dekhe (timeline 3 Hindi points kinare tak, cta Hindi JSON -> English), console errors 0. NOT tested: baaki cards ka kinare wala text (card_steps, tiles etc.) - Rahul kat'ta dikhe to screenshot bheje. Ye bhi baaki: Hindi-bhari baaki defaults (watch 'नज़र रहेगी', presenter sub) abhi waise hi.

## C164 (19 Nov 2026) - Rumor/official wali cheezein cards se hata di
Rahul ne kaha: rumor ya official wali cheezein mat likho. Ab: retain card par stamp (retain/rumour/official) aur "संभावित: ऑफिशियल लिस्ट नहीं" label nahi dikhte; watch + rumour card par bhi stamp/label nahi. Pill jisme रूमर/अफवाह/ऑफिशियल/आधिकारिक/rumor/official ho wo apne aap hat jati hai (js/pill_row.js `PIL.BAN`). Checker: label hatane ka error + official stamp warning hata; data mein ye shabd ho to warning. Editor defaults (rumour sub, compare card) se ye shabd hata diye. Purana niyam 7 (label HAMESHA) Rahul ke naye hukm se badal gaya (00_START_HERE niyam 7).
Test: node --check; headless chromium retain card (stamp:'rumour' + pill 'अभी सिर्फ रूमर') -> stamp/label/rumor pill nahi dikhe, console errors 0.
NOT done: header_line / captions / card ke text (name, note) mein ye shabd ho to tool nahi hataata (sirf warning) — JSON/script mein na likho. `rumour` card type ka naam waisa hi hai (sirf do-photo layout, stamp nahi).

## C165 (19 Nov 2026) - 🎬 Intro / Outro / extra video (PC se upload, save, volume)
Naya js/bumpers.js + export_fast.js/main.js/index.html mein jod. Button: 🎬 Intro/Outro (bar2 aur timeline tools mein). Panel: ⬆ PC se video add (library = 🎞 Clips wali IndexedDB, browser mein save), 📦 Default intro+outro (assets/22_bumpers/intro_8s.mp4 + outro_6s.mp4, Rahul ke diye 8s/6s), ➕ Aur video slot. Har slot: on/off, Shuru mein/Aakhir mein, video chuno, volume 0-300% (+100%/Mute), Fit (contain/cover), up/down order, preview (awaaz + volume ke saath), hatao. Naya upload khaali slot mein apne aap lagta hai. Settings localStorage 'cvt_bumpers'.
Export: Fast export mein intro(s) -> main -> outro(s); bumper ki apni awaaz ek OfflineAudioContext mix mein (main audio intro ke baad se), volume gain, hard clip. Real-time export mein bumpers NAHI judte. Main player preview mein bhi nahi dikhte.
Test (Rahul ne baaki test rokne ko kaha): node --check; headless chromium mein panel + default load pass (2 video library mein, slots bhare, sum 8.1+6.0). NOT tested: asli export ka final MP4 (frame/audio sync, volume), preview, PC upload picker, Short 9:16 mein fit. Rahul ke Chrome mein check baaki.

## C166 (19 Nov 2026) - toolcric.zip ke 2 tool repo mein (tools/)
Rahul ke diye 2 standalone HTML tool bina badle jode: tools/photo-studio.html (photo editor: layers, brush, text, shapes, filters, crop, PNG/JPG; thumbnail/photo touch-up ke kaam ka) aur tools/study-tube.html (Studytube: study videos, channels save, notes, history, backup). index.html ke nav mein 🖌 Photo Studio + 📚 Studytube link. Dono apne aap mein poore, cricket tool ke code se judte nahi.
NOTE: In dono mein channel comparison ya title/description banane wala hissa NAHI hai (Studytube mein sirf channel save/subscriptions + video player hai). Wo kaam alag chunk hoga (Rahul bataye: Channel Compare tool / Title+Description helper).
Test: nahi kiya (Rahul ne test rokne ko kaha). Studytube ko YouTube API key chahiye browse ke liye.

## C167 (19 Nov 2026) - 📊 tools/channel-compare.html (Channel Compare + Title/Description helper)
Naya standalone tool (YouTube Data API v3, Studytube wali key; localStorage 'uv99:st:key' se badal sakte). Input: @handle / channel link / UC ID / naam (naam = search, 100 quota). 25/50/100 latest videos padhta hai. Comparison table (hara = best): subs, views, avg/median/best views, views/subs %, like/comment %, uploads/mahina, Shorts %, title length/number/?/emoji/Hindi %, description length/link/#/timestamps. Har channel: top 5 videos (title + description copy), title ke top shabd, top tags, channel keywords + description copy. Saved channels (click jodo, double-click hatao), CSV export. Section 2: apna title/description check (length, number, ?, caps, hashtags, links, chapters) + competitors ke tags/shabd jo tumhare text mein nahi (500 char tag limit ke andar copy). index.html nav mein 📊 link.
Test: sirf node --check (Rahul ne test rokne ko kaha). NOT tested: asli API call/key, referrer restriction, layout. Key ko Google Cloud mein sirf apni GitHub Pages site + YouTube Data API v3 par restrict karna.

## C168 (19 Nov 2026) - Intro/Outro preview + Real-time export mein; Channel Compare mein "Kya chala"
1) js/bumpers.js: `B.sequence` (intro(s) -> main (player ke through) -> outro(s)). ▶ Poora preview (panel + bar2 ka '▶ Intro/Outro ke saath' button): bumper player canvas par, awaaz speakers par volume slider ke saath (WebAudio gain), main ka audio AP deta hai; ⏹ Roko. Real-time export (EXPORT.run wrap): bumper hone par recorder mein intro + main + outro (bumper audio gain ke saath, main audio X.audio), bumper na ho to purana raasta. Fast export waisa hi (drawFrame ab drawVid use karta hai). main.js: real-time status mein bumper count.
Limit: timeline/seek bar sirf main video dikhata hai (bumper uske bahar). Real-time export asli speed se chalta hai, tab khula rakho; bumper video har frame draw timer (16ms) se, tab background mein jaye to frames chhoot sakte.
2) tools/channel-compare.html: 🔥 Kya chala: har channel mein median se 2x+ videos (x multiple, title copy), hit vs baaki (title length, number/?/Hindi %, avg length, hit titles ke zyada shabd); 📅 din aur 🕐 time (Subah/Dopahar/Shaam/Raat) ka relative score (views ÷ channel median), sab channels mila ke combined; checkbox 'sirf long videos (3 min+)'. Kam data (<6 video, ya <20 par warning) par saaf chetavni. Time device ka local time.
Test: sirf node --check (Rahul ne test rokne ko kaha). NOT tested: asli export mein bumper (real-time audio sync), preview, asli API data par kya-chala numbers.

## C169 (19 Nov 2026) - Channel Compare: 📈 Growth track + ⬇ Backup / ⬆ Restore
tools/channel-compare.html: har compare par har channel ka snapshot (subs, total views, videos, avg views; din mein ek, max 90) localStorage 'cc:snap' mein. 📈 Growth table: snapshots (pehli -> aakhri date), subs pichle snapshot se / shuru se, subs/din (sabse tez hara), views/din, naye videos, subs trend sparkline. Pehle sirf 1 snapshot ho to saaf message. ⬇ Backup (saved channels + snapshots JSON, API key nahi) aur ⬆ Restore (merge, duplicate din skip).
Test: sirf node --check (Rahul ne test rokne ko kaha). NOT tested: asli data par numbers, restore file picker. Hidden-subscriber channels mein subs '—'.

## C173 (19 Nov 2026) — Player photos zyada + har baar nayi photo
js/photo_variants.js (nayi): multi-photo per player, scene-wise auto-rotate, auto Cameo (👤 toggle). docs/PHOTO_VARIANTS.md. Headless test: rotation (red/blue/green/red) + cameo pixel ON/OFF pass. Input zip mein 116 asset files corrupt thi (docs/MISSING_ASSETS_C173.txt) — apne original zip se wo assets folders wapas copy karo.

## C174 — Cameo pro: duo cards, mid-scene photo refresh, glow/shimmer/float. Headless test pass.

## C175 — Competitor title+thumbnail grab: tools/competitor-grab.html (channel/video links -> titles, views, thumbs, ZIP, naye-titles prompt) + scripts/competitor_grab.py (saare videos, yt-dlp). Parser+ZIP headless test pass; live YouTube fetch is not tested here (sandbox mein YouTube band) — asli Chrome mein check baaki.

## C176 — Competitor channels save: tools/competitor-grab.html mein ⭐ Saved channels (localStorage, chip click = latest lao, ✕ hatao, 'sab lao', list copy backup). Reload par persist test pass.

## C177 — Match prediction: js/card_predict.js (winprob/h2h/pitch/xi) + prediction/index.html (form -> JSON, news se alag folder) + registry (scenes_check, scene_editor, index). Headless render check pass (5 scenes). Asli photos ke saath XI ek baar dekhna baaki.

## C178 — Prediction news se alag: predict.html -> prediction/index.html (+ prediction/README.md). news.html/daily.html mein prediction ka koi reference nahi.

## C179 (19 Nov 2026) — 3 screenshot problems fix (bigwords + cameo)
1) js/card_words.js (bigwords): join shabd ("और") ki asli chaudai naapi (pehle fixed 150px tha, 2026/चोट par chadhta tha); bina join ke bhi shabdon ke beech gap; text bahut lamba ho to do line (A upar, B neeche); peeche halka dark scrim.
2) js/photo_variants.js (cameo): CAM_AVOID table (stack, qcards, bigwords, bullets, timelist, checklist, options, barlist, ladder) — cameo list ke upar nahi aata, kinare mein chhota ho jata hai, jagah na ho to us scene mein nahi aata; cameo caption ke upar rehta hai.
Test: node --check pass; headless chromium frames theek, console errors 0.
C180 FIX: "न्न" (चेन्नई) ligature "न्र" jaisa dikhta tha -> js/text_fx.js mein ZWJ (न्‍न) sab canvas fillText/strokeText/measureText par; ab saaf adha-न + न. Headless frame check pass. PENDING: baaki CAM_AVOID cards ki chaudai check; real Chrome mein dekhna.

C181: bigwords text ka glow 24->16 + upar se sharp (bina shadow) pass — video ke andar ka dhundhla look kam (card_words.js). Note: scene badalte waqt transition (blurfade/push/zoom) frame ko jaan-boojhkar blur karte hain (transitions_pro.js); agar blur wahan dikhe to transition badlo.

## C182 (19 Nov 2026) — News card par 4 title ideas
js/news_titles.js (naya) + news.html: har story card par 🎯 4 title (Emotion hook / Sawaal / Breaking / Reaction, har ek ke saath 📋 copy + akshar count); 📋 Copy prompt mein STEP 1 ke point 5 mein "TITLE" (style + draft ideas) joda. Style docs/TITLE_STYLE.md (3 docx ka analysis). Rule-based, AI nahi: khiladi naam/team/₹ number/event (trade, release, retain...) headline se nikalta hai.
Test: node --check; headless chromium news.html (sample stories) -> 4 title har card par, console errors 0. news.json wapas khaali. NOT done: asli live news data par quality check; "naya title" button (alag combos); tools/competitor-grab.html se saved titles ko examples banana; India match (win/lose) titles basic hain.


## C183 (19 Nov 2026) — Audio box fix + Filmora default + captions hata diye
- main.js: 🎙 Audio file box ab AT.addFile se segment banata hai (pehle sirf EXPORT.audio mein jaata tha, Audio Editor nahi khulta tha). Timeline par double-click / 🎛 Audio Editor se edit.
- filmora_shell.js: Filmora layout hamesha default (purana 'classic' localStorage ignore + saaf). Classic sirf ?layout=classic se.
- Captions hata diye: captions.js CAP.on=false hamesha, Captions tab (Filmora + classic), timeline Text lane aur panel button chhupe. File captions.js rakhi (looks.js/photo_variants.js use karte hain).
- Test: node --check + headless chromium (wav upload -> AT.segs=1, AUDIOED.open ok, errors 0).
- Baaki: Filmora se bhi behtar polish (easy mode) — asli Chrome check ke baad naya chunk.

## C184 (19 Nov 2026) — Classic default + preview par element click/drag/hatao + Intro/Outro button
- Classic layout ab DEFAULT (index.html). Filmora sirf ?layout=filmora ya 🧩 Filmora layout link se.
- NAYA js/elem_edit.js (core.js ke turant baad): CORE.text/drawImg/panel/cover aur ctx.drawImage wrap -> har draw ka box yaad. Preview par click = select, drag = jagah, ＋/－ (ya +/-) = size, Delete = hatao, arrows = nudge (Shift=20px), Esc = chhodo, ↺ = wapas, '↺ Is scene ke sab badlav hatao', '👁 Hatai cheezein wapas'. Badlav scene.ov (Short mein scene.ovS) {key:{dx,dy,s,hide}} mein; JSON/undo/export mein jaata hai. key = type+text/asset+kitni-vi-baar (text ke ank '#').
- Limit: line/underline jaise code se bani cheezein (rect/fill) abhi select nahi hoti; text ke ank badalne par key same rehti hai; animated card mein jo cheez baad mein aati hai wo us waqt hi select hogi (seek karke click karo).
- bumpers.js: classic mein #quick par 🎬 Intro / Outro + ▶ dekho button (pehle sirf hidden bar2 / Filmora mein tha).
- Test: node --check, headless chromium (drag: ov dx/dy bana, Delete: hide, show: wapas, Intro box khula, errors 0, Filmora ?layout=filmora ok).

## C185 (19 Nov 2026) — ➕ Video yahan jodo (js/clip_insert.js)
- Classic: player ke neeche '➕ Video yahan jodo' + '🎞 Clips' (pehle hidden bar2 mein the). Filmora: timeline toolbar mein '➕ Video yahan'.
- Playhead jis scene mein ho, uski seema (aadhe se pehle = pehle, baad = baad) par naya 'clip' scene (dur = clip ki lambai, max 60s, fade, chunk padosi scene ka). Scene ke beech mein todta nahi.
- Sirf wide mode. Clip ki awaaz abhi mute (card_clip.js) — awaaz ka option baaki.
- Test: node --check + headless chromium (webm upload: classic + ?layout=filmora dono mein hook ke baad clip scene bana, errors 0).

## C186 (19 Nov 2026) — 3 thumbnail prompt + har 30 sec naya hook (script)
- NAYA js/news_thumbs.js (news.html mein news_titles.js ke baad): window.THUMB_STEP -> prompt ka "6) THUMBNAIL" step: 7-style bank, clickbait + face niyam, team colours (khabar ki city se), Prompt B + Prompt A template. Top-N video par NUMBER GRID concept bhi.
- news.html GEM_T (Gemini template): naya RETENTION (30-SECOND NIYAM) block, STYLE line "har 30 second naya mod", DHANCHA + AAKHIR mein yaad dilana. STEP 1 point 3: "30-sec hook map" (code block ke bahar). STEP 2 check mein 30-sec hook + thumbnail checks. STEP 3 JSON mein 30-SEC RETENTION scene line.
- docs/GEMINI_SCRIPT_PROMPT_TEMPLATE.md GEM_T jaisa update; docs/THUMBNAIL_PROMPT.md (Rahul ki file) + SCRIPT_WORKFLOW.md C186 section.
- Test: node --check (news.html inline + news_thumbs.js), headless chromium: fullPrompt single + Top-N mein 6) THUMBNAIL, RETENTION, hook map, NUMBER GRID sab aaye, page errors 0.
- Baaki: asli Gemini par 3 thumbnail + naye script ka output dekhna (Rahul), phir niyam tune.

## C187 (19 Nov 2026) — Copy ke saath prompt .txt save
- news.html: 📋 Copy (poora prompt / Sirf ye / Top-N) dabate hi prompt clipboard mein jaata hai AUR prompt_<tarikh_samay>_<story>.txt Downloads mein save hota hai (chat mein file bhej sako). Button par "✔ Copy hua + 💾 .txt". Upar checkbox se band/chalu (localStorage cvt_savetxt).
- Test: node --check, headless chromium download ok (file naam + content), checkbox off par download nahi, errors 0.

## C188 (19 Nov 2026) — Gemini ko script chunks mein + har chunk mein format + best se bhi best
- news.html: STEP 1 point 4 ab "GEMINI MESSAGES (CHUNKS)": 4-5 alag code block, har mein poora FORMAT AUR NIYAM + us chunk ke facts/dhancha/Claude draft + BEST SE BHI BEST. GEM_T mein CHUNK line, SHURUAAT sirf chunk 1, CTA sirf dhancha wala, OUTPUT sirf is chunk ka. STEP 2 mein chunks jodne ka check.
- docs/GEMINI_SCRIPT_PROMPT_TEMPLATE.md GEM_T jaisa, SCRIPT_WORKFLOW.md C188 section.
- Test: node --check, fullPrompt mein CHUNKS/CLAUDE DRAFT aaya.


## C189 — IPL Daily Video (DONE)
- news.html: purple box 'IPL Daily Video' (roz nayi IPL stories, poori + fast headlines, ek click prompt, use-mark, undo, log, backup mein ipl log).
- Intro: shocking sawaal-hook + fixed 'मैं हूँ युवराज, और आप देख रहे हैं खबर मैदान की' + 'शुरू करते हैं'.
- feeds.json: 4 naye IPL 1-day feeds. Doc: docs/IPL_DAILY.md.
- Test: headless chromium (12 nakli stories), errors 0. Live feeds check baaki.

## C189b — Standard Intro/Outro chooser (DONE)
- js/bumper_pick.js (new): PC se upload, chuno, intro = script line par clip scene, outro = aakhir. looks.js 🎬 Standard intro jodo ab chuna hua intro lagata hai. index.html mein script tag. Doc: docs/INTRO_OUTRO_CHOOSER.md.
- Test: headless chromium (upload 2 video, choose, scene insert, dobara click replace), errors 0.

## C190 — Style list (DONE)
- js/style_names.js (new): 42 naam wale styles, 🎨 Style list overlay, Naya Style ab naam dikhata hai. looks.js + index.html chhota badlav. Doc: docs/STYLE_LIST.md. Test: headless chromium, errors 0.

## C191 (21 Nov 2026) — Expression emoji + pause chinh: teleprompter + captions
teleprompter.html: ⏸ aur emoji alag styling mein (bade), shabd-ginti unhe nahi ginti; setup mein cue legend. js/captions.js: setScript/load mein ⏸ aur emoji hataye (CAP.clean). docs/EXPRESSION_EMOJI.md. Script mein label kam + emoji + pause ab standing niyam.
NOT tested: asli Chrome mein teleprompter dekha nahi (sirf syntax + regex unit test). 08_SCENES.json ka script key naye emoji script se badla (08_SCENES_v2_EMOJI_SCRIPT.json); cards purane intro ke hisaab se hain.
Next: Rahul jo bole (scenes mein zyada images + ek player ki bulk photos, ya aur).


## C192 (21 Nov 2026) — Intro/Outro volume slider (chooser)
js/bumper_pick.js: Intro/Outro tab par 0-300% slider (introVol/outroVol), applyBump BUMP item ka vol set karta hai. docs/INTRO_OUTRO_CHOOSER.md update.
Test: node --check ok. NOT tested: asli Chrome mein slider + export (headless chromium is chat mein nahi tha).
Next (C193): script-line intro scene ki awaaz (clip audio voice-over ke neeche, volume slider ke saath) + Chrome mein slider/export check. Music (🎵) pehle se maujood.

## C193 (21 Nov 2026) — IPL Players page (list + photos tab + ZIP + extension auto)
NAYE: players.html, js/ipl_players.js (184 IPL 2027 retained players, PHOTO_SLOTS mein 105 naye slot), js/zip_lite.js (zip likhna/padhna). index.html: script tag + nav 👥 Players. docs/IPL_PLAYERS.md.
Test: node (zip, nakli DOM harness). NOT tested: asli Chrome + extension. Auction (16 Dec) ke baad list update karni hogi.
Next (C194): (1) asli Chrome mein players page + ⚡ Auto check, jo bhi bug (2) script-line intro ki awaaz (pehle wala C193 plan, ab C194).

## C193b (21 Nov 2026) — Classic UI naya: preview bada, scenes list side mein, buttons ke groups
NAYA: js/classic_shell.js (index.html mein sabse aakhir mein; sirf Classic mein, ?layout=filmora par band). Purane modules ko chhua nahi — sirf unke elements nayi jagah.
- Layout: left = bada preview (height ke hisaab se fit, Short 9:16 mein bhi) + transport + buttons; right (sticky) = Scenes/Photos/Audio/Export tabs. <1100px par purana stacked.
- Transport: ⏮ ▶ ⏭, seek, 'Scene 3/8 · stat · 0:07/0:35' chip, Undo/Redo/Safe zone yahin.
- Scenes list: har scene ek chhoti row (number, rang wala type, headline, dur) + ↑ ↓ ⧉ ✕. Click = scene chuno + wahan seek; laal bar = abhi chal raha scene. Chuna hua scene ke fields neeche (SE ke apne). 📷 chip = photos ka hisaab (click par poora summary).
- Buttons ke 5 group tabs (yaad rehta hai, cvt_cl_tab): 🎨 Look (Polish, Look, Cinema, Progress, preset, Zoom, Style list, Naya Style) · 🎬 Intro/Outro · 🔤 Text (Header/Pills/Carry) · 🎞 Video (Video yahan, Clips, Chapter flow, Short, Auto-vary, Storyboard) · 🗂 Kit. Naye modules ke buttons MutationObserver se apne aap sahi group mein (regex groupOf() classic_shell.js mein; naya button ho to wahan keyword jodo).
- Header: ⚡ Export (MP4) button + progress status har tab se.
- Keys: ↑↓ scene, Home/End (preview par element chuna ho to arrow uska nudge hai).
Test (headless chromium 1600x900, 900x800, 8-scene JSON): node --check ok; console errors 0; row click/seek, ↑↓⧉✕ list se, Undo, ⏮⏭, ArrowDown, 5 tabs, Short 9:16 (405x720), filmora layout (fm class, cl-grid nahi) sab OK. NOT tested: asli Chrome par export/audio.
Next: C194 (PROMPT_C194_NEXT.md) jaisa; UI mein aur badlav Rahul jo bole (list mein drag-reorder, scene thumbnail, buttons ka order).

## C194 (22 Nov 2026) - Photo board
Dekho docs/PHOTO_BOARD.md.
- C194b: board mein Undo/Redo; JSON load script (scene ya {scenes,script}) teleprompter mein auto + live; JSON save mein script jaati hai.

## C195 (22 Nov 2026) — Unified layout (Filmora + Classic) + Cinema bars default OFF
- NAYA js/unified_shell.js: Filmora layout ke upar Classic ke features (compact scene list ↑↓⧉✕, ⏮⏭ + scene chip, Undo/Redo/Safe zone transport mein, 6 tabs right mein Properties+Look/Intro-Outro/Text/Video/Kit, header mein ⚡ Export + status). Default layout ab yahi; ?layout=classic = purana Classic. docs/UNIFIED_LAYOUT.md.
- Cinema bars: js/fx_pro.js har load par bars=false, save mein bhi false; js/looks.js Studio preset bars:false + preset lagne par bars=false.
- Test: node --check, headless chromium, errors 0. NOT tested: asli Chrome export.

## C196 (22 Nov 2026) — Background videos DONE
- 33 loops assets/bgvideo/ (make_loops.sh -g 12). NAYA js/bg_video.js (index.html mein sabse aakhir mein): C.cover wrap (frame offscreen canvas, canvas.src = asli bg src), scene.data.bgv, preview sync (play/pause/seek + seeked redraw), export C.beforeFrame chain, preload, Look tab UI (MIX/EK HI/OFF, 🎲 BG badlo, select), Naya Style/Style list pools. Doc: docs/BG_VIDEO.md.
- Test (headless chromium, 8-scene JSON, H.264 chala): errors 0; bgv scenes par video, title/retain/intro par nahi; play ok; fast export 2s ok (2.9 MB); MIX/EK HI/OFF, reroll, Naya Style, select ok; buttons Look tab mein.
- NOT tested: asli Chrome par lamba export + Short 9:16 + real-time export; frame ki sharpness asli screen par.

## C197 (22 Nov 2026) — 📱 Reels Maker (alag page) chunk 1 DONE
reels.html (standalone, engine alag): script lines -> captions, BG video, photo, audio, preview + real-time MP4 export. index nav mein link. docs/REELS_MAKER.md. Test headless chromium: preview, export (mp4 1.8 MB), errors 0. NOT tested: asli Chrome par audio ke saath export. Chunk 2 plan REELS_MAKER.md mein.

## C197b (22 Nov 2026) — Reels Maker chunk 2 (fast export chhod ke) DONE
reels.html: number card (## line), Style list 12, caption box/dim, music + ducking, JSON save/load (main tool scenes JSON bhi). Test headless chromium: JSON load, style, export with music (mp4 1.2 MB), errors 0. NOT tested: asli Chrome par awaaz+music export. Baaki: fast export.
