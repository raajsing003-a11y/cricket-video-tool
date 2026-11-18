# Reference style — "Ryanair-type explainer" (Rahul ne 17 Nov 2026 ko 159068_1.mp4 diya)
Sirf STYLE reference hai (15 min, 640x360). Un ke logo/photos/clips copy nahi karne; tool GENERIC rahega.

## Look
- Royal blue bg (grid/texture, halka vignette) + ek yellow accent + thoda cyan. Flat yellow silhouettes + line icons. B&W (halftone) photos blue par. Bada bold sans text, kuch shabd yellow/outline.
- Har scene mein HAMESHA kuch hilta: icon pop, text slide, chart bar grow, cursor click, silhouettes ki line.

## Scene types jo video mein dikhe (R-chunks inhi ke liye)
1. Chapter card: plane/icon + diamond frame + "CHAPTER 1" + title (R2)
2. Big kinetic text over B&W photo: "Always Takes the CHEAPEST" (R3)
3. Icon scene: 2-3 icons/silhouettes + chhota label, ticket, phone-wifi, seats grid, "Book Ticket" button + cursor click (R7)
4. Animated bar chart + count-up % (35% vs 6%) (R4)
5. Quote card: B&W cutout face + quote text + audience silhouettes neeche (R5)
6. Real clip/interview: video chal raha, neeche subtitle, "SOURCE: ..." tag (R1)
7. Social post card (tweet screenshot) + table screenshot jisme ek row highlight/zoom (R6)
8. Map region highlight + % icon (R6 mein ya baad)
9. Transitions: split yellow panel wipe, chevron arrows sweep, torn-paper yellow strip, zoom-in (R8)
10. Sponsor/ad segment: yellow panel + download icons + naam (R8, optional)

## Chunk queue Phase R (ek chat = ek chunk)
- R1 Video clip layer: scene mein Rahul ka clip (mp4 upload) + clip ke upar captions + source tag (text, Rahul khud likhe)
- R2 Chapter card
- R3 Kinetic big-text card (photo B&W + bada text, shabd-wise yellow/outline)
- R4 Animated bar chart + count-up stat card
- R5 Quote card (photo-slot cutout + quote + silhouette strip)
- R6 Post/screenshot card (image upload + highlight box + zoom)
- R7 Icon scene card (icon list + silhouette + button-click cursor)
- R8 Naye transitions (split wipe, chevron, torn-paper) + optional sponsor card
Niyam wahi: chhote Hinglish jawab, photos upload (web se nahi), naye facts nahi, node --check + headless chromium test, TRACKER log, COMPLETE zip.

---
# VIDEO 2 (159069.mp4, 13 min, 640x360) — "Dark data-investigation" style
Sirf style reference. Logo/photos/clips copy nahi. Naye facts nahi jodna.

## Look
- Kaala/dark navy bg, halka blur/3D texture, ek cyan accent + lal (alert) + thoda peela. Chhota cyan label upar ("NOVEMBER 2026 · ONE WEEK"), baaki clean white text. Glass-panel cards (patle border, rounded).
- Data har jagah: har scene mein ek number/ chart/ map/ calendar/ document dikhta hai; "source" line neeche chhoti.

## Scene types (B-chunks inhi ke liye)
1. Horizontal bar compare (timeline bars, ek lal bar grow, 0h..5h axis) (B1)
2. Calendar week/month card: din ke box, 2-3 din highlight, label (SMART live / ground stop) (B2)
3. Document/advisory screen (monospace text, kuch lines highlight) + news article screenshot par highlight/underline animation (B3)
4. Map (dot-map, route lines, city dots + label, "4 of 22" counter, grid of squares "1 square = 1 center") (B4)
5. Big number count-up (5,224 / 78,000 / 64%) + chhota caption (B5; R4 se milta)
6. Ranked list card (1,2 rows with icon + date) + 3 "official explanations" cards + CLOSED stamp (B6)
7. Tweet/status post card (zoom + highlight text) (R6 se same)
8. Terminal/code window (typing lines, highlight) (B7)
9. Dot/cell grid fill ("1 dot = 1 char", "1 cell = $100M", $50 BILLION) (B8)
10. Clip + name lower-third (naam + pad) + bada quote-mark over clip (R1 + B9)
11. Split comparison (do cheezein side-by-side + % badge) (B10)
12. YouTube/ app mockup + Subscribe pill animation = channel CTA (B11)
13. Look: "Dark Data" preset (naya Look, bg texture + cyan accent) (B0)

## Chunk queue Phase B (video 2 se)
B0 Dark Data Look preset | B1 horizontal bar compare | B2 calendar card | B3 document/article highlight card | B4 dot-map + route + counter + square grid | B5 big count-up number (R4 ke saath merge ho sakta) | B6 ranked list + explanation cards + CLOSED stamp | B7 terminal window | B8 cell-grid fill | B9 clip name lower-third + quote mark | B10 split compare | B11 subscribe pill / mockup CTA

