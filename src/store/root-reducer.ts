import { combineReducers } from 'redux';
import flags from './flags/reducer';
import auth from './auth/reducer';
import homes from './homes/reducer'

const rootReducer = combineReducers({
  flags,
  auth,
  homes,
});

export default rootReducer;