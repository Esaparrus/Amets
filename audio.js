/* ============================================================
   AUDIO.JS – Sistema de sonido con Web Audio API
   Sin dependencias externas. Genera sonidos sintetizados.
   v4: fix móvil – resume() ANTES de _unlock(), oscilador en vez
       de buffer, flag _unlocked para no repetir, ambient espera
       contexto activo.
============================================================ */

const AUDIO = {
  ctx:        null,
  bgRunning:  false,
  bgTimer:    null,
  muted:      false,
  _unlocked:  false,

  /* Ambiente (bosque / carretera) */
  ambRunning: false,
  ambTimer:   null,
  ambOsc:     null,
  ambGain:    null,

  /* ── Inicializar (llamar desde cualquier gesto del usuario) ── */
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { console.warn('Audio no disponible'); return; }
    }

    if (this.ctx.state === 'running') {
      /* Ya activo: asegurar unlock hecho */
      if (!this._unlocked) this._unlock();
      return;
    }

    /* Suspended → resume primero, unlock en el callback */
    this.ctx.resume().then(() => {
      if (!this._unlocked) this._unlock();
    }).catch(() => {});
  },

  _resume() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (!this._unlocked) this._unlock();
      }).catch(() => {});
    }
  },

  /* Desbloquear con un oscilador silencioso de vida muy corta
     (más fiable que buffer en iOS Safari) */
  _unlock() {
    if (!this.ctx || this._unlocked) return;
    try {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.value = 0.00001; /* prácticamente silencioso */
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.001);
      osc.onended = () => { this._unlocked = true; };
    } catch (e) {}
  },

  /* ── Tono básico ── */
  _tone(freq, dur, type = 'sine', vol = 0.4, delay = 0) {
    if (!this.ctx) this.init();
    if (!this.ctx || this.muted || freq <= 0) return;

    const _play = () => {
      if (this.ctx.state !== 'running') return;
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
    };

    if (this.ctx.state === 'running') {
      _play();
    } else {
      this.ctx.resume().then(_play).catch(() => {});
    }
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

  /* ── SFX: Advertencia de pájaro (bajada rápida) ── */
  birdWarning() {
    this._tone(1600, 0.05, 'sine', 0.18, 0);
    this._tone(1100, 0.05, 'sine', 0.15, 0.06);
    this._tone(1600, 0.04, 'sine', 0.12, 0.12);
    this._tone(900,  0.06, 'sine', 0.12, 0.18);
  },

  /* ── SFX: Piar (bosque) ── */
  _chirp(baseFreq, notes) {
    const f = baseFreq || 800 + Math.random() * 400;
    const n = notes   || 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      this._tone(f + i * 90, 0.06, 'sine', 0.055, i * 0.075);
    }
  },

  /* ══════════════════════════════════════════════════════════
     MÚSICA DE FONDO
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
    if (!this.ctx) this.init();
    if (!this.ctx || this.muted) return;

    const t = this.THEMES[theme] || this.THEMES.menu;
    let i = 0;
    this.bgRunning = true;

    const _go = () => {
      const tick = () => {
        if (!this.bgRunning) return;
        const f = t.notes[i % t.notes.length];
        if (f > 0) this._tone(f, (t.tempo / 1000) * 0.75, t.type, t.vol);
        i++;
        this.bgTimer = setTimeout(tick, t.tempo);
      };
      tick();
    };

    if (this.ctx.state === 'running') {
      _go();
    } else {
      this.ctx.resume().then(() => {
        if (!this._unlocked) this._unlock();
        _go();
      }).catch(_go);
    }
  },

  stopMusic() {
    this.bgRunning = false;
    if (this.bgTimer) { clearTimeout(this.bgTimer); this.bgTimer = null; }
    this.stopAmbient();
  },

  /* ══════════════════════════════════════════════════════════
     SONIDO AMBIENTAL (bosque / carretera)
  ══════════════════════════════════════════════════════════ */

  startAmbient(type) {
    this.stopAmbient();
    if (this.muted || !this.ctx) return;

    const _start = () => {
      if (type === 'forest') this._ambientForest();
      else if (type === 'road') this._ambientRoad();
    };

    if (this.ctx.state === 'running') {
      _start();
    } else {
      this.ctx.resume().then(_start).catch(() => {});
    }
  },

  stopAmbient() {
    this.ambRunning = false;
    if (this.ambTimer)  { clearTimeout(this.ambTimer);  this.ambTimer = null; }
    if (this.ambOsc)    { try { this.ambOsc.stop(); }   catch(e) {} this.ambOsc  = null; }
    if (this.ambGain)   { try { this.ambGain.disconnect(); } catch(e) {} this.ambGain = null; }
  },

  /* Bosque: píos de pájaros periódicos aleatorios */
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

  /* Carretera: zumbido de motor continuo + ráfagas de viento */
  _ambientRoad() {
    if (!this.ctx || this.muted) return;
    if (this.ctx.state !== 'running') return; /* startAmbient ya hizo resume */
    this.ambRunning = true;

    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.value = 88;
    gain.gain.setValueAtTime(0.014, this.ctx.currentTime);
    osc.start();
    this.ambOsc  = osc;
    this.ambGain = gain;

    const windTick = () => {
      if (!this.ambRunning || this.muted) return;
      this._windGust();
      this.ambTimer = setTimeout(windTick, 2200 + Math.random() * 2800);
    };
    windTick();
  },

  _windGust() {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
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
    gain.gain.linearRampToValueAtTime(0.022, t + 0.22);
    gain.gain.linearRampToValueAtTime(0, t + 0.85);
    osc.start(t);
    osc.stop(t + 0.9);
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
