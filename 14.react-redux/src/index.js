// react-router示例

import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import Authorized from "./Components/Authorized";
import Counter from "./Components/Counter";
import Home from "./Components/Home";
import Login from "./Components/Login";
import MenuLink from "./Components/MenuLink";
import NavHeader from "./Components/NavHeader";
import Profile from "./Components/Profile";
import User from "./Components/User";
import {Provider} from "./Core/react-redux";
import {BrowserRouter as Router, Redirect, Route, Switch} from "./Core/react-router-dom";
import store from "./store";

ReactDOM.render(
	<Provider store={store} >
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
							<li><MenuLink to="/counter">计数器</MenuLink></li>
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
								<Route path="/counter" component={Counter} />
								<Authorized path="/profile" component={Profile} />
								<Redirect to="/" />
							</Switch>
						</div>
					</div>
				</div>
			</>
		</Router>
	</Provider>,
	document.getElementById("root"),
);
