import { LOCATION_CHANGE } from "./constants";

// 实现一个reducer,用于处理LOCATION_CHANGE类别,
// 返回{action,location}用于更新state
export default function (history) {
    let initialState={action:history.action,location:history.location};
    return function(state=initialState,action){
      if(action.type===LOCATION_CHANGE)
        return action.payload; // 用新的location信息替换原有的location信息
      return state;
    }
}