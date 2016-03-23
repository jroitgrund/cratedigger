const actions = discogs => {

  const searchForArtist = searchTerm => {
    return dispatch => {
      discogs.searchForArtist(searchTerm).then(
        artists => dispatch(receiveArtists(artists)));
    }
  };

  const getArtistReleases = artist => {
    return dispatch => {
      discogs.getArtistReleases(artist.id).then(
        releases => receiveAndGetRatingsForReleases(dispatch, releases));
    };
  };

  // Private internal actions.

  const receiveArtists = artists => {
    return {
      type:  'RECEIVE_ARTISTS',
      payload: {
        artists
      }
    };
  };

  const receiveAndGetRatingsForReleases = (dispatch, releases) => {
    dispatch(receiveReleases(releases));
    Promise.all(releases.map(release => discogs.getReleaseRating(release))).then(
      ratings => dispatch(receiveRatings(ratings)));
  };

  const receiveReleases = releases => {
    return {
      type: 'RECEIVE_RELEASES',
      payload: {
        releases
      }
    };
  };

  const receiveRatings = ratings => {
    return {
      type: 'RECEIVE_RATINGS',
      payload: {
        ratings,
      }
    };
  };

  return {
    searchForArtist,
    getArtistReleases
  };

}

export default actions;
