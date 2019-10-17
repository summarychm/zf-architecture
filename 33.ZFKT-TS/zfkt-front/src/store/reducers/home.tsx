import { TypeAction, EnumCategory } from "../../typings/common";
// import { TypeAction, EnumCategory } from "$types/common";
import * as types from "./action-types";
const initState = {
	currentCategory: EnumCategory.all,
};
export interface TypeHomeState {
	currentCategory: string;
}
export interface TypeHomeAction extends TypeAction {
	payload: string;
}
export default function(state: TypeHomeState = initState, action: TypeHomeAction) {
	switch (action.type) {
		case types.SET_CURRENT_CATEGORY:
			return { ...state, currentCategory: action.payload };
		default:
			return state
	}
}
