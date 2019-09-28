import React from "react";
import {Link, Route} from "../Core/react-router-dom";
import "./MenuLink.css";
// 使用Route组件children属性的渲染特性
// 在children中通过props.match(匹配详情)属性来判断是否匹配成功,
export default function ({exact, to, children}) {
	return (
		<Route
			exact={exact}
			path={to}
			children={(props) => (
				<Link className={props.match ? "active" : ""} to={to}>
					{children}
				</Link>
			)}
		/>
	);
}
