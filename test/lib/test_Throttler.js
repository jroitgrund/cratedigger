import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import lolex from 'lolex';

import Throttler from '../../src/lib/Throttler';

/* eslint-disable prefer-arrow-callback, func-names */

chai.use(chaiAsPromised);
chai.should();

describe('Throttler', function () {
  let clock;
  let throttler;

  beforeEach(function () {
    clock = lolex.install();
    throttler = new Throttler(2);
  });

  afterEach(function () {
    clock.uninstall();
  });

  it('performs actions synchronously while it can', function () {
    throttler.do(() => {});

    return throttler.do(() => 5).should.eventually.equal(5);
  });

  it('stops when the action limit is hit', function (done) {
    clock.uninstall();
    setTimeout(() => done(), 1500);
    clock = lolex.install();
    throttler = new Throttler(2);

    throttler.do(() => {});
    throttler.do(() => {});

    throttler.do(() => 5).should.eventually.not.equal(5).notify(done);
  });

  it('queues actions and performs them after a minute', function (done) {
    clock.uninstall();
    setTimeout(() => done(), 1500);
    clock = lolex.install();
    throttler = new Throttler(2);

    throttler.do(() => {});
    throttler.do(() => {});
    clock.tick(65000);

    throttler.do(() => 5).should.eventually.equal(5).notify(done);
  });

  describe('clear', function () {
    it('rejects future events', function () {
      throttler.do(() => {});
      clock.tick(5);
      throttler.do(() => {});

      // Queued at t0 + 65000.
      const toBeCleared = throttler.do(() => {});

      throttler.clear();

      // Also queued at 65000 due to clearing.
      const toRun = throttler.do(() => 5);
      clock.tick(60000);

      return Promise.all([
        toBeCleared.should.be.rejected,
        toRun.should.eventually.equal(5),
      ]);
    });
  });
});
