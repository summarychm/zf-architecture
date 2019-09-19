// 构造state,提供核心功能(getState/subscribe/dispatch)
import createStore from "./createStore";
// 绑定 dispatch 和 actionCreator
import bindActionCreators from "./bindActionCreators";
// 合并子reducer到根reducer
import combineReducers from "./combineReducers";
// 中间件处理函数
import applyMiddleware from "./applyMiddleware";
export {
  createStore,
  bindActionCreators,
  combineReducers,
  applyMiddleware
};