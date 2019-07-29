import React from "react";
import {Route} from "../Core/react-router-dom";
import MenuLink from "./MenuLink";
import UserAdd from "./UserAdd";
import UserDetail from "./UserDetail";
import UserList from "./UserList";

export default class User extends React.Component {
	render() {
		return (
			<div className="row">
				<div className="col-md-4">
					<ul className="nav nav-stacked">
						<li><MenuLink to="/user/add">添加用户</MenuLink></li>
						<li><MenuLink to="/user/list">用户列表</MenuLink></li>
					</ul>
				</div>
				<div className="col-md-8">
					<Route path="/user/add" component={UserAdd} />
					<Route path="/user/list" component={UserList} />
					<Route path="/user/detail/:id" component={UserDetail} />
				</div>
			</div>
		);
	}
}
