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
      return releases(
        [],
        {
          type: 'RECEIVE_RELEASES',
          payload: ['release1', 'release2'],
        }).should.eql(['release1', 'release2']);
    });
  });

  describe('RECEIVE_RELEASE_DETAILS', function () {
    it('sets the received details by rating order', function () {
      const score5 = { community: { rating: { score: 5 } } };
      const score4 = { community: { rating: { score: 4 } } };
      return releases(
        undefined,
        {
          type: 'RECEIVE_RELEASE_DETAILS',
          payload: [score4, score5],
        }).should.eql([score5, score4]);
    });
  });
});
