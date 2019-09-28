import React from "react";
import { withRouter } from "../Core/react-router-dom";
class NavHeader extends React.Component {
	render() {
		return (
			<div className="navbar-header">
				<a
					href="void:(0);"
					className="navbar-brand"
					onClick={() => {
						this.props.history.push("/");
					}}>
					珠峰架构
				</a>
			</div>
		);
	}
}

export default withRouter(NavHeader);
