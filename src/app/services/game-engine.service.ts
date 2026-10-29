import { Injectable, computed, signal, inject } from '@angular/core';
import { GAME_LEVELS } from '../data/levels.data';
import { LevelConfig, GridNode, DataPacket, SecurityEventLog, Direction, MazeTheoryChallenge, MazeChallengeOption } from '../models/game.models';
import { MAZE_THEORY_CHALLENGES } from '../data/maze-theory-challenges.data';
import { CYBER_TRIVIA_QUESTIONS, CyberTriviaQuestion, TriviaOption } from '../data/trivia-cybersecurity.data';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  private sound = inject(SoundService);

  public readonly allLevels = GAME_LEVELS;
  public currentLevelIndex = signal<number>(0);

  public currentLevel = computed<LevelConfig>(() => {
    const idx = Math.min(Math.max(0, this.currentLevelIndex()), this.allLevels.length - 1);
    return this.allLevels[idx];
  });

  public nodes = signal<GridNode[]>([]);
  public packets = signal<DataPacket[]>([]);
  public shieldIntegrity = signal<number>(100);
  public movesRemaining = signal<number | null>(null);
  public timeRemaining = signal<number | null>(null);
  public safeDeliveredCount = signal<number>(0);
  public threatsQuarantinedCount = signal<number>(0);
  public isDispatching = signal<boolean>(false);
  public selectedTool = signal<'none' | 'firewall' | 'scanner' | 'mfa'>('none');
  
  public firewallStock = signal<number>(1);
  public scannerStock = signal<number>(2);
  public mfaStock = signal<number>(0);

  public inspectingPacket = signal<DataPacket | null>(null);
  public selectedPacketId = signal<string | null>(null);
  public activeSelectedPacket = computed(() => this.packets().find(p => p.id === this.selectedPacketId()) || null);
  public isTransitioningToNext = signal<boolean>(false);
  public showingKnowledgeCard = signal<boolean>(false);
  public showingUnityHub = signal<boolean>(false);
  public showingThreatEncyclopedia = signal<boolean>(false);
  public showingCoverModal = signal<boolean>(false);
  public coverBannerExpanded = signal<boolean>(true);
  public briefingExpanded = signal<boolean>(true);
  public showingNashMatrixModal = signal<boolean>(false);
  public levelCompleted = signal<boolean>(false);
  public gameOver = signal<boolean>(false);
  public defeatReason = signal<string>('');
  public eventLogs = signal<SecurityEventLog[]>([]);
  public score = signal<number>(0);

  // Soporte de Saldos Negativos Dinámicos
  public negativeBalance = computed<boolean>(() => this.score() < 0);

  // Sistema de Vidas de Capital y Puntos de Teoría de Juegos de Laberintos
  public lives = signal<number>(3);
  public maxLives = signal<number>(3);
  public orbsCollected = signal<number>(0);
  public totalOrbsInMaze = signal<number>(0);
  public challengesSolvedCount = signal<number>(0);
  public activeChallenge = signal<MazeTheoryChallenge | null>(null);
  public showingRulesModal = signal<boolean>(false);
  public gameMode = signal<'phaser_maze' | 'circuit_matrix'>('phaser_maze');
  public isBotFrozen = signal<boolean>(false);
  public botFrozenSecondsLeft = signal<number>(0);
  private botFreezeTimer: ReturnType<typeof setInterval> | null = null;
  public readonly allChallenges = MAZE_THEORY_CHALLENGES;

  // Estado de Poder: Firewall Activo (Certificados 2FA)
  public firewallActive = signal<boolean>(false);
  public firewallSecondsRemaining = signal<number>(0);
  public threatsNeutralized = signal<number>(0);
  public tokensRemaining = signal<number>(0);
  public totalTokensInLevel = signal<number>(0);
  private firewallTimer: ReturnType<typeof setInterval> | null = null;

  // Trivia y Comprensión Lectora de Ciberseguridad
  public showingTriviaModal = signal<boolean>(false);
  public activeTrivia = signal<CyberTriviaQuestion | null>(null);
  public triviaStreak = signal<number>(0);
  public readonly allTriviaQuestions = CYBER_TRIVIA_QUESTIONS;

  // Transition & Outcome Signals
  public transitionMessage = signal<string>('¡Superaste este nivel! Vamos al siguiente.');
  public transitionSubtext = signal<string>('Has verificado los flujos de la red corporativa.');
  public isRiskTransition = signal<boolean>(false);

  // 3-Second Cyber Introduction Signals
  public showingIntro = signal<boolean>(true);
  public introSecondsLeft = signal<number>(3);
  public introProgress = signal<number>(0);
  public introStage = signal<number>(1);
  public introStageText = signal<string>('[FASE 1/3] VERIFICANDO CRIPTOGRAFÍA Y ENLACES DE RED...');
  private introInterval: ReturnType<typeof setInterval> | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private nextLevelTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadLevel(0);
    this.startIntro();
  }

  public startIntro(): void {
    if (this.introInterval) {
      clearInterval(this.introInterval);
      this.introInterval = null;
    }
    this.showingIntro.set(true);
    this.introSecondsLeft.set(3);
    this.introProgress.set(0);
    this.introStage.set(1);
    this.introStageText.set('[FASE 1/3] VERIFICANDO CRIPTOGRAFÍA Y ENLACES DE RED...');

    this.sound.playIntroChime();
    this.sound.narrate('Iniciando Cifraflow. Tres, dos, uno... Acceso concedido.', true);

    const startTime = Date.now();
    const duration = 3000;

    this.introInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      this.introProgress.set(progress);

      const remainingMs = Math.max(0, duration - elapsed);
      const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
      this.introSecondsLeft.set(seconds);

      if (elapsed < 1000) {
        this.introStage.set(1);
        this.introStageText.set('[FASE 1/3] VERIFICANDO CRIPTOGRAFÍA Y ENLACES DE RED...');
      } else if (elapsed < 2000) {
        this.introStage.set(2);
        this.introStageText.set('[FASE 2/3] DESPLEGANDO CORTAFUEGOS Y ANÁLISIS ANTI-PHISHING...');
      } else if (elapsed < 3000) {
        this.introStage.set(3);
        this.introStageText.set('[FASE 3/3] ENLACE CIFRAFLOW CONFIRMADO · ¡ACCESO AUTORIZADO!');
      }

      if (elapsed >= duration) {
        if (this.introInterval) {
          clearInterval(this.introInterval);
          this.introInterval = null;
        }
        this.showingIntro.set(false);
      }
    }, 40);
  }

  public skipIntro(): void {
    if (this.introInterval) {
      clearInterval(this.introInterval);
      this.introInterval = null;
    }
    this.showingIntro.set(false);
  }

  public loadLevel(levelIdx: number): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.nextLevelTimeout) {
      clearTimeout(this.nextLevelTimeout);
      this.nextLevelTimeout = null;
    }

    const level = this.allLevels[levelIdx];
    this.currentLevelIndex.set(levelIdx);
    
    // Deep clone nodes and packets to avoid mutating raw constants
    const clonedNodes: GridNode[] = JSON.parse(JSON.stringify(level.nodes));
    const clonedPackets: DataPacket[] = JSON.parse(JSON.stringify(level.packets));

    this.nodes.set(clonedNodes);
    this.packets.set(clonedPackets);
    this.shieldIntegrity.set(level.initialIntegrity);
    this.movesRemaining.set(level.maxMoves);
    this.timeRemaining.set(level.timeLimitSeconds);
    this.safeDeliveredCount.set(0);
    this.threatsQuarantinedCount.set(0);
    this.isDispatching.set(false);
    this.selectedTool.set('none');
    this.levelCompleted.set(false);
    this.gameOver.set(false);
    this.defeatReason.set('');
    this.showingKnowledgeCard.set(false);
    this.inspectingPacket.set(null);
    this.isTransitioningToNext.set(false);
    this.isRiskTransition.set(false);
    const firstIdle = clonedPackets.find(p => p.status === 'idle');
    this.selectedPacketId.set(firstIdle ? firstIdle.id : null);

    this.firewallStock.set(level.powerUps.firewalls);
    this.scannerStock.set(level.powerUps.scanners);
    this.mfaStock.set(level.powerUps.mfaTokens);

    if (this.lives() <= 0) {
      this.lives.set(3);
    }
    this.orbsCollected.set(0);
    this.activeChallenge.set(null);
    this.isBotFrozen.set(false);
    if (this.botFreezeTimer) {
      clearInterval(this.botFreezeTimer);
      this.botFreezeTimer = null;
    }

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO' as unknown as SecurityEventLog['type'],
      message: `Iniciando ${level.title} [${level.codename}]. Analista en posición con ${this.lives()} vidas de solvencia.`,
      severity: 'info'
    });

    if (level.timeLimitSeconds !== null) {
      this.startTimer();
    }
  }

  public restartCurrentLevel(): void {
    this.loadLevel(this.currentLevelIndex());
  }

  public nextLevel(): void {
    if (this.nextLevelTimeout) {
      clearTimeout(this.nextLevelTimeout);
      this.nextLevelTimeout = null;
    }
    const nextIdx = (this.currentLevelIndex() + 1) % this.allLevels.length;
    this.loadLevel(nextIdx);
    this.sound.narrate(`Cargando Fase ${nextIdx + 1}: Nuevo tablero y topología desplegados.`, true);
  }

  public addPoints(amount: number, reason: string): void {
    this.score.update(s => s + amount);
    this.sound.playSafeDelivered();
    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SAFE_SAVED',
      message: `+${amount} PTS: ${reason}`,
      severity: 'success'
    });
  }

  public deductPoints(amount: number, reason: string): void {
    this.score.update(s => s - amount);
    this.sound.playBreach();
    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'BREACH',
      message: `-${amount} PTS: ${reason}. Saldo actual: ${this.score()} PTS.`,
      severity: 'danger'
    });

    if (this.score() < 0) {
      this.sound.narrate(`Alerta de capital: Saldo en números rojos. Balance actual: ${this.score()} puntos.`, true);
    }
  }

  public activateFirewallPower(duration = 9): void {
    if (this.firewallTimer) {
      clearInterval(this.firewallTimer);
    }
    this.firewallActive.set(true);
    this.firewallSecondsRemaining.set(duration);
    this.sound.playPowerUp();
    this.sound.narrate('¡Certificado 2FA activado! Firewall en línea. Amenazas de phishing vulnerables.', true);

    this.firewallTimer = setInterval(() => {
      const remaining = this.firewallSecondsRemaining() - 1;
      if (remaining <= 0) {
        if (this.firewallTimer) clearInterval(this.firewallTimer);
        this.firewallTimer = null;
        this.firewallActive.set(false);
        this.firewallSecondsRemaining.set(0);
        this.sound.narrate('Firewall agotado. Amenazas restablecidas.', true);
      } else {
        this.firewallSecondsRemaining.set(remaining);
      }
    }, 1000);
  }

  public triggerLevelClearTrivia(): void {
    const lvl = this.currentLevel().id;
    const trivia = this.allTriviaQuestions.find(t => t.levelTrigger === lvl) || this.allTriviaQuestions[0];
    this.activeTrivia.set(trivia);
    this.showingTriviaModal.set(true);
    this.sound.playVictory();
    this.sound.narrate(`¡Nodo limpio al 100%! Hito superado. Responde la prueba de comprensión para consolidar el capital.`, true);
  }

  public answerTriviaOption(option: TriviaOption): void {
    const trivia = this.activeTrivia();
    if (!trivia) return;

    if (option.isCorrect) {
      this.addPoints(trivia.rewardPoints, `Comprensión lectora superada [${trivia.topic}]: +${trivia.rewardPoints} PTS`);
      this.triviaStreak.update(s => s + 1);
      this.sound.playVictory();
      this.sound.narrate(`¡Respuesta correcta! ${option.feedback}`, true);
    } else {
      this.deductPoints(50, `Fallo en comprensión lectora: ${option.feedback}`);
      this.sound.narrate(`Respuesta incorrecta: ${option.feedback}`, true);
    }

    this.showingTriviaModal.set(false);
    this.activeTrivia.set(null);
    this.triggerNextLevelTransition(
      '¡Servidor Asegurado!',
      `Nodo limpiado y protocolo de seguridad validado. Avanzando de nivel...`,
      false
    );
  }

  public loseLife(reason: string, damage = 1): void {
    const nextLives = Math.max(0, this.lives() - damage);
    this.lives.set(nextLives);
    this.shieldIntegrity.set(Math.max(0, Math.round((nextLives / this.maxLives()) * 100)));
    this.sound.playBreach();

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'BREACH',
      message: `¡PÉRDIDA DE VIDA! (${nextLives}/${this.maxLives()} restantes): ${reason}`,
      severity: 'danger'
    });

    if (nextLives <= 0) {
      this.triggerDefeat(`Quiebra Sistémica: Has agotado tus 3 vidas de capital. Causa: ${reason}`);
    } else {
      this.sound.narrate(`Alerta de solvencia: Pierdes 1 vida de capital. Te quedan ${nextLives} vidas.`, true);
    }
  }

  public gainLife(): void {
    if (this.lives() < this.maxLives()) {
      this.lives.update(l => Math.min(this.maxLives(), l + 1));
      this.shieldIntegrity.set(Math.round((this.lives() / this.maxLives()) * 100));
      this.sound.playPowerUp();
    }
  }

  public openChallenge(challenge: MazeTheoryChallenge): void {
    this.activeChallenge.set(challenge);
    this.sound.playScan();
    this.sound.narrate(`Punto de control de Teoría de Juegos activado: ${challenge.title}.`, true);
  }

  public solveChallengeOption(option: MazeChallengeOption): void {
    const challenge = this.activeChallenge();
    if (!challenge) return;

    if (option.isOptimalNash) {
      this.addPoints(option.pointsReward, `Acierto en Teoría de Juegos [${challenge.theoryConcept}]: ${option.label}`);
      this.challengesSolvedCount.update(c => c + 1);
      this.freezeBots(6);
      this.sound.playVictory();
      this.sound.narrate(`¡Estrategia óptima confirmada! ${option.outcomeExplanation}`, true);
    } else {
      this.loseLife(`Elección subóptima en [${challenge.theoryConcept}]: ${option.label}`, option.livesDamage || 1);
      this.sound.narrate(`Fallo estratégico: ${option.outcomeExplanation}`, true);
    }

    this.activeChallenge.set(null);
  }

  public closeChallenge(): void {
    this.activeChallenge.set(null);
  }

  public freezeBots(seconds = 6): void {
    if (this.botFreezeTimer) {
      clearInterval(this.botFreezeTimer);
    }
    this.isBotFrozen.set(true);
    this.botFrozenSecondsLeft.set(seconds);

    this.botFreezeTimer = setInterval(() => {
      const left = this.botFrozenSecondsLeft() - 1;
      if (left <= 0) {
        if (this.botFreezeTimer) clearInterval(this.botFreezeTimer);
        this.botFreezeTimer = null;
        this.isBotFrozen.set(false);
        this.botFrozenSecondsLeft.set(0);
      } else {
        this.botFrozenSecondsLeft.set(left);
      }
    }, 1000);
  }

  public toggleGameMode(): void {
    const next = this.gameMode() === 'phaser_maze' ? 'circuit_matrix' : 'phaser_maze';
    this.gameMode.set(next);
    this.sound.narrate(next === 'phaser_maze' ? 'Modo Motor Phaser Arcade activado.' : 'Modo Matriz de Conmutación activado.', true);
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      const current = this.timeRemaining();
      if (current === null) return;

      if (current <= 1) {
        this.timeRemaining.set(0);
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.triggerDefeat('Tiempo límite de consola agotado. El ataque de ingeniería social ha desbordado el perímetro.');
      } else {
        this.timeRemaining.set(current - 1);
      }
    }, 1000);
  }

  public rotateNode(nodeId: string): void {
    if (this.gameOver() || this.levelCompleted() || this.isDispatching()) return;

    const currentNodes = [...this.nodes()];
    const nodeIndex = currentNodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;

    const node = currentNodes[nodeIndex];
    if (!node.rotatable) return;

    // Handle moves limitation
    const moves = this.movesRemaining();
    if (moves !== null) {
      if (moves <= 0) {
        this.triggerDefeat('Has alcanzado el límite máximo de conmutaciones de red permitidas.');
        return;
      }
      this.movesRemaining.set(moves - 1);
    }

    // Rotate by 90 degrees
    const nextRotation = ((node.rotation + 90) % 360) as 0 | 90 | 180 | 270;
    node.rotation = nextRotation;

    // Recompute connections based on node type and rotation
    this.updateNodeConnections(node);

    this.nodes.set(currentNodes);
    this.sound.playRotate();
    
    // Narrar el RESULTADO de mover la barra, no la trayectoria o grados
    const resultNarrative = this.evaluateBarRotationResult(node, currentNodes);
    this.sound.narrate(resultNarrative, true);

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO' as unknown as SecurityEventLog['type'],
      message: `BARRA REORIENTADA [${node.label || `Nodo (${node.x},${node.y})`}]: ${resultNarrative}`,
      severity: 'info'
    });
  }

  private evaluateBarRotationResult(node: GridNode, allNodes: GridNode[]): string {
    const conn = node.connections;
    const neighbors: { dir: string; node: GridNode; matched: boolean }[] = [];

    const directionsToCheck = [
      { dir: 'arriba', dx: 0, dy: -1, myConn: conn.up, oppConn: 'down' as const },
      { dir: 'derecha', dx: 1, dy: 0, myConn: conn.right, oppConn: 'left' as const },
      { dir: 'abajo', dx: 0, dy: 1, myConn: conn.down, oppConn: 'up' as const },
      { dir: 'izquierda', dx: -1, dy: 0, myConn: conn.left, oppConn: 'right' as const },
    ];

    for (const d of directionsToCheck) {
      if (d.myConn) {
        const neighbor = allNodes.find(n => n.x === node.x + d.dx && n.y === node.y + d.dy);
        if (neighbor && neighbor.type !== 'empty') {
          const matched = Boolean(neighbor.connections[d.oppConn]);
          neighbors.push({ dir: d.dir, node: neighbor, matched });
        }
      }
    }

    // Check if connected directly to Server Safe (Bóveda Central)
    const serverSafeConn = neighbors.find(n => n.node.type === 'server_safe' && n.matched);
    if (serverSafeConn) {
      return 'Resultado: Vía enlazada directamente con la Bóveda Central. Flujo de capital listo para inyección.';
    }

    // Check if connected directly to Quarantine (Cámara de Liquidación)
    const quaranConn = neighbors.find(n => n.node.type === 'quarantine' && n.matched);
    if (quaranConn) {
      return 'Resultado: Canal de desvío hacia la Cámara de Liquidación activado. Aislamiento de riesgo listo.';
    }

    // Check if connected to MFA gate
    const mfaConn = neighbors.find(n => n.node.type === 'mfa_gate' && n.matched);
    if (mfaConn) {
      return mfaConn.node.isMfaLocked
        ? 'Resultado: Vía enlazada a pasarela protegida por Cumplimiento Regulatorio KYC.'
        : 'Resultado: Vía libre a través de la pasarela regulada y autorizada.';
    }

    // Check if matching circuits
    const matchedCount = neighbors.filter(n => n.matched).length;
    if (matchedCount >= 2) {
      return 'Resultado: Puente de arbitraje completado. Circuito financiero abierto en ambos extremos.';
    } else if (matchedCount === 1) {
      return 'Resultado: Enlace de liquidez alineado con el canal adyacente.';
    } else if (neighbors.length > 0) {
      return 'Resultado: Vía orientada hacia el canal, esperando alineación del nodo vecino.';
    } else {
      return 'Resultado: Vía reconfigurada hacia zona neutral del circuito.';
    }
  }

  private updateNodeConnections(node: GridNode): void {
    const rot = node.rotation;

    switch (node.type) {
      case 'straight_h':
      case 'straight_v':
        if (rot === 0 || rot === 180) {
          node.connections = { up: false, right: true, down: false, left: true };
        } else {
          node.connections = { up: true, right: false, down: true, left: false };
        }
        break;

      case 'corner_ne':
        if (rot === 0) node.connections = { up: true, right: true, down: false, left: false };
        else if (rot === 90) node.connections = { up: false, right: true, down: true, left: false };
        else if (rot === 180) node.connections = { up: false, right: false, down: true, left: true };
        else node.connections = { up: true, right: false, down: false, left: true };
        break;

      case 'corner_nw':
        if (rot === 0) node.connections = { up: true, right: false, down: false, left: true };
        else if (rot === 90) node.connections = { up: true, right: true, down: false, left: false };
        else if (rot === 180) node.connections = { up: false, right: true, down: true, left: false };
        else node.connections = { up: false, right: false, down: true, left: true };
        break;

      case 'corner_se':
        if (rot === 0) node.connections = { up: false, right: true, down: true, left: false };
        else if (rot === 90) node.connections = { up: false, right: false, down: true, left: true };
        else if (rot === 180) node.connections = { up: true, right: false, down: false, left: true };
        else node.connections = { up: true, right: true, down: false, left: false };
        break;

      case 'corner_sw':
        if (rot === 0) node.connections = { up: false, right: false, down: true, left: true };
        else if (rot === 90) node.connections = { up: true, right: false, down: false, left: true };
        else if (rot === 180) node.connections = { up: true, right: true, down: false, left: false };
        else node.connections = { up: false, right: true, down: true, left: false };
        break;

      case 'router':
      case 'cross':
        // Universal junctions can accept and route in all 4 cardinal directions
        node.connections = { up: true, right: true, down: true, left: true };
        break;

      default:
        break;
    }
  }

  public openPacketInspector(packet: DataPacket): void {
    this.inspectingPacket.set(packet);
    if (packet.isPhishing) {
      this.sound.narrate(`Alerta: ${packet.label} presenta indicadores de phishing.`);
    } else {
      this.sound.narrate(`Paquete ${packet.label}: Tráfico corporativo verificado.`);
    }
  }

  public closePacketInspector(): void {
    this.inspectingPacket.set(null);
  }

  public selectTool(tool: 'none' | 'firewall' | 'scanner' | 'mfa'): void {
    this.selectedTool.set(this.selectedTool() === tool ? 'none' : tool);
  }

  public useFirewallOnPacket(packetId: string): void {
    if (this.firewallStock() <= 0) return;

    const currentPackets = [...this.packets()];
    const pkt = currentPackets.find(p => p.id === packetId);
    if (!pkt || pkt.status !== 'idle') return;

    this.firewallStock.update(s => s - 1);
    pkt.isFirewalled = true;
    pkt.status = 'quarantined';
    this.packets.set(currentPackets);
    this.sound.playPowerUp();
    this.sound.narrate('Cortafuegos táctico desplegado. Amenaza purgada.', true);

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'FIREWALL_USED',
      message: `CORTAFUEGOS TÁCTICO APLICADO: Paquete [${pkt.label}] purgado inmediatamente de la red.`,
      severity: 'warning'
    });

    if (pkt.isPhishing) {
      this.threatsQuarantinedCount.update(c => c + 1);
      this.score.update(s => s + 200);
      this.sound.narrate('Resultado: Amenaza purgada con Cortafuegos. ¡Superaste este nivel! Vamos al siguiente.', true);
      this.triggerNextLevelTransition('¡Superaste este nivel! Vamos al siguiente.', 'Amenaza purgada exitosamente con Cortafuegos táctico.', false);
      return;
    }
    this.checkWinCondition();
  }

  public useScannerOnPacket(packetId: string): void {
    if (this.scannerStock() <= 0) return;

    const currentPackets = [...this.packets()];
    const pkt = currentPackets.find(p => p.id === packetId);
    if (!pkt) return;

    this.scannerStock.update(s => s - 1);
    pkt.isScanned = true;
    this.packets.set(currentPackets);
    this.sound.playPowerUp();
    this.sound.narrate('Escáner forense ejecutado sobre el paquete.', true);

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SCAN_EXEC',
      message: `DEEP SCANNER EJECUTADO: ${pkt.isPhishing ? '⚠️ AMENAZA CONFIRMADA' : '✅ PAQUETE LIMPIO CERTIFICADO'}: ${pkt.label}`,
      severity: pkt.isPhishing ? 'danger' : 'success'
    });

    this.inspectingPacket.set(pkt);
  }

  public unlockMfaGate(nodeId: string): void {
    if (this.mfaStock() <= 0) return;

    const currentNodes = [...this.nodes()];
    const node = currentNodes.find(n => n.id === nodeId && n.type === 'mfa_gate');
    if (!node || !node.isMfaLocked) return;

    this.mfaStock.update(s => s - 1);
    node.isMfaLocked = false;
    this.nodes.set(currentNodes);
    this.sound.playPowerUp();
    this.sound.narrate('Token criptográfico validado. Pasarela perimetral abierta.', true);

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'MFA_UNLOCKED',
      message: `PASARELA MFA DESBLOQUEADA: Token criptográfico FIDO2 validado con éxito.`,
      severity: 'success'
    });
  }

  public selectPacket(packetId: string): void {
    this.selectedPacketId.set(packetId);
    const pkt = this.packets().find(p => p.id === packetId);
    if (pkt) {
      this.sound.playStep();
      const typeDesc = pkt.isPhishing ? 'amenaza de phishing (envíalo a Cuarentena)' : 'correo legítimo (envíalo al Servidor Central)';
      this.sound.narrate(`Seleccionado: ${pkt.label}. Es ${typeDesc}. Usa las flechas para moverlo.`);
    }
  }

  public changePacketDirection(direction: Direction, packetId?: string): void {
    const id = packetId || this.selectedPacketId();
    const currentPackets = [...this.packets()];
    const pkt = currentPackets.find(p => p.id === id);
    if (!pkt || (pkt.status !== 'idle' && pkt.status !== 'moving')) return;

    pkt.direction = direction;
    this.packets.set(currentPackets);
    this.sound.playStep();
    // No se narra la trayectoria ni el giro de la flecha, se mantiene respuesta rápida
  }

  public movePacketManual(direction: Direction, packetId?: string): void {
    if (this.gameOver() || this.levelCompleted()) return;

    const id = packetId || this.selectedPacketId();
    const currentPackets = [...this.packets()];
    let packet = currentPackets.find(p => p.id === id);

    if (!packet) {
      const firstIdle = currentPackets.find(p => p.status === 'idle');
      if (firstIdle) {
        this.selectPacket(firstIdle.id);
        packet = firstIdle;
      } else {
        return;
      }
    }

    if (packet.status !== 'idle' && packet.status !== 'moving') {
      this.sound.narrate(`Resultado: El paquete ${packet.label} ya está procesado.`, true);
      return;
    }

    // Determine target coordinate
    let nextX = packet.gridX;
    let nextY = packet.gridY;
    if (direction === 'up') nextY--;
    else if (direction === 'down') nextY++;
    else if (direction === 'left') nextX--;
    else if (direction === 'right') nextX++;

    const level = this.currentLevel();
    if (nextX < 0 || nextX >= level.gridWidth || nextY < 0 || nextY >= level.gridHeight) {
      this.sound.narrate('Resultado: Límite del tablero alcanzado, vía cerrada.', true);
      return;
    }

    // Check target node
    const targetNode = this.nodes().find(n => n.x === nextX && n.y === nextY);
    if (!targetNode || targetNode.type === 'empty') {
      this.sound.narrate('Resultado: Sin conexión en esa dirección. Conecta las barras de red.', true);
      return;
    }

    // Check locked MFA gate
    if (targetNode.type === 'mfa_gate' && targetNode.isMfaLocked) {
      this.sound.narrate('Resultado: Pasarela bloqueada por control MFA. Aplica el token para abrir paso.', true);
      this.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'INFO' as unknown as SecurityEventLog['type'],
        message: `Pasarela MFA bloqueada en (${nextX}, ${nextY}). Aplica el token FIDO2 para habilitar el paso.`,
        severity: 'warning'
      });
      return;
    }

    // Move packet
    packet.gridX = nextX;
    packet.gridY = nextY;
    packet.direction = direction;
    packet.status = 'moving';

    // Se emite sonido de paso, sin narrar la trayectoria para no saturar al usuario
    this.sound.playStep();

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO' as unknown as SecurityEventLog['type'],
      message: `AVANCE DE PAQUETE: [${packet.label}] posicionado en (${nextX}, ${nextY}).`,
      severity: 'info'
    });

    // Check if reached destination or caused risk
    if (targetNode.type === 'server_safe') {
      if (packet.isPhishing) {
        // Riesgo por la trayectoria elegida!
        packet.status = 'breached';
        const newIntegrity = Math.max(0, this.shieldIntegrity() - 25);
        this.shieldIntegrity.set(newIntegrity);
        this.sound.playBreach();
        this.sound.narrate('Resultado: ¡Alerta de riesgo! Infección de phishing en Servidor Central por la ruta elegida. Cambiando de tablero al siguiente nivel.', true);
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'BREACH',
          message: `¡RIESGO DE INFECCIÓN! Phishing [${packet.label}] ingresó al Servidor Central por la trayectoria elegida. Cambiando de tablero...`,
          severity: 'danger'
        });
        this.packets.set(currentPackets);
        this.triggerNextLevelTransition('¡Alerta de Riesgo en la Red!', 'Infección detectada por la ruta elegida. Cambiando de tablero al siguiente nivel...', true);
        return;
      } else {
        // Carta legítima llegó a su destino!
        packet.status = 'delivered';
        this.safeDeliveredCount.update(c => c + 1);
        this.score.update(s => s + 250);
        this.sound.playSafeDelivered();
        this.sound.narrate('Resultado: Carta segura entregada con éxito en el Servidor Central. ¡Superaste este nivel! Vamos al siguiente.', true);
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'SAFE_SAVED',
          message: `CARTA ENTREGADA: [${packet.label}] archivada en Servidor Central. Pasando al siguiente nivel y cambiando tablero.`,
          severity: 'success'
        });
        this.packets.set(currentPackets);
        this.triggerNextLevelTransition('¡Superaste este nivel! Vamos al siguiente.', 'Carta legítima asegurada con éxito en el Servidor Central.', false);
        return;
      }
    } else if (targetNode.type === 'quarantine') {
      if (packet.isPhishing) {
        // Amenaza llegó a su destino (cuarentena)!
        packet.status = 'quarantined';
        this.threatsQuarantinedCount.update(c => c + 1);
        this.score.update(s => s + 300);
        this.sound.playQuarantine();
        this.sound.narrate('Resultado: Amenaza de phishing aislada en Cuarentena. ¡Superaste este nivel! Vamos al siguiente.', true);
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'THREAT_QUARANTINED',
          message: `AMENAZA AISLADA: [${packet.label}] neutralizado en Cuarentena. Pasando al siguiente nivel y cambiando tablero.`,
          severity: 'success'
        });
        this.packets.set(currentPackets);
        this.triggerNextLevelTransition('¡Superaste este nivel! Vamos al siguiente.', 'Amenaza maliciosa neutralizada con éxito en Cuarentena.', false);
        return;
      } else {
        // Riesgo por la trayectoria elegida (falso positivo)!
        packet.status = 'quarantined';
        this.shieldIntegrity.update(i => Math.max(0, i - 10));
        this.sound.playBreach();
        this.sound.narrate('Resultado: ¡Alerta de riesgo! Correo seguro enviado erróneamente a Cuarentena por la trayectoria elegida. Cambiando de tablero al siguiente nivel.', true);
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'BREACH',
          message: `RIESGO DE FALSO POSITIVO: [${packet.label}] destruido en cuarentena por la ruta elegida. Cambiando de tablero...`,
          severity: 'warning'
        });
        this.packets.set(currentPackets);
        this.triggerNextLevelTransition('¡Alerta de Riesgo en la Red!', 'Falso positivo por la trayectoria elegida. Cambiando de tablero al siguiente nivel...', true);
        return;
      }
    } else {
      packet.status = 'idle';
    }

    this.packets.set(currentPackets);
    this.checkWinCondition();
  }

  private autoSelectNextPacket(packetsList: DataPacket[]): void {
    const nextIdle = packetsList.find(p => p.status === 'idle');
    if (nextIdle) {
      this.selectedPacketId.set(nextIdle.id);
    }
  }

  public async dispatchDataStreams(): Promise<void> {
    if (this.isDispatching() || this.gameOver() || this.levelCompleted()) return;

    this.isDispatching.set(true);
    this.sound.playDispatch();
    this.sound.narrate('Iniciando transmisión de paquetes por la red corporativa.', true);

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO' as unknown as SecurityEventLog['type'],
      message: `INICIANDO TRANSMISIÓN DE FLUJOS: Despachando paquetes hacia servidores de destino...`,
      severity: 'info'
    });

    const activePackets = this.packets().filter(p => p.status === 'idle');

    for (const pkt of activePackets) {
      await this.tracePacketRoute(pkt);
    }

    this.isDispatching.set(false);
    this.checkWinCondition();
  }

  private async tracePacketRoute(packet: DataPacket): Promise<void> {
    let currX = packet.gridX;
    let currY = packet.gridY;
    let currDir: Direction = packet.direction;
    const maxSteps = 15;
    let steps = 0;

    packet.status = 'moving';

    while (steps < maxSteps) {
      steps++;
      // Calculate next step
      let nextX = currX;
      let nextY = currY;

      if (currDir === 'right') nextX++;
      else if (currDir === 'left') nextX--;
      else if (currDir === 'down') nextY++;
      else if (currDir === 'up') nextY--;

      // Boundary check
      const level = this.currentLevel();
      if (nextX < 0 || nextX >= level.gridWidth || nextY < 0 || nextY >= level.gridHeight) {
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'INFO' as unknown as SecurityEventLog['type'],
          message: `Ruta truncada: ${packet.label} se desbordó fuera de la cuadrícula.`,
          severity: 'warning'
        });
        packet.status = 'idle';
        break;
      }

      // Find destination node
      const targetNode = this.nodes().find(n => n.x === nextX && n.y === nextY);
      if (!targetNode || targetNode.type === 'empty') {
        packet.status = 'idle';
        break;
      }

      // Update position
      packet.gridX = nextX;
      packet.gridY = nextY;
      this.packets.set([...this.packets()]);

      // Delay for visual flow sensation
      await new Promise(res => setTimeout(res, 220));

      // Check if target is special endpoint
      if (targetNode.type === 'server_safe') {
        if (packet.isPhishing) {
          // Breach / Riesgo por la trayectoria elegida!
          packet.status = 'breached';
          const newIntegrity = Math.max(0, this.shieldIntegrity() - 25);
          this.shieldIntegrity.set(newIntegrity);
          this.sound.playBreach();
          this.sound.narrate('Resultado: ¡Alerta de riesgo! Infección de phishing en Servidor Central por la ruta elegida. Cambiando de tablero al siguiente nivel.', true);

          this.addLog({
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'BREACH',
            message: `¡INFILTRACIÓN MALICIOSA! Phishing [${packet.label}] ha ingresado al Servidor Central. Cambiando de tablero...`,
            severity: 'danger'
          });

          this.packets.set([...this.packets()]);
          this.triggerNextLevelTransition('¡Alerta de Riesgo en la Red!', 'Infección detectada por la ruta elegida. Cambiando de tablero al siguiente nivel...', true);
          return;
        } else {
          // Clean delivery / Carta llegó a su destino!
          packet.status = 'delivered';
          this.safeDeliveredCount.update(c => c + 1);
          this.score.update(s => s + 250);
          this.sound.playSafeDelivered();
          this.sound.narrate('Resultado: Carta segura entregada con éxito en el Servidor Central. ¡Superaste este nivel! Vamos al siguiente.', true);

          this.addLog({
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'SAFE_SAVED',
            message: `PAQUETE ASEGURADO: [${packet.label}] archivado en Servidor Central. Pasando al siguiente nivel.`,
            severity: 'success'
          });

          this.packets.set([...this.packets()]);
          this.triggerNextLevelTransition('¡Superaste este nivel! Vamos al siguiente.', 'Carta legítima asegurada con éxito en el Servidor Central.', false);
          return;
        }
      }

      if (targetNode.type === 'quarantine') {
        if (packet.isPhishing) {
          // Quarantine success / Amenaza llegó a su destino!
          packet.status = 'quarantined';
          this.threatsQuarantinedCount.update(c => c + 1);
          this.score.update(s => s + 300);
          this.sound.playQuarantine();
          this.sound.narrate('Resultado: Amenaza de phishing aislada en Cuarentena. ¡Superaste este nivel! Vamos al siguiente.', true);

          this.addLog({
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'THREAT_QUARANTINED',
            message: `AMENAZA NEUTRALIZADA: [${packet.label}] aislado en contenedor de Cuarentena. Pasando al siguiente nivel.`,
            severity: 'success'
          });

          this.packets.set([...this.packets()]);
          this.triggerNextLevelTransition('¡Superaste este nivel! Vamos al siguiente.', 'Amenaza maliciosa neutralizada con éxito en Cuarentena.', false);
          return;
        } else {
          // False positive / Riesgo por la trayectoria elegida!
          packet.status = 'quarantined';
          this.shieldIntegrity.update(i => Math.max(0, i - 10));
          this.sound.playBreach();
          this.sound.narrate('Resultado: ¡Alerta de riesgo! Correo seguro enviado erróneamente a Cuarentena por la trayectoria elegida. Cambiando de tablero al siguiente nivel.', true);

          this.addLog({
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'BREACH',
            message: `FALSO POSITIVO: El paquete legítimo [${packet.label}] fue destruido en cuarentena por la ruta elegida. Cambiando de tablero...`,
            severity: 'warning'
          });

          this.packets.set([...this.packets()]);
          this.triggerNextLevelTransition('¡Alerta de Riesgo en la Red!', 'Falso positivo por la trayectoria elegida. Cambiando de tablero al siguiente nivel...', true);
          return;
        }
      }

      if (targetNode.type === 'mfa_gate' && targetNode.isMfaLocked) {
        packet.status = 'idle';
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'INFO' as unknown as SecurityEventLog['type'],
          message: `Pasarela MFA Bloqueada: [${packet.label}] detenido en control perimetral.`,
          severity: 'warning'
        });
        break;
      }

      // Router / corner redirection logic
      currDir = this.calculateNextDirection(targetNode, currDir);
      currX = nextX;
      currY = nextY;
    }

    this.packets.set([...this.packets()]);
  }

  private calculateNextDirection(node: GridNode, inDir: Direction): Direction {
    // If router or cross, packets maintain forward course if open, or redirect based on orientation
    if (node.type === 'corner_ne') {
      if (inDir === 'left') return 'up';
      if (inDir === 'down') return 'right';
    } else if (node.type === 'corner_nw') {
      if (inDir === 'right') return 'up';
      if (inDir === 'down') return 'left';
    } else if (node.type === 'corner_se') {
      if (inDir === 'left') return 'down';
      if (inDir === 'up') return 'right';
    } else if (node.type === 'corner_sw') {
      if (inDir === 'right') return 'down';
      if (inDir === 'up') return 'left';
    } else if (node.type === 'router') {
      // Rotation index directs preference
      const rot = node.rotation;
      if (rot === 90 && inDir === 'right') return 'down';
      if (rot === 180 && inDir === 'right') return 'up';
      if (rot === 270 && inDir === 'down') return 'right';
    }

    return inDir;
  }

  public checkWinCondition(): void {
    const level = this.currentLevel();
    const safePackets = level.packets.filter(p => !p.isPhishing).length;
    const threatPackets = level.packets.filter(p => p.isPhishing).length;

    const allPacketsDone = this.packets().every(p => 
      p.status === 'delivered' || p.status === 'quarantined' || p.status === 'breached'
    );

    if (this.safeDeliveredCount() >= safePackets && this.threatsQuarantinedCount() >= threatPackets) {
      this.triggerNextLevelTransition('¡Superaste este nivel! Vamos al siguiente.', 'Flujos corporativos asegurados y amenazas neutralizadas.', false);
    } else if (allPacketsDone && !this.levelCompleted()) {
      if (this.shieldIntegrity() > 0) {
        this.sound.narrate('Resultado: Flujo concluido. Revisa las vías para enviar los paquetes restantes.');
        this.addLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'INFO' as unknown as SecurityEventLog['type'],
          message: `Flujo concluido pero quedan paquetes sin enrutar o extraviados. Puedes reiniciar el nivel.`,
          severity: 'warning'
        });
      }
    }
  }

  public triggerNextLevelTransition(title: string, subtext: string, isRisk = false): void {
    if (this.nextLevelTimeout) {
      clearTimeout(this.nextLevelTimeout);
      this.nextLevelTimeout = null;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.transitionMessage.set(title);
    this.transitionSubtext.set(subtext);
    this.isRiskTransition.set(isRisk);

    this.levelCompleted.set(true);
    this.isTransitioningToNext.set(true);

    if (isRisk) {
      this.sound.playBreach();
    } else {
      this.sound.playVictory();
    }

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: isRisk ? 'BREACH' : 'SAFE_SAVED',
      message: `${isRisk ? 'RIESGO DETECTADO EN TRAYECTORIA' : 'META CUMPLIDA'}: ${subtext} Cambiando de tablero al siguiente nivel...`,
      severity: isRisk ? 'warning' : 'success'
    });

    // Cambiar de tablero y pasar al siguiente nivel automáticamente tras breve pausa de 1.4 segundos
    this.nextLevelTimeout = setTimeout(() => {
      this.nextLevelTimeout = null;
      this.nextLevel();
    }, 1400);
  }

  private triggerDefeat(reason: string): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.gameOver.set(true);
    this.defeatReason.set(reason);
    this.sound.playDefeat();
    this.sound.narrate('Misión abortada. Perímetro de seguridad comprometido.', true);

    this.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'BREACH',
      message: `MISIÓN ABORTADA: ${reason}`,
      severity: 'danger'
    });
  }

  private addLog(log: SecurityEventLog): void {
    this.eventLogs.update(logs => [log, ...logs.slice(0, 40)]);
  }
}
