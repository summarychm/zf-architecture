import React from "react";
import ReactContext from "./context";
export default class HashRouter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { location: { pathname: window.location.hash.slice(1) || "/" } };
	}
	componentDidMount() {
		this.hashChangeFn = (e) => {
			console.log(e);

			this.setState({
				location: { ...this.state.location, pathname: window.location.hash.slice(1) || "/" },
			});
		};
		window.addEventListener("hashchange", this.hashChangeFn);
		window.location.hash = window.location.hash || "/"; //更新hash触发hashchange事件
	}
	componentWillUnmount() {
		window.removeEventListener("hahschange", this.hashChangeFn);
	}
	render() {
		var value = {
			location: this.state.location,
			history: {
				// 不同实现的抽象封装
				push(to) {
					window.location.hash = to;
				},
			},
		};
		return <ReactContext.Provider value={value}>{this.props.children}</ReactContext.Provider>;
	}
}
