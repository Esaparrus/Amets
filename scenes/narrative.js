/* ============================================================
   ESCENA: NARRATIVA (Lumi habla)
   Secuencia de mensajes con tipeo animado
============================================================ */

const NarrativeScene = {
  messages: [
    "Hola, Amets. Soy Lumi, tu guía mágica. ✨",
    "Algo muy extraño ha pasado… Tu cumpleaños ha desaparecido.",
    "Alguien lo ha escondido detrás de retos y pruebas mágicas.",
    "Solo alguien valiente, lista y con mucho estilo puede recuperarlo.",
    "Tendrás que superar laberintos, carreras, retos de memoria y preguntas.",
    "¿Estás lista, Amets? ¡Tu cumpleaños te espera! 🎂"
  ],
  current: 0,
  typing: false,

  init() {
    this.current = 0;
    this.typing  = false;
    this._show();

    const btn = document.getElementById('btn-narrative-next');
    btn.onclick = () => this._next();
  },

  _show() {
    const el  = document.getElementById('narrative-text');
    const msg = this.messages[this.current];
    el.textContent = '';
    this.typing = true;

    let i = 0;
    const tick = () => {
      if (i < msg.length) {
        el.textContent += msg[i++];
        setTimeout(tick, 28);
      } else {
        this.typing = false;
      }
    };
    tick();

    const btn = document.getElementById('btn-narrative-next');
    btn.textContent = this.current < this.messages.length - 1 ? 'Continuar →' : '¡Vamos! 🚀';
  },

  _next() {
    if (this.typing) {
      /* Si aún escribe, terminar el texto de golpe */
      const el = document.getElementById('narrative-text');
      el.textContent = this.messages[this.current];
      this.typing = false;
      return;
    }

    this.current++;
    if (this.current >= this.messages.length) {
      GAME.next();
    } else {
      this._show();
    }
  }
};
