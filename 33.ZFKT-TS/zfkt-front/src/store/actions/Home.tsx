import * as types from "../action-types";
import { TypeAction } from "$types/common";

export default {
	setToggleShow(payload: boolean): TypeAction {
		return {
			type: types.HOME_SET_TOGGLE_SHOW,
			payload,
		};
	},
	setCurrentCategory(payload: string): TypeAction {
		return {
			type: types.HOME_SET_CURRENT_CATEGORY,
			payload,
		};
	},
};