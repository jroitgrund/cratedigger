import chai from 'chai';

import releases from '../../src/reducers/releases';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('releases', function () {
  describe('RECEIVE_RELEASES', function () {
    it('sets the received releases', function () {
      return releases(
        [],
        {
          type: 'RECEIVE_RELEASES',
          payload: {
            releases: ['release1', 'release2'],
          },
        }).should.eql(['release1', 'release2']);
    });
  });

  describe('RECEIVE_RATINGS', function () {
    it('sets the received ratings', function () {
      return releases(
        [
          {},
          { community: { foo: 'foo' } },
          { foo: 'foo', community: { rating: 'foo' } },
        ],
        {
          type: 'RECEIVE_RATINGS',
          payload: {
            ratings: ['foo', 'bar', 'baz'],
          },
        }).should.eql([
          { community: { rating: 'foo' } },
          { community: { rating: 'bar' } },
          { foo: 'foo', community: { rating: 'baz' } },
        ]);
    });
  });
});
