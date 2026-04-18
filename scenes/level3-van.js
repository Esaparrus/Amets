/* ============================================================
   ESCENA: NIVEL 3 – FURGONETA
   Top-down, izquierda/derecha, esquivar árboles, recoger ⭐
============================================================ */

const VanScene = {
  raf:  null,
  canvas: null,
  ctx:    null,

  W: 360, H: 480,
  ROAD_L: 70,   // borde izq de la carretera
  ROAD_R: 290,  // borde dch

  van: null,
  obstacles: [],
  stars: [],
  keys: { left: false, right: false },
  frame: 0,
  dist:  0,
  score: 0,
  TARGET: 700,
  speed: 4,
  running: false,

  init() {
    this.canvas = document.getElementById('canvas-van');
    this.ctx    = this.canvas.getContext('2d');

    /* Canvas responsive */
    const maxH = window.innerHeight * 0.55;
    const scale = Math.min((window.innerWidth - 24) / this.W, maxH / this.H, 1);
    this.canvas.style.width  = Math.floor(this.W * scale) + 'px';
    this.canvas.style.height = Math.floor(this.H * scale) + 'px';
    this.canvas.width  = this.W;
    this.canvas.height = this.H;

    this._setupTouch();
    this._reset();
  },

  _setupTouch() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', e => { e.preventDefault(); this.keys[key] = true; }, { passive: false });
      el.addEventListener('touchend',  e => { e.preventDefault(); this.keys[key] = false; }, { passive: false });
      el.addEventListener('mousedown', () => this.keys[key] = true);
      el.addEventListener('mouseup',   () => this.keys[key] = false);
    };
    bind('van-left-btn',  'left');
    bind('van-right-btn', 'right');
  },

  _reset() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.van       = { x: this.W / 2 - 25, y: this.H - 90, w: 50, h: 70 };
    this.obstacles = [];
    this.stars     = [];
    this.frame     = 0;
    this.dist      = 0;
    this.score     = 0;
    this.speed     = 4;
    this.keys      = { left: false, right: false };
    this.running   = true;
    this._loop();
  },

  _loop() {
    if (!this.running) return;
    this._update();
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  },

  _update() {
    const v = this.van;

    /* Mover furgoneta */
    if (this.keys.left  && v.x > this.ROAD_L + 4)    v.x -= 5;
    if (this.keys.right && v.x + v.w < this.ROAD_R - 4) v.x += 5;

    this.frame++;
    this.dist++;
    if (this.frame % 200 === 0) this.speed = Math.min(this.speed + 0.5, 8.5);

    /* Spawn obstáculos */
    if (this.frame % 58 === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 44;
      this.obstacles.push({
        x: this.ROAD_L + 4 + Math.floor(Math.random() * rw),
        y: -50, w: 38, h: 50
      });
    }

    /* Spawn estrellas */
    if (this.frame % 90 === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 32;
      this.stars.push({ x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -30, w: 28, h: 28 });
    }

    /* Mover obstáculos */
    this.obstacles = this.obstacles.filter(o => { o.y += this.speed; return o.y < this.H + 60; });

    /* Mover estrellas */
    this.stars = this.stars.filter(s => { s.y += this.speed * 0.75; return s.y < this.H + 40; });

    /* Colisión obstáculos */
    for (const o of this.obstacles) {
      if (this._hit(v, o, 8)) {
        this.running = false;
        this._crash();
        return;
      }
    }

    /* Recoger estrellas */
    this.stars = this.stars.filter(s => {
      if (this._hit(v, s, 4)) { this.score++; return false; }
      return true;
    });

    /* Victoria */
    if (this.dist >= this.TARGET) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 500);
    }

    document.getElementById('van-hud').textContent =
      `⭐ ${this.score}  |  📏 ${Math.min(this.dist, this.TARGET)} / ${this.TARGET}`;
  },

  _hit(a, b, margin) {
    return (
      a.x + margin < b.x + b.w &&
      a.x + a.w - margin > b.x &&
      a.y + margin < b.y + b.h &&
      a.y + a.h - margin > b.y
    );
  },

  _crash() {
    cancelAnimationFrame(this.raf);
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(239,68,68,0.6)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Cuidado! 😅 Reiniciando…', W / 2, H / 2);
    setTimeout(() => this._reset(), 1200);
  },

  _draw() {
    const { ctx, W, H, van: v, obstacles, stars, ROAD_L, ROAD_R } = this;

    /* Hierba */
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, 0, W, H);

    /* Carretera */
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(ROAD_L, 0, ROAD_R - ROAD_L, H);

    /* Líneas de carretera */
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth   = 4;
    ctx.setLineDash([28, 18]);
    ctx.lineDashOffset = -((this.frame * this.speed * 0.5) % 46);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Árboles a los lados (decoración) */
    const treeGap = 90;
    const treeOff = (this.frame * this.speed * 0.5) % treeGap;
    for (let ty = -treeOff; ty < H; ty += treeGap) {
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌳', ROAD_L / 2, ty + 40);
      ctx.fillText('🌳', ROAD_R + (W - ROAD_R) / 2, ty + 40);
    }

    /* Obstáculos */
    ctx.font = '40px serif';
    for (const o of obstacles) {
      ctx.textAlign = 'center';
      ctx.fillText('🌵', o.x + o.w / 2, o.y + o.h);
    }

    /* Estrellas */
    ctx.font = '26px serif';
    for (const s of stars) {
      ctx.textAlign = 'center';
      ctx.fillText('⭐', s.x + s.w / 2, s.y + s.h);
    }

    /* Furgoneta */
    ctx.font = '54px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🚐', v.x + v.w / 2, v.y + v.h);

    /* Barra de progreso */
    const prog = Math.min(this.dist / this.TARGET, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(8, 8, W - 16, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(8, 8, (W - 16) * prog, 10);
  }
};
