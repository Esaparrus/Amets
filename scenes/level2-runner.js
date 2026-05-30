/* ============================================================
   NIVEL 2 – RUNNER
   • Target: 1500 (más largo)
   • Pájaros que vuelan a media altura: ¡NO saltes para esquivarlos!
   • Advertencia visual cuando se acerca un pájaro
   • Fondo con paralaje (montañas + árboles)
============================================================ */

const RunnerScene = {
  raf: null,
  canvas: null,
  ctx:    null,
  _charImg: null,

  W: 520, H: 220,
  GROUND: 158,

  /* El pájaro vuela a esta altura (superior del hitbox) */
  BIRD_Y: 72,
  BIRD_H: 38,

  p:          null,
  obstacles:  [],
  frame:      0,
  dist:       0,
  TARGET:     1500,
  speed:      4.5,
  spawnEvery: 85,
  spawnCount: 0,
  running:    false,
  birdWarnedAt: -1,

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

    if (!this._charImg) {
      this._charImg = new Image();
      this._charImg.src = 'data/ametsjuegos.png';
    }
    AUDIO.startMusic('level');
    this._reset();
  },

  _reset() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.p = { x:64, y:this.GROUND, vy:0, onGround:true, size:40 };
    this.obstacles    = [];
    this.frame        = 0;
    this.dist         = 0;
    this.speed        = 4.5;
    this.spawnEvery   = 85;
    this.spawnCount   = 0;
    this.running      = true;
    this.birdWarnedAt = -1;
    this._loop();
  },

  jump() {
    if (this.p && this.p.onGround) {
      this.p.vy = -16;
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
    p.vy += 1.3;
    p.y  += p.vy;
    if (p.y >= this.GROUND) { p.y = this.GROUND; p.vy = 0; p.onGround = true; }

    this.frame++;
    this.dist++;

    /* Dificultad progresiva */
    if (this.frame % 200 === 0) this.speed      = Math.min(this.speed + 0.45, 10.5);
    if (this.frame % 240 === 0) this.spawnEvery = Math.max(40, this.spawnEvery - 4);

    /* Spawn obstáculos */
    this.spawnCount++;
    if (this.spawnCount >= this.spawnEvery) {
      this.spawnCount = 0;
      this._spawnObstacle();
    }

    /* Mover obstáculos */
    this.obstacles = this.obstacles.filter(o => { o.x -= this.speed; return o.x > -60; });

    /* Advertencia de pájaro */
    for (const o of this.obstacles) {
      if (o.type === 'bird' && o.x < 340 && this.birdWarnedAt !== o.id) {
        this.birdWarnedAt = o.id;
        AUDIO.birdWarning();
      }
    }

    /* Colisiones */
    const imgH = 76;
    const px = p.x + 8, py = p.y + 40 - imgH + 18, pw = 28, ph = imgH - 26;

    for (const o of this.obstacles) {
      let oy, oh;
      if (o.type === 'bird') {
        oy = this.BIRD_Y;
        oh = this.BIRD_H;
      } else {
        oy = this.GROUND + 40 - o.h;
        oh = o.h;
      }
      if (px < o.x + o.w - 4 && px + pw > o.x + 4 && py < oy + oh - 4 && py + ph > oy + 4) {
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
      `🏃 ${Math.min(this.dist, this.TARGET)} / ${this.TARGET}`;
  },

  _spawnObstacle() {
    /* Probabilidad de pájaro: 0% al inicio, sube hasta 35% */
    const birdChance = Math.min(0.35, (this.dist / this.TARGET) * 0.42);
    const isBird = Math.random() < birdChance;

    if (isBird) {
      this.obstacles.push({
        type: 'bird',
        id:   this.frame,
        x:    this.W + 20,
        w:    50,
        h:    this.BIRD_H
      });
    } else {
      const h = 26 + Math.floor(Math.random() * 30);
      this.obstacles.push({ type: 'cactus', x: this.W + 20, w: 22, h });
      /* Obstáculo doble en la segunda mitad */
      if (this.dist > this.TARGET * 0.5 && Math.random() < 0.32) {
        this.obstacles.push({ type: 'cactus', x: this.W + 95, w: 18, h: 22 + Math.floor(Math.random() * 22) });
      }
    }
  },

  _crash() {
    cancelAnimationFrame(this.raf);
    const { ctx, W, H } = this;
    ctx.fillStyle = 'rgba(220,38,38,0.65)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Ups! 😅  Reiniciando…', W/2, H/2);
    setTimeout(() => this._reset(), 1300);
  },

  _draw() {
    const { ctx, W, H, GROUND, p, obstacles, dist, TARGET, frame } = this;

    /* ── Cielo con degradado ── */
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#60a5fa');
    sky.addColorStop(0.6, '#bfdbfe');
    sky.addColorStop(1, '#dbeafe');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    /* ── Sol ── */
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = 'rgba(253,224,71,0.6)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(W - 48, 40, 26, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    /* ── Montañas lejanas (paralaje lento) ── */
    const mOffset = (frame * 0.22) % (W * 0.8);
    ctx.fillStyle = '#93c5fd';
    this._mountain(ctx, -mOffset + 10,  GROUND - 30, 140, 65);
    this._mountain(ctx, -mOffset + 200, GROUND - 20, 100, 48);
    this._mountain(ctx, -mOffset + 350, GROUND - 35, 160, 75);
    this._mountain(ctx, -mOffset + 540, GROUND - 25, 120, 55);
    this._mountain(ctx, -mOffset + 700, GROUND - 30, 145, 68);

    /* ── Árboles lejanos (paralaje medio) ── */
    const tOff = (frame * 0.55) % 100;
    ctx.fillStyle = '#22c55e';
    for (let tx = -tOff; tx < W + 10; tx += 100) {
      this._treeSmall(ctx, tx, GROUND - 10, 18);
      this._treeSmall(ctx, tx + 55, GROUND - 14, 22);
    }

    /* ── Suelo ── */
    const groundY = GROUND + 40;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, groundY, W, 5);

    /* Línea de carretera */
    ctx.fillStyle = '#bbf7d0';
    ctx.fillRect(0, groundY - 1, W, 2);

    /* ── Obstáculos ── */
    for (const o of obstacles) {
      if (o.type === 'bird') {
        this._drawBird(ctx, o, frame);
      } else {
        this._drawCactus(ctx, o, GROUND);
      }
    }

    /* ── Advertencia de pájaro ── */
    for (const o of obstacles) {
      if (o.type === 'bird' && o.x < 350 && o.x > 0) {
        /* Sombra en el suelo */
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.beginPath();
        ctx.ellipse(o.x + o.w/2, groundY - 1, o.w*0.55, 5, 0, 0, Math.PI*2);
        ctx.fill();

        /* Texto de advertencia */
        const alpha = Math.max(0, Math.min(1, (350 - o.x) / 200));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ ¡NO SALTES!', o.x + o.w/2, this.BIRD_Y - 10);
        ctx.restore();
      }
    }

    /* ── Personaje ── */
    const imgW = 44, imgH = 76;
    if (this._charImg && this._charImg.complete && this._charImg.naturalWidth > 0) {
      ctx.drawImage(this._charImg, p.x, p.y + 40 - imgH, imgW, imgH);
    } else {
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('🧒', p.x + p.size/2, p.y + 40);
    }

    /* ── Barra de progreso ── */
    const prog = Math.min(dist / TARGET, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(8, 8, W - 16, 12);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(8, 8, (W - 16) * prog, 12);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.floor(prog * 100)}%`, W/2, 14);
  },

  _drawCactus(ctx, o, GROUND) {
    const oy = GROUND + 40 - o.h;
    /* Sombra */
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(o.x + 4, GROUND + 38, o.w, 4);
    /* Cuerpo */
    ctx.fillStyle = '#166534';
    ctx.fillRect(o.x, oy, o.w, o.h);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(o.x + 2, oy + 2, 4, o.h - 4);
    /* Brazos */
    ctx.fillStyle = '#166534';
    ctx.fillRect(o.x - 9, oy + Math.floor(o.h * 0.28), 9, 11);
    ctx.fillRect(o.x + o.w, oy + Math.floor(o.h * 0.40), 9, 9);
  },

  _drawBird(ctx, o, frame) {
    const cx  = o.x + o.w / 2;
    const cy  = this.BIRD_Y + this.BIRD_H / 2;
    const flap = Math.sin(frame * 0.35) * 12; /* aleteo animado */

    ctx.save();
    ctx.translate(cx, cy);

    /* Sombra suave */
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(2, 4, o.w * 0.45, 6, 0, 0, Math.PI*2);
    ctx.fill();

    /* Ala izquierda */
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-o.w * 0.5, -flap, -o.w * 0.55, 6);
    ctx.quadraticCurveTo(-o.w * 0.25, 8, 0, 2);
    ctx.closePath();
    ctx.fill();

    /* Ala derecha */
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(o.w * 0.5, -flap, o.w * 0.55, 6);
    ctx.quadraticCurveTo(o.w * 0.25, 8, 0, 2);
    ctx.closePath();
    ctx.fill();

    /* Cuerpo */
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.ellipse(0, 3, o.w * 0.18, 7, 0, 0, Math.PI*2);
    ctx.fill();

    /* Cabeza */
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(o.w * 0.14, -2, 7, 0, Math.PI*2);
    ctx.fill();

    /* Pico */
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(o.w * 0.14 + 6, -2);
    ctx.lineTo(o.w * 0.14 + 14, -1);
    ctx.lineTo(o.w * 0.14 + 6, 2);
    ctx.closePath();
    ctx.fill();

    /* Ojo */
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(o.w * 0.14 + 2, -3, 2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(o.w * 0.14 + 2.5, -3, 1.2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  },

  _mountain(ctx, x, baseY, w, h) {
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + w/2, baseY - h);
    ctx.lineTo(x + w, baseY);
    ctx.closePath();
    ctx.fill();
  },

  _treeSmall(ctx, x, baseY, r) {
    ctx.beginPath();
    ctx.arc(x, baseY - r, r, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x - 2, baseY - 4, 4, 10);
    ctx.fillStyle = '#22c55e';
  },

  _cloud(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.arc(x + r * 0.9, y - 6, r * 0.7, 0, Math.PI*2);
    ctx.arc(x + r * 1.8, y, r * 0.8, 0, Math.PI*2);
    ctx.fill();
  }
};
