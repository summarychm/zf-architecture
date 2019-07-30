import React from "react";
import ReactContext from "./context";
export default class Link extends React.Component {
	static contextType = ReactContext;
	render() {
		let { to, children, ...rest } = this.props,
			{ history } = this.context;
		return (
			<a
				{...rest}
				href={history.createHref(this.props.to)}
				onClick={(e) => {
					e.preventDefault();
					history.push(to);
				}}>
				{children}
			</a>
		);
	}
}