import React from "react";
import Route from "./Route";
// 包裹用户自定义组件HOC
export default function(WrappedComponent) {
	return () => <Route component={WrappedComponent} />;
}
