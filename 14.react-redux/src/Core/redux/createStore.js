export default function createStore(reducer) {
  let state;
  let listeners = [];

  function getState() {
    return state;
  }
  //通过派发action来修改store
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  //subscribe方法每次调用都会返回一个取消订阅的方法
  function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners = listeners.filter(item => item !== listeners);
    }
  }
  dispatch({
    type: "@@TYPE/REDUX_INIT"
  }); // 初始化state
  return {
    getState,
    dispatch,
    subscribe
  };
}