import { Inject, Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, State, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateState } from './rownd.actions';
import { IRowndState } from './rownd.reducer';

@Injectable()
export class RowndState {
  public readonly user$: Observable<Record<string, any>>;
  public readonly isAuthenticated$: Observable<boolean>;
  public readonly isLoading$: Observable<boolean>;

  constructor(
    private store: Store<IRowndState>
  ) {

    // Components that use the RowndService can reference the Rownd user with the
    // `this.rownd.user$` observable
    const selectRowndUser = createSelector(
      createFeatureSelector('rownd'),
      (state: IRowndState ) => ({
          ...state.user?.['data']
        })
    );
    this.user$ = store.select(selectRowndUser);

    const selectIsAuthenticated = createSelector(
      createFeatureSelector('rownd'),
      (state: IRowndState ) => state.is_authenticated
    );
    this.isAuthenticated$ = store.select(selectIsAuthenticated);

    const selectIsLoading = createSelector(
      createFeatureSelector('rownd'),
      (state: IRowndState ) => state.is_initializing
    );
    this.isLoading$ = store.select(selectIsLoading);
  }

  updateState(state: IRowndState) {
    this.store.dispatch(updateState({ state }));
  }
}
