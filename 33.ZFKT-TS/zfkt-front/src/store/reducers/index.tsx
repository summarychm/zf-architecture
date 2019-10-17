import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import history from "../history";
import home from "./home";

let rootReducer=combineReducers({
	home,
	router: connectRouter(history),//包装history
});
// 定义rootReducer的Type
export type TypeRootReducer={
	[key in keyof typeof rootReducer]:ReturnType<typeof rootReducer[key]>
}
export default rootReducer;



