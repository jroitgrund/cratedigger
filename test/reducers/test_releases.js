import chai from 'chai';

import releases from '../../src/reducers/releases';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('releases', function () {
  describe('default state', function () {
    it('is', function () {
      releases(undefined, { type: undefined }).should.eql([]);
    });
  });

  describe('RECEIVE_RELEASES', function () {
    it('sets the received releases', function () {
      const release1 = { title: 'Foo' };
      const release2 =
          { title: 'Bar', community: { have: 6, want: 9, rating: { total: 8 } } };
      return releases(
        [],
        {
          type: 'RECEIVE_RELEASES',
          payload: [release1, release2],
        }).should.eql([release1, release2]);
    });
  });

  describe('RECEIVE_RELEASE_DETAILS', function () {
    it('sets the received details', function () {
      return releases(
        undefined,
        {
          type: 'RECEIVE_RELEASE_DETAILS',
          payload: ['foo', 'bar'],
        }).should.eql(['foo', 'bar']);
    });
  });
});
