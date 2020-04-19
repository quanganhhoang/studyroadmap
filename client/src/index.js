import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './components/App';
import Home from './Home';
import reducers from './reducers';

const store = createStore(() => [], {}, applyMiddleware());

ReactDOM.render(
  <Provider store={store}><Home /></Provider>,
  document.getElementById("root")
);