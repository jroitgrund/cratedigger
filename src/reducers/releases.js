import update from 'react-addons-update';

const defaultState = {
  status: 'NONE',
};

const releases = (state = defaultState, action) => {
  switch (action.type) {
    case 'START_SEARCH':
      return defaultState;
    case 'RECEIVE_NUM_RELEASES':
      return update(state, {
        status: { $set: 'RECEIVING_RELEASES' },
        numReleases: { $set: action.payload },
        releasesFetched: { $set: 0 },
      });
    case 'RECEIVE_RELEASE':
      return update(state, {
        releasesFetched: { $set: state.releasesFetched + 1 },
      });
    case 'RECEIVE_NUM_DEDUPED_RELEASES':
      return update(state, {
        status: { $set: 'RECEIVING_RATINGS' },
        releasesFetched: { $set: 0 },
        numReleases: { $set: action.payload },
      });
    case 'RECEIVE_RELEASE_DETAILS':
      return update(state, {
        status: { $set: 'DISPLAYING_RELEASES' },
        releases: { $set: action.payload },
      });
    default:
      return state;
  }
};

export default releases;
