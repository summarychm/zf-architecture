import React, {Component} from "react";
import {Link} from "../Core/react-router-dom";
import * as local from "../utils/local";
export default class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: JSON.parse(local.getItem("users")),
		};
	}
	render() {
		return (
			<div>
				UserList
				<ul className="list-group">
					{this.state.users.map((user, idx) => (
						<li className="list-group-item" key={user.id}>
							<Link to={{ pathname: `/user/detail/${user.id}`, state: user }}>{user.username}</Link>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
