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
      getReleaseDetails: () => undefined,
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
    it('fires an action with the de-duped releases as the payload and an action with the' +
      'ratings as the payload', function () {
      const release1 = { title: 'Foo' };
      const release2Bad =
          { title: 'Bar', community: { have: 7, want: 10, rating: { total: 5 } } };
      const release2Good =
          { title: 'Bar', community: { have: 6, want: 9, rating: { total: 8 } } };
      Discogs.expects('getReleases')
        .once()
        .withArgs(1)
        .returns(Promise.resolve([release1, release2Bad, release2Good]));
      Discogs.expects('getReleaseDetails')
        .once()
        .withArgs(release1)
        .returns(Promise.resolve('foo_details'));
      Discogs.expects('getReleaseDetails')
        .once()
        .withArgs(release2Good)
        .returns(Promise.resolve('bar_details'));

      return actions.getReleases(1)(dispatch).then(() => {
        Discogs.verify();
        sinon.assert.calledTwice(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_RELEASES',
          payload: [release1, release2Good],
        });
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_RELEASE_DETAILS',
          payload: ['foo_details', 'bar_details'],
        });
      });
    });
  });

  describe('sort', function () {
    it('sends a sort action', function () {
      actions.setSort('FOO').should.eql({
        payload: 'FOO',
        type: 'SET_SORT',
      });
    });
  });
});
