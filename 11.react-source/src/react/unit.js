import $ from 'jquery';
/*
 每个子类都有 
 * getMarkUp(rootId) 返回虚拟 DOM 对应的html 字符串 
 * update(nextElement,par) 组件自身更新方法(setState)
*/

// 工厂父类,用于定义与抽离公共属性和方法
class Unit {
  constructor(element) {
    this._currentElement = element; // 缓存当前 react 组件实例(虚拟 DOM)
    // element的 props 如果应用于 dom 元素则作用于其属性,如果应用于 React 组件则充当起 props.
  }
  getMarkUp(rootId) {
    throw new Error("此方法不能被直接调用!")
  }
}
// 子类:文本元素 对应 string / number 元素
class ReactTextUnit extends Unit {
  getMarkUp(rootId) {
    this._rootId = rootId; // 缓存组件的id
    return `<span data-reactid="${this._rootId}">${this._currentElement}</span>`;
  }
  // 文本节点更新方法,只关注于ele(字符串/数组)有无变化.
  update(nextElement) {
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement;
      $(`[data-reactid="${this._rootId}"]`).html(this._currentElement);
    }
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
    let tagEnd = `</${type}>`;
    let childString = ``; // 存储子组件DOMString 集合
    let renderUnitChildren = []; // 元素children的 unit 集合
    for (const propKey in props) {
      if (!props.hasOwnProperty(propKey)) continue;
      if (/^on[A-Za-z]/.test(propKey)) {
        // 1.处理组件的注册事件
        let eventType = propKey.slice(2).toLowerCase();
        //! 将事件委托到 document上,使用命名空间的方式,便于查找与移除操作.
        $(document).delegate(`[data-reactid="${this._rootId}"]`, `${eventType}.${this._rootId}`, props[propKey]);
      } else if (propKey === 'children') {
        // 2.处理子组件集合(涉及递归处理)
        let children = props.children || [];
        childString = children.map((ele, idx) => {
          let childUnitInstance = createReactUnit(ele); // 根据虚拟 DOM 创建 unit 实例
          renderUnitChildren.push(childUnitInstance);
          // 拼接子节点reactid,自身节点+.+idx
          return childUnitInstance.getMarkUp(`${this._rootId}.${idx}`);
        }).join("");
      } else // 3.处理普通属性
        tagStart += ` ${propKey}=${props[propKey]}`;
    }
    this.renderUnitChildren = renderUnitChildren; // 当前子元素 unit 实例集合
    return tagStart + ">" + childString + tagEnd;
  }
  // DOM 节点更新方法,只关注于属性有无变化.
  update(nextElement) {
    // this._currentElement = nextElement; // 重置 element
    let oldProps = this._currentElement.props; //旧props
    let newProps = nextElement.props; // 新props
    this.updateProperties(oldProps, newProps); // 更新当前 DOM 的属性
    this.updateChildren(newProps.children); //! 更新子元素(children)
  }
  /**
   * 更新子元素 children(对比新旧虚拟 DOM集合)
   * @param {Array} newChildrenElements 新children集合
   */
  updateChildren(newChildrenElements) {
    this.diff(newChildrenElements);
  }
  /**
   * 进行 diff 比较
   * !不考虑属性的增/修/删(需要补丁包)
   * @param {Array} newChildrenElements 
   */
  diff(newChildrenElements) {
    // 构建oldChildrenMap,是为了判断新元素在旧元素中是否存在
    let oldChildrenMap = this.getChildrenMap(this.renderUnitChildren);
    this.getNewChildren(oldChildrenMap, newChildrenElements);
  }
  /**
   * 根据虚拟 DOM 元素集合获取element元素集合(Object)
   * !用于新DOM元素diff
   * @param {Array} children 虚拟 DOM 集合
   */
  getChildrenMap(children = []) {
    let childrenMap = {};
    for (let i = 0; i < children.length; i++) {
      // 获取 unit 对应的React 元素上的 key属性.
      let key = children[i].key || i.toString();
      childrenMap[key] = children[i];
    }
    return childrenMap;
  }
  /**
   * 获取新的虚拟 DOM数组
   * !只考虑元素属性变化,不考虑元素自身的增/删/位移(通过补丁包解决)
   * @param {Object} oldChildrenMap 旧children虚拟 DOM
   * @param {Array} newChildrenElements 新 children 虚拟 DOM
   */
  getNewChildren(oldChildrenMap, newChildrenElements) {
    let newChildren = [];
    // 以新unit集合为基准,进行 merge
    newChildrenElements.forEach((newElement, idx) => {
      let newKey = (newElement.props && newElement.props.key) || idx.toString(); //新元素的 key
      let oldChild = oldChildrenMap[newKey];
      let oldElement = oldChild && oldChild._currentElement;
      // 比较新旧元素(虚拟 DOM)是否一样,如果一样就深度对比
      if (shouldDeepCompare(oldElement, newElement)) {
        oldChild.update(newElement); // 交由子元素进行深度比较
        //如果当前 key 在老的集合中存在,则可以复用旧的 unit
        newChildren[idx] = oldChild;
      } else {
        newChildren[idx] = createReactUnit(newElement);
      }
    });
    return newChildren;
  }
  /**
   * 更新元素的属性
   * @param {object} oldProps 旧 props
   * @param {object} newProps 新 props
   */
  updateProperties(oldProps, newProps) {
    let propKey;
    for (propKey in oldProps) {
      // 如果旧 propKey 中存在 newProps 中不存在,则移除该 props.
      if (!newProps.hasOwnProperty(propKey))
        $(`[data-reactid="${this._rootId}"`).removeAttr(propKey)
      // 删除所有的事件监听(取消委托)
      if (/^on[A-Za-z]/.test(propKey))
        $(document).undelegate('.' + this._rootId); //通过命名空间删除
    }
    // 更新新的属性值
    for (propKey in newProps) {
      if (propKey === 'children') continue;//! children单独处理
      // 重新绑定所有的事件
      if (/^on[A-Za-z]/.test(propKey)) {
        let eventType = propKey.slice(2).toLowerCase();
        $(document).delegate(`[data-reactid="${this._rootId}"]`, `${eventType}.${this._rootId}`, newProps[propKey]);
        continue;
      }
      //! 直接更新对象的属性(直接操作 DOM,改的属性)
      $(`[data-reactid=${this._rootId}]`).prop(propKey, newProps[propKey]);
    }
  }

}
//子类:自定义React组件
class ReactComponsiteUnit extends Unit {
  // this._rootId 组件的 reactId
  // this._currentElement 虚拟DOM对象
  // this._renderedUnitInstance 工厂类实例
  // this._componentInstance 自定义组件类实例 Counter{state,props,handleClick}
  // ! 自定义组件渲染的内容是由其render方法的返回值决定的(虚拟 DOM)
  getMarkUp(rootId) {
    this._rootId = rootId;
    let {
      type: Component, // 获取自定义组件类
      props
    } = this._currentElement;

    // 1.创建自定义组件实例,这里的 props 就是组件所需的 props
    let componentInstance = this._componentInstance = new Component(props);
    //!在组件DOM实例上挂载当前组件的Unit实例(工厂类实例,互相指向),方便进行 domDiff
    this._componentInstance.unit = this;

    // lifeCycle componentWillMount
    componentInstance.componentWillMount && componentInstance.componentWillMount();
    // 2.调用 类组件的 render 方法得到当前组件的虚拟DOM.
    let renderedElement = componentInstance.render();

    // 3.获得当前虚拟 DOM 对应的 unit 工厂实例挂在到_renderedUnitInstance 属性上.
    let renderUnitInstance = this._renderedUnitInstance = createReactUnit(renderedElement);
    // 4.根据虚拟 DOM获取当前组件的 html 字符串
    let renderMarkUp = renderUnitInstance.getMarkUp(this._rootId);
    $(document).on('mounted', () => {
      // lifeCycle componentDidMount
      componentInstance.componentDidMount && componentInstance.componentDidMount();
    })
    return renderMarkUp;
  }
  //! 接收到新的更新,自定义组件传第二个参数，原生和text传第一个参数，因为他们没有状态
  update(nextElement, partialState) {
    // 如果接收了新的元素，就使用最新的nextElement
    this._currentElement = nextElement || this._currentElement;
    // 把新的状态合并到老的实例的状态上,并更新到组件实例的 state 上.
    let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState);
    let nextProps = this._currentElement.props; // 获取新 props.

