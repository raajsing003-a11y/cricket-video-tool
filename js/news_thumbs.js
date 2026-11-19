// C186: news.html ke 📋 Copy prompt mein "6) THUMBNAIL" step — har video ke liye 3 alag tarike ke clickbait thumbnail prompt (Gemini).
// Source: Rahul ki THUMBNAIL_PROMPT.md (120 competitor thumbnails se). Rule-based text, AI nahi. docs/THUMBNAIL_PROMPT.md mein wahi poora.
// API: window.THUMB_STEP({cities:['rajasthan',..], multi:N|0, rum:bool}) -> string (prompt ka step 6). window.THUMB_COLOURS = {city:'colour'}.
(function(){
const COL={rajasthan:'royal blue + pink',lucknow:'teal blue + orange',chennai:'yellow + navy blue',mumbai:'blue + gold',bengaluru:'red + black + gold',kolkata:'purple + gold',hyderabad:'orange + black',delhi:'blue + red',punjab:'red + silver',gujarat:'navy blue + gold'};
const STYLES=[
 '1) SWAP / VS: do khiladi ke beech hara-safed (ya team rang) swap arrow ↔, LINE1 jaise \"A ↔ B?\", LINE2 \"Kaun JEETA?\". Host pose = hand on chin.',
 '2) PAISA / NUMBER: bada number ya paisa (\"10 Cr vs 2.4 Cr\", \"81 PLAYERS\"), number par laal circle, LINE2 \"Kiska Fayda?\". Number SIRF Fact Pack ka.',
 '3) CURIOSITY / SUSPENSE: ek khiladi greyed-out (kaun bahar?), bada laal \"?\" ya \"???\", adhoori baat (\"Ek Aur TRADE?\" / \"Siddharth Bhi!\"), tag BREAKING.',
 '4) SAWAAL, JAWAB VIDEO MEIN: seedha sawaal (\"Ab Kiska Number?\", \"Kaun Khush, Kaun Dukhi\"), host pointing at players, jawab thumbnail par kabhi nahi.',
 '5) TICK / CROSS GRID: khiladiyon ke saath ✅ ❌ grid ya ek par laal X (kaun andar, kaun bahar), LINE1 chhota sawaal.',
 '6) BREAKING ALERT: siren/laal urgency, bada khiladi + ??? , tag BREAKING / TRADE WINDOW / IPL 2027 chip, text 2-3 shabd, laal arrow main detail par.',
 '7) DO TEAM TULNA: split screen, ek taraf ek team ke rang, doosri taraf doosri; beech mein VS ya ↔; LINE2 \"Kiska Fayda?\" / \"Kaun Khush, Kaun Dukhi\" (emoji sticker body ke paas, chehre par nahi).'];
const RULES=[
 'CLICKBAIT NIYAM (har thumbnail par, taaki click aaye par jhooth na ho):',
 '- CURIOSITY GAP: sawaal uthao, jawab video mein rakho. Adhoori baat > poori baat. Phone par 1 second mein samajh aaye: ek hi main cheez (focal point), bahut kam cheezein, bahut saturated rang, mota kala outline.',
 '- Bada text 2-5 shabd, 2 line (LINE1 safed, LINE2 peeli, ek shabd laal box mein). Roman Hinglish (title jaisa). Number ya paisa ho to BADA.',
 '- Thumbnail ka text title ko dohrata nahi, usse AAGE badhata hai (title: \"THIS TRADE CAN SHOCK IPL!! Shami to Rajasthan, Curran to Lucknow?\" -> thumbnail: \"SHAMI ↔ CURRAN?\" + \"Kaun JEETA?\").',
 '- Curiosity ke nishaan: laal arrow, laal circle, \"?\"/\"???\", swap arrow, ✅ ❌, greyed-out khiladi. Kone mein chhota tag (BREAKING / TRADE WINDOW / IPL 2027).',
 '- Teeno concept alag: alag style (neeche bank se), alag LINE1/LINE2, alag special cheez, alag host pose. Do concept ka text ya layout same nahi.',
 '- Clickbait = sirf utna jitna Fact Pack mein hai. Koi jhootha number/naam/disha nahi. Text mein rumor / official / afwah / Done / Confirm jaise shabd NAHI; shak wali baat par \"?\" lagao.',
 '- Photos Rahul khud upload karega (web se download nahi). Fantasy/betting kuch nahi. Kisi par taana nahi.',
 'FACE KA NIYAM (sabse zaroori): prompt mein kabhi \"shocked / smiling / angry face\" mat likho. Emotion sirf BODY se (haath ki pose, arrow, \"?\", emoji sticker), chehre se nahi. Prompt A mein hamesha: \"Keep every face EXACTLY as in the photo: same expression, same features, no smile/mouth/eye changes, no beautify, no redraw. Only cut out and place.\"'];
const PB=[
 'Create a YouTube thumbnail BACKGROUND template, 16:9, 1280x720, ultra-vibrant Indian cricket news style.',
 '',
 'Do NOT draw any real person\'s face. Where people should be, draw clean empty rounded cut-out slots filled with flat neutral grey silhouettes (head and shoulders), so real photos can be placed later:',
 '- {N} slots on the left/centre (size ~ 30% of height each, slightly overlapping),',
 '- 1 larger slot on the right 25% for the host.',
 '',
 'Background: {TEAM_COLOURS} split colour, stadium floodlights, light rays, bokeh, smoke, very saturated.',
 'Add: {SPECIAL: e.g. a double arrow between slot 1 and slot 2 / one slot greyed-out / big red \"?\" / one red arrow / a red circle on the key detail}.',
 'Bottom: huge bold text, two lines, thick black outline.',
 '   Line 1 (white): \"{LINE1}\"',
 '   Line 2 (yellow): \"{LINE2}\"',
 '   One word in a red box: \"{BOX_WORD}\"',
 'Tag top right: \"{TAG}\".',
 'Text must be spelled exactly as given. No other text. No faces.'].join('\n');
const PA=[
 'Create a YouTube thumbnail, 16:9, 1280x720, ultra-vibrant, high contrast, professional Indian cricket news channel style.',
 '',
 'REFERENCE PHOTOS (attached): Photo 1 = host (right side). Photo 2 = {PLAYER_1}. Photo 3 = {PLAYER_2}. {PHOTO_4_5}',
 '',
 'STRICT FACE RULE: keep every face EXACTLY as in its photo. Same expression, same features, same age and skin. Do NOT change smile, eyes, mouth or beard. Do NOT redraw or beautify faces. Only cut out and place them. No new expressions.',
 '',
 'LAYOUT:',
 '- Background: {TEAM_COLOURS} split, stadium floodlights, light rays, bokeh, slight smoke. Very saturated.',
 '- Left/centre: {PLAYER_1} and {PLAYER_2} chest-up, big, slightly overlapping, in their {TEAM} jerseys. {SPECIAL}.',
 '- Right 25%: host, large, chest-up, plain dark jacket, hand pose: {POSE}. Face unchanged.',
 '- Bottom: huge bold text, two lines, thick black outline. Line 1 (white): \"{LINE1}\". Line 2 (yellow): \"{LINE2}\". One word in a red box: \"{BOX_WORD}\".',
 '- Small tag top right: \"{TAG}\". Red \"?\" mark near the key player. One red arrow pointing at the main detail.',
 '- No other text, no watermark, no logos except team colours.',
 'Keep it clean, readable on a phone at small size, text must be spelled exactly as given.'].join('\n');
window.THUMB_COLOURS=COL;
window.THUMB_STEP=function(o){o=o||{};
 const cities=(o.cities||[]).filter(c=>COL[c]),multi=o.multi|0;
 const col=cities.length?('TEAM COLOURS (is khabar ke): '+cities.map(c=>c+' = '+COL[c]).join(' | ')+'. Do team hon to split background mein ek-ek rang.'):'TEAM COLOURS: khabar ki team ke rang chuno (Rajasthan royal blue + pink, Lucknow teal blue + orange, Chennai yellow + navy, Mumbai blue + gold, Bengaluru red + black, Kolkata purple + gold, Hyderabad orange + black, Delhi blue + red, Punjab red + silver, Gujarat navy + gold).';
 return ['6) THUMBNAIL: is video ke liye 3 ALAG-ALAG tarike ke best-se-bhi-best clickbait thumbnail prompt do (Gemini image ke liye), Fact Pack ke facts se. Teeno ek-doosre se bilkul alag dikhein.',
  'STYLE BANK (inme se 3 chuno jo is khabar par sabse zyada fit hon'+(multi?'; Top-'+multi+' video hai to ek concept \"NUMBER GRID\" lo: '+multi+' chhote slots + bada \"TOP '+multi+'\" number + ?':'')+'):',
  STYLES.join('\n'),
  RULES.join('\n'),
  col,
  'OUTPUT (har concept ke liye, teeno ek ke baad ek): (a) ek line: concept number + style naam + LINE1 / LINE2 / BOX_WORD / TAG / special / host pose / kaun si photo (slot naam: host + khiladi). (b) PROMPT B ek alag code block mein, {..} poora bharke, text shabd-ba-shabd. Prompt A tabhi do jab main \"A bhi\" bolun. Teeno ke baad ek line: kaun sa concept sabse zyada click layega aur kyun.',
  'PROMPT B TEMPLATE (PAKKA tareeka: chehre ki jagah khaali slot; asli photos tool ke thumbnail.html mein lagti hain, face 100% original):',
  PB,
  'PROMPT A TEMPLATE (photos ke saath, sirf jab main bolun):',
  PA].join('\n');};
})();
