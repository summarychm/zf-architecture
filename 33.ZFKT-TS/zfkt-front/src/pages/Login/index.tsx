import React from "react";
import NavHeader from "$component/NavHeader";

interface iProps {
	history: any;
}

export default function login(props: iProps) {
	return (
		<>
			<NavHeader>登录</NavHeader>
			<div>Login</div>
		</>
	);
}
