import getSortFunction from '../../src/lib/sort';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('sort', function () {
  it('can sort by title', function () {
    const release1 = {
      title: 'Foo',
    };
    const release2 = {
      title: 'Bar',
    };
    [release1, release2].sort(getSortFunction('TITLE')).should.eql([release2, release1]);
  });

  it('can sort by artist', function () {
    const release1 = {
      artists: [{ name: 'Bar' }],
    };
    const release2 = {
      artists: [{ name: 'Foo' }],
    };
    [release1, release2].sort(getSortFunction('ARTIST')).should.eql([release1, release2]);
  });

  it('can sort by label', function () {
    const release1 = {
      labels: [{ name: 'Bar' }],
    };
    const release2 = {
      labels: [{ name: 'Foo' }],
    };
    [release1, release2].sort(getSortFunction('LABEL')).should.eql([release1, release2]);
  });

  it('can sort by score', function () {
    const release1 = {
      community: { rating: { score: 2 } },
    };
    const release2 = {
      community: { rating: { score: 3 } },
    };
    [release1, release2].sort(getSortFunction('SCORE')).should.eql([release2, release1]);
  });

  describe('sort by date', function () {
    it('can handle full dates', function () {
      const release1 = {
        released: '2015-01-02',
      };
      const release2 = {
        released: '2015-01-01',
      };
      [release1, release2].sort(getSortFunction('DATE')).should.eql([release2, release1]);
    });

    it('can handle partial dates', function () {
      const release1 = {
        released: '2015',
      };
      const release2 = {
        released: '2014-01-01',
      };
      [release1, release2].sort(getSortFunction('DATE')).should.eql([release2, release1]);
    });

    it('puts garbage first', function () {
      const release1 = {
        released: '2015',
      };
      const release2 = {
        released: 'foo',
      };
      [release1, release2].sort(getSortFunction('DATE')).should.eql([release2, release1]);
    });
  });
});
