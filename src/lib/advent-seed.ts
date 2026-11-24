import type { Puzzle, UserAccount } from "./advent-types";

const DAY1_INPUT = `G001,265,medium,NORTE
G002,359,medium,NORTE
G003,189,low,NORTE
G004,263,high,BELGRANO
G005,967,urgent,NORTE
G006,759,low,SUR
G007,0,high,OESTE
G008,686,high,CENTRO
G009,598,low,OESTE
G010,493,urgent,BELGRANO
G011,859,high,SUR
G012,306,urgent,BELGRANO
G013,529,high,NORTE
G014,433,urgent,BELGRANO
G015,279,urgent,SUR
G016,812,urgent,NORTE
G017,335,medium,SUR
G018,788,urgent,CENTRO
G019,0,medium,OESTE
G020,411,urgent,BELGRANO
G021,351,high,BELGRANO
G022,755,low,OESTE
G023,892,high,OESTE
G024,319,high,BELGRANO
G025,455,urgent,OESTE
G026,237,urgent,NORTE
G027,381,urgent,NORTE
G028,841,urgent,NORTE
G029,379,low,NORTE
G030,758,medium,BELGRANO
G031,618,low,NORTE
G032,559,low,OESTE
G033,211,high,SUR
G034,1450,urgent,SUR
G035,875,medium,OESTE
G036,311,medium,BELGRANO
G037,214,high,BELGRANO
G038,664,urgent,SUR
G039,160,urgent,OESTE
G040,666,urgent,OESTE
G041,654,urgent,BELGRANO
G042,561,medium,CENTRO
G043,373,medium,CENTRO
G044,809,high,NORTE
G045,641,high,NORTE
G046,482,high,BELGRANO
G047,348,high,BELGRANO
G048,1120,low,OESTE
G049,408,high,SUR
G050,518,medium,SUR
G051,807,high,CENTRO
G052,182,low,NORTE
G053,863,urgent,BELGRANO
G054,964,high,OESTE
G055,458,high,CENTRO
G056,648,urgent,OESTE
G057,406,urgent,CENTRO
G058,953,urgent,CENTRO
G059,942,urgent,OESTE
G060,250,low,BELGRANO`;

const DAY5_INPUT = `Belgrano -> Nunez : 8 | books,puzzles
Belgrano -> Colegiales : 11 | games,plush
Belgrano -> Palermo : 14 | robots,books
Belgrano -> Villa_Urquiza : 16 | music,crafts
Nunez -> Saavedra : 9 | drones,books
Nunez -> Palermo : 13 | lego,puzzles
Colegiales -> Chacarita : 7 | boards,games
Colegiales -> Villa_Crespo : 12 | art,plush
Colegiales -> Palermo : 10 | coding_kits,robots
Palermo -> Recoleta : 11 | telescopes,books
Palermo -> Villa_Crespo : 9 | bikes,games
Palermo -> Almagro : 15 | guitars,music
Villa_Urquiza -> Saavedra : 10 | skates,crafts
Villa_Urquiza -> Devoto : 14 | trains,lego
Saavedra -> Devoto : 18 | comics,puzzles
Chacarita -> Villa_Crespo : 6 | cameras,art
Chacarita -> Caballito : 15 | keyboards,coding_kits
Villa_Crespo -> Almagro : 8 | violins,music
Villa_Crespo -> Caballito : 11 | headsets,games
Villa_Crespo -> Recoleta : 17 | globes,books
Recoleta -> Retiro : 7 | watches,telescopes
Recoleta -> Almagro : 12 | chess,boards
Almagro -> Caballito : 9 | drums,music
Almagro -> San_Telmo : 14 | lanterns,art
Almagro -> Puerto_Madero : 10 | drones,watches
Caballito -> Flores : 10 | scooters,bikes
Caballito -> San_Telmo : 19 | compilers,coding_kits
Devoto -> Flores : 13 | paint,crafts
Flores -> San_Telmo : 16 | origami,art
Retiro -> Puerto_Madero : 12 | satellites,robots
Retiro -> San_Telmo : 11 | compass,globes
San_Telmo -> Puerto_Madero : 8 | stamps,books`;

function makePlaceholder(day: number, unlockDate: string): Puzzle {
  return {
    day,
    title: {
      en: `Day ${day}: Workshop Challenge (Coming Soon)`,
      es: `Día ${day}: Desafío del Taller (Próximamente)`,
    },
    topic: { en: "Python Challenge", es: "Desafío en Python" },
    storyPart1: {
      en: "The elves are still polishing the puzzle specification for this day. Administrators can fill in the story, input data, and expected solutions from the Admin panel.",
      es: "Los duendes todavía están puliendo la consigna de este día. Los administradores pueden completar la historia, el archivo de entrada y las soluciones desde el panel de Administración.",
    },
    storyPart2: {
      en: "Part 2 will be published alongside Part 1 once the elves finalize the challenge.",
      es: "La Parte 2 se publicará junto con la Parte 1 una vez que los duendes finalicen el desafío.",
    },
    inputFilename: `day${String(day).padStart(2, "0")}_input.txt`,
    inputData: `# Placeholder input for Day ${day}\n42\n`,
    answerPart1: "42",
    answerPart2: "84",
    unlockDate,
    isPlaceholder: true,
  };
}

