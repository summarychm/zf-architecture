/**
 * 用户自定义组件父类ReactElement
 * 属性
 *  props
 * 方法
 *  setState
 */
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
  setState(partialState) {
    console.log("setState", partialState);
    //! 调用组件 unit 类上的 update 方法来进行更新
    // 参数1:新元素,参数2:新状态
    this._currentUnit.update(null, partialState);
  }
}
export default Component;