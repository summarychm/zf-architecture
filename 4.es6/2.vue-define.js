// 针对数组类型,调用继承自Array.prototype的自定义方法,在其中加入钩子函数.AOP
// 也可以将这7种方法直接for循环添加到obj的实例上.
let aryProp = Object.create(Array.prototype);
['pop', 'push', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(method => {
  aryProp[method] = function () {
    update();
    Array.prototype[method].call(this, ...arguments);
  }
});
/**
 * 监控指定对象的set操作,数据更改即触发钩子函数(aop)
 * @param {Object} obj 要监控的对象
 */
function observer(obj) {
  if (typeof obj != "object") {
    return obj;
  }
  if (Array.isArray(obj)) return Object.setPrototypeOf(obj, aryProp);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      defineObjProperty(obj, key, obj[key]);
    }
  }
}
/**
 * 给对象的指定属性添加get/set修饰符(aop钩子)
 * @param {Object} obj 要监测的对象
 * @param {String} key 对象的key
 * @param {Object} value 对象的value
 */
function defineObjProperty(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      //value为object的情况,将value进行监控
      if (typeof value == "object") 
        observer(value);
      return value;
    },
    set(newVal) {
      update(value, newVal);//aop
      value = newVal;
    }
  })
}

// 数据变更的钩子函数
function update(oldVal, newVal) {
  console.log("数据更新啦", "oldVal", oldVal, "newVal", newVal);
}

let obj = { k1: "v1", k2: { o1: "val1", ary: [1, 2, 3] } };
observer(obj);
obj.k2.ary.push(4);
console.log("obj", obj)