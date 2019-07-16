import React from "./react";

class Container extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			number: 55,
		};
	}
	componentWillMount() {
		console.log("componentWillMount");
	}
	componentDidMount() {
		console.log("componentDidMount");
	}
	increment = () => {
		this.setState({
			number: this.state.number + 1,
		});
	};
	render() {
		console.log("render");
		let p = React.createElement("p", { style: { color: "red", backgroundColor: "green" } }, this.props.name, this.state.number);
		let button = React.createElement("button", { onClick: this.increment }, "+");
		return React.createElement("div", { id: "counter" }, p, button);
	}
}
let element = React.createElement(Container, { name: "计数器" });

// let element = React.createElement(
// 	"button",
// 	{
// 		id: "say",
// 		style: {
// 			color: "red",
// 			backgroundColor: "green",
// 		},
// 		onClick: sayHello,
// 		className: "ceshiClass",
// 		name: "name",
// 	},
// 	"sayHelloBtn",
// 	"ceshi",
// );
// function sayHello() {
// 	console.log("sayHello");
// }
React.render(element, window.root);
