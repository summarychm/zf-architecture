let http = require("http");
let Stream = require("stream");
let EventEmitter = require('events'); // 用于报错捕获

let context = require("./context");
let request = require("./request");
let response = require("./response");

// Koa类实例 继承EventEmitter消息处理类
class Application extends EventEmitter {
  constructor() {
    super();
    console.log("888888888888888888888");
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';  // 标识Koa实例的执行环境
    this.proxy = false;
    //创建新实例,这样修改ctx/request/response不会应影响到默认对象,并可以访问到源对象的值
    this.ctx = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = []; // 存放中间件集合

  }
  // 注册中间件,接收一个 async function
  use(fn) {
    this.middlewares.push(fn);
  }
  createContext(req, res) { //构建ctx,挂载res/req
    let ctx = this.ctx;
    ctx.request = this.request; // 这两个属性是自己封装的
    ctx.response = this.response;
    ctx.req = ctx.request.req = req;// 自己封装的request上应该有req指向原声的req
    ctx.res = ctx.response.res = res;
    return ctx;
  }
  // 组合中间件,使用者可以通过 next() 来控制执行,相当于返回一个生成器
  // 通过async/await来层层等待,直到所有middleware执行完毕
  compose(ctx, middlewares) {
    async function dispatch(index) {
      let middle = middlewares[index];
      if (index >= middlewares.length) return Promise.resolve(); // 越界返回Resolve的Promise.
      return middle(ctx, () => dispatch(index + 1)); //将dispatch延迟绑定,让使用者自行调用.
    };
    return dispatch(0); // 返回一个 promise,
  }
  // http.createServer回调,处理用户请求.
  handleRequest(req, res) {
    //1. 创建自定义context实例.
    //2. 组合中间件,并依次执行(洋葱模型,compose,next)
    //3. 中间件执行完毕后,通过ctx.body下发相应报文.
    let ctx = this.createContext(req, res); //!基于 req,res 创建自定义ctx
    res.statusCode = 404; // 默认设置为 404(body更改,自动更换) 
    let middlePromise = this.compose(ctx, this.middlewares);
    middlePromise
      .then(() => respond(ctx))
      .catch(err => this.emit("error", err, ctx));
  }

  listen() {
    // 避免函数嵌套,将createServer的回调提炼为单独的方法.
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(...arguments); // 将linsener方法参数原样传递
  }
}
// 由koa处理response
function respond(ctx) {
  const res = ctx.res;
  if (!ctx.body) return res.end("Not Found");
  if (ctx.body instanceof Stream) { // 对象为数据流的情况(下载文件)
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURIComponent('下载'));
    return ctx.body.pipe(res);
  }
  if (typeof ctx.body === 'object') { // body为 对象的情况
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(ctx.body));
  }
  return res.end(ctx.body);
}
module.exports = Application;