import {CALL_HISTORY_METHOD} from './constants';
// actionType: 创建路由跳转action
export default function (path,state) {
  return {
    type: CALL_HISTORY_METHOD,
    payload: {
      method: "push",
      args:[path,state]
    }
  }
}