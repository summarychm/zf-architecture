import React from 'react';
import ReactDOM from 'react-dom';

import {createStore, combineReducers} from "redux";
import {connect, Provider} from 'react-redux';
export {connect};

export default function () {
  const app = {
    _models: [],// 存放用于合并到store的model对象.
    model,
    _router: null,
    router,
    start
  };
  // 注册model实例
  function model(model) {
    app._models.push(model);
  }
  // 注册router配置
  function router(routerConfig) {
    app._router = routerConfig;
  }
  function start(selector) {
    let reducers = {};
    app._models.forEach((model, idx) => {
      // 为reducer添加namespace
      model.reducers = prefixNamespace(model.reducers, model.namespace);
      // 将修改后的reducer注册到rootReducer中
      reducers[model.namespace] = function (state = model.state, action) {
        // 判断包含命名空间的reducer是否存在
        let reducer = model.reducers[action.type];
        if (reducer) return reducer(state, action);
        return state;
      }
    });
    let rootReducer = combineReducers(reducers);// 合并rootReducer
    let store = createStore(rootReducer);
    let App = app._router; // 重命名router信息
    ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, document.querySelector(selector));
  }
  return app;
}
function prefixNamespace(reducers, namespace, NAMESPACE_SEPARATOR="/") {
  // 专门处理数组类型的reducer
  let result = Object.keys(reducers).reduce((memo, key) => {
    const newKey = `${namespace}${NAMESPACE_SEPARATOR}${key}`;
    memo[newKey] = reducers[key];
    return memo;
  }, {});
  return result;
}
