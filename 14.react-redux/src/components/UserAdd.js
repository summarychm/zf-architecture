import React, {Component} from "react";
import {createRef} from "../Core/react";
import {withPrompt} from "../Core/react-router-dom";
import * as local from "../utils/local";

class UserAdd extends Component {
	constructor(props) {
		super(props);
		this.usernameRef = createRef();
	}
	handleSubmit = (event) => {
		event.preventDefault();
		this.props.settle(false,null);// 清空阻止跳转功能
		let username = this.usernameRef.current.value,
			users = JSON.parse(local.getItem("users", "[]"));
		users.push({id: Date.now() + "", username});
		local.setItem("users", users);
		this.props.history.push("/user/list");
	};
	textChange = (e) => {
		this.props.settle(e.target.value.length>0,location=>`你是否要离开${location.pathname}`)
	};
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
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

export default withPrompt(UserAdd);