这个版本是基于React v16.3+的ContextAPI实现的,
相较于老师的旧版本的不同在于将store的监听由connect提升到了Provider,
这是借助于新ContextAPI采用独立Context对象,跳过了shouldComponentUpdate才可以这样优化的.
参考 [React新Context API在前端状态管理的实践](https://techblog.toutiao.com/2018/10/22/untitled-54/),[react-restated](https://github.com/stkevintan/react-restated)
