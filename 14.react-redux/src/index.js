// //redux相关示例(还不能进行整合)
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
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import Authorized from "./Components/Authorized";
import Home from "./Components/Home";
import Login from "./Components/Login";
import MenuLink from "./Components/MenuLink";
import NavHeader from "./Components/NavHeader";
import Profile from "./Components/Profile";
import User from "./Components/User";
import {BrowserRouter as Router, Redirect, Route, Switch} from "./Core/react-router-dom";

ReactDOM.render(
	<Router>
		<>
			<nav className="navbar navbar-inverse">
				<div className="fluid-container">
					<NavHeader />
					<ul className="nav navbar-nav">
						<li>
							<MenuLink exact={true} to="/">首页</MenuLink>
						</li>
						<li>
							<MenuLink to="/user">用户管理</MenuLink>
						</li>
						<li>
							<MenuLink to="/profile">个人中心</MenuLink>
						</li>
					</ul>
				</div>
			</nav>
			<div className="container">
				<div className="row">
					<div className="col-md-8 col-md-offset-2">
						<Switch>
							<Route exact={true} path="/" component={Home} />
							<Route path="/user" component={User} />
							<Route path="/login" component={Login} />
							<Authorized path="/profile" component={Profile} />
							<Redirect to="/" />
						</Switch>
					</div>
				</div>
			</div>
		</>
	</Router>,
	document.getElementById("root"),
);