---
# DEEP PASS (C75) — dono videos har 8 sec par dekhe (115 + 100 frames) + cut detect
Pehle wale plan (R1-R8, B0-B11) mein ye CORRECTIONS aur NAYE chunks. Audio nahi suna (sirf frames); motion ka andaza frames ke beech ke badlav se.

## Rhythm / common rules (har chunk par lagu)
- Cuts: video 1 median shot ~2.9 sec, video 2 ~6.3 sec. Lekin bahut scenes ek ke andar MORPH hote hain (element agle scene mein badalta/saath chalta: plane -> seats -> map; silhouette sab mein). Matlab sirf "cut" nahi, ek scene ka element agle mein le jaana bhi chahiye (carry-over/morph) -> nayi cheez "G1".
- Koi frame static nahi: har scene mein slow push-in/drift. Bg par hamesha dheere hilti texture (V1: grid + diamond pattern; V2: blurred bokeh/contour lines).
- Har video ka ek RECURRING MOTIF (V1: yellow silhouettes + audience crowd; V2: dot-map + 1 cell = 1 unit). Tool mein "motif" = ek chuni hui cheez jo kai scenes mein wapas aaye.
- Har scene par chhota label chip upar (V2: "NOV 13 · COMMUNICATIONS OUTAGE") ya bada hook word (V1).
- Clips par: neeche subtitle + "SOURCE: ..." tag (Rahul khud likhe, tool nahi banata).
- Face photos: B&W/halftone + blue/duotone bg shapes, kabhi cutout bada, kabhi TV/phone frame mein.

## Video 1 mein NAYE scene types (jo pehle plan mein nahi the)
R9  Opening hook montage: bada plane/icon + bada number ("x 180,000,000", giant "9.99") + outline text ko 3 baar stack ("INFAMOUS" x3, beech wala fill)
R10 Photo collage (tilted 3-4 photos) + bada yellow word ("STRAP")
R11 Name tag lower-third: naam bold + neeche chhota pad ("X — Y ke personal assistant"), peeli bar
R12 Bada saal ("1984") + 2 flag + person photo + naam
R13 Giant outline word peeche ("TRUST") + beech mein icons (handshake) / pie chart ke saath face
R14 End screen: "THANK YOU FOR WATCHING" + 2 video slot + subscribe (blue/yellow frame)
R15 Device/frame cards: vertical phone-video frame, TV-frame mein clip, departures board
R16 Seat/people icon rows jo slide karti (repeat icon row + count: "200 seat") + silhouette; wheelchair/PAY arrows jaisa icon+price badge
R17 Social icons circle + comment/"horror stories" frame + tweet pile (R6 ke saath)
R18 Full yellow URL card (sponsor/CTA: "site.com/name — link description mein") + search-bar UI mock (R8 ke saath)
R19 Texture bg cards: $ bills pattern, repeated icons grid (4K/video/$ icons) — bg pattern generator

## Video 2 mein NAYE scene types
B12 3 time-zone clocks (city + time + status pill "Disconnected")
B13 Waveform/timeline ("one week, five events") with event pins
B14 Checklist panel ("Investigation": checkbox rows, last row faded)
B15 File-folder UI + locked/"Not published" item
B16 Countdown ring/timer ("40:16", "1 tick = 1 minute")
B17 Blur/redaction on text (screenshot ke kuch shabd dhundhle, kuch highlight)
B18 Before/after/triple map ("2009 / 2023 / 2026" mini-maps)
B19 Leaderboard/app-UI mock card (ranked rows, 1st bada)
B20 3D stacked layers ("Network config" 4 layer tilt)
B21 Dot-cloud 2-group fill (1% vs 0%: dot blobs) — B8 ke saath
B22 Logo/brand reveal (end sting)
B23 Chip-label system: upar chhota cyan label + date chip (common component, B0 ke saath)

## G (global/common, kisi ek video ka nahi) — pehle karne layak
G1 Carry-over/morph: scene ka ek element agle scene mein bina cut ke jaaye
G2 Auto push-in/drift har scene par + bg moving texture layer
G3 Motif tool: ek silhouette/crowd/dot-grid set chuno, kai scenes mein auto lage
G4 Count-up + bar-grow + highlight-sweep animation helpers (R4/B1/B3/B5 sab use karenge)

## Suggested order (Rahul tay karega, sab videos ke baad)
G2 -> G4 -> R1(clip layer) -> R2 -> R3 -> B0/B23 -> B1 -> R4/B5 -> B3 -> B4 -> R5/R11 -> R6 -> baaki. G1/G3 baad mein (mushkil).


