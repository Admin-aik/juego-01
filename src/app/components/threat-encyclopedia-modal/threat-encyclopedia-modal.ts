import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { KnowledgeCard } from '../../models/game.models';

@Component({
  selector: 'app-threat-encyclopedia-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (engine.showingThreatEncyclopedia()) {
      <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-4xl rounded-2xl bg-[#0c1220] border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(0,229,255,0.2)] max-h-[92vh] flex flex-col">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <mat-icon class="text-xl">menu_book</mat-icon>
              </div>
              <div>
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <span>Códice de Ciberdefensa: Enciclopedia de Phishing</span>
                </h3>
                <p class="text-xs text-slate-400">
                  Compendio de vectores de ataque, señales de alerta y defensas corporativas.
                </p>
              </div>
            </div>

            <button 
              (click)="engine.showingThreatEncyclopedia.set(false)"
              class="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cerrar Enciclopedia">
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <!-- Cards List / Selector Tabs -->
          <div class="flex items-center gap-2 pt-4 pb-2 border-b border-slate-800/80 shrink-0 overflow-x-auto">
            @for (card of allCards; track card.id) {
              <button
                (click)="selectedCard.set(card)"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer whitespace-nowrap"
                [class.bg-cyan-950-60]="selectedCard().id === card.id"
                [class.border-cyan-400]="selectedCard().id === card.id"
                [class.text-cyan-300]="selectedCard().id === card.id"
                [class.bg-slate-900-50]="selectedCard().id !== card.id"
                [class.border-slate-800]="selectedCard().id !== card.id"
                [class.text-slate-400]="selectedCard().id !== card.id">
                <mat-icon class="text-sm">security</mat-icon>
                <span>Fase {{ card.levelTrigger }}: {{ card.attackType }}</span>
              </button>
            }
          </div>

          <!-- Card Content Body -->
          <div class="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
            @if (selectedCard(); as card) {
              <div class="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono text-cyan-400 uppercase">
                    Cápsula #{{ card.levelTrigger }} · {{ card.attackType }}
                  </span>
                  <span class="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase"
                    [class.bg-rose-950]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'"
                    [class.text-rose-300]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'"
                    [class.border]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'"
                    [class.border-rose-500-40]="card.threatLevel === 'Crítico' || card.threatLevel === 'Alto'">
                    Nivel de Riesgo: {{ card.threatLevel }}
                  </span>
                </div>

                <h3 class="text-lg font-bold text-white">{{ card.title }}</h3>
                <p class="text-xs text-slate-300 leading-relaxed">{{ card.summary }}</p>

                <div class="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
                  <strong class="text-cyan-400">Impacto Estadístico Real: </strong>
                  {{ card.realWorldImpact }}
                </div>

                <!-- Red Flags List -->
                <div class="pt-2">
                  <h4 class="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <mat-icon class="text-sm">warning</mat-icon>
                    Señales de Alerta Críticas (Red Flags):
                  </h4>
                  <ul class="space-y-1.5 text-xs text-slate-300">
                    @for (flag of card.redFlagsToCheck; track flag) {
                      <li class="flex items-start gap-2">
                        <mat-icon class="text-rose-400 text-xs mt-0.5 shrink-0">priority_high</mat-icon>
                        <span>{{ flag }}</span>
                      </li>
                    }
                  </ul>
                </div>

                <!-- Defense Protocol -->
                <div class="pt-2">
                  <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <mat-icon class="text-sm">verified_user</mat-icon>
                    Buenas Prácticas Recomendadas:
                  </h4>
                  <ul class="space-y-1.5 text-xs text-slate-300">
                    @for (item of card.defenseGuidelines; track item) {
                      <li class="flex items-start gap-2">
                        <mat-icon class="text-emerald-400 text-xs mt-0.5 shrink-0">check</mat-icon>
                        <span>{{ item }}</span>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
            <span>Formación continua en concienciación de seguridad ofensiva y defensiva.</span>
            <button
              (click)="engine.showingThreatEncyclopedia.set(false)"
              class="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .bg-cyan-950-60 { background-color: rgba(8, 51, 68, 0.6); }
    .bg-slate-900-50 { background-color: rgba(15, 23, 42, 0.5); }
    .border-rose-500-40 { border-color: rgba(255, 0, 85, 0.4); }
  `
})
export class ThreatEncyclopediaModal {
  public engine = inject(GameEngineService);
  public allCards: KnowledgeCard[] = this.engine.allLevels.map(l => l.knowledgeCard);
  public selectedCard = signal<KnowledgeCard>(this.allCards[0]);
}
