/* ============================================================
   BOSS 2 – COREÓGRAFA MÁGICA
   4 rondas: 3 → 4 → 5 → 6 flechas, con audio
============================================================ */

const MemoryScene = {
  DIRS:   ['left','up','down','right'],
  EMOJIS: { left:'⬅️', up:'⬆️', down:'⬇️', right:'➡️' },
  TOTAL_ROUNDS: 4,

  sequence:    [],
  playerInput: [],
  round:       1,
  showing:     false,
  accepting:   false,

  init() {
    this.round = 1;
    AUDIO.startMusic('boss');
    this._startRound();

    document.querySelectorAll('.arrow-btn').forEach(btn => {
      const go = () => {
        if (this.accepting) {
          AUDIO.click();
          this.input(btn.dataset.dir);
        }
      };
      btn.ontouchstart = e => { e.preventDefault(); go(); };
      btn.onclick = go;
    });
  },

  _startRound() {
    const len = 2 + this.round; // 3, 4, 5, 6
    this.sequence    = Array.from({ length: len }, () =>
      this.DIRS[Math.floor(Math.random() * 4)]);
    this.playerInput = [];
    this.showing     = true;
    this.accepting   = false;

    document.getElementById('boss2-subtitle').textContent =
      `Ronda ${this.round} de ${this.TOTAL_ROUNDS} — Memoriza ${len} pasos`;
    document.getElementById('boss2-feedback').innerHTML = '';
    document.getElementById('boss2-player').innerHTML   = '';
    this._renderRounds();
    this._showSequence();
  },

  _renderRounds() {
    document.getElementById('boss2-rounds').innerHTML =
      Array.from({ length: this.TOTAL_ROUNDS }, (_, i) =>
        `<span class="round-dot ${i < this.round ? 'done' : ''}">${i < this.round ? '⭐' : '○'}</span>`
      ).join('');
  },

  _showSequence() {
    const seqEl = document.getElementById('boss2-sequence');
    seqEl.innerHTML = '';
    this.sequence.forEach(dir => {
      const s = document.createElement('span');
      s.className   = 'mem-arrow';
      s.textContent = this.EMOJIS[dir];
      s.style.opacity = '0.18';
      seqEl.appendChild(s);
    });

    let i = 0;
    const next = () => {
      if (i > 0) {
        seqEl.children[i-1].classList.remove('lit');
        seqEl.children[i-1].style.opacity = '0.18';
      }
      if (i < this.sequence.length) {
        seqEl.children[i].classList.add('lit');
        seqEl.children[i].style.opacity = '1';
        AUDIO.blip();
        i++;
        setTimeout(next, 620);
      } else {
        setTimeout(() => {
          seqEl.innerHTML = this.sequence
            .map(() => '<span class="mem-arrow" style="opacity:0.4">❓</span>')
            .join('');
          this.showing   = false;
          this.accepting = true;
          document.getElementById('boss2-subtitle').textContent =
            '¡Ahora repite los pasos en orden! 💪';
        }, 450);
      }
    };
    setTimeout(next, 700);
  },

  input(dir) {
    if (!this.accepting) return;
    this.playerInput.push(dir);

    document.getElementById('boss2-player').innerHTML =
      this.playerInput.map(d =>
        `<span class="player-arrow">${this.EMOJIS[d]}</span>`
      ).join('');

    const idx = this.playerInput.length - 1;

    if (this.playerInput[idx] !== this.sequence[idx]) {
      this.accepting = false;
      AUDIO.wrong();
      document.getElementById('boss2-feedback').innerHTML =
        '<div class="feedback err">¡Equivocada! Repetimos esta ronda 💪</div>';
      setTimeout(() => this._startRound(), 1500);
      return;
    }

    if (this.playerInput.length === this.sequence.length) {
      this.accepting = false;
      AUDIO.correct();
      document.getElementById('boss2-feedback').innerHTML =
        `<div class="feedback ok">¡Perfecta ronda ${this.round}! 🎉</div>`;

      if (this.round >= this.TOTAL_ROUNDS) {
        AUDIO.levelComplete();
        setTimeout(() => { GAME.addCakePiece(); GAME.next(); }, 1400);
      } else {
        this.round++;
        setTimeout(() => this._startRound(), 1400);
      }
    }
  }
};
