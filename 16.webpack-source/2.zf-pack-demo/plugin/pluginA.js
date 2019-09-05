class PluginA {
  constructor(props) {}
  apply(compiler) {
    // 注册钩子
    compiler.hooks.emit.tap("emit", function () {
      console.log("emit hook", arguments)
    })
  }
}

module.exports = PluginA;