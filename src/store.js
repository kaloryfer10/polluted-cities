import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

//save state while refresh
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState)
  } catch(err) {
    console.error(err);
  }
}

//load state from local storage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if(serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch(err) {
    console.log(err);
    return undefined;
  }
}

const middleware = [thunk];

const persistedState = loadFromLocalStorage()
const store = createStore(
  rootReducer,
  persistedState,
  compose(
    applyMiddleware(...middleware),
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()  //debug in browser
  )
);

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;