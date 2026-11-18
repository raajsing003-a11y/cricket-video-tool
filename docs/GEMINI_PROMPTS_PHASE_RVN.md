# Gemini prompts — Phase R / B / V / N ke chunks ke liye assets (C78)
Rule: sirf ORIGINAL cheezein. Kisi reference video ka logo, channel naam, cartoon, chehra, thumbnail copy nahi. Koi real player ka chehra nahi (photos Rahul khud upload karta hai). Fantasy/Dream11/betting kuch nahi.

## Kaise use karna hai
1. Har prompt ke aage BASE line jodo (neeche). Gemini mein ek ek prompt alag chalao, 2-3 variation lo, best rakho.
2. TRANSPARENT wali cheezein "flat pure green #00B140 background" par banwao (Gemini asli transparent nahi deta) — tool hara hata deta hai. Poore bg wali cheezein (A section) green par NAHI.
3. File ka naam wahi rakho jo prompt ke aage likha hai. Phir sab ek zip karke naye chat mein do; main assets/ mein daal dunga.
4. Pehle P1 (zaroori) wale banao, baaki baad mein. Sab ek saath zaroori nahi.

## BASE line (har prompt ke saath)
"High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character."
Transparent wale mein add: "on a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself."

---
## A. BACKGROUNDS (16:9, 1920x1080, poora bg — green NAHI) — P1
A1 `bg_charcoal_stripe_glow.png` — "Dark charcoal blue studio wall with very subtle vertical stripe panels, soft blue light glow from the right edge, gentle vignette, premium minimal, no objects."
A2 `bg_royal_blue_grid_diamond.png` — "Royal blue background with a faint grid and a subtle diamond pattern, soft vignette, flat modern, a clean empty area in the middle."
A3 `bg_dark_navy_bokeh.png` — "Very dark navy background with soft blurred bokeh lights and faint topographic contour lines, cyan tint, cinematic, empty centre."
A4 `bg_navy_neon_lines.png` — "Deep navy to black background with thin vertical neon blue glow lines, faint particles, empty centre, glossy dark look."
A5 `bg_cricket_ground_dark_topview.png` — "Top-down view of a cricket ground at night, dark teal and navy tones, thin white boundary rope circle and 30-yard circle lines, pitch rectangle in the centre, no players, no text."
A6 `bg_paper_cloth_texture_grey.png` — "Rough light grey cloth and paper texture, soft light falling from the top left, subtle grain, empty."
A7 `bg_black_grain_dark.png` — "Near-black background with fine film grain and a very soft blue haze at the bottom, empty."
(Vertical 9:16 versions chahiye to A1, A3, A4 ke prompt mein "vertical 9:16, 1080x1920" likho: `_v` naam se.)

## B. SILHOUETTES / CHARACTERS (green bg) — P1
B1 `sil_batter_yellow.png` — "Flat solid yellow silhouette of a cricket batter in follow-through pose, no inner detail, crisp edges."
B2 `sil_bowler_yellow.png` — same, bowler in delivery stride.
B3 `sil_fielder_catch_yellow.png` — same, fielder diving for a catch.
B4 `sil_keeper_yellow.png` — same, wicketkeeper crouched behind stumps.
B5 `sil_umpire_yellow.png` — same, umpire with raised finger.
B6 `sil_crowd_row_yellow.png` — "Wide row of flat yellow silhouettes of stadium spectators (men, women, kids) standing and cheering, one horizontal strip, crisp edges."
B7 `sil_batter_blue_duotone.png` — "Cricket batter standing full body, rendered as deep royal blue duotone with soft white fade at the feet, no face detail, like a stylised cut-out."
B8 `sil_player_head_blue.png` — "Side-profile silhouette of a head in royal blue duotone with thin white line pattern inside, abstract."
Sab ke ek ek color variant (white, cyan, red) chahiye to "same but flat white" likh ke 4 aur banao (naam `_white`, `_cyan`, `_red`).

