'use strict';
// All pixel art is generated procedurally at boot — no image assets.

PP.art = {};

// ---- helpers ----
PP.art.mkCanvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
};

PP.sprite = (rows, pal) => {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const c = PP.art.mkCanvas(w, h);
  const g = c.getContext('2d');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = pal[row[x]];
      if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); }
    }
  });
  return c;
};

const PX = (g, x, y, c) => { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
const RECT = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

// ================= PUNPUN BIRD FORMS =================
// The Onodera family are all drawn as little birds.
const INK = '#16161e';
const BODY = '#f6f4ec';

// draws an outlined ellipse blob of given size at (ox,oy)
function blob(g, ox, oy, w, h, fill, ink) {
  const rx = w / 2, ry = h / 2, cx = ox + rx, cy = oy + ry;
  for (let y = 0; y < h; y++) {
    const dy = (y + 0.5 - ry) / ry;
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - dy * dy)));
    if (hw <= 0) continue;
    RECT(g, Math.round(cx - hw), oy + y, hw * 2, 1, ink);
  }
  for (let y = 1; y < h - 1; y++) {
    const dy = (y + 0.5 - ry) / ry;
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - dy * dy))) - 1;
    if (hw <= 0) continue;
    RECT(g, Math.round(cx - hw), oy + y, hw * 2, 1, fill);
  }
}

// bird sprite generator. opts: {bw,bh, legs, horns, dark, acc:'apron'|'tie'|'cig'|'hunch', }
PP.art.bird = (opts = {}) => {
  const bw = opts.bw || 12, bh = opts.bh || 10, legs = opts.legs == null ? 4 : opts.legs;
  const fill = opts.dark ? '#3a3a46' : BODY;
  const ink = opts.dark ? '#0a0a10' : INK;
  const eye = opts.dark ? '#f0f0e8' : INK;
  const W = bw + 4, H = bh + legs + 3 + (opts.horns ? 2 : 0);
  const top = (opts.horns ? 2 : 0) + 1;
  const dirs = {};
  for (const dir of ['down', 'up', 'left', 'right']) {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = PP.art.mkCanvas(W, H);
      const g = c.getContext('2d');
      blob(g, 2, top, bw, bh, fill, ink);
      if (opts.horns) {
        const hy = top - 2;
        PX(g, 4, hy + 1, ink); PX(g, 3, hy, ink);
        PX(g, W - 5, hy + 1, ink); PX(g, W - 4, hy, ink);
      }
      if (opts.dark) { // scribble texture
        for (let i = 0; i < bw * bh / 6; i++) {
          const x = 3 + (PP.hash2(i, bw) % (bw - 2)), y = top + 1 + (PP.hash2(bw, i) % (bh - 2));
          PX(g, x, y, '#22222c');
        }
      }
      const cy = top + Math.floor(bh / 2);
      if (dir === 'down') {
        PX(g, 5, cy - 2, eye); PX(g, 5, cy - 1, eye);
        PX(g, W - 6, cy - 2, eye); PX(g, W - 6, cy - 1, eye);
        PX(g, Math.floor(W / 2) - 1, cy + 1, ink); PX(g, Math.floor(W / 2) - 2, cy + 2, ink);
        PX(g, Math.floor(W / 2), cy + 1, ink); PX(g, Math.floor(W / 2) + 1, cy + 2, ink);
        if (opts.acc === 'tie') RECT(g, Math.floor(W / 2) - 1, cy + 3, 2, Math.max(bh / 2 - 2, 2), '#5a4a72');
        if (opts.acc === 'apron') {
          for (let y = cy + 3; y < top + bh - 1; y++) {
            const dy = (y + 0.5 - (top + bh / 2)) / (bh / 2);
            const hw = Math.round((bw / 2) * Math.sqrt(Math.max(0, 1 - dy * dy))) - 1;
            if (hw > 0) RECT(g, Math.round(2 + bw / 2 - hw), y, hw * 2, 1, '#e9cdd6');
          }
        }
      } else if (dir === 'left' || dir === 'right') {
        const lx = dir === 'left';
        const ex = lx ? 5 : W - 6;
        PX(g, ex, cy - 2, eye); PX(g, ex, cy - 1, eye);
        const bx = lx ? 2 : W - 3;
        PX(g, lx ? bx - 1 : bx + 1, cy - 1, ink); PX(g, bx, cy - 1, ink); PX(g, bx, cy, ink);
        if (opts.acc === 'cig') PX(g, lx ? bx - 2 : bx + 2, cy, '#d8d8d0');
      }
      // legs (stick), alternate on frame
      const ly = top + bh;
      const l1 = legs + (f === 0 ? 0 : -1), l2 = legs + (f === 0 ? -1 : 0);
      RECT(g, Math.floor(W / 2) - 3, ly, 1, l1, ink);
      RECT(g, Math.floor(W / 2) + 2, ly, 1, l2, ink);
      RECT(g, Math.floor(W / 2) - 4, ly + l1, 2, 1, ink);
      RECT(g, Math.floor(W / 2) + 2, ly + l2, 2, 1, ink);
      frames.push(c);
    }
    dirs[dir] = frames;
  }
  return dirs;
};

