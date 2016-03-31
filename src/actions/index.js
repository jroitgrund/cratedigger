import update from 'react-addons-update';

const releasePopularity = release => {
  let popularity = 0;
  if (release.community) {
    if (release.community.want !== undefined) {
      popularity += release.community.want;
    }

    if (release.community.have !== undefined) {
      popularity += release.community.have;
    }

    if (release.community.rating) {
      if (release.community.rating.total !== undefined) {
        popularity += release.community.rating.total;
      }
    }
  }

  return popularity;
};

const getDedupedReleases = releases => {
  const dedupedReleases = releases.reduce(
    (dedupedSoFar, release) => {
      const title = release.title;
      if (dedupedSoFar[title] === undefined ||
        releasePopularity(release) > releasePopularity(dedupedSoFar[title])) {
        return update(dedupedSoFar, {
          [title]: {
            $set: release,
          },
        });
      }

      return dedupedSoFar;
    },

    {
    });
  return Object.keys(dedupedReleases).map(key => dedupedReleases[key]);
};

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
      releases => receiveAndGetRatingsForReleases(dispatch, getDedupedReleases(releases)));

  const setSort = sort => ({
    type: 'SET_SORT',
    payload: sort,
  });

  return {
    searchFor,
    setSort,
    getReleases,
  };
};

export default actions;
