import React from "./react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1
    };
  }
  componentWillMount() {
    console.log("Counter 开始挂载!");
  }
  componentDidMount() {
    console.log("Counter 挂载完成!");
  }
  shouldComponentUpdate() {
    return true;
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 1
    });
  };
  render() {
    let pName = React.createElement("span", null, this.state.number);
    let pCount = React.createElement("span", {style: {padding: "10px"}}, this.props.name);
    let button = React.createElement("button", {onClick: this.handleClick}, "+");
    return React.createElement("div", {id: "counter"}, pCount, pName, button);
  }
}
let element = React.createElement(Counter, {name: "计数器"});
React.render(element, window.root);
