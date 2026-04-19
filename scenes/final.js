/* ============================================================
   ESCENA: FINAL – Conversación familiar → Celebración + Confeti
============================================================ */

const FinalScene = {
  raf:      null,
  particles:[],
  _idx:     0,
  _typing:  false,

  CONV: [
    { char:'david',
      name:'Papá David',
      color:'#60a5fa',
      text:"¡MI NIÑA! Lo has conseguido. He seguido cada uno de tus pasos desde el principio… y no puedo estar más orgulloso de ti, Amets. 💙" },
    { char:'ainara',
      name:'Mamá Ainara',
      color:'#a78bfa',
      text:"Cariño, has superado laberintos, carreras, pruebas de memoria y los retos más difíciles. Eres increíble. Te quiero con toda el alma. 💜" },
    { char:'arai',
      name:'Arai (tu hermana mayor)',
      color:'#f472b6',
      text:"Vale, admito que yo me quedé bloqueada en el laberinto… pero ¡sabía que tú lo conseguirías! Eres la más valiente de las tres. Y no se te suba a la cabeza, ¿eh? 🌸" },
    { char:'mara',
      name:'Mara (tu hermana pequeña)',
      color:'#34d399',
      text:"¡¡AMETSSSS!! ¡Ya está! ¡Ya está! Ahora PASTEL DE FRESA, ¡por favoooor! Ah… y eres mi hermana favorita. Pero no se lo cuentes a Arai. 🐣" },
    { char:'amets',
      name:'Amets',
      color:'#fbbf24',
      text:"Gracias a todos… Ha sido la aventura más difícil y más bonita de mi vida. ¡Os quiero muchísimo a todos! 💜🎂" },
    { char:'lumi',
      name:'Lumi',
      color:'#fde68a',
      text:"¡Y así, Amets recuperó el cumpleaños perdido y lo celebró rodeada de toda su familia! ¡Feliz cumpleaños, Amets! 🎂✨🌟" }
  ],

  init() {
    AUDIO.startMusic('final');
    this._idx    = 0;
    this._typing = false;

    document.getElementById('final-chat').style.display        = '';
    document.getElementById('final-celebration').style.display = 'none';

    document.getElementById('btn-final-next').onclick = () => {
      AUDIO.click();
      this._next();
    };

    this._showLine();
  },

  _showLine() {
    const line   = this.CONV[this._idx];
    const isLast = this._idx >= this.CONV.length - 1;

    /* ── Avatar ── */
    const avatarEl = document.getElementById('final-chat-avatar');
    avatarEl.innerHTML = '';
    const sz = Math.min(130, Math.floor(Math.min(window.innerWidth * 0.28, window.innerHeight * 0.22)));
    const imgEl = document.createElement('img');
    imgEl.src       = `data/${line.char}.png`;
    imgEl.alt       = line.name;
    imgEl.className = 'story-avatar-img';
    imgEl.style.borderColor = line.color;
    imgEl.onerror = () => {
      avatarEl.innerHTML = '';
      if (typeof PORTRAITS !== 'undefined' && PORTRAITS[line.char]) {
        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = sz;
        cvs.className = 'story-avatar-img';
        cvs.style.borderColor = line.color;
        avatarEl.appendChild(cvs);
        PORTRAITS[line.char](cvs.getContext('2d'), sz, sz);
      } else {
        avatarEl.textContent = '🎂';
      }
    };
    avatarEl.appendChild(imgEl);

    /* ── Nombre ── */
    const nameEl = document.getElementById('final-chat-name');
    nameEl.textContent = line.name;
    nameEl.style.color = line.color;

    /* ── Puntos de progreso ── */
    document.getElementById('final-chat-dots').innerHTML = this.CONV.map((_, i) =>
      `<span class="${i === this._idx ? 'dot active' : 'dot'}"
             style="${i === this._idx ? 'background:' + line.color : ''}"></span>`
    ).join('');

    /* ── Botón ── */
    document.getElementById('btn-final-next').textContent = isLast ? '¡Celebrar! 🎉' : 'Continuar →';

    /* ── Tipeo ── */
    const el = document.getElementById('final-chat-text');
    el.textContent = '';
    this._typing   = true;
    let i = 0;
    const msg = line.text;
    const tick = () => {
      if (i < msg.length) {
        el.textContent += msg[i++];
        if (i % 3 === 0) AUDIO.blip();
        setTimeout(tick, 22);
      } else {
        this._typing = false;
      }
    };
    tick();
  },

  _next() {
    if (this._typing) {
      document.getElementById('final-chat-text').textContent = this.CONV[this._idx].text;
      this._typing = false;
      return;
    }
    this._idx++;
    if (this._idx >= this.CONV.length) {
      this._celebrate();
    } else {
      this._showLine();
    }
  },

  _celebrate() {
    document.getElementById('final-chat').style.display        = 'none';
    document.getElementById('final-celebration').style.display = '';

    setTimeout(() => AUDIO.finalFanfare(), 300);

    const canvas = document.getElementById('canvas-confetti');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    this._spawnConfetti(canvas);
    this._animateConfetti(canvas);

    const cake = document.getElementById('final-cake');
    cake.style.animation = 'none';
    void cake.offsetWidth;
    cake.style.animation = '';
  },

  _spawnConfetti(canvas) {
    const colors = [
      '#FF6B6B','#FFD700','#51CF66','#339AF0',
      '#CC5DE8','#FF922B','#F06595','#74C0FC'
    ];
    this.particles = [];
    for (let i = 0; i < 130; i++) {
      this.particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height - canvas.height,
        r:    4 + Math.random() * 9,
        vy:   1.8 + Math.random() * 2.8,
        vx:   (Math.random() - 0.5) * 1.8,
        rot:  Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.12,
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
        p.y += p.vy; p.x += p.vx; p.rot += p.rotV;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = 0.9;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        } else {
          ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
      this.raf = requestAnimationFrame(draw);
    };
    draw();
  }
};
