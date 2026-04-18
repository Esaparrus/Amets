/* ============================================================
   BANCO DE PREGUNTAS (versión difícil)
   Pensadas para una niña de 9 años que tiene que pensar bien.
   Categorías: matematicas | idioma | cultura
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
      hint: "Multiplica la velocidad por el tiempo: 80 × 3 = ?"
    },
    {
      q: "¿Cuánto es 144 ÷ 12?",
      opts: ["11", "14", "12"],
      a: 2,
      hint: "Piensa: ¿cuántas veces cabe el 12 en 144?"
    },
    {
      q: "Si el 25% de los globos son rojos y hay 40 globos en total, ¿cuántos son rojos?",
      opts: ["8", "10", "12"],
      a: 1,
      hint: "El 25% es la cuarta parte. 40 ÷ 4 = ?"
    },
    {
      q: "¿Qué número falta? 1, 4, 9, 16, ___",
      opts: ["20", "25", "24"],
      a: 1,
      hint: "Son los cuadrados perfectos: 1²=1, 2²=4, 3²=9, 4²=16, 5²=?"
    },
    {
      q: "Arai tiene el doble de años que Mara. Mara tiene 7 años. ¿Cuántos años tienen entre las dos?",
      opts: ["19", "21", "18"],
      a: 1,
      hint: "Arai tiene 7×2=14 años. Suma: 14 + 7 = ?"
    },
    {
      q: "¿Cuánto es 37 + 58?",
      opts: ["94", "95", "85"],
      a: 1,
      hint: "Suma primero las unidades: 7+8=15. Lleva 1, y suma las decenas: 3+5+1=9"
    },
    {
      q: "Si haces 12 giros en 3 minutos, ¿cuántos giros haces en 7 minutos al mismo ritmo?",
      opts: ["24", "28", "30"],
      a: 1,
      hint: "Primero: ¿cuántos giros por minuto? 12÷3=4. Luego: 4×7=?"
    },
    {
      q: "¿Cuánto mide el perímetro de un cuadrado con lados de 9 cm?",
      opts: ["27 cm", "36 cm", "81 cm"],
      a: 1,
      hint: "Un cuadrado tiene 4 lados iguales. 9 × 4 = ?"
    },
    {
      q: "Un libro tiene 180 páginas. Amets lee 15 páginas cada día. ¿En cuántos días termina?",
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
      q: "Si en la furgoneta de papá David caben 7 personas y van 4 familias de 1, 2, 2 y 3 personas, ¿caben todas?",
      opts: ["No, son 8", "Sí, son 7", "No, son 9"],
      a: 0,
      hint: "Suma: 1 + 2 + 2 + 3 = ? ¿Es mayor o menor que 7?"
    }
  ],

  idioma: [
    {
      q: "¿Cuál es el plural de 'mouse' (ratón) en inglés?",
      opts: ["Mouses", "Mice", "Mousies"],
      a: 1,
      hint: "En inglés hay plurales irregulares. 'Mouse' es uno de los más famosos."
    },
    {
      q: "¿Qué significa 'challenge' en español?",
      opts: ["Oportunidad", "Reto / Desafío", "Cambio"],
      a: 1,
      hint: "Cuando algo es difícil y tienes que esforzarte para superarlo, es un '___'"
    },
    {
      q: "Completa: 'Yesterday, she ___ to school late.'",
      opts: ["go", "goes", "went"],
      a: 2,
      hint: "'Yesterday' indica pasado. El pasado de 'go' es irregular."
    },
    {
      q: "¿Cómo se dice 'mariposa' en inglés?",
      opts: ["Dragonfly", "Butterfly", "Firefly"],
      a: 1,
      hint: "Empieza por 'butter' (mantequilla) y termina en 'fly' (mosca). ¡Curioso!"
    },
    {
      q: "¿Qué frase es correcta en inglés?",
      opts: ["She don't like it", "She doesn't like it", "She not like it"],
      a: 1,
      hint: "Con 'she / he / it' en presente negativo se usa 'doesn't'"
    },
    {
      q: "¿Qué significa 'brave' en español?",
      opts: ["Triste", "Valiente", "Lista"],
      a: 1,
      hint: "Amets es muy '___' en esta aventura 🌟"
    },
    {
      q: "¿Cómo se dice 'hermana' en inglés?",
      opts: ["Brother", "Sister", "Mother"],
      a: 1,
      hint: "Arai y Mara son las '_____' de Amets"
    },
    {
      q: "Elige la traducción correcta de: 'I have been waiting for an hour'",
      opts: ["Espero una hora", "Llevo una hora esperando", "Esperaré una hora"],
      a: 1,
      hint: "'Have been waiting' indica que la acción empezó en el pasado y continúa ahora"
    },
    {
      q: "¿Qué significa 'journey' en español?",
      opts: ["Diario", "Juicio", "Viaje / Aventura"],
      a: 2,
      hint: "Esta aventura de Amets podría llamarse 'Amets' ___'"
    },
    {
      q: "¿Cómo se deletrea el número 13 en inglés?",
      opts: ["Thirty", "Thirteen", "Three-teen"],
      a: 1,
      hint: "Los números del 13 al 19 terminan en '-teen' en inglés"
    }
  ],

  cultura: [
    {
      q: "¿Cuál es la capital de Francia?",
      opts: ["Lyon", "Marsella", "París"],
      a: 2,
      hint: "Es la ciudad de la Torre Eiffel"
    },
    {
      q: "¿Qué planeta es el más grande del Sistema Solar?",
      opts: ["Saturno", "Júpiter", "Neptuno"],
      a: 1,
      hint: "Tiene una gran mancha roja que en realidad es una tormenta gigante"
    },
    {
      q: "¿Cuántos huesos tiene el cuerpo humano adulto?",
      opts: ["106", "206", "306"],
      a: 1,
      hint: "Son más de 200 y menos de 250"
    },
    {
      q: "¿En qué año llegó el ser humano a la Luna por primera vez?",
      opts: ["1959", "1969", "1979"],
      a: 1,
      hint: "Fue Neil Armstrong. El año termina en 9 y empieza por 196_"
    },
    {
      q: "¿Cuál es el océano más grande del mundo?",
      opts: ["Atlántico", "Índico", "Pacífico"],
      a: 2,
      hint: "Cubre más de la mitad de la superficie de los océanos de la Tierra"
    },
    {
      q: "¿Cuántos países forman la Unión Europea (actualmente)?",
      opts: ["25", "27", "30"],
      a: 1,
      hint: "Después del Brexit (salida del Reino Unido) quedaron 27"
    },
    {
      q: "¿Qué instrumento musical tiene teclas blancas y negras?",
      opts: ["Violín", "Piano", "Flauta"],
      a: 1,
      hint: "Tiene 88 teclas en total y puede sonar solo o con orquesta"
    },
    {
      q: "¿A qué velocidad viaja la luz (aproximadamente)?",
      opts: ["300.000 km/s", "150.000 km/s", "1.000.000 km/s"],
      a: 0,
      hint: "Es la velocidad más alta posible en el universo"
    },
    {
      q: "¿Cuál es el animal terrestre más rápido del mundo?",
      opts: ["León", "Guepardo", "Caballo"],
      a: 1,
      hint: "Puede alcanzar 110 km/h en distancias cortas y tiene manchas negras"
    },
    {
      q: "¿Qué país tiene la bandera con una hoja de arce roja?",
      opts: ["Australia", "Japón", "Canadá"],
      a: 2,
      hint: "Está en América del Norte, al norte de Estados Unidos"
    },
    {
      q: "¿Cuántos lados tiene un hexágono?",
      opts: ["5", "7", "6"],
      a: 2,
      hint: "'Hexa' en griego significa seis. Las celdas de un panal de abejas son hexágonos."
    },
    {
      q: "¿Cuál es el escritor del libro 'Don Quijote de la Mancha'?",
      opts: ["Federico García Lorca", "Miguel de Cervantes", "Gabriel García Márquez"],
      a: 1,
      hint: "Es el libro más famoso de la literatura española. Lo escribió en el siglo XVII."
    }
  ]
};

/* ── Función utilitaria: N preguntas aleatorias mezclando categorías ── */
function getRandomQuestions(n, categories) {
  categories = categories || ['matematicas', 'idioma', 'cultura'];
  let pool = [];
  categories.forEach(cat => {
    if (QUESTIONS[cat]) pool = pool.concat(QUESTIONS[cat]);
  });
  /* Fisher-Yates shuffle */
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
