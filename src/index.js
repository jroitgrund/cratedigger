import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import URI from 'urijs';

import actionsFactory from './actions';
import App from './App';
import axios from 'axios';
import Discogs from './lib/discogs';
import score from './lib/score';
import Throttler from './lib/throttler';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));
const actions = actionsFactory(
  new Discogs(axios, score, Throttler, URI));

const ConnectedApp = connect(
  state => state,
  dispatch => ({
    onSearchForArtist: searchTerm => dispatch(actions.searchForArtist(searchTerm)),
    onGetArtistReleases: artist => dispatch(actions.getArtistReleases(artist)),
  })
  )(App);

const Root = () => <ConnectedApp />;

ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById('root'));
