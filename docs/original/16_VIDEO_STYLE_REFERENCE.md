# 16 VIDEO STYLE REFERENCE (user ne screenshots diye, 16 Nov 2026)
Folder: `style_reference_screenshots/` (15 jpg: 158120 se 158146). Ye dusre channels ke videos ke screenshots hain. **Sirf design/layout ki reference**, unka content/photo/logo copy nahi karna.

## User ki maang
"Video editing aisi karo na": mera video in screenshots jaisa lagna chahiye (news-channel look), sirf plain text cards nahi.

## Screenshot-wise style (jo dikha)
1. **Photo in white frame + blurred stadium background** (158120, 158127/8/9 types): beech mein safed border wali photo, peeche blur stadium/sunset.
2. **Breaking News tag + ticker** (158123, 158127): neeche left mein laal "Breaking News" tag, uske neeche safed bar mein Hindi headline scroll hoti hai (ticker).
3. **Full-bleed photo + numbered headline bar** (158128 area): "03 MSD CALL" kala chhota tag, neeche purple/gradient headline bar, uske neeche safed sub-line.
4. **Grunge transition card**: poori laal halftone screen par bada safed text ("NO PURSE") 1-2 sec ke liye.
5. **News control-room monitor wall background** + neeche blue/laal **lower-third** (headline + safed sub-line): "2028-33 MEDIA RIGHTS CYCLE ON CARDS / 50,000 CR APPROX...".
6. **Split-screen do khiladi** (beech mein hari divider) + lower-third ("SHAMI - CURRAN TRADE ON CARD / Y JAISWAL INVOLVEMENT NOT POSSIBLE").
7. **Intro title**: "CRICKET FATAFAT" phata-kagaz (torn paper) style, stadium lights ke saath.
8. **Thumbnail/frame style**: khiladi ka chehra left, peela brush "MUMBAI", laal brush "Win-Loss Ratio", bada peela number "0.625".
9. **Points table graphic**: 10 teams, P/W/L/NR/Pts/NRR, Q badge top 4, neela glass-card (asli logo copyrighted, humein team-colour chip use karna).
10. **Retain/Release player cards** (158135-158141 area): left side vertical card (team-colour + halftone dots + X pattern), khiladi ki photo, hara "RETAIN" ya laal "RELEASE" stamp, safed naam-box, neeche ₹ amount (jaise "₹ 14.2 CR"). Right side presenter.
11. **Playing XI card**: "PUNJAB PLAYING XI", 11 naam ki list, ek khiladi ki photo.
12. **Cameron Green ₹25.2 CR** card: team-colour (purple) version of same retain card.
13. **YouTube thumbnails (158146)**: multi-face collage, "TRADE BREAKING", bade hare/peele text "TRADE LOADING? / WHAT'S COOKING?", "LAST DAY TRADE DRAMA!".
14. Har frame ke bottom-right mein **"SUBSCRIBE NOW" laal ribbon** overlay.

## FINAL DECISION: photos (user ne pucha "google se download kar lo, copyright mat socho")
- Claude ne mana kiya: google se image download karke video/file mein nahi daalega (policy + network limit), aur copyright claim/strike se YPP race bigad sakti hai (channel par 0/4000 watch hours).
- Jo hoga: **photo-slot (khaali frame) ke saath design**. User apni photo daale.
- Safe photo sources: IPL/BCCI official media kit/press page, Wikimedia Commons (CC license + credit), Pexels/Unsplash/Pixabay (stadium/cricket gear), ya user ke apne phone ki legal photos.
- HTML tool mein **"photo upload" button** rakhna hai: har card ke photo-slot mein user apni image laga sake (browser mein hi, upload nahi hota server par).

## Kya banana hai (naye chat ka kaam)
Ek naya video/card-set isi style mein (photo-slot ke saath), 49 purane plain cards ki jagah:
- Intro: torn-paper title card ("IPL RETENTION FATAFAT" jaisa, apna naam/branding).
- Har team: blur-stadium-background + photo-slot + "Breaking News" tag + Hindi ticker headline.
- Retain/Release/Watch cards: team-colour vertical card, photo-slot, stamp (RETAIN/RELEASE/WATCH), naam box, ₹ amount (sirf jahan script mein amount hai: Pooran ₹21 cr, Pathirana ₹18 cr, Chahal ₹18 cr, Hardik ₹18 cr, Veer/Kartik ₹14.20 cr, Deshpande ₹6.50 cr, Green+Pathirana ₹43.20 cr).
- Lower-third (headline + sub-line), split-screen do-khiladi card (photo-slot x2), grunge transition card, ant mein "Subscribe now" ribbon.
- "संभावित: ऑफिशियल लिस्ट नहीं" label RETAIN stamp wale cards par zaroor (kyunki ye HT ke andaze hain, official nahi).
- Team ke short form nahi (sheher ke naam). Script mein source ka naam nahi.
- Sirf unhi cheezon par stamp jo script mein "रिटेन हो सकते हैं" mein hain; "RELEASE" stamp mat lagao jab tak official list na aaye (sirf andaza). Naye facts mat jodo.
- Existing code: `final_video/build_cards.py` (PIL + raqm + ffmpeg, Noto Sans Devanagari font `assets/`). Naya style isi pipeline par ya HTML Canvas tool mein banao.
