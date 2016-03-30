const releases = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_RELEASES':
      return action.payload;
    case 'RECEIVE_RELEASE_DETAILS':
      return action.payload.sort((release1, release2) =>
        release2.community.rating.score - release1.community.rating.score);
    default:
      return state;
  }
};

export default releases;
