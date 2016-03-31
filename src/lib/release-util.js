import update from 'react-addons-update';

// Private.
const _releasePopularity = release => {
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

// Public.
const getDedupedReleases = releases => {
  const dedupedReleases = releases.reduce(
    (dedupedSoFar, release) => {
      const masterId = release.master_id;
      if (masterId === undefined) {
        return update(dedupedSoFar, {
          singles: { $push: [release] },
        });
      }

      if (dedupedSoFar.dupes[masterId] === undefined ||
        _releasePopularity(release) > _releasePopularity(dedupedSoFar.dupes[masterId])) {
        return update(dedupedSoFar, {
          dupes: {
            [masterId]: {
              $set: release,
            },
          },
        });
      }

      return dedupedSoFar;
    },

    {
      singles: [],
      dupes: {},
    });
  return [
    ...dedupedReleases.singles,
    ...Object.keys(dedupedReleases.dupes).map(key => dedupedReleases.dupes[key]),
  ];
};

const mostPopularRelease = releases =>
  releases.reduce(
    (bests, current) => {
      const popularity = _releasePopularity(current);
      return popularity > bests.popularity
        ? { popularity, release: current }
        : bests;
    },

    { popularity: -1, release: undefined }).release;

const trimReleaseFields = release => update(release, {
  title: {
    $set: release.title.trim(),
  },
  artists: {
    $set: release.artists ? release.artists.map(artist => update(artist, {
      name: {
        $set: artist.name.trim(),
      },
    })) : undefined,
  },
});

export default {
  getDedupedReleases,
  mostPopularRelease,
  trimReleaseFields,
};