    // lifeCycle shouldComponentUpdate
    if (this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextProps, nextState))
      return;
    // lifeCycle componentWillUpdate
    this._componentInstance.componentWillUpdate && this._componentInstance.componentWillUpdate(nextProps, nextState);

    let preRenderElement = this._renderedUnitInstance._currentElement; // unit上的虚拟 DOM
    // 根据新的 state和虚拟 DOM 来获取新的element元素
    let nextRenderElement = this._componentInstance.render();
    // 判断是否需要深度对比
    if (shouldDeepCompare(preRenderElement, nextRenderElement)) {
      //! 自身不直接对比,交给子类的 unit 类自行比较(调用子类的 update)
      this._renderedUnitInstance.update(nextRenderElement);
      // lifeCycle componentDidUpdate
      this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();
    } else {
      // 不需要深度对比,删除旧的,重建新的
      //! 根据新的 React 元素创建新的 Instance 实例,并且直接重建新的节点
      this._renderedUnitInstance = createReactUnit(nextRenderElement);
      let nextMarkUp = this._renderedUnitInstance.getMarkUp(this._rootId);
      $(`[data-reactid="${this._rootId}"]`).replaceWith(nextMarkUp);
    }
  }
}
/**
 * 对比新旧虚拟 DOM,判断是否进行深度对比
 * @param {Object} oldElement 旧元素
 * @param {Object} newElement 新元素
 */
function shouldDeepCompare(oldElement, newElement) {
  if (!oldElement || !newElement)
    return false; // 任何一方为空,不用深度比较.
  let oldType = typeof oldElement;
  let newType = typeof newElement;
  if (oldType === "string" || oldType === "number") {
    // 如果 oldType和 newType都是字符串/数字.则进行深度对比.
    return newType === "string" || newType === "number";
  } else {
    // 如果是原生/自定义类型则判断类型是否相同,相同则进行深度对比.
    return newType === "object" && oldElement.type === newElement.type;
  }
}

/**
 * 工厂方法: 根据element 的不同返回不同的组件实例节点,
 * ! 一般来说这些实例都是同一父类的子类.
 * ! 简单工厂模式实现了横向扩展,新增 React 类型处理只需在此添加判断,并创建对应的 Unit子类即可.  
 * @param {any} element React组件实例
 */
function createReactUnit(element) {
  // 类型一: 文本节点
  if (typeof element === "number" || typeof element === "string")
    return new ReactTextUnit(element);
  // 类型二: 原生 DOM 节点
  else if (typeof element === "object" && typeof element.type === "string")
    return new ReactNativeUnit(element);
  // 类型三: React 自定义组件
  else if (typeof element === "object" && typeof element.type === "function")
    return new ReactComponsiteUnit(element);
}

export default createReactUnit;