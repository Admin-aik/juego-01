import { LevelConfig } from '../models/game.models';

export const GAME_LEVELS: LevelConfig[] = [
  // ===================== NIVEL 1 =====================
  {
    id: 1,
    title: 'Nivel 1: Detección Primaria',
    codename: 'OP_CLEAN_SLATE',
    subtitle: 'Canales separados de correo interno vs. Spam masivo',
    briefing: 'Bienvenido, Operador. Tu misión inicial es despejar los canales de datos corporativos. Rota los nodos del router para asegurar que los correos legítimos lleguen al Servidor Central y el correo malicioso sea desviado hacia la Cuarentena.',
    gridWidth: 5,
    gridHeight: 5,
    maxMoves: 10,
    timeLimitSeconds: null,
    initialIntegrity: 100,
    powerUps: {
      firewalls: 1,
      scanners: 2,
      mfaTokens: 0
    },
    knowledgeCard: {
      id: 'card-l1',
      levelTrigger: 1,
      title: 'Spam Masivo vs. Comunicación Legítima',
      attackType: 'Phishing Genérico y Spam',
      threatLevel: 'Bajo',
      summary: 'El phishing no dirigido aprovecha plantillas genéricas enviadas a millones de buzones simulando loterías, premios o alertas impersonales.',
      realWorldImpact: 'El 85% de las organizaciones reciben ataques de spam masivo semanales buscando credenciales descuidadas.',
      redFlagsToCheck: [
        'Remitente genérico de dominio gratuito o extraño (.top, .xyz, .biz).',
        'Falta de encabezados de autenticación SPF y DKIM (Status: FAIL o NONE).',
        'Mensajes que prometen sumas millonarias o regalos inesperados.',
        'Saludos genéricos como "Estimado usuario" en lugar de tu nombre corporativo.'
      ],
      defenseGuidelines: [
        'Comprueba el encabezado Return-Path antes de interactuar.',
        'Nunca abras enlaces en correos no solicitados.',
        'Envía el paquete inmediatamente a la papelera o buzón de cuarentena.'
      ]
    },
    nodes: [
      // Fila 0
      { id: 'n-0-0', x: 0, y: 0, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n-1-0', x: 1, y: 0, type: 'corner_se', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: true, left: false } },
      { id: 'n-2-0', x: 2, y: 0, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n-3-0', x: 3, y: 0, type: 'corner_sw', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: false, down: true, left: true } },
      { id: 'n-4-0', x: 4, y: 0, type: 'quarantine', rotatable: false, rotation: 0, isActive: true, label: 'CUARENTENA', connections: { up: false, right: false, down: false, left: true } },

      // Fila 1
      { id: 'n-0-1', x: 0, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n-1-1', x: 1, y: 1, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n-2-1', x: 2, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n-3-1', x: 3, y: 1, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n-4-1', x: 4, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      // Fila 2 (Entradas centrales)
      { id: 'n-0-2', x: 0, y: 2, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n-1-2', x: 1, y: 2, type: 'router', rotatable: true, rotation: 0, isActive: false, label: 'SWITCH 1', connections: { up: true, right: true, down: true, left: true } },
      { id: 'n-2-2', x: 2, y: 2, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n-3-2', x: 3, y: 2, type: 'router', rotatable: true, rotation: 0, isActive: false, label: 'SWITCH 2', connections: { up: true, right: true, down: true, left: true } },
      { id: 'n-4-2', x: 4, y: 2, type: 'server_safe', rotatable: false, rotation: 0, isActive: true, label: 'SERVIDOR CENTRAL', connections: { up: false, right: false, down: false, left: true } },

      // Fila 3
      { id: 'n-0-3', x: 0, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n-1-3', x: 1, y: 3, type: 'straight_v', rotatable: true, rotation: 90, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n-2-3', x: 2, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n-3-3', x: 3, y: 3, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n-4-3', x: 4, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      // Fila 4
      { id: 'n-0-4', x: 0, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n-1-4', x: 1, y: 4, type: 'corner_ne', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: true, down: false, left: false } },
      { id: 'n-2-4', x: 2, y: 4, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n-3-4', x: 3, y: 4, type: 'corner_nw', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: false, left: true } },
      { id: 'n-4-4', x: 4, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
    ],
    packets: [
      {
        id: 'pkt-1-safe',
        label: 'RECIBO_NOMINA.PDF',
        category: 'invoice',
        isPhishing: false,
        subject: 'Comprobante Oficial de Nómina - RRHH',
        senderName: 'Recursos Humanos <rrhh@acme.corp>',
        previewText: 'Adjuntamos el desglose oficial de remuneraciones firmado con certificado PKI institucional.',
        headers: {
          fromAddress: 'rrhh@acme.corp',
          replyToAddress: 'rrhh@acme.corp',
          returnPath: '<bounces-rrhh@acme.corp>',
          ipOrigin: '198.51.100.24 (Red Interna)',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3 AES-GCM-256',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Encabezados criptográficos SPF y DKIM válidos con coincidencia exacta de dominio corporativo.',
        startNodeId: 'n-0-2',
        currentNodeId: 'n-0-2',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 2,
        visualX: 0,
        visualY: 2
      },
      {
        id: 'pkt-1-phish',
        label: 'PREMIO_50K_RECLAMO.EXE',
        category: 'payload',
        isPhishing: true,
        subject: '¡GANASTE 50,000 USD! Reclama tu premio aquí',
        senderName: 'Comité de Premios <claim@lottery-winner-fast.top>',
        previewText: 'Felicidades empleado del mes. Descarga el archivo adjunto para verificar tu cuenta y cobrar inmediatamente.',
        headers: {
          fromAddress: 'claim@lottery-winner-fast.top',
          replyToAddress: 'drop-wallet@anonymous-mail.ru',
          returnPath: '<bounce@spamhaus-flagged.xyz>',
          ipOrigin: '185.220.101.5 (Nodo Tor / VPN desconocida)',
          spf: 'FAIL',
          dkim: 'NONE',
          dmarc: 'FAIL',
          tlsVersion: 'Sin cifrado / HTTP Plain',
          suspiciousSubject: true
        },
        targetUrl: 'http://lottery-winner-fast.top/download/invoice_loader.exe',
        redFlags: [
          'Dominio remitente .top de reputación nula.',
          'SPF y DMARC en estado FAIL.',
          'Dirección Reply-To apunta a un buzón anónimo distinto al remitente.',
          'Intento de descarga de ejecutable (.exe) disfrazado de premio.'
        ],
        securityTip: 'Un atacante siempre usará la tentación de dinero rápido para que bypasses los filtros estándar.',
        startNodeId: 'n-0-0',
        currentNodeId: 'n-0-0',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 0,
        visualX: 0,
        visualY: 0
      }
    ]
  },

  // ===================== NIVEL 2 =====================
  {
    id: 2,
    title: 'Nivel 2: Bloqueos Cruzados (Spear Phishing)',
    codename: 'OP_SPEAR_INTERCEPT',
    subtitle: 'Suplantación de identidad ejecutiva interceptando rutas seguras',
    briefing: 'Alerta del SOC: Un atacante ha lanzado un ataque de Spear Phishing simulando la cuenta del CEO corporativo para forzar una transferencia. La ruta maliciosa cruza la tubería del contrato legal de la empresa. Reruta los nodos para enviar la estafa a Cuarentena sin dañar el documento legal.',
    gridWidth: 5,
    gridHeight: 5,
    maxMoves: 12,
    timeLimitSeconds: null,
    initialIntegrity: 100,
    powerUps: {
      firewalls: 1,
      scanners: 2,
      mfaTokens: 0
    },
    knowledgeCard: {
      id: 'card-l2',
      levelTrigger: 2,
      title: 'Spear Phishing & Fraude del CEO (BEC)',
      attackType: 'Business Email Compromise (BEC)',
      threatLevel: 'Alto',
      summary: 'El Spear Phishing es un ataque quirúrgico dirigido a empleados con poder financiero, suplantando a altos directivos con nombres casi idénticos.',
      realWorldImpact: 'El FBI reporta pérdidas superiores a 50 mil millones de dólares a nivel global por estafas de tipo Business Email Compromise.',
      redFlagsToCheck: [
        'Typosquatting en el dominio: @acme-corp-management.com en lugar de @acme.corp.',
        'Petición de "confidencialidad estricta" para evitar que consultes con colegas.',
        'Solicitud de cambio repentino de cuenta bancaria o compra de tarjetas de regalo.',
        'Remitente enviado desde cliente móvil no registrado (ej. "Enviado desde mi iPhone").'
      ],
      defenseGuidelines: [
        'Aplica verificación fuera de banda: llama por teléfono al directivo por canal seguro.',
        'Revisa exhaustivamente cada carácter del dominio del remitente.',
        'Cualquier solicitud de pago urgente debe pasar por el comité de finanzas.'
      ]
    },
    nodes: [
      { id: 'n2-0-0', x: 0, y: 0, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n2-1-0', x: 1, y: 0, type: 'corner_se', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: true, left: false } },
      { id: 'n2-2-0', x: 2, y: 0, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n2-3-0', x: 3, y: 0, type: 'corner_sw', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: false, down: true, left: true } },
      { id: 'n2-4-0', x: 4, y: 0, type: 'quarantine', rotatable: false, rotation: 0, isActive: true, label: 'CUARENTENA', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n2-0-1', x: 0, y: 1, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n2-1-1', x: 1, y: 1, type: 'router', rotatable: true, rotation: 90, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n2-2-1', x: 2, y: 1, type: 'cross', rotatable: false, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n2-3-1', x: 3, y: 1, type: 'router', rotatable: true, rotation: 180, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n2-4-1', x: 4, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n2-0-2', x: 0, y: 2, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n2-1-2', x: 1, y: 2, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n2-2-2', x: 2, y: 2, type: 'straight_v', rotatable: true, rotation: 90, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n2-3-2', x: 3, y: 2, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n2-4-2', x: 4, y: 2, type: 'server_safe', rotatable: false, rotation: 0, isActive: true, label: 'SERVIDOR CENTRAL', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n2-0-3', x: 0, y: 3, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n2-1-3', x: 1, y: 3, type: 'corner_ne', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: true, down: false, left: false } },
      { id: 'n2-2-3', x: 2, y: 3, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n2-3-3', x: 3, y: 3, type: 'corner_nw', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: false, left: true } },
      { id: 'n2-4-3', x: 4, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n2-0-4', x: 0, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n2-1-4', x: 1, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n2-2-4', x: 2, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n2-3-4', x: 3, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n2-4-4', x: 4, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } }
    ],
    packets: [
      {
        id: 'pkt-2-safe',
        label: 'CONTRATO_FIRMADO.PDF',
        category: 'email',
        isPhishing: false,
        subject: 'Acuerdo Confidencial Proveedores - Asesoría Legal',
        senderName: 'Asesoría Jurídica <legal@acme.corp>',
        previewText: 'Enviamos la copia final del acuerdo con verificación de firma digital conforme a la normativa.',
        headers: {
          fromAddress: 'legal@acme.corp',
          replyToAddress: 'legal@acme.corp',
          returnPath: '<bounces-legal@acme.corp>',
          ipOrigin: '198.51.100.12 (Mailserver DMZ)',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Dominio verificado y hash criptográfico SHA-256 congruente con la base interna.',
        startNodeId: 'n2-0-1',
        currentNodeId: 'n2-0-1',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 1,
        visualX: 0,
        visualY: 1
      },
      {
        id: 'pkt-2-phish',
        label: 'TRANSFERENCIA_URGENTE_CEO.EML',
        category: 'email',
        isPhishing: true,
        subject: 'URGENTE: Adquisición secreta de filial - Transferir hoy',
        senderName: 'Director Ejecutivo <director@acmme-corp-global.com>',
        previewText: 'Estoy en reunión de directorio. Necesito que liberes una orden de pago antes de las 18:00 sin avisar al equipo.',
        headers: {
          fromAddress: 'director@acmme-corp-global.com',
          replyToAddress: 'directorglobal@proton.me',
          returnPath: '<mailer-daemon@acmme-corp-global.com>',
          ipOrigin: '194.26.29.110 (Servidor Bulletproof en Europa del Este)',
          spf: 'FAIL',
          dkim: 'FAIL',
          dmarc: 'FAIL',
          tlsVersion: 'TLSv1.2 Sin validación cert',
          suspiciousSubject: true
        },
        targetUrl: 'http://acmme-corp-global.com/auth-direct/transfer_form.php',
        redFlags: [
          'Dominio fraudulento con letra duplicada: acmme-corp-global.com (Typosquatting).',
          'Reply-To redirige a una cuenta anónima de ProtonMail.',
          'Solicitud de secreto absoluto ("no avisar al equipo").',
          'DMARC en estado de rechazo por suplantación directa.'
        ],
        securityTip: 'Ningún CEO legítimo exige saltarse los controles financieros establecidos mediante un email imprevisto.',
        startNodeId: 'n2-0-0',
        currentNodeId: 'n2-0-0',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 0,
        visualX: 0,
        visualY: 0
      },
      {
        id: 'pkt-2-safe2',
        label: 'TOKEN_API_PAYROLL.JSON',
        category: 'token',
        isPhishing: false,
        subject: 'Rotación periódica de clave de integración API',
        senderName: 'DevSecOps Bot <devsecops@acme.corp>',
        previewText: 'Token JWT firmado por la entidad emisora interna para la sincronización de nómina de fin de mes.',
        headers: {
          fromAddress: 'devsecops@acme.corp',
          replyToAddress: 'devsecops@acme.corp',
          returnPath: '<bounces-devops@acme.corp>',
          ipOrigin: '10.0.4.88 (Kubernetes Cluster Privado)',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'mTLS Mutual Auth TLS 1.3',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Paquete de mTLS interno con certificado corporativo emitido por la CA raíz corporativa.',
        startNodeId: 'n2-0-3',
        currentNodeId: 'n2-0-3',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 3,
        visualX: 0,
        visualY: 3
      }
    ]
  },

  // ===================== NIVEL 3 =====================
  {
    id: 3,
    title: 'Nivel 3: Trampas de Urgencia Psicológica',
    codename: 'OP_PRESSURE_GATE',
    subtitle: 'Presión por tiempo y falsas alarmas de suspensión de cuentas',
    briefing: '¡Alerta de pánico social! El atacante ha inyectado correos con cuentas atrás falsas ("Su cuenta será eliminada en 15 minutos"). Tu tiempo en la consola es limitado a 60 segundos. Despeja el tráfico antes de que el temporizador venza.',
    gridWidth: 5,
    gridHeight: 5,
    maxMoves: 14,
    timeLimitSeconds: 60,
    initialIntegrity: 100,
    powerUps: {
      firewalls: 2,
      scanners: 2,
      mfaTokens: 0
    },
    knowledgeCard: {
      id: 'card-l3',
      levelTrigger: 3,
      title: 'Ingeniería Social & Gatillos de Urgencia',
      attackType: 'Phishing por Manipulación Psicológica',
      threatLevel: 'Alto',
      summary: 'Los atacantes crean una falsa sensación de catástrofe inmediata ("Tu acceso será revocado hoy") para apagar el pensamiento analítico de la víctima.',
      realWorldImpact: 'El 70% de los clics en enlaces maliciosos se producen dentro de los primeros 10 minutos tras recibir el correo por miedo a consecuencias laborales.',
      redFlagsToCheck: [
        'Lenguaje amenazante: "Última advertencia", "Cuenta suspendida", "Acción legal inmediata".',
        'Temporizadores o plazos artificialmente breves (menos de 24 horas).',
        'Enlaces acortados o botones de acción enormes como "VERIFICAR AHORA MISMO".',
        'El remitente no coincide con el centro de soporte oficial del servicio.'
      ],
      defenseGuidelines: [
        'Haz una pausa de 60 segundos: la urgencia es el arma número uno del estafador.',
        'Accede al portal oficial escribiendo la URL manualmente en el navegador.',
        'Reporta el correo al centro de operaciones de seguridad de tu empresa.'
      ]
    },
    nodes: [
      { id: 'n3-0-0', x: 0, y: 0, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n3-1-0', x: 1, y: 0, type: 'router', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n3-2-0', x: 2, y: 0, type: 'straight_h', rotatable: true, rotation: 90, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n3-3-0', x: 3, y: 0, type: 'corner_sw', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: false, down: true, left: true } },
      { id: 'n3-4-0', x: 4, y: 0, type: 'quarantine', rotatable: false, rotation: 0, isActive: true, label: 'CUARENTENA', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n3-0-1', x: 0, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n3-1-1', x: 1, y: 1, type: 'straight_v', rotatable: true, rotation: 90, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n3-2-1', x: 2, y: 1, type: 'router', rotatable: true, rotation: 270, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n3-3-1', x: 3, y: 1, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n3-4-1', x: 4, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n3-0-2', x: 0, y: 2, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n3-1-2', x: 1, y: 2, type: 'cross', rotatable: false, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n3-2-2', x: 2, y: 2, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n3-3-2', x: 3, y: 2, type: 'router', rotatable: true, rotation: 180, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n3-4-2', x: 4, y: 2, type: 'server_safe', rotatable: false, rotation: 0, isActive: true, label: 'SERVIDOR CENTRAL', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n3-0-3', x: 0, y: 3, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n3-1-3', x: 1, y: 3, type: 'corner_ne', rotatable: true, rotation: 90, isActive: false, connections: { up: false, right: true, down: true, left: false } },
      { id: 'n3-2-3', x: 2, y: 3, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n3-3-3', x: 3, y: 3, type: 'corner_nw', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: false, left: true } },
      { id: 'n3-4-3', x: 4, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n3-0-4', x: 0, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n3-1-4', x: 1, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n3-2-4', x: 2, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n3-3-4', x: 3, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n3-4-4', x: 4, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } }
    ],
    packets: [
      {
        id: 'pkt-3-phish1',
        label: 'ALERTA_SUSPENSION_O365.HTM',
        category: 'payload',
        isPhishing: true,
        subject: 'ÚLTIMO AVISO: Tu cuenta corporativa será suspendida en 15 minutos',
        senderName: 'Soporte Cloud <admin-noreply@microsoft-online-verify365.info>',
        previewText: 'Se ha detectado una infracción de seguridad. Haz clic aquí inmediatamente o perderás el acceso a todos tus correos y archivos corporativos.',
        headers: {
          fromAddress: 'admin-noreply@microsoft-online-verify365.info',
          replyToAddress: 'support@external-trap.com',
          returnPath: '<bounces@verify365.info>',
          ipOrigin: '91.240.118.15',
          spf: 'FAIL',
          dkim: 'NONE',
          dmarc: 'FAIL',
          tlsVersion: 'TLSv1.2 certificado autofirmado',
          suspiciousSubject: true
        },
        targetUrl: 'https://microsoft-online-verify365.info/login/session-steal',
        redFlags: [
          'Dominio de tercer nivel que imita a Microsoft (Typosquatting/Homógrafo).',
          'Urgencia extrema diseñada para inducir pánico irracional.',
          'Certificado SSL no emitido por la CA oficial de Microsoft Corporation.',
          'Solicitud de re-ingresar usuario y contraseña en página externa.'
        ],
        securityTip: 'Los proveedores legítimos nunca amenazan con borrar tus datos en 15 minutos sin previo aviso a tu departamento de TI.',
        startNodeId: 'n3-0-0',
        currentNodeId: 'n3-0-0',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 0,
        visualX: 0,
        visualY: 0
      },
      {
        id: 'pkt-3-safe',
        label: 'BACKUP_DATABASE_KEY.PEM',
        category: 'token',
        isPhishing: false,
        subject: 'Copia de seguridad encriptada semanal de bases de datos',
        senderName: 'Backup Orchestrator <backup-daemon@acme.corp>',
        previewText: 'Respaldo con suma de comprobación SHA-512 verificado por la política de retención de desastres.',
        headers: {
          fromAddress: 'backup-daemon@acme.corp',
          replyToAddress: 'backup-daemon@acme.corp',
          returnPath: '<bounces-backup@acme.corp>',
          ipOrigin: '10.24.1.5',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Tráfico de backup interno autorizado por la matriz de cortafuegos perimetral.',
        startNodeId: 'n3-0-2',
        currentNodeId: 'n3-0-2',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 2,
        visualX: 0,
        visualY: 2
      },
      {
        id: 'pkt-3-phish2',
        label: 'ACTUALIZACION_BANCO_FALSA.PHP',
        category: 'payload',
        isPhishing: true,
        subject: 'Banco Corporativo: Validación de token obligatoria por bloqueo',
        senderName: 'Seguridad Banca <alertas@banco-santander-empresas-online.top>',
        previewText: 'Hemos bloqueado sus tarjetas empresariales por movimientos no reconocidos. Ingrese sus claves de firma electrónica de inmediato.',
        headers: {
          fromAddress: 'alertas@banco-santander-empresas-online.top',
          replyToAddress: 'harvest@banco-santander-empresas-online.top',
          returnPath: '<bounce@spam-relay.cz>',
          ipOrigin: '193.106.191.22',
          spf: 'FAIL',
          dkim: 'FAIL',
          dmarc: 'FAIL',
          tlsVersion: 'TLSv1.0 Anticuado',
          suspiciousSubject: true
        },
        targetUrl: 'http://banco-santander-empresas-online.top/login-secure',
        redFlags: [
          'Dominio bancario falso alojado en TLD .top.',
          'Solicita ingresar códigos de token físico y contraseñas maestras.',
          'Falta total de cifrado TLS moderno (usa protocolo inseguro).',
          'Gramática descuidada con palabras mal traducidas.'
        ],
        securityTip: 'Los bancos jamás solicitan tus claves completas o tokens por correo electrónico.',
        startNodeId: 'n3-0-3',
        currentNodeId: 'n3-0-3',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 3,
        visualX: 0,
        visualY: 3
      }
    ]
  },

  // ===================== NIVEL 4 =====================
  {
    id: 4,
    title: 'Nivel 4: Capas Múltiples & Pasarela MFA',
    codename: 'OP_MFA_CITADEL',
    subtitle: 'Autenticación de Doble Factor protegiendo el núcleo de la red',
    briefing: 'Hemos activado la Pasarela de Doble Factor (MFA Gateway) en la entrada del Servidor Central. Ningún paquete puede entrar hasta que desbloquees la pasarela con tu Token Criptográfico MFA. Cuidado: los atacantes intentan colar ataques de Fatiga MFA (MFA Prompt Bombing).',
    gridWidth: 5,
    gridHeight: 5,
    maxMoves: 16,
    timeLimitSeconds: null,
    initialIntegrity: 100,
    powerUps: {
      firewalls: 2,
      scanners: 3,
      mfaTokens: 2
    },
    knowledgeCard: {
      id: 'card-l4',
      levelTrigger: 4,
      title: 'MFA y Ataques de Fatiga de Notificaciones (MFA Bombing)',
      attackType: 'MFA Fatigue / Push Bombing',
      threatLevel: 'Crítico',
      summary: 'Cuando un atacante obtiene tu contraseña, satura tu teléfono móvil con docenas de solicitudes de aprobación push con la esperanza de que aceptes una por cansancio o distracción.',
      realWorldImpact: 'Grandes brechas históricas como las de Uber y Cisco en 2022 se originaron por empleados que aceptaron solicitudes de MFA bajo cansancio nocturno.',
      redFlagsToCheck: [
        'Múltiples notificaciones de MFA en tu app autenticadora sin haber intentado iniciar sesión.',
        'Llamadas telefónicas de supuestos "técnicos de TI" pidiéndote que apruebes el código.',
        'Solicitudes de autenticación originadas desde ubicaciones geográficas extrañas.',
        'Intentos continuos a altas horas de la madrugada.'
      ],
      defenseGuidelines: [
        'Nunca aceptes una solicitud push de MFA que tú no hayas provocado.',
        'Utiliza métodos de MFA resistentes al phishing: FIDO2 / Passkeys WebAuthn o Number Matching.',
        'Cambia tu contraseña inmediatamente si recibes spam de MFA: significa que tu clave fue filtrada.'
      ]
    },
    nodes: [
      { id: 'n4-0-0', x: 0, y: 0, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n4-1-0', x: 1, y: 0, type: 'router', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n4-2-0', x: 2, y: 0, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n4-3-0', x: 3, y: 0, type: 'corner_sw', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: false, down: true, left: true } },
      { id: 'n4-4-0', x: 4, y: 0, type: 'quarantine', rotatable: false, rotation: 0, isActive: true, label: 'CUARENTENA', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n4-0-1', x: 0, y: 1, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n4-1-1', x: 1, y: 1, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n4-2-1', x: 2, y: 1, type: 'cross', rotatable: false, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n4-3-1', x: 3, y: 1, type: 'router', rotatable: true, rotation: 90, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n4-4-1', x: 4, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n4-0-2', x: 0, y: 2, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n4-1-2', x: 1, y: 2, type: 'router', rotatable: true, rotation: 180, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n4-2-2', x: 2, y: 2, type: 'mfa_gate', rotatable: false, rotation: 0, isActive: false, isMfaLocked: true, label: 'PUERTA MFA', connections: { up: false, right: true, down: false, left: true } },
      { id: 'n4-3-2', x: 3, y: 2, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n4-4-2', x: 4, y: 2, type: 'server_safe', rotatable: false, rotation: 0, isActive: true, label: 'SERVIDOR CENTRAL', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n4-0-3', x: 0, y: 3, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n4-1-3', x: 1, y: 3, type: 'corner_ne', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: true, down: false, left: false } },
      { id: 'n4-2-3', x: 2, y: 3, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n4-3-3', x: 3, y: 3, type: 'corner_nw', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: false, left: true } },
      { id: 'n4-4-3', x: 4, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n4-0-4', x: 0, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n4-1-4', x: 1, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n4-2-4', x: 2, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n4-3-4', x: 3, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n4-4-4', x: 4, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } }
    ],
    packets: [
      {
        id: 'pkt-4-safe1',
        label: 'AUTH_SESSION_TOKEN_FIDO2.BIN',
        category: 'token',
        isPhishing: false,
        subject: 'Clave pública de autenticación biométrica WebAuthn',
        senderName: 'Identity Provider <auth@iam.acme.corp>',
        previewText: 'Desafío criptográfico firmado por hardware TPM local para acceso al datacenter.',
        headers: {
          fromAddress: 'auth@iam.acme.corp',
          replyToAddress: 'auth@iam.acme.corp',
          returnPath: '<bounces-auth@iam.acme.corp>',
          ipOrigin: '10.5.0.2',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3 ECDHE-RSA',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Firma de autenticación multifactor basada en hardware resistente al phishing.',
        startNodeId: 'n4-0-1',
        currentNodeId: 'n4-0-1',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 1,
        visualX: 0,
        visualY: 1
      },
      {
        id: 'pkt-4-phish1',
        label: 'MFA_PUSH_SPAM_BOTNET.EXE',
        category: 'payload',
        isPhishing: true,
        subject: 'MFA Spam: "¿Eres tú intentando acceder desde Vladivostok?"',
        senderName: 'Notificación Push <push-verify@fake-authenticator-portal.com>',
        previewText: 'Acepta la notificación número 47 para silenciar las alertas sonoras en tu móvil de emergencia.',
        headers: {
          fromAddress: 'push-verify@fake-authenticator-portal.com',
          replyToAddress: 'push-trap@fake-authenticator-portal.com',
          returnPath: '<bounce@botnet-swarm.xyz>',
          ipOrigin: '103.251.167.20',
          spf: 'FAIL',
          dkim: 'FAIL',
          dmarc: 'FAIL',
          tlsVersion: 'Inseguro',
          suspiciousSubject: true
        },
        targetUrl: 'http://fake-authenticator-portal.com/approve-push',
        redFlags: [
          'Solicitud de MFA no iniciada por el operador.',
          'Intento de fatiga psicológica ("Acepta para silenciar las alertas").',
          'Origen de IP no habitual en el registro corporativo.'
        ],
        securityTip: 'Si recibes solicitudes de MFA que no pediste, no las aceptes: presiona "Denegar y reportar".',
        startNodeId: 'n4-0-0',
        currentNodeId: 'n4-0-0',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 0,
        visualX: 0,
        visualY: 0
      },
      {
        id: 'pkt-4-safe2',
        label: 'FACTURA_DATACENTER_MARZO.PDF',
        category: 'invoice',
        isPhishing: false,
        subject: 'Consumo de servidores cloud corporativos - Factura aprobada',
        senderName: 'Cloud Billing <invoices@cloudprovider-verified.com>',
        previewText: 'Estado de cuenta mensual conforme al contrato marco corporativo firmado con orden de compra #PO-9912.',
        headers: {
          fromAddress: 'invoices@cloudprovider-verified.com',
          replyToAddress: 'invoices@cloudprovider-verified.com',
          returnPath: '<bounces-invoices@cloudprovider-verified.com>',
          ipOrigin: '54.240.11.2',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Coincidencia con número de orden de compra existente en ERP corporativo.',
        startNodeId: 'n4-0-3',
        currentNodeId: 'n4-0-3',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 3,
        visualX: 0,
        visualY: 3
      }
    ]
  },

  // ===================== NIVEL 5 =====================
  {
    id: 5,
    title: 'Nivel 5: Ataque Cero & Deep Packet Inspection',
    codename: 'OP_ZERO_DAY_SHIELD',
    subtitle: 'Ransomware ofuscado con extensión doble y sandbox avanzado',
    briefing: '¡Intrusión de nivel crítico! Un grupo APT ha inyectado un malware con doble extensión (".pdf.exe") que intenta cifrar las bases de datos de la empresa. Utiliza tus herramientas tácticas (Firewall Blocker y Antivirus Scanner) para purgar la red corporativa.',
    gridWidth: 5,
    gridHeight: 5,
    maxMoves: 18,
    timeLimitSeconds: 75,
    initialIntegrity: 100,
    powerUps: {
      firewalls: 3,
      scanners: 3,
      mfaTokens: 2
    },
    knowledgeCard: {
      id: 'card-l5',
      levelTrigger: 5,
      title: 'Ransomware, Extensiones Dobles y Sandboxing',
      attackType: 'Ransomware Dropper & Evasión de Filtros',
      threatLevel: 'Crítico',
      summary: 'Los atacantes aprovechan que Windows oculta las extensiones conocidas por defecto para enviar archivos como "Factura_urgente.pdf.exe", haciendo que la víctima crea que es un simple PDF.',
      realWorldImpact: 'El rescate promedio exigido por ransomware supera los 1.5 millones de dólares, más semanas de interrupción operativa completa.',
      redFlagsToCheck: [
        'Archivos con doble extensión como .pdf.exe, .docx.scr o .xlsx.vbs.',
        'Archivos comprimidos protegidos con contraseña en el cuerpo del correo (para evadir antivirus perimetral).',
        'Documentos de Office que solicitan "Habilitar macros" para ver el contenido.',
        'Icono de documento PDF pero tipo de elemento "Aplicación / Ejecutable".'
      ],
      defenseGuidelines: [
        'Configura el sistema operativo para mostrar siempre las extensiones de archivo completas.',
        'Nunca ejecutes macros en documentos descargados de fuentes externas.',
        'Aísla cualquier archivo sospechoso en un Sandbox de análisis dinámico antes de abrirlo.'
      ]
    },
    nodes: [
      { id: 'n5-0-0', x: 0, y: 0, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n5-1-0', x: 1, y: 0, type: 'router', rotatable: true, rotation: 90, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n5-2-0', x: 2, y: 0, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n5-3-0', x: 3, y: 0, type: 'corner_sw', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: false, down: true, left: true } },
      { id: 'n5-4-0', x: 4, y: 0, type: 'quarantine', rotatable: false, rotation: 0, isActive: true, label: 'CUARENTENA', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n5-0-1', x: 0, y: 1, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n5-1-1', x: 1, y: 1, type: 'cross', rotatable: false, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n5-2-1', x: 2, y: 1, type: 'router', rotatable: true, rotation: 180, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n5-3-1', x: 3, y: 1, type: 'straight_v', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: true, left: false } },
      { id: 'n5-4-1', x: 4, y: 1, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n5-0-2', x: 0, y: 2, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n5-1-2', x: 1, y: 2, type: 'straight_v', rotatable: true, rotation: 90, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n5-2-2', x: 2, y: 2, type: 'mfa_gate', rotatable: false, rotation: 0, isActive: false, isMfaLocked: true, label: 'PASARELA MFA', connections: { up: true, right: true, down: true, left: true } },
      { id: 'n5-3-2', x: 3, y: 2, type: 'router', rotatable: true, rotation: 270, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n5-4-2', x: 4, y: 2, type: 'server_safe', rotatable: false, rotation: 0, isActive: true, label: 'SERVIDOR CENTRAL', connections: { up: false, right: false, down: false, left: true } },

      { id: 'n5-0-3', x: 0, y: 3, type: 'straight_h', rotatable: false, rotation: 0, isActive: true, connections: { up: false, right: true, down: false, left: false } },
      { id: 'n5-1-3', x: 1, y: 3, type: 'router', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: true, down: true, left: true } },
      { id: 'n5-2-3', x: 2, y: 3, type: 'straight_h', rotatable: true, rotation: 0, isActive: false, connections: { up: false, right: true, down: false, left: true } },
      { id: 'n5-3-3', x: 3, y: 3, type: 'corner_nw', rotatable: true, rotation: 0, isActive: false, connections: { up: true, right: false, down: false, left: true } },
      { id: 'n5-4-3', x: 4, y: 3, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },

      { id: 'n5-0-4', x: 0, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n5-1-4', x: 1, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n5-2-4', x: 2, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n5-3-4', x: 3, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } },
      { id: 'n5-4-4', x: 4, y: 4, type: 'empty', rotatable: false, rotation: 0, isActive: false, connections: { up: false, right: false, down: false, left: false } }
    ],
    packets: [
      {
        id: 'pkt-5-phish1',
        label: 'FACTURA_PENDIENTE_URGENTE.PDF.EXE',
        category: 'payload',
        isPhishing: true,
        subject: 'RECLAMO JUDICIAL: Factura impaga y orden de embargo',
        senderName: 'Tribunal Mercantil <notificaciones@embargos-expediente-judicial.cc>',
        previewText: 'Se adjunta copia de la demanda interpuesta contra su empresa. Debe ejecutar el visor de expedientes para comparecer.',
        headers: {
          fromAddress: 'notificaciones@embargos-expediente-judicial.cc',
          replyToAddress: 'c2-server@darkweb-tor-relay.onion',
          returnPath: '<bounces@embargos-expediente-judicial.cc>',
          ipOrigin: '185.190.140.55 (C2 de LockBit / BlackCat)',
          spf: 'FAIL',
          dkim: 'NONE',
          dmarc: 'FAIL',
          tlsVersion: 'Inseguro',
          suspiciousSubject: true
        },
        targetUrl: 'http://embargos-expediente-judicial.cc/payload/ransom_encryptor.exe',
        redFlags: [
          'Doble extensión (.pdf.exe) para ocultar el binario malicioso.',
          'Uso de términos judiciales intimidatorios sin número de causa verificable.',
          'Dirección Reply-To apunta a un servidor Command & Control (C2).',
          'Intento de secuestro de archivos de red (Ransomware).'
        ],
        securityTip: 'Los juzgados oficiales nunca envían resoluciones judiciales en ejecutables .exe por correo electrónico.',
        startNodeId: 'n5-0-0',
        currentNodeId: 'n5-0-0',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 0,
        visualX: 0,
        visualY: 0
      },
      {
        id: 'pkt-5-safe1',
        label: 'ACTUALIZACION_KERNEL_LINUX.TAR.GZ',
        category: 'token',
        isPhishing: false,
        subject: 'Parche de seguridad urgente del sistema operativo',
        senderName: 'Infraestructura Dev <infra@acme.corp>',
        previewText: 'Actualización firmada por clave GPG de la distribución oficial para mitigar vulnerabilidades CVE.',
        headers: {
          fromAddress: 'infra@acme.corp',
          replyToAddress: 'infra@acme.corp',
          returnPath: '<bounces-infra@acme.corp>',
          ipOrigin: '10.0.1.2',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Firma GPG del mantenedor verificada correctamente contra el repositorio de confianza.',
        startNodeId: 'n5-0-1',
        currentNodeId: 'n5-0-1',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 1,
        visualX: 0,
        visualY: 1
      },
      {
        id: 'pkt-5-safe2',
        label: 'TRANSACCION_SWIFT_BANCARIA.XML',
        category: 'invoice',
        isPhishing: false,
        subject: 'Confirmación SWIFT MT103 de pago a proveedores',
        senderName: 'Tesoreria Central <treasury@acme.corp>',
        previewText: 'Comprobante financiero verificado por el departamento de finanzas y tesorería con hash seguro.',
        headers: {
          fromAddress: 'treasury@acme.corp',
          replyToAddress: 'treasury@acme.corp',
          returnPath: '<bounces-treasury@acme.corp>',
          ipOrigin: '10.0.8.10',
          spf: 'PASS',
          dkim: 'PASS',
          dmarc: 'PASS',
          tlsVersion: 'TLSv1.3 mTLS',
          suspiciousSubject: false
        },
        redFlags: [],
        securityTip: 'Tráfico SWIFT institucional con canal seguro mTLS y certificado de banca verificado.',
        startNodeId: 'n5-0-3',
        currentNodeId: 'n5-0-3',
        direction: 'right',
        isBlocked: false,
        status: 'idle',
        gridX: 0,
        gridY: 3,
        visualX: 0,
        visualY: 3
      }
    ]
  }
];
