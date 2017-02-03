import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import App from './App';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

const ConnectedApp = connect(state => state)(App);

const Root = () => <ConnectedApp />;

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root'));
