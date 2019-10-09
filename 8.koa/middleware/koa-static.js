let fs = require('fs');
let fsPromise = fs.promises;
let path = require("path");
let mime = require("mime");
// 静态资源加载
function static(pathName) {
  return async (ctx, next) => {
    // 读取用户索要的页面
    let requestPath = path.join(process.cwd(),pathName, ctx.request.path);
    try {
      let statObj = await fsPromise.stat(requestPath);
      if (statObj.isDirectory()) //如果路径是目录则读取index.html
        requestPath = path.join(requestPath, 'index.html');
      
      ctx.res.set('Context-Type', `${mime.getType(requestPath)};charset=utf8`);
      ctx.body = fs.createReadStream(requestPath);//将数据流传给ctx.body
      console.log('============ ctx.body begin ====================');
      console.log(ctx.body);
      console.log('============ ctx.body end ======================');
    } catch (e) {
      console.log("错误了",e)
      return next(); //交由其他中间件处理
    }
  }
}
module.exports = static;