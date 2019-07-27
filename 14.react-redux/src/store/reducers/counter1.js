import * as types from '../action-types';
let initState = {number: 1};
export default function (state = initState, action) {
  switch (action.type) {
    case types.ADD1:
      return {number: state.number + (action.payload || 1)}
    case types.MINUS1:
      return {number:state.number-(action.payload||1)}
    default:
      return state;
  }
}