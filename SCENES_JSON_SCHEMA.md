# SCENES JSON SCHEMA (C18)

Tool ki `scenes.json` = ek **array** of scenes. Claude chat mein script se ye JSON bana ke deta hai, tool mein **⬇ JSON load** se load hota hai. Load par tool khud check chalata hai: **error** ho to load nahi hota (list dikhti hai), **warning** ho to load hota hai. Kabhi bhi **✔ JSON check** button se dobara check kar sakte ho.

Example (8 scenes, sirf format dikhane ke liye, content placeholder hai): `docs/example_scenes_8.json`

## Scene ke common fields
- `type` (zaruri): hook | title | stat | retain | watch | rumour | anth | intro | presenter | cta | curve | stack | chapter | crowd | bigwords | qcards | spot | compare | tiles | levels | chip | options | stat2 | bars | dash | trio | rating | portrait | phone | market | comments | timeline | hub | search | formula | beforeafter | setting | radio | ideas | reel | phones | gcurve | steps | expect | equals | payoff | tickgrid | variety | vsvlog | energy | bestlast | locked | longstat | offer | products | endscreen | burst | clip | diamond | kinetic | barcount | quote | post | iconscene | bullets | phoneann | phonewall | numgrid | compare2 | plans | timelist | ctapill | adcard | uimock | checklist | chips | split
- `dur` (zaruri): seconds, 1.5 se 30 (⏱ fit baad mein badal dega)
- `tr` (optional): cut | fade | grunge | zoom | whip | glitch | flash | slideup | push | iris | blinds | rgb | spin | lightwipe | tiles | blurfade | split | chevron | torn (C31 ke 8 naye: push=dhakka, iris=goal circle, blinds=patti, rgb=lal-neela split, spin=ghoomta, lightwipe=sunehri roshni, tiles=tile pop, blurfade=soft blur). Pehle scene par nahi lagta.
- `trDur` (optional): seconds, 0 se dur tak (normal 0.5-0.7)
- `chunk` (optional): 1,2,3... = kaun si voice-over file. Badhte order mein. Khali = pichle scene wala.
- `header` (optional, C93): upar ki chhoti line, `*shabd*` = peela. Max 70 akshar, ek hi beat ke kai scenes par same text rakho (bina fade chalega). Khali = koi header nahi. Jaise: `"header":"Shami ki *Rajasthan* mein entry?"`
- `pills` (optional, C95): 1-3 glass pill ek line mein (rang ka dot + text), ek-ek karke pop-in. `[{"t":"Sahi baat","c":"g"},{"t":"Afwah","c":"r"}]` ya sirf text (grey). c: g=hara r=laal y=peela x=grey. Text max 24 akshar. `pillsPos`: `top` (default, header ke neeche) / `mid` / `low` (caption ke upar; card text se takra sakta hai).
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

