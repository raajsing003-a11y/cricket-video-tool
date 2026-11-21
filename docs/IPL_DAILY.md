# IPL DAILY VIDEO (C189) — roz ek nayi IPL video, khabrein kabhi repeat nahi

## Kahan hai
news.html ke upar, "🏏 IPL Daily Video — खबर मैदान की" wala purple box.

## Kaise chalta hai (roz 3 click)
1. news.html kholo -> 🔄 Abhi fetch karo (taaza khabrein).
2. Purple box mein dekho aaj kaun si stories aayengi: "Poori stories" (default 6) + "Fast headlines" (default 8). Chaho to dropdown se kam/zyada karo.
3. 📋 Aaj ka IPL video prompt copy -> Claude chat mein paste. Baaki kaam pehle jaisa (Fact Pack -> Gemini chunks -> final script -> JSON).

## Repeat kyun nahi hota
- Copy karte hi (checkbox ON ho to) saari chuni stories "use ho gayi" mark ho jaati hain (cvt_news_used + cvt_ipl_daily log).
- Agli baar sirf wahi stories aati hain jo pichhle 48 ghante ki hon aur kisi video mein use na hui hon.
- Agar use ho chuki story par NAYI post aa jaye to wo 🔄 nayi update ke naam se wapas aa jaati hai.
- Galti se copy ho gaya? "↩ Aakhri batch wapas" dabao.
- Prompt mein pichhle 3 din ke IPL video ki titles "DOHRAANA NAHI" list mein jaati hain.
- Backup save/load mein IPL log bhi jaata hai.

## Script ka intro (har IPL video)
1. SHOCKING SAWAAL-HOOK: 4-6 chhote sawaal, aaj ki khabron se. Jaise: क्या यशस्वी छोड़ेंगे राजस्थान? / किस टीम में मची हलचल? / कौन बनेगा मुंबई का कप्तान? / कोलकाता में क्या हुई गड़बड़?
2. FIXED: नमस्कार दोस्तों! मैं हूँ युवराज, और आप देख रहे हैं खबर मैदान की।
3. FIXED: तो बिना देर किए, शुरू करते हैं।
Sawaal sirf sawaal rahenge (rumor ko pakka bayan nahi), aur jis sawaal ka jawab video mein nahi aayega wo nahi likha jaata.

## Kaun si story IPL maani jaati hai
Tag Trade/Retention/Release/Auction, ya headline mein IPL / आईपीएल / mini auction / kisi IPL team ka naam, ya IPL sheher (agar story India Match tag ki nahi). Sirf India-match ki khabar nahi aati.

## feeds.json mein naye 4 feed
IPL all (1d), IPL captain/squad/coach (1d), IPL franchise news (1d), IPL Hindi daily (1d). Live check Rahul ki pehli Actions run mein baaki.

## Code
news.html: drawIpl / iplPool / iplPrompt / iplMark / iplUndo (C189 comment se dhundho). Localstorage: cvt_ipl_daily, cvt_ipl_cfg.
Test: headless chromium, 12 nakli headlines — filter, prompt, mark, reload, undo sab theek, console errors 0.
