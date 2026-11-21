# Standard Intro / Outro chooser (C189b)

Button: **🎬 Intro/Outro chuno** (player ke neeche quick bar aur timeline tools mein, purple).

1. ⬆ PC se video add: kitni bhi intro/outro video ek saath. Chrome mein save rehti hain (🎞 Clips library, IndexedDB), har baar wapas milti hain.
2. "Intro chuno" tab: 👁 se dekho, ✔ Ye chuno. "Outro chuno" tab: wahi.
3. Intro mode (default): **Script ki line par** = intro video ek scene ban kar lagti hai, voice-over (मैं हूँ युवराज ... खबर मैदान की) upar chalta hai.
   Jagah: captions mein wo line ho to uske time ke paas ka scene boundary, warna pehle (teaser/hook) scene ke baad. Presenter intro ho to uski jagah.
   Lagane ke liye **🎬 Standard intro jodo** dabao (dubara dabane par wahi scene badalta hai, double nahi).
   Doosra mode: "Video ki bilkul shuruaat mein" = purana bumper (video ki apni awaaz ke saath).
4. Outro hamesha sabse aakhir mein judta hai (Fast aur Real-time dono export), video ki apni awaaz ke saath.
5. Choice localStorage 'cvt_std_bump' mein save.

Dhyan: line-par wale intro scene mein video ki apni awaaz nahi bajti (clip scene mute hota hai), sirf voice-over. Short 9:16 mein intro scene nahi lagta; wahan "shuruaat mein" mode chuno.
Zip cricket_video_intro_outro.zip (13 intro-type 8s + 20 outro-type 6s) Rahul PC se upload karega; repo mein nahi daali.

## C192 (21 Nov 2026) — Intro / Outro awaaz (volume) slider
- Chooser mein Intro tab aur Outro tab dono par 0-300% volume slider (100% = original, 0% = chup). Alag-alag save (localStorage 'cvt_std_bump': introVol, outroVol) aur BUMP item ke vol mein lagta hai; Fast + Real-time export + ▶ Poora preview teeno mein same volume.
- Script-line wale intro scene mein clip mute hai, isliye slider wahan band (disabled) dikhta hai; awaaz sirf "Video ki bilkul shuruaat mein" mode mein. Line-mode intro ki awaaz = pending (C194).
- Background music pehle se hai: 🎵 Music button (js/music_bed.js, C62): music volume -40..0 dB, voice par duck, fade out, loop, start offset.
