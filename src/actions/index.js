const actions = discogs => {
  // Private internal actions.
  const receiveArtists = artists => ({
    type: 'RECEIVE_ARTISTS',
    payload: {
      artists,
    },
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

  // Public actions

  const searchForArtist = searchTerm => dispatch =>
    discogs.searchForArtist(searchTerm).then(
      artists => dispatch(receiveArtists(artists)));

  const getArtistReleases = artistId => dispatch =>
    discogs.getArtistReleases(artistId).then(
      releases => receiveAndGetRatingsForReleases(dispatch, releases));

  return {
    searchForArtist,
    getArtistReleases,
  };
};

export default actions;
