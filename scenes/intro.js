/* ============================================================
   ESCENA: INTRO
   Fondo animado con partículas + título + botón start
============================================================ */

const IntroScene = {
  raf: null,
  particles: [],

  init() {
    const canvas = document.getElementById('intro-bg');
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* Crear partículas (estrellas flotantes) */
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    1 + Math.random() * 3,
        vy:   -0.3 - Math.random() * 0.5,
        alpha: 0.3 + Math.random() * 0.7,
        emoji: Math.random() > 0.7 ? (Math.random() > 0.5 ? '⭐' : '✨') : null
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of this.particles) {
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

        if (p.emoji) {
          ctx.globalAlpha = p.alpha;
          ctx.font = `${p.r * 6}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      this.raf = requestAnimationFrame(loop);
    };
    loop();

    /* Botón start */
    const btn = document.getElementById('btn-start');
    btn.onclick = () => {
      AUDIO.init();
      AUDIO.click();
      AUDIO.startMusic('menu');
      GAME.next();
    };
  }
};
