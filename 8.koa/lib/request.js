const url = require('url');
let request = {
  get method() {
    // 这里的this指向ctx.request,Object.prototype.__defineGetter__
    return this.req.method;
  },
  get path() {
    return url.parse(this.req.url).pathname;
  },
  get(field) { // 获取指定headers项
    const req = this.req;
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return req.headers.referrer || req.headers.referer || '';
      default:
        return req.headers[field] || '';
    }
  },
  set(field, val) {
    // if (this.headerSent) return;
    if (2 == arguments.length) {
      if (Array.isArray(val)) val = val.map(v => typeof v === 'string' ? v : String(v));
      else if (typeof val !== 'string') val = String(val);
      this.res.setHeader(field, val);
    } else {
      for (const key in field) {
        this.set(key, field[key]);
      }
    }
  },
}

module.exports = request;