# BG video (C196)
43 seamless loops (01-33: 5s, 34-38: 2-2.75s = 2-3 chhote clips merge, 39-43: 5s) (assets/bgvideo/, 720p, no audio). Card ka full-canvas background image ki jagah scene ka video chalta hai (dim 0.2). title / retain / intro / clip scenes par nahi.
- scene.data.bgv = loop ka naam (ya "05"), "off" = is scene par nahi. Na ho to seed se pick (adjacent scene alag).
- Look tab: 🎞 BG video: MIX / EK HI / OFF · 🎲 BG badlo (naya mix/ek video, Look ke pool se) · select (is scene ka video; EK HI mein sab ka). Settings localStorage cvt_bgv.
- 🎬 Naya Style / 🎨 Style list: style ke Look ke hisaab se pool (BGV.POOL) -> d.bgv likhta hai.
- Video load na ho to purani image (kabhi kaala nahi). Export: har frame se pehle exact seek (C.beforeFrame chain).
- Naye loops: bg_video_work/originals mein mp4 daalo, make_loops.sh chalao, assets/bgvideo/ mein copy, js/bg_video.js ki LIST mein naam.

- C201: 10 naye loops (34-43). 34-38 = 1.25s ke chhote clips 3-3 (last wala 2) merge + crossfade loop. Kharab clips (kaali bars / 4K badge / film border: ring 01,03,08,09 aur simple 21) use nahi kiye. Style pools mein jude.
- C202: PC se apne BG video. Look tab mein "➕ Apne BG video (PC se)" (reels.html mein bhi). Video IndexedDB (cvt_bgu) mein save hote hain, LIST + sab Naya Style pools mein auto jud jaate hain, aur scenes par turant set ho jaate hain (mode OFF ho to MIX). "👤 Sirf mere BG: ON/OFF" = mix sirf apne videos se. "🗑 Mere BG hatao" sab apne video hatata hai. Loop seamless: do video d/2 offset par + 0.75s crossfade (draw time par, re-encode nahi). Chhote clips bhi loop ho jaate hain, merge nahi hota (merge ke liye bg_video_work/make_loops.sh). Apne video sirf usi browser/PC mein rehte hain; JSON dusre PC par khulne par auto video lagta hai. 720p/1080p, 400MB tak, max 40. Files: js/bg_user.js (naya), js/bg_video.js, index.html, reels.html.
