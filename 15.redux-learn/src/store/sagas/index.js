import {all} from 'redux-saga/effects';

import helloSaga from './helloSaga';
import counterSaga from './counterSaga';

export default function* rootSaga() {
  yield all([helloSaga(),counterSaga()]);
}