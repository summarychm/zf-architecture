// 疑问
// let lastIndex = 0; //! 记录上一个已经确定位置的索引. 怎么比较,记录,更新,发挥作用的

// tips
// 把各种需要用到的数据全部缓存在this上
// update全部是由自定义组件的staState引起的
// domDiff的补丁包是用于描述同级children元素的位置变化的
// 整颗treeDiff完成后就可以直接打补丁了
// setState 是计算前后state差异,时机不同调用不同的

// 私有属性
// Unit 实例私有属性(this指向unit实例)
// this._reactId 元素reactId(含层级结构)
// this._currentElement 当前虚拟DOM元素实例
// this._renderedChildrenUnits 当前元素children的unit实例集合
// this._componentInstance 复合组件Component实例,并将当前unit存入_currentUnit属性(双向指向)
// this._renderedUnitInstance 复合元素render返回值(虚拟DOM)对应的unit类实例

import $ from 'jquery';
import {ReactElement} from "./element";
import types from './types';

let diffQueue = [];// 差异队列(先比较,比较完成后才更新)
let updateDepth = 0; // 更新级别

// 工厂父类,用于定义与抽离公共属性和方法,每个子类都有 
// getHtmlString(reactId) 返回虚拟 DOM 对应的html 字符串 
// update(nextElement,par) 组件自身更新方法(setState)
class Unit {
  constructor(element) {
    this._currentElement = element; // 缓存当前组件的虚拟DOM实例
    // element的 props 如果应用于 dom 元素则作用于其属性,如果应用于自定义组件则充当起 props.
  }
  getHtmlString(reactId) { // 组件最终要挂载到页面的html字符串
    throw new Error("此方法不能被直接调用!")
  }
}
// 子类:文本元素 对应 string / number 元素
class TextUnit extends Unit {
  getHtmlString(reactId) {
    this._reactId = reactId; // 缓存组件的react-id
    return `<span data-reactid="${this._reactId}">${this._currentElement}</span>`;
  }
  /** 文本节点更新:只需对比新旧内容是否一致
   * 原生DOM和文本组件只传递第一个参数，因为他们没有state
   * @param {Object} nextReactElement 新的虚拟DOM
   * @param {Object} partialState 部分更新的的state
   */
  update(nextElement) {
    // 判断新旧两个文本是否一致,不一致则更新
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement;
      $(`[data-reactid="${this._reactId}"]`).html(this._currentElement);
    }
  }
}

