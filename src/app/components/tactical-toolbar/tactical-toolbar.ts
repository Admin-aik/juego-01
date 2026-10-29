import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-tactical-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="w-full max-w-4xl mx-auto px-4 md:px-6 select-none mt-2">
      <div class="rounded-2xl bg-[#0d1424]/95 border border-cyan-500/20 p-4 backdrop-blur flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        
        <!-- Left: Analyst Operator Holographic Card -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-400/50 shadow-[0_0_12px_rgba(0,229,255,0.3)] shrink-0 bg-slate-900">
            <img 
              src="/assets/images/cyber_analyst_portrait_1791885440287.jpg" 
              alt="Operador Táctico de Ciberdefensa"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-cyan-500/10 mix-blend-screen pointer-events-none"></div>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Analista de Seguridad
              </span>
              <span class="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded bg-cyan-950/40">
                ACTIVO
              </span>
            </div>
            <span class="text-[11px] text-slate-400 max-w-xs truncate">
              {{ engine.currentLevel().subtitle }}
            </span>
          </div>
        </div>

        <!-- Center: Tactical Power-ups (Firewall, Scanner, MFA) -->
        <div class="flex items-center gap-2 w-full md:w-auto justify-center flex-wrap sm:flex-nowrap">
          
          <!-- Power-up 1: Firewall Blocker -->
          <button
            (click)="toggleTool('firewall')"
            [disabled]="engine.firewallStock() <= 0 || engine.isDispatching()"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            [class.bg-rose-950-60]="engine.selectedTool() === 'firewall'"
            [class.border-rose-400]="engine.selectedTool() === 'firewall'"
            [class.shadow-rose]="engine.selectedTool() === 'firewall'"
            [class.bg-slate-900-80]="engine.selectedTool() !== 'firewall'"
            [class.border-slate-700]="engine.selectedTool() !== 'firewall'"
            [class.hover:border-rose-500-50]="engine.selectedTool() !== 'firewall'"
            title="Cortafuegos: Pulsa aquí y luego haz clic sobre un paquete rojo para eliminarlo al instante.">
            <mat-icon class="text-rose-400 text-lg">local_fire_department</mat-icon>
            <div class="flex flex-col text-left">
              <span class="text-slate-200 text-xs font-bold leading-tight">Cortafuegos</span>
              <span class="text-[10px] font-mono text-rose-300">
                Eliminar virus ({{ engine.firewallStock() }})
              </span>
            </div>
          </button>

          <!-- Power-up 2: Antivirus Scanner -->
          <button
            (click)="toggleTool('scanner')"
            [disabled]="engine.scannerStock() <= 0 || engine.isDispatching()"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            [class.bg-cyan-950-60]="engine.selectedTool() === 'scanner'"
            [class.border-cyan-400]="engine.selectedTool() === 'scanner'"
            [class.shadow-cyan]="engine.selectedTool() === 'scanner'"
            [class.bg-slate-900-80]="engine.selectedTool() !== 'scanner'"
            [class.border-slate-700]="engine.selectedTool() !== 'scanner'"
            [class.hover:border-cyan-500-50]="engine.selectedTool() !== 'scanner'"
            title="Escáner: Pulsa aquí y haz clic en un paquete para ver si es correo real o trampa.">
            <mat-icon class="text-cyan-400 text-lg">security_update_good</mat-icon>
            <div class="flex flex-col text-left">
              <span class="text-slate-200 text-xs font-bold leading-tight">Escáner</span>
              <span class="text-[10px] font-mono text-cyan-300">
                Revisar email ({{ engine.scannerStock() }})
              </span>
            </div>
          </button>

          <!-- Power-up 3: MFA Passkey Token (if level has MFA) -->
          @if (engine.currentLevel().powerUps.mfaTokens > 0) {
            <button
              (click)="toggleTool('mfa')"
              [disabled]="engine.mfaStock() <= 0 || engine.isDispatching()"
              class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              [class.bg-amber-950-60]="engine.selectedTool() === 'mfa'"
              [class.border-amber-400]="engine.selectedTool() === 'mfa'"
              [class.bg-slate-900-80]="engine.selectedTool() !== 'mfa'"
              [class.border-slate-700]="engine.selectedTool() !== 'mfa'"
              title="Llave MFA: Pulsa aquí y toca la pasarela con candado para desbloquear el paso.">
              <mat-icon class="text-amber-400 text-lg">vpn_key</mat-icon>
              <div class="flex flex-col text-left">
                <span class="text-slate-200 text-xs font-bold leading-tight">Llave MFA</span>
                <span class="text-[10px] font-mono text-amber-300">
                  Abrir candado ({{ engine.mfaStock() }})
                </span>
              </div>
            </button>
          }
        </div>

        <!-- Right: Primary CTA - Transmission Controls (Manual & Flow) -->
        <div class="w-full md:w-auto flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
          <!-- Botón de Paso Manual con Flechas -->
          <button
            (click)="engine.movePacketManual(engine.activeSelectedPacket() ? engine.activeSelectedPacket()!.direction : 'right')"
            [disabled]="engine.isDispatching() || engine.levelCompleted() || engine.gameOver()"
            class="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 border border-cyan-400/50 text-cyan-300 transition-all cursor-pointer disabled:opacity-40 shadow-sm"
            title="Mover paquete un paso en la dirección de su flecha">
            <mat-icon class="text-cyan-400 text-base">near_me</mat-icon>
            <div class="flex flex-col text-left">
              <span class="font-bold text-[11px] leading-tight">Mover Flecha</span>
              <span class="text-[9px] font-mono text-slate-400 -mt-0.5">Paso manual (1 casilla)</span>
            </div>
          </button>

          <!-- Botón Probar Todo el Circuito -->
          <button
            (click)="engine.dispatchDataStreams()"
            [disabled]="engine.isDispatching() || engine.levelCompleted() || engine.gameOver()"
            class="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transform hover:scale-[1.02]">
            <mat-icon class="text-slate-950 text-base">
              {{ engine.isDispatching() ? 'sync' : 'fast_forward' }}
            </mat-icon>
            <div class="flex flex-col text-left">
              <span class="font-bold text-[11px] tracking-wide leading-tight">
                {{ engine.isDispatching() ? 'Transmitiendo...' : 'Probar Circuito' }}
              </span>
              <span class="text-[9px] font-mono font-medium text-slate-900/80 -mt-0.5">
                {{ engine.isDispatching() ? 'Comprobando red' : 'Flujo completo' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Tactical Tool Active Hint Banner -->
      @if (engine.selectedTool() !== 'none') {
        <div class="mt-2 py-1.5 px-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300 animate-fadeIn">
          <div class="flex items-center gap-2">
            <mat-icon class="text-sm">info</mat-icon>
            @if (engine.selectedTool() === 'firewall') {
              <span>Modo Cortafuegos activado: Haz clic en cualquier paquete para purgarlo de inmediato.</span>
            } @else if (engine.selectedTool() === 'scanner') {
              <span>Modo Deep Scanner activado: Haz clic en un paquete para escanear sus encabezados.</span>
            } @else if (engine.selectedTool() === 'mfa') {
              <span>Modo Token MFA activado: Haz clic en la Pasarela MFA bloqueada en la cuadrícula.</span>
            }
          </div>
          <button (click)="engine.selectedTool.set('none')" class="text-slate-400 hover:text-white underline cursor-pointer">
            Cancelar
          </button>
        </div>
      }
      <!-- Holographic Voice Narration Transcript -->
      <div class="mt-2.5 p-2 px-3.5 rounded-xl bg-[#090e1a]/95 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono shadow-sm">
        <div class="flex items-center gap-2 overflow-hidden">
          <div class="flex items-center gap-1.5 shrink-0 text-cyan-400">
            <mat-icon class="text-sm animate-pulse">record_voice_over</mat-icon>
            <span class="font-bold text-[10px] uppercase tracking-wider text-cyan-300">Narrador Táctico:</span>
          </div>
          <span class="text-slate-200 text-xs italic truncate">
            "{{ sound.lastNarration() }}"
          </span>
        </div>

        <button
          (click)="sound.toggleVoiceNarration()"
          class="flex items-center gap-1 text-[10px] font-mono shrink-0 px-2 py-0.5 rounded border transition-colors cursor-pointer"
          [class.bg-cyan-950-60]="sound.isVoiceNarrationEnabled()"
          [class.border-cyan-500-40]="sound.isVoiceNarrationEnabled()"
          [class.text-cyan-300]="sound.isVoiceNarrationEnabled()"
          [class.bg-slate-900]="!sound.isVoiceNarrationEnabled()"
          [class.border-slate-800]="!sound.isVoiceNarrationEnabled()"
          [class.text-slate-500]="!sound.isVoiceNarrationEnabled()">
          <mat-icon class="text-xs">{{ sound.isVoiceNarrationEnabled() ? 'volume_up' : 'volume_off' }}</mat-icon>
          <span>{{ sound.isVoiceNarrationEnabled() ? 'Voz Activa' : 'Voz Silenciada' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: `
    .bg-rose-950-60 { background-color: rgba(76, 5, 25, 0.7); }
    .bg-cyan-950-60 { background-color: rgba(8, 51, 68, 0.7); }
    .bg-amber-950-60 { background-color: rgba(69, 26, 3, 0.7); }
    .bg-slate-900-80 { background-color: rgba(15, 23, 42, 0.8); }
    .shadow-rose { box-shadow: 0 0 15px rgba(255, 0, 85, 0.45); }
    .shadow-cyan { box-shadow: 0 0 15px rgba(0, 229, 255, 0.45); }
    .hover\\:border-rose-500-50:hover { border-color: rgba(255, 0, 85, 0.5); }
    .hover\\:border-cyan-500-50:hover { border-color: rgba(0, 229, 255, 0.5); }
    .bg-cyan-950-60 { background-color: rgba(8, 51, 68, 0.6); }
    .border-cyan-500-40 { border-color: rgba(0, 229, 255, 0.4); }
  `
})
export class TacticalToolbar {
  public engine = inject(GameEngineService);
  public sound = inject(SoundService);

  public toggleTool(tool: 'firewall' | 'scanner' | 'mfa'): void {
    this.engine.selectTool(tool);
  }
}
