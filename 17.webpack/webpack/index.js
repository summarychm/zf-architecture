// 手写webpack
function webpack(options,callback){
  // 非常重要的上下文路径
  options.context=options.context||ProcessingInstruction.cwd();
	// 创建compiler,本次编译对象
  let compiler=new Compiler(options.context);
  compiler.options=options;//缓存options
  // 设置 node的环境,读写用哪个模块
  new NodeEnvironmentPlugin().apply(compiler);
  //执行所有插件
  if(options.plugins){

  }
}

// Compilation代表一次编译

// this.context就是当前上下文路径
// 开发是使用的memory-fs而不是fs
// EntryOptionPlugin 挂载入口点,监听make事件
// SingleEntryPlugin 
// make 开始编译
// this._addModuleChain(context,entry,name) //模块链
// 定义钩子时一定要声明形参
// babylon作用 
  替换require为__webpack_require__
  补全载入模块的后缀名
  获取模块的绝对路径,相对于src的路径
  将moduleId转为相对于context的地址
  使用generator重新生成代码

  this.hooks.emit是作为写入硬盘的最佳时机钩子.
  
  path.posix.join // 统一多平台的分隔符
多入口就是多个单入口

