import artistsAndLabels from '../../src/reducers/artists-and-labels';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('artistsAndLabels', function () {
  describe('default state', function () {
    it('is', function () {
      artistsAndLabels(undefined, { type: undefined }).should.eql([]);
    });
  });

  describe('RECEIVE_ARTISTS_AND_LABELS', function () {
    it('sets the received artists and labels', function () {
      artistsAndLabels(
        {},
        {
          type: 'RECEIVE_ARTISTS_AND_LABELS',
          payload: ['foo', 'bar'],
        }).should.eql(['foo', 'bar']);
    });
  });
});
