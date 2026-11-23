# 🎛 Audio Editor (tools/audio_editor.html) — C206

Cricket tool ke andar alag standalone audio editor (audio_research_pack chunk 1-20 se). Nav mein "🎛 Audio Editor"; editor mein "← Video Tool". Multitrack mix, AI Enhance (DeepFilterNet), noise, LUFS, compressor/EQ, MP3/WAV/FLAC export. Tracker: docs/AUDIO_EDITOR_TRACKER.md.
`audio_editor.html` aur `df_bg.wasm` (34 MB) tools/ mein EK HI folder mein rahein. Tests: tools/audio_editor_tests/. Licenses: docs/audio_editor_vendor/.

# GitHub Pages par lagane ke steps (audio_editor.html)

1. Apni site ke repo mein ye 2 file EK HI folder mein rakho:
   - `tools/audio_editor.html`
   - `tools/df_bg.wasm`  (34MB — AI Enhance ka model)
2. Commit + push. GitHub file limit 100MB hai, 34MB theek hai.
3. Page kholo -> audio kholo -> ✨ AI Enhance dabao. Pehli baar model download (~34MB), phir browser cache.
4. `df_bg.wasm` na rakho to bhi chalega: editor apne aap jsDelivr/unpkg CDN se model le leta hai (internet chahiye).
5. Baaki sab (LUFS, noise, effects, export MP3/WAV) bina internet ke chalta hai.

## Agar update na dikhe
Browser cache: Ctrl+Shift+R (mobile par site data clear / incognito).

## Licenses
DeepFilterNet3 (MIT/Apache-2.0), RNNoise (BSD-3), jitsi rnnoise-wasm (Apache-2.0), lamejs (LGPL-3.0). Notice editor ke footer mein hai; license files vendor/ mein.

## Tests (pack/tests)
node tests/loudness_test.js | python3 tests/browser_test.py | browser_test_loudness.py | browser_test_enhance.py | browser_test_noise.py
