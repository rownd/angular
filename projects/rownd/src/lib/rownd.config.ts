import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface RowndConfig {
  [key: string]: any;
  appKey: string;
  baseUrlOverride?: string;
  apiUrl?: string;
}

@Injectable()
export class RowndClientConfig {
  private config?: RowndConfig;

  constructor(@Optional() @Inject(ROWND_CONFIG_SERVICE) config?: RowndConfig) {
    if (config) {
      this.set(config);
    }
  }

  set(config: RowndConfig): void {
    this.config = config;
  }

  get(): RowndConfig {
    return this.config as RowndConfig;
  }
}

export const ROWND_CONFIG_SERVICE = new InjectionToken<RowndConfig>('rownd.config');
