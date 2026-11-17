# Check notes (Gemini output v1 par)
Achha: source ka naam nahi, team short form nahi, rumor label har chunk mein.
Galtiyan jo theek ki:
1. Ch1: "retention deadline 17 Nov" ko Gemini ne rumor bana diya -> OFFICIAL fact, seedha bola.
2. Ch2: "chot se lautta ऑलराउंडर aur ek spinner (Lucknow ko milega)" -> naya claim + Siddharth ki disha ulti (wo Lucknow se jaa rahe hain). Hata diya.
3. Ch3: "lagbhag baayen haath ka" -> "lagbhag" hata (Curran left-hand ke hain, F12). Ye galti Claude ke pehle Fact Pack ki thi.
4. Ch3: "khatra" wale tark (Gemini ki apni raay, report mein nahi) -> narm, sirf "sambhavna" tak.
5. Ch3 ant: "aakhri muhar kab lagegi" ka jawab kisi fact mein nahi tha -> line badli.
6. Ch4: khaali "[APNI RAAY]" marker -> neutral line.
Aur: "sau pratishat pakki" -> "pakki jaankari"; har chunk ke end ki "Use kiye gaye facts" lines hata di.
Rahul ke naye niyam (17 Nov): ek hi poora script (ek chunk), Gemini ko ek hi message mein format + rules shuru mein aur "best se bhi best" aakhir mein; v2 isi tareeke se.

## Scenes (06_SCENES.json)
22 scenes, sab chunk 1 (ek audio), dur ka jod 258.5s (script ~4:20; tool ka ⏱ fit audio ke hisaab se scale karega). Tool ke apne checker (scenes_check.js, node) se: 0 errors; sirf 'photo upload nahi hui' warnings. Photos: library se Archer + Kuldeep; Shami aur Curran library mein nahi -> Photos mein '+ नाम जोड़ो' se custom_shami, custom_sam_curran banao aur upload karo. Scenes mein sirf script ke facts (naye number/fact nahi).
