/**
 * 事务工具函数,为指定方法前后添加钩子函数,来源于React中setState里patching更新时的事务逻辑
 * @param {Array} wrappers 要注册的事件集合[{initialize,close}]
 */
function Transaction(wrappers = []) {
  this.wrappers = wrappers;
}
// 要在事务上流程中执行的函数
Transaction.prototype.perform = function (func) {
  this.wrappers.forEach(wrapper => {
    wrapper.initialize()
  });
  func.call(); // 调用事务中的函数
  this.wrappers.forEach(wrapper => wrapper.close())
}

// test
let transaction = new Transaction([{
  initialize: () => console.log("initialize 1"),
  close: () => console.log("close 1")
}, {
  initialize: () => console.log("initialize 2"),
  close: () => console.log("close 2")
}, ]);
transaction.perform(testFn.bind(null,1,2,3));

function testFn() {
  console.log("testFN",arguments)
}