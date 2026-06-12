'use strict';
// Chiptune sequencer + SFX (WebAudio, all procedural)

PP.audio = {
  ac: null, master: null, musicGain: null,
  muted: false, disabled: false,
  cur: null, curName: null, schedTimer: null,
  songs: {},

  userGesture() {
    if (this.disabled) return;
    if (!this.ac) {
      try {
        this.ac = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ac.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ac.destination);
        this.musicGain = this.ac.createGain();
        this.musicGain.gain.value = 1;
        this.musicGain.connect(this.master);
        if (this.pendingSong) { const s = this.pendingSong; this.pendingSong = null; this.play(s); }
      } catch (e) { this.disabled = true; }
    }
    if (this.ac && this.ac.state === 'suspended') this.ac.resume();
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
  },

  // ---- note parsing: "e4:2 g4:2 -:4" (note:sixteenths, '-' rest) ----
  freq(n) {
    const m = /^([a-g])(#?)(\d)$/.exec(n);
    if (!m) return 0;
    const base = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1]] + (m[2] ? 1 : 0);
    const midi = (parseInt(m[3]) + 1) * 12 + base;
    return 440 * Math.pow(2, (midi - 69) / 12);
  },

  defineSong(name, def) { this.songs[name] = def; },

  play(name) {
    if (this.disabled) return;
    if (this.curName === name) return;
    this.stopMusic();
    this.curName = name;
    if (!name || !this.songs[name]) return;
    if (!this.ac) { this.pendingSong = name; return; }
    const song = this.songs[name];
    const step = 60 / song.bpm / 4; // one sixteenth
    const tracks = song.tracks.map(t => ({
      ...t,
      seq: t.notes.trim().split(/\s+/).map(tok => {
        const [n, d] = tok.split(':');
        return { n, d: parseInt(d || '1') };
      }),
      idx: 0,
    }));
    const len = tracks.reduce((mx, t) => Math.max(mx, t.seq.reduce((s, e) => s + e.d, 0)), 0);
    const state = { song, tracks, step, len, t0: this.ac.currentTime + 0.05, loopN: 0 };
    this.cur = state;
    const schedule = () => {
      if (this.cur !== state) return;
      const now = this.ac.currentTime;
      const horizon = now + 0.6;
      // schedule by absolute sixteenth index
      while (state.t0 + (state.nextStep || 0) * step < horizon) {
        const si = state.nextStep || 0;
        const pos = si % len;
        for (const tr of tracks) {
          // find event starting at pos
          let acc = 0;
          for (const ev of tr.seq) {
            if (acc === pos) {
              if (ev.n !== '-') this.noteAt(state.t0 + si * step, ev.n, ev.d * step, tr);
              break;
            }
            acc += ev.d;
            if (acc > pos) break;
          }
        }
        state.nextStep = si + 1;
      }
      this.schedTimer = setTimeout(schedule, 200);
    };
    schedule();
  },

  noteAt(t, n, dur, tr) {
    const ac = this.ac;
    if (n === 'noise') {
      const len = Math.min(dur, 0.3);
      const buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ac.createBufferSource(); src.buffer = buf;
      const g = ac.createGain();
      g.gain.setValueAtTime(tr.vol || 0.1, t);
      src.connect(g); g.connect(this.musicGain);
      src.start(t);
      return;
    }
    const f = this.freq(n);
    if (!f) return;
    const o = ac.createOscillator();
    o.type = tr.wave || 'triangle';
    o.frequency.value = f * (tr.det || 1);
    const g = ac.createGain();
    const v = tr.vol || 0.12;
    const a = tr.attack || 0.01;
    const rel = tr.rel || 0.08;
    const hold = Math.max(dur * (tr.sus || 0.85) - rel, 0.02);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + a);
    g.gain.setValueAtTime(v, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + a + hold + rel + 0.05);
  },

  stopMusic() {
    this.curName = null; this.cur = null;
    if (this.schedTimer) { clearTimeout(this.schedTimer); this.schedTimer = null; }
  },

  // ---- sfx ----
  sfx(name) {
    if (this.disabled || !this.ac || this.muted) return;
    const ac = this.ac, t = ac.currentTime;
    const tone = (f0, f1, dur, type, vol) => {
      const o = ac.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + dur + 0.02);
    };
    const noise = (dur, vol, lp) => {
      const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ac.createBufferSource(); src.buffer = buf;
      const g = ac.createGain(); g.gain.value = vol;
      if (lp) {
        const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp;
        src.connect(f); f.connect(g);
      } else src.connect(g);
      g.connect(this.master); src.start(t);
    };
    switch (name) {
      case 'blip': tone(620, 600, 0.04, 'square', 0.045); break;
      case 'blipN': tone(380, 370, 0.045, 'triangle', 0.06); break;
      case 'ok': tone(880, 1200, 0.07, 'square', 0.06); break;
      case 'move': tone(500, 700, 0.05, 'square', 0.05); break;
      case 'door': noise(0.25, 0.18, 500); tone(120, 60, 0.2, 'sine', 0.2); break;
      case 'thud': noise(0.18, 0.3, 300); tone(90, 40, 0.25, 'sine', 0.3); break;
      case 'slap': noise(0.09, 0.3, 2400); break;
      case 'crash': noise(0.5, 0.3, 1500); tone(200, 50, 0.4, 'sawtooth', 0.15); break;
      case 'heart': tone(70, 50, 0.16, 'sine', 0.4); break;
      case 'chime': tone(1320, 1318, 0.5, 'sine', 0.1); tone(1980, 1975, 0.4, 'sine', 0.05); break;
      case 'god': tone(523, 525, 0.7, 'sine', 0.12); tone(659, 660, 0.7, 'sine', 0.1); tone(784, 786, 0.7, 'sine', 0.1); break;
      case 'sparkle': tone(1500, 2400, 0.12, 'sine', 0.08); break;
      case 'rumble': noise(0.9, 0.25, 200); break;
      case 'train': noise(0.7, 0.2, 900); tone(300, 280, 0.6, 'sawtooth', 0.04); break;
      case 'wave': noise(1.2, 0.12, 600); break;
    }
  },
};

