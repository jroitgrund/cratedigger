import update from 'react-addons-update';

const URL_ROOT = 'https://api.discogs.com';

export default class Discogs {
  constructor(paginatedHttpService, score) {
    this.paginatedHttpService = paginatedHttpService;
    this.score = score;
  }

  getReleaseRating(releaseListing) {
    return this.paginatedHttpService.getUrl(releaseListing.resource_url).then(release => {
      if (release.versions_url) {
        return this.paginatedHttpService.getPaginatedUrl(release.versions_url, 'versions')
        .then(versions => Promise.all(versions.map(
          version => this.paginatedHttpService.getUrl(version.resource_url))))
        .then(versions => {
          const count = versions.reduce(
            (totalCount, version) => totalCount + version.community.rating.count, 0);
          const average = versions.reduce((totalRating, version) => totalRating
            + version.community.rating.average * version.community.rating.count, 0) / count;
          return {
            count,
            average,
            score: this.score(average, count),
          };
        });
      }

      // else
      return Promise.resolve(update(
        release.community.rating,
        {
          $merge: {
            score: this.score(release.community.rating.average, release.community.rating.count),
          },
        }));
    });
  }

  getArtistReleases(artistId) {
    return this.paginatedHttpService.getPaginatedUrl(
      `${URL_ROOT}/artists/${artistId}/releases`, 'releases');
  }

  searchForArtist(artistName) {
    return this.paginatedHttpService.getUrl(
      `${URL_ROOT}/database/search?q=${artistName}&type=artist`).then(result => result.results);
  }
}
