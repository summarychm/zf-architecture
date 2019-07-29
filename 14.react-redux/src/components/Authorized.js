import React from "react";
import { Route, Redirect } from "../Core/react-router-dom";
/**
实现思路是这样的 我们渲染一个Route组件，
然后在里面做判断，如果此用户登录过了可直接渲染对应的组件，如果没有登录过，是重定向到登录页去
 */
export default class Authorized extends React.Component {
	render() {
		let { path, component: Component } = this.props;
		return (
			<Route
				path={path}
				render={(props) => (localStorage.getItem("logined") ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location.pathname } }} />)}
			/>
		);
	}
}
