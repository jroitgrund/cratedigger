const releases = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_RELEASES':
      return action.payload;
    case 'RECEIVE_RELEASE_DETAILS':
      return action.payload;
    default:
      return state;
  }
};

export default releases;
