/* ============================================================
   ESCENA: BOSS 2 – MEMORIA DE MOVIMIENTOS
   3 rondas: 3→4→5 flechas, secuencia aleatoria
============================================================ */

const MemoryScene = {
  DIRS: ['left', 'up', 'down', 'right'],
  EMOJIS: { left: '⬅️', up: '⬆️', down: '⬇️', right: '➡️' },

  sequence:    [],
  playerInput: [],
  round:       1,   // 1, 2, 3
  showing:     false,
  accepting:   false,

  init() {
    this.round = 1;
    this._startRound();

    /* Botones de input */
    document.querySelectorAll('.arrow-btn').forEach(btn => {
      const go = () => { if (this.accepting) this.input(btn.dataset.dir); };
      btn.ontouchstart = e => { e.preventDefault(); go(); };
      btn.onclick      = go;
    });
  },

  _startRound() {
    const len = 2 + this.round; // 3, 4, 5
    this.sequence    = Array.from({ length: len }, () => this.DIRS[Math.floor(Math.random() * 4)]);
    this.playerInput = [];
    this.showing     = true;
    this.accepting   = false;

    /* UI */
    document.getElementById('boss2-subtitle').textContent =
      `Ronda ${this.round} de 3 — Memoriza los ${len} pasos`;
    document.getElementById('boss2-feedback').innerHTML  = '';
    document.getElementById('boss2-player').innerHTML    = '';
    this._renderRounds();
    this._showSequence();
  },

  _renderRounds() {
    const el = document.getElementById('boss2-rounds');
    el.innerHTML = [1, 2, 3].map(r =>
      `<span>${r <= this.round ? '⭐' : '⬜'}</span>`
    ).join('');
  },

  _showSequence() {
    const seqEl = document.getElementById('boss2-sequence');
    seqEl.innerHTML = '';

    /* Crear todos los indicadores dim */
    this.sequence.forEach(dir => {
      const span = document.createElement('span');
      span.className   = 'mem-arrow';
      span.textContent = this.EMOJIS[dir];
      span.style.opacity = '0.2';
      seqEl.appendChild(span);
    });

    /* Iluminar uno por uno */
    let i = 0;
    const next = () => {
      if (i > 0) {
        seqEl.children[i - 1].classList.remove('lit');
        seqEl.children[i - 1].style.opacity = '0.2';
      }
      if (i < this.sequence.length) {
        seqEl.children[i].classList.add('lit');
        seqEl.children[i].style.opacity = '1';
        i++;
        setTimeout(next, 650);
      } else {
        /* Ocultar y esperar input */
        setTimeout(() => {
          seqEl.innerHTML = this.sequence
            .map(() => '<span class="mem-arrow" style="opacity:0.35">❓</span>')
            .join('');
          this.showing   = false;
          this.accepting = true;
          document.getElementById('boss2-subtitle').textContent = '¡Ahora repite los pasos! 💪';
        }, 400);
      }
    };
    setTimeout(next, 600);
  },

  input(dir) {
    if (!this.accepting || this.showing) return;
    this.playerInput.push(dir);

    /* Mostrar input del jugador */
    const playerEl = document.getElementById('boss2-player');
    playerEl.innerHTML = this.playerInput
      .map(d => `<span class="player-arrow">${this.EMOJIS[d]}</span>`)
      .join('');

    const idx = this.playerInput.length - 1;

    /* ¿Incorrecto? */
    if (this.playerInput[idx] !== this.sequence[idx]) {
      this.accepting = false;
      this._feedback('err', '¡Casi! Volvemos a intentar esta ronda 💪');
      setTimeout(() => this._startRound(), 1400);
      return;
    }

    /* ¿Secuencia completa? */
    if (this.playerInput.length === this.sequence.length) {
      this.accepting = false;
      this._feedback('ok', '¡Perfecto! 🎉');

      if (this.round >= 3) {
        setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 1200);
      } else {
        this.round++;
        setTimeout(() => this._startRound(), 1200);
      }
    }
  },

  _feedback(type, msg) {
    document.getElementById('boss2-feedback').innerHTML =
      `<div class="feedback ${type}">${msg}</div>`;
  }
};
