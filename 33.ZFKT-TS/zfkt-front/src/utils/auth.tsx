import React from "react";
import history from "../store/history";

// 从redux获取用户token,如果存在则认为已登录
export default function auth(WrapComponent: React.ComponentType) {
	return class extends React.Component {
		//用户是否登录
		isLogin(): boolean {
			let flag = true;
			return flag;
		}
		render() {
			if (!this.isLogin()) history.push("/login");
			return <WrapComponent />;
		}
	};
}
