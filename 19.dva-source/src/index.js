import React from 'react';
import dva, {connect} from './dva';

// TODO 可抽取为utils
function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  })
}

let app = new dva();
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
    }
  }
});
const Counter = connect(state => state.counter)(props => (<>
  <p>{props.number}</p>
  <button onClick={() => props.dispatch({type: "counter/add", payload: 6})}>+</button>
  <button onClick={() => props.dispatch({type: "counter/asyncAdd",payload:10})} >asyncAdd</button>
</>));
app.router(() => <Counter />);
app.start("#root");
