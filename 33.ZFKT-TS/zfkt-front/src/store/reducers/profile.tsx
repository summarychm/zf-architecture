import { TypeAction } from "$types/common";

export interface TypeProfile {}
let initialState = {};
export default function(state: TypeProfile = initialState, action: TypeAction) {
	switch (action.type) {
		default:
			return state;
	}
}
