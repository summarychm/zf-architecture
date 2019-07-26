import * as types from "../action-types";

export default {
	add() {
		return {
			type: types.ADD1,
		};
	},
	asyncAdd() {
		return (dispatch) => {
			setTimeout(() => {
				dispatch({ type: types.ADD1 });
			}, 1000);
		};
	},
	minus() {
		return {
			type: types.MINUS1,
		};
	},
};
