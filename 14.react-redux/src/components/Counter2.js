import React from "react";
import {PureComponent} from "../Core/react";
import {connect} from "../Core/react-redux";
import * as types from "../store/action-types";

class Counter extends PureComponent {
	render() {
		console.log("Counter2 render");
		return (
			<div style={{ border: "1px solid red" }}>
				<p>{this.props.number}</p>
				<button onClick={this.props.add}>+</button>
				<button onClick={this.props.minus}>-</button>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => state.counter2;
const mapDispatchToProps = (dispatch, ownProps) => ({
	add() {
		dispatch({ type: types.ADD2, payload: ownProps.amount });
	},
	minus() {
		dispatch({ type: types.MINUS2 });
	},
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Counter);
