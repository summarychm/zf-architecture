import * as types from '../action-types';
let initialState = {number: 0};
let num=0;
export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD:
      num = parseInt(action.payload || 1)
      return {number: state.number + num}
    case types.DEC:
      num = parseInt(action.payload || 1)
      return {number: state.number - num}
    default:
      return state;
  }
}