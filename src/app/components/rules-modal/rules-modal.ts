import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-rules-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (engine.showingRulesModal()) {
      <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#0a1322] via-[#08101a] to-[#040810] border-2 border-cyan-500/60 shadow-[0_0_60px_rgba(0,229,255,0.3)] p-4 sm:p-6 text-slate-100 flex flex-col gap-4">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-cyan-500/30 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                <mat-icon class="text-cyan-400 text-xl">menu_book</mat-icon>
              </div>
              <div>
                <span class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                  ESPECIFICACIÓN TÉCNICA Y MANUAL
                </span>
                <h2 class="text-base sm:text-lg font-black text-white">
                  CIFRAFLOW: EL LABERINTO DEL FIREWALL
                </h2>
              </div>
            </div>

            <button
              (click)="engine.showingRulesModal.set(false)"
              class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
              <mat-icon class="text-sm">close</mat-icon>
            </button>
          </div>

          <!-- Section 1: Propósito del Sistema y Mecánica del Laberinto -->
          <div class="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-2 text-xs text-slate-300">
            <div class="flex items-center gap-2 text-cyan-300 font-bold text-xs sm:text-sm font-mono">
              <mat-icon class="text-base text-cyan-400">lan</mat-icon>
              <span>EL GRAFO DE NODOS Y TÚNELES VPN</span>
            </div>
            <p class="leading-relaxed">
              Asumes el rol de un analista de datos navegando por un circuito cerrado de servidores interconectados. Los pasillos de alta velocidad cuentan con <strong>túneles de teletransporte lateral (puertas de enlace VPN)</strong> en la fila central: salir por el borde izquierdo te transporta de inmediato al extremo derecho y viceversa, rompiendo el cálculo de los atacantes.
            </p>
          </div>

          <!-- Section 2: Inteligencia Artificial Determinista de las 4 Amenazas -->
          <div class="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2.5 text-xs text-slate-300">
            <div class="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm font-mono">
              <mat-icon class="text-base text-purple-400">smart_toy</mat-icon>
              <span>LAS 4 AMENAZAS DETERMINISTAS (IA DE RED)</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div class="p-2 rounded-lg bg-slate-950/90 border border-rose-500/40">
                <strong class="text-rose-400 block font-bold">🔴 Gusano de Inflación (Blinky):</strong>
                <span>Perseguidor directo implacable que rastrea tu nodo exacto en tiempo real para devaluar tu capital.</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-950/90 border border-fuchsia-500/40">
                <strong class="text-fuchsia-400 block font-bold">🟣 Bot de Phishing (Pinky):</strong>
                <span>Emboscador de tráfico que calcula 3 nodos por delante en tu dirección para tenderte una trampa.</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-950/90 border border-cyan-500/40">
                <strong class="text-cyan-400 block font-bold">🔵 Malware Oculto (Inky):</strong>
                <span>Amenaza impredecible cuyo vector se calcula combinando la posición de Blinky y tu avance.</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-950/90 border border-orange-500/40">
                <strong class="text-orange-400 block font-bold">🟠 Troyano de Suplantación (Clyde):</strong>
                <span>Acoso dual: si estás lejos te persigue; pero si te acercas a menos de 6 nodos, huye a cuarentena.</span>
              </div>
            </div>
          </div>

          <!-- Section 3: CÓMO GANAR PUNTOS Y FIREWALL 2FA -->
          <div class="p-3 sm:p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs font-mono">
            <div class="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
              <mat-icon class="text-base text-emerald-400">stars</mat-icon>
              <span>CÓMO GANAR PUNTOS (+PTS)</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="p-2 rounded-lg bg-slate-900/90 border border-emerald-500/20">
                <span class="text-amber-300 font-bold block">Token Legítimo:</span>
                <span class="text-emerald-300 font-bold text-sm">+100 PTS</span>
                <p class="text-[10px] text-slate-400 mt-1">Paquetes de red que limpian el nodo al 100%.</p>
              </div>

              <div class="p-2 rounded-lg bg-slate-900/90 border border-emerald-500/20">
                <span class="text-cyan-300 font-bold block">Caza con Firewall:</span>
                <span class="text-emerald-300 font-bold text-sm">+200 a +800 PTS</span>
                <p class="text-[10px] text-slate-400 mt-1">Neutralizar amenazas azules en estado 2FA.</p>
              </div>

              <div class="p-2 rounded-lg bg-slate-900/90 border border-emerald-500/20">
                <span class="text-purple-300 font-bold block">Trivia del Nodo:</span>
                <span class="text-emerald-300 font-bold text-sm">+150 PTS</span>
                <p class="text-[10px] text-slate-400 mt-1">Prueba de comprensión lectora al limpiar el mapa.</p>
              </div>
            </div>
          </div>

          <!-- Section 4: CÓMO SE PIERDEN VIDAS Y SALDOS NEGATIVOS -->
          <div class="p-3 sm:p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2 text-xs font-mono">
            <div class="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
              <mat-icon class="text-base text-rose-400">warning</mat-icon>
              <span>PÉRDIDA DE VIDAS Y SALDOS NEGATIVOS (-50 PTS)</span>
            </div>

            <p class="text-slate-300">
              Dispones de <strong>3 VIDAS DE CAPITAL / SOLVENCIA</strong> (<span class="text-rose-400">❤️❤️❤️</span>).
            </p>

            <div class="space-y-1.5 text-[11px]">
              <div class="p-2 rounded-lg bg-slate-900/90 border border-rose-500/30">
                <strong class="text-rose-300">Colisión con Phishing / Amenaza sin Firewall:</strong>
                <p class="text-slate-400">
                  Drena inmediatamente <strong>-50 PTS</strong> de tu capital acumulado y te cuesta <strong>-1 Vida</strong>.
                </p>
              </div>

              <div class="p-2 rounded-lg bg-slate-900/90 border border-rose-500/30">
                <strong class="text-rose-300">Soporte de Saldos Negativos Dinámicos:</strong>
                <p class="text-slate-400">
                  Si las fugas de datos superan tus aciertos, el Right-Side HUD registra saldos negativos (ej. <strong>-50 PTS, -100 PTS</strong>) con una alerta visual en rojo neón.
                </p>
              </div>

              <div class="p-2 rounded-lg bg-rose-950 border border-rose-500 text-center font-bold text-rose-200">
                ¡0 VIDAS = QUIEBRA SISTÉMICA / INSOLVENCIA TOTAL!
              </div>
            </div>
          </div>

          <!-- Close CTA -->
          <div class="flex justify-end pt-1">
            <button
              (click)="engine.showingRulesModal.set(false)"
              class="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer">
              ¡Entendido! Regresar a la Red
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class RulesModal {
  public engine = inject(GameEngineService);
}
