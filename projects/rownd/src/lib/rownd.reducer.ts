/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';
import { updateState } from './rownd.actions';

export interface IRowndState {
  is_initializing: boolean;
  is_authenticated: boolean;
  access_token: string | null;
  auth: {
    access_token: string | null;
    app_id: string | null;
    is_authenticated: boolean;
    is_verified_user: boolean;
  };
  user: Record<string, any> | null;
}

export const INITIAL_STATE: IRowndState = {
  is_initializing: true,
  is_authenticated: false,
  access_token: null,
  auth: {
    access_token: null,
    app_id: null,
    is_authenticated: false,
    is_verified_user: false,
  },
  user: null,
};

export const rowndReducer = createReducer(
  INITIAL_STATE,
  // eslint-disable-next-line arrow-body-style
  on(updateState, (state, { state: newState }) => {
    return {
      is_initializing: newState.is_initializing,
      is_authenticated: !!newState.auth?.access_token,
      access_token: newState.auth?.access_token || null,
      auth: {
        access_token: newState.auth?.access_token,
        app_id: newState.auth?.app_id,
        is_authenticated: !!newState.auth?.access_token,
        is_verified_user: newState.auth?.is_verified_user,
      },
      user: {
        ...newState.user,
      },
    };
  }),
);
