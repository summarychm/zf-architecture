
import {put, takeEvery,delay} from 'redux-saga/effects';
import * as types from "../action-types";
// 全部导出是为了方便单元测试
export function* addAsync() {
  yield delay(100);
  yield put({type: types.ADD,payload:5})
}
export default function* watchCounter() {
  yield takeEvery("ADD_ASYNC", addAsync);
}