# GitHub Pages par tool chalana (ek baar ka setup)

1. github.com par login -> **New repository** -> naam: `cricket-video-tool` -> **Public** -> Create.
2. Repo page par **uploading an existing file** link dabao.
3. Zip **extract** karo. Andar ka `cricket_video_tool` folder kholo aur uske **andar ki saari cheezein** (index.html, js, assets, docs, .nojekyll) drag-drop karo. (Folder ke andar wali files chahiye, folder khud nahi.)
   - Agar `.nojekyll` dikhe nahi (hidden file) to koi baat nahi, tool phir bhi chalega.
   - Ek baar mein 100 files se zyada na chadhein to behtar: pehle `index.html`, `js` folder, phir `assets` ke subfolders alag alag.
4. **Commit changes** dabao.
5. **Settings -> Pages -> Source: Deploy from a branch -> Branch: main / (root) -> Save.**
6. 1-2 min baad link milega: `https://<username>.github.io/cricket-video-tool/` — yahi tool hai.

## Roz ka use
- Chrome desktop par kholo. Pehli baar font/assets load hone do (Ready likha aaye).
- **🖼 Photos** se player photos upload karo (browser mein save rehti hain, same browser/device par).
- **🎬 Scenes** se scenes jodo ya scenes.json load karo.
- Audio: **🎙 Audio** ya **🎚 Audio tracks** (mic record bhi).
- **📝 captions** chahiye to script paste karke Spread karo.
- **⚡ Fast export (MP4)** dabao. Na chale to **⏺ Real-time export** (tab khula rakhna).

## Update kaise karein
Naya zip aaye to repo mein sirf badli hui files upload karke replace karo (jaise `js/*.js`, `index.html`). Photos/scenes browser mein hain, repo update se nahi jaate. Scenes ka backup ke liye **⬆ JSON save** zaroor karo.

## Dhyan rakhein
- Photos web se mat uthao; apni/licensed photos upload karo.
- Photos aur scenes localStorage/IndexedDB mein hain: browser data clear karoge to ud jayenge (JSON save/backup rakho).
- Phone par nahi, **Chrome desktop** par export karo.
