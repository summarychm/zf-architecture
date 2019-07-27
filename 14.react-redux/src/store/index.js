import {applyMiddleware, createStore} from "../Core/redux";
import logger from "../Core/redux-logger";
import reduxPromise from "../Core/redux-promise";
import thunk from "../Core/redux-thunk";
import reducer from "./reducers";

// let store = createStore(reducer);
let store = applyMiddleware(reduxPromise,thunk, logger)(createStore)(reducer);
export default store;
