import chai from 'chai';
import sinon from 'sinon';

import PaginatedHttpService from '../../src/lib/PaginatedHttpService';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('PaginatedHttpService', function () {

  let axios;
  let paginatedHttpService;
  let throttler;

  before(function () {
    throttler = { do: action => action() };
  });

  beforeEach(function () {
    const axiosApi = { get: () => undefined };
    axios = sinon.mock(axiosApi);
    paginatedHttpService = new PaginatedHttpService(axiosApi, throttler, 'the_token');
  });

  describe('getUrl', function () {
    it('fetches the given URL with an added token', function () {
      axios.expects('get')
        .once()
        .withArgs('http://foo.url/?token=the_token')
        .returns(Promise.resolve({ data: 'foo' }));

      const result = paginatedHttpService.getUrl('http://foo.url');

      axios.verify();
      return result.should.eventually.eql('foo');
    });
  });

  describe('getPaginatedUrl', function () {
    it('returns immediately when there is only one page', function () {
      axios.expects('get')
        .once()
        .withArgs('http://foo.url/?token=the_token')
        .returns(Promise.resolve({
          data: {
            pagination: { pages: 1 },
            foo: 'foo',
          },
        }));

      const result = paginatedHttpService.getPaginatedUrl('http://foo.url', 'foo');

      axios.verify();
      return result.should.eventually.eql(['foo']);
    });

    it('aggregates all the pages when there are several', function () {
      axios.expects('get')
        .once()
        .withArgs('http://foo.url/?token=the_token')
        .returns(Promise.resolve({
          data: {
            pagination: { pages: 3 },
            foo: 'foo',
          },
        }));

      axios.expects('get')
        .once()
        .withArgs('http://foo.url/?page=2&token=the_token')
        .returns(Promise.resolve({
          data: {
            foo: 'bar',
          },
        }));

      axios.expects('get')
        .once()
        .withArgs('http://foo.url/?page=3&token=the_token')
        .returns(Promise.resolve({
          data: {
            foo: 'baz',
          },
        }));

      const result = paginatedHttpService.getPaginatedUrl('http://foo.url', 'foo');

      return result.should.eventually.eql(['foo', 'bar', 'baz']);
    });
  });
});
