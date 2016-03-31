import chai from 'chai';

import sort from '../../src/reducers/sort';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('sort', function () {
  describe('default state', function () {
    it('is', function () {
      sort(undefined, { type: undefined }).should.eql('SCORE');
    });
  });

  describe('SET_SCORE', function () {
    it('sets the score', function () {
      sort(
        {},
        {
          type: 'SET_SORT',
          payload: 'DATE',
        }).should.eql('DATE');
    });
  });
});
