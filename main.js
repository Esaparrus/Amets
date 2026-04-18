/* ============================================================
   MAIN.JS – Motor principal del juego
   Define GAME, controla escenas e inputs
============================================================ */

const GAME = {

  /* Secuencia lineal de escenas */
  scenes: [
    'intro',      // 0
    'narrative',  // 1
    'map',        // 2 – antes del nivel 1
    'level1',     // 3
    'boss1',      // 4
    'map',        // 5 – antes del nivel 2
    'level2',     // 6
    'boss2',      // 7
    'map',        // 8 – antes del nivel 3
    'level3',     // 9
    'boss3',      // 10
    'final'       // 11
  ],

  step: 0,
  cakePieces: 0,

  /* ── Inicializar el juego ── */
  init() {
    this.step = 0;
    this.cakePieces = 0;
    this.showScreen('intro');
    IntroScene.init();
  },

  /* ── Avanzar a la siguiente escena ── */
  next() {
    this.step = Math.min(this.step + 1, this.scenes.length - 1);
    this.goTo(this.scenes[this.step]);
  },

  /* ── Ir a una escena con transición ── */
  goTo(name) {
    this._stopAll();
    this._fade(() => {
      this.showScreen(name);
      this._startScene(name);
    });
  },

  /* ── Cambiar pantalla activa ── */
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
  },

  /* ── Iniciar la escena indicada ── */
  _startScene(name) {
    const map = {
      intro:     () => IntroScene.init(),
      narrative: () => NarrativeScene.init(),
      map:       () => MapScene.init(),
      level1:    () => MazeScene.init(),
      boss1:     () => Boss1Scene.init(),
      level2:    () => RunnerScene.init(),
      boss2:     () => MemoryScene.init(),
      level3:    () => VanScene.init(),
      boss3:     () => Boss3Scene.init(),
      final:     () => FinalScene.init()
    };
    if (map[name]) map[name]();
  },

  /* ── Cancelar todos los RAF activos ── */
  _stopAll() {
    [IntroScene, RunnerScene, VanScene, FinalScene].forEach(s => {
      if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; }
    });
  },

  /* ── Transición de fundido ── */
  _fade(fn) {
    const ov = document.getElementById('transition-overlay');
    ov.classList.add('show');
    setTimeout(() => {
      fn();
      setTimeout(() => ov.classList.remove('show'), 80);
    }, 350);
  },

  /* ── Añadir pieza de pastel y actualizar UI ── */
  addCakePiece() {
    this.cakePieces = Math.min(this.cakePieces + 1, 6);
    this._updateCakeBar();
  },

  _updateCakeBar() {
    const el = document.getElementById('cake-bar');
    if (!el) return;
    const filled = '🍰'.repeat(this.cakePieces);
    const empty  = '⬜'.repeat(6 - this.cakePieces);
    el.textContent = filled + empty;
  },

  /* ── Reiniciar partida ── */
  restart() {
    this.step = 0;
    this.cakePieces = 0;
    this.goTo('intro');
  }
};

/* ═══════════════════════════════════════════════════════════
   INPUT: Teclado
═══════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  const scene = GAME.scenes[GAME.step];

  /* Laberinto */
  if (scene === 'level1') {
    const dirs = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0] };
    if (dirs[e.key]) { e.preventDefault(); MazeScene.move(...dirs[e.key]); }
  }

  /* Runner – saltar */
  if (scene === 'level2') {
    if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); RunnerScene.jump(); }
  }

  /* Furgoneta */
  if (scene === 'level3') {
    if (e.key === 'ArrowLeft')  VanScene.keys.left  = true;
    if (e.key === 'ArrowRight') VanScene.keys.right = true;
  }

  /* Memoria */
  if (scene === 'boss2') {
    const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
    if (map[e.key]) { e.preventDefault(); MemoryScene.input(map[e.key]); }
  }
});

document.addEventListener('keyup', e => {
  if (GAME.scenes[GAME.step] === 'level3') {
    if (e.key === 'ArrowLeft')  VanScene.keys.left  = false;
    if (e.key === 'ArrowRight') VanScene.keys.right = false;
  }
});

/* ═══════════════════════════════════════════════════════════
   INIT al cargar el DOM
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Botón replay */
  document.getElementById('btn-replay').addEventListener('click', () => GAME.restart());

  GAME.init();
});
