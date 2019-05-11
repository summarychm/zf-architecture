/**
 * 判断当前变量是否是指定类型(高阶函数)
 * @param {String} type 要判断的数据类型
 */
function isType(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj).includes(type);
  }
}
// console.log(isType("Array")([])) //传统的高阶函数调用
const types = {}; // 将所有包装后的检测函数都放到这个对象中
["Boolean", "Null", "Undefined", "Number", "String", "Symbol", "Array", "Object"].forEach(type => {
  types[`is${type}`] = isType(type);
});
// 新版高阶函数调用
// 这样可以减少因拼写导致的出错的几率
console.log(types.isBoolean(true))
console.log(types.isArray([]))