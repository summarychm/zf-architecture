// 虚拟 DOM类型定义,描述真实 DOM 节点 
class ReactElement {
  constructor(type, props) {
    this.type = type;
    this.key = props.key; // dom diff
    this.props = props;
  }
}

/** 创建虚拟 DOM 元素(该值一般由react-loader将jsx语法解析而成)
 * @param {any} type 组件类型
 * @param {object} props 组件属性集合
 * @param  {...any} children 子组件集合
 */
function createElement(type, props, ...children) {
  props = props || {};
  props.children = children || [];//children是props的一个属性
  return new ReactElement(type, props);
}
export {createElement, ReactElement};