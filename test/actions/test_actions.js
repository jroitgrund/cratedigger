import chai from 'chai';
import sinon from 'sinon';

import actionsFactory from '../../src/actions';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('actions', function () {
  let actions;
  let Discogs;
  let dispatch;

  beforeEach(function () {
    const discogsApi = {
      getReleases: () => undefined,
      getReleaseRating: () => undefined,
      searchFor: () => undefined,
    };
    Discogs = sinon.mock(discogsApi);
    dispatch = sinon.spy();
    actions = actionsFactory(discogsApi);
  });

  describe('searchFor', function () {
    it('fires an action with the results as the payload', function () {
      Discogs.expects('searchFor')
        .once()
        .withArgs('artist')
        .returns(Promise.resolve('foo'));

      return actions.searchFor('artist')(dispatch).then(() => {
        Discogs.verify();
        sinon.assert.calledOnce(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_ARTISTS_AND_LABELS',
          payload: 'foo',
        });
      });
    });
  });

  describe('getReleases', function () {
    it('fires an action with the releases as the payload and an action with the ratings as the ' +
      'payload', function () {
      Discogs.expects('getReleases')
        .once()
        .withArgs(1)
        .returns(Promise.resolve(['foo', 'bar']));
      Discogs.expects('getReleaseRating')
        .once()
        .withArgs('foo')
        .returns(Promise.resolve('foo_rating'));
      Discogs.expects('getReleaseRating')
        .once()
        .withArgs('bar')
        .returns(Promise.resolve('bar_rating'));

      return actions.getReleases(1)(dispatch).then(() => {
        Discogs.verify();
        sinon.assert.calledTwice(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_RELEASES',
          payload: {
            releases: ['foo', 'bar'],
          },
        });
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_RATINGS',
          payload: {
            ratings: ['foo_rating', 'bar_rating'],
          },
        });
      });
    });
  });
});
