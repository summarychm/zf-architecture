import $ from 'jquery';
import {Element} from './element';
import types from './types';

let diffQueue = []; // 差异队列
let updateDepth = 0; // 更新的级别

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
  update() {
    throw new Error("此方法不能被调用");
  }
}

// 文本组件(包裹sapn)
class TextUnit extends Unit {
  getMarkUp(reactId) {
    this._reactId = reactId;
    return `<span data-reactid="${reactId}">${this._currentElement}</span>`
  }
  update(nextElement) {
    if (this._currentElement === nextElement) return;
    this._currentElement = nextElement;
    $(`$[data-reactid="${this._reactId}"]`).html(this._currentElement);
  }
}
// 原生DOM组件(拼接字符串)
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
    this._renderedChildrenUnits = [];
    // 处理props
    for (const [propsKey, propsVal] of Object.entries(props)) {
      // 处理事件绑定
      if (/^on[A-Z]/.test(propsKey)) {
        let eventName = propsKey.slice(2).toLowerCase();
        $(document).delegate(`[data-reactid="${reactId}"]`, `${eventName}.${reactId}`, propsVal);
      } else if (propsKey === "className") {
        tagStart += " class=" + props[propsKey];
      } else if (propsKey === "style") {
        let styleStr = "";
        for (const [attr, value] in Object.entries(propsVal)) {
          styleStr += `${attr.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)}:${value};`
        }
        tagStart += ` style="${styleStr}"`;
      } else if (propsKey === "children") {
        childString = propsVal.reduce((per, cur, index) => {
          let childUnit = createUnit(cur);
          this._renderedChildrenUnits.push(childUnit); // 将children集合存储起来
          return per + childUnit.getMarkUp(reactId + "." + index);
        }, "");
      } else {
        tagStart += ` ${propsKey}=${propsVal}`;
      }
    }
    return tagStart + ">" + childString + tagEnd;
  }
  // 原生DOM组件更新,只会更新虚拟DOM,而不会涉及state
  update(nextElement) {
    let oldProps = this._currentElement.props;
    let newProps = nextElement.props;
    this.updateDOMProperties(oldProps, newProps);
    //! 还缺少最重要的diff算法
    this.updateDOMChildren(nextElement.props.children);
  }
  // 遍历children进行差异更新
  updateDOMChildren(newChildrenElements) {
    updateDepth++;
    this.diff(newChildrenElements);
    updateDepth--;
    if (updateDepth === 0) {
      console.log(diffQueue);
      // this.patch(diffQueue); //根据补丁包进行差异更新
      diffQueue = []; //重置差异队列
    }
  }
  // 深度diff子元素
  diff(newChildrenElements) {
    let oldChildUnitMap = this.getOldChildrenMap(this._renderedChildrenUnits);
    let {
      newChildrenUnitMap,
      newChildrenUnits
    } = this.getNewChildren(oldChildUnitMap, newChildrenElements);
    let lastIndex = 0; // 上一个确定位置的索引
    for (let i = 0; i < newChildrenUnits.length; i++) {
      let newUnit = newChildrenUnits[i];
      let newKey = (newUnit._currentElement.props && newUnit._currentElement.props.key) || i;
      let oldChildUnit = oldChildUnitMap[newKey];
      if (oldChildUnit === newUnit) { //可以复用老节点
        if (oldChildUnit._mountIndex < lastIndex) {
          diffQueue.push({
            parentId: this._reactId,
            parentNode: $(`[data-reactid="${this._reactId}"]`),
            type: types.MOVE,
            fromIndex: oldChildUnit._mountIndex,
            toIndex: i,
          });
        }
        // 更新最新的索引位置
        lastIndex = Math.max(lastIndex, oldChildUnit._mountIndex);
      } else { // children的新节点与旧节点不同
        if (oldChildUnit) { // 如果旧节点存在添加到删除节点
          // 删除原有的旧节点
          diffQueue.push({
            parentId: this._reactid,
            parentNode: $(`[data-reactid="${this._reactid}"]`),
            type: types.REMOVE,
            fromIndex: oldChildUnit._mountIndex
          });
          // 删除childrenUnit集合中旧的unit对象
          this._renderedChildrenUnits = this._renderedChildrenUnits.filter(item => item != oldChildUnit);
          // 删除该元素上绑定的事件
          $(document).undelegate(`.${oldChildUnit._reactId}`);
        }
        // 添加新的dom节点
        diffQueue.push({
          parentId: this._reactid,
          parentNode: $(`[data-reactid="${this._reactid}"]`),
          type: types.INSERT,
          toIndex: i,
          markUp: newUnit.getMarkUp(`${this._reactid}.${i}`)
        });
      }
      newUnit._mountIndex = i; //! ??这属性时干啥的?
    }
  }
  // 获取当前组件最新的unit集合
  getNewChildren(oldChildUnitMap, newChildrenElements) {
    let newChildrenUnits = [],
      newChildrenUnitMap = {};
    newChildrenElements.forEach((newElement, index) => {
      let newKey = (newElement.props && newElement.props.key) || index;
      let oldUnit = oldChildUnitMap[newKey]; //找到老的unit
      let oldElement = oldUnit && oldUnit._currentElement; //找到老的虚拟dom
      if (shouldDeepCompare(oldElement, newElement)) {
        oldUnit.update(newElement);
        newChildrenUnits.push(oldUnit); // 复用旧的unit
        newChildrenUnitMap[newKey] = oldUnit; //存入新unit集合
      } else { // 新旧ReactElement不一致
        let nextUnit = createUnit(newElement); // 创建新unit
        newChildrenUnits.push(nextUnit);
        newChildrenUnitMap[newKey] = nextUnit;
      }
    });
    return {
      newChildrenUnitMap,
      newChildrenUnits
    };
  }
  // 将当前组件children的unit转为对象类型
  getOldChildrenMap(childrenUnits = []) {
    return childrenUnits.reduce(function (per, cur, idx) {
      let unit = childrenUnits[idx];
      let key = (unit._currentElement.props && unit._currentElement.props.key) || idx;
      per[key] = unit;
      return per;
    }, {});
  }

  // 更新原生组件上的属性
  updateDOMProperties(oldProps, newProps) {
    let $element = $(`[data-reactid="${this._reactId}"]`); // 当前元素的真实DOM对象
    for (const propsName in oldProps) { //1.删除无用属性,取消所有时间监听
      if (!newProps.hasOwnProperty(propsName)) //删除无用属性
        $element.removeAttr(propsName);
      if (/^on[A-Z]/.test(propsName))
        $(document).undelegate(`.${this._reactId}`);
    }
    for (const propsName in newProps) {
      if (propsName === 'children')
        continue;
      else if (propsName === "className")
        $element.attr('class', newProps[propsName]);
      else if (/^on[A-Z]/.test(propsName)) {
        let eventName = propsName.slice(2).toLowerCase();
        $(document).delegate(`[data-reactid="${this._reactId}"]`, `${eventName}.${this._reactId}`, newProps[propsName]);
      } else if (propsName === "style") {
        for (const [attr, value] of Object.entries(newProps[propsName])) {
          $element.css(attr, value);
        }
      } else
        $element.prop(propsName, newProps[propsName])
    }
  }
}

