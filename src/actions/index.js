const actions = (discogs, releaseUtil, throttler) => {
  // Private internal actions.
  const startSearch = () => ({
    type: 'START_SEARCH',
  });

  const receiveArtistsAndLabels = artistsAndLabels => ({
    type: 'RECEIVE_ARTISTS_AND_LABELS',
    payload: artistsAndLabels,
  });

  const receiveNumReleases = numReleases => ({
    type: 'RECEIVE_NUM_RELEASES',
    payload: numReleases,
  });

  const receiveRelease = () => ({
    type: 'RECEIVE_RELEASE',
  });

  const receiveNumDedupedReleases = (numReleases) => ({
    type: 'RECEIVE_NUM_DEDUPED_RELEASES',
    payload: numReleases,
  });

  const receiveReleaseDetails = details => ({
    type: 'RECEIVE_RELEASE_DETAILS',
    payload: details,
  });

  const getDetailsForReleases = (dispatch, releaseStubs) =>
    Promise.all(releaseStubs
        .map(stub => discogs.getReleaseDetails(stub)
          .then(detail => {
            dispatch(receiveRelease());
            return detail;
          })))
      .then(releaseUtil.getDedupedReleases)
      .then(releases => {
        dispatch(receiveNumDedupedReleases(releases.length));
        return releases;
      })
      .then(releases => Promise.all(releases
        .map(release => discogs.aggregateReleaseRatings(release)
          .then(rating => {
            dispatch(receiveRelease());
            return rating;
          }))))
      .then(receiveReleaseDetails)
      .then(dispatch);

  const queueFull = () => ({
    type: 'QUEUE_FULL',
  });

  // Public actions
  const searchFor = searchTerm => dispatch => {
    dispatch(startSearch());
    throttler.clear();
    if (throttler.isFull()) {
      dispatch(queueFull());
    }

    return discogs.searchFor(searchTerm).then(
      artistsAndLabels => dispatch(receiveArtistsAndLabels(artistsAndLabels)));
  };

  const getReleases = artistOrLabel => dispatch =>
    discogs.getReleases(artistOrLabel).then(releases => {
      dispatch(receiveNumReleases(releases.length));
      return getDetailsForReleases(dispatch, releases);
    });

  const setSort = sort => ({
    type: 'SET_SORT',
    payload: sort,
  });

  const displayRelease = release => ({
    type: 'DISPLAY_SINGLE_RELEASE',
    payload: release,
  });

  const backToReleases = () => ({
    type: 'BACK_TO_RELEASES',
  });

  return {
    displayRelease,
    backToReleases,
    searchFor,
    setSort,
    getReleases,
  };
};

export default actions;
