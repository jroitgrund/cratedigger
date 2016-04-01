const artistsAndLabels = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_ARTISTS_AND_LABELS':
      return action.payload;
    default:
      return state;
  }
};

export default artistsAndLabels;