// 复合组件(调用render)
class CompositeUnit extends Unit {
  /**
   * 复合组件的更新方法
   * @param {Object} nextElement 要渲染的虚拟DOM组件
   * @param {object} partialState 要更新的state
   */
  update(nextElement, partialState) {
    // 获取新的虚拟DOM元素
    this._currentElement = nextElement || this._currentElement;
    // 生成最新的state
    let nextState = Object.assign(this._componentInstance.state, partialState);
    // 获取最新的props
    let nextProps = this._currentElement.props;
    // life-cycle shouldComponentUpdate
    if (this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextProps, nextState))
      return;
    // 从Unit单元上获取虚拟DOM元素(双向指向)
    let preRenderElement = this._renderUnitInstance._currentElement;
    // 使用新的state和props来获取当前复合组件最新的虚拟DOM
    let nextRenderElement = this._componentInstance.render();
    // 判断是否需要深度比较两个虚拟DOM
    if (shouldDeepCompare(preRenderElement, nextRenderElement)) {
      // 调用原复合组件unit对象上的update方法进行更新(复合组件类型没有变化)
      this._renderUnitInstance.update(nextRenderElement);
      // life-cycle componentDidUpdate
      this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();
    } else { // 无需深度对比,完整替换tree
      this._renderUnitInstance = createUnit(nextRenderElement); // 获取新虚拟DOM的unit对象
      let nextMarkUp = this._renderUnitInstance.getMarkUp(); // 获取新对象的字符串
      // 使用新的DOM节点完整替换旧的DOM节点
      $(`[data-reactid="${this._reactId}"]`).replaceWith(nextMarkUp);
    }
  }
  getMarkUp(reactId) {
    // 1.创建当前复合组件实例
    // 2.调用用户定义的componentWillMount方法
    // 3.调用该实例的render方法获取要渲染的React组件.
    // 4.调用组件的getMarkUp方法获取要渲染的真实DOM字符串
    // 5.在document上注册mounted事件,在其中调用用户的componentDidMount
    // this._componentInstance 当前复合组件实例
    // this._renderUnitInstance 当前复合组件render方法返回的react元素的Unit,可以通过其_currentElement获取react组件实例(虚拟DOM).
    this._reactId = reactId;
    let {
      type: Component,
      props
    } = this._currentElement;
    this._componentInstance = new Component(props); //创建复合组件实例
    this._componentInstance._currentUnit = this; // 在复合组件实例上挂载当前Unit实例
    this._componentInstance.componentWillMount && this._componentInstance.componentWillMount(); // 调用用户自定义的生命周期
    let componentElement = this._componentInstance.render(); // 获取要渲染的虚拟DOM
    this._renderUnitInstance = createUnit(componentElement); //获取要渲染的虚拟DOM的Unit实例.
    let renderMarkUp = this._renderUnitInstance.getMarkUp(this._reactId); // 获取unit对应的html字符串
    //注册根节点的mounted事件.用于调用componentDidMount
    $(document).on("mounted", () => {
      this._componentInstance.componentDidMount && this._componentInstance.componentDidMount();
    });
    return renderMarkUp;
  }
}
// 类型一致可进行深度比较
function shouldDeepCompare(preRenderElement, nextRenderElement) {
  return true;
}
export {createUnit};

