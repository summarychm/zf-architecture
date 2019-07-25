import React from "react";
import ReactReduxContext from "./context";

export default class extends React.Component {
	static contextType = ReactReduxContext;
	render() {
		return (
			// 将store传递给contextAPI,并渲染children
			<ReactReduxContext.Provider value={{store:this.props.store}}>{this.props.children}</ReactReduxContext.Provider>
		);
	}
}
