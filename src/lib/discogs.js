import update from 'react-addons-update';

const URL_ROOT = 'https://api.discogs.com';
const REQUESTS_PER_MINUTE = 240;
const TOKEN = 'grcVabYRkUKTfMhkZoUJOzHQyeumEYkiAsUtMJjw';

export default class Discogs {
  constructor(axios, score, Throttler, URI) {
    this.axios = axios;
    this.score = score;
    this.throttler = new Throttler(REQUESTS_PER_MINUTE);
    this.URI = URI;
  }

  getReleaseRating(releaseListing) {
    return this.getUrl(releaseListing.resource_url).then(release => {
      if (release.versions_url) {
        return this.getPaginatedUrl(release.versions_url, 'versions')
        .then(versions => Promise.all(versions.map(version => this.getUrl(version.resource_url))))
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
    return this.getPaginatedUrl(`${URL_ROOT}/artists/${artistId}/releases`, 'releases');
  }

  searchForArtist(artistName) {
    return this.getPaginatedUrl(
      `${URL_ROOT}/database/search?q=${artistName}&type=artist`, 'results');
  }

  // Private

  getPaginatedUrl(url, concatKey) {
    return this.handlePaginatedResponse(this.getUrl(url), url)
        .then(pages => [].concat.apply([], pages.map(page => page[concatKey])));
  }

  getUrl(url) {
    return this.throttler.do(() => this.axios.get(new this.URI(url).addQuery('token', TOKEN)))
        .then(res => res.data);
  }

  handlePaginatedResponse(initialResponsePromise, url) {
    return initialResponsePromise
        .then(response => {
          const pages = response.pagination.pages;
          if (pages === 1) {
            return Promise.resolve([response]);
          }

          // else
          return Promise.all([response].concat([...Array(pages - 1).keys()].map(
            page => this.getUrl(new this.URI(url).addQuery('page', page + 2)))));
        });
  }
}
