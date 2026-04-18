/* ============================================================
   AUDIO.JS – Sistema de sonido con Web Audio API
   Sin dependencias externas. Genera sonidos sintetizados.
============================================================ */

const AUDIO = {
  ctx:       null,
  bgRunning: false,
  bgTimer:   null,
  muted:     false,

  /* ── Inicializar (llamar tras primer gesto del usuario) ── */
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { console.warn('Audio no disponible'); }
  },

  _resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  /* ── Tono básico ── */
  _tone(freq, dur, type = 'sine', vol = 0.4, delay = 0) {
    if (!this.ctx || this.muted || freq <= 0) return;
    this._resume();
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
    osc.stop(t + dur + 0.02);
  },

  /* ── SFX: Respuesta correcta ── */
  correct() {
    [[523,0],[659,0.1],[784,0.2],[1047,0.32]].forEach(([f,d]) =>
      this._tone(f, 0.25, 'sine', 0.38, d));
  },

  /* ── SFX: Respuesta incorrecta ── */
  wrong() {
    this._tone(280, 0.18, 'sawtooth', 0.35, 0);
    this._tone(200, 0.32, 'sawtooth', 0.30, 0.18);
  },

  /* ── SFX: Nivel completado (fanfarria) ── */
  levelComplete() {
    [
      [523,0],[659,0.13],[784,0.26],[1047,0.39],
      [784,0.52],[1047,0.65],[1319,0.82]
    ].forEach(([f,d]) => this._tone(f, 0.28, 'sine', 0.45, d));
  },

  /* ── SFX: Salto ── */
  jump() {
    this._tone(440, 0.07, 'square', 0.22, 0);
    this._tone(660, 0.09, 'square', 0.22, 0.07);
  },

  /* ── SFX: Recoger estrella ── */
  star() {
    [[880,0],[1100,0.08],[1320,0.16]].forEach(([f,d]) =>
      this._tone(f, 0.14, 'sine', 0.32, d));
  },

  /* ── SFX: Choque / crash ── */
  crash() {
    this._tone(320, 0.12, 'sawtooth', 0.4, 0);
    this._tone(200, 0.28, 'sawtooth', 0.35, 0.12);
    this._tone(120, 0.2,  'sawtooth', 0.28, 0.32);
  },

  /* ── SFX: Clic de botón ── */
  click() {
    this._tone(900, 0.05, 'sine', 0.18);
  },

  /* ── SFX: Avanzar texto ── */
  blip() {
    this._tone(1200, 0.03, 'sine', 0.10);
  },

  /* ── SFX: Final / pastel completo ── */
  finalFanfare() {
    const melody = [
      [523,0],[659,0.15],[784,0.30],[1047,0.45],[1319,0.60],
      [1047,0.80],[1319,0.95],[1047,1.15],[784,1.35],[1047,1.55]
    ];
    melody.forEach(([f,d]) => this._tone(f, 0.35, 'sine', 0.5, d));
  },

  /* ══════════════════════════════════════════════════════════
     MÚSICA DE FONDO (sintetizada, en bucle)
  ══════════════════════════════════════════════════════════ */

  THEMES: {
    menu: {
      notes:  [523,0,659,0,784,659,523,0, 523,0,784,659,523,0,392,0],
      tempo:  480, type: 'sine', vol: 0.055
    },
    level: {
      notes:  [392,523,659,784,659,784,523,659, 784,523,659,392,523,784,659,523],
      tempo:  280, type: 'triangle', vol: 0.045
    },
    boss: {
      notes:  [220,0,277,0,220,0,196,0, 220,0,247,0,220,0,0,0],
      tempo:  340, type: 'sawtooth', vol: 0.038
    },
    final: {
      notes:  [784,659,784,1047,784,659,523,659, 784,1047,784,659,523,0,523,0],
      tempo:  380, type: 'sine', vol: 0.06
    }
  },

  startMusic(theme) {
    this.stopMusic();
    if (!this.ctx || this.muted) return;
    this._resume();
    const t = this.THEMES[theme] || this.THEMES.menu;
    let i = 0;
    this.bgRunning = true;
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
  },

  /* ── Toggle mute ── */
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.stopMusic();
    const btn = document.getElementById('btn-mute');
    if (btn) btn.textContent = this.muted ? '🔇' : '🔊';
    return this.muted;
  }
};
