import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { MazeChallengeOption } from '../../models/game.models';

@Component({
  selector: 'app-maze-challenge-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (engine.activeChallenge(); as challenge) {
      <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#0b1724] via-[#09111c] to-[#060a12] border-2 border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.35)] p-4 sm:p-6 text-slate-100 flex flex-col gap-3">
          
          <!-- Header Strip -->
          <div class="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                <mat-icon class="text-emerald-400 text-lg">table_chart</mat-icon>
              </div>
              <div>
                <span class="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  PUNTO DE CONTROL DE TEORÍA DE JUEGOS
                </span>
                <h3 class="text-sm sm:text-base font-bold text-white leading-tight">
                  {{ challenge.title }}
                </h3>
              </div>
            </div>

            <span class="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-[10px] font-mono font-bold text-emerald-300">
              {{ challenge.theoryConcept }}
            </span>
          </div>

          <!-- Situation Description -->
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
            <p>{{ challenge.situation }}</p>
          </div>

          <!-- Payoff Matrix (if available) -->
          @if (challenge.matrixPayoff; as matrix) {
            <div class="rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950/90 text-[11px] font-mono">
              <div class="bg-cyan-950/70 px-3 py-1 text-cyan-300 font-bold border-b border-cyan-500/20 flex items-center gap-1.5">
                <mat-icon class="text-xs">grid_on</mat-icon>
                <span>MATRIZ DE PAGOS TÁCTICA (2×2)</span>
              </div>
              <div class="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 text-center py-1 bg-slate-900/60 font-bold text-slate-300">
                <div>SI EL RIVAL COOPERA</div>
                <div>SI EL RIVAL DEFECCIONA</div>
              </div>
              <div class="grid grid-cols-2 divide-x divide-slate-800 text-xs">
                <div class="p-2 space-y-1">
                  <span class="text-[10px] text-slate-400 block font-bold">TÚ COOPERAS:</span>
                  <span class="text-emerald-300 font-bold">{{ matrix.playerCooperate.rivalCooperate }}</span>
                </div>
                <div class="p-2 space-y-1">
                  <span class="text-[10px] text-slate-400 block font-bold">TÚ COOPERAS:</span>
                  <span class="text-rose-400 font-bold">{{ matrix.playerCooperate.rivalDefect }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 divide-x divide-slate-800 text-xs border-t border-slate-800">
                <div class="p-2 space-y-1">
                  <span class="text-[10px] text-slate-400 block font-bold">TÚ DEFECCIONAS:</span>
                  <span class="text-cyan-300 font-bold">{{ matrix.playerDefect.rivalCooperate }}</span>
                </div>
                <div class="p-2 space-y-1">
                  <span class="text-[10px] text-slate-400 block font-bold">TÚ DEFECCIONAS:</span>
                  <span class="text-rose-500 font-bold">{{ matrix.playerDefect.rivalDefect }}</span>
                </div>
              </div>
            </div>
          }

          <!-- Tactical Strategy Options -->
          <div class="space-y-2 mt-1">
            <span class="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              ELIGE TU ESTRATEGIA EN EL LABERINTO:
            </span>

            @for (opt of challenge.options; track opt.id) {
              <button
                (click)="selectOption(opt)"
                class="w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 group bg-slate-900/90 hover:bg-slate-800"
                [class.border-emerald-500-40]="opt.isOptimalNash"
                [class.hover:border-emerald-400]="opt.isOptimalNash"
                [class.border-rose-500-30]="!opt.isOptimalNash"
                [class.hover:border-rose-400]="!opt.isOptimalNash">
                
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-sm" [class.text-emerald-400]="opt.isOptimalNash" [class.text-rose-400]="!opt.isOptimalNash">
                      {{ opt.isOptimalNash ? 'verified' : 'warning' }}
                    </mat-icon>
                    <span class="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300">
                      {{ opt.label }}
                    </span>
                  </div>

                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                    [class.bg-emerald-950-80]="opt.isOptimalNash"
                    [class.text-emerald-300]="opt.isOptimalNash"
                    [class.border-emerald-500-40]="opt.isOptimalNash"
                    [class.bg-rose-950-80]="!opt.isOptimalNash"
                    [class.text-rose-300]="!opt.isOptimalNash"
                    [class.border-rose-500-40]="!opt.isOptimalNash">
                    {{ opt.isOptimalNash ? '+PTS / CONGELA BOTS' : 'RIESGO -1♥' }}
                  </span>
                </div>

                <p class="text-xs text-slate-300 pl-6">
                  {{ opt.actionText }}
                </p>
              </button>
            }
          </div>

          <!-- Educational Insight Footer -->
          <div class="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-200 flex items-start gap-2">
            <mat-icon class="text-sm text-cyan-400 shrink-0 mt-0.5">school</mat-icon>
            <p>{{ challenge.educationalInsight }}</p>
          </div>
        </div>
      </div>
    }
  `
})
export class MazeChallengeModal {
  public engine = inject(GameEngineService);

  public selectOption(opt: MazeChallengeOption): void {
    this.engine.solveChallengeOption(opt);
  }
}