## C. ICON TILES (green bg) — P1
Style: "Glossy rounded-square glass tile, dark inner gradient, thin light border, soft glow, one centred icon."
C1 `tile_bat_red.png` — tile with a cricket bat icon, red glow.
C2 `tile_ball_green.png` — cricket ball, green glow.
C3 `tile_stumps_yellow.png` — stumps and bails, yellow glow.
C4 `tile_helmet_blue.png` — batting helmet, blue glow.
C5 `tile_trophy_gold.png` — trophy, gold glow.
C6 `tile_scoreboard_cyan.png` — scoreboard, cyan glow.
C7 `tile_stadium_purple.png` — stadium floodlights, purple glow.
C8 `tile_mic_red.png` — microphone, red glow (voice-over).
C9 `tile_headphone_green.png` — headphones, green glow.
C10 `tile_magic_blue.png` — sparkle magic wand, blue glow (AI/polish).
C11 `tile_music_yellow.png` — music note, yellow glow.
C12 `tile_phone_white.png` — smartphone, white glow.
C13 `tile_gloves_orange.png` — wicketkeeping gloves, orange glow.
C14 `tile_replay_cyan.png` — replay / rewind arrow, cyan glow.
Plain white rounded tile (flat, soft shadow) versions (`tileflat_*`) sirf C1,C2,C3,C5,C8,C9 ke liye (flat colourful icons on white).

## D. NEON STEP CARDS (green bg) — P1
D1 `card_neon_blue_blank.png` — "Vertical playing-card shape, bright neon blue glowing border, deep blue inner with fine ornamental line pattern, empty centre, slight 3D tilt-free front view."
D2 `card_neon_blue_stack3.png` — "Three such neon blue cards fanned like a hand of playing cards, empty centres."
D3 `card_neon_red_blank.png`, D4 `card_neon_yellow_blank.png` — same card in red and yellow neon.

## E. FRAMES / UI MOCKS (green bg, EMPTY screens) — P1
E1 `frame_phone_vertical.png` — "Modern black smartphone in vertical orientation, front view, screen filled with flat pure magenta #FF00FF (to be replaced), thin bezel, rounded corners."
E2 `frame_phone_landscape.png` — same, landscape.
E3 `frame_browser_window.png` — "Empty browser window, light theme, rounded corners, three small dots at the top left, blank address bar with no text, blank white page area, soft shadow."
E4 `frame_browser_window_dark.png` — dark theme version.
E5 `frame_tv.png` — "Flat screen TV front view, thin bezel, screen filled flat magenta #FF00FF."
E6 `frame_laptop.png` — "Laptop front view open, screen flat magenta #FF00FF."
E7 `card_tweet_blank.png` — "Empty social media post card, white, rounded corners, a blank circle avatar, grey placeholder lines for name and text, tiny heart/comment/share icons, no real names or logos."
E8 `card_comment_blank_dark.png` — "Dark glass comment card, rounded, circle avatar placeholder at left, grey placeholder lines, thin light border."
E9 `ui_scoreboard_dark.png` — "Cricket scoreboard UI card, dark, two team rows with empty blank logo circles, placeholder score numbers as grey bars, overs column, no real team names."
E10 `ui_departures_board.png` — "Dark airport-style departures board, rows of amber blank flip segments, no text."
E11 `ui_chat_window_dark.png` — "Dark chat/terminal window, rounded corners, empty input bar at the bottom, no text."
E12 `ui_figma_like_board.png` — "Light grey infinite canvas board with many small vertical blank phone-card rectangles in a grid and frames, flat design, no text."
E13 `ui_audio_waveform_panel.png` — "Dark audio editor panel with green waveform, level meter at top, play/record buttons, no text."

