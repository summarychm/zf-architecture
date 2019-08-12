import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from "./reducers";
import rootSaga from './sagas';
// redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

let enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))
let store = createStore(reducer, enhancer);
sagaMiddleware.run(rootSaga);
export default store;