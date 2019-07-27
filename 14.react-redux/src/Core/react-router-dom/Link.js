import React from "react";
import ReactContext from "./context";
export default class Link extends React.Component {
	static contextType = ReactContext;
	render() {
		let { to, children } = this.props;
		return (
			<a
				onClick={() => {
					this.context.history.push(to);
				}}>
				{children}
			</a>
		);
	}
}
