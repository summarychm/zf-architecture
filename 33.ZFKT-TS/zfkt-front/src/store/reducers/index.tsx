import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import history from "../history";
import home from "./home"; 
let reducerObj = {
	home,
	router: connectRouter(history), //包装history
};
let rootReducer = combineReducers(reducerObj);

// 定义rootReducer的Type
export type TypeRootState = {
	[key in keyof typeof reducerObj]: ReturnType<typeof reducerObj[key]>;
};

export default rootReducer;
