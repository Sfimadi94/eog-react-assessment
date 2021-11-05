import { combineReducers } from '@reduxjs/toolkit';
import { reducer as metricsReducer } from './metricsReducer';

const rootReducer = combineReducers({
  metrics: metricsReducer,
});

export default rootReducer;
// export default {
//   metrics: metricsReducer,
// };
