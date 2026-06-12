'use strict';
// Dialogue / textbox / choices / captions — Undertale-style presentation.

PP.FONT = '8px "Press Start 2P", monospace';

PP.cast = {
  // name -> display color
  'Punpun': '#f6f4ec',
  'Aiko': '#e8a8b8',
  'Mama': '#d8b8d0',
  'Papa': '#a8a8c8',
  'Yuichi': '#90b8d8',
  'Midori': '#90d0c0',
  'Sachi': '#e8c060',
  'Seki': '#c08868',
  'Shimizu': '#98c890',
  'Harumi': '#90a8c8',
  'Komatsu': '#88b890',
  'Yaguchi': '#c8c8b0',
  'Kanie': '#d8a890',
  'God': '#ffd700',
  'Pegasus': '#b8a0e0',
  'Mitsuko': '#9a7a96',
  'Shishido': '#a0b0a0',
  'Teacher': '#a0a0aa',
  'Grandpa': '#c0b8a0',
  'Nurse': '#d0d0e0',
  'Editor': '#a0a8c0',
  'Voice': '#888894',
  'TV': '#88a0b8',
  '???': '#aaaaaa',
};

PP.text = {
  active: false,
  pages: [], page: 0, chars: 0, done: false,
  name: null, color: '#fff', narr: false,
  resolve: null,
  portrait: null,
  speed: 2, // chars per tick
  blipT: 0,

  measure(g, s) { g.font = PP.FONT; return g.measureText(s).width; },

  wrap(g, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (this.measure(g, t) > maxW && cur) { lines.push(cur); cur = w; }
      else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  },

  show(name, text, opts = {}) {
    return new Promise(res => {
      const g = PP.ctx;
      const maxW = opts.portrait ? 218 : 288;
      const lines = [];
      text.split('\n').forEach(seg => lines.push(...this.wrap(g, seg, maxW)));
      const pages = [];
      for (let i = 0; i < lines.length; i += 3) pages.push(lines.slice(i, i + 3));
      this.active = true;
      this.pages = pages.length ? pages : [['...']];
      this.page = 0; this.chars = 0; this.done = false;
      this.name = name;
      this.color = (name && PP.cast[name]) || '#fff';
      this.narr = !name;
      this.portrait = opts.portrait || null;
      this.resolve = res;
    });
  },

  update(dt) {
    if (!this.active) return;
    const cur = this.pages[this.page];
    const total = cur.join('').length;
    if (this.chars < total) {
      if (PP.test) { this.chars = total; }
      else if (PP.input.pressed.ok || PP.input.held.cancel) { this.chars = total; }
      else {
        this.chars = Math.min(this.chars + this.speed, total);
        this.blipT -= dt;
        if (this.blipT <= 0) {
          PP.audio.sfx(this.narr ? 'blipN' : 'blip');
          this.blipT = 0.055;
        }
      }
      return;
    }
    if (PP.input.pressed.ok || PP.test || PP.input.held.cancel) {
      if (this.page < this.pages.length - 1) {
        this.page++; this.chars = 0;
      } else {
        this.active = false;
        const r = this.resolve; this.resolve = null;
        if (r) r();
      }
    }
  },

  draw(g) {
    if (!this.active) return;
    const bx = 6, by = 170, bw = 308, bh = 64;
    g.fillStyle = '#000';
    g.fillRect(bx, by, bw, bh);
    g.fillStyle = this.narr ? '#5a5a6a' : '#fff';
    g.fillRect(bx, by, bw, 2); g.fillRect(bx, by + bh - 2, bw, 2);
    g.fillRect(bx, by, 2, bh); g.fillRect(bx + bw - 2, by, 2, bh);
    g.font = PP.FONT;
    g.textBaseline = 'top';
    let tx = bx + 10, ty = by + 9;
    if (this.portrait) {
      g.fillStyle = '#0c0c14';
      g.fillRect(bx + 6, by + 8, 48, 48);
      const p = this.portrait;
      g.drawImage(p, bx + 6 + Math.floor((48 - p.width) / 2), by + 8 + Math.floor((48 - p.height) / 2));
      g.strokeStyle = '#fff';
      tx = bx + 62;
    }
    if (this.name) {
      g.fillStyle = this.color;
      g.fillText(this.name, tx, ty);
      ty += 13;
    }
    const cur = this.pages[this.page];
    let remain = this.chars;
    g.fillStyle = this.narr ? '#b8b8c0' : '#efefe6';
    for (const line of cur) {
      const n = Math.min(remain, line.length);
      if (n > 0) g.fillText(line.slice(0, n), tx, ty);
      remain -= n;
      ty += 12;
      if (remain <= 0) break;
    }
    // advance arrow
    const total = cur.join('').length;
    if (this.chars >= total && Math.floor(PP.gameTime * 2) % 2 === 0) {
      g.fillStyle = '#fff';
      const ax = bx + bw - 12, ay = by + bh - 10;
      g.fillRect(ax, ay, 5, 2); g.fillRect(ax + 1, ay + 2, 3, 1); g.fillRect(ax + 2, ay + 3, 1, 1);
    }
  },
};