// high-school Punpun: a paper triangle with legs
PP.art.triangle = () => {
  const W = 16, H = 20;
  const dirs = {};
  for (const dir of ['down', 'up', 'left', 'right']) {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = PP.art.mkCanvas(W, H);
      const g = c.getContext('2d');
      for (let y = 0; y < 13; y++) {
        const hw = Math.round((y / 13) * 7) + 1;
        RECT(g, 8 - hw, y + 1, hw * 2, 1, INK);
        if (y > 0) RECT(g, 8 - hw + 1, y + 1, hw * 2 - 2, 1, BODY);
      }
      if (dir === 'down') {
        PX(g, 6, 8, INK); PX(g, 6, 9, INK);
        PX(g, 10, 8, INK); PX(g, 10, 9, INK);
      } else if (dir === 'left') { PX(g, 5, 8, INK); PX(g, 5, 9, INK); }
      else if (dir === 'right') { PX(g, 11, 8, INK); PX(g, 11, 9, INK); }
      const l1 = 4 + (f === 0 ? 0 : -1), l2 = 4 + (f === 0 ? -1 : 0);
      RECT(g, 5, 14, 1, l1, INK); RECT(g, 10, 14, 1, l2, INK);
      RECT(g, 4, 14 + l1, 2, 1, INK); RECT(g, 10, 14 + l2, 2, 1, INK);
      frames.push(c);
    }
    dirs[dir] = frames;
  }
  return dirs;
};

// ================= HUMANS (paper doll) =================
// opts: {hair:'short'|'bob'|'long'|'spiky'|'pony'|'messy'|'bald'|'buzz'|'afro',
//        hairC, skin, top, bottom, kid:bool, dress:bool}
PP.art.human = (o) => {
  const skin = o.skin || '#e8c49c';
  const skinD = '#b08560';
  const hairC = o.hairC || '#2a2a32';
  const top = o.top || '#7a8aa0';
  const topD = shade(top, -30);
  const bottom = o.bottom || '#4a4a5a';
  const shoe = '#26262e';
  const kid = !!o.kid;
  const W = 14, H = kid ? 18 : 21;
  const headY = 1, headH = 6;
  const torsoY = headY + headH, torsoH = kid ? 5 : 6;
  const legY = torsoY + torsoH, legH = H - legY - 1;
  const dirs = {};
  for (const dir of ['down', 'up', 'left', 'right']) {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = PP.art.mkCanvas(W, H);
      const g = c.getContext('2d');
      // legs
      const ext = f === 0 ? 0 : 1;
      if (o.dress) {
        RECT(g, 4, torsoY + torsoH - 1, 6, Math.max(legH - 2, 2), bottom);
        RECT(g, 4, legY + legH - 2 + 0, 2, 2, skin);
        RECT(g, 8, legY + legH - 2, 2, 2, skin);
        RECT(g, 4, H - 1 - (f ? 1 : 0), 2, 1, shoe);
        RECT(g, 8, H - 1 - (f ? 0 : 1), 2, 1, shoe);
      } else if (dir === 'left' || dir === 'right') {
        RECT(g, 5 + (f ? 1 : -1), legY, 2, legH, bottom);
        RECT(g, 7 - (f ? 1 : -1), legY, 2, legH - 1, bottom);
        RECT(g, 5 + (f ? 1 : -1), H - 1, 2, 1, shoe);
        RECT(g, 7 - (f ? 1 : -1), H - 2, 2, 1, shoe);
      } else {
        RECT(g, 4, legY, 2, legH - ext, bottom);
        RECT(g, 8, legY, 2, legH - (1 - ext), bottom);
        RECT(g, 4, legY + legH - ext, 2, 1, shoe);
        RECT(g, 8, legY + legH - (1 - ext), 2, 1, shoe);
      }
      // torso
      RECT(g, 4, torsoY, 6, torsoH, top);
      RECT(g, 4, torsoY + torsoH - 1, 6, 1, topD);
      // arms
      if (dir === 'left' || dir === 'right') {
        RECT(g, 6, torsoY + 1, 2, 4, topD);
      } else {
        RECT(g, 3, torsoY + 1, 1, 4, top); PX(g, 3, torsoY + 5, skin);
        RECT(g, 10, torsoY + 1, 1, 4, top); PX(g, 10, torsoY + 5, skin);
      }
      // head
      RECT(g, 4, headY, 6, headH, skin);
      RECT(g, 4, headY + headH - 1, 6, 1, skinD);
      // face
      if (dir === 'down') {
        PX(g, 5, headY + 3, INK); PX(g, 8, headY + 3, INK);
      } else if (dir === 'left') { PX(g, 5, headY + 3, INK); }
      else if (dir === 'right') { PX(g, 8, headY + 3, INK); }
      // hair
      const hy = headY - 1;
      const H_ = (x, y, w = 1, h = 1) => RECT(g, x, y, w, h, hairC);
      if (o.hair !== 'bald') {
        H_(4, hy, 6, 2); // cap
        if (dir === 'up') H_(4, hy, 6, headH - 1);
      }
      switch (o.hair) {
        case 'short': H_(3, hy + 1, 1, 2); H_(10, hy + 1, 1, 2); break;
        case 'buzz': break;
        case 'messy':
          H_(3, hy + 1, 1, 3); H_(10, hy + 1, 1, 3);
          PX(g, 4, hy + 2, hairC); PX(g, 9, hy + 2, hairC); PX(g, 6, hy - 1 + 1, hairC);
          break;
        case 'spiky':
          PX(g, 4, hy - 1, hairC); PX(g, 6, hy - 1, hairC); PX(g, 8, hy - 1, hairC);
          H_(3, hy + 1, 1, 2); H_(10, hy + 1, 1, 2);
          break;
        case 'bob':
          H_(3, hy + 1, 1, headH - 1); H_(10, hy + 1, 1, headH - 1);
          H_(4, hy, 6, 2); if (dir !== 'up') PX(g, 7, hy + 2, hairC);
          break;
        case 'long':
          H_(3, hy + 1, 1, headH + 2); H_(10, hy + 1, 1, headH + 2);
          if (dir === 'up') H_(4, hy, 6, headH + 2);
          break;
        case 'pony':
          H_(3, hy + 1, 1, 2); H_(10, hy + 1, 1, 2);
          if (dir === 'up') H_(6, hy + 2, 2, 5);
          if (dir === 'left') H_(10, hy + 2, 2, 4);
          if (dir === 'right') H_(2, hy + 2, 2, 4);
          break;
        case 'afro':
          H_(3, hy - 1, 8, 3); H_(2, hy, 10, 3); H_(3, hy + 2, 1, 2); H_(10, hy + 2, 1, 2);
          break;
      }
      frames.push(c);
    }
    dirs[dir] = frames;
  }
  return dirs;
};

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = PP.clamp((n >> 16) + amt, 0, 255), g = PP.clamp(((n >> 8) & 255) + amt, 0, 255), b = PP.clamp((n & 255) + amt, 0, 255);
  return `rgb(${r},${g},${b})`;
}
PP.art.shade = shade;