// ---------------- songs ----------------
// gentle home theme — wistful, simple
PP.audio.defineSong('home', { bpm: 84, tracks: [
  { wave: 'triangle', vol: 0.10, notes: 'e4:4 g4:4 b4:4 a4:4 g4:4 e4:4 d4:8 e4:4 g4:4 b4:4 c5:4 b4:4 g4:4 e4:12' },
  { wave: 'sine', vol: 0.07, notes: 'c3:16 a2:16 f2:16 g2:16' },
]});
// school — light, walking pace
PP.audio.defineSong('school', { bpm: 104, tracks: [
  { wave: 'square', vol: 0.045, notes: 'g4:2 -:2 a4:2 -:2 b4:2 g4:2 d5:4 b4:2 -:2 a4:2 g4:2 a4:4 -:4 e4:2 -:2 g4:2 -:2 a4:2 e4:2 b4:4 a4:2 -:2 g4:2 e4:2 d4:4 -:4' },
  { wave: 'triangle', vol: 0.09, notes: 'g2:4 d3:4 e2:4 b2:4 c3:4 g2:4 d3:4 d2:4' },
]});
// aiko — music box
PP.audio.defineSong('aiko', { bpm: 76, tracks: [
  { wave: 'sine', vol: 0.11, rel: 0.3, notes: 'e5:4 b4:2 g4:2 a4:4 g4:2 e4:2 g4:6 e4:2 d4:8 e5:4 b4:2 g4:2 a4:4 b4:2 c5:2 b4:12 -:4' },
  { wave: 'sine', vol: 0.05, notes: 'e3:8 c3:8 a2:8 b2:8 e3:8 c3:8 b2:8 e3:8' },
]});
// sad — sparse
PP.audio.defineSong('sad', { bpm: 60, tracks: [
  { wave: 'sine', vol: 0.10, rel: 0.5, notes: 'a4:8 c5:4 b4:4 e4:16 -:8 g4:8 a4:4 e4:4 d4:16 -:8' },
  { wave: 'sine', vol: 0.05, notes: 'a2:32 d2:32' },
]});
// tense — low pulse
PP.audio.defineSong('tense', { bpm: 96, tracks: [
  { wave: 'sine', vol: 0.13, notes: 'a2:2 -:2 a2:2 -:2 a2:2 -:2 g2:2 -:2 a2:2 -:2 a2:2 -:2 b2:2 -:2 g2:2 -:2' },
  { wave: 'triangle', vol: 0.04, rel: 0.4, notes: '-:16 e4:2 -:6 d4:2 -:6 -:16 f4:2 -:6 e4:2 -:6' },
]});
// dark — drone, the bad nights
PP.audio.defineSong('dark', { bpm: 52, tracks: [
  { wave: 'sine', vol: 0.12, notes: 'd2:32 c2:32' },
  { wave: 'sine', vol: 0.045, det: 1.007, rel: 0.6, notes: 'd4:16 -:16 f4:8 e4:8 -:16' },
]});
// pegasus — off-kilter whole tone
PP.audio.defineSong('pegasus', { bpm: 88, tracks: [
  { wave: 'triangle', vol: 0.08, notes: 'c4:4 d4:4 e4:4 f#4:4 g#4:4 f#4:4 e4:4 d4:4' },
  { wave: 'sine', vol: 0.06, notes: 'c3:16 g#2:16' },
  { wave: 'square', vol: 0.02, notes: '-:8 c6:1 -:7 -:8 g#5:1 -:7' },
]});
// run — driving
PP.audio.defineSong('run', { bpm: 132, tracks: [
  { wave: 'triangle', vol: 0.11, notes: 'a2:2 a2:2 e3:2 a2:2 g2:2 g2:2 d3:2 g2:2 f2:2 f2:2 c3:2 f2:2 e2:2 e2:2 b2:2 e2:2' },
  { wave: 'square', vol: 0.035, rel: 0.15, notes: 'a4:4 -:4 c5:4 b4:2 a4:2 g4:4 -:4 b4:4 a4:2 g4:2 f4:4 -:4 a4:4 g4:2 f4:2 e4:8 -:8' },
]});
// sea — slow, salt wind
PP.audio.defineSong('sea', { bpm: 66, tracks: [
  { wave: 'sine', vol: 0.09, rel: 0.5, notes: 'g4:8 a4:4 b4:4 d5:8 b4:8 a4:8 g4:4 e4:4 d4:16' },
  { wave: 'sine', vol: 0.05, notes: 'g2:16 c3:16 d3:16 g2:16' },
]});
// title — almost nothing
PP.audio.defineSong('title', { bpm: 56, tracks: [
  { wave: 'sine', vol: 0.09, rel: 0.6, notes: 'e4:8 g4:8 b4:8 -:8 a4:8 g4:8 e4:8 -:8 d4:8 e4:8 g4:16 -:8' },
  { wave: 'sine', vol: 0.04, notes: 'e2:32 c2:32 d2:32 e2:32' },
]});
// end — warm morning
PP.audio.defineSong('end', { bpm: 80, tracks: [
  { wave: 'triangle', vol: 0.10, rel: 0.3, notes: 'c5:4 g4:4 e4:4 g4:4 a4:4 g4:4 e4:8 f4:4 e4:4 d4:4 e4:4 c4:16' },
  { wave: 'sine', vol: 0.06, notes: 'c3:16 f2:16 g2:16 c3:16' },
]});
// god — celestial nonsense
PP.audio.defineSong('god', { bpm: 70, tracks: [
  { wave: 'sine', vol: 0.10, rel: 0.4, notes: 'c5:4 e5:4 g5:8 e5:4 c5:4 d5:8 -:8' },
  { wave: 'sine', vol: 0.05, notes: 'c3:16 g2:16' },
]});
