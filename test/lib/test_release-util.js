import chai from 'chai';

import releaseUtil from '../../src/lib/release-util';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('getDedupedReleases', function () {
  it('dedupes', function () {
    const masterId = 'master';
    const release1 = {
      master_id: masterId,
      community: {
        want: 5,
        have: 6,
      },
    };
    const release2 = {
      master_id: masterId,
      community: {
        want: 4,
        have: 6,
      },
    };
    const release3 = 'foo';
    releaseUtil.getDedupedReleases([release1, release2, release3]).should.eql([release3, release1]);
  });
});

describe('mostPopularRelease', function () {
  it('finds the most popular release', function () {
    const release1 = {
      community: {
        want: 5,
        have: 6,
        rating: {
          total: 3,
        },
      },
    };
    const release2 = {
      community: {
        want: 5,
        have: 7,
      },
    };
    const release3 = {
      community: {
        want: 13,
      },
    };
    releaseUtil.mostPopularRelease([release1, release2, release3]).should.eql(release1);
  });

  describe('trimReleaseFields', function () {
    it('trims', function () {
      releaseUtil.trimReleaseFields({
        title: '  Foo  ',
        artists: [
          { name: '  Bar  ' },
          { name: '  Baz  ' },
        ],
      }).should.eql({
        title: 'Foo',
        artists: [
          { name: 'Bar' },
          { name: 'Baz' },
        ],
      });
    });
  });
});
