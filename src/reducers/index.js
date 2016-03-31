import { combineReducers } from 'redux';

import artistsAndLabels from './artists-and-labels';
import releases from './releases';
import sort from './sort';

const reducers = combineReducers({
  artistsAndLabels,
  releases,
  sort,
});

export default reducers;
