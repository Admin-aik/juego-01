import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { UNITY_ARCHITECTURE_SCRIPTS, UnityScriptFile } from '../../data/unity-code.data';

@Component({
  selector: 'app-unity-hub-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (engine.showingUnityHub()) {
      <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-4xl rounded-2xl bg-[#0c1220] border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(0,229,255,0.2)] max-h-[92vh] flex flex-col">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <mat-icon class="text-xl">code</mat-icon>
              </div>
              <div>
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <span>Arquitectura de Prototipo: Unity / C#</span>
                  <span class="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    C# .NET 9 · Unity 6 Ready
                  </span>
                </h3>
                <p class="text-xs text-slate-400">
                  Implementación canónica de scripts MonoBehaviour según la especificación técnica.
                </p>
              </div>
            </div>

            <button 
              (click)="engine.showingUnityHub.set(false)"
              class="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cerrar Hub">
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <!-- Script Selector Tabs -->
          <div class="flex items-center gap-2 pt-4 pb-2 border-b border-slate-800/80 shrink-0 overflow-x-auto">
            @for (script of scripts; track script.filename) {
              <button
                (click)="selectedScript.set(script)"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer whitespace-nowrap"
                [class.bg-cyan-950-60]="selectedScript().filename === script.filename"
                [class.border-cyan-400]="selectedScript().filename === script.filename"
                [class.text-cyan-300]="selectedScript().filename === script.filename"
                [class.bg-slate-900-50]="selectedScript().filename !== script.filename"
                [class.border-slate-800]="selectedScript().filename !== script.filename"
                [class.text-slate-400]="selectedScript().filename !== script.filename">
                <mat-icon class="text-sm">description</mat-icon>
                <span>{{ script.filename }}</span>
              </button>
            }
          </div>

          <!-- Main Content Area: Description & Code View -->
          <div class="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
            
            <!-- Script Description & Features -->
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <p class="text-slate-200 mb-2 font-medium">
                {{ selectedScript().description }}
              </p>
              <div class="flex flex-wrap gap-2">
                @for (item of selectedScript().highlights; track item) {
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                    <mat-icon class="text-cyan-400 text-xs">check</mat-icon>
                    {{ item }}
                  </span>
                }
              </div>
            </div>

            <!-- Code Editor Box -->
            <div class="relative rounded-xl bg-[#090d16] border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
              <!-- Copy button -->
              <div class="sticky top-0 right-0 flex justify-end mb-2">
                <button
                  (click)="copyCode(selectedScript().code)"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer">
                  <mat-icon class="text-xs">{{ copied() ? 'done' : 'content_copy' }}</mat-icon>
                  <span>{{ copied() ? '¡Copiado!' : 'Copiar C#' }}</span>
                </button>
              </div>

              <pre class="text-slate-300 leading-relaxed font-mono select-text"><code>{{ selectedScript().code }}</code></pre>
            </div>
          </div>

          <!-- Footer with Architecture Notes -->
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
            <span>Modularidad: Código probado para Unity Editor 2023+ y Unity 6.</span>
            <button
              (click)="engine.showingUnityHub.set(false)"
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
  `
})
export class UnityHubModal {
  public engine = inject(GameEngineService);
  public scripts = UNITY_ARCHITECTURE_SCRIPTS;
  public selectedScript = signal<UnityScriptFile>(this.scripts[0]);
  public copied = signal<boolean>(false);

  public copyCode(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
