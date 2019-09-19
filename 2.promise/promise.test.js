// var Promise = require('./Promise');

let promise = new Promise(function (resolve, reject) {
  // resolve(123);
  // reject(456);
  setTimeout(() => {
    resolve("成功")
    // reject("失败")
  }, 10);
});
console.log("begin");
promise.then(function (value) {
  console.log("success", value);
}, function (reason) {
  console.log("reason", reason);
})