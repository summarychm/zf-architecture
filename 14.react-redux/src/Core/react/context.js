import React from 'react';
// 新版ContextAPI实现
function createContext() {
  class Provider extends React.Component {
    static value;
    constructor(props) {
      super(props);
      Provider.value = props.value;
      this.state = {
        value: props.value
      };
    }
    static getDerivedStateFromProps(nextProps, preState) {
      Provider.value = nextProps.value;
      return {
        value: nextProps.value
      }
    }
    render() {
      return this.props.children;
    }
  }
  class Consumer extends React.Component {
    constructor(props){
      super(props);
  }
    render() {
      return this.props.children(Provider.value);
    }
  }
  return {
    Provider,
    Consumer
  };
}
export {createContext};

