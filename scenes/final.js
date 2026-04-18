/* ============================================================
   ESCENA: FINAL – CONFETI + PASTEL + MENSAJE
============================================================ */

const FinalScene = {
  raf:       null,
  particles: [],

  init() {
    const canvas = document.getElementById('canvas-confetti');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    this._spawnConfetti(canvas);
    this._animateConfetti(canvas);

    /* Animar el pastel */
    const cake = document.getElementById('final-cake');
    cake.style.animation = 'none';
    void cake.offsetWidth;
    cake.style.animation = '';
  },

  _spawnConfetti(canvas) {
    const colors = [
      '#FF6B6B', '#FFD700', '#51CF66', '#339AF0',
      '#CC5DE8', '#FF922B', '#F06595', '#74C0FC'
    ];
    this.particles = [];
    for (let i = 0; i < 130; i++) {
      this.particles.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height - canvas.height,
        r:     4 + Math.random() * 9,
        vy:    1.8 + Math.random() * 2.8,
        vx:    (Math.random() - 0.5) * 1.8,
        rot:   Math.random() * Math.PI * 2,
        rotV:  (Math.random() - 0.5) * 0.12,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.45 ? 'rect' : 'circle'
      });
    }
  },

  _animateConfetti(canvas) {
    if (this.raf) cancelAnimationFrame(this.raf);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of this.particles) {
        p.y   += p.vy;
        p.x   += p.vx;
        p.rot += p.rotV;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      this.raf = requestAnimationFrame(draw);
    };
    draw();
  }
};
