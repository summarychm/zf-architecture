const url = require('url');
let request = {
  get method() {
    // 这里的this指向ctx.request,Object.prototype.__defineGetter__
    return this.req.method;
  },
  get path() {
    return url.parse(this.req.url).pathname;
  }
}
module.exports = request;