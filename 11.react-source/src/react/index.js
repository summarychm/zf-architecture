/**
 * 目标: 实现一个早期版本的 React 库,不分离出ReactDOM
 */
import $ from 'jquery';
import Component from './component';// ReactElement父类
import {createElement} from './element';//创建虚拟 DOM 实例
import createReactUnit from './unit'; // 简单工厂类实例
 
let React = {
  nextRootIndex: 0, // 下一个根节点索引号
  render, // 渲染虚拟DOM到真实DOM
  createElement, 
  Component 
}
 
// render -> createReactUnit -> ReactXXXUnit -> getMarkup(string)
//将虚拟DOM挂载到真实DOM上
function render(element, container) {
  // 为了便于扩展,定义了工厂方法,根据传入的 element 类型返回不同的组件实例
  let unitInstance = createReactUnit(element); 
  // 返回组件实例对应的 HTML 片段
  let markUp = unitInstance.getHtmlString(React.nextRootIndex);
  // 将html片段挂载到指定DOM元素上
  $(container).html(markUp);
  //! 通知所有订阅 mounted 的组件,html已经追加到DOM中(各组件会订阅'mounted'事件,注册componentDidMount事件)
  $(document).trigger('mounted');
}
export default React;