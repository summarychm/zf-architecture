// 合并子reducer,返回合并后用于返回根reducers的函数
export default function combineReducers(reducers) {
  return function (state = {}, action) {
    // 此次dispatch是否引起了store的改变,如果没变返回oldState,用于react-redux中connect的性能调优.
    let hashChanged = false,
      nextState = {};
    // 遍历所有的reduce,处理传入的action,整体重新计算state
    for (const [reducerKey, reduceFn] of Object.entries(reducers)) {
      let oldState = state[reducerKey],
        newState = reduceFn(oldState, action);
      nextState[reducerKey] = newState;
      // 如果期中一次发生改变,则返回新state
      hashChanged = hashChanged || newState !== oldState;
    }
    return hashChanged ? nextState : state; //如果state未发生变化,则返回旧state
  }
}