import React from "react";
import RouterContext from "./context";
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
