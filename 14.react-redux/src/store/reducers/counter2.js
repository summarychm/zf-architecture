import * as types from '../action-types';
let initState = {number: 2};
export default function (state = initState, action) {
  switch (action.type) {
    case types.ADD2:
      return {number: state.number + (action.playload || 1)}
    case types.MINUS2:
      return {number:state.number-(action.playload||1)}
    default:
      return state;
  }
}