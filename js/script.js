'use strict';
// Cutscene scripting API — chapters are async functions receiving S.

PP.god = { active: false, t: 0 };

PP.S = {
  flag: (k, v = true) => { PP.flags[k] = v; },
  has: k => !!PP.flags[k],

  async load(id, px, py, dir = 'down', opts = {}) {
    if (PP.fadeA < 1 && !opts.cut) await PP.fadeOut(opts.fast ? 200 : 450);
    PP.loadMap(id);
    if (px != null) PP.spawnPlayer(px, py, dir);
    const m = PP.maps[id];
    if (m.music !== undefined) PP.audio.play(m.music);
    if (!opts.stayDark) await PP.fadeIn(opts.fast ? 200 : 450);
  },

  spawn: (spr, x, y, dir, opts) => PP.spawn(spr, x, y, dir, opts),
  form: f => PP.setForm(f),
  player: () => PP.world.player,

  async say(name, text, opts) { await PP.text.show(name, text, opts); },
  async n(text) { await PP.text.show(null, text); }, // narrator
  async think(text) { await PP.text.show(null, text); },

  async god(text) {
    if (!PP.god.active) {
      PP.god.active = true; PP.god.t = 0;
      PP.audio.sfx('god');
      await PP.sleep(400);
    }
    await PP.text.show('God', text, { portrait: PP.godImg });
  },
  godLeave() { PP.god.active = false; },

  async choice(items) { return await PP.choiceUI.show(items); },

  async walk(e, tx, ty) { await PP.walkTo(e, tx, ty); },
  async walkP(tx, ty) { await PP.walkTo(PP.world.player, tx, ty); },
  face: (e, dir) => { e.dir = dir; },
  faceP: dir => { if (PP.world.player) PP.world.player.dir = dir; },
  hide: e => { e.hidden = true; },
  show: e => { e.hidden = false; },

  wait: ms => PP.sleep(PP.test ? Math.min(ms, 50) : ms),
  fadeOut: ms => PP.fadeOut(ms),
  fadeIn: ms => PP.fadeIn(ms),
  music: id => PP.audio.play(id),
  stopMusic: () => PP.audio.play(null),
  sfx: id => PP.audio.sfx(id),
  shake: (ms, mag) => PP.shake(ms, mag),
  flash: () => PP.flash(),

  async caption(text, sub) { await PP.caption.show(text, sub); },
  async card(num, title) { await PP.card.show(num, title); },

  marker: (tx, ty, opts) => PP.marker(tx, ty, opts),

  // gate: register a flag-setting interaction for test auto-solve
  gate(flagName, fn) {
    PP.gates[flagName] = fn;
    return async () => { await fn(); PP.flags[flagName] = true; };
  },

  async explore(flagName, hint) {
    PP.hint = hint || '';
    if (PP.test) {
      // auto-solve: run the registered gate directly
      const g = PP.gates[flagName];
      if (g) { await g(); }
      PP.flags[flagName] = true;
    } else {
      PP.mode = 'free';
      while (!PP.flags[flagName]) await PP.sleep(60);
      PP.mode = 'cutscene';
    }
    PP.hint = '';
  },

  // simple touch-marker gate: walk player to spot, run fn
  async exploreTo(tx, ty, flagName, hint, fn) {
    const wrapped = async () => {
      if (PP.test && PP.world.player) { PP.world.player.x = tx * 16 + 8; PP.world.player.y = ty * 16 + 8; }
      if (fn) await fn();
    };
    PP.gates[flagName] = wrapped;
    PP.marker(tx, ty, { flag: flagName, fn });
    await this.explore(flagName, hint);
  },
};

// God overlay drawn above world, below textbox
PP.drawGod = (g) => {
  if (!PP.god.active) return;
  PP.god.t += 1 / 60;
  const img = PP.godImg;
  const bob = Math.sin(PP.god.t * 1.4) * 3;
  const x = PP.W - 80, y = 26 + bob;
  // halo
  g.fillStyle = 'rgba(255,225,140,0.18)';
  g.beginPath();
  g.arc(x + 16, y + 14, 30 + Math.sin(PP.god.t * 2) * 2, 0, 7);
  g.fill();
  g.drawImage(img, Math.round(x), Math.round(y));
};
