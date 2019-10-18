import React, { ReactChild } from "react";
import { Icon } from "antd";
import history from "../../store/history";
import "./index.less";

interface iProps {
	children: ReactChild;
}

export default function NavHeader(props: iProps) {
	return (
		<div className="nav-header">
			<Icon type="left" onClick={() => history.goBack()} />
			{props.children}
		</div>
	);
}
