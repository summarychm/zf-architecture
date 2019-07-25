class Element {
  constructor(type, props) {
    this.type = type;
    this.props = props;
  }
}

/**
 * 创建虚拟DOM元素
 * @param {string} type 元素类型
 * @param {object} props 属性集合
 * @param  {...any} children 子元素集合
 */
function createElement(type, props, ...children) {
  props = props || {};
  props.children = children || [];
  return new Element(type, props);
}
export {Element, createElement};
