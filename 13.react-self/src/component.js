class Component {
  constructor(props) {
    this.props = props;
  }
  // 更新复合组件
  setState(partialState) {
    //第一个参数是新的ReactDOM 第二个参数是新的state
    this._currentUnit.update(null,partialState);
  }
}
export {Component};

