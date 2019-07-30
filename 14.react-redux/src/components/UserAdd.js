import React, {Component} from "react";
import {createRef} from "../Core/react";
import {Prompt} from "../Core/react-router-dom";
import * as local from "../utils/local";

export default class UserAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {isBlocking: false};
		this.usernameRef = createRef();
	}
	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({isBlocking: false}, () => {
			let username = this.usernameRef.current.value,
				users = JSON.parse(local.getItem("users", "[]"));
			users.push({id: Date.now() + "", username});
			local.setItem("users", users);
			this.props.history.push("/user/list");
		});
	};
	textChange = (e) => {
		this.setState({
			isBlocking: this.state.isBlocking || e.target.value.length > 0,
		});
	};
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<Prompt
					when={this.state.isBlocking}
					message={(location) => `你确定要离开${location.pathname}吗？`}
				/>
				<input
					className="form-control"
					type="text"
					ref={this.usernameRef}
					onChange={this.textChange}
				/>
				<button type="submit" className="btn btn-primary">
					提交
				</button>
			</form>
		);
	}
}
