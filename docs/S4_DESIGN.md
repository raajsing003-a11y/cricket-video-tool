# S4 design (C221, 23 Nov 2026) — Scenes mein free timeline: DESIGN ONLY, koi code nahi

## User ka maksad
Editor tab kholna na pade: Scenes ke neeche hi Video 2 / Audio / Text lanes, Transition, Ripple, Snap, clip kahin bhi jodna, export mein sab.

## Do model alag hain (dikkat)
- Scenes: SE.scenes = [{type,dur,tr,trDur,data,chunk}] — ek ke baad ek (sequence), C.starts auto. Cards script se bante. Export = C.render (canvas) + EXPORT.audio.
- Editor (video_editor.html): clips[{media,track,start,len,in,speed,...}] — free multi-track. Scenes Editor mein *ek live clip* ban kar aate hain (media.sc, pullScenes/sendScenes, "↻ Scenes"). Yani Scenes -> Editor raasta pehle se hai (C202/C203).

## Raaste (3)
A) SASTA: "Editor ko Scenes ke upar overlay mein kholo" (C220 wala tareeka, Audio Editor jaisa) — 1-2 chunk.
   - Scenes mein button "✂ Timeline edit": STUDIO.openEditorOverlay() -> #fe iframe overlay (class ov), pehle sendScenes (live clip taza), ✕ se wapas Scenes (tab nahi badalta, position wahi).
   - Editor ke andar sab kuch pehle se: tracks, transitions 15, ripple, snap, speed/reverse, clip awaaz, export settings. Scenes export alag rehta; "final video" = Editor export (Scenes live clip + extra tracks).
   - Kaam: studio.html overlay (CSS .ov pattern fe par bhi), button, test (overlay khula, tab same, sendScenes chala, wapas). Risk kam.
   - Kami: abhi bhi do jagah (Scenes / Editor), bas tab badalna nahi padta.
B) OVERLAY LANES (Scenes ke neeche apni timeline): scenes ke upar clips rakhne wali extra lanes.
   - Data model: SE.overlays = [{id, lane:'v2'|'a1'|'t1', start(sec, global), len, src:{clip|audio|text}, in, speed, vol, fade, tr}]; scenes badalne par (dur/order) overlays ka start *global seconds* rehta (ripple option: scene ke saath khiskao = scene id se bandho: anchor:{scene,off}).
   - Render: C.render ke baad overlay v2 (clip draw, scene ke upar PiP/full), text lane (captions/lower third), audio lane -> EXPORT.audio mix (AT segs jaisa).
   - Export: export_fast mein beforeFrame (clip seek) + overlay draw + audio mix — card_clip.js ke pattern par.
   - UI: neeche naya canvas timeline (drag, trim, snap, split) — bada kaam; Editor ka code copy/share karna padega (duplicate).
   - 4-6 chunk: (1) data model + render v2 lane (code only, json se), (2) export mix, (3) timeline UI draw + drag, (4) trim/split/snap, (5) text/audio lane, (6) transition/ripple.
C) "Editor mein bhejo" seamless: Scenes export button hi Editor ko bhej kar wahin export karwaye. A ka hi chhota roop.

## Meri sifarish
Pehle A (C222, 1 chunk): user ko Editor ki saari taakat Scenes ke upar mil jaati hai, naya duplicate code nahi. Phir user kaam karke dekhe: kya kami lagti hai. Agar tab bhi alag lanes Scenes mein hi chahiye -> B ke 4-6 chunk (is doc ka model).

## Poochna hai (user se)
1) A (overlay mein Editor) se kaam chalega, ya B (Scenes ke neeche apni lanes) hi chahiye?
2) Final video kahan se export ho: Scenes export ya Editor export?

## Status
B chuna gaya (23 Nov 2026). C222 = chunk (1) data model + v2 render DONE (js/overlays.js). Aage: (2) export audio mix C223, (3) timeline UI draw+drag C224, (4) trim/split/snap C225, (5) text/audio lane, (6) transition/ripple.

C223 DONE: overlay clip awaaz export mix (OV.mix). Aage: C224 timeline UI draw+drag, C225 trim/split/snap, C226 text/audio lane, C227 transition/ripple.

C225-C227 DONE: trim/split/zoom, audio+text lane, transition+ripple. S4 (overlay lanes) poora. Baaki: regression chalana; naye features user maange to.
