/* ============================================================
   BANCO DE PREGUNTAS v3
   – Inglés simplificado (nivel 9 años)
   – Cultura general nivel 15 años + Navarra + Arazuri
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
      q: "¿Qué número falta? 1, 4, 9, 16, ___",
      opts: ["20", "25", "24"],
      a: 1,
      hint: "Son los cuadrados perfectos: 1², 2², 3², 4², 5² = ?"
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
      q: "¿Cómo se dice 'gato' en inglés?",
      opts: ["Fish", "Cat", "Horse"],
      a: 1,
      hint: "Empieza por C y tiene 3 letras"
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
    }
  ],

  /* ── Cultura general (nivel 15 años + Navarra + Arazuri) ── */
  cultura: [
    /* ── Navarra y Arazuri ── */
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
      q: "¿Qué río pasa por Pamplona, la ciudad más cercana a Arazuri?",
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
      q: "¿Qué idioma cooficial se habla en algunas zonas de Navarra además del español?",
      opts: ["Catalán", "Gallego", "Euskera"],
      a: 2,
      hint: "También se llama vasco y se habla en el País Vasco"
    },
    {
      q: "El escudo de Navarra lleva unas cadenas de oro sobre fondo rojo. ¿Qué batalla recuerdan?",
      opts: ["La batalla de Roncesvalles", "La batalla de las Navas de Tolosa", "La batalla de Lepanto"],
      a: 1,
      hint: "Fue en 1212 y Navarra participó junto a otros reinos cristianos"
    },
    {
      q: "¿A cuántos kilómetros aproximadamente está Arazuri del centro de Pamplona?",
      opts: ["20 km", "8 km", "35 km"],
      a: 1,
      hint: "Es un pueblo muy cercano, casi un barrio de la capital"
    },
    /* ── Cultura general nivel 15 años ── */
    {
      q: "¿En qué año cayó el Muro de Berlín?",
      opts: ["1979", "1989", "1999"],
      a: 1,
      hint: "Fue al final de los años 80. Alemania se reunificó ese año."
    },
    {
      q: "¿Quién pintó La Gioconda, también conocida como la Mona Lisa?",
      opts: ["Miguel Ángel", "Rafael", "Leonardo da Vinci"],
      a: 2,
      hint: "También diseñó máquinas voladoras y helicópteros en el siglo XV"
    },
    {
      q: "¿Cuántos planetas tiene el Sistema Solar actualmente?",
      opts: ["9", "8", "10"],
      a: 1,
      hint: "En 2006 reclasificaron a Plutón como planeta enano y quedaron 8"
    },
    {
      q: "¿Qué elemento químico es el más abundante en el universo?",
      opts: ["Oxígeno", "Helio", "Hidrógeno"],
      a: 2,
      hint: "Es el más ligero de todos. Con él funciona el Sol."
    },
    {
      q: "¿En qué año empezó la Primera Guerra Mundial?",
      opts: ["1912", "1914", "1918"],
      a: 1,
      hint: "Empezó en el 14 y terminó en el 18. Recuerda el año de inicio."
    },
    {
      q: "¿Cuál es el planeta más cercano al Sol?",
      opts: ["Venus", "Marte", "Mercurio"],
      a: 2,
      hint: "Es el planeta más pequeño del Sistema Solar y el más rápido"
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
      hint: "Vivió entre 1547 y 1616 y es el autor más famoso de España"
    },
    {
      q: "¿Cuál es tu tío favorito? (sé sincera 😏)",
      opts: ["Aritz", "Unai", "Coco"],
      a: 1,
      hint: "Empieza por U… ¡ya sabes quién es! 😄"
    }
  ]
};

/* Función: N preguntas aleatorias mezclando categorías */
function getRandomQuestions(n, categories) {
  categories = categories || ['matematicas', 'idioma', 'cultura'];
  let pool = [];
  categories.forEach(cat => {
    if (QUESTIONS[cat]) pool = pool.concat(QUESTIONS[cat]);
  });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
