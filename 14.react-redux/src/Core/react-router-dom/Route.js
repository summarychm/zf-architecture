import pathToRegexp from "path-to-regexp";
import React from "react";
import ReactContext from "./context";

export default class Route extends React.Component {
	static contextType = ReactContext;
	render() {
		let { path = "/", component: Component, exact = false } = this.props;
		let { location } = this.context;
		let pathNames = [],
			regexp = pathToRegexp(path, pathNames, { end: exact }),
			result = location.pathname.match(regexp);
		console.log("regexp,pathname,result,pathNames", regexp, location.pathname, result,pathNames);
		if (result) {
			return <Component />;
		} else {
			return null;
		}
	}
}
