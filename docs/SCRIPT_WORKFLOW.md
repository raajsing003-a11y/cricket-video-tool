# SCRIPT WORKFLOW — Claude ke liye (script chat ka kaam)

Ye guide un chats ke liye hai jahan Rahul ke kisi ek video ka script banta hai.
TOOL-CHAT (code wala) ye kaam nahi karta (00_START_HERE.md niyam 9). Script chat mein PROMPT_SCRIPT_CHAT.md paste hota hai.

## Rahul ke script-niyam (kabhi mat todna)
1. EK VIDEO = EK HI POORA SCRIPT = EK HI CHUNK. Script ko 4-5 chunks mein mat todo. Final script hamesha ek hi code block mein do.
2. Script Devanagari Hindi, saral, bolne layak. Chhote vaakya (10-14 shabd).
3. Source ka naam script mein NAHI (Cricbuzz, ESPNcricinfo, IANS, PTI...). "khabron ke mutabik" / "reports kehti hain" bolo.
4. Team ke short form NAHI (LSG, RR, CSK, MI...). Sheher ka naam likho: Lucknow, Rajasthan, Chennai, Mumbai, Delhi, Kolkata, Hyderabad, Bengaluru, Punjab, Gujarat.
5. RUMOR par hamesha "abhi sirf rumor hai / pakki khabar nahi / संभावित". REPORT par "khabron ke mutabik". Sirf OFFICIAL ko seedha fact bolo. "Pakka/confirm/100%" sirf OFFICIAL ke liye.
6. Naye facts nahi. Sirf Fact Pack ke facts. Koi stat/number/quote apni taraf se nahi.
7. Fantasy, Dream11, betting, odds, giveaway kuch nahi. Kisi par taana/gaali nahi.
8. Rahul ko chhote simple Hinglish jawab chahiye. Lambe plan se wo confuse hota hai.
9. HAR script ki shuruaat docs/CHANNEL_INTRO.md ke teen hisson se: (1) "इस वीडियो में हम बात करेंगे ..." (is video ka teaser, 1-2 vaakya, sirf Fact Pack se) (2) fixed intro "नमस्कार दोस्तों! मैं हूँ युवराज, और आप देख रहे हैं 99 क्रिकेट न्यूज़।" (3) "तो बिना देर किए, शुरू करते हैं।" Phir baaki script. Fixed shabd mat badalna.

## Kaam ka order (har video)
1. KHABAR: Rahul news.html se khabar bhejta hai (title + Trade/Rumor label + link).
2. VERIFY: web search se khabar verify karo (kam se kam 2 alag searches: khabar ki + official confirmation ki). Aaj ki date dekho. Retention/trade deadline ho to official list/IPL advisory dhundho. Jo sources aapas mein ladte hon (numbers), wo Fact Pack mein mat daalo ya "[CHECK]" likho.
3. FACT PACK: 01_FACT_PACK.md banao. Har fact: F-number, label (OFFICIAL / REPORT / RUMOR), date, ek line. Source ka naam Fact Pack mein Rahul ke liye likh sakte ho, par script mein nahi jaayega. Trust meter 1-5 (ek line karan).
4. GEMINI MESSAGE: GEMINI_SCRIPT_PROMPT_TEMPLATE.md bharke EK HI message do (rules shuru mein + facts + aakhir mein "best se bhi best banao"). Alag se "pehle prompt paste karo" wala step nahi. Rahul ek hi baar paste karta hai, naye ya purane Gemini chat mein, dono mein chalta hai.
5. Rahul Gemini ka output wapas bhejta hai.
6. CHECK: neeche ki checklist se line-by-line check. Galtiyan theek karke FINAL script do (ek hi block) + 4-6 line mein "kya badla" batao.
7. Final script teleprompter.html mein jaata hai. Ek hi chunk, '---' nahi lagana. Rahul ek hi audio record kare ya apni suvidha se tukde kare.
8. Rahul ke kehne par: scenes.json (docs/SCENES_JSON_SCHEMA.md ke hisaab se), title/description (publish.html), thumbnail line. Scenes mein pehle "is video mein" teaser scene, uske baad ~6 sec fixed intro ke liye jagah (tool ka 🎬 Standard intro jodo button teaser ke baad presenter card lagata hai) (CHANNEL_INTRO.md).

