import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-cyber-hud',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="w-full bg-[#0d1117]/98 select-none flex flex-col">
      
      <!-- CONTENEDOR PRINCIPAL DEL MENÚ -->
      <div class="px-3 md:px-5 py-2.5 md:py-0 md:h-16 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-5">
        
        <!-- FILA 1 EN MÓVIL (Y SECCIÓN IZQUIERDA EN DESKTOP): Logotipo Cifraflow y Acciones Rápidas -->
        <div class="flex items-center justify-between gap-2.5 w-full md:w-auto">
          <!-- Brand title & Operator Wordmark -->
          <div class="flex items-center gap-2 shrink-0">
            <div class="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              <mat-icon class="text-cyan-400 text-lg md:text-xl">all_inclusive</mat-icon>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="font-black text-sm md:text-base tracking-wider text-white uppercase whitespace-nowrap">
                  CIFRA FLOW
                </span>
                <span class="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-1 rounded uppercase font-bold">
                  FINANCIERO
                </span>
              </div>
              <span class="text-[9px] md:text-[10px] font-mono text-cyan-300 tracking-wider">
                TEORÍA DE JUEGOS · NASH FLOW
              </span>
            </div>
          <!-- Acciones Rápidas Móvil (Fila 1 derecha) -->
          <div class="flex md:hidden items-center gap-1 shrink-0">
            <!-- Botón Reglas Puntos y Vidas Móvil -->
            <button 
              (click)="engine.showingRulesModal.set(true)"
              class="flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg border border-amber-500/50 bg-amber-950/80 text-amber-300 hover:bg-amber-900/80 transition-colors cursor-pointer"
              title="Reglas: Cómo ganar puntos y perder vidas">
              <mat-icon class="text-xs text-amber-400">help_outline</mat-icon>
              <span>Reglas</span>
            </button>

            <!-- Botón Matriz Nash Móvil -->
            <button 
              (click)="engine.showingNashMatrixModal.set(true)"
              class="flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg border border-emerald-500/50 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900/80 transition-colors cursor-pointer"
              title="Ver Matriz de Pagos de Teoría de Juegos">
              <mat-icon class="text-xs text-emerald-400">table_chart</mat-icon>
              <span>Matriz</span>
            </button>

            <!-- Botón Ver Intro Móvil (3 segundos) -->
            <button 
              (click)="engine.startIntro()"
              class="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg border border-cyan-500/40 bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900/80 transition-colors cursor-pointer"
              title="Ver Introducción de 3 segundos">
              <mat-icon class="text-xs text-cyan-400">play_circle</mat-icon>
              <span>Intro 3s</span>
            </button>

            <!-- Botón Portada Móvil -->
            <button 
              (click)="engine.showingCoverModal.set(true)"
              class="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/70 transition-colors cursor-pointer"
              title="Ver Portada del Juego">
              <mat-icon class="text-xs text-cyan-400">image</mat-icon>
              <span>Portada</span>
            </button>

            <!-- Narración de Voz Móvil -->
            <button 
              (click)="sound.toggleVoiceNarration()"
              class="p-1.5 rounded-lg border transition-colors cursor-pointer"
              [class.bg-cyan-950-60]="sound.isVoiceNarrationEnabled()"
              [class.border-cyan-400-50]="sound.isVoiceNarrationEnabled()"
              [class.text-cyan-300]="sound.isVoiceNarrationEnabled()"
              [class.bg-slate-800-80]="!sound.isVoiceNarrationEnabled()"
              [class.border-slate-700]="!sound.isVoiceNarrationEnabled()"
              [title]="sound.isVoiceNarrationEnabled() ? 'Voz: Activada' : 'Voz: Silenciada'">
              <mat-icon class="text-base leading-none">
                {{ sound.isVoiceNarrationEnabled() ? 'record_voice_over' : 'voice_over_off' }}
              </mat-icon>
            </button>

            <!-- Audio Mute Móvil -->
            <button 
              (click)="sound.toggleMute()"
              class="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 transition-colors cursor-pointer"
              [title]="sound.isMuted() ? 'Activar Sonido' : 'Silenciar Audio'">
              <mat-icon class="text-base leading-none">
                {{ sound.isMuted() ? 'volume_off' : 'volume_up' }}
              </mat-icon>
            </button>

            <!-- Reiniciar Nivel Móvil -->
            <button 
              (click)="engine.restartCurrentLevel()"
              class="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Reiniciar Nivel Actual">
              <mat-icon class="text-base leading-none">refresh</mat-icon>
            </button>
          </div>
        </div>

        <!-- FILA 2 EN MÓVIL (Y CENTRO EN DESKTOP): Métricas Completas por Filas Visibles -->
        <div class="grid grid-cols-3 sm:grid-cols-4 md:flex items-center gap-1.5 md:gap-2 w-full md:w-auto text-xs font-mono text-slate-300 pt-1 md:pt-0 border-t md:border-t-0 border-slate-800/80">
          
          <!-- Nivel / Fase -->
          <div class="flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70">
            <span class="text-slate-400 text-[9px] md:text-xs">FASE</span>
            <span class="text-cyan-300 font-bold whitespace-nowrap text-[10px] md:text-xs">
              {{ engine.currentLevel().id }}/{{ engine.allLevels.length }}
            </span>
          </div>

          <!-- VIDAS DE CAPITAL (3 VIDAS) -->
          <div class="flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-rose-500/40"
            [class.animate-pulse]="engine.lives() === 1">
            <mat-icon class="text-rose-500 text-xs">favorite</mat-icon>
            <span class="text-slate-400 text-[9px] md:text-xs hidden sm:inline">VIDAS</span>
            <div class="flex items-center gap-0.5">
              @for (v of [1, 2, 3]; track v) {
                <span class="text-[11px] sm:text-xs transition-transform" [class.opacity-30]="engine.lives() < v">
                  {{ engine.lives() >= v ? '❤️' : '🖤' }}
                </span>
              }
            </div>
          </div>

          <!-- Escudo / Solvencia -->
          <div class="flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border"
            [class.border-cyan-500-30]="engine.shieldIntegrity() > 50"
            [class.border-amber-500-40]="engine.shieldIntegrity() <= 50 && engine.shieldIntegrity() > 25"
            [class.border-red-500-60]="engine.shieldIntegrity() <= 25">
            <mat-icon class="text-xs"
              [class.text-cyan-400]="engine.shieldIntegrity() > 50"
              [class.text-amber-400]="engine.shieldIntegrity() <= 50 && engine.shieldIntegrity() > 25"
              [class.text-rose-500]="engine.shieldIntegrity() <= 25">
              shield
            </mat-icon>
            <div class="w-8 sm:w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
              <div 
                class="h-full transition-all duration-300"
                [class.bg-cyan-400]="engine.shieldIntegrity() > 50"
                [class.bg-amber-400]="engine.shieldIntegrity() <= 50 && engine.shieldIntegrity() > 25"
                [class.bg-rose-500]="engine.shieldIntegrity() <= 25"
                [style.width.%]="engine.shieldIntegrity()">
              </div>
            </div>
            <span class="font-bold tabular-nums text-slate-100 text-[10px] md:text-xs">{{ engine.shieldIntegrity() }}%</span>
          </div>

          <!-- Puntos y Balance Financiero -->
          <div class="flex items-center justify-center gap-1 px-2 py-1 rounded-lg border transition-all"
            [class.bg-rose-950/80]="engine.negativeBalance()"
            [class.border-rose-500]="engine.negativeBalance()"
            [class.shadow-[0_0_12px_rgba(244,63,94,0.4)]]="engine.negativeBalance()"
            [class.bg-slate-900/90]="!engine.negativeBalance()"
            [class.border-slate-700/70]="!engine.negativeBalance()">
            <mat-icon class="text-xs" [class.text-rose-400]="engine.negativeBalance()" [class.text-emerald-400]="!engine.negativeBalance()">
              {{ engine.negativeBalance() ? 'warning' : 'stars' }}
            </mat-icon>
            <span class="text-[9px] md:text-xs" [class.text-rose-300]="engine.negativeBalance()" [class.text-slate-400]="!engine.negativeBalance()">PTS</span>
            <span class="font-bold tabular-nums text-[10px] md:text-xs"
              [class.text-rose-400]="engine.negativeBalance()"
              [class.animate-pulse]="engine.negativeBalance()"
              [class.text-emerald-300]="!engine.negativeBalance()">
              {{ engine.score() }}
            </span>
          </div>

          <!-- Giros o Tiempo (si está activo) -->
          @if (engine.movesRemaining() !== null) {
            <div class="col-span-3 sm:col-span-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70">
              <mat-icon class="text-cyan-400 text-xs">swap_calls</mat-icon>
              <span class="text-slate-400 text-[9px] md:text-xs">GIROS</span>
              <span class="font-bold tabular-nums text-cyan-300 text-[10px] md:text-xs">{{ engine.movesRemaining() }}</span>
            </div>
          } @else if (engine.timeRemaining() !== null) {
            <div class="col-span-3 sm:col-span-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70"
              [class.border-red-500-50]="engine.timeRemaining()! <= 15">
              <mat-icon class="text-xs" [class.text-rose-400]="engine.timeRemaining()! <= 15" [class.text-amber-400]="engine.timeRemaining()! > 15">timer</mat-icon>
              <span class="text-slate-400 text-[9px] md:text-xs">TIEMPO</span>
              <span class="font-bold tabular-nums text-[10px] md:text-xs" [class.text-rose-400]="engine.timeRemaining()! <= 15" [class.text-amber-300]="engine.timeRemaining()! > 15">
                {{ engine.timeRemaining() }}s
              </span>
            </div>
          }
        </div>

        <!-- FILA 3 EN MÓVIL (Y DERECHA EN DESKTOP): Botones de Códice, Unity y Opciones -->
        <div class="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-between md:justify-end shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-800/80">
          <!-- Botón Reglas: Puntos y Vidas (Desktop) -->
          <button 
            (click)="engine.showingRulesModal.set(true)"
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono rounded-lg border border-amber-500/50 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            title="Ver cómo ganar puntos y cómo se pierden vidas en la Teoría de Juegos de Laberintos">
            <mat-icon class="text-base text-amber-400">help_outline</mat-icon>
            <span>Reglas (Puntos & Vidas)</span>
          </button>

          <!-- Botón Matriz de Nash (Desktop) -->
          <button 
            (click)="engine.showingNashMatrixModal.set(true)"
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono rounded-lg border border-emerald-500/50 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            title="Ver Matriz de Pagos de Teoría de Juegos y Equilibrio de Nash">
            <mat-icon class="text-base text-emerald-400">table_chart</mat-icon>
            <span>Matriz Nash (2×2)</span>
          </button>

          <!-- Botón Ver Intro (3 segundos en desktop) -->
          <button 
            (click)="engine.startIntro()"
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-200 hover:text-white transition-colors cursor-pointer shadow-sm"
            title="Ver Introducción de 3 segundos">
            <mat-icon class="text-base text-cyan-400">play_circle</mat-icon>
            <span class="hidden sm:inline">Intro (3s)</span>
          </button>

          <!-- Game Cover Art Button (visible en desktop) -->
          <button 
            (click)="engine.showingCoverModal.set(true)"
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 transition-colors cursor-pointer"
            title="Ver Portada Oficial del Juego">
            <mat-icon class="text-base text-cyan-400">image</mat-icon>
            <span class="hidden sm:inline">Portada</span>
          </button>

          <!-- Threat Encyclopedia -->
          <button 
            (click)="engine.showingThreatEncyclopedia.set(true)"
            class="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 hover:border-cyan-400/50 text-slate-200 transition-colors cursor-pointer"
            title="Enciclopedia de Ciberamenazas">
            <mat-icon class="text-xs sm:text-sm text-cyan-400">menu_book</mat-icon>
            <span class="whitespace-nowrap font-mono text-[10px] sm:text-xs">Códice Amenazas</span>
          </button>

          <!-- Unity C# Prototype Hub -->
          <button 
            (click)="engine.showingUnityHub.set(true)"
            class="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-300 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.15)]"
            title="Ver Arquitectura Unity / C#">
            <mat-icon class="text-xs sm:text-sm text-cyan-400">integration_instructions</mat-icon>
            <span class="whitespace-nowrap font-mono text-[10px] sm:text-xs">Unity C# Arch</span>
          </button>

          <!-- Voice Narrator Toggle (visible en desktop) -->
          <button 
            (click)="sound.toggleVoiceNarration()"
            class="hidden md:block p-2 rounded-lg border transition-colors cursor-pointer"
            [class.bg-cyan-950-50]="sound.isVoiceNarrationEnabled()"
            [class.border-cyan-400-50]="sound.isVoiceNarrationEnabled()"
            [class.text-cyan-300]="sound.isVoiceNarrationEnabled()"
            [class.bg-slate-800-80]="!sound.isVoiceNarrationEnabled()"
            [class.border-slate-700]="!sound.isVoiceNarrationEnabled()"
            [class.text-slate-500]="!sound.isVoiceNarrationEnabled()"
            [title]="sound.isVoiceNarrationEnabled() ? 'Narración de Voz: Activada' : 'Narración de Voz: Silenciada'">
            <mat-icon class="text-lg">
              {{ sound.isVoiceNarrationEnabled() ? 'record_voice_over' : 'voice_over_off' }}
            </mat-icon>
          </button>

          <!-- Audio Mute Toggle (visible en desktop) -->
          <button 
            (click)="sound.toggleMute()"
            class="hidden md:block p-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            [title]="sound.isMuted() ? 'Activar Sonido' : 'Silenciar Audio'">
            <mat-icon class="text-lg">
              {{ sound.isMuted() ? 'volume_off' : 'volume_up' }}
            </mat-icon>
          </button>

          <!-- Reiniciar Nivel (visible en desktop) -->
          <button 
            (click)="engine.restartCurrentLevel()"
            class="hidden md:block p-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reiniciar Nivel Actual">
            <mat-icon class="text-lg">refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- BANNER DE NARRACIÓN EN VIVO (Transcribe y narra cada acción en pantalla) -->
      <div class="w-full bg-[#081b29]/90 border-t border-cyan-500/30 px-3.5 md:px-6 py-1.5 flex items-center justify-between gap-2 text-xs font-mono">
        <div class="flex items-center gap-2 overflow-hidden flex-1">
          <div class="flex items-center gap-1.5 text-cyan-400 shrink-0">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <mat-icon class="text-sm">record_voice_over</mat-icon>
            <span class="font-bold text-[10px] md:text-xs uppercase tracking-wide">NARRADOR TÁCTICO:</span>
          </div>
          <span class="truncate text-slate-100 text-[11px] md:text-xs font-medium">
            {{ sound.lastNarration() }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button 
            (click)="sound.narrate(sound.lastNarration(), true)"
            class="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-900/60 hover:bg-cyan-800/70 border border-cyan-400/50 text-[10px] text-cyan-300 transition-colors cursor-pointer"
            title="Repetir audio narrado de la acción">
            <mat-icon class="text-xs">volume_up</mat-icon>
            <span class="hidden sm:inline">Repetir voz</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .bg-cyan-950-60 { background-color: rgba(8, 51, 68, 0.6); }
    .bg-cyan-950-50 { background-color: rgba(8, 51, 68, 0.5); }
    .border-cyan-400-50 { border-color: rgba(0, 229, 255, 0.5); }
    .bg-slate-800-80 { background-color: rgba(30, 41, 59, 0.8); }
    .border-cyan-500-30 { border-color: rgba(0, 229, 255, 0.3); }
    .border-amber-500-40 { border-color: rgba(245, 158, 11, 0.4); }
    .border-red-500-60 { border-color: rgba(239, 68, 68, 0.6); }
    .border-red-500-50 { border-color: rgba(239, 68, 68, 0.5); }
  `
})
export class CyberHud {
  public engine = inject(GameEngineService);
  public sound = inject(SoundService);
}
