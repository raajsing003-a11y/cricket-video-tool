# SCENES JSON SCHEMA (C18)

Tool ki `scenes.json` = ek **array** of scenes. Claude chat mein script se ye JSON bana ke deta hai, tool mein **⬇ JSON load** se load hota hai. Load par tool khud check chalata hai: **error** ho to load nahi hota (list dikhti hai), **warning** ho to load hota hai. Kabhi bhi **✔ JSON check** button se dobara check kar sakte ho.

Example (8 scenes, sirf format dikhane ke liye, content placeholder hai): `docs/example_scenes_8.json`

## Scene ke common fields
- `type` (zaruri): hook | title | stat | retain | watch | rumour | anth | intro | presenter
- `dur` (zaruri): seconds, 1.5 se 30 (⏱ fit baad mein badal dega)
- `tr` (optional): cut | fade | grunge | zoom | whip | glitch | flash | slideup | push | iris | blinds | rgb | spin | lightwipe | tiles | blurfade (C31 ke 8 naye: push=dhakka, iris=goal circle, blinds=patti, rgb=lal-neela split, spin=ghoomta, lightwipe=sunehri roshni, tiles=tile pop, blurfade=soft blur). Pehle scene par nahi lagta.
- `trDur` (optional): seconds, 0 se dur tak (normal 0.5-0.7)
- `chunk` (optional): 1,2,3... = kaun si voice-over file. Badhte order mein. Khali = pichle scene wala.
- `data`: card ke fields (neeche). Har card mein optional `bg` (asset key, jaise `01_backgrounds/bg_navy_plain`) aur `ribbon` (true = Subscribe ribbon).

Scene ka shape: `{"type":"stat","dur":5,"chunk":2,"tr":"slideup","trDur":0.6,"data":{...}}`

## Cards (data fields)
**hook** (bada number/line): `big` (text) YA `to` (count-up number) zaruri. `pre`, `unit`, `post`, `dec` (0-3 decimal), `left` (true = text bayen taraf). Default bg grunge red.
- Hindi akshar limit: pre 40, unit 20, post 80.

**title** (breaking headline): `city` (zaruri), `headline` (zaruri, 70 tak), `sub` (60), `ticker` (140), `left` (true = chip bayen, headline dayen). City = bengaluru, chennai, delhi, gujarat, hyderabad, kolkata, lucknow, mumbai, punjab, rajasthan.

**stat** (photo + number + lower-third): `photo` (slot id), `head` (zaruri, 50), `sub` (60), `pre` (40), `prefix` (jaise ₹), `to` ya `big`, `dec`, `unit` (20), `lt` = red | blue | purple, `tag` (true = Breaking tag), `flip` (true = layout aaina, sirf wide stat).

**retain** (player card + stamp): `city` (zaruri), `photo` (slot id), `name` (zaruri, 30), `amount` (20), `note` (80), `stamp` = retain | watch | rumour | official (default retain), `flip` (true = card dayen, text bayen). Label "संभावित: ऑफिशियल लिस्ट नहीं" HAMESHA dikhta hai. `release` stamp BLOCKED. `official` tabhi jab official list se confirm ho.

**watch** (नज़र रहेगी list): `names` (1-6 naam, zaruri), `title` (30), `photos` (0-2 slot id), `note` (80), `city` (optional), `flip` (true = photos dayen).

**rumour** (अफवाह, 2 photo split): `head` (zaruri, 50), `sub` (60), `photos` (1-2 slot id), `note`, `flip` (true = 2 photo adli-badli).

**anth** (sawal + cta): `qs` (1-3 sawal, har ek 90 tak, zaruri), `title` (60), `cta` (60), `flip` (true = patti dayen se).

**intro** (paper + red ball): `line1`, `line2` (kam se kam ek zaruri; 50 / 70 tak), `flip` (true = ball dayen se).