## Check-checklist (Gemini output par)
- Koi NAYA fact/number/date/record? (jaise "chot se lautta", "10 crore ka dav", team ki position) -> hatao.
- Kisi OFFICIAL fact ko rumor bana diya? (jaise deadline date) -> sahi label.
- Kisi RUMOR/REPORT ko pakka bana diya ya "100%" laga diya? -> hatao.
- Gemini ne apni raay/khatra/fayda ka naya tark joda jo Fact Pack mein nahi tha? -> hatao ya "sambhavna hai" tak narm karo.
- Khaali "[APNI RAAY]" marker ya "[CHECK]" bacha? -> bharo/hatao.
- Source ka naam? Team ka short form? -> sahi karo.
- Khiladi ki dishaa ulti? (kaun kahan jaa raha hai) -> Fact Pack se match karo.
- "Use kiye gaye facts" jaisi meta lines? -> hata do.
- Script ki shuruaat CHANNEL_INTRO.md ke teen hisson se hai? Order: teaser -> fixed intro -> shuru karte hain? Fixed intro shabd-ba-shabd wahi? "Is video mein" line mein sirf wahi baatein jo aage aati hain, aur rumor/report ka label wahin bol diya?
- Hook intro ke turant baad (hissa 2 mein ya uske baad ki pehli 2 line mein) hai? Rumor/sambhavit baat pehle 30 second mein bol di gayi? Docs/CHANNEL_CTA.md ke FIXED CTA (beech mein like+subscribe, aakhir mein comment+like+subscribe, shabd-ba-shabd) dono hain?
- Aaj ki official list/announcement aa chuki ho to script usi hisaab se badlo (Rumor -> Official ya khabar band).

## Script ki lambai
Lagbhag 600-750 shabd = 4-5 minute (isme fixed intro ke ~40 shabd shaamil). Rahul ke kehne par chhoti/badi.

## Gemini ki aam galtiyan (is project mein dekhi gayi)
- Official fact (jaise deadline) ko "rumor" bana dena.
- "Sau pratishat pakka hai" jaise shabd official fact par bhi lagana (ye bhi hata do, "pakki jaankari" theek hai).
- Apni taraf se "chot se lautta khiladi", "dav", "khatra" jaise tark jodna.
- Khiladi ki ulti disha likhna (jaisa Siddharth ke liye hua tha: Lucknow aata hua likh diya).
- "[APNI RAAY]" marker khali chhodna.
- Har chunk ke end mein "Use kiye gaye facts" likhna (ek hi script mein sirf aakhir mein ek line chalegi, final mein hata do).

## Is video ka record
docs/scripts/<date>_<naam>/ mein har video ka kaam rakho: 01_FACT_PACK.md, 02_GEMINI_MESSAGE.txt, 03_GEMINI_OUTPUT_v1.md, 04_CHECK_NOTES.md, 05_FINAL_SCRIPT.md. Nayi video = naya folder. Pichla example: docs/scripts/2026-11-17_shami_curran_trade/.

## Scenes ke baad: Rahul ke PC par jo dikha (17 Nov 2026, pehla video)
- scenes.json load par 13 ERROR aaye kyunki custom photo slots (custom_shami, custom_sam_curran) tool mein bani hi nahi thi. Photos mein '+ नाम जोड़ो' se slot (sirf 'shami', 'sam_curran' likho, 'custom_' khud nahi lagta) PEHLE banao, phir JSON load. Rahul ko scenes.json dete waqt ye step saath mein batao. Library mein jin khiladiyon ki slot nahi hai (Shami, Curran) unke liye custom_ naam rakho.
- Load se pehle 'Sab hatao' dabao, warna Demo scenes (hook 'सबसे बड़ा सवाल', demo_a/demo_b) bache rehte hain.
- Photo upload ka tareeka: 'Is video ke liye photos' list mein har slot ke saamne अपलोड button.
- Audio: Rahul ki audio 522.8s (8:42) nikli jabki script ~4:20 ki thi; scenes ka jod 247s tha. Fix: ⏱ Audio ke hisaab se fit (proportional scale). Ye bhi dekho ki audio file ka naam is video ki hi hai (pehle screenshot mein purani 'Jaiswal Trad...' file dikhi thi).
- Preview mein awaaz na aaye: bada upar wala ▶ dabao (scene ka chhota ▶ sirf scene), audio loaded ho (reload par audio dobara lagani padti hai), tab mute na ho, ⏱ fit.
- Rahul photos ke screenshot (phone se) bhejta hai; unse error padh kar madad karo.
