/* ============================================================
   BANCO DE PREGUNTAS
   Categorías: matematicas | idioma | cultura
   Formato: { q, opts:[3 opciones], a: índice correcto, hint }
============================================================ */

const QUESTIONS = {

  matematicas: [
    {
      q: "Si haces 3 giros y repites la secuencia 4 veces, ¿cuántos giros haces en total?",
      opts: ["10", "12", "7"],
      a: 1,
      hint: "Multiplica: 3 × 4 = ?"
    },
    {
      q: "Si en la furgoneta van 4 personas y se suben 2 más, ¿cuántas hay en total?",
      opts: ["5", "7", "6"],
      a: 2,
      hint: "Suma: 4 + 2 = ?"
    },
    {
      q: "Tienes 18 lazos y los guardas en cajas de 6. ¿Cuántas cajas necesitas?",
      opts: ["4", "2", "3"],
      a: 2,
      hint: "Divide: 18 ÷ 6 = ?"
    },
    {
      q: "¿Qué número falta? 4, 8, 12, ___",
      opts: ["14", "16", "18"],
      a: 1,
      hint: "Se suma 4 cada vez: 4+4=8, 8+4=12, 12+4=?"
    },
    {
      q: "¿Cuánto es 9 × 3?",
      opts: ["24", "27", "21"],
      a: 1,
      hint: "Cuenta de 9 en 9: 9, 18, 27…"
    },
    {
      q: "Amets tiene 32 caramelos y regala la mitad. ¿Cuántos le quedan?",
      opts: ["14", "16", "18"],
      a: 1,
      hint: "Divide 32 entre 2"
    },
    {
      q: "Si un pastel se corta en 8 trozos y ya se han comido 3, ¿cuántos quedan?",
      opts: ["4", "6", "5"],
      a: 2,
      hint: "Resta: 8 – 3 = ?"
    },
    {
      q: "¿Cuánto es 7 × 6?",
      opts: ["40", "42", "48"],
      a: 1,
      hint: "7 × 6 = 7 × 5 + 7 = 35 + 7"
    },
    {
      q: "Hay 5 filas de sillas con 7 sillas cada una. ¿Cuántas sillas hay?",
      opts: ["30", "35", "37"],
      a: 1,
      hint: "Multiplica: 5 × 7 = ?"
    },
    {
      q: "¿Qué número falta? 3, 6, 9, 12, ___",
      opts: ["13", "14", "15"],
      a: 2,
      hint: "Se suma 3 cada vez"
    }
  ],

  idioma: [
    {
      q: "¿Cómo se dice 'perro' en inglés?",
      opts: ["Cat", "Dog", "Bird"],
      a: 1,
      hint: "Empieza por D y tiene 3 letras"
    },
    {
      q: "¿Qué significa 'birthday' en español?",
      opts: ["Fiesta", "Cumpleaños", "Regalo"],
      a: 1,
      hint: "¡Es el día de Amets! 🎂"
    },
    {
      q: "Completa la frase: 'I ___ ready.'",
      opts: ["are", "is", "am"],
      a: 2,
      hint: "Cuando hablo de mí mismo uso 'am'"
    },
    {
      q: "¿Cómo se dice 'rojo' en inglés?",
      opts: ["Blue", "Green", "Red"],
      a: 2,
      hint: "Las rosas son de color '___'"
    },
    {
      q: "¿Cómo se dice 'gato' en inglés?",
      opts: ["Rabbit", "Cat", "Horse"],
      a: 1,
      hint: "Empieza por C y tiene 3 letras"
    },
    {
      q: "¿Cómo se dice 'casa' en inglés?",
      opts: ["Car", "House", "Tree"],
      a: 1,
      hint: "Empieza por H y tiene 5 letras"
    },
    {
      q: "¿Qué significa 'happy' en español?",
      opts: ["Triste", "Cansado", "Feliz"],
      a: 2,
      hint: "La canción dice: 'If you're ___ and you know it…'"
    },
    {
      q: "¿Cómo se dice 'libro' en inglés?",
      opts: ["Pen", "Table", "Book"],
      a: 2,
      hint: "Empieza por B y lo usas para leer"
    },
    {
      q: "¿Cómo se dice 'azul' en inglés?",
      opts: ["Blue", "Yellow", "Pink"],
      a: 0,
      hint: "El cielo durante el día es de color '___'"
    },
    {
      q: "¿Qué significa 'friend' en español?",
      opts: ["Familia", "Amigo", "Profesor"],
      a: 1,
      hint: "La persona con la que juegas y te diviertes"
    }
  ],

  cultura: [
    {
      q: "¿Cuántos días tiene una semana?",
      opts: ["5", "6", "7"],
      a: 2,
      hint: "Lunes, martes, miércoles… ¡cuenta!"
    },
    {
      q: "¿Cuántos continentes hay en el mundo?",
      opts: ["5", "6", "7"],
      a: 2,
      hint: "Europa, América, África, Asia, Oceanía, Antártida y uno más…"
    },
    {
      q: "¿Cuál es el animal más grande del mundo?",
      opts: ["Elefante africano", "Tiburón ballena", "Ballena azul"],
      a: 2,
      hint: "Vive en el océano y puede medir más de 30 metros"
    },
    {
      q: "¿En qué planeta vivimos?",
      opts: ["Marte", "Venus", "La Tierra"],
      a: 2,
      hint: "Es el tercer planeta del Sistema Solar"
    },
    {
      q: "¿Cuántos meses tiene un año?",
      opts: ["10", "11", "12"],
      a: 2,
      hint: "Enero, febrero, marzo… ¡sigue contando!"
    },
    {
      q: "¿Cuántas estaciones tiene el año?",
      opts: ["3", "4", "5"],
      a: 1,
      hint: "Primavera, verano, otoño y…"
    },
    {
      q: "¿De qué color es el sol?",
      opts: ["Blanco", "Amarillo", "Naranja"],
      a: 1,
      hint: "Del mismo color que el oro"
    },
    {
      q: "¿Cuántos días tiene normalmente un año (sin bisiesto)?",
      opts: ["360", "365", "366"],
      a: 1,
      hint: "12 meses × unos 30 días cada uno… ¡aproximadamente!"
    },
    {
      q: "¿Qué animal es el más rápido en tierra?",
      opts: ["León", "Guepardo", "Caballo"],
      a: 1,
      hint: "Puede correr hasta 110 km/h con manchas negras"
    },
    {
      q: "¿Cuántos lados tiene un triángulo?",
      opts: ["4", "2", "3"],
      a: 2,
      hint: "TRI significa tres en latín"
    }
  ]
};

/* Función utilitaria: devuelve N preguntas aleatorias mezclando categorías */
function getRandomQuestions(n, categories) {
  categories = categories || ['matematicas', 'idioma', 'cultura'];
  let pool = [];
  categories.forEach(cat => { if (QUESTIONS[cat]) pool = pool.concat(QUESTIONS[cat]); });
  // Mezclar (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