**cta** (like/comment/subscribe icons, photo nahi chahiye): `mode` = like (beech: Like+Subscribe) | end (aakhir: Like+Comment+Subscribe), `title` (40), `line` (60). Har video mein 2 cta scene: beech ke break par mode like, sabse aakhir mein mode end (docs/CHANNEL_CTA.md). Tool ka 📣 button bhi dono jod deta hai.
**curve** (C96, G21, sirf wide; photo nahi chahiye): 1-2 curve ek-ek karke banti hain (area gradient + glow end-dot). `y1` (zaruri, 2+ number, `"5,12,40,90"` ya list), `l1` label (24), `c1` rang g|r|y, `mark1` `"3:Peak"` (3rd point par chhota bubble); `y2,l2,c2,mark2` dusri curve; `xl` x-axis labels list; `title` (60), `note` (80, neeche peela), `ymin/ymax` optional, `bg`. Rumour ka graph ho to label/note mein 'Rumour' likho.
**stack** (C97, G18, sirf wide; photo nahi chahiye): 3D-perspective list (upar chhoti, neeche badi rows), pop-in. `items` (2-9 line, har ek 40 tak, zaruri), `hl` (kaunsi row highlight, 1 se; peela glow), `pill` (24, highlight row par peela label), `done` ("1,2,3" = blue tick pop), `mark` ("6,7" = peela circle), `title` (60), `bg`.
**chapter** (C98, Y10, sirf wide; photo nahi chahiye): peeli patti par chapter number + naam, upar lock-pill. `title` (40, zaruri), `num` ("02"), `pill` (50, khali = pill nahi), `lock` (false = lock icon nahi), `bg`. Chapter ke shuru mein 2-3 sec.
**crowd** (C99, Y14, sirf wide; photo nahi chahiye): `total` (10-200, default 100) chhote avatar dots ki grid, unme `hi` (default 10) peele highlight (scatter ya `scatter:false` = pehle wale), phir beech mein glass card: `label` (30, bada), `sub` (60). `c` rang y|g|r, `title` (60), `bg`. Jaise: 100 mein se 10 ne dekha.
**bigwords** (C100, Y19, sirf wide): do bade shabd pop-in: `a`, `b` (20 tak, zaruri), `join` (beech ka chinh, default `+`, khali = nahi), `ca`/`cb` rang y|g|r|b|w, `pills` (0-3 numbered glass pill neeche), `title`, `bg`.
**qcards** (C100, Y20, sirf wide): 2-3 numbered glass sawal cards ek-ek karke: `qs` (60 tak, zaruri), `hl` (1 se, peela glow border; 0 = koi nahi), `title`, `bg`.

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

C164: cards mein rumor/official/अफवाह/ऑफिशियल wali cheez nahi likhni (stamp aur label tool ab dikhata hi nahi, aisi pill hat jati hai, checker warning deta hai). `stamp` field bachi hai par ignore hoti hai; "label hatana" ab error nahi.

Bhasha niyam (C163): sirf KHABAR/news wali baat Hindi mein (naam, headline, rumour, facts). Basic cheezein English mein: Like/Comment/Subscribe, Thank you, Watch next, What do you think? — cta/short_cta/endscreen/anth ka text English likho. Tool cta card par Hindi title/line ko khud English se badal deta hai (Hindi chahiye to data.hindi:true).

