# Roadmap: Scenes tab mein Editor ke kaam (user ne manga, 23 Nov 2026) — SIRF PLAN, abhi koi code nahi

User ka maksad: Studio mein "Scenes" aur "Editor" alag kyu; Editor kholna na pade. Scenes mein hi ye sab chahiye:
1. Neeche wali alag timeline: Video 1/Video 2/Audio/Text tracks, Transition, Ripple, Snap, video+audio clip kahin bhi jodna.
2. Video speed (aur Reverse), jodi hui video clip ki awaaz chalu.
3. Audio: fade in/out + poora Audio Editor; Audio Editor mein edit karke seedha Scenes mein bhejna.
4. Export settings (quality/size) + export se pehle file size (MB) dikhe.

## Pehle se maujood (dobara mat banao)
- Scenes: Split/Duplicate/Delete, "➕ Video yahan" (js/clip_insert.js, clip = scene, awaaz mute: card_clip.js), Segment Edit (js/audio_editor.js), Music (js/music_bed.js, duck), Intro/Outro bumpers, "🎚 Audio tracks" panel (js/audio_tracks.js).
- Audio Editor -> Scenes wapas: C209 (AT.replaceMix, "↩ Scenes ko bhejo", "↩ Purani audio"). Ye Studio mein hi chalta hai (iframe + STUDIO.fromAudio). Isse aur seedha/aasaan banana (S2).
- Editor: video_editor.html (transitions 15, ripple, snap, speed/reverse/ramp, chroma, captions, audio mix, export). Scenes ke andar nahi.
- Export abhi: js/export_fast.js video bitrate fixed 12e6, audio 192e3 (js/export.js MediaRecorder 12e6). 114s video ~165 MB.

## Chunk queue (is order mein; har chunk: test + errors 0 + purane tests + zip + GITHUB_UPDATE + prompt)
S1 Export settings + size andaza (1 chunk) — DONE C216
 - Scenes Export mein: Quality (Chhoti ~4 Mbps / Madhyam ~8 / Badhiya 12), Size (720p/1080p; Short 9:16 ka dhyan), shayad fps.
 - Live label "≈ XX MB" = (videoBitrate+audioBitrate)*duration/8 (+ ~3% container), "andaza +-20%".
 - export_fast.js (opts.bitrate) aur export.js dono par lagao; default Badhiya (purana jaisa).
 - Test: label sahi (dur x bitrate), asli export size andaze ke paas (headless chromium), regression export tests.
S3 Video clip speed + awaaz (1 chunk) — DONE C217 (js/clip_speed.js)
 - card_clip.js / clip_insert.js: scene.data.clip mein speed (0.25-4x), reverse, volume; clip ki awaaz voice-over ke saath mix (ducking optional).
 - Scene ki lambai speed ke hisaab se. Preview + export dono. Reverse awaaz: video_editor.html mixAudio (C215) ka tareeka dekho.
S2 Audio: fade + Audio Editor seedha (1-2 chunk) — S2a fade DONE C218; S2b Audio Editor overlay DONE C220 (S2 poora)
 - Voice-over/music ke fade in/out sliders Scenes mein (audio_tracks.js / music_bed.js; music mein fade out pehle se).
 - Audio Editor ko Scenes ke andar panel/overlay mein kholna (iframe tools/audio_editor.html?embed=1 pehle se Studio Audio tab mein) + "Edit karke Scenes mein bhejo" ek click, tab badle bina. Wapas aane par Scenes ka position wahi.
 - Audio Editor mein ye sab already: Best, AI Enhance, Anchor, Leveller, Limiter, Bass, Vocal, LUFS, Multitrack (C212-C214). Preset (save/chain) ka idea: neeche "Pending ideas".
S4 Scenes mein free multi-track timeline (bada, 4-6 chunk) — sabse aakhir mein
 - Dikkat: Scenes ka model = scene cards (script se auto), Editor ka model = clip(media,start,len). Dono alag. Seedha copy nahi chalta.
 - Rasta (sujhav): Scenes ke neeche ek "overlay timeline" (Video 2/Audio/Text lanes) jo scenes ke upar clips rakhe; Transition + Ripple scenes ke beech; export mein composite. Pehle design chunk (kaam ka scope + data model) likho, phir banao.
 - Ya "➡ Editor mein bhejo" ko seamless banana (ek click, wapas aane par wahi scenes, Editor ka kaam Scenes export mein) — S4 ka sasta vikalp.

## Pending ideas (user ne abhi nahi manga, poochne par)
- Audio Editor Presets — DONE C219 (user ne manga).
- Video: keyframes, GL transitions, streaming export, media embed zip; reverse clip ki awaaz preview mein.
- Asli Chrome checks: docs/CHROME_CHECKLIST.md (16 item) — user ne abhi nahi chalaye.
