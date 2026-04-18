/* ============================================================
   NIVEL 2 – RUNNER  (más largo y difícil, con audio)
   Target: 900. Velocidad y obstáculos crecen más rápido.
============================================================ */

const RunnerScene = {
  raf: null,
  canvas: null,
  ctx:    null,

  W: 500, H: 210,
  GROUND: 155,

  p:          null,
  obstacles:  [],
  frame:      0,
  dist:       0,
  TARGET:     900,
  speed:      4.8,
  spawnEvery: 80,
  spawnCount: 0,
  running:    false,
  canJump:    true,   // evita salto doble

  init() {
    this.canvas = document.getElementById('canvas-runner');
    this.ctx    = this.canvas.getContext('2d');

    const scale = Math.min((window.innerWidth - 24) / this.W, 1);
    this.canvas.style.width  = Math.floor(this.W * scale) + 'px';
    this.canvas.style.height = Math.floor(this.H * scale) + 'px';
    this.canvas.width  = this.W;
    this.canvas.height = this.H;

    const btn = document.getElementById('btn-jump');
    btn.ontouchstart = e => { e.preventDefault(); this.jump(); };
    btn.onclick      = () => this.jump();

    AUDIO.startMusic('level');
    this._reset();
  },

  _reset() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.p = { x:64, y:this.GROUND, vy:0, onGround:true, size:40 };
    this.obstacles  = [];
    this.frame      = 0;
    this.dist       = 0;
    this.speed      = 4.8;
    this.spawnEvery = 80;
    this.spawnCount = 0;
    this.running    = true;
    this._loop();
  },

  jump() {
    if (this.p && this.p.onGround) {
      this.p.vy = -14;
      this.p.onGround = false;
      AUDIO.jump();
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

    /* Física */
    p.vy += 0.7;
    p.y  += p.vy;
    if (p.y >= this.GROUND) { p.y = this.GROUND; p.vy = 0; p.onGround = true; }

    this.frame++;
    this.dist++;

    /* Dificultad progresiva más agresiva */
    if (this.frame % 180 === 0) this.speed      = Math.min(this.speed + 0.5, 10);
    if (this.frame % 220 === 0) this.spawnEvery = Math.max(38, this.spawnEvery - 4);

    /* Spawn obstáculos (a veces dobles) */
    this.spawnCount++;
    if (this.spawnCount >= this.spawnEvery) {
      this.spawnCount = 0;
      const h = 28 + Math.floor(Math.random() * 26);
      this.obstacles.push({ x: this.W + 20, w: 22, h });
      /* Probabilidad de obstáculo doble a mitad del camino */
      if (this.dist > this.TARGET * 0.5 && Math.random() < 0.35) {
        this.obstacles.push({ x: this.W + 90, w: 18, h: 22 + Math.floor(Math.random() * 20) });
      }
    }

    this.obstacles = this.obstacles.filter(o => { o.x -= this.speed; return o.x > -40; });

    /* Colisiones */
    const px = p.x + 7, py = p.y - p.size + 7, pw = p.size - 14, ph = p.size - 10;
    for (const o of this.obstacles) {
      const oy = this.GROUND - o.h + 2;
      if (px < o.x + o.w && px + pw > o.x && py < oy + o.h && py + ph > oy) {
        this.running = false;
        AUDIO.crash();
        this._crash();
        return;
      }
    }

    /* Victoria */
    if (this.dist >= this.TARGET) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      AUDIO.levelComplete();
      setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 600);
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
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Ups! 😅 Reiniciando…', W/2, H/2);
    setTimeout(() => this._reset(), 1300);
  },

  _draw() {
    const { ctx, W, H, GROUND, p, obstacles, dist, TARGET } = this;

    /* Cielo */
    const sky = ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#a5f3fc');
    sky.addColorStop(1,'#e0f2fe');
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,W,H);

    /* Sol */
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(W-45, 36, 24, 0, Math.PI*2);
    ctx.fill();

    /* Nubes */
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    const cx = W - ((this.frame * 0.38) % (W + 130));
    this._cloud(ctx, cx, 30, 52);
    this._cloud(ctx, cx - 220, 48, 38);
    this._cloud(ctx, cx + 160, 20, 30);

    /* Suelo */
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, GROUND + 40, W, H - GROUND);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, GROUND + 40, W, 5);

    /* Obstáculos */
    for (const o of obstacles) {
      const oy = GROUND - o.h + 2;
      ctx.fillStyle = '#15803d';
      ctx.fillRect(o.x, oy, o.w, o.h);
      ctx.fillStyle = '#166534';
      ctx.fillRect(o.x - 8, oy + 7, 8, 13);
      ctx.fillRect(o.x + o.w, oy + 12, 8, 10);
    }

    /* Jugadora */
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🧒', p.x + p.size/2, p.y + 40);

    /* Barra de progreso */
    const prog = Math.min(dist / TARGET, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(8,8,W-16,11);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(8,8,(W-16)*prog,11);
  },

  _cloud(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.arc(x+r*0.9, y-6, r*0.7, 0, Math.PI*2);
    ctx.arc(x+r*1.8, y, r*0.8, 0, Math.PI*2);
    ctx.fill();
  }
};
