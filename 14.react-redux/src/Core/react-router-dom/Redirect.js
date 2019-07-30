import React from "react";
import RouterContext from "./context";

export default class Redirect extends React.Component {
	static contextType = RouterContext;
	componentDidMount() {
		// 不存在from或from与当前pathname相等的情况下才进行跳转
		if (!this.props.from || this.props.from === this.context.location.pathname)
			this.context.history.push(this.props.to);
	}
	render() {
		return null;
	}
}
