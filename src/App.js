import React from 'react';
import './App.css';

//REDUX INIT
import { Provider } from 'react-redux';
import store from './store';

import PollutedCities from './containers/PollutedCities';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <PollutedCities />
      </div>
    </Provider>
  );
}

export default App;
