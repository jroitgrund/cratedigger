const actions = (discogs, throttler) => {
  // Private internal actions.
  const receiveArtistsAndLabels = artistsAndLabels => ({
    type: 'RECEIVE_ARTISTS_AND_LABELS',
    payload: artistsAndLabels,
  });

  const receiveReleases = releases => ({
    type: 'RECEIVE_RELEASES',
    payload: {
      releases,
    },
  });

  const receiveRatings = ratings => ({
    type: 'RECEIVE_RATINGS',
    payload: {
      ratings,
    },
  });

  const receiveAndGetRatingsForReleases = (dispatch, releases) => {
    dispatch(receiveReleases(releases));
    return Promise.all(releases.map(release => discogs.getReleaseRating(release))).then(
      ratings => dispatch(receiveRatings(ratings)));
  };

  const queueFull = () => ({
    type: 'QUEUE_FULL',
  });

  // Public actions

  const searchFor = searchTerm => dispatch => {
    throttler.clear();
    if (throttler.isFull()) {
      dispatch(queueFull());
    }

    return discogs.searchFor(searchTerm).then(
      artistsAndLabels => dispatch(receiveArtistsAndLabels(artistsAndLabels)));
  };

  const getReleases = artistOrLabel => dispatch =>
    discogs.getReleases(artistOrLabel).then(
      releases => receiveAndGetRatingsForReleases(dispatch, releases));

  return {
    searchFor,
    getReleases,
  };
};

export default actions;
