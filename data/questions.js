/* ============================================================
   BANCO DE PREGUNTAS v4
   – Inglés simplificado (nivel 9 años)
   – Matemáticas nivel 9-10 años
   – Cultura general + Navarra + Arazuri
   – Series / seguir la secuencia (nuevo)
============================================================ */

const QUESTIONS = {

  matematicas: [
    {
      q: "Si un pastel se divide en 8 partes iguales y Amets come 3, ¿qué fracción queda?",
      opts: ["3/8", "5/8", "4/8"],
      a: 1,
      hint: "Empieza con 8 partes y quita las 3 que comió: 8 – 3 = ?"
    },
    {
      q: "Un tren viaja a 80 km/h. En 3 horas, ¿cuántos kilómetros recorre?",
      opts: ["160 km", "240 km", "320 km"],
      a: 1,
      hint: "Multiplica velocidad × tiempo: 80 × 3 = ?"
    },
    {
      q: "¿Cuánto es 144 ÷ 12?",
      opts: ["11", "14", "12"],
      a: 2,
      hint: "¿Cuántas veces cabe el 12 en 144?"
    },
    {
      q: "Si el 25% de los globos son rojos y hay 40 globos, ¿cuántos son rojos?",
      opts: ["8", "10", "12"],
      a: 1,
      hint: "El 25% es la cuarta parte: 40 ÷ 4 = ?"
    },
    {
      q: "Arai tiene el doble de años que Mara. Mara tiene 7 años. ¿Cuántos años tienen entre las dos?",
      opts: ["19", "21", "18"],
      a: 1,
      hint: "Arai tiene 7×2=14. Suma: 14 + 7 = ?"
    },
    {
      q: "¿Cuánto es 37 + 58?",
      opts: ["94", "95", "85"],
      a: 1,
      hint: "Suma unidades: 7+8=15. Lleva 1. Decenas: 3+5+1=9. Resultado: 95"
    },
    {
      q: "Si haces 12 giros en 3 minutos, ¿cuántos giros haces en 7 minutos?",
      opts: ["24", "28", "30"],
      a: 1,
      hint: "Giros por minuto: 12÷3=4. Luego: 4×7=?"
    },
    {
      q: "¿Cuánto mide el perímetro de un cuadrado con lados de 9 cm?",
      opts: ["27 cm", "36 cm", "81 cm"],
      a: 1,
      hint: "Un cuadrado tiene 4 lados iguales: 9 × 4 = ?"
    },
    {
      q: "Un libro tiene 180 páginas. Amets lee 15 por día. ¿En cuántos días termina?",
      opts: ["10", "12", "15"],
      a: 1,
      hint: "Divide el total entre lo que lee por día: 180 ÷ 15 = ?"
    },
    {
      q: "¿Cuánto es 8² (8 al cuadrado)?",
      opts: ["16", "56", "64"],
      a: 2,
      hint: "Un número al cuadrado se multiplica por sí mismo: 8 × 8 = ?"
    },
    {
      q: "Si en la furgoneta de David caben 7 personas y van 4 familias de 1, 2, 2 y 3 personas, ¿caben todas?",
      opts: ["No, son 8", "Sí, son 7", "No, son 9"],
      a: 0,
      hint: "Suma: 1 + 2 + 2 + 3 = ?"
    },
    {
      q: "En una clase hay 30 alumnos. El 60% saca notable. ¿Cuántos alumnos sacaron notable?",
      opts: ["15", "18", "20"],
      a: 1,
      hint: "El 60% de 30: 30 × 0.6 = ?, o también 30 ÷ 10 × 6 = ?"
    },
    {
      q: "¿Cuánto es el área de un rectángulo de 7 cm de largo y 4 cm de ancho?",
      opts: ["22 cm²", "28 cm²", "11 cm²"],
      a: 1,
      hint: "Área = largo × ancho: 7 × 4 = ?"
    },
    {
      q: "¿Cuántos minutos hay en 2 horas y media?",
      opts: ["120", "150", "140"],
      a: 1,
      hint: "2 horas = 120 minutos. Media hora = 30 minutos. Suma ambos."
    }
  ],

  /* ── Inglés simplificado (nivel 9 años) ── */
  idioma: [
    {
      q: "¿Cómo se dice 'perro' en inglés?",
      opts: ["Cat", "Dog", "Bird"],
      a: 1,
      hint: "Empieza por D y tiene 3 letras"
    },
    {
      q: "¿Qué significa 'birthday' en español?",
      opts: ["Vacaciones", "Cumpleaños", "Fiesta"],
      a: 1,
      hint: "¡Es el día de Amets! 🎂"
    },
    {
      q: "¿Cómo se dice 'rojo' en inglés?",
      opts: ["Blue", "Green", "Red"],
      a: 2,
      hint: "Las rosas son de color '___'"
    },
    {
      q: "¿Qué significa 'happy' en español?",
      opts: ["Triste", "Cansada", "Feliz"],
      a: 2,
      hint: "Cuando todo va bien, estás '___'"
    },
    {
      q: "¿Cómo se dice 'casa' en inglés?",
      opts: ["Car", "House", "Tree"],
      a: 1,
      hint: "Empieza por H y tiene 5 letras"
    },
    {
      q: "¿Cómo se dice 'amiga' en inglés?",
      opts: ["Enemy", "Friend", "Family"],
      a: 1,
      hint: "Empieza por Fr. Arai y Mara son las '_____' de Amets"
    },
    {
      q: "¿Qué significa 'school' en español?",
      opts: ["Casa", "Colegio", "Parque"],
      a: 1,
      hint: "Es el lugar donde vas a aprender"
    },
    {
      q: "¿Cómo se dice 'azul' en inglés?",
      opts: ["Yellow", "Blue", "Green"],
      a: 1,
      hint: "El cielo despejado es de color '___'"
    },
    {
      q: "¿Qué número es 'seven' en inglés?",
      opts: ["6", "8", "7"],
      a: 2,
      hint: "Está entre el seis y el ocho"
    },
    {
      q: "¿Cómo se dice 'familia' en inglés?",
      opts: ["Fame", "Family", "Fancy"],
      a: 1,
      hint: "David, Ainara, Arai, Amets y Mara son una '___'"
    },
    {
      q: "¿Qué significa 'beautiful' en español?",
      opts: ["Ruidosa", "Pequeña", "Bonita / Preciosa"],
      a: 2,
      hint: "Lo que dicen de Amets cuando baila ballet 💃"
    },
    {
      q: "¿Cómo se dice 'árbol' en inglés?",
      opts: ["Flower", "Tree", "Grass"],
      a: 1,
      hint: "Empieza por T, tiene 4 letras"
    },
    {
      q: "¿Qué significa 'run' en español?",
      opts: ["Saltar", "Correr", "Nadar"],
      a: 1,
      hint: "Lo que hace Amets en el nivel del camino encantado 🏃"
    }
  ],

  /* ── Cultura general (Navarra + general) ── */
  cultura: [
    {
      q: "¿Cuál es la capital de Navarra?",
      opts: ["Logroño", "Pamplona", "Tudela"],
      a: 1,
      hint: "Allí se celebran las fiestas de San Fermín"
    },
    {
      q: "¿Cómo se llaman las fiestas más famosas de Pamplona?",
      opts: ["Fiestas de la Vendimia", "San Fermín", "La Tamborrada"],
      a: 1,
      hint: "Se celebran del 6 al 14 de julio. ¡Con encierros de toros!"
    },
    {
      q: "¿Qué río pasa por Pamplona?",
      opts: ["Ebro", "Arga", "Bidasoa"],
      a: 1,
      hint: "Empieza por A y pasa bajo el puente de la Magdalena"
    },
    {
      q: "¿En qué comunidad autónoma está el pueblo de Arazuri?",
      opts: ["País Vasco", "La Rioja", "Navarra"],
      a: 2,
      hint: "Es la Comunidad Foral, con capital en Pamplona"
    },
    {
      q: "¿Qué idioma cooficial se habla en algunas zonas de Navarra?",
      opts: ["Catalán", "Gallego", "Euskera"],
      a: 2,
      hint: "También se llama vasco y se habla en el País Vasco"
    },
    {
      q: "¿Quién pintó La Gioconda (la Mona Lisa)?",
      opts: ["Miguel Ángel", "Rafael", "Leonardo da Vinci"],
      a: 2,
      hint: "También diseñó máquinas voladoras en el siglo XV"
    },
    {
      q: "¿Cuántos planetas tiene el Sistema Solar actualmente?",
      opts: ["9", "8", "10"],
      a: 1,
      hint: "En 2006 reclasificaron a Plutón como planeta enano"
    },
    {
      q: "¿Cuál es el planeta más cercano al Sol?",
      opts: ["Venus", "Marte", "Mercurio"],
      a: 2,
      hint: "Es el planeta más pequeño del Sistema Solar"
    },
    {
      q: "¿Cuántos cromosomas tiene una célula humana normal?",
      opts: ["23", "46", "48"],
      a: 1,
      hint: "Vienen en pares: 23 pares × 2 = ?"
    },
    {
      q: "¿Qué escritor español creó al personaje de Don Quijote?",
      opts: ["Federico García Lorca", "Miguel de Cervantes", "Francisco de Quevedo"],
      a: 1,
      hint: "Vivió entre 1547 y 1616, es el autor más famoso de España"
    },
    {
      q: "¿En qué continente está España?",
      opts: ["América", "África", "Europa"],
      a: 2,
      hint: "Es el mismo continente que Francia, Italia y Alemania"
    },
    {
      q: "¿Cuántos lados tiene un hexágono?",
      opts: ["5", "7", "6"],
      a: 2,
      hint: "Las celdas de los panales de abeja tienen esa forma"
    },
    {
      q: "¿Cuál es tu tío favorito? (sé sincera 😏)",
      opts: ["Aritz", "Unai", "Coco"],
      a: 1,
      hint: "Empieza por U… ¡ya sabes quién es! 😄",
      forced: true
    }
  ],

  /* ── Series / Seguir la secuencia ── */
  series: [
    {
      q: "¿Qué número sigue? 2, 4, 6, 8, ___",
      opts: ["9", "10", "12"],
      a: 1,
      hint: "Suma 2 cada vez: 2→4→6→8→?"
    },
    {
      q: "¿Qué número sigue? 5, 10, 15, 20, ___",
      opts: ["22", "25", "30"],
      a: 1,
      hint: "La tabla del 5: suma 5 cada vez"
    },
    {
      q: "¿Qué número sigue? 100, 90, 80, 70, ___",
      opts: ["65", "60", "55"],
      a: 1,
      hint: "Resta 10 cada vez: 100→90→80→70→?"
    },
    {
      q: "¿Qué número sigue? 3, 6, 12, 24, ___",
      opts: ["36", "30", "48"],
      a: 2,
      hint: "Multiplica por 2 cada vez: 3→6→12→24→?"
    },
    {
      q: "¿Qué número sigue? 1, 1, 2, 3, 5, ___",
      opts: ["6", "7", "8"],
      a: 2,
      hint: "Suma los dos anteriores: 3+5 = ?"
    },
    {
      q: "¿Qué número sigue? 1, 4, 9, 16, ___",
      opts: ["20", "25", "24"],
      a: 1,
      hint: "Son los cuadrados perfectos: 1², 2², 3², 4², 5² = ?"
    },
    {
      q: "¿Qué número sigue? 2, 4, 8, 16, ___",
      opts: ["24", "30", "32"],
      a: 2,
      hint: "Potencias de 2: 2¹, 2², 2³, 2⁴, 2⁵ = ?"
    },
    {
      q: "¿Qué número sigue? 10, 8, 6, 4, ___",
      opts: ["3", "2", "1"],
      a: 1,
      hint: "Resta 2 cada vez: 10→8→6→4→?"
    },
    {
      q: "¿Qué número sigue? 1, 2, 4, 7, 11, ___",
      opts: ["14", "15", "16"],
      a: 2,
      hint: "Sumas +1, +2, +3, +4, +5: 11+5 = ?"
    },
    {
      q: "¿Qué mes sigue? Enero, Febrero, Marzo, Abril, ___",
      opts: ["Junio", "Mayo", "Agosto"],
      a: 1,
      hint: "El quinto mes del año"
    },
    {
      q: "¿Qué sigue? Lunes, Martes, Miércoles, Jueves, ___",
      opts: ["Sábado", "Domingo", "Viernes"],
      a: 2,
      hint: "El quinto día de la semana laboral"
    },
    {
      q: "¿Qué número sigue? 1, 10, 100, 1000, ___",
      opts: ["10000", "2000", "9000"],
      a: 0,
      hint: "Multiplica por 10 cada vez: 1000×10 = ?"
    },
    {
      q: "¿Qué letra sigue? A, C, E, G, ___",
      opts: ["H", "I", "J"],
      a: 1,
      hint: "Saltas una letra cada vez: A, (B), C, (D), E, (F), G, (H), ?"
    },
    {
      q: "¿Qué número sigue? 64, 32, 16, 8, ___",
      opts: ["6", "5", "4"],
      a: 2,
      hint: "Divide entre 2 cada vez: 8÷2 = ?"
    },
    {
      q: "¿Qué figura sigue? Triángulo (3), Cuadrado (4), Pentágono (5), ___",
      opts: ["Octágono (8)", "Heptágono (7)", "Hexágono (6)"],
      a: 2,
      hint: "Suma un lado cada vez: 3→4→5→?"
    }
  ]
};

