import * as types from '../action-types';
let initialState = {number: 0};
export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD:
      return {number: state.number + 1}
    case types.DEC:
      return {number: state.number - 1}
    default:
      return state;
  }
}