const toProxy = new WeakMap(); // 缓存代理后的对象
const toRaw = new WeakMap(); // 缓存已经被代理的结果,应对重复添加代理的情况.

// 判断是否为对象类型
function isObject(obj) {
  return Object.is(typeof obj, "object") && !Object.is(obj, null);
}
// 代理指定对象
function reactive(target) {
  if (!isObject(target)) return target;

  let observed = toProxy.get(target);
  if (observed) return observed;// 如果当前对象已经被代理,返回被代理对象
  if (toRaw.has(target)) return target;// 如果target是Proxy,直接返回target,不再对其进行二次代理

  const handlers = {
    set(target, key, value, receiver) {
      //只监控对象的私有属性,不监控父类属性(如length)
      if (target.hasOwnProperty(key)) trigger(...arguments);
      return Reflect.set(target, key, value, receiver);
    },
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (isObject(res)) return reactive(res); // 支持对象属性为引用类型的情况
      return res;
    },
    deleteProperty(target, key, receiver) {
      return Reflect.deleteProperty(target, key, receiver);
    },
  };
  observed = new Proxy(target, handlers);
  toProxy.set(target, observed); // 缓存代理后的Proxy
  toRaw.set(observed, target); // 已经代理过的对象,不再进行二次代理.
  return observed;
}
function trigger(...arg) {
  console.log("触发视图更新", arg);
}
module.exports=reactive