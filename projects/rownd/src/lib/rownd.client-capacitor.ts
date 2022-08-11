/* eslint-disable no-underscore-dangle */
import { RowndClientConfig, RowndConfig } from './rownd.config';
import { RowndState } from './rownd.state';
import { ExternalApiSpec, GetAccessTokenOpts, IRowndClient, RequestSignInOpts } from './rownd.types';

export class RowndClientFactory {
  static createClient(configFactory: RowndClientConfig, state: RowndState): RowndClientCapacitor {
    const config = configFactory.get();

    if (!config) {
      throw new Error(
        'Configuration must be specified either through RowndModule.forRoot or through RowndClientConfig.set'
      );
    }

    return new RowndClientCapacitor(config, state);
  }
}

export class RowndClientCapacitor implements IRowndClient {
  private locationHash?: string;
  private snippetInjected = false;
  private hubApi?: ExternalApiSpec;
  private apiQueue: { fnName: string; args: any[] }[] = [];
  private state: RowndState;
  private config: RowndConfig;

  constructor(config: RowndConfig, state: RowndState) {
    this.locationHash = typeof window !== 'undefined' ? window?.location?.hash : void 0;
    this.config = config;
    this.state = state;

    // this.injectRowndSnippet();
    // TODO: Initialize using the Native bridge (Capacitor/Cordova)
  }

  public requestSignIn = ((opts?: RequestSignInOpts) => this.callHubApi('requestSignIn', opts));
  public getAccessToken = ((opts?: GetAccessTokenOpts) => this.callHubApi('getAccessToken', opts));
  public signOut = ((...args: any[]) => this.callHubApi('signOut', ...args));

  private callHubApi = ((fnName: string, ...args: any[]) => {
    if (this.hubApi?.[fnName]) {
      return this.hubApi[fnName](...args);
    }

    this.apiQueue.push({ fnName, args });
  });

  private flushApiQueue = () => {
    if (!this.apiQueue.length) {
      return;
    }

    for (const { fnName, args } of this.apiQueue) {
      if (!this.hubApi?.[fnName]) {
        return;
      }
      this.hubApi[fnName](...args);
    }

    this.apiQueue.length = 0;
  };

  private setConfigValue = (key: string, value: any) => {
    if (!value) {
      return;
    }

    (window as any)?._rphConfig.push([key, value]);
  };
}