**presenter** (apna green-screen intro): `photos` (1+ slot id, har ek alag expression, zaruri), `name` (zaruri), `channel`, `sub`, `key` = "auto" | true | false, `swap` (0.5-5 sec, expression badalne ka gap).

## Short (9:16) cards — C19
Short video alag format hai: tool mein **📱 Short 9:16** button dabao (1080x1920). Short mein sirf ye 3 card type chalte hain, aur ek JSON mein wide + short mix nahi (galat format = ERROR). Short ke scenes alag save hote hain. Short 60s ke andar rakho.

**short_hook** (bada number slam): `big` ya `to` (zaruri), `dec`, `pre` (40), `unit` (20), `post` (80), `bg`.
**short_stat** (photo + number + neeche naam panel): `photo` (slot id), `head` (zaruri, 40), `sub` (50), `pre` (30), `prefix`, `to` ya `big`, `dec`, `unit` (16), `lt` = red | blue | purple, `tag` (true = Breaking tag), `bg`.
**short_cta** (sawal/comment + subscribe button): `line1`, `line2` (kam se kam ek zaruri; 60 / 40), `cta` (30), `bg`.
Captions Short mein bade (3 line tak) screen ke neeche-beech mein aate hain. Transitions wahi (cut/fade/grunge/zoom/whip/glitch/flash/slideup).
Example: js/card_short.js ke neeche DEMO_SHORT.

## Look / Auto-vary (C32)
Scenes JSON ka format nahi badla. Tool mein '🎨 Look preset' (Night/Gold/Clean/Grunge/Studio) + '🎲 Auto-vary' scenes ke `bg` aur `tr` apne aap bhar dete hain. Claude JSON banate waqt `bg`/`tr` khali chhod sakta hai ya alag-alag de; har video mein same bg/tr mat dohrao.

## Photo slot id
- Library slot: jaise `player_kolkata_sunil_narine_headshoulders` (🖼 Photos list mein hai).
- Apna naam wala: `custom_<naam>` (Photos mein "+ नाम जोड़ो" se banta hai).
- Unknown id = **error**. Photo upload nahi hui = **warning** (scene editor ka 📷 summary upload karwa dega).
- Khali photo ("") = warning.

## Check kya-kya pakadta hai
ERROR (load nahi hoga): array nahi / scene object nahi, unknown type, dur galat, unknown transition, trDur > dur, chunk galat ya ghatta hua, data missing, unknown city/lt/stamp/key, unknown photo slot, unknown bg asset, names 6 se zyada, qs 3 se zyada, release stamp, label hatane ki koshish, fantasy/Dream11/betting shabd.
WARNING (load hoga): dur bahut chhota/lamba, bahut lamba text, unknown extra field, photos 2 se zyada, photo khali/upload baaki, team ka short form (MI, CSK, RCB...), source ka naam (Cricbuzz, NDTV...), "official" stamp.

## Claude ke liye niyam (script se JSON banate waqt)
1. Sirf script ke facts; naye facts nahi. Source ka naam nahi. Team short form nahi, sheher ka naam.
2. Text Devanagari Hindi, chhota (limits upar). Retain/watch/rumour par "संभावित / अभी ऑफिशियल नहीं" wali baat bani rahe.
3. Har voice-over chunk ke scenes par `chunk` number. dur ka andaza do, tool ⏱ fit se theek kar dega.
4. Photo slot id sirf library/custom wale; pata na ho to "" chhodo (warning aayegi) aur batao kaun si photo chahiye.
5. Bhejne se pehle ye check mentally chalao; tool bhi load par check karega.
6. Har video ki shuruaat CHANNEL_INTRO.md se hai (fixed intro ~6 sec, phir "is video mein" preview). JSON mein presenter scene NAHI banao (photo ids pata nahi): pehla scene "is video mein" wala preview (hook ya watch, 4-6 sec) rakho, sab `chunk` 1. Rahul load ke baad tool mein 🎬 Standard intro jodo dabata hai (presenter scene sabse aage lag jaata hai).