// ---------- choice menu ----------
PP.choiceUI = {
  active: false, items: [], idx: 0, resolve: null,
  show(items) {
    return new Promise(res => {
      this.active = true; this.items = items; this.idx = 0; this.resolve = res;
    });
  },
  update() {
    if (!this.active) return;
    if (PP.test) { return this.pick(0); }
    if (PP.input.pressed.up) { this.idx = (this.idx + this.items.length - 1) % this.items.length; PP.audio.sfx('move'); }
    if (PP.input.pressed.down) { this.idx = (this.idx + 1) % this.items.length; PP.audio.sfx('move'); }
    if (PP.input.pressed.ok) this.pick(this.idx);
  },
  pick(i) {
    PP.audio.sfx('ok');
    this.active = false;
    const r = this.resolve; this.resolve = null;
    if (r) r(i);
  },
  draw(g) {
    if (!this.active) return;
    g.font = PP.FONT; g.textBaseline = 'top';
    let w = 0;
    for (const it of this.items) w = Math.max(w, g.measureText(it).width);
    const bw = w + 30, bh = this.items.length * 14 + 12;
    const bx = 314 - bw, by = 166 - bh;
    g.fillStyle = '#000'; g.fillRect(bx, by, bw, bh);
    g.fillStyle = '#fff';
    g.fillRect(bx, by, bw, 2); g.fillRect(bx, by + bh - 2, bw, 2);
    g.fillRect(bx, by, 2, bh); g.fillRect(bx + bw - 2, by, 2, bh);
    this.items.forEach((it, i) => {
      g.fillStyle = i === this.idx ? '#ffd060' : '#cfcfc8';
      g.fillText(it, bx + 20, by + 8 + i * 14);
      if (i === this.idx) drawHeart(g, bx + 7, by + 8 + i * 14);
    });
  },
};

function drawHeart(g, x, y) {
  g.fillStyle = '#d83030';
  g.fillRect(x + 1, y, 2, 1); g.fillRect(x + 4, y, 2, 1);
  g.fillRect(x, y + 1, 7, 2);
  g.fillRect(x + 1, y + 3, 5, 1);
  g.fillRect(x + 2, y + 4, 3, 1);
  g.fillRect(x + 3, y + 5, 1, 1);
}
PP.drawHeart = drawHeart;

// ---------- caption (centered text on black) ----------
PP.caption = {
  active: false, lines: [], sub: null, resolve: null, t: 0,
  show(text, sub) {
    return new Promise(res => {
      this.active = true;
      this.lines = text.split('\n');
      this.sub = sub || null;
      this.resolve = res; this.t = 0;
    });
  },
  update(dt) {
    if (!this.active) return;
    this.t += dt;
    if (this.t > 0.4 && (PP.input.pressed.ok || PP.test)) {
      this.active = false;
      const r = this.resolve; this.resolve = null;
      if (r) r();
    }
  },
  draw(g) {
    if (!this.active) return;
    g.fillStyle = '#000';
    g.fillRect(0, 0, PP.W, PP.H);
    g.font = PP.FONT; g.textBaseline = 'top'; g.textAlign = 'center';
    const a = Math.min(this.t * 2, 1);
    g.globalAlpha = a;
    let y = PP.H / 2 - (this.lines.length * 14) / 2 - (this.sub ? 8 : 0);
    g.fillStyle = '#e8e8e0';
    for (const l of this.lines) { g.fillText(l, PP.W / 2, y); y += 14; }
    if (this.sub) {
      g.fillStyle = '#7a7a86';
      g.fillText(this.sub, PP.W / 2, y + 10);
    }
    g.globalAlpha = 1;
    g.textAlign = 'left';
  },
};

// ---------- chapter title card ----------
PP.card = {
  active: false, num: '', title: '', t: 0, resolve: null,
  show(num, title) {
    return new Promise(res => {
      this.active = true; this.num = num; this.title = title; this.t = 0; this.resolve = res;
    });
  },
  update(dt) {
    if (!this.active) return;
    this.t += dt;
    const dur = PP.test ? 0.1 : 3.2;
    if (this.t > dur || (this.t > 0.6 && PP.input.pressed.ok)) {
      this.active = false;
      const r = this.resolve; this.resolve = null;
      if (r) r();
    }
  },
  draw(g) {
    if (!this.active) return;
    g.fillStyle = '#000';
    g.fillRect(0, 0, PP.W, PP.H);
    const a = PP.clamp(this.t * 1.5, 0, 1);
    g.globalAlpha = a;
    g.font = PP.FONT; g.textAlign = 'center'; g.textBaseline = 'top';
    g.fillStyle = '#6a6a78';
    g.fillText(this.num, PP.W / 2, 96);
    g.fillStyle = '#f0f0e8';
    g.font = '8px "Press Start 2P", monospace';
    const words = this.title;
    g.fillText(words, PP.W / 2, 120);
    g.globalAlpha = 1;
    g.textAlign = 'left';
  },
};
