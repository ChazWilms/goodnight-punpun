# GOODNIGHT PUNPUN — fan game

An unofficial, non-commercial fan game adaptation of **Inio Asano's _Oyasumi Punpun_ (Goodnight Punpun)**, told as a 2D pixel-art story game in the style of Undertale / Deltarune.

**Play it in your browser:** https://chazwilms.github.io/goodnight-punpun/

- 13 chapters — one per volume of the manga, covering the entire story
- No combat. Just the story: walk, talk, choose, and live Punpun's life
- All art, music, and code are original and generated procedurally (no asset files)

## Controls
| Key | Action |
|---|---|
| Arrows / WASD | Move |
| Z / Enter / Space | Confirm, talk, advance text |
| X / Shift | Skip text fast |
| M | Mute |

## Content warning
This story deals with depression, abuse, and suicide, following the source material.
If you are struggling, you are not alone — 988 (US) or your local crisis line.

## Disclaimer
This is a fan tribute. _Oyasumi Punpun_ © Inio Asano / Shogakukan.
Please support the official release. No affiliation; no assets from the manga are used.

## Dev
Static site, no build step. `python3 -m http.server` and open `index.html`.
Headless test: `./verify/verify.sh 1 13` auto-plays every chapter and reports errors.