## Photo slot id
- Library slot: jaise `player_kolkata_sunil_narine_headshoulders` (🖼 Photos list mein hai).
- Apna naam wala: `custom_<naam>` (Photos mein "+ नाम जोड़ो" se banta hai).
- (C162) `custom_<naam>` library mein na ho to JSON load par slot apne aap ban jata hai (naam id se); Rahul ko sirf photo upload karni hoti hai. Isliye naya naam seedha `custom_<naam>` likho.
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
6. Har video ki shuruaat CHANNEL_INTRO.md se hai (pehle "is video mein" teaser, phir fixed intro ~6 sec). JSON mein presenter scene NAHI banao (photo ids pata nahi): pehla scene "is video mein" wala preview (hook ya watch, 4-6 sec) rakho, sab `chunk` 1. Rahul load ke baad tool mein 🎬 Standard intro jodo dabata hai (presenter scene pehle teaser scene ke baad lag jaata hai).
**spot** (C101, G19/Y23, sirf wide): screenshot/screen-record par highlight: `shot` (photo slot naam jaise custom_signin, ya asset path; khali = browser window mock), `box` ("x,y,w,h" 0-1, shot ke hisse mein — peela rectangle + baaki dim), `cursor` (default true), `click` (default true, ripple), `zoom` (1-2.2, default 1.35), `label` (peela text neeche), `pill`, `title`, `bg`. Sensitive hissa (email, naam) pehle photo mein blur karo.
**carry** (C102, G22, scene ka top-level key, card data mein nahi): `"carry":{"id":"k1","t":"CTR","c":"y","pos":"0.5,0.5","s":1}`. Agle scene mein same `id` + nayi `pos`/`s`/`t` = chip bina cut ke glide hota hai. `pos` x,y 0-1 (center), `s` 0.5-3, `c` y|g|r|b|w, `t` 24 akshar tak.
**compare** (C104, Y21, sirf wide): do column tick/cross list: `la`, `lb` (header, 30 tak), `a`, `b` (1-6 line, 40 tak, zaruri), `ma` (tick|cross, default tick), `mb` (default cross), `ca`, `cb` (rang y|g|r|b, default g / r), `title`, `bg`. Rumour vs confirmed jaisi comparison ke liye.
**tiles** (C105, Y9, sirf wide): 2-6 glass tile: `items` mein har line `label|pill|icon` (pill aur icon optional; icon = asset path jaise 06_icons/icon_bat, khali = number circle), `c` pill rang y|g|r|b, `banner` (neeche peela pill), `title`, `bg`.
**levels** (C105, Y24, sirf wide): 2-6 level rows: `items`, `done` ("1,2" tick), `lock` ("3" taala), `hl` (1 se, peela border), `pill` (neeche), `title`, `bg`.
**chip** (C106, Y7, sirf wide): beech mein bada rounded brand/naam chip: `name` (28 tak, zaruri), `by` (chhoti line), `icon` (asset path, khali = pehla akshar circle), `c` y|g|r|b, `title`, `bg`. Kisi company ka logo nahi, generic chip.
**options** (C106, Y25, sirf wide): 2-4 option cards: `items` ki har line `title|line|icon`, `pills` (0-2, `text|rang`, rang y|g|r|b|x grey), `hl` (1 se), `title`, `bg`.
**stat2** (C107, Y17, sirf wide): do bade number card count-up: `n1`, `n2` (number, zaruri; comma apne aap, decimal jitna likha utna), `l1`, `l2` (label), `p1`/`p2` (prefix jaise ₹), `s1`/`s2` (suffix jaise %), `c1`, `c2` (y|g|r|b), `mid` (beech ka chinh jaise →), `pill` (neeche), `title`, `bg`. Number sirf asli/confirmed ho (niyam 7).

**bars** (C108, Y16, sirf wide): bar-race + total: `items` 2-6 (`naam|number|icon`), `unit` (मिनट), `c` (y|g|r|b), `total` (false = equation band band), `title`, `bg`. Neeche equation apne aap (5 + 4 + 2 = 11 मिनट).

**dash** (C108, Y18, sirf wide): analytics mock: `tiles` 2-4 (`label|value|+5%`; delta optional, `-` se shuru = laal), `pts` (line chart ke 2-12 number, strings mein), `note` (neeche pill), `c`, `title`, `bg`. Number sirf asli/confirmed (niyam 7).

**trio** (C109, Y15, sirf wide): ek bada `head` card jo `items` (2-4, `शीर्षक|छोटी लाइन`) mein khulta hai; numbered circle. `icon` (asset path), `c`, `title`, `bg`.

**rating** (C109, Y12, sirf wide): `stars` (0-5, .5 chalta hai) 5 star ek-ek bharte hain, `head` (upar chhota label), `label` (jaise रेटिंग), `tiles` 0-2 (`label|value`), `c`, `title`, `bg`. Fan-sawaal card; fantasy/betting nahi.

**portrait** (C110, Y8, sirf wide): presenter glass portrait card + text. `text` (`*shabd*` peela), `sub`, `photo` (asset path, default 19_presenter/presenter_point_left; transparent presenter best), `side` (r|l), `c`, `title`, `bg`.

**phone** (C110, Y13, sirf wide): phone mock jisme `feed` (0-8 line) scroll hoti hai + counter box (`label`, `n` count-up). `n` na do to sirf phone. `c`, `title`, `bg`.

**market** (C111, Y11, sirf wide): rangeen tile grid `tiles` 2-12 (`लेबल|y/g/r/b/p`) ek-ek pop, `pills` 0-2 (`text|rang`), `title`, `bg`.

**comments** (C111, Y2, sirf wide): `items` 2-4 (`नाम|कमेंट`) halke tilt ke cards, `hl` (1 se) wala seedha + peela border, `pill`, `c`, `title`, `bg`. Comments Rahul ke apne/asli hon (naye facts nahi).

