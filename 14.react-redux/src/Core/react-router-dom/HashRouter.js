import React from "react";
import RouterContext from '../react-router-dom/context';

export default class HashRouter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			location: {pathname: window.location.hash.slice(1)},
		};
		this.locationState = null;
		this.block = null;
	}
	componentDidMount() {
		this.hashChangeFn = () => {
			//更新hash信息,供children中的Route进行渲染
			this.setState({
				location: {
					...this.state.location,
					pathname: window.location.hash.slice(1) || "/",
					state: this.locationState,
				},
			});
		};
		window.addEventListener("hashchange", this.hashChangeFn);
		window.location.hash = window.location.hash || "/"; //更新hash触发hashchange事件
	}
	render() {
		let that = this;
		let value = {
			location: that.state.location,
			history: {
				// 不同实现的抽象封装,最好使用history库
				createHref(to) {
					let href = "#";
					if (typeof to === "object") href += to.pathname;
					else if (typeof to === "string") href += to;
					else href += "/";
					return href;
				},
				push(to) {
					if (that.block) { // 是否阻止跳转	
						// 调用用户的message函数
						if (!window.confirm(that.block(that.state.location)))
							return;
					}
					//传递对象的形式
					if (typeof to === "object") {
						let {pathname, state} = to;
						// 存储state,在hashChange事件中setState,在render中setState会死循环
						that.locationState = state;
						window.location.hash = pathname;//触发hashchange事件
					} else {
						//传递字符串的形式
						that.locationState = null;
						window.location.hash = to;
					}
				},
				block(message) {
					that.block = message;
				},
				unblock() {
					that.block = null;
				},
			},
		};
		return (
			<RouterContext.Provider value={value}>
				{this.props.children}
			</RouterContext.Provider>);
	}
	componentWillUnmount() {
		window.removeEventListener("hahschange", this.hashChangeFn);
	}
}
