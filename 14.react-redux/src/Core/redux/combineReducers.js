// 合并子reducer
export default function combineReducers(reducers) {
  //返回合并后的总reducers函数
  return function (state = {}, action) {
    let hashChanged = false, // 此次派发动作是否引起了状态的改变.
      nextState = {};
    for (const [reducerKey, reduceFn] of Object.entries(reducers)) {
      let oldState = state[reducerKey],
        newState = reduceFn(oldState, action);
      nextState[reducerKey] = newState;
      hashChanged = hashChanged || newState !== oldState;
    }
    return hashChanged ? nextState : state; //如果state未发生变化,则返回旧state
  }
}