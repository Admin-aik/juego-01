export interface TriviaOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface CyberTriviaQuestion {
  id: string;
  levelTrigger: number;
  topic: string;
  badge: string;
  readingContext: string;
  question: string;
  options: TriviaOption[];
  rewardPoints: number;
}

export const CYBER_TRIVIA_QUESTIONS: CyberTriviaQuestion[] = [
  {
    id: 'trivia-1',
    levelTrigger: 1,
    topic: 'Certificados de Autenticación 2FA',
    badge: 'AUTENTICACIÓN ROBUSTA',
    readingContext: 'En las redes de servidores corporativos de CifraFlow, la autenticación de doble factor (2FA) combina algo que el analista sabe (contraseña o token hash) con algo que posee (llave de seguridad física FIDO2 o app autenticadora TOTP). Este escudo neutraliza hasta el 99.9% de los ataques automatizados de bots de phishing.',
    question: 'Según el texto, ¿por qué los Certificados 2FA logran neutralizar los ataques de bots de phishing aunque la contraseña haya sido comprometida?',
    options: [
      {
        id: 'opt-a',
        text: 'Porque requieren un segundo factor físico o temporal que el atacante remoto no posee.',
        isCorrect: true,
        feedback: '¡Correcto! El atacante con la contraseña no puede completar el desafío criptográfico sin el dispositivo físico o clave temporal del usuario.'
      },
      {
        id: 'opt-b',
        text: 'Porque eliminan por completo la necesidad de servidores y cables de red.',
        isCorrect: false,
        feedback: 'Incorrecto. Los servidores siguen existiendo; 2FA agrega una capa de validación criptográfica.'
      },
      {
        id: 'opt-c',
        text: 'Porque aumentan automáticamente la velocidad de descarga a internet.',
        isCorrect: false,
        feedback: 'Incorrecto. El 2FA es un protocolo de seguridad y verificación, no una mejora de ancho de banda.'
      }
    ],
    rewardPoints: 150
  },
  {
    id: 'trivia-2',
    levelTrigger: 2,
    topic: 'Vectores de Phishing y Spoofing (Pinky)',
    badge: 'ANTI-INGENIERÍA SOCIAL',
    readingContext: 'El Bot de Phishing (representado por Pinky) no persigue al analista de frente; calcula nodos por delante para interceptar sus credenciales en un punto de enlace simulado (sitio clonado o correo falsificado). Identificar anomalías en los encabezados SPF/DKIM y certificados SSL permite evadir la trampa antes de ingresar credenciales.',
    question: '¿Cuál es la estrategia clave del Bot de Phishing y cómo debe reaccionar el analista de CifraFlow?',
    options: [
      {
        id: 'opt-a',
        text: 'Se anticipa a la ruta del usuario con sitios fraudulentos; se previene verificando firmas criptográficas y dominios.',
        isCorrect: true,
        feedback: '¡Exacto! El phishing busca adelantarse a la víctima creando falsas pasarelas de inicio de sesión.'
      },
      {
        id: 'opt-b',
        text: 'Ataca con fuerza bruta desconectando la electricidad del servidor.',
        isCorrect: false,
        feedback: 'Incorrecto. El phishing es un ataque de engaño y suplantación, no un corte físico de energía.'
      },
      {
        id: 'opt-c',
        text: 'Envía únicamente archivos comprimidos vacíos sin código malicioso.',
        isCorrect: false,
        feedback: 'Incorrecto. El phishing busca recolectar credenciales mediante enlaces o formularios fraudulentos.'
      }
    ],
    rewardPoints: 150
  },
  {
    id: 'trivia-3',
    levelTrigger: 3,
    topic: 'Gusano de Inflación y Devaluación de Capital',
    badge: 'ESTRATEGIA FINANCIERA',
    readingContext: 'En los sistemas financieros tokenizados, el Gusano de Inflación (Blinky) opera como un drenador continuo de reservas. Si el analista colisiona repetidamente con amenazas sin activar el Firewall 2FA, su balance de capital cae en saldo negativo (ej. -50 pts, -100 pts), forzando una liquidación por falta de liquidez.',
    question: '¿Qué consecuencia inmediata produce en el juego la acumulación reiterada de fugas de datos sin mitigación?',
    options: [
      {
        id: 'opt-a',
        text: 'El capital acumulado pasa a saldos negativos con alerta roja neón y riesgo de pérdida de vidas de solvencia.',
        isCorrect: true,
        feedback: '¡Muy bien! El sistema registra fielmente las pérdidas de capital reflejando la insolvencia real del analista.'
      },
      {
        id: 'opt-b',
        text: 'Se duplica automáticamente la cantidad de monedas en el mapa.',
        isCorrect: false,
        feedback: 'Incorrecto. Las fallas de seguridad drenan capital, no lo incrementan.'
      },
      {
        id: 'opt-c',
        text: 'El juego se pausa de forma permanente sin permitir reintentar.',
        isCorrect: false,
        feedback: 'Incorrecto. El jugador puede revertir o reintentar gestionando adecuadamente sus escudos y tokens.'
      }
    ],
    rewardPoints: 150
  },
  {
    id: 'trivia-4',
    levelTrigger: 4,
    topic: 'Túneles VPN y Teletransporte de Paquetes',
    badge: 'CRIPTOGRAFÍA DE RED',
    readingContext: 'Las puertas de enlace VPN conectan extremos opuestos del laberinto mediante túneles cifrados IPSec/WireGuard. Al ingresar por el túnel lateral izquierdo, el flujo de paquetes emerge instantáneamente en el margen derecho, permitiendo al analista romper la línea de visión del Gusano de Inflación.',
    question: '¿Qué ventaja táctica otorgan los túneles VPN laterales en la teoría de laberintos de red?',
    options: [
      {
        id: 'opt-a',
        text: 'Permiten teletransportarse entre extremos del grafo rompiendo el cálculo determinista de persecución de los atacantes.',
        isCorrect: true,
        feedback: '¡Excelente! La discontinuidad espacial del túnel VPN confunde la heurística euclidiana de los perseguidores.'
      },
      {
        id: 'opt-b',
        text: 'Hacen que todos los enemigos desaparezcan para siempre del juego.',
        isCorrect: false,
        feedback: 'Incorrecto. Los enemigos continúan activos; el túnel simplemente ofrece una vía de escape táctica.'
      },
      {
        id: 'opt-c',
        text: 'Cambian el idioma de la computadora del jugador.',
        isCorrect: false,
        feedback: 'Incorrecto. La VPN tuneliza tráfico cifrado, no altera la configuración regional del sistema.'
      }
    ],
    rewardPoints: 150
  },
  {
    id: 'trivia-5',
    levelTrigger: 5,
    topic: 'Troyano de Suplantación (Clyde) y Retracción a Cuarentena',
    badge: 'ANÁLISIS DE MALWARE',
    readingContext: 'El Troyano de Suplantación (Clyde) posee una lógica dual: si el analista está lejos (> 6 nodos), el troyano busca acercarse disimulando su carga dañina; sin embargo, cuando el analista se aproxima directamente para auditarlo, el troyano huye a su nodo de cuarentena por temor a ser desenmascarado.',
    question: '¿Qué principio de ciberseguridad modela el comportamiento del Troyano Clyde al huir cuando es investigado de cerca?',
    options: [
      {
        id: 'opt-a',
        text: 'La evasión activa y ofuscación: el malware sofisticado desactiva sus rutinas visibles al detectar que está siendo auditado en un sandbox.',
        isCorrect: true,
        feedback: '¡Exacto! El malware avanzado detecta herramientas forenses o investigadores y entra en modo sigilo para no ser aislado.'
      },
      {
        id: 'opt-b',
        text: 'Que los virus se cansan y necesitan dormir después de 5 minutos.',
        isCorrect: false,
        feedback: 'Incorrecto. El software malicioso no tiene fatiga física; responde a reglas algorítmicas de evasión.'
      },
      {
        id: 'opt-c',
        text: 'Que el troyano solo ataca cuando la pantalla está apagada.',
        isCorrect: false,
        feedback: 'Incorrecto. Opera en tiempo real basándose en la distancia y los sensores de detección del sistema.'
      }
    ],
    rewardPoints: 150
  }
];
