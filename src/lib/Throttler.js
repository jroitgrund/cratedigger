export default class Throttler {
  constructor(requestsPerMinute) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
    this.timeouts = [];
  }

  isFull() {
    return this.requests.filter(
      time => time > new Date().getTime() - 65000).length < this.requestsPerMinute;
  }

  clear() {
    const now = new Date().getTime();
    this.timeouts.forEach(clearTimeout);
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
      return new Promise((resolve) => {
        this.timeouts.push(setTimeout(
          () => resolve(action()),
          Math.max(0, nextRequestTime - now)));
      });
    }

    // else
    this.requests.push(now);
    return Promise.resolve(action());
  }
}
