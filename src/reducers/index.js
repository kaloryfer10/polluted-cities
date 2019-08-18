import { combineReducers } from 'redux';

import ContentReducer from './ContentReducer';

export default combineReducers({
  Content: ContentReducer
});