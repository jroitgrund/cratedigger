import { combineReducers } from 'redux';

import artistsAndLabels from './artists-and-labels';
import releases from './releases';

const reducers = combineReducers({
  artistsAndLabels,
  releases,
});

export default reducers;
