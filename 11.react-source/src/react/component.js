import Transaction from "./Transaction";

//! 这个batch对象如何抽离出来,现在updater和component都使用到了,无法抽离
let batchingStrategy = {
  isBatchingUpdates: false,//是否批量更新
  dirtyComponents: [],// 待更新的脏组件集合(组件的state和界面显示不一致)
  batchedUpdateds() { //开始批量更新,把所有脏组件根据自己的state重新渲染
    this.dirtyComponents.forEach(dirty => {
      dirty._componet.updateComponent();
    });
  }
}

// 更新器,
class Updater {
  constructor(component) {
    // 将component缓存到自身,建立双向指向
    this._componet = component;
    this._pedingStates = [];//暂存临时状态
  }
  addState(partState) {
    this._pedingStates.push(partState);
    // 判断当前更新模式,批量更新则暂存dirtyComponet,否则立即更新
    batchingStrategy.isBatchingUpdates
      ? batchingStrategy.dirtyComponents.push(this._componet)
      : this._componet.updateComponent();
  }
}

let transaction = new Transaction([{
  initialize() {
    batchingStrategy.isBatchingUpdates = true;
  },
  close() {
    batchingStrategy.isBatchingUpdates = false;
    batchingStrategy.batchedUpdateds();//开始批量更新,
  }
}])
// 改为兼容jquery的delegate
window.trigger = function (event, method) {
  function startTrigger() {
    console.log("触发事件");
  }
  transaction.perform(startTrigger)
}


// 用户自定义组件父类ReactElement
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    // 每个组件对应自己的更新器实例,双向指向
    this._updater = new Updater(this);
  }
  setState(partialState) {
    console.log("setState", partialState);
    this._updater.addState(partialState);// 添加待更新state
    //! 调用组件 unit 类上的  update 方法来进行更新
    // 参数1:新元素,参数2:新状态
    // this._currentUnit.update(null, partialState);
  }
  updateComponent() {
    let state = {}
    this._updater._pedingStates.forEach(partState => Object.assign(state, partState))
    this._updater._pedingStates = [];
    this._currentUnit.update(null, state);
  }
}
export default Component;