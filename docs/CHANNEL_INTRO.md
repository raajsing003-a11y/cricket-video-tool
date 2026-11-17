# CHANNEL INTRO (FIXED) — har video, har script mein

Rahul har video ki shuruaat isi tarah karta hai. Ye hamesha script ke SABSE PEHLE aata hai, har baar, bina badle.

## Teen hisse (har script mein, is order mein)
1. **FIXED intro (shabd-ba-shabd, badalna nahi):**
   नमस्कार दोस्तों! मैं हूँ युवराज, और आप देख रहे हैं 99 क्रिकेट न्यूज़।
2. **Is video mein kya hai (har video ka alag, 1-2 chhote vaakya):**
   इस वीडियो में हम बात करेंगे ... (sirf Fact Pack ki baatein; koi naya fact nahi).
   Agar khabar RUMOR ya REPORT hai to yahin bol do: "अभी सिर्फ रूमर है" / "खबरों के मुताबिक".
   Ye lines hook ka kaam bhi karti hain: dilchasp, par jhoothi umeed nahi.
3. **Shuru karne ki line (fixed):**
   तो बिना देर किए, शुरू करते हैं।

Uske baad poora script (hook/khabar/twist/.../CTA) jaisa hamesha.

## Niyam
- Fixed intro (hissa 1 aur 3) mein ek shabd nahi badalna; ye "naya fact" nahi maana jaata.
- Hissa 2 mein source ka naam nahi, team ka short form nahi, rumor ko pakka nahi.
- Hissa 2 mein wahi cheezein jo script mein aage aane wali hain (jo aage nahi aayengi, uska wada mat karo).
- Teeno hisse ek hi chunk ka hissa hain, alag nahi (ek video = ek script = ek chunk).
- Lambai: ye ~35-45 shabd (10-12 second) hai, 600-750 shabd ke script mein jodo.
- Wording badalni ho to sirf is file mein badlo; Gemini message aur check dono isi se chalte hain.

## Tool mein (scenes)
- Pehle ~6 second (fixed intro) ke liye presenter card: tool mein **🎬 Standard intro jodo** button (player ke neeche). Pehli baar presenter scene bana kar photos lagao, phir **⭐ Standard intro save** dabao; uske baad har video mein ek click.
- Uske theek baad ek "is video mein" preview scene (hook ya watch card, 4-6 second) — script ke hissa 2 ke hisaab se.
- scenes.json mein presenter scene NAHI banana (photo ids pata nahi hote); Rahul load ke baad button dabata hai. JSON mein pehla scene preview wala hi rakho aur `chunk` sab 1.
