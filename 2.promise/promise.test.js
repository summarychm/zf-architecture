console.log("-- begin");
var Promise = require('./src/index2');
debugger  
var promise1 = new Promise((resolve, reject) => {
  resolve(5);
});
debugger
promise1.then(data => {
  console.log("-- then data", data);
}, e => {
  console.error("错误信息", e);
});

console.log("-- end");



// var fs = require("fs");
// function read(url) {
//   let dfd = Promise.deferred();
//   fs.readFile(url, "utf8", (err, data) => {
//     if (err) dfd.reject(err);
//     dfd.resolve(data);
//   });
//   return dfd.promise;
// }

// read("./step1.txt").then(data => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve(300)
//         }, 0);
//       }));
//     }, 0);
//   });
// }, function (e) {
//   console.log("err1", e)
// }).then().then(data => {
//   console.log("data3", data)
// }, function (e) {
//   console.log("err3", e)
// });
