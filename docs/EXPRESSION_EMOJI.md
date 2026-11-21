# Expression emoji + pause chinh (C191)
Script mein har expression par ek emoji aur rukne ki jagah ⏸ (chhota ~0.5s) / ⏸⏸ (lamba ~1s). Ye bolne ke liye nahi, voice-over mein hold/expression ka cue hai.
Emoji: 😲 hairani | 🤔 soch | 👀 dhyaan | 🤨 shak/ulti baat | 😏 halka mazaak | 😌 thehra | 🙂 narm | 😅 halki hansi.
## Teleprompter (teleprompter.html)
- scenes.json ke pehle scene ke "script" se apne aap aati script (🎤 Script teleprompter mein bhej di) mein emoji/⏸ jaisa likha waisa dikhte hain: emoji bade (1.45x), ⏸ gulabi dashed chinh (⏸⏸ chaudha). Chunk info mein shabd-ginti emoji/⏸ chhodkar.
## Captions (js/captions.js)
- Script captions mein jaye to ⏸ aur emoji apne aap hat jaate hain (screen par caption mein nahi dikhte, timing/line ginti nahi bigadti). CAP.clean(s) se bhi.
## Test
node --check (captions.js + teleprompter inline JS) OK; emoji/⏸ tokenizer aur clean() ka unit test pass. Asli Chrome mein teleprompter khol kar dekha NAHI.
