import React from "react";
import { Alert, Button } from "antd";
import history from "../store/history";
import NavHeader from "$component/NavHeader";

// 从redux获取用户token,如果存在则认为已登录
export default function auth(WrapComponent: React.ComponentType) {
	return class extends React.Component {
		//用户是否登录
		isLogin(): boolean {
			let flag = false;
			return flag;
		}
		render() {
			if (!this.isLogin()) {
				return (
					<>
						<NavHeader>珠峰课堂</NavHeader>
						<Alert type="warning" message="当前未登录" description="亲爱的用户你好，你当前尚未登录，请你选择注册或者登录" />
						<div style={{ textAlign: "center", padding: "50px" }}>
							<Button type="dashed" onClick={() => history.push("/login")}>
								登录
							</Button>
							<Button type="dashed" style={{ marginLeft: "50px" }} onClick={() => history.push("/register")}>
								注册
							</Button>
						</div>
					</>
				);
			} else return <WrapComponent />;
		}
	};
}
