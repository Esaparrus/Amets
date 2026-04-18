/* ============================================================
   ESCENA: BOSS 1 – PREGUNTAS DE BALLET
   Matemáticas + idioma, 4 preguntas aleatorias
============================================================ */

const Boss1Scene = _makeQuizScene({
  screenId:     'boss1',
  fillId:       'boss1-fill',
  counterId:    'boss1-counter',
  questionId:   'boss1-question',
  answersId:    'boss1-answers',
  hintId:       'boss1-hint',
  feedbackId:   'boss1-feedback',
  categories:   ['matematicas', 'idioma'],
  numQuestions: 4,
  onComplete:   () => { GAME.addCakePiece(); GAME.next(); }
});

/* ── Factoría reutilizable para escenas de quiz ── */
function _makeQuizScene(cfg) {
  return {
    questions: [],
    current:   0,
    fails:     0,

    feedbackMessages: {
      ok:  ['¡Correcto! 🎉', '¡Muy bien, Amets! ✨', '¡Genial! 🌟', '¡Brillante! 💫'],
      err: ['Casi, inténtalo de nuevo 💪', 'Piensa un poco más… 🤔', 'No pasa nada, vuelve a intentarlo', '¡Tú puedes, Amets!']
    },

    init() {
      this.questions = getRandomQuestions(cfg.numQuestions, cfg.categories);
      this.current   = 0;
      this.fails     = 0;
      this._showQuestion();
    },

    _showQuestion() {
      const q     = this.questions[this.current];
      const total = this.questions.length;
      const pct   = (this.current / total) * 100;

      document.getElementById(cfg.fillId).style.width    = pct + '%';
      document.getElementById(cfg.counterId).textContent = `Pregunta ${this.current + 1} de ${total}`;
      document.getElementById(cfg.questionId).textContent = q.q;
      document.getElementById(cfg.hintId).classList.add('hidden');
      document.getElementById(cfg.feedbackId).innerHTML  = '';
      this.fails = 0;

      const list = document.getElementById(cfg.answersId);
      list.innerHTML = '';
      q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className   = 'btn-answer';
        btn.textContent = opt;
        btn.onclick     = () => this._answer(i, btn);
        list.appendChild(btn);
      });
    },

    _answer(idx, btn) {
      const q    = this.questions[this.current];
      const btns = document.querySelectorAll(`#${cfg.answersId} .btn-answer`);
      btns.forEach(b => b.disabled = true);

      if (idx === q.a) {
        btn.classList.add('correct');
        const total = this.questions.length;
        document.getElementById(cfg.fillId).style.width = ((this.current + 1) / total * 100) + '%';
        this._feedback('ok');
        setTimeout(() => this._next(), 1100);
      } else {
        btn.classList.add('wrong');
        this.fails++;
        this._feedback('err');

        if (this.fails >= 2) {
          const hintEl = document.getElementById(cfg.hintId);
          hintEl.classList.remove('hidden');
          hintEl.textContent = '💡 Pista: ' + q.hint;
        }

        if (this.fails >= 3) {
          this._feedback('ok', '¡Muy bien intentado! Seguimos… ➡️');
          setTimeout(() => this._next(), 1400);
          return;
        }

        setTimeout(() => {
          btns.forEach(b => { b.disabled = false; b.classList.remove('wrong', 'correct'); });
          document.getElementById(cfg.feedbackId).innerHTML = '';
        }, 850);
      }
    },

    _feedback(type, custom) {
      const msgs = this.feedbackMessages[type];
      const msg  = custom || msgs[Math.floor(Math.random() * msgs.length)];
      document.getElementById(cfg.feedbackId).innerHTML =
        `<div class="feedback ${type}">${msg}</div>`;
    },

    _next() {
      this.current++;
      if (this.current >= this.questions.length) {
        cfg.onComplete();
      } else {
        this._showQuestion();
      }
    }
  };
}
