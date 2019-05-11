// Proxy版数据监控
// 支持添加新的属性,支持数组类型监控
let handle = {
  get(target, key) {
    if (typeof target[key] == 'object')
      return new Proxy(target[key], handle);
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    update(target[key], value);
    return Reflect.set(target, key, value);
  }
}
// 数据变更的钩子函数
function update(oldVal, newVal) {
  console.log("数据更新啦", "oldVal", oldVal, "newVal", newVal);
}

let obj = { k1: "v1", k2: { o1: "val1", ary: [1, 2, 3] } };
let objProxy = new Proxy(obj, handle);
objProxy.k2.ary.push("44");
console.log("obj", obj)