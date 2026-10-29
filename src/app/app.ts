import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameEngineService } from './services/game-engine.service';
import { CyberHud } from './components/cyber-hud/cyber-hud';
import { CyberGrid } from './components/cyber-grid/cyber-grid';
import { TacticalToolbar } from './components/tactical-toolbar/tactical-toolbar';
import { PacketInspector } from './components/packet-inspector/packet-inspector';
import { KnowledgeCardModal } from './components/knowledge-card-modal/knowledge-card-modal';
import { UnityHubModal } from './components/unity-hub-modal/unity-hub-modal';
import { ThreatEncyclopediaModal } from './components/threat-encyclopedia-modal/threat-encyclopedia-modal';
import { DefeatModal } from './components/defeat-modal/defeat-modal';
import { SecurityFeed } from './components/security-feed/security-feed';
import { CyberIntro } from './components/cyber-intro/cyber-intro';
import { NashMatrixModal } from './components/nash-matrix-modal/nash-matrix-modal';
import { RulesModal } from './components/rules-modal/rules-modal';
import { MazeChallengeModal } from './components/maze-challenge-modal/maze-challenge-modal';
import { TriviaModal } from './components/trivia-modal/trivia-modal';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    CyberHud,
    CyberIntro,
    CyberGrid,
    TacticalToolbar,
    PacketInspector,
    KnowledgeCardModal,
    UnityHubModal,
    ThreatEncyclopediaModal,
    DefeatModal,
    SecurityFeed,
    NashMatrixModal,
    RulesModal,
    MazeChallengeModal,
    TriviaModal
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public engine = inject(GameEngineService);

  public selectLevel(idx: number): void {
    this.engine.loadLevel(idx);
  }
}
