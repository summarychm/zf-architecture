import React from "react";
import { connect } from "react-redux";
import { Descriptions, Button } from "antd";

import auth from "$utils/auth";
import { TypeRootState } from "../../store/reducers";
import NavHeader from "$component/NavHeader";

function Profile(props: any) {
	return (
		<>
			<NavHeader>个人中心</NavHeader>
			<div className="user-info">
				<Descriptions title="当前登录用户">
					<Descriptions.Item label="用户名">珠峰架构</Descriptions.Item>
					<Descriptions.Item label="手机号">15718856132</Descriptions.Item>
					<Descriptions.Item label="邮箱">zhangsan@qq.com</Descriptions.Item>
				</Descriptions>
				<Button type="danger">退出登录</Button>
			</div>
		</>
	);
}
let mapStateToProps = (state: TypeRootState) => state.profile;
export default connect(mapStateToProps)(auth(Profile));
