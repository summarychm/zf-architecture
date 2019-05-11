function deepClone(obj,hash=new WeakMap()) {
  if(obj==null) return obj;//处理undefined和null
  if (obj instanceof RegExp) return new RegExp(obj);// 处理正则
  if (obj instanceof Date) return new Date(obj); // 处理时间
  if (typeof obj != "object") return obj; //处理其他类型
  if(hash.has(obj)) return hash.get(obj); // 存入需要对比的hash中
  var instance = new obj.constructor();
  hash.set(obj,instance);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 递归拷贝
      instance[key] = deepClone(obj[key],hash);
    }
  }
  return instance;
}
var obj1 = { a: "a1", b: { b1: "bb1", time: Date.now(), reg: /\d+/g,null:null } };
obj1.c=obj1;
var obj2 = deepClone(obj1);
obj2.b.b1 = "v1";
console.log("obj1", obj1)
console.log("obj2", obj2)