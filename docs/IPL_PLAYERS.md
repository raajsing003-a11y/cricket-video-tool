# IPL Players page (C193, 21 Nov 2026)

Page: **players.html** (index.html ke nav mein 👥 Players). Data: **js/ipl_players.js** (184 players, 10 teams).

## Data
- IPL 2027 retained list (10 teams ne 17 Nov 2026 ko announce ki; mini-auction 16 Dec 2026, Goa). Source: PTI via Deccan Chronicle, 18 Nov 2026. Overseas = 55, trade se aaye = (T) tag.
- Format: [team, English naam, Hindi naam, overseas, trade, photo slot id]. Purane 97 slot ke players ka slot id/Hindi naam wahi rakha (photos + scenes JSON nahi toote); baaki 105 ke naye slot (player_<team>_<naam>_headshoulders) PHOTO_SLOTS mein apne aap jud jaate hain — isliye video tool ke 🖼 Photos aur scene JSON mein bhi dikhte hain.
- Jo players ab retained list mein nahi (Dhoni, Boult, Head etc.) "पुराने" chip mein rehte hain, unki photo safe.
- Auction ke baad team badle to js/ipl_players.js ka DATA badlo (ya Claude se nayi list ke saath update karwao). Hindi naam transliteration hai — galat lage to batao.

## Page kya karta hai
- Team chips (counts ke saath), Khaali/Photo wale filter, naam search (Hindi/English).
- Har card: 📁 file se photo, 🔍 Google Images se khud chuno (extension), 🗑 hatao.
- ⚡ Auto: jo list dikh rahi hai uske khaali players ke liye extension ek ke baad ek Google Images kholta hai, pehli photo khud lagata hai, agle par jaata hai. Team chip se team chun kar chalao. ⏹ se roko. Galat photo ho to 🔍 se badlo.
- 💾 ZIP save: sab photos ek zip mein — folder = team (CSK, MI...), file = "Player Name.jpg" + _players.json (exact restore ke liye).
- ⬆ Photos / ZIP upload: kitni bhi photos ya zip; file ke naam se player apne aap milta hai (English/Hindi naam ya slot id; zip mein _players.json ho to wahi). Na milne wale naam status mein dikhte hain.
- 📋 Names list copy: team-wise sab naam (English | Hindi).
- Photos Chrome IndexedDB 'cvt_photos' mein, video tool wali hi library (same site par). Badi image (>1600px ya >2.5MB) 1600px webp mein chhoti hoti hai.

## Extension
- photo_finder_extension (Load unpacked) — code nahi badla. Tool ki page-bridge jo 'find' / 'pf-set' / 'pf-result' messages deti hai, players.html wahi use karta hai.
- file:// se chalao to extension ki Details mein "Allow access to file URLs" ON. GitHub Pages par seedha chalta hai (URL path .../cricket-video-tool/players.html).

## Test (C193)
- node: zip_lite (CRC, python zipfile se cross-check, deflate zip padhna), nakli DOM+IndexedDB harness (upload by naam, Hindi naam, spelling alias, zip+_players.json, ZIP save, names copy, auto queue + stop). NOT tested: asli Chrome + asli extension + Google.
