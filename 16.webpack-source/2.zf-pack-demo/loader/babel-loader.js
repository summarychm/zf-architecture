let babel = require('@babel/core');
let loaderUtils = require("loader-utils");

function loader(source) {
  let options = loaderUtils.getOptions(this);
  let cb = this.async(); // 开启webpack的异步钩子
  // 将babel用到的presets和plugins等参数传入
  babel.transform(source, {
    sourceMap: true,// 生成sourceMap
    filename: this.resourcePath.split("/").pop(),//指定文件名用于sourceMao映射 
    ...options
  },function (err, result) {
    cb(err, result.code, result.map);//! 异步执行完毕,调用回调
  });
}
module.exports = loader;