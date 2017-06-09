export default class Throttler {
  constructor(requestsPerMinute, timers) {
    this.requests = [];
    this.wave = 0;
    this.tokens = requestsPerMinute;
    this.timers = timers;
  }

  do(action) {
    const wave = this.wave;
    const promise = new Promise((resolve, reject) => {
      const runAction = () => {
        if (this.wave === wave) {
          resolve(action());
          this.tokens -= 1;
          this.timers.setTimeout(() => {
            this.minuteElapsedAfterAction();
          }, 70000);
        } else {
          reject();
        }
      };

      if (this.tokens > 0) {
        runAction();
      } else {
        this.requests.unshift(runAction);
      }
    });

    return promise;
  }

  minuteElapsedAfterAction() {
    this.tokens += 1;
    if (this.tokens > 0 && this.requests.length > 0) {
      this.requests.pop()();
    }
  }

  clear() {
    this.wave += 1;
  }
}
