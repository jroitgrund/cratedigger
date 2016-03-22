import axios from 'axios';
import URI from 'urijs';

const URL_ROOT = 'https://api.discogs.com';
const REQUESTS_PER_MINUTE = 240;
const TOKEN = 'grcVabYRkUKTfMhkZoUJOzHQyeumEYkiAsUtMJjw';

export default class Discogs {
  constructor() {
    this.requests = [];
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
    return this.makeRequest(() => axios.get(new URI(url).addQuery('token', TOKEN)));
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

  makeRequest(requestFunction) {
    const now = new Date().getTime();
    const filterTime = now - 60000;
    const getData = () => requestFunction().then(response => response.data);
    this.requests = this.requests.filter(time => time > filterTime);
    if (this.requests.length >= REQUESTS_PER_MINUTE) {
      const nextRequestTime = this.requests.shift() + 60000;
      this.requests.push(nextRequestTime);
      return new Promise((resolve, reject) => {
        setTimeout(
          () => resolve(getData()),
          Math.max(0, nextRequestTime - now))
      });
    } else {
      this.requests.push(now);
      return getData();
    }
  }
};
