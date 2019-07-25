import React from "react";
import {connect} from "../Core/react-redux";
import PureComponent from "../Core/react/PureComponent.js";
import actions from "../store/actions/counter1.js";
class Counter extends PureComponent {
	render() {
		console.log("Counter1 render");
		return (
			<div style={{ border: "1px solid green" }}>
				<p>{this.props.number}</p>
				<button onClick={this.props.add}>+</button>
				<button onClick={this.props.minus}>-</button>
			</div>
		);
	}
}
const mapStateToProps = (state) => state.counter1;
export default connect(
	mapStateToProps,
	actions,
)(Counter);
