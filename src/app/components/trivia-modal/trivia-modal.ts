import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { TriviaOption } from '../../data/trivia-cybersecurity.data';

@Component({
  selector: 'app-trivia-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (engine.showingTriviaModal(); as show) {
      @if (engine.activeTrivia(); as trivia) {
        <div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
          <div class="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#0a1628] via-[#081220] to-[#050b14] border-2 border-cyan-400 shadow-[0_0_60px_rgba(0,229,255,0.35)] p-4 sm:p-6 text-slate-100 flex flex-col gap-3.5">
            
            <!-- Header Strip -->
            <div class="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                  <mat-icon class="text-cyan-400 text-xl">school</mat-icon>
                </div>
                <div>
                  <span class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                    COMPRENSIÓN LECTORA DE CIBERSEGURIDAD
                  </span>
                  <h3 class="text-sm sm:text-base font-bold text-white leading-tight">
                    {{ trivia.topic }}
                  </h3>
                </div>
              </div>

              <span class="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300">
                +{{ trivia.rewardPoints }} PTS
              </span>
            </div>

            <!-- Reading Context Card -->
            <div class="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/25 space-y-1.5">
              <div class="flex items-center gap-1.5 text-cyan-300 text-xs font-mono font-bold">
                <mat-icon class="text-xs text-cyan-400">menu_book</mat-icon>
                <span>LECTURA TÁCTICA DEL NODO:</span>
              </div>
              <p class="text-xs text-slate-200 leading-relaxed font-sans">
                {{ trivia.readingContext }}
              </p>
            </div>

            <!-- Question -->
            <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs sm:text-sm font-semibold text-white">
              <span class="text-cyan-400 font-bold mr-1">PREGUNTA:</span>
              {{ trivia.question }}
            </div>

            <!-- Options -->
            <div class="space-y-2 mt-1">
              <span class="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                SELECCIONA LA RESPUESTA CORRECTA:
              </span>

              @for (opt of trivia.options; track opt.id) {
                <button
                  (click)="onSelect(opt)"
                  class="w-full text-left p-3 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400 transition-all cursor-pointer flex items-start gap-2.5 group">
                  <div class="w-5 h-5 rounded-full border border-slate-600 group-hover:border-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold text-slate-400 group-hover:text-cyan-300">
                    <mat-icon class="text-xs opacity-0 group-hover:opacity-100">arrow_right</mat-icon>
                  </div>
                  <span class="text-xs sm:text-sm text-slate-200 group-hover:text-white leading-snug">
                    {{ opt.text }}
                  </span>
                </button>
              }
            </div>

            <!-- Warning Footer -->
            <div class="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
              <span class="flex items-center gap-1 text-emerald-400">
                <mat-icon class="text-xs">verified</mat-icon>
                Acierto: +{{ trivia.rewardPoints }} Capital
              </span>
              <span class="flex items-center gap-1 text-rose-400">
                <mat-icon class="text-xs">warning</mat-icon>
                Fallo: -50 Capital
              </span>
            </div>
          </div>
        </div>
      }
    }
  `
})
export class TriviaModal {
  public engine = inject(GameEngineService);

  public onSelect(opt: TriviaOption): void {
    this.engine.answerTriviaOption(opt);
  }
}