// ================= CAST =================
PP.art.buildCast = () => {
  const A = PP.art;
  PP.sprites = {
    // punpun forms
    punpun_kid: A.bird({ bw: 12, bh: 10, legs: 4 }),
    punpun_teen: A.bird({ bw: 12, bh: 12, legs: 6 }),
    punpun_tri: A.triangle(),
    punpun_adult: A.bird({ bw: 12, bh: 12, legs: 8 }),
    punpun_horns: A.bird({ bw: 12, bh: 12, legs: 8, horns: true }),
    punpun_dark: A.bird({ bw: 12, bh: 12, legs: 8, horns: true, dark: true }),
    // family
    mama: A.bird({ bw: 13, bh: 12, legs: 6, acc: 'apron' }),
    papa: A.bird({ bw: 13, bh: 13, legs: 7, acc: 'tie' }),
    yuichi: A.bird({ bw: 13, bh: 13, legs: 8, acc: 'cig' }),
    grandpa: A.bird({ bw: 13, bh: 11, legs: 5 }),
    // elementary cast
    aiko_kid: A.human({ kid: true, hair: 'bob', hairC: '#23232e', top: '#d8d0c4', bottom: '#7a3a44', dress: true, skin: '#ecd0ac' }),
    harumi_kid: A.human({ kid: true, hair: 'short', hairC: '#3a3026', top: '#90a8c0', bottom: '#3c3c48' }),
    seki_kid: A.human({ kid: true, hair: 'spiky', hairC: '#1c1c24', top: '#b05c4c', bottom: '#3c3c48' }),
    shimizu_kid: A.human({ kid: true, hair: 'buzz', hairC: '#2c2820', top: '#c8c050', bottom: '#4a5a40' }),
    komatsu_kid: A.human({ kid: true, hair: 'messy', hairC: '#4a3a2a', top: '#88b890', bottom: '#3c3c48' }),
    // middle/high school
    aiko_teen: A.human({ hair: 'bob', hairC: '#23232e', top: '#3e4456', bottom: '#5a3a44', dress: true, skin: '#ecd0ac' }),
    yaguchi: A.human({ hair: 'spiky', hairC: '#2a2018', top: '#e8e8e0', bottom: '#33333d' }),
    kanie: A.human({ hair: 'pony', hairC: '#56412e', top: '#e8e8e0', bottom: '#6a4a52', dress: true }),
    seki_teen: A.human({ hair: 'spiky', hairC: '#1c1c24', top: '#2e2e38', bottom: '#33333d' }),
    shimizu_teen: A.human({ hair: 'buzz', hairC: '#2c2820', top: '#d8d8cc', bottom: '#4a5a40' }),
    midori: A.human({ hair: 'long', hairC: '#4a3828', top: '#c8a8b8', bottom: '#69596a', dress: true }),
    teacher: A.human({ hair: 'short', hairC: '#55555f', top: '#777788', bottom: '#3c3c48' }),
    // adult arc
    aiko_adult: A.human({ hair: 'long', hairC: '#23232e', top: '#c8c4bc', bottom: '#5c5660', dress: true, skin: '#ecd0ac' }),
    sachi: A.human({ hair: 'messy', hairC: '#5c3a2e', top: '#e0b050', bottom: '#3a3a44' }),
    shishido: A.human({ hair: 'short', hairC: '#6a6a72', top: '#5a6a5a', bottom: '#3c3c48' }),
    pegasus: A.human({ hair: 'long', hairC: '#d8d4cc', top: '#e8e6e0', bottom: '#cac8c2' }),
    mitsuko: A.human({ hair: 'long', hairC: '#3a3340', top: '#6a5a66', bottom: '#473f4d', dress: true, skin: '#dcc0a4' }),
    publisher: A.human({ hair: 'short', hairC: '#26262e', top: '#46465a', bottom: '#33333d' }),
    barman: A.human({ hair: 'bald', top: '#3a3a44', bottom: '#26262e' }),
    nurse: A.human({ hair: 'bob', hairC: '#4a3a2a', top: '#e8e8f0', bottom: '#d8d8e4', dress: true }),
    man1: A.human({ hair: 'short', hairC: '#33332b', top: '#6a7a8a', bottom: '#3c3c48' }),
    man2: A.human({ hair: 'messy', hairC: '#222', top: '#8a7a6a', bottom: '#3c3c48' }),
    woman1: A.human({ hair: 'long', hairC: '#5a4a38', top: '#b0889a', bottom: '#5a4a58', dress: true }),
    woman2: A.human({ hair: 'bob', hairC: '#2e2e38', top: '#7a99a8', bottom: '#4c4c58', dress: true }),
    cultist: A.human({ hair: 'short', hairC: '#888', top: '#e8e6e0', bottom: '#cac8c2' }),
    kid1: A.human({ kid: true, hair: 'short', hairC: '#222', top: '#c05c50', bottom: '#3c3c48' }),
    kid2: A.human({ kid: true, hair: 'bob', hairC: '#4a3a2a', top: '#d8b868', bottom: '#6a4a52', dress: true }),
  };
};