// 子类:原生 DOM 元素
class NativeUnit extends Unit {
  // 将虚拟DOM语法转为 html 字符串
  getHtmlString(reactId) {
    this._reactId = reactId;
    const {type, props} = this._currentElement;//结构出type和props属性
    let tagStart = `<${type} data-reactid="${this._reactId}"`;
    let tagEnd = `</${type}>`;
    let childString = ``; // 存储子组件DOMString 集合
    this._renderedChildrenUnits = []; // children元素unit集合,用于setState时复用旧Unit元素
    for (const propKey in props) {
      if (!props.hasOwnProperty(propKey)) continue;
      // 1.处理组件的注册事件
      if (/^on[A-Za-z]/.test(propKey)) {
        let eventType = propKey.slice(2).toLowerCase();
        //! 将事件委托到 document上,使用命名空间的方式,便于查找与移除操作.
        $(document).delegate(`[data-reactid="${this._reactId}"]`, `${eventType}.${this._reactId}`, props[propKey]);

      } else if (propKey === "className") {// 2.处理特殊的className属性
        tagStart += " class=" + props[propKey];
      } else if (propKey === "style") {// 3.处理特殊的style属性
        let styleStr = "";
        for (const [attr, value] of Object.entries(props[propKey])) {
          // 将驼峰写法改为"-"相连
          styleStr += `${attr.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${value};`
        }
        tagStart += ` style="${styleStr}"`;
      } else if (propKey === 'children') {// 4.递归处理下属子组件集合
        let children = props.children || [];
        childString = children.map((ele, idx) => {
          let childUnitInstance = createReactUnit(ele); // 根据虚拟 DOM 创建 unit 实例
          childUnitInstance._mountIndex = idx;//! 子元素的挂载索引,用来表明当前元素在父节点中的索引位置
          this._renderedChildrenUnits.push(childUnitInstance);
          // 子节点reactid= 自身节点+.+idx
          return childUnitInstance.getHtmlString(`${this._reactId}.${idx}`);
        }).join("");
      } else // 5.处理普通DOM属性
        tagStart += ` ${propKey}=${props[propKey]}`;
    }
    return tagStart + ">" + childString + tagEnd;
  }
  /** 虚拟DOM更新:只关注自身及其子元素属性有无变化.
   * 原生DOM和文本组件只传递第一个参数，因为他们没有state
   * @param {Object} nextReactElement 新的虚拟DOM
   * @param {Object} partialState 部分更新的的state
   */
  update(nextElement) {
    console.log(nextElement)
    // this._currentElement = nextElement; // 重置 element
    let oldProps = this._currentElement.props; //旧props
    let newProps = nextElement.props; // 新props
    this.updateDOMProperties(oldProps, newProps); // 更新当前 DOM 的属性
    this.updateChildren(newProps.children); //! 递归更新children,并制作补丁包
  }
  /** 更新子元素 children(对比新旧虚拟 DOM集合)
   * @param {Array} newChildrenElements 新children集合
   */
  updateChildren(newChildrenElements) {
    updateDepth++; // 更新diff层级
    this.diff(newChildrenElements);
    console.log(diffQueue);
    updateDepth--;
    if (updateDepth === 0) {
      console.log("应用补丁包")
      this.patch(diffQueue);//应用补丁包
      diffQueue = [];//清空补丁包
    }
  }
  //! 根据补丁包打补丁应用更新
  patch(diffQueue) {
    let deleteChildren = [],//存放要删除的节点
      deleteMap = {};//存放待删除DOM节点集合(用于move补丁时可以复用该DOM节点)
    // 1.应用move/remove补丁(删除DOM元素).
    for (let i = 0; i < diffQueue.length; i++) {
      const difference = diffQueue[i];// 获取差异
      // 1.1 依据move/remove补丁包,将要删除的元素缓存到集合中
      if (difference.type === types.MOVE || difference.type === types.REMOVE) {
        let fromIndex = difference.fromIndex;
        let oldChild = $(difference.parentNode.children().get(fromIndex));
        deleteMap[fromIndex] = oldChild;
        deleteChildren.push(oldChild);
      }
    }
    // 1.2 将待删除dom节点从真实domTree中删除.
    $.each(deleteChildren, (idx, item) => $(item).remove());

    //2. 应用insert/move补丁,move时复用旧的DOM节点,insert时重新创建dom节点
    for (let i = 0; i < diffQueue.length; i++) {
      const difference = diffQueue[i];
      switch (difference.type) {
        case types.INSERT://2.1 创建新的DOM节点,并将其追加到children的指定索引位置
          this.insertChildAt(difference.parentNode, difference.toIndex, difference.getHtmlString);
          break;
        case types.MOVE: //2.2 从已删除集合中取出DOM元素,追加到新索引位置
          let node = deleteMap[difference.fromIndex];
          this.insertChildAt(difference.parentNode, difference.toIndex, node);
          break;
        default:
          break;
      }
    }
  }
  // 将html插入到指定索引
  insertChildAt(parentNode, index, htmlString) {
    let newNode = $(htmlString);// 将htmlStr转为node对象
    // 看指定索引位置上是否有元素.如果有则插入到当前元素之前,如果没有则追加到父元素下.
    let oldChild = parentNode.children().get(index);
    oldChild ? newNode.insertBefore(oldChild) : newNode.appendTo(parentNode);
  }
  /** 记录同级元素数组的elementDiff情况,制作补丁包(inster/move/remove)
   * @param {Array} newChildrenElements 
   */
  diff(newChildrenElements) {
    //1. 构建oldChildrenUnit集合,用于判断新虚拟DOM能否继续使用旧元素的unit实例
    let oldChildrenUnitMap = this.getChildrenUnitMap(this._renderedChildrenUnits);
    //2. 获取newChildren对应的Unit集合(尽量复用旧元素的unit),并更新DOM
    let {newChildrenUnits, newChildrenUnitMap} = this.getNewChildrenUnits(oldChildrenUnitMap, newChildrenElements);
    //!3. 记录上一个已经确定位置的索引. 
    let lastIndex = 0;
    let $ReactDOM = $(`[data-reactid="${this._reactId}"]`); // 记录父节点DOM对象
    //4. 遍历newChildrenUnits集合,记录elementDiff变化(inster,move)
    for (let i = 0; i < newChildrenUnits.length; i++) {
      const newUnit = newChildrenUnits[i];
      let newKey = (newUnit._currentElement.props && newUnit._currentElement.props.key) || i.toString();
      let oldUnit = oldChildrenUnitMap[newKey];

      if (oldUnit === newUnit) {//!4.1 新unit在旧unit中存在(move补丁)
        //4.1.1 如果挂载点索引小于lastIndex则向后位移到i(move补丁)
        if (oldUnit._mountIndex < lastIndex) {
          diffQueue.push({ // move补丁
            type: types.MOVE,
            parentId: this._reactId,
            parentNode: $ReactDOM,
            fromIndex: oldUnit._mountIndex,
            toIndex: i,
          });
        }
        // 更新lastIndex为mountIndex和lastIndex的较大值
        lastIndex = Math.max(lastIndex, oldUnit._mountIndex);
      } else { //!4.2 newUnit在oldUnit中不存在(inster补丁)
        if (oldUnit) { //4.2.1 应对新旧unit的类型不一致的情况 
          diffQueue.push({ // remove补丁
            type: types.REMOVE,
            parentId: this._reactId,
            parentNode: $ReactDOM,
            fromIndex: oldUnit._mountIndex,
          });
          $(document).undelegate(`.${oldUnit._reactId}`);// 取消待删除DOM节点的事件委托
        }
        diffQueue.push({ //4.2.2 insert补丁
          type: types.INSERT,
          parentId: this._reactId,
          parentNode: $ReactDOM,
          fromIndex: lastIndex,
          toIndex: i,
          getHtmlString: newUnit.getHtmlString(`${this._reactId}.{i}`)
        });
      }
      newUnit._mountIndex = i; // 更新newUnit的挂载点位置
    }
    //5. 遍历oldChildrenUnits集合,记录elementDiff变化(remove)
    for (const oldKey in oldChildrenUnitMap) {
      let oldChild = oldChildrenUnitMap[oldKey];
      //5.1 如果新集合中不存在旧unit,则添加remove补丁
      if (!newChildrenUnitMap.hasOwnProperty(oldKey)) {
        diffQueue.push({ //remove补丁
          type: types.REMOVE,
          parentId: this._reactId,
          parentNode: $ReactDOM,
          fromIndex: oldChild._mountIndex,
        })
      }
    }
  }
  /** 根据虚拟 DOM 元素集合获取element元素集合(Object)
   * !用于新DOM元素diff
   * @param {Array} children 虚拟 DOM 集合
   */
  getChildrenUnitMap(childrenUnitAry = []) {
    let childrenUnitMap = {};
    for (let i = 0; i < childrenUnitAry.length; i++) {
      //! 获取unit对应的虚拟DOM上的key属性
      let unit = childrenUnitAry[i];
      let key = (unit._currentElement.props && unit._currentElement.props.key) || i.toString();
      childrenUnitMap[key] = unit;
    }
    return childrenUnitMap;
  }
  /** 获取新的虚拟DOM数组(不记录key)和虚拟DOMMap(记录key),并更新DOM
   * !只考虑元素属性变化,不考虑元素自身的增/删/位移(通过补丁包解决)
   * @param {Object} oldChildrenUnitMap 旧children虚拟 DOM
   * @param {Array} newChildrenElementAry 新children 虚拟 DOM
   */
  getNewChildrenUnits(oldChildrenUnitMap, newChildrenElementAry) {
    let newChildrenUnits = []; // 记录childrenUnit数组(不保留key)
    let newChildrenUnitMap = {};// 记录childrenUnitMap(保留原始key)
    //* 以新虚拟domAry为基准,获取新虚拟dom的Unit集合
    newChildrenElementAry.forEach((newElement, idx) => {
      //1. 获取新虚拟DOM的key
      let newKey = (newElement.props && newElement.props.key) || idx.toString();
      //2. 根据newKey尝试从老Unit集合中获取unit实例
      let oldChild = oldChildrenUnitMap[newKey];
      //3. 如果找到unit实例的话,获取挂载在其上的旧虚拟DOM
      let oldElement = oldChild && oldChild._currentElement;
      //4. 比较新旧虚拟DOM,看是否需深度对比
      if (shouldDeepCompare(oldElement, newElement)) {
        //!4.1 交由子元素进行深度比较更新(可能递归)
        oldChild.update(newElement);
        //4.2 复用旧的unit实例
        newChildrenUnits.push(oldChild);
        newChildrenUnitMap[newKey] = oldChild;
      } else {
        //5. 无需深度对比,构建新的unit对象
        //5.1 构建新的unit对象
        let newUnit = createReactUnit(newElement);
        newChildrenUnits.push(newUnit);
        newChildrenUnitMap[newKey] = newUnit;
      }
    });
    return {newChildrenUnits, newChildrenUnitMap};
  }
  /** 对比新旧props更新真实DOM的属性
   * @param {object} oldProps 旧 props
   * @param {object} newProps 新 props
   */
  updateDOMProperties(oldProps, newProps) {
    let propKey,
      $ReactDOM = $(`[data-reactid="${this._reactId}"]`);//虚拟DOM对应的真实的DOM节点
    // 1.循环oldProps集合,清理差异,清除事件绑定
    for (propKey in oldProps) {
      // 1.1 删除newProps中存在而oldProps中不存在的DOM属性
      if (!newProps.hasOwnProperty(propKey)) $ReactDOM.removeAttr(propKey)
      // 1.2 删除所有的事件监听(取消委托,通过命名空间删除)
      if (/^on[A-Za-z]/.test(propKey)) $(document).undelegate('.' + this._reactId);
    }
    // 2.循环newProps集合,更新DOM属性,重新绑定DOM事件
    for (propKey in newProps) {
      if (propKey === 'children') continue;//2.1 children较为复杂,单独处理
      else if (/^on[A-Za-z]/.test(propKey)) {//2.2 重新绑定的DOM事件
        let eventType = propKey.slice(2).toLowerCase();
        $(document).delegate(`[data-reactid="${this._reactId}"]`, `${eventType}.${this._reactId}`, newProps[propKey]);
        continue;
      }
      else if (propKey === "className")//2.3 处理class
        $ReactDOM.attr('class', newProps[propKey]);
      else if (propKey === "style") {//2.4 处理style
        for (const [attr, value] of Object.entries(newProps[propKey])) {
          $ReactDOM.css(attr, value);
        }
      } else //2.5 更新DOM对象的常规属性
        $ReactDOM.prop(propKey, newProps[propKey]);
    }
  }
}
// 子类:自定义React组件
// 例如: React.createElement(Counter, { name: "计数器" });
class ComponsiteUnit extends Unit {
  // ! 自定义组件渲染内容是由其render()返回的虚拟DOM决定的
  getHtmlString(reactId) {
    this._reactId = reactId;
    let {type: Component, props} = this._currentElement;
    // 1.创建自定义组件实例,这里的 props 就是组件所需的 props
    this._componentInstance = new Component(props);
    //! 1.1 在组件DOM实例上挂载当前组件的Unit实例(工厂类实例,双向指向),方便进行 domDiff
    this._componentInstance._currentUnit = this;
    // 1.2 lifeCycle componentWillMount
    this._componentInstance.componentWillMount && this._componentInstance.componentWillMount();

    // 2.调用组件的 render方法,获取要渲染的虚拟DOM元素
    let renderElement = this._componentInstance.render();
    // 3.获得当前虚拟DOM对应的unit工厂实例并挂载到this._renderedUnitInstance 属性上.
    let renderUnitInstance = this._renderedUnitInstance = createReactUnit(renderElement);
    // 4.通过unit获取该虚拟DOM的htlml字符串
    let renderMarkUp = renderUnitInstance.getHtmlString(this._reactId);
    // 5.注册在html追加到页面时的钩子函数(在React.render函数中),在其中执行生命周期
    $(document).on('mounted', () => {
      //5.1 lifeCycle componentDidMount
      this._componentInstance.componentDidMount && this._componentInstance.componentDidMount();
    })
    return renderMarkUp;
  }

