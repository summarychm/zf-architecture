import React from "./react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
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
    let p = React.createElement("p", {}, this.state.number);
    let button = React.createElement(
      "button",
      {
        onClick: this.handleClick
      },
      "+"
    );
    return React.createElement(
      "div",
      {
        id: "counter"
      },
      p,
      button
    );
  }
}
let element = React.createElement(Counter, { name: "计数器" });
React.render(element, window.root);