// ================= GOD =================
PP.art.godPortrait = () => {
  const pal = {
    a: '#15101a', // afro
    A: '#241a28',
    s: '#c89c74', // skin
    S: '#a87c58', // skin shade
    e: '#101014', // eyes/lines
    w: '#f2efe6', // teeth/whites
    m: '#5a2e28', // mouth
    b: '#3a2c22', // stubble
  };
  return PP.sprite([
    '..........aaaaaaaaaaaa..........',
    '......aaaaaaaaaaaaaaaaaaaa......',
    '....aaaaaaaAaaaaaaAaaaaaaaaa....',
    '...aaaAaaaaaaaaaaaaaaaaAaaaaa...',
    '..aaaaaaaaAaaaaAaaaaAaaaaaaaaa..',
    '.aaaaAaaaaaaaaaaaaaaaaaaAaaaaaa.',
    '.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.',
    'aaaaaaAaaaAaaaaaaaaAaaaaaaAaaaaa',
    'aaaaaaaaaassssssssssssaaaaaaaaaa',
    'aaaaaaaaassssssssssssssaaaaaaaaa',
    'aaaaaaaasssssssssssssssseaaaaaaa',
    'aaaaaaassssssssssssssssssaaaaaaa',
    'aaaaaaesswwesssssssewwessaaaaaaa',
    'aaaaaaesseeesssssssseeeessaaaaaa',
    '.aaaaassssssssSssssssssssaaaaaa.',
    '.aaaaasssssssSssSssssssssaaaaa..',
    '..aaaasssssssSssSssssssssaaaa...',
    '..aaaassssssssSSsssssssssaaaa...',
    '...aabsssssssssssssssssbsaaa....',
    '...aabsbsbeeeeeeeeeebsbsbsaa....',
    '....absbsewwwwwwwwwwesbsbsa.....',
    '....assbsewwwwwwwwwwessbsa......',
    '.....asbsseewwwwwweesssbsa......',
    '.....asssssseeeeeesssssba.......',
    '......assssssssssssssssa........',
    '.......assssssssssssssa.........',
    '........sssssssssssss...........',
  ], pal);
};

