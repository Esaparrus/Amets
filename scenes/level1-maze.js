/* ============================================================
   NIVEL 1 – LABERINTO (estilo Pokémon)
   • Generación procedural con recursive backtracker (DFS)
   • Garantiza UN SOLO camino con muchos callejones sin salida
   • 3 laberintos de dificultad creciente
============================================================ */

const MazeScene = {

  CONFIGS: [
    { cols: 13, rows: 11 },  // fácil
    { cols: 15, rows: 13 },  // medio
    { cols: 17, rows: 15 }   // difícil
  ],

  TOTAL_MAZES: 3,

  canvas:        null,
  ctx:           null,
  map:           null,
  player:        { x:1, y:1 },
  cell:          28,
  mazeLevel:     0,
  animFrame:     0,
  facing:        'down',
  transitioning: false,

  /* ── Generador de laberinto perfecto (recursive backtracker) ──
     Todas las celdas tienen coordenadas impares → son celdas visitables.
     Las celdas pares son muros entre celdas.
     Garantiza exactamente un camino entre cualquier par de celdas. */
  _generateMaze(cols, rows) {
    // cols y rows deben ser impares
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) grid[r][c] = 1;
    }

    const visited = [];
    for (let r = 0; r < rows; r++) { visited[r] = []; for (let c = 0; c < cols; c++) visited[r][c] = false; }

    const carve = (r, c) => {
      visited[r][c] = true;
      grid[r][c] = 0;
      // Directions (step 2 to reach next cell)
      const dirs = [[-2,0],[2,0],[0,-2],[0,2]];
      // Fisher-Yates shuffle
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && !visited[nr][nc]) {
          // Carve the wall between
          grid[r + dr/2][c + dc/2] = 0;
          carve(nr, nc);
        }
      }
    };

    carve(1, 1);

    // Salida siempre en la última celda impar (esquina inferior-derecha)
    const exitR = rows - 2, exitC = cols - 2;
    grid[exitR][exitC] = 2;

    return grid;
  },

  init() {
    this.canvas = document.getElementById('canvas-maze');
    this.ctx    = this.canvas.getContext('2d');
    this.mazeLevel     = 0;
    this.transitioning = false;
    this._loadMaze(0);
    this._setupTouch();
    AUDIO.startMusic('level');
  },

  _loadMaze(level) {
    const cfg  = this.CONFIGS[level % this.CONFIGS.length];
    this.map   = this._generateMaze(cfg.cols, cfg.rows);
    this.player    = { x:1, y:1 };
    this.animFrame = 0;
    this._resize();
    this.draw();
  },

  _resize() {
    const rows = this.map.length, cols = this.map[0].length;
    const maxW  = Math.min(window.innerWidth - 24, 520);
    const maxH  = Math.min(window.innerHeight * 0.52, 440);
    this.cell   = Math.max(20, Math.floor(Math.min(maxW / cols, maxH / rows)));
    this.canvas.width  = cols * this.cell;
    this.canvas.height = rows * this.cell;
  },

  _setupTouch() {
    const dirs = { 'm-up':[0,-1,'up'], 'm-down':[0,1,'down'], 'm-left':[-1,0,'left'], 'm-right':[1,0,'right'] };
    Object.entries(dirs).forEach(([id, args]) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const go = () => this.move(args[0], args[1], args[2]);
      btn.addEventListener('touchstart', e => { e.preventDefault(); go(); }, { passive:false });
      btn.addEventListener('click', go);
    });
  },

  move(dx, dy, dir) {
    if (this.transitioning) return;
    this.facing = dir || this.facing;
    const nx = this.player.x + dx, ny = this.player.y + dy;
    const row = this.map[ny];
    if (!row) return;
    const cell = row[nx];
    if (cell === undefined || cell === 1) return;

    this.player.x = nx;
    this.player.y = ny;
    this.animFrame++;
    AUDIO.click();
    this.draw();

    if (cell === 2) {
      this.transitioning = true;
      AUDIO.correct();

      if (this.mazeLevel >= this.TOTAL_MAZES - 1) {
        AUDIO.levelComplete();
        this._drawMessage('¡Bosque superado! 🎉');
        setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 1200);
      } else {
        this.mazeLevel++;
        this._drawMessage(`¡Laberinto ${this.mazeLevel} de ${this.TOTAL_MAZES} superado! 🌟`);
        setTimeout(() => {
          this.transitioning = false;
          this._loadMaze(this.mazeLevel);
        }, 1400);
      }
    }
  },

  _drawMessage(msg) {
    const { ctx, canvas } = this;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, canvas.height/2 - 32, canvas.width, 64);
    ctx.fillStyle = '#FFD700';
    ctx.font      = `bold ${Math.max(14, Math.floor(canvas.width/20))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, canvas.width/2, canvas.height/2);
  },

  draw() {
    const { ctx, map, cell } = this;
    const rows = map.length, cols = map[0].length;
    const C = this.cell;

    ctx.fillStyle = '#2d6a2d';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = map[r][c];
        const x = c * C, y = r * C;

        if (v === 1) {
          this._drawTree(ctx, x, y, C);
        } else {
          this._drawPath(ctx, x, y, C, r, c);
        }

        if (v === 2) {
          this._drawExit(ctx, x, y, C);
        }
      }
    }

    this._drawCharacter(ctx, this.player.x * C, this.player.y * C, C);
    this._drawHUD();
  },

  _drawTree(ctx, x, y, C) {
    ctx.fillStyle = '#1a3d1a';
    ctx.fillRect(x, y, C, C);

    ctx.fillStyle = '#1f6b1f';
    ctx.beginPath();
    ctx.arc(x + C*0.5, y + C*0.48, C*0.44, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#2d8a2d';
    ctx.beginPath();
    ctx.arc(x + C*0.46, y + C*0.40, C*0.28, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = 'rgba(100,200,80,0.25)';
    ctx.beginPath();
    ctx.arc(x + C*0.4, y + C*0.34, C*0.13, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#6b3a1f';
    ctx.fillRect(x + C*0.38, y + C*0.74, C*0.24, C*0.26);
  },

  _drawPath(ctx, x, y, C, r, c) {
    ctx.fillStyle = '#c8a96e';
    ctx.fillRect(x, y, C, C);

    ctx.fillStyle = 'rgba(120,90,50,0.12)';
    if ((r * 7 + c * 3) % 5 === 0) {
      ctx.beginPath();
      ctx.arc(x + C*0.3, y + C*0.35, C*0.07, 0, Math.PI*2);
      ctx.fill();
    }
    if ((r * 3 + c * 11) % 7 === 0) {
      ctx.beginPath();
      ctx.arc(x + C*0.7, y + C*0.65, C*0.05, 0, Math.PI*2);
      ctx.fill();
    }
  },

  _drawExit(ctx, x, y, C) {
    const t = Date.now() / 400;
    const glow = 0.5 + 0.5 * Math.sin(t);
    ctx.fillStyle = `rgba(255,215,0,${0.3 + glow * 0.25})`;
    ctx.fillRect(x, y, C, C);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + C*0.2, y + C*0.1, C*0.6, C*0.85);
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(x + C*0.23, y + C*0.13, C*0.54, C*0.79);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + C*0.65, y + C*0.55, C*0.07, 0, Math.PI*2);
    ctx.fill();

    ctx.font = `${Math.floor(C*0.38)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', x + C*0.5, y + C*0.06);
  },

  _drawCharacter(ctx, x, y, C) {
    const cx = x + C/2, cy = y + C/2;
    const s  = C * 0.36;
    const f  = Math.floor(this.animFrame / 2) % 2;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(0, s*0.62, s*0.45, s*0.16, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#1e40af';
    if (f === 0) {
      ctx.fillRect(-s*0.28, s*0.3, s*0.22, s*0.45);
      ctx.fillRect(s*0.06,  s*0.3, s*0.22, s*0.45);
    } else {
      ctx.fillRect(-s*0.35, s*0.22, s*0.22, s*0.48);
      ctx.fillRect(s*0.13,  s*0.38, s*0.22, s*0.45);
    }

    ctx.fillStyle = '#111827';
    if (f === 0) {
      ctx.fillRect(-s*0.3,  s*0.7,  s*0.26, s*0.14);
      ctx.fillRect(s*0.04,  s*0.7,  s*0.26, s*0.14);
    } else {
      ctx.fillRect(-s*0.37, s*0.65, s*0.26, s*0.14);
      ctx.fillRect(s*0.11,  s*0.78, s*0.26, s*0.14);
    }

    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(-s*0.42, -s*0.18, s*0.84, s*0.56, s*0.1);
    ctx.fill();

    ctx.fillStyle = '#5b21b6';
    ctx.fillRect(-s*0.42, s*0.2, s*0.84, s*0.08);

    ctx.fillStyle = '#7c3aed';
    if (f === 0) {
      ctx.fillRect(-s*0.62, -s*0.14, s*0.22, s*0.42);
      ctx.fillRect( s*0.4,  -s*0.14, s*0.22, s*0.42);
    } else {
      ctx.fillRect(-s*0.62, -s*0.24, s*0.22, s*0.42);
      ctx.fillRect( s*0.4,  -s*0.04, s*0.22, s*0.42);
    }

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-s*0.51, f === 0 ? s*0.3 : s*0.2, s*0.12, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s*0.51,  f === 0 ? s*0.3 : s*0.4, s*0.12, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-s*0.12, -s*0.28, s*0.24, s*0.14);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -s*0.58, s*0.36, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(0, -s*0.68, s*0.36, Math.PI*0.9, Math.PI*2.1);
    ctx.fill();
    ctx.fillRect(-s*0.36, -s*0.62, s*0.72, s*0.18);

    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(-s*0.12, -s*0.56, s*0.06, 0, Math.PI*2);
    ctx.arc( s*0.12, -s*0.56, s*0.06, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = '#92400e';
    ctx.lineWidth   = s*0.04;
    ctx.beginPath();
    ctx.arc(0, -s*0.46, s*0.1, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  },

  _drawHUD() {
    const { ctx, canvas, mazeLevel, TOTAL_MAZES } = this;
    const text = `🌿 Laberinto ${mazeLevel + 1} / ${TOTAL_MAZES}`;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(4, 4, 160, 24);
    ctx.fillStyle = '#FFD700';
    ctx.font      = `bold 13px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 10, 16);
  }
};
