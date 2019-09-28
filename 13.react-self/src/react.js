import $ from "jquery";
import {Component} from './component';
import {createElement} from './element';
import {createUnit} from './unit';

// 汇总React需要导出的方法
let React = {
  render,
  createElement,
  Component
}

/**
 * 将React元素渲染到界面中
 * @param {any} element 要渲染的React元素.
 * @param {DOMObj} container 要渲染到的DOM节点
 */ 
function render(element, container) {
  let unit = createUnit(element);
  // console.log(unit)
  let markUp = unit.getMarkUp(0);
  $(container).html(markUp);
  $(document).trigger('mounted');
}

export default React;