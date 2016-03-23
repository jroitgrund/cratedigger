import score from '../../src/lib/score';
import chai from 'chai';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('scoring', function () {
  it('prefers more ratings given similar scores', function () {
    score(4.7, 10).should.be.below(score(4.5, 1000));
  });

  it('prefers a higher score given similar number of ratings', function () {
    score(4.7, 1000).should.be.below(score(4.8, 900));
  });
});