---
# VIDEO 3 (159067.mp4, 21 min, 640x360) — "Premium minimal tutorial" style (C76)
Ye ek AI-video-editing tutorial hai: presenter (talking head) + beech-beech mein clean explainer cards. Sirf STYLE reference. Logo/photos/clips copy nahi. Naye facts nahi jodna. Audio nahi suna (sirf frames: har 8 sec par 157 frame). Scene-cut ~101, matlab average shot ~12 sec (presenter wale lambe, cards chhote).

## Look
- Dark charcoal/navy bg, halka vertical-stripe panel + gradient glow. Sab kuch minimal: bahut kam rang, ek BLUE accent (#3b9bff jaisa), baaki white/grey.
- Typography ka trick: sans (Inter jaisa) text, aur ACCENT shabd serif ITALIC + blue ("how the AI tools work", "cinematic", "psychology"). Yehi is video ki pehchaan hai.
- Soft rounded cards, halki shadow/glow, patli border. Kuch bhi bhaari nahi; bahut khaali jagah.
- Vertical (9:16) phone-frame clips cards ke beech mein (rounded corners) — ek, teen, ya poori wall.

## Scene types (V-chunks inhi ke liye)
V1  Presenter full + neeche subtitle (chhote, 1-2 line)
V2  Presenter ek taraf + doosri taraf bada text/card ("Learn the basics of ...", "The link is down below" + button card)
V3  Chapter card: "Chapter 1" + chhota subtitle + neeche 3 icon (rounded square) + label; ya presenter par "Chapter One" lower-third (serif italic)
V4  Bullet list: 4 lines, har line ka ek shabd blue serif italic, ek-ek karke aati
V5  Vertical phone-frame clip + annotation arrows (patli curved line + label: "paper background", "Darken the edges", "Blur the edges")
V6  Clip ke saath callout card: script line, jisme kuch shabd highlight (peela/neela) + arrow clip tak
V7  Phone-frame wall: 3-10 vertical clips ki grid/fan, bg mein blur wall (zoom out/zoom in)
V8  Labelled card grid: numbered cards ("9 Object + text", "10"), ek card glow ke saath highlight
V9  Comparison do window (screenshot) side-by-side + neeche label ("Design fundamentals" / "Editing psychology")
V10 Price/plan cards (Pro $20 vs Max $100, ek highlighted + chhota badge) + presenter
V11 Time-breakdown list: rows (icon + naam + "15 min"), ek-ek row aati, bar fill; baad mein total
V12 CTA pill button ("Join ..." blue rounded) + "only 14 days left" (serif italic number)
V13 Product/ad card: price (cut-out purana, bada naya), "Buy now" blue button, tweet-wall (proof) piche
V14 Screen-recording UI (browser/app window) — beats list, option cards (A/B/C), cursor click; tool ke andar ek "UI mock" card
V15 Chat/terminal dark window (checklist steps tick hote)
V16 Floating label chips + pill labels neeche ("Short-form skill", "Long-form skill") + 2x2 thumbnail grid

## Rhythm / rules (is video se)
- Presenter ke baad har 5-15 sec mein ek card aata, phir presenter wapas. Card ke time presenter chhota hokar ek side mein chala jaata (60% presenter / 40% card) — presenter KABHI gayab nahi, card uske saath.
- Words jaise-jaise bole jaate, wahi screen par aate (word-sync); accent shabd italic+blue.
- Annotation arrows (patli line, chhota dot, label) clip ke upar — "ye kya hai" samjhane ke liye. Har arrow draw hota (line grow).
- Zoom: phone-frame par slow push-in; bg blurred wall par slow drift.
- Cricket mapping: presenter = Rahul ka clip (R1 se milta); phone-frame clip = Short ka preview; annotation = ground/replay par arrows (kaun sa shot, kaun sa fielder).

## NAYE common helpers (G chunks mein judenge)
G5 Serif-italic accent word: text mein *shabd* likhne par wo blue + serif italic (saare cards mein kaam kare). Pehle karne layak, chhota.
G6 Annotation arrow tool: scene par curved-arrow + label ka list (draw animation)
G7 Split layout: presenter/clip ek taraf (chhota) + card doosri taraf (R1 ke baad)

## Chunk queue Phase V (video 3 se)
V1 presenter+subtitle (R1 mein hi) | V2 chapter card (R2 se merge) | V3 bullet list serif accent (G5 ke saath) | V4 phone-frame clip + annotation arrows (G6) | V5 phone-frame wall/fan | V6 numbered card grid | V7 compare 2 windows | V8 plan/price cards | V9 time-breakdown list | V10 CTA pill + days-left | V11 product/price ad card | V12 UI-mock window with option cards | V13 checklist/terminal (B7 se merge) | V14 label chips + 2x2 grid
Suggested: G5 -> G7 -> V4/G6 -> V3 -> baaki. Final order sab videos ke baad Rahul tay karega.


---
# VIDEO 4 (159071.mp4, 5 min, 854x480) — "Hinglish mobile-tutorial / neon icon-card" style (C77)
Mobile video-editing/audio tutorial (Hinglish). Sirf STYLE reference. Logo/channel naam/cartoon copy nahi. Naye facts nahi jodna. Audio nahi suna (har 4 sec par 77 frame + scene-cut ~24).

## Look
- Gehra navy/kaala bg, halki vertical glow lines. Neon BLUE (glow) accent + LAL (alert/bold outline text) + hara (tick/OK). Bold rounded sans (Montserrat jaisa), glow text.
- Glass/rounded-square ICON TILES (red mic, green headphone, yellow music, blue magic) + neeche coloured pill label ("Difference" lal, "Clean" hara, "Clarity" peela, "Polished" neela).
- Blue neon-border PLAYING-CARD tiles ("Recording" / "AI enhance" / "Editing") — step cards.
- Cartoon/AI character (illustrated host) alag-alag jagah: kursi par, mic pakde, phone pakde; kabhi circle frame mein.
- Har scene mein sab kuch ek-ek karke POP hota (icon tile pop, pill slide, arrow draw).

## Scene types (N-chunks inhi ke liye)
N1  Icon tiles row (2-4 tiles + coloured pill label), ek-ek karke pop (R7 se milta)
N2  Neon step-cards ("Step no.2 / Editing" bada glow text + blue border cards, 3 cards fan)
N3  Phone screen-recording clip (vertical, beech mein, kinare blur/dark) + app UI par zoom/highlight
N4  Landscape screen-recording (audio editor jaisa) full width, menu/dialog par zoom + cursor/tap dot
N5  Toggle/check pill ("AI Voice ✗" / "original Voice ✓") — red cross / green tick animate
N6  Comment-card: @naam + comment text (glass card) + "MOSTLY ASKED QUESTION?" red outline heading + audio-player bar
N7  Channel promo card: logo + "339k Subscribers" white pill + 2-3 video thumbnail cards + "SUBSCRIBE" character board (outro CTA)
N8  Big red outline word ("PROFESSIONAL", "READ") + character/doc image (word-by-word kinetic)
N9  Diagram: mic -> arrow -> AI icon + "Clean result after enhancement" + waveform bar (neon cyan)
N10 Price-tag/crossed item: mic image par lal cross + "$10,000" badge
N11 Doc/paper image ("Scripting Format") + folder icon (red folder) — props
N12 Plain centered text caption ("Main milunga apse next video main") + circle "TOPIC ??" end card
N13 Measurement label: phone + "6 to 8 inches / Side angle" red line annotation (G6 arrows se)
N14 Meme overlay: chhota reaction-face blur/dark overlay (optional, funny moment)
N15 Waveform strip (cyan bars) + "ME" avatar circle, glow

## Rhythm / rules (is video se)
- Bahut kam hard cut; zyadatar ek scene mein element add/remove (tile add hota, purana dim hota) = G1 morph/carry-over ka best example.
- Clip par zoom: dialog/slider par push-in, baaki dim (spotlight). -> G8 "spotlight zoom + dim".
- Hinglish text bold, bada, 1-2 line, bottom/center; keywords RED outline ya NEON blue.
- Character image har jagah alag pose; tool mein photo-slot (Rahul upload) se hi.
- Cricket mapping: icon tiles = (Batting / Bowling / Fielding / Records), screen-recording = scorecard/app clip, comment card = fan question, toggle = "Dream XI nahi" jaisa kuch NAHI (fantasy rule!), N7 = channel CTA.

## G helpers (naye)
G8 Spotlight zoom: clip ke ek hisse par zoom + baaki dim (N3/N4)
G9 Pop-in sequencer: tiles/pills ek-ek karke bounce-pop (N1, N2)
G10 Neon glow text style (blue/red outline, glow) — caption style mein bhi

## Chunk queue Phase N (video 4 se)
G9 -> N1 icon tiles | N2 step-cards | G8 -> N3/N4 screen-clip spotlight | N5 toggle pills | N6 comment card | N7 channel promo/outro | N8 outline kinetic words | N9 diagram arrow | N13 measure label | baaki (N10-N12, N14, N15) baad mein.

# VIDEO 5 (159073.mp4, 22 min, 640x360) — "Purple-glow faceless-channel tutorial" style (C78)
YouTube faceless-channel-ideas tutorial (Hinglish presenter + AI-chat + analytics screens). Sirf STYLE reference. Logo/channel naam/thumbnails/clips copy nahi. Naye facts nahi jodna. Audio nahi suna (har 12 sec par 111 frame + ~150 scene-cut, average ~9 sec).

## Look
- Kaala bg + neeche/side se bada PURPLE/violet glow arc (halo) — har card scene mein wahi. Accent: violet + chhota peela-hara connector line; baaki white.
- Rounded glass cards, patli violet border + halki glow. Bold clean sans (Inter/Poppins jaisa). Heading chhota upar ("Channel idea 1"), uske neeche bada violet-gradient shabd ("Secret state file").
- Presenter (Rahul jaisa) talking-head dark room mein: kabhi full, kabhi bg blur karke uske upar card.
- Screen-recordings (analytics page, AI chat box, editor) rounded card mein, baaki dark/blur; sensitive numbers BLUR.

## Scene types (P-chunks inhi ke liye)
P1  Idea title card: chhota "Channel idea N" + bada violet gradient naam (kinetic fade-up)
P2  Icon-chip row/carousel: rounded-square icons + label (Warships/Mythology/Food History...), ek chip highlight, row side mein scroll
P3  Flow/connector diagram: ek node se curved line (glow) 2-3 cards tak ("Reference Channels"); node -> arrow -> node (Step 1/2/3, "Content Daily Upload"); neeche chhota pill label
P4  Chat-box mock (AI chat): "How can I help you today?" + type hota prompt (typewriter) + jawab mein chips/pills ("Here are artists..." chips). Tool ke andar "UI mock" card — sirf generic chat, kisi company ka logo nahi
P5  Stat/analytics card: bada number ("$29,145", "$5.58 RPM", "3.83M") + chhote label + blur kiye hue baaki; ek card violet border se highlight; paise (notes) upar se girte (particle)
P6  Thumbnail wall/grid: 6-12 thumbnails ek grid mein, ek highlight + chhota label ("Full Documentary"); wall par slow drift/zoom
P7  Single video card (screen-clip) rounded + violet border, neeche title/views/time; clip chalti hui
P8  Ladder/progress list: 4 steps horizontal (icon + label, arrow se joda): High Quantity -> Similar Earnings -> ...; ya vertical depth bar (Explored / Barely Explored / ?)
P9  Gauge/meter: speedometer ("High RPM") ya monitor-card ("$5.58 RPM") + 2 chhote circle stat (66.1% / 47.8%)
P10 Bar-list card ("Top Geographies": naam + bar + %), neeche 3 thumbnails
P11 Tree/hierarchy: crown icon -> 2 -> 4 nodes (Old Money / Wealth Passed Down) — family-tree style
P12 World dot-map: dot-matrix map par violet dots + labels (Greek/Japanese/Egyptian)
P13 Playing-card tiles (character cards: Greek / Japanese / Egyptian) + neeche brace label ("Mythologies")
P14 Prompt-to-output fan: ek centre sparkle -> 3 cards ("Script + By Claude", "Voiceover + By AI", "2D Explainer Video") — G3-type split tree
P15 Comment/reply cards: ek source card -> arrow -> 3 comment rows (avatar + @naam + text)
P16 Count-up ring: "17 Channel Ideas" — beech mein bada number, aas-paas logo-circles ghoomte (end recap)
P17 Compare two cards + arrow ("Deep Sea: DON'T GO IN" -> "Deep Space: WE CAN'T SEE IT") + pill label neeche
P18 Bonus pair: do bade rounded card (gift icon, "Bonus Idea 1/2")
P19 Product/icon node (shopping bag "Product Sales", "Chess" icon-tile) — ek tile + connector line jo agle tile tak jaati
P20 Screen-record zoom (video editor: "Effect Controls", Scale 102% slider, timeline) — cursor + highlight box + bada "Scale 102%" callout

## Rhythm / rules (is video se)
- Presenter -> card -> presenter chakra: har idea ke liye (1) P1 title, (2) screen-proof (P5/P6/P7), (3) AI-chat step (P4), (4) presenter ka tip. Card ke beech hard cut kam, element add/remove (carry-over).
- Har card par glow halo ek jaisa rehta -> ek hi "Purple Look" preset se sab cards.
- Typewriter prompt + chips pop-in; numbers count-up; sensitive stats blur (blur toggle).
- Cricket mapping: idea title = "Video idea N" / "Team ki khabar N"; analytics card = views/RPM-jaisa NAHI, scorecard/stat (sirf confirmed facts); thumbnail wall = Rahul ke apne thumbnails; chat-box mock = fan question card (fantasy/betting NAHI); flow diagram = Khabar -> Verify -> Script -> Voice -> Video (daily chakra); gauge = "Confirmed/Rumor meter"; world map = IPL teams ke sheher dot-map; ring = "10 Teams" end recap.

## NAYE common helpers (G chunks)
G11 Purple Glow Look preset: bg + halo arc + glass card + violet border ek click (looks.js mein 6th Look) — sabse pehle (baaki sab iske upar)
G12 Typewriter sequencer: text ek-ek akshar, cursor blink, phir chips pop (P4 + caption style mein bhi)
G13 Connector-line draw: node se node tak glow curved line grow + dot (P3, P8, P11, P14 ke liye; G6 arrows se judta)
G14 Blur-sensitive toggle: clip/screenshot ke ek hisse par blur patch (P5)
G15 Falling-particle layer (notes/sparks upar se girte; polish.js ke embers se milta)

## Chunk queue Phase P (video 5 se)
G11 -> P1 idea title | G13 -> P3 flow | G12 -> P4 chat mock | P5 stat card (+G14, G15) | P6 thumbnail wall | P8 ladder | P16 count-up ring | P2 icon chips | baaki (P7, P9-P15, P17-P20) baad mein.
Suggested common order (Rahul tay karega): G2, G4, G5, G9, G11, R1 pehle (overlap: P5 = R4/B5 count-up, P14 = G3, P3 = G1/G6, P16 = B5, G12 = G10 caption style).

# FINAL: ab 5 reference videos ho gaye (R, B, V, N, P). Rahul sab ko dekh ke final chunk order tay karega. Overlap bahut: R1 clip layer, G1 morph, G2 push-in, G4/G9 animation helpers, G5/G10 text styles, G6 arrows, G8 spotlight, count-up/bar (R4/B1/B5), CTA/subscribe (B11/N7/V12), purple-glow look + connector/typewriter (G11-G13, video 5). Pehle ye COMMON waale karna sahi rahega.

# VIDEO 6 (159304.mp4, 26 min 16 sec, 854x480) — "Navy-blue glass-card tutorial" style (C79 plan, C92 mein docs mein joda)
YouTube-channel-shuru-karne ka Hinglish tutorial: presenter (brown hoodie, teal kamra) + beech-beech mein animated cards/charts/screen-recording. Sirf STYLE reference. Kisi ka logo, channel naam, thumbnail, creator ka naam, platform ke nakli numbers (jaise monetization thresholds) COPY nahi. Naye facts nahi jodna. Audio nahi suna (sirf frames: har 20 sec par 79 frame + scene-cut count).

## Sabse badi baat (pichle 5 videos se alag)
- 26 min mein sirf ~9 hard cut. Baaki sab ek hi canvas par cards MORPH hote hain (ek element agle scene mein ghoom ke badal jaata hai). Matlab G1 (carry-over/morph) is video ka dil hai.
- Presenter sirf ~8 baar aata hai (~10-20 sec har baar): 1:40, 3:00, 8:40, 9:40, 15:00, 18:40, 21:40, 22:00. Baaki 90% animated cards.
- Har beat par UPAR ek chhoti header line badalti hai (chapter/topic) jisme ek shabd PEELA hota hai. Neeche caption bhi "white + ek peela shabd".

## Look
- Bg: gehra NAVY-BLUE (#0A1330 se #0B1F5C), beech mein halka blue radial glow, kinaare dark vignette. (Purple nahi, blue.)
- Accent: PEELA (#F5C518 jaisa) = important shabd/number/bar; blue (#3B82F6) = progress/check; HARA = achha/paisa/growth; LAAL = galat/warning/gir-ta curve; baaki white.
- Glass cards: rounded, patli light border, halki dark-blue fill, soft shadow. Pills (chhoti rounded labels) neeche: dot + text (green dot "Level 1: upload videos", red dot "Needs: no active strikes").
- Font: clean bold sans (Inter/Poppins jaisa). Bade numbers bold peele. Chapter banner: peeli patti, andar kaala bold text ("02 The algorithm").
- Charts: patli glowing line + end par chamakta dot; area ke neeche gradient fill (laal ya hara); axis label bahut chhote.
- Screen-recordings (Settings, sign-in) dark UI mein, kinaare blur/dim, ek hissa PEELE rectangle se highlight + cursor + neeche pills.

## Scene types (Y-chunks inhi ke liye) — [time] = video mein kahan dikha
Y1  Opening burst: screen-record whip-blur + bada peela bar/number ("375x") grow [0:00-0:10]
Y2  Comment card 3D-tilt: 3 comments, ek peele border se highlight + pill ("Most common doubt") [0:20]
Y3  Chapter list (3D perspective stack): "9 chapters", 01-09 rows, current row highlighted; baad mein har row par blue tick (progress) aur row 06/07 par peela circle. Video mein 3 baar aata hai (0:40, 1:00, 17:40) [KEY scene]
Y4  Timeline slider: line par dot "2018" slide hota hai [1:20]
Y5  Growth-curve chart: ek ya do curve (hara growing + peela), end-dot glow, upar chhota label ("YouTube is still growing") [1:40-2:00]
Y6  Two-curve compare: laal spike (views gir jaate) vs hara lambi dum wali curve; x-axis Day 1/2/7/25/2 months [3:20]
Y7  Brand-chip card: icon + naam + "by ..." (rounded chip) — generic chip, kisi company ka logo nahi [2:20]
Y8  Presenter-in-portrait-card (daayein) + baayein text with peela keyword ("Link in the description") [2:40, 3:40]
Y9  3 tile row: icon + label (Video editing / Thumbnail design / Scripting) + neeche hara "+$1,200"-type pill + banner pill [4:00]
Y10 Chapter title banner: peeli patti "02 The algorithm" + upar lock-pill ("One simple rule, at the end") [4:20]
Y11 Store/market grid: dark window mein rangeen product-cards ki grid + 4 avatar (badge ke saath) + chhote labels ("Crores of videos", "Crores of customers") [4:40]
Y12 Single avatar "One viewer" + star-rating card (4/5 stars) + 2 tile ("How much you watched" + "Did you like it?") [5:00-5:20]
Y13 Phone mock (feed scroll) + counter box "Impressions 1" [5:40]
Y14 Dot-crowd grid: 100 chhote avatar dots, 10 highlight + card "10% CTR" [6:00]
Y15 "Depends on 3 things" single card (bulb icon, "Video idea") jo 3 mein khulta hai [6:20]
Y16 Bar-race / total list: har bar par avatar + "5 min" + neeche equation "5+4+2+1+1 = 13 min" (count-up) [6:40]
Y17 Two big stat cards (1,000 / 4,000) + pill ("From ... double") [7:00] (cricket mein: stat card sirf confirmed number)
Y18 Dashboard mock: 4 metric tiles + line chart (analytics card) [7:40]
Y19 Two big words "CTR" / "Watch time" + neeche chapter pills [8:20]
Y20 3 numbered question cards (1 Am I interested? / 2 Do people search it? / 3 Can I be different?) [9:00]
Y21 Compare 2 columns with tick/cross list (Facecam vs Faceless) [9:20]
Y22 Hub diagram: beech mein "Old Gmail" node, 8 spokes (Apps, Forum, Music...) + dusra card "New account" [10:00]
Y23 Screen-record + highlight: sign-in/Settings window zoom, peela rectangle, cursor, dim baaki [10:20-14:40, SABSE LAMBA hissa]
Y24 Level/step list card: Level 1/2/3 rows, 3 tick, neeche "To unlock: Intermediate first" pill [11:20-12:00]
Y25 3 option cards (icon + title + chhoti line) + 2 pills neeche (hara "Want it fast?" / grey "Unlocks by itself") [12:20]
Y26 Setting-step pill label (upar header "Setting 3: Keywords", neeche 3 pills: Channel name / Misspellings / Your niche) [13:20]
Y27 Radio-option list with highlight (2 rows peele border) + pill ("Not for kids: teens & adults") [14:00]
Y28 3 idea cards (icon + title + sub) + neeche avatar chip "Your audience" [15:20]
Y29 Phone-reel mock + bada "4.4M views" + gauge "2%" [15:40] (cricket mein sirf Rahul ke apne ya confirmed number)
Y30 Empty search-bar (rounded) — typewriter [16:00]
Y31 Formula card: "CTR = Clicks ÷ Impressions" + 2 arrows se Thumbnail / Title label [16:20]
Y32 BEFORE/AFTER thumbnail pair (laal X BEFORE, hara tick AFTER) + side card (red progress bar "attention span") [16:40]
Y33 Two phones side-by-side (compare) + chhota caption "Most people watch on a phone" [17:00]
Y34 Gauge (18% CTR) + retention curve gir-ti [17:20, 18:00]
Y35 3-step card row (dim, "Step 1/2/3") + caption "what everyone does backwards" [18:20]
Y36 Expectation diagram: thumbnail card ---- thought-bubble ("I'll learn...") ---- user avatar + hara tick + pill [19:20]
Y37 "First line = title / First shot = thumbnail": 2 label card + connector lines + example mini-card [19:40]
Y38 Context + Payoff 2 cards + neeche timeline bar "0s ... 20s" ; phir 3 thumbnail mein "?" + blue progress line [20:20-20:40]
Y39 Tick-grid (chhote hare tick ki grid) + quote pill + retention line [21:20]
Y40 "Visual variety": avatar video-box (red rec dot, "No cut for 10 seconds") + emoji "Viewers get bored" card + laal bar [22:20]
Y41 Tutorial vs Vlog 2 card (red X / peela smile) [23:00]
Y42 Energy-cycle curve: dip-curve (laal) "Hook ... Payoff" ; sine-wave peeli numbered 01-05 nodes [23:20-23:40]
Y43 "Best for last": hara curve gir ke theher-ti + end-dot [24:00]
Y44 4-card row (1 filled "Ads" + 3 locked "?" "coming up") + pill ("Ads are just the start") [24:20]
Y45 Long-videos card: 2 big number (1,000 hara/peela, 7,421 laal) + laal pill [24:40]
Y46 Audience dots + "You" avatar (sponsorship); Offer card with Accept/Decline + cursor click [25:00-25:20]
Y47 Product tiles (Courses / Templates) + growth curve "Then launch" [25:40]
Y48 End screen: "Watch next" video card bada + title/channel/views [26:00]

## Rhythm / rules (is video se)
- Ek idea = ek canvas. Beech mein cut nahi: pehla card -> doosra card us ke ek element se nikalta hai (morph/carry-over). Hard cut sirf presenter <-> card badalne par.
- Header line upar: har beat par badalti hai, ek shabd peela. Caption neeche sirf jab presenter bol raha ho aur card khaali ho.
- Har card 6-15 sec; pehle 1-2 sec mein title, phir elements ek-ek karke pop-in (sequencer), aakhri 1 sec mein agle scene ki taraf drift.
- Numbers hamesha count-up; curves hamesha draw-in (left se right); end-dot chamakta.
- Pill (dot + text) har card ke neeche ek ya do: hara = fayda/ok, laal = khatra, peela = tip.
- Presenter slot: teal bg full frame ya chhote portrait card mein; text baayein, peela keyword; 10-20 sec se zyada nahi.
- Settings-type screen-record par kam se kam 3 cheezein ek saath: highlight box + cursor + pill. Sensitive cheez BLUR.

## NAYE common helpers (G chunks — pehle karne layak, G1-G15 ke baad)
G16 Header-line + yellow keyword: upar ki chhoti line aur neeche ka caption; text mein *shabd* likho to peela (G5 serif-italic jaisa, par yahan peela+bold). Har card par auto fade-swap. SABSE PEHLE, chhota.
G17 Navy Glow Look preset: bg navy + radial glow + glass card + pill style ek click (looks.js mein 7th Look; G11 purple ka bhai).
G18 3D-tilt list/stack card (perspective, row highlight, tick pop) — Y2, Y3 ke liye.
G19 Highlight-box + cursor tool: screen-record/screenshot ke ek hisse par peela rectangle draw + cursor move + baaki dim (G8 spotlight se jodna) — Y23 ke liye.
G20 Pill row component: dot + text, hara/laal/peela/grey, 1-3 pills ek line mein, pop-in.
G21 Curve-draw chart helper: 1-2 curve, glow end-dot, area gradient (laal/hara/peela), axis labels; peak/dip par chhota label (G4 count-up/bar se judta).
G22 Carry-over scene sequencer (G1 ka asli form): ek scene ke element ko agle scene mein "same id" se animate. Is video ki zaroorat; mushkil, G1 ke saath hi kare.

## Cricket mapping (kya banega, naye facts bina)
- Y3 chapter list = video ke chapters (Khabar / Verify / Teams / Rumor-Official / Predictions...).
- Y5/Y6/Y21 curves = form graph / confirmed-rumor trend; sirf confirmed ya "Rumor" label ke saath.
- Y14 dot-grid = 10 teams / 100 overs dot-grid.
- Y12 rating card = "Fan sawaal" card (fantasy/betting NAHI).
- Y17/Y45 big stat = confirmed score/auction number.
- Y22 hub = ek player/team ke aas-paas khabar spokes.
- Y36/Y37 = "Title + thumbnail promise" ka cricket version.
- Y44/Y47 locked "?" cards = "agle video mein" teaser.
- Y48 end screen = agla video card.

## Chunk queue Phase Y (video 6 se) — ek chat = ek chunk
Pehle: G16 -> G17 -> G20 -> G21 -> Y3 (+G18) -> Y10 -> Y5/Y6 -> Y14 -> Y19/Y20 -> Y23 (+G19) -> G22/G1 -> baaki.
Suggested common order (Rahul tay karega): G2, G4, G5, G9, G11, G16, G17, R1 pehle (overlap: Y5/Y21/Y34 = R4/B1 count-up; Y14 = B8/B21; Y23 = N3/N4 + G8; Y46 = N6; Y48 = B11/N7/V12; G20 = V14 chips).

# FINAL v2: ab 6 reference videos ho gaye (R, B, V, N, P, Y). Rahul final chunk order tay karega. Video 6 ka naya common: G16 header+peela shabd, G17 Navy Glow Look, G20 pill row, G21 curve-draw, G22 carry-over (G1 ka asli form).
