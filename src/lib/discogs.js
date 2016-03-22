import axios from 'axios';
import Throttler from './throttler';
import URI from 'urijs';

const URL_ROOT = 'https://api.discogs.com';
const REQUESTS_PER_MINUTE = 240;
const TOKEN = 'grcVabYRkUKTfMhkZoUJOzHQyeumEYkiAsUtMJjw';

export default class Discogs {
  constructor() {
    this.throttler = new Throttler(REQUESTS_PER_MINUTE);
  }

  getArtistReleases(artistId) {
    return this.getPaginatedUrl(`${URL_ROOT}/artists/${artistId}/releases`, 'releases');
  }

  searchForArtist(artistName) {
    return this.getPaginatedUrl(`${URL_ROOT}/database/search?q=${artistName}&type=artist`, 'results')
  }

  // Private

  getPaginatedUrl(url, concatKey) {
    return this.handlePaginatedResponse(this.getUrl(url), url)
        .then(pages => [].concat.apply([], pages.map(page => page[concatKey])));
  }

  getUrl(url) {
    return this.throttler.do(() => axios.get(new URI(url).addQuery('token', TOKEN)))
        .then(res => res.data);
  }

  handlePaginatedResponse(initialResponsePromise, url) {
    return initialResponsePromise
        .then(response => {
          const pages = response.pagination.pages;
          if (pages == 1) {
            return Promise.resolve([response]);
          } else {
            return Promise.all([response].concat([...Array(pages - 1).keys()].map(
              page => this.getUrl(new URI(url).addQuery('page', page + 2)))));
          }
        });
  }
};
