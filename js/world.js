'use strict';
// Tile world: maps, entities, player control, camera, markers.

PP.world = {
  map: null, mapId: null,
  ents: [], markers: [],
  player: null,
  cam: { x: 0, y: 0 },
};

class PMap {
  constructor(def) {
    this.def = def;
    this.h = def.rows.length;
    this.w = Math.max(...def.rows.map(r => r.length));
    this.grid = [];
    this.anim = [];
    for (let y = 0; y < this.h; y++) {
      const row = [];
      for (let x = 0; x < this.w; x++) {
        const ch = def.rows[y][x] || def.fill || '.';
        const name = def.legend[ch] || def.legend[def.fill] || 'void';
        row.push(name);
        const t = PP.tiles[name];
        if (!t) throw new Error('unknown tile ' + name + ' in map');
        if (name === 'water' || name === 'sea' || name === 'sandW') this.anim.push({ x, y, name });
      }
      this.grid.push(row);
    }
    // pre-render
    this.canvas = PP.art.mkCanvas(this.w * 16, this.h * 16);
    const g = this.canvas.getContext('2d');
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++)
        PP.tiles[this.grid[y][x]].draw(g, x * 16, y * 16, 0);
    this.animFrame = 0;
  }
  solidAt(px, py) {
    const x = Math.floor(px / 16), y = Math.floor(py / 16);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return true;
    return !!PP.tiles[this.grid[y][x]].solid;
  }
  redrawAnim() {
    const f = Math.floor(PP.gameTime * 2) % 2;
    if (f === this.animFrame) return;
    this.animFrame = f;
    const g = this.canvas.getContext('2d');
    for (const a of this.anim) PP.tiles[a.name].draw(g, a.x * 16, a.y * 16, f);
  }
}

PP.loadMap = (id) => {
  const def = PP.maps[id];
  if (!def) throw new Error('no map ' + id);
  PP.world.map = new PMap(def);
  PP.world.mapId = id;
  PP.world.ents = [];
  PP.world.markers = [];
  PP.world.player = null;
  PP.worldOn = true;
};

PP.spawn = (sprId, tx, ty, dir = 'down', opts = {}) => {
  const spr = typeof sprId === 'string' ? PP.sprites[sprId] : sprId;
  if (!spr) throw new Error('no sprite ' + sprId);
  const e = {
    sprId, spr, dir,
    x: tx * 16 + 8, y: ty * 16 + 8, // feet center, in pixels
    frame: 0, walkT: 0, moving: false,
    speed: 64, solid: true, hidden: false,
    name: opts.name || null,
    on: opts.on || null,  // async interact script
    ...opts,
  };
  PP.world.ents.push(e);
  return e;
};

PP.playerSprId = () => ({
  kid: 'punpun_kid', teen: 'punpun_teen', tri: 'punpun_tri',
  adult: 'punpun_adult', horns: 'punpun_horns', dark: 'punpun_dark',
}[PP.form] || 'punpun_kid');

PP.spawnPlayer = (tx, ty, dir = 'down') => {
  const p = PP.spawn(PP.playerSprId(), tx, ty, dir, { name: 'player' });
  p.isPlayer = true;
  PP.world.player = p;
  return p;
};

PP.setForm = (f) => {
  PP.form = f;
  const p = PP.world.player;
  if (p) { p.sprId = PP.playerSprId(); p.spr = PP.sprites[p.sprId]; }
};

// movement with collision (axis separated). Returns whether moved.
PP.moveEnt = (e, dx, dy, collide = true) => {
  const tryAxis = (nx, ny) => {
    if (!collide) return true;
    const m = PP.world.map;
    // feet box
    const pts = [
      [nx - 4, ny - 2], [nx + 4, ny - 2], [nx - 4, ny + 4], [nx + 4, ny + 4],
    ];
    for (const [px, py] of pts) if (m.solidAt(px, py)) return false;
    for (const o of PP.world.ents) {
      if (o === e || !o.solid || o.hidden) continue;
      if (Math.abs(o.x - nx) < 10 && Math.abs(o.y - ny) < 10) return false;
    }
    return true;
  };
  let moved = false;
  if (dx && tryAxis(e.x + dx, e.y)) { e.x += dx; moved = true; }
  if (dy && tryAxis(e.x, e.y + dy)) { e.y += dy; moved = true; }
  return moved;
};

