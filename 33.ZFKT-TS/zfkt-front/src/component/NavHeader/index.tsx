import React from "react";
import { Icon } from "antd";

import "./index.less";

interface iProps {
	history: any;
	children: React.ReactChildren;
}

export default function(props: iProps) {
	return (
		<div className="nav-header">
			<Icon type="left" onClick={() => props.history.goBack()} />
			{props.children}
		</div>
	);
}
