/* ============================================================
   NIVEL 3 – FURGONETA  (más largo, más difícil, con audio)
   Target: 1000. Obstáculos más frecuentes y variados.
============================================================ */

const VanScene = {
  raf:  null,
  canvas: null,
  ctx:    null,

  W: 360, H: 480,
  ROAD_L: 65,
  ROAD_R: 295,

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
      el.addEventListener('touchstart', e => { e.preventDefault(); this.keys[key]=true; }, { passive:false });
      el.addEventListener('touchend',   e => { e.preventDefault(); this.keys[key]=false;}, { passive:false });
      el.addEventListener('mousedown', () => this.keys[key]=true);
      el.addEventListener('mouseup',   () => this.keys[key]=false);
    };
    bind('van-left-btn',  'left');
    bind('van-right-btn', 'right');
  },

  _reset() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.van       = { x:this.W/2-26, y:this.H-95, w:52, h:74 };
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

    if (this.keys.left  && v.x > this.ROAD_L + 5)         v.x -= 5.5;
    if (this.keys.right && v.x + v.w < this.ROAD_R - 5)   v.x += 5.5;

    this.frame++;
    this.dist++;
    if (this.frame % 180 === 0) this.speed = Math.min(this.speed + 0.55, 9.5);

    /* Spawn obstáculos más frecuentes en la segunda mitad */
    const spawnRate = this.dist > this.TARGET * 0.5 ? 44 : 55;
    if (this.frame % spawnRate === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 46;
      this.obstacles.push({
        x: this.ROAD_L + 5 + Math.floor(Math.random() * rw),
        y: -55, w: 40, h: 54
      });
      /* Doble obstáculo en la recta final */
      if (this.dist > this.TARGET * 0.7 && Math.random() < 0.4) {
        this.obstacles.push({
          x: this.ROAD_L + 5 + Math.floor(Math.random() * rw),
          y: -120, w: 36, h: 44
        });
      }
    }

    if (this.frame % 88 === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 34;
      this.stars.push({ x: this.ROAD_L + 5 + Math.floor(Math.random() * rw), y:-34, w:30, h:30 });
    }

    this.obstacles = this.obstacles.filter(o => { o.y += this.speed; return o.y < this.H + 65; });
    this.stars     = this.stars.filter(s     => { s.y += this.speed * 0.72; return s.y < this.H + 45; });

    /* Colisiones con obstáculos */
    for (const o of this.obstacles) {
      if (this._hit(v, o, 8)) {
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

    /* Hierba */
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0,0,W,H);

    /* Carretera */
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(ROAD_L, 0, ROAD_R - ROAD_L, H);

    /* Línea central */
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth   = 4;
    ctx.setLineDash([28,18]);
    ctx.lineDashOffset = -((this.frame * this.speed * 0.48) % 46);
    ctx.beginPath();
    ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Líneas de borde carretera */
    ctx.strokeStyle = 'white';
    ctx.lineWidth   = 3;
    ctx.setLineDash([20,14]);
    ctx.lineDashOffset = -((this.frame * this.speed * 0.48) % 34);
    ctx.beginPath();
    ctx.moveTo(ROAD_L, 0); ctx.lineTo(ROAD_L, H);
    ctx.moveTo(ROAD_R, 0); ctx.lineTo(ROAD_R, H);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Árboles laterales animados */
    const tg = 85;
    const to = (this.frame * this.speed * 0.5) % tg;
    for (let ty = -to; ty < H; ty += tg) {
      ctx.font = '26px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌳', ROAD_L/2, ty + 38);
      ctx.fillText('🌳', ROAD_R + (W-ROAD_R)/2, ty + 38);
    }

    /* Obstáculos */
    ctx.font = '42px serif';
    for (const o of obstacles) {
      ctx.textAlign = 'center';
      ctx.fillText('🌵', o.x + o.w/2, o.y + o.h);
    }

    /* Estrellas */
    ctx.font = '28px serif';
    for (const s of stars) {
      ctx.textAlign = 'center';
      ctx.fillText('⭐', s.x + s.w/2, s.y + s.h);
    }

    /* Furgoneta */
    ctx.font = '56px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🚐', v.x + v.w/2, v.y + v.h);

    /* Barra progreso */
    const prog = Math.min(this.dist / this.TARGET, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(8,8,W-16,10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(8,8,(W-16)*prog,10);
  }
};
