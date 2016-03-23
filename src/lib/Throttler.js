export default class Throttler {
  constructor(requestsPerMinute) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
  }

  do(action) {
    const now = new Date().getTime();
    const filterTime = now - 60000;
    this.requests = this.requests.filter(time => time > filterTime);
    if (this.requests.length >= this.requestsPerMinute) {
      const nextRequestTime = this.requests.shift() + 60000;
      this.requests.push(nextRequestTime);
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(action()),
          Math.max(0, nextRequestTime - now));
      });
    }

    // else
    this.requests.push(now);
    return Promise.resolve(action());
  }
}
