// 新版ContextAPI实现
function createContext() {
  class Provider extends React.Component {
    static value;
    constructor(props) {
      super(props);
      Provider.value = props.value;
    }
    static getDerivedStateFromProps(nextProps, perState) {
      Provider.value = nextProps.value;
    }
    render() {
      return this.props.children;
    }
  }
  class Consumer extends React.Component {
    render() {
      return this.props.children(Provider.value);
    }
  }
  return {
    Provider,
    Consumer
  };
}
export {
  createContext
}