  /** 自定义组件更新
   * 原生DOM和文本组件只传递第一个参数，因为他们没有state
   * 自定义类一般只传第二个参数,有时也会传递第一个参数
   * @param {Object} nextReactElement 新的虚拟DOM
   * @param {Object} partialState 部分更新的的state
   */
  update(nextReactElement, partialState) {
    //1. 如果接收了新的元素，就使用新的element否则用旧的
    this._currentElement = nextReactElement || this._currentElement;
    //2. 把要更新的state合并到this.state上
    let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState);
    let nextProps = this._currentElement.props; // 获取新 props.
    //3. lifeCycle shouldComponentUpdate
    if (this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextProps, nextState))
      return;
    //4. lifeCycle componentWillUpdate
    this._componentInstance.componentWillUpdate && this._componentInstance.componentWillUpdate(nextProps, nextState);

    //! 下面要进行比较更新
    //5. 获取上次render返回的虚拟DOM
    let oldRenderVirtualDOM = this._renderedUnitInstance._currentElement;
    //6. 根据新的state和props获取新的虚拟DOM
    let newRenderVirtualDOM = this._componentInstance.render();
    //7. 对比新旧两个虚拟DOM对象看是否需要深度对比
    //7.1 需要深度对比
    if (shouldDeepCompare(oldRenderVirtualDOM, newRenderVirtualDOM)) {
      //7.1.1 自身不对比,交由render的unit实例自行比较,最终会由文本/原生DOM的Unit进行diff-update
      this._renderedUnitInstance.update(newRenderVirtualDOM);
      //7.1.2 lifeCycle componentDidUpdate 更新完成
      this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();
    } else { //7.2 不需要深度对比,直接删除重建
      //7.2.1 根据新虚拟DOM创建新Unit实例,并更新this._renderedUnitInstance
      this._renderedUnitInstance = createReactUnit(newRenderVirtualDOM);
      //7.2.2 返回新Unit实例对应的html字符串
      let newHtmlString = this._renderedUnitInstance.getHtmlString(this._reactId);
      //7.2.3 用新的html字符串替换原有的html字符串
      $(`[data-reactid="${this._reactId}"]`).replaceWith(newHtmlString);
    }
  }
}

