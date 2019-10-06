const logger = function ({getStore, dispatch}) {
  return function (next) { // next为了调用原始的dispatch方法,调用增强后的dispatch会死循环
    // next代表的是上层被增强的dispatch方法.
    // dispatch代表的是完整增强的dispatch方法
    // 需链式调用next,这样才可以依次通过中间件处理action,如果调用完整的dispatch则会进入死循环.
    return function (action) { // 这里返回的是store.dispatch方法
      console.log("redux-logger");
      console.log("老状态", getStore());
      next(action);
      console.log("新状态", getStore());
    };
  }
}
export default logger;