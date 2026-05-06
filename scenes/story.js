/* ============================================================
   ESCENA: STORY – Narrativa con personajes de la familia
   Cada capítulo se activa según GAME.step
============================================================ */

const CHARACTERS = {
  lumi:   { emoji: '🌟', name: 'Lumi',                      color: '#fbbf24' },
  arai:   { emoji: '🌸', name: 'Arai (tu hermana mayor)',   color: '#f472b6' },
  ainara: { emoji: '💜', name: 'Mamá Ainara',               color: '#a78bfa' },
  mara:   { emoji: '🐣', name: 'Mara (tu hermana pequeña)', color: '#34d399' },
  david:  { emoji: '⭐', name: 'Papá David',                color: '#60a5fa' }
};

/* Capítulos de historia, indexados por GAME.step cuando se llama a la escena */
const STORY_CHAPTERS = {

  /* ── Capítulo 1: Crisis – el cumpleaños ha desaparecido ── */
  1: [
    { char: 'lumi',
      text: "¡Amets! Ha pasado algo terrible… El cumpleaños que prepararon tus padres ha desaparecido misteriosamente." },
    { char: 'ainara',
      text: "Cariño, llevamos horas buscando. Las decoraciones, el pastel, las velas… todo ha desaparecido. 😢" },
    { char: 'david',
      text: "Alguien lo ha dividido en seis piezas mágicas y las ha escondido por todo el camino. Sin ellas, no hay celebración." },
    { char: 'mara',
      text: "¡¡¡QUIERO MI PASTEL DE FRESA!!! 😭😭😭" },
    { char: 'lumi',
      text: "Soy Lumi, tu guía mágica. Solo tú puedes recuperarlo, Amets. ¡Eres la más valiente de las tres! ¿Estás lista? 🌟" }
  ],

  /* ── Capítulo 2: Arai da una pista (tras el laberinto) ── */
  4: [
    { char: 'arai',
      text: "¡AMETS! ¡Sabía que llegarías! Me metí en el bosque y encontré esto debajo de una piedra… es una nota de papá." },
    { char: 'david',
      text: "«La primera pieza la guarda la Maestra de Ballet. Solo la entrega a quien demuestre que sabe pensar. No vale adivinar.»" },
    { char: 'arai',
      text: "Yo lo intenté y me bloqueé con las mates… pero tú siempre fuiste mejor que yo en eso, aunque no te lo diga siempre 😅" },
    { char: 'ainara',
      text: "¡Tú puedes, cariño! Nosotros te esperamos aquí. ¡Ánimo! 💜" }
  ],

  /* ── Capítulo 3: Antes del runner (tras Boss 1) ── */
  6: [
    { char: 'ainara',
      text: "Amets… he visto cómo has superado a la Maestra de Ballet. ¡Estoy llorando de orgullo! 😭💜" },
    { char: 'david',
      text: "¡Eso es mi niña! Ahora viene una carrera larga por el camino encantado. Hay muchos obstáculos." },
    { char: 'arai',
      text: "Tienes que saltar sin parar, hermana. Y si te caes, te levantas. ¡Nosotros te vemos desde aquí!" },
    { char: 'ainara',
      text: "Recuerda lo que siempre te digo: cuando algo se pone difícil, respiras hondo… y sigues. 💜" }
  ],

  /* ── Capítulo 4: Antes de la furgoneta (tras Boss 2) ── */
  10: [
    { char: 'mara',
      text: "¡¡¡AMEEEETS!!! ¿Ya casi lo tienes? ¡¡Yo quiero pastel de fresa!! ¡Que no se olvide!" },
    { char: 'david',
      text: "Mara, cariño… Amets: la furgoneta está lista. Es el último tramo y el más difícil. Muévete bien." },
    { char: 'mara',
      text: "¡Eres la mejor hermana del mundo! Aunque a veces me haces enfadar cuando no me haces caso... ¡pero igualmente te quiero!" },
    { char: 'arai',
      text: "No le hagas caso, Amets. Tú céntrate. Esquiva los árboles y llega al final. ¡Puedes hacerlo!" },
    { char: 'lumi',
      text: "¡Última fase antes del gran reto final! Todo lo que has aprendido lo necesitarás ahora. ¡Vamos! 🌟" }
  ]
};

/* ════════════════════════════════════════════════════════════
   StoryScene
════════════════════════════════════════════════════════════ */
const StoryScene = {
  lines:   [],
  current: 0,
  typing:  false,

  init() {
    const chapter = STORY_CHAPTERS[GAME.step];
    if (!chapter) { GAME.next(); return; }

    this.lines   = chapter;
    this.current = 0;
    this.typing  = false;
    this._show();

    const btn = document.getElementById('btn-story-next');
    btn.onclick = () => { AUDIO.click(); this._next(); };

    AUDIO.startMusic('menu');
  },

  _show() {
    const line = this.lines[this.current];
    const char = CHARACTERS[line.char] || CHARACTERS.lumi;

    /* Avatar y nombre del personaje */
    const avatarEl = document.getElementById('story-avatar');
    avatarEl.innerHTML = '';
    const sz = Math.min(130, Math.floor(Math.min(window.innerWidth * 0.28, window.innerHeight * 0.22)));
    const imgEl = document.createElement('img');
    imgEl.src = `data/${line.char}.png`;
    imgEl.alt = char.name;
    imgEl.className = 'story-avatar-img';
    imgEl.style.borderColor = char.color;
    imgEl.onerror = () => {
      avatarEl.innerHTML = '';
      if (PORTRAITS && PORTRAITS[line.char]) {
        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = sz;
        cvs.className = 'story-avatar-img';
        cvs.style.borderColor = char.color;
        avatarEl.appendChild(cvs);
        PORTRAITS[line.char](cvs.getContext('2d'), sz, sz);
      } else {
        avatarEl.textContent = char.emoji;
      }
    };
    avatarEl.appendChild(imgEl);
    const nameEl = document.getElementById('story-name');
    nameEl.textContent  = char.name;
    nameEl.style.color  = char.color;

    /* Puntos de progreso */
    const dots = document.getElementById('story-dots');
    dots.innerHTML = this.lines.map((_, i) =>
      `<span class="${i === this.current ? 'dot active' : 'dot'}" style="${i === this.current ? 'background:' + char.color : ''}"></span>`
    ).join('');

    /* Botón */
    const btn = document.getElementById('btn-story-next');
    btn.textContent = this.current < this.lines.length - 1 ? 'Continuar →' : '¡Vamos! 🚀';

    /* Efecto de tipeo */
    const el  = document.getElementById('story-text');
    el.textContent = '';
    this.typing = true;
    let i = 0;
    const msg = line.text;
    const tick = () => {
      if (i < msg.length) {
        el.textContent += msg[i++];
        if (i % 3 === 0) AUDIO.blip();
        setTimeout(tick, 22);
      } else {
        this.typing = false;
      }
    };
    tick();
  },

  _next() {
    if (this.typing) {
      /* Terminar el texto de golpe */
      document.getElementById('story-text').textContent = this.lines[this.current].text;
      this.typing = false;
      return;
    }
    this.current++;
    if (this.current >= this.lines.length) {
      AUDIO.stopMusic();
      GAME.next();
    } else {
      this._show();
    }
  }
};
