import {CALL_HISTORY_METHOD} from "./constants";
// 中间件: 用于处理CALL_HISTORY_METHOD(用户主动发起的)类型的action
export default function routerMiddleware(history) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (action.type !== CALL_HISTORY_METHOD)
          return next(action); // 非特殊type,跳过让redux处理
        let {method,args} = action.payload;
        history[method](args);// 调用history对象的
      }
    }
  }
}