import {combineReducers} from "../../Core/redux";
import counter1 from "./counter1";
import counter2 from "./counter2";

export default combineReducers({
	counter1,
	counter2,
});
