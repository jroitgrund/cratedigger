import update from 'react-addons-update';

const releases = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_RELEASES':
      return action.payload.releases;
    case 'RECEIVE_RATINGS':
      return state
        .map((release, i) => update(
          release,
          {
            $merge: {
              community: {
                rating: action.payload.ratings[i],
              },
            },
          }))
        .sort((release1, release2) =>
          release2.community.rating.score - release1.community.rating.score);
    default:
      return state;
  }
};

export default releases;