**timeline** (C111, Y4, sirf wide): `points` 2-6 label (jaise 2018), `at` (1 se; dot yahan tak slide), `label` (dot ke upar pill), `c`, `title`, `bg`.

**hub** (C112, Y22, sirf wide): beech ka `center` node + `spokes` 2-8 (line se judte nodes), `note` (neeche pill), `c`, `title`, `bg`.

**search** (C112, Y30, sirf wide): search bar mein `text` typewriter, phir `results` 0-3 line, `pill`, `c`, `title`, `bg`.

**formula** (C113, Y31, sirf wide): `name = a op b` ek-ek aata hai (`name` jaise CTR, `a`, `b` zaruri, `op` default ÷), `la`/`lb` a/b ke neeche arrow + label pill, `c`, `title`, `bg`.

**beforeafter** (C113, Y32, sirf wide): do panel, laal X `bl` (default पहले) | hara tick `al` (default बाद में). `before`/`after` text, ya `bi`/`ai` asset image (text neeche caption). `bar` (0-100) + `barlabel` = neeche laal progress bar. `title`, `bg`.

**setting** (C114, Y26, sirf wide): upar `step` badge (jaise सेटिंग 3) + `name` (कीवर्ड) ek rounded label, neeche `pills` (1-4, `text` ya `text|रंग`) ek-ek pop. `c` y/g/r/b, `title`, `bg`.

**radio** (C114, Y27, sirf wide): `items` (2-5) radio rows ek-ek aati hain. `hl` (number ya list, 1 se) wali rows peele border + bhare dot ke saath. `pill` ('text' ya 'text|g') neeche. `c`, `title`, `bg`.

**ideas** (C114, Y28, sirf wide): `items` (2-3, `शीर्षक|छोटी लाइन|आइकन asset`) idea cards, neeche `avatar` chip (`av` = optional asset image) aur dotted connector lines. `c`, `title`, `bg`.

**reel** (C115, Y29, sirf wide): reel-style phone + bada number box. `n` (count-up) + `unit` ya `big` (seedha text) zaruri; `label`; optional `gauge` (0-100) + `glabel` + `gl`. `c`, `title`, `bg`. Number sirf Rahul ke apne/confirmed.

**phones** (C115, Y33, sirf wide): do phone side-by-side. `a`/`b` screen text ya `ia`/`ib` asset image; `la`/`lb` labels; `hl` 1 ya 2 (peela glow); `caption` neeche pill. `c`, `title`, `bg`.

**gcurve** (C116, Y34, sirf wide): gauge card + retention curve card. `gauge` (0-100) + `glabel` + `gl`; `pts` (2-10 number, 0-100) + `cl`. Kam se kam gauge ya pts. `c`, `title`, `bg`.

**steps** (C116, Y35, sirf wide): 2-4 "STEP N" cards, `items` = `शीर्षक|छोटी लाइन`. `hl` (1 se) = sirf wo roshan, baaki dim; na do to ek-ek roshan. `caption` neeche pill. `c`, `title`, `bg`.

**expect** (C116, Y36, sirf wide): thumbnail card (`thumb` text ya `ti` image) ---- thought bubble (`thought`) ---- avatar (`user`, `av`) + hara tick (`tick` default true) + `pill`. `c`, `title`, `bg`.

**equals** (C117, Y37, sirf wide): do row `a = av`, `b = bv` (kam se kam ek jodi), `ex` neeche example mini-card. `c`, `title`, `bg`.

**payoff** (C117, Y38, sirf wide): CONTEXT/PAYOFF cards `a`, `b` (zaruri), timeline bar `ta` (default 0s) .. `tb`. `q` (0-4) do to ~2.6s ke baad "?" thumbnails + progress line, `qt` label. `c`, `title`, `bg`.

**tickgrid** (C117, Y39, sirf wide): hare tick grid, `total` (6-60, default 40), `cols`, `quote` pill, `pts` (2-8 number) retention line card. `c` (default g), `title`, `bg`.

