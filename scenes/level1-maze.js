/* ============================================================
   NIVEL 1 – LABERINTO (3 variantes, una más grande)
   Con audio en cada movimiento y al llegar a la salida
============================================================ */

const MazeScene = {

  MAZES: [
    /* Laberinto A – 15×13 */
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
    /* Laberinto B – 15×13 */
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
    ],
    /* Laberinto C – 17×15 (más grande y difícil) */
    [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1]
    ]
  ],

  canvas: null,
  ctx:    null,
  map:    null,
  player: { x:1, y:1 },
  cell:   28,

  init() {
    this.canvas = document.getElementById('canvas-maze');
    this.ctx    = this.canvas.getContext('2d');
    this.map    = this.MAZES[Math.floor(Math.random() * this.MAZES.length)];
    this.player = { x:1, y:1 };
    this._resize();
    this._setupTouch();
    this.draw();
    AUDIO.startMusic('level');
  },

  _resize() {
    const rows = this.map.length, cols = this.map[0].length;
    const maxW  = Math.min(window.innerWidth  - 28, 520);
    const maxH  = Math.min(window.innerHeight * 0.54, 440);
    this.cell   = Math.max(18, Math.floor(Math.min(maxW / cols, maxH / rows)));
    this.canvas.width  = cols * this.cell;
    this.canvas.height = rows * this.cell;
  },

  _setupTouch() {
    const dirs = { 'm-up':[0,-1], 'm-down':[0,1], 'm-left':[-1,0], 'm-right':[1,0] };
    Object.entries(dirs).forEach(([id, delta]) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const go = () => this.move(...delta);
      btn.addEventListener('touchstart', e => { e.preventDefault(); go(); }, { passive:false });
      btn.addEventListener('click', go);
    });
  },

  move(dx, dy) {
    const nx = this.player.x + dx, ny = this.player.y + dy;
    const row = this.map[ny];
    if (!row) return;
    const cell = row[nx];
    if (cell === undefined || cell === 1) return;

    AUDIO.click();
    this.player.x = nx;
    this.player.y = ny;
    this.draw();

    if (cell === 2) {
      AUDIO.levelComplete();
      setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 500);
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
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(x, y, cell, cell);
          ctx.fillStyle = '#5b21b6';
          ctx.fillRect(x+2, y+2, cell-4, cell-4);
        } else {
          ctx.fillStyle = '#f5f0ff';
          ctx.fillRect(x, y, cell, cell);
        }
        if (v === 2) {
          ctx.font = `${Math.floor(cell * 0.68)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⭐', x + cell/2, y + cell/2);
        }
      }
    }
    ctx.font = `${Math.floor(cell * 0.76)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧒', player.x * cell + cell/2, player.y * cell + cell/2);
  }
};
