let fs = require('fs');
let path = require('path');
let vm = require('vm');

function myRequire(fileName) {
  let absPath = Module._resolveFileName(fileName);
  if (Module._cache[absPath]) //读取缓存中的exports
    return Module._cache[absPath].exports;
  let module=new Module(absPath);
  module.load();// 解析模块
  Module._cache[absPath]=module;// 增加缓存模块
  return module.exports; // 将用户code返回
}

function Module(id) {
  this.id = id; // 文件名
  this.extname=path.extname(this.id);
  this.exports = {}; // exports导出对象
}
Module._cache=Object.create(null);// 缓存已加载的模块
// 根据文件名,解析该文件的绝对地址
Module._resolveFileName = function (fileName) {
  fileName = path.resolve(__dirname, fileName);
  let flag = path.extname(fileName);
  let extname = flag ? flag : '.js';
  return flag ? fileName : (fileName + extname);
}
// require的自执行包装code
Module.wrapper=[
  '(function(module,exports,require,__dirname,__filename){',
  '})'
];
Module._extensions=Object.create(null);//不同文件的load函数
Module._extensions[".js"]=function(module){
  // require是同步加载所以此处也是同步读取文件了
  let content=fs.readFileSync(module.id,"utf-8");
  content=Module.wrapper[0]+content+Module.wrapper[1];
  let fn=vm.runInThisContext(content);
  fn.call(module.exports,module,module.exports,myRequire);
}
// 根据扩展名调用各自的解析函数
Module.prototype.load=function(){
  Module._extensions[this.extname](this);
}

let str = myRequire('./test'); // .js .json .node;
console.log(str);