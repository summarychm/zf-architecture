import React from "react";
import NavHeader from "$component/NavHeader";
interface Props {
	history: any;
}
export default class Register extends React.Component<Props> {
	render() {
		return (
			<>
				<NavHeader>注册</NavHeader>
				<div>注册</div>
			</>
		);
	}
}
