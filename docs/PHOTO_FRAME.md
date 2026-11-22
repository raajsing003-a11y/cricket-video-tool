# C200 — 🎯 Photo frame (crop/zoom khud adjust + face auto-detect)

## Kya karta hai
- Photo upload / restore / extension se aate hi face AUTO dhoondhta hai (background mein) aur photo ko 4:5 head-and-shoulders crop mein set karta hai: face beech mein (thoda upar), kandhe tak jagah. Chhota face (wide photo) ho to apne aap zoom.
- Crop SAB jagah lagta hai (cards, 👤 cameo, side fill) kyunki photo hi crop hoke aati hai. Original photo IndexedDB mein waisi hi rehti hai.
- Face nahi mila (cricket ball/ground/trophy ya side-face) -> photo waisi hi rehti hai, "❓ face nahi mila" ke saath; khud adjust kar sakte ho.
- Ek photo mein kai face ho to sabse pakka (bada) face chunta hai.

## Khud adjust kaise
- 🎯 button: (1) bar2 mein "🎯 Photo frame" = sab photos ka grid, filter (Sab / ❓ nahi mila / ✋ manual / 🙂 auto); (2) 🖼 Photos panel ki har row mein 🎯; (3) 🖼 Sab photos board ke har tile mein 🎯.
- Editor: photo ko pakad ke khiskao (upar-niche/left-right), scroll ya slider = zoom (chhota/bada), ⬆⬇⬅➡ chhote nudge, 🎯 Auto face (dobara), 🖼 Original (bina crop), ↺ Reset, "Cameo jaisa dikhao" (kinare fade preview). Peela oval = face yahan aana chahiye.
- ✅ Save = manual (✋) — ab auto detect ise kabhi nahi badlega.

## Technical
- js/photo_frame.js (index.html mein photo_board.js ke baad). Frame data localStorage `cvt_pframe` {slot: {ok|nf|m|off, cx, cy, z}}; cx,cy = window ka center (photo ka fraction), z = zoom (1 = sabse bada 4:5 window).
- Hooks: CORE.setPhoto (raw yaad rakhta hai, crop ki hui Image set karta hai), PHOTOS.set (nayi photo = purana frame reset), PHOTOS.remove.
- Backup/Restore JSON aur 📁 Folder save/load mein `frames` bhi jaate hain (photos.js).
- Face model: js/vendor/face-api.js (@vladmandic/face-api 1.7.15, MIT) + assets/face_models/tiny_face_detector_* (190 KB). Pehli zaroorat par load. Server/GitHub Pages par chalta hai; file:// par model fetch nahi hota (manual adjust phir bhi chalta hai).
- 🎯 Auto face: ON/OFF (manager mein). OFF = nayi photo par auto detect nahi.
- Kai face ho to: score >= 70% of best wale mein se sabse bada.

## Test (headless Chromium 153, webgl)
- Portrait (512x512), wide (1600x900, chhota face + helmet jaisa jhootha box), tall (800x1400): face teeno mein sahi, billi ki photo = "face nahi mila". Manual drag + Save, reload ke baad frame wahi. errors 0.
- NOT tested: asli cricket player photos (helmet/cap/side-face), 184 photos ek saath ki speed, asli Chrome par export.
