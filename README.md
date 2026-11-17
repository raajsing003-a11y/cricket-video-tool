# Cricket Video Tool

HTML video-maker (news-channel style) — kisi bhi cricket video ke liye. Sirf tumhari voice-over, baaki cards/transitions/captions/export tool karta hai.

**Chalane ke liye:** docs/GITHUB_GUIDE.md (GitHub Pages, ek baar setup).

## Kya-kya hai
- Cards: hook, title, stat, retain, watch, rumour, anth, intro, presenter (apna green-screen cutout + naam wala intro)
- Transitions: grunge, zoom, whip, glitch, flash, slideup, fade, cut
- Finishing layer (polish.js): punch zoom, handheld drift, smoke, light leaks, embers, vignette, grain, light sweep, fade in/out
- 🖼 Photos library: 97 player slots + apne naam (player / koi bhi photo type), naam se save, reuse, Backup/Restore; Scenes mein har photo ka naam aur ✓/✗ status, 🎬 Scene editor (JSON save/load), 📝 Captions, 🎚 Audio tracks + mic
- ✔ JSON check (scenes.json load par auto; docs/SCENES_JSON_SCHEMA.md)
- 🎤 Teleprompter (teleprompter.html: dark full-screen script, size/scroll, record; docs/TELEPROMPTER.md)
- 📰 News tracker (news.html, har 3 ghante auto, docs/NEWS_TRACKER.md)
- ✨ Polish ON/OFF button (player ke neeche)
- ⚡ Fast export MP4 (WebCodecs) + ⏺ Real-time export (fallback)

## Files
index.html, js/ (code), assets/ (graphics), docs/ (TRACKER.md, layout, asset library, GITHUB_GUIDE.md)

Status: C0-C18 + C22 + C24 done. Aage ka kaam: 00_START_HERE.md aur docs/TRACKER.md ("Chunk queue v2").
