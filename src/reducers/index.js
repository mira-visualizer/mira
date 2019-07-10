import { combineReducers } from 'redux';
import graphReducer from './graphReducer';
import loginReducer from './loginReducer';


// import all reducers here

// combine reducers
const reducers = combineReducers({
  graph: graphReducer,
  login: loginReducer
  // fill in more later if we have more reducers
});

export default reducers;