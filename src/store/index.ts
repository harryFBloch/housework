import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as flagActions from './flags/actions';
import { FlagsAction } from './flags/types';
import * as authActions from './auth/actions';
import { AuthAction } from './auth/types';
import * as homessActions from './homes/actions';
import { HomesAction } from './homes/types';


export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  flags: flagActions,
  auth: authActions,
  homes: homessActions,
};

export * from './types';
export * from './flags/types';
export * from './auth/types';
export * from './homes/types';

export type RootAction = FlagsAction | AuthAction | HomesAction; 
export type RootState = StateType<typeof rootReducer>;