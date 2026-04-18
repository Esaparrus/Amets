/* ============================================================
   ESCENA: NIVEL 1 – LABERINTO
   Top-down, 2 layouts aleatorios, canvas responsive
============================================================ */

const MazeScene = {

  /* 0=camino, 1=pared, 2=salida */
  MAZES: [
    [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
      [1,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,2,1]
    ],
    [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,2,1]
    ]
  ],

  canvas: null,
  ctx:    null,
  map:    null,
  player: { x: 1, y: 1 },
  cell:   30,

  init() {
    this.canvas = document.getElementById('canvas-maze');
    this.ctx    = this.canvas.getContext('2d');

    /* Elegir laberinto aleatorio */
    this.map    = this.MAZES[Math.floor(Math.random() * this.MAZES.length)];
    this.player = { x: 1, y: 1 };

    this._resize();
    this._setupTouch();
    this.draw();
  },

  _resize() {
    const rows = this.map.length;
    const cols = this.map[0].length;
    const maxW  = Math.min(window.innerWidth  - 32, 500);
    const maxH  = Math.min(window.innerHeight * 0.55, 420);
    this.cell   = Math.floor(Math.min(maxW / cols, maxH / rows));
    this.canvas.width  = cols * this.cell;
    this.canvas.height = rows * this.cell;
  },

  _setupTouch() {
    const map = { 'm-up':[0,-1], 'm-down':[0,1], 'm-left':[-1,0], 'm-right':[1,0] };
    Object.entries(map).forEach(([id, delta]) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const go = () => this.move(...delta);
      btn.addEventListener('touchstart', e => { e.preventDefault(); go(); }, { passive: false });
      btn.addEventListener('click', go);
    });
  },

  move(dx, dy) {
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;
    const row = this.map[ny];
    if (!row) return;
    const cell = row[nx];
    if (cell === undefined || cell === 1) return;

    this.player.x = nx;
    this.player.y = ny;
    this.draw();

    if (cell === 2) {
      setTimeout(() => {
        GAME.addCakePiece();
        GAME.next();
      }, 350);
    }
  },

  draw() {
    const { ctx, map, cell, player } = this;
    const rows = map.length, cols = map[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = map[r][c];
        const x = c * cell, y = r * cell;

        if (v === 1) {
          /* Pared */
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(x, y, cell, cell);
          ctx.fillStyle = '#5b21b6';
          ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
        } else {
          /* Camino */
          ctx.fillStyle = '#f5f0ff';
          ctx.fillRect(x, y, cell, cell);
        }

        if (v === 2) {
          /* Salida */
          ctx.font = `${cell * 0.7}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⭐', x + cell / 2, y + cell / 2);
        }
      }
    }

    /* Jugadora */
    ctx.font = `${cell * 0.78}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧒', player.x * cell + cell / 2, player.y * cell + cell / 2);
  }
};
