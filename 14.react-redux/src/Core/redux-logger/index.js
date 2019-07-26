const logger=function ({ getStore, dispatch }) {
  return function(next) {
// next 为了调用原生的dispatch方法
    return function(action) {
      console.log("老状态", getStore());
      next(action);
      console.log("新状态", getStore());
    };
  };
}
export default logger;