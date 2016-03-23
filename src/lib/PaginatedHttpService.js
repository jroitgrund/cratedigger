import URI from 'urijs';

const REQUESTS_PER_MINUTE = 240;

export default class PaginatedHttpService {
  constructor(axios, Throttler, TOKEN) {
    this.axios = axios;
    this.throttler = new Throttler(REQUESTS_PER_MINUTE);
    this.TOKEN = TOKEN;
  }

  getPaginatedUrl(url, concatKey) {
    return this._handlePaginatedResponse(this.getUrl(url), url)
        .then(pages => [].concat.apply([], pages.map(page => page[concatKey])));
  }

  getUrl(url) {
    return this.throttler.do(() => this.axios.get(new URI(url).addQuery('token', this.TOKEN)))
        .then(res => res.data);
  }

  // Private

  _handlePaginatedResponse(initialResponsePromise, url) {
    return initialResponsePromise
      .then(response => {
        const pages = response.pagination.pages;
        if (pages === 1) {
          return Promise.resolve([response]);
        }

        // else
        return Promise.all([response].concat([...Array(pages - 1).keys()].map(
          page => this.getUrl(new URI(url).addQuery('page', page + 2)))));
      });
  }
}
