# THUMBNAIL PROMPT (Gemini) — har script + JSON ke saath milega

Style 120 competitor thumbnails (MY Cricket + dusra channel) se nikala. Face ke expression NAHI badalne.

## Jo thumbnails mein chalta hai (copy karna hai)
1. 16:9, 1280x720, bahut saturated rang, stadium bokeh + floodlight glow, team ke rang ka split background.
2. Left/beech: 2-5 khiladi, team jersey mein, chest-up, thoda overlap. Right 25%: host bada, saada t-shirt/jacket, haath se pose (thodi par haath / ungli se point / munh par haath).
3. Neeche 2 line bada text (2-5 shabd): ek line safed, ek line peeli, mota kala outline, ek shabd rang ke box mein.
4. Curiosity ke nishaan: laal arrow, laal circle, "?" / "???", swap arrow ↔ (do khiladi ke beech), ✅ ❌ tick grid, ek khiladi greyed-out (kaun bahar).
5. Number ya paisa bada: "81 PLAYERS", "10 Cr vs 2.4 Cr".
6. Chhota tag kone mein: BREAKING / TRADE WINDOW / IPL 2027 logo chip.
7. Sawaal ya adhoori baat (jawab video mein): "Kaun JEETA?", "Ab Kiska Number?", "Kaun Khush, Kaun Dukhi".

## Hamare niyam
- Text mein rumor / official / afwah shabd NAHI. Shak wali baat par "?" lagao, "Done/Confirm" mat likho.
- Text Roman Hinglish (title jaisa). Bada text 5 shabd tak.
- Photos Rahul khud upload karta hai (web se download nahi).
- Fantasy/betting kuch nahi.

## FACE KA NIYAM (sabse zaroori)
Gemini face badal deta hai jab expression maango. Isliye:
- Prompt mein kabhi "shocked / smiling / angry face" mat likho.
- Hamesha: "Use the attached photos. Keep every face EXACTLY as in the photo: same expression, same features, no smile/mouth/eye changes, no beautify, no redraw. Only cut out and place."
- Emotion sirf BODY se: haath ki pose, arrow, "?" , emoji sticker. Chehra nahi.

### PAKKA TAREEKA (face kabhi nahi badlega)
Gemini se sirf BACKGROUND + text + arrows banwao, chehre ki jagah KHAALI cut-out slot. Phir asli photos tool ke thumbnail.html ke photo slots mein lagao. Isme face 100% original rehta hai. (Neeche Prompt B.)

---

## PROMPT A (photos ke saath, ek message)

Attach: host photo + khiladi photos (naam likh ke batao kaun si photo kiski).

```
Create a YouTube thumbnail, 16:9, 1280x720, ultra-vibrant, high contrast, professional Indian cricket news channel style.

REFERENCE PHOTOS (attached): Photo 1 = host (right side). Photo 2 = {PLAYER_1}. Photo 3 = {PLAYER_2}. {PHOTO_4_5}

STRICT FACE RULE: keep every face EXACTLY as in its photo. Same expression, same features, same age and skin. Do NOT change smile, eyes, mouth or beard. Do NOT redraw or beautify faces. Only cut out and place them. No new expressions.

LAYOUT:
- Background: {TEAM_COLOURS} split, stadium floodlights, light rays, bokeh, slight smoke. Very saturated.
- Left/centre: {PLAYER_1} and {PLAYER_2} chest-up, big, slightly overlapping, in their {TEAM} jerseys. {SPECIAL: e.g. a white-green double arrow between them / one player greyed out / red circle on the key detail}.
- Right 25%: host, large, chest-up, plain dark jacket, hand pose: {POSE: hand on chin / pointing at the players}. Face unchanged.
- Bottom: huge bold text, two lines, thick black outline.
   Line 1 (white): "{LINE1}"
   Line 2 (yellow): "{LINE2}"
   One word in a red box: "{BOX_WORD}"
- Small tag top right: "{TAG}". Red "?" mark near the key player. One red arrow pointing at the main detail.
- No other text, no watermark, no logos except team colours.
Keep it clean, readable on a phone at small size, text must be spelled exactly as given.
```

## PROMPT B (pakka: khaali face slots + text, photos tool mein lagao)

```
Create a YouTube thumbnail BACKGROUND template, 16:9, 1280x720, ultra-vibrant Indian cricket news style.

Do NOT draw any real person's face. Where people should be, draw clean empty rounded cut-out slots filled with flat neutral grey silhouettes (head and shoulders), so real photos can be placed later:
- {N} slots on the left/centre (size ~ 30% of height each, slightly overlapping), 
- 1 larger slot on the right 25% for the host.

Background: {TEAM_COLOURS} split colour, stadium floodlights, light rays, bokeh, smoke, very saturated.
Add: a double arrow between slot 1 and slot 2 (if swap), a big red "?" , one red arrow, a red circle {DETAIL}.
Bottom: huge bold text, two lines, thick black outline.
   Line 1 (white): "{LINE1}"
   Line 2 (yellow): "{LINE2}"
   One word in a red box: "{BOX_WORD}"
Tag top right: "{TAG}".
Text must be spelled exactly as given. No other text. No faces.
```

---

## TITLE + THUMBNAIL TEXT ka match
Thumbnail ka text title ke hook ko dohrata nahi, usse aage badhata hai.
Title: `THIS TRADE CAN SHOCK IPL!! 😱 Shami to Rajasthan, Curran to Lucknow? | IPL 2027`
Thumbnail text: `SHAMI ↔ CURRAN?` + `Kaun JEETA?`

## NAMUNA — Shami-Curran video (3 concept)

Concept 1 (swap): LINE1 `SHAMI ↔ CURRAN?`, LINE2 `Kaun JEETA?`, BOX_WORD `JEETA`, TAG `IPL 2027`, special = hara-safed swap arrow, host pose = hand on chin.
Concept 2 (paisa): LINE1 `10 Cr vs 2.4 Cr`, LINE2 `Kiska Fayda?`, BOX_WORD `Fayda`, TAG `TRADE`, special = red circle on "10 Cr".
Concept 3 (curiosity): LINE1 `Ek Aur TRADE?`, LINE2 `Siddharth Bhi!`, BOX_WORD `TRADE`, TAG `BREAKING`, special = teesra khiladi (M Siddharth) greyed-out, red "?".

Team colours: Rajasthan (royal blue + pink), Lucknow (teal blue + orange).
Facts sirf Fact Pack se (10 Cr / 2.4 Cr = pichhle saal ke trade, F6).


---
## Tool mein kahan (C186)
news.html ka 📋 Copy (poora prompt) ab "6) THUMBNAIL" step bhi deta hai (js/news_thumbs.js): 7 style ka bank (swap/vs, paisa/number, curiosity, sawaal, tick-cross, breaking, do-team tulna), clickbait + face niyam, team colours, aur Prompt B (default) / Prompt A (jab "A bhi" bolo) templates. Claude har video ke liye 3 alag concept + 3 bhare hue Prompt B code block deta hai.
