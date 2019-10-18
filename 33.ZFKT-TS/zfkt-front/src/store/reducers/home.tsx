import { TypeAction, EnumCategory } from "$types/common";
import * as types from "../action-types";
const initState = {
	currentCategory: EnumCategory.all,
	toggleShow:false,
};
// state Types
export interface TypeHomeState {
	currentCategory: string;
}
// action Types
export interface TypeHomeAction extends TypeAction {
	payload: string|boolean;
}

export default function(state: TypeHomeState = initState, action: TypeHomeAction) {
	switch (action.type) {
		case types.HOME_SET_TOGGLE_SHOW:
			return {...state,toggleShow:action.payload}
		case types.HOME_SET_CURRENT_CATEGORY:
			return { ...state, currentCategory: action.payload };
		default:
			return state
	}
}
