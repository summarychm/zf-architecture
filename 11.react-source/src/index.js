import React from "./react";
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

class Counter extends React.Component{
  constructor(props){
    super(props);
    this.state = {odd:true};
  }
  componentDidMount(){
   setTimeout(()=>{
    this.setState({odd:!this.state.odd});
   },1000);
  }
  render(){
    if(this.state.odd){
      return React.createElement('ul',{key:'wrapper'},
        React.createElement('li',{key:'A'},'A'),
        React.createElement('li',{key:'B'},'B'),
        React.createElement('li',{key:'C'},'C'),
        React.createElement('li',{key:'D'},'D'),
      );
    }
    return React.createElement('ul',{key:'wrapper'},
      React.createElement('li',{key:'A'},'A1'),
      React.createElement('li',{key:'C'},'C1'),
      React.createElement('li',{key:'B'},'B1'),
      React.createElement('li',{key:'E'},'E1'),
      React.createElement('li',{key:'F'},'F1')
      );
  }
}

let element = React.createElement(Counter, {name: "计数器"});
React.render(element, window.root);
