import chai from 'chai';

import artistsAndLabels from '../../src/reducers/artists-and-labels';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('artistsAndLabels', function () {
  describe('RECEIVE_ARTISTS_AND_LABELS', function () {
    it('sets the received artists and labels', function () {
      return artistsAndLabels(
        {},
        {
          type: 'RECEIVE_ARTISTS_AND_LABELS',
          payload: {
            artists: ['foo'],
            labels: ['bar'],
          },
        }).should.eql({
          artists: ['foo'],
          labels: ['bar'],
        });
    });
  });
});
