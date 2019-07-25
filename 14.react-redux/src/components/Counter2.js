import React from "react";
import {connect} from "../Core/react-redux";
import {PureComponent} from "../Core/react/PureComponent.js";
class Counter extends PureComponent {
	render() {
		console.log("Counter2 render");
		return (
			<div style={{ border: "1px solid red" }}>
				<p>{this.props.number}</p>
				<button onClick={this.props.add}>+</button>
				<button onClick={this.props.minus}>+</button>
			</div>
		);
	}
}
const mapStateToProps = (state) => state.counter1;
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