## F. PROPS (green bg) — P2
F1 `prop_folder_red.png` — glossy red file folder, closed. F2 `prop_folder_open_locked.png` — folder with a small padlock.
F3 `prop_doc_paper.png` — "White paper sheet slightly curled corner, grey placeholder lines and a bold empty title bar, no readable text."
F4 `prop_microphone_black.png` — studio condenser microphone on a boom arm, front view.
F5 `prop_mic_crossed_price.png` — microphone with a red diagonal cross and an empty red price badge.
F6 `prop_cursor_arrow.png` — white mouse cursor arrow with soft shadow. F7 `prop_cursor_click_ripple.png` — cursor with a blue click ripple circle. F8 `prop_hand_tap_dot.png` — soft translucent circle (finger tap dot) with ring.
F9 `prop_magnifier.png` — brass magnifying glass, front view.
F10 `prop_stopwatch.png` — stopwatch icon, glossy. F11 `prop_calendar_page_blank.png` — blank desk calendar page with a grid, no numbers.
F12 `prop_padlock_gold.png` — closed gold padlock. F13 `prop_stamp_closed_red.png` — red rubber "CLOSED" stamp, distressed (text CLOSED allowed).
F14 `prop_pie_chart_blank.png`, F15 `prop_handshake_icon.png` — flat, blue + white.
F16 `prop_ticket_stub.png` — blank stadium ticket stub; F17 `prop_seats_row.png` — row of stadium seats front view, one yellow.
F18 `prop_wheel_tilted_layers.png` — 4 translucent glass layers stacked in 3D tilt, no text (for network/stack scene).

## G. BUTTONS / PILLS / BADGES (green bg) — P1
G1 `pill_cta_blue.png` — "Rounded pill button, glossy blue gradient, soft glow, empty (no text)."
G2 `pill_cta_yellow.png`, G3 `pill_cta_red.png`, G4 `pill_cta_green.png` — same, other colours.
G5 `pill_label_red.png`, G6 `pill_label_green.png`, G7 `pill_label_yellow.png`, G8 `pill_label_blue.png` — "Small rounded label pill, glossy, empty."
G9 `badge_percent_circle_yellow.png`, G10 `badge_price_red.png` — empty round/rectangular badge.
G11 `toggle_off.png`, G12 `toggle_on_blue.png` — iOS-like toggle switch.
G13 `check_circle_green.png`, G14 `cross_circle_red.png` — glossy circle with tick / cross.
G15 `arrow_curved_white_thin.png`, G16 `arrow_straight_white_thin.png`, G17 `arrow_chevron_yellow_row.png` — thin white annotation arrows and a row of yellow chevrons.
G18 `badge_subscribe_bell.png` — red subscribe button + bell (original, no YouTube logo).
G19 `badge_question_marks.png` — two floating "?" marks, white with blue glow.

## H. TRANSITIONS / WIPES (green bg) — P2
H1 `wipe_yellow_split_panels.png` — two yellow panels with a diagonal split, meeting in the middle, flat.
H2 `wipe_torn_paper_yellow.png` — long torn yellow paper strip horizontal, rough edges.
H3 `wipe_chevron_sweep_yellow.png` — big yellow chevron arrows pointing right, 3 stacked.
H4 `wipe_ink_splash_blue.png` — blue ink splash filling frame.
H5 `wipe_light_leak_orange.png` — orange light leak streak on black (use black bg, NOT green).
H6 `wipe_lens_flare_white.png` — white lens flare on black (black bg).

## I. B&W / HALFTONE GENERIC PORTRAITS (green bg) — P2
(Real chehra nahi — generic, kisi se milta hua nahi.)
I1 `portrait_generic_man_bw_halftone.png`, I2 `portrait_generic_man_old_bw.png`, I3 `portrait_generic_woman_bw.png`, I4 `portrait_generic_cricketer_bw.png`, I5 `portrait_generic_commentator_bw.png` — "Black and white halftone-dot head-and-shoulders portrait of a fictional [man/woman/cricketer wearing a cap], looking slightly to the side, high contrast, crisp cutout edges."
I6 `collage_polaroids_tilted.png` — "3 blank tilted polaroid photo frames overlapping, flat, empty photos (light grey)."

## J. MAPS / DIAGRAMS (green bg) — P2
J1 `map_india_dot.png` — "India outline made of small round dots, flat, cyan dots on transparent, clean."
J2 `map_world_dot.png` — world map made of dots, flat cyan.
J3 `map_india_states_flat.png` — India states outline, flat blue with thin white borders, no labels.
J4 `diagram_field_positions.png` — "Top-down cricket field with the pitch and 11 empty circle positions, thin white lines, no names."

