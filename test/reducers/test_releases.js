import releases from '../../src/reducers/releases';

/* eslint-disable prefer-arrow-callback, func-names */

chai.should();

describe('releases', function () {
  describe('default state', function () {
    it('is', function () {
      releases(undefined, { type: undefined }).should.eql({
        status: 'NONE',
      });
    });
  });

  describe('START_SEARCH', function () {
    it('sets the status to none', function () {
      releases({}, { type: 'START_SEARCH' }).should.eql({
        status: 'NONE',
      });
    });
  });

  describe('RECEIVE_NUM_RELEASES', function () {
    it('sets the status to waiting for releases and starts the counter', function () {
      const numReleases = 5;
      releases({}, { type: 'RECEIVE_NUM_RELEASES', payload: numReleases }).should.eql({
        status: 'RECEIVING_RELEASES',
        numReleases,
        releasesFetched: 0,
      });
    });
  });

  describe('RECEIVE_RELEASE', function () {
    it('increments the release count', function () {
      releases({ releasesFetched: 4 }, { type: 'RECEIVE_RELEASE' }).should.eql({
        releasesFetched: 5,
      });
    });
  });

  describe('RECEIVE_NUM_DEDUPED_RELEASES', function () {
    it('sets the status to waiting for ratings and starts the counter', function () {
      const numReleases = 5;
      releases({}, { type: 'RECEIVE_NUM_DEDUPED_RELEASES', payload: numReleases }).should.eql({
        status: 'RECEIVING_RATINGS',
        numReleases,
        releasesFetched: 0,
      });
    });
  });

  describe('RECEIVE_RELEASE_DETAILS', function () {
    it('sets the received details and updates the status', function () {
      releases(
        {},
        {
          type: 'RECEIVE_RELEASE_DETAILS',
          payload: ['foo', 'bar'],
        }).should.eql({
          status: 'DISPLAYING_RELEASES',
          releases: ['foo', 'bar'],
        });
    });
  });

  describe('DISPLAY_SINGLE_RELEASE', function () {
    it('sets the status to display a single release', function () {
      const release = { title: 'Foo' };
      releases({}, {
        type: 'DISPLAY_SINGLE_RELEASE',
        payload: release,
      }).should.eql({
        status: 'DISPLAYING_SINGLE_RELEASE',
        release,
      });
    });
  });

  describe('BACK_TO_RELEASES', function () {
    it('sets the status to display all releases', function () {
      releases({}, {
        type: 'BACK_TO_RELEASES',
      }).should.eql({
        status: 'DISPLAYING_RELEASES',
      });
    });
  });
});
