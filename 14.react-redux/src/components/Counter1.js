import React from "react";
import {PureComponent} from "../Core/react";
import {connect} from "../Core/react-redux";
import actions from "../store/actions/counter1.js";
class Counter extends PureComponent {
	
	render() {
		console.log("Counter1 render");
		return (
			<div style={{ border: "1px solid green" }}>
				<p>{this.props.number}</p>
				<button className="btn btn-info" onClick={this.props.add}>+</button>
				<button className="btn btn-info" onClick={this.props.minus}>-</button>
				<button className="btn btn-danger" onClick={this.props.asyncAdd}>async +</button>
				<button className="btn btn-danger" onClick={this.props.promiseAdd}>Promise +</button>
				<button className="btn btn-primary" onClick={()=>this.props.goto("/user")}>去首页</button>
			</div>
		);
	}
}
const mapStateToProps = (state) => state.counter1;
export default connect(
	mapStateToProps,
	actions,
)(Counter);