// cutscene walk (ignores collision so scripts can't wedge)
PP.walkTo = (e, tx, ty) => new Promise(res => {
  PP.world.walkers = PP.world.walkers || [];
  PP.world.walkers.push({ e, tx: tx * 16 + 8, ty: ty * 16 + 8, res });
  e.moving = true;
});

PP.marker = (tx, ty, opts = {}) => {
  const m = { x: tx * 16 + 8, y: ty * 16 + 8, flag: opts.flag, fn: opts.fn, label: opts.label };
  PP.world.markers.push(m);
  return m;
};

PP.world.update = function (dt) {
  const w = PP.world;
  if (!w.map) return;
  w.map.redrawAnim();

  // scripted walkers
  if (w.walkers && w.walkers.length) {
    for (let i = w.walkers.length - 1; i >= 0; i--) {
      const wk = w.walkers[i];
      const e = wk.e;
      const sp = (PP.test ? 4 : 1) * (e.speed * 1.4) * dt;
      // x first, then y
      let dx = wk.tx - e.x, dy = wk.ty - e.y;
      if (Math.abs(dx) > 1) {
        const step = PP.clamp(dx, -sp, sp);
        e.x += step; e.dir = dx < 0 ? 'left' : 'right';
      } else if (Math.abs(dy) > 1) {
        const step = PP.clamp(dy, -sp, sp);
        e.y += step; e.dir = dy < 0 ? 'up' : 'down';
      } else {
        e.x = wk.tx; e.y = wk.ty; e.moving = false;
        w.walkers.splice(i, 1); wk.res();
        continue;
      }
      e.walkT += dt;
    }
  }

  // player control
  const p = w.player;
  if (p && PP.mode === 'free' && !PP.text.active && !PP.choiceUI.active && !PP.caption.active && !PP.card.active) {
    let dx = 0, dy = 0;
    if (PP.input.held.left) dx = -1;
    else if (PP.input.held.right) dx = 1;
    if (PP.input.held.up) dy = -1;
    else if (PP.input.held.down) dy = 1;
    if (dx || dy) {
      const sp = p.speed * dt * (PP.test ? 4 : 1);
      const norm = dx && dy ? 0.707 : 1;
      PP.moveEnt(p, dx * sp * norm, dy * sp * norm);
      p.dir = dx ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
      p.walkT += dt; p.moving = true;
    } else { p.moving = false; }

    // marker touch
    for (let i = w.markers.length - 1; i >= 0; i--) {
      const m = w.markers[i];
      if (Math.abs(p.x - m.x) < 12 && Math.abs(p.y - m.y) < 12) {
        w.markers.splice(i, 1);
        PP.runSub(async () => {
          if (m.fn) await m.fn();
          if (m.flag) PP.flags[m.flag] = true;
        });
        break;
      }
    }

    // interact
    if (PP.input.pressed.ok) {
      const fx = p.x + (p.dir === 'left' ? -14 : p.dir === 'right' ? 14 : 0);
      const fy = p.y + (p.dir === 'up' ? -14 : p.dir === 'down' ? 14 : 0);
      let best = null, bd = 1e9;
      for (const o of w.ents) {
        if (!o.on || o.hidden) continue;
        const d = Math.hypot(o.x - fx, o.y - fy);
        if (d < 14 && d < bd) { best = o; bd = d; }
      }
      if (best) {
        // face each other
        if (!best.noFace) {
          best.dir = p.dir === 'up' ? 'down' : p.dir === 'down' ? 'up' : p.dir === 'left' ? 'right' : 'left';
        }
        PP.runSub(best.on);
      }
    }
  }

  // camera
  const target = w.player || w.ents[0];
  if (target) {
    w.cam.x = PP.clamp(target.x - PP.W / 2, 0, Math.max(w.map.w * 16 - PP.W, 0));
    w.cam.y = PP.clamp(target.y - PP.H / 2, 0, Math.max(w.map.h * 16 - PP.H, 0));
    if (w.map.w * 16 < PP.W) w.cam.x = (w.map.w * 16 - PP.W) / 2;
    if (w.map.h * 16 < PP.H) w.cam.y = (w.map.h * 16 - PP.H) / 2;
  }
};

