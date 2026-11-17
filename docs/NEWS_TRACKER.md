# NEWS TRACKER (C22)

Khabrein apne aap jama karta hai (har 3 ghante, GitHub Actions) aur `news.html` page par dikhata hai. Tool ke video ka hissa nahi hai; roz ka chakra ka step 1 ("khabar chunna") isse aasaan hota hai.

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
