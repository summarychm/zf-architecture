import push from './push'; //构造CALL_HISTORY_METHOD的action
import routerMiddleware from "./routerMiddleware"; // redux中间件,处理通过push派发的historyChage事件
import connectRouter from "./connectRouter"; // reducer,用于处理locationChage,该action用于更新store.router与history保持一致
import ConnectedRouter from "./ConnectedRouter"; // 监听history变更,派发locationChange
export{
  connectRouter,
  ConnectedRouter,
  push,
  routerMiddleware,
}