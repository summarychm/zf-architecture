let {getOptions} = require('loader-utils');
let validateOptions = require("schema-utils");
let mime = require("mime");

let fileLoader = require("./file-loader.js");
function loader(source) {
  let options = getOptions(this) || {};
  let schema = {
    type: "object",
    properties: {"limit": {type: "number"}}
  };
  validateOptions(schema, options, "url-loader");//校验参数
  if (options.limit && options.limit > source.length) {
    let ext = mime.getType(this.resourcePath); // 使用mime包来生成文件类型
    source = `data:${ext};base64,${source.toString('base64')}`
    return `module.exports=${JSON.stringify(source)}`
  } else
    return fileLoader.call(this, source);//调用file-loader
}
loader.raw = true;//获取二级制的source
module.exports = loader;