import React, {Component} from "react";
import * as local from "../utils/local";
;
export default class UserDetail extends Component {
	state = { user: {} };
	componentDidMount() {
		//方式1: 通过history的state传递user信息
		let user = this.props.location.state,
			id = this.props.match.params.id;
		// console.log(user, id);
		if (!user && id) {
			//方式2: 通过match参数获取user信息
			let users = JSON.parse(local.getItem("users"));
			user = users.find((user) => user.id === id);
		}
		if (user) this.setState({ user });
	}
	render() {
		let { id, username } = this.state.user;
		return (
			<div>
				<p>用户ID:{id}</p>
				<p>用户名:{username}</p>
			</div>
		);
	}
}
