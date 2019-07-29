import pathToRegexp from "path-to-regexp";
import React from "react";
import RouterContext from "./context";

export default class Switch extends React.Component {
	static contextType = RouterContext;
	render() {
		let { children } = this.props;
		children = Array.isArray(children) ? children : [children];
		let { pathname } = this.context.location;
		// 依次对比children,如果匹配则直接返回,不再向下匹配
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			let { path = "/", exact = false } = child.props;
			let paramNames = [];
			let regexp = pathToRegexp(path, paramNames, { end: exact });
			let result = pathname.match(regexp);
			//返回Route,便于向Component传递history,location,match等属性.
			if (result) return child;
		}

		return null;
	}
}


