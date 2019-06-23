import $ from 'jquery';
// 工厂父类,用于定义与抽离公共属性和方法
class Unit {
  constructor(element) {
    this._currentElement = element; // 缓存当前 react 组件实例
  }
}
// 子类(文本节点) 对应 string / number 元素
class ReactTextUnit extends Unit {
  getMarkUp(rootId) {
    this._rootId = rootId; // 缓存组件的id
    return `<span data-reactid="${this._rootId}">${this._currentElement}</span>`;
  }
}

//子类:原生 DOM 元素
class ReactNativeUnit extends Unit {
  // 将 React.createElement 语法转为 html 字符串
  getMarkUp(rootId) {
    this._rootId = rootId;
    const {
      type,
      props
    } = this._currentElement;
    let tagStart = `<${type} data-reactid="${this._rootId}"`;
    let childString = ``; // 存储子组件DOMString 集合
    let tagEnd = `</${type}>`;
    for (const propKey in props) {
      if (props.hasOwnProperty(propKey)) {
        const value = props[propKey];
        if (/^on[A-Z]/.test(propKey)) {
          // 1.处理组件的注册事件
          let eventType = propKey.slice(2).toLowerCase();
          // 将事件委托到 document上
          $(document).delegate(`[data-reactid="${this._rootId}"]`, eventType, value);
        } else if (propKey === 'children') {
          // 2.处理子组件集合(涉及递归处理)
          childString = value.map((ele, index) => {
            let childRenReactUnit = createReactUnit(ele);
            // 拼接子节点reactid,自身节点+.+index
            return childRenReactUnit.getMarkUp(`${this._rootId}.${index}`);
          });
          childString = childString.join("");
        } else {
          // 3.处理普通属性
          tagStart += ` ${propKey}=${value}`;
        }
      }
    }
    return tagStart + ">" + childString + tagEnd;
  }
}

/**
 * 工厂方法: 根据element 的不同返回不同的组件实例节点,
 * 一般来说这些实例都是同一父类的子类.
 * 使用工厂方法实现了横向扩展,新增 React 类型处理只需在此添加判断,并创建对应的 Unit子类即可.  
 * @param {any} element React组件实例
 */
function createReactUnit(element) {
  // 类型一: 文本节点
  if (typeof element === "number" || typeof element === "string") {
    return new ReactTextUnit(element);
  }
  // 类型二: 原生 DOM 节点
  else if (typeof element === "object" && typeof element.type === "string") {
    return new ReactNativeUnit(element);
  }
  // 类型三: React 自定义组件
  else{
    console.log("测试")
   
  }
}

export default createReactUnit;