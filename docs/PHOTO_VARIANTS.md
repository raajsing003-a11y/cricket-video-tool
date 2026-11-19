# C173 — Ek player ki kai photos + auto-rotate + Cameo
- 🖼 Photos panel: jis player ki photo upload ho chuki, uski row ke neeche "➕ aur photos" (ek saath kai select kar sakte ho). Har photo ✕ se hat sakti hai.
- Scenes JSON mein kuch nahi badalna: wahi slot id. Jis scene mein player pehli baar aaye -> 1st photo, doosri baar -> 2nd, teesri baar -> 3rd ... (khatam hone par dobara 1st).
- 👤 Cameo ON/OFF (Polish ke saath): scene ke text mein uploaded player ka naam ho (hindi/english/surname) aur scene mein uski photo na ho -> corner mein animated player card (naam ke saath). Alternate left/right. Cameo bhi rotation mein count hota hai.
- Kisi scene mein cameo nahi chahiye: data mein "noCameo":true. cta/presenter scenes mein cameo nahi aata.
- Backup/folder save mein variants "slot#2" naam se jaate hain, restore par wapas aa jaate hain.
- Code: js/photo_variants.js (photos.js mein sirf 1 line badli).

## C174 upgrade
- Ek scene mein 2 players ka naam ho to 2 cameo cards (left + right).
- Scene 7s+ ka ho to beech mein flash ke saath player ki agli photo aa jaati hai.
- Gold glow, shimmer sweep, halka float, red name-tag slide-in.
