import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-cyber-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (engine.showingIntro()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fade-in select-none">
        
        <!-- Ambient Grid Background -->
        <div class="absolute inset-0 cyber-bg-grid opacity-30 pointer-events-none"></div>

        <!-- Central Futuristic Introduction Console -->
        <div class="relative w-full max-w-2xl bg-[#090e17]/95 border-2 border-cyan-400/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.35)] flex flex-col">
          
          <!-- Top Holographic Scanline bar -->
          <div class="bg-gradient-to-r from-cyan-950 via-cyan-900 to-slate-900 px-4 py-2.5 border-b border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span class="text-cyan-300 font-bold uppercase tracking-widest text-[11px] sm:text-xs">
                SECUENCIA DE INICIO TÁCTICA · CIFRAFLOW
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-slate-400 text-[10px]">DURACIÓN: 3s</span>
              <button 
                (click)="engine.skipIntro()" 
                class="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-800/80 border border-cyan-500/40 text-cyan-200 text-[10px] font-bold tracking-wider hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm">
                <span>Saltar Intro</span>
                <mat-icon class="text-xs">fast_forward</mat-icon>
              </button>
            </div>
          </div>

          <!-- Cover Art Hero Display -->
          <div class="relative w-full aspect-[16/7] sm:aspect-[16/6.5] overflow-hidden group">
            <img 
              src="/assets/images/game_cover_art_1791886896295.jpg" 
              alt="Portada Oficial Cifraflow: Cyber Maze" 
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
            
            <!-- Cyber Hologram Overlay Gradients -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#090e17] via-[#090e17]/30 to-transparent"></div>
            <div class="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>

            <!-- Central Neon Badge -->
            <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-950/90 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(0,229,255,0.7)] mb-2 animate-pulse">
                <mat-icon class="text-cyan-300 text-3xl sm:text-4xl">all_inclusive</mat-icon>
              </div>
              <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_15px_rgba(0,229,255,0.8)]">
                CIFRAFLOW
              </h1>
              <p class="text-[11px] sm:text-xs font-mono text-cyan-300 tracking-wider font-semibold drop-shadow">
                CYBER MAZE · DEFENSA DE RED & ANTI-PHISHING
              </p>
            </div>
          </div>

          <!-- 3-Second Countdown & Diagnostic Progress Panel -->
          <div class="p-4 sm:p-6 bg-slate-950/90 border-t border-cyan-500/20 flex flex-col gap-3.5">
            
            <!-- Countdown Indicator & Status -->
            <div class="flex items-center justify-between gap-3 font-mono">
              <div class="flex items-center gap-3">
                <!-- Large Countdown Badge -->
                <div class="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <span class="text-lg sm:text-xl font-black text-cyan-300 leading-none">
                    {{ engine.introSecondsLeft() }}s
                  </span>
                  <span class="text-[8px] text-cyan-400/80 leading-none mt-0.5">RESTANTE</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-[11px] sm:text-xs text-slate-300 font-bold tracking-wide">
                    INICIALIZANDO SISTEMA DE CIBERDEFENSA
                  </span>
                  <span class="text-[10px] text-cyan-400 font-mono">
                    {{ engine.introStageText() }}
                  </span>
                </div>
              </div>

              <!-- Percentage -->
              <div class="text-right">
                <span class="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                  {{ engine.introProgress() }}%
                </span>
                <span class="block text-[9px] text-slate-400 uppercase tracking-widest">
                  CARGA DE INTRO
                </span>
              </div>
            </div>

            <!-- Progress Bar (Fills in 3 Seconds) -->
            <div class="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-cyan-500/40 p-0.5 shadow-inner">
              <div 
                class="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                [style.width.%]="engine.introProgress()">
              </div>
            </div>

            <!-- Bottom Diagnostic Tickers & Quick CTA -->
            <div class="flex items-center justify-between gap-2 pt-1 text-[10px] sm:text-xs font-mono text-slate-400">
              <div class="flex items-center gap-1.5">
                <mat-icon class="text-emerald-400 text-xs">verified</mat-icon>
                <span class="text-slate-300">Protocolo FIDO2 y Escáner Listos</span>
              </div>

              <button 
                (click)="engine.skipIntro()" 
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.5)] cursor-pointer">
                <span>Entrar al Juego</span>
                <mat-icon class="text-sm">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `
})
export class CyberIntro {
  public engine = inject(GameEngineService);
}
