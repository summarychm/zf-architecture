var Promise = require('./Promise');

let promise = new Promise(function (resolve, reject) {
  throw new Error("错误了")
  resolve(123);
  reject(456);
});
promise.then(function (value) {
  console.log("success", value);
}, function (reason) {
  console.log("reason", reason);
})
