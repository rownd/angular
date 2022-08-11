import { InjectionToken } from '@angular/core';
import { RowndClientCapacitor } from './rownd.client-capacitor';
import { RowndClientJS } from './rownd.client-js';
import { RowndClientConfig } from './rownd.config';
import { RowndState } from './rownd.state';
import { IRowndClient } from './rownd.types';

export const ROWND_CLIENT_SERVICE = new InjectionToken<IRowndClient>(
  'rownd.client'
);

export const ROWND_CLIENT_SERVICE_TYPE = new InjectionToken<ClientType>(
  'rownd.client-type'
);

export enum ClientType {
  browser = 'browser',
  mobile = 'mobile',
}

export class RowndClientFactory {
  static createClient(configFactory: RowndClientConfig, state: RowndState, clientType?: ClientType): IRowndClient {
    const config = configFactory.get();

    if (!config) {
      throw new Error(
        'Configuration must be specified either through RowndModule.forRoot or through RowndClientConfig.set'
      );
    }

    switch (clientType) {
      case ClientType.browser: return new RowndClientJS(config, state);
      case ClientType.mobile: return new RowndClientCapacitor(config, state);
      default: return new RowndClientJS(config, state);
    }
  }
}
