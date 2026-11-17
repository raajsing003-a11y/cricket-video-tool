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
