// 定义组件公共属性和方法
class Component {
  constructor(props) {
    this.props = props;
  }
  setState(partialState) {
    this.unit.update(null,partialState);
    console.log("setState",partialState);
  }
}
export default Component;