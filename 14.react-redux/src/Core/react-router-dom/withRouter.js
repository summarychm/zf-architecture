import React from "react";
import Route from "./Route";
// 使用Route组件包裹用户自定义组件,使用户自定义组件也可以使用history等方法
export default function (WrappedComponent) {
	// 因为包装后的组件要渲染到dom,所有这里要返回一个组件,而不是返回React元素
	return (props) => <Route component={WrappedComponent} {...props} />;
}
