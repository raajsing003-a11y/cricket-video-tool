# 🎬 Video Editor (video_editor.html) — C201

Cricket tool ke andar ek alag, standalone, offline video editor page. Main tool (index.html) se nav mein "🎬 Video Editor"; editor mein "← Video Tool" wapas.
Main tool = cards/scenes banata hai (export MP4). Ye editor = us MP4 / apni clips ko edit karne ke liye (timeline, trim, captions, chroma, export).

## Kya-kya hai
- Multi-track timeline: trim, split (S), ripple delete, snap, undo/redo, copy, Ctrl+D, right-click menu
- Import video/audio/image (drag-drop), media bin, canvas preview
- 15 transitions (fade, dip, push, wipe, iris, zoom, flip...)
- Text + captions (Hindi ok), SRT/VTT import, SRT export, shabd highlight
- Auto captions (Whisper, CDN + model download ~120-586 MB, pehli baar), Whisper JSON import
- Chroma key (green/blue, eyedropper), Background removal (Auto offline, AI = MediaPipe CDN)
- Speed 0.1-8x, reverse, ramp, stabilization
- Audio: volume/fade/mute, track volume, auto-duck, waveform, level meter
- Export MP4 (H.264/AAC) + WebM, 360p-1080p, 24/30/60 fps, 16:9 / 9:16 / 1:1 / 4:5
- Project Save/Open (.json, media naam se relink), autosave, Templates (Intro, SUBSCRIBE end card, Lower third)
- Shortcuts: Ctrl+S/O/E, ? help

## Test (playwright + chromium)
`python tools/video_editor_tests/test_chunk2.py` ... `test_chunk15.py` (chunk4 ko /tmp/test_i.png + test_i2.png chahiye). C201 mein tool ke andar chale: 2,4,5,7,9,11,13,15 pass, errors 0; main tool ↔ editor nav round-trip OK.
NOT tested: asli Chrome par AAC export, Whisper model, MediaPipe AI background (sandbox mein network nahi).

## Baaki / idea
asli Chrome check, reverse audio export, keyframes, GL transitions, lambe project ke liye streaming export, media embed (zip).
Reference: docs/VIDEO_EDITOR_TRACKER.md, VIDEO_EDITOR_FEATURE_INDEX.md, VIDEO_EDITOR_CATALOG.md (GitHub repos + license).

## C202: Studio (ek hi tool)
studio.html kholo (index.html http par apne aap yahin aata hai). Tabs: 🎞 Scenes | 🎬 Editor. Scenes banao -> "➡ Editor mein bhejo" -> timeline mein live clip (voice-over ke saath). Scenes badlo -> Editor mein "↻ Scenes". Sirf GitHub Pages/local server par (file:// nahi). C203: intro/outro bumpers bhi Scenes clip ke andar aate hain.
