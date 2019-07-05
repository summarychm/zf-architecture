/**
 * 目标: 实现一个早期版本的 React 库,不分离出ReactDOM
 */
import $ from 'jquery';
import Component from './component';
import createElement from './element';
import createReactUnit from './unit';

let React = {
  nextRootIndex: 0, // 下一个根节点索引号
  render, // 渲染虚拟DOM到真实DOM
  createElement, //创建虚拟 DOM 元素
  Component // React组件父类
}
//将虚拟DOM渲染到真实DOM上
function render(element, container) {
  //为了便于扩展,定义了工厂方法,根据传入的 element 类型返回不同的组件实例
  let unitInstance = createReactUnit(element);
  //返回组件实例对应的 HTML 片段
  let markUp = unitInstance.getMarkUp(React.nextRootIndex);
  // 将html片段挂载到指定DOM元素上
  $(container).html(markUp);
  //! 通知所有订阅 mounted 的组件(各组件会在 getMarkUp 事件中订阅'mounted'事件)
  $(document).trigger('mounted');
}
export default React;