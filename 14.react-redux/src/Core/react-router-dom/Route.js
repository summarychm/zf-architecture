import pathToRegexp from "path-to-regexp";
import React from "react";
import RouterContext from "./context";
import * as tools from "../../utils/tools";
export default class Route extends React.Component {
	static contextType = RouterContext;
	render() {
		let { path = "/", component: Component, exact = false, render, children } = this.props;
		let { pathname } = this.context.location;
		let pathNames = [], //存储路径参数
			regexp = pathToRegexp(path, pathNames, { end: exact }), //根据Route的path生成正则
			result = pathname.match(regexp); // 匹配结果
		let props = {
			location: this.context.location,
			history: this.context.history,
		};
		if (result) {
			pathNames = pathNames.map((item) => item.name);
			let [url, ...values] = result; //提取结果中的所有路径参数
			let params = tools.combineObj(values, pathNames); // 将路径参数转为对象
			// 构建match属性
			props.match = {
				url: pathname,
				// 正则匹配到的url和当前pathname是否相等
				isExact: pathname === url,
				path,
				params,
			};
			if (Component) return <Component {...props} />;
			else if (render) return render(props);
			else if (children) return children(props);
		} else if (children) return children(props);
		else return null;
	}
}

// 提取混合keyObj和valueObj
