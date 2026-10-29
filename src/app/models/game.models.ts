export type Direction = 'up' | 'down' | 'left' | 'right';

export type NodeType = 
  | 'empty'
  | 'straight_h'
  | 'straight_v'
  | 'corner_ne'
  | 'corner_nw'
  | 'corner_se'
  | 'corner_sw'
  | 'cross'
  | 'router'
  | 'firewall'
  | 'mfa_gate'
  | 'server_safe'
  | 'quarantine';

export type PacketStatus = 'idle' | 'moving' | 'delivered' | 'quarantined' | 'breached';

export interface EmailHeaderMeta {
  fromAddress: string;
  replyToAddress: string;
  returnPath: string;
  ipOrigin: string;
  spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
  dkim: 'PASS' | 'FAIL' | 'NONE';
  dmarc: 'PASS' | 'FAIL' | 'NONE';
  tlsVersion: string;
  suspiciousSubject: boolean;
}

export interface DataPacket {
  id: string;
  label: string;
  category: 'email' | 'token' | 'invoice' | 'payload';
  isPhishing: boolean;
  subject: string;
  senderName: string;
  previewText: string;
  headers: EmailHeaderMeta;
  targetUrl?: string;
  redFlags: string[];
  securityTip: string;
  
  // Grid tracking
  startNodeId: string;
  currentNodeId: string;
  direction: Direction;
  isBlocked: boolean;
  status: PacketStatus;
  
  // Animation coordinates
  gridX: number;
  gridY: number;
  visualX: number;
  visualY: number;
  
  // Power-up / state flags
  isScanned?: boolean;
  isFirewalled?: boolean;
  mfaVerified?: boolean;

  // Game Theory Financial Attributes
  assetType?: 'alpha_bond' | 'index_liquidity' | 'toxic_subprime' | 'flash_loan_attack' | 'unhedged_swap';
  nominalYield?: string;
  payoffPoints?: number;
  gameTheoryRole?: string;
}

export interface GridNode {
  id: string;
  x: number;
  y: number;
  type: NodeType;
  rotatable: boolean;
  rotation: 0 | 90 | 180 | 270; // in degrees
  isActive: boolean;
  label?: string;
  
  // Flow connections for pathfinding
  // e.g. which directions are open from this cell: up, right, down, left
  connections: {
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
  };
  
  // Special status
  isMfaLocked?: boolean;
  isFirewallArmed?: boolean;
}

export interface KnowledgeCard {
  id: string;
  levelTrigger: number;
  title: string;
  attackType: string;
  threatLevel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  summary: string;
  realWorldImpact: string;
  redFlagsToCheck: string[];
  defenseGuidelines: string[];
  codeSnippetRef?: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  codename: string;
  subtitle: string;
  briefing: string;
  gridWidth: number;
  gridHeight: number;
  nodes: GridNode[];
  packets: DataPacket[];
  maxMoves: number | null;
  timeLimitSeconds: number | null;
  initialIntegrity: number;
  knowledgeCard: KnowledgeCard;
  powerUps: {
    firewalls: number;
    scanners: number;
    mfaTokens: number;
  };
  gameTheoryConcept?: string;
  nashEquilibriumRule?: string;
  marketRivalStrategy?: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  type: 'SAFE_SAVED' | 'THREAT_QUARANTINED' | 'BREACH' | 'FIREWALL_USED' | 'SCAN_EXEC' | 'MFA_UNLOCKED';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export interface MazeChallengeOption {
  id: string;
  label: string;
  actionText: string;
  isOptimalNash: boolean;
  pointsReward: number;
  livesDamage: number;
  outcomeExplanation: string;
}

export interface MazeTheoryChallenge {
  id: string;
  levelId: number;
  title: string;
  theoryConcept: 'Equilibrio de Nash' | 'Dilema del Prisionero' | 'Caza del Ciervo' | 'Halcón-Paloma' | 'Estrategia Minimax' | 'Paradoja de Braess';
  situation: string;
  matrixPayoff?: {
    playerCooperate: { rivalCooperate: string; rivalDefect: string };
    playerDefect: { rivalCooperate: string; rivalDefect: string };
  };
  options: MazeChallengeOption[];
  educationalInsight: string;
}

