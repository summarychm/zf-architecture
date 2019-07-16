import $ from 'jquery';
import {Element} from './element';

// 根据虚拟DOM创建对应的Unit实例
function createUnit(element) {
  if (typeof element === "string" || typeof element === "number")
    return new TextUnit(element);
  else if (element instanceof Element && typeof element.type === "string") {
    return new NativeUnit(element);
  } else if (element instanceof Element && typeof element.type === "function") {
    return new CompositeUnit(element);
  }
}
class Unit {
  constructor(element) {
    this._currentElement = element;
  }
  getMarkUp() {
    throw Error("此方法不能被调用");
  }
}

// 文本组件
class TextUnit extends Unit {
  getMarkUp(reactId) {
    this._reactId = reactId;
    return `<span data-reactid="${reactId}">${this._currentElement}</span>`
  }
}
// 原生DOM组件
class NativeUnit extends Unit {
  getMarkUp(reactId) {
    this._reactId = reactId;
    let {
      type,
      props
    } = this._currentElement;

    let tagStart = `<${type} data-reactid="${this._reactId}"`;
    let childString = "";
    let tagEnd = `</${type}>`;
    for (const [key, val] of Object.entries(props)) {
      // 处理事件绑定
      if (/^on[A-Z]/.test(key)) {
        let eventName = key.slice(2).toLowerCase();
        $(document).delegate(`[data-reactid="${reactId}"]`, `${eventName}.${reactId}`, val);
      } else if (key === "className") {
        tagStart += " class=" + props[key];
      } else if (key === "style") {
        let styleStr = Object.entries(val).map(([attr, value]) => {
          return `${attr.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)}:${value}`
        }).join(";");
        tagStart += ` style=${styleStr}`;
      } else if (key === "children") {
        childString = val.reduce((per, cur, index) => {
          let childUnit = createUnit(cur);
          return per + childUnit.getMarkUp(reactId + "." + index);
        }, "");
      } else {
        tagStart += ` ${key}=${val}`;
      }
    }
    return tagStart + ">" + childString + tagEnd;
  }
}

// 复合组件(用户自定义组件)
class CompositeUnit extends Unit {
  getMarkUp(reactId) {
    this._reactId = reactId;
    let {
      type: Component,
      props
    } = this._currentElement;
    // 1.创建当前复合组件实例
    // 2.调用用户定义的componentWillMount方法
    // 3.调用该实例的render方法获取要渲染的React组件.
    // 4.调用组件的getMarkUp方法获取要渲染的真实DOM字符串
    // 5.在document上注册mounted事件,在其中滴啊用用户的componentDidMount
    let componentInstance = new Component(props); //复合组件实例
    componentInstance._currentUnit = this;
    componentInstance.componentWillMount && componentInstance.componentWillMount();
    let componentElement = componentInstance.render(); // 要渲染的React组件实例(虚拟DOM)
    let renderUnitInstance = this._renderUnitInstance = createUnit(componentElement); //获取要渲染组件的Unit实例.
    // 通过unit获取对应的html字符串
    let renderMarkUp = renderUnitInstance.getMarkUp(this._reactId);
    //注册根节点的mounted事件.用于调用componentDidMount
    $(document).on("mounted", () => {
      componentInstance.componentDidMount && componentInstance.componentDidMount();
    });
    return renderMarkUp;
  }
}
export {createUnit};
