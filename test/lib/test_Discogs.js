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

  describe('getArtistReleases', function () {
    it('queries the service for releases and returns them', function () {
      paginatedHttpService.expects('getPaginatedUrl')
          .once()
          .withArgs('https://api.discogs.com/artists/1/releases', 'releases')
          .returns(Promise.resolve('foo'));

      const releases = discogs.getArtistReleases(1);

      paginatedHttpService.verify();
      return releases.should.eventually.eql('foo');
    });
  });

  describe('searchForArtist', function () {
    it('queries the service for releases and returns them', function () {
      paginatedHttpService.expects('getPaginatedUrl')
          .once()
          .withArgs('https://api.discogs.com/database/search?q=foo&type=artist', 'results')
          .returns(Promise.resolve('foo'));

      const releases = discogs.searchForArtist('foo');

      paginatedHttpService.verify();
      return releases.should.eventually.eql('foo');
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

      const rating = discogs.getReleaseRating({ resource_url: 'url' });

      paginatedHttpService.verify();
      return rating.should.eventually.eql({
        average: 1,
        count: 2,
        score: 3,
      });
    });
  });
});
