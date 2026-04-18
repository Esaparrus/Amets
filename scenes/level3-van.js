/* ============================================================
   NIVEL 3 – FURGONETA (top-down correcto)
   • Vista cenital: la furgoneta va hacia arriba (norte)
   • La furgoneta se dibuja como un vehículo desde arriba
   • El camino tiene carriles que bajan = sensación de avance
   • Controles: izquierda / derecha
============================================================ */

const VanScene = {
  raf:  null,
  canvas: null,
  ctx:    null,

  W: 360, H: 480,
  ROAD_L: 60,
  ROAD_R: 300,

  van:       null,
  obstacles: [],
  stars:     [],
  keys:      { left:false, right:false },
  frame:     0,
  dist:      0,
  score:     0,
  TARGET:    1000,
  speed:     4.2,
  running:   false,

  init() {
    this.canvas = document.getElementById('canvas-van');
    this.ctx    = this.canvas.getContext('2d');

    const maxH  = window.innerHeight * 0.54;
    const scale = Math.min((window.innerWidth - 24) / this.W, maxH / this.H, 1);
    this.canvas.style.width  = Math.floor(this.W * scale) + 'px';
    this.canvas.style.height = Math.floor(this.H * scale) + 'px';
    this.canvas.width  = this.W;
    this.canvas.height = this.H;

    this._setupTouch();
    AUDIO.startMusic('level');
    this._reset();
  },

  _setupTouch() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', e => { e.preventDefault(); this.keys[key]=true;  }, { passive:false });
      el.addEventListener('touchend',   e => { e.preventDefault(); this.keys[key]=false; }, { passive:false });
      el.addEventListener('mousedown', () => this.keys[key]=true);
      el.addEventListener('mouseup',   () => this.keys[key]=false);
    };
    bind('van-left-btn',  'left');
    bind('van-right-btn', 'right');
  },

  _reset() {
    if (this.raf) cancelAnimationFrame(this.raf);
    /* Van en el centro-inferior de la carretera */
    const roadW = this.ROAD_R - this.ROAD_L;
    const vanW  = 44, vanH = 68;
    this.van       = { x: this.ROAD_L + roadW/2 - vanW/2, y: this.H - vanH - 20, w: vanW, h: vanH };
    this.obstacles = [];
    this.stars     = [];
    this.frame     = 0;
    this.dist      = 0;
    this.score     = 0;
    this.speed     = 4.2;
    this.keys      = { left:false, right:false };
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

    /* Movimiento lateral */
    if (this.keys.left  && v.x > this.ROAD_L + 4)          v.x -= 5.5;
    if (this.keys.right && v.x + v.w < this.ROAD_R - 4)    v.x += 5.5;

    this.frame++;
    this.dist++;
    if (this.frame % 180 === 0) this.speed = Math.min(this.speed + 0.55, 9.5);

    /* Spawn obstáculos */
    const spawnRate = this.dist > this.TARGET * 0.5 ? 44 : 56;
    if (this.frame % spawnRate === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 46;
      this.obstacles.push({ x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -60, w: 38, h: 52 });
      if (this.dist > this.TARGET * 0.65 && Math.random() < 0.38) {
        this.obstacles.push({ x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -130, w: 34, h: 44 });
      }
    }

    /* Spawn estrellas */
    if (this.frame % 90 === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 32;
      this.stars.push({ x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -30, w: 28, h: 28 });
    }

    /* Mover hacia abajo (la van "avanza" hacia arriba) */
    this.obstacles = this.obstacles.filter(o => { o.y += this.speed; return o.y < this.H + 70; });
    this.stars     = this.stars.filter(s     => { s.y += this.speed * 0.72; return s.y < this.H + 45; });

    /* Colisiones obstáculos */
    for (const o of this.obstacles) {
      if (this._hit(v, o, 7)) {
        this.running = false;
        AUDIO.crash();
        this._crash();
        return;
      }
    }

    /* Recoger estrellas */
    this.stars = this.stars.filter(s => {
      if (this._hit(v, s, 4)) { this.score++; AUDIO.star(); return false; }
      return true;
    });

    /* Victoria */
    if (this.dist >= this.TARGET) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      AUDIO.levelComplete();
      setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 600);
    }

    document.getElementById('van-hud').textContent =
      `⭐ ${this.score}  |  📏 ${Math.min(this.dist, this.TARGET)} / ${this.TARGET}`;
  },

  _hit(a, b, m) {
    return a.x+m < b.x+b.w && a.x+a.w-m > b.x &&
           a.y+m < b.y+b.h && a.y+a.h-m > b.y;
  },

  _crash() {
    cancelAnimationFrame(this.raf);
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(239,68,68,0.62)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Cuidado! 😅 Reiniciando…', W/2, H/2);
    setTimeout(() => this._reset(), 1300);
  },

  _draw() {
    const { ctx, W, H, van:v, obstacles, stars, ROAD_L, ROAD_R } = this;
    const roadW = ROAD_R - ROAD_L;

    /* ── Hierba lateral ── */
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, 0, W, H);

    /* ── Carretera (gris) ── */
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(ROAD_L, 0, roadW, H);

    /* Bordes blancos de carretera */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ROAD_L, 0, 4, H);
    ctx.fillRect(ROAD_R - 4, 0, 4, H);

    /* ── Líneas discontinuas centrales (scroll hacia abajo = sensación de avance) ── */
    ctx.fillStyle = '#fbbf24';
    const dashH = 32, gapH = 20, total = dashH + gapH;
    const offset = (this.frame * this.speed * 0.55) % total;
    for (let yy = -total + offset; yy < H; yy += total) {
      ctx.fillRect(W/2 - 2, yy, 4, dashH);
    }

    /* ── Marcas kilométricas laterales (árboles a los lados, scrolling) ── */
    const treeGap = 80;
    const treeOff = (this.frame * this.speed * 0.5) % treeGap;
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    for (let ty = -treeOff; ty < H; ty += treeGap) {
      ctx.fillText('🌳', ROAD_L / 2,                  ty + 34);
      ctx.fillText('🌳', ROAD_R + (W - ROAD_R) / 2,  ty + 34);
    }

    /* ── Obstáculos (rocas / troncos caídos) ── */
    for (const o of obstacles) {
      this._drawObstacle(ctx, o);
    }

    /* ── Estrellas ── */
    ctx.font = '26px serif';
    for (const s of stars) {
      ctx.textAlign = 'center';
      ctx.fillText('⭐', s.x + s.w/2, s.y + s.h);
    }

    /* ── Furgoneta (dibujada desde arriba) ── */
    this._drawVan(ctx, v);

    /* ── Barra de progreso ── */
    const prog = Math.min(this.dist / this.TARGET, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(8, 8, W-16, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(8, 8, (W-16)*prog, 10);
  },

  /* Furgoneta dibujada desde arriba (vista cenital) */
  _drawVan(ctx, v) {
    const x = v.x, y = v.y, w = v.w, h = v.h;
    const r = 6; // border radius

    /* Carrocería principal */
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();

    /* Techo (zona central más clara) */
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(x+5, y+10, w-10, h-20, 3);
    ctx.fill();

    /* Parabrisas delantero (parte de arriba = frente) */
    ctx.fillStyle = 'rgba(186,230,253,0.85)';
    ctx.beginPath();
    ctx.roundRect(x+4, y+4, w-8, h*0.2, [3,3,0,0]);
    ctx.fill();

    /* Luneta trasera (parte de abajo) */
    ctx.fillStyle = 'rgba(186,230,253,0.6)';
    ctx.beginPath();
    ctx.roundRect(x+4, y+h-h*0.18, w-8, h*0.14, [0,0,3,3]);
    ctx.fill();

    /* Faros delanteros */
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(x+8,    y+6, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+w-8,  y+6, 4, 0, Math.PI*2); ctx.fill();

    /* Faros traseros (rojos) */
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(x+7,    y+h-6, 3.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+w-7,  y+h-6, 3.5, 0, Math.PI*2); ctx.fill();

    /* Ruedas */
    ctx.fillStyle = '#111827';
    const wr = 5, wh = 12;
    /* Delanteras */
    ctx.fillRect(x-3,   y+8,      wr, wh);
    ctx.fillRect(x+w-2, y+8,      wr, wh);
    /* Traseras */
    ctx.fillRect(x-3,   y+h-wh-8, wr, wh);
    ctx.fillRect(x+w-2, y+h-wh-8, wr, wh);

    /* Sombra sutil */
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.stroke();
  },

  /* Obstáculo: roca / tronco caído */
  _drawObstacle(ctx, o) {
    const x = o.x, y = o.y, w = o.w, h = o.h;

    /* Sombra */
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x+w/2+3, y+h/2+3, w/2, h/2*0.6, 0, 0, Math.PI*2);
    ctx.fill();

    /* Roca (gris) */
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.ellipse(x+w/2, y+h/2, w/2, h/2*0.7, 0, 0, Math.PI*2);
    ctx.fill();

    /* Detalle roca */
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.ellipse(x+w/2-4, y+h/2-4, w/5, h/6, -0.4, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x+w/2, y+h/2, w/2, h/2*0.7, 0, 0, Math.PI*2);
    ctx.stroke();
  }
};
