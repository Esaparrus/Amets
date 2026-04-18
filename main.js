/* ============================================================
   MAIN.JS – Motor del juego (versión 2)
   16 escenas, audio integrado, familia de Amets
============================================================ */

const GAME = {

  /*
    Secuencia completa:
    0  intro
    1  story  (Lumi: presentación de la aventura)
    2  map
    3  level1 (laberinto)
    4  story  (Arai: pista tras el laberinto)
    5  boss1  (Maestra de Ballet – math + inglés)
    6  story  (Ainara: mensaje antes del runner)
    7  map
    8  level2 (runner)
    9  boss2  (Coreógrafa – memoria)
    10 story  (Mara + David: antes del nivel 3)
    11 map
    12 level3 (furgoneta)
    13 boss3  (Gran Guardián – mixto)
    14 story  (David + familia: reunión final)
    15 final
  */
  scenes: [
    'intro',   // 0
    'story',   // 1
    'map',     // 2
    'level1',  // 3
    'story',   // 4
    'boss1',   // 5
    'story',   // 6
    'map',     // 7
    'level2',  // 8
    'boss2',   // 9
    'story',   // 10
    'map',     // 11
    'level3',  // 12
    'boss3',   // 13
    'story',   // 14
    'final'    // 15
  ],

  step:       0,
  cakePieces: 0,

  /* ── Arrancar el juego ── */
  init() {
    this.step       = 0;
    this.cakePieces = 0;
    this.showScreen('intro');
    IntroScene.init();
  },

  /* ── Siguiente escena ── */
  next() {
    this.step = Math.min(this.step + 1, this.scenes.length - 1);
    this.goTo(this.scenes[this.step]);
  },

  /* ── Ir a escena con fundido ── */
  goTo(name) {
    this._stopAnimations();
    this._fade(() => {
      this.showScreen(name);
      this._launch(name);
    });
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
  },

  _launch(name) {
    const handlers = {
      intro:   () => IntroScene.init(),
      story:   () => StoryScene.init(),
      map:     () => MapScene.init(),
      level1:  () => MazeScene.init(),
      boss1:   () => Boss1Scene.init(),
      level2:  () => RunnerScene.init(),
      boss2:   () => MemoryScene.init(),
      level3:  () => VanScene.init(),
      boss3:   () => Boss3Scene.init(),
      final:   () => FinalScene.init()
    };
    handlers[name]?.();
  },

  _stopAnimations() {
    [IntroScene, RunnerScene, VanScene, FinalScene].forEach(s => {
      if (s && s.raf) { cancelAnimationFrame(s.raf); s.raf = null; }
    });
    AUDIO.stopMusic();
  },

  _fade(fn) {
    const ov = document.getElementById('transition-overlay');
    ov.classList.add('show');
    setTimeout(() => {
      fn();
      setTimeout(() => ov.classList.remove('show'), 80);
    }, 360);
  },

  /* ── Añadir pieza de pastel ── */
  addCakePiece() {
    this.cakePieces = Math.min(this.cakePieces + 1, 6);
    this._updateCakeBar();
  },

  _updateCakeBar() {
    const el = document.getElementById('cake-bar');
    if (!el) return;
    el.innerHTML = Array.from({ length: 6 }, (_, i) =>
      `<span class="cake-piece ${i < this.cakePieces ? 'earned' : ''}">${i < this.cakePieces ? '🍰' : '⬜'}</span>`
    ).join('');
  },

  restart() {
    this.step       = 0;
    this.cakePieces = 0;
    this.goTo('intro');
  }
};

/* ════════════════════════════════════════════════════════════
   INPUT – Teclado
════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  const scene = GAME.scenes[GAME.step];

  if (scene === 'level1') {
    const d = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0] };
    if (d[e.key]) { e.preventDefault(); MazeScene.move(...d[e.key]); }
  }
  if (scene === 'level2') {
    if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); RunnerScene.jump(); }
  }
  if (scene === 'level3') {
    if (e.key === 'ArrowLeft')  VanScene.keys.left  = true;
    if (e.key === 'ArrowRight') VanScene.keys.right = true;
  }
  if (scene === 'boss2') {
    const m = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
    if (m[e.key]) { e.preventDefault(); MemoryScene.input(m[e.key]); }
  }
});

document.addEventListener('keyup', e => {
  if (GAME.scenes[GAME.step] === 'level3') {
    if (e.key === 'ArrowLeft')  VanScene.keys.left  = false;
    if (e.key === 'ArrowRight') VanScene.keys.right = false;
  }
});

/* ════════════════════════════════════════════════════════════
   DOM READY
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Mute button */
  document.getElementById('btn-mute').addEventListener('click', () => {
    AUDIO.init();
    AUDIO.toggleMute();
  });

  /* Replay */
  document.getElementById('btn-replay').addEventListener('click', () => {
    AUDIO.click();
    GAME.restart();
  });

  /* Inicializar audio en primer gesto (necesario en móvil) */
  document.addEventListener('click', () => AUDIO.init(), { once: true });
  document.addEventListener('touchstart', () => AUDIO.init(), { once: true });

  GAME.init();
});
