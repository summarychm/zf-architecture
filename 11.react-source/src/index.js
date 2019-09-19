// import React from "./react";
// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       number: 1
//     };
//   }
//   componentWillMount() {
//     console.log("Counter 开始挂载!");
//   }
//   componentDidMount() {
//     console.log("Counter 挂载完成!");
//   }
//   shouldComponentUpdate() {
//     return true;
//   }
//   handleClick = () => {
//     this.setState({
//       number: this.state.number + 1
//     });
//   };
//   render() {
//     let pName = React.createElement("span", null, this.state.number);
//     let pCount = React.createElement("span", {style: {padding: "10px"}}, this.props.name);
//     let button = React.createElement("button", {onClick: this.handleClick}, "+");
//     let styleObj = {
//       display:"inline-block",
//       backgroundColor: this.state.number % 2 === 0 ? "red" : "green",
//       color: this.state.number % 2 === 0 ? "green" : "red",
//     }
//     return React.createElement("div", {id: "counter", style: styleObj}, pCount, pName, button);
//   }
// }
// let element = React.createElement(Counter, { name: "计数器" });
// React.render(element, window.root);


import React from "./react";
class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: [], text: ''};
    this.val = "";
  }
  componentDidMount(){
  console.log("componentDidMount");
  }
  add() {
    if (this.state.text && this.state.text.length > 0) {
      this.setState({list: [...this.state.list, this.state.text], text: ''});
    }
    // this.setState({list: [...this.state.list, this.val]});
    // this.val="";
  }
  onChange(event) {
    this.setState({text: event.target.value});
    // this.val = event.target.value;
  }
  onDel(index) {
    this.state.list.splice(index, 1);
    this.setState({list: this.state.list});
  } 
  render() {
    let input = React.createElement("input", {onKeyup: this.onChange.bind(this), value: this.state.text});
    let button = React.createElement("button", {onClick: this.add.bind(this)}, 'Add')
    let createItem = (itemText, index) => {
      return React.createElement("div", {}, itemText, React.createElement('button', {onClick: this.onDel.bind(this, index)}, 'X'));
    };
    let lists = this.state.list.map(createItem);
    let ul = React.createElement('ul', {}, ...lists)
    return React.createElement('div', {}, input, button, ul);
  }
}
let todo = React.createElement(Todo);
React.render(todo, window.root);
