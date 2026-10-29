import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { PhaserMazeGame } from '../phaser-maze/phaser-maze';

@Component({
  selector: 'app-cyber-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, PhaserMazeGame],
  host: {
    '(window:keydown)': 'onKeydown($event)'
  },
  template: `
    <div class="relative w-full max-w-5xl mx-auto px-1 sm:px-3 py-1 select-none">
      
      <!-- Marco Principal Táctico -->
      <div class="relative rounded-2xl bg-[#0a101d]/95 border border-cyan-500/30 p-2 sm:p-3.5 md:p-4 shadow-[0_0_35px_rgba(0,229,255,0.12)] backdrop-blur">
        
        <!-- Ambient Grid Background -->
        <div class="absolute inset-0 rounded-2xl cyber-bg-grid opacity-25 pointer-events-none"></div>

        <!-- Encabezado Táctico del Laberinto -->
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-2 px-1 text-xs font-mono">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <mat-icon class="text-cyan-400 text-base">all_inclusive</mat-icon>
            <span class="text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider text-slate-100">
              CIFRAFLOW: EL LABERINTO DEL FIREWALL
            </span>
            <span class="text-[9px] text-cyan-300 bg-cyan-950/80 border border-cyan-400/50 px-1.5 py-0.2 rounded font-bold">
              PHASER.JS ARCADE
            </span>
          </div>

          <!-- Estado de la Puerta VPN y Limpieza -->
          <div class="flex items-center gap-2 text-[10px] sm:text-xs font-mono">
            <span class="flex items-center gap-1 text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/40">
              <mat-icon class="text-xs text-purple-400">vpn_key</mat-icon>
              <span>Puertas VPN: Activas</span>
            </span>
            <button
              (click)="engine.showingRulesModal.set(true)"
              class="flex items-center gap-1 text-amber-300 hover:text-white bg-amber-950/70 border border-amber-400/50 px-2 py-0.5 rounded transition-colors cursor-pointer"
              title="Manual de Reglas: Puntos, Vidas y Amenazas">
              <mat-icon class="text-xs text-amber-400">help_outline</mat-icon>
              <span>Manual Reglas</span>
            </button>
          </div>
        </div>

        <!-- LAYOUT UNIFICADO: LIENZO PHASER + RIGHT-SIDE HUD TRANSLÚCIDO Y CONTROLES DUALES -->
        <!-- En Desktop: Disposición 2 columnas (Tablero a la izquierda, HUD + Botonera a la derecha) -->
        <!-- En Móvil: Tablero arriba y panel táctil flotante con botones virtuales translúcidos abajo sin scroll -->
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
          
          <!-- COLUMNA IZQUIERDA: LIENZO INTERACTIVO PHASER (LABERINTO DE SERVIDORES) -->
          <div class="lg:col-span-7 flex flex-col items-center justify-center w-full">
            <app-phaser-maze #phaserMazeRef></app-phaser-maze>
          </div>

          <!-- COLUMNA DERECHA: RIGHT-SIDE HUD TRANSLÚCIDO & CONTROLES DUALES -->
          <div class="lg:col-span-5 flex flex-col w-full gap-2.5">
            
            <!-- PANEL 1: RIGHT-SIDE HUD TRANSLÚCIDO (FINANZAS Y SALDOS DINÁMICOS) -->
            <div class="rounded-xl sm:rounded-2xl bg-slate-950/90 border border-slate-800/90 p-3 flex flex-col gap-2.5 shadow-lg backdrop-blur-md"
              [class.border-rose-500-60]="engine.negativeBalance()"
              [class.shadow-rose-glow]="engine.negativeBalance()"
              [class.border-cyan-500-40]="!engine.negativeBalance() && !engine.firewallActive()"
              [class.border-cyan-300]="engine.firewallActive()">
              
              <!-- Fila 1 HUD: Capital Acumulado con Soporte de Saldos Negativos -->
              <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <div class="flex flex-col">
                  <span class="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    CAPITAL ACUMULADO
                  </span>
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums"
                      [class.text-rose-400]="engine.negativeBalance()"
                      [class.text-rose-glow]="engine.negativeBalance()"
                      [class.text-emerald-300]="!engine.negativeBalance()">
                      {{ engine.score() }}
                    </span>
                    <span class="text-xs font-mono font-bold"
                      [class.text-rose-400]="engine.negativeBalance()"
                      [class.text-slate-400]="!engine.negativeBalance()">
                      PTS
                    </span>
                  </div>
                </div>

                <!-- Alerta Visual Dinámica si el Saldo es Negativo -->
                @if (engine.negativeBalance()) {
                  <div class="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950 border border-rose-500 text-rose-300 text-[10px] font-mono font-bold animate-pulse">
                    <mat-icon class="text-xs text-rose-400">trending_down</mat-icon>
                    <span>DÉFICIT FINANCIERO</span>
                  </div>
                } @else {
                  <div class="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold">
                    <mat-icon class="text-xs text-emerald-400">trending_up</mat-icon>
                    <span>SOLVENTE</span>
                  </div>
                }
              </div>

              <!-- Fila 2 HUD: Estado del Firewall & Vidas de Capital -->
              <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                <!-- Estado Firewall -->
                <div class="p-2 rounded-xl bg-slate-900/90 border transition-all"
                  [class.border-cyan-400]="engine.firewallActive()"
                  [class.bg-cyan-950-70]="engine.firewallActive()"
                  [class.border-slate-800]="!engine.firewallActive()">
                  <div class="flex items-center justify-between text-[10px] mb-1">
                    <span class="text-slate-400">ESCUDO 2FA</span>
                    <span class="font-bold uppercase" [class.text-cyan-300]="engine.firewallActive()" [class.text-slate-400]="!engine.firewallActive()">
                      {{ engine.firewallActive() ? 'ACTIVO' : 'ESPERA' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <mat-icon class="text-sm" [class.text-cyan-400]="engine.firewallActive()" [class.text-slate-500]="!engine.firewallActive()">
                      shield
                    </mat-icon>
                    <span class="font-bold text-xs" [class.text-white]="engine.firewallActive()" [class.text-slate-400]="!engine.firewallActive()">
                      {{ engine.firewallActive() ? engine.firewallSecondsRemaining() + 's Restantes' : 'Pellet 2FA' }}
                    </span>
                  </div>
                </div>

                <!-- Vidas de Capital -->
                <div class="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-slate-400">VIDAS</span>
                    <span class="text-rose-400 font-bold">{{ engine.lives() }}/3</span>
                  </div>
                  <div class="flex items-center gap-1 text-sm pt-0.5">
                    @for (v of [1, 2, 3]; track v) {
                      <span [class.opacity-25]="engine.lives() < v" [class.text-rose-500]="engine.lives() >= v">
                        {{ engine.lives() >= v ? '❤️' : '🖤' }}
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Fila 3 HUD: Progreso de Limpieza de Tokens del Nodo -->
              <div class="p-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs font-mono">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="text-slate-400">TOKENS POR LIMPIAR:</span>
                  <span class="text-amber-300 font-bold tabular-nums">
                    {{ engine.tokensRemaining() }} / {{ engine.totalTokensInLevel() }}
                  </span>
                </div>
                <!-- Barra de Progreso de Limpieza -->
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                    [style.width.%]="getProgressPercent()">
                  </div>
                </div>
              </div>

              <!-- Fila 4 HUD: Radar de las 4 Amenazas Deterministas de Red -->
              <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono space-y-1">
                <span class="text-slate-400 block font-bold uppercase text-[9px]">AMENAZAS DETECTADAS (IA DETERMINISTA):</span>
                <div class="grid grid-cols-2 gap-1 text-[9px]">
                  <div class="flex items-center gap-1 text-rose-400">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Gusano Inflación (Blinky)</span>
                  </div>
                  <div class="flex items-center gap-1 text-fuchsia-400">
                    <span class="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                    <span>Bot Phishing (Pinky)</span>
                  </div>
                  <div class="flex items-center gap-1 text-cyan-400">
                    <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Malware Oculto (Inky)</span>
                  </div>
                  <div class="flex items-center gap-1 text-orange-400">
                    <span class="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span>Troyano Suplantación (Clyde)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- PANEL 2: CONTROLES DUALES TRANSLÚCIDOS (MÓVIL Y PC SIN DESPLAZAMIENTO) -->
            <div class="rounded-xl sm:rounded-2xl bg-slate-950/90 border border-slate-800/90 p-2.5 sm:p-3 flex flex-col gap-2 shadow-lg backdrop-blur-md">
              
              <div class="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span class="text-[10px] uppercase font-bold text-slate-300 flex items-center gap-1">
                  <mat-icon class="text-xs text-cyan-400">touch_app</mat-icon>
                  <span>BOTONES VIRTUALES LATERALES</span>
                </span>
                <span class="text-[9px] text-slate-400 hidden sm:inline">Teclas: WASD / Flechas</span>
              </div>

              <!-- Botonera D-Pad y Botones Flotantes Translúcidos -->
              <div class="flex items-center justify-around sm:justify-center gap-4 py-1">
                
                <!-- D-Pad Virtual Translúcido -->
                <div class="grid grid-cols-3 gap-1.5 w-[130px] sm:w-[140px] shrink-0">
                  <div></div>
                  <button
                    (click)="onMove('up')"
                    class="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 active:scale-90 border border-slate-700 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
                    title="Mover Arriba (W o ↑)">
                    <mat-icon class="text-xl">arrow_upward</mat-icon>
                  </button>
                  <div></div>

                  <button
                    (click)="onMove('left')"
                    class="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 active:scale-90 border border-slate-700 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
                    title="Mover Izquierda (A o ←)">
                    <mat-icon class="text-xl">arrow_back</mat-icon>
                  </button>
                  
                  <div class="h-10 sm:h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                    VPN
                  </div>

                  <button
                    (click)="onMove('right')"
                    class="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 active:scale-90 border border-slate-700 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
                    title="Mover Derecha (D o →)">
                    <mat-icon class="text-xl">arrow_forward</mat-icon>
                  </button>

                  <div></div>
                  <button
                    (click)="onMove('down')"
                    class="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 active:scale-90 border border-slate-700 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
                    title="Mover Abajo (S o ↓)">
                    <mat-icon class="text-xl">arrow_downward</mat-icon>
                  </button>
                  <div></div>
                </div>

                <!-- Botones Virtuales Flotantes Grid-Cols-2 -->
                <div class="grid grid-cols-1 gap-2 shrink-0 w-36 sm:w-40">
                  <!-- Botón Firewall 2FA Manual -->
                  <button
                    (click)="engine.activateFirewallPower(9)"
                    [disabled]="engine.firewallActive()"
                    class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer active:scale-95 disabled:opacity-40"
                    [class.bg-cyan-950-80]="engine.firewallActive()"
                    [class.border-cyan-400]="engine.firewallActive()"
                    [class.text-cyan-200]="engine.firewallActive()"
                    [class.bg-orange-950-80]="!engine.firewallActive()"
                    [class.border-orange-500-60]="!engine.firewallActive()"
                    [class.text-orange-300]="!engine.firewallActive()">
                    <mat-icon class="text-sm">shield</mat-icon>
                    <span>{{ engine.firewallActive() ? '2FA ACTIVO' : 'ACTIVAR 2FA' }}</span>
                  </button>

                  <!-- Botón Ver Trivia de Aprendizaje -->
                  <button
                    (click)="engine.triggerLevelClearTrivia()"
                    class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400 text-slate-200 transition-all cursor-pointer active:scale-95 shadow-sm">
                    <mat-icon class="text-sm text-cyan-400">school</mat-icon>
                    <span>Trivia Nodo</span>
                  </button>

                  <!-- Botón Manual de Puntos y Vidas -->
                  <button
                    (click)="engine.showingRulesModal.set(true)"
                    class="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-amber-950/70 hover:bg-amber-900 border border-amber-400/50 text-amber-300 transition-all cursor-pointer active:scale-95 shadow-sm">
                    <mat-icon class="text-sm text-amber-400">help</mat-icon>
                    <span>Reglas (+/-PTS)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .border-rose-500-60 { border-color: rgba(255, 0, 85, 0.6); }
    .shadow-rose-glow { box-shadow: 0 0 25px rgba(255, 0, 85, 0.35); }
    .text-rose-glow { text-shadow: 0 0 10px rgba(255, 0, 85, 0.7); }
    .border-cyan-500-40 { border-color: rgba(0, 229, 255, 0.4); }
    .bg-cyan-950-70 { background-color: rgba(8, 51, 68, 0.7); }
    .bg-cyan-950-80 { background-color: rgba(8, 51, 68, 0.8); }
    .bg-orange-950-80 { background-color: rgba(67, 20, 7, 0.8); }
    .border-orange-500-60 { border-color: rgba(249, 115, 22, 0.6); }
  `
})
export class CyberGrid {
  @ViewChild('phaserMazeRef') phaserMazeRef?: PhaserMazeGame;

  public engine = inject(GameEngineService);

  public onMove(dir: 'up' | 'down' | 'left' | 'right'): void {
    if (this.phaserMazeRef) {
      this.phaserMazeRef.movePlayer(dir);
    }
  }

  public getProgressPercent(): number {
    const total = this.engine.totalTokensInLevel();
    const remaining = this.engine.tokensRemaining();
    if (total <= 0) return 0;
    const eaten = total - remaining;
    return Math.min(100, Math.max(0, Math.round((eaten / total) * 100)));
  }

  public onKeydown(event: KeyboardEvent): void {
    if (this.engine.isDispatching() || this.engine.gameOver() || this.engine.levelCompleted()) return;
    if (this.engine.showingCoverModal() || this.engine.showingRulesModal() || this.engine.showingTriviaModal()) return;

    if (this.phaserMazeRef) {
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        this.phaserMazeRef.movePlayer('up');
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        this.phaserMazeRef.movePlayer('down');
      } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        event.preventDefault();
        this.phaserMazeRef.movePlayer('left');
      } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        event.preventDefault();
        this.phaserMazeRef.movePlayer('right');
      }
    }
  }
}
