import React from "./react";

class Todos extends React.Component {
	constructor(props) {
		super(props);
		this.state = { todos: [], text: "" };
	}
	// 根据idx删除现有 todo
	onDel = (idx) => {
		let todos = this.state.todos;
		this.setState({
			todos: [...todos.slice(0, idx), ...todos.slice(idx + 1)],
		});
	};
	// 缓存用户输入
	onChange = (event) => {
		this.setState({
			text: event.target.value.trim(""),
		});
	};
	// 添加新 todo
	onAdd = () => {
		this.setState({
			todos: [...this.state.todos, this.state.text],
			text: "",
		});
	};
	render() {
		let title = React.createElement("h1", {}, this.props.name);
		let todos = this.state.todos.map((todo, idx) => {
			let del = React.createElement("button", { onClick: () => this.onDel(idx) }, "del");
			return React.createElement("li", {}, todo, del);
		});
		let input = React.createElement("input", { onKeyup: this.onChange, value: this.state.text });
		let button = React.createElement("button", { onClick: this.onAdd }, "add");
		let ul = React.createElement("ul", {}, ...todos);
		return React.createElement("div", { id: "todoContainer" }, title, input, button, ul);
	}
}
let element = React.createElement(Todos, { name: "任务列表" });
React.render(element, window.root);

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
