import React from 'react';
import ReactDOM from 'react-dom';

import {createHashHistory} from "history";
// redux && redux-saga
import {createStore, compose, combineReducers, applyMiddleware} from "redux";
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
  let history = opt.history || createHashHistory();
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
    let reducers = {
      router: connectRouter(history)
    };
    // 将额外的reducer追加到rootReducer中
    if (opt.extraReducers) reducers = {...reducers, ...opt.extraReducers}
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
          let effect = model.effects[key];
          // TODO 这里的type需要支持takeEvery,takeLatest,throttle,watcher类型
          if (Array.isArray(effect)) {
            let effectGen = effect[0];
            yield sagaEffects.fork(effectGen, sagaEffects)
          } else {
            let name = model.namespace + "/" + key;
            // 使用takeEvery监听当前namespace下的effects
            yield takeEvery(name, function* (action) {
              yield model.effects[key](action, sagaEffects);
            });
          }
        }
      }
    }

    let sagaMiddleware = createSagaMiddleware();// 创建saga中间件
    let combinedReducer = combineReducers(reducers);// 合并rootReducer
    //! 添加onStateChange钩子
    let rootReducer = function (state, action) {
      let newState = combinedReducer(state, action);
      opt.onStateChange && opt.onStateChange(newState);
      return newState;
    }
    //! 增强reducer
    if (opt.onReducer) rootReducer = opt.onReducer(rootReducer);

    //! 添加onAction钩子,增强中间件
    if (opt.onAction) {
      if (typeof opt.onAction === "function")
        opt.onAction = [opt.onAction]; // 单一middleware的情况
    } else
      opt.onAction = [];//没有中间件的情况

    //TODO enhanced dva内部是如何增强的?在applyMiddleware之前还是之后?
    let enhancedCreatorStore;
    if (opt.extraEnhancers) {
      let extraEnhancerFn = compose(...opt.extraEnhancers);
      enhancedCreatorStore = extraEnhancerFn(createStore);
    }
    else enhancedCreatorStore = createStore;
    let store = enhancedCreatorStore(rootReducer, applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
      ...opt.onAction
    ));

    sagaMiddleware.run(rootSaga);// 开启saga中间件监听
    let App = app._router({history, app}); // 生成静态路由表,传入history
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
