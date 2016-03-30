import chai from 'chai';
import sinon from 'sinon';

import Discogs from '../../src/lib/Discogs';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('Discogs', function () {
  let discogs;
  let paginatedHttpService;
  let score;

  beforeEach(function () {
    const paginatedHttpServiceApi = {
      getUrl: () => undefined,
      getPaginatedUrl: () => undefined,
    };
    paginatedHttpService = sinon.mock(paginatedHttpServiceApi);
    score = sinon.stub();
    discogs = new Discogs(paginatedHttpServiceApi, score);
  });

  describe('getReleases', function () {
    it('queries the service for releases and returns the main ones', function () {
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('resource.com')
        .returns(Promise.resolve({ releases_url: 'releases.com' }));
      paginatedHttpService.expects('getPaginatedUrl')
        .once()
        .withArgs('releases.com', 'releases')
        .returns(Promise.resolve([
          { role: 'Foo' },
          { role: 'Main' },
        ]));

      return discogs.getReleases({ resource_url: 'resource.com' }).then(releases => {
        paginatedHttpService.verify();
        releases.should.eql([{ role: 'Main' }]);
      });
    });
  });

  describe('searchFor', function () {
    it('queries the service for artists and labels and returns them', function () {
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('https://api.discogs.com/database/search?q=foo&type=artist')
        .returns(Promise.resolve({ results: ['foo'] }));
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('https://api.discogs.com/database/search?q=foo&type=label')
        .returns(Promise.resolve({ results: ['bar'] }));

      return discogs.searchFor('foo').then(results => {
        paginatedHttpService.verify();
        results.should.eql({ artists: ['foo'], labels: ['bar'] });
      });
    });
  });

  describe('getReleaseRating', function () {
    it('returns the rating of a non-master release', function () {
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('url')
        .returns(Promise.resolve({
          community: {
            rating: {
              average: 1,
              count: 2,
            },
          },
        }));
      score.returns(3);

      return discogs.getReleaseRating({ resource_url: 'url' }).then(rating => {
        paginatedHttpService.verify();
        return rating.should.eql({
          average: 1,
          count: 2,
          score: 3,
        });
      });
    });

    it('aggregates all the version of a master release', function () {
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('url')
        .returns(Promise.resolve({
          versions_url: 'versions_url',
        }));
      paginatedHttpService.expects('getPaginatedUrl')
          .once()
          .withArgs('versions_url', 'versions')
          .returns(Promise.resolve([
              { resource_url: 'resource_1_url' },
              { resource_url: 'resource_2_url' },
          ]));
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('resource_1_url')
        .returns(Promise.resolve({
          community: {
            rating: {
              average: 7,
              count: 1,
            },
          },
        }));
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs('resource_2_url')
        .returns(Promise.resolve({
          community: {
            rating: {
              average: 1,
              count: 2,
            },
          },
        }));
      score.returns(7);

      return discogs.getReleaseRating({ resource_url: 'url' }).then(rating => {
        paginatedHttpService.verify();
        rating.should.eql({
          average: 3,
          count: 3,
          score: 7,
        });
      });
    });
  });
});
