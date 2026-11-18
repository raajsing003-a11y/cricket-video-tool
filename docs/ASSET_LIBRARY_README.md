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
| C79 naye | 20 green-screen graphics, hara bg hata ke transparent webp. `06_icons/`: icon_record_ring, icon_cursor_click_ripple, icon_cursor_arrow_white, icon_mic_crossed_price_tag, icon_folder_red, icon_folder_red_lock, icon_document_page. `08_gemini_generated/objects/`: obj_magnifier_gold, obj_mic_condenser_boom_arm. NAYA `15_ui_mockups/`: ui_window_dark_empty, ui_phone_screens_grid, ui_audio_editor_waveform, ui_post_card_white, ui_post_card_glass_dark, ui_list_rows_dark, ui_browser_window_white, dev_laptop/tv/phone_landscape/phone_portrait_screen_transparent (screen khaali/transparent) | Ready |
| C80 naye | 19 green-screen graphics (transparent webp). `06_icons/icon_tile_*` (16 app-icon tiles): neon dark-glass = floodlights_purple, mic_red, replay_cyan, trophy_gold, magic_wand_blue, helmet_blue, headphones_green, stumps_yellow, keeper_gloves_orange, music_note_yellow, scoreboard_cyan, cricket_ball_green; safed flat = cricket_ball, headphones, mic, stumps. `15_ui_mockups/`: card_back_blue_neon, card_back_blue_neon_fan3, card_back_red_neon (card ka peecha, beech khaali) | Ready |
| C81 naye | 18 assets. NAYA `16_silhouettes/` (7, transparent): sil_head_cap_circuit_blue, sil_batsman_blue_mist, sil_umpire_finger_up_yellow, sil_crowd_cheering_yellow, sil_fielder_diving_catch_yellow, sil_bowler_yellow, sil_batsman_yellow. `06_icons/icon_tile_neon_bat_red`. `01_backgrounds/` (10, Gemini sparkle hataya): Short 9:16 (1080x1936) = bg_portrait_blue_light_beams_dark, bg_portrait_contour_bokeh_blue, bg_portrait_panel_wall_dark_blue; wide (1920x1072) = bg_dark_gradient_blue_glow_bottom, bg_paper_texture_grey_fibre, bg_stadium_topview_night_pitch, bg_blue_light_streaks_particles, bg_contour_bokeh_blue_wide, bg_blueprint_grid_blue, bg_panel_wall_dark_blue_wide | Ready |
| C82 naye | 19 green-screen graphics (transparent webp). `08_gemini_generated/objects/`: obj_calendar_blank_perspective, obj_stopwatch_silver, obj_padlock_gold, obj_pie_chart_3d_blue, obj_handshake_blue_icon, obj_ticket_blank_vintage, obj_stadium_seats_row_yellow_blur. `03_stamps/stamp_closed_red_grunge`. `15_ui_mockups/`: btn_pill_* (8), ui_toggle_off_grey_3d, ui_toggle_on_blue_3d, btn_round_yellow_gold_rim | Ready |
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
| C83 naye | 11 assets. `06_icons/`: icon_cross_red_coin_3d, icon_check_green_glass_coin_3d, icon_arrow_white_curved_hand, icon_arrow_white_straight, icon_subscribe_3d_bell, icon_question_marks_3d_blue_glow. `15_ui_mockups/btn_rect_red_3d_tilted`. `02_overlays/`: overlay_paper_torn_yellow_strip, overlay_chevrons_yellow_triple. `08_gemini_generated/fx/`: fx_light_leak_orange_black, fx_lens_flare_white_black | Ready |
| C84 naye | 14 assets. NAYA `17_halftone_portraits/` (4), NAYA `18_maps/` (map_india_dots_cyan, map_india_states_blue, diagram_cricket_field_fielders_white), NAYA `19_presenter/` (6 poses), `15_ui_mockups/ui_polaroid_trio_blank` | Ready |
| C85 naye | 6 assets. `18_maps/map_world_dots_cyan`, `19_presenter/presenter_phone_plaid` + `presenter_hands_open_explain_2`, NAYA `20_cartoon_presenter/` (cartoon_wave, cartoon_point_left, cartoon_chin_think) | Ready |
| C86 naye | 20 assets. 20_cartoon_presenter (phone, hold_blank_sign, thumbs_up), 4 fx (dust, bokeh, smoke, fibre; kala bg, Screen blend), 2 bg (blue radial glow wide + portrait), 15_ui_mockups (4 avatar circles, settings panel, video player, profile card, pill lock), 06_icons (emoji bored/smile, stars 4of5) | Ready |
| C87 naye | 20 assets. `06_icons/`: icon_tile_glass_idea_bulb_yellow, icon_coin_gold_num_1..5, icon_shield_blue_check_gold, icon_gauge_red_yellow_green. `03_stamps/`: stamp_injury_update_red_grunge, stamp_new_captain_blue_grunge, stamp_squad_out_navy_grunge, stamp_sold_gold_foil, stamp_unsold_black_grunge. `01_backgrounds/`: bg_red_neon_grid_perspective (wide), bg_portrait_red_neon_grid_tunnel (9:16). `08_gemini_generated/objects/obj_jersey_blue_vneck_blank`. `15_ui_mockups/`: ui_points_table_glass_dark, ui_notification_card_glass_dark, ui_document_paper_gold_pen. `18_maps/map_india_blue_pins_yellow` | Ready |
| C88 naye | 15 assets. `06_icons/`: icon_burst_yellow_black_num_6, icon_burst_blue_white_num_4, icon_burst_red_white_letter_w, icon_coin_gold_100_laurel, icon_highlight_circle_yellow_marker, icon_scribble_wave_yellow_brush. `08_gemini_generated/objects/`: obj_auction_paddle_blank_white, obj_newspaper_torn_blank_layout, obj_siren_red_glow, obj_podium_123_white_gold_silver_bronze, obj_megaphone_gold_black. `08_gemini_generated/fx/`: fx_sparkle_stars_white_black, fx_glitch_red_scanlines_black (Screen/Add blend). `01_backgrounds/`: bg_portrait_stadium_night_empty_blue (9:16), bg_gold_silk_black_frame | Ready |
| C89 naye | 13 assets. `06_icons/`: icon_coin_silver_nr_no_result, icon_coin_red_l_loss, icon_coin_green_w_win, icon_tile_glass_sun_orange, icon_chat_bubbles_white_blue. `08_gemini_generated/objects/`: obj_scale_balance_gold_empty, obj_coin_gold_blank_tilted. `15_ui_mockups/`: ui_versus_compare_panel_blue_orange, ui_versus_three_circles_panel_glass, ui_tv_pitch_ball_trajectory, ui_list_rank_1to11_glass_dark, ui_list_five_rows_glass_dark. `18_maps/diagram_pitch_zones_colored_lengths` | Ready |
| C90 naye | 10 assets. `19_presenter/` mein Rahul ki asli photos: standing dark/light grey, thumbs both cream, thumb cream, hands_talk/wave/thumbs_up/point_both plaid, thumbs_up blue_stripe/white_shirt | Ready |
