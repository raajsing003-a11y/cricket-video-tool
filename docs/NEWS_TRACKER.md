# NEWS TRACKER (C22)

Khabrein apne aap jama karta hai (har 1 ghante, GitHub Actions) aur `news.html` page par dikhata hai. Tool ke video ka hissa nahi hai; roz ka chakra ka step 1 ("khabar chunna") isse aasaan hota hai.

## Files (sab cricket_video_tool/ ke andar, yani repo ke root par)
- `feeds.json` — kaun si feeds, tag keywords, rumor words, blocked words
- `scripts/fetch_news.py` — fetcher (sirf Python standard library)
- `.github/workflows/news.yml` — schedule (har 3 ghante) + haath se Run
- `news/news.json` — output (bot khud likhta hai)
- `news.html` — page (index.html se bhi link hai)

## Ek baar setup (GitHub Pages wale repo mein)
1. Is zip ke `cricket_video_tool/` ke saare files (hidden `.github` folder samet) repo mein upload karo. `.github` folder dikhe nahi to upload mein folder poora drag karo.
2. Repo > Settings > Actions > General > Workflow permissions = **Read and write permissions** (Save).
3. Repo > Actions tab > **news-fetch** > Run workflow. 1-2 min baad `news/news.json` bhar jayega.
4. `https://<naam>.github.io/<repo>/news.html` kholo.

Pehli Run mein dekho page par "feed fail" ki lal line to nahi. Fail wali feed ko `feeds.json` mein `"enabled": false` karo ya URL theek karo. (Ye feeds sandbox mein internet na hone se live test nahi hui, sirf local sample feeds se test hui hain.)

## Page kya karta hai
- **⭐ Aaj ki top 5**: pichle 36 ghante ki, abhi tak use na hui khabrein. Score = tag ka vazan (Retention/Release 5, Auction/Trade 4, India Match 3, Team News 2) + kitni alag jagah chhapi (+2 har extra jagah) + Confirmed (+3) + taazgi (3 tak). Ek story ki milti-julti headlines ek hi gina jaata hai.
- **Tags**: Trade, Retention, Release, Auction, Team News, India Match (keywords feeds.json mein badal sakte ho). Koi na mile to Other (sirf "Sab" mein dikhta hai).
- **Label**: ✔ Confirmed sirf jab feed `"official": true` ho aur title/summary mein "reportedly, likely, sources, सूत्र, संभावित" jaisa shabd na ho. Baaki sab ❓ Rumor / अपुष्ट. Ye sirf andaza hai, video mein daalne se pehle khud verify karo.
- **✓ Use ho gaya**: khabar ko used mark karta hai (is browser mein save). "Use ho chuki chhupao" se list saaf. **⬆ Used list save / ⬇ load** se doosre device par le jao.
- **📋 Copy**: `[tag] [label] headline — link` copy hota hai (Fact Pack ke liye).
- Khoj + tag/label filter.

## Niyam (jo yahan lage hain)
- Sirf headline, chhota summary aur link. Naye facts nahi bante.
- Fantasy/Dream11/betting wali khabrein `blocked_words` se chhant di jaati hain.
- Photos web se download nahi hoti.
- Source ka naam sirf tumhare dekhne ke liye is page par hai; script/cards mein source naam nahi aayega.
- Khabren 14 din (max_age_days) tak rehti hain.

## Local chalana (optional)
`python scripts/fetch_news.py` (internet chahiye). Phir folder mein `python -m http.server` chalake `http://localhost:8000/news.html`. (file:// se page nahi chalta.)

## Aage ke sudhaar (jab bologe)
Official sites (BCCI/team) ki RSS feeds jodna, Hindi feeds badhana, tag keywords tune karna.

## Site feeds (C141)
Cricbuzz, ESPNcricinfo, TheSportsTak, News18, Times of India, India Today, Hindustan Times, CricTracker, NDTV Sports, Sportskeeda — in 10 sites ki khabrein ab `feeds.json` mein "Site: ..." naam ki feeds se aati hain (Google News `site:` query, har ek `when:2d`). Wajah: in sites ke seedhe RSS links ya to hain nahi ya badalte rehte hain; Google News ki RSS har site ke liye chalti hai. Link Google ka redirect hota hai jo asli article par khulta hai. Label sab par Rumor rehta hai (official nahi). Koi site na chahiye to uski feed mein `"enabled": false`.

## Story-wise grouping (C142)
Page ab **ek story = ek card** dikhata hai: 10 sites ki milti-julti khabrein ek saath, har site ki apni headline + link. Video banane ke liye: story par **📋 Story pack copy** -> Claude ke Fact Pack chat mein paste (verify + EK poora script).
- Filters: tag, label, **2+/3+/4+ sites**, **site chips** (har site ki kitni stories), kram (naya pehle / zyada sites pehle), khoj, used chhupao.
- Grouping `scripts/fetch_news.py` karta hai (title ke shabd milte-julte, 72 ghante ke andar). Alag teams ki khabar kabhi ek nahi hoti.
- `feeds.json` ke `aliases` mein team short form (RR, LSG, CSK...) aur Hindi naam (शमी, राजस्थान...) -> English shabd hain, taaki alag site/bhasha ki headline judein. Naya naam jodna ho to ek line badhao; `""` = shabd ignore.
- Galat jod ya bichhdi hui story dikhe to headline note karke batao; rules tune honge.
- Update ke baad GitHub mein news-fetch ek baar Run karo.

## 🔄 Abhi fetch karo button (C143)
news.html par **🔄 Abhi fetch karo**: GitHub ko "news-fetch chalao" bolta hai, phir har 10 sec check karta hai aur naya data aate hi page khud bhar jaata hai (1-3 min; Pages update mein kabhi 5-6 min).
**Ek baar token banao** (sirf aapke browser mein save hota hai):
1. GitHub > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** > Generate new token.
2. Repository access: **Only select repositories** > cricket-video-tool. Permissions > Repository > **Actions: Read and write**. Expiration jo chaho. Generate, token copy karo.
3. news.html par **🔑 Token** dabao, paste karo. Har device/browser par ek baar.
Token kisi ko mat do. Kahin leak ho to GitHub mein delete kar do. Token sirf is repo ke Actions chala sakta hai.

## Tez + advance (C145)
- Fetch ab parallel hai (saari feeds ek saath) + retry, to Run jaldi khatam hota hai. `news.json` mein `feed_secs` dikhata hai kaun si feed dheemi hai.
- **🔥 Trending**: pichle 3 ghante mein 3+ alag sites ne ek hi story chhaapi (abhi garam khabar). **🆕 Naya**: aapki pichli visit ke baad aayi. **☆ Baad mein**: video ke liye side mein rakho. Teeno ke filter 'Sirf:' row mein.
- Page khula rahe to har 3 min khud naya data le leta hai.

