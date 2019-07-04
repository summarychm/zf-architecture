function ajaxUrl(url) {
  console.log("向" + url + "请求数据");
}
Function.prototype.section = function (fn) {
  let that = this;
  return function () {
    fn();
    that(...arguments);
  }
}
//方案1: 使用给Function.prototype上添加切片实现aop
var ajaxUrlSection = ajaxUrl.section(function () {
  console.log("方案1:打个log先");
});
ajaxUrlSection("www.baidu.com");

// 方案2: 使用Proxy在指定对象的applay上添加aop代理钩子
var ajaxUrlSection = new Proxy(ajaxUrl, {
  apply: (target, that, args) => {
    console.log("方案2:打个log先");
    return Reflect.apply(target, that, args);
  }
});
ajaxUrlSection("www.baidu.com");