**variety** (C118, Y40, sirf wide): video-box (REC dot + 0:00..0:10 timer, `vl` caption, `vi` avatar image) + emoji card (`emoji`, `et`) + laal bar `bar` label. `c` (default r), `title`, `bg`.

**vsvlog** (C118, Y41, sirf wide): do card — baayein laal X (`la` heading, `a` line), daayein peela smile (`lb`, `b`). Har side mein heading ya line chahiye. `title`, `bg`.

**energy** (C118, Y42, sirf wide): upar laal dip-curve (`h` hook ... `p` payoff, `dl` label), neeche peeli sine-wave `n` (2-8, default 5) numbered node 01.., `sl` label. `title`, `bg`.

**bestlast** (C118, Y43, sirf wide): hara curve gir ke theher-ti + end-dot pulse, `pts` (2-10, default [100,78,55,40,36,36]), `label` pill. `c` (default g), `title`, `bg`.

**locked** (C118, Y44, sirf wide): card row — `items` (1-3, `नाम|छोटी लाइन`) bhare, baaki locked "?" (`total` 2-4, default 4), `pill`. `c`, `title`, `bg`.

**longstat** (C118, Y45, sirf wide): bade panel mein do count-up number `n1` (c1 default g) aur `n2` (c2 default r), labels `l1`/`l2`, `head`, `pill`. `title`, `bg`.

**offer** (C118, Y46, sirf wide): baayein audience dots (`dots` 10-90) + avatar (`you`, `av`), daayein offer card (`oh`, `ot`) + `yes`/`no` button; cursor click (`pick` yes/no). `c`, `title`, `bg`.

**products** (C118, Y47, sirf wide): product tiles `items` (1-4) + growth curve `pts` (2-10) + label pill `gl`. `c`, `title`, `bg`.

**endscreen** (C118, Y48, sirf wide): bada "Watch next" video card (`vi` thumbnail, play button) + `vt` title, `ch` channel, `views`, `sub` button. `c` (default r), `title`, `bg`.

**burst** (C119, Y1, sirf wide): opening burst — whip-blur bg (`shot` asset ya default bg) 1s mein saaf, bada peela number `n` count-up (`dec`, `pre`, `unit`, ya seedha `big` text) + grow hone wali bar, `label`, `pill`. `c`, `title`, `bg`.

**clip** (C120, R1, sirf wide): Rahul ka video clip. `clip` (zaruri) = 🎞 Clips mein upload ki file ka naam, `start` (clip ke kitne sec se), `fit` cover|contain, `src` source tag ("SOURCE: ...", Rahul khud likhe), `name` + `role` naam-patti, `sub` subtitle line, `quote` bada " chinh. Clip mute chalta hai. Clips browser mein save hote hain (repo mein nahi). `c`, `title`, `bg`.

**diamond** (C121, R2, sirf wide): chapter card — glow diamond frame (outline draw hoti hai) + andar `icon` (asset) ya number `num`, `tag` (default CHAPTER) + `num`, bada `title`, `pill`. `c`, `bg`. (Y10 `chapter` peeli-patti wala alag card hai.)

**kinetic** (C122, R3, sirf wide): B&W photo + bade shabd. `words` (zaruri, `*shabd*` = peela), `photo` (photo slot naam ya asset path, optional), `bw` (default true), `sub`, `c`, `bg`.

**barcount** (C123, R4, sirf wide): bar chart + count-up. `items` (2-4, `"number|label"`), `unit` (jaise %), `max`, `hl` (kaunsa bar peela, 1 se), `title`, `note`, `pill`, `c`, `bg`.

**quote** (C124, R5, sirf wide): `quote` (zaruri, `*shabd*` peela), `name`, `role`, `photo` (slot/asset), `side` l|r, `bw`, `crowd` (silhouette bheed, default true), `c`, `bg`. Kisi ka quote naam ke saath, naye/jhoothe quote nahi.

