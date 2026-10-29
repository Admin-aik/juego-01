/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  ChangeDetectionStrategy, 
  Component, 
  ElementRef, 
  OnDestroy, 
  OnInit, 
  ViewChild, 
  inject, 
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { PhaserLoaderService } from '../../services/phaser-loader.service';
import { SoundService } from '../../services/sound.service';

interface MazeTile {
  x: number;
  y: number;
  isWall: boolean;
  isQuarantine: boolean;
  isVpnTunnel: boolean;
  hasToken: boolean;
  hasPowerPellet: boolean;
}

interface ThreatAgent {
  id: 'blinky' | 'pinky' | 'inky' | 'clyde';
  name: string;
  colorName: string;
  gridX: number;
  gridY: number;
  dirX: number;
  dirY: number;
  sprite: any;
  homeCorner: { x: number; y: number };
  isVulnerable: boolean;
  isRetreatingToQuarantine: boolean;
}

@Component({
  selector: 'app-phaser-maze',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="relative w-full flex flex-col items-center select-none">
      
      <!-- Phaser Canvas Host Frame -->
      <div 
        #gameContainer 
        id="phaser-maze-canvas-host" 
        class="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-[#060a12] shadow-[0_0_35px_rgba(0,229,255,0.2)]"
        [class.border-cyan-500-50]="!engine.firewallActive() && !engine.negativeBalance()"
        [class.border-cyan-300]="engine.firewallActive()"
        [class.shadow-firewall]="engine.firewallActive()"
        [class.border-rose-500]="engine.negativeBalance() && !engine.firewallActive()"
        [class.shadow-negative]="engine.negativeBalance() && !engine.firewallActive()">
        
        <!-- Loading State before Phaser inits -->
        @if (isLoading()) {
          <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070b12] text-cyan-400 gap-3">
            <div class="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs font-mono tracking-widest uppercase">INICIALIZANDO PHASER ARCADE...</span>
          </div>
        }

        <!-- Active Firewall State Banner Overlay (Estado de Poder) -->
        @if (engine.firewallActive()) {
          <div class="absolute top-2 left-2 right-2 z-30 flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-mono shadow-[0_0_20px_rgba(0,229,255,0.4)] animate-pulse">
            <div class="flex items-center gap-1.5">
              <mat-icon class="text-sm text-cyan-400">shield</mat-icon>
              <strong class="text-white uppercase tracking-wider text-[11px]">FIREWALL 2FA ACTIVO</strong>
            </div>
            <div class="flex items-center gap-1 font-bold text-cyan-300">
              <span>CAZA AMENAZAS:</span>
              <span class="tabular-nums text-white bg-cyan-900/80 px-2 py-0.5 rounded border border-cyan-400/50">
                {{ engine.firewallSecondsRemaining() }}s
              </span>
            </div>
          </div>
        }

        <!-- Alerta Visual de Saldo Negativo -->
        @if (engine.negativeBalance() && !engine.firewallActive()) {
          <div class="absolute top-2 left-2 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 text-[10px] font-mono shadow-md animate-pulse">
            <mat-icon class="text-xs text-rose-400">warning</mat-icon>
            <span>ALERTA: DÉFICIT DE CAPITAL ({{ engine.score() }} PTS)</span>
          </div>
        }

        <!-- Red Damage Flash -->
        @if (damageFlash()) {
          <div class="absolute inset-0 z-25 bg-rose-600/40 pointer-events-none animate-ping"></div>
        }
      </div>

      <!-- Quick Legend & Status Bar under Canvas -->
      <div class="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] mt-2 flex flex-wrap items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300 gap-1">
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 text-amber-300">
            <span class="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
            Token +100
          </span>
          <span class="flex items-center gap-1 text-cyan-300">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(0,229,255,0.9)] animate-ping"></span>
            2FA Firewall
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 text-purple-300">
            <mat-icon class="text-[11px] text-purple-400">vpn_key</mat-icon>
            Túnel VPN
          </span>
          <span class="flex items-center gap-1" [class.text-rose-400]="engine.negativeBalance()" [class.text-emerald-300]="!engine.negativeBalance()">
            Capital: <strong class="tabular-nums font-bold">{{ engine.score() }}</strong>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .border-cyan-500-50 { border-color: rgba(0, 229, 255, 0.5); }
    .shadow-firewall { box-shadow: 0 0 35px rgba(0, 229, 255, 0.45); }
    .shadow-negative { box-shadow: 0 0 35px rgba(244, 63, 94, 0.45); }
  `
})
export class PhaserMazeGame implements OnInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainerRef!: ElementRef<HTMLDivElement>;

  public engine = inject(GameEngineService);
  private phaserLoader = inject(PhaserLoaderService);
  private sound = inject(SoundService);

  public isLoading = signal<boolean>(true);
  public damageFlash = signal<boolean>(false);

  private phaserGame: any = null;
  private currentScene: any = null;

  constructor() {
    effect(() => {
      const lvlIndex = this.engine.currentLevelIndex();
      if (this.currentScene && typeof this.currentScene.loadLevelData === 'function') {
        this.currentScene.loadLevelData(lvlIndex);
      }
    });

    // React to firewall active state in Phaser
    effect(() => {
      const isFirewall = this.engine.firewallActive();
      if (this.currentScene && typeof this.currentScene.setFirewallPowerState === 'function') {
        this.currentScene.setFirewallPowerState(isFirewall);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initPhaserGame();
  }

  ngOnDestroy(): void {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }
  }

  private async initPhaserGame(): Promise<void> {
    const PhaserModule = await this.phaserLoader.getPhaser();
    if (!PhaserModule) {
      this.isLoading.set(false);
      return;
    }
    const Phaser = PhaserModule;

    const containerEl = this.gameContainerRef.nativeElement;
    const parentWidth = containerEl.clientWidth || 420;
    const parentHeight = parentWidth;

    const gameEngine = this.engine;
    const gameSound = this.sound;
    const gameDamageSignal = this.damageFlash;
    const gameLoadingSignal = this.isLoading;
    const registerScene = (sc: any) => { this.currentScene = sc; };

    // ==========================================
    // ESCENA PRINCIPAL: CIFRAFLOW MAZE SCENE
    // ==========================================
    class MazeScene extends Phaser.Scene {
      private player: any;
      private threats: ThreatAgent[] = [];
      private tokensGroup: any;
      private pelletsGroup: any;
      private ghostReturnGroup: any;

      private gridSize = 17;
      private tileSize = 24;
      private mazeMatrix: MazeTile[][] = [];

      private playerGridX = 8;
      private playerGridY = 12;
      private playerDirX = 0;
      private playerDirY = 0;
      private nextDirX = 0;
      private nextDirY = 0;

      private isPlayerVulnerable = false;
      private threatsEatenCombo = 1;
      private moveTicker: any = null;
      private threatAITicker: any = null;

      private cursors: any;
      private wasd: any;

      get scAdd(): any { return (this as Record<string, any>)['add']; }
      get scTweens(): any { return (this as Record<string, any>)['tweens']; }
      get scScale(): any { return (this as Record<string, any>)['scale']; }
      get scInput(): any { return (this as Record<string, any>)['input']; }
      get scTime(): any { return (this as Record<string, any>)['time']; }
      get scMake(): any { return (this as Record<string, any>)['make']; }
      get scCameras(): any { return (this as Record<string, any>)['cameras']; }

      constructor() {
        super({ key: 'MazeScene' });
      }

      preload() {
        this.generateCyberTextures();
      }

      create() {
        registerScene(this);
        gameLoadingSignal.set(false);

        this.tileSize = Math.floor(this.scScale.width / this.gridSize);

        // Input Setup
        if (this.scInput && this.scInput.keyboard) {
          this.cursors = this.scInput.keyboard.createCursorKeys();
          this.wasd = {
            up: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            firewall: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            scanner: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
            rules: this.scInput.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
          };
        }

        // Build Maze Map
        this.loadLevelData(gameEngine.currentLevelIndex());

        // Keyboard Actions
        this.scInput.keyboard?.on('keydown', (event: KeyboardEvent) => {
          if (event.code === 'KeyF') {
            gameEngine.activateFirewallPower(9);
          } else if (event.code === 'KeyR') {
            gameEngine.showingRulesModal.set(true);
          }
        });

        // Player Movement Timer (Every 180ms moves 1 grid cell)
        this.moveTicker = this.scTime.addEvent({
          delay: 170,
          callback: this.stepPlayerMovement,
          callbackScope: this,
          loop: true
        });

        // AI Threat Movement Timer (Every 240ms moves 1 grid cell)
        this.threatAITicker = this.scTime.addEvent({
          delay: 230,
          callback: this.stepThreatAI,
          callbackScope: this,
          loop: true
        });
      }

      generateCyberTextures() {
        // 1. CifraAvatar Sprite (Neon Cyan Ring with Pulse Core)
        const gPlayer = this.scMake.graphics({ x: 0, y: 0 });
        gPlayer.fillStyle(0x00e5ff, 1);
        gPlayer.fillCircle(14, 14, 11);
        gPlayer.lineStyle(2, 0xffffff, 1);
        gPlayer.strokeCircle(14, 14, 13);
        gPlayer.fillStyle(0xffffff, 1);
        gPlayer.fillCircle(14, 14, 4);
        gPlayer.generateTexture('tex_avatar', 28, 28);
        gPlayer.destroy();

        // 2. Gusano de Inflación (Rojo - Blinky)
        const gBlinky = this.scMake.graphics({ x: 0, y: 0 });
        gBlinky.fillStyle(0xff0044, 1);
        gBlinky.fillRoundedRect(2, 2, 24, 24, 6);
        gBlinky.lineStyle(2, 0xff7799, 1);
        gBlinky.strokeRoundedRect(2, 2, 24, 24, 6);
        gBlinky.fillStyle(0xffffff, 1);
        gBlinky.fillCircle(9, 10, 3);
        gBlinky.fillCircle(19, 10, 3);
        gBlinky.fillStyle(0x000000, 1);
        gBlinky.fillCircle(10, 10, 1.5);
        gBlinky.fillCircle(20, 10, 1.5);
        gBlinky.generateTexture('tex_blinky', 28, 28);
        gBlinky.destroy();

        // 3. Bot de Phishing (Magenta - Pinky)
        const gPinky = this.scMake.graphics({ x: 0, y: 0 });
        gPinky.fillStyle(0xff00cc, 1);
        gPinky.fillRoundedRect(2, 2, 24, 24, 6);
        gPinky.lineStyle(2, 0xff88ee, 1);
        gPinky.strokeRoundedRect(2, 2, 24, 24, 6);
        gPinky.fillStyle(0xffffff, 1);
        gPinky.fillCircle(9, 10, 3);
        gPinky.fillCircle(19, 10, 3);
        gPinky.fillStyle(0x000000, 1);
        gPinky.fillCircle(9, 10, 1.5);
        gPinky.fillCircle(19, 10, 1.5);
        gPinky.generateTexture('tex_pinky', 28, 28);
        gPinky.destroy();

        // 4. Malware Oculto (Celeste - Inky)
        const gInky = this.scMake.graphics({ x: 0, y: 0 });
        gInky.fillStyle(0x00ccff, 1);
        gInky.fillRoundedRect(2, 2, 24, 24, 6);
        gInky.lineStyle(2, 0x88eeff, 1);
        gInky.strokeRoundedRect(2, 2, 24, 24, 6);
        gInky.fillStyle(0xffffff, 1);
        gInky.fillCircle(9, 10, 3);
        gInky.fillCircle(19, 10, 3);
        gInky.fillStyle(0x000000, 1);
        gInky.fillCircle(8, 10, 1.5);
        gInky.fillCircle(18, 10, 1.5);
        gInky.generateTexture('tex_inky', 28, 28);
        gInky.destroy();

        // 5. Troyano de Suplantación (Naranja - Clyde)
        const gClyde = this.scMake.graphics({ x: 0, y: 0 });
        gClyde.fillStyle(0xff8800, 1);
        gClyde.fillRoundedRect(2, 2, 24, 24, 6);
        gClyde.lineStyle(2, 0xffbb44, 1);
        gClyde.strokeRoundedRect(2, 2, 24, 24, 6);
        gClyde.fillStyle(0xffffff, 1);
        gClyde.fillCircle(9, 10, 3);
        gClyde.fillCircle(19, 10, 3);
        gClyde.fillStyle(0x000000, 1);
        gClyde.fillCircle(10, 10, 1.5);
        gClyde.fillCircle(20, 10, 1.5);
        gClyde.generateTexture('tex_clyde', 28, 28);
        gClyde.destroy();

        // 6. Vulnerable Threat (Azul Cian Eléctrico - Modo Firewall Cazable)
        const gVuln = this.scMake.graphics({ x: 0, y: 0 });
        gVuln.fillStyle(0x0055ff, 1);
        gVuln.fillRoundedRect(2, 2, 24, 24, 6);
        gVuln.lineStyle(2, 0x00ffff, 1);
        gVuln.strokeRoundedRect(2, 2, 24, 24, 6);
        gVuln.fillStyle(0xffffff, 1);
        gVuln.fillRect(8, 8, 4, 4);
        gVuln.fillRect(16, 8, 4, 4);
        gVuln.fillRect(8, 18, 12, 2);
        gVuln.generateTexture('tex_vuln', 28, 28);
        gVuln.destroy();

        // 7. Paquete de Datos Legítimo (Pac-Dot / Token +100)
        const gDot = this.scMake.graphics({ x: 0, y: 0 });
        gDot.fillStyle(0xfbbf24, 1);
        gDot.fillCircle(6, 6, 3.5);
        gDot.lineStyle(1, 0xffffff, 0.9);
        gDot.strokeCircle(6, 6, 4.5);
        gDot.generateTexture('tex_dot', 12, 12);
        gDot.destroy();

        // 8. Power Pellet (Certificado 2FA Intermitente)
        const gPellet = this.scMake.graphics({ x: 0, y: 0 });
        gPellet.fillStyle(0x00e5ff, 1);
        gPellet.fillCircle(10, 10, 8);
        gPellet.lineStyle(2, 0xffffff, 1);
        gPellet.strokeCircle(10, 10, 9);
        gPellet.fillStyle(0xffffff, 1);
        gPellet.fillCircle(10, 10, 3);
        gPellet.generateTexture('tex_pellet', 20, 20);
        gPellet.destroy();
      }

      loadLevelData(levelIndex: number) {
        if (this.tokensGroup) this.tokensGroup.clear(true, true);
        if (this.pelletsGroup) this.pelletsGroup.clear(true, true);
        if (this.ghostReturnGroup) this.ghostReturnGroup.clear(true, true);
        if (this.player) this.player.destroy();
        this.threats.forEach(t => t.sprite?.destroy());
        this.threats = [];

        this.tileSize = Math.floor(this.scScale.width / this.gridSize);

        // Build Maze Matrix
        this.mazeMatrix = this.createCyberMazeLayout(levelIndex);
        this.renderMazeGridGraphics();

        this.tokensGroup = this.scAdd.group();
        this.pelletsGroup = this.scAdd.group();
        this.ghostReturnGroup = this.scAdd.group();

        let tokenCount = 0;

        for (let y = 0; y < this.gridSize; y++) {
          for (let x = 0; x < this.gridSize; x++) {
            const tile = this.mazeMatrix[y][x];
            const cx = x * this.tileSize + this.tileSize / 2;
            const cy = y * this.tileSize + this.tileSize / 2;

            if (tile.hasToken) {
              const dot = this.scAdd.image(cx, cy, 'tex_dot');
              dot.setData('gridX', x);
              dot.setData('gridY', y);
              this.tokensGroup.add(dot);
              tokenCount++;
            } else if (tile.hasPowerPellet) {
              const pellet = this.scAdd.image(cx, cy, 'tex_pellet');
              pellet.setData('gridX', x);
              pellet.setData('gridY', y);
              this.scTweens.add({
                targets: pellet,
                scale: { from: 0.8, to: 1.25 },
                alpha: { from: 0.7, to: 1 },
                duration: 400,
                yoyo: true,
                repeat: -1
              });
              this.pelletsGroup.add(pellet);
            }
          }
        }

        gameEngine.totalTokensInLevel.set(tokenCount);
        gameEngine.tokensRemaining.set(tokenCount);

        // Spawn CifraAvatar at starting node (8, 12)
        this.playerGridX = 8;
        this.playerGridY = 12;
        this.playerDirX = 0;
        this.playerDirY = 0;
        this.nextDirX = 0;
        this.nextDirY = 0;

        const px = this.playerGridX * this.tileSize + this.tileSize / 2;
        const py = this.playerGridY * this.tileSize + this.tileSize / 2;
        this.player = this.scAdd.image(px, py, 'tex_avatar');

        // Spawn 4 Threats in Central Quarantine Box (7 to 9, 7 to 9)
        this.spawnThreats();
      }

      createCyberMazeLayout(levelIndex = 0): MazeTile[][] {
        const matrix: MazeTile[][] = [];
        const N = this.gridSize;
        const levelVariant = levelIndex % 3;

        // Custom labyrinth with tunnels, loops, and quarantine house
        // 0 = wall, 1 = token path, 2 = power pellet, 3 = quarantine, 4 = VPN tunnel
        const rawMap = [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,2,1,1,1,1,1,0,1,0,1,1,1,1,1,2,0],
          [0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0],
          [0,1,0,0,1,0,1,1,1,1,1,0,1,0,0,1,0],
          [0,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,0],
          [0,1,0,0,1,1,1,1,0,1,1,1,1,0,0,1,0],
          [0,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,0],
          [0,0,1,0,1,0,3,3,3,3,3,0,1,0,1,0,0],
          [4,1,1,1,1,0,3,3,3,3,3,0,1,1,1,1,4], // VPN Warp Row!
          [0,0,1,0,1,0,3,3,3,3,3,0,1,0,1,0,0],
          [0,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,0],
          [0,1,0,0,1,1,1,1,0,1,1,1,1,0,0,1,0],
          [0,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,0],
          [0,1,0,0,1,0,1,1,0,1,1,0,1,0,0,1,0],
          [0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,1,0],
          [0,2,1,1,1,1,1,1,0,1,1,1,1,1,1,2,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];

        // Variation for subsequent levels
        if (levelVariant === 1) {
          rawMap[4][8] = 1;
        } else if (levelVariant === 2) {
          rawMap[12][8] = 1;
        }

        for (let y = 0; y < N; y++) {
          const row: MazeTile[] = [];
          for (let x = 0; x < N; x++) {
            const cellType = rawMap[y][x];
            row.push({
              x,
              y,
              isWall: cellType === 0,
              hasToken: cellType === 1,
              hasPowerPellet: cellType === 2,
              isQuarantine: cellType === 3,
              isVpnTunnel: cellType === 4
            });
          }
          matrix.push(row);
        }

        return matrix;
      }

      renderMazeGridGraphics() {
        const g = this.scAdd.graphics();
        g.clear();

        // Dark navy cyber background
        g.fillStyle(0x060a12, 1);
        g.fillRect(0, 0, this.scScale.width, this.scScale.height);

        // Grid lines
        g.lineStyle(1, 0x00e5ff, 0.06);
        for (let i = 0; i <= this.gridSize; i++) {
          g.lineBetween(i * this.tileSize, 0, i * this.tileSize, this.scScale.height);
          g.lineBetween(0, i * this.tileSize, this.scScale.width, i * this.tileSize);
        }

        // Draw Walls and Quarantine Center
        for (let y = 0; y < this.gridSize; y++) {
          for (let x = 0; x < this.gridSize; x++) {
            const tile = this.mazeMatrix[y][x];
            const rx = x * this.tileSize;
            const ry = y * this.tileSize;

            if (tile.isWall) {
              g.fillStyle(0x0f172a, 1);
              g.fillRoundedRect(rx + 2, ry + 2, this.tileSize - 4, this.tileSize - 4, 4);

              g.lineStyle(1.5, 0x00e5ff, 0.45);
              g.strokeRoundedRect(rx + 2, ry + 2, this.tileSize - 4, this.tileSize - 4, 4);
            } else if (tile.isQuarantine) {
              // Quarantine chamber glowing floor
              g.fillStyle(0x3b0764, 0.35);
              g.fillRect(rx, ry, this.tileSize, this.tileSize);
            } else if (tile.isVpnTunnel) {
              // Glowing VPN Teleport Gate
              g.fillStyle(0x9333ea, 0.6);
              g.fillRoundedRect(rx + 1, ry + 1, this.tileSize - 2, this.tileSize - 2, 6);
              g.lineStyle(2, 0xc084fc, 1);
              g.strokeRoundedRect(rx + 1, ry + 1, this.tileSize - 2, this.tileSize - 2, 6);
            }
          }
        }

        // Quarantine Chamber Border
        const qx = 6 * this.tileSize;
        const qy = 7 * this.tileSize;
        const qw = 5 * this.tileSize;
        const qh = 3 * this.tileSize;
        g.lineStyle(2, 0xa855f7, 0.8);
        g.strokeRoundedRect(qx, qy, qw, qh, 6);
      }

      spawnThreats() {
        const spawns: { id: ThreatAgent['id']; name: string; colorName: string; texture: string; gx: number; gy: number; corner: { x: number; y: number } }[] = [
          { id: 'blinky', name: 'Gusano de Inflación', colorName: 'Rojo', texture: 'tex_blinky', gx: 8, gy: 6, corner: { x: 15, y: 1 } },
          { id: 'pinky', name: 'Bot de Phishing', colorName: 'Magenta', texture: 'tex_pinky', gx: 7, gy: 8, corner: { x: 1, y: 1 } },
          { id: 'inky', name: 'Malware Oculto', colorName: 'Celeste', texture: 'tex_inky', gx: 8, gy: 8, corner: { x: 15, y: 15 } },
          { id: 'clyde', name: 'Troyano de Suplantación', colorName: 'Naranja', texture: 'tex_clyde', gx: 9, gy: 8, corner: { x: 1, y: 15 } }
        ];

        this.threats = spawns.map(s => {
          const cx = s.gx * this.tileSize + this.tileSize / 2;
          const cy = s.gy * this.tileSize + this.tileSize / 2;
          const sprite = this.scAdd.image(cx, cy, s.texture);
          return {
            id: s.id,
            name: s.name,
            colorName: s.colorName,
            gridX: s.gx,
            gridY: s.gy,
            dirX: 0,
            dirY: -1,
            sprite,
            homeCorner: s.corner,
            isVulnerable: false,
            isRetreatingToQuarantine: false
          };
        });
      }

      public requestMove(dir: 'up' | 'down' | 'left' | 'right') {
        if (dir === 'up') {
          this.nextDirX = 0;
          this.nextDirY = -1;
        } else if (dir === 'down') {
          this.nextDirX = 0;
          this.nextDirY = 1;
        } else if (dir === 'left') {
          this.nextDirX = -1;
          this.nextDirY = 0;
        } else if (dir === 'right') {
          this.nextDirX = 1;
          this.nextDirY = 0;
        }
      }

      stepPlayerMovement() {
        if (gameEngine.gameOver() || gameEngine.levelCompleted()) return;

        // Try turning to requested next direction if walkable
        if (this.nextDirX !== 0 || this.nextDirY !== 0) {
          const testX = this.playerGridX + this.nextDirX;
          const testY = this.playerGridY + this.nextDirY;
          if (this.isWalkableForPlayer(testX, testY)) {
            this.playerDirX = this.nextDirX;
            this.playerDirY = this.nextDirY;
          }
        }

        if (this.playerDirX === 0 && this.playerDirY === 0) return;

        let nextX = this.playerGridX + this.playerDirX;
        const nextY = this.playerGridY + this.playerDirY;

        // ==========================================
        // VPN LATERAL WARP TUNNELS (TELETRANSPORTE)
        // ==========================================
        if (nextX < 0 && this.playerGridY === 8) {
          nextX = this.gridSize - 1;
          gameSound.playRotate();
        } else if (nextX >= this.gridSize && this.playerGridY === 8) {
          nextX = 0;
          gameSound.playRotate();
        }

        // Boundary or Wall check
        if (!this.isWalkableForPlayer(nextX, nextY)) {
          return;
        }

        this.playerGridX = nextX;
        this.playerGridY = nextY;

        const targetX = nextX * this.tileSize + this.tileSize / 2;
        const targetY = nextY * this.tileSize + this.tileSize / 2;

        this.scTweens.add({
          targets: this.player,
          x: targetX,
          y: targetY,
          duration: 120,
          ease: 'Linear'
        });

        // 1. Consume Token Legítimo (+100 PTS)
        if (this.tokensGroup) {
          const children = this.tokensGroup.getChildren();
          for (let i = children.length - 1; i >= 0; i--) {
            const dot = children[i];
            if (dot.getData('gridX') === nextX && dot.getData('gridY') === nextY) {
              dot.destroy();
              gameEngine.tokensRemaining.update(r => Math.max(0, r - 1));
              gameEngine.addPoints(100, 'Token de red legítimo recolectado (+100)');
              this.showFloatingText(nextX, nextY, '+100', 0xfbbf24);
              gameSound.playStep();

              // Check if all tokens cleared!
              if (gameEngine.tokensRemaining() <= 0) {
                this.handleAllTokensCleared();
              }
              break;
            }
          }
        }

        // 2. Consume Power Pellet (Certificado 2FA -> Activa Firewall)
        if (this.pelletsGroup) {
          const children = this.pelletsGroup.getChildren();
          for (let i = children.length - 1; i >= 0; i--) {
            const pellet = children[i];
            if (pellet.getData('gridX') === nextX && pellet.getData('gridY') === nextY) {
              pellet.destroy();
              this.showFloatingText(nextX, nextY, '¡FIREWALL 2FA!', 0x00e5ff);
              gameEngine.activateFirewallPower(9);
              break;
            }
          }
        }

        // 3. Check Threats Collision
        this.checkThreatCollisions();
      }

      isWalkableForPlayer(x: number, y: number): boolean {
        // Warp row check
        if ((x < 0 || x >= this.gridSize) && y === 8) return true;
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return false;

        const tile = this.mazeMatrix[y][x];
        // Cannot enter walls or ghost quarantine house
        return !tile.isWall && !tile.isQuarantine;
      }

      isWalkableForThreat(x: number, y: number, isReturning: boolean): boolean {
        if ((x < 0 || x >= this.gridSize) && y === 8) return true;
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return false;

        const tile = this.mazeMatrix[y][x];
        if (tile.isWall) return false;
        if (tile.isQuarantine && !isReturning) return false;
        return true;
      }

      // ========================================================
      // INTELIGENCIA ARTIFICIAL DETERMINISTA DE LAS 4 AMENAZAS
      // ========================================================
      stepThreatAI() {
        if (gameEngine.gameOver() || gameEngine.levelCompleted() || gameEngine.isBotFrozen()) return;

        const isFirewallActive = gameEngine.firewallActive();

        for (const threat of this.threats) {
          // If threat was eaten and returning to quarantine
          if (threat.isRetreatingToQuarantine) {
            this.moveThreatTowards(threat, 8, 8, true);
            if (threat.gridX === 8 && threat.gridY === 8) {
              threat.isRetreatingToQuarantine = false;
              threat.isVulnerable = false;
              threat.sprite.setTexture(this.getOriginalThreatTexture(threat.id));
            }
            continue;
          }

          // In Firewall mode, threats scatter/flee towards their home corners
          if (isFirewallActive) {
            this.moveThreatTowards(threat, threat.homeCorner.x, threat.homeCorner.y, false);
            continue;
          }

          // Deterministic Targeting Logic:
          let targetX = this.playerGridX;
          let targetY = this.playerGridY;

          switch (threat.id) {
            // 1. BLINKY (Gusano de Inflación - Rojo): Perseguidor directo implacable
            case 'blinky':
              targetX = this.playerGridX;
              targetY = this.playerGridY;
              break;

            // 2. PINKY (Bot de Phishing - Magenta): Emboscador 3 nodos por delante
            case 'pinky':
              targetX = this.playerGridX + (this.playerDirX || 0) * 3;
              targetY = this.playerGridY + (this.playerDirY || -1) * 3;
              break;

            // 3. INKY (Malware Oculto - Celeste): Cálculo de vector reflejado con Blinky
            case 'inky': {
              const blinky = this.threats.find(t => t.id === 'blinky');
              const bx = blinky ? blinky.gridX : 8;
              const by = blinky ? blinky.gridY : 8;
              const pivotX = this.playerGridX + (this.playerDirX || 0) * 2;
              const pivotY = this.playerGridY + (this.playerDirY || 0) * 2;
              targetX = pivotX + (pivotX - bx);
              targetY = pivotY + (pivotY - by);
              break;
            }

            // 4. CLYDE (Troyano de Suplantación - Naranja): Acoso dual (lejos persigue, cerca huye)
            case 'clyde': {
              const dist = Math.abs(threat.gridX - this.playerGridX) + Math.abs(threat.gridY - this.playerGridY);
              if (dist > 6) {
                targetX = this.playerGridX;
                targetY = this.playerGridY;
              } else {
                targetX = threat.homeCorner.x;
                targetY = threat.homeCorner.y;
              }
              break;
            }
          }

          this.moveThreatTowards(threat, targetX, targetY, false);
        }

        this.checkThreatCollisions();
      }

      moveThreatTowards(threat: ThreatAgent, tx: number, ty: number, isReturning: boolean) {
        const directions = [
          { dx: 0, dy: -1 }, // up
          { dx: -1, dy: 0 }, // left
          { dx: 0, dy: 1 },  // down
          { dx: 1, dy: 0 }   // right
        ];

        let bestDir = { dx: 0, dy: 0 };
        let minDistance = 99999;

        for (const dir of directions) {
          // Cannot reverse directly onto itself unless trapped
          if (dir.dx === -threat.dirX && dir.dy === -threat.dirY && (threat.dirX !== 0 || threat.dirY !== 0)) {
            continue;
          }

          let nx = threat.gridX + dir.dx;
          const ny = threat.gridY + dir.dy;

          // VPN Warp Row
          if (nx < 0 && ny === 8) nx = this.gridSize - 1;
          else if (nx >= this.gridSize && ny === 8) nx = 0;

          if (!this.isWalkableForThreat(nx, ny, isReturning)) continue;

          const dist = Math.abs(nx - tx) + Math.abs(ny - ty);
          if (dist < minDistance) {
            minDistance = dist;
            bestDir = dir;
          }
        }

        // If trapped, allow reversal
        if (bestDir.dx === 0 && bestDir.dy === 0) {
          bestDir = { dx: -threat.dirX, dy: -threat.dirY };
        }

        let finalX = threat.gridX + bestDir.dx;
        const finalY = threat.gridY + bestDir.dy;

        // VPN Teleport Check
        if (finalX < 0 && finalY === 8) finalX = this.gridSize - 1;
        else if (finalX >= this.gridSize && finalY === 8) finalX = 0;

        threat.dirX = bestDir.dx;
        threat.dirY = bestDir.dy;
        threat.gridX = finalX;
        threat.gridY = finalY;

        const bx = finalX * this.tileSize + this.tileSize / 2;
        const by = finalY * this.tileSize + this.tileSize / 2;

        this.scTweens.add({
          targets: threat.sprite,
          x: bx,
          y: by,
          duration: 180,
          ease: 'Linear'
        });
      }

      checkThreatCollisions() {
        if (gameEngine.gameOver() || gameEngine.levelCompleted() || this.isPlayerVulnerable) return;

        const isFirewallActive = gameEngine.firewallActive();

        for (const threat of this.threats) {
          if (threat.gridX === this.playerGridX && threat.gridY === this.playerGridY) {
            
            if (isFirewallActive && !threat.isRetreatingToQuarantine) {
              // ==========================================
              // CAZA DE AMENAZA (FIREWALL ACTIVO)
              // ==========================================
              threat.isRetreatingToQuarantine = true;
              const bonus = 200 * this.threatsEatenCombo;
              this.threatsEatenCombo = Math.min(8, this.threatsEatenCombo * 2);

              gameEngine.addPoints(bonus, `¡Amenaza [${threat.name}] neutralizada con Firewall 2FA! (+${bonus})`);
              this.showFloatingText(threat.gridX, threat.gridY, `+${bonus} CAZADO`, 0x00e5ff);
              gameSound.playSafeDelivered();
              gameEngine.threatsNeutralized.update(t => t + 1);

            } else if (!isFirewallActive && !threat.isRetreatingToQuarantine) {
              // ========================================================
              // COLISIÓN CON PHISHING / FUGA DE DATOS: -50 PTS Y -1 VIDA
              // ========================================================
              this.handlePlayerBreachCollision(threat);
              break;
            }
          }
        }
      }

      handlePlayerBreachCollision(threat: ThreatAgent) {
        if (this.isPlayerVulnerable) return;
        this.isPlayerVulnerable = true;

        gameDamageSignal.set(true);
        setTimeout(() => gameDamageSignal.set(false), 350);

        this.scCameras.main.shake(280, 0.02);
        this.showFloatingText(this.playerGridX, this.playerGridY, '-50 FUGA DE DATOS', 0xf43f5e);

        // Deduct exactly 50 points (supporting negative balances!)
        gameEngine.deductPoints(50, `Colisión con [${threat.name}]: Fuga de datos`);
        gameEngine.loseLife(`Interceptado por ${threat.name}`, 1);

        // Respawn player
        this.playerGridX = 8;
        this.playerGridY = 12;
        this.playerDirX = 0;
        this.playerDirY = 0;
        this.nextDirX = 0;
        this.nextDirY = 0;

        const px = this.playerGridX * this.tileSize + this.tileSize / 2;
        const py = this.playerGridY * this.tileSize + this.tileSize / 2;
        this.player.setPosition(px, py);

        // 2.5s Blink Invulnerability
        this.scTweens.add({
          targets: this.player,
          alpha: { from: 0.2, to: 1 },
          duration: 150,
          repeat: 8,
          onComplete: () => {
            this.isPlayerVulnerable = false;
            if (this.player) this.player.alpha = 1;
          }
        });
      }

      setFirewallPowerState(isActive: boolean) {
        this.threatsEatenCombo = 1;
        for (const threat of this.threats) {
          if (threat.isRetreatingToQuarantine) continue;
          threat.isVulnerable = isActive;
          threat.sprite.setTexture(isActive ? 'tex_vuln' : this.getOriginalThreatTexture(threat.id));
        }
      }

      getOriginalThreatTexture(id: ThreatAgent['id']): string {
        switch (id) {
          case 'blinky': return 'tex_blinky';
          case 'pinky': return 'tex_pinky';
          case 'inky': return 'tex_inky';
          case 'clyde': return 'tex_clyde';
        }
      }

      handleAllTokensCleared() {
        gameSound.playVictory();
        this.showFloatingText(8, 8, '¡NODO 100% LIMPIO!', 0x10b981);
        
        // Transición automática a la Trivia de Comprensión Lectora
        this.scTime.delayedCall(700, () => {
          gameEngine.triggerLevelClearTrivia();
        });
      }

      showFloatingText(gx: number, gy: number, text: string, colorHex: number) {
        const x = gx * this.tileSize + this.tileSize / 2;
        const y = gy * this.tileSize + this.tileSize / 2;
        const txt = this.scAdd.text(x, y, text, {
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#' + colorHex.toString(16).padStart(6, '0'),
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);

        this.scTweens.add({
          targets: txt,
          y: y - 26,
          alpha: { from: 1, to: 0 },
          duration: 850,
          onComplete: () => txt.destroy()
        });
      }

      override update() {
        if (gameEngine.gameOver() || gameEngine.levelCompleted()) return;

        if (this.cursors && this.wasd) {
          if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up)) {
            this.requestMove('up');
          } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.wasd.down)) {
            this.requestMove('down');
          } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.wasd.left)) {
            this.requestMove('left');
          } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.wasd.right)) {
            this.requestMove('right');
          }
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: containerEl,
      width: parentWidth,
      height: parentHeight,
      backgroundColor: '#060a12',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [MazeScene]
    };

    this.phaserGame = new Phaser.Game(config);
  }

  public movePlayer(dir: 'up' | 'down' | 'left' | 'right'): void {
    if (this.currentScene && typeof this.currentScene.requestMove === 'function') {
      this.currentScene.requestMove(dir);
    }
  }
}
