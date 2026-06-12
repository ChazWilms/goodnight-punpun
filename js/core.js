'use strict';
// GOODNIGHT PUNPUN — fan game engine core
// Unofficial fan tribute to Inio Asano's "Oyasumi Punpun". Original code & art.

window.PP = {
  W: 320, H: 240, TILE: 16,
  canvas: null, ctx: null,
  flags: {}, gates: {},
  mode: 'cutscene',          // 'cutscene' | 'free'
  test: false,
  gameTime: 0,
  fadeA: 1,                  // 0 = clear, 1 = black
  fadeCol: '#000000',
  shakeT: 0, shakeMag: 0,
  flashT: 0,
  hint: '',
  form: 'kid',               // current punpun sprite form
  scene: null,               // optional non-world scene {update,draw}
  worldOn: false,
  captionState: null,
};

PP.chapterList = []; // {title, fn} — story files register themselves
PP.registerChapter = (n, title, fn) => { PP.chapterList[n - 1] = { title, fn }; };

PP.status = (s) => {
  const el = document.getElementById('test-status');
  if (el) el.textContent = s;
};
PP.reportError = (e) => {
  const msg = 'ERR ' + (e && e.stack ? e.stack.split('\n').slice(0, 2).join(' | ') : e);
  console.error(e);
  document.title = msg;
  PP.status(msg);
};
window.onerror = (m, s, l) => { document.title = 'ERR ' + m + ' @' + (s || '').split('/').pop() + ':' + l; PP.status(document.title); };
window.onunhandledrejection = (ev) => PP.reportError(ev.reason);

PP.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
PP.lerp = (a, b, t) => a + (b - a) * t;
PP.dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
PP.hash2 = (x, y) => {
  let h = (x * 374761393 + y * 668265263) >>> 0;
  h = (h ^ (h >> 13)) * 1274126177 >>> 0;
  return (h ^ (h >> 16)) >>> 0;
};

// ---------------- input ----------------
PP.input = { held: {}, pressed: {} };
const PP_KEYMAP = {
  arrowleft: 'left', arrowright: 'right', arrowup: 'up', arrowdown: 'down',
  a: 'left', d: 'right', w: 'up', s: 'down',
  z: 'ok', enter: 'ok', ' ': 'ok',
  x: 'cancel', shift: 'cancel', escape: 'cancel',
  m: 'mute',
};
addEventListener('keydown', e => {
  const k = PP_KEYMAP[(e.key || '').toLowerCase()];
  if (PP.audio) PP.audio.userGesture();
  if (!k) return;
  e.preventDefault();
  if (!e.repeat) {
    PP.input.pressed[k] = true;
    if (k === 'mute' && PP.audio) PP.audio.toggleMute();
  }
  PP.input.held[k] = true;
});
addEventListener('keyup', e => {
  const k = PP_KEYMAP[(e.key || '').toLowerCase()];
  if (k) PP.input.held[k] = false;
});

// ---------------- async primitives (driven by game time) ----------------
PP.timers = [];
PP.sleep = ms => new Promise(r => PP.timers.push({ t: ms, r }));
PP.confirmQ = [];
PP.waitOk = () => new Promise(r => PP.confirmQ.push(r));
PP.tweens = [];
PP.tween = (obj, key, to, ms) => new Promise(r => {
  PP.tweens.push({ obj, key, from: obj[key], to, ms: Math.max(ms, 1), e: 0, r });
});
PP.fadeOut = (ms = 500) => PP.tween(PP, 'fadeA', 1, ms);
PP.fadeIn = (ms = 500) => PP.tween(PP, 'fadeA', 0, ms);

PP.tick = dt => {
  PP.gameTime += dt;
  if (PP.shakeT > 0) PP.shakeT -= dt;
  if (PP.flashT > 0) PP.flashT -= dt;
  for (let i = PP.timers.length - 1; i >= 0; i--) {
    const t = PP.timers[i];
    t.t -= dt * 1000;
    if (t.t <= 0) { PP.timers.splice(i, 1); t.r(); }
  }
  for (let i = PP.tweens.length - 1; i >= 0; i--) {
    const tw = PP.tweens[i];
    tw.e += dt * 1000;
    const p = PP.clamp(tw.e / tw.ms, 0, 1);
    tw.obj[tw.key] = PP.lerp(tw.from, tw.to, p);
    if (p >= 1) { PP.tweens.splice(i, 1); tw.r(); }
  }
  if (PP.confirmQ.length && (PP.input.pressed.ok || PP.test)) {
    const q = PP.confirmQ; PP.confirmQ = [];
    q.forEach(r => r());
  }
};

PP.shake = (ms = 400, mag = 3) => { PP.shakeT = ms / 1000; PP.shakeMag = mag; };
PP.flash = (ms = 120) => { PP.flashT = ms / 1000; };

// ---------------- save ----------------
PP.saveData = () => {
  try { return JSON.parse(localStorage.getItem('pp_save')) || {}; }
  catch (e) { return {}; }
};
PP.saveSet = p => {
  try { localStorage.setItem('pp_save', JSON.stringify({ ...PP.saveData(), ...p })); }
  catch (e) { /* private mode */ }
};
