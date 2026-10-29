import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-knowledge-card-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (engine.showingKnowledgeCard(); as show) {
      <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-2xl rounded-2xl bg-[#0d1424] border border-cyan-400/40 p-6 md:p-8 shadow-[0_0_50px_rgba(0,229,255,0.25)] max-h-[90vh] overflow-y-auto">
          
          <!-- Victory Banner Header -->
          <div class="text-center pb-6 border-b border-slate-800">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <mat-icon class="text-cyan-300 text-3xl">verified</mat-icon>
            </div>
            <div class="flex items-center justify-center gap-2 mb-1">
              <span class="text-xs font-mono tracking-widest text-cyan-400 uppercase">
                FASE {{ engine.currentLevel().id }} COMPLETADA
              </span>
              <span class="text-slate-500">·</span>
              <span class="text-xs font-mono text-emerald-400 uppercase">RED DESINFECTADA</span>
            </div>
            <h2 class="text-2xl font-black text-white tracking-tight">
              ¡Red Limpia! Has Escapado del Phishing
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Ledger de seguridad certificado con éxito. Escudo restante: <strong class="text-cyan-300">{{ engine.shieldIntegrity() }}%</strong>
            </p>
          </div>

          <!-- Knowledge Capsule Card -->
          @if (engine.currentLevel().knowledgeCard; as card) {
            <div class="mt-6 space-y-4">
              <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                    Cápsula de Aprendizaje · {{ card.attackType }}
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase"
                    [class.bg-rose-950]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'"
                    [class.text-rose-300]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'"
                    [class.border]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'"
                    [class.border-rose-500-40]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'">
                    Nivel de Riesgo: {{ card.threatLevel }}
                  </span>
                </div>
                
                <h3 class="text-base font-bold text-slate-100 mb-2">
                  {{ card.title }}
                </h3>
                
                <p class="text-xs text-slate-300 leading-relaxed">
                  {{ card.summary }}
                </p>

                <!-- Impact Stat -->
                <div class="mt-3 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
                  <span class="font-bold text-cyan-400">Impacto Real en la Industria: </span>
                  {{ card.realWorldImpact }}
                </div>
              </div>

              <!-- Red Flags Checklist -->
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <h4 class="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <mat-icon class="text-sm">rule</mat-icon>
                  Lista de Verificación Rápida (Red Flags a Detectar):
                </h4>
                <ul class="space-y-1.5 text-xs text-slate-300">
                  @for (flag of card.redFlagsToCheck; track flag) {
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-rose-400 text-xs mt-0.5 shrink-0">check_circle</mat-icon>
                      <span>{{ flag }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Defense Action Guidelines -->
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <mat-icon class="text-sm">security</mat-icon>
                  Protocolo de Respuesta del Analista:
                </h4>
                <ul class="space-y-1.5 text-xs text-slate-300">
                  @for (tip of card.defenseGuidelines; track tip) {
                    <li class="flex items-start gap-2">
                      <mat-icon class="text-emerald-400 text-xs mt-0.5 shrink-0">done</mat-icon>
                      <span>{{ tip }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }

          <!-- Footer Buttons -->
          <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              (click)="engine.showingKnowledgeCard.set(false)"
              class="px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700">
              Revisar Red
            </button>

            <button
              (click)="onNextLevel()"
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer">
              <span>{{ engine.currentLevelIndex() < engine.allLevels.length - 1 ? 'Siguiente Nivel' : 'Reiniciar Campaña' }}</span>
              <mat-icon class="text-sm">arrow_forward</mat-icon>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .border-rose-500-40 { border-color: rgba(255, 0, 85, 0.4); }
  `
})
export class KnowledgeCardModal {
  public engine = inject(GameEngineService);

  public onNextLevel(): void {
    this.engine.showingKnowledgeCard.set(false);
    this.engine.nextLevel();
  }
}
