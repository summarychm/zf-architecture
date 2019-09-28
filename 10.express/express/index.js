const http = require("http");
const methods = require('methods');

function application() {
  // app 是 http.createServer的处理函数
  let app = (req, res) => {
    let pathname = require('url').parse(req.url, true).pathname;
    let method = req.method.toLowerCase();
    for (let i = 0; i < app.routes.length; i++) {
      const {
        method: m,
        path: p,
        handler: h
      } = app.routes[i];
      if ((method === m || m === 'all') && (pathname === p || pathname === "*"))
        return h(req, res);
    }
    res.end(`Cannot ${method.toUpperCase()} ${pathname}`)
  }
  app.routes = [];
  app.listen = function () {
    let server = http.createServer(app);
    server.listen(...arguments);
  };
  // 使用 express 自带的methods模块,遍历生成所有的 method 方法.
  [...methods, 'all'].forEach(method => {
    app[method] = function (p, callback) {
      app.routes.push({
        method,
        path: p,
        handler: callback
      })
    }
  })

}
module.exports = application;