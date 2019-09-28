import * as types from "../action-types";
import {pathToFileURL} from "url";
import {push} from "../../Core/connected-react-router";

export default {
	add() {
		return {
			type: types.ADD1,
		};
	},
	asyncAdd() {
		return (dispatch) => {
			setTimeout(() => {
				dispatch({type: types.ADD1});
			}, 1000);
		};
	},
	promiseAdd() {
		return {
			type: types.ADD1,
			payload: new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(8);
				}, 1000);
			})
		}
	},
	minus() {
		return {
			type: types.MINUS1,
		};
	},
	// 通过派发action修改router,支持path和state参数
	goto(path, state) {
		return push(path, state);
	}
};
