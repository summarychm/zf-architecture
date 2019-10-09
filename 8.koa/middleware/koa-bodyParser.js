let querystring = require("querystring");
// 解析form表单,使用Promise包裹,便于等待
// 将解析后的值挂载大ctx.request.body上
function bodyParser() {
  return async (ctx, next) => {
    // 解析form表单的值
    await new Promise((resolve, reject) => {
      let ary = [];
      ctx.req.on("data", Array.push);
      ctx.eq.on("end", () => {
        ctx.request.body = {};
        let val = Buffer.concat(ary).toString();
        if (ctx.get('context-type') === "application/x-www-form-urlencoded")
          ctx.request.body = querystring.parse(val);// 挂载到request.body上
        else if (ctx.get("context-type") === "application/json")
          ctx.request.body = JSON.parse(val);// 挂载到request.body上
        resolve(val);
      });
    });
    // 继续向下执行
    await next();
  }
}