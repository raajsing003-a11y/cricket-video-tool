# 02 Tool Plan

## Roz ka chakra
1. Tool: aaj ki badi khabar (Confirmed/Rumor label ke saath).
2. User topic batata hai -> Claude web search se Fact Pack banata hai (F1, F2... + source links).
3. Claude chunks banata hai: 4-5 chunks (har ~200-250 shabd = ~1.5-2 min). Har chunk ke saath: video title, chunk number, pichle chunk ki aakhri line, numbered facts.
4. User Gemini mein ek baar master prompt (03 file) paste karta hai, phir chunks ek-ek.
5. User rewritten chunks Claude ko wapas deta hai.
6. Claude check karta hai: skipped F-numbers, galat naam/number/date, naye jude facts, chunks ke beech flow. Phir final script jodta hai.
7. User "[APNI RAAY]" jagah 1-2 line apni bolta hai, voice-over record karta hai (har chunk alag audio).
8. Video maker tool audio + cards + captions se video banata hai.
9. Thumbnail text (3 options), title (5 options), description (chapters + source links), Short script (30 sec) - Claude/tool.
10. User upload karta hai. Checklist: khabar dobara check, photos/copyright, rumor line.
11. Hisaab: user Studio se views/watch time daalta hai; tool 4,000-hour progress aur video-type comparison dikhata hai.

## Phases
- Phase 1: News tracker (RSS se headlines, duplicate hatana, tags: Trade/Retention/Release/Auction/Team News/India Match, Confirmed/Rumor label, "Aaj ki top 5", Mark as used).
- Phase 2: Script outline template, thumbnail text, title, description, tags, source checklist.
- Phase 3: India match prediction kit (Dec se pehle; Sri Lanka series 13 Dec se). Pitch, squads, form, head-to-head, Playing 11 draft, comparison card (bina photo ke). Fantasy/Dream11 hissa nahi.
- Phase 4: Channel hisaab (upload streak, 4,000-hour progress bar, news vs prediction views).
- Phase 5 (baad mein): Shorts script, auction day live tracker.

## News tracker kaise banega (decision: GitHub tareeka)
- User ke paas GitHub account hai. Python PC par installed hai ya nahi pata nahi.
- GitHub Actions har ~30 min mein script chalayegi -> news.json; GitHub Pages par index.html dikhayega. Repo public hogi (sirf links, koi key nahi).
- Files: feeds.json, fetch_news.py, .github/workflows/news.yml, index.html.
- Sources: ESPNcricinfo, Cricbuzz, NDTV Sports, TOI, HT RSS; Google News RSS (keywords: IPL trade, retention, auction); official IPL/BCCI site; team official accounts.
- Limits: schedule thoda late ho sakta hai; "Mark as used" sirf us browser mein save hoga; AI script-outline abhi nahi (API key chahiye).
- Status: ABHI BANA NAHI.

## Video maker (user chahta hai: sirf voice-over, baaki editing automatic)
- Chrome mein chalne wala page (kuch install nahi). Har script-chunk ka voice-over alag audio; tool har chunk ke liye cards banata hai, audio ki lambai se timing set karta hai, captions script ke shabdon ko audio par baant kar lagata hai (1-2 sec aage-peeche ho sakte hain), music/intro/outro jodta hai, video file nikalta hai.
- Banne ka andaza: video ki lambai jitna time (8 min video ~ 8 min). Tool banane mein 1-2 hafte.
- Limits: sirf card/graphics look; match footage/IPL-BCCI clips nahi.
- Khatra: har video ek jaisa dikhe to YouTube "repetitive/mass-produced" maan sakta hai. Isliye 3-4 alag layout, apni awaaz/raay, optional 5-10 sec chehra wala intro.
- Jab tak tool tayyar nahi, pehle 5-7 video simple editing se upload karo (deadline mid-Jan).
- Status: sirf demo (demo_video.html) bana hai. Look user ko dikhaya, feedback abhi baaki.

## Image library (user ki request)
- Har image ke saath tag (player/team), source, license, credit. Video mein tag aate hi image card mein.
- Status rang: hara (khud ki / free license jaise Wikimedia Commons), peela (license pata nahi), laal (news site/Google se). Export se pehle peele/laal par warning. Hari images ka credit description mein auto.
- Library browser mein save (IndexedDB), baar-baar upload nahi.
- Default safe pack (Claude banayega): har IPL team ka rang+short-name card (asli logo nahi), jersey-number wala silhouette avatar, stadium/trophy/trade icons.
- Editing (look ke liye): crop, zoom, brightness/contrast, team-color duotone overlay, border/glow, blur. Claude ne user ko saaf bataya: edit karne se copyright nahi hatta; editing ko claim se bachne ke tareeke ke roop mein nahi banaya jayega.
- Status: plan; user ne abhi jawab nahi diya ki photos kahan se layega.

## Open questions
1. Photos zyadatar kahan se aayengi (Wikimedia/free, Google/news, khud ki)?
2. Demo ka look pasand aaya? Kya badalna hai (rang, text size, card style)?
3. Python PC par installed hai? (nahi to GitHub Actions wala tareeka ya proxy wala)
4. Pehla test topic kaunsa (IPL 2027 trade/retention, ya India vs Sri Lanka preview)?
5. Monetization kyon hata tha (Studio email/Content tab check)?
6. Pehle video kis editor mein banate the (CapCut/Premiere/...)?

---
## UPDATE (16 Nov 2026, chat 1 ka ant)
- Pehla test topic chun liya gaya: IPL 2027 retention preview (ipl_retention_video/).
- Competitor analysis (05, 07) aur Gemini prompts v2 (06, 08) taiyaar. Purana 03 prompt superseded.
- Open questions 1 (photos), 2 (demo look), 3 (Python), 5 (monetization), 6 (editor): abhi jawab nahi mila.
- News tracker aur video maker: abhi bane nahi.
