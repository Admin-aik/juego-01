import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-nash-matrix-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (engine.showingNashMatrixModal()) {
      <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
        <div class="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#0a1628] via-[#0d1c33] to-[#08101e] border-2 border-cyan-400/60 p-4 sm:p-6 shadow-[0_0_50px_rgba(0,229,255,0.35)] flex flex-col gap-4 text-left">
          
          <!-- Close button -->
          <button 
            (click)="engine.showingNashMatrixModal.set(false)"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-rose-900 border border-slate-700 hover:border-rose-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar Matriz">
            <mat-icon class="text-base">close</mat-icon>
          </button>

          <!-- Modal Header -->
          <div class="flex items-start gap-3 border-b border-cyan-500/30 pb-3 pr-8">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
              <mat-icon class="text-2xl">table_chart</mat-icon>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-bold">
                  TEORÍA DE JUEGOS · CIFRA FLOW FINANCIERO
                </span>
                <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold hidden sm:inline">
                  EQUILIBRIO DE NASH
                </span>
              </div>
              <h2 class="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Matriz de Pagos: Dilema del Prisionero & Liquidez
              </h2>
              <p class="text-xs text-slate-300 font-mono">
                Decisiones estratégicas entre el Jugador (Tesorero) y el Mercado Rival.
              </p>
            </div>
          </div>

          <!-- Matriz 2x2 Interactiva de Pagos de Nash -->
          <div class="flex flex-col gap-2 font-mono">
            <span class="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm">grid_view</mat-icon>
              Matriz Estratégica (Recompensa Jugador / Recompensa Mercado)
            </span>

            <div class="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
              <!-- Header Top-Left empty -->
              <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                ESTRATEGIAS
              </div>
              <div class="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold text-[11px]">
                Mercado Estable (Bull)
              </div>
              <div class="p-2 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold text-[11px]">
                Shock de Crisis (Bear)
              </div>

              <!-- Fila 1: Jugador Coopera (Liquidez Segura a Bóveda Central) -->
              <div class="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 font-bold text-[11px] flex flex-col justify-center">
                <span>Inversión Segura</span>
                <span class="text-[9px] text-slate-400 font-normal">(Cooperar · Bóveda)</span>
              </div>
              <div class="p-2.5 rounded-lg bg-emerald-950/80 border-2 border-emerald-400/80 text-emerald-200 flex flex-col justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span class="text-sm sm:text-base font-black text-emerald-300">+$15,000 / +100%</span>
                <span class="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">Óptimo de Pareto ★</span>
                <span class="text-[8px] text-slate-300">Máxima estabilidad mutua</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-cyan-300 flex flex-col justify-center">
                <span class="text-xs sm:text-sm font-bold text-cyan-200">+$5,000 / +90%</span>
                <span class="text-[9px] text-cyan-400 font-bold uppercase mt-0.5">Equilibrio Minimax</span>
                <span class="text-[8px] text-slate-300">Reserva protegida ante shock</span>
              </div>

              <!-- Fila 2: Jugador Deserta (Apalancamiento / Derivado Tóxico sin aislar) -->
              <div class="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-200 font-bold text-[11px] flex flex-col justify-center">
                <span>Especulación</span>
                <span class="text-[9px] text-slate-400 font-normal">(Defección · Tóxico)</span>
              </div>
              <div class="p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-200 flex flex-col justify-center">
                <span class="text-xs sm:text-sm font-bold text-amber-300">+$25,000 / -30%</span>
                <span class="text-[9px] text-amber-400 font-bold uppercase mt-0.5">Riesgo Moral</span>
                <span class="text-[8px] text-slate-300">Ganancia rápida, riesgo oculto</span>
              </div>
              <div class="p-2.5 rounded-lg bg-rose-950/90 border-2 border-rose-500 text-rose-200 flex flex-col justify-center shadow-[0_0_15px_rgba(255,0,85,0.25)]">
                <span class="text-sm sm:text-base font-black text-rose-400">-$50,000 / 0%</span>
                <span class="text-[9px] text-red-400 font-bold uppercase mt-0.5">Castigo del Dilema ⚠️</span>
                <span class="text-[8px] text-rose-300">Contagio sistémico y quiebra</span>
              </div>
            </div>
          </div>

          <!-- Principios de Teoría de Juegos explicados -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div class="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                <mat-icon class="text-sm text-cyan-400">lightbulb</mat-icon>
                <span>Equilibrio de Nash</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Situación en la que ningún agente puede beneficiarse cambiando su estrategia por su cuenta. En Cifraflow, se logra aislando los activos tóxicos en la <strong>Cámara de Liquidación</strong> y garantizando los bonos en la <strong>Bóveda Central</strong>.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div class="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                <mat-icon class="text-sm text-emerald-400">verified</mat-icon>
                <span>Óptimo de Pareto</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                El estado perfecto del sistema donde el rendimiento se maximiza sin perjudicar a ningún participante de la red financiera. Guiar todos los flujos legítimos sin errores desata el bono de Pareto.
              </p>
            </div>
          </div>

          <!-- Bottom CTA -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <span class="text-[10px] font-mono text-slate-400">
              Usa las flechas y giros de vía para alcanzar el Equilibrio de Nash en cada fase.
            </span>
            <button
              (click)="engine.showingNashMatrixModal.set(false)"
              class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer">
              Entendido · Jugar
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class NashMatrixModal {
  public engine = inject(GameEngineService);
}
