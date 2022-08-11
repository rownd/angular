/* eslint-disable no-underscore-dangle */
import { RowndConfig } from './rownd.config';
import { IRowndState } from './rownd.reducer';
import { RowndState } from './rownd.state';
import { ExternalApiSpec, GetAccessTokenOpts, IRowndClient, RequestSignInOpts } from './rownd.types';

export class RowndClientJS implements IRowndClient {
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

    this.injectRowndSnippet();
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

  private injectRowndSnippet = () => {
    if (this.snippetInjected) {
      return;
    }

    const {
      appKey,
      baseUrlOverride,
      apiUrl,
      ...rest
    } = this.config;

    const _rphConfig = ((window as any)._rphConfig = (window as any)._rphConfig || []);
    const baseUrl =
      window.localStorage.getItem('rph_base_url_override') ||
      baseUrlOverride ||
      'https://hub.rownd.io';
    _rphConfig.push(['setBaseUrl', baseUrl]);
    const d = document;
      const g = d.createElement('script');
      const m = d.createElement('script');
      const s = d.getElementsByTagName('script')[0];
    g.noModule = true;
    g.async = true;
    g.src = baseUrl + '/static/scripts/rph.js';
    m.type = 'module';
    m.async = true;
    m.src = baseUrl + '/static/scripts/rph.mjs';

    if (s?.parentNode) {
      s.parentNode.insertBefore(g, s);
      s.parentNode.insertBefore(m, s);
    } else {
      d.body.appendChild(g);
      d.body.appendChild(m);
    }

    this.setConfigValue('setAppKey', appKey);
    this.setConfigValue('setApiUrl', apiUrl);
    this.setConfigValue('setStateListener', ({state: newState, api}: {state: IRowndState; api: ExternalApiSpec}) => {
      this.state.updateState(newState);
      if (!newState.is_authenticated) {
        this.hubApi = api;
        this.flushApiQueue();
      }
    });
    this.setConfigValue('setLocationHash', this.locationHash);

    console.log('rest:', rest);

    if (rest) {
      Object.entries(rest).forEach(([key, value]) => {
        this.setConfigValue(
          `set${key.charAt(0).toUpperCase() + key.substring(1)}`,
          value
        );
      });
      console.log('hubConfig:', (window as any)._rphConfig);
    }

    this.snippetInjected = true;
  };
}
