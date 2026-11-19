# NEWS PAGE — BAAKI KAAM (19 Nov 2026, C154 tak sab ban chuka)

Rahul ne kaha: "Ye sab kaam zip mein rakho". Neeche sab suggestions detail ke saath; kaam Rahul ke kehne par hi uthao (ek-ek ya jo wo bole). Order meri salah ka hai.

## Ban chuka (dobara mat banana)
- C156 Top-N multi-story | C157 story note | C158 E1 📷 Photo dhundho | C159 E2/E3/E4 🧩 Sites padho (extension v1.1) — docs/TRACKER.md
- C147 ek copy button | C148 📋 Copy (poora prompt): Fact Pack + script + Gemini message + scenes JSON
- C149 ✅ Ab Official ho gaya + 🔄 Nayi update badges | C150 🛠 Kaam steps (1 Script / 2 Gemini / 3 JSON)
- C151 📋 Sirf ye (ek article ka prompt) + 4 official feeds (BCCI/IPL/ICC/teams) + fetch_news.py label fix
- C152 jis site ki post nahi uska ↗ button (10 sites ke cricket news page)
- C154 🔎 khoj (har missing site par story ke shabdon ka Google site: search) + ⬆⬇ Backup (used + steps + baad mein, purani file bhi load)
- Top 5 stories, Trending, Naya, Baad mein, Used list save/load pehle se the.

## BAAKI (order: 1, 2, 3 pehle)
1. ~~Missing site par seedha khoj~~ — BAN GAYA (C154)
2. ~~BAN GAYA (C156)~~ **Kai stories ka ek video (Top 5 / list)**
   Card par ☑ tick; 3-5 stories chuno; ek button se EK prompt jisme sabki headlines/pack hon, format 'A: aaj ki top 5' (docs/GEMINI_SCRIPT_PROMPT_TEMPLATE.md mein FORMAT A pehle se hai). Steps/Use ho gaya sab chuni stories par lage.
3. ~~Used list + Steps ka backup~~ — BAN GAYA (C154), note (4) banne par usi backup mein jodna
4. ~~BAN GAYA (C157)~~ **Story par apna chhota note**
   Card par ek line (jaise 'kal 6 baje', 'angle: Shami ki entry') save ho, localStorage + backup file mein jaye.
5. **Telegram alert**
   Jab 3+ sites ek nayi story chhapein to Telegram message. Rahul ko BotFather se bot banana padega (token + chat ID), GitHub secrets mein daalna. scripts/fetch_news.py har run par naya trending check karke message bheje; pehle bheji story dobara nahi (news.json mein flag). Workflow news.yml mein secrets env.
6. **Aliases tune**
   Jab galat headlines ek card mein judein ya ek khabar do card mein bikhre: Rahul wo headlines bheje, tab feeds.json 'aliases' (team short form / Hindi naam -> English) aur fetch_news.py same_story rules theek karo. Bina example ke mat badlo.

## Rahul ne abhi tak nahi kaha, par pata rakho
- Asli news.json par ye test NAHI hue: official feeds ke result (Google News mein sab team/board site indexed nahi), source-naam pehchan (SITES regex), city hint. Pehli Run ke baad Rahul ke screenshot dekho.
- Team sites ke domain yaad se likhe (feeds.json): ek-do galat ho sakte hain (jaise sunrisershyderabad.in).
- Naya kaam shuru karne se pehle docs/TRACKER.md ka aakhri C-entry padho; har chunk ke end mein COMPLETE zip (agla chunk number) + PROMPT_NEXT_CHAT.md update.

## Extension (Photo Finder) — Rahul ne kaha: 'extension ko bhi use karo aur advance banao'
photo_finder_extension/ zip ke bahar hai (00_START_HERE.md, C44; repo mein bhi nahi). C154/C155 mein Rahul ne ise news kaam ke saath use + advance karne ko kaha par uska folder zip mein nahi tha. **Pehle Rahul se folder/zip mango** (README.txt, manifest.json, js files). Uske bina kuch badalna mat (tod sakta hai).
Folder milne par plan (Rahul ke kehne par, ek-ek):
E1. **Story -> photo khoj**: news card par '📷 Photo dhundho' button: story ke khiladi/team ke naam extension ki photo-khoj queue mein bhejna (extension ka C44 'khaali sab auto queue' tareeka dekho). Naam headline se (aliases wale English naam) nikalo.
E2. **Site checker**: extension Rahul ke browser mein hai, isliye 10 sites ke search page (🔎 wale Google site: link ya site ka apna search) background mein padh sakta hai (CORS nahi rukta). Har missing site par 'is story ki post mili / nahi mili' + link news.html ko wapas bheje (content script postMessage ya localStorage). Phir card par 🔎 ki jagah seedha 'mili ✔ / nahi ✖'.
E3. **Seedha headlines padhna**: jis site ki Google News feed mein post nahi aati, extension us site ke cricket page se latest headlines padh ke news.html mein extra source ke taur par de (same story-cluster mein judein). Source naam SITES array ke naam se milao.
E4. **Official check**: BCCI / IPL / team site ke news page extension se padh ke Confirmed ke saath jodna (feeds.json ke official feeds khaali aayein to).
E5. **Photo Finder khud**: scenes JSON ke photo slots ki list se batch queue (Claude 'ye slots banao' list deta hai: NEWS prompt STEP 3), better query, badi/saaf image chunna, **photo license tracking** (pehle postponed tha: kaun si photo kahan se, kab).
Dhyan: extension 'repo mein NAHI jaata' wala niyam rakho; usme koi token/secret mat daalo; Chrome 'Load unpacked' install; naye permissions kam rakho (sirf in 10 sites + news.html ka host).
