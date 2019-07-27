// redux相关示例(还不能进行整合)
// import React from "react";
// import ReactDOM from "react-dom";
// import Counter1 from "./Components/Counter1";
// import Counter2 from "./Components/Counter2";
// import {Provider} from "./Core/react-redux";
// import store from "./store";

// ReactDOM.render(
// 	<Provider store={store}>
// 		<Counter1/>
// 		<Counter2  amount={5} />
// 	</Provider>,
// 	document.getElementById("root"),
// );

// react-router示例
import React from "react";
import ReactDOM from "react-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import User from "./Components/User";
import {HashRouter as Router, Link, Route} from "./Core/react-router-dom";

ReactDOM.render(
	<Router>
		<div>
			<Link to="/">Home</Link>
			<Link to="/user">User</Link>
			<Link to="/profile">Profile</Link>
			<hr/>
			<Route path="/" component={Home} exact />
			<Route path="/user" component={User} />
			<Route path="/profile" component={Profile} />
		</div>
	</Router>,
	document.getElementById("root"),
);
