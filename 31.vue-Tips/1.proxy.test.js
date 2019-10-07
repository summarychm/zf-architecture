var reactive = require("./1.proxy");

/********** test ***********/
describe("Proxy测试", () => {
  test("planArray", () => {
    let ary = [11, 12, 13];
    var pro = reactive(ary);
    pro[1] = 2;
    expect(ary[1]).toBe(2);
  });
  test("修改复杂引用类型", () => {
    let obj = {
      ary: [11, 22, 33],
      k1: "v2",
      user: {name: "张三", age: 100},
    };
    var p = reactive(obj);
    p = reactive(p);// 测试代理对象再次被代理的情况
    p.ary[0] = "val2";
    expect(p).toEqual(obj)
  });
})
