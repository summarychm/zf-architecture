import React, {Component} from "react";
import {createRef} from "../Core/react";
import * as local from "../utils/local";
export default class UserAdd extends Component {
	constructor() {
		super();
		this.usernameRef = createRef();
	}
	handleSubmit = (event) => {
		event.preventDefault();
		let username = this.usernameRef.current.value,
			users = JSON.parse(local.getItem("users", "[]"));
		users.push({ id: Date.now() + "", username });
		local.setItem("users", users);
		this.props.history.push("/user/list");
	};
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input className="form-control" type="text" ref={this.usernameRef} />
				<button type="submit" className="btn btn-primary">
					提交
				</button>
			</form>
		);
	}
}
