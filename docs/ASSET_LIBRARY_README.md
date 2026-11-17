# Cricket Asset Library v1

Cricket YouTube channel ke videos (IPL retention, trade news, India match prediction) ke liye **tag-wise asset library**.
Offline chalta hai. Kuch install nahi karna (rescan.py ke liye Python + Pillow ho to achha, na ho to bhi CSV edit kar sakte ho).

## Kholne ka tareeka
1. Zip extract karo.
2. `gallery.html` browser mein kholo -> upar search box mein tag likho (`kolkata chip`, `stamp retain`, `stadium night`, `P1`...). Sab words AND hote hain.
3. Filter buttons: category aur status (GREEN / YELLOW / RED / TODO).
4. Kisi card par click = file ka path copy.

## Folders
| Folder | Kya hai | Status |
|---|---|---|
| `01_backgrounds/` | 8 stadium/pitch/news/grunge backgrounds + `team_colour/` 10 team backgrounds (1920x1080) | Ready |
| `02_overlays/` | Transparent PNG: Breaking News tags (EN/HI), ticker, SUBSCRIBE ribbon, lower-thirds, photo frame, torn paper, halftone, vignette, light, split divider | Ready |
| `03_stamps/` | RETAIN / RELEASE / WATCH / RUMOUR / OFFICIAL (EN+HI) + "संभावित: ऑफिशियल लिस्ट नहीं" label | Ready |
| `04_team_chips/` | 10 team colour chips (shahar ka naam, **logo nahi**) | Ready |
| `05_player_card_base/` | 10 vertical retain-card bases (team colour, halftone, X pattern, khaali name box) | Ready |
| `06_icons/` | ball, stumps, bat, trade arrows, rupee coin, generic trophy, question/check/cross, gavel | Ready |
| `07_photo_slot_placeholders/` | Silhouette placeholders (jab tak real photo na ho) | Ready |
| `12_city_photos/` | Rahul ke diye asli photos (C47): stadium (bengaluru x2, delhi, chennai x2, kolkata eden, indore, ahmedabad x2, mumbai wankhede), crowd x2, khana cut-out (rasgulla, lassi, vadapav), `bg_green_circle_slot` | Ready (card `bg` mein key do, jaise `12_city_photos/stadium_kolkata_eden_night`) |
| `13_logos/` | IPL logo, KKR logo, IPL trophy, LIVE badge (C48, Rahul ne diye, transparent) | Ready |
| `01_backgrounds/` (naye) | `bg_pitch_stumps_floodlights`, `bg_pitch_stumps_smoke`, `bg_yellow_halftone` (chhote 612 px) + `06_icons/icon_youtube_logo_gradient` | Ready |
| `14_channel_brand/` | Rahul ke diye channel brand assets (C49): templates (frame blue screen+helmet, frame white box+bottom bar, outro host "Visit At", kaun jitega match, split black/red, curve white/black) + text graphics (99, ONLY AT, 99cricketnews.com, GET, Match Prediction) | Ready (key: `14_channel_brand/<naam>`) |
| `13_logos/` (naye C49) | photo_bcci_logo_glass, logo_99cricketnews_blue_yellow, logo_99_icon, logo_99cricketnews_circle | Ready |
| `01_backgrounds/` (naye C49) | bg_channel_stadium_blur_bright, bg_channel_stadium_blur_dark, bg_yellow_texture_wall (500 px chhota) | Ready |
| `12_city_photos/` (naya C49) | stadium_mumbai_wankhede_aerial (650 px chhota) | Ready |
| C50 naye | `13_logos/`: logo_rcb, srh, csk, mi, dc, bcci, kings_xi_punjab_old (purana logo) + badge_live_red_flat. `06_icons/`: icon_vs_orange(_small), icon_vs_red_gold. `02_overlays/`: ov_lower_third_yellow_white, ov_circle_ring_black. `01_backgrounds/`: bg_studio_cricket_stadium_set, bg_stadium_night_floodlights_smoke. `12_city_photos/`: 5 Wankhede photos (night x2, day x2, panorama) | Ready |
| C51 naye | `14_channel_brand/`: tpl_phone_mockup_gold, tpl_promo_app_banner_99cricketnews, tpl_square_99_batsman_stadium. `13_logos/`: logo_rr, logo_99_icon_large, logo_bcci_alt_rough. `06_icons/`: telegram_join_button, check_green_flat, cross_red_brush, subscribe_button, idea_bulb. `01_backgrounds/`: yellow_halftone_burst, baseball_stadium_red_sunset, blue_gradient_glow, black_blue_gradient. `12_city_photos/`: wankhede_panorama_small, photo_ipl_trophy_ribbons, crowd_csk_fan_sign. `09_player_photos/chennai/`: player_chennai_csk_jersey_portrait (YELLOW, license verify) | Ready |
| `08_gemini_generated/` | **Khaali.** Gemini se banakar yahan save karo (backgrounds, city_backdrops, objects, fx) | Prompts ready |
| `09_player_photos/<team>/` | **Khaali.** 90+ khiladiyon ki real licensed photos | Checklist ready |
| `10_gemini_prompts/` | `GEMINI_PROMPTS.md` (copy-paste) + `prompts.csv` | Ready |

Baaki files: `MASTER_INDEX.csv` (har asset + tags + license + status), `PLAYER_PHOTO_CHECKLIST.csv`, `SCENE_TO_ASSET_MAP.md` (kaunsa card -> kaunse assets), `find_asset.py`, `rescan.py`.

## Tag system
- **File naam** hi tag hai: `<type>_<subject>_<detail>.png` (jaise `stamp_retain_green.png`, `bg_team_kolkata.png`, `player_punjab_hardik_pandya_headshoulders.png`).
- **PNG ke andar** bhi tags (Keywords) aur description embed hai (Windows: Properties > Details; Photoshop/Photopea: File Info).
- **MASTER_INDEX.csv** = ek jagah sab kuch: file, category, tags, description, size, transparent, source, license, status.
- Terminal se: `python find_asset.py stamp retain`.

## Status rang (copyright safety)
- **GREEN**: khud ki / original / free-license (+credit ho to credit likha). Safe.
- **YELLOW**: license pata nahi / verify karna hai. Upload se pehle check karo.
- **RED**: news site / Google se li hui. Video mein mat daalo (copyright claim se monetization race bigad sakti hai).
- **TODO**: abhi banana / jama karna baaki.
Is pack ke 74 assets sab **GREEN** hain (original, procedural; koi third-party content, koi real logo nahi).

## Naya asset jodne ka tareeka
1. File ko sahi folder mein daalo (naam convention ke hisaab se).
2. `python rescan.py` chalao: file index mein aa jayegi (YELLOW).
3. `MASTER_INDEX.csv` kholkar tags / source / license / credit bharo, license pakka ho to status GREEN karo.
4. `gallery.html` refresh karo.

## Zaroori rules (is channel ke liye)
- Retain wale cards par hamesha `label_sambhavit_not_official_hi`. RELEASE stamp official list aane tak nahi.
- Team ke asli logos nahi, sirf `chip_*` / team-colour use karo.
- Real khiladiyon ke chehre AI se mat banao; real, licensed photo hi (`PLAYER_PHOTO_CHECKLIST.csv`).
- Wikimedia Commons ki photo CC-BY/CC-BY-SA ho to description mein credit dena zaroori hai.
