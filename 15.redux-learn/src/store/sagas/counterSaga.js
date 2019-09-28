
import {put, takeEvery,takeLatest,delay,call} from 'redux-saga/effects';
import * as types from "../action-types";
// 全部导出是为了方便单元测试
export function* addAsync(action) {
  yield delay(100);
  yield put({type: types.ADD,payload:action.payload||5})
}
export default function* watchCounter() {
  yield takeLatest("ADD_ASYNC", addAsync);
}