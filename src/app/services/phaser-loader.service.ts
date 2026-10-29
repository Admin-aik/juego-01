import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type * as PhaserTypes from 'phaser';

@Injectable({
  providedIn: 'root'
})
export class PhaserLoaderService {
  private platformId = inject(PLATFORM_ID);
  private phaserModule: typeof PhaserTypes | null = null;

  public async getPhaser(): Promise<typeof PhaserTypes | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    if (!this.phaserModule) {
      const mod = await import('phaser');
      this.phaserModule = ((mod as Record<string, unknown>)['default'] || mod) as typeof PhaserTypes;
    }
    return this.phaserModule;
  }
}
