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
				<button onClick={this.props.add}>+</button>
				<button onClick={this.props.minus}>-</button>
				<button onClick={this.props.asyncAdd}>async +</button>
				<button onClick={this.props.promiseAdd}>Promise +</button>
			</div>
		);
	}
}
const mapStateToProps = (state) => state.counter1;
export default connect(
	mapStateToProps,
	actions,
)(Counter);
