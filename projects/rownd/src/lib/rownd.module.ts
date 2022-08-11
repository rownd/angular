import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ClientType, ROWND_CLIENT_SERVICE, ROWND_CLIENT_SERVICE_TYPE } from './rownd.client';
import { RowndClientFactory } from './rownd.client';

import { RowndClientConfig, RowndConfig, ROWND_CONFIG_SERVICE } from './rownd.config';
import { rowndReducer } from './rownd.reducer';
import { RowndState } from './rownd.state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('rownd', rowndReducer )
  ],
})
export class RowndModule {
  static forRoot(config: RowndConfig, clientType?: ClientType): ModuleWithProviders<RowndModule> {
    return {
      ngModule: RowndModule,
      providers: [
        RowndClientConfig,
        RowndState,
        {
          provide: ROWND_CONFIG_SERVICE,
          useValue: config,
        },
        {
          provide: ROWND_CLIENT_SERVICE_TYPE,
          useValue: clientType,
        },
        {
          provide: ROWND_CLIENT_SERVICE,
          useFactory: RowndClientFactory.createClient,
          deps: [RowndClientConfig, RowndState, ROWND_CLIENT_SERVICE_TYPE],
        },
      ],
    };
  }
}
