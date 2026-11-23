# TRACKER (har turn update)
Status: Chunk 0-13 DONE (plan poora). RULE (har chunk): design achha + speed fast, koi lag nahi. Agla: koi bhi extra (neeche "Baad ke idea").
| Chunk | Kaam | Status |
|---|---|---|
| 0 | Base padhna + inventory | DONE |
| 1 | Standalone video_editor.html skeleton + timeline UX (zoom, playhead, tracks) | DONE (test: tests/test_chunk1.py, errors 0) |
| 2 | Trim / split / ripple delete / snap (+undo/redo, copy, track move, right-click menu, ruler virtualized) | DONE (tests/test_chunk2.py: render 600 clips 37ms, errors 0) |
| 3 | Import video+audio+image, media bin (drag-drop/dblclick), canvas preview, play sync, trim clamp | DONE (tests/test_chunk3.py, errors 0) |
| 4 | Transitions: 15 canvas-2D (fade, dip black/white, push x4, wipe x4, iris, barn, zoom, flip), picker with live tiles, overlap model | DONE (tests/test_chunk4.py, errors 0) |
| 5 | Text + captions: text clips (7 look/anim options, Hindi ok), side panel, preview par drag, script->captions, SRT/VTT import, SRT export, shabd highlight | DONE (tests/test_chunk5.py, errors 0) |
| 6 | Auto captions: clip audio -> 16k mono, browser-whisper (CDN, model cache), Whisper JSON import (openai/whisper.cpp/HF), shabd-time captions | DONE (tests/test_chunk6.py mock engine; asli model network par test nahi hua, errors 0) |
| 7 | Chroma key: WebGL YCbCr keyer + CPU fallback, eyedropper, similarity/smooth/spill, Green/Blue presets, per-clip panel | DONE (tests/test_chunk7.py, errors 0) |
| 8 | Background removal: Auto (kinare ke rang + flood fill, offline) + AI (MediaPipe selfie segmenter, CDN, asli model test NAHI hua), kinara/feather/invert, chroma se exclusive | DONE (tests/test_chunk8.py, errors 0) |
| 9 | Speed 0.1-8x (chips+slider, ripple), Reverse (frame seek, awaaz band), 4 ramp presets, trim/split speed-aware, audio clips ke liye bhi | DONE (tests/test_chunk9.py, errors 0) |
| 10 | Stabilization: khud ka (160px SAD block-match + subpixel, camera path, gaussian smooth, auto zoom-crop), progress/cancel, source-time indexed (speed/split ke saath chalta hai) | DONE (tests/test_chunk10.py: shake 32px -> 0.7px, errors 0) |
| 11 | Audio mix: clip volume (0-200% boost), fade in/out, track volume, clip mute, Auto level (peak), live level meter, timeline waveform (peaks 50/s, speed/reverse/fade aware) | DONE (tests/test_chunk11.py, errors 0) |
| 12 | Export MP4 (H.264/AAC, fallback VP9/Opus) + WebM (VP9/Opus, khud ka mini muxer): frame-exact render (seek+preview pipeline), audio OfflineAudioContext mix (vol/fade/track/speed/ramp/transition), dialog (format+quality+progress+cancel), 1280x720 30fps | DONE (tests/test_chunk12.py: ffprobe+volumedetect, errors 0) |
| 13 | Project save/open (.json, media relink by naam), autosave (localStorage), dirty title + beforeunload, export size 360/480/720 + fps 24/30/60, shortcuts (Ctrl+S/O/E, Shift+arrows, End, M, +/-, ?), help dialog, missing-media guards | DONE (tests/test_chunk13.py, errors 0) |
Har chunk ke baad: Chromium (playwright) test, JS errors 0, tests/ mein script.

Extra DONE: WebM Cues (seek index, Chrome+ffmpeg seek test), 1080p export (720p preview ko bada karke, tests/test_chunk14.py).
Baad ke idea: asli 1080p render (preview canvas bada karna padega), reverse audio export, media proxy/lambe project ke liye streaming export, GL transitions, keyframes, project mein media embed (zip).

REGRESSION DONE (Chunk 15 turn): test_chunk2..14 sab pass, errors 0 (har test alag command). Fix: paused preview mein video 1 frame purana dikh sakta tha (seek threshold .04 > 1 frame) -> stabilize jitter flaky; threshold .012 kiya. test_chunk10 measure() ab frame-ready ka intezaar karta hai.

BACHA HUA KAAM (naye chat mein):
1. Asli Chrome mein check (sandbox mein network nahi): AAC export, Whisper auto captions (CDN + model), MediaPipe AI background.
2. Baad ke idea: asli 1080p render (preview canvas bada), reverse audio export, lambe project ke liye streaming export, keyframes, GL transitions, project mein media embed (zip).

CHUNK 15 (extra) DONE: asli 1080p render (RS render-scale, canvas logical 720 short side), canvas 16:9/9:16/1:1/4:5 (#asp, project mein 'asp'), clip Fill (c.fl, #k_fl, shape alag ho to auto), music auto-duck (tr.duck, tr.dv, duckEnv in gainOf), Templates (#tpl: Intro/End card SUBSCRIBE/Lower third, text style 'ul' underline). tests/test_chunk15.py PASS.
REGRESSION chunk 15 ke baad DONE: test_chunk2..15 sab pass. PENDING: asli Chrome check (AAC, Whisper, MediaPipe).

C215 (23 Nov 2026) — Reverse audio export DONE: mixAudio mein ulta (rv) clip ki awaaz ab export mein ulti aati hai (source span reverse buffer, speed ke saath; rv+ramp abhi band). Preview mein reverse clip ki awaaz abhi bhi band. Test: tools/video_editor_tests/test_reverse_audio.py (rising tone: forward 0.08->0.54, reverse 0.56->0.10, 2x ok, errors 0); regression chunk9/11/12 + studio + handoff pass.
BACHA (har ek alag chunk, bada kaam): keyframes, GL transitions, streaming export (lambe project), media embed (zip). Preview mein reverse awaaz.
