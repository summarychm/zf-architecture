let fs = require('fs');
let path = require('path');
let ejs = require("ejs");

let babylon = require("babylon");
let types = require("@babel/types");
let traverse = require("@babel/traverse").default;
let generator = require("@babel/generator").default;
// babylon          将源码转为ast
// @babel/traverse  遍历节点
// @babel/types     替换节点内容
// @babel/generator ast生成源码
class Compiler {
  constructor(config) {
    this.config = config;
    // 1.保存入口文件路径(相对路径)
    this.entryId = null;
    // 2.保存所有模块依赖
    this.modules = {};
    this.entry = config.entry;//入口文件路径
    this.cwd = process.cwd();//工作路径(运行路径)
  }
  run() { // 执行编译
    let pathStr = path.resolve(this.cwd, this.entry);
    //! 如何处理mpa?
    // 执行编译并创建模块的依赖关系(当前为主入口)
    this.buildModule(pathStr, true);
    // 将编译好的文件写入到output
    this.emitFile();
  }
  buildModule(modulePath, isEntry) {// 创建模块依赖管理
    let source = this.getSource(modulePath);// 模块内容
    // 模块Id(相对路径,modulePath-this.cwd)
    let moduleName = "./" + path.relative(this.cwd, modulePath);
    // 解析源码
    let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName));
    if (isEntry)// 处理主入口的情况
      this.entryId = moduleName;// 保存入口moduleId
    this.modules[moduleName] = sourceCode;//构造modules集合,缓存模块信息

    //! 递归处理模块依赖
    dependencies && dependencies.forEach(dep => {
      this.buildModule(path.join(this.cwd, dep), false);// 模块绝对路径
    });

  }
  emitFile() { // 发射文件(单文件)
    let outPath = path.join(this.config.output.path, this.config.output.filename);
    // 读取__webpackrequire__模板
    let templateStr = this.getSource(path.join(__dirname, "temple.ejs"));
    // 使用ejs渲染require模板,获取替换掉require后的sourceCode
    let code = ejs.render(templateStr, {entryId: this.entryId, modules: this.modules})
    // this.assets = {};//资源集合
    // this.assets[outPath] = code;// 借助于ejs
    fs.writeFileSync(outPath, code);
  }
  getSource(modulePath) {//读取文件
    return fs.readFileSync(modulePath, 'utf8');
  }
  // 递归解析源码(借助于babel解析出的AST,更改源码)
  //修改1: 把require改为__webpack__require
  //修改2: 把模块引用路径改为相对路径(项目根目录)
  // 参数1:源码内容,参数2:当前模块的父路径
  parse(source, parentPath) {
    let ast = babylon.parse(source);
    let sourceCode = null; // 编译后的源码
    let dependencies = []; //当前模块的依赖的数组
    traverse(ast, {//遍历ast
      CallExpression(p) { // 匹配所有调用表达式
        let node = p.node;// 找到对应的节点
        if (node.callee.name === 'require') {
          // 将requir改为__webpack_require__
          node.callee.name = "__webpack_require__";
          let moduleName = node.arguments[0].value;// 用户传入的当前模块名
          let extName = path.extname(moduleName) ? "" : ".js";
          moduleName = moduleName + extName;
          moduleName = "./" + path.join(parentPath, moduleName);//拼接为相对路径
          dependencies.push(moduleName);//收集当前模块的模块依赖
          node.arguments = [types.stringLiteral(moduleName)];//替换AST中原来的模块名
        }
      }
    });
    sourceCode = generator(ast).code;// 将更改后的AST转为字符串
    return {sourceCode, dependencies};
  }
}

module.exports = Compiler;