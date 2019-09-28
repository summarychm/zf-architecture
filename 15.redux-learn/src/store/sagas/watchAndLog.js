import {select, takeEvery, take} from 'redux-saga/effects';

// export default function* watchAndLog() {
//   yield takeEvery("*", function* (action) {
//     const state = yield select();
//     console.log("action", action);
//     console.log("state", state);
//   })
// }

// 使用while+take替代takeEvery
export default function* watchAndLog() {
  while (true) {
    const action = yield take('*');//监听所有action
    const state = yield select();
    console.log('action', action);
    console.log('state', state)
  }
}