export const SEED_PUZZLES: Puzzle[] = [
  {
    day: 1,
    title: {
      en: "Sifting Presents on Santa's Conveyor Belt",
      es: "Clasificando Regalos en la Cinta Transportadora de Papá Noel",
    },
    topic: {
      en: "List Manipulation & Slicing",
      es: "Manipulación de Listas y Slicing",
    },
    storyPart1: {
      en: `Snow falls softly over the Universidad de Belgrano tower as the workshop's main conveyor belt hums to life. Each line in your input file represents a gift crate moving down the belt in the format:

crate_id,weight_grams,priority,zone

A few crates were misread by the barcode scanner and show an invalid weight (<= 0 grams or > 1000 grams). Before loading the express sleigh, the elves must:
1. Discard every crate whose weight is <= 0 or > 1000.
2. Keep only crates whose priority is "high" or "urgent".
3. Sort the remaining crates by weight descending (tie-break by crate_id ascending).
4. Take the top 12 crates and compute the sum of their weights in grams.

What is the total weight (in grams) of those top 12 express crates?`,
      es: `La nieve cae suavemente sobre la torre de la Universidad de Belgrano mientras la cinta transportadora principal del taller entra en marcha. Cada línea del archivo de entrada representa una caja de regalo con el formato:

crate_id,weight_grams,priority,zone

Algunas cajas fueron mal leídas por el escáner y muestran un peso inválido (<= 0 gramos o > 1000 gramos). Antes de cargar el trineo expreso, los duendes deben:
1. Descartar todas las cajas con peso <= 0 o > 1000.
2. Conservar únicamente las cajas con prioridad "high" o "urgent".
3. Ordenar las cajas restantes por peso descendente (desempatar por crate_id ascendente).
4. Tomar las primeras 12 cajas y sumar sus pesos en gramos.

¿Cuál es el peso total (en gramos) de esas 12 cajas expreso?`,
    },
    storyPart2: {
      en: `Great work! Now Santa wants to check the belt's load balance before speeding up the rollers.

Keep all valid crates (0 < weight <= 1000, regardless of priority) in their original conveyor belt order. Santa's robotic arm lifts crates in consecutive batches of 5 (a sliding window of length 5).

What is the maximum combined weight (in grams) of any 5 consecutive valid crates on the conveyor belt?`,
      es: `¡Excelente trabajo! Ahora Papá Noel quiere verificar el equilibrio de carga antes de acelerar los rodillos.

Conservá todas las cajas válidas (0 < peso <= 1000, sin importar su prioridad) en su orden original sobre la cinta. El brazo robótico levanta cajas en lotes consecutivos de 5 (una ventana deslizante de longitud 5).

¿Cuál es el peso combinado máximo (en gramos) de 5 cajas válidas consecutivas en la cinta transportadora?`,
    },
    inputFilename: "day01_input.txt",
    inputData: DAY1_INPUT,
    answerPart1: "10497",
    answerPart2: "3503",
    unlockDate: "2025-12-01",
  },
  makePlaceholder(2, "2025-12-02"),
  makePlaceholder(3, "2025-12-03"),
  makePlaceholder(4, "2025-12-04"),
  {
    day: 5,
    title: {
      en: "Route Optimization for Gift Delivery",
      es: "Optimización de Rutas para Entrega de Regalos",
    },
    topic: {
      en: "Dictionaries, Sets & Shortest Paths",
      es: "Diccionarios, Conjuntos y Caminos Mínimos",
    },
    storyPart1: {
      en: `Santa's reindeer are charting flight corridors across Buenos Aires, launching from the rooftop of Belgrano. Each line in your input file describes a one-way sleigh corridor:

from_hub -> to_hub : minutes | gift_tag1,gift_tag2

Build an adjacency dictionary mapping each neighborhood to its outgoing corridors. To verify the early-evening cargo manifest, the elves inspect all corridors that depart from "Belgrano" OR from any neighborhood directly reachable in 1 hop from "Belgrano".

Using a Python set, how many unique gift categories appear across all those corridors?`,
      es: `Los renos de Papá Noel trazan corredores de vuelo sobre Buenos Aires, despegando desde la terraza de Belgrano. Cada línea del archivo de entrada describe un corredor unidireccional:

from_hub -> to_hub : minutes | gift_tag1,gift_tag2

Construí un diccionario de adyacencia que asocie cada barrio con sus corredores salientes. Para verificar el manifiesto de carga inicial, los duendes inspeccionan todos los corredores que parten desde "Belgrano" O desde cualquier barrio alcanzable directamente en 1 salto desde "Belgrano".

Usando un set de Python, ¿cuántas categorías únicas de regalos aparecen en todos esos corredores?`,
    },
    storyPart2: {
      en: `A sudden summer storm rolls over the city, closing the airspace above two hubs: "Almagro" and "Flores".

Find the fastest legal sleigh route from "Belgrano" to "Puerto_Madero" that never enters any hub in the closed set {"Almagro", "Flores"}.

What is the minimum total flight time in minutes?`,
      es: `Una tormenta repentina cubre la ciudad y cierra el espacio aéreo sobre dos nodos: "Almagro" y "Flores".

Encontrá la ruta de trineo más rápida desde "Belgrano" hasta "Puerto_Madero" sin pasar por ningún barrio del conjunto cerrado {"Almagro", "Flores"}.

¿Cuál es el tiempo total mínimo de vuelo en minutos?`,
    },
    inputFilename: "day05_input.txt",
    inputData: DAY5_INPUT,
    answerPart1: "17",
    answerPart2: "44",
    unlockDate: "2025-12-05",
  },
  makePlaceholder(6, "2026-12-06"),
  makePlaceholder(7, "2026-12-07"),
  makePlaceholder(8, "2026-12-08"),
  makePlaceholder(9, "2026-12-09"),
  makePlaceholder(10, "2026-12-10"),
  makePlaceholder(11, "2026-12-11"),
  makePlaceholder(12, "2026-12-12"),
];

