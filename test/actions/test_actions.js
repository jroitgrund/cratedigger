import chai from 'chai';
import sinon from 'sinon';

import actionsFactory from '../../src/actions';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('actions', function () {
  let actions;
  let Discogs;
  let dispatch;
  let throttler;

  beforeEach(function () {
    const discogsApi = {
      getReleases: () => undefined,
      getReleaseRating: () => undefined,
      searchFor: () => undefined,
    };
    const throttlerApi = {
      clear: () => undefined,
      isFull: () => undefined,
    };
    Discogs = sinon.mock(discogsApi);
    throttler = sinon.mock(throttlerApi);
    dispatch = sinon.spy();
    actions = actionsFactory(discogsApi, throttlerApi);
  });

  describe('searchFor', function () {
    it('fires an action with the results as the payload', function () {
      Discogs.expects('searchFor')
        .once()
        .withArgs('artist')
        .returns(Promise.resolve('foo'));
      throttler.expects('clear').once();
      throttler.expects('isFull').once().returns(true);

      return actions.searchFor('artist')(dispatch).then(() => {
        Discogs.verify();
        throttler.verify();
        sinon.assert.calledTwice(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_ARTISTS_AND_LABELS',
          payload: 'foo',
        });
        sinon.assert.calledWith(dispatch, {
          type: 'QUEUE_FULL',
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
