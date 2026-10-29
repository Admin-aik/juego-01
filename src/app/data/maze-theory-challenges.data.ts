import { MazeTheoryChallenge } from '../models/game.models';

export const MAZE_THEORY_CHALLENGES: MazeTheoryChallenge[] = [
  {
    id: 'challenge-l1',
    levelId: 1,
    title: 'El Dilema del Prisionero en el Laberinto de Liquidez',
    theoryConcept: 'Dilema del Prisionero',
    situation: 'Te encuentras en la encrucijada central del laberinto. Un operador rival avanza por el pasillo adyacente hacia la misma cámara de compensación. Si ambos cooperan compartiendo el canal regulado, obtienen rentabilidad segura. Si uno traiciona con arbitraje abusivo y el otro coopera, el traidor se lleva todo; pero si ambos traicionan (deflección mutua), colapsa el libro de órdenes y sufren liquidación.',
    matrixPayoff: {
      playerCooperate: { rivalCooperate: 'Ambos ganan (+300 PTS)', rivalDefect: 'Rival gana todo / Pierdes (-1 Vida)' },
      playerDefect: { rivalCooperate: 'Ganas todo (+500 PTS)', rivalDefect: 'Colapso mutuo / Quiebra (-1 Vida)' }
    },
    options: [
      {
        id: 'opt-cooperate',
        label: 'Cooperar: Canal Regulado y Compensación Mutua',
        actionText: 'Emitir firma criptográfica para canalizar liquidez conjunta sin fricción.',
        isOptimalNash: true,
        pointsReward: 350,
        livesDamage: 0,
        outcomeExplanation: '¡ÓPTIMO SOCIAL LOGRADO! Al establecer el canal regulado mutuo, se supera la trampa del Dilema del Prisionero, desbloqueando un escudo de solvencia temporal y +350 PTS.'
      },
      {
        id: 'opt-defect',
        label: 'Defeccionar: Intentar Arbitraje Hostil y Adelantarse',
        actionText: 'Ignorar los protocolos de solvencia e intentar saturar el canal del rival.',
        isOptimalNash: false,
        pointsReward: 0,
        livesDamage: 1,
        outcomeExplanation: '¡COLAPSO POR DEFECCIÓN MUTUA! El rival también ejecutó arbitraje hostil. Se produjo un bloqueo de liquidez en el nodo central. Has perdido 1 VIDA de solvencia.'
      }
    ],
    educationalInsight: 'En Teoría de Juegos, el Dilema del Prisionero demuestra que cuando los participantes persiguen únicamente su interés egoísta a corto plazo sin mecanismos de confianza o reputación, convergen al peor equilibrio (ambos defeccionan), perdiendo el Óptimo de Pareto que la cooperación garantiza.'
  },
  {
    id: 'challenge-l2',
    levelId: 2,
    title: 'Caza del Ciervo & Coordinación de Carteras',
    theoryConcept: 'Caza del Ciervo',
    situation: 'El laberinto se divide en dos rutas: la "Ruta del Ciervo" (un Bono Alfa Soberano de altísimo rendimiento que requiere coordinar el flujo con la Bóveda Central) y la "Ruta de la Liebre" (pequeños orbes de liquidez inmediata pero rendimiento mediocre que cualquiera puede capturar solo). ¿Qué estrategia eliges?',
    matrixPayoff: {
      playerCooperate: { rivalCooperate: 'Bono Alfa Soberano (+500 PTS)', rivalDefect: 'Te quedas sin cobertura (-1 Vida)' },
      playerDefect: { rivalCooperate: 'Cazas la Liebre (+100 PTS)', rivalDefect: 'Ambos cazan Liebres (+100 PTS)' }
    },
    options: [
      {
        id: 'opt-stag',
        label: 'Coordinar hacia el Bono Alfa Soberano (Equilibrio de Recompensa Óptima)',
        actionText: 'Alinear la ruta con la Bóveda Institucional confiando en la coordinación de mercado.',
        isOptimalNash: true,
        pointsReward: 450,
        livesDamage: 0,
        outcomeExplanation: '¡COORDINACIÓN PERFECTA! Ambos operadores mantuvieron la estrategia de alto rendimiento. Aseguras el Bono Alfa AAA con +450 PTS y congelas a los bots adversarios durante 6 segundos.'
      },
      {
        id: 'opt-hare',
        label: 'Asegurar la Liebre Menor (Equilibrio de Mínimo Riesgo)',
        actionText: 'Conformarse con migajas de liquidez por miedo a que el mercado falle.',
        isOptimalNash: false,
        pointsReward: 80,
        livesDamage: 0,
        outcomeExplanation: 'EQUILIBRIO SUBÓPTIMO: Evitaste el riesgo, pero el mercado capturó el valor superior. Solo recibes +80 PTS y los bots siguen persiguiéndote.'
      }
    ],
    educationalInsight: 'La Caza del Ciervo ilustra los juegos de coordinación con equilibrios múltiples: uno eficiente (Óptimo de Pareto / Ciervo) y otro seguro (Riesgo Dominante / Liebre). Para alcanzar el óptimo colectivo en mercados financieros, se requiere confianza y marcos regulatorios transparentes.'
  },
  {
    id: 'challenge-l3',
    levelId: 3,
    title: 'Juego Halcón-Paloma en la Pasarela KYC',
    theoryConcept: 'Halcón-Paloma',
    situation: 'Un Bot Especulador agresivo con derivado tóxico (Estrategia Halcón) avanza a gran velocidad de frente por un pasillo de vía única hacia la Pasarela KYC. Si ambos juegan Halcón (choque frontal sin ceder), se produce un accidente financiero con pérdida de vidas. Si juegas Paloma (desplegar un Cortafuegos y desviar el impacto), proteges tu capital.',
    matrixPayoff: {
      playerCooperate: { rivalCooperate: 'Tránsito pacífico (+200 PTS)', rivalDefect: 'Cedes paso / Bot gana ventaja' },
      playerDefect: { rivalCooperate: 'Dominas la vía (+400 PTS)', rivalDefect: 'Choque Catastrófico (-1 Vida)' }
    },
    options: [
      {
        id: 'opt-dove',
        label: 'Evasión Táctica / Paloma Inteligente: Activar Stop-Loss',
        actionText: 'Desplegar cortafuegos defensivo y cambiar de carril para aislar al bot tóxico.',
        isOptimalNash: true,
        pointsReward: 380,
        livesDamage: 0,
        outcomeExplanation: '¡TÁCTICA MINIMAX IMPECABLE! El bot agresivo se estrella contra tu cortafuegos y es enviado a Cuarentena. Ganas +380 PTS y neutralizas la amenaza.'
      },
      {
        id: 'opt-hawk',
        label: 'Acelerar de Frente (Halcón Especulativo)',
        actionText: 'Mantener el rumbo a ciegas esperando que el bot se retire a último momento.',
        isOptimalNash: false,
        pointsReward: 0,
        livesDamage: 1,
        outcomeExplanation: '¡IMPACTO DEVASTADOR! Dos Halcones no ceden jamás. El choque con el derivado tóxico drenó tus fondos. Has perdido 1 VIDA.'
      }
    ],
    educationalInsight: 'En el modelo Halcón-Paloma (o Juego de la Gallina de Maynard Smith), el peor resultado ocurre cuando ambos jugadores escogen la estrategia agresiva (Halcón-Halcón). El equilibrio evolutivamente estable consiste en saber cuándo aplicar un cortafuegos o stop-loss para mitigar riesgos sistémicos.'
  },
  {
    id: 'challenge-l4',
    levelId: 4,
    title: 'La Paradoja de Braess en el Corredor Financiero',
    theoryConcept: 'Paradoja de Braess',
    situation: 'El sistema ha abierto un nuevo "atajo de alta velocidad" en el corazón del laberinto. A primera vista parece más rápido, pero todos los algoritmos especuladores se han volcado simultáneamente hacia él, colapsando el throughput y atrayendo una horda de bots depredadores.',
    options: [
      {
        id: 'opt-braess-bypass',
        label: 'Evitar el Atajo Saturado y Mantener la Vía Regulada Perimetral',
        actionText: 'Desestimar el atajo congestionado y utilizar el canal perimetral protegido por KYC.',
        isOptimalNash: true,
        pointsReward: 420,
        livesDamage: 0,
        outcomeExplanation: '¡PARADOJA RESUELTA CON ÉXITO! Evitaste el atasco de equilibrios egoístas (Equilibrio de Wardrop). Mientras los rivales se atascan en el atajo, tú avanzas libremente hacia la Bóveda Central. +420 PTS.'
      },
      {
        id: 'opt-braess-shortcut',
        label: 'Meterse al Atajo Buscando Ventaja Inmediata',
        actionText: 'Intentar adelantar a los demás por la vía más corta.',
        isOptimalNash: false,
        pointsReward: 0,
        livesDamage: 1,
        outcomeExplanation: '¡ATRAPADO EN EL CUELLO DE BOTELLA! La congestión egoísta provocó que el tiempo de tránsito se multiplicara por cuatro y un bot te interceptara. Has perdido 1 VIDA.'
      }
    ],
    educationalInsight: 'La Paradoja de Braess demuestra matemáticamente que añadir capacidad a una red donde los usuarios eligen de forma egoísta puede degradar el rendimiento global. En finanzas, nuevos canales de arbitraje pueden generar mayor volatilidad y congestión en lugar de eficiencia.'
  },
  {
    id: 'challenge-l5',
    levelId: 5,
    title: 'Estrategia Minimax de von Neumann frente al Ataque Flash Loan',
    theoryConcept: 'Estrategia Minimax',
    situation: 'Un Bot Depredador de Flash Loans está utilizando inteligencia adversarial para calcular tu ruta determinista más corta hacia la Bóveda de Liquidación. Si tu movimiento es predecible, te interceptará en el siguiente giro.',
    options: [
      {
        id: 'opt-minimax-mixed',
        label: 'Aplicar Estrategia Mixta Aleatorizada y Barrera Táctica',
        actionText: 'Alternar nodos perimetrales con despliegue de cortafuegos para romper la previsibilidad del algoritmo rival.',
        isOptimalNash: true,
        pointsReward: 500,
        livesDamage: 0,
        outcomeExplanation: '¡TEOREMA MINIMAX CONQUISTADO! Tu estrategia mixta redujo la probabilidad de captura del depredador a 0. Desbloqueas la Bóveda Suprema con +500 PTS y multiplicador de victoria final.'
      },
      {
        id: 'opt-minimax-pure',
        label: 'Ruta Directa Predecible en Línea Recta',
        actionText: 'Moverse sin alternancia confiando únicamente en la velocidad del cursor.',
        isOptimalNash: false,
        pointsReward: 0,
        livesDamage: 1,
        outcomeExplanation: '¡PREDICCIÓN CONFIRMADA! El algoritmo Minimax del rival te esperó en el cuello de botella. Has perdido 1 VIDA.'
      }
    ],
    educationalInsight: 'El Teorema Minimax de John von Neumann es el fundamento de los juegos de suma cero para dos jugadores. Demuestra que existe un equilibrio óptimo en estrategias mixtas donde garantizas el mejor resultado posible frente al peor adversario.'
  }
];
