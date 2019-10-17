import { createStore, applyMiddleware, compose } from "redux";

import logger from "redux-logger";
import saga from "redux-saga";
import { routerMiddleware } from "connected-react-router";

import history from "./history";
import reducers from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let enhancers = applyMiddleware(routerMiddleware(history), logger);
enhancers = composeEnhancers(enhancers);
let store = createStore(reducers, enhancers);
export default store;
