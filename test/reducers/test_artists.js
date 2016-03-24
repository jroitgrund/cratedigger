import chai from 'chai';
import sinon from 'sinon';

import artists from '../../src/reducers/artists';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('artists', function () {
  describe('RECEIVE_ARTISTS', function () {
    it('sets the received artists', function () {
      return artists(
        [],
        {
          type: 'RECEIVE_ARTISTS',
          payload: {
            artists: ['artist', 'artist2'],
          },
        }).should.eql(['artist', 'artist2']);
    });
  });
});
