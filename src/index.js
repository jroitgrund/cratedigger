import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import actionsFunction from './actions';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import Discogs from './lib/discogs';
import { connect, Provider } from 'react-redux';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

const actions = actionsFunction(new Discogs());

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
