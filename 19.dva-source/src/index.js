import React from 'react';
import dva, {connect} from './dva';
import {Router, Route, Redirect, Switch, routerRedux, withRouter, Link} from './dva/router';
import {createBrowserHistory} from "history";

// TODO 可抽取为utils
function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

let app = new dva({
  history: createBrowserHistory()
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
    }
  }
});
const Counter = connect(state => state.counter)(props => (<>
  <p>{props.number}</p>
  <button onClick={() => props.dispatch({type: "counter/add", payload: 6})}>+</button>
  <button onClick={() => props.dispatch({type: "counter/asyncAdd", payload: 10})} >asyncAdd</button>
  <button onClick={() => props.dispatch({type: "counter/goto", to: "/"})} >返回首页</button>
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
