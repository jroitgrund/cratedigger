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
  constructor(paginatedHttpService, score) {
    this.paginatedHttpService = paginatedHttpService;
    this.score = score;
  }

  getReleaseDetailsForMaster(master) {
    return this.paginatedHttpService.getPaginatedUrl(master.versions_url, 'versions')
    .then(versions => Promise.all(versions.map(
      version => this.paginatedHttpService.getUrl(version.resource_url))))
    .then(versions => {
      const count = versions.reduce(
        (totalCount, version) => totalCount + version.community.rating.count, 0);
      const average = versions.reduce((totalRating, version) => totalRating
        + version.community.rating.average * version.community.rating.count, 0) / count;

      return releaseWithRating(master, {
        count,
        average,
        score: this.score(average, count),
      });
    });
  }

  // Public methods

  getReleaseDetails(releaseListing) {
    return this.paginatedHttpService.getUrl(releaseListing.resource_url).then(release => {
      if (release.versions_url) {
        return this.getReleaseDetailsForMaster(release);
      } else if (release.master_url) {
        return this.paginatedHttpService.getUrl(release.master_url).then(
          this.getReleaseDetailsForMaster.bind(this));
      }

      // else
      return Promise.resolve(releaseWithRating(release, update(
        release.community.rating,
        {
          $merge: {
            score: this.score(release.community.rating.average, release.community.rating.count),
          },
        })));
    });
  }

  getReleases(artistOrLabel) {
    return this.paginatedHttpService.getUrl(artistOrLabel.resource_url).then(
      resource => this.paginatedHttpService.getPaginatedUrl(
        resource.releases_url, 'releases').then(
        releases => releases.filter(release =>
          release.role === 'Main' || release.role === undefined)));
  }

  searchFor(query) {
    return Promise.all([
      this.paginatedHttpService.getUrl(
        `${URL_ROOT}/database/search?q=${query}&type=artist`),
      this.paginatedHttpService.getUrl(
        `${URL_ROOT}/database/search?q=${query}&type=label`),
    ]).then(
      ([artists, labels]) => ({ artists: artists.results, labels: labels.results }));
  }
}
