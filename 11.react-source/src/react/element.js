// 虚拟 DOM类型定义
// 虚拟 DOM:描述真实 DOM 的样子  
class Element{
  constructor(type,props){
    this.type=type;
    this.props=props;
  }
}

/**
 * 解析 jax 语法,返回虚拟 DOM 元素
 * @param {any} type 组件类型
 * @param {object} props 组件属性集合
 * @param  {...any} children 子组件集合
 */
function createElement(type,props={},...children){
  props=props||{};
  props.children=children||[];
  return new Element(type,props);
}
export default createElement;