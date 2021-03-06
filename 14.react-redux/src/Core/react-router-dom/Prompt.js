import React from "react";
import RouterContext from "./context";
// 通过暴露的when属性(标识是否阻止跳转),message属性(提示文本)
export default class Prompt extends React.Component {
	static contextType = RouterContext;
	render() {
		let { history } = this.context;
    const { when, message } = this.props;
		if (when) history.block(message);
		else history.block(null);
		return null;
	}
	componentWillUnmount() {
		this.context.history.unblock();
	}
}
