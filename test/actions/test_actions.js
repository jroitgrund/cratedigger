import chai from 'chai';
import sinon from 'sinon';

import actionsFactory from '../../src/actions';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('actions', function () {
  let actions;
  let Discogs;
  let dispatch;
  let getDedupedReleases;
  let throttler;

  beforeEach(function () {
    getDedupedReleases = sinon.stub();
    const discogsApi = {
      aggregateReleaseRatings: () => undefined,
      getReleases: () => undefined,
      getReleaseDetails: () => undefined,
      searchFor: () => undefined,
    };
    const releaseUtilApi = {
      getDedupedReleases,
    };
    const throttlerApi = {
      clear: () => undefined,
      isFull: () => undefined,
    };
    Discogs = sinon.mock(discogsApi);
    throttler = sinon.mock(throttlerApi);
    dispatch = sinon.spy();
    actions = actionsFactory(discogsApi, releaseUtilApi, throttlerApi);
  });

  describe('searchFor', function () {
    it('fires an action with the results as the payload', function () {
      const results = 'foo';
      const searchTerm = 'artist';
      Discogs.expects('searchFor')
        .once()
        .withArgs(searchTerm)
        .returns(Promise.resolve(results));

      return actions.searchFor(searchTerm)(dispatch).then(() => {
        Discogs.verify();
        sinon.assert.calledTwice(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: 'START_SEARCH',
        });
        sinon.assert.calledWith(dispatch, {
          type: 'RECEIVE_ARTISTS_AND_LABELS',
          payload: results,
        });
      });
    });

    it('it clears future events and triggers a queue full action' +
       'if the throttler queue is full', function () {
      throttler.expects('clear').once();
      throttler.expects('isFull').once().returns(true);
      Discogs.expects('searchFor').returns(Promise.resolve());

      return actions.searchFor()(dispatch).then(() => {
        throttler.verify();
        sinon.assert.calledThrice(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: 'QUEUE_FULL',
        });
      });
    });
  });

  describe('getReleases', function () {
    it('gets releases, firing an action for each, dedupes them' +
       'and gets ratings, firing actions', function () {
      const artistId = 1;
      const releases = ['foo', 'bar', 'baz'];
      const getReleaseDetails = release => `${release}_details`;
      const releasesWithDetails = releases.map(getReleaseDetails);
      const dedupedReleasesWithDetails = releasesWithDetails.slice(0, 2);
      const getReleaseRating = release => `${release}_rating`;
      const releasesWithRatings = dedupedReleasesWithDetails.map(getReleaseRating);
      Discogs.expects('getReleases')
        .once()
        .withArgs(artistId)
        .returns(Promise.resolve(releases));
      releases.forEach(release =>
        Discogs.expects('getReleaseDetails')
          .once()
          .withArgs(release)
          .returns(Promise.resolve(getReleaseDetails(release))));
      getDedupedReleases.withArgs(releasesWithDetails)
        .returns(Promise.resolve(dedupedReleasesWithDetails));
      dedupedReleasesWithDetails.forEach(release =>
        Discogs.expects('aggregateReleaseRatings')
          .once()
          .withArgs(release)
          .returns(Promise.resolve(getReleaseRating(release))));

      return actions.getReleases(artistId)(dispatch).then(() => {
        Discogs.verify();
        sinon.assert.calledOnce(getDedupedReleases);
        sinon.assert.callCount(dispatch, 8);
        dispatch.args[0][0].should.eql({
          type: 'RECEIVE_NUM_RELEASES',
          payload: 3,
        });
        dispatch.args[1][0].should.eql({
          type: 'RECEIVE_RELEASE',
        });
        dispatch.args[2].should.eql(dispatch.args[1]);
        dispatch.args[3].should.eql(dispatch.args[1]);
        dispatch.args[4][0].should.eql({
          type: 'RECEIVE_NUM_DEDUPED_RELEASES',
          payload: 2,
        });
        dispatch.args[5].should.eql(dispatch.args[1]);
        dispatch.args[6].should.eql(dispatch.args[1]);
        dispatch.args[7][0].should.eql({
          type: 'RECEIVE_RELEASE_DETAILS',
          payload: releasesWithRatings,
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
