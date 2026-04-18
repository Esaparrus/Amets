/* ============================================================
   ESCENA: BOSS 3 – PREGUNTAS MIXTAS (GUARDIÁN FINAL)
   5 preguntas de todas las categorías
============================================================ */

const Boss3Scene = _makeQuizScene({
  screenId:     'boss3',
  fillId:       'boss3-fill',
  counterId:    'boss3-counter',
  questionId:   'boss3-question',
  answersId:    'boss3-answers',
  hintId:       'boss3-hint',
  feedbackId:   'boss3-feedback',
  categories:   ['matematicas', 'idioma', 'cultura'],
  numQuestions: 5,
  onComplete:   () => { GAME.addCakePiece(); GAME.next(); }
});
