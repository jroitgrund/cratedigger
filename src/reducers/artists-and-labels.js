const artistsAndLabels = (state = { artists: [], labels: [] }, action) => {
  switch (action.type) {
    case 'RECEIVE_ARTISTS_AND_LABELS':
      return { artists: action.payload.artists, labels: action.payload.labels };
    default:
      return state;
  }
};

export default artistsAndLabels;
