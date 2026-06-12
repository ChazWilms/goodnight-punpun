'use strict';
// Title screen, content warning, chapter select.

PP.title = {
  state: 'warn', // warn -> menu -> chapters
  idx: 0, chIdx: 0, t: 0,
  resolve: null,

  // returns {mode:'new'|'chapter', ch}
  show() {
    PP.worldOn = false;
    PP.scene = this;
    this.t = 0;
    const sd = PP.saveData();
    this.state = sd.seenWarn ? 'menu' : 'warn';
    this.idx = 0;
    PP.audio.play('title');
    PP.fadeIn(800);
    return new Promise(res => { this.resolve = res; });
  },

  menuItems() {
    const sd = PP.saveData();
    const items = [];
    if (sd.chapter && sd.chapter > 1) items.push({ t: 'CONTINUE  (Ch ' + sd.chapter + ')', v: { mode: 'chapter', ch: sd.chapter } });
    items.push({ t: 'NEW GAME', v: { mode: 'new', ch: 1 } });
    if ((sd.unlocked || 1) > 1) items.push({ t: 'CHAPTERS', v: { mode: 'select' } });
    return items;
  },

  update(dt) {
    this.t += dt;
    if (this.state === 'warn') {
      if ((PP.input.pressed.ok && this.t > 0.5) || PP.test) {
        PP.saveSet({ seenWarn: true });
        this.state = 'menu'; this.t = 0;
        PP.audio.sfx('ok');
      }
      return;
    }
    if (this.state === 'menu') {
      const items = this.menuItems();
      if (PP.test) return this.pick({ mode: 'new', ch: 1 });
      if (PP.input.pressed.up) { this.idx = (this.idx + items.length - 1) % items.length; PP.audio.sfx('move'); }
      if (PP.input.pressed.down) { this.idx = (this.idx + 1) % items.length; PP.audio.sfx('move'); }
      if (PP.input.pressed.ok && this.t > 0.3) {
        const v = items[this.idx].v;
        if (v.mode === 'select') { this.state = 'chapters'; this.chIdx = 0; PP.audio.sfx('ok'); }
        else this.pick(v);
      }
      return;
    }
    if (this.state === 'chapters') {
      const max = Math.min(PP.saveData().unlocked || 1, PP.chapterList.length);
      if (PP.input.pressed.up) { this.chIdx = (this.chIdx + max - 1) % max; PP.audio.sfx('move'); }
      if (PP.input.pressed.down) { this.chIdx = (this.chIdx + 1) % max; PP.audio.sfx('move'); }
      if (PP.input.pressed.cancel) { this.state = 'menu'; PP.audio.sfx('move'); }
      if (PP.input.pressed.ok) this.pick({ mode: 'chapter', ch: this.chIdx + 1 });
    }
  },

  pick(v) {
    PP.audio.sfx('ok');
    PP.scene = null;
    const r = this.resolve; this.resolve = null;
    if (r) r(v);
  },

  draw(g) {
    g.fillStyle = '#000';
    g.fillRect(0, 0, PP.W, PP.H);
    g.font = PP.FONT; g.textBaseline = 'top'; g.textAlign = 'center';

    if (this.state === 'warn') {
      g.fillStyle = '#c8b860';
      g.fillText('CONTENT WARNING', PP.W / 2, 38);
      g.fillStyle = '#b0b0b8';
      const warn = [
        'This story deals with depression,',
        'abuse, and suicide.',
        '',
        'It is an unofficial fan tribute to',
        "Inio Asano's 'Oyasumi Punpun'.",
        'Please support the official release.',
        '',
        'If you are struggling, you are not',
        'alone. 988 (US) / find help locally.',
      ];
      let y = 70;
      for (const l of warn) { g.fillText(l, PP.W / 2, y); y += 13; }
      if (Math.floor(this.t * 1.5) % 2 === 0) {
        g.fillStyle = '#fff';
        g.fillText('[ Z ]', PP.W / 2, 208);
      }
      g.textAlign = 'left';
      return;
    }

    // little punpun
    const spr = PP.sprites.punpun_kid.down[Math.floor(this.t * 2) % 2];
    g.save();
    g.imageSmoothingEnabled = false;
    g.drawImage(spr, 0, 0, spr.width, spr.height, PP.W / 2 - spr.width * 2, 36 + Math.sin(this.t) * 2, spr.width * 4, spr.height * 4);
    g.restore();

    g.fillStyle = '#f0f0e8';
    g.fillText('G O O D N I G H T', PP.W / 2, 124);
    g.fillText('P U N P U N', PP.W / 2, 140);
    g.fillStyle = '#5a5a66';
    g.fillText('an unofficial fan game', PP.W / 2, 158);

    if (this.state === 'menu') {
      const items = this.menuItems();
      items.forEach((it, i) => {
        g.fillStyle = i === this.idx ? '#ffd060' : '#9a9aa2';
        g.fillText(it.t, PP.W / 2, 182 + i * 14);
        if (i === this.idx) drawHeart(g, PP.W / 2 - g.measureText(it.t).width / 2 - 14, 182 + i * 14);
      });
    } else if (this.state === 'chapters') {
      const max = Math.min(PP.saveData().unlocked || 1, PP.chapterList.length);
      const first = PP.clamp(this.chIdx - 1, 0, Math.max(max - 3, 0));
      for (let i = first; i < Math.min(first + 3, max); i++) {
        const sel = i === this.chIdx;
        g.fillStyle = sel ? '#ffd060' : '#9a9aa2';
        g.fillText('Ch.' + (i + 1) + '  ' + PP.chapterList[i].title, PP.W / 2, 180 + (i - first) * 14);
      }
      g.fillStyle = '#5a5a66';
      g.fillText('[X] back', PP.W / 2, 226);
    }
    g.textAlign = 'left';
  },
};
