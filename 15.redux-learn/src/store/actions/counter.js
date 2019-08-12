import * as types from "../action-types";
export default {
  add() {return {type: types.ADD}},
  dec() {return {type: types.DEC}},
  addAsync() {return {type: types.ADDASYNC}}
}