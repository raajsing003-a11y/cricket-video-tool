# C195 — Unified layout (Filmora + Classic ek mein)

Ab tool kholte hi ek hi layout aata hai (pehle Classic default tha). Filmora wala base (left rail, bada preview, neeche timeline) + Classic ke saare achhe features.

## Kya kahan hai
- Upar: nav (ek line, scroll hoti hai) + status + ⚡ Export (MP4) (progress yahin dikhta hai) + "Purana Classic" (puraane Classic par jaane ka link).
- Left: rail (Media / Scenes / Photos / Audio / Export). Scenes mein compact list: har scene ek row (number, type, headline, sec) + ↑ ↓ ⧉ ✕. Row click = scene chuno + seek. Laal = abhi chal raha. Neeche add/JSON/Chunk/Audio-fit buttons.
- Beech: bada preview + transport (⏮ ▶ ⏭, timecode, seek, "Scene 3/8 · type" chip, Undo, Redo, Safe zone).
- Right: 6 tabs — ⚙ Properties · 🎨 Look (Polish, Look, Cinema bars, Progress bar, preset, Zoom, Style list, Naya Style) · 🎬 Intro/Outro · 🔤 Text · 🎞 Video · 🗂 Kit. Aakhri tab yaad rehta hai. Shortcuts neeche band dabbe mein.
- Neeche: timeline (split, trim, drag, snap, audio, captions) — Filmora jaisa.

## Cinema bars
Ab HAMESHA OFF se shuru: har baar tool kholne par, har Look preset (📺 Studio mein bhi) aur Naya Style mein. Chahiye to 🎨 Look tab mein button se ON karo — wo sirf usi session ke liye hai, refresh par phir OFF.

## Files
- js/unified_shell.js (NAYA), index.html (script tag), js/filmora_shell.js (default layout, "Purana Classic" button), js/classic_shell.js (sirf ?layout=classic par), js/fx_pro.js + js/looks.js (bars off).
- Naya button kisi galat tab mein aaye to unified_shell.js mein groupOf() mein keyword jodo.

## Test (headless chromium 1366x768 + 1600x900, 8-scene JSON)
console errors 0; scene row click/chip, ↑↓⧉✕, Undo, 6 tabs, Export button panel kholta hai, Cinema bars ON karke reload par OFF, ?layout=classic purana chalta hai. NOT tested: asli Chrome mein MP4 export + audio.
