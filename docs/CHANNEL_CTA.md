# CHANNEL CTA (FIXED) — har video, har script mein (C46)

Har script mein Like / Subscribe / Comment ki lines FIXED hain, har baar apne aap aati hain. Rahul ko alag se nahi bolna.

## Do jagah (script mein)
1. **BEECH ka CTA (Like + Subscribe)** — script ke lagbhag beech mein, kisi khabar/hisse ke khatam hone par (jahan baat naturally ruke). Ek hi baar, shabd-ba-shabd:
   अगर अब तक का वीडियो पसंद आ रहा है, तो लाइक का बटन दबाइए और चैनल को सब्सक्राइब कीजिए।
2. **AAKHIR ka CTA (Comment + Like + Subscribe)** — script ke bilkul aakhir mein (anth ke sawal ke baad), shabd-ba-shabd:
   आपकी इस बारे में क्या राय है? कमेंट में ज़रूर बताइए। और ऐसी हर खबर सबसे पहले पाने के लिए लाइक करें और चैनल को सब्सक्राइब करना न भूलें। धन्यवाद!

## Niyam
- Dono lines mein ek shabd nahi badalna; ye "naya fact" nahi maani jaati.
- Beech wali line kisi sentence ke beech mein nahi, hisse ke beech ke natural break par.
- Purani alag "like/share/subscribe" line ab nahi; aakhir ka CTA yahi hai (anth ke sawal waise hi rahenge).
- Lambai ~55 shabd zyada; 600-750 ke script mein jodo.

## Tool mein (slides)
- `cta` card: mode `like` (beech: Like + Subscribe icons) aur mode `end` (aakhir: Like + Comment + Subscribe icons).
- scenes.json mein Claude dono slides JSON mein DAAL SAKTA hai (photo nahi chahiye): beech ke break par `{"type":"cta","dur":4,"data":{"mode":"like"}}` aur sabse aakhir mein `{"type":"cta","dur":5,"data":{"mode":"end"}}`, `chunk` 1.
- Agar JSON mein nahi hain to tool ka **📣 Like/Comment/Subscribe slides jodo** button (player ke neeche) dono khud jod deta hai (beech mein + aakhir mein). Pehle se hon to dobara nahi jodta.
- Baad mein slide ko script ki CTA line ke saamne ⏱ fit / drag se baitha do.
