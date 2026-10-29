import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-security-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="w-full max-w-4xl mx-auto px-4 md:px-6 select-none mt-3 mb-8">
      <div class="rounded-2xl bg-[#090d16]/90 border border-slate-800 p-4 font-mono text-xs shadow-md">
        <!-- Feed Header -->
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div class="flex items-center gap-2 text-slate-300">
            <mat-icon class="text-xs text-cyan-400">terminal</mat-icon>
            <span class="font-bold tracking-wider text-[11px] text-slate-300 uppercase">
              Consola de Auditoría y Eventos SIEM en Tiempo Real
            </span>
          </div>

          <button 
            (click)="isCollapsed.set(!isCollapsed())"
            class="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer">
            <span>{{ isCollapsed() ? 'Expandir' : 'Minimizar' }}</span>
            <mat-icon class="text-xs">{{ isCollapsed() ? 'expand_more' : 'expand_less' }}</mat-icon>
          </button>
        </div>

        <!-- Event List -->
        @if (!isCollapsed()) {
          <div class="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            @for (log of engine.eventLogs(); track log.id) {
              <div class="flex items-start gap-2 text-[11px] leading-relaxed">
                <span class="text-slate-500 shrink-0 font-mono">[{{ log.timestamp }}]</span>
                
                @switch (log.severity) {
                  @case ('success') {
                    <span class="text-emerald-400 shrink-0">● [OK]</span>
                    <span class="text-emerald-200">{{ log.message }}</span>
                  }
                  @case ('danger') {
                    <span class="text-rose-400 shrink-0">▲ [CRÍTICO]</span>
                    <span class="text-rose-200 font-semibold">{{ log.message }}</span>
                  }
                  @case ('warning') {
                    <span class="text-amber-400 shrink-0">◆ [AVISO]</span>
                    <span class="text-amber-200">{{ log.message }}</span>
                  }
                  @default {
                    <span class="text-cyan-400 shrink-0">■ [INFO]</span>
                    <span class="text-slate-300">{{ log.message }}</span>
                  }
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class SecurityFeed {
  public engine = inject(GameEngineService);
  public isCollapsed = signal<boolean>(false);
}
