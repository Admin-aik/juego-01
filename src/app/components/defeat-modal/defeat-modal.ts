import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-defeat-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (engine.gameOver()) {
      <div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#180a14] via-[#10060d] to-[#080206] border-2 border-rose-500/80 p-6 md:p-8 shadow-[0_0_60px_rgba(255,0,85,0.45)] text-center">
          
          <!-- Warning Icon -->
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400 mb-3 shadow-[0_0_25px_rgba(255,0,85,0.5)] animate-pulse">
            <mat-icon class="text-rose-400 text-3xl">heart_broken</mat-icon>
          </div>

          <div class="text-xs font-mono text-rose-400 uppercase tracking-widest mb-1 font-bold">
            0/3 VIDAS · QUIEBRA SISTÉMICA
          </div>

          <h2 class="text-2xl font-black text-white tracking-tight mb-2">
            Insolvencia de Capital
          </h2>

          <p class="text-xs text-rose-200/90 leading-relaxed p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 mb-4 font-mono text-left">
            {{ engine.defeatReason() || 'Has agotado tus 3 vidas de solvencia frente a la estrategia adversarial del Bot Minimax.' }}
          </p>

          <!-- Lección de Teoría de Juegos -->
          <div class="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-200 text-left mb-5 flex items-start gap-2">
            <mat-icon class="text-sm text-cyan-400 shrink-0 mt-0.5">school</mat-icon>
            <p>
              <strong>Lección de Teoría de Juegos:</strong> En juegos de persecución y evasión de suma cero, cuando el perseguidor aplica la estrategia Minimax, el evasor debe utilizar estrategias mixtas, cortafuegos tácticos y anticipación de cuellos de botella para garantizar la supervivencia del capital.
            </p>
          </div>

          <div class="space-y-2.5">
            <button
              (click)="engine.restartCurrentLevel()"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-[0_0_20px_rgba(255,0,85,0.4)] cursor-pointer">
              <mat-icon class="text-base">refresh</mat-icon>
              <span>Restablecer Vidas (3/3) y Reintentar Fase</span>
            </button>

            <button
              (click)="openRules()"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 transition-colors cursor-pointer border border-amber-500/50">
              <mat-icon class="text-base text-amber-400">help_outline</mat-icon>
              <span>Ver Guía: Cómo Ganar Puntos y Proteger Vidas</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class DefeatModal {
  public engine = inject(GameEngineService);

  public openRules(): void {
    this.engine.showingRulesModal.set(true);
  }
}
