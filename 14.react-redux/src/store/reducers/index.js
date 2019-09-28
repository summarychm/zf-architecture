import {combineReducers} from "../../Core/redux";
import counter1 from "./counter1";
import counter2 from "./counter2";

import {connectRouter} from "../../Core/connected-react-router";
import history from "../../utils/history";

export default combineReducers({
	counter1,
	counter2,
	router: connectRouter(history)
});
  