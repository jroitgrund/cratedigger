import {combineReducers} from 'redux';
import artists from './artists';
import releases from './releases';

const reducers = combineReducers({
  artists,
  releases
});

export default reducers;
