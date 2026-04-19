/* ============================================================
   BOSS 3 – EL GRAN GUARDIÁN (preguntas mixtas, más difícil)
   Reutiliza _makeQuizScene definido en boss1-quiz.js
============================================================ */

const Boss3Scene = _makeQuizScene({
  fillId:       'boss3-fill',
  counterId:    'boss3-counter',
  questionId:   'boss3-question',
  answersId:    'boss3-answers',
  hintId:       'boss3-hint',
  feedbackId:   'boss3-feedback',
  categories:   ['matematicas', 'idioma', 'cultura', 'series'],
  numQuestions: 8,
  musicTheme:   'boss',
  onComplete() { GAME.addCakePiece(); AUDIO.levelComplete(); setTimeout(() => GAME.next(), 1400); }
});
