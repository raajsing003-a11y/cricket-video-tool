# GEMINI PROMPTS (copy-paste)

Har prompt ke saath **file ka naam** diya hai. Generate hone ke baad image ko usi naam se `08_gemini_generated/...` mein save karo, phir `python rescan.py` chalao, index apne aap update ho jayega.

**Rules (zaroori):**
- Prompt mein hamesha "no text, no logos, no watermark" rakho; Gemini real team logos / jersey galat banata hai.
- **Asli khiladiyon ke chehre Gemini se generate mat karo.** Galat/fake photo = misinformation + policy issue. Khiladiyon ke liye `PLAYER_PHOTO_CHECKLIST.csv` dekho (real, licensed photo).
- Gemini PNG ko transparent nahi banata. Isliye object prompts mein **green (#00FF00) background** maanga hai; phir background remover (E08) se transparent PNG.
- Gemini ki images par invisible AI watermark (SynthID) hota hai. YouTube Studio mein "altered/synthetic content" disclosure ka sawal aaye to realistic stadium/pitch scenes ke liye sahi jawab dena.
- Ek baar mein 4 options maango ("generate 4 variations"), best wala rakho.

**Common suffix (background prompts ke end mein jodo):** `16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people`

---
## A. Backgrounds (16:9)

### G01 - Stadium din mein (wide)
- Save as: `08_gemini_generated/backgrounds/bg_stadium_day_wide_empty.png`
- Tags: stadium,day,wide,empty,background
```
Wide shot of a large modern cricket stadium in bright daylight, empty stands, perfectly mowed green outfield with a pale pitch strip in the centre, blue sky with soft clouds, shallow depth of field, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G02 - Stadium raat, floodlights
- Save as: `08_gemini_generated/backgrounds/bg_stadium_night_floodlights.png`
- Tags: stadium,night,floodlights,background
```
Cricket stadium at night under bright floodlights, glowing stands with blurred crowd lights, vivid green outfield, light haze in the air, dramatic atmosphere, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G03 - Stadium sunset
- Save as: `08_gemini_generated/backgrounds/bg_stadium_sunset_golden.png`
- Tags: stadium,sunset,golden-hour,background
```
Cricket stadium at golden hour sunset, warm orange and purple sky, long soft shadows on the outfield, silhouetted stands, slightly blurred background style, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G04 - Stadium upar se (drone)
- Save as: `08_gemini_generated/backgrounds/bg_stadium_aerial_night.png`
- Tags: stadium,aerial,drone,night,background
```
Aerial drone view of a cricket stadium at night with floodlights, circular stands, glowing green field and pitch strip, city lights in the distance, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G05 - Sookhi pitch (spin)
- Save as: `08_gemini_generated/backgrounds/bg_pitch_dry_cracked_closeup.png`
- Tags: pitch,dry,cracks,spin,closeup,prediction
```
Close-up low-angle of a dry, cracked, dusty cricket pitch with worn patches outside the crease, afternoon light, shallow depth of field, stumps blurred at the far end, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G06 - Hari pitch (seam/pace)
- Save as: `08_gemini_generated/backgrounds/bg_pitch_green_seam.png`
- Tags: pitch,green,grass,seam,pace,prediction
```
Close-up of a fresh green cricket pitch with a visible grass covering, dew, morning light, seam-friendly look, stumps blurred in the background, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G07 - Flat batting pitch
- Save as: `08_gemini_generated/backgrounds/bg_pitch_flat_batting.png`
- Tags: pitch,flat,batting,hard,prediction
```
A hard, flat, even brown cricket pitch with clean white creases, evenly rolled, floodlights in the distance, ready for a run-fest, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G08 - Low angle stumps + ball
- Save as: `08_gemini_generated/backgrounds/bg_pitch_lowangle_stumps_ball.png`
- Tags: pitch,stumps,ball,low-angle,drama
```
Very low-angle dramatic shot from pitch level toward a set of stumps, a red cricket ball resting on the pitch in the foreground, blurred stadium lights behind, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G09 - Boundary rope macro
- Save as: `08_gemini_generated/backgrounds/bg_boundary_rope_grass_macro.png`
- Tags: boundary,rope,grass,macro,background
```
Macro shot of a cricket boundary rope on fresh green grass, shallow depth of field, stadium blurred in the background, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G10 - Crowd (blur)
- Save as: `08_gemini_generated/backgrounds/bg_crowd_silhouette_blur.png`
- Tags: crowd,stands,silhouette,blur,background
```
Heavily blurred packed stadium crowd at night with colourful bokeh lights, silhouettes of fans cheering, no readable details, no faces, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G11 - Floodlight towers
- Save as: `08_gemini_generated/backgrounds/bg_floodlight_towers_dusk.png`
- Tags: floodlights,towers,dusk,background
```
Tall stadium floodlight towers glowing against a deep blue dusk sky, lens flares, silhouetted stand roof, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G12 - Nets practice
- Save as: `08_gemini_generated/backgrounds/bg_nets_practice_empty.png`
- Tags: nets,practice,empty,training,background
```
Empty cricket practice nets at a training ground in the early morning, soft mist, green netting, scattered cricket balls, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G13 - Dressing room (generic)
- Save as: `08_gemini_generated/backgrounds/bg_dressing_room_generic.png`
- Tags: dressing-room,lockers,empty,generic,background
```
Empty cricket dressing room with wooden lockers and benches, generic unbranded kits hanging, warm lighting, no names, no logos, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G14 - Press conference stage
- Save as: `08_gemini_generated/backgrounds/bg_press_conference_generic.png`
- Tags: press-conference,stage,generic,background
```
Generic press-conference stage with a table, microphones and a plain dark blue backdrop with no text and no logos, soft spotlights, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G15 - Auction hall (generic)
- Save as: `08_gemini_generated/backgrounds/bg_auction_hall_generic.png`
- Tags: auction,hall,generic,mini-auction,background
```
Generic sports auction hall with rows of empty chairs, a podium and large blank screens, elegant lighting, no text, no logos, no people, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G16 - News studio (blank)
- Save as: `08_gemini_generated/backgrounds/bg_tv_news_studio_blank.png`
- Tags: tv,news,studio,desk,blank-screens,background
```
Modern TV sports news studio with an empty anchor desk and large blank LED screens, blue and red accent lighting, no text, no logos, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G17 - Scoreboard blank
- Save as: `08_gemini_generated/backgrounds/bg_scoreboard_blank.png`
- Tags: scoreboard,blank,stadium,generic
```
Large stadium LED scoreboard that is blank/dark, seen from the stands at dusk, no numbers, no text, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G18 - Barish + covers
- Save as: `08_gemini_generated/backgrounds/bg_rain_covers_pitch.png`
- Tags: rain,covers,pitch,weather,background
```
Cricket pitch covered with blue-grey rain covers under heavy rain, wet outfield reflecting stadium lights, moody atmosphere, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G19 - Gear flat-lay
- Save as: `08_gemini_generated/backgrounds/bg_gear_flatlay_generic.png`
- Tags: gear,flatlay,bat,ball,helmet,generic,background
```
Top-down flat-lay of generic unbranded cricket gear (bat, red ball, helmet, gloves) on a dark wooden surface, dramatic side lighting, lots of empty space on the left, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

### G20 - Generic gold trophy
- Save as: `08_gemini_generated/backgrounds/bg_trophy_gold_generic_spotlight.png`
- Tags: trophy,gold,generic,spotlight,title
```
A generic ornate golden cup trophy (NOT any real tournament trophy) on a pedestal in a dark room with a single dramatic spotlight and golden dust particles, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```

---
## B. City backdrops (10 teams, ek hi template)

Team cards ke peeche shahar ka feel. **Template** (CITY badlo):
```
Stylised blurred skyline of [CITY] with its famous landmark at golden hour dusk, soft depth of field, warm tones, 16:9 widescreen, 1920x1080, photorealistic, cinematic lighting, no text, no letters, no logos, no watermark, no real team jerseys or brand names, no people
```
Cities: Kolkata, Lucknow, Chennai, Mumbai, Hyderabad, Punjab (Chandigarh/Mohali), Delhi, Ahmedabad (Gujarat), Jaipur (Rajasthan), Bengaluru. Save as: `08_gemini_generated/city_backdrops/city_<key>.png` (key: kolkata, lucknow, chennai, mumbai, hyderabad, punjab, delhi, gujarat, rajasthan, bengaluru). Tags: city,backdrop,<key>,skyline.

---
## C. Objects (green background -> cutout)

### G31 - Red ball
- Save as: `08_gemini_generated/objects/obj_ball_red.png` (cutout ke baad `obj_ball_red_cutout.png`)
- Tags: ball,red,leather,object
```
A single shiny red leather cricket ball with white-stitched seam, slight scuffs, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G32 - White ball
- Save as: `08_gemini_generated/objects/obj_ball_white.png` (cutout ke baad `obj_ball_white_cutout.png`)
- Tags: ball,white,odi,object
```
A single white leather cricket ball with dark green stitched seam, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G33 - Bat
- Save as: `08_gemini_generated/objects/obj_bat_willow.png` (cutout ke baad `obj_bat_willow_cutout.png`)
- Tags: bat,willow,object
```
A single unbranded cricket bat, English willow, standing at a slight angle, no stickers, no logos, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G34 - Helmet
- Save as: `08_gemini_generated/objects/obj_helmet_generic.png` (cutout ke baad `obj_helmet_generic_cutout.png`)
- Tags: helmet,generic,object
```
A generic unbranded navy blue cricket batting helmet with grille, no logos, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G35 - Gloves + pads
- Save as: `08_gemini_generated/objects/obj_gloves_pads_generic.png` (cutout ke baad `obj_gloves_pads_generic_cutout.png`)
- Tags: gloves,pads,generic,object
```
A pair of unbranded white batting gloves resting on a pair of batting pads, no logos, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G36 - Stumps + bails
- Save as: `08_gemini_generated/objects/obj_stumps_bails.png` (cutout ke baad `obj_stumps_bails_cutout.png`)
- Tags: stumps,bails,wicket,object
```
Three wooden cricket stumps with two bails, standing upright, one bail flying off slightly, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G37 - Cap
- Save as: `08_gemini_generated/objects/obj_cap_generic.png` (cutout ke baad `obj_cap_generic_cutout.png`)
- Tags: cap,generic,object
```
A plain unbranded navy cricket cap, no logos or text, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G38 - Gold coins (paisa)
- Save as: `08_gemini_generated/objects/obj_gold_coins_stack.png` (cutout ke baad `obj_gold_coins_stack_cutout.png`)
- Tags: coins,gold,money,crore,object
```
A tall stack of shiny gold coins with a few scattered coins in front, no text, no currency symbols, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G39 - Microphone
- Save as: `08_gemini_generated/objects/obj_microphone.png` (cutout ke baad `obj_microphone_cutout.png`)
- Tags: microphone,news,object
```
A generic broadcast microphone with a plain black windscreen, no logo, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

### G40 - Deadline clock
- Save as: `08_gemini_generated/objects/obj_whistle_clock.png` (cutout ke baad `obj_whistle_clock_cutout.png`)
- Tags: deadline,clock,object
```
A vintage alarm clock with red face showing near midnight, no brand, isolated single object centred on a completely flat pure green (#00FF00) background, no shadow on the background, sharp edges, studio lighting, no text, no logos, no watermark, square 1:1, high resolution
```

---
## D. FX overlays (black background, Screen blend)

### G51 - Gold sparks (screen blend)
- Save as: `08_gemini_generated/fx/fx_gold_sparks_black.png`
- Tags: fx,sparks,gold,confetti,overlay,screen-blend
```
Golden glowing sparks and confetti particles floating on a pure black background, 16:9, no text. (Video editor mein blend mode = Screen/Add, black gayab ho jayega)
```

### G52 - Light leak (screen blend)
- Save as: `08_gemini_generated/fx/fx_light_leaks_black.png`
- Tags: fx,light-leak,red,orange,overlay,screen-blend
```
Warm red-orange anamorphic light leaks and lens flares on a pure black background, 16:9, no text
```

### G53 - Smoke (screen blend)
- Save as: `08_gemini_generated/fx/fx_smoke_black.png`
- Tags: fx,smoke,fog,overlay,screen-blend
```
Wispy white smoke and fog drifting on a pure black background, 16:9, no text
```

### G54 - Grunge/scratches
- Save as: `08_gemini_generated/fx/fx_grunge_scratches_black.png`
- Tags: fx,grunge,scratches,dust,overlay,screen-blend
```
White film scratches, dust and grunge texture on a pure black background, 16:9, no text
```

---
## E. EDIT prompts (apni / licensed photo upload karke)

> Dhyan: edit karne se copyright nahi hatta. Photo ka license pehle clear hona chahiye (Wikimedia CC credit ke saath, ya khud ki / khareedi hui). Gemini kai baar real logon ke chehre wale edits refuse kar deta hai; us case mein Photopea / Canva / remove.bg use karo.

### E01 - Background hatana (cutout)
_Apni/licensed photo upload karke:_
```
Remove the background from this photo and place the person on a flat pure green (#00FF00) background. Keep hair edges and jersey edges clean. Do not change the face, pose or clothing.
```

### E02 - 16:9 mein extend karna
_Photo portrait hai, video 16:9 chahiye:_
```
Extend this photo to 16:9 widescreen by naturally continuing the background to the left and right. Do not change the subject at all.
```

### E03 - Team-colour duotone
_Card background ke liye:_
```
Convert this photo into a stylish duotone using dark navy shadows and bright [TEAM COLOUR e.g. yellow] highlights, high contrast, subtle grain. Keep the subject clearly recognisable.
```

### E04 - Blur stadium background
_Photo ko news-style bana do:_
```
Keep the main subject sharp. Replace the background with a heavily blurred stadium at night with bokeh floodlights. Match the lighting direction on the subject.
```

### E05 - Photo quality / upscale
_Chhoti ya dhundhli photo:_
```
Increase the sharpness and resolution of this photo, reduce noise and compression artifacts. Do not alter the face, expression or any details.
```

### E06 - Lighting match
_Kai photos ko ek jaisa dikhana:_
```
Adjust the lighting and colour grade of this photo to look like a dramatic night-match broadcast: slightly higher contrast, warm skin tones, cool shadows. Do not alter the face.
```

### E07 - Asset ko variation dena
_Gemini-generated background se aur versions:_
```
Create a variation of this image with the same composition but different time of day: [night / sunset / foggy morning]. Keep it free of text and logos.
```

### E08 - Green-screen se transparent PNG
_Gemini PNG transparent nahi deta:_
```
Tool, not prompt: Photopea / Canva (Background Remover) / remove.bg / ffmpeg colorkey. ffmpeg: ffmpeg -i in.png -vf "colorkey=0x00FF00:0.3:0.1" out.png
```
