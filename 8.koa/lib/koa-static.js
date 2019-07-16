let fs = require('fs');
let fsPromise = fs.promises;
let path = require("path");
let mime = require("mime");
// 静态资源加载
function static(pathName) {
  return async (ctx, next) => {
    // 读取用户索要的页面
    let requestPath = path.join(pathName, ctx.path);
    try {
      let statObj = await fsPromise.stat(requestPath);
      if (statObj.isDirectory()) //如果路径是目录则加入index.html
        requestPath = path.join(requestPath, 'index.html');
      ctx.set('Context-Type', `${mime.getType(requestPath)};charset=utf8`);
      ctx.body = fs.createReadStream(requestPath);
    } catch (e) {
      return next()
    }
  }
}
module.exports = static;