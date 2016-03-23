import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import actionsFactory from './actions';
import App from './App';
import axios from 'axios';
import Discogs from './lib/Discogs';
import PaginatedHttpService from './lib/PaginatedHttpService';
import score from './lib/score';
import Throttler from './lib/Throttler';
import reducers from './reducers';

const TOKEN = 'grcVabYRkUKTfMhkZoUJOzHQyeumEYkiAsUtMJjw';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));
const actions = actionsFactory(
  new Discogs(new PaginatedHttpService(axios, Throttler, TOKEN), score));

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