/** 对比2个虚拟DOM元素,判断是否需要深度对比(类型是否一致)
 * @param {Object} oldElement 旧虚拟DOM
 * @param {Object} newElement 新虚拟DOM
 */
function shouldDeepCompare(oldElement, newElement) {
  // 任何一方为空,不用深比较.
  if (!oldElement || !newElement) return false;
  let oldType = typeof oldElement;
  let newType = typeof newElement;
  // 如果是文本/数组类型,进行深比较.
  if ((oldType === "string" || oldType === "number") && (newType === "string" || newType === "number"))
    return true;
  // 如果是原生/自定义类型则判断类型是否相同,相同则进行深比较.
  else if (oldElement instanceof ReactElement && newElement instanceof ReactElement)
    return oldElement.type === newElement.type;
  return false;
}

/** 根据element类型返回不同的组件实例
 * ! 一般来说产生的实例都是同一父类的子类.
 * ! 简单工厂模式实现了横向扩展,新增 React 类型处理只需在此添加判断,并创建对应的 Unit子类即可.  
 * @param {any} element React组件实例
 */
function createReactUnit(element) {
  // 类型一: 文本节点
  if (typeof element === "number" || typeof element === "string")
    return new TextUnit(element);
  // 类型二: 原生 DOM 节点
  // else if (typeof element === "object" && typeof element.type === "string")
  else if (element instanceof ReactElement && typeof element.type === "string")
    return new NativeUnit(element);
  // 类型三: React 自定义组件(自定义组件也就是class,其type为function)
  else if (element instanceof ReactElement && typeof element.type === "function")
    return new ComponsiteUnit(element);
  else
    console.error("没有找到对应的子类!")
}

export default createReactUnit;