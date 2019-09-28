import React from 'react';
import ReactDOM from 'react-dom';

import {createHashHistory} from "history";
// redux && redux-saga
import {createStore, combineReducers, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import * as sagaEffects from "redux-saga/effects";
import {connect, Provider} from 'react-redux';

// react-router-dom connected-react-router
import {
  routerMiddleware,//支持push方法的中间件
  connectRouter,// 用于构造store中初始history属性
  ConnectedRouter // connected-react-router的Provider
} from "connected-react-router";

export {connect};


export default function (opt) {
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
    let history = opt.history || createHashHistory();

    let reducers = {
      router: connectRouter(history)
    };
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

    function* rootSaga() {
      let {takeEvery} = sagaEffects;
      // 批量注册model实例中的effects
      for (const model of app._models) {
        for (const key in model.effects) {
          let name = model.namespace + "/" + key;
          // 使用takeEvery监听当前namespace下的effects
          yield takeEvery(name, function* (action) {
            yield model.effects[key](action, sagaEffects);
          });
        }
      }
    }

    let rootReducer = combineReducers(reducers);// 合并rootReducer
    let sagaMiddleware = createSagaMiddleware();// 创建saga中间件

    let store = createStore(rootReducer, applyMiddleware(routerMiddleware(history), sagaMiddleware));
    sagaMiddleware.run(rootSaga);// 开启saga中间件监听
    let App = app._router({history,app}); // 生成静态路由表,传入history
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {App}
        </ConnectedRouter>
      </Provider>, document.querySelector(selector));
  }
  return app;
}
// TODO 可抽取为utils
function prefixNamespace(reducers, namespace, NAMESPACE_SEPARATOR = "/") {
  // 专门处理数组类型的reducer
  let result = Object.keys(reducers).reduce((memo, key) => {
    const newKey = `${namespace}${NAMESPACE_SEPARATOR}${key}`;
    memo[newKey] = reducers[key];
    return memo;
  }, {});
  return result;
}
