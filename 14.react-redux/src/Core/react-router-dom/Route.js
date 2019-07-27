import React from "react";
import ReactContext from "./context";
export default class Route extends React.Component {
	static contextType = ReactContext;
	render() {
		let { pathname } = this.context.location;
		let { path = "/", component: Component, exact } = this.props;
		if (path === pathname) {
			return <Component />;
		} else {
			return null;
		}
	}
}
