# FEATURE_INDEX
## Base mein pehle se (files padhi)
- Timeline UI: js/filmora_shell.js, unified_shell.js, classic_shell.js
- Media bin, Properties, J/K/L, zoom, frame step, Ctrl+D, right-click menu: filmora_shell.js
- Scenes/elements: scene_editor.js, elem_edit.js, storyboard.js, clip_insert.js
- Export: export.js (MediaRecorder), export_fast.js (WebCodecs+mp4-muxer), vendor/mp4-muxer.js
- Transitions: transitions.js, transitions_pro.js, transitions_r.js, polish.js
- Captions/text: captions.js, text_fx.js
- Effects: fx_pro.js, punch.js, looks.js, bg_video.js
- Audio: audio_editor.js, music_bed.js, audio_fit.js, base/audio_editor.html
## Base mein NAHI
chroma key, background removal, stabilization, speed ramp/reverse, timeline waveform, whisper auto captions, gl-transitions, trim/split/ripple (verify), multi-track
## Kis repo se kya (repos/ folder)
| Feature | Source | License |
|---|---|---|
| Transitions (323 GLSL) | repos/gl-transitions/transitions | MIT |
| Chroma key | repos/ChromaGL/chromagl.js | MIT |
| Auto captions | repos/browser-whisper (transformers.js worker) | MIT |
| MP4 export | repos/mp4-muxer (base mein already) | MIT |
| Waveform | repos/wavesurfer (idea ya CDN-free peaks khud) | BSD-3 |
| Timeline/editor UX idea | freecut, OpenCut, Motionity (clone nahi, idea) | MIT |
| Bg removal | MediaPipe selfie segmentation (chunk 8 mein verify) | Apache-2.0 |
| Stabilization, speed ramp | khud likhna | - |
