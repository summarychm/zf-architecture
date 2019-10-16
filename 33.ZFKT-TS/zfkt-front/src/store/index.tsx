import { createStore, applyMiddleware } from "redux";

import logger from "redux-logger";
import saga from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import history from "./history";
import reducers from './reducers';

let enhancers = applyMiddleware(routerMiddleware(history),logger);

let store = createStore(reducers, enhancers);
export default store;
