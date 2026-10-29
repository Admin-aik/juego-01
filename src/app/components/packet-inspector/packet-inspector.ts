import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from '../../services/game-engine.service';

@Component({
  selector: 'app-packet-inspector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (engine.inspectingPacket(); as pkt) {
      <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
        <div class="relative w-full max-w-2xl rounded-2xl bg-[#0e1626] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,229,255,0.2)] max-h-[90vh] overflow-y-auto">
          
          <!-- Modal Topbar -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center border"
                [class.bg-cyan-950-60]="!pkt.isPhishing"
                [class.border-cyan-400]="!pkt.isPhishing"
                [class.bg-rose-950-60]="pkt.isPhishing"
                [class.border-rose-500]="pkt.isPhishing">
                <mat-icon [class.text-cyan-400]="!pkt.isPhishing" [class.text-rose-400]="pkt.isPhishing">
                  {{ pkt.isPhishing ? 'security_update_warning' : 'verified_user' }}
                </mat-icon>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-slate-100 font-mono">{{ pkt.label }}</h3>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold"
                    [class.bg-cyan-500-20]="!pkt.isPhishing"
                    [class.text-cyan-300]="!pkt.isPhishing"
                    [class.bg-rose-500-20]="pkt.isPhishing"
                    [class.text-rose-300]="pkt.isPhishing">
                    {{ pkt.isPhishing ? 'Amenaza Detectada' : 'Paquete Seguro' }}
                  </span>
                </div>
                <p class="text-xs text-slate-400 font-mono">Inspección Forense de Encabezados RFC 5322 & Criptografía</p>
              </div>
            </div>

            <!-- Close Button -->
            <button 
              (click)="engine.closePacketInspector()"
              class="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cerrar Inspector">
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <!-- Email Preview Mock -->
          <div class="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 border-b border-slate-800/60">
              <span class="text-slate-400">Asunto:</span>
              <span class="md:col-span-3 text-slate-100 font-medium">{{ pkt.subject }}</span>
              
              <span class="text-slate-400">Remitente (From):</span>
              <span class="md:col-span-3 text-cyan-300">{{ pkt.headers.fromAddress }}</span>

              <span class="text-slate-400">Responder a (Reply-To):</span>
              <span class="md:col-span-3" [class.text-rose-400]="pkt.headers.replyToAddress !== pkt.headers.fromAddress" [class.text-slate-300]="pkt.headers.replyToAddress === pkt.headers.fromAddress">
                {{ pkt.headers.replyToAddress }}
                @if (pkt.headers.replyToAddress !== pkt.headers.fromAddress) {
                  <span class="text-[10px] text-rose-400 font-bold ml-1.5">(⚠️ Discordancia sospechosa)</span>
                }
              </span>

              <span class="text-slate-400">IP de Origen:</span>
              <span class="md:col-span-3 text-slate-300">{{ pkt.headers.ipOrigin }}</span>
            </div>

            <!-- Authentication cryptographic badges (SPF / DKIM / DMARC) -->
            <div class="pt-2 flex flex-wrap items-center gap-2">
              <span class="text-slate-400 text-[11px]">Validación del Dominio:</span>
              
              <span class="px-2 py-0.5 rounded text-[10px] font-bold border"
                [class.bg-emerald-950-50]="pkt.headers.spf === 'PASS'"
                [class.text-emerald-300]="pkt.headers.spf === 'PASS'"
                [class.border-emerald-500-40]="pkt.headers.spf === 'PASS'"
                [class.bg-rose-950-50]="pkt.headers.spf !== 'PASS'"
                [class.text-rose-400]="pkt.headers.spf !== 'PASS'"
                [class.border-rose-500-40]="pkt.headers.spf !== 'PASS'">
                SPF: {{ pkt.headers.spf }}
              </span>

              <span class="px-2 py-0.5 rounded text-[10px] font-bold border"
                [class.bg-emerald-950-50]="pkt.headers.dkim === 'PASS'"
                [class.text-emerald-300]="pkt.headers.dkim === 'PASS'"
                [class.border-emerald-500-40]="pkt.headers.dkim === 'PASS'"
                [class.bg-rose-950-50]="pkt.headers.dkim !== 'PASS'"
                [class.text-rose-400]="pkt.headers.dkim !== 'PASS'"
                [class.border-rose-500-40]="pkt.headers.dkim !== 'PASS'">
                DKIM: {{ pkt.headers.dkim }}
              </span>

              <span class="px-2 py-0.5 rounded text-[10px] font-bold border"
                [class.bg-emerald-950-50]="pkt.headers.dmarc === 'PASS'"
                [class.text-emerald-300]="pkt.headers.dmarc === 'PASS'"
                [class.border-emerald-500-40]="pkt.headers.dmarc === 'PASS'"
                [class.bg-rose-950-50]="pkt.headers.dmarc !== 'PASS'"
                [class.text-rose-400]="pkt.headers.dmarc !== 'PASS'"
                [class.border-rose-500-40]="pkt.headers.dmarc !== 'PASS'">
                DMARC: {{ pkt.headers.dmarc }}
              </span>

              <span class="text-[10px] text-slate-400 ml-auto">
                Cifrado: {{ pkt.headers.tlsVersion }}
              </span>
            </div>

            <!-- Message Body Snippet -->
            <div class="mt-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 text-xs italic">
              "{{ pkt.previewText }}"
            </div>

            <!-- Target URL if phishing link exists -->
            @if (pkt.targetUrl) {
              <div class="mt-2 p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
                <span class="font-bold text-rose-400">URL Destino del Enlace:</span>
                <code class="block mt-1 font-mono text-[11px] text-rose-200 break-all select-text">
                  {{ pkt.targetUrl }}
                </code>
              </div>
            }
          </div>

          <!-- Red Flags Analysis Section -->
          @if (pkt.redFlags.length > 0) {
            <div class="mt-4 p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
              <div class="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-2">
                <mat-icon class="text-sm">warning</mat-icon>
                <span>Indicadores de Compromiso (Red Flags):</span>
              </div>
              <ul class="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                @for (flag of pkt.redFlags; track flag) {
                  <li>{{ flag }}</li>
                }
              </ul>
            </div>
          }

          <!-- Educational Advice -->
          <div class="mt-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
            <div class="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase mb-1.5">
              <mat-icon class="text-sm">lightbulb</mat-icon>
              <span>Regla de Oro de Ciberdefensa:</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              {{ pkt.securityTip }}
            </p>
          </div>

          <!-- Action Footer -->
          <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div class="text-xs font-mono text-slate-400">
              @if (pkt.isPhishing) {
                <span>Destino Seguro: <strong class="text-rose-400">Desviar a Cuarentena</strong></span>
              } @else {
                <span>Destino Seguro: <strong class="text-cyan-400">Guiar al Servidor Central</strong></span>
              }
            </div>

            <div class="flex items-center gap-2">
              @if (pkt.isPhishing && engine.firewallStock() > 0 && pkt.status === 'idle') {
                <button
                  (click)="onPurgeWithFirewall(pkt.id)"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,0,85,0.4)]">
                  <mat-icon class="text-sm">local_fire_department</mat-icon>
                  <span>Purgar con Cortafuegos</span>
                </button>
              }

              <button
                (click)="engine.closePacketInspector()"
                class="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700">
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .bg-cyan-950-60 { background-color: rgba(8, 51, 68, 0.6); }
    .bg-rose-950-60 { background-color: rgba(76, 5, 25, 0.6); }
    .bg-cyan-500-20 { background-color: rgba(0, 229, 255, 0.2); }
    .bg-rose-500-20 { background-color: rgba(255, 0, 85, 0.2); }
    .bg-emerald-950-50 { background-color: rgba(6, 78, 59, 0.5); }
    .border-emerald-500-40 { border-color: rgba(16, 185, 129, 0.4); }
    .bg-rose-950-50 { background-color: rgba(76, 5, 25, 0.5); }
    .border-rose-500-40 { border-color: rgba(255, 0, 85, 0.4); }
  `
})
export class PacketInspector {
  public engine = inject(GameEngineService);

  public onPurgeWithFirewall(pktId: string): void {
    this.engine.useFirewallOnPacket(pktId);
    this.engine.closePacketInspector();
  }
}
