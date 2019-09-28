/**
 * 判断当前变量是否是指定类型(普通的高阶函数)
 * @param {String} type 要判断的数据类型
 * 调用示例: isType("Array")([])
 */
function isType(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj).includes(type);
  }
}
// 改进,对高阶函数再包装一层,不用每次填写type,这样可以减少因拼写导致的出错的几率
const types = {}; // 将所有包装后的检测函数都放到这个对象中
const typeAry = ["Boolean", "Null", "Undefined", "Number", "String", "Symbol", "Array", "Object"];
typeAry.forEach(type => {
  types[`is${type}`] = isType(type);
});
console.log(types.isBoolean(true))
console.log(types.isArray([]))