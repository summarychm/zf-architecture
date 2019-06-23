const url = require('url');
class request {
  get method() {
    return this.req.method;
  }
  get path() {
    return url.parse(this.req.url).pathname;
  }
}
module.exports = request;