## K. PRESENTER (green bg) — P1 (Rahul ki photo se)
Existing 6 expressions (GEMINI_GREENSCREEN_PROMPTS.md) ke ALAWA:
K1 `presenter_point_left.png` — "...pointing with index finger to the left side of the frame."
K2 `presenter_point_right.png` — pointing to the right.
K3 `presenter_hold_phone.png` — holding a smartphone in one hand at chest height.
K4 `presenter_hold_mic.png` — holding a small handheld microphone near the mouth.
K5 `presenter_hands_open_explain.png`, K6 `presenter_counting_fingers.png` — "counting on fingers, three fingers raised".
K7 `presenter_arms_crossed_serious.png`, K8 `presenter_hands_on_hips.png`.
(Base prompt wahi purana: Rahul ki reference photo + half-body 4:5 + hara bg.)

## L. ORIGINAL ILLUSTRATED HOST (optional, green bg) — P3
Agar Rahul chahe toh ek ORIGINAL cartoon cricket host (kisi mashhoor character jaisa nahi): "Original 2D anime-style illustrated young cricket analyst, short dark hair, plain dark t-shirt, friendly face, half body, flat colours, clean outlines." Poses: L1 waving, L2 pointing left, L3 thinking, L4 holding phone, L5 holding board (blank), L6 thumbs-up. Naam `host_ill_*.png`.

## M. TEXTURE OVERLAYS (alag: black bg, NOT green; tool 'screen' blend karega) — P2
M1 `ov_film_grain.png`, M2 `ov_dust_scratches.png`, M3 `ov_bokeh_particles_blue.png`, M4 `ov_smoke_wisps.png`, M5 `ov_paper_fibres_white.png` — "[X] on pure black background, high contrast, seamless, 1920x1080."

---
## Kaun sa chunk kis section se (taaki zaroorat ke hisaab se banao)
- G2 (push-in/drift) + bg moving texture: A1-A7, M1-M5
- G5/G10 text styles: koi image nahi (code)
- G9 pop-in + N1 icon tiles: C1-C14, G5-G8
- N2 step cards: D1-D4
- N3/N4 + G8 spotlight (screen clip): E1-E3, E13, F8
- R1 clip layer + presenter: K1-K8, E5, E1
- R2 chapter card, V1/V2: A1/A2, C-tiles (chapter ke 3 icon), G1
- R3 kinetic text: I1-I6, A2, B-silhouettes
- R4/B1/B5 chart + count-up: code hi (koi image nahi); bg A2/A3
- R5 quote card: I1-I5, B6, B7
- R6/B3 post + document: E7, E3, F3, F6, F7
- R7 icon scene + R16 seats: C-tiles, F16, F17, G1, F6/F7
- R8/H transitions: H1-H6
- B2 calendar, B12 clocks, B16 countdown, B8/B21 dot grid: code hi
- B4 dot-map + counter: J1-J3
- B6 ranked list + CLOSED stamp: F13, G9-G10
- B7/V15 terminal/chat: E11
- B9/R11 lower-third: code hi (+ existing ov_lowerthird_*)
- B10 split compare: E3/E4, G13/G14
- B11/N7/V12/R14 subscribe/end screen: G1-G4, G18, E5
- B15 folder + locked: F1, F2, F12
- B17 redaction blur: code hi
- B20 3D layers: F18
- V4/V5 phone-frame + annotation arrows (G6): E1, G15-G17, B7
- V6/V8 numbered card grid + plan cards: C-tiles, G9
- V9 time list: code hi; V14 label chips: G5-G8
- N5 toggle pills: G11-G14
- N6 comment card: E8, F9, G19
- N8/N13 outline words + measure label: code + G15-G17, K3
- N9 diagram mic->AI: C8, C10, G15

## Code se banenge (Gemini ki zaroorat NAHI)
Charts/bars/count-up, calendar, clocks, countdown ring, dot/cell grids, terminal typing, lower-thirds, serif-italic accent text, neon glow text, annotation arrow draw, redaction blur, ranked list, time list, price cards, 3D tilt, waveform strip.

## Priority
P1 (pehle, ~60 files): A1-A4, B1-B8, C1-C14, D1-D4, E1-E3, E7-E8, G1-G19, K1-K8.
P2 (baad mein): A5-A7, E4-E6, E9-E13, F, H, I, J, M.
P3 (optional): L.