/* Registro global de preguntas ya mostradas en esta partida.
   Se resetea en GAME.restart() / GAME.init() */
const _USED_QUESTIONS = new Set();

function resetUsedQuestions() {
  _USED_QUESTIONS.clear();
}

/* Función: N preguntas aleatorias mezclando categorías.
   - Las preguntas con forced:true siempre aparecen (aunque se repitan).
   - Las demás nunca se repiten dentro de la misma partida. */
function getRandomQuestions(n, categories) {
  categories = categories || ['matematicas', 'idioma', 'cultura', 'series'];
  let pool = [];
  categories.forEach(cat => {
    if (QUESTIONS[cat]) pool = pool.concat(QUESTIONS[cat]);
  });

  const forced = pool.filter(q => q.forced);
  /* Excluir preguntas ya usadas */
  const normal = pool.filter(q => !q.forced && !_USED_QUESTIONS.has(q.q));

  /* Barajar */
  for (let i = normal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normal[i], normal[j]] = [normal[j], normal[i]];
  }

  const selected = [...forced, ...normal.slice(0, Math.max(0, n - forced.length))];

  /* Mezclar la lista final */
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  /* Registrar las preguntas seleccionadas como usadas */
  selected.forEach(q => { if (!q.forced) _USED_QUESTIONS.add(q.q); });

  return selected;
}
