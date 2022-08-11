import { Inject, Injectable } from '@angular/core';
import { ROWND_CLIENT_SERVICE } from './rownd.client';
import { RowndState } from './rownd.state';
import { IRowndClient } from './rownd.types';

@Injectable({
  providedIn: 'root',
})
export class RowndService {
  /**
   * @description
   * Emits an object of the current user's data. The fields of this object correspond to your
   * Rownd application's data types configured in the Rownd Platform.
   *
   *
   * @example
   * You can use this value in your component templates in many ways, but here's one example using
   * the async pipe:
   * ```javascript
      [AT]Component({
        selector: 'my-component',
        template: '<div>Hello, {{(this.rownd.user$ | async)?.first_name}}
      })
      export class MyComponent {
        constructor(private rownd: RowndService) { }
      }
   * ```
   */
  public readonly user$ = this.state.user$;

  /**
   * @description
   * Emits a boolean value for whether or not the user is currently authenticated.
   *
   * @example
   * Here's an example of using this in a component template
   * ```javascript
      [AT]Component({
        selector: 'my-component',
        template: '<div *ngIf="this.rownd.isAuthenticated$ | async">You're signed in!}}
      })
      export class MyComponent {
        constructor(private rownd: RowndService) { }
      }
   * ```
   */
  public readonly isAuthenticated$ = this.state.isAuthenticated$;

  /**
   * @description
   * Emits boolean values during and after Rownd is initializing. It will be `false` when Rownd is ready.
   */
  public readonly isInitializing$ = this.state.isLoading$;

  /**
   * @description
   * Request that the user signs in
   *
   * @param {RequestSignInOpts} opts - Options for the sign in behavior
   *
   * @example
   * ```javascript
   * rownd.requestSignIn({ auto_sign_in: true });
   * ```
   */
  public requestSignIn = this.rowndClient.requestSignIn;

  /**
   * @description
   * Retrieve the currently signed in user's Rownd JWT access token
   *
   * @param opts (GetAccessTokenOpts): Options for retrieving the token
   *
   * @example
   * ```javascript
   * await this.rownd.getAccessToken({ waitForToken: true });
   * ```
   *
   * @returns the access token
   */
  public getAccessToken = this.rowndClient.getAccessToken;

  /**
   * @description
   * Sign the user out
   *
   * @example
   * ```javascript
   * await this.rownd.signOut()
   * ```
   */
  public signOut = this.rowndClient.signOut;

  constructor(
    @Inject(ROWND_CLIENT_SERVICE) private rowndClient: IRowndClient,
    private state: RowndState,
  ) { }

}
