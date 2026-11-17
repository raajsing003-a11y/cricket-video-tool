# TELEPROMPTER (C24)

`teleprompter.html` — script dark full screen mein padho, text size apne hisaab se, scroll, aur voice-over record. Phone aur PC dono par chalta hai (mic ke liye https ya localhost chahiye; GitHub Pages https hai).

## Use
1. Script paste karo (ya 📄 .txt load / 📝 Captions wali script lo). Alag voice-over chunks ke beech ek line mein sirf `---` likho.
2. ▶ Padho (full screen).
3. A− / A+ se text size (16-160), 🐢/🐇 slider se auto-scroll ki speed, ▶ Scroll se chalao/roko. Haath se scroll karoge to auto-scroll wahin se aage chalega.
4. ◀ ▶ se chunk badlo. ⏺ Record dabao, padho, ⏹ Stop. Recording us chunk number ke naam se save hoti hai (dobara record karo to purani badal jaati hai, poochta hai).
5. "record ke saath scroll" tick ho to record dabate hi scroll chalu. "mirror" sheesha wale teleprompter ke liye. ▾ se controls chhupao. Screen record ke dauran band nahi hoti (wake lock).
6. Keyboard (PC): Space = scroll, ← → = chunk, + - = size, Esc = band.

## Recordings
- Browser (IndexedDB 'cvt_voice') mein save, reload par bhi rehti hain. ▶ Suno, ⬇ download (voice_chunkN.webm), ✕ hatao, ⬇ Sab download.
- Tool (index.html) mein 🎚 Audio tracks → **🎤 Recordings lo**: chunk 1,2,3 order mein lag jaati hain (⏱ fit ke liye). Tool aur teleprompter ek hi site/domain par hon (GitHub Pages par dono hote hain).
- Browser ka data saaf karoge to recordings jaati hain — download kar ke rakho.

## Dhyan
- Chrome best. iPhone Safari mein full screen API nahi chalti (page phir bhi poori screen jaisa dikhta hai), recording m4a banti hai.
- Script text sirf is browser mein save hoti hai (localStorage).
