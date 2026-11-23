# TRACKER (har chunk ke baad update + poori zip)
Goal: GitHub ke audio/voice code se apna best standalone audio_editor.html (base/audio_editor.html) banana — Lexis/Audacity/Adobe Podcast jaisa.

## Chunk 1 — DONE (23 Nov 2026)
- [x] 15 GitHub searches (SEARCH_RESULTS.json), CATALOG.md
- [x] 17 repos clone + Audacity effects sparse (repos/)
- [x] FEATURE_INDEX.md (grep: kaunsi repo mein denoise/compressor/eq/pitch/reverb/export/mp3)
- [x] base/audio_editor.html (pehle bana standalone editor) + original tool JS

## Chunk 2 — DONE (23 Nov 2026): Export + format
- [x] Export dropdown: WAV 16-bit, WAV 24-bit, MP3 128/192/320k, Mono checkbox, select-only export
- [x] lamejs 1.2.1 (LGPL-3.0) inline (base/audio_editor.html ab ~175KB); MP3 encode progress ke saath, node mein test ok
- Reference: delislt export-engine.js (encodeMp3), meigo src/export
- Baaki export idea (baad mein): FLAC/AAC (mediabunny, bada lib), sample-rate change
Pehle dekha: delislt/audio-editor (export), meigo/slop-audio-editor (src/export, normalise.ts), Srikanthmadhan/Audio-Cutter-Web (lamejs), yokazek/vox-slice
## Chunk 3 — DONE (23 Nov 2026): Effects
- [x] Compressor (DynamicsCompressor + makeup), Noise gate, De-esser (6.5k band dynamic cut)
- [x] Reverb (convolver, noise IR, decay+mix), Echo (delay/feedback/mix, tail badhti)
- [x] Speed (resample), Tempo (WSOLA, pitch same), Pitch shift (WSOLA+resample, ±12 semitone)
- [x] Sab effects select par lagte hain (warna poori audio); length badalne wale bhi theek
- [x] Pure-JS DSP node mein test: tempo/pitch/speed/gate/echo sahi (440Hz→880Hz at +12)
- Dhyan: effects mere apne likhe hain (delislt ka reverb/compressor idea dekha), Audacity ka code copy nahi kiya
- Baaki idea: Audacity-style Leveller/Limiter alag, Bass boost/Phaser, Vocal remover (stereo center cancel)
## Chunk 4 — DONE (23 Nov 2026): Waveform UX
- [x] Spectrogram view (0-8kHz, FFT cache), stereo L/R alag rows
- [x] Zoom: Fit, Zoom select, Ctrl+scroll; slider 5-1500
- [x] Markers (M key): chips jump/delete, edits (cut/paste/trim/effects) ke saath khisakte hain, undo/redo mein wapas; "Markers se split save"
- [x] Loop select, time + selection readout
- [x] Dusri audio: cursor par Insert / Upar se Mix (volume %), sample rate match
- [x] Asli Chromium (playwright) mein test: sab effects, export MP3, spectrogram, 0 JS errors -> tests/browser_test.py (python3, playwright chahiye)
- Multitrack (alag tracks, har track ka volume/pan) abhi NAHI: Mix se kaam chal raha; chahiye to alag chunk
- Refs dekhe: waveform-playlist/wavesurfer ke idea; code copy nahi
## Chunk 5 — DONE (23 Nov 2026): Noise reduction upgrade
- [x] RNNoise (jitsi/rnnoise-wasm, Apache-2.0; RNNoise BSD-3) editor mein inline (wasm base64 ~150KB), "🧠 AI shor hatao": taqat % + pass 1-3, 48k resample (OfflineAudioContext), 1-frame delay compensate
- [x] Hum remover (50/60Hz + 6 harmonics), Rumble cut (80Hz), Hiss cut (10kHz)
- [x] ⭐ Best ab AI noise (RNNoise) -> pause remove -> anchor voice chalata hai
- [x] Naap (Chromium, noisy test wav): hiss 3-10kHz -21dB, voice sirf -0.5dB; hum remover se hum aur -7dB (tests/measure_noise.py)
- Purana spectral "Noise reduce" (profile wala) rakha hai alternative ke liye
- Note: RNNoise v0.1 model hai (rnnoise.wasm). 0.2 model rnnoise-sync.js (1.9MB) mein hai - zyada size, shayad behtar; chahiye to try karna
- Audacity NoiseReduction.cpp padha nahi/copy nahi (GPL); apna spectral gate pehle se hai
## Chunk 6 — DONE (23 Nov 2026): Loudness LUFS (EBU R128)
- [x] tests/loudness.js: apna pure-JS engine — K-weighting (BS.1770-4, kisi bhi sample rate par), Momentary 0.4s / Short-term 3s / Integrated (gate -70 abs, -10 rel) / LRA (EBU 3342) / True-peak 4x oversample
- [x] "📏 Loudness (LUFS)" row: 📊 Naapo (cards + gauge + short/momentary graph), Target presets (-14 YouTube/Spotify, -16 Podcast, -19 Mono, -23 EBU, -24 ATSC, Apna), Chhat dBTP, Limiter checkbox, 🎯 LUFS par normalize
- [x] Select ho to sirf wahi hissa naapta/normalize karta hai; Undo/Redo kaam karte hain
- [x] Lookahead brickwall limiter (5ms) — peak chhat todne par; Limiter off ho to volume ghata deta hai
- [x] SPEED: bhaari hisaab Web Worker mein (UI nahi atakti, buttons busy dikhte hain); true-peak optimize. 10 min stereo ~1.9s analyze (node)
- [x] Test: tests/loudness_test.js (EBU 3341 jaise: stereo 1k -23dBFS = -23.0 LUFS, mono -26, gating, LRA 10 LU, true-peak fs/4) SAB PASS; tests/browser_test_loudness.py (Chromium, 0 JS errors); purana tests/browser_test.py bhi pass (path ab relative)
- Refs: sirf idea (meigo normalise.ts, audionorm, go-audio-dsp); code apna, BS.1770 formula public standard
- Baaki idea: Best chain ke baad auto-LUFS, export-time normalize, live meter playback ke time
## RULE (user, 23 Nov): har chunk mein DESIGN/UI bhi achi ho aur SPEED achi ho — koi lag nahi (bhaari kaam Worker/chunked mein, UI free rakho)
## Chunk 7 — DONE (23 Nov 2026): AI Enhance (DeepFilterNet3, Adobe-Podcast-jaisa saaf awaaz)
- [x] Decision: site GitHub Pages par ONLINE hai, isliye model runtime par load hota hai (single-file offline zaroori nahi). Model = @lofcz/deepfilternet-web (DeepFilterNet3, MIT/Apache, weights wasm mein, 34MB df_bg.wasm)
- [x] "✨ AI Enhance" row: Shor Halka(15dB)/Madhyam(30dB)/Poora, Mix 30-100%, progress bar (download % + processing % + ETA), ⏹ Roko (cancel), select par sirf wahi hissa, Undo
- [x] Model file ka order: ./df_bg.wasm (GitHub par html ke saath rakho) -> jsDelivr CDN -> unpkg. Pehli baar download, phir browser cache
- [x] SPEED: sab Web Worker mein; main thread max atkaav ~12ms. Naap: 8s stereo = 2.0s process (~8x real-time), model-load ~0.5-0.8s, cached 2nd run 2.2s total
- [x] Delay align: DFN output 3 frame (1440 samples) late -> compensate; 48k resample OfflineAudioContext se aur wapas original rate par
- [x] Test: tests/dfn_probe.js (node), tests/browser_test_enhance.py (Chromium, CDN request local wasm se serve; enhance + undo + cancel; 0 JS errors)
- Dhyan: asli awaaz par quality sunke check karo (mere paas sirf synthetic test tha); "Poora" mode shor wale hisse ko bilkul silent kar deta hai, kabhi unnatural lage to Madhyam ya Mix 70-80% rakho
- Dekha par use NAHI kiya: @desert-ant-labs/clear (license source-available + attribution + model unke server se), resemble-enhance (ONNX nahi, python/GPU), HuggingFace mere sandbox se band tha (verify nahi kar sakta)
- DEPLOY: GitHub par audio_editor.html ke saath df_bg.wasm (34MB) bhi upload karo (GitHub file limit 100MB, theek hai). Na rakho to CDN se chalega
- Licenses: vendor/DeepFilterNet_LICENSE-MIT, -APACHE (credit: Rikorose/DeepFilterNet + lofcz fork)
- Baaki idea: Best chain mein AI Enhance option, long audio (>10 min) ke liye chunk-resume, WebGPU (Clear jaisa) agar zaroorat
## Chunk 8 — DONE (23 Nov 2026): Final merge + polish
- [x] Sab chunk (export, effects, waveform UX, RNNoise, LUFS, AI Enhance) ek audio_editor.html mein; mobile (390px) par overflow nahi
- [x] 🚀 Podcast Ready: poori audio par AI Enhance -> Target LUFS (ek click); credits/licence footer
- [x] DEPLOY.md (GitHub Pages: html + df_bg.wasm ek folder mein)
- [x] Regression: loudness_test (SAB PASS), browser_test, browser_test_loudness, browser_test_enhance (enhance/undo/podcast-ready/cancel) — 0 JS errors
- Asli awaaz par kaan se quality check abhi baaki (mere paas synthetic audio tha) — tum 2-3 recording par try karke batao
- Aage ke idea: multitrack, FLAC export, Best chain mein AI Enhance option, live LUFS meter
## Chunk 9 — DONE (23 Nov 2026): Loudness polish
- [x] Live LUFS meter: playback ke saath momentary + 3s short-term + bar (rang: hara/peela/laal). Hisaab Worker mein ek baar (cache), phir sirf lookup => main-thread atkaav 0.2ms
- [x] "📏 LUFS" checkbox (Export ke paas): sirf export ki copy par Target LUFS/Chhat/Limiter lagta hai, edit waisa hi rehta hai. Verify: exported WAV ko alag naapa = -16.00 LUFS
- [x] tests/browser_test_live_export.py
- Aage: multitrack, FLAC export, Best chain mein AI Enhance option
## Chunk 10 — DONE (23 Nov 2026): Best chain mein DeepFilter option
- [x] "✨ DeepFilter" checkbox (Best ke paas): ON = AI Noise step RNNoise ki jagah DeepFilterNet3 (progress bar ke saath); OFF = purana RNNoise (tez, bina download)
- [x] dfnRun() alag function: AI Enhance, Podcast Ready aur Best teeno ek hi worker/model use karte hain (model sirf ek baar load)
- [x] browser_test_enhance.py mein Best+DFN test; sab purane tests pass
- Aage: multitrack, FLAC export
## Chunk 11 — DONE (23 Nov 2026): FLAC export
- [x] Export dropdown: FLAC 16-bit / 24-bit (lossless). Encoder apna likha: tests/flac_enc.js (fixed predictor order 0-4 + Rice partition, 4096 block, CRC8/16)
- [x] Worker mein chalta hai (progress %), UI free. Speed ~17x real-time (node)
- [x] Verify: tests/flac_test.js — ffmpeg decode se BIT-EXACT (16/24-bit, mono/stereo, silence, noise, chhota clip) SAB PASS; browser_test_flac.py (Chromium export, ffprobe: flac 44100Hz 2ch 24bit)
- [x] Size: speech ~65% of WAV, silence ~0%
- Note: STREAMINFO MD5 = 0 (spec mein "unknown" allowed; players theek chalate hain). FLAC rounding x32768 hai, WAV exporter x32767 => dono mein max 1 LSB ka fark (sunai nahi deta)
- Aage: multitrack
## Chunk 12 — DONE (23 Nov 2026): Multitrack
- [x] "🎚 Multitrack" panel (collapsible): ➕ Track add (max 6 extra), har track ka Vol % (0-300), Pan (-100..100, balance law, centre = unity), Mute, Solo, Start (sec) + 📍 (cursor par), ✕ hatao
- [x] Lanes canvas: har track ki waveform timeline par; lane ko left/right DRAG karke position badlo; cursor line dikhti hai; mobile 390px par overflow nahi
- [x] ▶ Sab tracks sune (mix preview, existing play/stop use hota hai) aur ⬇ Main mein mix-down (push() se, to Undo kaam karta hai; clip ho to auto -dB aur message)
- [x] Test: tests/browser_test_multitrack.py (Chromium 390px): add track, start/pan/vol, drag (1.00s -> 1.37s), mix-down, WAV export measure (L 7070 / R 7905 = pan sahi), undo, 0 JS errors. Purana browser_test.py bhi pass
- Dhyan: extra tracks main track ke cut/insert ke saath nahi khisakte (position seconds mein fixed). Export multitrack se pehle mix-down maangta hai. Mix-down main thread par chalta hai (bahut lambi audio par thoda ruk sakta hai)
- Aage: mix-down Worker mein, track trim/split, per-track fade, multitrack mein effects, live LUFS multitrack par, Best chain mein AI Enhance
## Chunk 13 — DONE (23 Nov 2026): Multitrack polish (trim/split/fade + chunked mix-down)
- [x] Har track par Fade in / Fade out (sec); main track par bhi fade/vol/pan (mix-down se bake)
- [x] Extra track par Trim (from–to sec, source ka hissa) aur ✂ Split (cursor par; do track bante hain, seamless); lanes mein trim/fade dikhte hain
- [x] Mix-down/preview ab chunked (har ~1M sample ke baad UI ko yield) + "⏳ Mix ho raha hai… %" progress; mix ke dauran buttons disabled
- [x] Test: tests/browser_test_multitrack2.py (split -> 3 rows, part2 off 1.50/trim 0.50-2.00, fade-in sahi, continuity 9999 rms, undo, 0 JS errors); browser_test_multitrack.py + browser_test.py pass
- [x] Speed: 10 min stereo + 10 min stereo mix-down = 1.5s; sabse lamba UI frame gap ~412ms (aakhri peak-scan + push/draw, abhi chunked nahi)
- Dhyan: asli Web Worker nahi, yield-chunking hai; extra tracks main ke cut/insert ke saath nahi khisakte
- Aage: aakhri peak-scan/clip step chunked, track-wise effects, multitrack par live LUFS, Best chain mein AI Enhance option, asli recordings par AI Enhance tuning
## Chunk 14 — DONE (23 Nov 2026): Mix lag kam + per-track filters
- [x] Mix-down ka peak-scan aur clip-scale ab chunked (yield). 10 min + 10 min stereo: mix 1.7s, sabse lamba UI frame gap 412ms -> 264ms, sirf 1 frame >100ms (p95 20ms). Bacha hua gap = toBuf + push() ka main waveform draw (26M sample) — iske liye draw() ko chunk/downsample karna padega
- [x] Har track (main bhi) par Low-cut (high-pass) aur High-cut (low-pass) Hz, 2nd-order Butterworth, mix ke dauran (0 = off). Test tests/browser_test_multitrack3.py: 300Hz tone par Low-cut 2000Hz -> rms 156, High-cut 100Hz -> 780, Band 100-2000Hz -> 7025 (pass); 0 JS errors
- [x] Purane tests (browser_test.py, browser_test_multitrack.py, browser_test_multitrack2.py) pass
- Aage: push()/draw() ke lambe frame ka gap hatana, track-wise compressor/EQ bands, multitrack par live LUFS meter, asli recordings par AI Enhance tuning
## Chunk 15 — DONE (23 Nov 2026): Mix-down ka lamba frame hataya
- [x] Asli wajah draw() nahi, toBuf() ka 26M-sample copy tha. Ab mtMix seedha AudioBuffer ke channel arrays mein mix karta hai (r.buf), copy khatam; preview aur mix-down dono wahi buffer use karte hain
- [x] Naap (10 min + 10 min stereo, Chromium): mix 1.5s, sabse lamba UI frame gap 215ms -> 90ms, >100ms frames = 0 (longtask 193 -> 69ms). Test script: tests/browser_test_mix_gap.py <path-to-html> (/tmp/L1.wav, L2.wav 10-min stereo chahiye, script mein banane ka code nahi — pehle chunk 13 wala generator use karo)
- [x] Regression pass: browser_test.py, browser_test_multitrack.py (1/2/3), loudness_test.js SAB PASS; 0 JS errors
- Bacha hua 69ms longtask push() -> draw() (16000px canvas) se; chahiye to draw ko 2 frame mein todo
- Aage: track-wise compressor/EQ bands, multitrack par live LUFS meter, asli recordings par AI Enhance tuning
## Chunk 16 — DONE (23 Nov 2026): Per-track Compressor
- [x] Har track (main bhi) par Compressor: Threshold dB (0 = off, -60..0), Ratio (1-20:1), Makeup dB (0-24). Peak envelope follower (attack 10ms, release 100ms), feed-forward; filter ke baad, fade/vol/pan se pehle; mix ke dauran chunked
- [x] Test tests/browser_test_multitrack4.py: 300Hz tone (-10.3 dBFS) thr -20 ratio 4 -> -6.4 dB; + makeup 6 -> -0.4 dB; thr -3 (signal neeche) -> 0.0 dB; 0 JS errors
- [x] Speed: 10 min + 10 min stereo + compressor mix-down 2.8s, max UI gap 81ms, >100ms frames 0
- [x] Regression pass (browser_test, multitrack 1/2/3)
- Dhyan: compressor har channel par alag detect karta hai (unlinked), strong stereo material mein halka image shift ho sakta hai; linked option baad mein
- Aage: EQ bands (3-band) per track, linked stereo compressor, multitrack par live LUFS meter, asli recordings par AI Enhance tuning
## Chunk 17 — DONE (23 Nov 2026): Per-track 3-band EQ + Linked compressor
- [x] Har track (main bhi) par EQ: Low shelf 200Hz, Mid bell 1kHz (Q 1), High shelf 4kHz, har ek -12..+12 dB (0 = off). RBJ biquads, mix ke dauran; order: low/high-cut -> EQ -> compressor -> fade/vol/pan
- [x] Compressor mein "Linked" checkbox: detector sab channels ka max leta hai (stereo image nahi hilti); gain curve chunked precompute
- [x] Verify: filter response theory (RBJ) se match: low shelf +12 @300Hz = +2.3 dB (200Hz par +6, 100Hz par +11), bell -12 @300Hz = -1.4 dB, high shelf @300Hz = 0. Linked test (L 10000, R 1000, thr -20 r4): unlinked L -6.4 / R 0.0 dB; linked L -6.4 / R -6.4 dB. tests/browser_test_multitrack5.py, 0 JS errors
- [x] Speed: 10 min + 10 min stereo, EQ + linked comp: mix 3.2s, max UI gap 144ms (ek longtask 124ms — shayad 13M-sample gain array allocate hona); baaki sab <100ms
- [x] Regression pass: browser_test, multitrack 1-4, loudness_test SAB PASS
- Dhyan: shelf ka "fc" midpoint hai (200Hz par aadha gain); poora boost fc se neeche milta hai
- Aage: multitrack par live LUFS meter, linked gain array ko chunk-allocate karna (gap <100ms), asli recordings par AI Enhance tuning
## Chunk 18 — DONE (23 Nov 2026): Live LUFS multitrack par + linked comp streaming + faster yield
- [x] "▶ Sab tracks sune" ke dauran ab playhead (time readout + cursor line main waveform aur lanes mein) chalta hai aur Live LUFS meter (momentary + 3s) dikhta hai; analysis Worker mein, preview buffer (st.pv) par. Stop/mix-down par clear. Test tests/browser_test_multitrack6.py: meter -13.0 -> -14.1 LUFS, time 0:02.21 -> 0:02.91; main play meter bhi theek
- [x] Linked compressor ka 13M-sample gain array hata diya (53MB alloc = 124ms longtask); ab har chunk (CH=262k) par streaming detector, har channel pass mein dobara (deterministic, result same: L -6.4 / R -6.4 dB)
- [x] yld() ab MessageChannel se (setTimeout clamp ~4ms nahi lagta); CH 1M -> 262k
- [x] Naap (10 min + 10 min stereo, Chromium): simple mix 1.0s, max UI gap 70ms, >100ms frames 0. Bhaari (low-cut? EQ + linked comp + compressor): 4.7s, longtasks 53-79ms, ek frame 139ms (push/draw ke aas-paas)
- [x] Regression pass: browser_test, multitrack 1-6, loudness_test SAB PASS, 0 JS errors
- Aage: multitrack par export ke saath auto mix-down option, preview par seek/loop, asli recordings par AI Enhance tuning
## Chunk 19 — DONE (23 Nov 2026): Export par auto mix-down + preview seek/loop
- [x] Export row mein "🎚 Tracks mix" checkbox (default ON). Multitrack ho (2+ track ya main par vol/pan/fade/filter/EQ/comp) to Export seedha mtMix ka result export karta hai — main audio badalti nahi, Undo ki zarurat nahi. Select hai to mix ka wahi hissa. File name `<naam>_mix.<ext>` (warna `_edited`). Export ke dauran mix-buttons lock (mtLock). LUFS/Mono/FLAC/MP3 sab mix par kaam karte hain
- [x] Preview seek: lane par click/drag = playhead. Main lane par drag = scrub, chhodne par chalte preview mein wahin se play (re-mix nahi). Dusri lanes par drag = position badalna (4px se kam hila = seek). Ruka ho to bas cursor jata hai, "Sab tracks sune" wahin se chalta hai
- [x] Preview loop: "🔁 Loop" checkbox; select hai to wahi hissa, warna poora mix. Playhead wrap hota hai
- [x] play() mein loop ke saath duration ab nahi lagta (pehle loop select ek baar chalke ruk sakta tha) — main "Loop select" bhi ab chalta rehta hai
- [x] Test tests/browser_test_multitrack7.py (/tmp/mA.wav 4s 300Hz, /tmp/mB.wav 2s 1kHz): single-track export `_edited`; 2 track par `_mix` (overlap peak 19547, B ke baad 9829 = theek); checkbox OFF par plain; seek 75% -> 3.26s aur chalta raha; loop 90% se 1.5s baad 1.09s (wrap); main loop select 1-2s par 2.6s baad 1.62s (andar). 0 JS errors
- [x] Regression pass: browser_test, multitrack 1-6, loudness_test, flac_test SAB PASS
- Dhyan: playing preview purane mix ka buffer hai — track settings badalne ke baad "▶ Sab tracks sune" dobara dabao
- Aage (Chunk 20): (c) asli recordings par AI Enhance tuning — user se asli audio/problem chahiye; keyboard seek (←/→); markers ke beech multitrack mix export
## Chunk 20 — DONE (23 Nov 2026): Keyboard seek/loop + markers se multitrack mix split
- [x] Keys: ← / → = 1s seek, Shift = 5s, Alt = 0.1s; Home/End; L = loop toggle (preview chal raha ho to Tracks-loop, warna Loop select). Chalte play mein seek wahin se aage chalta hai
- [x] "Markers se split save": 🎚 Tracks mix ON aur multitrack ho to mix ko markers par todta hai (`<naam>_mixpart1.wav`…); Mono checkbox aur FLAC ab split mein bhi kaam karte hain (pehle FLAC select hone par galat tha); progress "Hissa i/n"
- [x] Test tests/browser_test_multitrack8.py: seek keys 2.00/3.99/2.99/2.89, Home 0, End 3.99, play mein seek 2.71, L toggle, split -> mA_mixpart1.wav + mA_mixpart2.wav; 0 JS errors. Regression (browser_test, multitrack 1-7, loudness, flac) pass
- NOT DONE: AI Enhance tuning — asli recording ke bina sahi tuning nahi ho sakti (synthetic tone par tune karna galat hoga). draw() ko 2 frame mein todna (139ms frame) bhi bacha hai, bhaari mix par hi dikhta hai
- Aage: asli audio + problem milne par Enhance tuning; AAC/sample-rate export; Leveller/Limiter, bass boost, vocal remover (optional)

