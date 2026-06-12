'use strict';
// Boot, game loop, chapter orchestration, test harness.

async function runChapter(n) {
  const ch = PP.chapterList[n - 1];
  if (!ch) throw new Error('no chapter ' + n);
  PP.curCh = n;
  // reset per-chapter state
  PP.flags = {}; PP.gates = {};
  PP.mode = 'cutscene';
  PP.god.active = false;
  PP.hint = '';
  PP.fadeA = 1;
  PP.saveSet({ chapter: n, unlocked: Math.max(PP.saveData().unlocked || 1, n) });
  PP.status('ch' + n + ' running');
  await ch.fn(PP.S);
  PP.audio.play(null);
  const next = n + 1;
  PP.saveSet({ unlocked: Math.max(PP.saveData().unlocked || 1, Math.min(next, PP.chapterList.length)) });
  if (next <= PP.chapterList.length) PP.saveSet({ chapter: next });
  PP.status('ch' + n + ' done');
}

async function gameFlow(start) {
  for (let n = start; n <= PP.chapterList.length; n++) {
    await runChapter(n);
  }
  // the end → back to title
  PP.saveSet({ chapter: 1 });
  await PP.S.caption('THE  END', 'thank you for reading');
  location.reload();
}

// ---------------- loop ----------------
const DT = 1 / 60;
let acc = 0, lastT = 0;

function update(dt) {
  PP.tick(dt);
  PP.text.update(dt);
  PP.choiceUI.update(dt);
  PP.caption.update(dt);
  PP.card.update(dt);
  if (PP.scene && PP.scene.update) PP.scene.update(dt);
  PP.world.update(dt);
}

function draw() {
  const g = PP.ctx;
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#000';
  g.fillRect(0, 0, PP.W, PP.H);
  if (PP.scene && PP.scene.draw) PP.scene.draw(g);
  else PP.world.draw(g);
  PP.drawGod(g);
  PP.caption.draw(g);
  PP.card.draw(g);
  PP.text.draw(g);
  PP.choiceUI.draw(g);
  if (PP.flashT > 0) {
    g.fillStyle = 'rgba(255,255,255,' + PP.clamp(PP.flashT * 6, 0, 1) + ')';
    g.fillRect(0, 0, PP.W, PP.H);
  }
  if (PP.fadeA > 0.002) {
    g.fillStyle = PP.fadeCol;
    g.globalAlpha = PP.fadeA;
    g.fillRect(0, 0, PP.W, PP.H);
    g.globalAlpha = 1;
  }
  if (PP.audio.muted) {
    g.font = PP.FONT; g.fillStyle = '#666'; g.textBaseline = 'top';
    g.fillText('M', 306, 6);
  }
}

function frame(t) {
  if (!lastT) lastT = t;
  let real = Math.min((t - lastT) / 1000, 0.1);
  lastT = t;
  if (!PP.test) {
    acc += real;
    let guard = 0;
    while (acc >= DT && guard++ < 4) { update(DT); acc -= DT; }
  }
  draw();
  PP.input.pressed = {};
  requestAnimationFrame(frame);
}

// test mode: pump updates via MessageChannel (much faster than rAF, and lets
// the script's await-microtasks interleave between batches)
function startTestPump() {
  const mc = new MessageChannel();
  mc.port1.onmessage = () => {
    if (PP.testDone) return;                       // chapter run finished
    // in-page screenshots: ?shots=4,9,15 → render + POST canvas at those gameTimes
    if (PP.shotList && PP.shotList.length && PP.gameTime >= PP.shotList[0]) {
      const t = PP.shotList.shift();
      draw();
      try {
        fetch('/__shot', {
          method: 'POST',
          body: JSON.stringify({ name: 'ch' + (PP.curCh || 0) + '_t' + t, data: PP.canvas.toDataURL('image/png') }),
        }).catch(() => {});
      } catch (e) { /* ignore */ }
    }
    if (PP.shotAt && PP.gameTime >= PP.shotAt) {   // frozen for screenshot
      PP.status('FROZEN gt=' + PP.gameTime.toFixed(2) + ' map=' + PP.world.mapId);
      return;
    }
    if (PP.gameTime > 1200) { PP.status('ERR test timeout in ' + (PP.world.mapId || '?') + ' text=' + PP.text.active + ' cap=' + PP.caption.active); return; }
    if (PP.gameTime - (PP._hb || 0) > 30) {
      PP._hb = PP.gameTime;
      PP.status('hb gt=' + PP.gameTime.toFixed(0) + ' map=' + PP.world.mapId);
    }
    for (let i = 0; i < 6; i++) update(DT);
    mc.port2.postMessage(0);
  };
  mc.port2.postMessage(0);
}

// ---------------- boot ----------------
(async function boot() {
  PP.canvas = document.getElementById('game');
  PP.ctx = PP.canvas.getContext('2d');
  const q = new URLSearchParams(location.search);
  PP.test = q.has('test');
  if (PP.test) PP.audio.disabled = true;
  PP.shotAt = parseFloat(q.get('shot') || '0') || 0; // freeze game at this gameTime (seconds)
  PP.shotList = (q.get('shots') || '').split(',').map(Number).filter(x => x > 0).sort((a, b) => a - b);

  try { await document.fonts.load('8px "Press Start 2P"'); } catch (e) { /* fallback font */ }
  PP.art.buildCast();
  PP.godImg = PP.art.godPortrait();
  requestAnimationFrame(frame);

  const chParam = parseInt(q.get('ch') || '0');
  try {
    if (PP.test && chParam) {
      startTestPump();
      const to = parseInt(q.get('to') || '0') || chParam;
      for (let n = chParam; n <= to; n++) {
        await runChapter(n); // throws if chapter missing
      }
      PP.testDone = true;
      document.title = 'ALL DONE';
      PP.status('ALL DONE gt=' + PP.gameTime.toFixed(1) + 's');
      return;
    }
    const sel = await PP.title.show();
    await gameFlow(sel.ch);
  } catch (e) {
    PP.reportError(e);
  }
})();
