# Next chat prompt (C215b -> C216)

Zip: cricket_video_tool_chunk215b_COMPLETE.zip. Pehle padho: docs/TRACKER.md (last entry C215), docs/VIDEO_EDITOR_TRACKER.md, docs/AUDIO_EDITOR_TRACKER.md, docs/AUDIO_EDITOR.md, docs/VIDEO_EDITOR.md.
Rules: replies chhote (kya bana, kya test hua, kya baaki, agla chunk), Hinglish UI, kathin Hindi nahi, single-file offline HTML pages, har chunk ke baad chromium (playwright) test + JS errors 0, purane tests pass. Har chat ke end mein poori zip + TRACKER update + GITHUB_UPDATE_Cxxx.txt + naya prompt.

## Merge status
- Video editor (video_editor.html, Chunk 0-15) + Studio (studio.html: Scenes + Editor tab) DONE (C201-C203).
- Audio editor (tools/audio_editor.html + tools/df_bg.wasm, Chunk 1-20) tool mein standalone page ki tarah joda (C206), nav link + back link.

## Merge ka bacha kaam (is order mein)
1. DONE (C207): studio.html mein Audio tab.
2. DONE (C208): clip audio -> Audio Editor -> enhanced wapas (Editor mein "🎛 Audio" button, Audio Editor mein "↩ Video Editor ko bhejo").
3. DONE (C209): Scenes voice-over -> Audio Editor -> wapas (Audio tracks panel mein "🎛 Audio Editor mein enhance").
4. DONE (C210): purana js/audio_editor.js rakha, label "✂ Segment Edit" (per-segment edit + ripple + fit); naya 🎛 Audio Editor alag.
5. DONE (C212): Audio Editor mein 🧱 Limiter + ⚖ Leveller.
6. DONE (C213): 🔈 Bass boost + 🎤 Vocal remover.
7. DONE (C214): Audio Editor mein SR dropdown + AAC (M4A) export (asli AAC encode sandbox mein untested -> Chrome checklist item 15).
8. DONE (C215): Video Editor reverse clip ki awaaz export mein ulti (preview mein abhi band).
9. DONE (C211): docs/CHROME_CHECKLIST.md (14 check). User ke FAIL results ek-ek fix karo; result na aaye to naye features.

## NAYA KAAM (user ne manga) — pehle docs/ROADMAP_SCENES_MERGE.md padho
User chahta hai Editor kholna na pade: Scenes mein hi (1) alag timeline tracks + transition/ripple/clip jodna, (2) video speed + clip awaaz, (3) audio fade + poora Audio Editor aur wahan se Scenes mein seedha bhejna, (4) export settings + file size (MB) dikhe.
Order: C216 = S1 export settings + size andaza -> S3 clip speed/awaaz -> S2 audio fade + Audio Editor seedha -> S4 free timeline (sabse aakhir, pehle design chunk).
Rules wahi: ek chunk = ek kaam, test + errors 0 + purane tests, poori zip + GITHUB_UPDATE + naya prompt, replies chhote Hinglish.

## Known limits
- Studio file:// par nahi chalta (GitHub Pages / local server). Bumpers export mein nahi; Scenes clip par stabilize nahi.
- Zip 136 MB (df_bg.wasm 34 MB): GitHub par poori zip upload mat karo, sirf GITHUB_UPDATE_*.txt wali files.

## Asli Chrome check baaki (sandbox mein nahi hota)
Video: AAC export, Whisper auto captions, MediaPipe AI bg, lamba export, asli bumper files. Audio: browser tests, asli recording par AI Enhance (user se asli audio lo).

## Naye feature ideas
Video: keyframes, GL transitions, streaming export, media embed (zip). Audio: draw() 2 frame mein.
