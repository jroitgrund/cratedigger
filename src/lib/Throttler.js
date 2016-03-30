export default class Throttler {
  constructor(requestsPerMinute) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
    this.events = [];
  }

  isFull() {
    return this.requests.filter(
      time => time > new Date().getTime() - 65000).length < this.requestsPerMinute;
  }

  clear() {
    const now = new Date().getTime();
    this.events.forEach(event => {
      clearTimeout(event.timeout);
      event.reject();
    });
    this.requests = this.requests.map(time => {
      if (time < now) {
        return time;
      }

      // else
      return time - 65000;
    });
  }

  do(action) {
    const now = new Date().getTime();
    const filterTime = now - 65000;
    this.requests = this.requests.filter(time => time > filterTime);
    if (this.requests.length >= this.requestsPerMinute) {
      const nextRequestTime = this.requests.shift() + 65000;
      this.requests.push(nextRequestTime);
      const event = {};
      const promise = new Promise((resolve, reject) => {
        event.reject = reject;
        event.timeout = setTimeout(
          () => resolve(action()),
          Math.max(0, nextRequestTime - now));
      });
      this.events.push(event);
      return promise;
    }

    // else
    this.requests.push(now);
    return Promise.resolve(action());
  }
}
