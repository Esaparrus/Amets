/* ============================================================
   ESCENA: NIVEL 2 – RUNNER
   Personaje auto-corre, obstáculos vienen, salta con espacio
============================================================ */

const RunnerScene = {
  raf:  null,
  canvas: null,
  ctx:    null,

  W: 480, H: 200,
  GROUND: 148,

  p: null,       // jugadora
  obstacles: [], // obstáculos
  frame: 0,
  dist:  0,
  TARGET: 600,
  speed: 4.5,
  spawnEvery: 85,
  spawnCount: 0,
  running: false,

  init() {
    this.canvas = document.getElementById('canvas-runner');
    this.ctx    = this.canvas.getContext('2d');

    /* Canvas responsive */
    const scale = Math.min((window.innerWidth - 24) / this.W, 1);
    this.canvas.style.width  = Math.floor(this.W * scale) + 'px';
    this.canvas.style.height = Math.floor(this.H * scale) + 'px';
    this.canvas.width  = this.W;
    this.canvas.height = this.H;

    /* Botón saltar */
    const btn = document.getElementById('btn-jump');
    btn.ontouchstart = e => { e.preventDefault(); this.jump(); };
    btn.onclick      = () => this.jump();

    this._reset();
  },

  _reset() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.p = { x: 64, y: this.GROUND, vy: 0, onGround: true, size: 38 };
    this.obstacles  = [];
    this.frame      = 0;
    this.dist       = 0;
    this.speed      = 4.5;
    this.spawnEvery = 85;
    this.spawnCount = 0;
    this.running    = true;
    this._loop();
  },

  jump() {
    if (this.p && this.p.onGround) {
      this.p.vy = -13;
      this.p.onGround = false;
    }
  },

  _loop() {
    if (!this.running) return;
    this._update();
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  },

  _update() {
    const p = this.p;

    /* Gravedad */
    p.vy += 0.65;
    p.y  += p.vy;
    if (p.y >= this.GROUND) { p.y = this.GROUND; p.vy = 0; p.onGround = true; }

    this.frame++;
    this.dist++;
    /* Aumentar dificultad gradualmente */
    if (this.frame % 240 === 0) this.speed = Math.min(this.speed + 0.4, 9);
    if (this.frame % 300 === 0) this.spawnEvery = Math.max(45, this.spawnEvery - 5);

    /* Spawn obstáculos */
    this.spawnCount++;
    if (this.spawnCount >= this.spawnEvery) {
      this.spawnCount = 0;
      this.obstacles.push({ x: this.W + 20, w: 20, h: 30 + Math.floor(Math.random() * 20) });
    }

    /* Mover obstáculos */
    this.obstacles = this.obstacles.filter(o => { o.x -= this.speed; return o.x > -40; });

    /* Colisiones */
    const px = p.x + 6, py = p.y - p.size + 6, pw = p.size - 12, ph = p.size - 8;
    for (const o of this.obstacles) {
      const oy = this.GROUND - o.h + 2;
      if (px < o.x + o.w && px + pw > o.x && py < oy + o.h && py + ph > oy) {
        this.running = false;
        this._crash();
        return;
      }
    }

    /* Victoria */
    if (this.dist >= this.TARGET) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 500);
    }

    document.getElementById('runner-hud').textContent =
      `📏 ${Math.min(this.dist, this.TARGET)} / ${this.TARGET}`;
  },

  _crash() {
    cancelAnimationFrame(this.raf);
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(239,68,68,0.6)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Ups! 😅 Inténtalo de nuevo…', W / 2, H / 2);
    setTimeout(() => this._reset(), 1200);
  },

  _draw() {
    const { ctx, W, H, GROUND, p, obstacles, dist, TARGET } = this;

    /* Cielo degradado */
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#a5f3fc');
    sky.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    /* Sol */
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(W - 40, 34, 22, 0, Math.PI * 2);
    ctx.fill();

    /* Nubes decorativas */
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    const cx = W - ((this.frame * 0.4) % (W + 120));
    this._cloud(ctx, cx, 28, 50);
    this._cloud(ctx, cx - 200, 42, 36);

    /* Suelo */
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, GROUND + 38, W, H - GROUND);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, GROUND + 38, W, 5);

    /* Obstáculos (cactus) */
    for (const o of obstacles) {
      const oy = GROUND - o.h + 2;
      ctx.fillStyle = '#15803d';
      ctx.fillRect(o.x, oy, o.w, o.h);
      ctx.fillStyle = '#166534';
      ctx.fillRect(o.x - 9, oy + 8, 9, 12);
      ctx.fillRect(o.x + o.w, oy + 12, 9, 10);
    }

    /* Jugadora */
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🧒', p.x + p.size / 2, p.y + 38);

    /* Barra de progreso */
    const prog = Math.min(dist / TARGET, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(8, 8, W - 16, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(8, 8, (W - 16) * prog, 10);
  },

  _cloud(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 0.9, y - 6, r * 0.7, 0, Math.PI * 2);
    ctx.arc(x + r * 1.8, y, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
};
