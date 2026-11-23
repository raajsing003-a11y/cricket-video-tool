# GitHub Audio/Voice Code Catalog (search: 23 Nov 2026)
Raw API results: SEARCH_RESULTS.json (15 queries). Clones: repos/ (shallow, .git hata diya).

## Seedha jawab: tumhare naam wali cheezein
- **Lexis Audio Editor**: GitHub par koi code nahi (Android ka closed-source app). Search = 0 result. Uske features (trim, noise, fade, EQ, pitch, speed, reverb) hum Audacity/web repos ke code se banayenge.
- **Audacity**: audacity/audacity (GPL-3.0, C++). Sirf effect algorithms ka hissa repos/audacity_au3_effects mein: NoiseReduction.cpp, CompressorProcessor, TruncSilenceBase, Equalization, Amplify, Loudness, ChangePitch, Echo, Reverb_libSoX.h. Forks: tenacityteam/tenacity, Audacium. AI plugins: intel/openvino-plugins-ai-audacity (GPL).
- **Adobe Podcast**: Adobe ka code open nahi. Open alternatives mile: resemble-ai/resemble-enhance (MIT, python, voicy ke vendor/ mein), jindratilk/voicy (local clone), Francium-Tech/CrispVoice. Adobe Podcast ke sirf batch-download/helper tools GitHub par hain (code kaam ka nahi).
- **Voice editor**: chadingTV/voiceeditor (text se edit), fabiancelik/rich-voice-editor (SSML).

## Cloned (repos/) — web/JS pehle
plucked/html5-audio-editor (no license), janmyler/web-audio-editor (MIT), delislt/audio-editor (MIT, compressor/reverb/pitch/export), meigo/slop-audio-editor (MIT, TS, render/normalise/schedule), GhofranSalem/audio-studio-web, melbinjp/audio-editor (MIT), cjlkaiser-cpu/audio-editor, braveness23, khuramhaf, Srikanthmadhan/Audio-Cutter-Web, yokazek/vox-slice (MIT, split), mdn/voice-change-o-matic (CC0), carlosrafaelgn/GraphicalFilterEditor (MIT, FFT/EQ), jitsi/rnnoise-wasm (Apache, RNNoise wasm), miroslavpejic85/rnnoise-poc (AGPL), jindratilk/voicy (MIT, AI enhance), Francium-Tech/CrispVoice (MIT).

## Abhi clone NAHI kiye (badi/baad ke chunks)
naomiaro/waveform-playlist (MIT, multitrack), katspaugh/wavesurfer.js (BSD, plugins: regions/timeline), google/beautiful-audio-editor (Apache), resemble-ai/resemble-enhance, facebookresearch/denoiser, werman/noise-suppression-for-voice (RNNoise plugin, GPL), trummerschlunk/PodcastPlugins (GPL), tenacityteam/tenacity, cycfi/q (DSP, MIT), ghedo/loudgain, tphakala/go-audio-dsp (EBU R128), Riyoway/audionorm.

## License dhyan
MIT/Apache/BSD/CC0 = code seedha le sakte ho (credit rakho). GPL/AGPL (Audacity, rnnoise-poc, PodcastPlugins) = algorithm samajhkar apna likho, copy-paste mat karo agar tool share/publish karna hai. "None" license (plucked) = sirf seekhne ke liye.

## Use ho chuka
- lamejs 1.2.1 (LGPL-3.0, npm) — MP3 export, html mein inline; license notice comment rakha hai.
- jitsi/rnnoise-wasm dist/rnnoise.js + rnnoise.wasm (Apache-2.0) — AI noise suppression, html mein inline.

- @lofcz/deepfilternet-web 0.1.0 (MIT OR Apache-2.0, npm) — DeepFilterNet3 wasm, AI Enhance; base/df_bg.wasm
