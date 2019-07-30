import React from "react";
import Route from "./Route";
// 使用Route组件包裹用户自定义组件,使用户自定义组件也可以使用history等方法
export default function(WrappedComponent) {
	return () => <Route component={WrappedComponent} />;
}
