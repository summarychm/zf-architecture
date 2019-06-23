
/**
 * 目标: 实现一个早期版本的 React 库
 */
import $ from 'jquery';
import createElement from './element';
import createReactUnit from './unit';
let React = {
  nextRootIndex: 0, // 下一个根节点索引号
  render,
  createElement, // 解析 JSX,返回虚拟 DOM 元素
}

//为了便于扩展,定义了工厂方法,根据传入的 element 类型返回不同的组件实例

function render(element, container) {
  // 根据 element 类型创建不同的组件实例.
  let unitInstance = createReactUnit(element);
  //返回此实例对应的 HTML 片段
  let markUp = unitInstance.getMarkUp(React.nextRootIndex);
  // 将其挂载到指定组件上
  $(container).html(markUp);
  //通知所有订阅 mounted 的组件,当前组件加载完毕.
  // 各组件会在 getMarkUp 事件中订阅'mounted'事件
  $(document).trigger('mounted');

}
export default React;