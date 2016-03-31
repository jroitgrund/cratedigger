import update from 'react-addons-update';

const URL_ROOT = 'https://api.discogs.com';

const releaseWithRating = (release, rating) =>
  update(release, {
    community: {
      $apply: community => (community
        ? update(community, {
          rating: {
            $set: rating,
          },
        })
        : { rating }),
    },
  });

export default class Discogs {
  constructor(paginatedHttpService, releaseUtil, score) {
    this._paginatedHttpService = paginatedHttpService;
    this._releaseUtil = releaseUtil;
    this._score = score;
  }

  _aggregateRatingsForMaster(master) {
    return this._paginatedHttpService.getPaginatedUrl(master.versions_url, 'versions')
    .then(versions => Promise.all(versions.map(
      version => this._paginatedHttpService.getUrl(version.resource_url))))
    .then(versions => {
      const count = versions.reduce(
        (totalCount, version) => totalCount + version.community.rating.count, 0);
      const average = versions.reduce((totalRating, version) => totalRating
        + version.community.rating.average * version.community.rating.count, 0) / count;

      const bestRelease = this._releaseUtil.mostPopularRelease(versions);

      return releaseWithRating(
        this._releaseUtil.trimReleaseFields(bestRelease),
        {
          count,
          average: Math.round(average * 100) / 100,
          score: this._score(average, count),
        });
    });
  }

  // Public methods
  searchFor(query) {
    return Promise.all([
      this._paginatedHttpService.getUrl(
        `${URL_ROOT}/database/search?q=${query}&type=artist`),
      this._paginatedHttpService.getUrl(
        `${URL_ROOT}/database/search?q=${query}&type=label`),
    ]).then(
      ([artists, labels]) => ({ artists: artists.results, labels: labels.results }));
  }

  getReleases(artistOrLabel) {
    return this._paginatedHttpService.getUrl(artistOrLabel.resource_url).then(
      resource => this._paginatedHttpService.getPaginatedUrl(
        resource.releases_url, 'releases').then(
        releases => releases.filter(release =>
          release.role === 'Main' || release.role === undefined)));
  }

  getReleaseDetails(releaseStub) {
    return this._paginatedHttpService.getUrl(releaseStub.resource_url);
  }

  aggregateReleaseRatings(release) {
    if (release.versions_url) {
      return this._aggregateRatingsForMaster(release);
    } else if (release.master_url) {
      return this._paginatedHttpService.getUrl(release.master_url)
        .then(this._aggregateRatingsForMaster.bind(this));
    }

    // else
    return Promise.resolve(releaseWithRating(this._releaseUtil.trimReleaseFields(release), update(
      release.community.rating,
      {
        $merge: {
          average: Math.round(release.community.rating.average * 100) / 100,
          score: this._score(release.community.rating.average, release.community.rating.count),
        },
      })));
  }
}
