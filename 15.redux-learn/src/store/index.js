import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from "./reducers";
import rootSaga from './sagas';
// redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware({
  logger:function(level,...args){
    console.log('============ sagaLogger begin ====================');
    console.log(level);
    console.log(args);
    console.log('============ sagaLogger end ======================');
  },
  onError:err=>console.log("saga内部出现错误",err)
});

let enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))
let store = createStore(reducer, enhancer);
sagaMiddleware.run(rootSaga);
export default store;