export const SEED_USERS: UserAccount[] = [
  {
    id: "admin-guillermo",
    name: "Guillermo Maquieira",
    email: "guillermo.maquieira@comunidad.ub.edu.ar",
    password: "ub-admin-2026",
    yearOfStudy: "5th Year",
    isAdmin: true,
    solves: [
      { day: 1, part: 1, solvedAt: "2026-11-20T14:10:00Z", solveSeconds: 510 },
      { day: 1, part: 2, solvedAt: "2026-11-20T14:21:00Z", solveSeconds: 660 },
    ],
  },
  {
    id: "admin-natalia",
    name: "Natalia Cerda",
    email: "natalia.cerda@comunidad.ub.edu.ar",
    password: "ub-admin-2026",
    yearOfStudy: "5th Year",
    isAdmin: true,
    solves: [
      { day: 1, part: 1, solvedAt: "2026-11-20T15:05:00Z", solveSeconds: 480 },
      { day: 1, part: 2, solvedAt: "2026-11-20T15:15:00Z", solveSeconds: 600 },
    ],
  },
  {
    id: "student-sofia",
    name: "Sofía Fernández",
    email: "sofia.fernandez@comunidad.ub.edu.ar",
    password: "student123",
    yearOfStudy: "3rd Year",
    isAdmin: false,
    solves: [
      { day: 1, part: 1, solvedAt: "2026-11-21T11:12:00Z", solveSeconds: 420 },
      { day: 1, part: 2, solvedAt: "2026-11-21T11:24:00Z", solveSeconds: 540 },
      { day: 5, part: 1, solvedAt: "2026-11-22T18:10:00Z", solveSeconds: 615 },
      { day: 5, part: 2, solvedAt: "2026-11-22T18:30:00Z", solveSeconds: 890 },
    ],
  },
  {
    id: "student-mateo",
    name: "Mateo Alarcón",
    email: "mateo.alarcon@ub.edu.ar",
    password: "student123",
    yearOfStudy: "2nd Year",
    isAdmin: false,
    solves: [
      { day: 1, part: 1, solvedAt: "2026-11-21T12:00:00Z", solveSeconds: 495 },
      { day: 1, part: 2, solvedAt: "2026-11-21T12:14:00Z", solveSeconds: 620 },
      { day: 5, part: 1, solvedAt: "2026-11-22T20:05:00Z", solveSeconds: 730 },
    ],
  },
  {
    id: "student-camila",
    name: "Camila Benítez",
    email: "camila.benitez@comunidad.ub.edu.ar",
    password: "student123",
    yearOfStudy: "1st Year",
    isAdmin: false,
    solves: [
      { day: 1, part: 1, solvedAt: "2026-11-22T09:30:00Z", solveSeconds: 680 },
      { day: 1, part: 2, solvedAt: "2026-11-22T09:50:00Z", solveSeconds: 910 },
    ],
  },
  {
    id: "student-lucas",
    name: "Lucas Pereyra",
    email: "lucas.pereyra@ub.edu.ar",
    password: "student123",
    yearOfStudy: "4th Year",
    isAdmin: false,
    solves: [
      { day: 1, part: 1, solvedAt: "2026-11-21T19:00:00Z", solveSeconds: 360 },
      { day: 1, part: 2, solvedAt: "2026-11-21T19:09:00Z", solveSeconds: 450 },
      { day: 5, part: 1, solvedAt: "2026-11-23T14:20:00Z", solveSeconds: 510 },
      { day: 5, part: 2, solvedAt: "2026-11-23T14:35:00Z", solveSeconds: 780 },
    ],
  },
];