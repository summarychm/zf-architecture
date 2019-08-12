import {createStore, applyMiddleware, compose} from 'redux';
import reducer from "./reducers";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let enhancer = composeEnhancers(applyMiddleware())
let store = createStore(reducer, enhancer);
export default store;

