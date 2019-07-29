import React from "react";
import RouterContext from "./context";

export default class HashRouter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			location: { pathname: window.location.hash.slice(1) },
		};
		this.locationState = null;
	}
	componentDidMount() {
		this.hashChangeFn = () => {
			//更新hash信息,供children中的Route进行渲染
			this.setState({
				location: {
					...this.state.location,
					// 更新location相关信息
					pathname: window.location.hash.slice(1) || "/",
					state: this.locationState,
				},
			});
		};
		window.addEventListener("hashchange", this.hashChangeFn);
		window.location.hash = window.location.hash || "/"; //更新hash触发hashchange事件
	}
	componentWillUnmount() {
		window.removeEventListener("hahschange", this.hashChangeFn);
	}
	render() {
		let that = this;
		let value = {
			location: that.state.location,
			history: {
				createHref(to){
					let href="#";
					if(typeof to==='object')
						href+=to.pathname;
					else if(typeof to==="string")
						href+=to;
					else
						href+="/";
					return href;
				},
				// 不同实现的抽象封装
				push(to) {
					//传递对象的形式
					if (typeof to === "object") {
						let { pathname, state } = to;
						// 存储state,在hashChange事件中setState,在render中setState会死循环
						that.locationState = state;
						window.location.hash = pathname;
					} else {
						//传递字符串的形式
						that.locationState = null;
						window.location.hash = to;
					}
				},
			},
		};
		return <RouterContext.Provider value={value}>{this.props.children}</RouterContext.Provider>;
	}
}
