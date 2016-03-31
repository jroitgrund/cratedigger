import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import actionsFactory from './actions';
import App from './App';
import axios from 'axios';
import Discogs from './lib/Discogs';
import PaginatedHttpService, { REQUESTS_PER_MINUTE } from './lib/PaginatedHttpService';
import releaseUtil from './lib/release-util';
import score from './lib/score';
import Throttler from './lib/Throttler';
import reducers from './reducers';

const TOKEN = 'grcVabYRkUKTfMhkZoUJOzHQyeumEYkiAsUtMJjw';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

const throttler = new Throttler(REQUESTS_PER_MINUTE);
const actions = actionsFactory(
  new Discogs(
    new PaginatedHttpService(
      axios,
      throttler,
      TOKEN),
    releaseUtil,
    score),
  releaseUtil,
  throttler);

const ConnectedApp = connect(
  state => state,
  dispatch => ({
    onSearchFor: searchTerm => dispatch(actions.searchFor(searchTerm)),
    onGetReleases: artistOrLabel => dispatch(actions.getReleases(artistOrLabel)),
    onSetSort: sort => dispatch(actions.setSort(sort)),
  })
  )(App);

const Root = () => <ConnectedApp />;

ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById('root'));
