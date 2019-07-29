import React from "react";
import { Route, Link } from "../Core/react-router-dom";
import "./MenuLink.css";
export default function({ exact, to, children }) {
	//children不管路径是否匹配，都会渲染返回值，render只会在path和地址栏路径匹配的时候才渲染
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
