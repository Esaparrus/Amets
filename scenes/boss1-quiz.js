/* ============================================================
   BOSS 1 – MAESTRA DE BALLET  (y Boss 3 reutiliza _makeQuizScene)
   Preguntas difíciles, 5 por boss, audio integrado
============================================================ */

const Boss1Scene = _makeQuizScene({
  fillId:       'boss1-fill',
  counterId:    'boss1-counter',
  questionId:   'boss1-question',
  answersId:    'boss1-answers',
  hintId:       'boss1-hint',
  feedbackId:   'boss1-feedback',
  categories:   ['matematicas', 'idioma'],
  numQuestions: 5,
  musicTheme:   'boss',
  onComplete() { GAME.addCakePiece(); AUDIO.levelComplete(); setTimeout(() => GAME.next(), 1400); }
});

/* ════════════════════════════════════════════════════════════
   FACTORÍA REUTILIZABLE DE QUIZ
════════════════════════════════════════════════════════════ */
function _makeQuizScene(cfg) {
  return {
    questions: [],
    current:   0,
    fails:     0,

    okMsgs:  [
      '¡Correcto, Amets! 🎉', '¡Brillante! ✨',
      '¡Exacto! 🌟', '¡Muy bien pensado! 💫',
      '¡Eso es! 🏆', '¡Genial! 👏'
    ],
    errMsgs: [
      'Casi… piensa un poco más 🤔',
      'No pasa nada, vuelve a intentarlo 💪',
      'Hmm… revisa bien la pregunta',
      'Amets, casi lo tienes. ¡Tú puedes!',
      'Un error más y te doy una pista 😉'
    ],

    init() {
      this.questions = getRandomQuestions(cfg.numQuestions, cfg.categories);
      this.current   = 0;
      this.fails     = 0;
      AUDIO.startMusic(cfg.musicTheme || 'boss');
      this._showQuestion();
    },

    _showQuestion() {
      const q     = this.questions[this.current];
      const total = this.questions.length;

      document.getElementById(cfg.fillId).style.width =
        (this.current / total * 100) + '%';
      document.getElementById(cfg.counterId).textContent =
        `Pregunta ${this.current + 1} de ${total}`;
      document.getElementById(cfg.questionId).textContent = q.q;
      document.getElementById(cfg.hintId).classList.add('hidden');
      document.getElementById(cfg.feedbackId).innerHTML  = '';
      this.fails = 0;

      /* Opciones barajadas para evitar que siempre sea la misma posición */
      const shuffled = q.opts
        .map((text, origIdx) => ({ text, origIdx }))
        .sort(() => Math.random() - 0.5);

      const list = document.getElementById(cfg.answersId);
      list.innerHTML = '';
      shuffled.forEach(({ text, origIdx }) => {
        const btn = document.createElement('button');
        btn.className   = 'btn-answer';
        btn.textContent = text;
        btn.onclick     = () => this._answer(origIdx, btn, list);
        list.appendChild(btn);
      });
    },

    _answer(idx, btn, list) {
      const q    = this.questions[this.current];
      const btns = list.querySelectorAll('.btn-answer');
      btns.forEach(b => b.disabled = true);

      if (idx === q.a) {
        btn.classList.add('correct');
        AUDIO.correct();
        const total = this.questions.length;
        document.getElementById(cfg.fillId).style.width =
          ((this.current + 1) / total * 100) + '%';
        this._showFeedback('ok');
        setTimeout(() => this._next(), 1200);

      } else {
        btn.classList.add('wrong');
        AUDIO.wrong();
        this.fails++;
        this._showFeedback('err');

        if (this.fails >= 2) {
          const hintEl = document.getElementById(cfg.hintId);
          hintEl.classList.remove('hidden');
          hintEl.textContent = '💡 Pista: ' + q.hint;
        }

        if (this.fails >= 3) {
          this._showFeedback('ok', '¡Muy bien intentado! Seguimos… ➡️');
          setTimeout(() => this._next(), 1500);
          return;
        }

        setTimeout(() => {
          btns.forEach(b => { b.disabled = false; b.classList.remove('wrong','correct'); });
          document.getElementById(cfg.feedbackId).innerHTML = '';
        }, 900);
      }
    },

    _showFeedback(type, custom) {
      const msgs = type === 'ok' ? this.okMsgs : this.errMsgs;
      const msg  = custom || msgs[Math.floor(Math.random() * msgs.length)];
      document.getElementById(cfg.feedbackId).innerHTML =
        `<div class="feedback ${type}">${msg}</div>`;
    },

    _next() {
      this.current++;
      if (this.current >= this.questions.length) {
        cfg.onComplete.call(this);
      } else {
        this._showQuestion();
      }
    }
  };
}
