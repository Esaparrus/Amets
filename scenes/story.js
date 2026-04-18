/* ============================================================
   ESCENA: STORY – Narrativa con personajes de la familia
   Cada capítulo se activa según GAME.step
============================================================ */

const CHARACTERS = {
  lumi:   { emoji: '🌟', name: 'Lumi',          color: '#fbbf24' },
  arai:   { emoji: '🌸', name: 'Arai (tu hermana mayor)', color: '#f472b6' },
  ainara: { emoji: '💜', name: 'Mamá Ainara',   color: '#a78bfa' },
  mara:   { emoji: '🐣', name: 'Mara (tu hermana pequeña)', color: '#34d399' },
  david:  { emoji: '⭐', name: 'Papá David',    color: '#60a5fa' }
};

/* Capítulos de historia, indexados por GAME.step cuando se llama a la escena */
const STORY_CHAPTERS = {

  /* ── Capítulo 1: Lumi presenta la aventura ── */
  1: [
    { char: 'lumi',
      text: "Amets, algo terrible ha pasado. El cumpleaños que tu mamá Ainara y tu papá David prepararon con tanto cariño… ¡ha desaparecido misteriosamente!" },
    { char: 'lumi',
      text: "Alguien lo ha dividido en seis piezas mágicas y las ha escondido por todo el camino. Sin ellas, no habrá pastel, ni velas, ni sorpresa." },
    { char: 'lumi',
      text: "Tu hermana mayor Arai entró al bosque a buscar pistas. Y la pequeña Mara no para de llorar. Necesitan que tú, la del medio, seas la más valiente de las tres." },
    { char: 'lumi',
      text: "Yo soy Lumi, tu guía mágica. Juntas superaremos laberintos, carreras, pruebas de memoria y retos que harán pensar a cualquiera. ¿Estás lista, Amets? 🌟" }
  ],

  /* ── Capítulo 2: Arai da una pista (tras el laberinto) ── */
  4: [
    { char: 'arai',
      text: "¡AMETS! Sabía que llegarías. Me metí en el bosque y encontré una nota de papá David debajo de una piedra." },
    { char: 'arai',
      text: "Dice: 'La primera pieza del pastel la guarda la Maestra de Ballet. Solo la entrega a quien demuestre que sabe pensar y resolver problemas difíciles. No vale adivinar.' "},
    { char: 'arai',
      text: "Yo lo intenté y me bloqueé con las matemáticas… pero tú siempre fuis mejor que yo en eso, aunque no te lo diga siempre. ¡Tú puedes, hermana! Y yo estaré esperándote aquí." }
  ],

  /* ── Capítulo 3: Ainara envía un mensaje (tras Boss 1) ── */
  6: [
    { char: 'ainara',
      text: "Amets, cariño, soy mamá. He visto cómo has superado la prueba de la Maestra de Ballet. Estoy tan orgullosa que se me han llenado los ojos de lágrimas." },
    { char: 'ainara',
      text: "La siguiente prueba es una carrera muy larga. Hay obstáculos en el camino encantado y tendrás que saltar sin parar. Recuerda lo que siempre te digo: cuando algo se pone difícil, respiras y sigues." },
    { char: 'ainara',
      text: "Papá David y yo lo tenemos todo preparado para cuando llegues al final. Te queremos con toda el alma. ¡Ánimo, mi niña valiente! 💜" }
  ],

  /* ── Capítulo 4: Mara aparece (tras Boss 2) ── */
  10: [
    { char: 'mara',
      text: "¡¡¡AMEEEETS!!! Soy Mara. ¿Ya casi lo tienes? ¡Yo quiero pastel de fresa! ¡Que no se olvide que es de fresa!" },
    { char: 'mara',
      text: "Mamá me dijo que no te distrajera pero… ¡quería decirte que eres la mejor hermana del mundo! Aunque a veces me quites la tablet y me hagas ver tus vídeos de ballet." },
    { char: 'david',
      text: "Mara, cariño, deja hablar a papá. Amets: la furgoneta está lista. El último tramo es el más difícil — el camino tiene muchos árboles y la velocidad va aumentando. Muévete bien y llegarás." },
    { char: 'lumi',
      text: "Esta es la última fase antes del enfrentamiento final. Todo lo que has aprendido en la aventura lo necesitarás ahora. ¡Vamos, Amets! 🌟" }
  ],

  /* ── Capítulo 5: Reunión familiar (tras Boss 3) ── */
  14: [
    { char: 'david',
      text: "¡Mi niña! Estoy aquí, al final del camino. He seguido cada uno de tus pasos y he visto lo que eres capaz de hacer cuando te lo propones." },
    { char: 'david',
      text: "Has resuelto problemas difíciles, has corrido sin rendirte, has memorizado secuencias complicadas y has respondido preguntas que no son fáciles. Eso, Amets, no lo hace cualquiera." },
    { char: 'ainara',
      text: "Eres la hija del medio, la que une a Arai y a Mara. La que siempre encuentra la manera. Hoy has demostrado que cuando te propones algo, no hay nada que te detenga." },
    { char: 'arai',
      text: "¡Lo sabía! Te lo dije que podías. Ahora no me lo eches en cara durante un año, ¿eh? Pero en serio… estoy muy orgullosa de ti, Amets." },
    { char: 'mara',
      text: "¡¡¡PASTELLLLL!!! Ah, y que sepas que eres mi hermana favorita. Pero eso no se lo digas a Arai." },
    { char: 'lumi',
      text: "¡El cumpleaños ha sido recuperado! Todas las piezas del pastel están juntas. Ha llegado el momento de celebrarlo. ¡Feliz cumpleaños, Amets! 🎂✨" }
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
    document.getElementById('story-avatar').textContent = char.emoji;
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
