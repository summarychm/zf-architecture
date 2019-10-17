import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "antd";

import "./index.less";

export default function() {
	return (
		<footer>
			<NavLink to="/" exact>
				<Icon type="home" />
				<span>首页</span>
			</NavLink>
			<NavLink to="/mine">
				<Icon type="solution" />
				<span>我的课程</span>
			</NavLink>
			<NavLink to="/profile">
				<Icon type="user" />
				<span>个人中心</span>
			</NavLink>
		</footer>
	);
}
