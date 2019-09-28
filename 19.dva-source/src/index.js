import React from 'react';
import dva, {connect} from './dva';
import {Router, Route, Redirect, Switch, routerRedux, withRouter, Link} from './dva/router';
import {createBrowserHistory} from "history";
import logger from 'redux-logger';

// dva-loading
const SHOW = "SHOW";
const HIDE = "HIDE";
const initialState = {
  global: false,
  models: {},
  effects: {}
}

// TODO 可抽取为utils
function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

let app = new dva({
  history: createBrowserHistory(),
  initialState: {counter: {number: 5}},
  // 拦截effect/reducer报错
  onError: (err, dispatch) => {
    console.log('============ err begin ====================');
    console.log(err);
    console.log('============ err end ======================');
  },
  // 注册redux中间件
  onAction: logger,
  // 每次sate改变后触发,
  onStateChange: state => console.log("onStateChange", state),
  //增强reducer,
  onReducer: reducer => (state, action) => {
    localStorage.setItem('action', JSON.stringify(action));
    return reducer(state, action);
  },
  //封装 effect 执行(AOP)。比如 dva-loading 基于此实现了自动处理 loading 状态。
  onEffect: (effect, {put}, model, actionType) => {
    const {namespace} = model;
    return function* (...args) {
      // TODO 这里如果派发effects是不是会进入死循环?
      yield put({type: SHOW, payload: {namespace, actionType}});
      yield effect(...args);// 触发原始的effect
      yield put({type: HIDE, payload: {namespace, actionType}})
    }
  },
  // 额外的reducer,追加到内部reducer集合中
  extraReducers: {
    // TODO dva-loading的code,需要提取为app.use()的形式
    loading(state = initialState, {type, payload}) {
      const {namespace, actionType} = payload || {};
      switch (type) {
        case SHOW:
          return {
            global: true,
            models: {...state.models, [namespace]: true},
            effects: {...state.effects, [actionType]: true}
          };
        case HIDE:
          const effects = {...state.effects, [actionType]: false};
          const models = {...state.models, [namespace]: false};
          const global = Object.keys(models).some(namespace => models[namespace]);
          return {global, models, effects};
        default:
          return state;
      }
    }
  },
  // 额外的增强器,比如redx-persist
  extraEnhancers: [(createStore) => {
    return (...args) => {
      let store = createStore(...args);
      console.log(`增强store,想增强啥就增强啥`);
      return {...store, more() {console.log("我是增强的新方法")} }
    }
  }]
});
app.model({
  namespace: "counter",
  state: {number: 0},
  reducers: {
    add(state = 0, {payload = 1}) {
      return {number: state.number + payload}
    }
  },
  effects: {
    *asyncAdd({payload}, {call, put}) {
      yield call(delay, 500);
      yield put({type: "counter/add", payload});
    },
    *goto({to}, {put}) {
      yield put(routerRedux.push(to))
    },
    addWatchers: [ // 自定义effects
      function* ({take, put, call}) {
        for (let i = 0; i < 3; i++) {
          const action = yield take("counter/addWatcher");
          yield call(delay, 200);
          yield put({type: 'counter/add', payload: action.payload})
        }
        alert("已达到最大值,不能再加了");
      },
      {type: 'watcher'}
    ]
  }
});
const Counter = connect(state => state.counter)(props => (<>
  <p>{props.number}</p>
  <button onClick={() => props.dispatch({type: "counter/add", payload: 6})}>+</button>
  <button onClick={() => props.dispatch({type: "counter/asyncAdd", payload: 10})} >asyncAdd</button>

  <button onClick={() => props.dispatch({type: "counter/addWatcher", payload: 5})} >最多加三次,每次加5</button>  <button onClick={() => props.dispatch({type: "counter/goto", to: "/"})} >返回首页</button>
</>));

const Home = withRouter(props => (
  <>
    <p>Home</p>
    <Link to="/counter">counter</Link>
  </>
));

app.router(({history}) => (
  <Router history={history}>
    <>
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/counter" component={Counter} />
        <Redirect to="/" />
      </Switch>
    </>
  </Router>
));
app.start("#root");
