# BG video (C196)
33 seamless 5s loops (assets/bgvideo/, 720p, no audio). Card ka full-canvas background image ki jagah scene ka video chalta hai (dim 0.2). title / retain / intro / clip scenes par nahi.
- scene.data.bgv = loop ka naam (ya "05"), "off" = is scene par nahi. Na ho to seed se pick (adjacent scene alag).
- Look tab: 🎞 BG video: MIX / EK HI / OFF · 🎲 BG badlo (naya mix/ek video, Look ke pool se) · select (is scene ka video; EK HI mein sab ka). Settings localStorage cvt_bgv.
- 🎬 Naya Style / 🎨 Style list: style ke Look ke hisaab se pool (BGV.POOL) -> d.bgv likhta hai.
- Video load na ho to purani image (kabhi kaala nahi). Export: har frame se pehle exact seek (C.beforeFrame chain).
- Naye loops: bg_video_work/originals mein mp4 daalo, make_loops.sh chalao, assets/bgvideo/ mein copy, js/bg_video.js ki LIST mein naam.