## C212 (23 Nov 2026) — Limiter + Leveller (tool mein)
- [x] 🧱 Limiter: chhat dB (default -1), LUFSLIB.limitTo brickwall, select ya poori audio.
- [x] ⚖ Leveller: dheema gain-rider (50ms RMS, neeche tez 0.15s / upar dheere 0.8s), Target dB, Taqat %, Max ±dB; shaant hisse (<-55 dBFS) nahi badhte; peak -1 dB par surakshit.
- Test (chromium): dheema 0.03 + tez 0.6 tone: gap 26 -> 9.6 dB, peak <= -1 dB; limiter -6 dB chhat tak, errors 0 (tools/audio_editor_tests/browser_test_leveller_limiter.py).
- Baaki: asli awaaz par kaan se check; bass boost, vocal remover, AAC/sample-rate export.

## C213 (23 Nov 2026) — Bass boost + Vocal remover
- [x] 🔈 Bass boost: lowshelf (Freq Hz, Gain dB), peak -1 dB par limiter; select ya poori audio.
- [x] 🎤 Vocal remover: stereo centre cancel (L-R), "Bass rakho" Hz ke neeche ka centre bass bacha leta hai; mono file par message; result mono jaisa; poori safai nahi hoti (gaane ke reverb/stereo vocal bachte hain).
- Test (chromium): bass 80Hz +7.4 dB (2k same); vocal 1k -37 dB, side 3k same, bass 60Hz -2 dB; errors 0 (browser_test_bass_vocal.py).
- Baaki: asli gaane par kaan se check; AAC/sample-rate export.

