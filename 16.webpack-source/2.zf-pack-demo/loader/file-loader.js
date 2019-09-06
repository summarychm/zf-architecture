let loaderUtils = require('loader-utils');
let validateOptions = require("schema-utils");// 参数校验

function loader(source) {
  let options = loaderUtils.getOptions(this) || {};//如果未传递则为null
  let schema = {
    type: "object",
    properties: {name: {type: "string", description: "资源名称"}}
  }
  validateOptions(schema, options, "file-loader");
  let ext = options.name || '[hash].[ext]';
  // 生成文件名
  let filename = loaderUtils.interpolateName(this, ext, {content: source});
  this.emitFile(filename, source);// 写入文件(默认写入到输出路径)
  return `module.exports=${JSON.stringify(filename)}`;
}
loader.raw = true;// loader预期得到的是二进制数据
module.exports = loader;