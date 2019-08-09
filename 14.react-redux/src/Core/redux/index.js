// 中间件处理函数
import applyMiddleware from "./applyMiddleware";
// 绑定dispatch和actionCreator
import bindActionCreators from "./bindActionCreators";
// 合并子reducer到总reducer
import combineReducers from "./combineReducers";
// 构造state,提供核心功能
import createStore from "./createStore";
export {
  createStore,
  bindActionCreators,
  combineReducers,
  applyMiddleware
};