## C214 (23 Nov 2026) — Sample-rate export + AAC (M4A)
- [x] Export row mein "SR" dropdown (original/48000/44100/32000/22050/16000): export ki copy resample hoti hai (WAV/FLAC/MP3/AAC sab par), edit waisa hi rehta hai. Markers-split export par bhi lagta hai.
- [x] Formats mein "AAC (M4A) 128k/192k": WebCodecs AudioEncoder (mp4a.40.2) + apna M4A muxer (ftyp/moov/mdat). Sample rate AAC list mein na ho to 48000 par; stereo/mono. Encoder na mile to saaf message (Chrome desktop chahiye).
- Test (chromium): WAV 16 kHz sahi (header + size); M4A container ffprobe se sahi (aac, 44100, 2ch, 3.0s; 22050 mono) — NAKLI encoder frames ke saath. NOT tested: asli AAC encode (sandbox Chromium mein AAC nahi), asli Chrome/phone/VLC par playback. Pehle tumhare Chrome par ek M4A export karke VLC/phone mein sunna.
- Test file: tools/audio_editor_tests/browser_test_export_sr_aac.py

## C219 (23 Nov 2026) — Audio Editor: 💾 Presets (settings + chain)
Naya row "💾 Presets" (Level/effects ke neeche): dropdown + 📥 Load (sirf settings) + ▶ Chain chalao (settings lagao + chune effects ek ke baad ek) + 💾 Save… (naam puchta) + 🗑 + ⬇ Export / ⬆ Import (JSON file). Preset mein: sab effect inputs (fade/amp/noise/silence/anchor/LUFS/AI/EQ/hum/comp/gate/de-ess/limiter/leveller/bass/vocal/reverb/echo/speed/tempo/pitch ke 43 fields) + chain steps (Rumble, Hiss, Hum, AI shor, Noise reduce, AI Enhance, Anchor, EQ, Gate, De-ess, Compressor, Leveller, Bass, Reverb, Echo, Normalize, LUFS, Limiter; "Chain steps" details mein checkbox). Built-in: "Video voice-over (saaf)" = Rumble cut -> Compressor -> Leveller -> LUFS -> Limiter (hatta nahi sakte). localStorage 'ae_presets_v1' (browser mein; refresh par rehte). API: window.AEPRESET (list/get/save/del/load/run/grab/put).
BADLA: tools/audio_editor.html (row + script). NAYA: tools/audio_editor_tests/browser_test_presets.py.
Test (chromium): save UI, load settings restore, chain run (bass boost 80Hz -20 -> -13.7 dB, 2k same), built-in delete refuse, reload persist, export/import roundtrip; errors 0; regression bass_vocal, leveller_limiter, export_sr_aac, test_studio_audio, test_studio_vo pass.
NOT tested: asli awaaz par poori chain, AI Enhance/RNNoise steps chain mein (lamba), asli Chrome. Limits: chain steps ke apne settings preset ke fields se aate; ek hi step do baar nahi; Undo har step ke liye alag.
