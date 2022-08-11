import { createAction, props } from '@ngrx/store';
import { IRowndState } from './rownd.reducer';

export const updateState = createAction('[Rownd] update_state', props<{ state: IRowndState }>());