## Y. VIDEO 6 (Y-A1..Y-C9) — Gemini prompts
LIBRARY STATUS (C92 check): ye pehle se assets mein HAIN, dobara mat banwao: Y-A1/A2 (bg_blue_radial_glow_dark + bg_portrait_blue_radial_glow_dark), Y-B1..B4 (ui_avatar_circle blue/yellow/orange/teal), Y-C1 (ui_video_player_purple), Y-C2 (ui_settings_panel_dark), Y-C5/C6 (icon_emoji_bored/smile), Y-C7 (btn_pill_blue_lock), Y-C8 (icon_stars_rating_4of5), Y-C9 (icon_tile_glass_idea_bulb_yellow). SIRF 2 BAAKI: Y-C3 (sign-in card) aur Y-C4 (before/after thumbnail pair).

Pehle se kaam aayenge (dobara nahi banwana): A2/A3/A4 bg, C tiles, D cards, E1 phone, E3/E4 browser, E7/E8 comment cards, E9 scoreboard, G1-G19 pills/badges/arrows, F6/F7 cursor, F8 tap-dot, F12 padlock, K presenter, J1 India map, I6 polaroid.
Code se banenge (Gemini nahi): charts/curves, count-up, bar-race, tick-grid, dot-grid, gauge, header line, pills, 3D list, highlight box, typewriter, formula card.

BASE (har prompt mein): High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character.
GREEN (jahan green bg): On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.

### P1 — zaroori (pehle ye 6)
```
# Y-A1 bg_navy_radial_glow.png  (green NAHI)
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Deep navy blue background with a soft blue radial glow in the centre, dark vignette at the edges, smooth gradient, premium minimal, empty. 16:9, 1920x1080.
```
```
# Y-A2 bg_navy_radial_glow_v.png  (green NAHI)
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Deep navy blue background with a soft blue radial glow in the centre, dark vignette at the edges, smooth gradient, premium minimal, empty. Vertical 9:16, 1080x1920.
```
```
# Y-B1 avatar_blue_circle.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Flat round avatar icon, blue circle with a white generic person silhouette (head and shoulders), soft glow, no face details. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-B2 avatar_yellow_circle.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Flat round avatar icon, yellow circle with a dark generic person silhouette (head and shoulders), soft glow, no face details. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-B3 avatar_orange_circle.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Flat round avatar icon, orange circle with a white generic person silhouette (head and shoulders), soft glow, no face details. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-B4 avatar_teal_circle.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Flat round avatar icon, teal circle with a white generic person silhouette (head and shoulders), soft glow, no face details. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```

### P2 — baad mein
```
# Y-C1 frame_video_player_blank.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Empty video player window, 16:9, rounded corners, flat purple placeholder area, bottom control bar with play button, progress bar and small icons, no text. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C2 frame_settings_panel_dark.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Empty dark settings window, rounded corners, left sidebar with 6 blank grey menu rows, top row with 3 blank tabs, right area with blank grey input boxes and toggles, no text. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C3 frame_signin_card_dark.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Empty dark sign-up card, rounded corners, a large blue circle avatar at the top, two blank input fields and a blank button below, no text. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C4 badge_before_after_thumb_pair.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Two blank 16:9 thumbnail frames side by side with flat grey placeholder photos, the left one with a red cross badge, the right one with a green tick badge, rounded corners, no text. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C5 icon_emoji_bored.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Original flat yellow round emoji-style face with a bored, flat mouth and half-closed eyes, soft glow, no copyrighted emoji style. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C6 icon_emoji_smile.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Original flat yellow round emoji-style face with a happy smile, soft glow, no copyrighted emoji style. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C7 icon_lock_pill_blue.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Small glossy dark-blue rounded pill with a thin light border and a small yellow padlock icon at the left, empty (no text). On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C8 icon_star_rating_row.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. A row of five glossy golden stars, four filled and the last one empty outline, soft glow. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
```
# Y-C9 icon_bulb_tile_yellow.png
High resolution, clean sharp edges, no text unless I wrote it, no watermark, no logo, no real person, no copyrighted character. Glossy rounded-square glass tile, dark inner gradient, thin light border, soft glow, one centred icon: a light bulb, yellow glow. On a flat solid pure green #00B140 background, even lighting, no shadow on the background, no green on the object itself.
```
