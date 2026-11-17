# Aapke video ke har card type ke liye kaunse assets chahiye

Aapka IPL Retention video (`final_video/TIMING.txt`) 49 cards ka hai: Hook (4), 10 teams x 3-6 cards, Anth (3).

| Card type (build_cards.py) | Kahan aata hai | Background | Overlay / tag | Photo slot | Icon |
|---|---|---|---|---|---|
| **hook / stat** (sabse bada sawal 1,2,3) | Shuru ke 36 sec | `bg_grunge_red_halftone` ya `bg_stadium_night_blur` | `stamp_*`, `ribbon_subscribe_now` | Pooran, Pathirana, Cummins (P1) | `rupee_coin`, `question_badge` |
| **hook / list** (deadline 17 Nov) | 0:36 | `bg_stadium_night_blur` | `ov_tag_breaking_news_hi`, `ov_ticker_bar_white_empty` | - | `auction_gavel` |
| **title** (team ka shahar) | Har team ka pehla card | `team_colour/bg_team_<city>` | `chip_<city>`, `ov_tag_breaking_news_hi` | - (ya `city_<key>` backdrop) | `trophy_generic` |
| **list** (ऑफिशियल ट्रेड) | LSG, CSK, MI, DC | `bg_news_control_room` | `ov_lowerthird_blue`, `stamp_official_blue` | 2 photos (split-screen) + `ov_split_divider_green` | `trade_arrows` |
| **stat** (Rs. card: 43.20 cr, 21 cr, 18 cr...) | KKR, LSG, PBKS, RR | `bg_stadium_sunset_blur` | `ov_photo_frame_white`, `ov_lowerthird_red` | 1 photo, white frame | `rupee_coin` |
| **names** (रिटेन हो सकते हैं) | Har team | `team_colour/bg_team_<city>` | `card_vertical_<city>`, `stamp_retain_green`, **`label_sambhavit_not_official_hi` (zaroori)** | 1 photo per card (P1/P2) | `check_green` |
| **watch** (नज़र रहेगी) | Har team ka aakhri card | `bg_floodlight_blue` | `stamp_watch_amber` | 1-2 photos | `question_badge` |
| **rumour** (DC, GT) | DC, GT | `bg_news_control_room` | `stamp_rumour_orange` | - | `trade_arrows` |
| **Dhoni?** | CSK | `bg_stadium_sunset_blur` | `ov_photo_frame_white` | MS Dhoni (P1) | `question_badge` |
| **anth** (3 sawal, aapki raay, comment) | Aakhri 40 sec | `bg_grunge_red_halftone` | `ov_ribbon_subscribe_now` | - | `question_badge`, `check_green` |
| **Intro** | Video ka start | `bg_paper_texture_white` | `ov_torn_paper_strip` | - | `obj_ball_red`, `fx_gold_sparks_black` (Gemini) |
| **Pitch / prediction videos** (agle) | India match | `bg_pitch_topview` + G05-G08 pitch photos | `ov_lowerthird_blue` | 2 teams ke captains | `stumps`, `bat`, `ball` |

Har frame ke bottom-right mein `ov_ribbon_subscribe_now`, aur har RETAIN card par `label_sambhavit_not_official_hi`. `stamp_release_*` tab tak nahi jab tak official list na aaye.