// ================= TILES =================
PP.tiles = {};
const T = 16;
function tile(name, solid, fn) { PP.tiles[name] = { solid, draw: fn }; }
const spk = (g, x, y, n, c, salt = 0) => {
  for (let i = 0; i < n; i++) {
    const px = PP.hash2(x + i + salt, y + i * 7) % T, py = PP.hash2(y + i * 3, x + i + salt) % T;
    PX(g, x + px, y + py, c);
  }
};

tile('grass', 0, (g, x, y) => { RECT(g, x, y, T, T, '#4f7a42'); spk(g, x, y, 6, '#446a38'); spk(g, x, y, 3, '#5d8a4e', 9); });
tile('grass2', 0, (g, x, y) => { RECT(g, x, y, T, T, '#46703c'); spk(g, x, y, 7, '#3c6033'); });
tile('grassN', 0, (g, x, y) => { RECT(g, x, y, T, T, '#2e4630'); spk(g, x, y, 6, '#263c29'); });
tile('dirt', 0, (g, x, y) => { RECT(g, x, y, T, T, '#9a7e58'); spk(g, x, y, 6, '#8a6e4a'); });
tile('path', 0, (g, x, y) => { RECT(g, x, y, T, T, '#b0a088'); spk(g, x, y, 5, '#a09078'); });
tile('road', 0, (g, x, y) => { RECT(g, x, y, T, T, '#4c4c54'); spk(g, x, y, 4, '#44444c'); });
tile('roadL', 0, (g, x, y) => { RECT(g, x, y, T, T, '#4c4c54'); RECT(g, x, y + 7, T, 2, '#c8c8b0'); });
tile('swalk', 0, (g, x, y) => { RECT(g, x, y, T, T, '#8e8e96'); g.strokeStyle = '#7e7e86'; RECT(g, x, y, T, 1, '#9e9ea6'); RECT(g, x, y + 15, T, 1, '#76767e'); });
tile('cross', 0, (g, x, y) => { RECT(g, x, y, T, T, '#4c4c54'); for (let i = 0; i < 3; i++) RECT(g, x + 1, y + 2 + i * 5, 14, 3, '#c0c0ae'); });
tile('water', 1, (g, x, y, f) => {
  RECT(g, x, y, T, T, '#3a5e88');
  const o = f ? 3 : 0;
  spk(g, x, y, 3, '#4a6e98', o); spk(g, x, y, 2, '#2e4e74', o + 5);
  if ((PP.hash2(x, y) + (f ? 1 : 0)) % 3 === 0) RECT(g, x + (PP.hash2(y, x) % 10), y + (PP.hash2(x * 3, y) % 14), 4, 1, '#5c80a8');
});
tile('sea', 1, (g, x, y, f) => {
  RECT(g, x, y, T, T, '#2e527c');
  const o = f ? 4 : 0;
  spk(g, x, y, 3, '#3c6290', o);
  if ((PP.hash2(x, y) + (f ? 1 : 0)) % 4 === 0) RECT(g, x + (PP.hash2(y, x) % 9), y + (PP.hash2(x, y * 7) % 14), 5, 1, '#6c90b8');
});
tile('sand', 0, (g, x, y) => { RECT(g, x, y, T, T, '#d8c49a'); spk(g, x, y, 5, '#c8b48a'); });
tile('sandW', 0, (g, x, y, f) => { RECT(g, x, y, T, T, '#d8c49a'); RECT(g, x, y + (f ? 6 : 8), T, 2, '#e8e0d0'); spk(g, x, y, 3, '#c8b48a'); });
tile('cliff', 1, (g, x, y) => { RECT(g, x, y, T, T, '#6a5a50'); spk(g, x, y, 6, '#5a4a42'); RECT(g, x, y, T, 2, '#7a6a5e'); });
tile('rock', 1, (g, x, y) => { RECT(g, x, y, T, T, '#4f7a42'); blobT(g, x + 2, y + 4, 12, 10, '#8a8a8e', '#5a5a60'); });
tile('tree', 1, (g, x, y) => {
  RECT(g, x, y, T, T, '#4f7a42'); spk(g, x, y, 4, '#446a38');
  RECT(g, x + 6, y + 9, 4, 7, '#5a4432');
  blobT(g, x + 1, y - 2, 14, 13, '#2e5a30', '#234824');
  spk(g, x + 2, y, 5, '#3a6a3c');
});
tile('treeD', 1, (g, x, y) => { // bare tree
  RECT(g, x, y, T, T, '#46703c');
  RECT(g, x + 7, y + 4, 2, 12, '#4a3a30');
  RECT(g, x + 3, y + 4, 4, 1, '#4a3a30'); RECT(g, x + 9, y + 6, 5, 1, '#4a3a30');
  RECT(g, x + 3, y + 1, 1, 3, '#4a3a30'); RECT(g, x + 13, y + 3, 1, 3, '#4a3a30');
});
tile('bush', 1, (g, x, y) => { RECT(g, x, y, T, T, '#4f7a42'); blobT(g, x + 1, y + 4, 14, 11, '#3a6a36', '#2c5429'); });
tile('flower', 0, (g, x, y) => {
  RECT(g, x, y, T, T, '#4f7a42'); spk(g, x, y, 4, '#446a38');
  const c = ['#e8e0e8', '#e8d088', '#d88898'][PP.hash2(x, y) % 3];
  PX(g, x + 4, y + 5, c); PX(g, x + 11, y + 9, c); PX(g, x + 7, y + 12, c);
});
tile('weed', 0, (g, x, y) => { RECT(g, x, y, T, T, '#7a7458'); spk(g, x, y, 8, '#6a6448'); spk(g, x, y, 4, '#8a845e', 3); });
tile('fence', 1, (g, x, y) => {
  RECT(g, x, y, T, T, '#4f7a42');
  RECT(g, x, y + 5, T, 2, '#8a7050'); RECT(g, x, y + 10, T, 2, '#8a7050');
  RECT(g, x + 2, y + 3, 2, 11, '#7a6044'); RECT(g, x + 11, y + 3, 2, 11, '#7a6044');
});
tile('fenceM', 1, (g, x, y) => {
  RECT(g, x, y, T, T, '#8e8e96');
  RECT(g, x, y + 4, T, 1, '#aab0b8'); RECT(g, x, y + 11, T, 1, '#aab0b8');
  for (let i = 0; i < 4; i++) RECT(g, x + 1 + i * 4, y + 4, 1, 8, '#9aa0a8');
});
tile('pole', 1, (g, x, y) => { RECT(g, x, y, T, T, '#8e8e96'); RECT(g, x + 6, y - 0, 3, 16, '#6a6a5e'); RECT(g, x + 7, y, 1, 16, '#7a7a6e'); });
tile('vend', 1, (g, x, y) => {
  RECT(g, x, y, T, T, '#8e8e96');
  RECT(g, x + 2, y, 12, 15, '#b04848'); RECT(g, x + 3, y + 2, 10, 5, '#e8e8f0');
  RECT(g, x + 4, y + 9, 3, 3, '#333'); RECT(g, x + 9, y + 9, 3, 3, '#333');
});
tile('sign', 1, (g, x, y) => { RECT(g, x, y, T, T, '#4f7a42'); RECT(g, x + 7, y + 6, 2, 10, '#6a5a44'); RECT(g, x + 3, y + 2, 10, 6, '#caba92'); });
// buildings
tile('hwall', 1, (g, x, y) => { RECT(g, x, y, T, T, '#c8bca4'); spk(g, x, y, 3, '#b8ac94'); RECT(g, x, y + 14, T, 2, '#a89c84'); });
tile('hwallD', 1, (g, x, y) => { RECT(g, x, y, T, T, '#7a7468'); spk(g, x, y, 4, '#6a6458'); });
tile('roof', 1, (g, x, y) => { RECT(g, x, y, T, T, '#5a6a7e'); RECT(g, x, y + 5, T, 1, '#4a5a6e'); RECT(g, x, y + 11, T, 1, '#4a5a6e'); });
tile('roofR', 1, (g, x, y) => { RECT(g, x, y, T, T, '#8a5a4e'); RECT(g, x, y + 5, T, 1, '#7a4a3e'); RECT(g, x, y + 11, T, 1, '#7a4a3e'); });
tile('window', 1, (g, x, y) => { RECT(g, x, y, T, T, '#c8bca4'); RECT(g, x + 3, y + 3, 10, 9, '#6a86a0'); RECT(g, x + 7, y + 3, 1, 9, '#c8bca4'); RECT(g, x + 3, y + 7, 10, 1, '#c8bca4'); });
tile('windowN', 1, (g, x, y) => { RECT(g, x, y, T, T, '#3c3c46'); RECT(g, x + 3, y + 3, 10, 9, '#e8d088'); RECT(g, x + 7, y + 3, 1, 9, '#3c3c46'); });
tile('doorT', 1, (g, x, y) => { RECT(g, x, y, T, T, '#c8bca4'); RECT(g, x + 3, y + 2, 10, 14, '#7a5a40'); PX(g, x + 11, y + 9, '#d8c890'); });
tile('shopwin', 1, (g, x, y) => { RECT(g, x, y, T, T, '#b0a8a0'); RECT(g, x + 1, y + 2, 14, 11, '#8aa0b0'); RECT(g, x + 1, y + 13, 14, 1, '#6a86a0'); });
tile('citywall', 1, (g, x, y) => {
  RECT(g, x, y, T, T, '#52525e');
  for (let r = 0; r < 3; r++) for (let cx2 = 0; cx2 < 3; cx2++) {
    const lit = PP.hash2(x + cx2, y + r) % 5 < 2;
    RECT(g, x + 1 + cx2 * 5, y + 1 + r * 5, 3, 3, lit ? '#d8c878' : '#3a3a46');
  }
});
tile('screen', 1, (g, x, y) => { RECT(g, x, y, T, T, '#2a2a34'); RECT(g, x + 1, y + 1, 14, 14, '#7a68b0'); spk(g, x + 1, y + 1, 5, '#9a88d0'); });
// interiors
tile('iwall', 1, (g, x, y) => { RECT(g, x, y, T, T, '#7a7068'); RECT(g, x, y + 11, T, 5, '#5a5048'); spk(g, x, y, 2, '#6a6058'); });
tile('iwallB', 1, (g, x, y) => { RECT(g, x, y, T, T, '#5c6470'); RECT(g, x, y + 11, T, 5, '#4a525e'); });
tile('floor', 0, (g, x, y) => {
  RECT(g, x, y, T, T, '#a8845c');
  RECT(g, x, y + 7, T, 1, '#987450');
  RECT(g, x + ((x / T) % 2 ? 4 : 11), y, 1, 8, '#987450');
  RECT(g, x + ((x / T) % 2 ? 9 : 3), y + 8, 1, 8, '#987450');
});
tile('tatami', 0, (g, x, y) => { RECT(g, x, y, T, T, '#b8b07c'); RECT(g, x, y, 1, T, '#a09868'); spk(g, x, y, 3, '#aca474'); });
tile('carpet', 0, (g, x, y) => { RECT(g, x, y, T, T, '#8a6a72'); spk(g, x, y, 4, '#7a5a62'); });
tile('tileF', 0, (g, x, y) => { RECT(g, x, y, T, T, '#c8ccd0'); RECT(g, x, y, T, 1, '#b8bcc0'); RECT(g, x, y, 1, T, '#b8bcc0'); });
tile('tileD', 0, (g, x, y) => { RECT(g, x, y, T, T, '#9aa0a8'); RECT(g, x, y, T, 1, '#8a9098'); RECT(g, x, y, 1, T, '#8a9098'); });
tile('desk', 1, (g, x, y) => { RECT(g, x, y + 2, 14, 11, '#9a7a52'); RECT(g, x, y + 2, 14, 2, '#aa8a62'); RECT(g, x + 1, y + 13, 2, 3, '#7a5a3c'); RECT(g, x + 11, y + 13, 2, 3, '#7a5a3c'); });
tile('table', 1, (g, x, y) => { RECT(g, x + 1, y + 3, 14, 9, '#8a6a46'); RECT(g, x + 1, y + 3, 14, 2, '#9a7a56'); RECT(g, x + 2, y + 12, 2, 3, '#6a4a30'); RECT(g, x + 12, y + 12, 2, 3, '#6a4a30'); });
tile('chair', 0, (g, x, y) => { RECT(g, x + 4, y + 4, 8, 8, '#8a6a46'); RECT(g, x + 4, y + 2, 8, 2, '#7a5a3c'); });
tile('bed', 1, (g, x, y) => { RECT(g, x + 1, y, 14, 16, '#b0b8c8'); RECT(g, x + 1, y, 14, 5, '#e0e4ec'); RECT(g, x + 1, y, 14, 1, '#8a92a8'); });
tile('bedH', 1, (g, x, y) => { RECT(g, x + 1, y, 14, 16, '#d8dce4'); RECT(g, x + 1, y, 14, 5, '#f0f2f6'); RECT(g, x + 1, y + 14, 14, 2, '#9aa0b0'); });
tile('counter', 1, (g, x, y) => { RECT(g, x, y, T, 13, '#8a6a46'); RECT(g, x, y, T, 3, '#9a7a56'); RECT(g, x, y + 13, T, 3, '#6a4a30'); });
tile('shelf', 1, (g, x, y) => {
  RECT(g, x, y, T, 14, '#7a5a3c');
  for (let r = 0; r < 3; r++) {
    RECT(g, x + 1, y + 1 + r * 4, 14, 3, '#5a4030');
    for (let b = 0; b < 5; b++) RECT(g, x + 2 + b * 3, y + 1 + r * 4, 2, 3, ['#a05050', '#5070a0', '#a0a060', '#608060', '#9a7ab0'][PP.hash2(x + b, y + r) % 5]);
  }
});
tile('tv', 1, (g, x, y) => { RECT(g, x + 1, y + 4, 14, 10, '#2a2a32'); RECT(g, x + 2, y + 5, 12, 7, '#5a7a9a'); });
tile('fridge', 1, (g, x, y) => { RECT(g, x + 2, y, 12, 16, '#d8dce0'); RECT(g, x + 2, y + 6, 12, 1, '#b8bcc0'); });
tile('stove', 1, (g, x, y) => { RECT(g, x, y + 2, 16, 14, '#b8bcc0'); RECT(g, x + 2, y + 4, 5, 5, '#3a3a42'); RECT(g, x + 9, y + 4, 5, 5, '#3a3a42'); });
tile('sofa', 1, (g, x, y) => { RECT(g, x, y + 3, 16, 10, '#7a8a6a'); RECT(g, x, y + 3, 16, 3, '#8a9a7a'); RECT(g, x, y + 13, 16, 2, '#5a6a4a'); });
tile('plant', 1, (g, x, y) => { RECT(g, x + 5, y + 9, 6, 6, '#a06a4a'); blobT(g, x + 3, y + 1, 10, 9, '#3a6a3c', '#2c5429'); });
tile('piano', 1, (g, x, y) => { RECT(g, x, y, 16, 13, '#26262e'); RECT(g, x + 1, y + 8, 14, 4, '#e8e8e0'); for (let i = 0; i < 7; i++) PX(g, x + 2 + i * 2, y + 8, '#26262e'); });
tile('stool', 0, (g, x, y) => { RECT(g, x + 5, y + 5, 6, 6, '#8a4a3a'); RECT(g, x + 6, y + 11, 1, 4, '#5a3a2a'); RECT(g, x + 9, y + 11, 1, 4, '#5a3a2a'); });
tile('barC', 1, (g, x, y) => { RECT(g, x, y, T, 12, '#5a4434'); RECT(g, x, y, T, 3, '#6a5440'); RECT(g, x, y + 12, T, 4, '#42342a'); });
tile('crate', 1, (g, x, y) => { RECT(g, x + 1, y + 3, 13, 13, '#9a7e58'); RECT(g, x + 1, y + 3, 13, 2, '#aa8e68'); RECT(g, x + 1, y + 8, 13, 1, '#8a6e48'); });
tile('drum', 1, (g, x, y) => { RECT(g, x + 3, y + 2, 10, 14, '#6a7060'); RECT(g, x + 3, y + 4, 10, 1, '#7a8070'); RECT(g, x + 3, y + 11, 10, 1, '#7a8070'); });
tile('rubble', 0, (g, x, y) => { RECT(g, x, y, T, T, '#6a665e'); spk(g, x, y, 8, '#5a564e'); spk(g, x, y, 4, '#7a766e', 7); });
tile('machine', 1, (g, x, y) => { RECT(g, x + 1, y + 1, 14, 14, '#5a5a64'); RECT(g, x + 3, y + 3, 4, 3, '#8a4a4a'); RECT(g, x + 9, y + 3, 4, 3, '#4a6a8a'); RECT(g, x + 3, y + 9, 10, 3, '#3a3a42'); });
tile('void', 1, (g, x, y) => { RECT(g, x, y, T, T, '#08080c'); });
tile('voidF', 0, (g, x, y) => { RECT(g, x, y, T, T, '#0c0c12'); if (PP.hash2(x, y) % 9 === 0) PX(g, x + PP.hash2(y, x) % 16, y + PP.hash2(x, y * 3) % 16, '#3a3a52'); });
tile('toriiB', 1, (g, x, y) => { RECT(g, x, y, T, T, '#4f7a42'); RECT(g, x + 2, y, 3, 16, '#b04838'); RECT(g, x + 11, y, 3, 16, '#b04838'); });
tile('toriiT', 1, (g, x, y) => { RECT(g, x, y + 2, 16, 3, '#b04838'); RECT(g, x, y + 7, 16, 2, '#b04838'); RECT(g, x + 2, y + 9, 3, 7, '#b04838'); RECT(g, x + 11, y + 9, 3, 7, '#b04838'); });
tile('shrineS', 1, (g, x, y) => { RECT(g, x + 2, y + 2, 12, 12, '#8a8a8e'); RECT(g, x + 1, y, 14, 3, '#6a6a6e'); RECT(g, x + 5, y + 6, 6, 8, '#4a4a4e'); });
tile('grave', 1, (g, x, y) => { RECT(g, x, y, T, T, '#7a7458'); RECT(g, x + 5, y + 3, 6, 11, '#8a8a8e'); RECT(g, x + 4, y + 12, 8, 2, '#6a6a6e'); });
tile('lantern', 1, (g, x, y) => { RECT(g, x + 6, y + 8, 4, 8, '#8a8a8e'); RECT(g, x + 4, y + 3, 8, 5, '#6a6a6e'); RECT(g, x + 5, y + 4, 6, 3, '#e8d088'); });

function blobT(g, ox, oy, w, h, fill, dark) {
  const rx = w / 2, ry = h / 2;
  for (let y = 0; y < h; y++) {
    const dy = (y + 0.5 - ry) / ry;
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - dy * dy)));
    if (hw <= 0) continue;
    RECT(g, Math.round(ox + rx - hw), oy + y, hw * 2, 1, fill);
  }
  spkB(g, ox, oy, w, h, dark);
}
function spkB(g, ox, oy, w, h, c) {
  for (let i = 0; i < 6; i++) {
    PX(g, ox + 1 + PP.hash2(ox + i, oy) % Math.max(w - 2, 1), oy + 1 + PP.hash2(oy, ox + i * 3) % Math.max(h - 2, 1), c);
  }
}
PP.art.blobT = blobT;
