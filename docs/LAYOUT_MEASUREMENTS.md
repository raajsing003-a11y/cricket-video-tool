# Asset layout measurements (canvas 1920x1080) — measured from PNGs
- card_vertical_<city>: 640x1000. White name box x30-610,y810-930. Dark amount strip x30-610,y940-980. Photo area = top part (~x30-610, y30-800).
- ov_lowerthird_<red|blue|purple>: 1560x190. Colour bar y0-119 (headline text here), white strip y120-189 (sub-line, dark text).
- ov_photo_frame_white: 1060x1320. Photo slot (semi-transparent dark) x69-980,y73-1240. Draw photo FIRST, then frame (frame inner is alpha150 black: clip photo to slot, draw frame after, or draw only border).
- ov_ticker_bar_white_empty: 1920x96 (put at y=984). Scroll Hindi headline on it.
- ov_tag_breaking_news_hi: 560x110. ov_ribbon_subscribe_now: 460x96 (bottom-right). ov_torn_paper_strip: 1560x320 (content x30-1512,y20-300).
- chip_<city>: 820x260 (city name already printed in Hindi+English). stamp_*: ~500x240. label_sambhavit_not_official_hi: 900x90 (MUST on every RETAIN card).
- Full-screen overlays (1920x1080): ov_vignette_dark, ov_light_rays_top, ov_halftone_dots_white, ov_x_pattern_white, ov_split_divider_green.
- Gemini FX (black bg -> use globalCompositeOperation='screen'): fx_gold_sparks_black, fx_smoke_black, fx_light_leaks_black, fx_grunge_scratches_black.
- Assets are in assets/ (PNG kept, big ones converted to .webp 1920px). js/manifest.js maps key (path w/o ext) -> real file.
