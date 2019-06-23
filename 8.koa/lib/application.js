let http = require("http");
let Stream = require("stream");
let EventEmitter = require('events');
let context = require("./context");
let request = require("./request");
let response = require("./response");

// 继承EventEmitter消息处理类
class Application extends EventEmitter {
  constructor() {
    super();
    // 创建新的 context 实例,不会污染当前默认对象.
    this.ctx = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = []; // 存放中间件集合
  }
  // 注册中间件,接收一个 async function
  use(fn) {
    this.middlewares.push(fn);
  }
  createContext(req, res) { // 构建 ctx上下文
    this.ctx.req = this.ctx.request = req;
    this.ctx.res = this.ctx.response = res;
    this.ctx.request.req = req; // 方便在子类中获取 req
    this.ctx.response.res = res; // 方便在子类中获取 res
    return this.ctx;
  }
  // 组合中间件,使用者可以通过 next() 来控制执行,相当于返回一个生成器
  compose(ctx, middlewares) {
    let dispatch = async function (index) {
      let middle = middlewares[index];
      if (index >= middlewares.length) // 处理超限
        return Promise.resolve();
      // 执行第一个中间件函数
      return middle(ctx, () => {
        dispatch(index + 1) // 使用一个新函数(next 函数)包裹下一个 dispatch
      })
    };
    return dispatch(0); // 返回一个 promise,保证可以链式调用
  }
  // 处理用户发来的请求,依次调用用户定义的中间件函数.全部调用完毕后,下发body 数据
  handleRequest(req, res) {
    let ctx=this.createContext(req, res); //基于 req,res 创建上下文
    res.statusCode = 404; // 默认设置为 404 状态
    // 把所有中间件组装成一个 promise,等待 promise 执行成功后,将结果发回给用户.
    let pro = this.compose(ctx, this.middlewares);
    pro.then(() => {
      if (!ctx.body) // 设置 res 的默认值.
        return res.end("Not Found");
      if (ctx.body instanceof Stream) { // 对象为数据流的情况,下载文件
        res.setHeader('Content-type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURIComponent('下载'));
        return ctx.body.pipe(res);
      } else if (typeof ctx.body === 'object') { // body为 对象的情况
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify(ctx.body));
      } else
        return res.end(ctx.body);
    }).catch(err => {
      this.emit("error", err, ctx);
    });
  }
  listen() {
    // 避免函数嵌套,将 request 提炼为单独的方法.
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(...arguments);
  }
}
module.exports = Application;