// run a sub-script (interaction) while pausing free mode
PP.runSub = (fn) => {
  if (PP.subRunning) return;
  PP.subRunning = true;
  const was = PP.mode;
  PP.mode = 'cutscene';
  Promise.resolve(fn(PP.S)).catch(e => PP.reportError(e)).finally(() => {
    PP.mode = was;
    PP.subRunning = false;
  });
};

PP.world.draw = function (g) {
  const w = PP.world;
  if (!w.map || !PP.worldOn) return;
  let sx = 0, sy = 0;
  if (PP.shakeT > 0) {
    sx = (Math.random() * 2 - 1) * PP.shakeMag;
    sy = (Math.random() * 2 - 1) * PP.shakeMag;
  }
  const cx = Math.round(w.cam.x + sx), cy = Math.round(w.cam.y + sy);
  g.fillStyle = '#08080c';
  g.fillRect(0, 0, PP.W, PP.H);
  g.drawImage(w.map.canvas, -cx, -cy);

  // markers (sparkle)
  for (const m of w.markers) {
    const t = PP.gameTime * 3 + m.x;
    const r = 2 + Math.sin(t) * 1.5;
    g.fillStyle = Math.floor(t) % 2 ? '#fff0a0' : '#ffd060';
    g.fillRect(Math.round(m.x - cx - 1), Math.round(m.y - cy - 8 - r), 2, 2);
    g.fillRect(Math.round(m.x - cx - 4), Math.round(m.y - cy - 5), 2, 2);
    g.fillRect(Math.round(m.x - cx + 2), Math.round(m.y - cy - 5), 2, 2);
  }

  // entities sorted by y
  const ents = w.ents.filter(e => !e.hidden).sort((a, b) => a.y - b.y);
  for (const e of ents) {
    const frames = e.spr[e.dir] || e.spr.down;
    const f = e.moving ? Math.floor(e.walkT * 7) % 2 : 0;
    const img = frames[f] || frames[0];
    const ex = Math.round(e.x - img.width / 2 - cx);
    const ey = Math.round(e.y - img.height + 4 - cy);
    // soft shadow
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.fillRect(Math.round(e.x - 5 - cx), Math.round(e.y + 2 - cy), 10, 3);
    g.drawImage(img, ex, ey);
    if (e.bubble) {
      g.font = PP.FONT; g.fillStyle = '#fff';
      g.fillText(e.bubble, ex, ey - 10);
    }
  }

  // lighting tint
  const light = w.map.def.light;
  if (light && light !== 'day') {
    g.globalCompositeOperation = 'multiply';
    if (light === 'evening') { g.fillStyle = 'rgba(232,150,96,0.45)'; }
    else if (light === 'night') { g.fillStyle = 'rgba(70,80,130,0.55)'; }
    else if (light === 'dim') { g.fillStyle = 'rgba(150,150,170,0.5)'; }
    else if (light === 'dark') { g.fillStyle = 'rgba(60,55,80,0.7)'; }
    g.fillRect(0, 0, PP.W, PP.H);
    g.globalCompositeOperation = 'source-over';
    if (light === 'night') {
      g.fillStyle = 'rgba(20,24,48,0.25)';
      g.fillRect(0, 0, PP.W, PP.H);
    }
  }

  // hint
  if (PP.hint && PP.mode === 'free' && !PP.text.active) {
    g.font = PP.FONT; g.textBaseline = 'top';
    const tw = g.measureText(PP.hint).width;
    g.fillStyle = 'rgba(0,0,0,0.6)';
    g.fillRect(4, 4, tw + 8, 13);
    g.fillStyle = '#cfcfc0';
    g.fillText(PP.hint, 8, 7);
  }
};
