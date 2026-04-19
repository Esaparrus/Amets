/* ============================================================
   NIVEL 3 – FURGONETA (carretera mágica)
   • Gana cuando recoge 10 estrellas (no por distancia)
   • Sonido ambiental de carretera (motor + viento)
   • Obstáculos variados (rocas y conos)
   • Vista cenital, controles izquierda/derecha
============================================================ */

const VanScene = {
  raf:  null,
  canvas: null,
  ctx:    null,

  W: 360, H: 480,
  ROAD_L: 58,
  ROAD_R: 302,

  STAR_TARGET: 10,

  van:       null,
  obstacles: [],
  stars:     [],
  keys:      { left:false, right:false },
  frame:     0,
  dist:      0,
  score:     0,
  speed:     4.0,
  running:   false,

  init() {
    this.canvas = document.getElementById('canvas-van');
    this.ctx    = this.canvas.getContext('2d');

    const maxH  = window.innerHeight * 0.55;
    const scale = Math.min((window.innerWidth - 24) / this.W, maxH / this.H, 1);
    this.canvas.style.width  = Math.floor(this.W * scale) + 'px';
    this.canvas.style.height = Math.floor(this.H * scale) + 'px';
    this.canvas.width  = this.W;
    this.canvas.height = this.H;

    this._setupTouch();
    /* Música de fondo + ambiente de carretera */
    AUDIO.startMusic('level');
    AUDIO.startAmbient('road');
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
    const roadW = this.ROAD_R - this.ROAD_L;
    const vanW  = 44, vanH = 68;
    this.van       = { x: this.ROAD_L + roadW/2 - vanW/2, y: this.H - vanH - 20, w: vanW, h: vanH };
    this.obstacles = [];
    this.stars     = [];
    this.frame     = 0;
    this.dist      = 0;
    this.score     = 0;
    this.speed     = 4.0;
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

    if (this.keys.left  && v.x > this.ROAD_L + 4)          v.x -= 5.5;
    if (this.keys.right && v.x + v.w < this.ROAD_R - 4)    v.x += 5.5;

    this.frame++;
    this.dist++;
    /* Velocidad aumenta con las estrellas recogidas */
    const progress = this.score / this.STAR_TARGET;
    this.speed = 4.0 + progress * 5.5;

    /* Spawn obstáculos — más frecuentes al aumentar puntuación */
    const spawnRate = Math.max(38, 60 - Math.floor(progress * 22));
    if (this.frame % spawnRate === 0) {
      const rw = this.ROAD_R - this.ROAD_L - 46;
      const obsType = Math.random() < 0.4 ? 'cone' : 'rock';
      this.obstacles.push({ type: obsType, x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -60, w: 36, h: 48 });
      /* Par de obstáculos en la segunda mitad */
      if (this.score >= 5 && Math.random() < 0.40) {
        this.obstacles.push({ type: 'rock', x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -130, w: 32, h: 42 });
      }
    }

    /* Spawn estrellas */
    if (this.frame % 80 === 0 && this.score < this.STAR_TARGET) {
      const rw = this.ROAD_R - this.ROAD_L - 32;
      this.stars.push({ x: this.ROAD_L + 4 + Math.floor(Math.random() * rw), y: -30, w: 28, h: 28 });
    }

    this.obstacles = this.obstacles.filter(o => { o.y += this.speed; return o.y < this.H + 80; });
    this.stars     = this.stars.filter(s     => { s.y += this.speed * 0.72; return s.y < this.H + 50; });

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
      if (this._hit(v, s, 4)) {
        this.score++;
        AUDIO.star();
        return false;
      }
      return true;
    });

    /* Victoria al llegar a STAR_TARGET estrellas */
    if (this.score >= this.STAR_TARGET) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      AUDIO.levelComplete();
      setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 700);
    }

    document.getElementById('van-hud').textContent =
      `⭐ ${this.score} / ${this.STAR_TARGET}  –  ¡Recoge todas!`;
  },

  _hit(a, b, m) {
    return a.x+m < b.x+b.w && a.x+a.w-m > b.x &&
           a.y+m < b.y+b.h && a.y+a.h-m > b.y;
  },

  _crash() {
    cancelAnimationFrame(this.raf);
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(220,38,38,0.65)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 21px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Cuidado! 😅  Reiniciando…', W/2, H/2);
    setTimeout(() => this._reset(), 1400);
  },

  _draw() {
    const { ctx, W, H, van:v, obstacles, stars, ROAD_L, ROAD_R, frame } = this;
    const roadW = ROAD_R - ROAD_L;

    /* ── Hierba con textura ── */
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 0, W, H);
    /* Rayas de hierba que se mueven */
    ctx.fillStyle = 'rgba(22,163,74,0.6)';
    const gOff = (frame * this.speed * 0.35) % 60;
    for (let gy = -gOff; gy < H; gy += 60) {
      ctx.fillRect(0,         gy,      ROAD_L, 28);
      ctx.fillRect(ROAD_R,    gy,      W - ROAD_R, 28);
    }

    /* ── Carretera ── */
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(ROAD_L, 0, roadW, H);

    /* Sombra bordes carretera */
    const edgeShadow = ctx.createLinearGradient(ROAD_L, 0, ROAD_L + 16, 0);
    edgeShadow.addColorStop(0, 'rgba(0,0,0,0.25)');
    edgeShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = edgeShadow;
    ctx.fillRect(ROAD_L, 0, 16, H);
    const edgeShadow2 = ctx.createLinearGradient(ROAD_R - 16, 0, ROAD_R, 0);
    edgeShadow2.addColorStop(0, 'rgba(0,0,0,0)');
    edgeShadow2.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = edgeShadow2;
    ctx.fillRect(ROAD_R - 16, 0, 16, H);

    /* Bordes blancos carretera */
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(ROAD_L,     0, 5, H);
    ctx.fillRect(ROAD_R - 5, 0, 5, H);

    /* Líneas centrales discontinuas */
    ctx.fillStyle = '#fbbf24';
    const dashH = 34, gapH = 22, total = dashH + gapH;
    const offset = (frame * this.speed * 0.52) % total;
    for (let yy = -total + offset; yy < H; yy += total) {
      ctx.fillRect(W/2 - 2.5, yy, 5, dashH);
    }

    /* ── Árboles laterales (scrolling) ── */
    const treeGap = 90;
    const treeOff = (frame * this.speed * 0.5) % treeGap;
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    for (let ty = -treeOff; ty < H; ty += treeGap) {
      ctx.fillText('🌳', ROAD_L / 2,               ty + 38);
      ctx.fillText('🌲', ROAD_R + (W - ROAD_R) / 2, ty + 20);
      ctx.fillText('🌳', ROAD_R + (W - ROAD_R) / 2, ty + 70);
    }

    /* ── Obstáculos ── */
    for (const o of obstacles) {
      if (o.type === 'cone') this._drawCone(ctx, o);
      else                   this._drawRock(ctx, o);
    }

    /* ── Estrellas ── */
    ctx.font = '24px serif';
    for (const s of stars) {
      /* Brillo pulsante */
      const glow = 0.6 + 0.4 * Math.sin(frame * 0.15 + s.x);
      ctx.globalAlpha = glow;
      ctx.textAlign = 'center';
      ctx.fillText('⭐', s.x + s.w/2, s.y + s.h);
      ctx.globalAlpha = 1;
    }

    /* ── Furgoneta ── */
    this._drawVan(ctx, v, frame);

    /* ── Panel de progreso (barra de estrellas) ── */
    this._drawStarBar(ctx);
  },

  _drawStarBar(ctx) {
    const { W, score, STAR_TARGET } = this;
    const barW = W - 16, barH = 14;
    const prog = score / STAR_TARGET;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(8, 8, barW, barH);
    const barGrad = ctx.createLinearGradient(8, 0, 8 + barW * prog, 0);
    barGrad.addColorStop(0, '#f59e0b');
    barGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = barGrad;
    ctx.fillRect(8, 8, barW * prog, barH);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`⭐ ${score} / ${STAR_TARGET}`, W / 2, 8 + barH / 2);
  },

  _drawVan(ctx, v, frame) {
    const x = v.x, y = v.y, w = v.w, h = v.h;
    const r = 6;

    /* Sombra */
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(x + w/2 + 3, y + h/2 + 5, w*0.48, h*0.25, 0, 0, Math.PI*2);
    ctx.fill();

    /* Carrocería */
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();

    /* Techo */
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(x + 5, y + 10, w - 10, h - 20, 3);
    ctx.fill();

    /* Parabrisas delantero */
    ctx.fillStyle = 'rgba(186,230,253,0.88)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 4, w - 8, h * 0.21, [3,3,0,0]);
    ctx.fill();

    /* Luneta trasera */
    ctx.fillStyle = 'rgba(186,230,253,0.62)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + h - h * 0.19, w - 8, h * 0.15, [0,0,3,3]);
    ctx.fill();

    /* Línea lateral decorativa */
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x + 3, y + h * 0.42, w - 6, 3);

    /* Faros delanteros (parpadeantes) */
    const lit = Math.floor(frame / 8) % 2 === 0;
    ctx.fillStyle = lit ? '#fef9c3' : '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = lit ? 8 : 3;
    ctx.beginPath(); ctx.arc(x + 8,   y + 7, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w-8, y + 7, 4, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    /* Faros traseros */
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(x + 7,   y + h - 7, 3.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w-7, y + h - 7, 3.5, 0, Math.PI*2); ctx.fill();

    /* Ruedas */
    ctx.fillStyle = '#1f2937';
    const wr = 5, wh = 13;
    ctx.fillRect(x - 4,   y + 9,       wr, wh);
    ctx.fillRect(x + w-1, y + 9,       wr, wh);
    ctx.fillRect(x - 4,   y + h-wh-9,  wr, wh);
    ctx.fillRect(x + w-1, y + h-wh-9,  wr, wh);

    /* Borde */
    ctx.strokeStyle = 'rgba(0,0,0,0.28)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.stroke();
  },

  _drawRock(ctx, o) {
    const x = o.x, y = o.y, w = o.w, h = o.h;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(x + w/2 + 3, y + h/2 + 4, w/2, h * 0.28, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h/2, w/2, h/2*0.72, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.ellipse(x + w/2 - 4, y + h/2 - 5, w/5, h/6, -0.4, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h/2, w/2, h/2*0.72, 0, 0, Math.PI*2);
    ctx.stroke();
  },

  _drawCone(ctx, o) {
    const x = o.x, y = o.y, w = o.w, h = o.h;
    /* Cono de obra (naranja con banda blanca) */
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath();
    ctx.ellipse(x + w/2 + 2, y + h + 3, w * 0.42, 5, 0, 0, Math.PI*2);
    ctx.fill();
    /* Base */
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h, w * 0.42, 5, 0, 0, Math.PI*2);
    ctx.fill();
    /* Cuerpo naranja */
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(x + w/2, y);
    ctx.lineTo(x + w * 0.85, y + h);
    ctx.lineTo(x + w * 0.15, y + h);
    ctx.closePath();
    ctx.fill();
    /* Banda blanca */
    ctx.fillStyle = 'white';
    ctx.beginPath();
    const band = h * 0.32;
    const bw1 = w * 0.18, bw2 = w * 0.62;
    ctx.moveTo(x + w/2 - bw1/2, y + band);
    ctx.lineTo(x + w/2 + bw1/2, y + band);
    ctx.lineTo(x + w/2 + bw2/2, y + band + h * 0.18);
    ctx.lineTo(x + w/2 - bw2/2, y + band + h * 0.18);
    ctx.closePath();
    ctx.fill();
  }
};
