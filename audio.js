/* ============================================================
   AUDIO.JS – Sistema de sonido con Web Audio API
   Sin dependencias externas. Genera sonidos sintetizados.
   v5: enfoque 100% síncrono (sin .then()) para máxima
       compatibilidad iOS Safari / Android Chrome.
       Patrón probado en Howler.js / Phaser.js.
============================================================ */

const AUDIO = {
  ctx:        null,
  bgRunning:  false,
  bgTimer:    null,
  muted:      false,
  _unlocked:  false,

  /* Ambiente */
  ambRunning: false,
  ambTimer:   null,
  ambOsc:     null,
  ambGain:    null,

  /* ── Inicializar — llamar en CADA gesto del usuario ─────── */
  init() {
    /* Crear contexto dentro del gesto para máxima compatibilidad */
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { console.warn('Web Audio no disponible'); return; }
    }

    /* resume() síncrono – iOS requiere la llamada dentro del gesto */
    if (this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }

    /* Reproducir buffer silencioso síncrono – desbloquea el contexto.
       start(0) se ejecuta aunque el contexto siga suspended;
       sonará cuando resume() resuelva (que ocurre en este gesto). */
    if (!this._unlocked) {
      this._unlocked = true;
      try {
        const buf = this.ctx.createBuffer(1, 1, this.ctx.sampleRate || 44100);
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.connect(this.ctx.destination);
        src.start(0);
      } catch (e) {}
    }
  },

  /* ── Reanudar (para recuperarse de interrupciones) ───────── */
  _resume() {
    if (this.ctx && this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }
  },

  /* ── Tono básico — síncrono, sin esperar resume() ─────────
     Si el contexto está suspended, start(0) encola el nodo;
     suena en cuanto resume() resuelve (lo hizo init() ya). */
  _tone(freq, dur, type = 'sine', vol = 0.4, delay = 0) {
    if (!this.ctx || this.muted || freq <= 0) return;
    try {
      const t    = this.ctx.currentTime + delay;
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch (e) {}
  },

  /* ── SFX: Respuesta correcta ── */
  correct() {
    [[523,0],[659,0.1],[784,0.2],[1047,0.32]].forEach(([f,d]) =>
      this._tone(f, 0.25, 'sine', 0.45, d));
  },

  /* ── SFX: Respuesta incorrecta ── */
  wrong() {
    this._tone(280, 0.18, 'sawtooth', 0.4, 0);
    this._tone(200, 0.32, 'sawtooth', 0.35, 0.18);
  },

  /* ── SFX: Nivel completado (fanfarria) ── */
  levelComplete() {
    [
      [523,0],[659,0.13],[784,0.26],[1047,0.39],
      [784,0.52],[1047,0.65],[1319,0.82]
    ].forEach(([f,d]) => this._tone(f, 0.28, 'sine', 0.5, d));
  },

  /* ── SFX: Salto ── */
  jump() {
    this._tone(440, 0.07, 'square', 0.28, 0);
    this._tone(660, 0.09, 'square', 0.28, 0.07);
  },

  /* ── SFX: Recoger estrella ── */
  star() {
    [[880,0],[1100,0.08],[1320,0.16]].forEach(([f,d]) =>
      this._tone(f, 0.14, 'sine', 0.38, d));
  },

  /* ── SFX: Choque / crash ── */
  crash() {
    this._tone(320, 0.12, 'sawtooth', 0.45, 0);
    this._tone(200, 0.28, 'sawtooth', 0.4,  0.12);
    this._tone(120, 0.2,  'sawtooth', 0.32, 0.32);
  },

  /* ── SFX: Clic de botón ── */
  click() {
    this._tone(900, 0.06, 'sine', 0.22);
  },

  /* ── SFX: Avanzar texto ── */
  blip() {
    this._tone(1200, 0.03, 'sine', 0.12);
  },

  /* ── SFX: Final / pastel completo ── */
  finalFanfare() {
    const melody = [
      [523,0],[659,0.15],[784,0.30],[1047,0.45],[1319,0.60],
      [1047,0.80],[1319,0.95],[1047,1.15],[784,1.35],[1047,1.55]
    ];
    melody.forEach(([f,d]) => this._tone(f, 0.35, 'sine', 0.55, d));
  },

  /* ── SFX: Advertencia de pájaro ── */
  birdWarning() {
    this._tone(1600, 0.05, 'sine', 0.22, 0);
    this._tone(1100, 0.05, 'sine', 0.18, 0.06);
    this._tone(1600, 0.04, 'sine', 0.15, 0.12);
    this._tone(900,  0.06, 'sine', 0.15, 0.18);
  },

  /* ── SFX: Piar (bosque) ── */
  _chirp(baseFreq, notes) {
    const f = baseFreq || 800 + Math.random() * 400;
    const n = notes   || 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      this._tone(f + i * 90, 0.06, 'sine', 0.065, i * 0.075);
    }
  },

  /* ══════════════════════════════════════════════════════════
     MÚSICA DE FONDO
  ══════════════════════════════════════════════════════════ */
  THEMES: {
    menu: {
      notes:  [523,0,659,0,784,659,523,0, 523,0,784,659,523,0,392,0],
      tempo:  480, type: 'sine', vol: 0.08
    },
    level: {
      notes:  [392,523,659,784,659,784,523,659, 784,523,659,392,523,784,659,523],
      tempo:  280, type: 'triangle', vol: 0.07
    },
    boss: {
      notes:  [220,0,277,0,220,0,196,0, 220,0,247,0,220,0,0,0],
      tempo:  340, type: 'sawtooth', vol: 0.06
    },
    final: {
      notes:  [784,659,784,1047,784,659,523,659, 784,1047,784,659,523,0,523,0],
      tempo:  380, type: 'sine', vol: 0.09
    }
  },

  startMusic(theme) {
    this.stopMusic();
    if (!this.ctx || this.muted) return;

    const t = this.THEMES[theme] || this.THEMES.menu;
    let i = 0;
    this.bgRunning = true;

    /* Tick síncrono — _tone() maneja el estado suspended internamente */
    const tick = () => {
      if (!this.bgRunning) return;
      const f = t.notes[i % t.notes.length];
      if (f > 0) this._tone(f, (t.tempo / 1000) * 0.75, t.type, t.vol);
      i++;
      this.bgTimer = setTimeout(tick, t.tempo);
    };
    tick();
  },

  stopMusic() {
    this.bgRunning = false;
    if (this.bgTimer) { clearTimeout(this.bgTimer); this.bgTimer = null; }
    this.stopAmbient();
  },

  /* ══════════════════════════════════════════════════════════
     SONIDO AMBIENTAL
  ══════════════════════════════════════════════════════════ */

  startAmbient(type) {
    this.stopAmbient();
    if (this.muted || !this.ctx) return;
    if (type === 'forest') this._ambientForest();
    else if (type === 'road') this._ambientRoad();
  },

  stopAmbient() {
    this.ambRunning = false;
    if (this.ambTimer)  { clearTimeout(this.ambTimer);  this.ambTimer = null; }
    if (this.ambOsc)    { try { this.ambOsc.stop(); }   catch(e) {} this.ambOsc  = null; }
    if (this.ambGain)   { try { this.ambGain.disconnect(); } catch(e) {} this.ambGain = null; }
  },

  _ambientForest() {
    this.ambRunning = true;
    const tick = () => {
      if (!this.ambRunning || this.muted) return;
      this._chirp();
      if (Math.random() < 0.35) {
        setTimeout(() => { if (this.ambRunning && !this.muted) this._chirp(); }, 320);
      }
      this.ambTimer = setTimeout(tick, 1800 + Math.random() * 3600);
    };
    tick();
  },

  _ambientRoad() {
    if (!this.ctx || this.muted) return;
    this.ambRunning = true;
    try {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.value = 88;
      gain.gain.setValueAtTime(0.018, this.ctx.currentTime);
      osc.start();
      this.ambOsc  = osc;
      this.ambGain = gain;
    } catch(e) {}

    const windTick = () => {
      if (!this.ambRunning || this.muted) return;
      this._windGust();
      this.ambTimer = setTimeout(windTick, 2200 + Math.random() * 2800);
    };
    windTick();
  },

  _windGust() {
    if (!this.ctx || this.muted) return;
    try {
      const t = this.ctx.currentTime;
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, t);
      osc.frequency.linearRampToValueAtTime(520, t + 0.35);
      osc.frequency.linearRampToValueAtTime(180, t + 0.85);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.028, t + 0.22);
      gain.gain.linearRampToValueAtTime(0, t + 0.85);
      osc.start(t);
      osc.stop(t + 0.9);
    } catch(e) {}
  },

  /* ── Toggle mute ── */
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic();
    } else {
      this._resume();
    }
    const btn = document.getElementById('btn-mute');
    if (btn) btn.textContent = this.muted ? '🔇' : '🔊';
    return this.muted;
  }
};
