import React from "react";

export default class Login extends React.Component {
	state = { users: [] };
	handleLogin = () => {
		localStorage.setItem("logined", true);
		let { location, history } = this.props;
		let from = location.state && location.state.from;
		history.push(from ? from : "/");
	};
	render() {
		return (
			<button className="btn btn-primary" onClick={this.handleLogin}>
				登录
			</button>
		);
	}
}