**post** (C125, R6, sirf wide): social post card. `text` (`*shabd*` highlight), `name`, `handle`, `avatar`/`img` (slot/asset), `stats` (free text), `src` (source tag), `pile` 0-2, `theme` light|dark, `zoom` (false = zoom band), `title`, `c`, `bg`.

**iconscene** (C126, R7, sirf wide): `items` (1-4, `"asset/path|label"` ya `"🎟|label"`), `btn` (button text), `click` (cursor click, default true), `crowd`, `title`, `c`, `bg`.

**Transitions C127 (R8)**: `tr` mein `split` | `chevron` | `torn` (peela panel / chevron sweep / phata-kagaz patti).

**bullets** (C128, V3, sirf wide): `items` (2-5 lines; `*shabd*` = blue serif italic), `title` (chhota grey), `c`, `bg`. Lines ek-ek karke aati hain.

**phoneann** (C128, V4, sirf wide): vertical phone-frame. `clip` (🎞 Clips ka naam) + `start`, ya `shot` (photo slot/asset). `arrows`: 0-5 string `"label|x|y"` (x,y = frame par 0-100 % jagah; x<50 to label baayein, warna daayein; label mein `*shabd*` chalta hai). `title`, `sub`, `c`, `bg`. G5: `*shabd*` blue serif italic helper = `CORE.vText`; G6: arrows helper = `CORE.vArrows`.

**phonewall** (C129, V5, sirf wide): `n` (2-10 phone), `shots` (photo slot/asset list, kam ho to khaali tile), `labels` (hl wale phone ka label), `mode` fan (<=6) | row, `hl` (1..n glow), `title`.

**numgrid** (C129, V6, sirf wide): `items` 2-8 `"number|label"` (label mein `*shabd*`), `hl` (1..n glow baaki dim; 0 = ek-ek karke chamakte hain), `title`.

**compare2** (C129, V7, sirf wide): do browser window side-by-side: `ia`/`ib` (screenshot slot/asset), `la`/`lb` (neeche label, `*shabd*`), `ua`/`ub` (url bar text), `hl` 0|1|2, `title`.

**plans** (C130, V8, sirf wide): `items` 2-3 `"naam|keemat|note"`, `hl` (1..n glow + `badge`), `title`.
**timelist** (C130, V9): `items` 2-6 `"naam|number"` (bar fill), `unit`, `total` (aakhir mein), `title`.
**ctapill** (C130, V10): `title`, `btn` (blue pill), `n` (serif italic blue number) + `nl` ("days left"), `note`.
**adcard** (C130, V11): `title`, `old` (kata hua), `price`, `btn`, `proof` 0-6 chhoti lines (piche halke card; Rahul ke asli text), `note`.
**uimock** (C130, V12): window `url`, `beats` 1-4 lines, `options` 2-3 `"A|text"`, `pick` (1-3) + cursor `click`.
**checklist** (C130, V13): dark window naam `title`, `items` 2-6 (ek-ek karke hara tick), `note`.
**chips** (C130, V14): `chips` 2-6 floating label, `thumbs` 0-4 (2x2 grid, photo slot/asset), `pills` 0-2 neeche, `title`.

**split** (C131, G7, sirf wide): presenter chhota ek side + koi bhi wide card doosri side. `inner` = `{"type":"bullets","data":{...}}` (koi bhi wide card; `split`/`clip`/`phoneann`/`presenter` inner nahi), `pres` (photo slot/asset, jaise `19_presenter/presenter_point_left`) YA `clip` (+`start`) — ek zaruri, presenter kabhi gayab nahi; `side` l|r (presenter kis taraf), `ratio` 0.45-0.75 (card ki chowdai, default 0.6), card rounded frame mein. Card poore scene mein chalta hai (inner ko alag duration nahi).

