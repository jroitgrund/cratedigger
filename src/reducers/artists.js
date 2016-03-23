const artists = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_ARTISTS':
      return [...action.payload.artists];
    default:
      return state;
  }
};

export default artists;
