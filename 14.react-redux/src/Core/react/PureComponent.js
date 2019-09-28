import React from "react";
// 参考: http://www.zhufengpeixun.cn/architecture/html/62.3.react-high.html

class PureComponent extends React.Component {
  static isPureComponet = true;
  // 在子类实例的原型链上预制了shouldComponentUpdate这个生命周期函数
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }
}
// 对象浅比较方法
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 != 'object' || obj1 === null || typeof obj2 != 'object' || obj2 === null)
    return false;
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) { // 只比较第一层
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key])
      return false;
  }
  return true;
}
export {PureComponent};