## C132 — Video 4 cards (js/card_n.js, sab wide)
- `icontiles`: {title, items:['icon|label|colour'] (2-4), hl}
- `stepcards`: {head, items:['icon|label'] (2-4), hl, c}
- `screenclip`: {mode:'phone'|'wide', title, clip|shot, start, focus:'x|y|w|h' (%), at, tap, label, sub}
- `toggle`: {title, items:['label|x' ya 'label|v'] (2-3), hl}
- `askq`: {head, name, text, audio}
- `promo`: {name, logo, subs, thumbs:[..] (0-3), btn, note}
- `outword`: {words:'EK DO' (max 4 shabd), img, sub, c:'r'|'b'}
- `flowdiag`: {title, a, b, la, lb, result, wave, c}
- `crossprice`: {title, img, price, label, cross}
- `docfolder`: {title, doc, folder, label}
- `topicend`: {text, topic}
- `measure`: {title, img, label, sub}
- `meme`: {img, text, side}
- `wavestrip`: {name, img, text, c}

## C135 — Video 5 cards (js/card_p.js)
- `ideatitle`: {small, big, sub} | `chipcarousel`: {title, chips:['icon|label'] 3-8, hl} | `flowline`: {title, nodes (2-4), mode:'chain'|'fan', pill}
- `chatmock`: {ph, q, chips (0-4), note} | `statcard`: {n, dec, pre, suf, label, side:['label|value'] (0-2), blur, rain}
- `thumbwall`: {thumbs, n 4-12, hl, label} | `ladder`: {title, steps:['icon|label'] 3-4, hl} | `ring`: {n, dec, pre, suf, label, orbit (0-8)}

## C136 — Video 5 baaki (js/card_p2.js)
- `vidcard`: {clip|shot, start, title, meta} | `gauge`: {label, v 0-1, n, pre, suf, c1:'val|label', c2} | `barlist`: {title, items:['naam|number'] 3-6, suf}
- `tree`: {root, l2 (1-3), l3 (0-6)} | `cardtiles`: {items:['icon|label'] 3-4, brace} | `fan`: {src, outs:['label|sub'] 2-4}
- `replies`: {src, items:['@naam|comment'] 2-4} | `vs2`: {a, sa, b, sb, pill} | `bonus`: {a, ta, b, tb, icon} | `prodnode`: {a, b, c ('icon|label')} | `dotmap` (P12, js/card_p3.js): {title, map:'india'|'world', items:['Mumbai'] ya ['naam|x|y'] (x,y = map image ke % mein; india par IPL sheher naam se mil jaate), hl (1-based), sub}



## C172 — script scenes.json ke andar
Pehle scene par top-level key `"script"` (string) rakho = poori voice-over script (chunks ke beech ek line mein `---`). **⬇ JSON load** par ye apne aap teleprompter ki script ban jaati hai (localStorage `cvt_tp_script`); teleprompter.html kholo (khula ho to refresh). Card `data` mein nahi, scene ke top-level mein. Claude har scenes.json ke pehle scene mein ye zaroor rakhe.

## C177 — Match prediction cards (js/card_predict.js) + predict.html
- `winprob`: `{title,a,b,pa,pb?,ca?,cb?,note}` — tug-of-war bar + count-up %; ca/cb = team chip asset (`04_team_chips/chip_kolkata`).
- `h2h`: `{title,a,b,wa,wb,nr?,fa?,fb?,note}` — jeet count-up + last-5 dots (fa/fb = "WWLWL").
- `pitch`: `{title,type,items:['label|value'](2-4),toss?,note}`.
- `xi`: `{title,team,c:y|g|b|r,players:['Naam','Naam (C)','Naam|slot_id'](1-11),note}` — photo slot default `custom_<naam>` (known player ho to library id). Har card par "प्रेडिक्शन — पक्का नहीं" label apne aap.
- prediction/index.html: form bharo -> {script, scenes} JSON (h2h, pitch, xi A, xi B, winprob). Photo variants/rotation XI par bhi lagte hain.


## C205 — NO CAMEO (standing niyam, 22 Nov 2026)
Har scene ke `data` mein `"noCameo": true` rakho (cta aur presenter scenes chhodkar; wahan cameo aata hi nahi). Tool mein bhi 👤 Player image / 🖼 Side fill default OFF hain. Sirf jis scene ka photo slot data mein diya ho wahi photo dikhegi.
