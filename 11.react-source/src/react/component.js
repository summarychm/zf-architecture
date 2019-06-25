/**
 * 定义组件公共属性和方法
 * 属性
 *  props
 * 方法
 *  setState
 */

class Component {
  constructor(props) {
    this.props = props;
  }
  setState(partialState) {
    console.log("setState", partialState);
    // 调用组件 unit 类上的 update 方法
    //! 所有的挂载，更新都应该交给对应的Component来管理
    this.unit.update(null, partialState);
  }
}
export default Component;