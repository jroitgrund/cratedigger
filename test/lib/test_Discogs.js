import chai from 'chai';
import update from 'react-addons-update';
import sinon from 'sinon';

import Discogs from '../../src/lib/Discogs';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('Discogs', function () {
  let discogs;
  let paginatedHttpService;
  let releaseUtils;
  let score;

  beforeEach(function () {
    const paginatedHttpServiceApi = {
      getUrl: () => undefined,
      getPaginatedUrl: () => undefined,
    };
    const releaseUtilsApi = {
      mostPopularRelease: () => undefined,
      trimReleaseFields: () => undefined,
    };
    paginatedHttpService = sinon.mock(paginatedHttpServiceApi);
    releaseUtils = sinon.mock(releaseUtilsApi);
    score = sinon.stub();
    discogs = new Discogs(paginatedHttpServiceApi, releaseUtilsApi, score);
  });

  describe('getReleases', function () {
    it('queries the service for releases and returns the main ones', function () {
      const resourceUrl = 'resource.com';
      const releasesUrl = 'releases.com';
      const badRelease = { role: 'Foo' };
      const goodRelease1 = { };
      const goodRelease2 = { role: 'Main' };
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(resourceUrl)
        .returns(Promise.resolve({ releases_url: releasesUrl }));
      paginatedHttpService.expects('getPaginatedUrl')
        .once()
        .withArgs(releasesUrl, 'releases')
        .returns(Promise.resolve([
          badRelease,
          goodRelease1,
          goodRelease2,
        ]));

      return discogs.getReleases({ resource_url: resourceUrl }).then(releases => {
        paginatedHttpService.verify();
        releases.should.eql([goodRelease1, goodRelease2]);
      });
    });
  });

  describe('searchFor', function () {
    it('queries the service for artists and labels and returns them', function () {
      const searchTerm = 'foo';
      const artists = ['foo'];
      const labels = ['bar'];
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(`https://api.discogs.com/database/search?q=${searchTerm}&type=artist`)
        .returns(Promise.resolve({ results: artists }));
      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(`https://api.discogs.com/database/search?q=${searchTerm}&type=label`)
        .returns(Promise.resolve({ results: labels }));

      return discogs.searchFor(searchTerm).then(results => {
        paginatedHttpService.verify();
        results.should.eql({ artists, labels });
      });
    });
  });

  describe('getReleaseDetails', function () {
    it('returns the details and rating of a non-master release', function () {
      const release = {
        title: 'Foo',
      };
      const resourceUrl = 'resource.com';

      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(resourceUrl)
        .returns(Promise.resolve(release));

      return discogs.getReleaseDetails({ resource_url: resourceUrl }).then(details => {
        paginatedHttpService.verify();
        return details.should.eql(release);
      });
    });
  });

  describe('aggregateReleaseRatings', function () {
    it('adds the ratings directly for a single release', function () {
      const releaseScore = 3;
      const average = 4;
      const count = 5;
      const release = {
        title: 'Foo',
        community: {
          rating: { average, count },
        },
      };
      const trimmed = update(release, {
        title: { $set: 'Fo' },
      });
      const withScore = update(trimmed, {
        community: {
          rating: {
            score: { $set: releaseScore },
          },
        },
      });

      score.returns(releaseScore);
      releaseUtils.expects('trimReleaseFields')
        .once()
        .withArgs(release)
        .returns(trimmed);

      return discogs.aggregateReleaseRatings(release).then(ratings => {
        paginatedHttpService.verify();
        sinon.assert.calledOnce(score);
        sinon.assert.calledWith(score, average, count);
        ratings.should.eql(withScore);
      });
    });

    it('aggregates all the versions of a master release', function () {
      const releaseScore = 7;
      const versionsUrl = 'versions.com';
      const versionUrls = ['resource_1_url', 'resource_2_url'];
      const version1 = {
        title: 'Version 1',
        community: {
          rating: {
            average: 7,
            count: 1,
          },
        },
      };
      const trimmed = update(version1, {
        title: { $set: 'Trimmed 1' },
      });
      const version1WithScore = update(trimmed, {
        community: {
          rating: {
            average: { $set: 3 },
            count: { $set: 3 },
            score: { $set: releaseScore },
          },
        },
      });
      const version2 = {
        title: 'Version 2',
        community: {
          rating: {
            average: 1,
            count: 2,
          },
        },
      };
      const versions = [version1, version2];

      paginatedHttpService.expects('getPaginatedUrl')
        .once()
        .withArgs(versionsUrl, 'versions')
        .returns(Promise.resolve(versionUrls.map(url => ({ resource_url: url }))));
      versionUrls.forEach((url, index) => (paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(url)
        .returns(Promise.resolve(versions[index]))));
      releaseUtils.expects('mostPopularRelease')
        .once()
        .withArgs(versions)
        .returns(version1);
      releaseUtils.expects('trimReleaseFields')
        .once()
        .withArgs(version1)
        .returns(trimmed);
      score.returns(releaseScore);

      return discogs.aggregateReleaseRatings({ versions_url: versionsUrl }).then(ratings => {
        paginatedHttpService.verify();
        sinon.assert.calledOnce(score);
        sinon.assert.calledWith(score, 3, 3);
        ratings.should.eql(version1WithScore);
      });
    });

    it('aggregates all the versions if passed a single version', function () {
      const releaseScore = 7;
      const masterUrl = 'master.com';
      const versionsUrl = 'versions.com';
      const versionUrls = ['resource_1_url', 'resource_2_url'];
      const version1 = {
        title: 'Version 1',
        community: {
          rating: {
            average: 7,
            count: 1,
          },
        },
      };
      const trimmed = update(version1, {
        title: { $set: 'Trimmed 1' },
      });
      const version1WithScore = update(trimmed, {
        community: {
          rating: {
            average: { $set: 3 },
            count: { $set: 3 },
            score: { $set: releaseScore },
          },
        },
      });
      const version2 = {
        title: 'Version 2',
        community: {
          rating: {
            average: 1,
            count: 2,
          },
        },
      };
      const versions = [version1, version2];

      paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(masterUrl)
        .returns(Promise.resolve({ versions_url: versionsUrl }));
      paginatedHttpService.expects('getPaginatedUrl')
        .once()
        .withArgs(versionsUrl, 'versions')
        .returns(Promise.resolve(versionUrls.map(url => ({ resource_url: url }))));
      versionUrls.forEach((url, index) => (paginatedHttpService.expects('getUrl')
        .once()
        .withArgs(url)
        .returns(Promise.resolve(versions[index]))));
      releaseUtils.expects('mostPopularRelease')
        .once()
        .withArgs(versions)
        .returns(version1);
      releaseUtils.expects('trimReleaseFields')
        .once()
        .withArgs(version1)
        .returns(trimmed);
      score.returns(releaseScore);

      return discogs.aggregateReleaseRatings({ master_url: masterUrl }).then(ratings => {
        paginatedHttpService.verify();
        sinon.assert.calledOnce(score);
        sinon.assert.calledWith(score, 3, 3);
        ratings.should.eql(version1WithScore);
      });
    });
  });
});
