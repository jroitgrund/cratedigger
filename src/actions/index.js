const actions = (discogs, throttler) => {
  // Private internal actions.
  const receiveArtistsAndLabels = artistsAndLabels => ({
    type: 'RECEIVE_ARTISTS_AND_LABELS',
    payload: artistsAndLabels,
  });

  const receiveReleases = releases => ({
    type: 'RECEIVE_RELEASES',
    payload: releases,
  });

  const receiveReleaseDetails = details => ({
    type: 'RECEIVE_RELEASE_DETAILS',
    payload: details,
  });

  const receiveAndGetRatingsForReleases = (dispatch, releases) => {
    dispatch(receiveReleases(releases));
    return Promise.all(releases.map(release => discogs.getReleaseDetails(release))).then(
      details => dispatch(receiveReleaseDetails(details)));
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
