"use strict";
/**
 * 检索class的调用方式是否合法,当前this是否是当前构造函数的实例.
 * @param {Object} instance 实例
 * @param {Object} Constructor 构造函数
 */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) throw new TypeError("不能将类作为函数调用!");
}
/**
 * 分别将对象的静态属性和公共方法追加到类上
 * @param {Object} Constructor 构造函数
 * @param {Object} protoProps 公共属性
 * @param {Object} staticProps 静态属性
 */
function _createClass(Constructor, protoProps, staticProps) {
  if (staticProps) _defineProperties(Constructor, staticProps); // 将静态属性追加到构造函数上
  if (protoProps) _defineProperties(Constructor.prototype, protoProps); //将公共方法追加到原型上
  return Constructor; // 将添加了静态属性和公共方法的class返回
}
/**
 * 根据属性描述符,定义对象的属性
 * @param {Object} target 要追加到的对象
 * @param {Object} props 需要追加的属性集合
 */
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]; // 要追加的属性
    descriptor.enumerable = descriptor.enumerable || false; //是否可枚举
    descriptor.configurable = true; // 可配置
    if ("value" in descriptor) descriptor.writable = true; //可写
    // 根据属性描述符,将属性追加到对象上
    // descriptor包含 enumerable/configurable/writable/value 4个主要描述符
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

// 创建一个立即执行函数,在其中创建Animal实例并返回
var Animal = function () {
  // 第二步: 分别定义Animal的静态属性与方法
  _createClass(Animal, null, [{
    key: "a",
    value: function a() {
      return 1;
    }
  }]);
  function Animal(type) {
    // 第一步:检测Animal的调用方式是否合法
    _classCallCheck(this, Animal);
    this.type = type;
  }
  // 第二步: 分别定义Animal的静态属性与方法
  _createClass(Animal, [{
    key: "say",
    value: function say() {
      console.log('说话', this);
    }
  }]);
  return Animal;
}();
var animal = new Animal('哺乳类');
console.log(Animal.a());